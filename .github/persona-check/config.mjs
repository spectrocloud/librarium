// Configuration for the persona-check workflow (DOC-2473).
//
// This file is the single place the docs team edits to tune persona-check
// behaviour. It is plain ESM (no YAML parser needed) so it can be imported
// directly from both the actions/github-script steps (`await import(...)`) and
// the persona-check.mjs review runner.
//
// Impersonaid CLI reference (spectrocloud/impersonaid):
//   node index.js simulate -d <file> -r <question> -v <provider> [-a|-g <model>] [-p <persona>] -o <dir>

export default {
  // ---------------------------------------------------------------------------
  // Provider / model defaults
  // ---------------------------------------------------------------------------
  // Default LLM provider. Override per-run with `provider=openai` in a
  // /persona-check comment. Must be "anthropic" or "openai".
  defaultProvider: "anthropic",

  // Default model per provider. Leave null to use Impersonaid's own default
  // (src/models/models.json, kept current by its model-sync workflow:
  // anthropic -> claude-sonnet-4-6, openai -> gpt-5-chat-latest). Set a string
  // here, or override per-run with `model=...`, to pin a specific model.
  defaultModel: {
    anthropic: null,
    openai: null,
  },

  // Upper bound on response length, enforced via the *_MAX_TOKENS env var that
  // Impersonaid reads (config.js getModelParameters). Keeps reviews succinct
  // (requirement #5). ~600 tokens comfortably fits a short summary + 6 bullets.
  maxTokens: 600,

  // ---------------------------------------------------------------------------
  // File selection
  // ---------------------------------------------------------------------------
  // A changed docs file is reviewed when (additions + deletions) >= threshold.
  // Override per-run with `threshold=N`, or bypass entirely with `files=all`
  // or an explicit `files="path/a.md,path/b.mdx"` list.
  threshold: 20,

  // File extensions eligible for review.
  extensions: [".md", ".mdx"],

  // ---------------------------------------------------------------------------
  // Questions (requirement #3)
  // ---------------------------------------------------------------------------
  // Hard-coded question library. A /persona-check comment can select one by key
  // (`question=troubleshooting`) or supply free text (`question="..."`). When
  // neither is given, defaultQuestion is used. The formatSuffix below is always
  // appended, which also guarantees Impersonaid's request validator passes
  // (>=15 chars / >=3 words / contains a question word or verb).
  defaultQuestion: "general",

  questions: {
    general:
      "Read this documentation page as your persona. Can you accomplish what you came here to do? Explain where the page is clear and where it leaves you stuck or confused.",
    "getting-started":
      "You are new to this product and following this page to get started for the first time. Describe whether you can complete the setup successfully and where you would get blocked.",
    troubleshooting:
      "You hit a problem and opened this page to fix it. Explain whether it helps you diagnose and resolve the issue, and what diagnostic detail is missing.",
    conceptual:
      "You are trying to understand this concept before acting on it. Explain whether the page builds a clear mental model and what assumptions or gaps trip you up.",
    reference:
      "You are using this page as a reference while working. Explain whether you can quickly find accurate, complete parameter and option details, and what is ambiguous or absent.",
  },

  // Appended to every question to constrain output shape and length. This is
  // how requirement #5 (succinct, fixed structure) is enforced, since
  // Impersonaid has no native format flag.
  formatSuffix: [
    "",
    "Respond using EXACTLY this structure and nothing else:",
    "1. A 1-2 sentence summary of your overall experience.",
    "2. A heading \"What this page does well\" followed by exactly 3 short bullet points.",
    "3. A heading \"What could be improved or is missing\" followed by exactly 3 short bullet points.",
    "Keep each bullet to a single concise sentence. Base everything only on the page content.",
  ].join("\n"),
};
