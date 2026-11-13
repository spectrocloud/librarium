import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { afterEach, beforeEach, describe, it } from "node:test";

import { isMain, readLines, readText, setEnv, setOutput } from "../lib/cli.mjs";
import { AGENT_DIR, tempDir, writeFiles } from "./helpers.mjs";

let dir;
beforeEach(() => {
  dir = tempDir();
});
afterEach(() => fs.rmSync(dir, { recursive: true, force: true }));

describe("isMain", () => {
  let argv1;
  let cwd;
  beforeEach(() => {
    argv1 = process.argv[1];
    cwd = process.cwd();
    // isMain compares real paths, so the scripts must exist.
    writeFiles(dir, { "script.mjs": "", "other.mjs": "" });
  });
  afterEach(() => {
    process.argv[1] = argv1;
    process.chdir(cwd);
  });

  it("is true for the script that Node started", () => {
    process.argv[1] = path.join(dir, "script.mjs");
    assert.equal(isMain(pathToFileURL(path.join(dir, "script.mjs")).href), true);
  });

  it("resolves a relative script path against the working directory", () => {
    process.chdir(dir);
    process.argv[1] = "script.mjs";
    assert.equal(isMain(pathToFileURL(path.join(dir, "script.mjs")).href), true);
  });

  it("is false for a module that another script imports", () => {
    process.argv[1] = path.join(dir, "script.mjs");
    assert.equal(isMain(pathToFileURL(path.join(dir, "other.mjs")).href), false);
  });

  it("is false when the script path does not exist", () => {
    process.argv[1] = path.join(dir, "missing.mjs");
    assert.equal(isMain(pathToFileURL(path.join(dir, "script.mjs")).href), false);
  });

  it("is false when Node started no script, as in a REPL", () => {
    process.argv[1] = undefined;
    assert.equal(isMain(pathToFileURL(path.join(dir, "script.mjs")).href), false);
  });

  // Node resolves symlinks in import.meta.url but not in process.argv[1]. Run through a
  // symlink (macOS /tmp -> /private/tmp, for example), a script skips main() and exits 0,
  // so a check such as check-link-fix-diff.mjs passes without checking anything.
  it("runs a script that Node started through a symlinked path", () => {
    const link = path.join(dir, "agent");
    fs.symlinkSync(AGENT_DIR, link);
    // agent-run.mjs fails on a missing output file, but only when its main() runs.
    const result = spawnSync(process.execPath, [path.join(link, "agent-run.mjs"), path.join(dir, "missing.json")]);
    assert.notEqual(result.status, 0);
  });
});

describe("readText", () => {
  it("reads a file", () => {
    writeFiles(dir, { "a.txt": "hello\n" });
    assert.equal(readText(path.join(dir, "a.txt")), "hello\n");
  });

  it("returns the fallback, or an empty string, when the file does not exist", () => {
    assert.equal(readText(path.join(dir, "missing.txt"), "none"), "none");
    assert.equal(readText(path.join(dir, "missing.txt")), "");
  });
});

describe("readLines", () => {
  it("returns the trimmed lines without blank ones", () => {
    writeFiles(dir, { "labels.txt": "backport-version-4-7\n\n  backport-version-4-8  \n\n" });
    assert.deepEqual(readLines(path.join(dir, "labels.txt")), ["backport-version-4-7", "backport-version-4-8"]);
  });

  it("returns an empty list for a missing or empty file", () => {
    writeFiles(dir, { "empty.txt": "" });
    assert.deepEqual(readLines(path.join(dir, "missing.txt")), []);
    assert.deepEqual(readLines(path.join(dir, "empty.txt")), []);
  });
});

describe("setOutput and setEnv", () => {
  let saved;
  beforeEach(() => {
    saved = { GITHUB_OUTPUT: process.env.GITHUB_OUTPUT, GITHUB_ENV: process.env.GITHUB_ENV };
  });
  afterEach(() => {
    for (const [name, value] of Object.entries(saved)) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  });

  it("appends name=value lines to the GITHUB_OUTPUT and GITHUB_ENV files", () => {
    process.env.GITHUB_OUTPUT = path.join(dir, "output");
    process.env.GITHUB_ENV = path.join(dir, "env");
    setOutput("number", 12);
    setOutput("url", "https://github.com/o/r/pull/12");
    setEnv("PREVIEW_BASE", "https://preview.example.com");
    assert.equal(fs.readFileSync(path.join(dir, "output"), "utf8"), "number=12\nurl=https://github.com/o/r/pull/12\n");
    assert.equal(fs.readFileSync(path.join(dir, "env"), "utf8"), "PREVIEW_BASE=https://preview.example.com\n");
  });

  it("does nothing outside GitHub Actions, where the files are not set", () => {
    delete process.env.GITHUB_OUTPUT;
    delete process.env.GITHUB_ENV;
    assert.doesNotThrow(() => {
      setOutput("ok", "true");
      setEnv("PREVIEW_BASE", "x");
    });
    assert.deepEqual(fs.readdirSync(dir), []);
  });
});
