# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: screenshot.docs.spec.ts >> Docs screenshots >> pathname /paletteai-inference-launchpad/how-to-guides/replace-a-model/
- Location: visuals/screenshot.docs.spec.ts:38:7

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

  152 pixels (ratio 0.01 of all image pixels) are different.

Call log:
  - Expect "toHaveScreenshot" with timeout 10000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 152 pixels (ratio 0.01 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 152 pixels (ratio 0.01 of all image pixels) are different.
  - waiting 250ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 152 pixels (ratio 0.01 of all image pixels) are different.
  - waiting 500ms before taking screenshot
  2 × taking page screenshot
      - disabled all CSS animations
    - waiting for fonts to load...
    - fonts loaded
    - 152 pixels (ratio 0.01 of all image pixels) are different.
    - waiting 1000ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - 152 pixels (ratio 0.01 of all image pixels) are different.

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
          - button "Products" [ref=e11] [cursor=pointer]
          - link "Tutorials" [ref=e12] [cursor=pointer]:
            - /url: /tutorials/
          - link "Downloads" [ref=e13] [cursor=pointer]:
            - /url: /downloads/
          - link "API" [ref=e14] [cursor=pointer]:
            - /url: /api/introduction/
          - button "latest" [ref=e16] [cursor=pointer]
        - generic [ref=e17]:
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
                - generic [ref=e46]:
                  - link "Tutorials" [ref=e47] [cursor=pointer]:
                    - /url: /paletteai-inference-launchpad/tutorials/
                  - button "Toggle the collapsible sidebar category 'Tutorials'" [ref=e48] [cursor=pointer]
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
                    - link "Manage Cluster Infrastructure" [ref=e57] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/manage-cluster-infrastructure/
                  - listitem [ref=e58]:
                    - link "Upgrade the Platform" [ref=e59] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/upgrade-the-platform/
                  - listitem [ref=e60]:
                    - link "Upload a Model" [ref=e61] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/upload-a-model/
                  - listitem [ref=e62]:
                    - link "Deploy a Model" [ref=e63] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/deploy-a-model/
                  - listitem [ref=e64]:
                    - link "Share a GPU Between Models" [ref=e65] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/share-a-gpu-between-models/
                  - listitem [ref=e66]:
                    - link "Replace a Model" [ref=e67] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/replace-a-model/
                  - listitem [ref=e68]:
                    - link "Bring Your Own Model" [ref=e69] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/bring-your-own-model/
                  - listitem [ref=e70]:
                    - link "Configure Semantic Routing" [ref=e71] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/configure-semantic-routing/
                  - listitem [ref=e72]:
                    - link "Enable Vision Preprocessing" [ref=e73] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/enable-vision-preprocessing/
                  - listitem [ref=e74]:
                    - link "Set the Thinking Directive for a Tier" [ref=e75] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/set-tier-thinking/
                  - listitem [ref=e76]:
                    - link "Create a Workspace" [ref=e77] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/create-a-workspace/
                  - listitem [ref=e78]:
                    - link "Manage Workspace Members" [ref=e79] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/manage-workspace-members/
                  - listitem [ref=e80]:
                    - link "Manage Users" [ref=e81] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/manage-users/
                  - listitem [ref=e82]:
                    - link "Manage Groups" [ref=e83] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/manage-groups/
                  - listitem [ref=e84]:
                    - link "Create a Client" [ref=e85] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/create-a-client/
                  - listitem [ref=e86]:
                    - link "Generate an API Token" [ref=e87] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/generate-an-api-token/
                  - listitem [ref=e88]:
                    - link "Set and Manage Client Quotas" [ref=e89] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/manage-client-quotas/
                  - listitem [ref=e90]:
                    - link "Manage a Client's Model Access" [ref=e91] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/manage-client-model-access/
                  - listitem [ref=e92]:
                    - link "Register an External Inference Endpoint" [ref=e93] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/register-an-external-inference-endpoint/
                  - listitem [ref=e94]:
                    - link "View Token Usage" [ref=e95] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/view-token-usage/
                  - listitem [ref=e96]:
                    - link "View Client Usage" [ref=e97] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/view-client-usage/
                  - listitem [ref=e98]:
                    - link "Revoke or Delete a Client" [ref=e99] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/revoke-or-delete-a-client/
                  - listitem [ref=e100]:
                    - link "Use Claude Code" [ref=e101] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/use-claude-code/
                  - listitem [ref=e102]:
                    - link "Use Cursor" [ref=e103] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/use-cursor/
                  - listitem [ref=e104]:
                    - link "Use OpenAI Codex" [ref=e105] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/use-codex/
                  - listitem [ref=e106]:
                    - link "Use OpenCode" [ref=e107] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/use-opencode/
              - listitem [ref=e108]:
                - generic [ref=e109]:
                  - link "Explanation" [ref=e110] [cursor=pointer]:
                    - /url: /paletteai-inference-launchpad/explanation/
                  - button "Toggle the collapsible sidebar category 'Explanation'" [ref=e111] [cursor=pointer]
              - listitem [ref=e112]:
                - generic [ref=e113]:
                  - link "Reference" [ref=e114] [cursor=pointer]:
                    - /url: /paletteai-inference-launchpad/reference/
                  - button "Toggle the collapsible sidebar category 'Reference'" [ref=e115] [cursor=pointer]
              - listitem [ref=e116]:
                - link "Release Notes" [ref=e117] [cursor=pointer]:
                  - /url: /paletteai-inference-launchpad/release-notes/
              - listitem [ref=e118]:
                - button "Privacy Settings" [ref=e119] [cursor=pointer]
      - main [ref=e120]:
        - generic [ref=e122]:
          - generic [ref=e124]:
            - article [ref=e125]:
              - navigation "Breadcrumbs" [ref=e126]:
                - list [ref=e127]:
                  - listitem [ref=e128]:
                    - link "Home page" [ref=e129] [cursor=pointer]:
                      - /url: /
                      - img [ref=e130]
                  - listitem [ref=e132]:
                    - link "How-to Guides" [ref=e133] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/
                  - listitem [ref=e134]:
                    - generic [ref=e135]: Replace a Model
              - generic [ref=e136]:
                - heading "Replace a Model" [level=1] [ref=e138]
                - paragraph [ref=e139]:
                  - text: The appliance does not support in-place replacement. To change the model or version a node serves, remove the current model and then deploy the replacement from
                  - strong [ref=e140]: Deploy Model
                  - text: .
                - heading "PrerequisitesDirect link to Prerequisites" [level=2] [ref=e141]:
                  - text: Prerequisites
                  - link "Direct link to Prerequisites" [ref=e142] [cursor=pointer]:
                    - /url: "#prerequisites"
                    - text: "#"
                - list [ref=e143]:
                  - listitem [ref=e144]: Operator access to a running PaletteAI Inference Launchpad appliance.
                  - listitem [ref=e145]:
                    - text: The replacement model in the appliance catalog. If it is not there yet, refer to
                    - link "Upload a Model" [ref=e146] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/upload-a-model/
                    - text: .
                  - listitem [ref=e147]:
                    - text: Enough free GPU capacity on the target node after you remove the current model. Refer to
                    - link "Certified Models by Hardware" [ref=e148] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/reference/certified-models-by-hardware/
                    - text: .
                - heading "ConsiderationsDirect link to Considerations" [level=2] [ref=e149]:
                  - text: Considerations
                  - link "Direct link to Considerations" [ref=e150] [cursor=pointer]:
                    - /url: "#considerations"
                    - text: "#"
                - list [ref=e151]:
                  - listitem [ref=e152]:
                    - strong [ref=e153]: Other nodes.
                    - text: A per-node remove affects only the target node. Refer to
                    - link "Model Provisioning Lifecycle" [ref=e154] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/explanation/architecture/#model-provisioning-lifecycle
                    - text: .
                  - listitem [ref=e155]:
                    - strong [ref=e156]: Routing and quotas.
                    - text: If the replacement uses a different name than the current model, update any client tier maps that pointed at the old name. Refer to
                    - link "Request Routing" [ref=e157] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/explanation/architecture/#request-routing
                    - text: .
                  - listitem [ref=e158]:
                    - strong [ref=e159]: Last node.
                    - text: Deploy the replacement after removing the model from its last node, or the model is no longer deployed anywhere. Refer to
                    - link "Model Provisioning Lifecycle" [ref=e160] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/explanation/architecture/#model-provisioning-lifecycle
                    - text: .
                - heading "Replace the Model on One NodeDirect link to Replace the Model on One Node" [level=2] [ref=e161]:
                  - text: Replace the Model on One Node
                  - link "Direct link to Replace the Model on One Node" [ref=e162] [cursor=pointer]:
                    - /url: "#replace-the-model-on-one-node"
                    - text: "#"
                - list [ref=e163]:
                  - listitem [ref=e164]:
                    - text: From the left main menu, select
                    - strong [ref=e165]: Cluster
                    - text: ", and then select the"
                    - strong [ref=e166]: Models
                    - text: tab.
                  - listitem [ref=e167]: Expand the model you want to replace.
                  - listitem [ref=e168]:
                    - text: On the node that should run the replacement, open the three-dot menu and select
                    - strong [ref=e169]: Remove
                    - text: .
                  - listitem [ref=e170]:
                    - text: Review the preview, then select
                    - strong [ref=e171]: Confirm & apply
                    - text: .
                  - listitem [ref=e172]:
                    - text: Wait until the model clears from the node. The row shows
                    - code [ref=e173]: deleting
                    - text: while the engine stops.
                  - listitem [ref=e174]:
                    - text: Deploy the replacement onto that node only. Refer to
                    - link "Deploy the Replacement" [ref=e175] [cursor=pointer]:
                      - /url: "#deploy-the-replacement"
                    - text: .
                - heading "Replace the Model on Every NodeDirect link to Replace the Model on Every Node" [level=2] [ref=e176]:
                  - text: Replace the Model on Every Node
                  - link "Direct link to Replace the Model on Every Node" [ref=e177] [cursor=pointer]:
                    - /url: "#replace-the-model-on-every-node"
                    - text: "#"
                - list [ref=e178]:
                  - listitem [ref=e179]:
                    - text: From the left main menu, select
                    - strong [ref=e180]: Cluster
                    - text: ", and then select the"
                    - strong [ref=e181]: Models
                    - text: tab.
                  - listitem [ref=e182]:
                    - text: On the model row, select the trash icon. The
                    - strong [ref=e183]: Remove model from cluster
                    - text: dialog opens.
                  - listitem [ref=e184]: If the model is the cluster default, type the model name to confirm.
                  - listitem [ref=e185]:
                    - text: Select
                    - strong [ref=e186]: Remove
                    - text: .
                  - listitem [ref=e187]: Wait until the model clears from every node.
                  - listitem [ref=e188]:
                    - text: Deploy the replacement onto every node that should serve it. Refer to
                    - link "Deploy the Replacement" [ref=e189] [cursor=pointer]:
                      - /url: "#deploy-the-replacement"
                    - text: .
                - heading "Deploy the ReplacementDirect link to Deploy the Replacement" [level=2] [ref=e190]:
                  - text: Deploy the Replacement
                  - link "Direct link to Deploy the Replacement" [ref=e191] [cursor=pointer]:
                    - /url: "#deploy-the-replacement"
                    - text: "#"
                - list [ref=e192]:
                  - listitem [ref=e193]:
                    - text: Select
                    - strong [ref=e194]: Deploy Model
                    - text: . The
                    - strong [ref=e195]: Deploy a model
                    - text: wizard opens on the
                    - strong [ref=e196]: Model and placement
                    - text: step.
                  - listitem [ref=e197]:
                    - text: In
                    - strong [ref=e198]: Model
                    - text: ", select the newer version or the different model."
                  - listitem [ref=e199]:
                    - text: In
                    - strong [ref=e200]: Nodes
                    - text: ", select the node or nodes you just freed."
                  - listitem [ref=e201]:
                    - text: Select
                    - strong [ref=e202]: Next
                    - text: twice. The
                    - strong [ref=e203]: GPU sharing
                    - text: step opens.
                  - listitem [ref=e204]:
                    - text: To give the replacement whole GPUs, turn off the
                    - strong [ref=e205]: GPU sharing
                    - text: toggle. To share a GPU instead, follow
                    - link "Share a GPU Between Models" [ref=e206] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/share-a-gpu-between-models/
                    - text: .
                  - listitem [ref=e207]:
                    - text: Select
                    - strong [ref=e208]: Deploy
                    - text: .
                  - listitem [ref=e209]:
                    - text: Wait until the replacement is running on each node you selected. Refer to
                    - link "Verify the Model Is Serving" [ref=e210] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/deploy-a-model/#verify-the-model-is-serving
                    - text: .
                - paragraph [ref=e211]:
                  - text: If a node is not selectable, it is missing the model's weights or has too few free GPUs. If
                  - strong [ref=e212]: Deploy
                  - text: is unavailable, finish removing the previous model or free capacity, then try again. Refer to
                  - link "Resolve a Blocked Deployment" [ref=e213] [cursor=pointer]:
                    - /url: /paletteai-inference-launchpad/how-to-guides/deploy-a-model/#resolve-a-blocked-deployment
                  - text: .
                - heading "Stop a Deploy That Is Still in ProgressDirect link to Stop a Deploy That Is Still in Progress" [level=3] [ref=e214]:
                  - text: Stop a Deploy That Is Still in Progress
                  - link "Direct link to Stop a Deploy That Is Still in Progress" [ref=e215] [cursor=pointer]:
                    - /url: "#stop-a-deploy-that-is-still-in-progress"
                    - text: "#"
                - list [ref=e216]:
                  - listitem [ref=e217]: Expand the model row.
                  - listitem [ref=e218]:
                    - text: On the node that is still deploying, select
                    - strong [ref=e219]: Abort
                    - text: . In the confirmation, select
                    - strong [ref=e220]: Abort
                    - text: again.
                - paragraph [ref=e221]:
                  - text: That node returns to a deployable state. Redeploy from
                  - strong [ref=e222]: Deploy Model
                  - text: .
                - heading "Verify the ReplacementDirect link to Verify the Replacement" [level=2] [ref=e223]:
                  - text: Verify the Replacement
                  - link "Direct link to Verify the Replacement" [ref=e224] [cursor=pointer]:
                    - /url: "#verify-the-replacement"
                    - text: "#"
                - list [ref=e225]:
                  - listitem [ref=e226]:
                    - text: From the left main menu, select
                    - strong [ref=e227]: Cluster
                    - text: ", and then select the"
                    - strong [ref=e228]: Models
                    - text: tab.
                  - listitem [ref=e229]: Confirm the replacement is listed as serving on every node you deployed to.
                  - listitem [ref=e230]: Send a request that names the replacement, and confirm you receive a successful response.
                  - listitem [ref=e231]:
                    - text: Open
                    - link "View Client Usage" [ref=e232] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/view-client-usage/
                    - text: and confirm the replacement records new requests.
                - paragraph [ref=e233]:
                  - text: Client routing and quotas survive a remove-then-deploy. Refer to
                  - link "Request Routing" [ref=e234] [cursor=pointer]:
                    - /url: /paletteai-inference-launchpad/explanation/architecture/#request-routing
                  - text: .
                - heading "Next StepsDirect link to Next Steps" [level=2] [ref=e235]:
                  - text: Next Steps
                  - link "Direct link to Next Steps" [ref=e236] [cursor=pointer]:
                    - /url: "#next-steps"
                    - text: "#"
                - list [ref=e237]:
                  - listitem [ref=e238]:
                    - link "Deploy a Model" [ref=e239] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/deploy-a-model/
                  - listitem [ref=e240]:
                    - link "Manage a Client's Model Access" [ref=e241] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/manage-client-model-access/
                  - listitem [ref=e242]:
                    - link "View Client Usage" [ref=e243] [cursor=pointer]:
                      - /url: /paletteai-inference-launchpad/how-to-guides/view-client-usage/
              - generic [ref=e244]:
                - generic [ref=e246]:
                  - text: "Tags:"
                  - list [ref=e247]:
                    - listitem [ref=e248]:
                      - link "paletteai-inference-launchpad" [ref=e249] [cursor=pointer]:
                        - /url: /paletteai-inference-launchpad/tags/paletteai-inference-launchpad/
                    - listitem [ref=e250]:
                      - link "models" [ref=e251] [cursor=pointer]:
                        - /url: /paletteai-inference-launchpad/tags/models/
                    - listitem [ref=e252]:
                      - link "how-to" [ref=e253] [cursor=pointer]:
                        - /url: /paletteai-inference-launchpad/tags/how-to/
                - link "Edit this page" [ref=e256] [cursor=pointer]:
                  - /url: https://github.com/spectrocloud/librarium/blob/master/docs/products/paletteai-inference-launchpad/how-to-guides/replace-a-model.md
                  - img [ref=e257]
                  - text: Edit this page
            - navigation "Docs pages" [ref=e261]:
              - link "Previous « Share a GPU Between Models" [ref=e262] [cursor=pointer]:
                - /url: /paletteai-inference-launchpad/how-to-guides/share-a-gpu-between-models/
                - generic [ref=e263]: Previous
                - generic [ref=e264]: « Share a GPU Between Models
              - link "Next Bring Your Own Model »" [ref=e265] [cursor=pointer]:
                - /url: /paletteai-inference-launchpad/how-to-guides/bring-your-own-model/
                - generic [ref=e266]: Next
                - generic [ref=e267]: Bring Your Own Model »
          - list [ref=e270]:
            - listitem [ref=e271]:
              - link "Prerequisites" [ref=e272] [cursor=pointer]:
                - /url: "#prerequisites"
            - listitem [ref=e273]:
              - link "Considerations" [ref=e274] [cursor=pointer]:
                - /url: "#considerations"
            - listitem [ref=e275]:
              - link "Replace the Model on One Node" [ref=e276] [cursor=pointer]:
                - /url: "#replace-the-model-on-one-node"
            - listitem [ref=e277]:
              - link "Replace the Model on Every Node" [ref=e278] [cursor=pointer]:
                - /url: "#replace-the-model-on-every-node"
            - listitem [ref=e279]:
              - link "Deploy the Replacement" [ref=e280] [cursor=pointer]:
                - /url: "#deploy-the-replacement"
              - list [ref=e281]:
                - listitem [ref=e282]:
                  - link "Stop a Deploy That Is Still in Progress" [ref=e283] [cursor=pointer]:
                    - /url: "#stop-a-deploy-that-is-still-in-progress"
            - listitem [ref=e284]:
              - link "Verify the Replacement" [ref=e285] [cursor=pointer]:
                - /url: "#verify-the-replacement"
            - listitem [ref=e286]:
              - link "Next Steps" [ref=e287] [cursor=pointer]:
                - /url: "#next-steps"
  - button "Project Logo Ask AI" [ref=e288] [cursor=pointer]:
    - generic [ref=e291]:
      - img "Project Logo" [ref=e292]
      - paragraph [ref=e293]: Ask AI
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