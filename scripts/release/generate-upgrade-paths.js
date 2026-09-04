#!/usr/bin/env node
/*
 * Generate the self-hosted upgrade-path tables in the Palette and VerteX
 * "Upgrade" pages from the "Upgrade Paths" section of the Confluence
 * "Release Artifacts" page.
 *
 * Source of truth:
 *   https://spectrocloud.atlassian.net/wiki/spaces/ENGINEERIN/pages/2087419998/Release+Artifacts
 *
 * The script only rewrites content between marker comments, e.g.:
 *   <!-- upgrade-paths:vmware-4.9:start -->
 *   ...generated table...
 *   <!-- upgrade-paths:vmware-4.9:end -->
 *
 * Scope: only matrix blocks for version 4.6 and newer are auto-managed
 * (vmware/kubernetes 4.6+, appliance 4.7+). The *-prior and legacy 4.5/4.4
 * blocks are left untouched for hand maintenance.
 *
 * Every run prints the rows it adds, removes, and re-marks per block, and fails
 * before writing anything if the Confluence headings changed in a way that would
 * leave marker blocks stale. Refer to the README for the failure modes.
 *
 * The published marks mirror Confluence exactly. As a cross-check, the script reads
 * the bundled Kubernetes version from the matrix's own header and row labels (which
 * differ between the EC binary and the Appliance Installer) and reports any path
 * marked supported that skips a Kubernetes minor version. It reports rather than
 * rewrites: that disagreement means the matrix or its labels need fixing at source
 * (DOC-3097).
 *
 * Usage:
 *   # Reads CONFLUENCE_* env vars from .env (run `make init-release` once,
 *   # fill in the values, then `source .env`).
 *   node scripts/release/generate-upgrade-paths.js --dry-run
 *   node scripts/release/generate-upgrade-paths.js --write
 *
 * After --write, run `npm run format` so the tables match repo style, then
 * review the git diff before committing.
 *
 * Env vars (or matching --confluence-* flags):
 *   CONFLUENCE_BASE_URL   e.g. https://spectrocloud.atlassian.net
 *   CONFLUENCE_PAGE_ID    e.g. 2087419998
 *   CONFLUENCE_EMAIL      your Atlassian account email
 *   CONFLUENCE_API_TOKEN  an Atlassian API token
 */

"use strict";

const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

const CHECK = ":white_check_mark:";
const CROSS = ":x:";
// Staggered/conditional path: supported only through an intermediate hop (for example,
// a Kubernetes minor-version constraint that forbids a direct upgrade). Rendered as a
// linked question mark that points at the hand-written "Kubernetes Version Constraint"
// section, which exists on both the VerteX and Self-Hosted upgrade pages. See DOC-3097.
const QUESTION = "[:question:](#kubernetes-version-constraint)";

// Status cells that intentionally publish nothing. Any other cell that fails to
// classify is reported, so a Confluence wording change cannot silently drop rows.
const DROP_STATUSES = [
  "",
  "-",
  "--",
  "\u2014",
  "n/a",
  "n.a.",
  "na",
  "none",
  "not applicable",
  "not tested",
  "untested",
  "in progress",
  "in-progress",
  "pending",
  "tbd",
];

// Kubernetes minor versions cannot be skipped during an upgrade, so a validated
// path that crosses two or more minors is a contradiction worth reporting. The
// Confluence matrix carries the bundled Kubernetes version per install type in its
// header and row labels ("4.9.x . K8s 1.33.10"), which is the authority: the EC
// binary and the Appliance Installer ship different Kubernetes versions for the
// same Palette release. See DOC-3097.
const MAX_K8S_MINOR_DELTA = 1;

// Confluence install-type heading -> marker install slug.
const INSTALL_MAP = {
  "EC Install": "vmware",
  "Helm Install": "kubernetes",
  "Helm Chart": "kubernetes",
  "Appliance Installer": "appliance",
};

// Only auto-manage blocks at this major.minor or newer.
const MIN_VERSION = [4, 6];

