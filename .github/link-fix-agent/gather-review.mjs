#!/usr/bin/env node
// Prepares the reviewer agent's inputs before it starts.
//
// It runs pr-review-buddy's Phase 1 and its Vale and VersionedLink checks on
// the working-tree diff, so that the reviewer needs no GitHub token and almost
// no shell. prompts/review-in-ci.md tells the reviewer what each file holds.
//
// Usage: node gather-review.mjs <review-dir> <pr-title>
// Writes pr.json, pr.diff, added/<file>.txt, vale-errors.txt, vale-all.txt,
// and versionedlink-splits.txt to <review-dir>.

import fs from "node:fs";
import path from "node:path";

import { isMain, writeLines } from "./lib/cli.mjs";
import { git, run } from "./lib/run.mjs";

/** Returns the PR-head line numbers of the lines that `diff` adds to `file`. */
export function addedLineNumbers(diff, file) {
  const lines = [];
  let currentFile = null;
  let lineNumber = 0;
  for (const line of diff.split("\n")) {
    if (line.startsWith("+++ ")) {
      currentFile = line.slice("+++ b/".length);
    } else if (line.startsWith("@@")) {
      // A hunk header, such as "@@ -10,4 +12,5 @@", gives the new start line.
      lineNumber = Number(line.match(/\+(\d+)/)[1]);
    } else if (line.startsWith("+")) {
      if (currentFile === file) lines.push(lineNumber);
      lineNumber++;
    } else if (line.startsWith(" ")) {
      lineNumber++;
    }
  }
  return lines;
}

/** Keeps the Vale alerts (path:line:col:rule:message) that are on one of `lineNumbers`. */
export function alertsOnLines(valeOutput, lineNumbers) {
  const wanted = new Set(lineNumbers);
  return valeOutput
    .split("\n")
    .filter((alert) => wanted.has(Number(alert.split(":")[1])))
    .join("\n");
}

/**
 * Finds paragraphs that start with <VersionedLink while the line before the
 * blank line ends mid-sentence. Prettier splits the sentence there, and the
 * page renders it as two paragraphs. pr-review-buddy explains the fix.
 */
export function versionedLinkSplits(text, file) {
  const hits = [];
  let afterBlankLine = false;
  let lastTextLine = "";
  text.split("\n").forEach((line, index) => {
    if (/^\s*$/.test(line)) {
      afterBlankLine = true;
      return;
    }
    const endsSentence = /(^\s*#.*|[.:!?>|`]|---)\s*$/.test(lastTextLine);
    if (afterBlankLine && /^\s*<VersionedLink\s/.test(line) && lastTextLine !== "" && !endsSentence) {
      hits.push(`${file}:${index + 1}: ${line}`);
    }
    afterBlankLine = false;
    lastTextLine = line;
  });
  return hits;
}

/** Returns the name of the file that holds a changed file's added line numbers. */
export function addedLinesFileName(file) {
  return `${file.replaceAll("/", "__")}.txt`;
}

// Command line.

function vale(file, extraArgs) {
  // Vale exits non-zero when it finds errors, so only its output matters here.
  return run("vale", ["--no-global", "--config", ".vale.ini", ...extraArgs, "--output=line", file]).stdout;
}

function main([reviewDir, title]) {
  fs.mkdirSync(path.join(reviewDir, "added"), { recursive: true });
  const diff = git(".", "diff");
  const files = git(".", "diff", "--name-only").split("\n").filter(Boolean);
  fs.writeFileSync(path.join(reviewDir, "pr.diff"), diff);
  fs.writeFileSync(path.join(reviewDir, "pr.json"), `${JSON.stringify({ title, base: "master", files }, null, 2)}\n`);

  const valeErrors = [];
  const valeAll = [];
  const splits = [];
  for (const file of files.filter((f) => /\.mdx?$/.test(f))) {
    const added = addedLineNumbers(diff, file);
    writeLines(path.join(reviewDir, "added", addedLinesFileName(file)), added);
    valeErrors.push(alertsOnLines(vale(file, ["--minAlertLevel=error"]), added));
    valeAll.push(alertsOnLines(vale(file, []), added));
    if (file.endsWith(".md")) splits.push(...versionedLinkSplits(fs.readFileSync(file, "utf8"), file));
  }
  writeLines(path.join(reviewDir, "vale-errors.txt"), valeErrors.filter(Boolean));
  writeLines(path.join(reviewDir, "vale-all.txt"), valeAll.filter(Boolean));
  writeLines(path.join(reviewDir, "versionedlink-splits.txt"), splits);

  console.log(`Review inputs for ${files.length} files in ${reviewDir}`);
  console.log(`Vale errors: ${valeErrors.filter(Boolean).length} files. VersionedLink splits: ${splits.length}.`);
}

if (isMain(import.meta.url)) main(process.argv.slice(2));
