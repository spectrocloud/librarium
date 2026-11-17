#!/usr/bin/env node
// Applies the researchers' results to the docs, with no agent involved.
//
// It swaps each replaced URL in every docs file that uses it, and gives each
// link to a section the anchor that the researcher found on the new page. It
// adds proposed skip patterns to both linkinator configs, and lists the
// guidance changes for the guidance editor, the only agent that edits text.
// Then it writes the fix report that the PR description shows.
//
// Usage: node apply-research.mjs <research.json> <repo-dir> <out-dir>
// Writes <out-dir>/fix-report.md, <out-dir>/guidance-tasks.json, and
// <out-dir>/guidance-files.txt. Sets the step output guidance=true when the
// guidance editor has work.

import fs from "node:fs";
import path from "node:path";

import { LINKINATOR_CONFIGS } from "./check-link-fix-diff.mjs";
import { isMain, setOutput, writeLines } from "./lib/cli.mjs";
import { URL_PATTERN, fragmentOf, urlKey } from "./lib/urls.mjs";

/**
 * Replaces every URL in `text` that matches `url` (by urlKey) with `replacement`, and counts the swaps. A URL with a
 * #fragment gets the anchor that `fragments` ([{ from, to }]) maps its fragment to, or none when `to` is empty.
 */
export function replaceUrl(text, url, replacement, fragments) {
  let count = 0;
  const replaced = text.replace(URL_PATTERN, (found) => {
    if (urlKey(found) !== url) return found;
    count++;
    const fragment = fragmentOf(found);
    const to = fragment && fragments.find((mapping) => mapping.from === fragment)?.to;
    return to ? `${replacement}#${to}` : replacement;
  });
  return { text: replaced, count };
}

/** Adds a skip pattern to a linkinator config's text, keeping its 2-space JSON format. */
export function addSkipPattern(configText, pattern) {
  const config = JSON.parse(configText);
  config.skip = config.skip ?? [];
  if (!config.skip.includes(pattern)) config.skip.push(pattern);
  return `${JSON.stringify(config, null, 2)}\n`;
}

/** Returns the distinct files that an entry's usages are in. */
export function usageFiles(entry) {
  return [...new Set(entry.usages.map((usage) => usage.file))];
}

/** Returns the guidance editor's tasks: each update-guidance result, with where it applies. */
export function guidanceTasks(entries) {
  return entries
    .filter((entry) => entry.result.outcome === "update-guidance")
    .map(({ url, usages, result }) => ({
      url,
      replacement: result.replacement,
      guidance: result.guidance,
      sources: result.sources,
      usages,
    }));
}

/** Escapes text for one Markdown table cell. */
function cell(text) {
  return String(text ?? "")
    .replaceAll("|", "\\|")
    .replace(/\s*\n\s*/g, " ");
}

/** Describes where a result sends each section, such as "#old → #new, #gone → none". */
function anchors(result) {
  return result.fragments.map(({ from, to }) => `#${from} → ${to ? `#${to}` : "none"}`).join(", ");
}

function table(headers, rows) {
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.map(cell).join(" | ")} |`),
  ].join("\n");
}

/** Builds the fix report, one section per outcome, and leaves out sections with no rows. */
export function fixReport(entries) {
  const byOutcome = (outcome) => entries.filter((entry) => entry.result.outcome === outcome);
  const files = (entry) => usageFiles(entry).length;
  const sections = [
    [
      "Fixed",
      ["Old URL", "New URL", "Anchors", "Evidence", "Files"],
      byOutcome("replace").map((e) => [e.url, e.result.replacement, anchors(e.result), e.result.evidence, files(e)]),
    ],
    [
      "Guidance to update",
      ["URL", "New URL", "Anchors", "What changed", "Sources", "Files"],
      byOutcome("update-guidance").map((e) => [
        e.url,
        e.result.replacement || "none",
        anchors(e.result),
        e.result.guidance,
        e.result.sources.join(" "),
        files(e),
      ]),
    ],
    [
      "Skip patterns added",
      ["URL", "Pattern", "Notes"],
      byOutcome("skip-pattern").map((e) => [e.url, e.result.skipPattern, e.result.notes]),
    ],
    [
      "Checked, no change needed",
      ["URL", "Attempts", "What loaded"],
      byOutcome("no-change").map((e) => [e.url, e.result.attempts.join(", "), e.result.evidence]),
    ],
    [
      "Errors",
      ["URL", "Files", "Attempts", "Notes"],
      byOutcome("error").map((e) => [e.url, files(e), e.result.attempts.join(", "), e.result.notes]),
    ],
    [
      "Needs a human",
      ["URL", "Files", "Notes"],
      byOutcome("needs-human").map((e) => [e.url, files(e), e.result.notes]),
    ],
  ];
  const fixed = byOutcome("replace").length + byOutcome("update-guidance").length;
  const summary =
    `Fixed ${fixed} of ${entries.length} reported URLs. ${byOutcome("error").length} errors. ` +
    `${byOutcome("needs-human").length} need a human.`;
  return [
    ...sections
      .filter(([, , rows]) => rows.length)
      .map(([title, headers, rows]) => `## ${title}\n\n${table(headers, rows)}`),
    summary,
  ].join("\n\n");
}

// Command line.

function main([researchPath, repoArg, outDir]) {
  const repo = path.resolve(repoArg);
  const entries = JSON.parse(fs.readFileSync(researchPath, "utf8"));
  const readRepoFile = (file) => fs.readFileSync(path.join(repo, file), "utf8");
  const writeRepoFile = (file, text) => fs.writeFileSync(path.join(repo, file), text);

  // A guidance change can come with a new link too, so its URL swap happens here as well.
  for (const entry of entries) {
    const { outcome, replacement, fragments } = entry.result;
    if (!replacement || !["replace", "update-guidance"].includes(outcome)) continue;
    for (const file of usageFiles(entry)) {
      const { text, count } = replaceUrl(readRepoFile(file), entry.url, replacement, fragments);
      if (count) writeRepoFile(file, text);
    }
  }
  for (const entry of entries.filter((e) => e.result.outcome === "skip-pattern")) {
    for (const config of LINKINATOR_CONFIGS)
      writeRepoFile(config, addSkipPattern(readRepoFile(config), entry.result.skipPattern));
  }

  const tasks = guidanceTasks(entries);
  fs.writeFileSync(path.join(outDir, "guidance-tasks.json"), `${JSON.stringify(tasks, null, 2)}\n`);
  writeLines(path.join(outDir, "guidance-files.txt"), [
    ...new Set(tasks.flatMap((task) => task.usages.map((u) => u.file))),
  ]);
  fs.writeFileSync(path.join(outDir, "fix-report.md"), `${fixReport(entries)}\n`);
  if (tasks.length) setOutput("guidance", "true");
  console.log(fixReport(entries));
}

if (isMain(import.meta.url)) main(process.argv.slice(2));
