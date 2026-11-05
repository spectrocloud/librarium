import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";

import { costLine, hasExactTools, isValidDecision, parseOptions, parseRun } from "../agent-run.mjs";
import { runScript, tempDir, writeFiles } from "./helpers.mjs";

const INIT = { type: "system", subtype: "init", tools: ["Read", "Edit", "WebFetch"] };
const RESULT = { type: "result", result: "Done.", total_cost_usd: 1.23, num_turns: 7, is_error: false };
const DECISION = {
  confident: true,
  reason: "The swaps match the redirects.",
  findings: [{ finding: "Typo.", action: "fixed", note: "Fixed." }],
};
const streamJson = (...events) => events.map((event) => JSON.stringify(event)).join("\n") + "\n";

describe("parseRun", () => {
  it("reads json output as the result, with no init event", () => {
    assert.deepEqual(parseRun(JSON.stringify(RESULT)), { init: null, result: RESULT });
  });

  it("reads pretty-printed json output", () => {
    assert.deepEqual(parseRun(JSON.stringify(RESULT, null, 2)), { init: null, result: RESULT });
  });

  it("reads stream-json output: the first event is init, the last is the result", () => {
    const output = streamJson(INIT, { type: "assistant", message: {} }, RESULT);
    assert.deepEqual(parseRun(output), { init: INIT, result: RESULT });
  });

  it("reads a one-line stream-json output as json, with no init event", () => {
    assert.deepEqual(parseRun(streamJson(RESULT)), { init: null, result: RESULT });
  });

  it("throws on output that is neither json nor stream-json", () => {
    assert.throws(() => parseRun("Error: not logged in\n"), SyntaxError);
    assert.throws(() => parseRun(`${JSON.stringify(INIT)}\n{"type": "result",`), SyntaxError);
  });

  it("throws on empty output, as from a run that crashed", () => {
    assert.throws(() => parseRun(""), SyntaxError);
  });
});

describe("hasExactTools", () => {
  it("is true when the tools match in any order", () => {
    assert.equal(hasExactTools(INIT, "WebFetch,Read,Edit"), true);
  });

  it("is false when the run had an extra tool or lacked one", () => {
    assert.equal(hasExactTools(INIT, "Read,Edit"), false);
    assert.equal(hasExactTools(INIT, "Read,Edit,WebFetch,WebSearch"), false);
  });

  it("is false when the run has no init event or no tools", () => {
    assert.equal(hasExactTools(null, "Read"), false);
    assert.equal(hasExactTools({ type: "system" }, "Read"), false);
  });

  it("does not trim spaces around tool names", () => {
    assert.equal(hasExactTools(INIT, "Read, Edit, WebFetch"), false);
  });
});

describe("costLine", () => {
  it("summarizes the cost, turns, and error flag", () => {
    assert.equal(costLine(RESULT), "cost_usd=1.23 turns=7 is_error=false");
  });

  it("prints undefined for fields the result lacks", () => {
    assert.equal(costLine({}), "cost_usd=undefined turns=undefined is_error=undefined");
  });
});

describe("isValidDecision", () => {
  it("accepts a decision with findings, or with none", () => {
    assert.equal(isValidDecision(DECISION), true);
    assert.equal(isValidDecision({ ...DECISION, confident: false, findings: [] }), true);
    assert.equal(
      isValidDecision({ ...DECISION, findings: [{ finding: "x", action: "declined", note: "Out of scope." }] }),
      true
    );
  });

  it("rejects a missing decision", () => {
    assert.equal(isValidDecision(null), false);
    assert.equal(isValidDecision(undefined), false);
  });

  it("rejects a decision with a wrong type or a missing field", () => {
    assert.equal(isValidDecision({ ...DECISION, confident: "true" }), false);
    assert.equal(isValidDecision({ ...DECISION, reason: undefined }), false);
    assert.equal(isValidDecision({ ...DECISION, findings: "none" }), false);
    assert.equal(isValidDecision({ confident: true, reason: "r" }), false);
  });

  it("rejects a finding with an unknown action or no finding text", () => {
    assert.equal(isValidDecision({ ...DECISION, findings: [{ finding: "x", action: "ignored", note: "n" }] }), false);
    assert.equal(isValidDecision({ ...DECISION, findings: [{ action: "fixed", note: "n" }] }), false);
  });

  it("rejects a finding without the note that the schema requires", () => {
    assert.equal(isValidDecision({ ...DECISION, findings: [{ finding: "x", action: "fixed" }] }), false);
  });

  it("rejects a null finding instead of throwing", () => {
    assert.equal(isValidDecision({ ...DECISION, findings: [null] }), false);
  });
});

