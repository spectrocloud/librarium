#!/usr/bin/env node
// Writes the bot PR's description and its review comment from the run's files.
//
// Usage: node write-pr-text.mjs <work-dir>
// Reads <work-dir>/out/{fix-report.md,decision.json,diff-check.txt,backport-labels.txt,manual-backports.txt}
// and <work-dir>/review/review.md. Writes <work-dir>/out/pr-body.md and <work-dir>/out/pr-comment.md.
// Needs REVIEW_MODEL in the environment.

import fs from "node:fs";
import path from "node:path";

import { isMain, readLines, readText } from "./lib/cli.mjs";
import { git } from "./lib/run.mjs";

const MERGE_PLAN =
  "Once every CI check passes, the agent tests the Netlify deploy preview and posts the result as a comment. " +
  "If it is still confident, it merges this PR. The master ruleset requires a docs code owner's approval first, " +
  "so it turns on auto-merge, and the PR merges on that approval. Otherwise, it hands the PR to a human.";

/** Describes the agent's decision after the review. */
export function reviewSummary(decision) {
  return decision.confident
    ? `After the review, the agent is confident in these changes. ${decision.reason}`
    : `After the review, the agent is not confident in these changes. What to check: ${decision.reason}`;
}

/** Turns the diff check's flags into notes for the reviewer. */
export function diffCheckFlags(diffCheck) {
  const flags = [];
  if (/^PROSE_CHANGED=1$/m.test(diffCheck)) flags.push("- The agent changed text beyond URL swaps.");
  if (/^UNVERIFIED_LINKS=1$/m.test(diffCheck)) {
    flags.push(
      "- The link checker could not verify at least one new URL. The diff check output in the job summary lists it."
    );
  }
  if (/^SKIP_PATTERNS_ADDED=1$/m.test(diffCheck)) {
    flags.push("- The agent added a linkinator skip pattern. A person approves every skip-list change.");
  }
  return flags;
}

/** Describes the backport labels and any branches that need a manual backport. */
export function backportNote(labels, manualBranches) {
  let note = labels.length
    ? `Added \`auto-backport\` and ${labels.map((label) => `\`${label}\``).join(" ")}, where the fix applies cleanly.`
    : "No version branch takes the fix cleanly.";
  if (manualBranches.length) note += ` Manual backport needed: ${manualBranches.join(" ")}.`;
  return note;
}

/** Builds the PR description from the librarium PR template. */
export function prBody({ fixReport, decision, diffCheck, backportLabels, manualBackports, changedFiles, reviewModel }) {
  const flags = diffCheckFlags(diffCheck);
  return `# ✅ Pull Request Checklist

The link fix agent opened this PR and checked the items it could do itself. A docs code owner does the rest.

- [x] The **PR description** explains what changed. _The agent's fix report is below._
- [x] A **Jira ticket** is provided. _No Jira ticket: weekly broken-links report fix._
- [ ] **Preview links** for all affected pages. _The changed files are listed below._
- [ ] Conduct a **self-review** for your pages using your preview links.
- [x] Run a **review buddy check** in a separate context window. _pr-review-buddy ran on \`${reviewModel}\` in a fresh context before this PR opened. The agent's responses are in a comment._
- [ ] **Check formatting** for your pages.
- [ ] Ensure all **Vale comments** are resolved.
- [ ] All **CI jobs** have completed successfully. _The agent waits for every check before it merges._
- [x] Add **Backport labels**. _${backportNote(backportLabels, manualBackports)}_
- [x] **Outside review:** _No._
- [ ] Add the \`notify-slack\` label. _The agent adds it after it tests the deploy preview._

---

## 📝 Describe the Change

**Review:** ${reviewSummary(decision)}

**Merge plan:** ${MERGE_PLAN}

${flags.length ? `${flags.join("\n")}\n\n` : ""}${fixReport.trim()}

---

## 💻 Changed Pages

${changedFiles.map((file) => `- \`${file}\``).join("\n")}

---

## 🎫 Jira Tickets

No Jira ticket (weekly broken-links report fix).

🤖 Generated with [Claude Code](https://claude.com/claude-code)
`;
}

/** Builds the comment that records the review and the agent's response to each finding. */
export function reviewComment({ review, decision, reviewModel }) {
  const responses = decision.findings.length
    ? decision.findings.map((f) => `- **${f.action.toUpperCase()}:** ${f.finding}\n  - ${f.note}`).join("\n")
    : "No findings to address.";
  return `## Review buddy

pr-review-buddy ran on \`${reviewModel}\` in a fresh context before this PR opened.

<details><summary>Review report</summary>

${review.trim()}

</details>

## Responses from the link fix agent

${responses}
`;
}

// Command line.

function main([workDir]) {
  const out = path.join(workDir, "out");
  const inputs = {
    fixReport: readText(path.join(out, "fix-report.md"), "No fix report."),
    decision: JSON.parse(fs.readFileSync(path.join(out, "decision.json"), "utf8")),
    diffCheck: readText(path.join(out, "diff-check.txt")),
    backportLabels: readLines(path.join(out, "backport-labels.txt")),
    manualBackports: readLines(path.join(out, "manual-backports.txt")),
    changedFiles: git(".", "diff", "--name-only", "HEAD").split("\n").filter(Boolean),
    review: readText(path.join(workDir, "review", "review.md"), "The reviewer wrote no report."),
    reviewModel: process.env.REVIEW_MODEL,
  };
  fs.writeFileSync(path.join(out, "pr-body.md"), prBody(inputs));
  fs.writeFileSync(path.join(out, "pr-comment.md"), reviewComment(inputs));
}

if (isMain(import.meta.url)) main(process.argv.slice(2));
