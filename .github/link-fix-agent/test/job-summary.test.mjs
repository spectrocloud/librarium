import assert from "node:assert/strict";
import fs from "node:fs";
import { afterEach, beforeEach, describe, it } from "node:test";

import { jobSummary, runLine } from "../job-summary.mjs";
import { runScript, tempDir, writeFiles } from "./helpers.mjs";

const RESULT = { type: "result", total_cost_usd: 1.2345, num_turns: 12, duration_ms: 95_400 };
const CONFIDENT = { confident: true, reason: "All swaps verified.", findings: [] };

describe("runLine", () => {
  it("summarizes the turns, the cost to the cent, and the time in seconds", () => {
    assert.equal(runLine("run", RESULT), "- run: 12 turns, $1.23, 95s");
  });

  it("says the cost and time are unknown for a result without them, instead of throwing", () => {
    assert.equal(runLine("run", { num_turns: 1 }), "- run: 1 turns, cost unknown, time unknown");
  });
});

describe("jobSummary", () => {
  it("prints placeholders when only the case and count are known", () => {
    assert.equal(
      jobSummary({ caseName: "live", count: 0 }),
      [
        "## Link fix agent: live",
        "Broken external links reported: **0**",
        "### Final diff check (exit not run)",
        "```text\nnot run\n```",
        "No fix report.\n",
      ].join("\n\n")
    );
  });

  it("lists the runs and decisions, and the PR with its merge comment", () => {
    const summary = jobSummary({
      caseName: "live",
      count: 3,
      runs: [
        { name: "run", result: RESULT },
        { name: "review-run", result: { total_cost_usd: 0.1, num_turns: 2, duration_ms: 1000 } },
      ],
      decisions: [{ label: "After the review", decision: CONFIDENT }],
      prUrl: "https://github.com/spectrocloud/librarium/pull/42",
      mergeComment: "## Deploy preview test\n\n**Outcome:** merged.\n",
      prBodyWritten: true,
      diffCheck: "PROSE_CHANGED=0\n",
      checkExit: "0",
      fixReport: "\n## Fix report\n",
    });
    assert.match(summary, /- run: 12 turns, \$1\.23, 95s\n- review-run: 2 turns, \$0\.10, 1s/);
    assert.match(summary, /\*\*After the review:\*\* confident=true\. All swaps verified\./);
    assert.match(
      summary,
      /\*\*PR:\*\* https:\/\/github\.com\/spectrocloud\/librarium\/pull\/42\n\n## Deploy preview test/
    );
    assert.doesNotMatch(summary, /Dry run/);
    assert.match(summary, /### Final diff check \(exit 0\)\n\n```text\nPROSE_CHANGED=0\n```/);
    assert.match(summary, /## Fix report\n$/);
  });

  it("says a dry run would merge when the preview passed and the agent was confident after the review and the preview", () => {
    const summary = jobSummary({
      caseName: "replay-nov02",
      count: 2,
      decisions: [
        { label: "After the review", decision: CONFIDENT },
        { label: "After the preview test", decision: CONFIDENT },
      ],
      diffCheck: "PROSE_CHANGED=0\nUNVERIFIED_LINKS=0\n",
      prBodyWritten: true,
      backportLabels: ["backport-version-4-7"],
      previewReport: "PASS 200 /a/",
      previewExit: "0",
      previewBase: "https://docs.spectrocloud.com",
    });
    assert.match(summary, /\*\*Dry run:\*\*/);
    assert.match(summary, /Backport labels: backport-version-4-7/);
    assert.match(summary, /Would merge once CI passes\./);
    assert.match(
      summary,
      /### Preview check \(exit 0\) against https:\/\/docs\.spectrocloud\.com\n\n```text\nPASS 200 \/a\/\n```/
    );
  });

  it("says a dry run would hand off when the merge step would", () => {
    const afterReview = (decision) => ({ label: "After the review", decision });
    const afterPreview = (decision) => ({ label: "After the preview test", decision });
    const notConfident = { ...CONFIDENT, confident: false };
    const input = {
      caseName: "replay-nov02",
      count: 1,
      prBodyWritten: true,
      previewExit: "0",
      previewBase: "https://docs.spectrocloud.com",
      decisions: [afterReview(CONFIDENT), afterPreview(CONFIDENT)],
    };
    assert.match(jobSummary(input), /Would merge once CI passes\./);
    for (const change of [
      { decisions: [afterReview(CONFIDENT), afterPreview(notConfident)] },
      { decisions: [afterReview(notConfident), afterPreview(CONFIDENT)] },
      { decisions: [afterReview(CONFIDENT)] },
      { decisions: [afterPreview(CONFIDENT)] },
      { previewExit: "1" },
      { previewBase: "" },
      { diffCheck: "PROSE_CHANGED=0\nUNVERIFIED_LINKS=1\n" },
      { diffCheck: "PROSE_CHANGED=0\nUNVERIFIED_LINKS=0\nSKIP_PATTERNS_ADDED=1\n" },
    ]) {
      assert.match(jobSummary({ ...input, ...change }), /Would hand off to a human\./, JSON.stringify(change));
    }
    assert.match(jobSummary({ ...input }), /Backport labels: none/);
  });

  it("says the PR update was skipped, and why", () => {
    const summary = jobSummary({
      caseName: "live",
      count: 2,
      prUrl: "https://github.com/spectrocloud/librarium/pull/42",
      skipComment: "A person has committed to the branch.\n",
      prBodyWritten: true,
    });
    assert.match(
      summary,
      /\*\*PR:\*\* https:\/\/github\.com\/spectrocloud\/librarium\/pull\/42\n\n\*\*Update skipped:\*\* A person has committed to the branch\.\n/
    );
    assert.doesNotMatch(summary, /Dry run|Outcome/);
  });

  it("leaves out the dry-run plan when no PR body was written", () => {
    const summary = jobSummary({ caseName: "live", count: 1, previewReport: "PASS", previewExit: "0" });
    assert.doesNotMatch(summary, /Dry run|Preview check/);
  });
});

describe("job-summary.mjs command line", () => {
  let work;
  beforeEach(() => {
    work = tempDir();
  });
  afterEach(() => fs.rmSync(work, { recursive: true, force: true }));

  const env = {
    CASE: "live",
    COUNT: "3",
    CHECK_EXIT: "0",
    PREVIEW_EXIT: "0",
    PREVIEW_BASE: "https://deploy-preview-42--docs-spectrocloud.netlify.app",
    PR_URL: "",
  };

  it("summarizes the run's files", () => {
    writeFiles(work, {
      "out/run.json": `${JSON.stringify(RESULT)}\n`,
      "out/review-run.json": JSON.stringify({ total_cost_usd: 0.05, num_turns: 3, duration_ms: 2000 }),
      "out/decision.json": JSON.stringify(CONFIDENT),
      "out/final-decision.json": "null\n",
      "out/pr-body.md": "# PR\n",
      "out/backport-labels.txt": "backport-version-4-7\nbackport-version-4-8\n",
      "out/diff-check.txt": "PROSE_CHANGED=0\nUNVERIFIED_LINKS=0\n",
      "out/preview-check.txt": "PASS 200 /a/\n",
      "out/fix-report.md": "## Fix report\n",
    });
    const result = runScript("job-summary.mjs", [work], { env });
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /^## Link fix agent: live\n\nBroken external links reported: \*\*3\*\*/);
    assert.match(result.stdout, /- run: 12 turns, \$1\.23, 95s\n- review-run: 3 turns, \$0\.05, 2s\n/);
    assert.match(result.stdout, /\*\*After the review:\*\* confident=true\. All swaps verified\./);
    // final-decision.json holds null, so it is left out, and the dry run hands off.
    assert.doesNotMatch(result.stdout, /After the preview test/);
    assert.match(result.stdout, /Backport labels: backport-version-4-7 backport-version-4-8/);
    assert.match(result.stdout, /Would hand off to a human\./);
    assert.match(result.stdout, /### Preview check \(exit 0\) against https:\/\/deploy-preview-42/);
    assert.match(result.stdout, /### Final diff check \(exit 0\)/);
    assert.match(result.stdout, /## Fix report\n$/);
  });

  it("prints the PR and its merge comment for a live run", () => {
    writeFiles(work, {
      "out/merge-comment.md": "**Outcome:** The agent merged this PR.\n",
      "out/pr-body.md": "# PR\n",
    });
    const result = runScript("job-summary.mjs", [work], { env: { ...env, PR_URL: "https://github.com/o/r/pull/42" } });
    assert.equal(result.status, 0, result.stderr);
    assert.match(
      result.stdout,
      /\*\*PR:\*\* https:\/\/github\.com\/o\/r\/pull\/42\n\n\*\*Outcome:\*\* The agent merged this PR\./
    );
    assert.doesNotMatch(result.stdout, /Dry run/);
  });

  it("says the PR update was skipped when open-pr.mjs left the PR alone", () => {
    writeFiles(work, {
      "out/skip-comment.md": "The link fix agent skipped this week's update to this PR.\n",
      "out/pr-body.md": "# PR\n",
    });
    const result = runScript("job-summary.mjs", [work], { env: { ...env, PR_URL: "https://github.com/o/r/pull/42" } });
    assert.equal(result.status, 0, result.stderr);
    assert.match(
      result.stdout,
      /\*\*PR:\*\* https:\/\/github\.com\/o\/r\/pull\/42\n\n\*\*Update skipped:\*\* The link fix agent skipped this week's update/
    );
  });

  it("prints placeholders when the run wrote no files", () => {
    const result = runScript("job-summary.mjs", [work], { env: { ...env, CHECK_EXIT: "" } });
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /### Final diff check \(exit not run\)\n\n```text\nnot run\n```\n\nNo fix report\.\n$/);
  });

  it("fails when a run's output is not valid JSON", () => {
    writeFiles(work, { "out/run.json": "Error: not logged in\n" });
    const result = runScript("job-summary.mjs", [work], { env });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /SyntaxError/);
  });
});
