import * as fs from "fs";
import { test, expect } from "@playwright/test";
import { extractSitemapPathnames } from "./utils";
// Constants:
const siteUrl = "http://localhost:3000";
const sitemapPath = "build/sitemap.xml";
const stylesheetPath = "visuals/screenshot.css";
const stylesheet = fs.readFileSync(stylesheetPath).toString();

// Wait for hydration, requires Docusaurus v2.4.3+
// See https://github.com/facebook/docusaurus/pull/9256
// Docusaurus adds a <html data-has-hydrated="true"> once hydrated
function waitForDocusaurusHydration() {
  return document.documentElement.dataset.hasHydrated === "true";
}

function isVersionedDocsPathname(pathname: string): boolean {
  // First, check if it starts with /api/, if so, return false immediately
  if (pathname.startsWith("/api/")) {
    return false;
  }
  // This regex checks if the pathname does not follow the /4.1.x/ pattern
  // and still follows the allowed versioning pattern.
  const isValidVersion = !pathname.match(/^\/docs\/(\d+\.\d+\.x)\//);
  const isNextVersion = pathname.match(/^\/docs\/next\//);

  // Return true if it's a valid version format or the next version, otherwise false
  return isValidVersion || isNextVersion ? true : false;
}

function screenshotPathname(pathname: string) {
  test(`pathname ${pathname}`, async ({ page }) => {
    console.log(`Taking screenshot of ${pathname}`);
    const url = siteUrl + pathname;
    await page.goto(url);
    await page.waitForFunction(waitForDocusaurusHydration);
    await page.waitForLoadState("domcontentloaded");
    await page.addStyleTag({ content: stylesheet });
    await page.waitForTimeout(500); // Waits for 100 milliseconds
    await expect(page).toHaveScreenshot({ fullPage: true, timeout: 10000 });
  });
}

// test.describe("cookie-banner is visible", () => {
//   test("cookie-banner is visible", async ({ page }) => {
//     await page.goto(siteUrl);
//     await page.waitForFunction(waitForDocusaurusHydration);
//     await page.waitForLoadState("domcontentloaded");
//     await page.addStyleTag({ content: stylesheet });
//     await expect(page).toHaveScreenshot({ fullPage: true });
//     await expect(page.getByTestId("#usercentrics-root")).toBeVisible();
//   });
// });

test.describe("Docusaurus site screenshots", () => {
  const pathnames = extractSitemapPathnames(sitemapPath).filter(isVersionedDocsPathname);
  pathnames.forEach(screenshotPathname);
});
