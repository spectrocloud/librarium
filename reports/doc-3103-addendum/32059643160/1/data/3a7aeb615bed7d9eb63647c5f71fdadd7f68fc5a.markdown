# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: screenshot.docs.spec.ts >> Docs screenshots >> pathname /paletteai-inference-launchpad/explanation/installation-architecture/
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
                    - link "Clients and Quotas" [ref=e59] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/explanation/clients-and-quotas/
                  - listitem [ref=e60]:
                    - link "Model Certification" [ref=e61] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/explanation/model-certification/
                  - listitem [ref=e62]:
                    - link "Inference Engines" [ref=e63] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/explanation/inference-engines/
                  - listitem [ref=e64]:
                    - link "Installation Architecture" [ref=e65] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/explanation/installation-architecture/
              - listitem [ref=e66]:
                - generic [ref=e67]:
                  - link "Reference" [ref=e68] [cursor=pointer]:
                    - /url: /paletteai-inference-launchpad/reference/
                  - button "Toggle the collapsible sidebar category 'Reference'" [ref=e69] [cursor=pointer]
              - listitem [ref=e70]:
                - link "Release Notes" [ref=e71] [cursor=pointer]:
                  - /url: /paletteai-inference-launchpad/release-notes/
              - listitem [ref=e72]:
                - button "Privacy Settings" [ref=e73] [cursor=pointer]
      - main [ref=e74]:
        - generic [ref=e76]:
          - generic [ref=e78]:
            - article [ref=e79]:
              - navigation "Breadcrumbs" [ref=e80]:
                - list [ref=e81]:
                  - listitem [ref=e82]:
                    - link "Home page" [ref=e83] [cursor=pointer]:
                      - /url: /
                      - img [ref=e84]
                  - listitem [ref=e86]:
                    - link "Explanation" [ref=e87] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/explanation/
                  - listitem [ref=e88]:
                    - generic [ref=e89]: Installation Architecture
              - generic [ref=e90]:
                - heading "Installation Architecture" [level=1] [ref=e92]
                - paragraph [ref=e93]:
                  - text: Installing the appliance moves it from bare hardware to a running, reachable console in two stages, driven from a separate administrative workstation (a
                  - link "jumpbox" [ref=e94] [cursor=pointer]:
                    - /url: /paletteai-inference-launchpad/reference/glossary/#jumpbox
                  - text: ). This page explains what happens in each stage and why the appliance is put together the way it is. For the ordered procedure, refer to
                  - link "Install the Appliance" [ref=e95] [cursor=pointer]:
                    - /url: /paletteai-inference-launchpad/how-to-guides/install-the-appliance/
                  - text: .
                - heading "Two stages, driven from the jumpboxDirect link to Two stages, driven from the jumpbox" [level=2] [ref=e96]:
                  - text: Two stages, driven from the jumpbox
                  - link "Direct link to Two stages, driven from the jumpbox" [ref=e97] [cursor=pointer]:
                    - /url: "#two-stages-driven-from-the-jumpbox"
                    - text: "#"
                - paragraph [ref=e98]:
                  - text: "You install the appliance from a jumpbox because the appliance itself is a self-contained unit with no external management plane. The jumpbox holds the Palette CLI and the artifacts you download from Artifact Studio: the"
                  - link "slim ISO" [ref=e99] [cursor=pointer]:
                    - /url: /paletteai-inference-launchpad/reference/glossary/#slim-iso
                  - text: ", the"
                  - link "content bundle" [ref=e100] [cursor=pointer]:
                    - /url: /paletteai-inference-launchpad/reference/glossary/#content-bundle
                  - text: ", and one"
                  - code [ref=e101]: metadata.yaml
                  - text: per model. The jumpbox is where you run the CLI commands that put those artifacts on the appliance.
                - 'heading "Stage 1: Operating System and Initial ConfigurationDirect link to Stage 1: Operating System and Initial Configuration" [level=3] [ref=e102]':
                  - text: "Stage 1: Operating System and Initial Configuration"
                  - 'link "Direct link to Stage 1: Operating System and Initial Configuration" [ref=e103] [cursor=pointer]':
                    - /url: "#stage-1-operating-system-and-initial-configuration"
                    - text: "#"
                - paragraph [ref=e104]:
                  - text: You flash the slim ISO (approximately 1.5 GB) to bootable media, or mount it through the server's
                  - link "baseboard management controller (BMC)" [ref=e105] [cursor=pointer]:
                    - /url: /paletteai-inference-launchpad/reference/glossary/#bmc
                  - text: as
                  - link "virtual media" [ref=e106] [cursor=pointer]:
                    - /url: /paletteai-inference-launchpad/reference/glossary/#virtual-media
                  - text: ", and boot the node. The Palette Edge interactive installer writes the immutable"
                  - link "Kairos" [ref=e107] [cursor=pointer]:
                    - /url: /paletteai-inference-launchpad/reference/glossary/#kairos
                  - text: "-based operating system to the local disk. The node then reboots into the"
                  - link "Palette TUI" [ref=e108] [cursor=pointer]:
                    - /url: /paletteai-inference-launchpad/reference/glossary/#palette-tui
                  - text: ", where you set the initial administrator credentials, hostname, DNS, NTP, and a static IP."
                - 'heading "Stage 2: Network, Content, and Cluster DeploymentDirect link to Stage 2: Network, Content, and Cluster Deployment" [level=3] [ref=e109]':
                  - text: "Stage 2: Network, Content, and Cluster Deployment"
                  - 'link "Direct link to Stage 2: Network, Content, and Cluster Deployment" [ref=e110] [cursor=pointer]':
                    - /url: "#stage-2-network-content-and-cluster-deployment"
                    - text: "#"
                - paragraph [ref=e111]:
                  - text: You open
                  - link "Local UI" [ref=e112] [cursor=pointer]:
                    - /url: /paletteai-inference-launchpad/reference/glossary/#local-ui
                  - text: at the node's IP address, create a network
                  - link "bond" [ref=e113] [cursor=pointer]:
                    - /url: /paletteai-inference-launchpad/reference/glossary/#bond
                  - text: ", link the other nodes (multi-node only), and upload the content bundle (more than 20 GB) from Local UI or the Palette CLI. You then deploy the cluster with a wizard that builds the Kubernetes cluster and installs the platform packs. During or after cluster deployment, the Palette CLI on the jumpbox downloads the model from Hugging Face and uploads it to the appliance over SSH. The model then appears in the console, where you deploy it to serve requests."
                - heading "Bond, not bridgeDirect link to Bond, not bridge" [level=2] [ref=e114]:
                  - text: Bond, not bridge
                  - link "Direct link to Bond, not bridge" [ref=e115] [cursor=pointer]:
                    - /url: "#bond-not-bridge"
                    - text: "#"
                - paragraph [ref=e116]:
                  - text: Networking uses a bond, not a bridge. A bond aggregates two physical NICs into a single logical link (
                  - code [ref=e117]: bond0
                  - text: "), and both member NICs are active at once. That matters because two heavy traffic classes share the appliance's data NICs:"
                - list [ref=e118]:
                  - listitem [ref=e119]:
                    - strong [ref=e120]: Cluster traffic
                    - text: . concurrent client requests, model-weight loads, and container-image pulls.
                  - listitem [ref=e121]:
                    - strong [ref=e122]:
                      - link "Piraeus" [ref=e123] [cursor=pointer]:
                        - /url: /paletteai-inference-launchpad/reference/glossary/#piraeus
                      - text: storage replication
                    - text: . continuous, byte-level replication of storage volumes across nodes in a multi-node cluster.
                - paragraph [ref=e124]:
                  - text: A bond in
                  - code [ref=e125]: 802.3ad
                  - text: mode (Link Aggregation Control Protocol, or LACP) with the
                  - code [ref=e126]: layer3+4
                  - text: hash policy spreads these long-lived flows evenly across both NICs, so cluster and storage traffic share the aggregated bandwidth. A bridge, by contrast, is only useful in scenarios where distinct virtual-machine networks must be isolated. PaletteAI Inference Launchpad runs containerized workloads and does not need that.
                - paragraph [ref=e127]:
                  - text: For the exact field values you enter in the bond form, refer to
                  - link "Bond Configuration Reference" [ref=e128] [cursor=pointer]:
                    - /url: /paletteai-inference-launchpad/reference/bond-configuration/
                  - text: .
                - heading "GPU memory sizes the modelDirect link to GPU memory sizes the model" [level=2] [ref=e129]:
                  - text: GPU memory sizes the model
                  - link "Direct link to GPU memory sizes the model" [ref=e130] [cursor=pointer]:
                    - /url: "#gpu-memory-sizes-the-model"
                    - text: "#"
                - paragraph [ref=e131]:
                  - text: A model fails to load if the GPUs do not have enough combined memory to hold it. The largest model that fits is approximately 85 percent of the combined GPU memory, leaving headroom for the KV cache and runtime overhead. For example, four H100 80 GB GPUs provide 320 GB, which holds a model up to roughly 272 GB. A larger model produces a
                  - link "vLLM" [ref=e132] [cursor=pointer]:
                    - /url: /paletteai-inference-launchpad/reference/glossary/#vllm
                  - text: error such as
                  - code [ref=e133]: No available memory for the cache blocks
                  - text: .
                - paragraph [ref=e134]:
                  - text: Confirm the target model fits the GPUs before you install. For model-to-hardware mapping, refer to
                  - link "Certified Models by Hardware" [ref=e135] [cursor=pointer]:
                    - /url: /paletteai-inference-launchpad/reference/certified-models-by-hardware/
                  - text: .
              - generic [ref=e136]:
                - generic [ref=e138]:
                  - text: "Tags:"
                  - list [ref=e139]:
                    - listitem [ref=e140]:
                      - link "paletteai-inference-launchpad" [ref=e141] [cursor=pointer]:
                        - /url: /paletteai-inference-launchpad/tags/paletteai-inference-launchpad/
                    - listitem [ref=e142]:
                      - link "explanation" [ref=e143] [cursor=pointer]:
                        - /url: /paletteai-inference-launchpad/tags/explanation/
                    - listitem [ref=e144]:
                      - link "install" [ref=e145] [cursor=pointer]:
                        - /url: /paletteai-inference-launchpad/tags/install/
                - link "Edit this page" [ref=e148] [cursor=pointer]:
                  - /url: https://github.com/spectrocloud/librarium/blob/master/docs/products/paletteai-inference-launchpad/explanation/installation-architecture.md
                  - img [ref=e149]
                  - text: Edit this page
            - navigation "Docs pages" [ref=e153]:
              - link "Previous « Inference Engines" [ref=e154] [cursor=pointer]:
                - /url: /paletteai-inference-launchpad/explanation/inference-engines/
                - generic [ref=e155]: Previous
                - generic [ref=e156]: « Inference Engines
              - link "Next Reference »" [ref=e157] [cursor=pointer]:
                - /url: /paletteai-inference-launchpad/reference/
                - generic [ref=e158]: Next
                - generic [ref=e159]: Reference »
          - list [ref=e162]:
            - listitem [ref=e163]:
              - link "Two stages, driven from the jumpbox" [ref=e164] [cursor=pointer]:
                - /url: "#two-stages-driven-from-the-jumpbox"
              - list [ref=e165]:
                - listitem [ref=e166]:
                  - 'link "Stage 1: Operating System and Initial Configuration" [ref=e167] [cursor=pointer]':
                    - /url: "#stage-1-operating-system-and-initial-configuration"
                - listitem [ref=e168]:
                  - 'link "Stage 2: Network, Content, and Cluster Deployment" [ref=e169] [cursor=pointer]':
                    - /url: "#stage-2-network-content-and-cluster-deployment"
            - listitem [ref=e170]:
              - link "Bond, not bridge" [ref=e171] [cursor=pointer]:
                - /url: "#bond-not-bridge"
            - listitem [ref=e172]:
              - link "GPU memory sizes the model" [ref=e173] [cursor=pointer]:
                - /url: "#gpu-memory-sizes-the-model"
  - button "Project Logo Ask AI" [ref=e174] [cursor=pointer]:
    - generic [ref=e177]:
      - img "Project Logo" [ref=e178]
      - paragraph [ref=e179]: Ask AI
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