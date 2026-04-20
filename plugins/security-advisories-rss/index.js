const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { Feed } = require("feed");

/**
 * Escape HTML-sensitive characters for safe RSS rendering
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
 * Build HTML content for RSS item
 */
function buildContentHtml(title, metadataLines) {
  return [
    `<p><strong>${escapeHtml(title)}</strong></p>`,
    `<p>${metadataLines.map(escapeHtml).join("<br/>\n")}</p>`,
  ].join("\n");
}

/**
 * Convert advisory title to anchor slug matching Docusaurus behavior
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
 * Parse date from metadata line
 */
function parseDateFromLine(line) {
  const normalized = line.replace(/\*\*/g, "").trim();
  const match = normalized.match(
    /^(Release Date|Last Updated|Last Update)\s*:\s*(.+)$/i
  );
  if (!match) return null;

  const parsed = new Date(match[2].trim());
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * Resolve advisory date with priority
 */
function resolveItemDate(metadataLines) {
  const lastUpdatedLine = metadataLines.find((l) =>
    /^Last Updated:\s*/i.test(l)
  );
  const lastUpdateLine = metadataLines.find((l) =>
    /^Last Update:\s*/i.test(l)
  );
  const releaseDateLine = metadataLines.find((l) =>
    /^Release Date:\s*/i.test(l)
  );

  return (
    (lastUpdatedLine && parseDateFromLine(lastUpdatedLine)) ||
    (lastUpdateLine && parseDateFromLine(lastUpdateLine)) ||
    (releaseDateLine && parseDateFromLine(releaseDateLine)) ||
    null
  );
}

/**
 * Filter advisories within time window
 */
function isWithinLastMonths(date, months) {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - months);
  return date >= cutoff;
}

/**
 * Extract advisories using line-by-line parsing
 */
function extractAdvisories(markdown, siteUrl, pagePath, monthsBack) {
  const items = [];
  const lines = markdown.split("\n");

  let currentTitle = null;
  let currentLines = [];

  function flushCurrentAdvisory() {
    if (!currentTitle) return;

    const firstSubheadingIndex = currentLines.findIndex((line) =>
      /^###\s+/.test(line)
    );

    const metadataLinesRaw =
      firstSubheadingIndex >= 0
        ? currentLines.slice(0, firstSubheadingIndex)
        : currentLines;

    const metadataBlock = metadataLinesRaw.join("\n").trim();

    if (!metadataBlock) {
      currentTitle = null;
      currentLines = [];
      return;
    }

    const metadataLines = metadataBlock
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => line.replace(/^[-*+]\s+/, "").trim())
      .map((line) => line.replace(/\*\*/g, ""))
      .map((line) => line.replace(/\s+:\s+/g, ": "));

    if (metadataLines.length === 0) {
      currentTitle = null;
      currentLines = [];
      return;
    }

    const itemDate = resolveItemDate(metadataLines);

    if (!itemDate || !isWithinLastMonths(itemDate, monthsBack)) {
      currentTitle = null;
      currentLines = [];
      return;
    }

    const anchor = slugifyHeading(currentTitle);
    const url = new URL(`${pagePath}#${anchor}`, siteUrl).toString();

    items.push({
      id: url,
      title: currentTitle,
      url,
      date: itemDate,
      contentHtml: buildContentHtml(currentTitle, metadataLines),
    });

    currentTitle = null;
    currentLines = [];
  }

  for (const line of lines) {
    const advisoryMatch = line.match(/^##\s+(Security Advisory[^\n]+)$/);

    if (advisoryMatch) {
      flushCurrentAdvisory();
      currentTitle = advisoryMatch[1].trim();
      currentLines = [];
      continue;
    }

    if (currentTitle) {
      currentLines.push(line);
    }
  }

  flushCurrentAdvisory();

  return items.sort((a, b) => b.date - a.date);
}

module.exports = function securityAdvisoriesRssPlugin(context, options) {
  const {
    siteConfig: { url: siteUrl, baseUrl = "/" },
  } = context;

  const opts = {
    docsRoot: options.docsRoot || ".",
    advisorySourceFile:
      options.advisorySourceFile ||
      "docs/docs-content/security-bulletins/security-advisories/security-advisories.md",
    feedFileName: options.feedFileName || "security-advisories.xml",
    pagePath: options.pagePath || "/security-bulletins/security-advisories/",
    feedTitle: options.feedTitle || "Spectro Cloud Security Advisories",
    feedDescription:
      options.feedDescription ||
      "RSS feed for Spectro Cloud security advisories (last 6 months).",
    monthsBack: options.monthsBack ?? 6,
    copyright:
      options.copyright ||
      `Copyright ${new Date().getFullYear()} Spectro Cloud`,
  };

  return {
    name: "security-advisories-rss-plugin",

    async postBuild({ outDir }) {
      const sourcePath = path.resolve(
        opts.docsRoot,
        opts.advisorySourceFile
      );

      if (!fs.existsSync(sourcePath)) {
        throw new Error(
          `[security-advisories-rss-plugin] Source file not found: ${sourcePath}`
        );
      }

      const markdown = fs.readFileSync(sourcePath, "utf8");
      const normalizedPagePath = path.posix.join(baseUrl, opts.pagePath);

      const advisories = extractAdvisories(
        markdown,
        siteUrl,
        normalizedPagePath,
        opts.monthsBack
      );

      const feed = new Feed({
        id: new URL(normalizedPagePath, siteUrl).toString(),
        title: opts.feedTitle,
        description: opts.feedDescription,
        link: new URL(normalizedPagePath, siteUrl).toString(),
        language: "en",
        favicon: new URL(
          path.posix.join(baseUrl, "img/favicon.png"),
          siteUrl
        ).toString(),
        copyright: opts.copyright,
        updated: advisories[0]?.date || new Date(),
        generator: "Docusaurus security advisories RSS plugin",
      });

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

      console.log(
        `[security-advisories-rss-plugin] wrote ${advisories.length} items to ${outputPath}`
      );
    },
  };
};