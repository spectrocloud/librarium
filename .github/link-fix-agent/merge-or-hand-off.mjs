#!/usr/bin/env node
// Merges the bot PR, or hands it to a human, and says why in a PR comment.
//
// The PR merges only when every CI check passed, the link checker verified
// every new URL, no skip pattern was added, the preview check passed, and the
// agent was confident both after the review and after it tested the preview. The master ruleset
// requires a docs code owner's approval and allows no bypass, so the direct
// merge fails today. Auto-merge then makes the first approval merge the PR.
//
// Usage: node merge-or-hand-off.mjs <work-dir> <pr-number>
// Env: GH_TOKEN, CI_OK, PREVIEW_BASE, PREVIEW_EXIT.
// Reads <work-dir>/out/{decision.json,final-decision.json,diff-check.txt,preview-check.txt}.
// Writes <work-dir>/out/merge-comment.md.

import fs from "node:fs";
import path from "node:path";

import { isMain, readText } from "./lib/cli.mjs";
import { gh as runGh } from "./lib/run.mjs";
import { isValidDecision } from "./agent-run.mjs";

/** Reads a decision that agent-run.mjs wrote, or returns null when the file is missing or is not JSON. */
export function readDecision(file) {
  try {
    return JSON.parse(readText(file, "null"));
  } catch {
    return null;
  }
}

/**
 * Lists what stops the merge. An empty list means the PR may merge.
 * `reviewDecision` is the agent's decision after the review, `decision` its
 * decision after the preview test, and `diffCheck` the final diff check output.
 */
export function mergeBlockers({ ciOk, previewBase, previewExit, reviewDecision, decision, diffCheck = "" }) {
  const blockers = [];
  if (!ciOk) blockers.push("Not every CI check passed.");
  if (/^UNVERIFIED_LINKS=1$/m.test(diffCheck)) {
    blockers.push("The link checker could not verify at least one new URL, so a human checks it.");
  }
  if (/^SKIP_PATTERNS_ADDED=1$/m.test(diffCheck)) {
    blockers.push("The agent added a linkinator skip pattern, and a person approves every skip-list change.");
  }
  if (!previewBase) blockers.push("The Netlify deploy preview did not build, so the agent could not test it.");
  if (previewExit !== "0") blockers.push("The deploy preview check failed or did not run.");
  if (!isValidDecision(reviewDecision)) blockers.push("The agent did not finish addressing the review.");
  else if (!reviewDecision.confident)
    blockers.push(`After the review, the agent was not confident: ${reviewDecision.reason}`);
  if (!isValidDecision(decision)) blockers.push("The agent did not finish its deploy preview test.");
  else if (!decision.confident) blockers.push(`The agent is not confident: ${decision.reason}`);
  return blockers;
}

/** Merges the PR when nothing blocks it, and otherwise makes sure auto-merge is off. */
export function mergeOrHandOff({ pr, blockers, gh }) {
  if (blockers.length) {
    gh(["pr", "merge", pr, "--disable-auto"]);
    return {
      merged: false,
      outcome: "The agent handed this PR off. A docs code owner reviews, approves, and merges it.",
    };
  }
  if (gh(["pr", "merge", pr, "--squash"]).code === 0) return { merged: true, outcome: "The agent merged this PR." };

  gh(["pr", "merge", pr, "--squash", "--auto"]);
  const autoMergeOn = gh(["pr", "view", pr, "--json", "autoMergeRequest", "--jq", ".autoMergeRequest != null"]);
  if (autoMergeOn.stdout.trim() === "true") {
    return {
      merged: false,
      outcome:
        "The agent turned on auto-merge. The master ruleset requires a docs code owner's approval, so this PR merges when one approves it.",
    };
  }
  return {
    merged: false,
    outcome: "The agent could not merge this PR or turn on auto-merge. A docs code owner approves and merges it.",
  };
}

/** Builds the PR comment that reports the preview test and the outcome. */
export function mergeComment({ previewBase, previewReport, decision, outcome, blockers }) {
  const sections = ["## Deploy preview test"];
  if (previewReport) sections.push(`Preview: ${previewBase}`, "```text\n" + previewReport.trim() + "\n```");
  if (isValidDecision(decision)) sections.push(`**The agent:** ${decision.reason}`);
  sections.push(`**Outcome:** ${outcome}`);
  if (blockers.length) sections.push(blockers.map((blocker) => `- ${blocker}`).join("\n"));
  return `${sections.join("\n\n")}\n`;
}

// Command line.

function main([workDir, pr]) {
  const out = path.join(workDir, "out");
  const decision = readDecision(path.join(out, "final-decision.json"));
  const previewBase = process.env.PREVIEW_BASE ?? "";

  const blockers = mergeBlockers({
    ciOk: process.env.CI_OK === "true",
    previewBase,
    previewExit: process.env.PREVIEW_EXIT ?? "",
    reviewDecision: readDecision(path.join(out, "decision.json")),
    decision,
    diffCheck: readText(path.join(out, "diff-check.txt")),
  });
  const { merged, outcome } = mergeOrHandOff({ pr, blockers, gh: runGh });
  const comment = mergeComment({
    previewBase,
    previewReport: readText(path.join(out, "preview-check.txt")),
    decision,
    outcome,
    blockers,
  });
  const commentFile = path.join(out, "merge-comment.md");
  fs.writeFileSync(commentFile, comment);
  console.log(comment);

  runGh(["pr", "comment", pr, "--body-file", commentFile]);
  // notify-slack pings the reviewers, so it goes on only when a human must act.
  if (!merged) {
    runGh([
      "api",
      "--method",
      "POST",
      `repos/${process.env.GITHUB_REPOSITORY}/issues/${pr}/labels`,
      "-f",
      "labels[]=notify-slack",
    ]);
  }
}

if (isMain(import.meta.url)) main(process.argv.slice(2));
