import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";

import { mergeBlockers, mergeComment, mergeOrHandOff, readDecision } from "../merge-or-hand-off.mjs";
import { tempDir, writeFiles } from "./helpers.mjs";

const PREVIEW = "https://deploy-preview-42--docs-spectrocloud.netlify.app";
const CONFIDENT = { confident: true, reason: "The preview shows every new link.", findings: [] };
const READY = {
  ciOk: true,
  previewBase: PREVIEW,
  previewExit: "0",
  reviewDecision: CONFIDENT,
  decision: CONFIDENT,
  diffCheck: "Changed files: 1  URLs removed: 1  URLs added: 1\nPROSE_CHANGED=0\nUNVERIFIED_LINKS=0\n",
};

/** A fake gh that answers each call with the next reply and records the arguments. */
function fakeGh(...replies) {
  const calls = [];
  const gh = (args) => {
    calls.push(args);
    return { code: 0, stdout: "", stderr: "", ...replies.shift() };
  };
  return { calls, gh };
}

describe("mergeBlockers", () => {
  it("returns no blockers when CI, the preview, and the agent all agree", () => {
    assert.deepEqual(mergeBlockers(READY), []);
  });

  it("blocks when a CI check failed", () => {
    assert.deepEqual(mergeBlockers({ ...READY, ciOk: false }), ["Not every CI check passed."]);
  });

  it("blocks when the preview did not build", () => {
    assert.deepEqual(mergeBlockers({ ...READY, previewBase: "" }), [
      "The Netlify deploy preview did not build, so the agent could not test it.",
    ]);
  });

  it("blocks when the preview check failed or did not run", () => {
    for (const previewExit of ["1", ""]) {
      assert.deepEqual(mergeBlockers({ ...READY, previewExit }), ["The deploy preview check failed or did not run."]);
    }
  });

  it("blocks when the agent did not finish its preview test", () => {
    assert.deepEqual(mergeBlockers({ ...READY, decision: null }), [
      "The agent did not finish its deploy preview test.",
    ]);
    assert.deepEqual(mergeBlockers({ ...READY, decision: { confident: true } }), [
      "The agent did not finish its deploy preview test.",
    ]);
  });

  it("blocks when the agent is not confident, and says why", () => {
    const decision = { confident: false, reason: "The Azure page redirects.", findings: [] };
    assert.deepEqual(mergeBlockers({ ...READY, decision }), ["The agent is not confident: The Azure page redirects."]);
  });

  it("blocks when the link checker could not verify a new URL", () => {
    const diffCheck = "  note: ERROR after 4 attempts: 403 https://example.com\nPROSE_CHANGED=0\nUNVERIFIED_LINKS=1\n";
    assert.deepEqual(mergeBlockers({ ...READY, diffCheck }), [
      "The link checker could not verify at least one new URL, so a human checks it.",
    ]);
  });

  it("does not block on a missing diff check output", () => {
    assert.deepEqual(mergeBlockers({ ...READY, diffCheck: undefined }), []);
  });

  it("blocks when the agent did not finish addressing the review", () => {
    for (const reviewDecision of [null, { confident: true }]) {
      assert.deepEqual(mergeBlockers({ ...READY, reviewDecision }), [
        "The agent did not finish addressing the review.",
      ]);
    }
  });

  it("blocks when the agent was not confident after the review, even if the preview test made it confident", () => {
    const reviewDecision = { confident: false, reason: "An SME should check the Azure guidance.", findings: [] };
    assert.deepEqual(mergeBlockers({ ...READY, reviewDecision }), [
      "After the review, the agent was not confident: An SME should check the Azure guidance.",
    ]);
  });

  it("lists every blocker at once", () => {
    const blockers = mergeBlockers({
      ciOk: false,
      previewBase: "",
      previewExit: "",
      reviewDecision: null,
      decision: null,
      diffCheck: "UNVERIFIED_LINKS=1",
    });
    assert.equal(blockers.length, 6);
  });
});

