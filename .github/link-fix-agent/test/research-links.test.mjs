import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  findUsages,
  groupReport,
  isCleanUrl,
  isInternal,
  isValidResearch,
  researchAll,
  researchPrompt,
  summarizeRuns,
  unresolved,
} from "../research-links.mjs";

const OLD = "https://old.example.com/guide";
const NEW = "https://new.example.com/guide";
const KEEP = "https://keep.example.com/page";
const INTERNAL = "https://docs.spectrocloud.com/clusters/";
const TOOLS = "WebFetch,WebSearch";

/** A valid researcher result: a replace, unless `fields` says otherwise. */
const research = (fields = {}) => ({
  outcome: "replace",
  replacement: NEW,
  evidence: "The old page redirects to the new guide.",
  guidance: "",
  sources: [],
  skipPattern: "",
  attempts: ["404"],
  notes: "",
  ...fields,
});

/** A researcher's parsed output, as runAgent returns it. */
const output = (structuredOutput, tools = ["WebFetch", "WebSearch"]) => ({
  init: { type: "system", subtype: "init", tools },
  result: { structured_output: structuredOutput, num_turns: 5, total_cost_usd: 0.4, duration_ms: 3000 },
});

const group = (url, statuses = [404]) => ({ url, statuses });
const noUsages = () => [];

describe("groupReport", () => {
  it("groups the entries by URL, as linkinator normalizes it, and keeps each status once", () => {
    const report = [
      { url: `${OLD}#setup`, status: 404, parent: "docs/a.md" },
      { url: OLD, status: 404, parent: "docs/b.md" },
      { url: OLD, status: 500, parent: "docs/c.md" },
      { url: "https://www.weave.works", status: 0, parent: "docs/d.md" },
      { url: "https://www.weave.works/", status: 0, parent: "docs/e.md" },
    ];
    assert.deepEqual(groupReport(report), [
      { url: OLD, statuses: [404, 500] },
      { url: "https://www.weave.works/", statuses: [0] },
    ]);
  });

  it("returns no groups for an empty report", () => {
    assert.deepEqual(groupReport([]), []);
  });
});

describe("isInternal", () => {
  it("is true for a link to the Spectro Cloud docs, in any letter case", () => {
    assert.equal(isInternal(INTERNAL), true);
    assert.equal(isInternal("http://Docs.SpectroCloud.com/api/v1/"), true);
  });

  it("is false for other hosts, including other Spectro Cloud sites", () => {
    for (const url of [
      KEEP,
      "https://www.spectrocloud.com/blog",
      "https://docs.spectrocloud.com.example.com/",
      `https://example.com/?next=${INTERNAL}`,
    ]) {
      assert.equal(isInternal(url), false, url);
    }
  });

  it("is false for text that does not parse as a URL", () => {
    assert.equal(isInternal("docs.spectrocloud.com/clusters/"), false);
    assert.equal(isInternal(""), false);
  });
});

describe("findUsages", () => {
  const files = [
    {
      path: "docs/docs-content/a.md",
      text: `# A\n\nSee [the guide](${OLD}#setup).\nAlso read [this page](${KEEP}).\n`,
    },
    { path: "_partials/_b.mdx", text: `Read [the guide](${OLD}).` },
  ];

  it("finds each line that links to the URL, with its file and 1-based line number", () => {
    assert.deepEqual(findUsages(files, OLD), [
      { file: "docs/docs-content/a.md", line: 3, text: `See [the guide](${OLD}#setup).` },
      { file: "_partials/_b.mdx", line: 1, text: `Read [the guide](${OLD}).` },
    ]);
  });

  it("matches a bare domain in the docs to the URL with its trailing slash", () => {
    const docs = [{ path: "docs/w.md", text: "Intro.\nVisit [Weave](https://www.weave.works) now." }];
    assert.deepEqual(findUsages(docs, "https://www.weave.works/"), [
      { file: "docs/w.md", line: 2, text: "Visit [Weave](https://www.weave.works) now." },
    ]);
  });

  it("does not match a longer URL that starts with the same text", () => {
    const docs = [{ path: "docs/x.md", text: `[a](${OLD}/more) [b](${OLD}s) [c](${OLD}?v=2)` }];
    assert.deepEqual(findUsages(docs, OLD), []);
  });

  it("lists a line once when it links to the URL twice", () => {
    const docs = [{ path: "docs/x.md", text: `[a](${OLD}) and [b](${OLD}#faq)` }];
    assert.equal(findUsages(docs, OLD).length, 1);
  });

  it("trims each line and cuts it to 300 characters", () => {
    const line = `[a](${OLD}) ${"x".repeat(400)}`;
    const [usage] = findUsages([{ path: "docs/x.md", text: `   ${line}   ` }], OLD);
    assert.equal(usage.text, line.slice(0, 300));
  });

  it("returns nothing when no file uses the URL", () => {
    assert.deepEqual(findUsages(files, NEW), []);
    assert.deepEqual(findUsages([], OLD), []);
  });
});