describe("parseOptions", () => {
  it("reads every option", () => {
    assert.deepEqual(parseOptions(["--tools", "Read,Edit", "--result-to", "r.md", "--decision-to", "d.json"]), {
      tools: "Read,Edit",
      resultTo: "r.md",
      decisionTo: "d.json",
    });
  });

  it("returns no options for no arguments", () => {
    assert.deepEqual(parseOptions([]), {});
  });

  it("throws on an unknown option", () => {
    assert.throws(() => parseOptions(["--model", "opus"]), /Unknown or incomplete option: --model/);
  });

  it("throws on an option without a value", () => {
    assert.throws(() => parseOptions(["--tools"]), /Unknown or incomplete option: --tools/);
  });
});

describe("agent-run.mjs command line", () => {
  let dir;
  beforeEach(() => {
    dir = tempDir();
  });
  afterEach(() => fs.rmSync(dir, { recursive: true, force: true }));

  const file = (name) => path.join(dir, name);
  const agentRun = (output, ...args) => {
    writeFiles(dir, { "run.out": output });
    return runScript("agent-run.mjs", [file("run.out"), ...args]);
  };

  it("passes when the run had exactly the expected tools, and prints its cost and tools", () => {
    const result = agentRun(streamJson(INIT, RESULT), "--tools", "Edit,Read,WebFetch");
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.equal(result.stdout, 'cost_usd=1.23 turns=7 is_error=false\nTools: ["Edit","Read","WebFetch"]\n');
  });

  it("fails when the run had an extra tool", () => {
    const result = agentRun(
      streamJson({ ...INIT, tools: [...INIT.tools, "Bash"] }, RESULT),
      "--tools",
      "Edit,Read,WebFetch"
    );
    assert.equal(result.status, 1);
    assert.match(result.stdout, /::error::The run's tools are not exactly Edit,Read,WebFetch\./);
  });

  it("fails when the run lacked a tool", () => {
    const result = agentRun(streamJson({ ...INIT, tools: ["Read"] }, RESULT), "--tools", "Edit,Read,WebFetch");
    assert.equal(result.status, 1);
    assert.match(result.stdout, /::error::/);
  });

  it("fails the tools check on json output, which lists no tools", () => {
    const result = agentRun(JSON.stringify(RESULT), "--tools", "Read");
    assert.equal(result.status, 1);
    assert.match(result.stdout, /Tools: \[\]/);
  });

  it("passes with no checks and only prints the cost", () => {
    const result = agentRun(JSON.stringify(RESULT));
    assert.equal(result.status, 0);
    assert.equal(result.stdout, "cost_usd=1.23 turns=7 is_error=false\n");
  });

  it("writes the run's final text with --result-to", () => {
    const result = agentRun(streamJson(INIT, RESULT), "--result-to", file("review.md"));
    assert.equal(result.status, 0);
    assert.equal(fs.readFileSync(file("review.md"), "utf8"), "Done.");
  });

  it("writes an empty file with --result-to when the run has no final text", () => {
    const result = agentRun(JSON.stringify({ ...RESULT, result: undefined }), "--result-to", file("review.md"));
    assert.equal(result.status, 0);
    assert.equal(fs.readFileSync(file("review.md"), "utf8"), "");
  });

  it("writes a valid decision with --decision-to and prints it", () => {
    const result = agentRun(
      JSON.stringify({ ...RESULT, structured_output: DECISION }),
      "--decision-to",
      file("d.json")
    );
    assert.equal(result.status, 0, result.stdout);
    assert.match(result.stdout, /confident=true: The swaps match the redirects\./);
    assert.deepEqual(JSON.parse(fs.readFileSync(file("d.json"), "utf8")), DECISION);
  });

  it("fails with --decision-to when the decision is invalid, and still writes it", () => {
    const invalid = { confident: "yes", reason: "r", findings: [] };
    const result = agentRun(JSON.stringify({ ...RESULT, structured_output: invalid }), "--decision-to", file("d.json"));
    assert.equal(result.status, 1);
    assert.match(result.stdout, /::error::The run returned no valid merge decision\./);
    assert.deepEqual(JSON.parse(fs.readFileSync(file("d.json"), "utf8")), invalid);
  });

  it("fails with --decision-to when the run returned no decision, and writes null", () => {
    const result = agentRun(JSON.stringify(RESULT), "--decision-to", file("d.json"));
    assert.equal(result.status, 1);
    assert.equal(fs.readFileSync(file("d.json"), "utf8"), "null");
  });

  it("throws on an unknown option", () => {
    const result = agentRun(JSON.stringify(RESULT), "--model", "opus");
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Unknown or incomplete option: --model/);
  });

  it("throws on output that it cannot parse", () => {
    const result = agentRun("Error: not logged in\n");
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /SyntaxError/);
  });
});
