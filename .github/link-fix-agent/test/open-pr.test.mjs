import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";

import {
  BOT_EMAIL,
  addLabels,
  disableAutoMerge,
  findOpenPr,
  hasHumanCommits,
  openOrUpdatePr,
  prLabels,
  publishFix,
  refuseSecrets,
  setLabels,
  skipComment,
  strictGh,
} from "../open-pr.mjs";
import { FAKE, runScript, tempDir, writeFiles } from "./helpers.mjs";

const REPO = "spectrocloud/librarium";
const BRANCH = "bot/fix-broken-links";
const LIST_CALL = ["pr", "list", "--head", BRANCH, "--state", "open", "--json", "number,isCrossRepository"];

/** A `gh pr list` reply that lists `prs`. */
const listReply = (...prs) => ({ stdout: `${JSON.stringify(prs)}\n` });
const BOT_PR = { number: 42, isCrossRepository: false };
const FORK_PR = { number: 50, isCrossRepository: true };

const BOT = { name: "github-actions[bot]", email: BOT_EMAIL, login: "github-actions" };
const PERSON = { name: "A Writer", email: "writer@example.com", login: "writer" };
/** A `gh pr view --json commits` reply with one commit for each list of authors. */
const commitsReply = (...authorLists) => ({
  stdout: JSON.stringify({ commits: authorLists.map((authors, i) => ({ oid: `c${i}`, authors })) }),
});

/** A fake gh that answers each call with the next reply and records the arguments. */
function fakeGh(...replies) {
  const calls = [];
  const gh = (args) => {
    calls.push(args);
    return { code: 0, stdout: "", stderr: "", ...replies.shift() };
  };
  return { calls, gh };
}

describe("prLabels", () => {
  it("adds the backport labels and auto-backport", () => {
    assert.deepEqual(prLabels(["backport-version-4-7"]), [
      "small-pr",
      "not-urgent",
      "backport-version-4-7",
      "auto-backport",
    ]);
  });

  it("leaves out auto-backport when there are no backport labels", () => {
    assert.deepEqual(prLabels([]), ["small-pr", "not-urgent"]);
  });
});

describe("strictGh", () => {
  it("returns gh's trimmed output", () => {
    const { gh } = fakeGh({ stdout: "12\n" });
    assert.equal(strictGh(gh)(["pr", "list"]), "12");
  });

  it("throws with gh's error output when gh fails", () => {
    const { gh } = fakeGh({ code: 1, stderr: "HTTP 401: Bad credentials\n" });
    assert.throws(() => strictGh(gh)(["pr", "create", "--title", "x"]), {
      message: "gh pr create failed: HTTP 401: Bad credentials",
    });
  });
});

describe("findOpenPr", () => {
  it("returns the number of the open PR from the branch", () => {
    const { calls, gh } = fakeGh(listReply(BOT_PR));
    assert.equal(findOpenPr({ branch: BRANCH, gh }), "42");
    assert.deepEqual(calls, [LIST_CALL]);
  });

  it("returns an empty string when no PR is open", () => {
    const { gh } = fakeGh(listReply());
    assert.equal(findOpenPr({ branch: BRANCH, gh }), "");
  });

  it("skips a fork's PR from a branch with the same name, even when gh lists it first", () => {
    const { gh } = fakeGh(listReply(FORK_PR, BOT_PR));
    assert.equal(findOpenPr({ branch: BRANCH, gh }), "42");
  });

  it("returns an empty string when only a fork's PR is open", () => {
    const { gh } = fakeGh(listReply(FORK_PR));
    assert.equal(findOpenPr({ branch: BRANCH, gh }), "");
  });

  it("throws when gh cannot list the PRs", () => {
    const { gh } = fakeGh({ code: 4, stderr: "authentication required" });
    assert.throws(() => findOpenPr({ branch: BRANCH, gh }), /gh pr list failed: authentication required/);
  });
});

