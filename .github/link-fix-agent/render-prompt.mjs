#!/usr/bin/env node
// Fills a prompt template's {{NAME}} placeholders and prints the prompt.
//
// The agents that have no file tools get their inputs inside the prompt, so
// this is how a file's contents reach them.
//
// Usage: node render-prompt.mjs <template> NAME=value NAME=@file ...
// A value that starts with @ is replaced by that file's contents.
// Exit 1 when the template uses a placeholder that has no value.

import fs from "node:fs";

import { isMain } from "./lib/cli.mjs";

const PLACEHOLDER = /\{\{([A-Z_]+)\}\}/g;

/** Reads NAME=value and NAME=@file arguments into an object of values. */
export function parseValues(args, readFile = (file) => fs.readFileSync(file, "utf8")) {
  const values = {};
  for (const arg of args) {
    const match = arg.match(/^([A-Z_]+)=(.*)$/s);
    if (!match) throw new Error(`Expected NAME=value or NAME=@file, got: ${arg}`);
    const [, name, value] = match;
    values[name] = value.startsWith("@") ? readFile(value.slice(1)).trim() : value;
  }
  return values;
}

/** Replaces each {{NAME}} in the template. Throws when a placeholder has no value. */
export function renderPrompt(template, values) {
  const missing = [...template.matchAll(PLACEHOLDER)].map(([, name]) => name).filter((name) => !(name in values));
  if (missing.length) throw new Error(`No value for: ${[...new Set(missing)].join(", ")}`);
  return template.replace(PLACEHOLDER, (_, name) => values[name]);
}

// Command line.

function main([templateFile, ...args]) {
  process.stdout.write(renderPrompt(fs.readFileSync(templateFile, "utf8"), parseValues(args)));
}

if (isMain(import.meta.url)) main(process.argv.slice(2));
