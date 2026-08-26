# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: screenshot.docs.spec.ts >> Docs screenshots >> pathname /clusters/public-cloud/azure/windows/
- Location: visuals/screenshot.docs.spec.ts:38:7

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

  349 pixels (ratio 0.01 of all image pixels) are different.

Call log:
  - Expect "toHaveScreenshot" with timeout 10000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 349 pixels (ratio 0.01 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - 349 pixels (ratio 0.01 of all image pixels) are different.

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
                - generic [ref=e46]:
                  - link "Release Notes" [ref=e47] [cursor=pointer]:
                    - /url: /release-notes/
                    - img [ref=e49]
                    - text: Release Notes
                  - button "Toggle the collapsible sidebar category 'Release Notes'" [ref=e51] [cursor=pointer]
              - listitem [ref=e52]:
                - generic [ref=e53]:
                  - link "Security Bulletins" [ref=e54] [cursor=pointer]:
                    - /url: /security-bulletins/
                    - img [ref=e56]
                    - text: Security Bulletins
                  - button "Toggle the collapsible sidebar category 'Security Bulletins'" [ref=e58] [cursor=pointer]
              - listitem [ref=e59]:
                - generic [ref=e60]:
                  - link "What is Palette?" [ref=e61] [cursor=pointer]:
                    - /url: /
                    - img [ref=e63]
                    - text: What is Palette?
                  - button "Toggle the collapsible sidebar category 'What is Palette?'" [ref=e65] [cursor=pointer]
              - listitem [ref=e66]:
                - link "Getting Started" [ref=e67] [cursor=pointer]:
                  - /url: /getting-started/
                  - img [ref=e69]
                  - text: Getting Started
              - listitem [ref=e71]:
                - generic [ref=e72]:
                  - link "Architecture" [ref=e73] [cursor=pointer]:
                    - /url: /architecture/
                    - img [ref=e75]
                    - text: Architecture
                  - button "Toggle the collapsible sidebar category 'Architecture'" [ref=e77] [cursor=pointer]
              - listitem [ref=e78]:
                - generic [ref=e79]:
                  - link "Profiles" [ref=e80] [cursor=pointer]:
                    - /url: /profiles/
                    - img [ref=e82]
                    - text: Profiles
                  - button "Toggle the collapsible sidebar category 'Profiles'" [ref=e86] [cursor=pointer]
              - listitem [ref=e87]:
                - generic [ref=e88]:
                  - link "Cluster Templates" [ref=e89] [cursor=pointer]:
                    - /url: /cluster-templates/
                    - img [ref=e91]
                    - text: Cluster Templates
                  - button "Toggle the collapsible sidebar category 'Cluster Templates'" [ref=e93] [cursor=pointer]
              - listitem [ref=e94]:
                - generic [ref=e95]:
                  - link "Deployment Modes" [ref=e96] [cursor=pointer]:
                    - /url: /deployment-modes/
                    - img [ref=e98]
                    - text: Deployment Modes
                  - button "Toggle the collapsible sidebar category 'Deployment Modes'" [ref=e100] [cursor=pointer]
              - listitem [ref=e101]:
                - generic [ref=e102]:
                  - link "Clusters" [expanded] [ref=e103] [cursor=pointer]:
                    - /url: /clusters/
                    - img [ref=e105]
                    - text: Clusters
                  - button "Toggle the collapsible sidebar category 'Clusters'" [ref=e111] [cursor=pointer]
                - list [ref=e112]:
                  - listitem [ref=e113]:
                    - generic [ref=e114]:
                      - link "Public Cloud Clusters" [expanded] [ref=e115] [cursor=pointer]:
                        - /url: /clusters/public-cloud/
                        - img [ref=e117]
                        - text: Public Cloud Clusters
                      - button "Toggle the collapsible sidebar category 'Public Cloud Clusters'" [ref=e119] [cursor=pointer]
                    - list [ref=e120]:
                      - listitem [ref=e121]:
                        - generic [ref=e122]:
                          - link "AWS" [ref=e123] [cursor=pointer]:
                            - /url: /clusters/public-cloud/aws/
                          - button "Toggle the collapsible sidebar category 'AWS'" [ref=e124] [cursor=pointer]
                      - listitem [ref=e125]:
                        - generic [ref=e126]:
                          - link "Azure" [expanded] [ref=e127] [cursor=pointer]:
                            - /url: /clusters/public-cloud/azure/
                          - button "Toggle the collapsible sidebar category 'Azure'" [ref=e128] [cursor=pointer]
                        - list [ref=e129]:
                          - listitem [ref=e130]:
                            - link "Architecture" [ref=e131] [cursor=pointer]:
                              - /url: /clusters/public-cloud/azure/architecture/
                          - listitem [ref=e132]:
                            - link "Register and Manage Azure Cloud Accounts" [ref=e133] [cursor=pointer]:
                              - /url: /clusters/public-cloud/azure/azure-cloud/
                          - listitem [ref=e134]:
                            - link "Enable IAM Features for AKS" [ref=e136] [cursor=pointer]:
                              - /url: "#"
                          - listitem [ref=e137]:
                            - link "Azure Disk Encryption" [ref=e138] [cursor=pointer]:
                              - /url: /clusters/public-cloud/azure/azure-disk-storage-sse/
                          - listitem [ref=e139]:
                            - link "Create and Manage Azure IaaS Cluster" [ref=e140] [cursor=pointer]:
                              - /url: /clusters/public-cloud/azure/create-azure-cluster/
                          - listitem [ref=e141]:
                            - link "Create and Manage Azure AKS Cluster" [ref=e142] [cursor=pointer]:
                              - /url: /clusters/public-cloud/azure/aks/
                          - listitem [ref=e143]:
                            - link "Deploy Windows Workloads" [ref=e144] [cursor=pointer]:
                              - /url: /clusters/public-cloud/azure/windows/
                          - listitem [ref=e145]:
                            - link "Required Permissions" [ref=e146] [cursor=pointer]:
                              - /url: /clusters/public-cloud/azure/required-permissions/
                      - listitem [ref=e147]:
                        - generic [ref=e148]:
                          - link "GCP" [ref=e149] [cursor=pointer]:
                            - /url: /clusters/public-cloud/gcp/
                          - button "Toggle the collapsible sidebar category 'GCP'" [ref=e150] [cursor=pointer]
                  - listitem [ref=e151]:
                    - generic [ref=e152]:
                      - link "Data Center Clusters" [ref=e153] [cursor=pointer]:
                        - /url: /clusters/data-center/
                        - img [ref=e155]
                        - text: Data Center Clusters
                      - button "Toggle the collapsible sidebar category 'Data Center Clusters'" [ref=e157] [cursor=pointer]
                  - listitem [ref=e158]:
                    - generic [ref=e159]:
                      - link "Edge" [ref=e160] [cursor=pointer]:
                        - /url: /clusters/edge/
                        - img [ref=e162]
                        - text: Edge
                      - button "Toggle the collapsible sidebar category 'Edge'" [ref=e164] [cursor=pointer]
                  - listitem [ref=e165]:
                    - generic [ref=e166]:
                      - link "Palette Virtual Clusters" [ref=e167] [cursor=pointer]:
                        - /url: /clusters/palette-virtual-clusters/
                        - img [ref=e169]
                        - text: Palette Virtual Clusters
                      - button "Toggle the collapsible sidebar category 'Palette Virtual Clusters'" [ref=e171] [cursor=pointer]
                  - listitem [ref=e172]:
                    - generic [ref=e173]:
                      - link "Imported Clusters" [ref=e174] [cursor=pointer]:
                        - /url: /clusters/imported-clusters/
                        - img [ref=e176]
                        - text: Imported Clusters
                      - button "Toggle the collapsible sidebar category 'Imported Clusters'" [ref=e178] [cursor=pointer]
                  - listitem [ref=e179]:
                    - generic [ref=e180]:
                      - link "Manage Clusters" [ref=e181] [cursor=pointer]:
                        - /url: /clusters/cluster-management/
                        - img [ref=e183]
                        - text: Manage Clusters
                      - button "Toggle the collapsible sidebar category 'Manage Clusters'" [ref=e185] [cursor=pointer]
                  - listitem [ref=e186]:
                    - generic [ref=e187]:
                      - link "Cluster Groups" [ref=e188] [cursor=pointer]:
                        - /url: /clusters/cluster-groups/
                        - img [ref=e190]
                        - text: Cluster Groups
                      - button "Toggle the collapsible sidebar category 'Cluster Groups'" [ref=e192] [cursor=pointer]
                  - listitem [ref=e193]:
                    - generic [ref=e194]:
                      - link "Private Cloud Gateway" [ref=e195] [cursor=pointer]:
                        - /url: /clusters/pcg/
                        - img [ref=e197]
                        - text: Private Cloud Gateway
                      - button "Toggle the collapsible sidebar category 'Private Cloud Gateway'" [ref=e199] [cursor=pointer]
              - listitem [ref=e200]:
                - generic [ref=e201]:
                  - link "Bring Your Own OS (BYOOS)" [ref=e202] [cursor=pointer]:
                    - /url: /byoos/
                    - img [ref=e204]
                    - text: Bring Your Own OS (BYOOS)
                  - button "Toggle the collapsible sidebar category 'Bring Your Own OS (BYOOS)'" [ref=e206] [cursor=pointer]
              - listitem [ref=e207]:
                - generic [ref=e208]:
                  - link "Palette Dev Engine" [ref=e209] [cursor=pointer]:
                    - /url: /devx/
                    - img [ref=e211]
                    - text: Palette Dev Engine
                  - button "Toggle the collapsible sidebar category 'Palette Dev Engine'" [ref=e213] [cursor=pointer]
              - listitem [ref=e214]:
                - generic [ref=e215]:
                  - link "AI Workloads" [ref=e216] [cursor=pointer]:
                    - /url: /ai-workloads/
                    - img [ref=e218]
                    - text: AI Workloads
                  - button "Toggle the collapsible sidebar category 'AI Workloads'" [ref=e220] [cursor=pointer]
              - listitem [ref=e221]:
                - generic [ref=e222]:
                  - link "Virtual Machine Orchestrator" [ref=e223] [cursor=pointer]:
                    - /url: /vm-management/
                    - img [ref=e225]
                    - text: Virtual Machine Orchestrator
                  - button "Toggle the collapsible sidebar category 'Virtual Machine Orchestrator'" [ref=e227] [cursor=pointer]
              - listitem [ref=e228]:
                - generic [ref=e229]:
                  - link "Workspaces" [ref=e230] [cursor=pointer]:
                    - /url: /workspace/
                    - img [ref=e232]
                    - text: Workspaces
                  - button "Toggle the collapsible sidebar category 'Workspaces'" [ref=e234] [cursor=pointer]
              - listitem [ref=e235]:
                - generic [ref=e236]:
                  - link "Packs List" [ref=e237] [cursor=pointer]:
                    - /url: /integrations/
                    - img [ref=e239]
                    - text: Packs List
                  - button "Toggle the collapsible sidebar category 'Packs List'" [ref=e241] [cursor=pointer]
              - listitem [ref=e242]:
                - generic [ref=e243]:
                  - link "User & Role Management" [ref=e244] [cursor=pointer]:
                    - /url: /user-management/
                    - img [ref=e246]
                    - text: User & Role Management
                  - button "Toggle the collapsible sidebar category 'User & Role Management'" [ref=e248] [cursor=pointer]
              - listitem [ref=e249]:
                - generic [ref=e250]:
                  - link "Registries and Packs" [ref=e251] [cursor=pointer]:
                    - /url: /registries-and-packs/
                    - img [ref=e253]
                    - text: Registries and Packs
                  - button "Toggle the collapsible sidebar category 'Registries and Packs'" [ref=e255] [cursor=pointer]
              - listitem [ref=e256]:
                - generic [ref=e257]:
                  - link "Security" [ref=e258] [cursor=pointer]:
                    - /url: /security/
                    - img [ref=e260]
                    - text: Security
                  - button "Toggle the collapsible sidebar category 'Security'" [ref=e262] [cursor=pointer]
              - listitem [ref=e263]:
                - generic [ref=e264]:
                  - link "Audit Logs" [ref=e265] [cursor=pointer]:
                    - /url: /audit-logs/
                    - img [ref=e267]
                    - text: Audit Logs
                  - button "Toggle the collapsible sidebar category 'Audit Logs'" [ref=e269] [cursor=pointer]
              - listitem [ref=e270]:
                - generic [ref=e271]:
                  - link "Self-Hosted Palette" [ref=e272] [cursor=pointer]:
                    - /url: /enterprise-version/
                    - img [ref=e274]
                    - text: Self-Hosted Palette
                  - button "Toggle the collapsible sidebar category 'Self-Hosted Palette'" [ref=e276] [cursor=pointer]
              - listitem [ref=e277]:
                - generic [ref=e278]:
                  - link "Palette VerteX" [ref=e279] [cursor=pointer]:
                    - /url: /vertex/
                    - img [ref=e281]
                    - text: Palette VerteX
                  - button "Toggle the collapsible sidebar category 'Palette VerteX'" [ref=e283] [cursor=pointer]
              - listitem [ref=e284]:
                - generic [ref=e285]:
                  - link "Tenant Administration" [ref=e286] [cursor=pointer]:
                    - /url: /tenant-settings/
                    - img [ref=e288]
                    - text: Tenant Administration
                  - button "Toggle the collapsible sidebar category 'Tenant Administration'" [ref=e290] [cursor=pointer]
              - listitem [ref=e291]:
                - generic [ref=e292]:
                  - link "Automation" [ref=e293] [cursor=pointer]:
                    - /url: /automation/
                    - img [ref=e295]
                    - text: Automation
                  - button "Toggle the collapsible sidebar category 'Automation'" [ref=e297] [cursor=pointer]
              - listitem [ref=e298]:
                - generic [ref=e299]:
                  - link "Troubleshooting" [ref=e300] [cursor=pointer]:
                    - /url: /troubleshooting/
                    - img [ref=e302]
                    - text: Troubleshooting
                  - button "Toggle the collapsible sidebar category 'Troubleshooting'" [ref=e304] [cursor=pointer]
              - listitem [ref=e305]:
                - link "Glossary" [ref=e306] [cursor=pointer]:
                  - /url: /glossary-all/
                  - img [ref=e308]
                  - text: Glossary
              - listitem [ref=e310]:
                - generic [ref=e311]:
                  - link "Compliance & Legal" [ref=e312] [cursor=pointer]:
                    - /url: /legal-licenses/
                    - img [ref=e314]
                    - text: Compliance & Legal
                  - button "Toggle the collapsible sidebar category 'Compliance & Legal'" [ref=e316] [cursor=pointer]
              - listitem [ref=e317]:
                - button "Privacy Settings" [ref=e318] [cursor=pointer]:
                  - img [ref=e319]
                  - text: Privacy Settings
      - main [ref=e321]:
        - generic [ref=e323]:
          - generic [ref=e325]:
            - article [ref=e326]:
              - navigation "Breadcrumbs" [ref=e327]:
                - list [ref=e328]:
                  - listitem [ref=e329]:
                    - link "Home page" [ref=e330] [cursor=pointer]:
                      - /url: /
                      - img [ref=e331]
                  - listitem [ref=e333]:
                    - link "Clusters" [ref=e334] [cursor=pointer]:
                      - /url: /clusters/
                  - listitem [ref=e335]:
                    - link "Public Cloud Clusters" [ref=e336] [cursor=pointer]:
                      - /url: /clusters/public-cloud/
                  - listitem [ref=e337]:
                    - link "Azure" [ref=e338] [cursor=pointer]:
                      - /url: /clusters/public-cloud/azure/
                  - listitem [ref=e339]:
                    - generic [ref=e340]: Deploy Windows Workloads
              - generic [ref=e341]:
                - heading "Deploy Microsoft Windows Workloads on an Azure AKS Cluster" [level=1] [ref=e343]
                - paragraph [ref=e344]:
                  - text: Palette supports the deployment of Microsoft Windows applications on
                  - link "Azure AKS clusters" [ref=e345] [cursor=pointer]:
                    - /url: /clusters/public-cloud/azure/aks/
                  - text: . For the Windows applications to work, Palette requires a Windows-based node pool created within the cluster. This section guides you on creating a Windows node pool within an existing AKS cluster managed by Palette and configuring your Windows application to be deployed to that node pool.
                - heading "PrerequisitesDirect link to Prerequisites" [level=2] [ref=e346]:
                  - text: Prerequisites
                  - link "Direct link to Prerequisites" [ref=e347] [cursor=pointer]:
                    - /url: "#prerequisites"
                    - text: "#"
                - list [ref=e348]:
                  - listitem [ref=e349]:
                    - paragraph [ref=e350]:
                      - text: An AKS cluster created as described in the
                      - link "Create and Manage Azure AKS Cluster" [ref=e351] [cursor=pointer]:
                        - /url: /clusters/public-cloud/azure/aks/
                      - text: guide.
                  - listitem [ref=e352]:
                    - paragraph [ref=e353]:
                      - text: A Linux-based node pool configured as the system node pool as described in the
                      - link "Create and Manage Azure AKS Cluster" [ref=e354] [cursor=pointer]:
                        - /url: /clusters/public-cloud/azure/aks/
                      - text: guide.
                  - listitem [ref=e355]:
                    - paragraph [ref=e356]:
                      - text: A Windows node pool configured as described in the
                      - link "Create a Windows Node Pool" [ref=e357] [cursor=pointer]:
                        - /url: "#create-a-windows-node-pool"
                      - text: section.
                - heading "EnablementDirect link to Enablement" [level=2] [ref=e358]:
                  - text: Enablement
                  - link "Direct link to Enablement" [ref=e359] [cursor=pointer]:
                    - /url: "#enablement"
                    - text: "#"
                - heading "Create a Windows Node PoolDirect link to Create a Windows Node Pool" [level=3] [ref=e360]:
                  - text: Create a Windows Node Pool
                  - link "Direct link to Create a Windows Node Pool" [ref=e361] [cursor=pointer]:
                    - /url: "#create-a-windows-node-pool"
                    - text: "#"
                - paragraph [ref=e362]:
                  - text: Follow the steps below to create a Windows node pool within an existing AKS cluster. Refer to the
                  - link "Node Pools" [ref=e363] [cursor=pointer]:
                    - /url: /clusters/cluster-management/node-pool/
                  - text: page for more information about node pool configuration.
                - generic [ref=e364]:
                  - generic [ref=e365]:
                    - img [ref=e367]
                    - text: info
                  - paragraph [ref=e370]:
                    - text: Palette also allows you to add a Windows node pool during the creation of an AKS cluster. Refer to the
                    - link "Node Pool" [ref=e371] [cursor=pointer]:
                      - /url: /clusters/cluster-management/node-pool/
                    - text: guide to learn more.
                - list [ref=e372]:
                  - listitem [ref=e373]:
                    - paragraph [ref=e374]:
                      - text: Log in to Palette, navigate to the left
                      - strong [ref=e375]: Main Menu
                      - text: ", and click on"
                      - strong [ref=e376]: Clusters
                      - text: .
                  - listitem [ref=e377]:
                    - paragraph [ref=e378]: Select your Azure AKS cluster.
                  - listitem [ref=e379]:
                    - paragraph [ref=e380]:
                      - text: Navigate to the
                      - strong [ref=e381]: Nodes
                      - text: tab and click on
                      - strong [ref=e382]: New Node Pool
                      - text: .
                  - listitem [ref=e383]:
                    - paragraph [ref=e384]: Provide a name for your node pool. When naming a node pool, it is good practice to include a name that matches the node and operating system (OS) in Azure.
                  - listitem [ref=e385]:
                    - paragraph [ref=e386]:
                      - text: If auto-scaling is necessary, enable the
                      - strong [ref=e387]: Enable Autoscaler
                      - text: option.
                    - generic [ref=e388]:
                      - generic [ref=e389]:
                        - img [ref=e391]
                        - text: warning
                      - paragraph [ref=e394]:
                        - text: Do not select the
                        - strong [ref=e395]: System Node Pool
                        - text: option. System node pools must be Linux-based, and choosing this option will remove the ability to create a Windows node pool.
                  - listitem [ref=e396]:
                    - paragraph [ref=e397]:
                      - text: Enter the
                      - strong [ref=e398]: Number of nodes in the pool
                      - text: ", or set the"
                      - strong [ref=e399]: Minimum Size
                      - text: and
                      - strong [ref=e400]: Maximum Size
                      - text: if you have enabled Autoscaler.
                  - listitem [ref=e401]:
                    - paragraph [ref=e402]:
                      - text: Include
                      - strong [ref=e403]: Additional Labels
                      - text: if desired. This step is optional.
                  - listitem [ref=e404]:
                    - paragraph [ref=e405]:
                      - text: Enable
                      - strong [ref=e406]: Taints
                      - text: . This step is also optional.
                  - listitem [ref=e407]:
                    - paragraph [ref=e408]:
                      - text: Choose the
                      - strong [ref=e409]: Instance type
                      - text: . Once selected, the cost details will be displayed.
                  - listitem [ref=e410]:
                    - paragraph [ref=e411]:
                      - text: For the
                      - strong [ref=e412]: OS Type
                      - text: ", choose"
                      - strong [ref=e413]: Windows
                      - text: .
                  - listitem [ref=e414]:
                    - paragraph [ref=e415]:
                      - text: Select the
                      - strong [ref=e416]: Managed Disk
                      - text: information and its size.
                  - listitem [ref=e417]:
                    - paragraph [ref=e418]:
                      - text: Last, click on
                      - strong [ref=e419]: Confirm
                      - text: to create the Windows node pool.
                - paragraph [ref=e420]: The video below showcases the process of creating a Windows node pool within an existing AKS cluster.
                - generic "add-windows-node-pool" [ref=e421]
                - heading "Create an Add-on Profile with a Windows WorkloadDirect link to Create an Add-on Profile with a Windows Workload" [level=3] [ref=e422]:
                  - text: Create an Add-on Profile with a Windows Workload
                  - link "Direct link to Create an Add-on Profile with a Windows Workload" [ref=e423] [cursor=pointer]:
                    - /url: "#create-an-add-on-profile-with-a-windows-workload"
                    - text: "#"
                - paragraph [ref=e424]: After creating your Windows node pool, use the following steps to create an add-on cluster profile with a Windows workload.
                - list [ref=e425]:
                  - listitem [ref=e426]:
                    - paragraph [ref=e427]:
                      - text: Follow the
                      - link "Add a Manifest to an Add-on Profile" [ref=e428] [cursor=pointer]:
                        - /url: /profiles/cluster-profiles/create-cluster-profiles/create-addon-profile/create-manifest-addon/
                      - text: guide to create an add-on cluster profile with a custom manifest.
                  - listitem [ref=e429]:
                    - paragraph [ref=e430]:
                      - text: Use the manifest provided below for a sample ASP.NET application. Alternatively, use your own Windows application manifest. It is essential to include in the
                      - code [ref=e431]: spec
                      - text: block of the manifest the
                      - code [ref=e432]: "nodeSelector: \"kubernetes.io/os\": windows"
                      - text: specification. This specification is required for Kubernetes to know that the application needs to be deployed on a Windows node.
                    - generic [ref=e434]:
                      - code [ref=e436]:
                        - generic [ref=e437]: "apiVersion: v1"
                        - generic [ref=e438]: "kind: Namespace"
                        - generic [ref=e439]: "metadata:"
                        - generic [ref=e440]: "name: win-pack"
                        - generic [ref=e441]: "---"
                        - generic [ref=e442]: "apiVersion: apps/v1"
                        - generic [ref=e443]: "kind: Deployment"
                        - generic [ref=e444]: "metadata:"
                        - generic [ref=e445]: "namespace: win-pack"
                        - generic [ref=e446]: "name: sample"
                        - generic [ref=e447]: "labels:"
                        - generic [ref=e448]: "app: sample"
                        - generic [ref=e449]: "spec:"
                        - generic [ref=e450]: "replicas: 1"
                        - generic [ref=e451]: "template:"
                        - generic [ref=e452]: "metadata:"
                        - generic [ref=e453]: "name: sample"
                        - generic [ref=e454]: "labels:"
                        - generic [ref=e455]: "app: sample"
                        - generic [ref=e456]: "spec:"
                        - generic [ref=e457]: "nodeSelector:"
                        - generic [ref=e458]: "\"kubernetes.io/os\": windows"
                        - generic [ref=e459]: "containers:"
                        - generic [ref=e460]: "- name: sample"
                        - generic [ref=e461]: "image: mcr.microsoft.com/dotnet/framework/samples:aspnetapp"
                        - generic [ref=e462]: "resources:"
                        - generic [ref=e463]: "limits:"
                        - generic [ref=e464]: "cpu: 1"
                        - generic [ref=e465]: "memory: 800M"
                        - generic [ref=e466]: "ports:"
                        - generic [ref=e467]: "- containerPort: 80"
                        - generic [ref=e468]: "selector:"
                        - generic [ref=e469]: "matchLabels:"
                        - generic [ref=e470]: "app: sample"
                        - generic [ref=e471]: "---"
                        - generic [ref=e472]: "apiVersion: v1"
                        - generic [ref=e473]: "kind: Service"
                        - generic [ref=e474]: "metadata:"
                        - generic [ref=e475]: "name: sample"
                        - generic [ref=e476]: "namespace: win-pack"
                        - generic [ref=e477]: "spec:"
                        - generic [ref=e478]: "type: LoadBalancer"
                        - generic [ref=e479]: "ports:"
                        - generic [ref=e480]: "- protocol: TCP"
                        - generic [ref=e481]: "port: 80"
                        - generic [ref=e482]: "selector:"
                        - generic [ref=e483]: "app: sample"
                      - generic [ref=e484]:
                        - button "Toggle word wrap" [ref=e485] [cursor=pointer]:
                          - img [ref=e486]
                        - button "Copy code to clipboard" [ref=e488] [cursor=pointer]:
                          - generic [ref=e489]:
                            - img [ref=e490]
                            - img [ref=e492]
                - heading "Deploy a Windows Add-on Profile to an Existing AKS ClusterDirect link to Deploy a Windows Add-on Profile to an Existing AKS Cluster" [level=3] [ref=e494]:
                  - text: Deploy a Windows Add-on Profile to an Existing AKS Cluster
                  - link "Direct link to Deploy a Windows Add-on Profile to an Existing AKS Cluster" [ref=e495] [cursor=pointer]:
                    - /url: "#deploy-a-windows-add-on-profile-to-an-existing-aks-cluster"
                    - text: "#"
                - paragraph [ref=e496]:
                  - text: Lastly, after creating your add-on cluster profile, attach it to your AKS cluster that has the previously created Windows node pool. Follow the steps outlined in the
                  - link "Attach an Add-on Profile" [ref=e497] [cursor=pointer]:
                    - /url: /clusters/imported-clusters/attach-add-on-profile/#attach-an-add-on-profile
                  - text: guide to attach your add-on cluster profile to the AKS cluster.
                - heading "ValidateDirect link to Validate" [level=2] [ref=e498]:
                  - text: Validate
                  - link "Direct link to Validate" [ref=e499] [cursor=pointer]:
                    - /url: "#validate"
                    - text: "#"
                - list [ref=e500]:
                  - listitem [ref=e501]:
                    - paragraph [ref=e502]:
                      - text: In Palette, navigate to the left
                      - strong [ref=e503]: Main Menu
                      - text: and select
                      - strong [ref=e504]: Clusters
                      - text: .
                  - listitem [ref=e505]:
                    - paragraph [ref=e506]:
                      - text: Next, click on your AKS cluster, which will open the cluster's
                      - strong [ref=e507]: Overview
                      - text: page.
                  - listitem [ref=e508]:
                    - paragraph [ref=e509]:
                      - text: Click on the exposed
                      - strong [ref=e510]: Services
                      - text: URL to access the Windows application landing page.
              - generic [ref=e511]:
                - generic [ref=e513]:
                  - text: "Tags:"
                  - list [ref=e514]:
                    - listitem [ref=e515]:
                      - link "public cloud" [ref=e516] [cursor=pointer]:
                        - /url: /tags/public-cloud/
                    - listitem [ref=e517]:
                      - link "azure" [ref=e518] [cursor=pointer]:
                        - /url: /tags/azure/
                - link "Edit this page" [ref=e521] [cursor=pointer]:
                  - /url: https://github.com/spectrocloud/librarium/blob/master/docs/docs-content/clusters/public-cloud/azure/windows.md
                  - img [ref=e522]
                  - text: Edit this page
            - navigation "Docs pages" [ref=e526]:
              - link "Previous « Create and Manage Azure AKS Cluster" [ref=e527] [cursor=pointer]:
                - /url: /clusters/public-cloud/azure/aks/
                - generic [ref=e528]: Previous
                - generic [ref=e529]: « Create and Manage Azure AKS Cluster
              - link "Next Required Permissions »" [ref=e530] [cursor=pointer]:
                - /url: /clusters/public-cloud/azure/required-permissions/
                - generic [ref=e531]: Next
                - generic [ref=e532]: Required Permissions »
          - list [ref=e535]:
            - listitem [ref=e536]:
              - link "Prerequisites" [ref=e537] [cursor=pointer]:
                - /url: "#prerequisites"
            - listitem [ref=e538]:
              - link "Enablement" [ref=e539] [cursor=pointer]:
                - /url: "#enablement"
              - list [ref=e540]:
                - listitem [ref=e541]:
                  - link "Create a Windows Node Pool" [ref=e542] [cursor=pointer]:
                    - /url: "#create-a-windows-node-pool"
                - listitem [ref=e543]:
                  - link "Create an Add-on Profile with a Windows Workload" [ref=e544] [cursor=pointer]:
                    - /url: "#create-an-add-on-profile-with-a-windows-workload"
                - listitem [ref=e545]:
                  - link "Deploy a Windows Add-on Profile to an Existing AKS Cluster" [ref=e546] [cursor=pointer]:
                    - /url: "#deploy-a-windows-add-on-profile-to-an-existing-aks-cluster"
            - listitem [ref=e547]:
              - link "Validate" [ref=e548] [cursor=pointer]:
                - /url: "#validate"
  - button "Project Logo Ask AI" [ref=e549] [cursor=pointer]:
    - generic [ref=e552]:
      - img "Project Logo" [ref=e553]
      - paragraph [ref=e554]: Ask AI
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