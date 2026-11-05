#!/usr/bin/env node
// Checks the deploy preview of the agent's broken-link fix.
//
// For each changed docs file, it finds the pages that render the file, fetches
// them from the preview, and checks that each URL the fix added is on the page
// and each URL it removed is gone. The fixer agent reads the result when it
// tests the preview, and the job merges only when every page passes.
//
// Usage: node check-preview.mjs <repo-dir> <preview-url> <out.json> [<base-ref>]
// <base-ref> is the commit that the fix applies to: HEAD (the default) while the
// fix is uncommitted, and HEAD~1 after the PR step commits it.
// Exit 0: every page passed. Exit 1: a page failed or could not be found.

import fs from "node:fs";
import path from "node:path";

import { isMain } from "./lib/cli.mjs";
import { git } from "./lib/run.mjs";
import { findUrls, urlChanges, withoutFragment } from "./lib/urls.mjs";

const DOCS_ROOT = "docs/docs-content/";
// Each product's folder name is also its route prefix (productDocs.js).
const PRODUCTS_ROOT = "docs/products/";
const PARTIALS_ROOT = "_partials/";

/**
 * Returns the route that serves a docs file, or null for a file outside the
 * docs. docs/docs-content/a/b/c.md is served at /a/b/c/, and
 * docs/products/<product>/a.md at /<product>/a/. A folder's index.md, or a file
 * named after its folder, is served at the folder.
 */
export function routeForDocFile(file) {
  const root = [DOCS_ROOT, PRODUCTS_ROOT].find((r) => file.startsWith(r));
  if (!root) return null;
  const parts = file
    .slice(root.length)
    .replace(/\.mdx?$/, "")
    .split("/");
  const last = parts.at(-1);
  if (last === "index" || (parts.length > 1 && last === parts.at(-2))) parts.pop();
  return `/${parts.join("/")}/`;
}

/** Returns the category and name that a <PartialsComponent> uses for a partial: _partials/<category>/_<name>.mdx. */
export function partialId(file) {
  return {
    category: path.dirname(file.slice(PARTIALS_ROOT.length)),
    name: path
      .basename(file)
      .replace(/^_/, "")
      .replace(/\.mdx?$/, ""),
  };
}

/** True when one <PartialsComponent> on the page has both the partial's category and its name. */
export function rendersPartial(pageText, { category, name }) {
  const components = pageText.match(/<PartialsComponent\b[^>]*>/g) ?? [];
  return components.some((tag) => tag.includes(`category="${category}"`) && tag.includes(`name="${name}"`));
}

/** Returns the pathnames that a sitemap lists. */
export function sitemapPaths(xml) {
  return new Set((xml.match(/<loc>[^<]+/g) ?? []).map((loc) => new URL(loc.slice("<loc>".length)).pathname));
}

/**
 * Returns the sitemap path for `route`, or null. When the route is not in the
 * sitemap, as for docs outside docs-content or a page with a custom slug, a
 * single sitemap path that ends in the same segment matches instead.
 */
export function resolveRoute(route, paths) {
  if (paths.has(route)) return route;
  const lastSegment = `/${route.split("/").at(-2)}/`;
  const matches = [...paths].filter((p) => p.endsWith(lastSegment));
  return matches.length === 1 ? matches[0] : null;
}

/** True when `html` links to `url`. The built HTML can leave attributes unquoted and escapes & as &amp;. */
export function linkShown(html, url) {
  const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return [url, url.replaceAll("&", "&amp;")].some((form) =>
    new RegExp(`${escapeRegExp(form)}(?=[\\s"'<>#]|$)`).test(html)
  );
}

/**
 * Groups the changed files by the preview page that renders them.
 * `changes` holds each file's path and its text before and after the fix.
 * `pagesUsingPartial` returns the docs files that render a partial.
 */
