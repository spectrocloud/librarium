---
sidebar_label: "Manage a Client's Model Access"
title: "Manage a Client's Model Access"
description:
  "Step-by-step guidance for platform administrators on how to route a client to specific models and allow a client to
  reach external models on a PaletteAI Inference Launchpad appliance."
hide_table_of_contents: false
sidebar_position: 6
tags: ["paletteai-inference-launchpad", "clients", "models", "how-to"]
keywords: ["launchpad", "ai", "clients", "model access", "routing", "tier map", "egress", "external inferencing"]
---

This guide explains how a platform administrator controls which models a client uses on a PaletteAI Inference Launchpad
appliance. Model access depends on whether a model runs locally on the appliance or is reached through an external
inference endpoint.

- **Local models.** Every client with a valid API token can call every model served locally on the appliance. You do not
  grant access to local models. To choose which local model handles a client's requests, route the client with a tier
  map.
- **External models.** A new client cannot reach external models until external inferencing is turned on for it.
  External access is denied by default. A client gets it from its workspace policy, or from its own settings when it
  overrides that policy. Every external model comes from an external inference endpoint that a platform administrator
  set up under **Integrations**. Refer to
  [Register an External Inference Endpoint](./register-an-external-inference-endpoint.md).

To understand how clients and models relate, refer to [Clients and Quotas](../explanation/clients-and-quotas.md).

## Prerequisites

- A running PaletteAI Inference Launchpad appliance, with the console reachable.
- _(Tier map only)_ An existing client. To create one, refer to [Create a Client](./create-a-client.md).
- Console access with permission to manage clients. Managing clients can require operator access.
- _(External models only)_ The endpoint set up under **Integrations** by a platform administrator. Refer to
  [Register an External Inference Endpoint](./register-an-external-inference-endpoint.md).

## Route a Client to Specific Models

Use a client's tier map to route the client's model aliases to the models you choose.

1. In the workspace drop-down menu in the console header, select the workspace that holds the client.

2. From the left main menu, select **Access & Policy**. The **Clients** list opens.

3. Select the client to open its detail panel.

4. Select the **Routing** section.

5. In the **Tier map**, select **Add alias rule**, or edit an existing row.

6. Set the **Alias prefix**, such as `claude-opus-`, and the **Model** it routes to. Local models and external models
   appear in the picker. An external model is listed as `<endpoint> / <model>`, such as `anthropic / claude-opus-4-8`,
   with a marker that shows the request leaves the appliance. The **Tier map** starts with seven seeded alias prefixes,
   `claude-fable-`, `claude-opus-`, `claude-sonnet-`, `claude-haiku-`, `gpt-`, `gemini-`, and `grok-`, which you can map
   but not remove.

7. Save the client.

The tier map applies to the selected client. Requests from other clients follow their own tier maps, so they are not
routed to that model unless you configure their tier maps as well. For requests the tier map does not settle, such as a
request that sends `auto`, refer to [Configure Semantic Routing](./configure-semantic-routing.md). For how the two
controls combine, refer to [Routing Behavior](../explanation/routing-behavior.md).

{/* NEEDS REVIEW: the tier map governs which model handles a client's requests by default. It is a routing overlay, not a hard access gate for local models. Confirm the operator-facing framing with an SME. */}

## Allow a Client to Reach External Models

A client reaches external models through its workspace policy. To let every client in a workspace reach an endpoint,
authorize the endpoint on the policy, as described in
[Authorize a Policy](./register-an-external-inference-endpoint.md#authorize-a-policy). To give one client its own
endpoint settings instead, override the policy when you create the client.

1. In the workspace drop-down menu in the console header, select the workspace for the new client.

2. From the left main menu, select **Access & Policy**. The **Clients** list opens.

3. Select **Add client**. The **Add client** wizard opens on the **Overview** step.

4. On the **Overview** step, enter a **Client name**, and then turn on **Override policy settings**.

5. Go to the **Egress** step, and turn on **Enable external inferencing**.

   If no endpoint is set up under **Integrations**, the step shows the message `No endpoints are set up yet.` instead of
   the endpoint table. A platform administrator must add an endpoint first. Refer to
   [Register an External Inference Endpoint](./register-an-external-inference-endpoint.md).

6. Select **Add endpoint**. A row is added to the endpoint table.

7. In the **Endpoint** column, select an endpoint. The list offers only the endpoints that are set up under
   **Integrations**.

8. In the **Key** column, decide which key the client uses for the endpoint.

   | **The Key field reads**                             | **What to do**                                                                                                                                                    |
   | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | `Using the Integrations key. Paste one to override` | Leave the field empty to use the key stored under **Integrations**. To use a different key for this client, paste it. The pasted key applies to this client only. |
   | `paste token`                                       | Paste a key. The appliance holds no key for this endpoint, so a key is required.                                                                                  |

   The client does not need a key of its own when its policy or **Integrations** already holds one.

9. Set a positive **Daily limit**. Egress is fail-closed on the cap, so a limit of `$0` blocks that endpoint for the
   client.

10. Repeat steps 6 through 9 for each endpoint the client can use.

11. Complete the remaining steps of the wizard, and then select **Create client**.

### Recommended Setup for Enterprise Anthropic

For the common shape (an enterprise Anthropic subscription, mostly local traffic, occasional flagship), use the
following opinionated defaults after you authorize the Anthropic endpoint on a policy, as described in
[Authorize a Policy](./register-an-external-inference-endpoint.md#authorize-a-policy), or on a client that overrides its
policy, as described in [Allow a Client to Reach External Models](#allow-a-client-to-reach-external-models). For the
mental model behind each choice, refer to [External Inferencing](../explanation/frontier-providers.md).

1. Have a platform administrator set up the Anthropic endpoint under **Integrations** with the enterprise key, and leave
   the **Key** field empty on every policy and client that should have external access (Pattern A: one contract, one
   key).
2. Set the tier map so `claude-opus-*` routes to an `anthropic / <model>` target and `claude-sonnet-*` and
   `claude-haiku-*` route to a local model. This captures most of the intended traffic mix because Claude Code defaults
   to Sonnet for cheap-tier turns and reserves Opus for hard work.
3. Set the Daily limit to the monthly cap you agreed with finance, divided by the days in the billing period.
4. Configure `on_exceed=local` so the client falls back to a local model when the budget runs out, instead of returning
   HTTP 429.
5. Leave **Enable external inferencing** on for the policies and clients that need external access, and off for every
   other one.
6. Skip bursting for now. Enable it later only if local capacity becomes the recurring bottleneck.

To verify the setup, send a request that resolves to the flagship tier through this client and check the response
headers for `X-AIBox-Frontier: anthropic` on a successful external turn, or `X-AIBox-Frontier: budget-exhausted` after
the budget runs out. If neither header appears, the client is bypassing the appliance. Refer to
[Common Misconfigurations](../explanation/frontier-providers.md#common-misconfigurations).

## Next Steps

- [Register an External Inference Endpoint](./register-an-external-inference-endpoint.md)
- [Set and Manage Client Quotas](./manage-client-quotas.md)
- [View Client Usage](./view-client-usage.md)
- [Replace a Model](./replace-a-model.md)
