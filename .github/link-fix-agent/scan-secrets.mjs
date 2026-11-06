#!/usr/bin/env node
// Keeps credentials out of the public artifacts.
//
// Runs before the upload. Every file under the given folders that holds a
// credential is deleted, so it never uploads, and the step fails so that a
// person investigates.
//
// Usage: node scan-secrets.mjs <dir> ...
// Exit 0: no credentials found. Exit 1: files were deleted.

import fs from "node:fs";
import path from "node:path";

import { isMain } from "./lib/cli.mjs";
import { findSecrets } from "./lib/secrets.mjs";

/** Lists every file under `dir`, or nothing when `dir` does not exist. */
export function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(entry.parentPath, entry.name));
}

/** Returns each file that holds a credential, with the kinds found. */
export function filesWithSecrets(files, readFile = (file) => fs.readFileSync(file, "utf8")) {
  return files
    .map((file) => ({ file, secrets: findSecrets(readFile(file)) }))
    .filter(({ secrets }) => secrets.length > 0);
}

// Command line.

function main(dirs) {
  const found = filesWithSecrets(dirs.flatMap(listFiles));
  for (const { file, secrets } of found) {
    fs.rmSync(file);
    console.log(`::error::Deleted ${file}, which held: ${secrets.join(", ")}.`);
  }
  return found.length ? 1 : 0;
}

if (isMain(import.meta.url)) process.exitCode = main(process.argv.slice(2));
