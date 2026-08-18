# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: screenshot.docs.spec.ts >> Docs screenshots >> pathname /paletteai-inference-launchpad/explanation/inference-engines/
- Location: visuals/screenshot.docs.spec.ts:38:7

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

  4223 pixels (ratio 0.01 of all image pixels) are different.

Call log:
  - Expect "toHaveScreenshot" with timeout 10000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 4223 pixels (ratio 0.01 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - 4223 pixels (ratio 0.01 of all image pixels) are different.

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - region "Skip to main content":
      - link "Skip to main content" [ref=e3] [cursor=pointer]:
        - /url: "#__docusaurus_skipToContent_fallback"
    - navigation "Main" [ref=e4]:
      - generic [ref=e5]:
        - generic [ref=e6]:
          - link "Spectro cloud logo" [ref=e7] [cursor=pointer]:
            - /url: /
            - img "Spectro cloud logo" [ref=e9]
          - link "Docs" [ref=e10] [cursor=pointer]:
            - /url: /release-notes/
          - link "Tutorials" [ref=e11] [cursor=pointer]:
            - /url: /tutorials/
          - link "PaletteAI Inference Launchpad" [ref=e12] [cursor=pointer]:
            - /url: /paletteai-inference-launchpad/
          - link "Downloads" [ref=e13] [cursor=pointer]:
            - /url: /downloads/
          - link "API" [ref=e14] [cursor=pointer]:
            - /url: /api/introduction/
        - generic [ref=e15]:
          - link "Go to Spectro Cloud homepage (opens in a new tab)" [ref=e17] [cursor=pointer]:
            - /url: https://spectrocloud.com
            - text: spectrocloud.com ↗
          - link "GitHub repository" [ref=e18] [cursor=pointer]:
            - /url: https://github.com/spectrocloud/librarium
          - button "Ask AI" [ref=e20] [cursor=pointer]
          - button "Switch between dark and light mode (currently system mode)" [ref=e22] [cursor=pointer]:
            - img [ref=e23]
          - button "Search (Control+k)" [ref=e26] [cursor=pointer]:
            - generic [ref=e27]:
              - img [ref=e28]
              - generic [ref=e31]: Search
    - generic [ref=e35]:
      - complementary [ref=e36]:
        - generic [ref=e38]:
          - link "Spectro cloud logo" [ref=e39] [cursor=pointer]:
            - /url: /
            - img "Spectro cloud logo" [ref=e40]
          - navigation "Docs sidebar" [ref=e41]:
            - list [ref=e42]:
              - listitem [ref=e43]:
                - link "Overview" [ref=e44] [cursor=pointer]:
                  - /url: /paletteai-inference-launchpad/
              - listitem [ref=e45]:
                - link "Tutorials" [ref=e46] [cursor=pointer]:
                  - /url: /paletteai-inference-launchpad/tutorials/
              - listitem [ref=e47]:
                - generic [ref=e48]:
                  - link "How-to Guides" [ref=e49] [cursor=pointer]:
                    - /url: /paletteai-inference-launchpad/how-to-guides/
                  - button "Toggle the collapsible sidebar category 'How-to Guides'" [ref=e50] [cursor=pointer]
              - listitem [ref=e51]:
                - generic [ref=e52]:
                  - link "Explanation" [expanded] [ref=e53] [cursor=pointer]:
                    - /url: /paletteai-inference-launchpad/explanation/
                  - button "Toggle the collapsible sidebar category 'Explanation'" [ref=e54] [cursor=pointer]
                - list [ref=e55]:
                  - listitem [ref=e56]:
                    - link "Architecture Overview" [ref=e57] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/explanation/architecture/
                  - listitem [ref=e58]:
                    - link "Vision Preprocessing" [ref=e59] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/explanation/vision-preprocessing/
                  - listitem [ref=e60]:
                    - link "Clients and Quotas" [ref=e61] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/explanation/clients-and-quotas/
                  - listitem [ref=e62]:
                    - link "Model Certification" [ref=e63] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/explanation/model-certification/
                  - listitem [ref=e64]:
                    - link "Inference Engines" [ref=e65] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/explanation/inference-engines/
                  - listitem [ref=e66]:
                    - link "Installation Architecture" [ref=e67] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/explanation/installation-architecture/
              - listitem [ref=e68]:
                - generic [ref=e69]:
                  - link "Reference" [ref=e70] [cursor=pointer]:
                    - /url: /paletteai-inference-launchpad/reference/
                  - button "Toggle the collapsible sidebar category 'Reference'" [ref=e71] [cursor=pointer]
              - listitem [ref=e72]:
                - link "Release Notes" [ref=e73] [cursor=pointer]:
                  - /url: /paletteai-inference-launchpad/release-notes/
              - listitem [ref=e74]:
                - button "Privacy Settings" [ref=e75] [cursor=pointer]
      - main [ref=e76]:
        - generic [ref=e78]:
          - generic [ref=e80]:
            - article [ref=e81]:
              - navigation "Breadcrumbs" [ref=e82]:
                - list [ref=e83]:
                  - listitem [ref=e84]:
                    - link "Home page" [ref=e85] [cursor=pointer]:
                      - /url: /
                      - img [ref=e86]
                  - listitem [ref=e88]:
                    - link "Explanation" [ref=e89] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/explanation/
                  - listitem [ref=e90]:
                    - generic [ref=e91]: Inference Engines
              - generic [ref=e92]:
                - heading "PaletteAI Inference Launchpad Inference Engines" [level=1] [ref=e94]
                - paragraph [ref=e95]:
                  - text: This page explains what an inference engine is in PaletteAI Inference Launchpad, how the appliance selects one automatically, and when you might choose one yourself. It gives you the background to make an informed choice when you
                  - link "deploy a model" [ref=e96] [cursor=pointer]:
                    - /url: /paletteai-inference-launchpad/how-to-guides/deploy-a-model/
                  - text: ", where the engine is an optional setting."
                - heading "Inference Engine OverviewDirect link to Inference Engine Overview" [level=2] [ref=e97]:
                  - text: Inference Engine Overview
                  - link "Direct link to Inference Engine Overview" [ref=e98] [cursor=pointer]:
                    - /url: "#inference-engine-overview"
                    - text: "#"
                - paragraph [ref=e99]: An inference engine is the runtime that loads a model and serves its requests. The appliance exposes each loaded model as an OpenAI-compatible endpoint, but the engine behind that endpoint is what actually runs the model on a node's CPU or GPUs. The engine determines how the model runs, which hardware it can use, and which serving features are available.
                - paragraph [ref=e100]: Each engine has a kind that identifies the underlying runtime, and each engine is either GPU-capable or CPU-only. A GPU model can only run on a GPU-capable engine, and a model intended for CPU nodes runs on a CPU-only engine.
                - heading "Automatic Engine SelectionDirect link to Automatic Engine Selection" [level=2] [ref=e101]:
                  - text: Automatic Engine Selection
                  - link "Direct link to Automatic Engine Selection" [ref=e102] [cursor=pointer]:
                    - /url: "#automatic-engine-selection"
                    - text: "#"
                - paragraph [ref=e103]:
                  - text: When you deploy a model, the engine setting defaults to
                  - strong [ref=e104]: engine (auto)
                  - text: . With the automatic option, the appliance selects an engine that fits the model you chose, a GPU-capable engine for a GPU model and a CPU-only engine for a CPU model. Leaving the setting on automatic is the recommended choice for most deployments, because the appliance matches the engine to the model and the target node for you.
                - paragraph [ref=e105]:
                  - text: The engines you can choose from depend on how your appliance is configured. The deploy panel lists the automatic option first, followed by any named engines the appliance exposes, each labeled with its kind, such as
                  - code [ref=e106]: default · sglang
                  - text: .
                - heading "Supported Engine KindsDirect link to Supported Engine Kinds" [level=2] [ref=e107]:
                  - text: Supported Engine Kinds
                  - link "Direct link to Supported Engine Kinds" [ref=e108] [cursor=pointer]:
                    - /url: "#supported-engine-kinds"
                    - text: "#"
                - paragraph [ref=e109]: PaletteAI Inference Launchpad supports the following engine kinds.
                - table [ref=e110]:
                  - rowgroup [ref=e111]:
                    - row "Kind Hardware Summary" [ref=e112]:
                      - columnheader "Kind" [ref=e113]:
                        - strong [ref=e114]: Kind
                      - columnheader "Hardware" [ref=e115]:
                        - strong [ref=e116]: Hardware
                      - columnheader "Summary" [ref=e117]:
                        - strong [ref=e118]: Summary
                  - rowgroup [ref=e119]:
                    - row "vLLM GPU High-throughput GPU serving for large models." [ref=e120]:
                      - cell "vLLM" [ref=e121]
                      - cell "GPU" [ref=e122]
                      - cell "High-throughput GPU serving for large models." [ref=e123]
                    - row "SGLang GPU High-throughput GPU serving with support for advanced serving features." [ref=e124]:
                      - cell "SGLang" [ref=e125]
                      - cell "GPU" [ref=e126]
                      - cell "High-throughput GPU serving with support for advanced serving features." [ref=e127]
                    - row "Ollama CPU CPU-based serving for smaller models on nodes without a GPU." [ref=e128]:
                      - cell "Ollama" [ref=e129]
                      - cell "CPU" [ref=e130]
                      - cell "CPU-based serving for smaller models on nodes without a GPU." [ref=e131]
                    - row "llama.cpp CPU Lightweight CPU-based serving for smaller models on nodes without a GPU." [ref=e132]:
                      - cell "llama.cpp" [ref=e133]
                      - cell "CPU" [ref=e134]
                      - cell "Lightweight CPU-based serving for smaller models on nodes without a GPU." [ref=e135]
                - paragraph [ref=e136]: Serving features can vary by kind. For example, some kinds support reasoning and tool-calling for models that provide them, while others do not. The automatic option accounts for these differences when it matches an engine to a model.
                - heading "Manual Engine SelectionDirect link to Manual Engine Selection" [level=2] [ref=e137]:
                  - text: Manual Engine Selection
                  - link "Direct link to Manual Engine Selection" [ref=e138] [cursor=pointer]:
                    - /url: "#manual-engine-selection"
                    - text: "#"
                - paragraph [ref=e139]: Leave the engine on the automatic option unless you have a specific reason to pin a model to a particular engine, such as a serving feature that a specific kind provides. When you select an engine yourself, the appliance only offers engines that fit the model's hardware, so you cannot select a CPU-only engine for a GPU model or the reverse.
                - heading "ResourcesDirect link to Resources" [level=2] [ref=e140]:
                  - text: Resources
                  - link "Direct link to Resources" [ref=e141] [cursor=pointer]:
                    - /url: "#resources"
                    - text: "#"
                - list [ref=e142]:
                  - listitem [ref=e143]:
                    - link "Deploy a Model" [ref=e144] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/deploy-a-model/
                  - listitem [ref=e145]:
                    - link "Architecture" [ref=e146] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/explanation/architecture/
                  - listitem [ref=e147]:
                    - link "Certified Models by Hardware" [ref=e148] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/reference/certified-models-by-hardware/
              - generic [ref=e149]:
                - generic [ref=e151]:
                  - text: "Tags:"
                  - list [ref=e152]:
                    - listitem [ref=e153]:
                      - link "paletteai-inference-launchpad" [ref=e154] [cursor=pointer]:
                        - /url: /paletteai-inference-launchpad/tags/paletteai-inference-launchpad/
                    - listitem [ref=e155]:
                      - link "models" [ref=e156] [cursor=pointer]:
                        - /url: /paletteai-inference-launchpad/tags/models/
                    - listitem [ref=e157]:
                      - link "explanation" [ref=e158] [cursor=pointer]:
                        - /url: /paletteai-inference-launchpad/tags/explanation/
                - link "Edit this page" [ref=e161] [cursor=pointer]:
                  - /url: https://github.com/spectrocloud/librarium/blob/master/docs/products/paletteai-inference-launchpad/explanation/inference-engines.md
                  - img [ref=e162]
                  - text: Edit this page
            - navigation "Docs pages" [ref=e166]:
              - link "Previous « Model Certification" [ref=e167] [cursor=pointer]:
                - /url: /paletteai-inference-launchpad/explanation/model-certification/
                - generic [ref=e168]: Previous
                - generic [ref=e169]: « Model Certification
              - link "Next Installation Architecture »" [ref=e170] [cursor=pointer]:
                - /url: /paletteai-inference-launchpad/explanation/installation-architecture/
                - generic [ref=e171]: Next
                - generic [ref=e172]: Installation Architecture »
          - list [ref=e175]:
            - listitem [ref=e176]:
              - link "Inference Engine Overview" [ref=e177] [cursor=pointer]:
                - /url: "#inference-engine-overview"
            - listitem [ref=e178]:
              - link "Automatic Engine Selection" [ref=e179] [cursor=pointer]:
                - /url: "#automatic-engine-selection"
            - listitem [ref=e180]:
              - link "Supported Engine Kinds" [ref=e181] [cursor=pointer]:
                - /url: "#supported-engine-kinds"
            - listitem [ref=e182]:
              - link "Manual Engine Selection" [ref=e183] [cursor=pointer]:
                - /url: "#manual-engine-selection"
            - listitem [ref=e184]:
              - link "Resources" [ref=e185] [cursor=pointer]:
                - /url: "#resources"
  - button "Project Logo Ask AI" [ref=e186] [cursor=pointer]:
    - generic [ref=e189]:
      - img "Project Logo" [ref=e190]
      - paragraph [ref=e191]: Ask AI
```

# Test source

```ts
  1  | import * as fs from "fs";
  2  | import { test, expect } from "@playwright/test";
  3  | import { extractSitemapPathnames, WaitForDocusaurusHydration } from "./utils";
  4  | import excludeList from "./exclude.json";
  5  | 
  6  | const siteUrl = "http://localhost:3000";
  7  | const sitemapPath = "build/sitemap.xml";
  8  | const stylesheetPath = "visuals/screenshot.css";
  9  | const stylesheet = fs.readFileSync(stylesheetPath).toString();
  10 | 
  11 | test.describe.configure({ mode: "parallel" });
  12 | 
  13 | function isVersionedDocsPathname(pathname: string, excludeList: string[]): boolean {
  14 |   if (
  15 |     excludeList.some((excludedPath) => {
  16 |       if (excludedPath.endsWith("/*")) {
  17 |         // Let's remove the trailing "/*" to match sub-paths
  18 |         const basePath = excludedPath.slice(0, -2);
  19 |         // Exclude sub-paths only, not the index page
  20 |         return pathname.startsWith(basePath) && pathname !== `${basePath}/`;
  21 |       }
  22 |       // This is an exact match
  23 |       return pathname === excludedPath;
  24 |     })
  25 |   ) {
  26 |     return false;
  27 |   }
  28 | 
  29 |   // Additional exclusion criteria
  30 |   if (pathname.startsWith("/api/") || pathname.match(/\/\d+\.\d+\.x\//)) {
  31 |     return false;
  32 |   }
  33 | 
  34 |   return true;
  35 | }
  36 | 
  37 | function screenshotPathname(pathname: string) {
  38 |   test(`pathname ${pathname}`, async ({ page }) => {
  39 |     console.log(`Taking screenshot of ${pathname}`);
  40 |     const url = siteUrl + pathname;
  41 |     await page.goto(url);
  42 |     await page.waitForFunction(WaitForDocusaurusHydration);
  43 |     await page.waitForLoadState("domcontentloaded");
  44 |     await page.addStyleTag({ content: stylesheet });
  45 |     await page.waitForTimeout(1000); // Waits for 1000 milliseconds
> 46 |     await expect(page).toHaveScreenshot({ fullPage: true, timeout: 10000 });
     |                        ^ Error: expect(page).toHaveScreenshot(expected) failed
  47 |   });
  48 | }
  49 | 
  50 | test.describe("Docs screenshots", () => {
  51 |   const pathnames = extractSitemapPathnames(sitemapPath).filter((pathname) =>
  52 |     isVersionedDocsPathname(pathname, excludeList)
  53 |   );
  54 | 
  55 |   pathnames.forEach(screenshotPathname);
  56 | });
  57 | 
```