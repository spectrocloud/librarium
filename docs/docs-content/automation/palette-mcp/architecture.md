---
sidebar_label: "Architecture"
title: "Architecture"
description: "Learn about the architecture of the Palette MCP."
hide_table_of_contents: false
sidebar_position: 10
tags: ["ai", "mcp", "automation"]
---

The [Palette MCP server](https://github.com/spectrocloud/palette-agent-toolkit) is a local-first Model Context Protocol
(MCP) server that runs on your machine or environment as a container or a native binary. The server communicates with
the configured Palette instance and performs the required API operations.

The Palette MCP server ships in the following forms:

- A native binary published on [GitHub Releases](https://github.com/spectrocloud/palette-agent-toolkit/releases) for
  macOS on Apple Silicon, macOS on Intel, Linux on x86_64, and Linux on ARM64. On Windows, use the container image.

- A container image at `public.ecr.aws/palette-ai/palette-mcp-server`. We recommend pinning to a specific version tag
  rather than `:latest` so that automatic updates do not change the server behind your MCP client configuration.

- The [Palette Agent Toolkit plugin](https://github.com/spectrocloud/palette-agent-toolkit) for Claude Code and Claude
  Desktop. The plugin bundles the MCP server configuration and four diagnostic skills (`diagnose-cluster`,
  `diagnose-edge`, `health-overview`, and `access-review`) in a single install. Refer to the
  [Set Up MCP Server with Claude Code](./setup/mcp-setup-claude.md) guide.

The server works with MCP clients such as [Claude Code](https://code.claude.com/docs/en/overview),
[Cursor](https://cursor.com/get-started), [Antigravity](https://antigravity.google/), and
[Codex](https://github.com/openai/codex). Claude Code and Claude Desktop customers can install the Palette Agent Toolkit
plugin; all other clients configure the server manually using the container image or the native binary, per the setup
guides under [Next Steps](#next-steps).

## Server Configuration

The Palette MCP server accepts the following environment variables and startup flags.

### Environment Variables

| **Variable**                   | **Description**                                                                                                                                             |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PALETTE_HOST`                 | API endpoint for your Palette installation. For example: `api.spectrocloud.com`. Required.                                                                  |
| `PALETTE_API_KEY`              | [Palette API key](../../user-management/authentication/api-key/api-key.md) used for authentication. Required, unless you use `PALETTE_AUTH_TOKEN` instead.  |
| `PALETTE_AUTH_TOKEN`           | A JSON Web Token (JWT) that you can use as an alternative to `PALETTE_API_KEY`.                                                                             |
| `PALETTE_CA_FILE`              | Path to a CA bundle for a self-hosted Palette instance behind a private CA. Applied once at server startup and shared by every named profile that needs it. |
| `PALETTE_INSECURE_SKIP_VERIFY` | Skips TLS certificate verification for the default profile. For lab or test environments only.                                                              |
| `PALETTE_PROFILES_FILE`        | Path to the named-profiles file, overriding the default `~/.palette/auth_profiles.yaml`.                                                                    |

:::warning

`PALETTE_PROJECT_UID` is no longer a supported environment variable. Setting it causes the server to refuse to start. If
you are upgrading from an earlier setup, remove it from your MCP client configuration—refer to
[Project Scoping](#project-scoping) below for the replacement.

:::

### Project Scoping

The Palette MCP server operates at tenant scope by default—every read returns results across every project your
credential can access. To scope a specific request to a single project, mention the project by name or
[Project ID](../../tenant-settings/projects/projects.md#project-id) in your prompt; the assistant passes it as that
call's `project_uid` argument. Most read tools accept a per-call `project_uid`, and write tools that need one take it as
their own argument.

If the API key is not tenant-admin scoped and a request is not scoped to a project it can access, the server returns an
`OperationForbidden` error—pass `project_uid` on that request to resolve it.

### Startup Flags

| **Flag**                    | **Description**                                                                                                                                                                                                                                                                             |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--allow-write`             | Enables write tools, such as create, update, and delete. Without this flag, write tools return `PALETTE_WRITE_DISABLED` and the server operates in read-only mode. Delete tools additionally require a typed-name confirmation (the resource name, or the email address for user deletion). |
| `--allow-direct-ssh`        | Enables the direct-SSH edge diagnostic tools and the direct-SSH path of `run_edge_diagnostic`. Off by default.                                                                                                                                                                              |
| `--allow-tunnel-ssh`        | Enables the tunnel-SSH edge diagnostic tools via Hubble's remote shell (the tunnel path of `run_edge_diagnostic`). Off by default.                                                                                                                                                          |
| `--tunnel-ssh-api-key-auth` | Permits the tunnel-SSH API-key authentication branch for profiles without a JWT. Off by default.                                                                                                                                                                                            |
| `--tunnel-ssh-state`        | Path to a JSON file that persists the tunnel's last-seen-remote-shell-enabled record, improving the error message when an opt-in has expired. Empty means in-memory only.                                                                                                                   |
| `--audit-file`              | Path to a local JSONL audit log. When set, the server records every tool call, including successes, failures, validation rejections, and write-disabled outcomes.                                                                                                                           |

## Security

The Palette MCP server runs in your infrastructure environment. Any credentials or secrets you provide to the server are
stored in the process environment at runtime and in the configuration file that starts it.

The Palette MCP server uses a Palette API key or JWT to authenticate with the Palette API. This means that the MCP
server has the same permissions as the credentials used to authenticate with the Palette API. Actions performed by the
MCP server can be audited through the [Palette audit logs](../../audit-logs/audit-logs.md). When reviewing the audit
logs, search for the user that is associated with the credentials used by the Palette MCP server. You can also enable
the local `--audit-file` audit log.

The Palette MCP server operates in read-only mode by default; write operations require the `--allow-write` startup flag.

The Palette MCP server uses the `stdio` transport to communicate with the configured MCP client, exchanging direct
JSON-Remote Procedure Call (RPC) messages locally instead of sending requests over the network. Communication with the
Palette API is encrypted using Transport Layer Security (TLS). Refer to the MCP protocol's documentation on
[transport mechanisms](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports) to learn more.

### Prompt Injection

The Palette MCP server is controlled by the prompts provided to the Large Language Model (LLM) used by the configured
MCP client. If you configure the MCP server to allow write operations, you should be aware of the risks associated with
prompt injection. Take the proper precautions to prevent prompt injection by limiting access to the MCP client and
reviewing the prompts provided to the LLM.

Prompt injection is a lower-risk attack when your MCP client is a local workstation. Prompt injections are a more
serious concern when an LLM service is exposed on behalf of other users who provide prompts to the LLM.

### Best Practices

When using the Palette MCP server, we recommend the following security best practices:

- Use a project-scoped API key rather than a tenant-admin key. In write mode, a tenant-admin key can create, modify, or
  delete other users and their roles.
- In a production environment, use a dedicated user where you manage the role permissions for the Palette MCP server.
- Review the `--allow-write` flag and only enable it if you need to perform write operations. By default, write
  operations are disabled.
- Enable the `--audit-file` flag to record a local JSONL log of every tool call for review.
- Use a dedicated folder on your machine when configuring the mount path for kubeconfig files. Avoid using an existing
  folder that is used for other purposes, including maintaining other kubeconfig files.
- Use a `.env-mcp` file when configuring the Palette MCP server. Setting the environment variables using the `-e` or
  `--environment` flag in the terminal exposes secrets to the command line and potentially logs.
- Rotate the Palette API key for the Palette MCP server regularly. To rotate the API key, you can create a new API key
  and update the `.env-mcp` file with the new API key. If you used inline `-e` or `--environment` flags, you must update
  the API key provided to the flags.
- Use an LLM approved by your organization, or one that has enterprise controls related to data protection and privacy.

## Next Steps

Refer to the applicable setup guide for [Claude](./setup/mcp-setup-claude.md), [Cursor](./setup/mcp-setup-cursor.md), or
[Antigravity](./setup/mcp-setup-antigravity.md).
