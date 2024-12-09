import * as fs from "fs";
import { test, expect } from "@playwright/test";
import { extractSitemapPathnames, WaitForDocusaurusHydration } from "./utils";
import excludeList from "./exclude.json";

const siteUrl = "http://localhost:3000";
const sitemapPath = "build/sitemap.xml";
const stylesheetPath = "visuals/screenshot.css";
const stylesheet = fs.readFileSync(stylesheetPath).toString();

test.describe.configure({ mode: "parallel" });

function isVersionedDocsPathname(pathname: string, excludeList: string[]): boolean {
  if (
    excludeList.some((excludedPath) => {
      if (excludedPath.endsWith("/*")) {
        // Let's remove the trailing "/*" to match sub-paths
        const basePath = excludedPath.slice(0, -2);
        // Exclude sub-paths only, not the index page
        return pathname.startsWith(basePath) && pathname !== `${basePath}/`;
      }
      // This is an exact match
      return pathname === excludedPath;
    })
  ) {
    return false;
  }

  // Additional exclusion criteria
  if (pathname.startsWith("/api/") || pathname.match(/\/\d+\.\d+\.x\//)) {
    return false;
  }

  return true;
}

function screenshotPathname(pathname: string) {
  test(`pathname ${pathname}`, async ({ page }) => {
    console.log(`Taking screenshot of ${pathname}`);
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

  pathnames.forEach(screenshotPathname);
});
