#!/usr/bin/env node
// Researches each broken URL with its own agent, a few at a time.
//
// Each researcher gets one URL and the docs lines that use it. It has only the
// web tools, so it can neither read nor edit files, and it returns a result
// that prompts/research.schema.json describes. apply-research.mjs then makes
// the edits. Internal links skip research, because the web cannot say why a
// Spectro Cloud page went away.
//
// Usage: node research-links.mjs <link_report.json> <repo-dir> <out-dir>
// Env: ANTHROPIC_API_KEY, MODEL, RESEARCH_TOOLS, RESEARCH_BUDGET_USD, AGENT_DIR.
// Writes <out-dir>/research.json, a research-<n>.jsonl transcript per URL, and
// research-run.json with the runs' summed turns and cost.
// Exit 1 when a researcher ran with tools other than RESEARCH_TOOLS.

import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { hasExactTools, parseRun } from "./agent-run.mjs";
import { isMain } from "./lib/cli.mjs";
import { git } from "./lib/run.mjs";
import { URL_PATTERN, fragmentOf, urlKey } from "./lib/urls.mjs";

const INTERNAL_HOSTS = new Set(["docs.spectrocloud.com"]);
const OUTCOMES = new Set(["replace", "update-guidance", "no-change", "skip-pattern", "error"]);
const CONCURRENCY = 3;
const MAX_USAGE_TEXT = 300;

/** Groups the report's entries by URL, compared the way linkinator normalizes them. */
export function groupReport(report) {
  const groups = new Map();
  for (const entry of report) {
    const url = urlKey(entry.url);
    const group = groups.get(url) ?? { url, statuses: new Set() };
    group.statuses.add(entry.status);
    groups.set(url, group);
  }
  return [...groups.values()].map((group) => ({ ...group, statuses: [...group.statuses] }));
}

/** True for links to Spectro Cloud's own docs, which a person handles. */
export function isInternal(url) {
  try {
    return INTERNAL_HOSTS.has(new URL(url).host);
  } catch {
    return false;
  }
}

/**
 * Finds every docs line that links to `url`, with the #fragment that the line's link uses, or an empty string.
 * A line that links to two sections of the page is listed once for each. `files` holds each docs file's path and text.
 */
export function findUsages(files, url) {
  const usages = [];
  for (const { path: file, text } of files) {
    text.split("\n").forEach((line, index) => {
      const links = (line.match(URL_PATTERN) ?? []).filter((found) => urlKey(found) === url);
      for (const fragment of new Set(links.map(fragmentOf))) {
        usages.push({ file, line: index + 1, fragment, text: line.trim().slice(0, MAX_USAGE_TEXT) });
      }
    });
  }
  return usages;
}

/** Returns the distinct sections that the usages link to, in order, without the links that have no fragment. */
export function usageFragments(usages) {
  return [...new Set(usages.map((usage) => usage.fragment).filter(Boolean))];
}

/** Builds the researcher's prompt. Docs lines are quoted, because they are data. */
export function researchPrompt({ url, statuses, usages }) {
  const lines = [...new Set(usages.map((u) => `- ${u.file}:${u.line}: ${u.text}`))].join("\n");
  const fragments = usageFragments(usages)
    .map((fragment) => `- #${fragment}`)
    .join("\n");
  return [
    `Broken URL: ${url}`,
    `Status in the weekly report: ${statuses.join(", ")}`,
    "",
    "Docs lines that use it:",
    lines || "- (none found)",
    "",
    "Sections the docs link to:",
    fragments || "- (none)",
  ].join("\n");
}

/** True when a URL is a single http(s) URL that the docs' URL pattern reads whole. */
export function isCleanUrl(url) {
  return /^https?:\/\//.test(url) && url.match(URL_PATTERN)?.[0] === url;
}

/** True when the replacement has no fragment, and it is one clean URL both alone and with each anchor. */
function writesCleanUrls({ replacement, fragments }) {
  const anchors = fragments.map(({ to }) => to).filter(Boolean);
  return (
    ![replacement, ...anchors].some((text) => text.includes("#")) &&
    [replacement, ...anchors.map((to) => `${replacement}#${to}`)].every(isCleanUrl)
  );
}

/**
 * True when a researcher's result follows the schema and its outcome has what it needs. A replace or an
 * update-guidance must map each of `fragments`, the sections that the docs link to.
 */
export function isValidResearch(result, fragments) {
  const strings = ["outcome", "replacement", "evidence", "guidance", "skipPattern", "notes"];
  const lists = ["sources", "attempts"];
  if (!result || typeof result !== "object") return false;
  if (!strings.every((key) => typeof result[key] === "string")) return false;
  if (!lists.every((key) => Array.isArray(result[key]) && result[key].every((item) => typeof item === "string"))) {
    return false;
  }
  const isMapping = (item) => typeof item?.from === "string" && typeof item.to === "string";
  if (!Array.isArray(result.fragments) || !result.fragments.every(isMapping)) return false;
  if (!OUTCOMES.has(result.outcome)) return false;
  if (result.replacement && !writesCleanUrls(result)) return false;
  const mapped = new Set(result.fragments.map(({ from }) => from));
  if (["replace", "update-guidance"].includes(result.outcome) && !fragments.every((f) => mapped.has(f))) return false;
  if (result.outcome === "replace") return Boolean(result.replacement);
  if (result.outcome === "update-guidance") return Boolean(result.guidance) && result.sources.length > 0;
  if (result.outcome === "skip-pattern") return Boolean(result.skipPattern);
  return true;
}

