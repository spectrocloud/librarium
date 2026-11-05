#!/usr/bin/env node
// Reads the output of a headless Claude Code run, prints its cost, and checks it.
//
// Usage: node agent-run.mjs <output-file> [--tools A,B,...] [--result-to <file>] [--decision-to <file>]
//   <output-file>   stream-json output (one event per line) or json output (one object)
//   --tools         fail unless the run had exactly these tools. Needs stream-json,
//                   whose first event lists the tools.
//   --result-to     write the run's final text, such as the reviewer's report
//   --decision-to   write the run's structured merge decision, and fail unless it is valid
// Exit 0: the checks passed. Exit 1: a check failed.

import fs from "node:fs";

import { isMain } from "./lib/cli.mjs";

/** Splits a run's output into its startup event (stream-json only) and its final result. */
export function parseRun(output) {
  try {
    // json output: one object, whatever its formatting.
    return { init: null, result: JSON.parse(output) };
  } catch {
    // stream-json output: one event per line, from the startup event to the result.
    const lines = output.trim().split("\n");
    return { init: JSON.parse(lines[0]), result: JSON.parse(lines.at(-1)) };
  }
}

/** True when the run had exactly the expected tools, given as "A,B,C". */
export function hasExactTools(init, expected) {
  const actual = [...(init?.tools ?? [])].sort();
  const wanted = expected.split(",").sort();
  return JSON.stringify(actual) === JSON.stringify(wanted);
}

/** Summarizes a run's cost for the log. */
export function costLine(result) {
  return `cost_usd=${result.total_cost_usd} turns=${result.num_turns} is_error=${result.is_error}`;
}

/** True when the structured output is a merge decision that prompts/decision.schema.json allows. */
export function isValidDecision(decision) {
  const isFinding = (f) =>
    typeof f?.finding === "string" && ["fixed", "declined"].includes(f.action) && typeof f.note === "string";
  return (
    typeof decision?.confident === "boolean" &&
    typeof decision.reason === "string" &&
    Array.isArray(decision.findings) &&
    decision.findings.every(isFinding)
  );
}

/** Reads the command-line options into { tools, resultTo, decisionTo }. */
export function parseOptions(args) {
  const options = {};
  const names = { "--tools": "tools", "--result-to": "resultTo", "--decision-to": "decisionTo" };
  for (let i = 0; i < args.length; i += 2) {
    if (!names[args[i]] || args[i + 1] === undefined) throw new Error(`Unknown or incomplete option: ${args[i]}`);
    options[names[args[i]]] = args[i + 1];
  }
  return options;
}

// Command line.

function main([outputFile, ...args]) {
  const options = parseOptions(args);
  const { init, result } = parseRun(fs.readFileSync(outputFile, "utf8"));
  console.log(costLine(result));
  let ok = true;

  if (options.tools) {
    console.log(`Tools: ${JSON.stringify([...(init?.tools ?? [])].sort())}`);
    if (!hasExactTools(init, options.tools)) {
      // An agent without its web tools still "fixes" links, from memory, so this check matters.
      console.log(`::error::The run's tools are not exactly ${options.tools}.`);
      ok = false;
    }
  }
  if (options.resultTo) fs.writeFileSync(options.resultTo, result.result ?? "");
  if (options.decisionTo) {
    const decision = result.structured_output;
    fs.writeFileSync(options.decisionTo, JSON.stringify(decision ?? null, null, 2));
    if (isValidDecision(decision)) {
      console.log(`confident=${decision.confident}: ${decision.reason}`);
    } else {
      console.log("::error::The run returned no valid merge decision.");
      ok = false;
    }
  }
  return ok ? 0 : 1;
}

if (isMain(import.meta.url)) process.exitCode = main(process.argv.slice(2));
