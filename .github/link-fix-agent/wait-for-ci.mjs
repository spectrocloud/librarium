#!/usr/bin/env node
// Waits for every check on the bot PR to finish, including the Netlify deploy preview.
//
// Usage: node wait-for-ci.mjs <pr-number> <checks-file>
// Env: GH_TOKEN.
// Writes the final `gh pr checks` table to <checks-file>. Sets the step output
// ok=true when every check passed, and PREVIEW_BASE for the later steps when
// the deploy preview built.

import fs from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

import { isMain, setEnv, setOutput } from "./lib/cli.mjs";
import { gh as runGh } from "./lib/run.mjs";

export const PREVIEW_CHECK = "netlify/docs-spectrocloud/deploy-preview";
// gh pr checks exits 8 while a check is pending.
const PENDING_EXIT_CODE = 8;
const PASSING_STATES = new Set(["pass", "skipping"]);

/** Parses the tab-separated table that `gh pr checks` prints when it is not on a terminal. */
export function parseChecks(table) {
  return table
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [name, state] = line.split("\t");
      return { name, state };
    });
}

/** Reports whether every check passed and whether the deploy preview built. */
export function summarizeChecks(checks) {
  return {
    allPassed: checks.length > 0 && checks.every((check) => PASSING_STATES.has(check.state)),
    previewBuilt: checks.some((check) => check.name === PREVIEW_CHECK && check.state === "pass"),
  };
}

/** Returns the Netlify deploy preview URL for a PR. */
export function previewUrl(pr) {
  return `https://deploy-preview-${pr}--docs-spectrocloud.netlify.app`;
}

/**
 * Polls `gh pr checks` until the checks have registered and none is pending.
 * Returns the last table, and timedOut when the checks never finished.
 */
export async function waitForChecks(pr, { gh, wait = (ms) => sleep(ms), pollMs = 60_000, maxPolls = 60 }) {
  let last = { stdout: "" };
  for (let poll = 0; poll < maxPolls; poll++) {
    last = gh(["pr", "checks", String(pr)]);
    const registered = !/no checks reported/.test(`${last.stdout}${last.stderr}`);
    if (registered && last.code !== PENDING_EXIT_CODE) return { table: last.stdout, timedOut: false };
    await wait(pollMs);
  }
  return { table: last.stdout, timedOut: true };
}

// Command line.

async function main([pr, checksFile]) {
  const { table, timedOut } = await waitForChecks(pr, { gh: runGh });
  fs.writeFileSync(checksFile, table);
  console.log(table);
  if (timedOut) console.log("::warning::CI did not finish in time.");

  const { allPassed, previewBuilt } = summarizeChecks(parseChecks(table));
  if (allPassed && !timedOut) setOutput("ok", "true");
  if (previewBuilt) setEnv("PREVIEW_BASE", previewUrl(pr));
}

if (isMain(import.meta.url)) await main(process.argv.slice(2));
