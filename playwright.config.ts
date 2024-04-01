// playwright.config.ts
import { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  // Other config options...
  snapshotDir: "screenshots/",
  testDir: "visuals",
  fullyParallel: true,
  expect: {
    toMatchSnapshot: {
      maxDiffPixels: 100,
    },
    toHaveScreenshot: {
      maxDiffPixels: 100,
    },
  },
  workers: process.env.CI ? 1 : 2,
  reporter: [["html", { open: "never" }]],
  webServer: {
    command: "npm run serve",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
  },
};

export default config;
