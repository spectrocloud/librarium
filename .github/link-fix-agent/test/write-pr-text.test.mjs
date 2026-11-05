import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";

import { backportNote, diffCheckFlags, prBody, reviewComment, reviewSummary } from "../write-pr-text.mjs";
import { makeRepo, runScript, tempDir, writeFiles } from "./helpers.mjs";

const CONFIDENT = { confident: true, reason: "Every swap matches the vendor's redirect.", findings: [] };
const NOT_CONFIDENT = { confident: false, reason: "Check the new Azure URL.", findings: [] };

describe("reviewSummary", () => {
  it("says the agent is confident and why", () => {
    assert.equal(
      reviewSummary(CONFIDENT),
      "After the review, the agent is confident in these changes. Every swap matches the vendor's redirect."
    );
  });

  it("says the agent is not confident and what to check", () => {
    assert.equal(
      reviewSummary(NOT_CONFIDENT),
      "After the review, the agent is not confident in these changes. What to check: Check the new Azure URL."
    );
  });
});

describe("diffCheckFlags", () => {
  it("returns a note for each flag that is on", () => {
    const flags = diffCheckFlags("Changed files: 1\nPROSE_CHANGED=1\nUNVERIFIED_LINKS=1\n");
    assert.equal(flags.length, 2);
    assert.equal(flags[0], "- The agent changed text beyond URL swaps.");
    assert.match(flags[1], /could not verify at least one new URL/);
  });

  it("returns no notes when the flags are off, missing, or not on their own line", () => {
    assert.deepEqual(diffCheckFlags("PROSE_CHANGED=0\nUNVERIFIED_LINKS=0"), []);
    assert.deepEqual(diffCheckFlags(""), []);
    assert.deepEqual(diffCheckFlags("  note: PROSE_CHANGED=1 was here"), []);
  });
});

describe("backportNote", () => {
  it("lists the backport labels", () => {
    assert.equal(
      backportNote(["backport-version-4-7", "backport-version-4-8"], []),
      "Added `auto-backport` and `backport-version-4-7` `backport-version-4-8`, where the fix applies cleanly."
    );
  });

  it("says when no branch takes the fix, and lists the manual backports", () => {
    assert.equal(
      backportNote([], ["version-4-6", "version-4-7"]),
      "No version branch takes the fix cleanly. Manual backport needed: version-4-6 version-4-7."
    );
  });
});

