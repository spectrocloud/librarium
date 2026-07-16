// Monthly-assessment page selection (DOC-2472).
//
// Produces the top-N most-visited docs pages from FullStory and writes them to
// pages.json for run-assessment.mjs to consume. Pure Node (>=20, global fetch),
// no external dependencies.
//
// FullStory exposes NO aggregated "top pages" metric over its API. The only
// programmatic path to pageview data is the async Segment Export API:
//   1. POST /segments/v1/exports        -> returns an operation id
//   2. GET  /operations/v1/{id}         -> poll until the export completes
//   3. download the results file(s)     -> events, one per page view
//   4. aggregate URLs ourselves         -> top N
//
// Requires the FullStory Data Export add-on (Enterprise/Advanced tier). If the
// account lacks it, the create-export call will fail; fall back to a committed
// seed pages.json refreshed via the FullStory MCP (see the plan / DE docs).
//
// Inputs via env:
//   FULLSTORY_API_KEY   (required) FullStory Server API key.
//   FS_SEGMENT_ID       (optional) overrides config.fullstory.everyoneSegmentId.
//   FS_AUTH_SCHEME      (optional) "Basic" (default) or "Bearer".
//   MA_PAGES_OUT        (optional) output path (default ./pages.json).
//
// NOTE: response field names below (operation id, state, results location,
// per-event URL/type) follow FullStory's documented shape but vary by account
// and export format. They are resolved defensively across candidate keys and
// should be confirmed against the live account on first run (plan risk #2).

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const config = (await import(path.join(here, "config.mjs"))).default;

// Only run the network flow when executed directly (node fetch-top-pages.mjs),
// so the pure helpers below can be imported and unit-tested without side effects
// or requiring FULLSTORY_API_KEY.
const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

const AUTH_SCHEME = (process.env.FS_AUTH_SCHEME || "Basic").trim();
const SEGMENT_ID = (process.env.FS_SEGMENT_ID || config.fullstory.everyoneSegmentId).trim();
const OUT_PATH = process.env.MA_PAGES_OUT || path.join(process.cwd(), "pages.json");
const API_BASE = config.fullstory.apiBase.replace(/\/$/, "");
const API_KEY = process.env.FULLSTORY_API_KEY;
// Look-back window in days. Defaults to config; FS_WINDOW_DAYS overrides it for
// bounded reruns/backfills and for keeping a validation export small.
const WINDOW_DAYS = Number(process.env.FS_WINDOW_DAYS) || config.windowDays;

// Per-event field keys. Confirmed against the account's export: PageUrl /
// EventType. The extra spellings are harmless fallbacks in case a future export
// format labels them differently.
const URL_KEYS = ["PageUrl", "pageUrl", "page_url", "EventPageUrl", "Url", "url"];
const TYPE_KEYS = ["EventType", "eventType", "event_type", "type"];
// Count only the "pageview" event as one visit. A single page load also emits a
// "navigate" event (and "load"), so counting those too would double/triple-count;
// "navigate" additionally fires on in-page hash/anchor changes, inflating a
// single page. "pageview" is one-per-view and is the accurate visit metric.
const PAGEVIEW_TYPES = new Set(["pageview", "page_view"]);

function authHeader() {
  // FullStory Server API v1 uses the raw key with the Basic scheme (not a
  // base64 user:pass). Bearer is offered as an override for v2-style keys.
  return `${AUTH_SCHEME} ${API_KEY}`;
}

async function fsFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`FullStory ${options.method || "GET"} ${url} -> ${res.status} ${res.statusText}\n${text.slice(0, 500)}`);
  }
  return res;
}

// First non-empty value among candidate keys on an object.
function pick(obj, keys) {
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null && obj[k] !== "") return obj[k];
  }
  return undefined;
}

// Deeply search an object for the first value under any of `keys` (results
// location and operation id can be nested a level or two in the response).
function deepPick(obj, keys, depth = 4) {
  if (!obj || typeof obj !== "object" || depth < 0) return undefined;
  for (const k of keys) if (obj[k] !== undefined && obj[k] !== null) return obj[k];
  for (const v of Object.values(obj)) {
    const found = deepPick(v, keys, depth - 1);
    if (found !== undefined) return found;
  }
  return undefined;
}