describe("readDecision", () => {
  let work;
  beforeEach(() => {
    work = tempDir();
  });
  afterEach(() => fs.rmSync(work, { recursive: true, force: true }));

  it("reads a decision", () => {
    writeFiles(work, { "decision.json": JSON.stringify(CONFIDENT, null, 2) });
    assert.deepEqual(readDecision(path.join(work, "decision.json")), CONFIDENT);
  });

  it("returns null when the file is missing, holds null, or is not JSON", () => {
    writeFiles(work, { "null.json": "null\n", "empty.json": "", "bad.json": "Error: not logged in\n" });
    for (const file of ["missing.json", "null.json", "empty.json", "bad.json"]) {
      assert.equal(readDecision(path.join(work, file)), null, file);
    }
  });
});

describe("mergeOrHandOff", () => {
  it("merges the PR when nothing blocks it", () => {
    const { calls, gh } = fakeGh({ code: 0 });
    assert.deepEqual(mergeOrHandOff({ pr: "42", blockers: [], gh }), {
      merged: true,
      outcome: "The agent merged this PR.",
    });
    assert.deepEqual(calls, [["pr", "merge", "42", "--squash"]]);
  });

  it("turns on auto-merge when the ruleset blocks the direct merge", () => {
    const { calls, gh } = fakeGh(
      { code: 1, stderr: "base branch policy prohibits the merge" },
      { code: 0 },
      { stdout: "true\n" }
    );
    const result = mergeOrHandOff({ pr: "42", blockers: [], gh });
    assert.equal(result.merged, false);
    assert.match(result.outcome, /turned on auto-merge/);
    assert.deepEqual(calls[1], ["pr", "merge", "42", "--squash", "--auto"]);
    assert.deepEqual(calls[2].slice(0, 3), ["pr", "view", "42"]);
  });

  it("hands off when neither the merge nor auto-merge worked", () => {
    const { gh } = fakeGh({ code: 1 }, { code: 1 }, { stdout: "false\n" });
    assert.deepEqual(mergeOrHandOff({ pr: "42", blockers: [], gh }), {
      merged: false,
      outcome: "The agent could not merge this PR or turn on auto-merge. A docs code owner approves and merges it.",
    });
  });

  it("hands off and turns auto-merge off when something blocks the merge", () => {
    const { calls, gh } = fakeGh({});
    const result = mergeOrHandOff({ pr: "42", blockers: ["Not every CI check passed."], gh });
    assert.deepEqual(result, {
      merged: false,
      outcome: "The agent handed this PR off. A docs code owner reviews, approves, and merges it.",
    });
    assert.deepEqual(calls, [["pr", "merge", "42", "--disable-auto"]]);
  });
});

describe("mergeComment", () => {
  it("reports the preview test, the agent's reason, and the outcome", () => {
    const comment = mergeComment({
      previewBase: PREVIEW,
      previewReport: "PASS 200 /a/\nPages checked: 1  Failed: 0\n\n",
      decision: CONFIDENT,
      outcome: "The agent merged this PR.",
      blockers: [],
    });
    assert.equal(
      comment,
      [
        "## Deploy preview test",
        `Preview: ${PREVIEW}`,
        "```text\nPASS 200 /a/\nPages checked: 1  Failed: 0\n```",
        "**The agent:** The preview shows every new link.",
        "**Outcome:** The agent merged this PR.\n",
      ].join("\n\n")
    );
  });

  it("lists the blockers, and leaves out a missing preview report and an invalid decision", () => {
    const comment = mergeComment({
      previewBase: "",
      previewReport: "",
      decision: null,
      outcome: "The agent handed this PR off.",
      blockers: ["Not every CI check passed.", "The agent did not finish its deploy preview test."],
    });
    assert.equal(
      comment,
      [
        "## Deploy preview test",
        "**Outcome:** The agent handed this PR off.",
        "- Not every CI check passed.\n- The agent did not finish its deploy preview test.\n",
      ].join("\n\n")
    );
  });
});