describe("hasHumanCommits", () => {
  it("is false when the bot, or the Pre-merge Prettier job as the bot, made every commit", () => {
    const { calls, gh } = fakeGh(commitsReply([BOT], [BOT]));
    assert.equal(hasHumanCommits({ pr: "42", gh }), false);
    assert.deepEqual(calls, [["pr", "view", "42", "--json", "commits"]]);
  });

  it("is true when a person made a commit", () => {
    const { gh } = fakeGh(commitsReply([BOT], [PERSON]));
    assert.equal(hasHumanCommits({ pr: "42", gh }), true);
  });

  it("is true when a person co-authored a commit", () => {
    const { gh } = fakeGh(commitsReply([BOT, PERSON]));
    assert.equal(hasHumanCommits({ pr: "42", gh }), true);
  });

  it("is true for a commit with the bot's name but another email", () => {
    const { gh } = fakeGh(commitsReply([{ ...BOT, email: "someone@example.com" }]));
    assert.equal(hasHumanCommits({ pr: "42", gh }), true);
  });

  it("throws when gh cannot read the commits", () => {
    const { gh } = fakeGh({ code: 1, stderr: "HTTP 502" });
    assert.throws(() => hasHumanCommits({ pr: "42", gh }), /gh pr view failed: HTTP 502/);
  });
});

describe("disableAutoMerge", () => {
  const DISABLE = ["pr", "merge", "42", "--disable-auto"];

  it("turns off auto-merge on the PR", () => {
    const { calls, gh } = fakeGh({ code: 0 });
    disableAutoMerge({ pr: "42", gh });
    assert.deepEqual(calls, [DISABLE]);
  });

  it("ignores a failure when auto-merge is already off", () => {
    const { calls, gh } = fakeGh({ code: 1, stderr: "auto-merge is not enabled" }, { stdout: "false\n" });
    disableAutoMerge({ pr: "42", gh });
    assert.deepEqual(calls, [
      DISABLE,
      ["pr", "view", "42", "--json", "autoMergeRequest", "--jq", ".autoMergeRequest != null"],
    ]);
  });

  it("throws when auto-merge is still on after the failure", () => {
    const { gh } = fakeGh({ code: 1, stderr: "HTTP 403: Forbidden" }, { stdout: "true\n" });
    assert.throws(() => disableAutoMerge({ pr: "42", gh }), { message: "Could not turn off auto-merge on PR #42." });
  });

  it("throws when gh cannot tell whether auto-merge is still on", () => {
    const { gh } = fakeGh({ code: 1 }, { code: 1, stderr: "HTTP 502" });
    assert.throws(() => disableAutoMerge({ pr: "42", gh }), /gh pr view failed: HTTP 502/);
  });
});

describe("openOrUpdatePr", () => {
  const options = { branch: BRANCH, title: "docs: fix broken links", bodyFile: "/work/out/pr-body.md", repo: REPO };
  const createCall = [
    "pr",
    "create",
    "--base",
    "master",
    "--head",
    BRANCH,
    "--title",
    "docs: fix broken links",
    "--body-file",
    "/work/out/pr-body.md",
  ];

  it("updates the open PR's title and body", (t) => {
    const log = t.mock.method(console, "log", () => {});
    const { calls, gh } = fakeGh(listReply(BOT_PR), {});
    assert.equal(openOrUpdatePr({ ...options, gh }), "42");
    assert.deepEqual(calls, [
      LIST_CALL,
      [
        "api",
        "--method",
        "PATCH",
        `repos/${REPO}/pulls/42`,
        "-f",
        "title=docs: fix broken links",
        "-F",
        "body=@/work/out/pr-body.md",
      ],
    ]);
    assert.deepEqual(log.mock.calls[0].arguments, ["Updated the open PR #42."]);
  });

  it("opens a PR against master when none is open, and returns its number", () => {
    const { calls, gh } = fakeGh(listReply(), {}, listReply({ number: 43, isCrossRepository: false }));
    assert.equal(openOrUpdatePr({ ...options, gh }), "43");
    assert.deepEqual(calls, [LIST_CALL, createCall, LIST_CALL]);
  });

  it("opens its own PR instead of updating a fork's PR from a branch with the same name", () => {
    const { calls, gh } = fakeGh(listReply(FORK_PR), {}, listReply(FORK_PR, { number: 43, isCrossRepository: false }));
    assert.equal(openOrUpdatePr({ ...options, gh }), "43");
    assert.deepEqual(calls, [LIST_CALL, createCall, LIST_CALL]);
  });

  it("throws when the new PR cannot be found", () => {
    const { gh } = fakeGh(listReply(), {}, listReply());
    assert.throws(() => openOrUpdatePr({ ...options, gh }), { message: `Could not find the PR for ${BRANCH}.` });
  });

  it("throws when gh cannot create the PR", () => {
    const { calls, gh } = fakeGh(listReply(), { code: 1, stderr: "a pull request already exists" });
    assert.throws(() => openOrUpdatePr({ ...options, gh }), /gh pr create failed: a pull request already exists/);
    assert.equal(calls.length, 2);
  });

  it("throws when gh cannot list the PRs", () => {
    const { gh } = fakeGh({ code: 4, stderr: "authentication required" });
    assert.throws(() => openOrUpdatePr({ ...options, gh }), /gh pr list failed: authentication required/);
  });
});