describe("researchPrompt", () => {
  it("gives the URL, its statuses, and each docs line that uses it", () => {
    const usages = [
      { file: "docs/docs-content/a.md", line: 3, text: `See [the guide](${OLD}).` },
      { file: "_partials/_b.mdx", line: 1, text: `Read [it](${OLD}).` },
    ];
    assert.equal(
      researchPrompt({ url: OLD, statuses: [404, 500], usages }),
      [
        `Broken URL: ${OLD}`,
        "Status in the weekly report: 404, 500",
        "",
        "Docs lines that use it:",
        `- docs/docs-content/a.md:3: See [the guide](${OLD}).`,
        `- _partials/_b.mdx:1: Read [it](${OLD}).`,
      ].join("\n")
    );
  });

  it("says when no docs line uses the URL", () => {
    assert.match(
      researchPrompt({ url: OLD, statuses: [404], usages: [] }),
      /Docs lines that use it:\n- \(none found\)$/
    );
  });
});

describe("isCleanUrl", () => {
  it("is true for a single http or https URL", () => {
    assert.equal(isCleanUrl(NEW), true);
    assert.equal(isCleanUrl("http://a.example.com/x?y=1&z=2#part"), true);
  });

  it("is false for a URL that the docs' URL pattern would cut short", () => {
    for (const url of [`${NEW})`, `${NEW} ${KEEP}`, `${NEW}"`, `${NEW}>`, `${NEW}]`, `${NEW}\``, `${NEW}\n`]) {
      assert.equal(isCleanUrl(url), false, JSON.stringify(url));
    }
  });

  it("is false for text that is not an http or https URL", () => {
    for (const url of ["", "https://", "ftp://a.example.com/", "new.example.com/guide", `see ${NEW}`]) {
      assert.equal(isCleanUrl(url), false, JSON.stringify(url));
    }
  });
});

describe("isValidResearch", () => {
  it("accepts each outcome with the fields it needs", () => {
    const guidance = { guidance: "The CLI was renamed.", sources: ["https://tool.example.com/changelog"] };
    for (const result of [
      research(),
      research({ outcome: "update-guidance", replacement: "", ...guidance }),
      research({ outcome: "update-guidance", ...guidance }),
      research({ outcome: "no-change", replacement: "", evidence: "The page loads in a browser." }),
      research({ outcome: "skip-pattern", replacement: "", skipPattern: "^https://blocked\\.example\\.com" }),
      research({ outcome: "error", replacement: "", notes: "Every fetch timed out." }),
    ]) {
      assert.equal(isValidResearch(result), true, result.outcome);
    }
  });

  it("accepts the error result that unresolved builds", () => {
    assert.equal(isValidResearch(unresolved("error", "The researcher failed.")), true);
  });

  it("rejects a replace without a replacement", () => {
    assert.equal(isValidResearch(research({ replacement: "" })), false);
  });

  it("rejects an update-guidance without guidance or without sources", () => {
    const update = { outcome: "update-guidance", replacement: "" };
    assert.equal(isValidResearch(research({ ...update, guidance: "", sources: ["https://s.example.com/"] })), false);
    assert.equal(isValidResearch(research({ ...update, guidance: "Renamed.", sources: [] })), false);
  });

  it("rejects a skip-pattern without a pattern", () => {
    assert.equal(isValidResearch(research({ outcome: "skip-pattern", replacement: "", skipPattern: "" })), false);
  });

  it("rejects a replacement that is not one clean URL, whatever the outcome", () => {
    for (const replacement of [`${NEW})`, `${NEW} ${KEEP}`, `${NEW}\nmore`, "new.example.com/guide"]) {
      assert.equal(isValidResearch(research({ replacement })), false, JSON.stringify(replacement));
    }
    assert.equal(isValidResearch(research({ outcome: "no-change", replacement: `${NEW})` })), false);
  });

  it("rejects an unknown outcome, including needs-human, which only the script sets", () => {
    for (const outcome of ["needs-human", "fixed", "", "REPLACE"]) {
      assert.equal(isValidResearch(research({ outcome })), false, outcome);
    }
  });

  it("rejects a missing field or a field of the wrong type", () => {
    for (const key of [
      "outcome",
      "replacement",
      "evidence",
      "guidance",
      "skipPattern",
      "notes",
      "sources",
      "attempts",
    ]) {
      const result = research();
      delete result[key];
      assert.equal(isValidResearch(result), false, `without ${key}`);
    }
    for (const fields of [
      { replacement: null },
      { notes: 0 },
      { sources: "https://s.example.com/" },
      { sources: [1] },
      { attempts: {} },
      { attempts: [null] },
    ]) {
      assert.equal(isValidResearch(research(fields)), false, JSON.stringify(fields));
    }
  });

  it("rejects a result that is not an object", () => {
    for (const result of [null, undefined, "replace", 42, []]) {
      assert.equal(isValidResearch(result), false, JSON.stringify(result));
    }
  });
});

