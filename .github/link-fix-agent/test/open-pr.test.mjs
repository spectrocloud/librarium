import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { addLabels, openOrUpdatePr, prLabels, strictGh } from "../open-pr.mjs";

const REPO = "spectrocloud/librarium";
const BRANCH = "bot/fix-broken-links";

/** A fake gh that answers each call with the next reply and records the arguments. */
function fakeGh(...replies) {
  const calls = [];
  const gh = (args) => {
    calls.push(args);
    return { code: 0, stdout: "", stderr: "", ...replies.shift() };
  };
  return { calls, gh };
}

describe("prLabels", () => {
  it("adds the backport labels and auto-backport", () => {
    assert.deepEqual(prLabels(["backport-version-4-7"]), [
      "small-pr",
      "not-urgent",
      "backport-version-4-7",
      "auto-backport",
    ]);
  });

  it("leaves out auto-backport when there are no backport labels", () => {
    assert.deepEqual(prLabels([]), ["small-pr", "not-urgent"]);
  });
});

describe("strictGh", () => {
  it("returns gh's trimmed output", () => {
    const { gh } = fakeGh({ stdout: "12\n" });
    assert.equal(strictGh(gh)(["pr", "list"]), "12");
  });

  it("throws with gh's error output when gh fails", () => {
    const { gh } = fakeGh({ code: 1, stderr: "HTTP 401: Bad credentials\n" });
    assert.throws(() => strictGh(gh)(["pr", "create", "--title", "x"]), {
      message: "gh pr create failed: HTTP 401: Bad credentials",
    });
  });
});

describe("openOrUpdatePr", () => {
  const options = { branch: BRANCH, title: "docs: fix broken links", bodyFile: "/work/out/pr-body.md", repo: REPO };

  it("updates the open PR's title and body", (t) => {
    const log = t.mock.method(console, "log", () => {});
    const { calls, gh } = fakeGh({ stdout: "42\n" }, {});
    assert.equal(openOrUpdatePr({ ...options, gh }), "42");
    assert.equal(calls.length, 2);
    assert.deepEqual(calls[0].slice(0, 7), ["pr", "list", "--head", BRANCH, "--state", "open", "--json"]);
    assert.deepEqual(calls[1], [
      "api",
      "--method",
      "PATCH",
      `repos/${REPO}/pulls/42`,
      "-f",
      "title=docs: fix broken links",
      "-F",
      "body=@/work/out/pr-body.md",
    ]);
    assert.deepEqual(log.mock.calls[0].arguments, ["Updated the open PR #42."]);
  });

  it("opens a PR against master when none is open, and returns its number", () => {
    const { calls, gh } = fakeGh({ stdout: "" }, {}, { stdout: "43\n" });
    assert.equal(openOrUpdatePr({ ...options, gh }), "43");
    assert.deepEqual(calls[1], [
      "pr",
      "create",
      "--base",
      "master",
      "--head",
      BRANCH,
      "--title",
      "docs: fix broken links",
      "--body-file",
      "/work/out/pr-body.md",
    ]);
    assert.equal(calls[2][1], "list");
  });

  it("throws when the new PR cannot be found", () => {
    const { gh } = fakeGh({ stdout: "" }, {}, { stdout: "" });
    assert.throws(() => openOrUpdatePr({ ...options, gh }), { message: `Could not find the PR for ${BRANCH}.` });
  });

  it("throws when gh cannot create the PR", () => {
    const { calls, gh } = fakeGh({ stdout: "" }, { code: 1, stderr: "a pull request already exists" });
    assert.throws(() => openOrUpdatePr({ ...options, gh }), /gh pr create failed: a pull request already exists/);
    assert.equal(calls.length, 2);
  });

  it("throws when gh cannot list the PRs", () => {
    const { gh } = fakeGh({ code: 4, stderr: "authentication required" });
    assert.throws(() => openOrUpdatePr({ ...options, gh }), /gh pr list failed: authentication required/);
  });
});

describe("addLabels", () => {
  it("adds every label in one API call", () => {
    const { calls, gh } = fakeGh({});
    addLabels({ pr: "42", labels: ["small-pr", "auto-backport"], repo: REPO, gh });
    assert.deepEqual(calls, [
      [
        "api",
        "--method",
        "POST",
        `repos/${REPO}/issues/42/labels`,
        "-f",
        "labels[]=small-pr",
        "-f",
        "labels[]=auto-backport",
      ],
    ]);
  });

  it("throws when gh fails", () => {
    const { gh } = fakeGh({ code: 1, stderr: "Label does not exist" });
    assert.throws(
      () => addLabels({ pr: "42", labels: ["x"], repo: REPO, gh }),
      /gh api --method failed: Label does not exist/
    );
  });
});
