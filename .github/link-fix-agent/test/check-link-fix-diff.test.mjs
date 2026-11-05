import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";

import {
  changedBeyondUrls,
  checkChanges,
  checkConfigChange,
  fileRuleFailure,
  formatReport,
  skipListsMatch,
  unreportedRemovals,
  verdict,
  verifyNewUrls,
} from "../check-link-fix-diff.mjs";
import { git, makeRepo, runScript, tempDir, writeFiles } from "./helpers.mjs";

const OLD = "https://old.example.com/guide";
const NEW = "https://new.example.com/guide";
const KEEP = "https://keep.example.com/page";

describe("fileRuleFailure", () => {
  it("allows a modified docs page, partial, or linkinator config", () => {
    for (const file of [
      "docs/docs-content/clusters/a.md",
      "docs/api-content/b.mdx",
      "_partials/getting-started/_c.mdx",
      "linkinator/linkinator.config.json",
      "linkinator/linkinator-ci.config.json",
    ]) {
      assert.equal(fileRuleFailure({ path: file, status: "M" }), null, file);
    }
  });

  it("fails when a file is added, deleted, renamed, or untracked", () => {
    for (const status of ["A", "D", "R", "??"]) {
      assert.match(
        fileRuleFailure({ path: "docs/docs-content/a.md", status }),
        new RegExp(`only modifications are allowed \\(status ${status.replace(/\?/g, "\\?")}\\)`)
      );
    }
  });

  it("fails when the fix edits a file outside docs/ and _partials/", () => {
    assert.match(fileRuleFailure({ path: "README.md", status: "M" }), /README\.md: outside docs\/ and _partials\//);
    assert.match(fileRuleFailure({ path: "src/components/x.md", status: "M" }), /outside docs/);
  });

  it("fails when the fix edits a non-Markdown file in docs/", () => {
    assert.match(fileRuleFailure({ path: "docs/docs-content/img.png", status: "M" }), /outside docs/);
    assert.match(fileRuleFailure({ path: "_partials/x.json", status: "M" }), /outside docs/);
  });

  it("fails when the fix edits another linkinator file", () => {
    assert.match(fileRuleFailure({ path: "linkinator/other.json", status: "M" }), /outside docs/);
  });

  it("fails when the fix edits docs/deprecated", () => {
    assert.match(
      fileRuleFailure({ path: "docs/deprecated/old.md", status: "M" }),
      /docs\/deprecated\/old\.md: the weekly scan excludes this folder/
    );
  });
});

describe("checkConfigChange", () => {
  const file = "linkinator/linkinator.config.json";

  it("passes and lists the added patterns when only the skip array changed", () => {
    const before = JSON.stringify({ recurse: true, skip: ["^https://a"] });
    const after = JSON.stringify({ recurse: true, skip: ["^https://a", "^https://b"] });
    assert.deepEqual(checkConfigChange({ path: file, before, after }), {
      failure: null,
      note: `${file}: skip patterns added: ["^https://b"]`,
      added: ["^https://b"],
    });
  });

  it("returns no added patterns when the fix only removes one", () => {
    const before = JSON.stringify({ skip: ["^https://a", "^https://b"] });
    const after = JSON.stringify({ skip: ["^https://a"] });
    assert.deepEqual(checkConfigChange({ path: file, before, after }).added, []);
  });

  it("treats a missing skip array as empty", () => {
    const result = checkConfigChange({ path: file, before: "{}", after: '{"skip":["^https://b"]}' });
    assert.equal(result.failure, null);
    assert.equal(result.note, `${file}: skip patterns added: ["^https://b"]`);
  });

  it("fails when a key other than skip changed", () => {
    const before = JSON.stringify({ timeout: 10000, skip: [] });
    const after = JSON.stringify({ timeout: 0, skip: [] });
    assert.equal(
      checkConfigChange({ path: file, before, after }).failure,
      `${file}: changed something other than the skip array`
    );
  });

  it("fails when a key is added", () => {
    const result = checkConfigChange({ path: file, before: '{"skip":[]}', after: '{"skip":[],"recurse":true}' });
    assert.match(result.failure, /changed something other than the skip array/);
  });

  it("throws when the new config is not valid JSON", () => {
    assert.throws(() => checkConfigChange({ path: file, before: "{}", after: "{" }), SyntaxError);
  });
});

describe("changedBeyondUrls", () => {
  it("is false for a URL swap", () => {
    assert.equal(changedBeyondUrls(`See [the guide](${OLD}).`, `See [the guide](${NEW}).`), false);
  });

  it("is false when only whitespace changed, as after a Prettier reflow", () => {
    assert.equal(changedBeyondUrls(`See the\n[guide](${OLD}) here.`, `See the [guide](${NEW})\n  here.`), false);
  });

  it("is true when the link text changed", () => {
    assert.equal(changedBeyondUrls(`See [the guide](${OLD}).`, `See [the new guide](${NEW}).`), true);
  });

  it("is true when a link was removed", () => {
    assert.equal(changedBeyondUrls(`See [the guide](${OLD}).`, "See the guide."), true);
  });
});

describe("unreportedRemovals", () => {
  it("returns nothing when every removed URL is in the report", () => {
    assert.deepEqual(unreportedRemovals([OLD], new Set([OLD])), []);
  });

  it("ignores the fragment of a removed URL, as linkinator does", () => {
    assert.deepEqual(unreportedRemovals([`${OLD}#install`], new Set([OLD])), []);
  });

  it("returns the removed URLs that the report did not flag", () => {
    assert.deepEqual(unreportedRemovals([OLD, KEEP], new Set([OLD])), [KEEP]);
    assert.deepEqual(unreportedRemovals([KEEP], new Set()), [KEEP]);
  });

  it("matches a bare domain in the docs to the report's URL with its trailing slash", () => {
    assert.deepEqual(unreportedRemovals(["https://www.weave.works"], new Set(["https://www.weave.works/"])), []);
  });

  it("still fails a bare domain that the report did not flag", () => {
    assert.deepEqual(unreportedRemovals(["https://www.weave.works"], new Set(["https://weave.works/"])), [
      "https://www.weave.works",
    ]);
  });
});

describe("skipListsMatch", () => {
  it("is true when the configs list the same patterns, in any order", () => {
    assert.equal(skipListsMatch(['{"skip":["a","b"],"recurse":true}', '{"skip":["b","a"],"timeout":1}']), true);
  });

  it("is true when neither config has a skip list", () => {
    assert.equal(skipListsMatch(["{}", '{"skip":[]}']), true);
  });

  it("is false when the skip lists differ", () => {
    assert.equal(skipListsMatch(['{"skip":["a","b"]}', '{"skip":["a"]}']), false);
    assert.equal(skipListsMatch(['{"skip":["a"]}', "{}"]), false);
  });

  it("throws when a config is not valid JSON", () => {
    assert.throws(() => skipListsMatch(["{}", "not json"]), SyntaxError);
  });
});

describe("checkChanges", () => {
  const page = (before, after) => ({ path: "docs/docs-content/a.md", status: "M", before, after });

  it("passes a reported URL swap and lists the removed and added URLs", () => {
    const result = checkChanges([page(`[a](${OLD}) [b](${KEEP})`, `[a](${NEW}) [b](${KEEP})`)], new Set([OLD]));
    assert.deepEqual(result, {
      failures: [],
      notes: [],
      proseChanged: false,
      skipPatternsAdded: false,
      removed: [OLD],
      added: [NEW],
    });
  });

  it("passes but flags the page when the text changed beyond the URL swap", () => {
    const result = checkChanges([page(`See [a](${OLD}).`, `Read [a](${NEW}) first.`)], new Set([OLD]));
    assert.deepEqual(result.failures, []);
    assert.equal(result.proseChanged, true);
    assert.deepEqual(result.notes, ["docs/docs-content/a.md: text changed beyond the URL swap"]);
  });

  it("fails when the fix removes a URL that the report did not list", () => {
    const result = checkChanges([page(`[a](${OLD}) [b](${KEEP})`, `[a](${NEW}) b`)], new Set([OLD]));
    assert.deepEqual(result.failures, [`removed URLs that were not in the report: ${JSON.stringify([KEEP])}`]);
  });

  it("fails for a disallowed file and skips its URLs", () => {
    const readme = { path: "README.md", status: "M", before: `[b](${KEEP})`, after: "b" };
    const result = checkChanges([readme], new Set());
    assert.deepEqual(result.failures, ["README.md: outside docs/ and _partials/ Markdown"]);
    assert.deepEqual(result.removed, []);
  });

  it("checks a linkinator config change and notes its added patterns", () => {
    const config = {
      path: "linkinator/linkinator.config.json",
      status: "M",
      before: '{"skip":[]}',
      after: '{"skip":["^https://blocked.example.com"],"recurse":true}',
    };
    const result = checkChanges([config], new Set());
    assert.deepEqual(result.failures, [
      "linkinator/linkinator.config.json: changed something other than the skip array",
    ]);
    assert.deepEqual(result.notes, [
      'linkinator/linkinator.config.json: skip patterns added: ["^https://blocked.example.com"]',
    ]);
    assert.equal(result.skipPatternsAdded, true);
  });

  it("does not flag a linkinator config change that adds no skip pattern", () => {
    const config = {
      path: "linkinator/linkinator.config.json",
      status: "M",
      before: '{"skip":["^https://a.example.com","^https://b.example.com"]}',
      after: '{"skip":["^https://a.example.com"]}',
    };
    const result = checkChanges([config], new Set());
    assert.deepEqual(result.failures, []);
    assert.equal(result.skipPatternsAdded, false);
  });

  it("returns no failures for no changes", () => {
    assert.deepEqual(checkChanges([], new Set()), {
      failures: [],
      notes: [],
      proseChanged: false,
      skipPatternsAdded: false,
      removed: [],
      added: [],
    });
  });
});

describe("verdict", () => {
  it("is OK when the page loads", () => {
    assert.equal(verdict({ state: "OK", status: 200 }), "OK");
  });

  it("is UNVERIFIED when the site blocks bots or the URL is skip-listed", () => {
    for (const status of [401, 403, 429]) assert.equal(verdict({ state: "BROKEN", status }), "UNVERIFIED");
    assert.equal(verdict({ state: "SKIPPED", status: undefined }), "UNVERIFIED");
  });

  it("is BROKEN when the page is gone, times out, or has no result", () => {
    assert.equal(verdict({ state: "BROKEN", status: 404 }), "BROKEN");
    assert.equal(verdict({ state: "BROKEN", status: 0 }), "BROKEN");
    assert.equal(verdict({ state: "MISSING", status: undefined }), "BROKEN");
  });
});

describe("verifyNewUrls", () => {
  // A fake linkinator: it answers from `responses`, one list per URL for successive calls, and records each call.
  function fakeChecker(responses) {
    const calls = [];
    const checkUrls = async (urls) => {
      calls.push(urls);
      return new Map(
        urls.map((url) => {
          const key = url.split("#")[0];
          return [key, responses[key].length > 1 ? responses[key].shift() : responses[key][0]];
        })
      );
    };
    return { calls, checkUrls };
  }
  const noPause = { pause: async () => {} };

  it("passes URLs that load", async () => {
    const { calls, checkUrls } = fakeChecker({ [NEW]: [{ state: "OK", status: 200 }] });
    const result = await verifyNewUrls([NEW], checkUrls, noPause);
    assert.deepEqual(result, { failures: [], notes: [`OK 200 ${NEW}`], unverified: false });
    assert.deepEqual(calls, [[NEW]]);
  });

  it("checks nothing when there are no new URLs", async () => {
    const { calls, checkUrls } = fakeChecker({});
    assert.deepEqual(await verifyNewUrls([], checkUrls, noPause), { failures: [], notes: [], unverified: false });
    assert.deepEqual(calls, []);
  });

  it("fails a broken URL", async () => {
    const { checkUrls } = fakeChecker({ [NEW]: [{ state: "BROKEN", status: 404 }] });
    const result = await verifyNewUrls([NEW], checkUrls, noPause);
    assert.deepEqual(result.failures, [`BROKEN 404 ${NEW}`]);
  });

  it("fails a URL that linkinator returned no result for", async () => {
    const result = await verifyNewUrls([NEW], async () => new Map(), noPause);
    assert.deepEqual(result.failures, [`BROKEN no result ${NEW}`]);
  });

  it("finds linkinator's result for a bare domain, which linkinator reports with a trailing slash", async () => {
    const checkUrls = async () => new Map([["https://kubevirt.io/", { state: "OK", status: 200 }]]);
    const result = await verifyNewUrls(["https://kubevirt.io"], checkUrls, noPause);
    assert.deepEqual(result, { failures: [], notes: ["OK 200 https://kubevirt.io"], unverified: false });
  });

  it("retries a bot-blocked bare domain by linkinator's form of the URL", async () => {
    const replies = [
      { state: "BROKEN", status: 403 },
      { state: "OK", status: 200 },
    ];
    const calls = [];
    const checkUrls = async (urls) => {
      calls.push(urls);
      return new Map([["https://kubevirt.io/", replies.shift()]]);
    };
    const result = await verifyNewUrls(["https://kubevirt.io"], checkUrls, noPause);
    assert.deepEqual(result.failures, []);
    assert.deepEqual(calls, [["https://kubevirt.io"], ["https://kubevirt.io"]]);
  });

  it("looks up a URL with a fragment by its URL without the fragment", async () => {
    const { checkUrls } = fakeChecker({ [NEW]: [{ state: "OK", status: 200 }] });
    const result = await verifyNewUrls([`${NEW}#install`], checkUrls, noPause);
    assert.deepEqual(result.notes, [`OK 200 ${NEW}#install`]);
  });

  it("checks a bot-blocked URL again, and passes it when the retry loads", async () => {
    const { calls, checkUrls } = fakeChecker({
      [NEW]: [
        { state: "BROKEN", status: 403 },
        { state: "OK", status: 200 },
      ],
      [KEEP]: [{ state: "OK", status: 200 }],
    });
    let pauses = 0;
    const result = await verifyNewUrls([NEW, KEEP], checkUrls, { pause: async () => pauses++ });
    assert.deepEqual(result, { failures: [], notes: [`OK 200 ${NEW}`, `OK 200 ${KEEP}`], unverified: false });
    assert.deepEqual(calls, [[NEW, KEEP], [NEW]]);
    assert.equal(pauses, 1);
  });

  it("flags a URL that stays bot-blocked as unverified instead of failing", async () => {
    const { calls, checkUrls } = fakeChecker({ [NEW]: [{ state: "BROKEN", status: 429 }] });
    const result = await verifyNewUrls([NEW], checkUrls, noPause);
    assert.deepEqual(result, { failures: [], notes: [`ERROR after 4 attempts: 429 ${NEW}`], unverified: true });
    assert.equal(calls.length, 4);
  });

  it("honors the retries option", async () => {
    const { calls, checkUrls } = fakeChecker({ [NEW]: [{ state: "BROKEN", status: 403 }] });
    const result = await verifyNewUrls([NEW], checkUrls, { retries: 0, ...noPause });
    assert.deepEqual(result.notes, [`ERROR after 1 attempts: 403 ${NEW}`]);
    assert.equal(calls.length, 1);
  });

  it("flags a skip-listed URL as unverified", async () => {
    const { checkUrls } = fakeChecker({ [NEW]: [{ state: "SKIPPED", status: undefined }] });
    const result = await verifyNewUrls([NEW], checkUrls, noPause);
    assert.deepEqual(result, { failures: [], notes: [`UNVERIFIED undefined ${NEW}`], unverified: true });
  });
});

describe("formatReport", () => {
  it("prints the counts, notes, failures, and flag lines", () => {
    const report = formatReport({
      changedFiles: 2,
      removed: [OLD],
      added: [NEW, KEEP],
      notes: ["a note"],
      failures: ["a failure"],
      proseChanged: true,
      unverified: false,
      skipPatternsAdded: true,
    });
    assert.equal(
      report,
      [
        "Changed files: 2  URLs removed: 1  URLs added: 2",
        "  note: a note",
        "  FAIL: a failure",
        "PROSE_CHANGED=1",
        "UNVERIFIED_LINKS=0",
        "SKIP_PATTERNS_ADDED=1",
      ].join("\n")
    );
  });

  it("prints only the counts and flags when there is nothing to note", () => {
    const report = formatReport({
      changedFiles: 0,
      removed: [],
      added: [],
      notes: [],
      failures: [],
      proseChanged: false,
      unverified: true,
      skipPatternsAdded: false,
    });
    assert.equal(
      report,
      "Changed files: 0  URLs removed: 0  URLs added: 0\nPROSE_CHANGED=0\nUNVERIFIED_LINKS=1\nSKIP_PATTERNS_ADDED=0"
    );
  });
});

describe("check-link-fix-diff.mjs command line", () => {
  const config = (extra = {}) =>
    `${JSON.stringify({ recurse: true, skip: ["^https://skip.example.com"], ...extra }, null, 2)}\n`;
  const PAGE = `# A page\n\nSee [the guide](${OLD}) for details.\n\nAlso read [this page](${KEEP}).\n`;
  let repo;
  let work;
  let report;

  beforeEach(() => {
    repo = makeRepo({
      "docs/docs-content/a.md": PAGE,
      "_partials/getting-started/_b.mdx": `Read [the guide](${OLD}).\n`,
      "docs/deprecated/old.md": `Old [guide](${OLD}).\n`,
      "README.md": `[Guide](${OLD})\n`,
      "linkinator/linkinator.config.json": config(),
      "linkinator/linkinator-ci.config.json": config({ timeout: 10000 }),
    });
    work = tempDir();
    report = path.join(work, "link_report.json");
    fs.writeFileSync(report, JSON.stringify([{ url: `${OLD}#setup`, status: 404, parent: "docs/docs-content/a.md" }]));
  });
  afterEach(() => {
    fs.rmSync(repo, { recursive: true, force: true });
    fs.rmSync(work, { recursive: true, force: true });
  });

  const check = () => runScript("check-link-fix-diff.mjs", [repo, report, "--no-network"]);
  const edit = (files) => writeFiles(repo, files);

  it("prints that there is nothing to open when the tree is clean", () => {
    const result = check();
    assert.equal(result.status, 0);
    assert.equal(result.stdout, "No changes. Nothing to open.\n");
  });

  it("passes a reported URL swap in a page and a partial", () => {
    edit({
      "docs/docs-content/a.md": PAGE.replace(OLD, NEW),
      "_partials/getting-started/_b.mdx": `Read [the guide](${NEW}).\n`,
    });
    const result = check();
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.match(result.stdout, /^Changed files: 2 {2}URLs removed: 1 {2}URLs added: 1$/m);
    assert.match(result.stdout, new RegExp(`note: not checked \\(offline\\): ${NEW}`));
    assert.match(result.stdout, /^PROSE_CHANGED=0$/m);
    assert.match(result.stdout, /^UNVERIFIED_LINKS=0$/m);
    assert.match(result.stdout, /^SKIP_PATTERNS_ADDED=0$/m);
    assert.doesNotMatch(result.stdout, /FAIL/);
  });

  it("passes but prints PROSE_CHANGED=1 when the text changed beyond the URL swap", () => {
    edit({ "docs/docs-content/a.md": PAGE.replace(`See [the guide](${OLD})`, `Read [the new guide](${NEW})`) });
    const result = check();
    assert.equal(result.status, 0, result.stdout);
    assert.match(result.stdout, /^PROSE_CHANGED=1$/m);
    assert.match(result.stdout, /note: docs\/docs-content\/a\.md: text changed beyond the URL swap/);
  });

  it("fails when the fix edits a file outside docs/ and _partials/", () => {
    edit({ "README.md": `[Guide](${NEW})\n` });
    const result = check();
    assert.equal(result.status, 1);
    assert.match(result.stdout, /FAIL: README\.md: outside docs\/ and _partials\/ Markdown/);
  });

  it("fails when the fix edits docs/deprecated", () => {
    edit({ "docs/deprecated/old.md": `Old [guide](${NEW}).\n` });
    const result = check();
    assert.equal(result.status, 1);
    assert.match(result.stdout, /FAIL: docs\/deprecated\/old\.md: the weekly scan excludes this folder/);
  });

  it("fails when the fix removes a URL that the report did not list", () => {
    edit({ "docs/docs-content/a.md": PAGE.replace(KEEP, NEW) });
    const result = check();
    assert.equal(result.status, 1);
    assert.match(result.stdout, new RegExp(`FAIL: removed URLs that were not in the report: \\["${KEEP}"\\]`));
  });

  it("fails when the fix adds an untracked file", () => {
    edit({ "docs/docs-content/new.md": `[Guide](${NEW})\n` });
    const result = check();
    assert.equal(result.status, 1);
    assert.match(result.stdout, /FAIL: docs\/docs-content\/new\.md: only modifications are allowed \(status \?\?\)/);
  });

  it("fails when the fix changes a linkinator setting other than skip", () => {
    edit({
      "linkinator/linkinator.config.json": config({ recurse: false }),
      "linkinator/linkinator-ci.config.json": config({ timeout: 10000, recurse: false }),
    });
    const result = check();
    assert.equal(result.status, 1);
    assert.match(
      result.stdout,
      /FAIL: linkinator\/linkinator\.config\.json: changed something other than the skip array/
    );
    assert.doesNotMatch(result.stdout, /different skip lists/);
  });

  it("fails when the linkinator configs end up with different skip lists", () => {
    const skip = ["^https://skip.example.com", "^https://blocked.example.com"];
    edit({ "linkinator/linkinator.config.json": config({ skip }) });
    const result = check();
    assert.equal(result.status, 1);
    assert.match(result.stdout, /FAIL: linkinator configs have different skip lists/);
  });

  it("passes the same skip pattern added to both linkinator configs", () => {
    const skip = ["^https://skip.example.com", "^https://blocked.example.com"];
    edit({
      "linkinator/linkinator.config.json": config({ skip }),
      "linkinator/linkinator-ci.config.json": config({ timeout: 10000, skip }),
    });
    const result = check();
    assert.equal(result.status, 0, result.stdout);
    assert.match(result.stdout, /skip patterns added: \["\^https:\/\/blocked\.example\.com"\]/);
    assert.match(result.stdout, /^SKIP_PATTERNS_ADDED=1$/m);
  });

  it("fails when the fix swaps one copy of an unreported URL that a page links twice", () => {
    edit({ "docs/docs-content/a.md": `${PAGE}\nRead [this page](${KEEP}) again.\n` });
    git(repo, "commit", "-qam", "link the page twice");
    edit({ "docs/docs-content/a.md": `${PAGE}\nRead [this page](https://attacker.example.com/) again.\n` });
    const result = check();
    assert.equal(result.status, 1, result.stdout);
    assert.match(result.stdout, new RegExp(`FAIL: removed URLs that were not in the report: \\["${KEEP}"\\]`));
    assert.match(result.stdout, /note: not checked \(offline\): https:\/\/attacker\.example\.com\//);
  });

  it("fails when the fix deletes a docs page", () => {
    fs.rmSync(path.join(repo, "docs/docs-content/a.md"));
    const result = check();
    assert.equal(result.status, 1);
    assert.match(result.stdout, /FAIL: docs\/docs-content\/a\.md: only modifications are allowed \(status D\)/);
  });

  it("passes the removal of a reported bare domain, which linkinator reports with a trailing slash", () => {
    const WEAVE = "https://www.weave.works";
    writeFiles(repo, { "docs/docs-content/a.md": `${PAGE}\nSee [Weave](${WEAVE}).\n` });
    git(repo, "commit", "-qam", "add a bare domain");
    fs.writeFileSync(report, JSON.stringify([{ url: `${WEAVE}/`, status: 404, parent: "docs/docs-content/a.md" }]));
    edit({ "docs/docs-content/a.md": `${PAGE}\nSee [Weave](${NEW}).\n` });
    const result = check();
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.doesNotMatch(result.stdout, /FAIL/);
  });

  it("checks a URL that the fix adds to a page even when another changed page already had it", () => {
    edit({
      "docs/docs-content/a.md": PAGE.replace(OLD, NEW),
      "_partials/getting-started/_b.mdx": `Read [the guide](${OLD}) and [this page](${KEEP}).\n`,
    });
    const result = check();
    assert.match(result.stdout, /^Changed files: 2 {2}URLs removed: 1 {2}URLs added: 2$/m);
    assert.match(result.stdout, new RegExp(`note: not checked \\(offline\\): ${KEEP}`));
  });
});

describe("checkChanges rule 3, file by file", () => {
  const page = (url) => `Read the [guide](${url}).\n`;
  const OTHER = "https://other.example.com/guide";

  it("fails when the fix moves an unreported URL from one page to another", () => {
    const changes = [
      { path: "docs/docs-content/a.md", status: "M", before: page(OTHER), after: "Read the guide.\n" },
      { path: "docs/docs-content/b.md", status: "M", before: "Read the guide.\n", after: page(OTHER) },
    ];
    const { failures } = checkChanges(changes, new Set());
    assert.deepEqual(failures, [`removed URLs that were not in the report: ${JSON.stringify([OTHER])}`]);
  });

  it("passes when the URL that moves away from a page is a reported one, and lists it as added for rule 4", () => {
    const changes = [
      { path: "docs/docs-content/a.md", status: "M", before: page(OTHER), after: "Read the guide.\n" },
      { path: "docs/docs-content/b.md", status: "M", before: "Read the guide.\n", after: page(OTHER) },
    ];
    const result = checkChanges(changes, new Set([OTHER]));
    assert.deepEqual(result.failures, []);
    assert.deepEqual(result.removed, [OTHER]);
    assert.deepEqual(result.added, [OTHER]);
  });

  it("lists each URL once when several files gain or lose it", () => {
    const changes = [
      { path: "docs/docs-content/a.md", status: "M", before: page(OLD), after: page(NEW) },
      { path: "docs/docs-content/b.md", status: "M", before: page(OLD), after: page(NEW) },
    ];
    const result = checkChanges(changes, new Set([OLD]));
    assert.deepEqual(result.removed, [OLD]);
    assert.deepEqual(result.added, [NEW]);
  });

  it("does not list a URL that a changed file keeps", () => {
    const changes = [
      { path: "docs/docs-content/a.md", status: "M", before: `${page(OTHER)}${page(OLD)}`, after: page(OTHER) },
    ];
    assert.deepEqual(checkChanges(changes, new Set([OLD])).added, []);
  });
});

describe("checkChanges rule 3, copy by copy", () => {
  const ATTACKER = "https://attacker.example.com/a/";
  const page = (before, after) => ({ path: "docs/docs-content/a.md", status: "M", before, after });

  it("fails when the fix swaps one copy of an unreported URL that the file links twice", () => {
    const result = checkChanges([page(`[a](${KEEP}) [b](${KEEP})`, `[a](${KEEP}) [b](${ATTACKER})`)], new Set());
    assert.deepEqual(result.failures, [`removed URLs that were not in the report: ${JSON.stringify([KEEP])}`]);
    assert.deepEqual(result.removed, [KEEP]);
    assert.deepEqual(result.added, [ATTACKER]);
  });

  it("passes when the fix swaps every copy of a reported URL", () => {
    const result = checkChanges([page(`[a](${OLD}) [b](${OLD})`, `[a](${NEW}) [b](${NEW})`)], new Set([OLD]));
    assert.deepEqual(result.failures, []);
    assert.deepEqual(result.removed, [OLD]);
    assert.deepEqual(result.added, [NEW]);
  });

  it("lists a URL as added for rule 4 when the file gains another copy of it", () => {
    const result = checkChanges([page(`[a](${OLD}) [b](${KEEP})`, `[a](${KEEP}) [b](${KEEP})`)], new Set([OLD]));
    assert.deepEqual(result.failures, []);
    assert.deepEqual(result.removed, [OLD]);
    assert.deepEqual(result.added, [KEEP]);
  });

  it("passes when the copies of a URL only move within the file", () => {
    const result = checkChanges([page(`[a](${KEEP})\n\n[b](${OLD})`, `[b](${OLD})\n\n[a](${KEEP})`)], new Set());
    assert.deepEqual(result.failures, []);
    assert.deepEqual(result.removed, []);
    assert.deepEqual(result.added, []);
  });
});
