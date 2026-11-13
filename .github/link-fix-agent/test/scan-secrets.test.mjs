import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";

import { filesWithSecrets, listFiles } from "../scan-secrets.mjs";
import { FAKE, runScript, tempDir, writeFiles } from "./helpers.mjs";

let dir;
beforeEach(() => {
  dir = tempDir();
});
afterEach(() => fs.rmSync(dir, { recursive: true, force: true }));

describe("listFiles", () => {
  it("lists every file in nested folders, and leaves out the folders", () => {
    writeFiles(dir, { "a.txt": "a", "out/b.json": "{}", "out/deeper/c.jsonl": "" });
    fs.mkdirSync(path.join(dir, "empty"));
    assert.deepEqual(
      listFiles(dir).sort(),
      ["a.txt", "out/b.json", "out/deeper/c.jsonl"].map((file) => path.join(dir, file)).sort()
    );
  });

  it("returns nothing for a folder that does not exist", () => {
    assert.deepEqual(listFiles(path.join(dir, "missing")), []);
  });

  it("returns nothing for an empty folder", () => {
    assert.deepEqual(listFiles(dir), []);
  });
});

describe("filesWithSecrets", () => {
  const texts = {
    "out/fix-report.md": "## Fixed\n",
    "out/research-0.jsonl": `{"text":"${FAKE.anthropic}"}\n`,
    "review/review.md": `${FAKE.github}\n${FAKE.privateKey}\n`,
  };
  const readFile = (file) => texts[file];

  it("returns each file that holds a credential, with the kinds found", () => {
    assert.deepEqual(filesWithSecrets(Object.keys(texts), readFile), [
      { file: "out/research-0.jsonl", secrets: ["Anthropic API key"] },
      { file: "review/review.md", secrets: ["GitHub token", "private key"] },
    ]);
  });

  it("returns nothing when no file holds a credential", () => {
    assert.deepEqual(filesWithSecrets(["out/fix-report.md"], readFile), []);
    assert.deepEqual(filesWithSecrets([], readFile), []);
  });

  it("reads the files from disk by default", () => {
    writeFiles(dir, { "leak.txt": FAKE.githubFineGrained, "clean.txt": "clean" });
    const files = [path.join(dir, "leak.txt"), path.join(dir, "clean.txt")];
    assert.deepEqual(filesWithSecrets(files), [
      { file: path.join(dir, "leak.txt"), secrets: ["GitHub fine-grained token"] },
    ]);
  });
});

describe("scan-secrets.mjs command line", () => {
  const exists = (file) => fs.existsSync(path.join(dir, file));

  it("deletes each file that holds a credential, keeps the others, and exits 1", () => {
    writeFiles(dir, {
      "out/fix-report.md": "## Fixed\n",
      "out/transcripts/research-0.jsonl": `{"text":"${FAKE.anthropic}"}\n`,
      "review/review.md": `token ${FAKE.github}\n`,
      "review/notes.md": "No findings.\n",
    });
    const result = runScript("scan-secrets.mjs", [path.join(dir, "out"), path.join(dir, "review")]);
    assert.equal(result.status, 1, result.stderr);
    assert.equal(exists("out/transcripts/research-0.jsonl"), false);
    assert.equal(exists("review/review.md"), false);
    assert.equal(exists("out/fix-report.md"), true);
    assert.equal(exists("review/notes.md"), true);
    const research = path.join(dir, "out/transcripts/research-0.jsonl");
    const review = path.join(dir, "review/review.md");
    assert.equal(
      result.stdout.split("\n").sort().join("\n"),
      [
        "",
        `::error::Deleted ${research}, which held: Anthropic API key.`,
        `::error::Deleted ${review}, which held: GitHub token.`,
      ].join("\n")
    );
  });

  it("exits 0 and deletes nothing when no file holds a credential", () => {
    writeFiles(dir, { "out/fix-report.md": "## Fixed\n", "out/research-0.jsonl": "{}\n" });
    const result = runScript("scan-secrets.mjs", [dir]);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout, "");
    assert.equal(exists("out/fix-report.md"), true);
    assert.equal(exists("out/research-0.jsonl"), true);
  });

  it("exits 0 for a folder that does not exist, or no folder at all", () => {
    assert.equal(runScript("scan-secrets.mjs", [path.join(dir, "missing")]).status, 0);
    assert.equal(runScript("scan-secrets.mjs", []).status, 0);
  });
});