describe("unresolved", () => {
  it("builds an empty result with the outcome and notes", () => {
    assert.deepEqual(unresolved("needs-human", "An internal link."), {
      outcome: "needs-human",
      replacement: "",
      evidence: "",
      guidance: "",
      sources: [],
      skipPattern: "",
      attempts: [],
      notes: "An internal link.",
    });
  });
});

describe("summarizeRuns", () => {
  it("adds up the turns, cost, and time of the runs", () => {
    const runs = [
      { num_turns: 3, total_cost_usd: 0.5, duration_ms: 1000 },
      { num_turns: 4, total_cost_usd: 0.25, duration_ms: 2500 },
    ];
    assert.deepEqual(summarizeRuns(runs), { num_turns: 7, total_cost_usd: 0.75, duration_ms: 3500 });
  });

  it("counts a missing field as zero", () => {
    assert.deepEqual(summarizeRuns([{ num_turns: 2 }, {}]), { num_turns: 2, total_cost_usd: 0, duration_ms: 0 });
  });

  it("returns zeros for no runs", () => {
    assert.deepEqual(summarizeRuns([]), { num_turns: 0, total_cost_usd: 0, duration_ms: 0 });
  });
});

describe("researchAll", () => {
  /** A runAgent that records each call and answers with `reply(index)`. */
  const fakeAgent = (reply = () => output(research())) => {
    const calls = [];
    const runAgent = async (prompt, index) => {
      calls.push({ prompt, index });
      return reply(index);
    };
    return { calls, runAgent };
  };

  it("researches each URL and returns its result with its usages, and each run's result", async () => {
    const usages = [{ file: "docs/docs-content/a.md", line: 3, text: `See [the guide](${OLD}).` }];
    const { calls, runAgent } = fakeAgent();
    const { entries, runs } = await researchAll([group(OLD)], { usagesFor: () => usages, runAgent, tools: TOOLS });
    assert.deepEqual(entries, [{ url: OLD, statuses: [404], usages, result: research() }]);
    assert.deepEqual(runs, [output(research()).result]);
    assert.deepEqual(calls, [{ prompt: researchPrompt({ url: OLD, statuses: [404], usages }), index: 0 }]);
  });

  it("asks usagesFor for each URL's docs lines and puts them in that URL's prompt", async () => {
    const asked = [];
    const usagesFor = (url) => {
      asked.push(url);
      return [{ file: url === OLD ? "docs/old.md" : "docs/keep.md", line: 7, text: `[link](${url})` }];
    };
    const { calls, runAgent } = fakeAgent();
    const { entries } = await researchAll([group(OLD), group(KEEP)], { usagesFor, runAgent, tools: TOOLS });
    assert.deepEqual(asked, [OLD, KEEP]);
    assert.deepEqual(
      entries.map((entry) => entry.usages[0].file),
      ["docs/old.md", "docs/keep.md"]
    );
    assert.match(calls.find((call) => call.index === 0).prompt, /^- docs\/old\.md:7: \[link\]\(https:\/\/old\./m);
    assert.match(calls.find((call) => call.index === 1).prompt, /^- docs\/keep\.md:7: \[link\]\(https:\/\/keep\./m);
  });

  it("marks an internal URL as needing a human without running a researcher", async () => {
    const { calls, runAgent } = fakeAgent();
    const { entries, runs } = await researchAll([group(INTERNAL), group(OLD)], {
      usagesFor: noUsages,
      runAgent,
      tools: TOOLS,
    });
    assert.deepEqual(
      entries[0].result,
      unresolved("needs-human", "An internal link. Its page or pack was most likely retired.")
    );
    assert.deepEqual(entries[1].result, research());
    assert.deepEqual(
      calls.map((call) => call.index),
      [1]
    );
    assert.equal(runs.length, 1);
  });

  it("throws when a researcher ran with an extra tool, a missing tool, or no init event", async () => {
    for (const init of [{ tools: ["Bash", "WebFetch", "WebSearch"] }, { tools: ["WebFetch"] }, null]) {
      const { runAgent } = fakeAgent(() => ({ ...output(research()), init }));
      await assert.rejects(researchAll([group(OLD)], { usagesFor: noUsages, runAgent, tools: TOOLS }), {
        message: "Researcher 0 ran with tools other than WebFetch,WebSearch.",
      });
    }
  });

  it("accepts a researcher whose tools add StructuredOutput to the expected ones", async () => {
    const { runAgent } = fakeAgent(() => output(research(), ["StructuredOutput", "WebSearch", "WebFetch"]));
    const { entries } = await researchAll([group(OLD)], { usagesFor: noUsages, runAgent, tools: TOOLS });
    assert.deepEqual(entries[0].result, research());
  });

  it("records an error result, and still counts the run, when the researcher's output is not valid", async () => {
    const replies = [output(research({ replacement: "" })), output(undefined)];
    const { runAgent } = fakeAgent((index) => replies[index]);
    const { entries, runs } = await researchAll([group(OLD), group(KEEP)], {
      usagesFor: noUsages,
      runAgent,
      tools: TOOLS,
    });
    const error = unresolved("error", "The researcher returned no valid result.");
    assert.deepEqual(
      entries.map((entry) => entry.result),
      [error, error]
    );
    assert.equal(runs.length, 2);
  });

  it("records an error result when a researcher fails, and researches the other URLs", async () => {
    const runAgent = async (prompt, index) => {
      if (index === 0) throw new Error("exit 1 with no readable output");
      return output(research());
    };
    const { entries, runs } = await researchAll([group(OLD), group(KEEP)], {
      usagesFor: noUsages,
      runAgent,
      tools: TOOLS,
    });
    assert.deepEqual(entries[0].result, unresolved("error", "The researcher failed: exit 1 with no readable output"));
    assert.deepEqual(entries[1].result, research());
    assert.equal(runs.length, 1);
  });

  it("runs no researcher and returns nothing when there are no URLs", async () => {
    const { calls, runAgent } = fakeAgent();
    assert.deepEqual(await researchAll([], { usagesFor: noUsages, runAgent, tools: TOOLS }), { entries: [], runs: [] });
    assert.deepEqual(calls, []);
  });

  /**
   * Researches `count` URLs with researchers that finish one at a time, only
   * when the test lets them, and returns the most that ran at once.
   */
  async function peakResearchers(count, options = {}) {
    const waiting = [];
    let running = 0;
    let peak = 0;
    const runAgent = () => {
      running++;
      peak = Math.max(peak, running);
      return new Promise((resolve) =>
        waiting.push(() => {
          running--;
          resolve(output(research()));
        })
      );
    };
    const groups = Array.from({ length: count }, (_, i) => group(`https://site${i}.example.com/`));
    const done = researchAll(groups, { usagesFor: noUsages, runAgent, tools: TOOLS, ...options });
    for (let finished = 0; finished < count; finished++) {
      // Let the workers start their next researchers before another one finishes.
      await new Promise(setImmediate);
      waiting.shift()();
    }
    const { entries } = await done;
    assert.equal(entries.filter((entry) => entry.result.outcome === "replace").length, count);
    return peak;
  }

  it("runs at most `concurrency` researchers at a time", async () => {
    assert.equal(await peakResearchers(5, { concurrency: 2 }), 2);
    assert.equal(await peakResearchers(3, { concurrency: 1 }), 1);
  });

  it("runs at most three researchers at a time by default", async () => {
    assert.equal(await peakResearchers(7), 3);
  });

  it("runs only as many researchers as there are URLs", async () => {
    assert.equal(await peakResearchers(2, { concurrency: 5 }), 2);
  });

  it("starts no new researcher after one ran with the wrong tools", async () => {
    const started = [];
    const waiting = [];
    const runAgent = (prompt, index) => {
      started.push(index);
      return new Promise((resolve) => waiting.push(resolve));
    };
    const groups = [OLD, KEEP, NEW, "https://d.example.com/"].map((url) => group(url));
    const done = researchAll(groups, { usagesFor: noUsages, runAgent, tools: TOOLS, concurrency: 2 });
    waiting.shift()(output(research(), ["Bash", "WebFetch", "WebSearch"]));
    await assert.rejects(done, /Researcher 0 ran with tools other than/);
    // Researcher 1 was already running when researcher 0 failed the check. Let it finish.
    waiting.shift()(output(research()));
    await new Promise(setImmediate);
    assert.deepEqual(started, [0, 1]);
  });
});
