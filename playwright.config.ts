import { devices } from "@playwright/test";
import type { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  snapshotDir: "screenshots/",
  testDir: "visuals",
  fullyParallel: true,
  retries: 1,
  expect: {
    toMatchSnapshot: {
      maxDiffPixels: 100,
    },
    toHaveScreenshot: {
      maxDiffPixels: 100,
    },
    timeout: 30000,
  },
  reporter: process.env.CI ? "blob" : "html",
  webServer: {
    command: "npm run serve",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
};

export default config;
