# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: screenshot.docs.spec.ts >> Docs screenshots >> pathname /paletteai-inference-launchpad/how-to-guides/use-opencode/
- Location: visuals/screenshot.docs.spec.ts:38:7

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

  4544 pixels (ratio 0.01 of all image pixels) are different.

Call log:
  - Expect "toHaveScreenshot" with timeout 10000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 4544 pixels (ratio 0.01 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - 4544 pixels (ratio 0.01 of all image pixels) are different.

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
                  - link "How-to Guides" [expanded] [ref=e49] [cursor=pointer]:
                    - /url: /paletteai-inference-launchpad/how-to-guides/
                  - button "Toggle the collapsible sidebar category 'How-to Guides'" [ref=e50] [cursor=pointer]
                - list [ref=e51]:
                  - listitem [ref=e52]:
                    - link "Install the Appliance" [ref=e53] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/install-the-appliance/
                  - listitem [ref=e54]:
                    - link "Deploy a Model" [ref=e55] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/deploy-a-model/
                  - listitem [ref=e56]:
                    - link "Upload a Model" [ref=e57] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/upload-a-model/
                  - listitem [ref=e58]:
                    - link "Switch the Default Model" [ref=e59] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/set-the-default-model/
                  - listitem [ref=e60]:
                    - link "Enable Vision Preprocessing" [ref=e61] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/enable-vision-preprocessing/
                  - listitem [ref=e62]:
                    - link "Create a Client" [ref=e63] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/create-a-client/
                  - listitem [ref=e64]:
                    - link "Generate an API Token" [ref=e65] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/generate-an-api-token/
                  - listitem [ref=e66]:
                    - link "Set and Manage Client Quotas" [ref=e67] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/manage-client-quotas/
                  - listitem [ref=e68]:
                    - link "Manage a Client's Model Access" [ref=e69] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/manage-client-model-access/
                  - listitem [ref=e70]:
                    - link "View Client Usage" [ref=e71] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/view-client-usage/
                  - listitem [ref=e72]:
                    - link "Revoke or Delete a Client" [ref=e73] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/revoke-or-delete-a-client/
                  - listitem [ref=e74]:
                    - link "Use Claude Code" [ref=e75] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/use-claude-code/
                  - listitem [ref=e76]:
                    - link "Use Cursor" [ref=e77] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/use-cursor/
                  - listitem [ref=e78]:
                    - link "Use OpenAI Codex" [ref=e79] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/use-codex/
                  - listitem [ref=e80]:
                    - link "Use OpenCode" [ref=e81] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/use-opencode/
              - listitem [ref=e82]:
                - generic [ref=e83]:
                  - link "Explanation" [ref=e84] [cursor=pointer]:
                    - /url: /paletteai-inference-launchpad/explanation/
                  - button "Toggle the collapsible sidebar category 'Explanation'" [ref=e85] [cursor=pointer]
              - listitem [ref=e86]:
                - generic [ref=e87]:
                  - link "Reference" [ref=e88] [cursor=pointer]:
                    - /url: /paletteai-inference-launchpad/reference/
                  - button "Toggle the collapsible sidebar category 'Reference'" [ref=e89] [cursor=pointer]
              - listitem [ref=e90]:
                - link "Release Notes" [ref=e91] [cursor=pointer]:
                  - /url: /paletteai-inference-launchpad/release-notes/
              - listitem [ref=e92]:
                - button "Privacy Settings" [ref=e93] [cursor=pointer]
      - main [ref=e94]:
        - generic [ref=e96]:
          - generic [ref=e98]:
            - article [ref=e99]:
              - navigation "Breadcrumbs" [ref=e100]:
                - list [ref=e101]:
                  - listitem [ref=e102]:
                    - link "Home page" [ref=e103] [cursor=pointer]:
                      - /url: /
                      - img [ref=e104]
                  - listitem [ref=e106]:
                    - link "How-to Guides" [ref=e107] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/
                  - listitem [ref=e108]:
                    - generic [ref=e109]: Use OpenCode
              - generic [ref=e110]:
                - heading "Use PaletteAI Inference Launchpad with OpenCode" [level=1] [ref=e112]
                - paragraph [ref=e113]: This guide explains how to connect OpenCode to a PaletteAI Inference Launchpad appliance so that a model running on the appliance serves every request instead of a cloud provider. You add a custom provider to the OpenCode configuration file and confirm the connection.
                - heading "PrerequisitesDirect link to Prerequisites" [level=2] [ref=e114]:
                  - text: Prerequisites
                  - link "Direct link to Prerequisites" [ref=e115] [cursor=pointer]:
                    - /url: "#prerequisites"
                    - text: "#"
                - list [ref=e116]:
                  - listitem [ref=e117]:
                    - text: OpenCode installed and already working. For installation details, refer to the
                    - link "OpenCode website" [ref=e118] [cursor=pointer]:
                      - /url: https://opencode.ai
                    - text: .
                  - listitem [ref=e119]:
                    - text: A running PaletteAI Inference Launchpad appliance with at least one model deployed and serving. To deploy a model, refer to
                    - link "Deploy a Model" [ref=e120] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/deploy-a-model/
                    - text: .
                  - listitem [ref=e121]:
                    - text: An API token for the appliance. To create one, refer to
                    - link "Generate an API Token" [ref=e122] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/generate-an-api-token/
                    - text: ", or use a token an administrator generated for you."
                - heading "Configure OpenCodeDirect link to Configure OpenCode" [level=2] [ref=e123]:
                  - text: Configure OpenCode
                  - link "Direct link to Configure OpenCode" [ref=e124] [cursor=pointer]:
                    - /url: "#configure-opencode"
                    - text: "#"
                - paragraph [ref=e125]:
                  - text: OpenCode connects to any OpenAI-compatible endpoint through a custom provider. Add a provider for the appliance to the OpenCode configuration file. For a description of each field, refer to
                  - link "OpenCode Configuration" [ref=e126] [cursor=pointer]:
                    - /url: /paletteai-inference-launchpad/reference/opencode-reference/
                  - text: .
                - generic [ref=e127]:
                  - generic [ref=e128]:
                    - img [ref=e130]
                    - text: tip
                  - paragraph [ref=e133]:
                    - text: The console can generate a starter version of this file for you. Select
                    - strong [ref=e134]: Connect coding agent
                    - text: and open the
                    - strong [ref=e135]: OpenCode
                    - text: tab to copy an
                    - code [ref=e136]: opencode.json
                    - text: snippet pre-filled with your appliance's endpoint. Review the
                    - code [ref=e137]: baseURL
                    - text: and
                    - code [ref=e138]: models
                    - text: values against the steps below before you save it.
                - list [ref=e139]:
                  - listitem [ref=e140]:
                    - paragraph [ref=e141]:
                      - text: Add the following provider to the OpenCode configuration file at
                      - code [ref=e142]: ~/.config/opencode/opencode.json
                      - text: . Replace
                      - code [ref=e143]: <appliance-host>
                      - text: with your appliance address and
                      - code [ref=e144]: <lpai-token>
                      - text: with the token you copied.
                    - generic [ref=e146]:
                      - code [ref=e148]:
                        - generic [ref=e149]: "{"
                        - generic [ref=e150]: "\"$schema\": \"https://opencode.ai/config.json\","
                        - generic [ref=e151]: "\"provider\": {"
                        - generic [ref=e152]: "\"launchpad\": {"
                        - generic [ref=e153]: "\"npm\": \"@ai-sdk/openai-compatible\","
                        - generic [ref=e154]: "\"name\": \"Launchpad\","
                        - generic [ref=e155]: "\"options\": {"
                        - generic [ref=e156]: "\"baseURL\": \"https://<appliance-host>/v1\","
                        - generic [ref=e157]: "\"apiKey\": \"<lpai-token>\""
                        - generic [ref=e158]: "},"
                        - generic [ref=e159]: "\"models\": {"
                        - generic [ref=e160]: "\"glm-5.2\": { \"name\": \"GLM-5.2 (Launchpad)\" }"
                        - generic [ref=e161]: "}"
                        - generic [ref=e162]: "}"
                        - generic [ref=e163]: "}"
                        - generic [ref=e164]: "}"
                      - button "Copy code to clipboard" [ref=e166] [cursor=pointer]:
                        - generic [ref=e167]:
                          - img [ref=e168]
                          - img [ref=e170]
                  - listitem [ref=e172]:
                    - paragraph [ref=e173]:
                      - text: Set
                      - code [ref=e174]: baseURL
                      - text: to your appliance address with the
                      - code [ref=e175]: /v1
                      - text: path appended.
                  - listitem [ref=e176]:
                    - paragraph [ref=e177]:
                      - text: Set
                      - code [ref=e178]: apiKey
                      - text: to your
                      - code [ref=e179]: lpai_
                      - text: token.
                  - listitem [ref=e180]:
                    - paragraph [ref=e181]:
                      - text: Under
                      - code [ref=e182]: models
                      - text: ", list each model id the appliance serves that you want to use, such as"
                      - code [ref=e183]: glm-5.2
                      - text: . The
                      - code [ref=e184]: launchpad
                      - text: key is a name you choose for the provider. OpenCode identifies a model by that provider name and a model id joined with a slash, such as
                      - code [ref=e185]: launchpad/glm-5.2
                      - text: ", which you pass to the"
                      - code [ref=e186]: "--model"
                      - text: flag when you run OpenCode in the next section.
                  - listitem [ref=e187]:
                    - paragraph [ref=e188]: We strongly recommend giving the appliance a DNS name and a valid, publicly trusted TLS certificate. The connection uses HTTPS, so a valid certificate protects your token in transit.
                    - generic [ref=e189]:
                      - generic [ref=e190]:
                        - img [ref=e192]
                        - text: warning
                      - paragraph [ref=e195]:
                        - text: If the appliance uses a self-signed certificate, OpenCode rejects the connection by default because it runs on Node.js. As a temporary measure for testing, set
                        - code [ref=e196]: NODE_TLS_REJECT_UNAUTHORIZED=0
                        - text: before you start OpenCode. This disables certificate verification, so do not use it outside short-lived testing.
                - heading "Verify the ConnectionDirect link to Verify the Connection" [level=2] [ref=e197]:
                  - text: Verify the Connection
                  - link "Direct link to Verify the Connection" [ref=e198] [cursor=pointer]:
                    - /url: "#verify-the-connection"
                    - text: "#"
                - paragraph [ref=e199]:
                  - text: Run a single prompt to confirm the appliance answers. The
                  - code [ref=e200]: "--model"
                  - text: flag takes a
                  - code [ref=e201]: provider/model
                  - text: value that combines the provider key from your configuration file with a model id.
                - generic [ref=e203]:
                  - code [ref=e205]:
                    - generic [ref=e206]: opencode run --model launchpad/glm-5.2 "reply with exactly OPENCODE_OK"
                  - generic [ref=e207]:
                    - button "Toggle word wrap" [ref=e208] [cursor=pointer]:
                      - img [ref=e209]
                    - button "Copy code to clipboard" [ref=e211] [cursor=pointer]:
                      - generic [ref=e212]:
                        - img [ref=e213]
                        - img [ref=e215]
                - generic [ref=e217]:
                  - generic [ref=e218]: Expected output
                  - code [ref=e221]:
                    - generic [ref=e222]: OPENCODE_OK
                - paragraph [ref=e223]:
                  - text: A reply confirms that the base URL, token, provider, and model routing all work. OpenCode splits the
                  - code [ref=e224]: "--model"
                  - text: value on the first slash, so
                  - code [ref=e225]: launchpad/glm-5.2
                  - text: selects the
                  - code [ref=e226]: glm-5.2
                  - text: model from the
                  - code [ref=e227]: launchpad
                  - text: provider.
                - generic [ref=e228]:
                  - generic [ref=e229]:
                    - img [ref=e231]
                    - text: tip
                  - paragraph [ref=e234]: If you use a reasoning model and the reply comes back empty, raise the output limit. Hidden reasoning tokens can consume a small output budget entirely, which leaves no room for the visible reply.
                - heading "Request Routing and QuotasDirect link to Request Routing and Quotas" [level=2] [ref=e235]:
                  - text: Request Routing and Quotas
                  - link "Direct link to Request Routing and Quotas" [ref=e236] [cursor=pointer]:
                    - /url: "#request-routing-and-quotas"
                    - text: "#"
                - paragraph [ref=e237]:
                  - text: Requests you send through the appliance are subject to the routing rule and quota configured for your API token. If an operator configured a routing rule for your token, the appliance can redirect a request to a frontier model instead of a local one. Token quotas apply per API token, and when a token exhausts its quota, the appliance returns an HTTP
                  - code [ref=e238]: "429"
                  - text: response.
                - paragraph [ref=e239]:
                  - text: To understand what a client is and how API keys and quotas govern usage, refer to
                  - link "Clients and Quotas" [ref=e240] [cursor=pointer]:
                    - /url: /paletteai-inference-launchpad/explanation/clients-and-quotas/
                  - text: .
                - heading "Next StepsDirect link to Next Steps" [level=2] [ref=e241]:
                  - text: Next Steps
                  - link "Direct link to Next Steps" [ref=e242] [cursor=pointer]:
                    - /url: "#next-steps"
                    - text: "#"
                - paragraph [ref=e243]:
                  - text: To look up each configuration value, refer to
                  - link "OpenCode Configuration" [ref=e244] [cursor=pointer]:
                    - /url: /paletteai-inference-launchpad/reference/opencode-reference/
                  - text: . To connect a different coding tool, refer to
                  - link "Use PaletteAI Inference Launchpad with Claude Code" [ref=e245] [cursor=pointer]:
                    - /url: /paletteai-inference-launchpad/how-to-guides/use-claude-code/
                  - text: ","
                  - link "Use PaletteAI Inference Launchpad with Cursor" [ref=e246] [cursor=pointer]:
                    - /url: /paletteai-inference-launchpad/how-to-guides/use-cursor/
                  - text: ", or"
                  - link "Use PaletteAI Inference Launchpad with OpenAI Codex" [ref=e247] [cursor=pointer]:
                    - /url: /paletteai-inference-launchpad/how-to-guides/use-codex/
                  - text: . To deploy another model to the appliance, refer to
                  - link "Deploy a Model" [ref=e248] [cursor=pointer]:
                    - /url: /paletteai-inference-launchpad/how-to-guides/deploy-a-model/
                  - text: .
              - generic [ref=e249]:
                - generic [ref=e251]:
                  - text: "Tags:"
                  - list [ref=e252]:
                    - listitem [ref=e253]:
                      - link "paletteai-inference-launchpad" [ref=e254] [cursor=pointer]:
                        - /url: /paletteai-inference-launchpad/tags/paletteai-inference-launchpad/
                    - listitem [ref=e255]:
                      - link "opencode" [ref=e256] [cursor=pointer]:
                        - /url: /paletteai-inference-launchpad/tags/opencode/
                    - listitem [ref=e257]:
                      - link "how-to" [ref=e258] [cursor=pointer]:
                        - /url: /paletteai-inference-launchpad/tags/how-to/
                - link "Edit this page" [ref=e261] [cursor=pointer]:
                  - /url: https://github.com/spectrocloud/librarium/blob/master/docs/products/paletteai-inference-launchpad/how-to-guides/use-opencode.md
                  - img [ref=e262]
                  - text: Edit this page
            - navigation "Docs pages" [ref=e266]:
              - link "Previous « Use OpenAI Codex" [ref=e267] [cursor=pointer]:
                - /url: /paletteai-inference-launchpad/how-to-guides/use-codex/
                - generic [ref=e268]: Previous
                - generic [ref=e269]: « Use OpenAI Codex
              - link "Next Explanation »" [ref=e270] [cursor=pointer]:
                - /url: /paletteai-inference-launchpad/explanation/
                - generic [ref=e271]: Next
                - generic [ref=e272]: Explanation »
          - list [ref=e275]:
            - listitem [ref=e276]:
              - link "Prerequisites" [ref=e277] [cursor=pointer]:
                - /url: "#prerequisites"
            - listitem [ref=e278]:
              - link "Configure OpenCode" [ref=e279] [cursor=pointer]:
                - /url: "#configure-opencode"
            - listitem [ref=e280]:
              - link "Verify the Connection" [ref=e281] [cursor=pointer]:
                - /url: "#verify-the-connection"
            - listitem [ref=e282]:
              - link "Request Routing and Quotas" [ref=e283] [cursor=pointer]:
                - /url: "#request-routing-and-quotas"
            - listitem [ref=e284]:
              - link "Next Steps" [ref=e285] [cursor=pointer]:
                - /url: "#next-steps"
  - button "Project Logo Ask AI" [ref=e286] [cursor=pointer]:
    - generic [ref=e289]:
      - img "Project Logo" [ref=e290]
      - paragraph [ref=e291]: Ask AI
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