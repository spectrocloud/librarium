---
sidebar_label: "Create a Client"
title: "Create a Client"
description:
  "Step-by-step guidance for platform administrators on how to create a client on a PaletteAI Inference Launchpad
  appliance by stepping through the Add client wizard and issuing the client's first API token."
hide_table_of_contents: false
sidebar_position: 3
tags: ["paletteai-inference-launchpad", "clients", "how-to"]
keywords: ["launchpad", "ai", "clients", "add client", "api token", "lpai"]
---

This guide explains how a platform administrator creates a client on a PaletteAI Inference Launchpad appliance. A client
is a named team, business unit, or workload, represented by one or more API tokens. To understand what a client is and
how clients, API tokens, and quotas relate, refer to [Clients and Quotas](../explanation/clients-and-quotas.md).

To generate an API token by itself, without stepping through the full client setup, refer to
[Generate an API Token](./generate-an-api-token.md).

## Prerequisites

- A running PaletteAI Inference Launchpad appliance, with the console reachable.
- Console access with permission to manage clients. Managing clients can require operator access.

## Create a Client

Create a client through the **Add client** wizard. The wizard names the client, optionally sets a quota, optionally
grants model access, and optionally issues the client's first API token.

1. From the left main menu, select **Access & Policy**. The **Clients & API tokens** page opens.

2. Select **Add client**. The **Add client** wizard opens on the **Overview** step.

3. On the **Overview** step, enter a **Client name**, and then select **Next step**. The appliance assigns the client an
   immutable identifier and registers it as active.

4. _(Optional)_ On the **Quotas** step, add usage limits for the client, and then select **Next step**. For details,
   refer to [Set and Manage Client Quotas](./manage-client-quotas.md).

5. _(Optional)_ On the **Egress** step, select **Enable egress** to let the client reach external models, including
   built-in frontier providers and registered external inference endpoints, and then select **Next step**. External
   access is denied by default. To add a provider key or authorize a registered endpoint, and to set a daily spend cap,
   refer to [Manage a Client's Model Access](./manage-client-model-access.md#allow-a-client-to-reach-external-models).
   To register an endpoint first, refer to
   [Register an External Inference Endpoint](./register-an-external-inference-endpoint.md).

6. _(Optional)_ On the **Routing** step, leave the **Tier map** unchanged to route the client with the appliance's
   default model routing, or edit the **Tier map** to route the client's model aliases to specific models. Then select
   **Next step**. For details, refer to
   [Manage a Client's Model Access](./manage-client-model-access.md#route-a-client-to-specific-models).

7. On the **API tokens** step, select **Add API Token**. In the **Add API token** dialog, optionally enter a **Label**
   and an **Expires** date, and then select **Add Token**. Leave **Expires** blank for a token that never expires.

8. Select **Create client**.

9. When the console reveals the token, select **Copy**. The token begins with `lpai_`.

:::warning

The console shows the token only once and stores only a hash of it. Copy it now. If you lose it, revoke the token and
create a new one.

:::

A client can hold more than one API token. To add another token to a client later, refer to
[Generate an API Token](./generate-an-api-token.md).

## Verify the Client

Confirm that the appliance registered the client and its API token.

1. From the left main menu, select **Access & Policy**.

2. On the **Clients & API tokens** page, confirm the new client appears in the list under the name you gave it.

3. Select the client to open its detail panel, and then select the **API tokens** section.

4. Confirm the token you added appears with a state of **active**.

The client is ready to use once its token is active. To confirm the token works from end to end, connect a coding
assistant to the appliance with it, as described in [Use Claude Code](./use-claude-code.md).

## Next Steps

After you create a client, configure how much it can consume and which models it can reach.

- [Set and Manage Client Quotas](./manage-client-quotas.md)
- [Manage a Client's Model Access](./manage-client-model-access.md)
- [Register an External Inference Endpoint](./register-an-external-inference-endpoint.md)
- [View Client Usage](./view-client-usage.md)
- [Revoke or Delete a Client](./revoke-or-delete-a-client.md)
