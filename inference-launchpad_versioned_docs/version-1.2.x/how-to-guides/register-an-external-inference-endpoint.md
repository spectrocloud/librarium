---
sidebar_label: "Register an External Inference Endpoint"
title: "Register an External Inference Endpoint"
description:
  "Step-by-step guidance for platform administrators on how to register an OpenAI-compatible external inference endpoint
  under Integrations, authorize a policy to use it, and route requests to its models."
hide_table_of_contents: false
sidebar_position: 6.3
tags: ["paletteai-inference-launchpad", "models", "how-to"]
keywords: ["launchpad", "ai", "external", "inference", "endpoint", "egress", "integrations", "policy", "openrouter"]
---

This guide explains how to register an OpenAI-compatible inference host as an external inference endpoint on a PaletteAI
Inference Launchpad appliance, authorize a policy to use it, and route requests to a model the host serves. An endpoint
exists only after a platform administrator adds it under **Integrations**. A policy or a client then selects that
endpoint, and neither can create one. To understand how endpoints, keys, and policies relate, refer to
[External Inferencing](../explanation/frontier-providers.md).

## Prerequisites

- A running PaletteAI Inference Launchpad appliance, with the admin console reachable.
- Console access as a platform administrator. Only a platform administrator can add an endpoint under **Integrations**.
- The endpoint's URL, reachable from the appliance.
- The credentials the host requires, if any. Credentials can be an API key, one or more custom headers, or both.
- If the endpoint's TLS certificate is self-signed or issued by a private Certificate Authority (CA), that certificate
  in Privacy-Enhanced Mail (PEM) format.
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

## Authorize a Policy

Authorize the endpoint on a policy so that every client in the workspaces that follow the policy can reach it.

1. In the workspace drop-down menu in the console header, select **All workspaces**.

2. From the left main menu, select **Access & Policy**, and then select the **Policies** tab.

3. Select **Create policy** to start a new policy, or open the three-dot menu on a policy's row and select **Edit**. For
   a new policy, complete the **Overview** and **Quotas** steps.

4. Go to the **Egress** step of the wizard, or the **Egress** section of the **Edit policy** drawer.

5. Turn on **Enable external inferencing**.

   If no endpoint is set up under **Integrations**, the step shows the message `No endpoints are set up yet.` instead of
   the endpoint table. Register an endpoint first, as described in [Register the Endpoint](#register-the-endpoint).

6. Select **Add endpoint**. A row is added to the endpoint table.

7. In the **Endpoint** column, select the endpoint id you registered. The list offers only the endpoints that are set up
   under **Integrations**.

8. In the **Key** column, decide which key the policy uses for the endpoint.

   | **The Key field reads**                             | **What to do**                                                                                                                                                    |
   | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | `Using the Integrations key. Paste one to override` | Leave the field empty to use the key stored under **Integrations**. To use a different key for this policy, paste it. The pasted key applies to this policy only. |
   | `paste token`                                       | Paste a key. The appliance holds no key for this endpoint, so a key is required.                                                                                  |

   A key you paste here does not change the key under **Integrations**. Every other policy and client keeps using the
   **Integrations** key.

9. Repeat steps 6 through 8 for each endpoint the policy can use.

10. _(Optional)_ In the **Bursting** section, turn on **Enable bursting**. Bursting is available as soon as a listed
    endpoint has a key, whether the key comes from **Integrations** or from the **Key** column. If no listed endpoint
    has a key, the section reads `Add an endpoint and its key first.`

11. Go to the **Routing** step to route requests to the endpoint, as described in
    [Route Requests to the Endpoint](#route-requests-to-the-endpoint). To save the policy without changing its routing,
    select **Create policy**, or **Save changes** if you are editing a policy.

To give one client its own endpoint settings instead of its policy's, override the policy when you create the client.
Refer to
[Allow a Client to Reach External Models](./manage-client-model-access.md#allow-a-client-to-reach-external-models).

## Route Requests to the Endpoint

Continue in the same policy, on the **Routing** step of the wizard or the **Routing** section of the drawer.

1. In the **Tier map**, select **Add alias rule**, or edit an existing row.

2. Set the **Alias prefix**, and then open **Model**. The list offers local models and the models of every endpoint
   whose key the appliance proved, including a key that comes from **Integrations**. An external model appears as
   `<endpoint> / <model>`, with a marker that shows the request leaves the appliance. For example, `gemini` serving
   `gemini-2.5-pro` appears as `gemini / gemini-2.5-pro`. Select the model you want.

3. Select **Create policy**, or **Save changes** if you are editing a policy.

4. Select the **Workspaces** tab.

5. Open the three-dot menu on the workspace row and select **Manage**.

6. In the **Policy** field, choose the policy, and then select **Save changes**. To create a workspace that follows the
   policy instead, refer to [Create a Workspace](./create-a-workspace.md).

Requests that match that alias go to the endpoint and are counted as egress.

## Validate the Endpoint

Send a request through the appliance that matches the alias you just routed to the endpoint, then confirm the appliance
metered it as egress from that endpoint.

1. From a client in a workspace that follows the policy, use a valid API token to call the alias you routed to the
   endpoint.

2. From the left main menu, select **Usage**.

3. Select the **By Model** tab and find the row labeled **External · egress**. For the metric field and the per-client
   split, refer to [Usage Metrics Reference: By Model Tab](../reference/usage-metrics-reference.md#by-model-tab).

## Next Steps

- [Manage a Client's Model Access](./manage-client-model-access.md)
- [View Client Usage](./view-client-usage.md)
- [Create a Client](./create-a-client.md)
