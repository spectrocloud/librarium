---
sidebar_label: "Register an External Inference Endpoint"
title: "Register an External Inference Endpoint"
description:
  "Step-by-step guidance for platform operators on how to register an OpenAI-compatible external inference endpoint,
  authorize a client to use it, and route requests to its models."
hide_table_of_contents: false
sidebar_position: 6.3
tags: ["paletteai-inference-launchpad", "models", "how-to"]
keywords: ["launchpad", "ai", "external", "inference", "endpoint", "egress", "integrations", "openrouter"]
---

This guide explains how to register an OpenAI-compatible inference host as an external inference endpoint on a PaletteAI
Inference Launchpad appliance, authorize a client to use it, and route the client's requests to a model the host serves.
To understand how registered endpoints relate to built-in frontier providers and how the appliance meters their traffic
together as egress, refer to [Clients and Quotas](../explanation/clients-and-quotas.md).

## Prerequisites

- A running PaletteAI Inference Launchpad appliance, with the admin console reachable and operator access.
- The endpoint's URL, reachable from the appliance, and a key if the host requires one.
- An existing client to authorize. To create one, refer to [Create a Client](./create-a-client.md).
- Egress permitted for the appliance. Box sovereignty overrides every client's egress setting. When sovereignty is
  armed, no request leaves the appliance, and a client's chip reads **Blocked by sovereignty**. To check or disarm it,
  open **Access & Policy → Sovereignty**.

## Register the Endpoint

1. From the left main menu, select **Integrations**.

2. In **External inference endpoints**, under **Add an endpoint**, enter an **Endpoint id**, the **Endpoint URL**, and
   the **Key** if the host requires one. Enter the origin only, such as `https://host.example.com`. The id is a short
   name that becomes the routing prefix. It cannot be changed later, and it must not be `anthropic`, `openai`, or
   `gemini`; registration refuses those ids.

3. _(Optional)_ Enter **Input $/1M tokens** and **Output $/1M tokens** so usage is priced at the rates you set. If you
   leave them blank, the appliance applies a generic rate.

4. Select **Probe models**. The appliance contacts the host and lists the models it serves. A bad key or an unreachable
   host reports the failure and stores nothing.

5. Review **Discovered models**, then select **Add endpoint**. Review the preview, and then select **Confirm & apply**.

The list shows the endpoint as **enabled**, with its URL, model count, and a **key set** indicator when a key is stored.
The key is never shown again.

To stop routing to the endpoint without deleting it, select **Disable**. To remove it, select **Remove**. Either change
takes effect immediately. A rule that still points at that endpoint falls back to a local model instead of failing.

## Authorize a Client

1. From the left main menu, select **Access & Policy**.

2. On the **Clients & API tokens** page, select the client to open its detail panel.

3. Select the **Egress** section, and then select **Enable egress**.

4. Select **Add provider key**. The **Add provider key** dialog opens.

5. In **Provider**, select the endpoint id you registered. Registered endpoint ids appear alongside `anthropic`,
   `openai`, and `gemini`. The **Key** field is hidden, and the dialog reads:

   > This endpoint's key is set once at registration and shared by every client.

   The credential is box-global. On the **Egress** table, the **Key** column shows **box-managed** for the row.

6. Set a positive **Daily limit**, and then select **Save**. A limit of `$0` blocks the client from that endpoint, and
   the table shows **$0 blocked**.

Repeat for each client that should reach the endpoint. Refer to
[Allow a Client to Reach External Models](./manage-client-model-access.md#allow-a-client-to-reach-external-models).

## Route Requests to the Endpoint

1. Open the client's **Routing** section.

2. In the **Tier map**, select **Add alias rule**, or edit an existing row.

3. Set the **Alias prefix**, then open **Model**. Registered endpoint models appear as `<id> / <model>` alongside local
   models and frontier targets. Select the model you want.

4. Save the client.

Requests that match that alias go to the registered host and are counted as egress.

## Validate the Endpoint

Send a request through the appliance that matches an alias rule you just routed to the endpoint, then confirm the
appliance metered it as egress from that endpoint.

1. From a client with a valid API token, call the alias you routed to the endpoint.

2. From the left main menu, select **Usage**.

3. Select the **By Model** tab. A row served by a registered endpoint is labeled **External · egress**. To review a
   single client's split of local versus egress traffic, refer to [View Client Usage](./view-client-usage.md).

## Next Steps

- [Manage a Client's Model Access](./manage-client-model-access.md)
- [View Client Usage](./view-client-usage.md)
- [Create a Client](./create-a-client.md)
