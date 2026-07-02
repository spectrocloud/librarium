// Monthly-assessment runner (DOC-2472).
//
// Reads pages.json (from fetch-top-pages.mjs), runs Impersonaid once per page
// with an auto-selected persona, parses a forced VERDICT/SCORE/SUMMARY/GAPS
// block out of each response, and writes the month's scorecard as both JSON
// (the trend source of truth, committed) and Markdown (human-readable artifact
// and the repo-commit fallback when Confluence publishing is not configured).
//
// Pure Node (>=20), no external dependencies. Adapted from
// .github/persona-check/persona-check.mjs (DOC-2473) — the Impersonaid
// invocation, output parsing, and robust "exit 0 but no output" handling are
// shared patterns.
//
// Inputs via env:
//   MA_IMPERSONAID_DIR  (required) Impersonaid checkout (cwd for runs; bundled
//                       ./personas resolve from here).
//   MA_PAGES            (required) path to pages.json ([{url, path, views}]).
//   MA_OUT_DIR          (required) directory for scorecards/<YYYY-MM>.{json,md}.
//   MA_WORK_DIR         (optional) scratch dir for per-page Impersonaid output.
//   MA_PROVIDER         (optional) "anthropic" | "openai" (default from config).
//   MA_MODEL            (optional) model override (empty => Impersonaid default).
//   MA_MONTH            (optional) YYYY-MM override (default: current UTC month).
//   CLAUDE_API_KEY / OPENAI_API_KEY   passed through to Impersonaid.

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const config = (await import(path.join(here, "config.mjs"))).default;

