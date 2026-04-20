const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { Feed } = require("feed");

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildContentHtml(title, metadataLines) {
  return [
    `<p><strong>${escapeHtml(title)}</strong></p>`,
    `<p>${metadataLines.map(escapeHtml).join("<br/>\n")}</p>`,
  ].join("\n");
}

function slugifyHeading(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s/g, "-");
}

function parseDateFromLine(line) {
  const normalized = line.replace(/\*\*/g, "").trim();
  const match = normalized.match(/^(Release Date|Last Updated|Last Update)\s*:\s*(.+)$/i);
  if (!match) return null;

  const parsed = new Date(match[2].trim());
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

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

function isWithinLastMonths(date, months) {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - months);
  return date >= cutoff;
}

function extractAdvisories(markdown, siteUrl, pagePath, monthsBack) {
  const items = [];

  const advisoryRegex = /^##\s+(Security Advisory[^\n]+)\n([\s\S]*?)(?=^##\s+Security Advisory|\s*$)/gm;

  let match;
  while ((match = advisoryRegex.exec(markdown)) !== null) {
    const title = match[1].trim();
    const sectionBody = match[2];

    // Stop at first ### section (Summary, etc.)
    const firstSubheadingIndex = sectionBody.search(/^###\s+/m);
    const metadataBlock =
      firstSubheadingIndex >= 0 ? sectionBody.slice(0, firstSubheadingIndex).trim() : sectionBody.trim();

    if (!metadataBlock) continue;

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

module.exports = function securityAdvisoriesRssPlugin(context, options) {
  const {
    siteConfig: { url: siteUrl, baseUrl = "/" },
  } = context;

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

    async postBuild({ outDir }) {
      const sourcePath = path.resolve(opts.docsRoot, opts.advisorySourceFile);

      if (!fs.existsSync(sourcePath)) {
        throw new Error(`[security-advisories-rss-plugin] Source file not found: ${sourcePath}`);
      }

      const markdown = fs.readFileSync(sourcePath, "utf8");
      const normalizedPagePath = path.posix.join(baseUrl, opts.pagePath);

      const advisories = extractAdvisories(markdown, siteUrl, normalizedPagePath, opts.monthsBack);

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
