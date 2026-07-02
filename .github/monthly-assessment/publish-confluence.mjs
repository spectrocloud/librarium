// Monthly-assessment Confluence publisher (DOC-2472).
//
// Renders the latest month's scorecard plus a rolling N-month trend from the
// committed scorecards/<YYYY-MM>.json files and updates a single living
// Confluence page in the Documentation & Education space.
//
// This step is OPTIONAL and self-disabling: when the Atlassian credentials or
// the target page id are absent, it logs and exits 0 without touching anything.
// The committed Markdown scorecard (from run-assessment.mjs) is the fallback
// until an Atlassian API token is available.
//
// Pure Node (>=20, global fetch), no external dependencies. The network flow
// runs only on direct execution; the render helpers are exported for testing.
//
// Inputs via env:
//   ATLASSIAN_EMAIL      Atlassian account email (basic-auth username).
//   ATLASSIAN_API_TOKEN  Atlassian API token (basic-auth password).
//   CONFLUENCE_PAGE_ID   Target page id (overrides config.confluence.pageId).
//   MA_OUT_DIR           (required) scorecards directory.
//   MA_MONTH             (optional) latest month YYYY-MM (default: current UTC).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const config = (await import(path.join(here, "config.mjs"))).default;

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
const baseUrl = config.confluence.baseUrl.replace(/\/$/, "");