// Both products share the same generated table content; only the surrounding
// tab labels differ, and those live outside the markers.
const DEFAULT_MARKDOWN_PATHS = {
  palette: "docs/docs-content/enterprise-version/upgrade/upgrade.md",
  vertex: "docs/docs-content/vertex/upgrade/upgrade.md",
};

// ---------------------------------------------------------------------------
// Text + version helpers
// ---------------------------------------------------------------------------

function clean(text) {
  return (text || "").replace(/\s+/g, " ").trim();
}

function versionKey(version) {
  const nums = (version || "").match(/\d+/g);
  return nums ? nums.map(Number) : [0];
}

function cmpKey(a, b) {
  const n = Math.max(a.length, b.length);
  for (let i = 0; i < n; i++) {
    const x = a[i] ?? 0;
    const y = b[i] ?? 0;
    if (x !== y) return x - y;
  }
  return 0;
}

function majorMinor(version) {
  const m = (version || "").match(/^(\d+\.\d+)/);
  return m ? m[1] : version;
}

function meetsFloor(mm) {
  return cmpKey(versionKey(mm), MIN_VERSION) >= 0;
}

// Does a Confluence version-group heading ("4.8 -> 4.9", "4.1 through 4.3") name any
// release inside the auto-managed range? A heading with no parseable version counts as
// in scope, so that genuine drift is never hidden behind an unreadable heading.
function headingMeetsFloor(heading) {
  const versions = clean(heading).match(/\d+\.\d+/g);
  if (!versions) return true;
  return versions.some((v) => meetsFloor(v));
}

// Expand cells such as "4.6.25 to .28" or "4.6.25 to 4.6.28" into versions.
function expandTarget(rawTarget) {
  const target = clean(rawTarget);
  let m = target.match(/^(\d+\.\d+)\.(\d+)\s+to\s+\.(\d+)$/i);
  if (m) {
    const [, prefix, start, end] = m;
    return range(Number(start), Number(end)).map((i) => `${prefix}.${i}`);
  }
  m = target.match(/^(\d+\.\d+)\.(\d+)\s+to\s+(\d+\.\d+)\.(\d+)$/i);
  if (m && m[1] === m[3]) {
    const [, prefix, start, , end] = m;
    return range(Number(start), Number(end)).map((i) => `${prefix}.${i}`);
  }
  return [target];
}

function range(start, end) {
  const out = [];
  for (let i = start; i <= end; i++) out.push(i);
  return out;
}

