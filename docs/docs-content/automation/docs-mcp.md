---
sidebar_label: "Documentation MCP Server"
title: "Documentation MCP Server"
description: "Learn how to use MCP server for the Palette documentation."
hide_table_of_contents: false
sidebar_position: 60
tags: ["ai", "mcp", "automation"]
---

The Palette Docs Ask AI MCP server, powered by [Kapa](https://www.kapa.ai/), lets AI tools query the
[Spectro Cloud documentation](https://docs.spectrocloud.com/) with natural language and return grounded, source-linked
answers. Connect it to any Model Context Protocol (MCP) client and your assistant can look up Palette architecture,
deployment modes, features, and product behavior without you copy-pasting from the docs site.

## Server Endpoint

<!-- TODO(DOC-2706): confirm final MCP URL with Kapa (spectro-cloud vs paletteai). -->

Configure your MCP client to connect to the following HTTP endpoint:

```text
https://spectro-cloud.mcp.kapa.ai
```

Refer to your MCP client's documentation for the exact steps to register a remote HTTP MCP server.

## Authentication

The Docs Ask AI MCP server requires authentication. The first time your MCP client connects to the server, you are
prompted to sign in with a Google or GitHub account. After you complete the sign-in, the client stores the credential and
reuses it on subsequent connections.

Kapa uses authentication to prevent abuse and enforce rate limits. Queries are anonymous; Kapa associates them with an
internal identifier and does not link them to your account beyond rate limiting.

## Reduce Context Usage with a Subagent

Docs Ask AI responses can consume a substantial portion of the primary conversation context because each response
includes documentation excerpts alongside the summary. To keep the main context clean, delegate documentation queries
to a dedicated subagent that owns access to the Docs Ask AI MCP tool. The subagent runs the MCP tool in an isolated
context and returns only its distilled answer to your main session. For example, Claude Code supports this pattern
through its [subagents](https://code.claude.com/docs/en/sub-agents) feature.