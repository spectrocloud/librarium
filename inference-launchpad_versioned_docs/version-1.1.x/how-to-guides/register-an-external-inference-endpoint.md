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
- The endpoint's URL, reachable from the appliance.
- The credentials the host requires, if any. Credentials can be an API key, one or more custom headers, or both.
- If the endpoint's TLS certificate is self-signed or issued by a private Certificate Authority (CA), that certificate
  in Privacy-Enhanced Mail (PEM) format.
- An existing client to authorize. To create one, refer to [Create a Client](./create-a-client.md).
- Egress permitted for the appliance. Sovereignty must not be armed. To check or disarm it, refer to
  [Sovereignty and Egress](../explanation/clients-and-quotas.md#sovereignty-and-egress).

## Register the Endpoint

1. From the left main menu, select **Integrations**.

2. In **External inference endpoints**, under **Add an endpoint**, enter an **Endpoint id** and the **Endpoint URL**.
   The URL can be an origin, such as `https://host.example.com`, or an origin followed by a path prefix, such as
   `https://gateway.example.com/openai`. Do not include `/v1` in the URL. A URL that ends in `/v1` is refused, and
   nothing is stored. For the id's constraints and role, and for how the appliance handles the URL, refer to
   [External Inference Endpoints](../explanation/architecture.md#external-inference-endpoints).

3. Enter the **Key** if the host requires an API key. Otherwise, leave **Key** blank; the appliance sends no
   `Authorization` header.

4. _(Optional)_ Add one or more custom headers. In **Custom headers**, select **Add header**, and then enter a header
   name and its value. You can add up to 16 headers. Header values are stored as secrets and are not shown again after
   you save. A small set of transport-level header names is reserved and refused. When you edit an existing endpoint,
   leaving a header's value blank keeps the stored value.

5. _(Optional)_ Trust a self-signed or private CA certificate. Only supply a certificate when the endpoint's own TLS
   certificate is not signed by a publicly trusted CA. Expand **Advanced: self-signed or private CA**, and in **CA
   certificate (PEM)**, paste the endpoint's certificate or bundle in PEM format. When you edit an existing endpoint,
   the appliance shows the stored certificate in full.

6. _(Optional)_ Enter **Input $/1M tokens** and **Output $/1M tokens** so usage is priced at the rates you set. If you
   leave them blank, the appliance applies a generic rate.

7. Select **Probe models**. The appliance contacts the host and lists the models it serves. The appliance reports the
   failure and stores nothing if the key or a header is rejected, a header name is disallowed, more than 16 headers are
   set, the certificate is untrusted, or the host is unreachable.

8. Review **Discovered models**, then select **Add endpoint**. Review the preview, and then select **Confirm & apply**.

9. Confirm the endpoint appears in the list with an **enabled** chip, its URL, its model count, and a **key set** or
   **no key** indicator on its row. If you added custom headers, the row reports the header count and names. If you
   added a CA certificate, the row shows a **custom CA** indicator.

To stop routing to the endpoint without deleting it, select **Disable**. To delete it, select **Remove**. For the
fail-safe behavior that catches a routing rule still pointing at a disabled or removed endpoint, refer to
[External Inference Endpoints](../explanation/architecture.md#external-inference-endpoints).

## Authorize a Client

1. From the left main menu, select **Access & Policy**.

2. On the **Clients & API tokens** page, select the client to open its detail panel.

3. Select the **Egress** section, and then select **Enable egress**.

4. Select **Add provider key**. The **Add provider key** dialog opens.

5. In **Provider**, select the endpoint id you registered. The dialog hides the **Key** field for a registered endpoint
   and shows a **box-managed** chip on the row instead. For why, refer to
   [External Inference Endpoints](../explanation/architecture.md#external-inference-endpoints).

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

Send a request through the appliance that matches the alias you just routed to the endpoint, then confirm the appliance
metered it as egress from that endpoint.

1. From a client with a valid API token, call the alias you routed to the endpoint.

2. From the left main menu, select **Usage**.

3. Select the **By Model** tab and find the row labeled **External · egress**. For the metric field and the per-client
   split, refer to [Usage Metrics Reference: By Model Tab](../reference/usage-metrics-reference.md#by-model-tab).

## Next Steps

- [Manage a Client's Model Access](./manage-client-model-access.md)
- [View Client Usage](./view-client-usage.md)
- [Create a Client](./create-a-client.md)
