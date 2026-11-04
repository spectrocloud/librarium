#!/usr/bin/env node
// Deterministic guard for an agent-made broken-link fix.
//
// Runs after the agent and before anything is pushed. The agent never holds a
// GitHub token; this script decides whether its working-tree changes may become
// a PR. New URLs are judged by linkinator's API with the same config as the
// weekly report, so a fix passes or fails by the rule that flagged the old link.
//
// Usage: node check-link-fix-diff.mjs <repo-dir> <link_report.json> [--no-network]
//
// Exit 0: safe to open a PR. Prints PROSE_CHANGED=1 when any change goes beyond
//         a URL swap, and UNVERIFIED_LINKS=1 when a new URL could not be checked,
//         so the PR can be labeled for closer review.
// Exit 1: a hard rule failed. Do not open a PR.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { check, getConfig } from "linkinator";

const URL_RE = /https?:\/\/[^\s)\]"'<>`]+/g;
const DOC_PREFIXES = ["docs/", "_partials/"];
const DOC_SUFFIXES = [".md", ".mdx"];
const FROZEN_PREFIXES = ["docs/deprecated/"];
const LINKINATOR_CONFIGS = ["linkinator/linkinator.config.json", "linkinator/linkinator-ci.config.json"];
const BOT_BLOCK_CODES = new Set([401, 403, 429]);
const RETRIES = 3;
const RETRY_PAUSE_MS = 10_000;

const git = (repo, ...args) => execFileSync("git", ["-C", repo, ...args], { encoding: "utf8" });
const urls = (text) => new Set(text.match(URL_RE) ?? []);
// linkinator reports and checks URLs without their #fragment.
const defrag = (url) => url.split("#")[0];
// Swap every URL for a placeholder and collapse whitespace, so a pure URL swap,
// including a Prettier reflow, compares equal.
const normalize = (text) => text.replace(URL_RE, "<URL>").split(/\s+/).filter(Boolean).join(" ");
const withoutSkip = ({ skip, ...rest }) => JSON.stringify(rest);

