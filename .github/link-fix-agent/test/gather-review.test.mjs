import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { addedLineNumbers, addedLinesFileName, alertsOnLines, versionedLinkSplits } from "../gather-review.mjs";

const DIFF = `diff --git a/docs/a.md b/docs/a.md
index 1111111..2222222 100644
--- a/docs/a.md
+++ b/docs/a.md
@@ -1,4 +1,5 @@
 # Title
-Old [link](https://old.example.com).
+New [link](https://new.example.com).
+An added line.
 Unchanged.
 More.
@@ -20,3 +21,3 @@ ## Section
 Context.
-Old line.
+New line.
 End.
diff --git a/docs/new.md b/docs/new.md
new file mode 100644
index 0000000..3333333
--- /dev/null
+++ b/docs/new.md
@@ -0,0 +1,2 @@
+First.
+Second.
\\ No newline at end of file
`;

describe("addedLineNumbers", () => {
  it("returns the new line numbers of a file's added lines, across hunks", () => {
    assert.deepEqual(addedLineNumbers(DIFF, "docs/a.md"), [2, 3, 22]);
  });

  it("numbers a new file's lines from 1", () => {
    assert.deepEqual(addedLineNumbers(DIFF, "docs/new.md"), [1, 2]);
  });

  it("returns an empty list for a file that the diff does not change, or an empty diff", () => {
    assert.deepEqual(addedLineNumbers(DIFF, "docs/other.md"), []);
    assert.deepEqual(addedLineNumbers("", "docs/a.md"), []);
  });

  it("returns an empty list for a file whose diff only removes lines", () => {
    const diff = "--- a/docs/a.md\n+++ b/docs/a.md\n@@ -1,2 +1,1 @@\n Keep.\n-Gone.\n";
    assert.deepEqual(addedLineNumbers(diff, "docs/a.md"), []);
  });

  it("counts an added Markdown front matter fence as an added line, not a file header", () => {
    const diff = "--- a/docs/a.md\n+++ b/docs/a.md\n@@ -1,0 +1,2 @@\n+---\n+title: x\n";
    assert.deepEqual(addedLineNumbers(diff, "docs/a.md"), [1, 2]);
  });
});

describe("alertsOnLines", () => {
  const vale = [
    "docs/a.md:2:5:Vale.Spelling:Did you really mean 'teh'?",
    "docs/a.md:4:1:Google.Passive:In general, use active voice.",
    "docs/a.md:22:10:Google.We:Try to avoid using first-person plural.",
  ].join("\n");

  it("keeps the alerts on the given lines", () => {
    assert.equal(
      alertsOnLines(vale, [2, 22]),
      "docs/a.md:2:5:Vale.Spelling:Did you really mean 'teh'?\ndocs/a.md:22:10:Google.We:Try to avoid using first-person plural."
    );
  });

  it("returns an empty string when no alert is on the lines, or Vale printed nothing", () => {
    assert.equal(alertsOnLines(vale, [3]), "");
    assert.equal(alertsOnLines(vale, []), "");
    assert.equal(alertsOnLines("", [1]), "");
  });
});

describe("versionedLinkSplits", () => {
  it("flags a paragraph that starts with <VersionedLink after a line that ends mid-sentence", () => {
    const text = 'Refer to the\n\n<VersionedLink text="guide" url="/clusters/" /> for details.\n';
    assert.deepEqual(versionedLinkSplits(text, "docs/a.md"), [
      'docs/a.md:3: <VersionedLink text="guide" url="/clusters/" /> for details.',
    ]);
  });

  it("flags an indented <VersionedLink", () => {
    const text = '1. Refer to the\n\n   <VersionedLink text="guide" url="/a/" /> page.\n';
    assert.equal(versionedLinkSplits(text, "docs/a.md").length, 1);
  });

  it("does not flag a <VersionedLink after a sentence, heading, tag, table row, code fence, or front matter", () => {
    for (const before of ["Done.", "Note:", "Really!", "Why?", "## Next steps", "</Tabs>", "| a | b |", "```", "---"]) {
      const text = `${before}\n\n<VersionedLink text="guide" url="/a/" />\n`;
      assert.deepEqual(versionedLinkSplits(text, "docs/a.md"), [], before);
    }
  });

  it("does not flag a <VersionedLink on the first line or inside a paragraph", () => {
    assert.deepEqual(versionedLinkSplits('<VersionedLink text="a" url="/a/" />\n', "docs/a.md"), []);
    assert.deepEqual(versionedLinkSplits('Refer to the\n<VersionedLink text="a" url="/a/" />\n', "docs/a.md"), []);
  });

  it("returns an empty list for text without VersionedLink", () => {
    assert.deepEqual(versionedLinkSplits("Refer to the\n\nguide.\n", "docs/a.md"), []);
    assert.deepEqual(versionedLinkSplits("", "docs/a.md"), []);
  });
});

describe("addedLinesFileName", () => {
  it("flattens the path into one file name", () => {
    assert.equal(addedLinesFileName("docs/docs-content/clusters/a.md"), "docs__docs-content__clusters__a.md.txt");
    assert.equal(addedLinesFileName("README.md"), "README.md.txt");
  });
});
