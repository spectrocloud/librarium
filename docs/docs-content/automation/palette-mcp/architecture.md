---
sidebar_label: "Architecture"
title: "Architecture"
description: "Learn about the architecture of the Palette MCP."
hide_table_of_contents: false
sidebar_position: 10
tags: ["ai", "mcp", "automation"]
---

The [Palette MCP server](https://github.com/spectrocloud/palette-mcp-server) is a local-first Model Context Protocol (MCP) server that runs on your machine or environment as a container or a native binary. The server communicates with the configured Palette instance and performs the required API operations.

The Palette MCP server ships in two forms:

- The `public.ecr.aws/palette-ai/palette-mcp-server` container image. We recommend pinning to a specific
  version tag rather than `:latest` so that automatic updates do not change the server behind your MCP client
  configuration.

- The Native binary published on [GitHub Releases](https://github.com/spectrocloud/palette-mcp-server/releases) for macOS on Apple Silicon, macOS on Intel, and Linux on x86_64. Windows is not supported as a native binary. On Windows, use the container image.

The following list provides an overview of how to configure and use the Palette MCP server:

1. Install an MCP client on your local machine or environment. Popular clients are
   [Cursor](https://cursor.com/get-started), [Claude Code](https://code.claude.com/docs/en/overview), and
   [Gemini CLI](https://geminicli.com/).

2. The Palette MCP server expects a handful of parameters in order to connect to Palette. Refer to
   [Server Configuration](#server-configuration) for more information.

3. Configure the Palette MCP server as a custom MCP server in your MCP client to use the tools it provides. The Palette
   MCP server runs as a local container from an image hosted in
   [Amazon Elastic Container Registry (ECR)](https://aws.amazon.com/ecr/), or as a native binary downloaded from
   [GitHub Releases](https://github.com/spectrocloud/palette-mcp-server/releases).

4. The MCP server is now ready to use. Your queries are sent to the Palette API to perform the requested operations.

## Server Configuration

The Palette MCP server accepts the following environment variables and startup flags.

### Environment Variables

| **Variable**          | **Description**                                                                                                                                                                                                                                     |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PALETTE_HOST`        | API endpoint for your Palette installation. For example: `api.spectrocloud.com`. Required.                                                                                                                                                          |
| `PALETTE_API_KEY`     | [Palette API key](../../user-management/authentication/api-key/api-key.md) used for authentication. Required, unless you use `PALETTE_AUTH_TOKEN` instead.                                                                                          |
| `PALETTE_AUTH_TOKEN`  | A JSON Web Token (JWT) that you can use as an alternative to `PALETTE_API_KEY`.                                                                                                                                                                     |
| `PALETTE_PROJECT_UID` | [Project ID](../../tenant-settings/projects/projects.md#project-id) that scopes read operations. If the API key is not tenant-admin scoped, you must set this value. Otherwise, many read tools return an `OperationForbidden` error.               |

### Startup Flags

| **Flag**        | **Description**                                                                                                                                                                                                                 |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--allow-write` | Enables write tools, such as create, update, and delete. Without this flag, write tools return `PALETTE_WRITE_DISABLED` and the server operates in read-only mode. Delete tools additionally require a typed-name confirmation. |
| `--audit-file`  | Path to a local JSONL audit log. When set, the server records every tool call, including successes, failures, validation rejections, and write-disabled outcomes.                                                               |

## Security

The Palette MCP server runs in your infrastructure environment. Any credentials or secrets you provide to the server are stored in the process environment at runtime and in the configuration file that starts it.

The Palette MCP server uses a Palette API key or JWT to authenticate with the Palette API. This means that the MCP server has the same permissions as the credentials used to authenticate with the Palette API. Actions performed by the MCP server can be audited through the [Palette audit logs](../../audit-logs/audit-logs.md). When reviewing the audit logs, search for the user that is associated with the credentials used by the Palette MCP server. You can also enable the local `--audit-file` audit log for a JSONL record of every tool call the server processes.

The Palette MCP server operates in read-only mode by default. Write tools remain in the tool list but return `PALETTE_WRITE_DISABLED` until you start the server with the `--allow-write` flag. Delete tools additionally require the caller to type back the resource name, or the email address for user deletion, before the server issues the delete call.

The Palette MCP server uses the transport protocol `stdio` to communicate with the configured MCP client. With `stdio`, the MCP server communicates by sending direct JSON-Remote Procedure Call (RPC) messages to the MCP client in the local compute environment instead of sending requests over the network. Communication between the Palette MCP server and the Palette API is encrypted using Transport Layer Security (TLS). We recommend reviewing the MCP protocol's documentation on [transport mechanisms](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports) to learn more about the security of the transport protocol.

### Prompt Injection

The Palette MCP server is controlled by the prompts provided to the Large Language Model (LLM) that is used by the configured MCP client. We recommend you use an LLM model that your organization has approved for use in your environment. Write operations, such as deletion, are controlled by the `--allow-write` startup flag. However, if you have configured the MCP server to allow write operations, you should be aware of the risks associated with prompt injection. Take the proper precautions to prevent prompt injection by limiting access to the MCP client and providing prompts to the LLM.

Prompt injection is a lower-risk attack when your MCP client is a local workstation. Prompt injections are a more serious concern when an LLM service is exposed on behalf of other users who provide prompts to the LLM.

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
- If you use the container image, pin to a specific version tag rather than `:latest`.
- Use an LLM you trust or that has enterprise controls related to data protection and privacy.

## Next Steps

Refer to the applicable setup guide for [Claude](./setup/mcp-setup-claude.md), [Cursor](./setup/mcp-setup-cursor.md), or
the [Gemini CLI](./setup/mcp-setup-gemini.md).
