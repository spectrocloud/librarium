import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";

import { parseValues, renderPrompt } from "../render-prompt.mjs";
import { runScript, tempDir, writeFiles } from "./helpers.mjs";

describe("parseValues", () => {
  const noFiles = () => assert.fail("read a file");

  it("reads NAME=value arguments", () => {
    assert.deepEqual(parseValues(["URL=https://a.example.com/x", "CASE=live"], noFiles), {
      URL: "https://a.example.com/x",
      CASE: "live",
    });
  });

  it("reads a NAME=@file argument through the reader, and trims the file's text", () => {
    const reads = [];
    const readFile = (file) => {
      reads.push(file);
      return '\n[{"url":"x"}]\n\n';
    };
    assert.deepEqual(parseValues(["TASKS=@out/guidance-tasks.json"], readFile), { TASKS: '[{"url":"x"}]' });
    assert.deepEqual(reads, ["out/guidance-tasks.json"]);
  });

  it("keeps every = after the first in the value", () => {
    assert.deepEqual(parseValues(["QUERY=a=b=c"], noFiles), { QUERY: "a=b=c" });
  });

  it("reads an @ that is not at the start as part of the value", () => {
    assert.deepEqual(parseValues(["EMAIL=bot@example.com"], noFiles), { EMAIL: "bot@example.com" });
  });

  it("accepts an empty value and a value across lines", () => {
    assert.deepEqual(parseValues(["EMPTY=", "TEXT=line 1\nline 2"], noFiles), { EMPTY: "", TEXT: "line 1\nline 2" });
  });

  it("returns no values for no arguments", () => {
    assert.deepEqual(parseValues([], noFiles), {});
  });

  it("throws on an argument that is not NAME=value", () => {
    for (const arg of ["URL", "url=x", "=x", "MY-NAME=x", " URL=x"]) {
      assert.throws(() => parseValues([arg], noFiles), { message: `Expected NAME=value or NAME=@file, got: ${arg}` });
    }
  });
});

describe("renderPrompt", () => {
  it("replaces each placeholder with its value", () => {
    assert.equal(
      renderPrompt("URL: {{URL}}\nTasks: {{TASKS}}\n", { URL: "https://a.example.com/", TASKS: "[]" }),
      "URL: https://a.example.com/\nTasks: []\n"
    );
  });

  it("replaces a placeholder each time it appears", () => {
    assert.equal(renderPrompt("{{A}} and {{A}}", { A: "x" }), "x and x");
  });

  it("throws and names the placeholder that has no value", () => {
    assert.throws(() => renderPrompt("URL: {{URL}}\nTasks: {{TASKS}}", { URL: "u" }), {
      message: "No value for: TASKS",
    });
  });

  it("names each missing placeholder once", () => {
    assert.throws(() => renderPrompt("{{A}} {{B}} {{A}}", {}), { message: "No value for: A, B" });
  });

  it("does not expand a placeholder inside an inserted value", () => {
    assert.equal(renderPrompt("{{A}}", { A: "{{B}}", B: "b" }), "{{B}}");
    assert.equal(renderPrompt("{{A}}", { A: "{{MISSING}}" }), "{{MISSING}}");
  });

  it("inserts dollar signs in a value as they are", () => {
    assert.equal(renderPrompt("{{A}}", { A: "$& $1 $$ $`" }), "$& $1 $$ $`");
  });

  it("leaves text that is not a placeholder alone", () => {
    const template = "{{lower}} {A} {{ A }} {{A-B}}";
    assert.equal(renderPrompt(template, {}), template);
  });

  it("allows values that the template does not use", () => {
    assert.equal(renderPrompt("plain", { UNUSED: "x" }), "plain");
  });
});

describe("render-prompt.mjs command line", () => {
  let dir;
  beforeEach(() => {
    dir = tempDir();
    writeFiles(dir, {
      "prompt.md": "Fix {{URL}}.\n\n```json\n{{TASKS}}\n```\n",
      "tasks.json": '\n[{"url":"https://a.example.com/"}]\n\n',
    });
  });
  afterEach(() => fs.rmSync(dir, { recursive: true, force: true }));

  const render = (...args) => runScript("render-prompt.mjs", [path.join(dir, "prompt.md"), ...args]);

  it("prints the template filled with values and file contents", () => {
    const result = render("URL=https://a.example.com/", `TASKS=@${path.join(dir, "tasks.json")}`);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout, 'Fix https://a.example.com/.\n\n```json\n[{"url":"https://a.example.com/"}]\n```\n');
  });

  it("fails, prints nothing, and names the placeholder when a value is missing", () => {
    const result = render("URL=https://a.example.com/");
    assert.notEqual(result.status, 0);
    assert.equal(result.stdout, "");
    assert.match(result.stderr, /No value for: TASKS/);
  });

  it("fails on an argument that is not NAME=value", () => {
    const result = render("URL", "TASKS=[]");
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Expected NAME=value or NAME=@file, got: URL/);
  });

  it("fails when a value's file does not exist", () => {
    const result = render("URL=u", `TASKS=@${path.join(dir, "missing.json")}`);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /ENOENT.*missing\.json/);
  });
});
