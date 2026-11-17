// Fixtures that the tests share: temporary folders, git repos, script runs, and fake credentials.

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const AGENT_DIR = fileURLToPath(new URL("..", import.meta.url));

/**
 * Fake credentials, one of each kind that lib/secrets.mjs finds. They are
 * built at run time, so the repo holds no credential-shaped text for gitleaks
 * to flag.
 */
export const FAKE = {
  anthropic: "sk-ant-" + "a".repeat(30),
  github: "ghp_" + "b".repeat(36),
  githubFineGrained: "github_pat_" + "c".repeat(40),
  privateKey: privateKeyWith("d"),
};

/** Builds a fake private key block whose base64 body repeats `fill`, so two fills give two different keys. */
export function privateKeyWith(fill) {
  const label = ["RSA", "PRIVATE", "KEY"].join(" ");
  return `-----BEGIN ${label}-----\n${fill.repeat(64)}\n-----END ${label}-----`;
}

/**
 * Asserts that one line of `text`, without its surrounding whitespace, is exactly
 * `expected`. It compares plain text, so URLs need no regex escaping.
 */
export function assertLine(text, expected) {
  const found = text.split("\n").some((line) => line.trim() === expected);
  assert.ok(found, `Expected the line ${JSON.stringify(expected)} in:\n${text}`);
}

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
