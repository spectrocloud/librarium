import * as cheerio from "cheerio";
import * as fs from "fs";

export function extractSitemapPathnames(sitemapPath: string): string[] {
  const sitemap = fs.readFileSync(sitemapPath).toString();
  const $ = cheerio.load(sitemap, { xmlMode: true });
  const urls: string[] = [];
  $("loc").each(function handleLoc() {
    urls.push($(this).text());
  });
  return urls.map((url) => new URL(url).pathname);
}

// Converts a pathname to a decent screenshot name
export function pathnameToArgosName(pathname: string): string {
  return pathname.replace(/^\/|\/$/g, "") || "index";
}

// Wait for hydration, requires Docusaurus v2.4.3+
// See https://github.com/facebook/docusaurus/pull/9256
// Docusaurus adds a <html data-has-hydrated="true"> once hydrated
export function WaitForDocusaurusHydration() {
  return document.documentElement.dataset.hasHydrated === "true";
}
