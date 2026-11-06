// Small helpers for the scripts' command-line entry points.

import fs from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * True when the module is the script that Node started, not an import (from a
 * test, for example). Both paths are resolved, because Node resolves symlinks
 * in the module URL but not in the script argument. Without that, a script
 * started through a symlink would skip its checks and exit 0.
 */
export function isMain(moduleUrl) {
  if (!process.argv[1]) return false;
  try {
    return fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(moduleUrl));
  } catch {
    return false;
  }
}

/** Reads a text file, or returns `fallback` when it does not exist. */
export function readText(file, fallback = "") {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : fallback;
}

/** Reads a file with one value per line and drops blank lines. */
export function readLines(file) {
  return readText(file)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Writes one value per line, with a final newline unless there are no values. */
export function writeLines(file, values) {
  fs.writeFileSync(file, values.map((value) => `${value}\n`).join(""));
}

/** Sets a step output, as `echo "name=value" >> "$GITHUB_OUTPUT"` would. */
export function setOutput(name, value) {
  appendKeyValue(process.env.GITHUB_OUTPUT, name, value);
}

/** Sets an environment variable for the job's later steps, as `>> "$GITHUB_ENV"` would. */
export function setEnv(name, value) {
  appendKeyValue(process.env.GITHUB_ENV, name, value);
}

function appendKeyValue(file, name, value) {
  if (file) fs.appendFileSync(file, `${name}=${value}\n`);
}
