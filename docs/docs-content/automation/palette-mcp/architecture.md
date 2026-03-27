---
sidebar_label: "Architecture"
title: "Architecture"
description: "Learn about the architecture of the Palette MCP."
hide_table_of_contents: false
sidebar_position: 10
tags: ["ai", "mcp", "automation"]
---

The [Palette MCP server](https://github.com/spectrocloud/palette-mcp-server) is local-first Model Context Protocol (MCP)
server hosted in a container that is deployed on your machine or environment. The container communicates with the
configured Palette instance and performs the required API operations.

The following list provides an overview of how to configure and use the Palette MCP server:

- Install an MCP client on your local machine or environment. Popular clients are
  [Cursor](https://cursor.com/get-started), [Claude Code](https://code.claude.com/docs/en/overview), and
  [Gemini CLI](https://geminicli.com/).

- The Palette MCP server expects a handful parameters in order to connect to Palette. Refer to
  [Server Configuration](#server-configuration) for more information.

- Configure the Palette MCP server as a custom MCP server in your MCP client to use the tools it provides. The Palette
  MCP server starts up a local container from an image hosted in
  [Amazon Elastic Container Registry (ECR)](https://aws.amazon.com/ecr/).

- The MCP server is now ready to use. Your queries are sent to the Palette API to perform the requested operations.

![Palette MCP server architecture](/palette-mcp_architecture_overview.webp)

## Server Configuration

The Palette MCP server provides the following configuration parameters.

| **Parameter**                     | **Description**                                                                                                                                |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `SPECTROCLOUD_DEFAULT_PROJECT_ID` | [Project ID](../../tenant-settings/projects/projects.md#project-id) for all server operations.                                                 |
| `SPECTROCLOUD_APIKEY`             | [Palette API key](../../user-management/authentication/api-key/api-key.md) used for authentication.                                            |
| `SPECTROCLOUD_HOST`               | API endpoint for your Palette installation. For example: `api.spectrocloud.com`.                                                               |
| `ALLOW_DANGEROUS_ACTIONS`         | Controls whether the MCP server is allowed to perform dangerous actions, such as resource deletion. Disabled by default. Set to `1` to enable. |

## Next Steps

Refer to the applicable setup guide for [Claude](./setup/mcp-setup-claude.md), [Cursor](./setup/mcp-setup-cursor.md), or
the [Gemini CLI](./setup/mcp-setup-gemini.md).