/** A result for a URL that the agents did not settle. */
export function unresolved(outcome, notes) {
  return {
    outcome,
    replacement: "",
    fragments: [],
    evidence: "",
    guidance: "",
    sources: [],
    skipPattern: "",
    attempts: [],
    notes,
  };
}

/** Adds up the turns, cost, and time of the researchers' runs. */
export function summarizeRuns(runs) {
  return {
    num_turns: runs.reduce((sum, run) => sum + (run.num_turns ?? 0), 0),
    total_cost_usd: runs.reduce((sum, run) => sum + (run.total_cost_usd ?? 0), 0),
    duration_ms: runs.reduce((sum, run) => sum + (run.duration_ms ?? 0), 0),
  };
}

/**
 * Researches every group. `runAgent(prompt, index)` runs one researcher and
 * returns its parsed output ({ init, result }). Throws when a researcher had
 * tools other than `tools`, because that run cannot be trusted.
 */
export async function researchAll(groups, { usagesFor, runAgent, tools, concurrency = CONCURRENCY }) {
  const entries = groups.map((group) => ({ ...group, usages: usagesFor(group.url) }));
  const runs = [];
  let next = 0;
  // Set when a researcher fails the tool check, so no worker starts another one.
  let stopped = false;

  async function worker() {
    while (!stopped && next < entries.length) {
      const index = next++;
      const entry = entries[index];
      if (isInternal(entry.url)) {
        entry.result = unresolved("needs-human", "An internal link. Its page or pack was most likely retired.");
        continue;
      }
      let output;
      try {
        output = await runAgent(researchPrompt(entry), index);
      } catch (error) {
        entry.result = unresolved("error", `The researcher failed: ${error.message}`);
        continue;
      }
      if (!hasExactTools(output.init, tools)) {
        stopped = true;
        throw new Error(`Researcher ${index} ran with tools other than ${tools}.`);
      }
      runs.push(output.result);
      const result = output.result.structured_output;
      entry.result = isValidResearch(result, usageFragments(entry.usages))
        ? result
        : unresolved("error", "The researcher returned no valid result.");
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, entries.length) }, worker));
  return { entries, runs };
}

// Command line.

function readDocsFiles(repo) {
  return git(repo, "ls-files", "docs", "_partials")
    .split("\n")
    .filter((file) => /\.mdx?$/.test(file) && !file.startsWith("docs/deprecated/"))
    .map((file) => ({ path: file, text: fs.readFileSync(path.join(repo, file), "utf8") }));
}

/** Runs one researcher in an empty folder, with only the web tools, and saves its transcript. */
function researcher(outDir) {
  const { MODEL, RESEARCH_TOOLS, RESEARCH_BUDGET_USD, AGENT_DIR } = process.env;
  const schema = fs.readFileSync(path.join(AGENT_DIR, "prompts", "research.schema.json"), "utf8");
  const instructions = path.resolve(AGENT_DIR, "prompts", "research.md");
  return (prompt, index) =>
    new Promise((resolve, reject) => {
      const args = [
        "-p",
        prompt,
        "--model",
        MODEL,
        "--setting-sources",
        "project",
        "--strict-mcp-config",
        "--tools",
        RESEARCH_TOOLS,
        "--allowedTools",
        ...RESEARCH_TOOLS.split(","),
        "--disallowedTools",
        "Bash",
        "--append-system-prompt-file",
        instructions,
        "--json-schema",
        schema,
        "--max-budget-usd",
        RESEARCH_BUDGET_USD,
        "--output-format",
        "stream-json",
        "--verbose",
        "--no-session-persistence",
      ];
      // An empty folder, so the researcher has no repo around it at all.
      const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "researcher-"));
      const child = spawn("claude", args, { cwd, stdio: ["ignore", "pipe", "inherit"] });
      let output = "";
      child.stdout.on("data", (chunk) => (output += chunk));
      child.on("error", reject);
      child.on("close", (code) => {
        fs.writeFileSync(path.join(outDir, `research-${index}.jsonl`), output);
        fs.rmSync(cwd, { recursive: true, force: true });
        try {
          resolve(parseRun(output));
        } catch {
          reject(new Error(`exit ${code} with no readable output`));
        }
      });
    });
}

async function main([reportPath, repoArg, outDir]) {
  const repo = path.resolve(repoArg);
  fs.mkdirSync(outDir, { recursive: true });
  const docsFiles = readDocsFiles(repo);
  const groups = groupReport(JSON.parse(fs.readFileSync(reportPath, "utf8")));

  const { entries, runs } = await researchAll(groups, {
    usagesFor: (url) => findUsages(docsFiles, url),
    runAgent: researcher(outDir),
    tools: process.env.RESEARCH_TOOLS,
  });

  fs.writeFileSync(path.join(outDir, "research.json"), `${JSON.stringify(entries, null, 2)}\n`);
  fs.writeFileSync(path.join(outDir, "research-run.json"), `${JSON.stringify(summarizeRuns(runs))}\n`);
  for (const entry of entries) console.log(`${entry.result.outcome}: ${entry.url}`);
  return 0;
}

if (isMain(import.meta.url)) {
  try {
    process.exitCode = await main(process.argv.slice(2));
  } catch (error) {
    console.log(`::error::${error.message}`);
    process.exitCode = 1;
  }
}
