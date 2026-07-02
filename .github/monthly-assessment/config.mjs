// Configuration for the monthly-assessment workflow (DOC-2472, epic DOC-2348).
//
// Option 2 of the Impersonaid epic: a lightweight monthly process that selects
// the most-visited docs pages (FullStory), runs a persona check against each
// (auto-selected persona), and records pass/fail + 1-2 gaps per page in a
// one-page scorecard with a rolling 3-month trend.
//
// This file is the single place the docs team edits to tune behaviour. It is
// plain ESM (no YAML parser needed) so it can be imported directly from every
// script in this directory and from actions/github-script steps.
//
// Impersonaid CLI reference (spectrocloud/impersonaid):
//   node index.js simulate -d <url> -r <question> -v <provider> [-a|-g <model>] [-p <persona>] -o <dir>

export default {
  // ---------------------------------------------------------------------------
  // Page selection (FullStory)
  // ---------------------------------------------------------------------------
  // How many of the most-visited pages to assess each month. Each page is one
  // LLM call, so this is also the monthly API-call budget.
  topPages: 10,

  // Only pages served from this host are considered. FullStory captures URLs
  // across the whole site; we assess documentation pages only.
  docsHost: "docs.spectrocloud.com",

  // Look-back window (days) for "most visited". FullStory export time_range.
  windowDays: 30,

  // Structural exclusions: non-content areas dropped from the ranking. PREFIX
  // match — an entry also excludes its subpaths (for example, "/search" drops
  // "/search" and "/search/anything"). Matched against the normalized pathname
  // (no query string / hash).
  excludePaths: [
    "/search", // the search page (page ID 174 in FullStory) is not a doc page
    "/", // bare homepage / landing redirect
  ],

  // Editorial exclusions: specific high-traffic, front-facing pages we do NOT
  // want to assess — their traffic is expected and is not a docs-quality
  // signal, so we free the slot for the next-most-visited content page.
  //
  // To change what the monthly assessment ignores, just add or remove a path
  // below. Rules:
  //   - EXACT match only. "/integrations" does NOT exclude "/integrations/packs"
  //     (list that separately) or any other "/integrations/*" page — so hub
  //     pages can be dropped while their content subpages stay eligible.
  //   - Use the pathname only: no host, no query string, no hash, no trailing
  //     slash (for example, "/tutorials", not "https://.../tutorials/").
  ignoredPages: [
    "/integrations/packs",
    "/api/introduction",
    "/tutorials",
    "/release-notes",
    "/integrations",
  ],

  // FullStory Segment Export tuning.
  fullstory: {
    // REST base. Data-center specific accounts may use api.eu1.fullstory.com etc.
    apiBase: "https://api.fullstory.com",
    // Segment to export. "everyone" is FullStory's reserved segment_id for all
    // traffic (per their Segment Export docs) and is the right choice for
    // ranking the most-visited pages — no FullStory segment needs picking, and
    // the FULLSTORY_EVERYONE_SEGMENT_ID secret can stay unset. To pin a specific
    // UI segment instead, copy its id from that segment's FullStory URL (for
    // example, htIXCSMv9Q9M) and set FULLSTORY_EVERYONE_SEGMENT_ID, which
    // overrides this default via FS_SEGMENT_ID.
    everyoneSegmentId: "everyone",
    // Export type: TYPE_EVENT keeps only events matching the segment criteria,
    // which for the "Everyone" segment is every event. We then filter to page
    // views ourselves. See developer.fullstory.com export event types.
    exportType: "TYPE_EVENT",
    // How long to poll the async export operation before giving up (ms) and the
    // gap between polls (ms).
    pollTimeoutMs: 15 * 60 * 1000,
    pollIntervalMs: 10 * 1000,
  },

  // ---------------------------------------------------------------------------
  // Provider / model defaults (mirrors persona-check)
  // ---------------------------------------------------------------------------
  defaultProvider: "anthropic",
  // Leave null to use Impersonaid's own default (src/models/models.json:
  // anthropic -> claude-sonnet-4-6). Pin a string to override.
  defaultModel: {
    anthropic: null,
    openai: null,
  },
  // Upper bound on response length, enforced via the *_MAX_TOKENS env var that
  // Impersonaid reads. A verdict + score + a few short bullets fits comfortably.
  maxTokens: 700,

  // ---------------------------------------------------------------------------
  // Assessment question + forced verdict shape
  // ---------------------------------------------------------------------------
  // The base question each auto-selected persona answers about its page.
  question:
    "Read this documentation page as your persona. You arrived to accomplish a real task. Can you complete it using only this page, and where does it leave you stuck, confused, or missing information?",

  // Appended to the question. Impersonaid has no native scorecard format, so we
  // force a machine-parseable verdict block the same way persona-check forces
  // its output shape. run-assessment.mjs parses the VERDICT / SCORE / GAPS lines
  // out of the "## Simulation Response" body.
  formatSuffix: [
    "",
    "Respond using EXACTLY this structure and nothing else:",
    "VERDICT: one of PASS, PARTIAL, or FAIL (PASS = you can fully succeed; PARTIAL = you can mostly succeed but hit real gaps; FAIL = you cannot complete the task from this page).",
    "SCORE: a single integer from 1 to 5 (5 = excellent, 1 = unusable).",
    "SUMMARY: one sentence describing your overall experience.",
    "TOP GAPS: 1 to 2 bullet points, each a single concise sentence naming the most important missing or confusing thing. Write \"None\" if there are no meaningful gaps.",
    "Base everything only on the page content.",
  ].join("\n"),

  // ---------------------------------------------------------------------------
  // Confluence publishing (optional until an Atlassian API token is available)
  // ---------------------------------------------------------------------------
  // The scorecard's living home in the Documentation & Education space. Create
  // the page once by hand, then set its id here (or via CONFLUENCE_PAGE_ID env).
  // When the token/page id are absent, run-assessment still writes the Markdown
  // + JSON scorecard to the repo; publish-confluence.mjs simply no-ops.
  confluence: {
    baseUrl: "https://spectrocloud.atlassian.net/wiki",
    // "Monthly Assessment Scorecard" page in the DE space. A page id is not
    // sensitive, so it lives here as the default; the CONFLUENCE_PAGE_ID env/
    // secret still overrides it if you ever need to retarget without a commit.
    pageId: "3936944142",
  },

  // How many months of history to show in the rolling trend table.
  trendMonths: 3,
};
