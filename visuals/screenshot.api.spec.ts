import * as fs from "fs";
import { test, expect } from "@playwright/test";
import { extractSitemapPathnames, WaitForDocusaurusHydration } from "./utils";
// Constants:
const siteUrl = "http://localhost:3000";
const sitemapPath = "build/sitemap.xml";
const stylesheetPath = "visuals/screenshot.css";
const stylesheet = fs.readFileSync(stylesheetPath).toString();

function isApiDocsPathname(pathname: string): boolean {
  // return false if the pathname does not start with /api/
  if (pathname.startsWith("/api/") && !pathname.match(/^\/api\/(\d+\.\d+\.x)\//)) {
    return true;
  }
  return false;
}

function screenshotPathname(pathname: string) {
  test(`pathname ${pathname}`, async ({ page }) => {
    console.log(`Taking screenshot of ${pathname}`);
    const url = siteUrl + pathname;
    await page.goto(url);
    await page.waitForFunction(WaitForDocusaurusHydration);
    await page.waitForLoadState("domcontentloaded");
    await page.addStyleTag({ content: stylesheet });
    await page.waitForTimeout(500); // Waits for 100 milliseconds
    await expect(page).toHaveScreenshot({ fullPage: true, timeout: 10000 });
  });
}

// test.describe("API docs screenshots", () => {
//   const pathnames = extractSitemapPathnames(sitemapPath).filter(isApiDocsPathname);
//   pathnames.forEach(screenshotPathname);
// });

test.describe("API docs screenshots", () => {
  const pathnames = extractSitemapPathnames(sitemapPath).filter(isApiDocsPathname);
  console.log("Total pathnames: ", pathnames.length);
  screenshotPathname(pathnames[0]);
});
