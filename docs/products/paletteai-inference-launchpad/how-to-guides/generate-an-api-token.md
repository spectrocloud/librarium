---
sidebar_label: "Generate an API Token"
title: "Generate an API Token"
description:
  "Step-by-step guidance on how to generate an API token in the PaletteAI Inference Launchpad console so that coding
  assistants and other clients can authenticate to the appliance."
hide_table_of_contents: false
sidebar_position: 4
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

1. From the left main menu, select **Access & Policy**. The **Clients & API tokens** page opens.

2. In the client's row, open the three-dot menu and select **Manage Client**. The client's detail panel opens to the
   **Overview** section.

3. Select the **API tokens** section, and then select **Create Token**. The **Create API token** dialog opens.

4. _(Optional)_ In the **Label** field, enter a name that identifies the token, such as the coding assistant that uses
   it.

5. In the **Expires** field, choose the last day the token works. The field is required, and the console describes it as
   `Token stops working at the end of this day. Pick a day within the next year.` The earliest date you can choose is
   tomorrow, and the latest is 366 days out. There is no option for a token that never expires.

6. Select **Create Token**.

7. When the console reveals the token, select **Copy**. The token begins with `lpai_`.

:::warning

The console shows the token only once and stores only a hash of it. Copy it now. If you lose it, revoke the token and
create a new one.

:::

## Track an Expiring Token

Every token in the client's **API tokens** section carries a state. A token within seven days of its expiry date shows
an **expiring soon** state, so you can replace it before it stops working. After the expiry date passes, the state
becomes **expired** and the appliance rejects every request that uses the token.

Tokens created before the appliance required an expiry date keep their unlimited lifetime.

## Next Steps

Use the token to connect a coding assistant to the appliance.

- [Use Claude Code](./use-claude-code.md)
- [Use Cursor](./use-cursor.md)
- [Use OpenAI Codex](./use-codex.md)
- [Use OpenCode](./use-opencode.md)
