// Runs git, gh, and vale without a shell, so arguments are never re-parsed.

import { spawnSync } from "node:child_process";

/**
 * Runs `command` and returns its exit code and output. It does not throw on a
 * non-zero exit, so the caller decides what a failure means.
 */
export function run(command, args, { cwd, env } = {}) {
  const result = spawnSync(command, args, {
    cwd,
    env: { ...process.env, ...env },
    encoding: "utf8",
    maxBuffer: 256 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  return { code: result.status, stdout: result.stdout, stderr: result.stderr };
}

/** Runs git in `repo` and returns its output. Throws when git fails. */
export function git(repo, ...args) {
  const { code, stdout, stderr } = run("git", ["-C", repo, ...args]);
  if (code !== 0) throw new Error(`git ${args.join(" ")} failed: ${stderr.trim()}`);
  return stdout;
}

/** Runs gh and returns its exit code and output. Throws only when gh cannot start. */
export function gh(args) {
  return run("gh", args);
}