export function esc(s) {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function verdictLabel(v) {
  return { PASS: "✅ PASS", PARTIAL: "🟡 PARTIAL", FAIL: "❌ FAIL", ERROR: "⚠️ ERROR", UNKNOWN: "❔" }[v] || esc(v);
}

// Load the trend window: the newest N month records, newest first.
export function loadRecords(dir) {
  const files = fs
    .readdirSync(dir)
    .filter((f) => /^\d{4}-\d{2}\.json$/.test(f))
    .sort()
    .reverse()
    .slice(0, config.trendMonths);
  return files.map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")));
}

// --- Latest scorecard table -------------------------------------------------
export function scorecardTable(rec) {
  const rows = rec.pages
    .map((p, i) => {
      const gaps = (p.gaps || []).map(esc).join("<br/>") || "—";
      return (
        `<tr><td>${i + 1}</td>` +
        `<td><a href="${esc(p.url)}">${esc(p.path)}</a></td>` +
        `<td style="text-align:right">${esc(p.views ?? "")}</td>` +
        `<td>${esc(p.persona)}</td>` +
        `<td>${verdictLabel(p.verdict)}</td>` +
        `<td style="text-align:center">${p.score ?? "—"}</td>` +
        `<td>${gaps}</td></tr>`
      );
    })
    .join("");
  return (
    "<table><tbody>" +
    "<tr><th>#</th><th>Page</th><th>Views</th><th>Persona</th><th>Verdict</th><th>Score</th><th>Top gaps</th></tr>" +
    rows +
    "</tbody></table>"
  );
}

// --- Rolling trend table (verdict + score per page across months) -----------
export function trendTable(recs) {
  const months = recs.map((r) => r.month); // newest first
  const paths = [];
  const seen = new Set();
  for (const r of recs) {
    for (const p of r.pages) {
      if (!seen.has(p.path)) {
        seen.add(p.path);
        paths.push(p.path);
      }
    }
  }

  const byMonthPath = new Map(); // `${month}|${path}` -> page
  for (const r of recs) for (const p of r.pages) byMonthPath.set(`${r.month}|${p.path}`, p);

  const header = `<tr><th>Page</th>${months.map((m) => `<th>${esc(m)}</th>`).join("")}</tr>`;
  const rows = paths
    .map((pth) => {
      const cells = months
        .map((m) => {
          const p = byMonthPath.get(`${m}|${pth}`);
          return `<td>${p ? `${verdictLabel(p.verdict)} (${p.score ?? "—"})` : "—"}</td>`;
        })
        .join("");
      return `<tr><td>${esc(pth)}</td>${cells}</tr>`;
    })
    .join("");
  const summary = months
    .map((m) => {
      const r = recs.find((x) => x.month === m);
      const pass = r.pages.filter((p) => p.verdict === "PASS").length;
      return `<td><strong>${pass}/${r.pages.length} pass</strong></td>`;
    })
    .join("");
  return "<table><tbody>" + header + rows + `<tr><td><strong>Pass rate</strong></td>${summary}</tr>` + "</tbody></table>";
}

// Parent "Monthly Assessments" page; deep-links to its "Ignored paths" section
// so the scorecard explains why some very popular pages are absent.
const IGNORED_PATHS_URL =
  "https://spectrocloud.atlassian.net/wiki/spaces/DE/pages/3937468432/Monthly+Assessments#Ignored-paths";

export function renderBody(latest, records) {
  return (
    `<p>Monthly persona assessment of the most-visited <code>${esc(config.docsHost)}</code> pages, ` +
    `generated automatically by the <code>monthly-assessment</code> GitHub Action (DOC-2472). ` +
    `Advisory AI feedback — not a substitute for human review. Owners and quick-wins are assigned manually. ` +
    `Some high-traffic front-facing pages are excluded from the ranking — see ` +
    `<a href="${IGNORED_PATHS_URL}">Ignored paths</a>.</p>` +
    `<h2>Latest scorecard — ${esc(latest.month)}</h2>` +
    `<p>Provider <code>${esc(latest.provider)}</code>, model <code>${esc(latest.model)}</code>. ` +
    `Generated ${esc(latest.generatedAt)}.</p>` +
    scorecardTable(latest) +
    `<h2>Rolling ${records.length}-month trend</h2>` +
    trendTable(records)
  );
}

// --- Update the page (read current version, PUT next version) ---------------
async function main() {
  const email = (process.env.ATLASSIAN_EMAIL || "").trim();
  const token = (process.env.ATLASSIAN_API_TOKEN || "").trim();
  const pageId = (process.env.CONFLUENCE_PAGE_ID || config.confluence.pageId || "").trim();
  const outDir = process.env.MA_OUT_DIR;
  const month = (process.env.MA_MONTH || "").trim() || new Date().toISOString().slice(0, 7);

  if (!email || !token || !pageId) {
    console.log(
      "[monthly-assessment] Confluence publishing skipped — set ATLASSIAN_EMAIL, ATLASSIAN_API_TOKEN, and " +
        "CONFLUENCE_PAGE_ID (or config.confluence.pageId) to enable it. The Markdown scorecard is committed as the fallback.",
    );
    return;
  }
  if (!outDir) throw new Error("Missing required env var MA_OUT_DIR");

  const authHeader = `Basic ${Buffer.from(`${email}:${token}`).toString("base64")}`;
  async function confluence(pathname, options = {}) {
    const res = await fetch(`${baseUrl}${pathname}`, {
      ...options,
      headers: { Authorization: authHeader, "Content-Type": "application/json", Accept: "application/json", ...(options.headers || {}) },
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Confluence ${options.method || "GET"} ${pathname} -> ${res.status} ${res.statusText}\n${text.slice(0, 500)}`);
    }
    return res.json();
  }

  const records = loadRecords(outDir);
  const latest = records.find((r) => r.month === month) || records[0];
  if (!latest) throw new Error(`No scorecard JSON found in ${outDir}`);
  const body = renderBody(latest, records);

  const current = await confluence(`/api/v2/pages/${pageId}?body-format=storage`);
  const nextVersion = (current.version?.number || 0) + 1;
  await confluence(`/api/v2/pages/${pageId}`, {
    method: "PUT",
    body: JSON.stringify({
      id: pageId,
      status: "current",
      title: current.title,
      body: { representation: "storage", value: body },
      version: { number: nextVersion, message: `Monthly assessment ${latest.month} (automated)` },
    }),
  });
  console.log(`[monthly-assessment] updated Confluence page ${pageId} to version ${nextVersion} (scorecard ${latest.month}).`);
}

if (isMain) await main();
