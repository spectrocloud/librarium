---
sidebar_label: "Manage a Client's Model Access"
title: "Manage a Client's Model Access"
description:
  "Step-by-step guidance for platform administrators on how to route a client to specific models and allow a client to
  reach external models on a PaletteAI Inference Launchpad appliance."
hide_table_of_contents: false
sidebar_position: 6
tags: ["paletteai-inference-launchpad", "clients", "models", "how-to"]
keywords: ["launchpad", "ai", "clients", "model access", "routing", "tier map", "egress", "frontier"]
---

This guide explains how a platform administrator controls which models a client uses on a PaletteAI Inference Launchpad
appliance. Model access depends on whether a model runs locally on the appliance or is reached through an external
provider.

- **Local models.** Every client with a valid API token can call every model served locally on the appliance. You do not
  grant access to local models. To choose which local model handles a client's requests, route the client with a tier
  map.
- **External models.** A new client cannot reach external models until you enable egress for it. External access is
  denied by default and is granted per client. External models include built-in frontier providers and hosts you
  register as external inference endpoints. Refer to
  [Register an External Inference Endpoint](./register-an-external-inference-endpoint.md).

To understand how clients and models relate, refer to [Clients and Quotas](../explanation/clients-and-quotas.md).

## Prerequisites

- A running PaletteAI Inference Launchpad appliance, with the console reachable.
- An existing client. To create one, refer to [Create a Client](./create-a-client.md).
- Console access with permission to manage clients. Managing clients can require operator access.
- _(External models only)_ For a built-in frontier provider, a provider key. For a registered endpoint, the endpoint
  already registered. Refer to [Register an External Inference Endpoint](./register-an-external-inference-endpoint.md).

## Route a Client to Specific Models

Use a client's tier map to route the client's model aliases to the models you choose.

1. From the left main menu, select **Access & Policy**.

2. On the **Clients & API tokens** page, select the client to open its detail panel.

3. Select the **Routing** section.

4. In the **Tier map**, select **Add alias rule**, or edit an existing row.

5. Set the **Alias prefix**, such as `claude-opus-`, and the **Model** it routes to. Local models, frontier targets, and
   models from a registered external inference endpoint appear in the picker. Endpoint models are listed as
   `<id> / <model>`.

6. Save the client.

The tier map applies to the selected client. Requests from other clients follow their own tier maps, so they are not
routed to that model unless you configure their tier maps as well.

<!--TODO: once published, add a sentence here linking to Configure Intelligent Routing and Semantic Domains (DOC-2926) for routing that goes beyond client-level model selection, such as semantic domains.-->

{/* NEEDS REVIEW: the tier map governs which model handles a client's requests by default. It is a routing overlay, not a hard access gate for local models. Confirm the operator-facing framing with an SME. */}

## Allow a Client to Reach External Models

Enable egress, then add each provider or registered endpoint the client may use.

1. From the left main menu, select **Access & Policy**.

2. On the **Clients & API tokens** page, select the client to open its detail panel.

3. Select the **Egress** section.

4. Select **Enable egress**.

5. Select **Add provider key**.

6. In **Provider**, select a built-in frontier provider or a registered endpoint id.

   - For a frontier provider, enter the provider key.
   - For a registered endpoint, the **Key** field is hidden. The credential was set when you registered the endpoint,
     and the table shows **box-managed**. To register an endpoint first, refer to
     [Register an External Inference Endpoint](./register-an-external-inference-endpoint.md).

7. Set a positive **Daily limit**, and then select **Save**. Egress is fail-closed on the cap, so a limit of `$0` blocks
   that provider or endpoint for the client, and the table shows **$0 blocked**.

Frontier-model bursting is configured separately and is out of scope for this guide.
{/* TODO: link to the frontier-model bursting guide once published. */}

## Next Steps

- [Register an External Inference Endpoint](./register-an-external-inference-endpoint.md)
- [Set and Manage Client Quotas](./manage-client-quotas.md)
- [View Client Usage](./view-client-usage.md)
- [Replace a Model](./replace-a-model.md)
