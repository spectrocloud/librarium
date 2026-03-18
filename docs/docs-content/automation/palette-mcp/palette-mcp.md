---
sidebar_label: "Palette MCP Server"
title: "Palette MCP Server"
description: "Learn how to use the Palette MCP server with Palette and Palette VerteX."
hide_table_of_contents: false
sidebar_position: 0
tags: ["ai", "mcp", "automation"]
---

Model Context Protocol (MCP) servers allow AI models to interact with external tools, data sources, and services in a
structured and reliable way. Models connected to an MCP server can perform real actions such as reading files, querying
databases, or calling APIs, instead of relying solely on training data. AI models that are connected to MCP servers
operate as active assistants, with capabilities far beyond generating text.

The [Palette MCP Server](https://github.com/spectrocloud/palette-mcp-server) wraps around the Palette API, allowing you
to use natural language perform actions on resources. The MCP server is a very powerful automation tool that simplifies
Palette operations because it has the ability to perform multiple API operations in a single call.

The Palette MCP server supports the following functionality:

- Gather information about clusters.
- Delete a cluster.
- Gather information about cluster profiles.
- Delete a cluster profile.
- Download the [kubeconfig](../../clusters/cluster-management/kubeconfig.md) or admin kubeconfig for a cluster.

Check out [Palette MCP Server Operations](./palette-mcp-operations.md) to learn more.

## Resources

- [Architecture](./architecture.md)
- [Setup the Palette MCP Server](./setup/setup.md)
- [Palette MCP Server Operations](./palette-mcp-operations.md)
