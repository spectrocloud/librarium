import * as fs from "fs";
import { test, expect } from "@playwright/test";
import { extractSitemapPathnames, WaitForDocusaurusHydration } from "./utils";
// Constants:
const siteUrl = "http://localhost:3000";
const sitemapPath = "build/sitemap.xml";
const stylesheetPath = "visuals/screenshot.css";
const stylesheet = fs.readFileSync(stylesheetPath).toString();
const excludeList = require("./exclude.json");

test.describe.configure({ mode: "parallel" });

function isVersionedDocsPathname(pathname: string, excludeList: string[]): boolean {
  if (excludeList.includes(pathname)) {
    console.log(`Excluding ${pathname}`);
    return false;
  }

  if (pathname.startsWith("/api/") || pathname.match(/\/\d+\.\d+\.x\//)) {
    return false;
  }

  return true;
}

function screenshotPathname(pathname: string) {
  test(`pathname ${pathname}`, async ({ page }) => {
    const url = siteUrl + pathname;
    await page.goto(url);
    await page.waitForFunction(WaitForDocusaurusHydration);
    await page.waitForLoadState("domcontentloaded");
    await page.addStyleTag({ content: stylesheet });
    await page.waitForTimeout(1000); // Waits for 1000 milliseconds
    await expect(page).toHaveScreenshot({ fullPage: true, timeout: 10000 });
  });
}

test.describe("Docs screenshots", () => {
  const pathnames = extractSitemapPathnames(sitemapPath).filter((pathname) =>
    isVersionedDocsPathname(pathname, excludeList)
  );
  console.log(`Taking screenshots of ${pathnames.length} Docs pages`);
  console.log("Excluded pages: ", excludeList);

  pathnames.forEach(screenshotPathname);
});
