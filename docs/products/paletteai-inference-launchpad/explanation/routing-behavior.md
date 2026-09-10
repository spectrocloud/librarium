---
sidebar_label: "Routing Behavior"
title: "Routing Behavior"
description:
  "An explanation of how PaletteAI Inference Launchpad decides which model answers each request: the Tier map, the
  semantic router, how the two combine, and the traps operators should know about."
hide_table_of_contents: false
sidebar_position: 7
tags: ["paletteai-inference-launchpad", "explanation", "routing", "semantic-routing", "tier-map"]
keywords:
  [
    "launchpad",
    "ai",
    "routing",
    "semantic routing",
    "tier map",
    "complexity threshold",
    "coding",
    "everything else",
    "simple",
    "complex",
    "choose per request",
    "decision recording",
  ]
---

Every request to a PaletteAI Inference Launchpad appliance runs through two controls before it reaches a model: the
**Tier map** and the **Semantic routing** card. They sit next to each other in the console, but they act on different
requests: the **Tier map** handles requests that name a model, and the **Semantic routing** card handles the ones that
do not. This page explains how the appliance walks the two controls in order, which requests reach the semantic router,
how the semantic router chooses a model from a category and a complexity band, and where inheritance sits between the
box-wide setting and each client. Read it to understand these ideas before you author routing rules, so the rules you
write match the requests your clients actually send.

## The Two-Stage Routing Decision

The appliance decides which model answers a request in two stages, in this order.

- **Stage 1: Tier map.** The Tier map rewrites a model name the client sent to a model the appliance serves. If a Tier
  map row matches, the appliance uses the row's Model, attaches its Thinking directive, and the semantic router does not
  run.
- **Stage 2: Semantic routing.** For requests that Stage 1 does not settle, the semantic router picks a model from a
  category and a complexity band. Only some requests reach this stage; which requests those are is the source of the
  most common misconfiguration on the appliance.

Both stages have a per-client overlay under **Access & Policy** > **Clients** > **Routing**. A client that leaves a
value untouched follows the appliance-wide setting on **Settings** > **Configurations**.

## The Tier Map

The Tier map answers this question: when a client asks for a model by name, which model on the appliance actually
answers?

Each Tier map row has three columns.

- **Alias prefix.** The name the client sends, matched by prefix. Presets are `claude-opus-`, `claude-sonnet-`, and
  `claude-haiku-`. You can also add a custom prefix.
- **Model.** A model the appliance serves, or the special picker value **Choose per request**. When Model is a served
  model, the Tier map settles the request in Stage 1. When Model is **Choose per request**, the alias is handed to the
  semantic router in Stage 2.
- **Thinking.** A directive attached to the chosen model that tells a reasoning-capable model how much reasoning to do
  before it answers. The directive follows the request onto whichever model answers, even when the semantic router picks
  that model. For the modes, levels, and per-engine behavior, refer to
  [The Thinking Directive](./thinking-directive.md).

A client that names a model no row matches, and no other rule catches, falls back to the box's **Fallback for unmatched
requests**. When that fallback is off, the appliance returns HTTP `404`.

## What Reaches the Semantic Router

A request reaches the semantic router in exactly three cases.

- The request sends `auto` as the model.
- The request sends no model field, or sends an empty one. This behaves the same as `auto`.
- The request names an alias whose Tier map row is set to **Choose per request**. The alias contributes its Thinking
  directive to the picked model.

Any other request is settled by the Tier map or by the box fallback and never reaches the semantic router.

:::warning

A client that sends `auto` bypasses the Tier map entirely. The most common misconfiguration on the appliance is an
operator who adds a Tier map row for a client such as Cursor, expecting that row to steer the request. Cursor sends
`auto`, so it never matches a Tier map row. The request lands directly on the client's **Semantic routing** card
instead. To steer this traffic, author a **Semantic routing** rule, not a Tier map row.

:::

## Categories and Complexity Bands

The semantic router keys every rule on two axes.

- **Category.** A label the appliance derives for the prompt. The console shows two categories today: **Coding** and
  **Everything else**.

<!-- vale off -->

- **Complexity band.** A label the appliance derives from a complexity score. When the score reaches the **Complexity
  threshold**, the band is **Complex**. Otherwise the band is **Simple**.

<!-- vale on -->

The category vocabulary is owned by the appliance and may change in a later release. Do not assume any category label
other than the two shown in the console.

### How the Lookup Works

For a routed request, the appliance looks up a rule in this order.

1. If a scenario hint is present on the request, that hint pins the model and the lookup ends.
2. Otherwise, the appliance reads the category and the complexity score for the prompt, and looks up an exact rule for
   `<category>/<band>`, such as `Coding/Complex`.
3. If no banded rule matches, the appliance looks up a rule for the bare category, such as `Coding`. This backstop rule
   catches requests when no score arrives, for example when the classifier could not answer for the prompt.
4. If no bare-category rule matches, the appliance uses the box's **Fallback for unmatched requests**.

A rule keyed on a banded key applies only when the classifier returned a score. A rule keyed on the bare category is the
backstop for prompts that arrive without a score.

:::warning

Missing a bare-category backstop drops that traffic silently to the box fallback. If you author a rule for
`Coding/Complex` but not one for `Coding`, a coding prompt the classifier cannot score does not use your **Coding**
rule. It uses the box fallback. Author a bare-category rule for every category you care about.