// Split one Markdown table row into trimmed cells. Tolerates the padding Prettier
// adds when it aligns a table, and rows written without outer pipes.
function splitTableRow(line) {
  const trimmed = line.trim();
  if (!trimmed.includes("|")) return [];
  return trimmed
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

// Map a Confluence status cell to a published Support mark, or null to drop the row.
// Matching is by keyword rather than exact equality so that an editorialized cell such
// as "Supported (staggered)" still classifies instead of vanishing from the table.
// Order matters: "not supported" contains "supported", and a staggered cell usually
// says "supported" too, so the narrower cases are tested first.
//   staggered / conditional / intermediate / two-step / ❓ -> ❓ (links to the constraint)
//   not supported / unsupported / fails / ❌              -> ❌
//   supported / verified / passed / ✅                    -> ✅
//   n/a / in progress / blank (refer to DROP_STATUSES)   -> dropped
// Anything else returns null and is reported by the caller.
function statusToMark(status) {
  const s = clean(status).toLowerCase();
  if (isKnownDropStatus(s)) return null;
  if (
    /staggered|conditional|intermediate|see notes?|two[- ]step|not supported directly|\u2753|\u2754|:question:|:grey_question:/.test(
      s
    )
  ) {
    return QUESTION;
  }
  // Negation-aware: "not yet supported" and "not currently supported" must not fall
  // through to the positive branch just because they contain "supported".
  if (/\bnot\b[^.]*\bsupported\b|unsupported|\bfails?\b|\bfailed\b|\u274c|:cross_mark:|:x:/.test(s)) {
    return CROSS;
  }
  if (/supported|verified|passed|\u2705|:white_check_mark:/.test(s)) {
    return CHECK;
  }
  return null;
}

// True when a cell is an expected "publish nothing" value rather than an unknown one.
function isKnownDropStatus(status) {
  return DROP_STATUSES.includes(clean(status).toLowerCase());
}

// ---------------------------------------------------------------------------
// Kubernetes version constraint
// ---------------------------------------------------------------------------

// Pull the bundled Kubernetes version out of a Confluence label cell, for example
// "4.9.x . K8s 1.33.10" or "4.8.x - K8s 1.32.9". Returns null when the label carries
// no version, which is the normal case for Helm installs (the cluster's Kubernetes
// version is managed independently of Palette) and for "K8s TBD" on an unreleased
// version.
function parseK8sLabel(label) {
  const m = clean(label).match(/K8s\s*v?(\d+)\.(\d+)(?:\.\d+)?/i);
  if (!m) return null;
  return { major: Number(m[1]), minor: Number(m[2]) };
}

// Report any path Confluence marks as validated whose own labels say it crosses more
// than MAX_K8S_MINOR_DELTA Kubernetes minor versions. This never rewrites a mark --
// Confluence is the source of truth -- but a disagreement means either the matrix or
// its Kubernetes labels are wrong, which is exactly the defect DOC-3097 was raised
// for. Paths whose labels carry no Kubernetes version are skipped.
function checkK8sConstraint(pathsByInstall, report) {
  for (const [install, paths] of Object.entries(pathsByInstall)) {
    for (const p of paths) {
      if (p.support !== CHECK) continue;
      const from = p.sourceK8s;
      const to = p.targetK8s;
      if (!from || !to) continue;
      const delta = from.major === to.major ? to.minor - from.minor : Infinity;
      if (delta <= MAX_K8S_MINOR_DELTA) continue;
      report.constraintConflicts.push(
        `${install}: ${p.source} -> ${p.target} is marked supported but crosses ` +
          `Kubernetes ${from.major}.${from.minor} -> ${to.major}.${to.minor}`
      );
    }
  }
}

// A fresh collector for everything a run needs to report or fail on.
function newReport() {
  return {
    unknownHeadings: new Set(),
    orphanTables: [],
    unrecognizedCells: [],
    emptyInstalls: [],
    skippedLegacyTables: [],
    constraintConflicts: [],
  };
}

// ---------------------------------------------------------------------------
// HTML parsing
// ---------------------------------------------------------------------------

function getRows($, tableEl) {
  const rows = [];
  $(tableEl)
    .find("tr")
    .each((_, tr) => {
      const cells = [];
      $(tr)
        .find("td, th")
        .each((__, c) => cells.push(clean($(c).text())));
      rows.push(cells);
    });
  return rows;
}

function matrixToPaths(rows, install, report) {
  if (rows.length < 3) return [];
  const paths = [];

  // An unclassifiable cell drops its row from the published table, which is the one
  // failure a reader cannot detect, so record enough to trace it back to Confluence.
  const flag = (raw, source, target) => {
    if (!report) return;
    report.unrecognizedCells.push(
      `${install}: ${source || "?"} -> ${target || "?"} = "${clean(raw)}"`
    );
  };

  // Simple legacy table: From | To | Verified?
  if (
    rows[0].length === 3 &&
    rows[0][0].toLowerCase() === "from" &&
    rows[0][1].toLowerCase() === "to"
  ) {
    for (const row of rows.slice(1)) {
      if (row.length >= 2 && row[0] && row[1]) {
        const raw = row.length > 2 ? row[2] : "verified";
        const mark = statusToMark(raw);
        if (mark) paths.push({ source: row[0], target: row[1], support: mark });
        else if (!isKnownDropStatus(raw)) flag(raw, row[0], row[1]);
      }
    }
    return paths;
  }

  // Matrix table: row 0 = target labels, row 1 = target versions ("to ➡️").
  // The labels carry the bundled Kubernetes version per install type, which differs
  // between the EC binary and the Appliance Installer for the same Palette release.
  const targetLabels = rows[0].slice(2);
  const targetVersions = rows[1].slice(2);
  for (const row of rows.slice(2)) {
    if (row.length < 3) continue;
    const source = row[1];
    if (!/^\d+\.\d+/.test(source)) continue;
    const sourceK8s = parseK8sLabel(row[0]);
    const statuses = row.slice(2);
    for (let i = 0; i < targetVersions.length; i++) {
      const mark = statusToMark(statuses[i]);
      if (!mark) {
        if (!isKnownDropStatus(statuses[i])) flag(statuses[i], source, targetVersions[i]);
        continue;
      }
      const targetK8s = parseK8sLabel(targetLabels[i]);
      for (const target of expandTarget(targetVersions[i])) {
        if (/^\d+\.\d+/.test(target)) {
          paths.push({ source, target, support: mark, sourceK8s, targetK8s });
        }
      }
    }
  }
  return paths;
}

function parseUpgradePaths(html, report) {
  const $ = cheerio.load(html);

  let start = null;
  $("h1, h2").each((_, el) => {
    if (!start && clean($(el).text()) === "Upgrade Paths") start = el;
  });
  if (!start) {
    throw new Error("Could not find an 'Upgrade Paths' heading in the content.");
  }

  const byInstall = { vmware: [], kubernetes: [], appliance: [] };
  let currentInstall = null;
  let lastHeading = null;

  for (const el of $(start).nextAll().toArray()) {
    if (el.type !== "tag") continue;
    const tag = el.name;
    if (tag === "h1") break; // end of the Upgrade Paths section
    if (tag === "h2") {
      // New version-pair group; reset install so bare tables aren't mis-filed.
      currentInstall = null;
      lastHeading = clean($(el).text());
      continue;
    }
    if (tag === "h3") {
      lastHeading = clean($(el).text());
      currentInstall = INSTALL_MAP[lastHeading] || null;
      if (!currentInstall && lastHeading) report.unknownHeadings.add(lastHeading);
      continue;
    }
    let tableEl = null;
    if (tag === "table") tableEl = el;
    else tableEl = $(el).find("table").get(0) || null;
    if (!tableEl) continue;
    if (!currentInstall) {
      // A table with no install context is discarded. Inside the auto-managed range
      // that would leave marker blocks stale, so the run must fail rather than report
      // success on a page whose headings were restructured. The legacy groups below
      // the floor have always been bare tables and are hand-maintained, so they are
      // only noted.
      const where = lastHeading || "(no preceding heading)";
      if (headingMeetsFloor(where)) report.orphanTables.push(where);
      else report.skippedLegacyTables.push(where);
      continue;
    }
    byInstall[currentInstall].push(...matrixToPaths(getRows($, tableEl), currentInstall, report));
  }

  // De-dupe (drop self-upgrades) and sort newest-first.
  const deduped = {};
  for (const [install, paths] of Object.entries(byInstall)) {
    const seen = new Set();
    const unique = [];
    for (const p of paths) {
      const key = `${p.source}|${p.target}|${p.support}`;
      if (!seen.has(key) && p.source !== p.target) {
        seen.add(key);
        unique.push(p);
      }
    }
    unique.sort(
      (a, b) =>
        -(
          cmpKey(versionKey(majorMinor(a.target)), versionKey(majorMinor(b.target))) ||
          cmpKey(versionKey(a.source), versionKey(b.source)) ||
          cmpKey(versionKey(a.target), versionKey(b.target))
        )
    );
    deduped[install] = unique;
    if (!unique.length) report.emptyInstalls.push(install);
  }
  return deduped;
}

// ---------------------------------------------------------------------------
// Markdown rendering + marker replacement
// ---------------------------------------------------------------------------

function groupByMajorMinor(paths) {
  const byMm = {};
  for (const p of paths) {
    const mm = majorMinor(p.target);
    (byMm[mm] = byMm[mm] || []).push(p);
  }
  return byMm;
}

function renderTable(paths) {
  const lines = [
    "| **Source Version** | **Target Version** | **Support** |",
    "| :----------------: | :----------------: | :---------: |",
  ];
  for (const p of paths) {
    lines.push(`| ${p.source} | ${p.target} | ${p.support} |`);
  }
  return lines.join("\n");
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Read the rows already published inside a marker block, so a run can report what it
// changes rather than only that something changed.
function parseRenderedRows(block) {
  const rows = [];
  for (const line of (block || "").split("\n")) {
    const cells = splitTableRow(line);
    if (cells.length === 3 && /^\d+\.\d+/.test(cells[0])) {
      rows.push({ source: cells[0], target: cells[1], support: cells[2] });
    }
  }
  return rows;
}

// Compare published rows with generated ones. A row count alone cannot distinguish a
// clean run from a Confluence change that quietly halved a table, so every run prints
// added, removed, and re-marked rows per block.
function diffRows(oldRows, newRows) {
  const label = (r) => `${r.source} -> ${r.target}`;
  const before = new Map(oldRows.map((r) => [label(r), r.support]));
  const after = new Map(newRows.map((r) => [label(r), r.support]));
  const added = [];
  const removed = [];
  const changed = [];
  for (const [key, mark] of after) {
    if (!before.has(key)) added.push(key);
    else if (before.get(key) !== mark) changed.push(`${key}: ${before.get(key)} -> ${mark}`);
  }
  for (const key of before.keys()) {
    if (!after.has(key)) removed.push(key);
  }
  return { added, removed, changed };
}

function replaceMarkerBlock(markdown, key, table) {
  const re = new RegExp(
    `(<!-- upgrade-paths:${escapeRe(key)}:start -->)([\\s\\S]*?)(<!-- upgrade-paths:${escapeRe(
      key
    )}:end -->)`
  );
  let found = false;
  let previous = "";
  const updated = markdown.replace(re, (_m, open, body, close) => {
    found = true;
    previous = body;
    return `${open}\n\n${table}\n\n${close}`;
  });
  return [updated, found, previous];
}

function replaceUpgradePathMarkers(markdown, pathsByInstall) {
  let updated = markdown;
  const missing = [];
  const changes = [];
  for (const install of ["vmware", "kubernetes", "appliance"]) {
    const paths = pathsByInstall[install];
    if (!paths || !paths.length) continue;
    const byMm = groupByMajorMinor(paths);
    const mms = Object.keys(byMm).sort((a, b) => -cmpKey(versionKey(a), versionKey(b)));
    for (const mm of mms) {
      if (!meetsFloor(mm)) continue; // scope: 4.6+
      const key = `${install}-${mm}`;
      const rows = byMm[mm];
      const [next, found, previous] = replaceMarkerBlock(updated, key, renderTable(rows));
      updated = next;
      if (!found) {
        missing.push(key);
        continue;
      }
      const diff = diffRows(parseRenderedRows(previous), rows);
      if (diff.added.length || diff.removed.length || diff.changed.length) {
        changes.push({ key, diff });
      }
    }
  }
  return [updated, missing, changes];
}

// ---------------------------------------------------------------------------
// Content sources
// ---------------------------------------------------------------------------

async function fetchConfluenceHtml(baseUrl, pageId, email, apiToken) {
  const base = baseUrl.replace(/\/+$/, "");
  const url = `${base}/wiki/rest/api/content/${pageId}?expand=body.storage`;
  const auth = Buffer.from(`${email}:${apiToken}`).toString("base64");
  const res = await fetch(url, {
    headers: { Authorization: `Basic ${auth}`, Accept: "application/json" },
  });
  if (!res.ok) {
    const detail = (await res.text()).slice(0, 800);
    throw new Error(`Confluence API request failed: ${res.status} ${res.statusText}\n${detail}`);
  }
  const data = await res.json();
  const value = data && data.body && data.body.storage && data.body.storage.value;
  if (!value) throw new Error("Confluence response did not include body.storage.value");
  return value;
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = {
    repoPath: process.cwd(),
    paletteMd: null,
    vertexMd: null,
    baseUrl: null,
    pageId: null,
    email: null,
    apiToken: null,
    write: false,
    dryRun: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    switch (a) {
      case "--repo-path": args.repoPath = next(); break;
      case "--palette-md": args.paletteMd = next(); break;
      case "--vertex-md": args.vertexMd = next(); break;
      case "--confluence-base-url": args.baseUrl = next(); break;
      case "--confluence-page-id": args.pageId = next(); break;
      case "--confluence-email": args.email = next(); break;
      case "--confluence-api-token": args.apiToken = next(); break;
      case "--write": args.write = true; break;
      case "--dry-run": args.dryRun = true; break;
      case "-h":
      case "--help": args.help = true; break;
      default:
        throw new Error(`Unknown argument: ${a}`);
    }
  }
  return args;
}

function resolveMarkdownPaths(args) {
  const repo = path.resolve(args.repoPath);
  const paths = {
    palette: args.paletteMd
      ? path.resolve(args.paletteMd)
      : path.join(repo, DEFAULT_MARKDOWN_PATHS.palette),
    vertex: args.vertexMd
      ? path.resolve(args.vertexMd)
      : path.join(repo, DEFAULT_MARKDOWN_PATHS.vertex),
  };
  const missing = Object.entries(paths).filter(([, p]) => !fs.existsSync(p));
  if (missing.length) {
    throw new Error(
      "Could not find Markdown file(s):\n  " +
        missing.map(([prod, p]) => `${prod}: ${p}`).join("\n  ")
    );
  }
  return paths;
}

async function loadHtml(args) {
  const baseUrl = args.baseUrl || process.env.CONFLUENCE_BASE_URL;
  const pageId = args.pageId || process.env.CONFLUENCE_PAGE_ID;
  const email = args.email || process.env.CONFLUENCE_EMAIL;
  const apiToken = args.apiToken || process.env.CONFLUENCE_API_TOKEN;
  const missing = [];
  if (!baseUrl) missing.push("CONFLUENCE_BASE_URL");
  if (!pageId) missing.push("CONFLUENCE_PAGE_ID");
  if (!email) missing.push("CONFLUENCE_EMAIL");
  if (!apiToken) missing.push("CONFLUENCE_API_TOKEN");
  if (missing.length) {
    throw new Error(`Missing Confluence credentials: ${missing.join(", ")}`);
  }
  console.log(`Fetching Confluence page ${pageId}...`);
  return fetchConfluenceHtml(baseUrl, pageId, email, apiToken);
}

const HELP = `Generate self-hosted upgrade-path tables from Confluence.

  node scripts/release/generate-upgrade-paths.js --dry-run
  node scripts/release/generate-upgrade-paths.js --write

Reads Confluence credentials from CONFLUENCE_* env vars (or --confluence-* flags).

Options:
  --repo-path <dir>         Repo root (default: current directory)
  --palette-md <file>       Override Palette upgrade.md path
  --vertex-md <file>        Override VerteX upgrade.md path
  --confluence-base-url <url>
  --confluence-page-id <id>
  --confluence-email <email>
  --confluence-api-token <token>   (prefer the CONFLUENCE_API_TOKEN env var)
  --dry-run                 Report what would change; write nothing
  --write                   Write changes (then run \`npm run format\`)
`;

// Structural drift in the Confluence page silently strands whole marker blocks at
// their old content, so treat it as fatal and stop before anything is written.
function assertNoStructuralDrift(report) {
  const problems = [];
  if (report.orphanTables.length) {
    problems.push(
      `${report.orphanTables.length} table(s) had no install-type heading above them ` +
        `(under: ${[...new Set(report.orphanTables)].join(", ")}). ` +
        `Every marker block for the affected install would keep its old content.`
    );
  }
  if (report.emptyInstalls.length) {
    problems.push(
      `No rows parsed for: ${report.emptyInstalls.join(", ")}. ` +
        `Those marker blocks would keep their old content.`
    );
  }
  if (problems.length) {
    throw new Error(
      `The Confluence page structure changed and the tables cannot be trusted:\n  - ` +
        problems.join("\n  - ") +
        `\nCheck the h3 install-type headings against INSTALL_MAP, then re-run.`
    );
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(HELP);
    return 0;
  }
  if (!args.write && !args.dryRun) {
    throw new Error("Choose --dry-run or --write");
  }

  const markdownPaths = resolveMarkdownPaths(args);
  const html = await loadHtml(args);
  const report = newReport();
  const pathsByInstall = parseUpgradePaths(html, report);
  checkK8sConstraint(pathsByInstall, report);

  console.log("Parsed upgrade paths:");
  for (const [install, paths] of Object.entries(pathsByInstall)) {
    console.log(`  ${install}: ${paths.length} rows`);
  }

  if (report.skippedLegacyTables.length) {
    console.log(
      `Note: skipped ${report.skippedLegacyTables.length} hand-maintained table(s) ` +
        `below ${MIN_VERSION.join(".")} (under: ${[...new Set(report.skippedLegacyTables)].join(", ")})`
    );
  }
  if (report.unknownHeadings.size) {
    console.log(
      `Warning: unrecognized install-type heading(s), not mapped to any install: ` +
        `${[...report.unknownHeadings].join(", ")}`
    );
  }
  if (report.unrecognizedCells.length) {
    console.log(
      `Warning: ${report.unrecognizedCells.length} status cell(s) could not be ` +
        `classified, so their rows are not published:`
    );
    for (const cell of report.unrecognizedCells) console.log(`  ${cell}`);
  }
  if (report.constraintConflicts.length) {
    console.log(
      `Warning: ${report.constraintConflicts.length} path(s) are marked supported but ` +
        `skip a Kubernetes minor version according to the matrix's own labels. Either ` +
        `the mark or the label is wrong -- confirm with Engineering before publishing:`
    );
    for (const line of report.constraintConflicts) console.log(`  ${line}`);
  }

  assertNoStructuralDrift(report);

  for (const [product, mdPath] of Object.entries(markdownPaths)) {
    const markdown = fs.readFileSync(mdPath, "utf8");
    const [updated, missing, changes] = replaceUpgradePathMarkers(markdown, pathsByInstall);

    console.log(`\n${product} (${mdPath})`);
    if (missing.length) {
      console.log(`  Note: no marker for: ${missing.join(", ")}`);
    }
    if (!changes.length) {
      console.log(`  No row changes.`);
    }
    for (const { key, diff } of changes) {
      const counts = [
        `+${diff.added.length}`,
        `-${diff.removed.length}`,
        `~${diff.changed.length}`,
      ].join(" ");
      console.log(`  ${key} (${counts})`);
      for (const row of diff.added) console.log(`    + ${row}`);
      for (const row of diff.removed) console.log(`    - ${row}`);
      for (const row of diff.changed) console.log(`    ~ ${row}`);
    }

    if (args.write) {
      fs.writeFileSync(mdPath, updated, "utf8");
      console.log(`  Updated ${mdPath}`);
    } else {
      console.log(`  Would ${updated !== markdown ? "update" : "leave unchanged"} ${mdPath}`);
    }
  }
  return 0;
}

if (require.main === module) {
  main()
    .then((code) => process.exit(code))
    .catch((err) => {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    });
}

module.exports = {
  checkK8sConstraint,
  diffRows,
  headingMeetsFloor,
  isKnownDropStatus,
  matrixToPaths,
  newReport,
  parseK8sLabel,
  parseRenderedRows,
  parseUpgradePaths,
  renderTable,
  replaceUpgradePathMarkers,
  splitTableRow,
  statusToMark,
};
