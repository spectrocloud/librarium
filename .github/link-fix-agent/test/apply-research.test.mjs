import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";

import { addSkipPattern, fixReport, guidanceTasks, replaceUrl, usageFiles } from "../apply-research.mjs";
import { assertLine, git, makeRepo, runScript, tempDir, writeFiles } from "./helpers.mjs";

const OLD = "https://old.example.com/guide";
const NEW = "https://new.example.com/guide";
const KEEP = "https://keep.example.com/page";
const TOOL_OLD = "https://tool.example.com/docs/install";
const TOOL_NEW = "https://tool.example.com/v2/install";
const NOTES = "https://notes.example.com/release";
const BLOCKED = "https://blocked.example.com/";
const PATTERN = "^https://blocked\\.example\\.com";
const VSPHERE = "https://image-builder.sigs.k8s.io/capi/providers/vsphere";
const VSPHERE_NEW = "https://image-builder.sigs.k8s.io/capi/providers/vsphere.html";
const VSPHERE_DOC = [
  `Use [remote VMs](${VSPHERE}#accessing-remote-vms).`,
  `Use [the clone builder](${VSPHERE}#vsphere-clone-builder).`,
  `Read [the provider guide](${VSPHERE}).`,
  "",
].join("\n");
/** The researcher's mapping for VSPHERE_DOC's two sections: one kept, and one with no match on the new page. */
const VSPHERE_FRAGMENTS = [
  { from: "accessing-remote-vms", to: "remote-access" },
  { from: "vsphere-clone-builder", to: "" },
];

/** A researcher result: a replace, unless `fields` says otherwise. */
const research = (fields = {}) => ({
  outcome: "replace",
  replacement: NEW,
  fragments: [],
  evidence: "",
  guidance: "",
  sources: [],
  skipPattern: "",
  attempts: [],
  notes: "",
  ...fields,
});
const usage = (file, line = 1) => ({ file, line, text: "a docs line" });
/** A research.json entry. */
const entry = (url, result, usages = [usage("docs/docs-content/a.md")]) => ({ url, statuses: [404], usages, result });

