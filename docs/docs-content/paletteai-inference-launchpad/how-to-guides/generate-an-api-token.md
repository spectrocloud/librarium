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

This guide explains how to generate an API token in the PaletteAI Inference Launchpad console. Clients such as coding
assistants use the token to authenticate their requests to the appliance. To understand how tokens, clients, and quotas
relate, refer to [Clients and Quotas](../explanation/clients-and-quotas.md). To create a client and then set its quotas
and model access, start with [Create a Client](./create-a-client.md).

## Prerequisites

- A running PaletteAI Inference Launchpad appliance, with the console reachable.
- An existing client to issue the token to. To create one, refer to [Create a Client](./create-a-client.md).
- Console access with permission to create API tokens. Creating a token can require operator access.

## Generate an API Token

If an administrator already gave you an API token, you can use it and skip the following steps.

1. Open the appliance console in a browser and sign in.

2. From the left main menu, select **Access & Policy**. The **Clients & API tokens** page opens.

3. In the client's row, open the three-dot menu and select **Manage Client**. The client's detail panel opens to the
   **Overview** section.

4. Select the **API tokens** section, and then select **Create Token**. The **Create API token** dialog opens.

5. _(Optional)_ In the **Label** field, enter a name that identifies the token, such as the coding assistant that uses
   it.

6. _(Optional)_ To set an expiration date, clear **Never expires**, and then choose an **Expires** date. By default, the
   token does not expire.

7. Select **Create Token**.

8. When the console reveals the token, select **Copy**. The token begins with `lpai_`.

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
