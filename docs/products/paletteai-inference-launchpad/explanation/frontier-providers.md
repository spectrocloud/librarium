---
sidebar_label: "External Inferencing"
title: "External Inferencing"
description:
  "How external inferencing works on a PaletteAI Inference Launchpad appliance, including where an endpoint is set up,
  which key the appliance sends, the levers that keep external traffic occasional, and the most common
  misconfigurations."
hide_table_of_contents: false
sidebar_position: 7.5
tags: ["paletteai-inference-launchpad", "explanation", "external-inferencing", "egress", "endpoints"]
keywords:
  [
    "launchpad",
    "ai",
    "external inferencing",
    "external inference endpoint",
    "anthropic",
    "openai",
    "gemini",
    "integrations",
    "egress",
    "on_exceed",
  ]
---

A PaletteAI Inference Launchpad appliance serves inference locally and can also, on operator opt-in, send a request to a
model outside the appliance. The console calls this _external inferencing_. This page explains where an external model
is set up, which key the appliance sends, the levers that keep external traffic to the intended small slice, and the two
misconfigurations that most often defeat the whole design.

For the console flow that authorizes an endpoint on a policy, refer to
[Register an External Inference Endpoint](../how-to-guides/register-an-external-inference-endpoint.md). For how an
endpoint relates to bursting and to the rest of the request path, refer to
[Architecture](architecture.md#external-inference-endpoints).

## Endpoints Live in Integrations

The appliance reaches an external model through an external inference endpoint. An endpoint holds the address of the
outside host and the key the appliance sends to it. Three endpoints are built in, for Anthropic, OpenAI, and Gemini, and
a platform administrator can register any OpenAI-compatible host as another one.

A platform administrator sets up every endpoint under **Integrations**, the built-in ones included. A built-in endpoint
is not available until that happens.

A policy or a client selects an endpoint that already exists, and it can never define one. A key is only half of what
the appliance needs, because the address lives on the endpoint. A policy that named an endpoint nobody set up would
reach nothing, and a local model would answer its requests instead. An endpoint that is not set up therefore does not
appear in the endpoint list of a policy or a client. When no endpoint is set up at all, the **Egress** step says so and
names who adds one.

A policy or a client that already names an endpoint keeps that endpoint on screen, even after the endpoint stops being
offered. The rule that can no longer be reached stays visible, so an operator can act on it.

## Which Key the Appliance Sends

Each endpoint row on a policy, or on a client that overrides its policy, has a **Key** field. The field shows which key
the appliance sends for that endpoint.

| **Where the key comes from**                    | **What the Key field reads**                        | **Who uses the key**                                                           |
| ----------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------ |
| **Integrations** holds a key for the endpoint   | `Using the Integrations key. Paste one to override` | Every policy and client that lists the endpoint and holds no key of its own.   |
| A key typed on the policy or client             | The typed key                                       | That policy, or that client, alone.                                            |
| No key under **Integrations** and none typed in | `paste token`                                       | No one. The policy or client must supply a key before it can use the endpoint. |

The field stays editable in every state. A key typed on a policy or a client overrides the **Integrations** key for that
policy or client only. The **Integrations** key does not change. A client that follows a policy does not need a key of
its own when the policy or **Integrations** already holds one.

Clearing the **Key** field does not remove an override. An emptied field keeps the key the policy or client already
holds.

## Three Credential Patterns

Enterprises typically buy one of Anthropic Enterprise, OpenAI Teams, or a Gemini enterprise plan, and then decide how to
map that single contract to many Launchpad policies and clients. Three patterns cover the common shapes.

| **Pattern**        | **Where the key sits**                                                                                | **Best for**                                    | **Trade-off**                                                   |
| ------------------ | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------------------------- |
| A. Shared key      | The enterprise key, stored once under **Integrations**. Policies and clients add no key of their own. | One invoice, minimal admin overhead.            | One compromise or revocation cuts every policy and client.      |
| B. Per-policy keys | A distinct sub-key per policy or per client, typed in the **Key** field to override the shared key.   | Surgical revocation, provider-side attribution. | More admin overhead; only works if the provider mints sub-keys. |
| C. Hybrid          | The shared key under **Integrations**, with an override on the policies or clients that need one.     | Common in practice; team invoices stay simple.  | Two lifecycles to manage; audit reads from two places.          |

## Five Levers That Keep External Traffic Occasional

Most enterprise appliances run "mostly local, occasional external." Five levers, layered from coarse to fine, control
that split. Four are set on a policy or a client; the fifth is appliance-wide.

1. **Tier alias.** Rewrites the client's requested model name to the model the appliance will serve. Sending
   `claude-sonnet-*` to a local GLM and reserving `claude-opus-*` for `anthropic / claude-opus-4-8` pulls the bulk of
   traffic onto the appliance before any other lever runs. Refer to
   [Routing Behavior](routing-behavior.md#the-tier-map).

2. **Semantic routing rules.** When a request sends `auto`, or names an alias set to **Use Semantic Router rules**, the
   semantic router picks the model from a category and a complexity band. Where a category's **Complex** rule names an
   external model, lowering the client's or the policy's complexity threshold moves more requests to the external model;
   raising it does the reverse. Refer to [Routing Behavior](routing-behavior.md#categories-and-complexity-bands).

3. **Per-endpoint egress budget.** A daily cost cap per client per endpoint. With `on_exceed=local`, an exhausted budget
   serves locally instead and stamps `X-AIBox-Frontier: budget-exhausted` on the response. With `on_exceed=refuse`, the
   appliance returns HTTP 429.

4. **Egress capability toggle.** A single **Enable external inferencing** switch on each policy, and on each client that
   overrides its policy. Off pauses external access without deleting any key; on restores egress with the same setup.

5. **Sovereignty (appliance-wide).** A single switch above every client's egress, on the **Sovereignty** card of
   **Access & Policy** > **Clients** with **All workspaces** selected. After an operator selects **Block all external
   inferencing**, no request leaves the appliance, regardless of what any client is permitted to do. Each client's
   egress chip reads **Blocked by sovereignty** until an operator selects **Permit external inferencing**. Refer to
   [Clients and Quotas](clients-and-quotas.md#sovereignty-and-egress).

For the recipe that composes these levers for the common enterprise shape, refer to
[Manage a Client's Model Access](../how-to-guides/manage-client-model-access.md#recommended-setup-for-enterprise-anthropic).

## External Egress Decision

The following diagram traces one request through the [five levers](#five-levers-that-keep-external-traffic-occasional)
to one of seven terminal outcomes: blocked by sovereignty, local by alias, egress to an endpoint, local fallback with
the `fell-back` marker after the endpoint itself did not answer, local fallback with the `budget-exhausted` marker, an
HTTP 401 for a missing endpoint credential, or an HTTP 429 when egress is refused outright.

<!-- vale Vale.Spelling = NO -->

![Egress decision flowchart showing a request entering the gateway, first checking whether sovereignty is armed appliance-wide, then resolving the tier alias to an external or local model, then checking whether external inferencing is enabled for the client, whether a key is available for the endpoint, whether the per-endpoint egress budget remains, whether the endpoint answered, and the on_exceed setting, arriving at one of seven outcomes: blocked by sovereignty, served locally by alias, an external response, served locally with X-AIBox-Frontier fell-back, served locally with X-AIBox-Frontier budget-exhausted, HTTP 401 OutcomeDenied for a missing endpoint credential, or HTTP 429 when egress is refused.](/assets/docs/images/frontier-providers_decision.webp)

<!-- vale Vale.Spelling = YES -->

Three subtleties in the flow are worth calling out. Sovereignty is checked first and overrides every downstream lever; a
request never reaches the tier decision on a sovereignty-armed appliance. A missing endpoint credential is an
`OutcomeDenied` policy refusal (HTTP 401), not a budget fallback. And `X-AIBox-Frontier: fell-back` (endpoint did not
answer) is distinct from `X-AIBox-Frontier: budget-exhausted` (budget refused the crossing); the `on_exceed` setting
decides the terminal outcome only on the budget branch.

Bursting is the reverse pattern: a request that routing sent to a local model, but that the client's local quota
exhausted, egresses to a chosen endpoint instead of returning 429. Refer to
[Architecture](architecture.md#data-residency-and-isolation) for the concept. Bursting is available as soon as a listed
endpoint has a key, whether the key comes from **Integrations** or from the policy or client. Bursting does not get its
own budget. When a request bursts to an endpoint, it counts against the client's per-endpoint egress budget, just like
any other external call.

## Common Misconfigurations

<!-- vale off -->

:::warning

**Client base URL is the make-or-break config.** Set `ANTHROPIC_BASE_URL` (or the OpenAI or Gemini equivalent) on the
client to the appliance's gateway URL, such as `http://<appliance>:<port>`. If a client points at the provider's own
endpoint directly with an enterprise key, it bypasses the appliance entirely: no routing, no metering, no local option,
no fallback, and no audit. Nothing on the appliance can detect this, because the request never reaches the appliance.

:::

:::warning

**External responses are never cached.** The appliance's semantic response cache and prefix cache are both skipped on
any turn that egresses to an endpoint. Repeated queries pay full provider cost every time. Size the egress budget for
the raw request count rather than assuming that cache hits absorb repetition.

:::

<!-- vale on -->

## Key Lifecycle

A shared key lives in one place. Rotating it under **Integrations** updates every policy and client that uses the
**Integrations** key, with no edit on any policy or client. An override lives on its policy or client, so rotating it
means pasting the new value into that policy or client (Pattern B: exactly one policy or client per key). Every egress
turn is recorded with the model, token count, cost, and client; the request body is not stored, and external responses
do not enter the semantic cache or the fine-tuning corpus.

## Resources

- [Register an External Inference Endpoint](../how-to-guides/register-an-external-inference-endpoint.md) covers setting
  up an endpoint under **Integrations** and authorizing it on a policy.
- [Manage a Client's Model Access](../how-to-guides/manage-client-model-access.md) covers giving one client its own
  endpoint settings, plus the recommended enterprise-Anthropic recipe.
- [Architecture](architecture.md#external-inference-endpoints) covers the endpoint object, the broader egress model, and
  bursting.
- [Clients and Quotas](clients-and-quotas.md#sovereignty-and-egress) covers the appliance-wide sovereignty switch that
  overrides every per-client egress permission.
- [Routing Behavior](routing-behavior.md) covers the tier map and semantic router that decide what asks for an external
  model.
- [Usage Metrics Reference](../reference/usage-metrics-reference.md) covers where to read external attribution and burst
  overflow.
- [Glossary](../reference/glossary.md) defines the external inferencing, external inference endpoint, and egress terms.
