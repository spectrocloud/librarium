// persona-check review runner (DOC-2473).
//
// Runs Impersonaid once per selected file and aggregates the results into a
// single Markdown comment body. Pure Node (>=20), no external dependencies.
//
// Invoked by .github/workflows/persona-check.yaml. All inputs arrive via env:
//   PC_IMPERSONAID_DIR  Absolute path to the Impersonaid checkout (cwd for runs).
//   PC_PR_DIR           Absolute path to the checked-out PR head.
//   PC_SELECTED         Path to JSON: [{ path, additions, deletions }, ...].
//   PC_OUTPUT           Path to write the aggregated comment body (Markdown).
//   PC_WORK_DIR         Scratch dir for per-file Impersonaid output.
//   PC_PROVIDER         "anthropic" | "openai" (already resolved to a default).
//   PC_MODEL            Optional model override (empty => Impersonaid default).
//   PC_PERSONA          Optional persona name (empty/"auto" => auto-select).
//   PC_QUESTION         Optional free-text question (wins over PC_QUESTION_KEY).
//   PC_QUESTION_KEY     Optional key into config.questions.
//   PC_TRIGGER          Human-readable description of what triggered the run.
//   CLAUDE_API_KEY / OPENAI_API_KEY   Passed through to Impersonaid.
//
// Impersonaid reads the *_MAX_TOKENS env var itself; we set it from config.

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const MARKER = "<!-- persona-check -->";

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

const impersonaidDir = requireEnv("PC_IMPERSONAID_DIR");
const prDir = requireEnv("PC_PR_DIR");
const outputPath = requireEnv("PC_OUTPUT");
const workDir = env("PC_WORK_DIR", path.join(impersonaidDir, ".persona-check-out"));
const providerInput = env("PC_PROVIDER").trim().toLowerCase();
const provider = providerInput === "anthropic" || providerInput === "openai" ? providerInput : config.defaultProvider;
const modelOverride = env("PC_MODEL").trim();
const personaInput = env("PC_PERSONA").trim();
const trigger = env("PC_TRIGGER", "persona-check");

const selected = JSON.parse(fs.readFileSync(requireEnv("PC_SELECTED"), "utf8"));

// Resolve the question: free text wins, then a named key, then the default.
function resolveBaseQuestion() {
  const free = env("PC_QUESTION").trim();
  if (free) return free;
  const key = env("PC_QUESTION_KEY").trim() || config.defaultQuestion;
  return config.questions[key] || config.questions[config.defaultQuestion];
}

const baseQuestion = resolveBaseQuestion();
const question = `${baseQuestion}\n${config.formatSuffix}`;

// Pull the "## Simulation Response" body out of an Impersonaid output file.
function extractResponse(md) {
  const idx = md.indexOf("## Simulation Response");
  if (idx === -1) return md.trim();
  return md.slice(idx + "## Simulation Response".length).trim();
}

// Read the persona name Impersonaid recorded in the output file header.
function extractPersona(md) {
  const m = md.match(/^- \*\*Persona\*\*:\s*(.+)$/m);
  return m ? m[1].trim() : "unknown";
}

// Read the actual model name Impersonaid recorded in the output file header.
function extractModel(md) {
  const m = md.match(/^- \*\*Model\*\*:\s*(.+)$/m);
  return m ? m[1].trim() : "";
}

function modelFlags() {
  const model = modelOverride || config.defaultModel?.[provider] || "";
  if (!model) return [];
  return provider === "anthropic" ? ["-a", model] : ["-g", model];
}

function personaFlags() {
  if (!personaInput || personaInput.toLowerCase() === "auto") return ["-p", "auto"];
  return ["-p", personaInput];
}