describe("addLabels", () => {
  it("adds every label in one API call", () => {
    const { calls, gh } = fakeGh({});
    addLabels({ pr: "42", labels: ["small-pr", "auto-backport"], repo: REPO, gh });
    assert.deepEqual(calls, [
      [
        "api",
        "--method",
        "POST",
        `repos/${REPO}/issues/42/labels`,
        "-f",
        "labels[]=small-pr",
        "-f",
        "labels[]=auto-backport",
      ],
    ]);
  });

  it("throws when gh fails", () => {
    const { gh } = fakeGh({ code: 1, stderr: "Label does not exist" });
    assert.throws(
      () => addLabels({ pr: "42", labels: ["x"], repo: REPO, gh }),
      /gh api --method failed: Label does not exist/
    );
  });
});

describe("setLabels", () => {
  const addCall = (labels) => [
    "api",
    "--method",
    "POST",
    `repos/${REPO}/issues/42/labels`,
    ...labels.flatMap((l) => ["-f", `labels[]=${l}`]),
  ];
  const deleteCall = (label) => ["api", "--method", "DELETE", `repos/${REPO}/issues/42/labels/${label}`];

  it("removes last week's backport labels that the new set leaves out, and keeps every other label", () => {
    const current = "small-pr\nnot-urgent\nnotify-slack\nbackport-version-4-7\nbackport-version-4-8\nauto-backport\n";
    const { calls, gh } = fakeGh({ stdout: current }, {}, {});
    const labels = prLabels(["backport-version-4-8"]);
    setLabels({ pr: "42", labels, repo: REPO, gh });
    assert.deepEqual(calls, [
      ["pr", "view", "42", "--json", "labels", "--jq", ".labels[].name"],
      deleteCall("backport-version-4-7"),
      addCall(labels),
    ]);
  });

  it("removes auto-backport too when no version branch takes the new fix", () => {
    const { calls, gh } = fakeGh({ stdout: "small-pr\nauto-backport\nbackport-version-4-7\n" }, {}, {}, {});
    setLabels({ pr: "42", labels: prLabels([]), repo: REPO, gh });
    assert.deepEqual(calls.slice(1), [
      deleteCall("auto-backport"),
      deleteCall("backport-version-4-7"),
      addCall(["small-pr", "not-urgent"]),
    ]);
  });

  it("only adds the labels to a new PR", () => {
    const { calls, gh } = fakeGh({ stdout: "" }, {});
    setLabels({ pr: "42", labels: prLabels(["backport-version-4-7"]), repo: REPO, gh });
    assert.deepEqual(calls.slice(1), [addCall(prLabels(["backport-version-4-7"]))]);
  });

  it("throws, and adds nothing, when gh cannot remove a label", () => {
    const { calls, gh } = fakeGh({ stdout: "backport-version-4-7\n" }, { code: 1, stderr: "HTTP 403: Forbidden" });
    assert.throws(() => setLabels({ pr: "42", labels: prLabels([]), repo: REPO, gh }), /HTTP 403: Forbidden/);
    assert.equal(calls.length, 2);
  });

  it("throws when gh cannot read the PR's labels", () => {
    const { gh } = fakeGh({ code: 1, stderr: "no pull requests found" });
    assert.throws(() => setLabels({ pr: "42", labels: prLabels([]), repo: REPO, gh }), /gh pr view failed/);
  });
});

