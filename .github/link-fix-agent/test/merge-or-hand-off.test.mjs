import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { mergeBlockers, mergeComment, mergeOrHandOff } from "../merge-or-hand-off.mjs";

const PREVIEW = "https://deploy-preview-42--docs-spectrocloud.netlify.app";
const CONFIDENT = { confident: true, reason: "The preview shows every new link.", findings: [] };
const READY = { ciOk: true, previewBase: PREVIEW, previewExit: "0", decision: CONFIDENT };

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

  it("lists every blocker at once", () => {
    assert.equal(mergeBlockers({ ciOk: false, previewBase: "", previewExit: "", decision: null }).length, 4);
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