describe("prBody", () => {
  const input = {
    fixReport: "\n## Fix report\n\n| URL | New URL |\n",
    decision: CONFIDENT,
    diffCheck: "PROSE_CHANGED=1\nUNVERIFIED_LINKS=0",
    backportLabels: ["backport-version-4-7"],
    manualBackports: [],
    changedFiles: ["docs/docs-content/a.md", "_partials/x/_b.mdx"],
    reviewModel: "claude-haiku-test",
  };

  it("fills the PR template with the review, flags, fix report, and changed files", () => {
    const body = prBody(input);
    assert.match(body, /^# ✅ Pull Request Checklist/);
    assert.match(body, /pr-review-buddy ran on `claude-haiku-test`/);
    assert.match(body, /_Added `auto-backport` and `backport-version-4-7`, where the fix applies cleanly\._/);
    assert.match(body, /\*\*Review:\*\* After the review, the agent is confident in these changes\./);
    assert.match(body, /- The agent changed text beyond URL swaps\.\n\n## Fix report\n\n\| URL \| New URL \|\n\n---/);
    assert.match(body, /## 💻 Changed Pages\n\n- `docs\/docs-content\/a\.md`\n- `_partials\/x\/_b\.mdx`\n/);
    assert.match(body, /🤖 Generated with \[Claude Code\]\(https:\/\/claude\.com\/claude-code\)\n$/);
  });

  it("puts the fix report right after the merge plan when no flag is on", () => {
    const body = prBody({ ...input, diffCheck: "PROSE_CHANGED=0" });
    assert.doesNotMatch(body, /The agent changed text/);
    assert.match(body, /hands the PR to a human\.\n\n## Fix report/);
  });
});

describe("reviewComment", () => {
  it("includes the review report and the agent's response to each finding", () => {
    const decision = {
      ...CONFIDENT,
      findings: [
        { finding: "Typo in the link text.", action: "fixed", note: "Fixed the typo." },
        { finding: "Use a shorter URL.", action: "declined", note: "The vendor's canonical URL is long." },
      ],
    };
    const comment = reviewComment({ review: "\nNo blockers.\n\n", decision, reviewModel: "claude-haiku-test" });
    assert.match(comment, /pr-review-buddy ran on `claude-haiku-test`/);
    assert.match(comment, /<summary>Review report<\/summary>\n\nNo blockers\.\n\n<\/details>/);
    assert.match(comment, /- \*\*FIXED:\*\* Typo in the link text\.\n {2}- Fixed the typo\./);
    assert.match(comment, /- \*\*DECLINED:\*\* Use a shorter URL\.\n {2}- The vendor's canonical URL is long\./);
  });

  it("says when there were no findings", () => {
    assert.match(reviewComment({ review: "x", decision: CONFIDENT, reviewModel: "m" }), /No findings to address\.\n$/);
  });

  it("throws when the decision has no findings list", () => {
    assert.throws(() => reviewComment({ review: "x", decision: { confident: true, reason: "r" }, reviewModel: "m" }));
  });
});

describe("write-pr-text.mjs command line", () => {
  let repo;
  let work;
  beforeEach(() => {
    // The script lists the changed files with git in its working directory.
    repo = makeRepo({ "docs/docs-content/a.md": "[a](https://old.example.com)\n", "README.md": "x\n" });
    writeFiles(repo, { "docs/docs-content/a.md": "[a](https://new.example.com)\n" });
    work = tempDir();
  });
  afterEach(() => {
    fs.rmSync(repo, { recursive: true, force: true });
    fs.rmSync(work, { recursive: true, force: true });
  });

  const writeText = () =>
    runScript("write-pr-text.mjs", [work], { cwd: repo, env: { REVIEW_MODEL: "claude-haiku-test" } });
  const read = (file) => fs.readFileSync(path.join(work, "out", file), "utf8");

  it("writes the PR body and review comment from the run's files", () => {
    writeFiles(work, {
      "out/fix-report.md": "## Fix report\n",
      "out/decision.json": JSON.stringify({
        confident: false,
        reason: "Check the Azure URL.",
        findings: [{ finding: "Wrong anchor.", action: "fixed", note: "Dropped it." }],
      }),
      "out/diff-check.txt": "PROSE_CHANGED=0\nUNVERIFIED_LINKS=1\n",
      "out/backport-labels.txt": "backport-version-4-7\n",
      "out/manual-backports.txt": "version-4-6\n",
      "review/review.md": "Looks fine.\n",
    });
    const result = writeText();
    assert.equal(result.status, 0, result.stderr);

    const body = read("pr-body.md");
    assert.match(body, /What to check: Check the Azure URL\./);
    assert.match(body, /could not verify at least one new URL/);
    assert.match(body, /`backport-version-4-7`, where the fix applies cleanly\. Manual backport needed: version-4-6\./);
    assert.match(body, /## 💻 Changed Pages\n\n- `docs\/docs-content\/a\.md`\n\n---/);
    assert.match(body, /## Fix report/);

    const comment = read("pr-comment.md");
    assert.match(comment, /Looks fine\./);
    assert.match(comment, /- \*\*FIXED:\*\* Wrong anchor\.\n {2}- Dropped it\./);
  });

  it("falls back to placeholder text when the optional files are missing", () => {
    writeFiles(work, { "out/decision.json": JSON.stringify(CONFIDENT) });
    const result = writeText();
    assert.equal(result.status, 0, result.stderr);
    assert.match(read("pr-body.md"), /No fix report\./);
    assert.match(read("pr-body.md"), /No version branch takes the fix cleanly\./);
    assert.match(read("pr-comment.md"), /The reviewer wrote no report\./);
  });

  it("fails when decision.json is missing", () => {
    fs.mkdirSync(path.join(work, "out"));
    const result = writeText();
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /ENOENT.*decision\.json/);
    assert.equal(fs.existsSync(path.join(work, "out", "pr-body.md")), false);
  });

  it("fails when the working directory is not a git repo", () => {
    writeFiles(work, { "out/decision.json": JSON.stringify(CONFIDENT) });
    const result = runScript("write-pr-text.mjs", [work], { cwd: work, env: { REVIEW_MODEL: "m" } });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /git diff --name-only HEAD failed/);
  });
});