describe("replaceUrl", () => {
  it("replaces the URL and its forms with a fragment, and counts the swaps", () => {
    assert.deepEqual(replaceUrl(`See [a](${OLD}) and [b](${OLD}#setup).\n`, OLD, NEW, [{ from: "setup", to: "" }]), {
      text: `See [a](${NEW}) and [b](${NEW}).\n`,
      count: 2,
    });
  });

  it("gives each link to a section the anchor that its fragment maps to, and a link with none the bare URL", () => {
    assert.deepEqual(replaceUrl(VSPHERE_DOC, VSPHERE, VSPHERE_NEW, VSPHERE_FRAGMENTS), {
      text: [
        `Use [remote VMs](${VSPHERE_NEW}#remote-access).`,
        `Use [the clone builder](${VSPHERE_NEW}).`,
        `Read [the provider guide](${VSPHERE_NEW}).`,
        "",
      ].join("\n"),
      count: 3,
    });
  });

  it("keeps two sections apart when both have an anchor on the new page", () => {
    const fragments = [
      { from: "accessing-remote-vms", to: "remote-access" },
      { from: "vsphere-clone-builder", to: "clone-builder" },
    ];
    const { text } = replaceUrl(VSPHERE_DOC, VSPHERE, VSPHERE_NEW, fragments);
    assert.match(text, /\[remote VMs\]\([^)]+\.html#remote-access\)/);
    assert.match(text, /\[the clone builder\]\([^)]+\.html#clone-builder\)/);
  });

  it("gives a link with no fragment the bare URL, even when the mapping has an anchor for an empty section", () => {
    assert.equal(replaceUrl(`[a](${OLD})`, OLD, NEW, [{ from: "", to: "intro" }]).text, `[a](${NEW})`);
  });

  it("gives a link the bare URL when the mapping has no entry for its fragment", () => {
    assert.equal(replaceUrl(`[a](${OLD}#faq)`, OLD, NEW, [{ from: "setup", to: "install" }]).text, `[a](${NEW})`);
  });

  it("replaces a bare domain when the URL is its form with a trailing slash", () => {
    assert.deepEqual(replaceUrl("Visit [Weave](https://www.weave.works).", "https://www.weave.works/", NEW, []), {
      text: `Visit [Weave](${NEW}).`,
      count: 1,
    });
  });

  it("leaves other URLs alone, including longer ones that start the same way", () => {
    const text = `[a](${OLD}/more) [b](${KEEP}) [c](${OLD}s) [d](${OLD}?v=2)`;
    assert.deepEqual(replaceUrl(text, OLD, NEW, []), { text, count: 0 });
  });

  it("returns the text unchanged and a count of zero when the URL is not there", () => {
    assert.deepEqual(replaceUrl("No links here.", OLD, NEW, []), { text: "No links here.", count: 0 });
  });

  it("inserts a replacement that holds dollar signs as it is", () => {
    const replacement = "https://new.example.com/a$&b$1";
    assert.equal(replaceUrl(`[a](${OLD})`, OLD, replacement, []).text, `[a](${replacement})`);
  });
});

describe("addSkipPattern", () => {
  it("adds the pattern to the skip array, as 2-space JSON with a final newline", () => {
    assert.equal(
      addSkipPattern('{"recurse":true,"skip":["^https://a"]}', "^https://b"),
      '{\n  "recurse": true,\n  "skip": [\n    "^https://a",\n    "^https://b"\n  ]\n}\n'
    );
  });

  it("adds a pattern only once", () => {
    const config = '{\n  "skip": [\n    "^https://a"\n  ]\n}\n';
    assert.equal(addSkipPattern(config, "^https://a"), config);
  });

  it("creates the skip array when the config has none", () => {
    assert.equal(
      addSkipPattern('{"recurse":true}', "^https://b"),
      '{\n  "recurse": true,\n  "skip": [\n    "^https://b"\n  ]\n}\n'
    );
  });

  it("throws when the config is not valid JSON", () => {
    assert.throws(() => addSkipPattern("{", "^https://b"), SyntaxError);
  });
});

describe("usageFiles", () => {
  it("returns each file once, in the order of first use", () => {
    const usages = [usage("docs/b.md", 1), usage("docs/a.md", 2), usage("docs/b.md", 9)];
    assert.deepEqual(usageFiles({ usages }), ["docs/b.md", "docs/a.md"]);
  });

  it("returns nothing for an entry with no usages", () => {
    assert.deepEqual(usageFiles({ usages: [] }), []);
  });
});

describe("guidanceTasks", () => {
  it("returns a task for each update-guidance result, with where it applies", () => {
    const guidance = research({
      outcome: "update-guidance",
      replacement: TOOL_NEW,
      guidance: "The CLI was renamed.",
      sources: ["https://tool.example.com/changelog"],
      notes: "left out",
    });
    const usages = [usage("docs/docs-content/c.md", 4)];
    const entries = [
      entry(OLD, research()),
      entry(TOOL_OLD, guidance, usages),
      entry(KEEP, research({ outcome: "no-change" })),
    ];
    assert.deepEqual(guidanceTasks(entries), [
      {
        url: TOOL_OLD,
        replacement: TOOL_NEW,
        guidance: "The CLI was renamed.",
        sources: ["https://tool.example.com/changelog"],
        usages,
      },
    ]);
  });

  it("returns no tasks when no result needs a guidance change", () => {
    assert.deepEqual(guidanceTasks([entry(OLD, research())]), []);
    assert.deepEqual(guidanceTasks([]), []);
  });
});

describe("fixReport", () => {
  it("lists each outcome in its own section, and counts what was fixed", () => {
    const entries = [
      entry(OLD, research({ evidence: "Redirects to the new guide.", fragments: [{ from: "setup", to: "install" }] }), [
        usage("docs/docs-content/a.md", 3),
        usage("docs/docs-content/a.md", 9),
        usage("_partials/_b.mdx"),
      ]),
      entry(
        TOOL_OLD,
        research({
          outcome: "update-guidance",
          replacement: "",
          guidance: "The CLI was renamed.",
          sources: ["https://tool.example.com/changelog", "https://tool.example.com/blog"],
          fragments: [{ from: "flags", to: "" }],
        })
      ),
      entry(
        BLOCKED,
        research({ outcome: "skip-pattern", replacement: "", skipPattern: PATTERN, notes: "Blocks bots." })
      ),
      entry(
        KEEP,
        research({ outcome: "no-change", replacement: "", evidence: "The page title.", attempts: ["403", "200"] })
      ),
      entry(
        "https://gone.example.com/",
        research({ outcome: "error", replacement: "", attempts: ["timeout", "timeout"], notes: "Timed out." })
      ),
      entry(
        "https://docs.spectrocloud.com/old/",
        research({ outcome: "needs-human", replacement: "", notes: "An internal link." }),
        [usage("docs/x.md"), usage("docs/y.md")]
      ),
    ];
    assert.equal(
      fixReport(entries),
      [
        "## Fixed",
        "",
        "| Old URL | New URL | Anchors | Evidence | Files |",
        "| --- | --- | --- | --- | --- |",
        `| ${OLD} | ${NEW} | #setup → #install | Redirects to the new guide. | 2 |`,
        "",
        "## Guidance to update",
        "",
        "| URL | New URL | Anchors | What changed | Sources | Files |",
        "| --- | --- | --- | --- | --- | --- |",
        `| ${TOOL_OLD} | none | #flags → none | The CLI was renamed. | https://tool.example.com/changelog https://tool.example.com/blog | 1 |`,
        "",
        "## Skip patterns added",
        "",
        "| URL | Pattern | Notes |",
        "| --- | --- | --- |",
        `| ${BLOCKED} | ${PATTERN} | Blocks bots. |`,
        "",
        "## Checked, no change needed",
        "",
        "| URL | Attempts | What loaded |",
        "| --- | --- | --- |",
        `| ${KEEP} | 403, 200 | The page title. |`,
        "",
        "## Errors",
        "",
        "| URL | Files | Attempts | Notes |",
        "| --- | --- | --- | --- |",
        "| https://gone.example.com/ | 1 | timeout, timeout | Timed out. |",
        "",
        "## Needs a human",
        "",
        "| URL | Files | Notes |",
        "| --- | --- | --- |",
        "| https://docs.spectrocloud.com/old/ | 2 | An internal link. |",
        "",
        "Fixed 2 of 6 reported URLs. 1 errors. 1 need a human.",
      ].join("\n")
    );
  });

  it("leaves out the sections that have no rows", () => {
    assert.equal(
      fixReport([entry(OLD, research({ evidence: "Redirect." }))]),
      [
        "## Fixed",
        "",
        "| Old URL | New URL | Anchors | Evidence | Files |",
        "| --- | --- | --- | --- | --- |",
        `| ${OLD} | ${NEW} |  | Redirect. | 1 |`,
        "",
        "Fixed 1 of 1 reported URLs. 0 errors. 0 need a human.",
      ].join("\n")
    );
  });

  it("prints only the summary when there are no entries", () => {
    assert.equal(fixReport([]), "Fixed 0 of 0 reported URLs. 0 errors. 0 need a human.");
  });

  it("shows a guidance change's new URL when it has one", () => {
    const result = research({
      outcome: "update-guidance",
      replacement: TOOL_NEW,
      guidance: "Renamed.",
      sources: ["s"],
    });
    assertLine(fixReport([entry(TOOL_OLD, result)]), `| ${TOOL_OLD} | ${TOOL_NEW} |  | Renamed. | s | 1 |`);
  });

  it("shows where each section of a fixed link now points", () => {
    const result = research({ replacement: VSPHERE_NEW, fragments: VSPHERE_FRAGMENTS, evidence: "Title." });
    assertLine(
      fixReport([entry(VSPHERE, result)]),
      `| ${VSPHERE} | ${VSPHERE_NEW} | #accessing-remote-vms → #remote-access, #vsphere-clone-builder → none | Title. | 1 |`
    );
  });

  it("escapes pipes and joins lines in a cell, so that each row stays one table row", () => {
    const result = research({ evidence: "Title: A | B\n  second line\r\nthird" });
    const report = fixReport([entry(OLD, result)]);
    assert.match(report, /\| Title: A \\\| B second line third \| 1 \|\n/);
    assert.equal(report.split("\n").filter((line) => line.startsWith(`| ${OLD}`)).length, 1);
  });
});

describe("apply-research.mjs command line", () => {
  const config = (extra = {}) =>
    `${JSON.stringify({ recurse: true, skip: ["^https://skip\\.example\\.com"], ...extra }, null, 2)}\n`;
  const A = `See [the guide](${OLD}#setup) and [this page](${KEEP}).\n`;
  const C = `Install [the tool](${TOOL_OLD}).\n`;
  const D = `Read [the notes](${NOTES}).\n`;
  const ENTRIES = [
    entry(OLD, research({ evidence: "Redirect.", fragments: [{ from: "setup", to: "install" }] }), [
      usage("docs/docs-content/a.md", 1),
      usage("_partials/_b.mdx"),
    ]),
    entry(
      TOOL_OLD,
      research({
        outcome: "update-guidance",
        replacement: TOOL_NEW,
        guidance: "The CLI was renamed.",
        sources: ["https://tool.example.com/changelog"],
      }),
      [usage("docs/docs-content/c.md")]
    ),
    entry(
      NOTES,
      research({
        outcome: "update-guidance",
        replacement: "",
        guidance: "The release notes moved into the changelog.",
        sources: ["https://notes.example.com/changelog"],
      }),
      [usage("docs/docs-content/d.md")]
    ),
    entry(BLOCKED, research({ outcome: "skip-pattern", replacement: "", skipPattern: PATTERN }), []),
    entry(KEEP, research({ outcome: "no-change", replacement: "" })),
  ];
  let repo;
  let work;
  let out;
  let githubOutput;

  beforeEach(() => {
    repo = makeRepo({
      "docs/docs-content/a.md": A,
      "_partials/_b.mdx": `Read [the guide](${OLD}).\n`,
      "docs/docs-content/c.md": C,
      "docs/docs-content/d.md": D,
      "linkinator/linkinator.config.json": config(),
      "linkinator/linkinator-ci.config.json": config({ timeout: 10000 }),
    });
    work = tempDir();
    out = path.join(work, "out");
    fs.mkdirSync(out);
    githubOutput = path.join(work, "github-output");
    fs.writeFileSync(githubOutput, "");
  });
  afterEach(() => {
    fs.rmSync(repo, { recursive: true, force: true });
    fs.rmSync(work, { recursive: true, force: true });
  });

  const apply = (entries) => {
    writeFiles(work, { "research.json": JSON.stringify(entries) });
    return runScript("apply-research.mjs", [path.join(work, "research.json"), repo, out], {
      env: { GITHUB_OUTPUT: githubOutput },
    });
  };
  const readRepo = (file) => fs.readFileSync(path.join(repo, file), "utf8");
  const readOut = (file) => fs.readFileSync(path.join(out, file), "utf8");

  it("swaps the URLs of replace and update-guidance results in the files that use them, and nothing else", () => {
    const result = apply(ENTRIES);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(readRepo("docs/docs-content/a.md"), `See [the guide](${NEW}#install) and [this page](${KEEP}).\n`);
    assert.equal(readRepo("_partials/_b.mdx"), `Read [the guide](${NEW}).\n`);
    assert.equal(readRepo("docs/docs-content/c.md"), `Install [the tool](${TOOL_NEW}).\n`);
    assert.equal(readRepo("docs/docs-content/d.md"), D);
    assert.deepEqual(git(repo, "status", "--porcelain").split("\n").filter(Boolean).sort(), [
      " M _partials/_b.mdx",
      " M docs/docs-content/a.md",
      " M docs/docs-content/c.md",
      " M linkinator/linkinator-ci.config.json",
      " M linkinator/linkinator.config.json",
    ]);
  });

  it("keeps each section of a page apart, with the anchor the researcher mapped it to", () => {
    writeFiles(repo, { "docs/docs-content/vsphere.md": VSPHERE_DOC });
    const usages = [1, 2, 3].map((line) => usage("docs/docs-content/vsphere.md", line));
    const result = apply([
      entry(VSPHERE, research({ replacement: VSPHERE_NEW, fragments: VSPHERE_FRAGMENTS }), usages),
    ]);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(
      readRepo("docs/docs-content/vsphere.md"),
      [
        `Use [remote VMs](${VSPHERE_NEW}#remote-access).`,
        `Use [the clone builder](${VSPHERE_NEW}).`,
        `Read [the provider guide](${VSPHERE_NEW}).`,
        "",
      ].join("\n")
    );
    assert.match(readOut("fix-report.md"), /#accessing-remote-vms → #remote-access, #vsphere-clone-builder → none/);
  });

  it("adds each skip pattern to both linkinator configs, in their format", () => {
    assert.equal(apply(ENTRIES).status, 0);
    const skip = ["^https://skip\\.example\\.com", PATTERN];
    assert.equal(readRepo("linkinator/linkinator.config.json"), config({ skip }));
    assert.equal(readRepo("linkinator/linkinator-ci.config.json"), config({ timeout: 10000, skip }));
  });

  it("writes the fix report, the guidance tasks, and the files that the guidance editor may edit", () => {
    const result = apply(ENTRIES);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(readOut("fix-report.md"), `${fixReport(ENTRIES)}\n`);
    assert.equal(result.stdout, `${fixReport(ENTRIES)}\n`);
    assert.equal(readOut("guidance-tasks.json"), `${JSON.stringify(guidanceTasks(ENTRIES), null, 2)}\n`);
    assert.deepEqual(
      JSON.parse(readOut("guidance-tasks.json")).map((task) => task.url),
      [TOOL_OLD, NOTES]
    );
    assert.equal(readOut("guidance-files.txt"), "docs/docs-content/c.md\ndocs/docs-content/d.md\n");
  });

  it("sets the guidance output when the guidance editor has work", () => {
    assert.equal(apply(ENTRIES).status, 0);
    assert.equal(fs.readFileSync(githubOutput, "utf8"), "guidance=true\n");
  });

  it("sets no output, and writes empty guidance files, when no result needs a guidance change", () => {
    const result = apply([ENTRIES[0], ENTRIES[3], ENTRIES[4]]);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(fs.readFileSync(githubOutput, "utf8"), "");
    assert.equal(readOut("guidance-tasks.json"), "[]\n");
    assert.equal(readOut("guidance-files.txt"), "");
    assert.equal(readRepo("docs/docs-content/a.md"), `See [the guide](${NEW}#install) and [this page](${KEEP}).\n`);
  });

  it("changes no file when no result swaps a URL or adds a pattern", () => {
    const result = apply([
      ENTRIES[4],
      entry("https://gone.example.com/", research({ outcome: "error", replacement: "" })),
    ]);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(git(repo, "status", "--porcelain"), "");
    assert.match(readOut("fix-report.md"), /^## Checked, no change needed\n/);
  });

  it("fails, and changes nothing, when research.json is not valid JSON", () => {
    writeFiles(work, { "research.json": "[{" });
    const result = runScript("apply-research.mjs", [path.join(work, "research.json"), repo, out], {
      env: { GITHUB_OUTPUT: githubOutput },
    });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /SyntaxError/);
    assert.equal(git(repo, "status", "--porcelain"), "");
    assert.deepEqual(fs.readdirSync(out), []);
    assert.equal(fs.readFileSync(githubOutput, "utf8"), "");
  });
});
