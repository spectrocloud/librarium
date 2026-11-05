#!/usr/bin/env node
// Checks a deploy preview for an agent-made broken-link fix.
//
// Finds the pages that render each changed file, fetches them from the
// preview, and checks that every URL the fix added appears on the page and
// every URL it removed is gone. The fixer agent reads the result when it tests
// the preview, and the merge step requires it to pass.
//
// Usage: node check-preview.mjs <repo-dir> <preview-base-url> <out.json> [<base-ref>]
// <base-ref> is the commit the fix applies to (default HEAD, for an uncommitted fix).
// Exit 0: every page passed. Exit 1: a page failed or could not be found.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const URL_RE = /https?:\/\/[^\s)\]"'<>`]+/g;
const DOCS_ROOT = "docs/docs-content/";
const PARTIALS_ROOT = "_partials/";

const git = (repo, ...args) => execFileSync("git", ["-C", repo, ...args], { encoding: "utf8" });
const urls = (text) => new Set(text.match(URL_RE) ?? []);
const defrag = (url) => url.split("#")[0];
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// A URL is on the page when its href ends right after it. The built HTML may
// leave attributes unquoted and escapes & as &amp;.
const shown = (html, url) =>
  [url, url.replaceAll("&", "&amp;")].some((u) => new RegExp(`${escapeRe(u)}(?=[\\s"'<>#]|$)`).test(html));

// docs/docs-content/a/b/c.md is served at /a/b/c/. A folder's index file, or a
// file named after its folder, is served at the folder.
function route(file) {
  const parts = file
    .slice(DOCS_ROOT.length)
    .replace(/\.mdx?$/, "")
    .split("/");
  const last = parts.at(-1);
  if (last === "index" || (parts.length > 1 && last === parts.at(-2))) parts.pop();
  return `/${parts.join("/")}/`;
}

// _partials/<category>/_<name>.mdx renders wherever a page has
// <PartialsComponent category="<category>" name="<name>" />.
function partialUsers(repo, file) {
  const category = path.dirname(file.slice(PARTIALS_ROOT.length));
  const name = path
    .basename(file)
    .replace(/^_/, "")
    .replace(/\.mdx?$/, "");
  let hits = "";
  try {
    hits = git(repo, "grep", "-l", "-F", `name="${name}"`, "--", DOCS_ROOT);
  } catch {
    return [];
  }
  return hits
    .split("\n")
    .filter(Boolean)
    .filter((f) => fs.readFileSync(path.join(repo, f), "utf8").includes(`category="${category}"`));
}

async function main() {
  const repo = path.resolve(process.argv[2]);
  const base = process.argv[3].replace(/\/$/, "");
  const outPath = process.argv[4];
  const baseRef = process.argv[5] ?? "HEAD";

  const sitemapXml = await (await fetch(`${base}/sitemap.xml`)).text();
  const sitemap = new Set((sitemapXml.match(/<loc>[^<]+/g) ?? []).map((l) => new URL(l.slice(5)).pathname));

  const pages = new Map();
  const missing = [];
  for (const file of git(repo, "diff", "--name-only", baseRef).split("\n").filter(Boolean)) {
    if (!/\.mdx?$/.test(file)) continue;
    const before = urls(git(repo, "show", `${baseRef}:${file}`));
    const after = urls(fs.readFileSync(path.join(repo, file), "utf8"));
    const docs = file.startsWith(PARTIALS_ROOT) ? partialUsers(repo, file) : [file];
    if (docs.length === 0) missing.push(`${file}: no page renders this partial`);
    for (const doc of docs) {
      let r = route(doc);
      if (!sitemap.has(r)) {
        // Docs outside docs-content, or a page with a slug: match the last segment.
        const tail = `/${r.split("/").at(-2)}/`;
        const candidates = [...sitemap].filter((p) => p.endsWith(tail));
        if (candidates.length !== 1) {
          missing.push(`${file}: no single preview page for ${doc} (tried ${r})`);
          continue;
        }
        r = candidates[0];
      }
      const page = pages.get(r) ?? { sources: new Set(), added: new Set(), removed: new Set() };
      page.sources.add(file);
      after.forEach((u) => before.has(u) || page.added.add(defrag(u)));
      before.forEach((u) => after.has(u) || page.removed.add(defrag(u)));
      pages.set(r, page);
    }
  }

  const results = [];
  for (const [r, page] of pages) {
    const res = await fetch(base + r);
    const html = res.ok ? await res.text() : "";
    const notShown = [...page.added].filter((u) => !shown(html, u));
    const stillShown = [...page.removed].filter((u) => shown(html, u));
    results.push({
      url: base + r,
      sources: [...page.sources],
      status: res.status,
      notShown,
      stillShown,
      ok: res.ok && notShown.length === 0 && stillShown.length === 0,
    });
  }

  fs.writeFileSync(outPath, JSON.stringify({ base, pages: results, missing }, null, 2));
  for (const p of results) {
    console.log(`${p.ok ? "PASS" : "FAIL"} ${p.status} ${p.url}`);
    p.notShown.forEach((u) => console.log(`  new URL not on the page: ${u}`));
    p.stillShown.forEach((u) => console.log(`  removed URL still on the page: ${u}`));
  }
  missing.forEach((m) => console.log(`FAIL ${m}`));
  console.log(`Pages checked: ${results.length}  Failed: ${results.filter((p) => !p.ok).length + missing.length}`);
  return results.every((p) => p.ok) && missing.length === 0 && results.length > 0 ? 0 : 1;
}

process.exitCode = await main();