export function planPages(changes, { sitemap, pagesUsingPartial }) {
  const pages = new Map();
  const missing = [];
  for (const { path: file, before, after } of changes) {
    const { removed, added } = urlChanges(findUrls(before), findUrls(after));
    const docFiles = file.startsWith(PARTIALS_ROOT) ? pagesUsingPartial(file) : [file];
    if (docFiles.length === 0) missing.push(`${file}: no page renders this partial`);
    for (const docFile of docFiles) {
      const expectedRoute = routeForDocFile(docFile);
      const route = expectedRoute && resolveRoute(expectedRoute, sitemap);
      if (!route) {
        missing.push(`${file}: no single preview page for ${docFile} (tried ${expectedRoute ?? "no route"})`);
        continue;
      }
      const page = pages.get(route) ?? { sources: new Set(), added: new Set(), removed: new Set() };
      page.sources.add(file);
      added.forEach((url) => page.added.add(withoutFragment(url)));
      removed.forEach((url) => page.removed.add(withoutFragment(url)));
      pages.set(route, page);
    }
  }
  return { pages, missing };
}

/** Fetches each page with `fetchPage(url)`, which returns { status, ok, text }, and checks its links. */
export async function checkPages(pages, base, fetchPage) {
  const results = [];
  for (const [route, page] of pages) {
    const response = await fetchPage(base + route);
    const html = response.ok ? response.text : "";
    const notShown = [...page.added].filter((url) => !linkShown(html, url));
    const stillShown = [...page.removed].filter((url) => linkShown(html, url));
    results.push({
      url: base + route,
      sources: [...page.sources],
      status: response.status,
      notShown,
      stillShown,
      ok: response.ok && notShown.length === 0 && stillShown.length === 0,
    });
  }
  return results;
}

/** True when there was at least one page, every page passed, and every changed file had a page. */
export function previewPassed(results, missing) {
  return results.length > 0 && missing.length === 0 && results.every((result) => result.ok);
}

/** Formats the result. The fixer agent reads the PASS and FAIL lines. */
export function formatResults(results, missing) {
  const failed = results.filter((result) => !result.ok).length + missing.length;
  return [
    ...results.flatMap((result) => [
      `${result.ok ? "PASS" : "FAIL"} ${result.status} ${result.url}`,
      ...result.notShown.map((url) => `  new URL not on the page: ${url}`),
      ...result.stillShown.map((url) => `  removed URL still on the page: ${url}`),
    ]),
    ...missing.map((line) => `FAIL ${line}`),
    `Pages checked: ${results.length}  Failed: ${failed}`,
  ].join("\n");
}

// Command line.

async function fetchPage(url) {
  const response = await fetch(url);
  return { status: response.status, ok: response.ok, text: response.ok ? await response.text() : "" };
}

function readChanges(repo, baseRef) {
  return git(repo, "diff", "--name-only", baseRef)
    .split("\n")
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => ({
      path: file,
      before: git(repo, "show", `${baseRef}:${file}`),
      after: fs.readFileSync(path.join(repo, file), "utf8"),
    }));
}

function docsFilesUsingPartial(repo, partialFile) {
  const id = partialId(partialFile);
  let candidates = "";
  try {
    candidates = git(repo, "grep", "-l", "-F", `name="${id.name}"`, "--", DOCS_ROOT);
  } catch {
    return []; // git grep exits 1 when nothing matches.
  }
  return candidates
    .split("\n")
    .filter(Boolean)
    .filter((file) => rendersPartial(fs.readFileSync(path.join(repo, file), "utf8"), id));
}

async function main([repoArg, previewUrl, outPath, baseRef = "HEAD"]) {
  const repo = path.resolve(repoArg);
  const base = previewUrl.replace(/\/$/, "");
  const sitemap = sitemapPaths((await fetchPage(`${base}/sitemap.xml`)).text);

  const { pages, missing } = planPages(readChanges(repo, baseRef), {
    sitemap,
    pagesUsingPartial: (file) => docsFilesUsingPartial(repo, file),
  });
  const results = await checkPages(pages, base, fetchPage);

  fs.writeFileSync(outPath, JSON.stringify({ base, pages: results, missing }, null, 2));
  console.log(formatResults(results, missing));
  return previewPassed(results, missing) ? 0 : 1;
}

if (isMain(import.meta.url)) process.exitCode = await main(process.argv.slice(2));
