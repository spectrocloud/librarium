#!/usr/bin/env node
// Decides whether the agent's broken-link fix may become a PR.
//
// The agent never holds a GitHub token. This check runs after it, and the PR
// opens only when every rule passes:
//   1. Only docs pages and the linkinator skip lists change.
//   2. docs/deprecated/ stays untouched, because the weekly scan skips it.
//   3. Only URLs that the report flagged are removed.
//   4. Every new URL passes linkinator with the CI config. A site that blocks
//      bots is retried, and then flagged for the reviewer instead of failing.
//   5. Both linkinator configs keep the same skip list.
// Text changes beyond URL swaps pass, but are flagged with PROSE_CHANGED=1.
//
// Usage: node check-link-fix-diff.mjs <repo-dir> <link_report.json> [--no-network]
// Exit 0: the PR may open. Exit 1: a rule failed.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

import { isMain } from "./lib/cli.mjs";
import { git } from "./lib/run.mjs";
import { URL_PATTERN, findUrls, urlChanges, withoutFragment } from "./lib/urls.mjs";

export const LINKINATOR_CONFIGS = ["linkinator/linkinator.config.json", "linkinator/linkinator-ci.config.json"];
const CI_CONFIG = "linkinator/linkinator-ci.config.json";
const DOC_FOLDERS = ["docs/", "_partials/"];
const DOC_EXTENSIONS = [".md", ".mdx"];
const FROZEN_FOLDERS = ["docs/deprecated/"];
// Sites send these codes to bots even when the page exists.
const BOT_BLOCK_CODES = new Set([401, 403, 429]);
const RETRIES = 3;
const RETRY_PAUSE_MS = 10_000;

// Rules 1 and 2: which files may change.

/** Returns why a changed file breaks rule 1 or 2, or null when it may change. */
export function fileRuleFailure({ path: file, status }) {
  if (status !== "M") return `${file}: only modifications are allowed (status ${status})`;
  if (LINKINATOR_CONFIGS.includes(file)) return null;
  const isDocsPage = DOC_FOLDERS.some((f) => file.startsWith(f)) && DOC_EXTENSIONS.some((e) => file.endsWith(e));
  if (!isDocsPage) return `${file}: outside docs/ and _partials/ Markdown`;
  if (FROZEN_FOLDERS.some((f) => file.startsWith(f))) {
    return `${file}: the weekly scan excludes this folder, so the fix must too`;
  }
  return null;
}

/** Checks a linkinator config change, where only the skip array may change. */
export function checkConfigChange({ path: file, before, after }) {
  const { skip: oldSkip = [], ...oldRest } = JSON.parse(before);
  const { skip: newSkip = [], ...newRest } = JSON.parse(after);
  const onlySkipChanged = JSON.stringify(oldRest) === JSON.stringify(newRest);
  return {
    failure: onlySkipChanged ? null : `${file}: changed something other than the skip array`,
    note: `${file}: skip patterns added: ${JSON.stringify(newSkip.filter((s) => !oldSkip.includes(s)))}`,
  };
}

/**
 * True when the text changed beyond swapping URLs. Whitespace changes, such
 * as a Prettier reflow after a longer URL, do not count.
 */
export function changedBeyondUrls(before, after) {
  const normalize = (text) => text.replace(URL_PATTERN, "<URL>").split(/\s+/).filter(Boolean).join(" ");
  return normalize(before) !== normalize(after);
}

// Rules 3 and 5.

/** Returns the removed URLs that the report did not flag (rule 3). */
export function unreportedRemovals(removedUrls, reportedUrls) {
  return removedUrls.filter((url) => !reportedUrls.has(withoutFragment(url)));
}

/** True when every linkinator config lists the same skip patterns (rule 5). */
export function skipListsMatch(configTexts) {
  const lists = configTexts.map((text) => JSON.stringify([...(JSON.parse(text).skip ?? [])].sort()));
  return lists.every((list) => list === lists[0]);
}

/** Applies rules 1 to 3 to the changed files. Rule 4 needs the network, so verifyNewUrls runs it. */
export function checkChanges(changes, reportedUrls) {
  const failures = [];
  const notes = [];
  let proseChanged = false;
  const urlsBefore = new Set();
  const urlsAfter = new Set();
  const unreported = new Set();

  for (const change of changes) {
    const failure = fileRuleFailure(change);
    if (failure) {
      failures.push(failure);
      continue;
    }
    if (LINKINATOR_CONFIGS.includes(change.path)) {
      const config = checkConfigChange(change);
      if (config.failure) failures.push(config.failure);
      notes.push(config.note);
      continue;
    }
    const fileUrlsBefore = findUrls(change.before);
    const fileUrlsAfter = findUrls(change.after);
    fileUrlsBefore.forEach((url) => urlsBefore.add(url));
    fileUrlsAfter.forEach((url) => urlsAfter.add(url));
    // Rule 3 applies to each file, so moving a URL to another page still counts as removing it.
    unreportedRemovals(urlChanges(fileUrlsBefore, fileUrlsAfter).removed, reportedUrls).forEach((url) =>
      unreported.add(url)
    );
    if (changedBeyondUrls(change.before, change.after)) {
      proseChanged = true;
      notes.push(`${change.path}: text changed beyond the URL swap`);
    }
  }

  const { removed, added } = urlChanges(urlsBefore, urlsAfter);
  if (unreported.size) {
    failures.push(`removed URLs that were not in the report: ${JSON.stringify([...unreported].sort())}`);
  }
  return { failures, notes, proseChanged, removed, added };
}