describe("publishFix", () => {
  let out;
  beforeEach(() => {
    out = tempDir();
    writeFiles(out, {
      "pr-body.md": "# PR\n",
      "pr-comment.md": "## Review buddy\n",
      "backport-labels.txt": "backport-version-4-7\n",
    });
  });
  afterEach(() => fs.rmSync(out, { recursive: true, force: true }));

  /** Runs publishFix with a fake gh and a push that records when it ran among the gh calls. */
  function publish(...replies) {
    const { calls, gh } = fakeGh(...replies);
    const events = [];
    const result = publishFix({
      branch: BRANCH,
      title: "docs: fix broken links",
      out,
      repo: REPO,
      gh: (args) => {
        events.push(args.slice(0, 2).join(" "));
        return gh(args);
      },
      push: () => events.push("push"),
    });
    return { result, calls, events };
  }

  it("turns off auto-merge on the bot's open PR before it pushes, then updates, comments on, and labels the PR", (t) => {
    t.mock.method(console, "log", () => {});
    const { result, calls, events } = publish(
      listReply(BOT_PR),
      commitsReply([BOT], [BOT]),
      { code: 0 },
      listReply(BOT_PR),
      {},
      {},
      { stdout: "" },
      {}
    );
    assert.deepEqual(result, { pr: "42", skipped: false });
    assert.deepEqual(events, [
      "pr list",
      "pr view",
      "pr merge",
      "push",
      "pr list",
      "api --method",
      "pr comment",
      "pr view",
      "api --method",
    ]);
    assert.deepEqual(calls[2], ["pr", "merge", "42", "--disable-auto"]);
    assert.deepEqual(calls[5], ["pr", "comment", "42", "--body-file", path.join(out, "pr-comment.md")]);
    assert.deepEqual(calls.at(-1).slice(-4), ["-f", "labels[]=backport-version-4-7", "-f", "labels[]=auto-backport"]);
  });

  it("leaves a PR that a person has committed to alone, and comments why", (t) => {
    t.mock.method(console, "log", () => {});
    const { result, calls, events } = publish(listReply(BOT_PR), commitsReply([BOT], [PERSON]), {});
    assert.deepEqual(result, { pr: "42", skipped: true });
    assert.deepEqual(events, ["pr list", "pr view", "pr comment"]);
    const commentFile = path.join(out, "skip-comment.md");
    assert.deepEqual(calls[2], ["pr", "comment", "42", "--body-file", commentFile]);
    assert.equal(fs.readFileSync(commentFile, "utf8"), skipComment(BRANCH));
  });

  it("opens a new PR without checking commits or auto-merge when no bot PR is open", () => {
    const { result, events, calls } = publish(
      listReply(FORK_PR),
      listReply(FORK_PR),
      {},
      listReply(FORK_PR, { number: 43, isCrossRepository: false }),
      {},
      { stdout: "" },
      {}
    );
    assert.deepEqual(result, { pr: "43", skipped: false });
    assert.deepEqual(events, [
      "pr list",
      "push",
      "pr list",
      "pr create",
      "pr list",
      "pr comment",
      "pr view",
      "api --method",
    ]);
    assert.ok(
      calls.every((args) => !args.includes("50")),
      "never touches the fork's PR"
    );
  });

  it("does not push when gh cannot read the open PR's commits", () => {
    const pushed = [];
    const { gh } = fakeGh(listReply(BOT_PR), { code: 1, stderr: "HTTP 502" });
    const options = { branch: BRANCH, title: "t", out, repo: REPO, gh, push: () => pushed.push(true) };
    assert.throws(() => publishFix(options), /gh pr view failed: HTTP 502/);
    assert.deepEqual(pushed, []);
  });

  it("does not push when auto-merge stays on", () => {
    const pushed = [];
    const { gh } = fakeGh(
      listReply(BOT_PR),
      commitsReply([BOT]),
      { code: 1, stderr: "HTTP 403" },
      { stdout: "true\n" }
    );
    const options = { branch: BRANCH, title: "t", out, repo: REPO, gh, push: () => pushed.push(true) };
    assert.throws(() => publishFix(options), { message: "Could not turn off auto-merge on PR #42." });
    assert.deepEqual(pushed, []);
  });

  it("stops before it updates the PR when the push fails", () => {
    const { calls, gh } = fakeGh(listReply(BOT_PR), commitsReply([BOT]), { code: 0 });
    const push = () => {
      throw new Error("git push to bot/fix-broken-links failed: rejected");
    };
    assert.throws(() => publishFix({ branch: BRANCH, title: "t", out, repo: REPO, gh, push }), /rejected/);
    assert.equal(calls.length, 3);
  });
});

