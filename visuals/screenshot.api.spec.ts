import * as fs from "fs";
import { test, expect } from "@playwright/test";
import { extractSitemapPathnames, WaitForDocusaurusHydration } from "./utils";
// Constants:
const siteUrl = "http://localhost:3000";
const sitemapPath = "build/sitemap.xml";
const stylesheetPath = "visuals/screenshot.css";
const stylesheet = fs.readFileSync(stylesheetPath).toString();
const excludeList = require("./exclude.json");

function isApiDocsPathname(pathname: string, excludeList: string[]): boolean {
  if (excludeList.includes(pathname)) {
    console.log(`Excluding ${pathname}`);
    return false;
  }
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

test.describe("API docs screenshots", () => {
  const pathnames = extractSitemapPathnames(sitemapPath).filter((pathname) => isApiDocsPathname(pathname, excludeList));
  pathnames.forEach(screenshotPathname);
});
