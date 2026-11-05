import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  classifyBranch,
  compareVersions,
  removedUrls,
  supportedBranches,
  versionNumbers,
} from "../backport-labels.mjs";

const OLD = "https://old.example.com/guide";
const NEW = "https://new.example.com/guide";

describe("removedUrls", () => {
  it("returns the URLs on removed lines that no added line holds", () => {
    const patch = `diff --git a/docs/a.md b/docs/a.md
--- a/docs/a.md
+++ b/docs/a.md
@@ -1,2 +1,2 @@
-See [the guide](${OLD}) and [keep](https://keep.example.com).
+See [the guide](${NEW}) and [keep](https://keep.example.com).
 Unchanged [link](https://context.example.com).
`;
    assert.deepEqual(removedUrls(patch), [OLD]);
  });

  it("collects removed URLs across files, sorted", () => {
    const patch = [
      "diff --git a/docs/a.md b/docs/a.md",
      "--- a/docs/a.md",
      "+++ b/docs/a.md",
      "@@ -1 +0,0 @@",
      "-[z](https://z.example.com)",
      "diff --git a/_partials/x/_b.mdx b/_partials/x/_b.mdx",
      "--- a/_partials/x/_b.mdx",
      "+++ b/_partials/x/_b.mdx",
      "@@ -1 +0,0 @@",
      "-[a](https://a.example.com)",
    ].join("\n");
    assert.deepEqual(removedUrls(patch), ["https://a.example.com", "https://z.example.com"]);
  });

  it("returns an empty list for a patch that only adds URLs, or an empty patch", () => {
    assert.deepEqual(removedUrls(`--- a/docs/a.md\n+++ b/docs/a.md\n+[new](${NEW})\n`), []);
    assert.deepEqual(removedUrls(""), []);
  });

  it("finds a URL on a removed line whose text starts with two dashes", () => {
    const patch = `--- a/docs/a.md\n+++ b/docs/a.md\n@@ -1 +1 @@\n---registry ${OLD}\n+--registry ${NEW}\n`;
    assert.deepEqual(removedUrls(patch), [OLD]);
  });
});

describe("versionNumbers", () => {
  it("returns the branch's version numbers", () => {
    assert.deepEqual(versionNumbers("version-4-10"), [4, 10]);
    assert.deepEqual(versionNumbers("version-4"), [4]);
  });
});

describe("compareVersions", () => {
  it("sorts by number, so version-4-10 comes after version-4-9", () => {
    assert.ok(compareVersions("version-4-10", "version-4-9") > 0);
    assert.ok(compareVersions("version-4-9", "version-4-10") < 0);
    assert.ok(compareVersions("version-5-0", "version-4-10") > 0);
  });

  it("treats a missing number as zero", () => {
    assert.equal(compareVersions("version-4", "version-4-0"), 0);
    assert.equal(compareVersions("version-4-7", "version-4-7"), 0);
  });
});

describe("supportedBranches", () => {
  const branches = [
    "version-4-10",
    "master",
    "version-4-6",
    "version-4-7",
    "version-4-9",
    "version-4-8-hotfix",
    "version-x",
  ];

  it("returns the version branches at or after the oldest, oldest first", () => {
    assert.deepEqual(supportedBranches(branches, "version-4-7"), ["version-4-7", "version-4-9", "version-4-10"]);
  });

  it("returns an empty list when no branch is new enough, or there are no branches", () => {
    assert.deepEqual(supportedBranches(branches, "version-5-0"), []);
    assert.deepEqual(supportedBranches([], "version-4-7"), []);
  });

  it("returns an empty list when the oldest branch name has no numbers", () => {
    assert.deepEqual(supportedBranches(branches, "version-latest"), []);
  });
});

describe("classifyBranch", () => {
  it("labels a branch where the patch applies, whether or not it still has a removed URL", () => {
    assert.equal(classifyBranch({ patchApplies: true, hasRemovedUrl: true }), "label");
    assert.equal(classifyBranch({ patchApplies: true, hasRemovedUrl: false }), "label");
  });

  it("asks for a manual backport when the patch does not apply but a removed URL is still there", () => {
    assert.equal(classifyBranch({ patchApplies: false, hasRemovedUrl: true }), "manual");
  });

  it("does nothing when the patch does not apply and no removed URL is there", () => {
    assert.equal(classifyBranch({ patchApplies: false, hasRemovedUrl: false }), "none");
  });
});
