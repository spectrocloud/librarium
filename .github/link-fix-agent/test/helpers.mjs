// Fixtures that the command-line tests share: temporary folders, git repos, and script runs.

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const AGENT_DIR = fileURLToPath(new URL("..", import.meta.url));

/** Creates an empty temporary folder. The caller removes it. */
export function tempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "link-fix-test-"));
}

/** Writes `files` ({ "path/in/dir": "text" }) under `dir`. */
export function writeFiles(dir, files) {
  for (const [file, text] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
    fs.writeFileSync(path.join(dir, file), text);
  }
}

/** Runs git in `dir` and throws when it fails. Signing and hooks are off, so a developer's config cannot interfere. */
export function git(dir, ...args) {
  const result = spawnSync(
    "git",
    ["-c", "user.name=Test", "-c", "user.email=test@example.com", "-c", "commit.gpgsign=false", ...args],
    { cwd: dir, encoding: "utf8" }
  );
  if (result.status !== 0) throw new Error(`git ${args.join(" ")} failed: ${result.stderr}`);
  return result.stdout;
}

/** Creates a temporary git repo with `files` in its first commit. */
export function makeRepo(files) {
  const dir = tempDir();
  git(dir, "init", "-q", "-b", "master");
  writeFiles(dir, files);
  git(dir, "add", "-A");
  git(dir, "-c", "core.hooksPath=/dev/null", "commit", "-qm", "init");
  return dir;
}

/** Runs one of the agent's scripts with Node and returns { status, stdout, stderr }. */
export function runScript(script, args, { cwd, env } = {}) {
  return spawnSync(process.execPath, [path.join(AGENT_DIR, script), ...args], {
    cwd,
    env: { ...process.env, ...env },
    encoding: "utf8",
  });
}