function reviewFile(relPath, index) {
  const absDoc = path.join(prDir, relPath);
  if (!fs.existsSync(absDoc)) {
    return { relPath, ok: false, persona: "—", body: `Skipped: file not found at PR head (\`${relPath}\`).` };
  }

  const outDir = path.join(workDir, `file-${index}`);
  fs.mkdirSync(outDir, { recursive: true });

  const args = [
    path.join(impersonaidDir, "index.js"),
    "simulate",
    "-d",
    absDoc,
    "-r",
    question,
    "-v",
    provider,
    ...modelFlags(),
    ...personaFlags(),
    "-o",
    outDir,
  ];

  const maxTokensVar = provider === "anthropic" ? "ANTHROPIC_MAX_TOKENS" : "OPENAI_MAX_TOKENS";
  const result = spawnSync("node", args, {
    cwd: impersonaidDir, // so bundled ./personas resolve by default
    encoding: "utf8",
    env: { ...process.env, [maxTokensVar]: String(config.maxTokens) },
    maxBuffer: 20 * 1024 * 1024,
  });

  // Combined output, last lines only — Impersonaid logs the real reason here.
  const combined = `${result.stdout || ""}\n${result.stderr || ""}`.trim();
  const tail = combined.split("\n").filter(Boolean).slice(-20).join("\n") || "no output";

  if (result.status !== 0) {
    console.error(`[persona-check] ${relPath}: exit ${result.status}\n${combined}`);
    return { relPath, ok: false, persona: "—", body: `Impersonaid exited with code ${result.status}:\n\n\`\`\`\n${tail}\n\`\`\`` };
  }

  const files = fs.readdirSync(outDir).filter((f) => f.endsWith(".md"));
  if (files.length === 0) {
    // Impersonaid returns 0 even when it aborts early (missing/invalid API key,
    // document-fetch failure, invalid request). Surface its output so the cause
    // is visible instead of a bare "no output file".
    console.error(`[persona-check] ${relPath}: no output file (exit 0)\n${combined}`);
    return {
      relPath,
      ok: false,
      persona: "—",
      body:
        "Impersonaid exited cleanly but wrote no output file. This usually means the run aborted early " +
        "(missing/invalid API key, document fetch failure, or invalid request). Impersonaid output:\n\n" +
        `\`\`\`\n${tail}\n\`\`\``,
    };
  }
  const md = fs.readFileSync(path.join(outDir, files[0]), "utf8");
  return { relPath, ok: true, persona: extractPersona(md), model: extractModel(md), body: extractResponse(md) };
}

console.log(
  `[persona-check] provider=${provider} ` +
    `model=${modelOverride || config.defaultModel?.[provider] || "(impersonaid default)"} ` +
    `files=${selected.length} ` +
    `CLAUDE_API_KEY=${!!process.env.CLAUDE_API_KEY} ` +
    `ANTHROPIC_API_KEY=${!!process.env.ANTHROPIC_API_KEY} ` +
    `OPENAI_API_KEY=${!!process.env.OPENAI_API_KEY}`,
);

const results = selected.map((f, i) => reviewFile(f.path, i));

// ---------------------------------------------------------------------------
// Build the aggregated comment body.
// ---------------------------------------------------------------------------
// Prefer the actual model name Impersonaid reported; fall back to any override
// or configured default, then a generic label if every run failed.
const realModel = results.find((r) => r.model)?.model || modelOverride || config.defaultModel?.[provider] || `${provider} default`;
// "(default)" when the user did not pin a model (and we have a real name to mark).
const defaultMarker = !modelOverride && !/default/i.test(realModel) ? " (default)" : "";

// "YYYY-MM-DD HH:MM UTC" — the comment updates in place, so a stamp tells
// reviewers when it last ran.
const stamp = new Date().toISOString().replace("T", " ").replace(/:\d\d\.\d+Z$/, " UTC");

const lines = [];
lines.push(MARKER);
lines.push("## 🤖 Persona check");
lines.push("");
lines.push(
  `Reviewed **${results.length}** file${results.length === 1 ? "" : "s"} using ` +
    `provider \`${provider}\` (model: \`${realModel}\`${defaultMarker}).` +
    (personaInput && personaInput.toLowerCase() !== "auto"
      ? ` Persona: \`${personaInput}\`.`
      : " Persona auto-selected per file.")
);
lines.push("");

// Warn when files were dropped by the per-run cap so the omission is visible.
const cappedCount = parseInt(env("PC_CAPPED", "0"), 10) || 0;
if (cappedCount > 0) {
  const cap = env("PC_CAP", "").trim();
  lines.push(
    `> ⚠️ **${cappedCount}** additional changed file${cappedCount === 1 ? "" : "s"} ` +
      `${cappedCount === 1 ? "was" : "were"} not reviewed because the per-run limit` +
      `${cap ? ` of ${cap}` : ""} was reached (the largest edits were reviewed first). ` +
      "Re-run with `/persona-check max_files=<n>` to raise it (`0` = no limit).",
  );
  lines.push("");
}
lines.push(
  `<sub>Last updated ${stamp} · Triggered by ${trigger}. Powered by [Impersonaid](https://github.com/spectrocloud/impersonaid). This is automated UX feedback, not a substitute for human review.</sub>`
);
lines.push("");

for (const r of results) {
  const summary = r.ok
    ? `📄 <code>${r.relPath}</code> — persona: <em>${r.persona}</em>`
    : `⚠️ <code>${r.relPath}</code> — not reviewed`;
  lines.push(`<details><summary>${summary}</summary>`);
  lines.push("");
  lines.push(`**Question asked:** ${baseQuestion}`);
  lines.push("");
  lines.push(r.ok ? "**Answer:**" : "**Result:**");
  lines.push("");
  lines.push(r.body);
  lines.push("");
  lines.push("</details>");
  lines.push("");
}

lines.push(config.usage);
lines.push("");

fs.writeFileSync(outputPath, lines.join("\n"));
console.log(`Wrote persona-check comment for ${results.length} file(s) to ${outputPath}`);
