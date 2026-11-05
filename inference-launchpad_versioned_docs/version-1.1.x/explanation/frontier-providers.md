---
sidebar_label: "Frontier Providers"
title: "Frontier Providers"
description:
  "How Anthropic, OpenAI, and Gemini egress works on a PaletteAI Inference Launchpad appliance: the credential patterns,
  the five levers that keep frontier traffic occasional, the decision flow, and the two misconfigurations that most
  often defeat the whole design."
hide_table_of_contents: false
sidebar_position: 7.5
tags: ["paletteai-inference-launchpad", "explanation", "frontier", "egress", "provider-keys", "byo-key"]
keywords:
  ["launchpad", "ai", "frontier", "anthropic", "openai", "gemini", "provider key", "byo key", "egress", "on_exceed"]
---

A PaletteAI Inference Launchpad appliance is a local inference box that can also, on operator opt-in, reach out to a
closed list of cloud providers on a client's behalf. This page explains what that reach looks like: the built-in
providers, how credentials attach to a client, the levers that keep frontier traffic to the intended small slice, and
the two misconfigurations that most often defeat the whole design.

For the console flow that enables a provider on a client, refer to
[Manage a Client's Model Access](../how-to-guides/manage-client-model-access.md). For the broader egress model,
including how frontier providers relate to registered external endpoints and to bursting, refer to
[Architecture](architecture.md#data-residency-and-isolation).

## What a Frontier Provider Is

A frontier provider is one of three vendor-hosted model families the appliance can call as a first-class engine:
Anthropic, OpenAI, and Gemini. The list is closed.

Each provider becomes an engine on a client only when the client itself holds a valid provider key for it. An empty key
slot means the provider does not exist as an engine for that client. Filling the slot makes the engine appear live with
no restart, and clearing it makes the engine disappear live, again with no restart.

Provider keys live under **Access & Policy** > **Clients** > _client_ > **Egress**, in one slot per provider per client.
Two clients on the same appliance can hold two different Anthropic keys, or one can hold a key and the other none, with
no interaction between them.

## Three Credential Patterns

Enterprises typically buy one of Anthropic Enterprise, OpenAI Teams, or a Gemini enterprise plan, and then decide how to
map that single contract to many Launchpad clients. Three patterns cover the common shapes.

| Pattern            | Where the key sits                                                           | Best for                                        | Trade-off                                                       |
| ------------------ | ---------------------------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------------------------- |
| A. Shared key      | The same enterprise key pasted into every client that needs egress.          | One invoice, minimal admin overhead.            | One compromise or revocation cuts every client at once.         |
| B. Per-client keys | A distinct sub-key per client, minted by the provider's own admin console.   | Surgical revocation, provider-side attribution. | More admin overhead; only works if the provider mints sub-keys. |
| C. Hybrid          | Shared-team clients hold the enterprise key; individuals hold personal keys. | Common in practice; team invoices stay simple.  | Two lifecycles to manage; audit reads from two places.          |

## Five Levers That Keep Frontier Occasional

Most enterprise appliances run "mostly local, occasional frontier." Five levers, layered from coarse to fine, control
that split. Four are per client; the fifth is appliance-wide.

1. **Tier alias.** Rewrites the client's requested model name to the model the appliance will serve. Sending
   `claude-sonnet-*` to a local GLM and reserving `claude-opus-*` for Anthropic pulls the bulk of traffic on-box before
   any other lever runs. Refer to [Routing Behavior](routing-behavior.md#the-tier-map).
2. **Classifier policy.** When a tier resolves to `auto`, the semantic router picks the model from a category and a
   complexity band. Lowering the complexity threshold moves more turns to frontier; raising it does the reverse. Refer
   to [Routing Behavior](routing-behavior.md#categories-and-complexity-bands).
3. **Per-provider egress budget.** A daily cost cap per client per provider. With `on_exceed=local`, an exhausted budget
   serves locally instead and stamps `X-AIBox-Frontier: budget-exhausted` on the response. With `on_exceed=refuse`, the
   appliance returns HTTP 429.
4. **Egress capability toggle.** A single **Enable egress** switch per client. Off pauses frontier access without
   deleting any key; on restores egress with the same setup.
5. **Sovereignty (appliance-wide).** A single switch above every client's egress. When armed, no request leaves the box
   regardless of what any client is permitted to do; the client's egress chip reads **Blocked by sovereignty** until an
   operator disarms it under **Access & Policy → Sovereignty**. Refer to
   [Clients and Quotas](clients-and-quotas.md#sovereignty-and-egress).

For the recipe that composes these levers for the common enterprise shape, refer to
[Manage a Client's Model Access](../how-to-guides/manage-client-model-access.md#recommended-setup-for-enterprise-anthropic).

## Frontier Egress Decision

The following diagram traces one request through the [five levers](#five-levers-that-keep-frontier-occasional) to one of
seven terminal outcomes: blocked by sovereignty, local by alias, egress to a provider, local fallback with the
`fell-back` marker after the provider itself did not answer, local fallback with the `budget-exhausted` marker, an HTTP
401 for a missing provider credential, or an HTTP 429 when egress is refused outright.

<!-- vale Vale.Spelling = NO -->

![Egress decision flowchart showing a request entering the gateway, first checking whether sovereignty is armed appliance-wide, then resolving the tier alias, then passing through the client egress capability check, provider key presence, per-provider egress budget, whether the provider answered, and the on_exceed setting, arriving at one of seven outcomes: blocked by sovereignty, served locally by alias, egress to provider, served locally with X-AIBox-Frontier fell-back, served locally with X-AIBox-Frontier budget-exhausted, HTTP 401 OutcomeDenied for a missing provider credential, or HTTP 429 when egress is refused.](/assets/docs/images/frontier-providers_decision.webp)

<!-- vale Vale.Spelling = YES -->

Three subtleties in the flow are worth calling out. Sovereignty is checked first and overrides every downstream lever; a
request never reaches the tier decision on a sovereignty-armed appliance. A missing provider credential is an
`OutcomeDenied` policy refusal (HTTP 401), not a budget fallback. And `X-AIBox-Frontier: fell-back` (provider did not
answer) is distinct from `X-AIBox-Frontier: budget-exhausted` (budget refused the crossing); the `on_exceed` setting
decides the terminal outcome only on the budget branch.

Bursting is the reverse pattern: a request that routing sent to a local model, but that the client's local quota
exhausted, egresses to a chosen frontier provider instead of returning 429. Refer to
[Architecture](architecture.md#data-residency-and-isolation) for the concept. Bursting doesn't get its own budget. When
a request bursts to a provider, it counts against the client's per-provider egress budget, just like any other frontier
call.

## Common Misconfigurations

<!-- vale off -->

:::warning

**Client base URL is the make-or-break config.** Set `ANTHROPIC_BASE_URL` (or the OpenAI or Gemini equivalent) on the
client to the appliance's gateway URL, such as `http://<appliance>:<port>`. If a client points at the provider's own
endpoint directly with an enterprise key, it bypasses the appliance entirely: no routing, no metering, no local option,
no fallback, and no audit. Nothing on the appliance can detect this, because the request never reaches the box.

:::

:::warning

**Frontier responses are never cached.** The appliance's semantic response cache and prefix cache are both skipped on
any turn that egresses to a frontier provider. Repeated queries pay full provider cost every time. Size the frontier
budget for the raw request count rather than assuming cache hits will absorb repetition.

:::

<!-- vale on -->

## Key Lifecycle

Provider keys are per-client artifacts, and every operation is per-client. Rotation pastes the new value into each
client that holds the old key (Pattern A: every client on the contract; Pattern B: exactly one client). Revocation
clears the slot; the frontier engine disappears live with no drain and no restart. Every egress turn is recorded with
the model, token count, cost, and client; the request body is not stored, and frontier responses do not enter the
semantic cache or the fine-tuning corpus.

## Resources

- [Manage a Client's Model Access](../how-to-guides/manage-client-model-access.md) covers the console flow for adding a
  provider key and its egress budget, plus the recommended enterprise-Anthropic recipe.
- [Architecture](architecture.md#data-residency-and-isolation) covers the broader egress model, the frontier and
  registered external endpoint distinction, and bursting.
- [Clients and Quotas](clients-and-quotas.md#sovereignty-and-egress) covers the appliance-wide sovereignty switch that
  overrides every per-client egress permission.
- [Routing Behavior](routing-behavior.md) covers the tier map and semantic router that decide what asks for a provider.
- [Usage Metrics Reference](../reference/usage-metrics-reference.md) covers where to read frontier attribution and burst
  overflow.
- [Glossary](../reference/glossary.md) defines the frontier, egress, provider key, and bursting terms.
