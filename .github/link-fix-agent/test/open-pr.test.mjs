import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { addLabels, openOrUpdatePr, prLabels, setLabels, strictGh } from "../open-pr.mjs";

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

describe("setLabels", () => {
  const addCall = (labels) => [
    "api",
    "--method",
    "POST",
    `repos/${REPO}/issues/42/labels`,
    ...labels.flatMap((l) => ["-f", `labels[]=${l}`]),
  ];
  const deleteCall = (label) => ["api", "--method", "DELETE", `repos/${REPO}/issues/42/labels/${label}`];

  it("removes last week's backport labels that the new set leaves out, and keeps every other label", () => {
    const current = "small-pr\nnot-urgent\nnotify-slack\nbackport-version-4-7\nbackport-version-4-8\nauto-backport\n";
    const { calls, gh } = fakeGh({ stdout: current }, {}, {});
    const labels = prLabels(["backport-version-4-8"]);
    setLabels({ pr: "42", labels, repo: REPO, gh });
    assert.deepEqual(calls, [
      ["pr", "view", "42", "--json", "labels", "--jq", ".labels[].name"],
      deleteCall("backport-version-4-7"),
      addCall(labels),
    ]);
  });

  it("removes auto-backport too when no version branch takes the new fix", () => {
    const { calls, gh } = fakeGh({ stdout: "small-pr\nauto-backport\nbackport-version-4-7\n" }, {}, {}, {});
    setLabels({ pr: "42", labels: prLabels([]), repo: REPO, gh });
    assert.deepEqual(calls.slice(1), [
      deleteCall("auto-backport"),
      deleteCall("backport-version-4-7"),
      addCall(["small-pr", "not-urgent"]),
    ]);
  });

  it("only adds the labels to a new PR", () => {
    const { calls, gh } = fakeGh({ stdout: "" }, {});
    setLabels({ pr: "42", labels: prLabels(["backport-version-4-7"]), repo: REPO, gh });
    assert.deepEqual(calls.slice(1), [addCall(prLabels(["backport-version-4-7"]))]);
  });

  it("throws, and adds nothing, when gh cannot remove a label", () => {
    const { calls, gh } = fakeGh({ stdout: "backport-version-4-7\n" }, { code: 1, stderr: "HTTP 403: Forbidden" });
    assert.throws(() => setLabels({ pr: "42", labels: prLabels([]), repo: REPO, gh }), /HTTP 403: Forbidden/);
    assert.equal(calls.length, 2);
  });

  it("throws when gh cannot read the PR's labels", () => {
    const { gh } = fakeGh({ code: 1, stderr: "no pull requests found" });
    assert.throws(() => setLabels({ pr: "42", labels: prLabels([]), repo: REPO, gh }), /gh pr view failed/);
  });
});
