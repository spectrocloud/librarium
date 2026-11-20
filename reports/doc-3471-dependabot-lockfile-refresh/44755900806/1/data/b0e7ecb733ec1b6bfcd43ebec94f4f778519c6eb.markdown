# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: screenshot.docs.spec.ts >> Docs screenshots >> pathname /ai-workloads/edge-ai/jetson-requirements/
- Location: visuals/screenshot.docs.spec.ts:38:7

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

  198 pixels (ratio 0.01 of all image pixels) are different.

Call log:
  - Expect "toHaveScreenshot" with timeout 10000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 198 pixels (ratio 0.01 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - 198 pixels (ratio 0.01 of all image pixels) are different.

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
                  - link "AI Workloads" [expanded] [ref=e126] [cursor=pointer]:
                    - /url: /ai-workloads/
                    - img [ref=e128]
                    - text: AI Workloads
                  - button "Toggle the collapsible sidebar category 'AI Workloads'" [ref=e130] [cursor=pointer]
                - list [ref=e131]:
                  - listitem [ref=e132]:
                    - generic [ref=e133]:
                      - link "Edge AI on Jetson" [expanded] [ref=e134] [cursor=pointer]:
                        - /url: /ai-workloads/edge-ai/
                      - button "Toggle the collapsible sidebar category 'Edge AI on Jetson'" [ref=e135] [cursor=pointer]
                    - list [ref=e136]:
                      - listitem [ref=e137]:
                        - link "Requirements" [ref=e138] [cursor=pointer]:
                          - /url: /ai-workloads/edge-ai/jetson-requirements/
                      - listitem [ref=e139]:
                        - link "Prepare the Jetson Host" [ref=e140] [cursor=pointer]:
                          - /url: /ai-workloads/edge-ai/prepare-jetson-host/
                      - listitem [ref=e141]:
                        - link "Register a Jetson Host and Serve a Model" [ref=e142] [cursor=pointer]:
                          - /url: /ai-workloads/edge-ai/register-jetson-host/
                      - listitem [ref=e143]:
                        - link "Day 2 Operations" [ref=e144] [cursor=pointer]:
                          - /url: /ai-workloads/edge-ai/day-2-operations/
                  - listitem [ref=e145]:
                    - link "NVIDIA GPU Operator Pack" [ref=e146] [cursor=pointer]:
                      - /url: /ai-workloads/nvidia-gpu-operator/
              - listitem [ref=e147]:
                - generic [ref=e148]:
                  - link "Virtual Machine Orchestrator" [ref=e149] [cursor=pointer]:
                    - /url: /vm-management/
                    - img [ref=e151]
                    - text: Virtual Machine Orchestrator
                  - button "Toggle the collapsible sidebar category 'Virtual Machine Orchestrator'" [ref=e153] [cursor=pointer]
              - listitem [ref=e154]:
                - generic [ref=e155]:
                  - link "Workspaces" [ref=e156] [cursor=pointer]:
                    - /url: /workspace/
                    - img [ref=e158]
                    - text: Workspaces
                  - button "Toggle the collapsible sidebar category 'Workspaces'" [ref=e160] [cursor=pointer]
              - listitem [ref=e161]:
                - generic [ref=e162]:
                  - link "Packs List" [ref=e163] [cursor=pointer]:
                    - /url: /integrations/
                    - img [ref=e165]
                    - text: Packs List
                  - button "Toggle the collapsible sidebar category 'Packs List'" [ref=e167] [cursor=pointer]
              - listitem [ref=e168]:
                - generic [ref=e169]:
                  - link "User & Role Management" [ref=e170] [cursor=pointer]:
                    - /url: /user-management/
                    - img [ref=e172]
                    - text: User & Role Management
                  - button "Toggle the collapsible sidebar category 'User & Role Management'" [ref=e174] [cursor=pointer]
              - listitem [ref=e175]:
                - generic [ref=e176]:
                  - link "Registries and Packs" [ref=e177] [cursor=pointer]:
                    - /url: /registries-and-packs/
                    - img [ref=e179]
                    - text: Registries and Packs
                  - button "Toggle the collapsible sidebar category 'Registries and Packs'" [ref=e181] [cursor=pointer]
              - listitem [ref=e182]:
                - generic [ref=e183]:
                  - link "Security" [ref=e184] [cursor=pointer]:
                    - /url: /security/
                    - img [ref=e186]
                    - text: Security
                  - button "Toggle the collapsible sidebar category 'Security'" [ref=e188] [cursor=pointer]
              - listitem [ref=e189]:
                - generic [ref=e190]:
                  - link "Audit Logs" [ref=e191] [cursor=pointer]:
                    - /url: /audit-logs/
                    - img [ref=e193]
                    - text: Audit Logs
                  - button "Toggle the collapsible sidebar category 'Audit Logs'" [ref=e195] [cursor=pointer]
              - listitem [ref=e196]:
                - generic [ref=e197]:
                  - link "Self-Hosted Palette" [ref=e198] [cursor=pointer]:
                    - /url: /enterprise-version/
                    - img [ref=e200]
                    - text: Self-Hosted Palette
                  - button "Toggle the collapsible sidebar category 'Self-Hosted Palette'" [ref=e202] [cursor=pointer]
              - listitem [ref=e203]:
                - generic [ref=e204]:
                  - link "Palette VerteX" [ref=e205] [cursor=pointer]:
                    - /url: /vertex/
                    - img [ref=e207]
                    - text: Palette VerteX
                  - button "Toggle the collapsible sidebar category 'Palette VerteX'" [ref=e209] [cursor=pointer]
              - listitem [ref=e210]:
                - generic [ref=e211]:
                  - link "Tenant Administration" [ref=e212] [cursor=pointer]:
                    - /url: /tenant-settings/
                    - img [ref=e214]
                    - text: Tenant Administration
                  - button "Toggle the collapsible sidebar category 'Tenant Administration'" [ref=e216] [cursor=pointer]
              - listitem [ref=e217]:
                - generic [ref=e218]:
                  - link "Automation" [ref=e219] [cursor=pointer]:
                    - /url: /automation/
                    - img [ref=e221]
                    - text: Automation
                  - button "Toggle the collapsible sidebar category 'Automation'" [ref=e223] [cursor=pointer]
              - listitem [ref=e224]:
                - generic [ref=e225]:
                  - link "Troubleshooting" [ref=e226] [cursor=pointer]:
                    - /url: /troubleshooting/
                    - img [ref=e228]
                    - text: Troubleshooting
                  - button "Toggle the collapsible sidebar category 'Troubleshooting'" [ref=e230] [cursor=pointer]
              - listitem [ref=e231]:
                - link "Glossary" [ref=e232] [cursor=pointer]:
                  - /url: /glossary-all/
                  - img [ref=e234]
                  - text: Glossary
              - listitem [ref=e236]:
                - generic [ref=e237]:
                  - link "Compliance & Legal" [ref=e238] [cursor=pointer]:
                    - /url: /legal-licenses/
                    - img [ref=e240]
                    - text: Compliance & Legal
                  - button "Toggle the collapsible sidebar category 'Compliance & Legal'" [ref=e242] [cursor=pointer]
              - listitem [ref=e243]:
                - button "Privacy Settings" [ref=e244] [cursor=pointer]:
                  - img [ref=e245]
                  - text: Privacy Settings
      - main [ref=e247]:
        - generic [ref=e249]:
          - generic [ref=e251]:
            - article [ref=e252]:
              - navigation "Breadcrumbs" [ref=e253]:
                - list [ref=e254]:
                  - listitem [ref=e255]:
                    - link "Home page" [ref=e256] [cursor=pointer]:
                      - /url: /
                      - img [ref=e257]
                  - listitem [ref=e259]:
                    - link "AI Workloads" [ref=e260] [cursor=pointer]:
                      - /url: /ai-workloads/
                  - listitem [ref=e261]:
                    - link "Edge AI on Jetson" [ref=e262] [cursor=pointer]:
                      - /url: /ai-workloads/edge-ai/
                  - listitem [ref=e263]:
                    - generic [ref=e264]: Requirements
              - generic [ref=e265]:
                - heading "Requirements for Edge AI on NVIDIA Jetson" [level=1] [ref=e267]
                - paragraph [ref=e268]: This page describes the requirements for running Edge AI workloads on an NVIDIA Jetson device managed by Palette.
                - heading "Deployment ModeDirect link to Deployment Mode" [level=2] [ref=e269]:
                  - text: Deployment Mode
                  - link "Direct link to Deployment Mode" [ref=e270] [cursor=pointer]:
                    - /url: "#deployment-mode"
                    - text: "#"
                - paragraph [ref=e271]:
                  - text: Palette manages the Jetson device as an Edge host registered in
                  - link "agent mode" [ref=e272] [cursor=pointer]:
                    - /url: /deployment-modes/agent-mode/
                  - text: . You bring your own operating system, install the Palette agent on the device, and register it with Palette.
                - generic [ref=e273]:
                  - generic [ref=e274]:
                    - img [ref=e276]
                    - text: warning
                  - paragraph [ref=e279]:
                    - text: Appliance mode is not available on ARM64 devices. Provision ARM64 hosts, including Jetson devices, using agent mode. Refer to
                    - link "Edge Hardware Requirements" [ref=e280] [cursor=pointer]:
                      - /url: /clusters/edge/hardware-requirements/
                    - text: for the current ARM64 support statement.
                - heading "Network RequirementsDirect link to Network Requirements" [level=2] [ref=e281]:
                  - text: Network Requirements
                  - link "Direct link to Network Requirements" [ref=e282] [cursor=pointer]:
                    - /url: "#network-requirements"
                    - text: "#"
                - paragraph [ref=e283]:
                  - text: In agent mode, the Palette agent on the device opens an outbound connection to Palette, and Palette never connects inbound. A Jetson host on a private network behind Network Address Translation (NAT) does not need inbound firewall rules or a
                  - link "Private Cloud Gateway (PCG)" [ref=e284] [cursor=pointer]:
                    - /url: /clusters/pcg/
                  - text: .
                - paragraph [ref=e285]: "The device requires outbound HTTPS (TCP 443) access to the following:"
                - list [ref=e286]:
                  - listitem [ref=e287]:
                    - paragraph [ref=e288]:
                      - text: The Palette SaaS endpoint,
                      - code [ref=e289]: console.spectrocloud.com
                      - text: .
                  - listitem [ref=e290]:
                    - paragraph [ref=e291]: The Palette image registries that host the agent image, packs, and images your cluster profile uses.
                - paragraph [ref=e292]:
                  - text: If your network restricts egress, export the proxy configuration in your terminal session before you install the agent. Set the
                  - code [ref=e293]: http_proxy
                  - text: and
                  - code [ref=e294]: https_proxy
                  - text: variables, in both lowercase and uppercase forms. Refer to the proxy step in
                  - link "Install Palette Agent" [ref=e295] [cursor=pointer]:
                    - /url: /deployment-modes/agent-mode/install-agent-host/#enablement
                  - text: for the exact commands.
                - heading "Hardware RequirementsDirect link to Hardware Requirements" [level=2] [ref=e296]:
                  - text: Hardware Requirements
                  - link "Direct link to Hardware Requirements" [ref=e297] [cursor=pointer]:
                    - /url: "#hardware-requirements"
                    - text: "#"
                - paragraph [ref=e298]:
                  - text: The following table compares the agent mode minimum requirements with the specifications of the NVIDIA Jetson AGX Thor Developer Kit. The minimum values match the agent mode prerequisites on
                  - link "Install Palette Agent" [ref=e299] [cursor=pointer]:
                    - /url: /deployment-modes/agent-mode/install-agent-host/
                  - text: .
                - table [ref=e300]:
                  - rowgroup [ref=e301]:
                    - row "Component Minimum (agent mode) Jetson AGX Thor Developer Kit" [ref=e302]:
                      - columnheader "Component" [ref=e303]
                      - columnheader "Minimum (agent mode)" [ref=e304]
                      - columnheader "Jetson AGX Thor Developer Kit" [ref=e305]
                  - rowgroup [ref=e306]:
                    - row "CPU 2 cores 14-core Arm Neoverse-V3AE (64-bit)" [ref=e307]:
                      - cell "CPU" [ref=e308]
                      - cell "2 cores" [ref=e309]
                      - cell "14-core Arm Neoverse-V3AE (64-bit)" [ref=e310]
                    - row "Memory 8 GB 128 GB LPDDR5X" [ref=e311]:
                      - cell "Memory" [ref=e312]
                      - cell "8 GB" [ref=e313]
                      - cell "128 GB LPDDR5X" [ref=e314]
                    - row "Storage 100 GB, SSD required 1 TB NVMe SSD" [ref=e315]:
                      - cell "Storage" [ref=e316]
                      - cell "100 GB, SSD required" [ref=e317]
                      - cell "1 TB NVMe SSD" [ref=e318]
                    - row "GPU Integrated NVIDIA GPU NVIDIA Blackwell, 2,560 CUDA cores, 96 Tensor cores" [ref=e319]:
                      - cell "GPU" [ref=e320]
                      - cell "Integrated NVIDIA GPU" [ref=e321]
                      - cell "NVIDIA Blackwell, 2,560 CUDA cores, 96 Tensor cores" [ref=e322]
                - heading "Host Operating SystemDirect link to Host Operating System" [level=2] [ref=e323]:
                  - text: Host Operating System
                  - link "Direct link to Host Operating System" [ref=e324] [cursor=pointer]:
                    - /url: "#host-operating-system"
                    - text: "#"
                - paragraph [ref=e325]:
                  - text: The Jetson device runs
                  - link "NVIDIA JetPack" [ref=e326] [cursor=pointer]:
                    - /url: https://developer.nvidia.com/embedded/jetpack
                  - text: ", which provides a Jetson Linux (L4T) operating system built on Ubuntu. For instructions on installing JetPack, refer to"
                  - link "Prepare the Jetson Host" [ref=e327] [cursor=pointer]:
                    - /url: /ai-workloads/edge-ai/prepare-jetson-host/
                  - text: .
                - paragraph [ref=e328]:
                  - text: For more information about NVIDIA JetPack and Jetson Linux, including troubleshooting, refer to the
                  - link "NVIDIA Jetson Software Documentation" [ref=e329] [cursor=pointer]:
                    - /url: https://docs.nvidia.com/jetson/index.html
                  - text: .
                - paragraph [ref=e330]: This guide is validated on the operating system versions in the following table.
                - table [ref=e331]:
                  - rowgroup [ref=e332]:
                    - row "Component Validated version" [ref=e333]:
                      - columnheader "Component" [ref=e334]
                      - columnheader "Validated version" [ref=e335]
                  - rowgroup [ref=e336]:
                    - row "JetPack 7.2.1" [ref=e337]:
                      - cell "JetPack" [ref=e338]
                      - cell "7.2.1" [ref=e339]
                    - row "Jetson Linux L4T r39.2.1" [ref=e340]:
                      - cell "Jetson Linux" [ref=e341]
                      - cell "L4T r39.2.1" [ref=e342]
                    - row "Ubuntu base 24.04 LTS (Noble Numbat)" [ref=e343]:
                      - cell "Ubuntu base" [ref=e344]
                      - cell "24.04 LTS (Noble Numbat)" [ref=e345]
                - heading "Supported Kubernetes Distribution and CNIDirect link to Supported Kubernetes Distribution and CNI" [level=2] [ref=e346]:
                  - text: Supported Kubernetes Distribution and CNI
                  - link "Direct link to Supported Kubernetes Distribution and CNI" [ref=e347] [cursor=pointer]:
                    - /url: "#supported-kubernetes-distribution-and-cni"
                    - text: "#"
                - paragraph [ref=e348]:
                  - text: Palette Optimized Canonical (
                  - code [ref=e349]: edge-canonical
                  - text: ) has no ARM64 build, so you cannot use it on a Jetson device. This guide uses Palette Optimized K3s (
                  - code [ref=e350]: edge-k3s
                  - text: ) with the Flannel (
                  - code [ref=e351]: cni-flannel
                  - text: ) Container Network Interface (CNI), which is the combination validated on the Jetson AGX Thor. You configure these layers in the cluster profile when you
                  - link "register the host and deploy a cluster" [ref=e352] [cursor=pointer]:
                    - /url: /ai-workloads/edge-ai/register-jetson-host/
                  - text: .
                - heading "GPU RequirementsDirect link to GPU Requirements" [level=2] [ref=e353]:
                  - text: GPU Requirements
                  - link "Direct link to GPU Requirements" [ref=e354] [cursor=pointer]:
                    - /url: "#gpu-requirements"
                    - text: "#"
                - paragraph [ref=e355]:
                  - text: The
                  - link "NVIDIA GPU Operator" [ref=e356] [cursor=pointer]:
                    - /url: /integrations/packs/?pack=nvidia-gpu-operator-ai
                  - text: pack requires a dedicated NVIDIA GPU and does not support embedded products such as NVIDIA Jetson. Do not use the GPU Operator pack on Jetson devices.
                - paragraph [ref=e357]:
                  - text: On a Jetson device, a workload reaches the integrated GPU through the NVIDIA container runtime that JetPack provides. You do not add a GPU layer to the cluster profile, and you do not install a device plugin. Palette detects the GPU when the host registers, but detection alone does not expose the GPU to your workloads. To give a pod access to the GPU, set
                  - code [ref=e358]: "runtimeClassName: nvidia"
                  - text: in the pod specification, and set the
                  - code [ref=e359]: NVIDIA_VISIBLE_DEVICES
                  - text: and
                  - code [ref=e360]: NVIDIA_DRIVER_CAPABILITIES
                  - text: environment variables to
                  - code [ref=e361]: all
                  - text: . Refer to
                  - link "Enable GPU Access for Workloads" [ref=e362] [cursor=pointer]:
                    - /url: /ai-workloads/edge-ai/register-jetson-host/#enable-gpu-access-for-workloads
                  - text: for an example.
                - heading "Palette RequirementsDirect link to Palette Requirements" [level=2] [ref=e363]:
                  - text: Palette Requirements
                  - link "Direct link to Palette Requirements" [ref=e364] [cursor=pointer]:
                    - /url: "#palette-requirements"
                    - text: "#"
                - list [ref=e365]:
                  - listitem [ref=e366]:
                    - text: Permissions in your Palette tenant to create cluster profiles and a
                    - link "Palette registration token" [ref=e367] [cursor=pointer]:
                      - /url: /clusters/edge/site-deployment/site-installation/create-registration-token/
                    - text: .
                - heading "Next StepsDirect link to Next Steps" [level=2] [ref=e368]:
                  - text: Next Steps
                  - link "Direct link to Next Steps" [ref=e369] [cursor=pointer]:
                    - /url: "#next-steps"
                    - text: "#"
                - paragraph [ref=e370]:
                  - text: After you confirm the requirements, continue to
                  - link "Prepare the Jetson Host" [ref=e371] [cursor=pointer]:
                    - /url: /ai-workloads/edge-ai/prepare-jetson-host/
                  - text: .
              - generic [ref=e372]:
                - generic [ref=e374]:
                  - text: "Tags:"
                  - list [ref=e375]:
                    - listitem [ref=e376]:
                      - link "ai workloads" [ref=e377] [cursor=pointer]:
                        - /url: /tags/ai-workloads/
                    - listitem [ref=e378]:
                      - link "edge" [ref=e379] [cursor=pointer]:
                        - /url: /tags/edge/
                    - listitem [ref=e380]:
                      - link "nvidia" [ref=e381] [cursor=pointer]:
                        - /url: /tags/nvidia/
                    - listitem [ref=e382]:
                      - link "jetson" [ref=e383] [cursor=pointer]:
                        - /url: /tags/jetson/
                    - listitem [ref=e384]:
                      - link "agent mode" [ref=e385] [cursor=pointer]:
                        - /url: /tags/agent-mode/
                    - listitem [ref=e386]:
                      - link "requirements" [ref=e387] [cursor=pointer]:
                        - /url: /tags/requirements/
                - link "Edit this page" [ref=e390] [cursor=pointer]:
                  - /url: https://github.com/spectrocloud/librarium/blob/master/docs/docs-content/ai-workloads/edge-ai/jetson-requirements.md
                  - img [ref=e391]
                  - text: Edit this page
            - navigation "Docs pages" [ref=e395]:
              - link "Previous « Edge AI on Jetson" [ref=e396] [cursor=pointer]:
                - /url: /ai-workloads/edge-ai/
                - generic [ref=e397]: Previous
                - generic [ref=e398]: « Edge AI on Jetson
              - link "Next Prepare the Jetson Host »" [ref=e399] [cursor=pointer]:
                - /url: /ai-workloads/edge-ai/prepare-jetson-host/
                - generic [ref=e400]: Next
                - generic [ref=e401]: Prepare the Jetson Host »
          - list [ref=e404]:
            - listitem [ref=e405]:
              - link "Deployment Mode" [ref=e406] [cursor=pointer]:
                - /url: "#deployment-mode"
            - listitem [ref=e407]:
              - link "Network Requirements" [ref=e408] [cursor=pointer]:
                - /url: "#network-requirements"
            - listitem [ref=e409]:
              - link "Hardware Requirements" [ref=e410] [cursor=pointer]:
                - /url: "#hardware-requirements"
            - listitem [ref=e411]:
              - link "Host Operating System" [ref=e412] [cursor=pointer]:
                - /url: "#host-operating-system"
            - listitem [ref=e413]:
              - link "Supported Kubernetes Distribution and CNI" [ref=e414] [cursor=pointer]:
                - /url: "#supported-kubernetes-distribution-and-cni"
            - listitem [ref=e415]:
              - link "GPU Requirements" [ref=e416] [cursor=pointer]:
                - /url: "#gpu-requirements"
            - listitem [ref=e417]:
              - link "Palette Requirements" [ref=e418] [cursor=pointer]:
                - /url: "#palette-requirements"
            - listitem [ref=e419]:
              - link "Next Steps" [ref=e420] [cursor=pointer]:
                - /url: "#next-steps"
  - button "Project Logo Ask AI" [ref=e421] [cursor=pointer]:
    - generic [ref=e424]:
      - img "Project Logo" [ref=e425]
      - paragraph [ref=e426]: Ask AI
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