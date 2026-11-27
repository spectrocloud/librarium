import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { after, before, describe, it } from "node:test";

import { gh, git, run } from "../lib/run.mjs";
import { makeRepo, tempDir, writeFiles } from "./helpers.mjs";

describe("run", () => {
  it("returns the exit code and output", () => {
    const result = run(process.execPath, ["-e", "console.log('out'); console.error('err')"]);
    assert.deepEqual(result, { code: 0, stdout: "out\n", stderr: "err\n" });
  });

  it("returns a non-zero exit code instead of throwing", () => {
    assert.equal(run(process.execPath, ["-e", "process.exit(3)"]).code, 3);
  });

  it("passes arguments without a shell, so they are never re-parsed", () => {
    const { stdout } = run(process.execPath, ["-e", "console.log(process.argv[1])", "$(echo hi); rm -rf /"]);
    assert.equal(stdout, "$(echo hi); rm -rf /\n");
  });

  it("adds `env` to the current environment and runs in `cwd`", () => {
    const dir = fs.realpathSync(tempDir());
    try {
      const script = "console.log(process.env.LINK_FIX_TEST, Boolean(process.env.PATH), process.cwd())";
      const { stdout } = run(process.execPath, ["-e", script], { cwd: dir, env: { LINK_FIX_TEST: "yes" } });
      assert.equal(stdout, `yes true ${dir}\n`);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it("throws when the command cannot start", () => {
    assert.throws(() => run("link-fix-no-such-command", []), { code: "ENOENT" });
  });
});

describe("git", () => {
  let repo;
  before(() => {
    repo = makeRepo({ "docs/a.md": "hello\n" });
  });
  after(() => fs.rmSync(repo, { recursive: true, force: true }));

  it("returns git's output", () => {
    assert.equal(git(repo, "show", "HEAD:docs/a.md"), "hello\n");
  });

  it("throws with git's error output when git fails", () => {
    assert.throws(() => git(repo, "show", "HEAD:docs/missing.md"), /git show HEAD:docs\/missing\.md failed: .+/);
  });
});

describe("gh", () => {
  // A fake gh on PATH, so the test never calls GitHub.
  let bin;
  let oldPath;
  before(() => {
    bin = tempDir();
    writeFiles(bin, { gh: '#!/bin/sh\necho "args: $*"\necho "oops" >&2\nexit 4\n' });
    fs.chmodSync(path.join(bin, "gh"), 0o755);
    oldPath = process.env.PATH;
    process.env.PATH = `${bin}${path.delimiter}${oldPath}`;
  });
  after(() => {
    process.env.PATH = oldPath;
    fs.rmSync(bin, { recursive: true, force: true });
  });

  it("runs gh with the arguments and returns its exit code and output without throwing", () => {
    assert.deepEqual(gh(["pr", "view", "12"]), { code: 4, stdout: "args: pr view 12\n", stderr: "oops\n" });
  });
});
