# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: screenshot.docs.spec.ts >> Docs screenshots >> pathname /automation/palette-mcp/architecture/
- Location: visuals/screenshot.docs.spec.ts:38:7

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

  1406 pixels (ratio 0.01 of all image pixels) are different.

Call log:
  - Expect "toHaveScreenshot" with timeout 10000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 1406 pixels (ratio 0.01 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - 1406 pixels (ratio 0.01 of all image pixels) are different.

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
                  - link "Clusters" [ref=e103] [cursor=pointer]:
                    - /url: /clusters/
                    - img [ref=e105]
                    - text: Clusters
                  - button "Toggle the collapsible sidebar category 'Clusters'" [ref=e111] [cursor=pointer]
              - listitem [ref=e112]:
                - generic [ref=e113]:
                  - link "Bring Your Own OS (BYOOS)" [ref=e114] [cursor=pointer]:
                    - /url: /byoos/
                    - img [ref=e116]
                    - text: Bring Your Own OS (BYOOS)
                  - button "Toggle the collapsible sidebar category 'Bring Your Own OS (BYOOS)'" [ref=e118] [cursor=pointer]
              - listitem [ref=e119]:
                - generic [ref=e120]:
                  - link "Palette Dev Engine" [ref=e121] [cursor=pointer]:
                    - /url: /devx/
                    - img [ref=e123]
                    - text: Palette Dev Engine
                  - button "Toggle the collapsible sidebar category 'Palette Dev Engine'" [ref=e125] [cursor=pointer]
              - listitem [ref=e126]:
                - generic [ref=e127]:
                  - link "AI Workloads" [ref=e128] [cursor=pointer]:
                    - /url: /ai-workloads/
                    - img [ref=e130]
                    - text: AI Workloads
                  - button "Toggle the collapsible sidebar category 'AI Workloads'" [ref=e132] [cursor=pointer]
              - listitem [ref=e133]:
                - generic [ref=e134]:
                  - link "Virtual Machine Orchestrator" [ref=e135] [cursor=pointer]:
                    - /url: /vm-management/
                    - img [ref=e137]
                    - text: Virtual Machine Orchestrator
                  - button "Toggle the collapsible sidebar category 'Virtual Machine Orchestrator'" [ref=e139] [cursor=pointer]
              - listitem [ref=e140]:
                - generic [ref=e141]:
                  - link "Workspaces" [ref=e142] [cursor=pointer]:
                    - /url: /workspace/
                    - img [ref=e144]
                    - text: Workspaces
                  - button "Toggle the collapsible sidebar category 'Workspaces'" [ref=e146] [cursor=pointer]
              - listitem [ref=e147]:
                - generic [ref=e148]:
                  - link "Packs List" [ref=e149] [cursor=pointer]:
                    - /url: /integrations/
                    - img [ref=e151]
                    - text: Packs List
                  - button "Toggle the collapsible sidebar category 'Packs List'" [ref=e153] [cursor=pointer]
              - listitem [ref=e154]:
                - generic [ref=e155]:
                  - link "User & Role Management" [ref=e156] [cursor=pointer]:
                    - /url: /user-management/
                    - img [ref=e158]
                    - text: User & Role Management
                  - button "Toggle the collapsible sidebar category 'User & Role Management'" [ref=e160] [cursor=pointer]
              - listitem [ref=e161]:
                - generic [ref=e162]:
                  - link "Registries and Packs" [ref=e163] [cursor=pointer]:
                    - /url: /registries-and-packs/
                    - img [ref=e165]
                    - text: Registries and Packs
                  - button "Toggle the collapsible sidebar category 'Registries and Packs'" [ref=e167] [cursor=pointer]
              - listitem [ref=e168]:
                - generic [ref=e169]:
                  - link "Security" [ref=e170] [cursor=pointer]:
                    - /url: /security/
                    - img [ref=e172]
                    - text: Security
                  - button "Toggle the collapsible sidebar category 'Security'" [ref=e174] [cursor=pointer]
              - listitem [ref=e175]:
                - generic [ref=e176]:
                  - link "Audit Logs" [ref=e177] [cursor=pointer]:
                    - /url: /audit-logs/
                    - img [ref=e179]
                    - text: Audit Logs
                  - button "Toggle the collapsible sidebar category 'Audit Logs'" [ref=e181] [cursor=pointer]
              - listitem [ref=e182]:
                - generic [ref=e183]:
                  - link "Self-Hosted Palette" [ref=e184] [cursor=pointer]:
                    - /url: /enterprise-version/
                    - img [ref=e186]
                    - text: Self-Hosted Palette
                  - button "Toggle the collapsible sidebar category 'Self-Hosted Palette'" [ref=e188] [cursor=pointer]
              - listitem [ref=e189]:
                - generic [ref=e190]:
                  - link "Palette VerteX" [ref=e191] [cursor=pointer]:
                    - /url: /vertex/
                    - img [ref=e193]
                    - text: Palette VerteX
                  - button "Toggle the collapsible sidebar category 'Palette VerteX'" [ref=e195] [cursor=pointer]
              - listitem [ref=e196]:
                - generic [ref=e197]:
                  - link "Tenant Administration" [ref=e198] [cursor=pointer]:
                    - /url: /tenant-settings/
                    - img [ref=e200]
                    - text: Tenant Administration
                  - button "Toggle the collapsible sidebar category 'Tenant Administration'" [ref=e202] [cursor=pointer]
              - listitem [ref=e203]:
                - generic [ref=e204]:
                  - link "Automation" [expanded] [ref=e205] [cursor=pointer]:
                    - /url: /automation/
                    - img [ref=e207]
                    - text: Automation
                  - button "Toggle the collapsible sidebar category 'Automation'" [ref=e209] [cursor=pointer]
                - list [ref=e210]:
                  - listitem [ref=e211]:
                    - generic [ref=e212]:
                      - link "Palette CLI" [ref=e213] [cursor=pointer]:
                        - /url: /automation/palette-cli/
                      - button "Toggle the collapsible sidebar category 'Palette CLI'" [ref=e214] [cursor=pointer]
                  - listitem [ref=e215]:
                    - generic [ref=e216]:
                      - link "Palette Go SDK" [ref=e217] [cursor=pointer]:
                        - /url: /automation/palette-sdk/
                      - button "Toggle the collapsible sidebar category 'Palette Go SDK'" [ref=e218] [cursor=pointer]
                  - listitem [ref=e219]:
                    - link "Terraform" [ref=e220] [cursor=pointer]:
                      - /url: /automation/terraform/
                  - listitem [ref=e221]:
                    - generic [ref=e222]:
                      - link "Crossplane" [ref=e223] [cursor=pointer]:
                        - /url: /automation/crossplane/
                      - button "Toggle the collapsible sidebar category 'Crossplane'" [ref=e224] [cursor=pointer]
                  - listitem [ref=e225]:
                    - generic [ref=e226]:
                      - link "Palette MCP Server" [expanded] [ref=e227] [cursor=pointer]:
                        - /url: /automation/palette-mcp/
                      - button "Toggle the collapsible sidebar category 'Palette MCP Server'" [ref=e228] [cursor=pointer]
                    - list [ref=e229]:
                      - listitem [ref=e230]:
                        - link "Architecture" [ref=e231] [cursor=pointer]:
                          - /url: /automation/palette-mcp/architecture/
                      - listitem [ref=e232]:
                        - link "Set Up Palette MCP Server" [ref=e234] [cursor=pointer]:
                          - /url: "#"
                      - listitem [ref=e235]:
                        - link "Palette MCP Server Operations" [ref=e236] [cursor=pointer]:
                          - /url: /automation/palette-mcp/palette-mcp-operations/
              - listitem [ref=e237]:
                - generic [ref=e238]:
                  - link "Troubleshooting" [ref=e239] [cursor=pointer]:
                    - /url: /troubleshooting/
                    - img [ref=e241]
                    - text: Troubleshooting
                  - button "Toggle the collapsible sidebar category 'Troubleshooting'" [ref=e243] [cursor=pointer]
              - listitem [ref=e244]:
                - link "Glossary" [ref=e245] [cursor=pointer]:
                  - /url: /glossary-all/
                  - img [ref=e247]
                  - text: Glossary
              - listitem [ref=e249]:
                - generic [ref=e250]:
                  - link "Compliance & Legal" [ref=e251] [cursor=pointer]:
                    - /url: /legal-licenses/
                    - img [ref=e253]
                    - text: Compliance & Legal
                  - button "Toggle the collapsible sidebar category 'Compliance & Legal'" [ref=e255] [cursor=pointer]
              - listitem [ref=e256]:
                - button "Privacy Settings" [ref=e257] [cursor=pointer]:
                  - img [ref=e258]
                  - text: Privacy Settings
      - main [ref=e260]:
        - generic [ref=e262]:
          - generic [ref=e264]:
            - article [ref=e265]:
              - navigation "Breadcrumbs" [ref=e266]:
                - list [ref=e267]:
                  - listitem [ref=e268]:
                    - link "Home page" [ref=e269] [cursor=pointer]:
                      - /url: /
                      - img [ref=e270]
                  - listitem [ref=e272]:
                    - link "Automation" [ref=e273] [cursor=pointer]:
                      - /url: /automation/
                  - listitem [ref=e274]:
                    - link "Palette MCP Server" [ref=e275] [cursor=pointer]:
                      - /url: /automation/palette-mcp/
                  - listitem [ref=e276]:
                    - generic [ref=e277]: Architecture
              - generic [ref=e278]:
                - heading "Architecture" [level=1] [ref=e280]
                - paragraph [ref=e281]:
                  - text: The
                  - link "Palette MCP server" [ref=e282] [cursor=pointer]:
                    - /url: https://github.com/spectrocloud/palette-agent-toolkit
                  - text: is a local-first Model Context Protocol (MCP) server that runs on your machine or environment as a container or a native binary. The server communicates with the configured Palette instance and performs the required API operations.
                - paragraph [ref=e283]: "The Palette MCP server ships in the following forms:"
                - list [ref=e284]:
                  - listitem [ref=e285]:
                    - paragraph [ref=e286]:
                      - text: A native binary published on
                      - link "GitHub Releases" [ref=e287] [cursor=pointer]:
                        - /url: https://github.com/spectrocloud/palette-agent-toolkit/releases
                      - text: for macOS on Apple Silicon, macOS on Intel, Linux on x86_64, and Linux on ARM64. Windows is not supported as a native binary. On Windows, use the container image.
                  - listitem [ref=e288]:
                    - paragraph [ref=e289]:
                      - text: A container image at
                      - code [ref=e290]: public.ecr.aws/palette-ai/palette-mcp-server
                      - text: . We recommend pinning to a specific version tag rather than
                      - code [ref=e291]: :latest
                      - text: so that automatic updates do not change the server behind your MCP client configuration.
                  - listitem [ref=e292]:
                    - paragraph [ref=e293]:
                      - text: The
                      - link "Palette Agent Toolkit plugin" [ref=e294] [cursor=pointer]:
                        - /url: https://github.com/spectrocloud/palette-agent-toolkit
                      - text: for Claude Code and Claude Desktop. The plugin bundles the MCP server configuration and four diagnostic skills (
                      - code [ref=e295]: diagnose-cluster
                      - text: ","
                      - code [ref=e296]: diagnose-edge
                      - text: ","
                      - code [ref=e297]: health-overview
                      - text: ", and"
                      - code [ref=e298]: access-review
                      - text: ) in a single install. Refer to the
                      - link "Set Up MCP Server with Claude Code" [ref=e299] [cursor=pointer]:
                        - /url: /automation/palette-mcp/setup/mcp-setup-claude/
                      - text: guide.
                - paragraph [ref=e300]: "The following list provides an overview of how to configure and use the Palette MCP server:"
                - list [ref=e301]:
                  - listitem [ref=e302]:
                    - paragraph [ref=e303]:
                      - text: Install an MCP client on your local machine or environment. Popular clients are
                      - link "Claude Code" [ref=e304] [cursor=pointer]:
                        - /url: https://code.claude.com/docs/en/overview
                      - text: ","
                      - link "Cursor" [ref=e305] [cursor=pointer]:
                        - /url: https://cursor.com/get-started
                      - text: ","
                      - link "Antigravity" [ref=e306] [cursor=pointer]:
                        - /url: https://antigravity.google/
                      - text: ", and"
                      - link "Codex" [ref=e307] [cursor=pointer]:
                        - /url: https://github.com/openai/codex
                      - text: .
                  - listitem [ref=e308]:
                    - paragraph [ref=e309]:
                      - text: The Palette MCP server expects a handful of parameters in order to connect to Palette. Refer to
                      - link "Server Configuration" [ref=e310] [cursor=pointer]:
                        - /url: "#server-configuration"
                      - text: for more information.
                  - listitem [ref=e311]:
                    - paragraph [ref=e312]:
                      - text: Configure the Palette MCP server in your MCP client. Claude Code and Claude Desktop customers can install the Palette Agent Toolkit plugin, which bundles the MCP server and diagnostic skills. All other clients configure the MCP server manually using the container image from
                      - link "Amazon Elastic Container Registry (ECR)" [ref=e313] [cursor=pointer]:
                        - /url: https://aws.amazon.com/ecr/
                      - text: ", or the native binary downloaded from"
                      - link "GitHub Releases" [ref=e314] [cursor=pointer]:
                        - /url: https://github.com/spectrocloud/palette-agent-toolkit/releases
                      - text: .
                  - listitem [ref=e315]:
                    - paragraph [ref=e316]: The MCP server is now ready to use. Your queries are sent to the Palette API to perform the requested operations.
                - heading "Server ConfigurationDirect link to Server Configuration" [level=2] [ref=e317]:
                  - text: Server Configuration
                  - link "Direct link to Server Configuration" [ref=e318] [cursor=pointer]:
                    - /url: "#server-configuration"
                    - text: "#"
                - paragraph [ref=e319]: The Palette MCP server accepts the following environment variables and startup flags.
                - heading "Environment VariablesDirect link to Environment Variables" [level=3] [ref=e320]:
                  - text: Environment Variables
                  - link "Direct link to Environment Variables" [ref=e321] [cursor=pointer]:
                    - /url: "#environment-variables"
                    - text: "#"
                - table [ref=e322]:
                  - rowgroup [ref=e323]:
                    - row "Variable Description" [ref=e324]:
                      - columnheader "Variable" [ref=e325]:
                        - strong [ref=e326]: Variable
                      - columnheader "Description" [ref=e327]:
                        - strong [ref=e328]: Description
                  - rowgroup [ref=e329]:
                    - 'row "PALETTE_HOST API endpoint for your Palette installation. For example: api.spectrocloud.com. Required." [ref=e330]':
                      - cell "PALETTE_HOST" [ref=e331]:
                        - code [ref=e332]: PALETTE_HOST
                      - 'cell "API endpoint for your Palette installation. For example: api.spectrocloud.com. Required." [ref=e333]':
                        - text: "API endpoint for your Palette installation. For example:"
                        - code [ref=e334]: api.spectrocloud.com
                        - text: . Required.
                    - row "PALETTE_API_KEY Palette API key used for authentication. Required, unless you use PALETTE_AUTH_TOKEN instead." [ref=e335]:
                      - cell "PALETTE_API_KEY" [ref=e336]:
                        - code [ref=e337]: PALETTE_API_KEY
                      - cell "Palette API key used for authentication. Required, unless you use PALETTE_AUTH_TOKEN instead." [ref=e338]:
                        - link "Palette API key" [ref=e339] [cursor=pointer]:
                          - /url: /user-management/authentication/api-key/
                        - text: used for authentication. Required, unless you use
                        - code [ref=e340]: PALETTE_AUTH_TOKEN
                        - text: instead.
                    - row "PALETTE_AUTH_TOKEN A JSON Web Token (JWT) that you can use as an alternative to PALETTE_API_KEY." [ref=e341]:
                      - cell "PALETTE_AUTH_TOKEN" [ref=e342]:
                        - code [ref=e343]: PALETTE_AUTH_TOKEN
                      - cell "A JSON Web Token (JWT) that you can use as an alternative to PALETTE_API_KEY." [ref=e344]:
                        - text: A JSON Web Token (JWT) that you can use as an alternative to
                        - code [ref=e345]: PALETTE_API_KEY
                        - text: .
                    - row "PALETTE_PROJECT_UID Project ID that scopes read operations. If the API key is not tenant-admin scoped, you must set this value. Otherwise, many read tools return an OperationForbidden error." [ref=e346]:
                      - cell "PALETTE_PROJECT_UID" [ref=e347]:
                        - code [ref=e348]: PALETTE_PROJECT_UID
                      - cell "Project ID that scopes read operations. If the API key is not tenant-admin scoped, you must set this value. Otherwise, many read tools return an OperationForbidden error." [ref=e349]:
                        - link "Project ID" [ref=e350] [cursor=pointer]:
                          - /url: /tenant-settings/projects/#project-id
                        - text: that scopes read operations. If the API key is not tenant-admin scoped, you must set this value. Otherwise, many read tools return an
                        - code [ref=e351]: OperationForbidden
                        - text: error.
                - heading "Startup FlagsDirect link to Startup Flags" [level=3] [ref=e352]:
                  - text: Startup Flags
                  - link "Direct link to Startup Flags" [ref=e353] [cursor=pointer]:
                    - /url: "#startup-flags"
                    - text: "#"
                - table [ref=e354]:
                  - rowgroup [ref=e355]:
                    - row "Flag Description" [ref=e356]:
                      - columnheader "Flag" [ref=e357]:
                        - strong [ref=e358]: Flag
                      - columnheader "Description" [ref=e359]:
                        - strong [ref=e360]: Description
                  - rowgroup [ref=e361]:
                    - row "--allow-write Enables write tools, such as create, update, and delete. Without this flag, write tools return PALETTE_WRITE_DISABLED and the server operates in read-only mode. Delete tools additionally require a typed-name confirmation." [ref=e362]:
                      - cell "--allow-write" [ref=e363]:
                        - code [ref=e364]: "--allow-write"
                      - cell "Enables write tools, such as create, update, and delete. Without this flag, write tools return PALETTE_WRITE_DISABLED and the server operates in read-only mode. Delete tools additionally require a typed-name confirmation." [ref=e365]:
                        - text: Enables write tools, such as create, update, and delete. Without this flag, write tools return
                        - code [ref=e366]: PALETTE_WRITE_DISABLED
                        - text: and the server operates in read-only mode. Delete tools additionally require a typed-name confirmation.
                    - row "--audit-file Path to a local JSONL audit log. When set, the server records every tool call, including successes, failures, validation rejections, and write-disabled outcomes." [ref=e367]:
                      - cell "--audit-file" [ref=e368]:
                        - code [ref=e369]: "--audit-file"
                      - cell "Path to a local JSONL audit log. When set, the server records every tool call, including successes, failures, validation rejections, and write-disabled outcomes." [ref=e370]
                - heading "SecurityDirect link to Security" [level=2] [ref=e371]:
                  - text: Security
                  - link "Direct link to Security" [ref=e372] [cursor=pointer]:
                    - /url: "#security"
                    - text: "#"
                - paragraph [ref=e373]: The Palette MCP server runs in your infrastructure environment. Any credentials or secrets you provide to the server are stored in the process environment at runtime and in the configuration file that starts it.
                - paragraph [ref=e374]:
                  - text: The Palette MCP server uses a Palette API key or JWT to authenticate with the Palette API. This means that the MCP server has the same permissions as the credentials used to authenticate with the Palette API. Actions performed by the MCP server can be audited through the
                  - link "Palette audit logs" [ref=e375] [cursor=pointer]:
                    - /url: /audit-logs/
                  - text: . When reviewing the audit logs, search for the user that is associated with the credentials used by the Palette MCP server. You can also enable the local
                  - code [ref=e376]: "--audit-file"
                  - text: audit log for a JSONL record of every tool call the server processes.
                - paragraph [ref=e377]:
                  - text: The Palette MCP server operates in read-only mode by default. Write tools remain in the tool list but return
                  - code [ref=e378]: PALETTE_WRITE_DISABLED
                  - text: until you start the server with the
                  - code [ref=e379]: "--allow-write"
                  - text: flag. Delete tools additionally require the caller to type back the resource name, or the email address for user deletion, before the server issues the delete call.
                - paragraph [ref=e380]:
                  - text: The Palette MCP server uses the transport protocol
                  - code [ref=e381]: stdio
                  - text: to communicate with the configured MCP client. With
                  - code [ref=e382]: stdio
                  - text: ", the MCP server communicates by sending direct JSON-Remote Procedure Call (RPC) messages to the MCP client in the local compute environment instead of sending requests over the network. Communication between the Palette MCP server and the Palette API is encrypted using Transport Layer Security (TLS). We recommend reviewing the MCP protocol's documentation on"
                  - link "transport mechanisms" [ref=e383] [cursor=pointer]:
                    - /url: https://modelcontextprotocol.io/specification/2025-11-25/basic/transports
                  - text: to learn more about the security of the transport protocol.
                - heading "Prompt InjectionDirect link to Prompt Injection" [level=3] [ref=e384]:
                  - text: Prompt Injection
                  - link "Direct link to Prompt Injection" [ref=e385] [cursor=pointer]:
                    - /url: "#prompt-injection"
                    - text: "#"
                - paragraph [ref=e386]:
                  - text: The Palette MCP server is controlled by the prompts provided to the Large Language Model (LLM) that is used by the configured MCP client. We recommend you use an LLM model that your organization has approved for use in your environment. Write operations, such as deletion, are controlled by the
                  - code [ref=e387]: "--allow-write"
                  - text: startup flag. However, if you have configured the MCP server to allow write operations, you should be aware of the risks associated with prompt injection. Take the proper precautions to prevent prompt injection by limiting access to the MCP client and providing prompts to the LLM.
                - paragraph [ref=e388]: Prompt injection is a lower-risk attack when your MCP client is a local workstation. Prompt injections are a more serious concern when an LLM service is exposed on behalf of other users who provide prompts to the LLM.
                - heading "Best PracticesDirect link to Best Practices" [level=3] [ref=e389]:
                  - text: Best Practices
                  - link "Direct link to Best Practices" [ref=e390] [cursor=pointer]:
                    - /url: "#best-practices"
                    - text: "#"
                - paragraph [ref=e391]: "When using the Palette MCP server, we recommend the following security best practices:"
                - list [ref=e392]:
                  - listitem [ref=e393]: Use a project-scoped API key rather than a tenant-admin key. In write mode, a tenant-admin key can create, modify, or delete other users and their roles.
                  - listitem [ref=e394]: In a production environment, use a dedicated user where you manage the role permissions for the Palette MCP server.
                  - listitem [ref=e395]:
                    - text: Review the
                    - code [ref=e396]: "--allow-write"
                    - text: flag and only enable it if you need to perform write operations. By default, write operations are disabled.
                  - listitem [ref=e397]:
                    - text: Enable the
                    - code [ref=e398]: "--audit-file"
                    - text: flag to record a local JSONL log of every tool call for review.
                  - listitem [ref=e399]: Use a dedicated folder on your machine when configuring the mount path for kubeconfig files. Avoid using an existing folder that is used for other purposes, including maintaining other kubeconfig files.
                  - listitem [ref=e400]:
                    - text: Use a
                    - code [ref=e401]: .env-mcp
                    - text: file when configuring the Palette MCP server. Setting the environment variables using the
                    - code [ref=e402]: "-e"
                    - text: or
                    - code [ref=e403]: "--environment"
                    - text: flag in the terminal exposes secrets to the command line and potentially logs.
                  - listitem [ref=e404]:
                    - text: Rotate the Palette API key for the Palette MCP server regularly. To rotate the API key, you can create a new API key and update the
                    - code [ref=e405]: .env-mcp
                    - text: file with the new API key. If you used inline
                    - code [ref=e406]: "-e"
                    - text: or
                    - code [ref=e407]: "--environment"
                    - text: flags, you must update the API key provided to the flags.
                  - listitem [ref=e408]:
                    - text: If you use the container image, pin to a specific version tag rather than
                    - code [ref=e409]: :latest
                    - text: .
                  - listitem [ref=e410]: Use an LLM you trust or that has enterprise controls related to data protection and privacy.
                - heading "Next StepsDirect link to Next Steps" [level=2] [ref=e411]:
                  - text: Next Steps
                  - link "Direct link to Next Steps" [ref=e412] [cursor=pointer]:
                    - /url: "#next-steps"
                    - text: "#"
                - paragraph [ref=e413]:
                  - text: Refer to the applicable setup guide for
                  - link "Claude" [ref=e414] [cursor=pointer]:
                    - /url: /automation/palette-mcp/setup/mcp-setup-claude/
                  - text: ","
                  - link "Cursor" [ref=e415] [cursor=pointer]:
                    - /url: /automation/palette-mcp/setup/mcp-setup-cursor/
                  - text: ", or"
                  - link "Antigravity" [ref=e416] [cursor=pointer]:
                    - /url: /automation/palette-mcp/setup/mcp-setup-antigravity/
                  - text: .
              - generic [ref=e417]:
                - generic [ref=e419]:
                  - text: "Tags:"
                  - list [ref=e420]:
                    - listitem [ref=e421]:
                      - link "ai" [ref=e422] [cursor=pointer]:
                        - /url: /tags/ai/
                    - listitem [ref=e423]:
                      - link "mcp" [ref=e424] [cursor=pointer]:
                        - /url: /tags/mcp/
                    - listitem [ref=e425]:
                      - link "automation" [ref=e426] [cursor=pointer]:
                        - /url: /tags/automation/
                - link "Edit this page" [ref=e429] [cursor=pointer]:
                  - /url: https://github.com/spectrocloud/librarium/blob/master/docs/docs-content/automation/palette-mcp/architecture.md
                  - img [ref=e430]
                  - text: Edit this page
            - navigation "Docs pages" [ref=e434]:
              - link "Previous « Palette MCP Server" [ref=e435] [cursor=pointer]:
                - /url: /automation/palette-mcp/
                - generic [ref=e436]: Previous
                - generic [ref=e437]: « Palette MCP Server
              - link "Next Set Up MCP Server with Claude Code »" [ref=e438] [cursor=pointer]:
                - /url: /automation/palette-mcp/setup/mcp-setup-claude/
                - generic [ref=e439]: Next
                - generic [ref=e440]: Set Up MCP Server with Claude Code »
          - list [ref=e443]:
            - listitem [ref=e444]:
              - link "Server Configuration" [ref=e445] [cursor=pointer]:
                - /url: "#server-configuration"
              - list [ref=e446]:
                - listitem [ref=e447]:
                  - link "Environment Variables" [ref=e448] [cursor=pointer]:
                    - /url: "#environment-variables"
                - listitem [ref=e449]:
                  - link "Startup Flags" [ref=e450] [cursor=pointer]:
                    - /url: "#startup-flags"
            - listitem [ref=e451]:
              - link "Security" [ref=e452] [cursor=pointer]:
                - /url: "#security"
              - list [ref=e453]:
                - listitem [ref=e454]:
                  - link "Prompt Injection" [ref=e455] [cursor=pointer]:
                    - /url: "#prompt-injection"
                - listitem [ref=e456]:
                  - link "Best Practices" [ref=e457] [cursor=pointer]:
                    - /url: "#best-practices"
            - listitem [ref=e458]:
              - link "Next Steps" [ref=e459] [cursor=pointer]:
                - /url: "#next-steps"
  - button "Project Logo Ask AI" [ref=e460] [cursor=pointer]:
    - generic [ref=e463]:
      - img "Project Logo" [ref=e464]
      - paragraph [ref=e465]: Ask AI
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