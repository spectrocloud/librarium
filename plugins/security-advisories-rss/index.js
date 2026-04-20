const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { Feed } = require("feed");

/**
 * Escape HTML-sensitive characters so advisory titles and metadata render
 * safely inside RSS <content:encoded> without breaking the XML/HTML payload.
 */
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Build the HTML fragment used inside each RSS item's <content:encoded>.
 *
 * Output shape:
 * - advisory title in bold
 * - metadata lines joined with <br/> tags
 */
function buildContentHtml(title, metadataLines) {
  return [
    `<p><strong>${escapeHtml(title)}</strong></p>`,
    `<p>${metadataLines.map(escapeHtml).join("<br/>\n")}</p>`,
  ].join("\n");
}

/**
 * Convert an advisory heading into an anchor fragment that matches the
 * Docusaurus-generated heading id on the published page.
 *
 * Important behavior:
 * - remove periods, so "006.1" becomes "0061"
 * - remove punctuation other than spaces/hyphens/word chars
 * - convert spaces to hyphens
 * - do NOT collapse repeated hyphens, because the real page anchor may
 *   intentionally contain multiple consecutive hyphens
 */
function slugifyHeading(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s/g, "-");
}

/**
 * Parse a metadata line containing a date.
 *
 * Supported labels:
 * - Release Date
 * - Last Updated
 * - Last Update
 *
 * Notes:
 * - strips markdown bold markers first, because the source file uses lines like:
 *   - **Last Updated**: April 15, 2026
 * - returns null if the line is not a supported date field or cannot be parsed
 */
function parseDateFromLine(line) {
  const normalized = line.replace(/\*\*/g, "").trim();
  const match = normalized.match(/^(Release Date|Last Updated|Last Update)\s*:\s*(.+)$/i);
  if (!match) return null;

  const parsed = new Date(match[2].trim());
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * Resolve the most useful date for an RSS item.
 *
 * Priority order:
 * 1. Last Updated
 * 2. Last Update
 * 3. Release Date
 *
 * This ensures the feed reflects advisory updates when available, rather than
 * only the original publication date.
 */
function resolveItemDate(metadataLines) {
  const lastUpdatedLine = metadataLines.find((l) => /^Last Updated:\s*/i.test(l));
  const lastUpdateLine = metadataLines.find((l) => /^Last Update:\s*/i.test(l));
  const releaseDateLine = metadataLines.find((l) => /^Release Date:\s*/i.test(l));

  return (
    (lastUpdatedLine && parseDateFromLine(lastUpdatedLine)) ||
    (lastUpdateLine && parseDateFromLine(lastUpdateLine)) ||
    (releaseDateLine && parseDateFromLine(releaseDateLine)) ||
    null
  );
}

/**
 * Keep only advisories published/updated within the configured time window.
 *
 * Example:
 * - monthsBack = 6 keeps only advisories from the last 6 months
 */
function isWithinLastMonths(date, months) {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - months);
  return date >= cutoff;
}

/**
 * Extract advisory items from the markdown source file.
 *
 * High-level flow:
 * 1. Find each "## Security Advisory ..." section
 * 2. Capture everything until the next advisory heading or end of file
 * 3. Within that block, keep only the content before the first "###" subsection
 *    (typically the metadata area before "Summary")
 * 4. Normalize metadata lines
 * 5. Convert into feed item objects
 */
function extractAdvisories(markdown, siteUrl, pagePath, monthsBack) {
  const items = [];

  /**
   * Regex to capture one advisory block at a time.
   *
   * Breakdown:
   * ^##\s+
   *   - match a level-2 markdown heading at the start of a line
   *
   * (Security Advisory[^\n]+)
   *   - capture the full advisory title line
   *
   * \n
   *   - require a newline after the heading
   *
   * ([\s\S]*?)
   *   - lazily capture everything after the heading, including newlines
   *
   * (?=^##\s+Security Advisory|\s*$)
   *   - stop when we hit the next advisory heading
   *   - or the end of the file (allowing trailing whitespace)
   *
   * Flags:
   * - g: find all matches
   * - m: ^ and $ operate per line
   */
  const advisoryRegex = /^##\s+(Security Advisory[^\n]+)\n([\s\S]*?)(?=^##\s+Security Advisory|(?![\s\S]))/gm;

  let match;
  while ((match = advisoryRegex.exec(markdown)) !== null) {
    const title = match[1].trim();
    const sectionBody = match[2];

    // Stop at first ### section (Summary, etc.)
    const firstSubheadingIndex = sectionBody.search(/^###\s+/m);
    const metadataBlock =
      firstSubheadingIndex >= 0 ? sectionBody.slice(0, firstSubheadingIndex).trim() : sectionBody.trim();

    if (!metadataBlock) continue;

    /**
     * Normalize metadata lines from markdown list items into plain text.
     *
     * Example input:
     * - **Release Date**: March 23, 2026
     *
     * Example output:
     * Release Date: March 23, 2026
     */
    const metadataLines = metadataBlock
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => line.replace(/^[-*+]\s+/, "").trim())
      .map((line) => line.replace(/\*\*/g, ""))
      .map((line) => line.replace(/\s+:\s+/g, ": "));

    if (metadataLines.length === 0) continue;

    const itemDate = resolveItemDate(metadataLines);
    if (!itemDate) continue;
    if (!isWithinLastMonths(itemDate, monthsBack)) continue;

    const anchor = slugifyHeading(title);
    const url = new URL(`${pagePath}#${anchor}`, siteUrl).toString();

    items.push({
      id: crypto.createHash("sha256").update(title).digest("hex"),
      title,
      url,
      date: itemDate,
      contentHtml: buildContentHtml(title, metadataLines),
    });
  }

  return items.sort((a, b) => b.date - a.date);
}

