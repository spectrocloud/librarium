# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: screenshot.docs.spec.ts >> Docs screenshots >> pathname /registries-and-packs/registries/oci-registry/add-oci-helm/
- Location: visuals/screenshot.docs.spec.ts:38:7

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

  130 pixels (ratio 0.01 of all image pixels) are different.

Call log:
  - Expect "toHaveScreenshot" with timeout 10000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 130 pixels (ratio 0.01 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - 130 pixels (ratio 0.01 of all image pixels) are different.

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
                - generic [ref=e44]:
                  - link "Release Notes" [ref=e45] [cursor=pointer]:
                    - /url: /release-notes/
                    - img [ref=e47]
                    - text: Release Notes
                  - button "Toggle the collapsible sidebar category 'Release Notes'" [ref=e49] [cursor=pointer]
              - listitem [ref=e50]:
                - generic [ref=e51]:
                  - link "Security Bulletins" [ref=e52] [cursor=pointer]:
                    - /url: /security-bulletins/
                    - img [ref=e54]
                    - text: Security Bulletins
                  - button "Toggle the collapsible sidebar category 'Security Bulletins'" [ref=e56] [cursor=pointer]
              - listitem [ref=e57]:
                - generic [ref=e58]:
                  - link "What is Palette?" [ref=e59] [cursor=pointer]:
                    - /url: /palette/
                    - img [ref=e61]
                    - text: What is Palette?
                  - button "Toggle the collapsible sidebar category 'What is Palette?'" [ref=e63] [cursor=pointer]
              - listitem [ref=e64]:
                - link "Getting Started" [ref=e65] [cursor=pointer]:
                  - /url: /getting-started/
                  - img [ref=e67]
                  - text: Getting Started
              - listitem [ref=e69]:
                - generic [ref=e70]:
                  - link "Architecture" [ref=e71] [cursor=pointer]:
                    - /url: /architecture/
                    - img [ref=e73]
                    - text: Architecture
                  - button "Toggle the collapsible sidebar category 'Architecture'" [ref=e75] [cursor=pointer]
              - listitem [ref=e76]:
                - generic [ref=e77]:
                  - link "Profiles" [ref=e78] [cursor=pointer]:
                    - /url: /profiles/
                    - img [ref=e80]
                    - text: Profiles
                  - button "Toggle the collapsible sidebar category 'Profiles'" [ref=e84] [cursor=pointer]
              - listitem [ref=e85]:
                - generic [ref=e86]:
                  - link "Cluster Templates" [ref=e87] [cursor=pointer]:
                    - /url: /cluster-templates/
                    - img [ref=e89]
                    - text: Cluster Templates
                  - button "Toggle the collapsible sidebar category 'Cluster Templates'" [ref=e91] [cursor=pointer]
              - listitem [ref=e92]:
                - generic [ref=e93]:
                  - link "Deployment Modes" [ref=e94] [cursor=pointer]:
                    - /url: /deployment-modes/
                    - img [ref=e96]
                    - text: Deployment Modes
                  - button "Toggle the collapsible sidebar category 'Deployment Modes'" [ref=e98] [cursor=pointer]
              - listitem [ref=e99]:
                - generic [ref=e100]:
                  - link "Clusters" [ref=e101] [cursor=pointer]:
                    - /url: /clusters/
                    - img [ref=e103]
                    - text: Clusters
                  - button "Toggle the collapsible sidebar category 'Clusters'" [ref=e109] [cursor=pointer]
              - listitem [ref=e110]:
                - generic [ref=e111]:
                  - link "Bring Your Own OS (BYOOS)" [ref=e112] [cursor=pointer]:
                    - /url: /byoos/
                    - img [ref=e114]
                    - text: Bring Your Own OS (BYOOS)
                  - button "Toggle the collapsible sidebar category 'Bring Your Own OS (BYOOS)'" [ref=e116] [cursor=pointer]
              - listitem [ref=e117]:
                - generic [ref=e118]:
                  - link "Palette Dev Engine" [ref=e119] [cursor=pointer]:
                    - /url: /devx/
                    - img [ref=e121]
                    - text: Palette Dev Engine
                  - button "Toggle the collapsible sidebar category 'Palette Dev Engine'" [ref=e123] [cursor=pointer]
              - listitem [ref=e124]:
                - generic [ref=e125]:
                  - link "AI Workloads" [ref=e126] [cursor=pointer]:
                    - /url: /ai-workloads/
                    - img [ref=e128]
                    - text: AI Workloads
                  - button "Toggle the collapsible sidebar category 'AI Workloads'" [ref=e130] [cursor=pointer]
              - listitem [ref=e131]:
                - generic [ref=e132]:
                  - link "Virtual Machine Orchestrator" [ref=e133] [cursor=pointer]:
                    - /url: /vm-management/
                    - img [ref=e135]
                    - text: Virtual Machine Orchestrator
                  - button "Toggle the collapsible sidebar category 'Virtual Machine Orchestrator'" [ref=e137] [cursor=pointer]
              - listitem [ref=e138]:
                - generic [ref=e139]:
                  - link "Workspaces" [ref=e140] [cursor=pointer]:
                    - /url: /workspace/
                    - img [ref=e142]
                    - text: Workspaces
                  - button "Toggle the collapsible sidebar category 'Workspaces'" [ref=e144] [cursor=pointer]
              - listitem [ref=e145]:
                - generic [ref=e146]:
                  - link "Packs List" [ref=e147] [cursor=pointer]:
                    - /url: /integrations/
                    - img [ref=e149]
                    - text: Packs List
                  - button "Toggle the collapsible sidebar category 'Packs List'" [ref=e151] [cursor=pointer]
              - listitem [ref=e152]:
                - generic [ref=e153]:
                  - link "User & Role Management" [ref=e154] [cursor=pointer]:
                    - /url: /user-management/
                    - img [ref=e156]
                    - text: User & Role Management
                  - button "Toggle the collapsible sidebar category 'User & Role Management'" [ref=e158] [cursor=pointer]
              - listitem [ref=e159]:
                - generic [ref=e160]:
                  - link "Registries and Packs" [expanded] [ref=e161] [cursor=pointer]:
                    - /url: /registries-and-packs/
                    - img [ref=e163]
                    - text: Registries and Packs
                  - button "Toggle the collapsible sidebar category 'Registries and Packs'" [ref=e165] [cursor=pointer]
                - list [ref=e166]:
                  - listitem [ref=e167]:
                    - link "Add a Custom Registry" [ref=e168] [cursor=pointer]:
                      - /url: /registries-and-packs/adding-a-custom-registry/
                  - listitem [ref=e169]:
                    - link "Spectro Cloud CLI Tool" [ref=e170] [cursor=pointer]:
                      - /url: /registries-and-packs/spectro-cli-reference/
                  - listitem [ref=e171]:
                    - link "Add a Custom Pack" [ref=e172] [cursor=pointer]:
                      - /url: /registries-and-packs/add-custom-packs/
                  - listitem [ref=e173]:
                    - link "Add an Add-on Pack" [ref=e174] [cursor=pointer]:
                      - /url: /registries-and-packs/adding-add-on-packs/
                  - listitem [ref=e175]:
                    - link "Pack Constraints" [ref=e176] [cursor=pointer]:
                      - /url: /registries-and-packs/pack-constraints/
                  - listitem [ref=e177]:
                    - generic [ref=e178]:
                      - link "Registries" [expanded] [ref=e179] [cursor=pointer]:
                        - /url: /registries-and-packs/registries/
                      - button "Toggle the collapsible sidebar category 'Registries'" [ref=e180] [cursor=pointer]
                    - list [ref=e181]:
                      - listitem [ref=e182]:
                        - link "Helm Registries" [ref=e183] [cursor=pointer]:
                          - /url: /registries-and-packs/registries/helm-charts/
                      - listitem [ref=e184]:
                        - generic [ref=e185]:
                          - link "OCI Registries" [expanded] [ref=e186] [cursor=pointer]:
                            - /url: /registries-and-packs/registries/oci-registry/
                          - button "Toggle the collapsible sidebar category 'OCI Registries'" [ref=e187] [cursor=pointer]
                        - list [ref=e188]:
                          - listitem [ref=e189]:
                            - link "Add OCI Helm Registry" [ref=e190] [cursor=pointer]:
                              - /url: /registries-and-packs/registries/oci-registry/add-oci-helm/
                          - listitem [ref=e191]:
                            - link "Add OCI Packs Registry" [ref=e192] [cursor=pointer]:
                              - /url: /registries-and-packs/registries/oci-registry/add-oci-packs/
                          - listitem [ref=e193]:
                            - link "Add OCI Zarf Registry" [ref=e194] [cursor=pointer]:
                              - /url: /registries-and-packs/registries/oci-registry/add-oci-zarf/
                          - listitem [ref=e195]:
                            - generic [ref=e196]:
                              - link "Add a Pack to an OCI Registry" [ref=e197] [cursor=pointer]:
                                - /url: /registries-and-packs/registries/oci-registry/add-pack-oci/
                              - button "Toggle the collapsible sidebar category 'Add a Pack to an OCI Registry'" [ref=e198] [cursor=pointer]
                      - listitem [ref=e199]:
                        - link "Legacy Pack Registries" [ref=e200] [cursor=pointer]:
                          - /url: /registries-and-packs/registries/pack-registries/
                  - listitem [ref=e201]:
                    - link "Advanced CLI Configuration" [ref=e202] [cursor=pointer]:
                      - /url: /registries-and-packs/advanced-configuration/
              - listitem [ref=e203]:
                - generic [ref=e204]:
                  - link "Security" [ref=e205] [cursor=pointer]:
                    - /url: /security/
                    - img [ref=e207]
                    - text: Security
                  - button "Toggle the collapsible sidebar category 'Security'" [ref=e209] [cursor=pointer]
              - listitem [ref=e210]:
                - generic [ref=e211]:
                  - link "Audit Logs" [ref=e212] [cursor=pointer]:
                    - /url: /audit-logs/
                    - img [ref=e214]
                    - text: Audit Logs
                  - button "Toggle the collapsible sidebar category 'Audit Logs'" [ref=e216] [cursor=pointer]
              - listitem [ref=e217]:
                - generic [ref=e218]:
                  - link "Self-Hosted Palette" [ref=e219] [cursor=pointer]:
                    - /url: /enterprise-version/
                    - img [ref=e221]
                    - text: Self-Hosted Palette
                  - button "Toggle the collapsible sidebar category 'Self-Hosted Palette'" [ref=e223] [cursor=pointer]
              - listitem [ref=e224]:
                - generic [ref=e225]:
                  - link "Palette VerteX" [ref=e226] [cursor=pointer]:
                    - /url: /vertex/
                    - img [ref=e228]
                    - text: Palette VerteX
                  - button "Toggle the collapsible sidebar category 'Palette VerteX'" [ref=e230] [cursor=pointer]
              - listitem [ref=e231]:
                - generic [ref=e232]:
                  - link "Tenant Administration" [ref=e233] [cursor=pointer]:
                    - /url: /tenant-settings/
                    - img [ref=e235]
                    - text: Tenant Administration
                  - button "Toggle the collapsible sidebar category 'Tenant Administration'" [ref=e237] [cursor=pointer]
              - listitem [ref=e238]:
                - generic [ref=e239]:
                  - link "Automation" [ref=e240] [cursor=pointer]:
                    - /url: /automation/
                    - img [ref=e242]
                    - text: Automation
                  - button "Toggle the collapsible sidebar category 'Automation'" [ref=e244] [cursor=pointer]
              - listitem [ref=e245]:
                - generic [ref=e246]:
                  - link "Troubleshooting" [ref=e247] [cursor=pointer]:
                    - /url: /troubleshooting/
                    - img [ref=e249]
                    - text: Troubleshooting
                  - button "Toggle the collapsible sidebar category 'Troubleshooting'" [ref=e251] [cursor=pointer]
              - listitem [ref=e252]:
                - link "Glossary" [ref=e253] [cursor=pointer]:
                  - /url: /glossary-all/
                  - img [ref=e255]
                  - text: Glossary
              - listitem [ref=e257]:
                - generic [ref=e258]:
                  - link "Compliance & Legal" [ref=e259] [cursor=pointer]:
                    - /url: /legal-licenses/
                    - img [ref=e261]
                    - text: Compliance & Legal
                  - button "Toggle the collapsible sidebar category 'Compliance & Legal'" [ref=e263] [cursor=pointer]
              - listitem [ref=e264]:
                - button "Privacy Settings" [ref=e265] [cursor=pointer]:
                  - img [ref=e266]
                  - text: Privacy Settings
      - main [ref=e268]:
        - generic [ref=e270]:
          - generic [ref=e272]:
            - article [ref=e273]:
              - navigation "Breadcrumbs" [ref=e274]:
                - list [ref=e275]:
                  - listitem [ref=e276]:
                    - link "Home page" [ref=e277] [cursor=pointer]:
                      - /url: /
                      - img [ref=e278]
                  - listitem [ref=e280]:
                    - link "Registries and Packs" [ref=e281] [cursor=pointer]:
                      - /url: /registries-and-packs/
                  - listitem [ref=e282]:
                    - link "Registries" [ref=e283] [cursor=pointer]:
                      - /url: /registries-and-packs/registries/
                  - listitem [ref=e284]:
                    - link "OCI Registries" [ref=e285] [cursor=pointer]:
                      - /url: /registries-and-packs/registries/oci-registry/
                  - listitem [ref=e286]:
                    - generic [ref=e287]: Add OCI Helm Registry
              - generic [ref=e288]:
                - heading "Add OCI Helm Registry" [level=1] [ref=e290]
                - paragraph [ref=e291]: You can add Open Container Initiative (OCI) registries containing Helm charts to Palette and use those Helm charts in your cluster profiles.
                - heading "LimitationsDirect link to Limitations" [level=2] [ref=e292]:
                  - text: Limitations
                  - link "Direct link to Limitations" [ref=e293] [cursor=pointer]:
                    - /url: "#limitations"
                    - text: "#"
                - list [ref=e294]:
                  - listitem [ref=e295]: Anonymous authentication is not supported for GitHub Container Registry (GHCR).
                - heading "PrerequisitesDirect link to Prerequisites" [level=2] [ref=e296]:
                  - text: Prerequisites
                  - link "Direct link to Prerequisites" [ref=e297] [cursor=pointer]:
                    - /url: "#prerequisites"
                    - text: "#"
                - paragraph [ref=e298]: Certain prerequisites apply to all OCI Helm registries, while others are specific to Amazon Elastic Container Registry (ECR) or GHCR.
                - generic [ref=e299]:
                  - tablist [ref=e300]:
                    - tab "Basic" [selected] [ref=e301] [cursor=pointer]
                    - tab "Amazon ECR" [ref=e302] [cursor=pointer]
                    - tab "GHCR" [ref=e303] [cursor=pointer]
                  - tabpanel [ref=e305]:
                    - list [ref=e306]:
                      - listitem [ref=e307]:
                        - paragraph [ref=e308]: Tenant admin access to Palette.
                      - listitem [ref=e309]:
                        - paragraph [ref=e310]: Credentials to access the OCI registry.
                      - listitem [ref=e311]:
                        - paragraph [ref=e312]: If your OCI registry uses a self-signed certificate, or a certificate that is not signed by a trusted certificate authority (CA), you will need the certificate to add the registry to Palette.
                    - list [ref=e313]:
                      - listitem [ref=e314]:
                        - text: If you are using Azure Container Registry (ACR), Azure recommends using a
                        - link "service principal" [ref=e315] [cursor=pointer]:
                          - /url: https://learn.microsoft.com/en-us/azure/container-registry/container-registry-auth-service-principal#when-to-use-a-service-principal
                        - text: for automated pull access. The service principal must have at least the
                        - code [ref=e316]: AcrPull
                        - text: role or the
                        - code [ref=e317]: Container Registry Repository Reader
                        - text: role, depending on the registry's role assignment permissions mode. Refer to the
                        - link "Azure Container Registry Entra permissions and role assignments overview" [ref=e318] [cursor=pointer]:
                          - /url: https://learn.microsoft.com/en-us/azure/container-registry/container-registry-rbac-built-in-roles-overview#recommended-built-in-roles-by-scenario
                        - text: for further details. Use the service principal's
                        - strong [ref=e319]: Application (client) ID
                        - text: as the registry
                        - strong [ref=e320]: Username
                        - text: and its client secret
                        - strong [ref=e321]: Value
                        - text: as the registry
                        - strong [ref=e322]: Password
                        - text: when configuring the registry in Palette.
                - heading "Add OCI Helm RegistryDirect link to Add OCI Helm Registry" [level=2] [ref=e323]:
                  - text: Add OCI Helm Registry
                  - link "Direct link to Add OCI Helm Registry" [ref=e324] [cursor=pointer]:
                    - /url: "#add-oci-helm-registry"
                    - text: "#"
                - paragraph [ref=e325]: Use the following steps to add an OCI Helm registry to Palette. Select the tab that corresponds to the type of OCI registry you are adding.
                - generic [ref=e326]:
                  - generic [ref=e327]:
                    - img [ref=e329]
                    - text: info
                  - paragraph [ref=e332]:
                    - text: When synchronization is enabled, the
                    - strong [ref=e333]: Base Content Path
                    - text: field is required. Palette syncs only the Helm charts stored directly in the directories you specify. Charts stored at the registry root, in the parent directory of the specified path, or in child directories nested below it are not synced. To sync Helm charts from multiple locations, add each directory as a separate base content path.
                - generic [ref=e334]:
                  - tablist [ref=e335]:
                    - tab "Basic" [selected] [ref=e336] [cursor=pointer]
                    - tab "Amazon ECR" [ref=e337] [cursor=pointer]
                    - tab "GHCR" [ref=e338] [cursor=pointer]
                  - tabpanel [ref=e340]:
                    - list [ref=e341]:
                      - listitem [ref=e342]:
                        - paragraph [ref=e343]:
                          - text: Log in to
                          - link "Palette" [ref=e344] [cursor=pointer]:
                            - /url: https://console.spectrocloud.com
                          - text: as a Tenant administrator.
                      - listitem [ref=e345]:
                        - paragraph [ref=e346]:
                          - text: From the left main menu, select
                          - strong [ref=e347]: Tenant Settings
                          - text: .
                      - listitem [ref=e348]:
                        - paragraph [ref=e349]:
                          - text: From the
                          - strong [ref=e350]: Tenant Settings Menu
                          - text: ", select"
                          - strong [ref=e351]: Registries
                          - text: .
                      - listitem [ref=e352]:
                        - paragraph [ref=e353]:
                          - text: On the
                          - strong [ref=e354]: OCI Registries
                          - text: tab, select
                          - strong [ref=e355]: Add New OCI Registry
                          - text: .
                      - listitem [ref=e356]:
                        - paragraph [ref=e357]:
                          - text: Enter the
                          - strong [ref=e358]: Name
                          - text: of the registry. For the
                          - strong [ref=e359]: Provider
                          - text: type, select
                          - strong [ref=e360]: Helm
                          - text: .
                      - listitem [ref=e361]:
                        - paragraph [ref=e362]:
                          - text: For
                          - strong [ref=e363]: OCI Authentication Type
                          - text: ", select"
                          - strong [ref=e364]: Basic
                          - text: .
                      - listitem [ref=e365]:
                        - paragraph [ref=e366]:
                          - text: Toggle the
                          - strong [ref=e367]: Synchronization
                          - text: option to enable or disable synchronization for the registry. For more information, refer to the
                          - link "Helm Registry - Synchronization Behavior" [ref=e368] [cursor=pointer]:
                            - /url: /registries-and-packs/registries/helm-charts/#synchronization-behavior
                          - text: section.
                      - listitem [ref=e369]:
                        - paragraph [ref=e370]:
                          - text: Provide the registry URL in the
                          - strong [ref=e371]: Endpoint
                          - text: field.
                      - listitem [ref=e372]:
                        - paragraph [ref=e373]:
                          - text: If
                          - strong [ref=e374]: Synchronization
                          - text: is enabled and your registry requires a suffix to be appended to the endpoint, specify it in the
                          - strong [ref=e375]: Endpoint Suffix
                          - text: field. This field is optional and applies to registries that do not use a standard Docker V2 API path. For example, JFrog Artifactory requires the API path and the repository key, such as
                          - code [ref=e376]: artifactory/api/docker/spectro-charts-repo
                          - text: .
                      - listitem [ref=e377]:
                        - paragraph [ref=e378]:
                          - text: If
                          - strong [ref=e379]: Synchronization
                          - text: is enabled, in the
                          - strong [ref=e380]: Base Content Path
                          - text: field, enter the base path to the repository in the registry where the Helm charts are stored. You can specify multiple base paths by pressing the
                          - strong [ref=e381]: ENTER
                          - text: key after each path. Providing multiple base paths is useful when Helm charts are stored in different directories or projects.
                      - listitem [ref=e382]:
                        - paragraph [ref=e383]:
                          - text: Fill out the
                          - strong [ref=e384]: Username
                          - text: and
                          - strong [ref=e385]: Password
                          - text: fields with the credentials to access the registry. If the registry does not require authentication, leave the
                          - strong [ref=e386]: Username
                          - text: and
                          - strong [ref=e387]: Password
                          - text: fields empty.
                        - generic [ref=e388]:
                          - generic [ref=e389]:
                            - img [ref=e391]
                            - text: tip
                          - paragraph [ref=e394]:
                            - text: If you are using ACR, use the service principal
                            - strong [ref=e395]: App ID
                            - text: as the
                            - strong [ref=e396]: Username
                            - text: and its
                            - strong [ref=e397]: client secret
                            - text: as the
                            - strong [ref=e398]: Password
                            - text: .
                      - listitem [ref=e399]:
                        - paragraph [ref=e400]:
                          - text: If your OCI registry server is using a self-signed certificate, select
                          - strong [ref=e401]: Upload file
                          - text: to upload the certificate. If the server certificate is not signed by a trusted CA, select
                          - strong [ref=e402]: Insecure Skip TLS Verify
                          - text: to skip verifying the x509 certificate.
                      - listitem [ref=e403]:
                        - paragraph [ref=e404]:
                          - text: Select
                          - strong [ref=e405]: Confirm
                          - text: to add the registry.
                - heading "ValidateDirect link to Validate" [level=2] [ref=e406]:
                  - text: Validate
                  - link "Direct link to Validate" [ref=e407] [cursor=pointer]:
                    - /url: "#validate"
                    - text: "#"
                - paragraph [ref=e408]: Use the following steps to validate that the OCI registry is added to Palette correctly.
                - list [ref=e409]:
                  - listitem [ref=e410]:
                    - paragraph [ref=e411]:
                      - text: Log in to the
                      - link "Palette" [ref=e412] [cursor=pointer]:
                        - /url: https://console.spectrocloud.com
                      - text: .
                  - listitem [ref=e413]:
                    - paragraph [ref=e414]:
                      - text: From the left main menu, select
                      - strong [ref=e415]: Profiles
                      - text: ">"
                      - strong [ref=e416]: Add Cluster Profile
                      - text: .
                  - listitem [ref=e417]:
                    - paragraph [ref=e418]:
                      - text: In the
                      - strong [ref=e419]: Add a new cluster profile
                      - text: wizard, enter a unique
                      - strong [ref=e420]: Name
                      - text: for the cluster profile. Choose a
                      - strong [ref=e421]: Type
                      - text: of
                      - strong [ref=e422]: Add-on
                      - text: and select
                      - strong [ref=e423]: Next
                      - text: .
                  - listitem [ref=e424]:
                    - paragraph [ref=e425]:
                      - text: On the
                      - strong [ref=e426]: Profile Layers
                      - text: wizard step, select
                      - strong [ref=e427]: Add Helm Chart
                      - text: ">"
                      - strong [ref=e428]: Public Packs
                      - text: .
                  - listitem [ref=e429]:
                    - paragraph [ref=e430]:
                      - text: Verify the Helm chart registry you added is displayed in the
                      - strong [ref=e431]: Registry
                      - text: drop-down.
                - heading "Next StepsDirect link to Next Steps" [level=2] [ref=e432]:
                  - text: Next Steps
                  - link "Direct link to Next Steps" [ref=e433] [cursor=pointer]:
                    - /url: "#next-steps"
                    - text: "#"
                - paragraph [ref=e434]:
                  - text: Once your registry is added, you can add Helm charts from these registries to
                  - link "full" [ref=e435] [cursor=pointer]:
                    - /url: /profiles/cluster-profiles/create-cluster-profiles/create-full-profile/
                  - text: or
                  - link "add-on cluster profiles" [ref=e436] [cursor=pointer]:
                    - /url: /profiles/cluster-profiles/create-cluster-profiles/create-addon-profile/
                  - text: . Refer to our
                  - link "Add a Helm Chart" [ref=e437] [cursor=pointer]:
                    - /url: /profiles/cluster-profiles/create-cluster-profiles/create-addon-profile/create-helm-addon/
                  - text: guide for more information.
              - link "Edit this page" [ref=e441] [cursor=pointer]:
                - /url: https://github.com/spectrocloud/librarium/blob/master/docs/docs-content/registries-and-packs/registries/oci-registry/add-oci-helm.md
                - img [ref=e442]
                - text: Edit this page
            - navigation "Docs pages" [ref=e446]:
              - link "Previous « OCI Registries" [ref=e447] [cursor=pointer]:
                - /url: /registries-and-packs/registries/oci-registry/
                - generic [ref=e448]: Previous
                - generic [ref=e449]: « OCI Registries
              - link "Next Add OCI Packs Registry »" [ref=e450] [cursor=pointer]:
                - /url: /registries-and-packs/registries/oci-registry/add-oci-packs/
                - generic [ref=e451]: Next
                - generic [ref=e452]: Add OCI Packs Registry »
          - list [ref=e455]:
            - listitem [ref=e456]:
              - link "Limitations" [ref=e457] [cursor=pointer]:
                - /url: "#limitations"
            - listitem [ref=e458]:
              - link "Prerequisites" [ref=e459] [cursor=pointer]:
                - /url: "#prerequisites"
            - listitem [ref=e460]:
              - link "Add OCI Helm Registry" [ref=e461] [cursor=pointer]:
                - /url: "#add-oci-helm-registry"
            - listitem [ref=e462]:
              - link "Validate" [ref=e463] [cursor=pointer]:
                - /url: "#validate"
            - listitem [ref=e464]:
              - link "Next Steps" [ref=e465] [cursor=pointer]:
                - /url: "#next-steps"
  - button "Project Logo Ask AI" [ref=e466] [cursor=pointer]:
    - generic [ref=e469]:
      - img "Project Logo" [ref=e470]
      - paragraph [ref=e471]: Ask AI
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