function windowRange(days) {
  const end = new Date();
  const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
  return { start: start.toISOString(), end: end.toISOString() };
}

async function createExport() {
  const { start, end } = windowRange(WINDOW_DAYS);
  const body = {
    segment_id: SEGMENT_ID,
    type: config.fullstory.exportType,
    format: "FORMAT_NDJSON",
    time_range: { start, end },
    // Request the smallest useful field set. If the account rejects unknown
    // field names, drop this and aggregate over the default export columns.
    fields: ["EventType", "PageUrl", "EventStart"],
  };
  const res = await fsFetch(`${API_BASE}/segments/v1/exports`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  const json = await res.json();
  const opId = deepPick(json, ["operationId", "operation_id", "id", "name"]);
  if (!opId) throw new Error(`Could not find an operation id in create-export response:\n${JSON.stringify(json).slice(0, 500)}`);
  return String(opId).replace(/^operations\/v1\//, "");
}

// Poll the operation until it completes, then return its searchExportId. On
// completion FullStory reports results: { searchExportId } — NOT a download
// link. The id is exchanged for a temporary URL by getResultLocations().
async function waitForExport(opId) {
  const deadline = Date.now() + config.fullstory.pollTimeoutMs;
  // Date.now() is fine here (short-lived script, not a resumable workflow).
  while (Date.now() < deadline) {
    const res = await fsFetch(`${API_BASE}/operations/v1/${encodeURIComponent(opId)}`);
    const json = await res.json();
    const state = String(deepPick(json, ["state", "stage", "status"]) || "").toUpperCase();
    if (state.includes("COMPLET") || state.includes("SUCCE") || state.includes("DONE")) {
      const searchExportId = deepPick(json, ["searchExportId", "search_export_id"]);
      if (!searchExportId) throw new Error(`Export completed but no searchExportId found:\n${JSON.stringify(json).slice(0, 800)}`);
      return String(searchExportId);
    }
    if (state.includes("FAIL") || state.includes("ERROR")) {
      throw new Error(`Export operation ${opId} failed: ${JSON.stringify(json).slice(0, 500)}`);
    }
    await new Promise((r) => setTimeout(r, config.fullstory.pollIntervalMs));
  }
  throw new Error(`Export operation ${opId} did not complete within ${config.fullstory.pollTimeoutMs}ms`);
}

// Exchange a completed export's searchExportId for its temporary download
// location(s) via GET /search/v1/exports/{id}/results.
async function getResultLocations(searchExportId) {
  const res = await fsFetch(`${API_BASE}/search/v1/exports/${encodeURIComponent(searchExportId)}/results`);
  const json = await res.json();
  const locations = normalizeLocations(json);
  if (!locations.length) throw new Error(`Export results returned no download location:\n${JSON.stringify(json).slice(0, 800)}`);
  return locations;
}

// Coerce the assorted result shapes into a flat array of URL strings.
function normalizeLocations(results) {
  if (!results) return [];
  const arr = Array.isArray(results) ? results : [results];
  return arr
    .map((r) => (typeof r === "string" ? r : deepPick(r, ["location", "signedUrl", "signed_url", "url", "href"])))
    .filter(Boolean)
    .map(String);
}

async function downloadEvents(locations) {
  const events = [];
  for (const loc of locations) {
    // Result URLs are pre-signed cloud-storage links: no auth header needed.
    const res = await fetch(loc);
    if (!res.ok) throw new Error(`Download ${loc} -> ${res.status} ${res.statusText}`);
    // FullStory serves the export as gzip-compressed NDJSON (Content-Type
    // application/gzip) — fetch does not auto-inflate a gzip *file*, so detect
    // the gzip magic bytes and gunzip before parsing.
    let buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > 2 && buf[0] === 0x1f && buf[1] === 0x8b) buf = zlib.gunzipSync(buf);
    const text = buf.toString("utf8");
    // Handle both NDJSON (one object per line) and a single JSON array.
    const trimmed = text.trim();
    if (trimmed.startsWith("[")) {
      for (const e of JSON.parse(trimmed)) events.push(e);
    } else {
      for (const line of trimmed.split("\n")) {
        const l = line.trim();
        if (l) {
          try {
            events.push(JSON.parse(l));
          } catch {
            /* skip malformed line */
          }
        }
      }
    }
  }
  return events;
}

// Normalize a raw URL to a docsHost pathname, or null if it is not a docs page
// or is excluded. Drops query string and hash; strips a trailing slash.
export function toDocsPath(rawUrl) {
  let u;
  try {
    u = new URL(rawUrl);
  } catch {
    return null;
  }
  if (u.hostname !== config.docsHost) return null;
  let p = u.pathname.replace(/\/+$/, "") || "/";
  // Structural exclusions (prefix match: an entry also drops its subpaths).
  for (const ex of config.excludePaths) {
    if (ex === "/" ? p === "/" : p === ex || p.startsWith(ex + "/")) return null;
  }
  // Editorial exclusions (exact match: hub pages drop without their subpaths).
  if (config.ignoredPages?.includes(p)) return null;
  return p;
}

export function aggregate(events) {
  const counts = new Map(); // path -> { views, url }
  for (const e of events) {
    const type = String(pick(e, TYPE_KEYS) || "").toLowerCase();
    if (PAGEVIEW_TYPES.size && type && !PAGEVIEW_TYPES.has(type)) continue;
    const rawUrl = pick(e, URL_KEYS);
    if (!rawUrl) continue;
    const p = toDocsPath(rawUrl);
    if (!p) continue;
    const entry = counts.get(p) || { views: 0, url: `https://${config.docsHost}${p}` };
    entry.views += 1;
    counts.set(p, entry);
  }
  return [...counts.entries()]
    .map(([p, v]) => ({ path: p, url: v.url, views: v.views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, config.topPages);
}

// ---------------------------------------------------------------------------

async function main() {
  if (!API_KEY) throw new Error("Missing required env var FULLSTORY_API_KEY");
  console.log(`[monthly-assessment] fetching top ${config.topPages} ${config.docsHost} pages from FullStory (last ${WINDOW_DAYS}d, segment ${SEGMENT_ID})`);

  const opId = await createExport();
  console.log(`[monthly-assessment] export operation: ${opId}`);
  const searchExportId = await waitForExport(opId);
  console.log(`[monthly-assessment] export complete: ${searchExportId}`);
  const locations = await getResultLocations(searchExportId);
  console.log(`[monthly-assessment] results ready: ${locations.length} file(s)`);
  const events = await downloadEvents(locations);
  console.log(`[monthly-assessment] downloaded ${events.length} events`);
  // FS_DEBUG dumps the raw shape of the first few events — useful on first run
  // to confirm the account's export field names (URL/type) and event mix.
  if (process.env.FS_DEBUG && events.length) {
    console.log("[monthly-assessment] sample event keys:", Object.keys(events[0]).join(", "));
    console.log("[monthly-assessment] sample events:\n" + JSON.stringify(events.slice(0, 3), null, 2));
  }
  const top = aggregate(events);

  if (!top.length) {
    throw new Error(
      `No ${config.docsHost} page views found in the export. Confirm the event URL/type field names ` +
        `(URL_KEYS/TYPE_KEYS in this file) match the account's export format.`,
    );
  }

  // Trailing newline so Prettier (which runs on committed JSON) leaves it unchanged.
  fs.writeFileSync(OUT_PATH, JSON.stringify(top, null, 2) + "\n");
  console.log(`[monthly-assessment] wrote ${top.length} pages to ${OUT_PATH}:`);
  for (const [i, p] of top.entries()) console.log(`  ${i + 1}. ${p.path} (${p.views} views)`);
}

if (isMain) await main();
