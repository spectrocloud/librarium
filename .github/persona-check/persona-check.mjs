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

const question = `${resolveBaseQuestion()}\n${config.formatSuffix}`;

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

  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || "no output").trim().split("\n").slice(-5).join("\n");
    return { relPath, ok: false, persona: "—", body: `Impersonaid run failed:\n\n\`\`\`\n${detail}\n\`\`\`` };
  }

  const files = fs.readdirSync(outDir).filter((f) => f.endsWith(".md"));
  if (files.length === 0) {
    return { relPath, ok: false, persona: "—", body: "Impersonaid produced no output file." };
  }
  const md = fs.readFileSync(path.join(outDir, files[0]), "utf8");
  return { relPath, ok: true, persona: extractPersona(md), body: extractResponse(md) };
}

const results = selected.map((f, i) => reviewFile(f.path, i));

// ---------------------------------------------------------------------------
// Build the aggregated comment body.
// ---------------------------------------------------------------------------
const modelLabel = modelOverride || config.defaultModel?.[provider] || `${provider} default`;
const lines = [];
lines.push(MARKER);
lines.push("## 🤖 Persona check");
lines.push("");
lines.push(
  `Reviewed **${results.length}** file${results.length === 1 ? "" : "s"} using ` +
    `provider \`${provider}\` (model: \`${modelLabel}\`)` +
    (personaInput && personaInput.toLowerCase() !== "auto"
      ? `, persona \`${personaInput}\`.`
      : ", persona auto-selected per file.")
);
lines.push("");
lines.push(
  `<sub>Triggered by ${trigger}. Powered by [Impersonaid](https://github.com/spectrocloud/impersonaid). This is automated UX feedback, not a substitute for human review.</sub>`
);
lines.push("");

for (const r of results) {
  const summary = r.ok
    ? `📄 <code>${r.relPath}</code> — persona: <em>${r.persona}</em>`
    : `⚠️ <code>${r.relPath}</code> — not reviewed`;
  lines.push(`<details><summary>${summary}</summary>`);
  lines.push("");
  lines.push(r.body);
  lines.push("");
  lines.push("</details>");
  lines.push("");
}

fs.writeFileSync(outputPath, lines.join("\n"));
console.log(`Wrote persona-check comment for ${results.length} file(s) to ${outputPath}`);
