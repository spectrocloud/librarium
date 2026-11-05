#!/usr/bin/env node
// Writes the job summary: what each agent run cost, its decisions, the PR or
// the dry-run plan, and the check results.
//
// Usage: node job-summary.mjs <work-dir> >> "$GITHUB_STEP_SUMMARY"
// Env: CASE, COUNT, CHECK_EXIT, PREVIEW_EXIT, PREVIEW_BASE, PR_URL.

import path from "node:path";

import { isMain, readLines, readText } from "./lib/cli.mjs";
import { parseRun } from "./agent-run.mjs";

// The agent runs in the order they happen, by output file name.
const RUNS = ["run", "review-run", "address-run", "preview-run"];
const DECISIONS = { decision: "After the review", "final-decision": "After the preview test" };

/** Summarizes one agent run's turns, cost, and time. */
export function runLine(name, result) {
  const cost = typeof result.total_cost_usd === "number" ? `$${result.total_cost_usd.toFixed(2)}` : "cost unknown";
  const time = typeof result.duration_ms === "number" ? `${Math.round(result.duration_ms / 1000)}s` : "time unknown";
  return `- ${name}: ${result.num_turns} turns, ${cost}, ${time}`;
}

/** Wraps text in a fenced block. */
function fenced(text) {
  return "```text\n" + text.trim() + "\n```";
}

/** Builds the summary from the run's results. Every input except caseName and count is optional. */
export function jobSummary(input) {
  const { caseName, count, runs = [], decisions = [], prUrl, mergeComment, prBodyWritten, backportLabels = [] } = input;
  const { diffCheck, checkExit, previewReport, previewExit, previewBase, fixReport } = input;
  const sections = [`## Link fix agent: ${caseName}`, `Broken external links reported: **${count}**`];

  if (runs.length) sections.push(runs.map(({ name, result }) => runLine(name, result)).join("\n"));
  for (const { label, decision } of decisions) {
    sections.push(`**${label}:** confident=${decision.confident}. ${decision.reason}`);
  }

  if (prUrl) {
    sections.push(`**PR:** ${prUrl}`);
    if (mergeComment) sections.push(mergeComment.trim());
  } else if (prBodyWritten) {
    const finalDecision = decisions.find((d) => d.label === DECISIONS["final-decision"])?.decision;
    const wouldMerge = previewExit === "0" && finalDecision?.confident === true;
    sections.push(
      [
        "**Dry run:** the PR description and comments are in the artifacts. CI does not run in a dry run.",
        `Backport labels: ${backportLabels.join(" ") || "none"}`,
        wouldMerge ? "Would merge once CI passes." : "Would hand off to a human.",
      ].join("\n\n")
    );
    if (previewReport)
      sections.push(`### Preview check (exit ${previewExit}) against ${previewBase}`, fenced(previewReport));
  }

  sections.push(`### Final diff check (exit ${checkExit || "not run"})`, fenced(diffCheck || "not run"));
  sections.push(fixReport?.trim() || "No fix report.");
  return `${sections.join("\n\n")}\n`;
}

// Command line.

function main([workDir]) {
  const out = path.join(workDir, "out");
  const runs = RUNS.map((name) => ({ name, text: readText(path.join(out, `${name}.json`)) }))
    .filter(({ text }) => text)
    .map(({ name, text }) => ({ name, result: parseRun(text).result }));
  const decisions = Object.entries(DECISIONS)
    .map(([file, label]) => ({ label, text: readText(path.join(out, `${file}.json`)) }))
    .filter(({ text }) => text && text.trim() !== "null")
    .map(({ label, text }) => ({ label, decision: JSON.parse(text) }));

  const { CASE, COUNT, CHECK_EXIT, PREVIEW_EXIT, PREVIEW_BASE, PR_URL } = process.env;
  process.stdout.write(
    jobSummary({
      caseName: CASE,
      count: COUNT,
      runs,
      decisions,
      prUrl: PR_URL,
      mergeComment: readText(path.join(out, "merge-comment.md")),
      prBodyWritten: Boolean(readText(path.join(out, "pr-body.md"))),
      backportLabels: readLines(path.join(out, "backport-labels.txt")),
      diffCheck: readText(path.join(out, "diff-check.txt")),
      checkExit: CHECK_EXIT,
      previewReport: readText(path.join(out, "preview-check.txt")),
      previewExit: PREVIEW_EXIT,
      previewBase: PREVIEW_BASE,
      fixReport: readText(path.join(out, "fix-report.md")),
    })
  );
}

if (isMain(import.meta.url)) main(process.argv.slice(2));