async function checkWithLinkinator(repo, newUrls) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "link-fix-"));
  const page = path.join(tmp, "new-links.md");
  fs.writeFileSync(page, newUrls.map((u) => `- [link](${u})\n`).join(""));
  const flags = await getConfig({ config: path.join(repo, "linkinator/linkinator-ci.config.json") });
  try {
    // Same mapping as the linkinator CLI, minus the CLI-only output flags.
    const { links } = await check({
      path: page,
      markdown: flags.markdown,
      recurse: flags.recurse,
      concurrency: flags.concurrency,
      timeout: flags.timeout,
      retry: flags.retry,
      retryErrors: flags.retryErrors,
      retryErrorsCount: flags.retryErrorsCount,
      retryErrorsJitter: flags.retryErrorsJitter,
      // The CLI splits each skip entry on commas and whitespace; match it.
      linksToSkip: [flags.skip ?? []].flat().flatMap((s) => s.split(/[\s,]+/).filter(Boolean)),
    });
    return new Map(links.map((l) => [defrag(l.url), { state: l.state, status: l.status }]));
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

// OK: loads. UNVERIFIED: the site blocks bots or is on the skip list, so a human
// checks it. BROKEN: gone, so the PR must not open.
function verdict({ state, status }) {
  if (state === "OK") return "OK";
  if (state === "SKIPPED" || BOT_BLOCK_CODES.has(status)) return "UNVERIFIED";
  return "BROKEN";
}

async function main() {
  // Absolute, because linkinator serves the temp page from its own directory.
  const repo = path.resolve(process.argv[2]);
  const reportPath = process.argv[3];
  const network = !process.argv.includes("--no-network");
  const reported = new Set(JSON.parse(fs.readFileSync(reportPath, "utf8")).map((e) => defrag(e.url)));
  const failures = [];
  const notes = [];
  let proseChanged = false;

  const changed = git(repo, "status", "--porcelain").split("\n").filter(Boolean);
  if (changed.length === 0) {
    console.log("No changes. Nothing to open.");
    return 0;
  }

  const oldUrls = new Set();
  const newUrls = new Set();
  for (const line of changed) {
    const status = line.slice(0, 2).trim();
    const file = line.slice(3);
    if (status !== "M") {
      failures.push(`${file}: only modifications are allowed (status ${status})`);
      continue;
    }

    const before = git(repo, "show", `HEAD:${file}`);
    const after = fs.readFileSync(path.join(repo, file), "utf8");

    // Rule 1: only docs pages and the linkinator skip lists may change.
    if (LINKINATOR_CONFIGS.includes(file)) {
      const [o, n] = [JSON.parse(before), JSON.parse(after)];
      if (withoutSkip(o) !== withoutSkip(n)) failures.push(`${file}: changed something other than the skip array`);
      const added = (n.skip ?? []).filter((s) => !(o.skip ?? []).includes(s));
      notes.push(`${file}: skip patterns added: ${JSON.stringify(added)}`);
      continue;
    }
    if (!DOC_PREFIXES.some((p) => file.startsWith(p)) || !DOC_SUFFIXES.some((s) => file.endsWith(s))) {
      failures.push(`${file}: outside docs/ and _partials/ Markdown`);
      continue;
    }
    if (FROZEN_PREFIXES.some((p) => file.startsWith(p))) {
      failures.push(`${file}: the weekly scan excludes this folder, so the fix must too`);
      continue;
    }

    urls(before).forEach((u) => oldUrls.add(u));
    urls(after).forEach((u) => newUrls.add(u));

    // Rule 2: flag anything beyond a URL swap. Allowed, but labeled.
    if (normalize(before) !== normalize(after)) {
      proseChanged = true;
      notes.push(`${file}: text changed beyond the URL swap`);
    }
  }

  // Rule 3: the agent may only remove URLs that the report flagged.
  const removed = [...oldUrls].filter((u) => !newUrls.has(u));
  const unreported = removed.filter((u) => !reported.has(defrag(u))).sort();
  if (unreported.length) failures.push(`removed URLs that were not in the report: ${JSON.stringify(unreported)}`);

  // Rule 4: every URL the agent introduced must not be broken. Bot-blocked or
  // skip-listed URLs pass but are flagged for the reviewer.
  const added = [...newUrls].filter((u) => !oldUrls.has(u)).sort();
  let unverified = false;
  const results = network && added.length ? await checkWithLinkinator(repo, added) : new Map();
  // Bot blocks are often transient: retry them before reporting an error.
  for (let attempt = 0; attempt < RETRIES; attempt++) {
    const blocked = added.filter((u) => BOT_BLOCK_CODES.has(results.get(defrag(u))?.status));
    if (!blocked.length) break;
    await sleep(RETRY_PAUSE_MS);
    for (const [url, result] of await checkWithLinkinator(repo, blocked)) results.set(url, result);
  }
  for (const url of added) {
    if (!network) {
      notes.push(`not checked (offline): ${url}`);
      continue;
    }
    const result = results.get(defrag(url)) ?? { state: "MISSING", status: undefined };
    let v = verdict(result);
    if (v === "UNVERIFIED") unverified = true;
    if (v === "UNVERIFIED" && BOT_BLOCK_CODES.has(result.status)) v = `ERROR after ${RETRIES + 1} attempts:`;
    (v === "BROKEN" ? failures : notes).push(`${v} ${result.status} ${url}`);
  }

  // Rule 5: both linkinator configs keep identical skip lists.
  const skips = LINKINATOR_CONFIGS.map((p) =>
    JSON.stringify([...(JSON.parse(fs.readFileSync(path.join(repo, p), "utf8")).skip ?? [])].sort())
  );
  if (skips[0] !== skips[1]) failures.push("linkinator configs have different skip lists");

  console.log(`Changed files: ${changed.length}  URLs removed: ${removed.length}  URLs added: ${added.length}`);
  notes.forEach((n) => console.log(`  note: ${n}`));
  failures.forEach((f) => console.log(`  FAIL: ${f}`));
  console.log(`PROSE_CHANGED=${Number(proseChanged)}`);
  console.log(`UNVERIFIED_LINKS=${Number(unverified)}`);
  return failures.length ? 1 : 0;
}

process.exitCode = await main();
