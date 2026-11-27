import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { PREVIEW_CHECK, parseChecks, previewUrl, summarizeChecks, waitForChecks } from "../wait-for-ci.mjs";

const TABLE = [
  "Build\tpass\t2m\thttps://github.com/x/1",
  "Vale\tskipping\t0\thttps://github.com/x/2",
  `${PREVIEW_CHECK}\tpass\t0\thttps://app.netlify.com/x`,
  "",
].join("\n");

describe("parseChecks", () => {
  it("reads each check's name and state from the tab-separated table", () => {
    assert.deepEqual(parseChecks(TABLE), [
      { name: "Build", state: "pass" },
      { name: "Vale", state: "skipping" },
      { name: PREVIEW_CHECK, state: "pass" },
    ]);
  });

  it("returns no checks for an empty table", () => {
    assert.deepEqual(parseChecks(""), []);
  });
});

describe("summarizeChecks", () => {
  it("passes when every check passed or was skipped, and sees the preview build", () => {
    assert.deepEqual(summarizeChecks(parseChecks(TABLE)), { allPassed: true, previewBuilt: true });
  });

  it("fails when a check failed or is still pending", () => {
    for (const state of ["fail", "pending", "cancel"]) {
      const checks = [
        { name: "Build", state },
        { name: PREVIEW_CHECK, state: "pass" },
      ];
      assert.deepEqual(summarizeChecks(checks), { allPassed: false, previewBuilt: true }, state);
    }
  });

  it("fails when there are no checks", () => {
    assert.deepEqual(summarizeChecks([]), { allPassed: false, previewBuilt: false });
  });

  it("does not see the preview when its check failed or is missing", () => {
    assert.equal(summarizeChecks([{ name: PREVIEW_CHECK, state: "fail" }]).previewBuilt, false);
    assert.equal(summarizeChecks([{ name: "Build", state: "pass" }]).previewBuilt, false);
  });
});

describe("previewUrl", () => {
  it("returns the Netlify deploy preview URL", () => {
    assert.equal(previewUrl(42), "https://deploy-preview-42--docs-spectrocloud.netlify.app");
  });
});

describe("waitForChecks", () => {
  /** A fake gh that answers each `gh pr checks` with the next reply and repeats the last one. */
  function fakeGh(...replies) {
    const calls = [];
    const gh = (args) => {
      calls.push(args);
      return replies.length > 1 ? replies.shift() : replies[0];
    };
    return { calls, gh };
  }
  const done = { code: 0, stdout: TABLE, stderr: "" };
  const pending = { code: 8, stdout: "Build\tpending\t0\t\n", stderr: "" };
  const unregistered = { code: 1, stdout: "", stderr: "no checks reported on the 'bot/fix-broken-links' branch" };

  it("returns the table as soon as the checks are done", async () => {
    const { calls, gh } = fakeGh(done);
    const waits = [];
    const result = await waitForChecks(42, { gh, wait: async (ms) => waits.push(ms) });
    assert.deepEqual(result, { table: TABLE, timedOut: false });
    assert.deepEqual(calls, [["pr", "checks", "42"]]);
    assert.deepEqual(waits, []);
  });

  it("polls while a check is pending", async () => {
    const { calls, gh } = fakeGh(pending, pending, done);
    const waits = [];
    const result = await waitForChecks(42, { gh, wait: async (ms) => waits.push(ms), pollMs: 5 });
    assert.equal(result.timedOut, false);
    assert.equal(calls.length, 3);
    assert.deepEqual(waits, [5, 5]);
  });

  it("polls until the checks have registered", async () => {
    const { calls, gh } = fakeGh(unregistered, done);
    const result = await waitForChecks(42, { gh, wait: async () => {} });
    assert.deepEqual(result, { table: TABLE, timedOut: false });
    assert.equal(calls.length, 2);
  });

  it("returns the table of a failed check without waiting, so the caller sees the failure", async () => {
    const failed = { code: 1, stdout: "Build\tfail\t1m\t\n", stderr: "" };
    const { gh } = fakeGh(failed);
    assert.deepEqual(await waitForChecks(42, { gh, wait: async () => assert.fail("no wait") }), {
      table: failed.stdout,
      timedOut: false,
    });
  });

  it("times out after maxPolls and returns the last table", async () => {
    const { calls, gh } = fakeGh(pending);
    const result = await waitForChecks(42, { gh, wait: async () => {}, maxPolls: 3 });
    assert.deepEqual(result, { table: pending.stdout, timedOut: true });
    assert.equal(calls.length, 3);
  });

  it("times out with an empty table when the checks never registered", async () => {
    const { gh } = fakeGh(unregistered);
    assert.deepEqual(await waitForChecks(42, { gh, wait: async () => {}, maxPolls: 2 }), { table: "", timedOut: true });
  });
});