describe("skipComment", () => {
  it("names the branch, says nothing changed on the PR, and says the links come back next week", () => {
    const comment = skipComment(BRANCH);
    assert.match(comment, /a person has committed to `bot\/fix-broken-links`/);
    assert.match(comment, /did not push, retitle, relabel, or change auto-merge/);
    assert.match(comment, /come back in next week's report/);
  });
});

describe("refuseSecrets", () => {
  const clean = "## Fixed\n\n| Old URL | New URL |\n";

  it("throws, naming the PR body, when the body holds a credential", () => {
    assert.throws(() => refuseSecrets({ "pr-body.md": `${clean}${FAKE.anthropic}`, "pr-comment.md": clean }), {
      message: "pr-body.md holds a credential (Anthropic API key), so no PR opens.",
    });
  });

  it("throws, naming the comment, when the review comment holds a credential", () => {
    assert.throws(() => refuseSecrets({ "pr-body.md": clean, "pr-comment.md": `token: ${FAKE.githubFineGrained}` }), {
      message: "pr-comment.md holds a credential (GitHub fine-grained token), so no PR opens.",
    });
  });

  it("names every kind of credential that the text holds, without the credential itself", () => {
    assert.throws(
      () => refuseSecrets({ "pr-body.md": `${FAKE.github}\n${FAKE.privateKey}` }),
      (error) => {
        assert.equal(error.message, "pr-body.md holds a credential (GitHub token, private key), so no PR opens.");
        assert.ok(!error.message.includes(FAKE.github));
        return true;
      }
    );
  });

  it("passes texts that hold no credential, empty texts, and no texts at all", () => {
    assert.doesNotThrow(() => refuseSecrets({ "pr-body.md": clean, "pr-comment.md": "No findings to address.\n" }));
    assert.doesNotThrow(() => refuseSecrets({ "pr-body.md": "", "pr-comment.md": "" }));
    assert.doesNotThrow(() => refuseSecrets({}));
  });
});

describe("open-pr.mjs command line", () => {
  let work;
  beforeEach(() => {
    work = tempDir();
  });
  afterEach(() => fs.rmSync(work, { recursive: true, force: true }));

  it("refuses to open a PR when its body holds a credential, before it runs git or gh", () => {
    writeFiles(work, {
      "out/pr-body.md": `## Fixed\n\n${FAKE.anthropic}\n`,
      "out/pr-comment.md": "No findings to address.\n",
      "bin/.keep": "",
    });
    // An empty PATH, so that the script could not reach gh or git even if the check let it through.
    const result = runScript("open-pr.mjs", [work], {
      cwd: work,
      env: { PATH: path.join(work, "bin"), GH_TOKEN: "", PR_BRANCH: BRANCH, PR_TITLE: "t", GITHUB_REPOSITORY: REPO },
    });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /pr-body\.md holds a credential \(Anthropic API key\), so no PR opens\./);
    assert.ok(!result.stderr.includes(FAKE.anthropic));
  });
});
