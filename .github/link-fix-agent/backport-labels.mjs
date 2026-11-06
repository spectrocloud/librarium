#!/usr/bin/env node
// Picks backport labels for the fix, the way the weekly fix PRs do by hand.
//
// The Backport workflow cherry-picks the merged fix, so a version branch gets a
// label only when the patch applies there cleanly. A branch that still has a
// removed URL, but where the patch does not apply, needs a manual backport.
//
// Usage: node backport-labels.mjs <fix.patch> <oldest-branch> <out-dir>
// Writes <out-dir>/backport-labels.txt (one label per line) and
// <out-dir>/manual-backports.txt (one branch per line).

import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { isMain, writeLines } from "./lib/cli.mjs";
import { git, run } from "./lib/run.mjs";
import { findUrls, urlChanges } from "./lib/urls.mjs";

/** Returns the URLs that the patch's removed lines hold and its added lines do not. */
export function removedUrls(patch) {
  const removedLines = [];
  const addedLines = [];
  // Only lines inside a hunk are changes. The --- and +++ file headers come
  // before each file's first hunk.
  let inHunk = false;
  for (const line of patch.split("\n")) {
    if (line.startsWith("diff --git ")) inHunk = false;
    else if (line.startsWith("@@")) inHunk = true;
    else if (inHunk && line.startsWith("-")) removedLines.push(line.slice(1));
    else if (inHunk && line.startsWith("+")) addedLines.push(line.slice(1));
  }
  return urlChanges(findUrls(removedLines.join("\n")), findUrls(addedLines.join("\n"))).removed;
}

/** Returns a version branch's numbers, so that version-4-10 sorts after version-4-9. */
export function versionNumbers(branch) {
  return branch
    .replace(/^version-/, "")
    .split("-")
    .map(Number);
}

/** Compares two version branches by their numbers. */
export function compareVersions(a, b) {
  const [x, y] = [versionNumbers(a), versionNumbers(b)];
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    if ((x[i] ?? 0) !== (y[i] ?? 0)) return (x[i] ?? 0) - (y[i] ?? 0);
  }
  return 0;
}

/** Returns the version branches at or after `oldest`, oldest first. */
export function supportedBranches(branches, oldest) {
  return branches
    .filter((branch) => /^version-\d+(-\d+)*$/.test(branch) && compareVersions(branch, oldest) >= 0)
    .sort(compareVersions);
}

/** Decides what a version branch needs: a backport label, a manual backport, or nothing. */
export function classifyBranch({ patchApplies, hasRemovedUrl }) {
  if (patchApplies) return "label";
  if (hasRemovedUrl) return "manual";
  return "none";
}

// Command line.

const NEED_DESCRIPTIONS = {
  label: "the fix applies cleanly",
  manual: "has a removed URL, but the fix does not apply cleanly",
  none: "nothing to backport",
};

function remoteVersionBranches() {
  return git(".", "ls-remote", "--heads", "origin", "refs/heads/version-*")
    .split("\n")
    .filter(Boolean)
    .map((line) => line.replace(/^.*refs\/heads\//, ""));
}

/** Checks the patch against FETCH_HEAD in a temporary index, so the working tree stays untouched. */
function patchAppliesToFetchHead(patchFile) {
  const index = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "backport-")), "index");
  const env = { GIT_INDEX_FILE: index };
  try {
    return (
      run("git", ["read-tree", "FETCH_HEAD"], { env }).code === 0 &&
      run("git", ["apply", "--cached", "--check", patchFile], { env }).code === 0
    );
  } finally {
    fs.rmSync(path.dirname(index), { recursive: true, force: true });
  }
}

/** True when FETCH_HEAD's published docs still hold one of the URLs. docs/deprecated is not published. */
function fetchHeadHasUrl(urlsFile) {
  const pathspecs = ["docs", "_partials", ":(exclude)docs/deprecated"];
  return run("git", ["grep", "-q", "-F", "-f", urlsFile, "FETCH_HEAD", "--", ...pathspecs]).code === 0;
}

function main([patchFile, oldest, outDir]) {
  const patch = path.resolve(patchFile);
  const removed = removedUrls(fs.readFileSync(patch, "utf8"));
  const urlsFile = path.join(outDir, "removed-urls.txt");
  writeLines(urlsFile, removed);

  const labels = [];
  const manual = [];
  for (const branch of supportedBranches(remoteVersionBranches(), oldest)) {
    git(".", "fetch", "--quiet", "--depth=1", "origin", branch);
    const need = classifyBranch({
      patchApplies: patchAppliesToFetchHead(patch),
      hasRemovedUrl: removed.length > 0 && fetchHeadHasUrl(urlsFile),
    });
    if (need === "label") labels.push(`backport-${branch}`);
    if (need === "manual") manual.push(branch);
    console.log(`${branch}: ${NEED_DESCRIPTIONS[need]}`);
  }
  writeLines(path.join(outDir, "backport-labels.txt"), labels);
  writeLines(path.join(outDir, "manual-backports.txt"), manual);
}

if (isMain(import.meta.url)) main(process.argv.slice(2));