/**
 * Docusaurus plugin entrypoint.
 *
 * This plugin runs after site build and generates an RSS feed for the
 * Security Advisories page, based on the markdown source file.
 */
module.exports = function securityAdvisoriesRssPlugin(context, options) {
  const {
    siteConfig: { url: siteUrl, baseUrl = "/" },
  } = context;

  /**
   * Plugin options with defaults.
   *
   * Notable defaults:
   * - advisorySourceFile: markdown source to parse
   * - feedFileName: output RSS filename written into the build directory
   * - monthsBack: keep only the last 6 months of advisories
   */
  const opts = {
    docsRoot: options.docsRoot || ".",
    advisorySourceFile:
      options.advisorySourceFile || "docs/security-bulletins/security-advisories/security-advisories.md",
    feedFileName: options.feedFileName || "security-advisories.xml",
    pagePath: options.pagePath || "/security-bulletins/security-advisories/",
    feedTitle: options.feedTitle || "Spectro Cloud Security Advisories",
    feedDescription: options.feedDescription || "RSS feed for Spectro Cloud security advisories (last 6 months).",
    monthsBack: options.monthsBack ?? 6,
    copyright: options.copyright || `Copyright ${new Date().getFullYear()} Spectro Cloud`,
  };

  return {
    name: "security-advisories-rss-plugin",

    /**
     * postBuild runs after Docusaurus has generated the site.
     *
     * Responsibilities:
     * - read the advisory source markdown
     * - extract recent advisories
     * - generate RSS XML
     * - write the final feed into the build output
     */
    async postBuild({ outDir }) {
      const sourcePath = path.resolve(opts.docsRoot, opts.advisorySourceFile);

      if (!fs.existsSync(sourcePath)) {
        throw new Error(`[security-advisories-rss-plugin] Source file not found: ${sourcePath}`);
      }

      const markdown = fs.readFileSync(sourcePath, "utf8");
      const normalizedPagePath = path.posix.join(baseUrl, opts.pagePath);

      const advisories = extractAdvisories(markdown, siteUrl, normalizedPagePath, opts.monthsBack);

      /**
       * Feed metadata.
       *
       * Notes:
       * - favicon points feed readers at a preferred site icon
       * - updated uses the newest advisory date when available
       */
      const feed = new Feed({
        id: new URL(normalizedPagePath, siteUrl).toString(),
        title: opts.feedTitle,
        description: opts.feedDescription,
        link: new URL(normalizedPagePath, siteUrl).toString(),
        language: "en",
        favicon: new URL(path.posix.join(baseUrl, "img/favicon.png"), siteUrl).toString(),
        copyright: opts.copyright,
        updated: advisories[0]?.date || new Date(),
        generator: "Docusaurus security advisories RSS plugin",
      });

      /**
       * Each item links directly to the specific advisory anchor, so readers
       * that support "Read More" should land on the advisory itself.
       *
       * Using advisory.url as the item id helps make the canonical destination
       * explicit for feed consumers.
       */
      for (const advisory of advisories) {
        feed.addItem({
          id: advisory.url,
          title: advisory.title,
          link: advisory.url,
          date: advisory.date,
          content: advisory.contentHtml,
        });
      }

      const outputPath = path.join(outDir, opts.feedFileName);
      fs.writeFileSync(outputPath, feed.rss2(), "utf8");

      console.log(`[security-advisories-rss-plugin] wrote ${advisories.length} items to ${outputPath}`);
    },
  };
};
