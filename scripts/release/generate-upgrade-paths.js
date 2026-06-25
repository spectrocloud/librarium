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

// Map a Confluence status cell to a published Support mark, or null to drop.
// Decision: mirror the live docs.
//   supported / verified / ✅            -> ✅
//   fails / not supported / ❌ / cross    -> ❌
//   n/a / NA / in progress / blank        -> dropped
function statusToMark(status) {
  const s = clean(status).toLowerCase();
  if (["supported", "verified", "✅", ":white_check_mark:"].includes(s)) {
    return CHECK;
  }
  if (
    [
      "fails",
      "fail",
      "failed",
      "not supported",
      "unsupported",
      "❌",
      ":cross_mark:",
      ":x:",
    ].includes(s)
  ) {
    return CROSS;
  }
  // n/a, na, "in progress", blank, notes, etc. are not published.
  return null;
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

function matrixToPaths(rows) {
  if (rows.length < 3) return [];
  const paths = [];

  // Simple legacy table: From | To | Verified?
  if (
    rows[0].length === 3 &&
    rows[0][0].toLowerCase() === "from" &&
    rows[0][1].toLowerCase() === "to"
  ) {
    for (const row of rows.slice(1)) {
      if (row.length >= 2 && row[0] && row[1]) {
        const mark = statusToMark(row.length > 2 ? row[2] : "verified");
        if (mark) paths.push({ source: row[0], target: row[1], support: mark });
      }
    }
    return paths;
  }

  // Matrix table: row 0 = target labels, row 1 = target versions ("to ➡️").
  const targetVersions = rows[1].slice(2);
  for (const row of rows.slice(2)) {
    if (row.length < 3) continue;
    const source = row[1];
    if (!/^\d+\.\d+/.test(source)) continue;
    const statuses = row.slice(2);
    for (let i = 0; i < targetVersions.length; i++) {
      const mark = statusToMark(statuses[i]);
      if (!mark) continue;
      for (const target of expandTarget(targetVersions[i])) {
        if (/^\d+\.\d+/.test(target)) {
          paths.push({ source, target, support: mark });
        }
      }
    }
  }
  return paths;
}

function parseUpgradePaths(html) {
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

  for (const el of $(start).nextAll().toArray()) {
    if (el.type !== "tag") continue;
    const tag = el.name;
    if (tag === "h1") break; // end of the Upgrade Paths section
    if (tag === "h2") {
      // New version-pair group; reset install so bare tables aren't mis-filed.
      currentInstall = null;
      continue;
    }
    if (tag === "h3") {
      currentInstall = INSTALL_MAP[clean($(el).text())] || null;
      continue;
    }
    let tableEl = null;
    if (tag === "table") tableEl = el;
    else tableEl = $(el).find("table").get(0) || null;
    if (tableEl && currentInstall) {
      byInstall[currentInstall].push(...matrixToPaths(getRows($, tableEl)));
    }
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

function replaceMarkerBlock(markdown, key, table) {
  const re = new RegExp(
    `(<!-- upgrade-paths:${escapeRe(key)}:start -->)[\\s\\S]*?(<!-- upgrade-paths:${escapeRe(
      key
    )}:end -->)`
  );
  let found = false;
  const updated = markdown.replace(re, (_m, open, close) => {
    found = true;
    return `${open}\n\n${table}\n\n${close}`;
  });
  return [updated, found];
}

function replaceUpgradePathMarkers(markdown, pathsByInstall) {
  let updated = markdown;
  const missing = [];
  for (const install of ["vmware", "kubernetes", "appliance"]) {
    const paths = pathsByInstall[install];
    if (!paths || !paths.length) continue;
    const byMm = groupByMajorMinor(paths);
    const mms = Object.keys(byMm).sort((a, b) => -cmpKey(versionKey(a), versionKey(b)));
    for (const mm of mms) {
      if (!meetsFloor(mm)) continue; // scope: 4.6+
      const key = `${install}-${mm}`;
      const [next, found] = replaceMarkerBlock(updated, key, renderTable(byMm[mm]));
      updated = next;
      if (!found) missing.push(key);
    }
  }
  return [updated, missing];
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
  const pathsByInstall = parseUpgradePaths(html);

  console.log("Parsed upgrade paths:");
  for (const [install, paths] of Object.entries(pathsByInstall)) {
    console.log(`  ${install}: ${paths.length} rows`);
  }

  for (const [product, mdPath] of Object.entries(markdownPaths)) {
    const markdown = fs.readFileSync(mdPath, "utf8");
    const [updated, missing] = replaceUpgradePathMarkers(markdown, pathsByInstall);
    if (missing.length) {
      console.log(`Note: ${product} had no marker for: ${missing.join(", ")}`);
    }
    if (args.write) {
      fs.writeFileSync(mdPath, updated, "utf8");
      console.log(`Updated ${mdPath}`);
    } else {
      const changed = updated !== markdown;
      console.log(`Would ${changed ? "update" : "leave unchanged"} ${mdPath}`);
    }
  }
  return 0;
}

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  });