:::

A category rule may name a model the appliance serves locally, or a frontier or external target once egress is set up
for the client. The default-deny egress gate still applies to the client, so a rule that names an off-box target only
works for a client with egress enabled.

### Four Worked Examples

The four category and band combinations, with a rule for each on a small appliance that serves the certified coding
models.

| **Category and band**         | **Rule**                   | **What happens**                                                                                                                                                    |
| ----------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Coding` / `Complex`          | Route to `deepseek-v4-pro` | A refactoring agent sends `auto`. The classifier labels the prompt `Coding` with a score at or above the Complexity threshold. The router picks `deepseek-v4-pro`.  |
| `Coding` / `Simple`           | Route to `gemma-4`         | A shell tab-completion tool sends `auto`. The classifier labels the prompt `Coding` with a score below the Complexity threshold. The router picks `gemma-4`.        |
| `Everything else` / `Complex` | Route to `kimi-2.7`        | A long document summarization sends `auto`. The classifier labels the prompt `Everything else` with a score at or above the threshold. The router picks `kimi-2.7`. |
| `Everything else` / `Simple`  | Route to `glm-5.2`         | A short chat reply sends `auto`. The classifier labels the prompt `Everything else` with a score below the threshold. The router picks `glm-5.2`.                   |

The rules above are illustrative. Choose your own rules for the models your appliance serves.

## The Complexity Threshold

The Complexity threshold is the boundary between the **Simple** and the **Complex** band. The console shows it as a
percentage. `0` is the simplest prompt and `1` is the most complex, so a lower threshold sends more traffic to the
**Complex** rule.

The box-wide Complexity threshold lives on the **Semantic routing** card under **Settings** > **Configurations**. Every
client starts by following it.

### Per-Client Inheritance

Each client's **Semantic routing** card holds its own Complexity threshold. An empty value there means the client
follows the box. This is not the same as authoring today's box value into the client.

- A client with an **empty** threshold follows the box. If an operator raises the box threshold from `0.4` to `0.6`, the
  client moves with it.
- A client **pinned** at `0.4` stays at `0.4` even if the box moves to `0.6`. It stays pinned until an operator changes
  the client's value or clears it back to inheritance.

The same inheritance rule applies to category rules on the per-client **Semantic routing** card. The card is seeded from
the box setting the client currently follows.

## Fallback for Unmatched Requests

The box's **Fallback for unmatched requests** catches every request no other control settles. It answers the request
when the Tier map does not match, when the semantic router finds no rule for the category, and when a client asks for a
model the appliance does not serve. When the fallback is off, the appliance returns HTTP `404` for these requests.

The fallback is a safety net. It is not a substitute for a bare-category backstop on the semantic router. A request that
falls to the fallback does not appear on the **Semantic routing** panel of the **Usage** page, because that panel only
reports traffic the semantic router classified.

## Usage Reporting

The **Usage** page reports the traffic the semantic router classified on its **Semantic routing** panel. The panel has
one row per category and model, and reports the request count, total tokens, estimated cost, and the classifier's
average confidence for the row as a percentage.

For the exact column names and definitions, refer to [Usage Metrics Reference](../reference/usage-metrics-reference.md).

<!-- vale off -->

{/* NEEDS REVIEW: the AIL-494 brief described per-row complexity band, per-row routing reason, and an `unknown` confidence value on the Usage page's Semantic routing panel, but the shipped panel exposes only Category, Model, Requests, Total tok, Cost, and Avg conf. A subject-matter expert should reconcile the brief with the shipped panel before this page publishes. */}

<!-- vale on -->

## Decision Recording

Decision recording writes one row per classification to a CSV file, so an operator can tune the categories and the
Complexity threshold against the traffic the appliance actually sees.

- Recording is off by default. Each client has a **Decision recording** section in **Access & Policy** > **Clients**.
- The switch survives a restart. Turning recording on once keeps it on across appliance upgrades and node reboots until
  an operator turns it off.
- The console offers **Download** and **Delete** actions for the recorded CSV. **Delete** asks for confirmation.
- Prompts in recorded rows are truncated. Files rotate as they fill, so recording does not consume unbounded disk.
- If a write to the CSV fails, the appliance disables recording rather than fail the request. Serving a client's request
  always takes priority over writing a decision row.

Recorded rows are for operator tuning. They are not a compliance audit log, and they are not shipped off the appliance.

## Metrics and Dashboards

The appliance ships a Grafana dashboard, **Semantic prompt classification and routing**, loaded through the same
dashboards mount as the other appliance dashboards. The dashboard leads with the share of traffic the classifier
answered for, so an operator can know at a glance how much of a client's traffic the semantic router is choosing.

## Resources

- [Configure Semantic Routing](../how-to-guides/configure-semantic-routing.md) walks through setting the Complexity
  threshold, authoring category rules, overriding both per client, and enabling Decision recording.
- [Manage a Client's Model Access](../how-to-guides/manage-client-model-access.md) walks through the Tier map and
  through allowing a client to reach external models.
- [Usage Metrics Reference](../reference/usage-metrics-reference.md) defines every field the **Usage** page reports.
- [Glossary](../reference/glossary.md) defines the routing terms used throughout this page.
