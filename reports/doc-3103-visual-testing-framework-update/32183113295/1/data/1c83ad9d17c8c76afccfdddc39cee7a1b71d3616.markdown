# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: screenshot.docs.spec.ts >> Docs screenshots >> pathname /paletteai-inference-launchpad/how-to-guides/use-claude-code/
- Location: visuals/screenshot.docs.spec.ts:38:7

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

  5765 pixels (ratio 0.01 of all image pixels) are different.

Call log:
  - Expect "toHaveScreenshot" with timeout 10000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 5765 pixels (ratio 0.01 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - 5765 pixels (ratio 0.01 of all image pixels) are different.

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
          - button "latest" [ref=e16] [cursor=pointer]
        - generic [ref=e17]:
          - link "Go to Spectro Cloud homepage (opens in a new tab)" [ref=e19] [cursor=pointer]:
            - /url: https://spectrocloud.com
            - text: spectrocloud.com ↗
          - link "GitHub repository" [ref=e20] [cursor=pointer]:
            - /url: https://github.com/spectrocloud/librarium
          - button "Ask AI" [ref=e22] [cursor=pointer]
          - button "Switch between dark and light mode (currently system mode)" [ref=e24] [cursor=pointer]:
            - img [ref=e25]
          - button "Search (Control+k)" [ref=e28] [cursor=pointer]:
            - generic [ref=e29]:
              - img [ref=e30]
              - generic [ref=e33]: Search
    - generic [ref=e37]:
      - complementary [ref=e38]:
        - generic [ref=e40]:
          - link "Spectro cloud logo" [ref=e41] [cursor=pointer]:
            - /url: /
            - img "Spectro cloud logo" [ref=e42]
          - navigation "Docs sidebar" [ref=e43]:
            - list [ref=e44]:
              - listitem [ref=e45]:
                - link "Overview" [ref=e46] [cursor=pointer]:
                  - /url: /paletteai-inference-launchpad/
              - listitem [ref=e47]:
                - link "Tutorials" [ref=e48] [cursor=pointer]:
                  - /url: /paletteai-inference-launchpad/tutorials/
              - listitem [ref=e49]:
                - generic [ref=e50]:
                  - link "How-to Guides" [expanded] [ref=e51] [cursor=pointer]:
                    - /url: /paletteai-inference-launchpad/how-to-guides/
                  - button "Toggle the collapsible sidebar category 'How-to Guides'" [ref=e52] [cursor=pointer]
                - list [ref=e53]:
                  - listitem [ref=e54]:
                    - link "Install the Appliance" [ref=e55] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/install-the-appliance/
                  - listitem [ref=e56]:
                    - link "Deploy a Model" [ref=e57] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/deploy-a-model/
                  - listitem [ref=e58]:
                    - link "Upload a Model" [ref=e59] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/upload-a-model/
                  - listitem [ref=e60]:
                    - link "Switch the Default Model" [ref=e61] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/set-the-default-model/
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
                    - generic [ref=e109]: Use Claude Code
              - generic [ref=e110]:
                - heading "Use PaletteAI Inference Launchpad with Claude Code" [level=1] [ref=e112]
                - paragraph [ref=e113]: This guide explains how to connect Claude Code to a PaletteAI Inference Launchpad appliance so that a model running on the appliance serves every request instead of Anthropic's hosted API. You point Claude Code at the appliance with two environment variables and confirm the connection.
                - heading "PrerequisitesDirect link to Prerequisites" [level=2] [ref=e114]:
                  - text: Prerequisites
                  - link "Direct link to Prerequisites" [ref=e115] [cursor=pointer]:
                    - /url: "#prerequisites"
                    - text: "#"
                - list [ref=e116]:
                  - listitem [ref=e117]:
                    - text: Claude Code installed and already working against Anthropic's hosted API. For installation, refer to the
                    - link "Claude Code documentation" [ref=e118] [cursor=pointer]:
                      - /url: https://docs.claude.com/en/docs/claude-code
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
                - heading "Configure Claude CodeDirect link to Configure Claude Code" [level=2] [ref=e123]:
                  - text: Configure Claude Code
                  - link "Direct link to Configure Claude Code" [ref=e124] [cursor=pointer]:
                    - /url: "#configure-claude-code"
                    - text: "#"
                - paragraph [ref=e125]: On the machine where you run Claude Code, set the following environment variables.
                - generic [ref=e126]:
                  - generic [ref=e127]:
                    - img [ref=e129]
                    - text: tip
                  - paragraph [ref=e132]:
                    - text: You do not have to assemble these variables by hand. In the console, select
                    - strong [ref=e133]: Connect coding agent
                    - text: and open the
                    - strong [ref=e134]: Claude Code
                    - text: tab to generate a ready-to-paste configuration snippet. The snippet can also set optional per-tier model aliases and a reasoning-effort level. For the full list of values it can set, refer to
                    - link "Claude Code Configuration" [ref=e135] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/reference/claude-code-reference/
                    - text: .
                - generic [ref=e137]:
                  - code [ref=e139]:
                    - generic [ref=e140]: export ANTHROPIC_BASE_URL=https://<appliance-host>
                    - generic [ref=e141]: export ANTHROPIC_AUTH_TOKEN=<lpai-token>
                  - button "Copy code to clipboard" [ref=e143] [cursor=pointer]:
                    - generic [ref=e144]:
                      - img [ref=e145]
                      - img [ref=e147]
                - paragraph [ref=e149]:
                  - text: Set
                  - code [ref=e150]: ANTHROPIC_BASE_URL
                  - text: to your appliance's address with no path. Do not append
                  - code [ref=e151]: /v1
                  - text: . Claude Code adds the API path itself. Use
                  - code [ref=e152]: ANTHROPIC_AUTH_TOKEN
                  - text: for the token.
                  - code [ref=e153]: ANTHROPIC_API_KEY
                  - text: also works, but do not set it globally if you also sign in to Claude Code with an Anthropic account.
                - paragraph [ref=e154]:
                  - text: To persist the settings instead of exporting them each session, add them to the
                  - code [ref=e155]: ~/.claude/settings.json
                  - text: file.
                - generic [ref=e157]:
                  - code [ref=e159]:
                    - generic [ref=e160]: "{"
                    - generic [ref=e161]: "\"env\": {"
                    - generic [ref=e162]: "\"ANTHROPIC_BASE_URL\": \"https://<appliance-host>\","
                    - generic [ref=e163]: "\"ANTHROPIC_AUTH_TOKEN\": \"<lpai-token>\""
                    - generic [ref=e164]: "}"
                    - generic [ref=e165]: "}"
                  - button "Copy code to clipboard" [ref=e167] [cursor=pointer]:
                    - generic [ref=e168]:
                      - img [ref=e169]
                      - img [ref=e171]
                - paragraph [ref=e173]:
                  - text: Claude Code requests a Claude alias, such as
                  - code [ref=e174]: claude-opus-4-8
                  - text: . To pin every request to one alias, set
                  - code [ref=e175]: ANTHROPIC_MODEL
                  - text: to it. For the aliases the appliance accepts, refer to
                  - link "Claude Code Configuration" [ref=e176] [cursor=pointer]:
                    - /url: /paletteai-inference-launchpad/reference/claude-code-reference/
                  - text: .
                - generic [ref=e178]:
                  - code [ref=e180]:
                    - generic [ref=e181]: export ANTHROPIC_MODEL=claude-opus-4-8
                  - button "Copy code to clipboard" [ref=e183] [cursor=pointer]:
                    - generic [ref=e184]:
                      - img [ref=e185]
                      - img [ref=e187]
                - paragraph [ref=e189]: We strongly recommend giving the appliance a DNS name and a valid, publicly trusted TLS certificate. The connection uses HTTPS, so a valid certificate protects your token in transit.
                - generic [ref=e190]:
                  - generic [ref=e191]:
                    - img [ref=e193]
                    - text: warning
                  - paragraph [ref=e196]:
                    - text: If the appliance uses a self-signed certificate, Claude Code rejects the connection by default. As a temporary measure for testing, set
                    - code [ref=e197]: NODE_TLS_REJECT_UNAUTHORIZED=0
                    - text: before you start Claude Code. This disables certificate verification, so do not use it outside short-lived testing.
                - heading "Verify the ConnectionDirect link to Verify the Connection" [level=2] [ref=e198]:
                  - text: Verify the Connection
                  - link "Direct link to Verify the Connection" [ref=e199] [cursor=pointer]:
                    - /url: "#verify-the-connection"
                    - text: "#"
                - paragraph [ref=e200]: Run a single prompt to confirm the appliance answers.
                - generic [ref=e202]:
                  - code [ref=e204]:
                    - generic [ref=e205]: claude --print "reply with exactly CC_OK and nothing else"
                  - button "Copy code to clipboard" [ref=e207] [cursor=pointer]:
                    - generic [ref=e208]:
                      - img [ref=e209]
                      - img [ref=e211]
                - generic [ref=e213]:
                  - generic [ref=e214]: Expected output
                  - code [ref=e217]:
                    - generic [ref=e218]: CC_OK
                - paragraph [ref=e219]:
                  - text: A reply confirms that the base URL, token, and model routing all work. To confirm which endpoint and credential the session uses, run the
                  - code [ref=e220]: /status
                  - text: command in Claude Code and review the
                  - strong [ref=e221]: Anthropic base URL
                  - text: and
                  - strong [ref=e222]: Auth token
                  - text: lines.
                - heading "Request Routing and QuotasDirect link to Request Routing and Quotas" [level=2] [ref=e223]:
                  - text: Request Routing and Quotas
                  - link "Direct link to Request Routing and Quotas" [ref=e224] [cursor=pointer]:
                    - /url: "#request-routing-and-quotas"
                    - text: "#"
                - paragraph [ref=e225]:
                  - text: Requests you send through the appliance are subject to the routing rule and quota configured for your API token. If an operator configured a routing rule for your token, the appliance can redirect a request to a frontier model instead of a local one. Token quotas apply per API token, and when a token exhausts its quota, the appliance returns an HTTP
                  - code [ref=e226]: "429"
                  - text: response.
                - paragraph [ref=e227]:
                  - text: To understand what a client is and how API keys and quotas govern usage, refer to
                  - link "Clients and Quotas" [ref=e228] [cursor=pointer]:
                    - /url: /paletteai-inference-launchpad/explanation/clients-and-quotas/
                  - text: .
                - heading "Next StepsDirect link to Next Steps" [level=2] [ref=e229]:
                  - text: Next Steps
                  - link "Direct link to Next Steps" [ref=e230] [cursor=pointer]:
                    - /url: "#next-steps"
                    - text: "#"
                - paragraph [ref=e231]:
                  - text: To look up any configuration value, refer to
                  - link "Claude Code Configuration" [ref=e232] [cursor=pointer]:
                    - /url: /paletteai-inference-launchpad/reference/claude-code-reference/
                  - text: . To deploy another model to the appliance, refer to
                  - link "Deploy a Model" [ref=e233] [cursor=pointer]:
                    - /url: /paletteai-inference-launchpad/how-to-guides/deploy-a-model/
                  - text: .
              - generic [ref=e234]:
                - generic [ref=e236]:
                  - text: "Tags:"
                  - list [ref=e237]:
                    - listitem [ref=e238]:
                      - link "paletteai-inference-launchpad" [ref=e239] [cursor=pointer]:
                        - /url: /tags/paletteai-inference-launchpad/
                    - listitem [ref=e240]:
                      - link "claude-code" [ref=e241] [cursor=pointer]:
                        - /url: /tags/claude-code/
                    - listitem [ref=e242]:
                      - link "how-to" [ref=e243] [cursor=pointer]:
                        - /url: /tags/how-to/
                - link "Edit this page" [ref=e246] [cursor=pointer]:
                  - /url: https://github.com/spectrocloud/librarium/blob/master/docs/docs-content/paletteai-inference-launchpad/how-to-guides/use-claude-code.md
                  - img [ref=e247]
                  - text: Edit this page
            - navigation "Docs pages" [ref=e251]:
              - link "Previous « Revoke or Delete a Client" [ref=e252] [cursor=pointer]:
                - /url: /paletteai-inference-launchpad/how-to-guides/revoke-or-delete-a-client/
                - generic [ref=e253]: Previous
                - generic [ref=e254]: « Revoke or Delete a Client
              - link "Next Use Cursor »" [ref=e255] [cursor=pointer]:
                - /url: /paletteai-inference-launchpad/how-to-guides/use-cursor/
                - generic [ref=e256]: Next
                - generic [ref=e257]: Use Cursor »
          - list [ref=e260]:
            - listitem [ref=e261]:
              - link "Prerequisites" [ref=e262] [cursor=pointer]:
                - /url: "#prerequisites"
            - listitem [ref=e263]:
              - link "Configure Claude Code" [ref=e264] [cursor=pointer]:
                - /url: "#configure-claude-code"
            - listitem [ref=e265]:
              - link "Verify the Connection" [ref=e266] [cursor=pointer]:
                - /url: "#verify-the-connection"
            - listitem [ref=e267]:
              - link "Request Routing and Quotas" [ref=e268] [cursor=pointer]:
                - /url: "#request-routing-and-quotas"
            - listitem [ref=e269]:
              - link "Next Steps" [ref=e270] [cursor=pointer]:
                - /url: "#next-steps"
  - button "Project Logo Ask AI" [ref=e271] [cursor=pointer]:
    - generic [ref=e274]:
      - img "Project Logo" [ref=e275]
      - paragraph [ref=e276]: Ask AI
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