// Rule 4: new URLs must load.

/** OK: the page loads. UNVERIFIED: it blocks bots or is skip-listed, so a human checks it. BROKEN: it is gone. */
export function verdict({ state, status }) {
  if (state === "OK") return "OK";
  if (state === "SKIPPED" || BOT_BLOCK_CODES.has(status)) return "UNVERIFIED";
  return "BROKEN";
}

/**
 * Checks each new URL with `checkUrls`, which maps URLs (without fragments) to
 * linkinator results. Bot-blocked URLs are checked again, `retries` times,
 * because the blocks are often brief.
 */
export async function verifyNewUrls(urls, checkUrls, { retries = RETRIES, pause = () => sleep(RETRY_PAUSE_MS) } = {}) {
  const results = urls.length ? await checkUrls(urls) : new Map();
  const isBlocked = (url) => BOT_BLOCK_CODES.has(results.get(withoutFragment(url))?.status);
  for (let attempt = 0; attempt < retries; attempt++) {
    const blocked = urls.filter(isBlocked);
    if (!blocked.length) break;
    await pause();
    for (const [url, result] of await checkUrls(blocked)) results.set(url, result);
  }

  const failures = [];
  const notes = [];
  let unverified = false;
  for (const url of urls) {
    const result = results.get(withoutFragment(url)) ?? { state: "MISSING", status: "no result" };
    const urlVerdict = verdict(result);
    if (urlVerdict === "BROKEN") {
      failures.push(`BROKEN ${result.status} ${url}`);
    } else if (urlVerdict === "OK") {
      notes.push(`OK ${result.status} ${url}`);
    } else {
      unverified = true;
      const label = BOT_BLOCK_CODES.has(result.status) ? `ERROR after ${retries + 1} attempts:` : "UNVERIFIED";
      notes.push(`${label} ${result.status} ${url}`);
    }
  }
  return { failures, notes, unverified };
}

/** Returns a checkUrls function that runs linkinator with the repo's CI config, as the weekly report does. */
export function linkinatorChecker(repo) {
  return async (urls) => {
    // Imported here so that the rest of this module, and its tests, work without node_modules.
    const { check, getConfig } = await import("linkinator");
    const flags = await getConfig({ config: path.join(repo, CI_CONFIG) });
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "link-fix-"));
    const page = path.join(tmp, "new-links.md");
    fs.writeFileSync(page, urls.map((url) => `- [link](${url})\n`).join(""));
    try {
      // The same options as the linkinator CLI, minus its output flags.
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
        // The CLI splits each skip entry on commas and whitespace, so this does too.
        linksToSkip: [flags.skip ?? []].flat().flatMap((entry) => entry.split(/[\s,]+/).filter(Boolean)),
      });
      return new Map(links.map((link) => [withoutFragment(link.url), { state: link.state, status: link.status }]));
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  };
}

// Output.

/** Formats the check's result. The workflow and the agent's prompts read the FAIL, PROSE_CHANGED, and UNVERIFIED_LINKS lines. */
export function formatReport({ changedFiles, removed, added, notes, failures, proseChanged, unverified }) {
  return [
    `Changed files: ${changedFiles}  URLs removed: ${removed.length}  URLs added: ${added.length}`,
    ...notes.map((note) => `  note: ${note}`),
    ...failures.map((failure) => `  FAIL: ${failure}`),
    `PROSE_CHANGED=${Number(proseChanged)}`,
    `UNVERIFIED_LINKS=${Number(unverified)}`,
  ].join("\n");
}

// Command line.

/** Reads the working-tree changes, with each modified file's text before and after. */
function readChanges(repo) {
  return git(repo, "status", "--porcelain")
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const status = line.slice(0, 2).trim();
      const file = line.slice(3);
      if (status !== "M") return { path: file, status };
      const before = git(repo, "show", `HEAD:${file}`);
      return { path: file, status, before, after: fs.readFileSync(path.join(repo, file), "utf8") };
    });
}

async function main([repoArg, reportPath, ...flags]) {
  // Absolute, because linkinator serves its temporary page from another directory.
  const repo = path.resolve(repoArg);
  const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
  const reportedUrls = new Set(report.map((entry) => withoutFragment(entry.url)));

  const changes = readChanges(repo);
  if (changes.length === 0) {
    console.log("No changes. Nothing to open.");
    return 0;
  }

  const fileCheck = checkChanges(changes, reportedUrls);
  const urlCheck = flags.includes("--no-network")
    ? { failures: [], notes: fileCheck.added.map((url) => `not checked (offline): ${url}`), unverified: false }
    : await verifyNewUrls(fileCheck.added, linkinatorChecker(repo));
  const configs = LINKINATOR_CONFIGS.map((config) => fs.readFileSync(path.join(repo, config), "utf8"));
  const failures = [
    ...fileCheck.failures,
    ...urlCheck.failures,
    ...(skipListsMatch(configs) ? [] : ["linkinator configs have different skip lists"]),
  ];

  console.log(
    formatReport({
      changedFiles: changes.length,
      removed: fileCheck.removed,
      added: fileCheck.added,
      notes: [...fileCheck.notes, ...urlCheck.notes],
      failures,
      proseChanged: fileCheck.proseChanged,
      unverified: urlCheck.unverified,
    })
  );
  return failures.length ? 1 : 0;
}

if (isMain(import.meta.url)) process.exitCode = await main(process.argv.slice(2));
