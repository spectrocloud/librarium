#!/usr/bin/env node
// Commits the fix, pushes it to the rolling bot branch, and opens or updates its PR.
// It first turns off any auto-merge that an earlier run left on the open PR, so
// that only this run's merge step can turn it back on.
//
// Usage: node open-pr.mjs <work-dir>
// Env: GH_TOKEN (the Vault org token), PR_BRANCH, PR_TITLE, GITHUB_REPOSITORY.
// Reads <work-dir>/out/{pr-body.md,pr-comment.md,backport-labels.txt}.
// Sets the step outputs `number` and `url`.

import path from "node:path";

import { isMain, readLines, setOutput } from "./lib/cli.mjs";
import { gh as runGh, git, run } from "./lib/run.mjs";

// The notify-slack label goes on later, after the agent tests the deploy preview.
const ALWAYS_LABELS = ["small-pr", "not-urgent"];

/** Returns the labels for the PR. The Backport workflow acts only when auto-backport is present too. */
export function prLabels(backportLabels) {
  return [...ALWAYS_LABELS, ...backportLabels, ...(backportLabels.length ? ["auto-backport"] : [])];
}

/** Wraps a gh runner so that a failed command throws with its error output. */
export function strictGh(gh) {
  return (args) => {
    const { code, stdout, stderr } = gh(args);
    if (code !== 0) throw new Error(`gh ${args.slice(0, 2).join(" ")} failed: ${stderr.trim()}`);
    return stdout.trim();
  };
}

/** Returns the number of the open PR from `branch`, or "" when there is none. */
export function findOpenPr({ branch, gh }) {
  return strictGh(gh)([
    "pr",
    "list",
    "--head",
    branch,
    "--state",
    "open",
    "--json",
    "number",
    "--jq",
    ".[0].number // empty",
  ]);
}

/**
 * Turns auto-merge off on the open PR from `branch`, if there is one. gh can
 * fail when auto-merge is already off, so a failure counts only when the PR
 * still has auto-merge on.
 */
export function disableAutoMerge({ branch, gh }) {
  const number = findOpenPr({ branch, gh });
  if (!number || gh(["pr", "merge", number, "--disable-auto"]).code === 0) return;
  const stillOn = strictGh(gh)([
    "pr",
    "view",
    number,
    "--json",
    "autoMergeRequest",
    "--jq",
    ".autoMergeRequest != null",
  ]);
  if (stillOn !== "false") throw new Error(`Could not turn off auto-merge on PR #${number}.`);
}

/** Opens a PR from `branch`, or updates the open one, and returns its number. */
export function openOrUpdatePr({ branch, title, bodyFile, repo, gh }) {
  const ghStrict = strictGh(gh);
  let number = findOpenPr({ branch, gh });
  if (number) {
    ghStrict([
      "api",
      "--method",
      "PATCH",
      `repos/${repo}/pulls/${number}`,
      "-f",
      `title=${title}`,
      "-F",
      `body=@${bodyFile}`,
    ]);
    console.log(`Updated the open PR #${number}.`);
  } else {
    ghStrict(["pr", "create", "--base", "master", "--head", branch, "--title", title, "--body-file", bodyFile]);
    number = findOpenPr({ branch, gh });
  }
  if (!number) throw new Error(`Could not find the PR for ${branch}.`);
  return number;
}

/** Adds labels to a PR. */
export function addLabels({ pr, labels, repo, gh }) {
  strictGh(gh)([
    "api",
    "--method",
    "POST",
    `repos/${repo}/issues/${pr}/labels`,
    ...labels.flatMap((l) => ["-f", `labels[]=${l}`]),
  ]);
}

/**
 * Adds `labels` to a PR, and removes the backport labels it already has that
 * `labels` leaves out. The rolling PR can still carry last week's labels, and
 * the Backport workflow acts on every one of them.
 */
export function setLabels({ pr, labels, repo, gh }) {
  const ghStrict = strictGh(gh);
  const current = ghStrict(["pr", "view", pr, "--json", "labels", "--jq", ".labels[].name"]).split("\n");
  const isBackportLabel = (label) => label === "auto-backport" || label.startsWith("backport-");
  for (const label of current.filter((l) => isBackportLabel(l) && !labels.includes(l))) {
    ghStrict(["api", "--method", "DELETE", `repos/${repo}/issues/${pr}/labels/${encodeURIComponent(label)}`]);
  }
  addLabels({ pr, labels, repo, gh });
}

// Command line.

/** Commits the working-tree fix and force-pushes it to `branch`, which the bot owns. */
function commitAndPush(branch, title, token) {
  git(".", "config", "user.name", "github-actions[bot]");
  git(".", "config", "user.email", "41898282+github-actions[bot]@users.noreply.github.com");
  git(".", "checkout", "-B", branch);
  git(".", "commit", "-qam", title);
  // The checkout kept no credentials, so the token goes on this one command.
  // run(), not git(), so that a failure never prints the encoded token.
  const auth = Buffer.from(`x-access-token:${token}`).toString("base64");
  const header = `http.https://github.com/.extraheader=AUTHORIZATION: basic ${auth}`;
  const push = run("git", ["-c", header, "push", "--force", "origin", `HEAD:refs/heads/${branch}`]);
  if (push.code !== 0) throw new Error(`git push to ${branch} failed: ${push.stderr.trim()}`);
}

function main([workDir]) {
  const { GH_TOKEN, PR_BRANCH, PR_TITLE, GITHUB_REPOSITORY } = process.env;
  const out = path.join(workDir, "out");
  disableAutoMerge({ branch: PR_BRANCH, gh: runGh });
  commitAndPush(PR_BRANCH, PR_TITLE, GH_TOKEN);

  const repo = GITHUB_REPOSITORY;
  const pr = openOrUpdatePr({
    branch: PR_BRANCH,
    title: PR_TITLE,
    bodyFile: path.join(out, "pr-body.md"),
    repo,
    gh: runGh,
  });
  strictGh(runGh)(["pr", "comment", pr, "--body-file", path.join(out, "pr-comment.md")]);
  setLabels({ pr, labels: prLabels(readLines(path.join(out, "backport-labels.txt"))), repo, gh: runGh });

  setOutput("number", pr);
  setOutput("url", strictGh(runGh)(["pr", "view", pr, "--json", "url", "--jq", ".url"]));
}

if (isMain(import.meta.url)) main(process.argv.slice(2));