function env(name, fallback = "") {
  const v = process.env[name];
  return v === undefined || v === null ? fallback : v;
}
function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var ${name}`);
  return v;
}

const impersonaidDir = requireEnv("MA_IMPERSONAID_DIR");
const pagesPath = requireEnv("MA_PAGES");
const outDir = requireEnv("MA_OUT_DIR");
const workDir = env("MA_WORK_DIR", path.join(impersonaidDir, ".monthly-assessment-out"));
const providerInput = env("MA_PROVIDER").trim().toLowerCase();
const provider = providerInput === "anthropic" || providerInput === "openai" ? providerInput : config.defaultProvider;
const modelOverride = env("MA_MODEL").trim();
const month = env("MA_MONTH").trim() || new Date().toISOString().slice(0, 7); // YYYY-MM
if (!/^\d{4}-\d{2}$/.test(month)) throw new Error(`MA_MONTH must be in YYYY-MM format (got "${month}")`);

const pages = JSON.parse(fs.readFileSync(pagesPath, "utf8"));
const question = `${config.question}\n${config.formatSuffix}`;

// --- Impersonaid output parsing (shared with persona-check) -----------------
function extractResponse(md) {
  const idx = md.indexOf("## Simulation Response");
  if (idx === -1) return md.trim();
  return md.slice(idx + "## Simulation Response".length).trim();
}
function extractPersona(md) {
  const m = md.match(/^- \*\*Persona\*\*:\s*(.+)$/m);
  return m ? m[1].trim() : "unknown";
}
function extractModel(md) {
  const m = md.match(/^- \*\*Model\*\*:\s*(.+)$/m);
  return m ? m[1].trim() : "";
}
function modelFlags() {
  const model = modelOverride || config.defaultModel?.[provider] || "";
  if (!model) return [];
  return provider === "anthropic" ? ["-a", model] : ["-g", model];
}

// --- Verdict-block parsing (the forced formatSuffix shape) ------------------
function parseVerdict(body) {
  const verdictM = body.match(/VERDICT:\s*(PASS|PARTIAL|FAIL)/i);
  const scoreM = body.match(/SCORE:\s*([1-5])/i);
  const summaryM = body.match(/SUMMARY:\s*(.+?)(?:\n|$)/i);

  // Gaps: everything after "TOP GAPS:" as bullet lines, else the trailing text.
  let gaps = [];
  const gapsIdx = body.search(/TOP GAPS:/i);
  if (gapsIdx !== -1) {
    const after = body.slice(gapsIdx).replace(/TOP GAPS:/i, "");
    gaps = after
      .split("\n")
      .map((l) => l.replace(/^\s*[-*•]\s*/, "").trim())
      .filter((l) => l && !/^none$/i.test(l))
      .slice(0, 2);
  }

  return {
    verdict: verdictM ? verdictM[1].toUpperCase() : "UNKNOWN",
    score: scoreM ? Number(scoreM[1]) : null,
    summary: summaryM ? summaryM[1].trim() : "",
    gaps,
  };
}

function assessPage(page, index) {
  const outSub = path.join(workDir, `page-${index}`);
  fs.mkdirSync(outSub, { recursive: true });

  const args = [
    path.join(impersonaidDir, "index.js"),
    "simulate",
    "-d",
    page.url,
    "-r",
    question,
    "-v",
    provider,
    ...modelFlags(),
    "-p",
    "auto", // always auto-select the persona (DOC-2472 decision)
    "-o",
    outSub,
  ];

  const maxTokensVar = provider === "anthropic" ? "ANTHROPIC_MAX_TOKENS" : "OPENAI_MAX_TOKENS";
  const result = spawnSync("node", args, {
    cwd: impersonaidDir, // so bundled ./personas resolve by default
    encoding: "utf8",
    env: { ...process.env, [maxTokensVar]: String(config.maxTokens) },
    maxBuffer: 20 * 1024 * 1024,
  });

  const combined = `${result.stdout || ""}\n${result.stderr || ""}`.trim();
  const tail = combined.split("\n").filter(Boolean).slice(-15).join("\n") || "no output";

  const base = { path: page.path, url: page.url, views: page.views };

  if (result.status !== 0) {
    console.error(`[monthly-assessment] ${page.path}: exit ${result.status}\n${combined}`);
    return { ...base, ok: false, persona: "—", verdict: "ERROR", score: null, summary: "", gaps: [], error: tail };
  }

  const files = fs.readdirSync(outSub).filter((f) => f.endsWith(".md"));
  if (files.length === 0) {
    // Impersonaid returns 0 even when it aborts early (bad key, fetch failure).
    console.error(`[monthly-assessment] ${page.path}: no output file (exit 0)\n${combined}`);
    return { ...base, ok: false, persona: "—", verdict: "ERROR", score: null, summary: "", gaps: [], error: tail };
  }

  const md = fs.readFileSync(path.join(outSub, files[0]), "utf8");
  const body = extractResponse(md);
  const parsed = parseVerdict(body);
  return {
    ...base,
    ok: true,
    persona: extractPersona(md),
    model: extractModel(md),
    ...parsed,
    response: body, // full prose kept for the Confluence expand / md artifact
  };
}

console.log(
  `[monthly-assessment] provider=${provider} ` +
    `model=${modelOverride || config.defaultModel?.[provider] || "(impersonaid default)"} ` +
    `pages=${pages.length} month=${month} ` +
    `CLAUDE_API_KEY=${!!process.env.CLAUDE_API_KEY} OPENAI_API_KEY=${!!process.env.OPENAI_API_KEY}`,
);

const results = pages.map((p, i) => assessPage(p, i));
const realModel = results.find((r) => r.model)?.model || modelOverride || config.defaultModel?.[provider] || `${provider} default`;

// --- Write the month's JSON record (trend source of truth) ------------------
fs.mkdirSync(outDir, { recursive: true });
const record = {
  month,
  generatedAt: new Date().toISOString(),
  provider,
  model: realModel,
  pages: results.map(({ response, ok, error, ...keep }) => keep), // JSON stays compact; prose lives in the md
};
const jsonPath = path.join(outDir, `${month}.json`);
fs.writeFileSync(jsonPath, JSON.stringify(record, null, 2));

// --- Write the Markdown scorecard (human artifact / Confluence fallback) ----
function verdictBadge(v) {
  return { PASS: "✅ PASS", PARTIAL: "🟡 PARTIAL", FAIL: "❌ FAIL", ERROR: "⚠️ ERROR", UNKNOWN: "❔ UNKNOWN" }[v] || v;
}
const passes = results.filter((r) => r.verdict === "PASS").length;
const partials = results.filter((r) => r.verdict === "PARTIAL").length;
const fails = results.filter((r) => r.verdict === "FAIL").length;

const md = [];
md.push(`# Docs Monthly Assessment — ${month}`);
md.push("");
md.push(
  `Top ${results.length} most-visited \`${config.docsHost}\` pages, assessed by an auto-selected ` +
    `Impersonaid persona (provider \`${provider}\`, model \`${realModel}\`). ` +
    `**${passes} pass · ${partials} partial · ${fails} fail.**`,
);
md.push("");
md.push("> Advisory AI feedback, not a substitute for human review. Assign owners and curate quick wins manually.");
md.push("");
md.push("| # | Page | Views | Persona | Verdict | Score | Top gaps |");
md.push("| - | ---- | ----: | ------- | ------- | :---: | -------- |");
results.forEach((r, i) => {
  const gaps = r.gaps?.length ? r.gaps.join("<br>") : r.error ? `not assessed: ${r.error.split("\n").slice(-1)[0]}` : "—";
  md.push(
    `| ${i + 1} | [${r.path}](${r.url}) | ${r.views} | ${r.persona} | ${verdictBadge(r.verdict)} | ${r.score ?? "—"} | ${gaps} |`,
  );
});
md.push("");
md.push("<details><summary>Full persona responses</summary>");
md.push("");
for (const r of results) {
  md.push(`### ${r.path}`);
  md.push("");
  md.push(r.ok ? r.response : `_Not assessed._\n\n\`\`\`\n${r.error || "no output"}\n\`\`\``);
  md.push("");
}
md.push("</details>");
md.push("");
md.push(`<sub>Generated ${record.generatedAt} · Powered by [Impersonaid](https://github.com/spectrocloud/impersonaid).</sub>`);
const mdPath = path.join(outDir, `${month}.md`);
fs.writeFileSync(mdPath, md.join("\n"));

console.log(`[monthly-assessment] wrote ${jsonPath} and ${mdPath} (${passes} pass / ${partials} partial / ${fails} fail)`);
