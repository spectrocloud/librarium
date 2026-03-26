---
sidebar_label: "Palette MCP Server"
title: "Palette MCP Server"
description: "Learn how to use the Palette MCP server with Palette and Palette VerteX."
hide_table_of_contents: false
sidebar_position: 0
tags: ["ai", "mcp", "automation"]
---

Model Context Protocol (MCP) servers allow AI models to interact with external tools, data sources, and services in a
structured and reliable way. Models that are connected to MCP servers can perform actions such as read files, query
databases, or call APIs, instead of only relying on their training data. AI tools connected to MCP servers are useful in
practical applications because they become active assistants, with capabilities far beyond generating text.

The [Palette MCP Server](https://github.com/spectrocloud/palette-mcp-server) wraps around the Palette API, allowing you
to use natural language perform actions on resources. The MCP server is a powerful automation tool that enables LLMs to
interact with Palette consistently without having to understand the complete Palette API.

The Palette MCP server allows you to perform the following actions:

- Gather information about clusters.
- Delete clusters.
- Gather information about cluster profiles.
- Delete cluster profiles.
- Download the [kubeconfig](../../clusters/cluster-management/kubeconfig.md) or admin kubeconfig for a cluster.
- Add tags to a variety of Palette resources.

## Resources

- [Architecture](./architecture.md)
- [Set Up MCP Server with Claude Code](./setup/mcp-setup-claude.md)
- [Set Up MCP Server with Cursor](./setup/mcp-setup-cursor.md)
- [Set Up MCP Server with Gemini CLI](./setup/mcp-setup-gemini.md).
- [Palette MCP Server Operations](./palette-mcp-operations.md)
