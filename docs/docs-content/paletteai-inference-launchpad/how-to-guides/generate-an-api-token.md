---
sidebar_label: "Generate an API Token"
title: "Generate an API Token"
description:
  "Step-by-step guidance on how to generate an API token in the PaletteAI Inference Launchpad console so that coding
  assistants and other clients can authenticate to the appliance."
hide_table_of_contents: false
sidebar_position: 3
tags: ["paletteai-inference-launchpad", "api-token", "how-to"]
keywords: ["launchpad", "ai", "api token", "authentication", "lpai", "coding agent"]
---

<PartialsComponent category="paletteai-inference-launchpad" name="unreleased-banner" />

This guide explains how to generate an API token in the PaletteAI Inference Launchpad console. Clients such as coding
assistants use the token to authenticate their requests to the appliance. To understand how tokens, clients, and quotas
relate, refer to [Clients and Quotas](../explanation/clients-and-quotas.md).

## Prerequisites

- A running PaletteAI Inference Launchpad appliance, with the console reachable.
- Console access with permission to create API tokens. Creating a token can require operator access.

## Generate an API Token

If an administrator already gave you an API token, you can use it and skip the following steps.

1. Open the appliance console in a browser and sign in.

2. From the left main menu, select **Access & Policy**. The **Clients & API tokens** page opens.

3. Mint the token for a client:

   - For a new client, select **Add client** and complete the wizard to the **API tokens** step.
   - For an existing client, open its row and use its **API tokens** section.

4. Select **Mint an API token**, and optionally set a **Label** and an **Expires** date.

5. When the console reveals the token, select **Copy**. The token begins with `lpai_`.

:::warning

The console shows the token only once and stores only a hash of it. Copy it now. If you lose it, revoke the token and
create a new one.

:::

## Next Steps

Use the token to connect a coding assistant to the appliance.

- [Use Claude Code](./use-claude-code.md)
- [Use Cursor](./use-cursor.md)
- [Use OpenAI Codex](./use-codex.md)
- [Use OpenCode](./use-opencode.md)
