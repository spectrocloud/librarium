#!/usr/bin/env node
// Commits the fix, pushes it to the rolling bot branch, and opens or updates its PR.
// It first turns off any auto-merge that an earlier run left on the open PR, so
// that only this run's merge step can turn it back on. When a person has
// committed to the open PR, it leaves that PR alone and comments why instead.
//
// Usage: node open-pr.mjs <work-dir>
// Env: GH_TOKEN (the Vault org token), PR_BRANCH, PR_TITLE, GITHUB_REPOSITORY.
// Reads <work-dir>/out/{pr-body.md,pr-comment.md,backport-labels.txt}.
// Sets the step output `url`, and `number` only when it pushed the fix.

import fs from "node:fs";
import path from "node:path";

import { isMain, readLines, readText, setEnv, setOutput } from "./lib/cli.mjs";
import { gh as runGh, git, run } from "./lib/run.mjs";
import { findSecrets } from "./lib/secrets.mjs";

// The notify-slack label goes on later, after the agent tests the deploy preview.
const ALWAYS_LABELS = ["small-pr", "not-urgent"];
// The bot commits as github-actions[bot], and so does the Pre-merge Prettier job.
const BOT_NAME = "github-actions[bot]";
export const BOT_EMAIL = "41898282+github-actions[bot]@users.noreply.github.com";

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

/**
 * Returns the number of the open PR from `branch` in this repository, or ""
 * when there is none. `gh pr list --head` matches the branch name only, so a
 * fork's PR from a branch with the same name is left out.
 */
export function findOpenPr({ branch, gh }) {
  const prs = JSON.parse(
    strictGh(gh)(["pr", "list", "--head", branch, "--state", "open", "--json", "number,isCrossRepository"])
  );
  return String(prs.find((pr) => !pr.isCrossRepository)?.number ?? "");
}

/** True when a commit on the PR has an author other than the bot, so a person has committed to the branch. */
export function hasHumanCommits({ pr, gh }) {
  const { commits } = JSON.parse(strictGh(gh)(["pr", "view", pr, "--json", "commits"]));
  return commits.some((commit) => commit.authors.some((author) => author.email !== BOT_EMAIL));
}

/** The comment that says why this run left the PR alone. */
export function skipComment(branch) {
  return `The link fix agent skipped this week's update to this PR, because a person has committed to \`${branch}\`. It did not push, retitle, relabel, or change auto-merge. The links it skipped come back in next week's report.\n`;
}

/**
 * Turns auto-merge off on the PR. gh can fail when auto-merge is already off,
 * so a failure counts only when the PR still has auto-merge on.
 */
export function disableAutoMerge({ pr, gh }) {
  if (gh(["pr", "merge", pr, "--disable-auto"]).code === 0) return;
  const stillOn = strictGh(gh)(["pr", "view", pr, "--json", "autoMergeRequest", "--jq", ".autoMergeRequest != null"]);
  if (stillOn !== "false") throw new Error(`Could not turn off auto-merge on PR #${pr}.`);
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

/**
 * Pushes the fix with `push`, opens or updates the PR from `branch`, and
 * returns { pr, skipped }. When a person has committed to the open PR, it only
 * comments on that PR, and returns its number with skipped set.
 * `out` holds pr-body.md, pr-comment.md, and backport-labels.txt.
 */
export function publishFix({ branch, title, out, repo, gh, push }) {
  const ghStrict = strictGh(gh);
  const open = findOpenPr({ branch, gh });
  if (open && hasHumanCommits({ pr: open, gh })) {
    const commentFile = path.join(out, "skip-comment.md");
    fs.writeFileSync(commentFile, skipComment(branch));
    ghStrict(["pr", "comment", open, "--body-file", commentFile]);
    console.log(`Skipped the update: a person has committed to PR #${open}.`);
    return { pr: open, skipped: true };
  }
  if (open) disableAutoMerge({ pr: open, gh });
  push();

  const pr = openOrUpdatePr({ branch, title, bodyFile: path.join(out, "pr-body.md"), repo, gh });
  ghStrict(["pr", "comment", pr, "--body-file", path.join(out, "pr-comment.md")]);
  setLabels({ pr, labels: prLabels(readLines(path.join(out, "backport-labels.txt"))), repo, gh });
  return { pr, skipped: false };
}

/**
 * Throws when any of the PR's texts, given as { name: text }, holds a
 * credential. The PR is public, and agents wrote parts of its text.
 */
export function refuseSecrets(texts) {
  for (const [name, text] of Object.entries(texts)) {
    const secrets = findSecrets(text);
    if (secrets.length) throw new Error(`${name} holds a credential (${secrets.join(", ")}), so no PR opens.`);
  }
}

// Command line.

/** Commits the working-tree fix and force-pushes it to `branch`, which the bot owns. */
function commitAndPush(branch, title, token) {
  git(".", "config", "user.name", BOT_NAME);
  git(".", "config", "user.email", BOT_EMAIL);
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
  refuseSecrets({
    "pr-body.md": readText(path.join(workDir, "out", "pr-body.md")),
    "pr-comment.md": readText(path.join(workDir, "out", "pr-comment.md")),
  });
  const { pr, skipped } = publishFix({
    branch: PR_BRANCH,
    title: PR_TITLE,
    out: path.join(workDir, "out"),
    repo: GITHUB_REPOSITORY,
    gh: runGh,
    push: () => commitAndPush(PR_BRANCH, PR_TITLE, GH_TOKEN),
  });
  // Without the number, the CI wait, preview, and merge steps skip.
  if (!skipped) {
    setOutput("number", pr);
    // The fix is committed now, so later diffs compare against master.
    setEnv("DIFF_BASE", "HEAD~1");
  }
  setOutput("url", strictGh(runGh)(["pr", "view", pr, "--json", "url", "--jq", ".url"]));
}

if (isMain(import.meta.url)) main(process.argv.slice(2));
