---
sidebar_label: "Routing Behavior"
title: "Routing Behavior"
description:
  "An explanation of how PaletteAI Inference Launchpad decides which model answers each request: the Tier map, the
  semantic router, where routing rules live, and how the semantic router shares the GPUs."
hide_table_of_contents: false
sidebar_position: 7
tags: ["paletteai-inference-launchpad", "explanation", "routing", "semantic-routing", "tier-map"]
keywords:
  [
    "launchpad",
    "ai",
    "routing",
    "semantic routing",
    "semantic router",
    "tier map",
    "complexity threshold",
    "policy",
    "workspace",
    "simple",
    "complex",
    "fallback",
    "guard",
    "use semantic router rules",
    "decision recording",
  ]
---

Every request to a PaletteAI Inference Launchpad appliance runs through two controls before it reaches a model: the
**Tier map** and the **Semantic routing** rules. They sit next to each other in the console, but they act on different
requests. The **Tier map** handles requests that name a [model alias](../reference/glossary.md#model-alias), and the
**Semantic routing** rules handle the requests that the Tier map passes on or never receives. This page explains the
order in which the appliance applies the two controls and where their rules live. It also explains how the semantic
router picks a model and how it shares the GPUs. Read it to understand these ideas before you author routing rules, so
that the rules you write match the requests your clients actually send.

## The Two-Stage Routing Decision

The appliance decides which model answers a request in two stages, in this order.

1. In Stage 1, the Tier map rewrites a [model alias](../reference/glossary.md#model-alias) that the client sent to a
   model that the appliance serves. If a Tier map row matches, the appliance uses the row's Model and attaches its
   Thinking directive. The Tier map has then settled the request, and the semantic router does not pick the model.

2. In Stage 2, for requests that Stage 1 does not settle, the semantic router reads the prompt and picks a model from a
   category and a complexity band. Only some requests reach this stage. For the cases, refer to
   [What Reaches the Semantic Router](#what-reaches-the-semantic-router).

## Where Routing Rules Live

<!-- vale Vale.Spelling = NO -->

Routing has three layers. A client follows the routing of its workspace's policy, and a policy follows the appliance
defaults. A layer's own rules override what it follows.

<!-- vale Vale.Spelling = YES -->

<!-- vale Vale.Spelling = NO -->

| **Layer**              | **What it holds**                                                                                                                                                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The appliance defaults | The defaults that the appliance ships, which are the default alias map and the box default model. There is no appliance-level routing editor.                                                                             |
| The workspace's policy | The **Routing** step of a policy under **Access & Policy** > **Policies**. A workspace follows one policy, and every client in the workspace runs under that policy's Tier map, Complexity threshold, and category rules. |
| The client             | The client's own rules, set in the **Routing** step of the **Add client** wizard or on the **Routing** tab of the client's detail panel. A client's own rules override its policy.                                        |

<!-- vale Vale.Spelling = YES -->

Every Tier map row and semantic routing rule in a client's routing starts filled with the model and reasoning depth that
apply to the client today, so that an operator always reads the rule a request actually follows. Changing one makes it
the client's own. **Use defaults** removes the client's own rules, and the client follows what it inherits again.

At the appliance level, an operator turns the semantic router and its two guard checks on or off from **Settings** >
**Configurations**. For what the toggles do, refer to [Semantic Router Guard](./semantic-router-guard.md) and
[The Semantic Router on the GPU](#the-semantic-router-on-the-gpu). For each toggle and its default, refer to
[Semantic Router Card](../reference/semantic-routing-reference.md#semantic-router-card).

## The Tier Map

The Tier map decides which model on the appliance answers when a client asks for a model by alias.

Each Tier map row has the following columns.

| **Column**       | **What it holds**                                                                                                                                                                                                                                                                                                                                                             |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Alias prefix** | The name the client sends, matched by prefix. Every Tier map starts with seven seeded presets, in this order: `claude-fable-`, `claude-opus-`, `claude-sonnet-`, `claude-haiku-`, `gpt-`, `gemini-`, and `grok-`. The seeded rows cannot be removed. You can also add a custom prefix.                                                                                        |
| **Model**        | A model the appliance serves, or the special picker value **Use Semantic Router rules**. When Model is a served model, the Tier map settles the request in Stage 1. When Model is **Use Semantic Router rules**, the alias is handed to the semantic router in Stage 2.                                                                                                       |
| **Thinking**     | A directive attached to the chosen model that tells a reasoning-capable model how much reasoning to do before it answers. When the Tier map hands the alias to the semantic router, the directive becomes the inherited reasoning depth of the rule that answers. For the modes, levels, and per-engine behavior, refer to [The Thinking Directive](./thinking-directive.md). |

<!-- vale Vale.Spelling = NO -->

A client that has no Tier map of its own follows the Tier map of its workspace's policy, or the default alias map when
the policy sets none. When the inherited table leaves a seeded row blank, the console labels that row
`Not mapped, so the box default <model> answers it.` For a client that edits its own Tier map, the connect panel warns
that an alias left unmapped in that map makes an agent receive a `404`.

<!-- vale Vale.Spelling = YES -->

The box default model is the largest model the appliance serves. If the appliance serves no model, a request that
nothing else settles returns HTTP `404`.

## What Reaches the Semantic Router

A request reaches the semantic router in exactly three cases.

- The request sends `auto` as the model.

- The request sends no model field, or sends an empty one. This behaves the same as `auto`.

- The request names an alias whose Tier map row is set to **Use Semantic Router rules**. The alias contributes its
  Thinking directive as the inherited reasoning depth.

The appliance settles any other request before the semantic router runs. It goes to the served model it names, to the
model of a matching Tier map row, to the model a request hint sets, or to the box default model. The **Usage** page
counts these requests in a line such as `21 requests were answered without routing`, and lists them in a table after
that line.

:::warning

A client that sends `auto` bypasses the Tier map entirely. The most common misconfiguration on the appliance is an
operator who adds a Tier map row for a client such as Cursor, expecting that row to steer every request. Cursor sends
`auto` whenever its model picker is left on **Auto**, and that request never matches a Tier map row. It lands directly
on the client's **Semantic routing** rules instead. Only a **Semantic routing** rule steers this traffic. A Tier map row
does not.

:::

In the console, the **Semantic routing** card hides its rules behind the note `No alias sends its requests here yet.`
until at least one alias is set to **Use Semantic Router rules**. The rules still govern every request that sends `auto`
or no model.

The semantic router's guard also checks each request it reads. It refuses prompt attacks, and it refuses requests that
carry personal data when they would leave the appliance. For the two checks, refer to
[Semantic Router Guard](./semantic-router-guard.md).

## Categories and Complexity Bands

The semantic router reads each routed request. Every rule is keyed on two axes.

- **Category.** What the prompt is about. The six categories in the console are **Code planning**, **Code development**,
  **Code refactoring**, **Code review**, **Code test generation**, and **General**.

<!-- vale off -->

- **Complexity band.** A label the appliance derives from a complexity score. A request whose score is at or above the
  client's **Complexity threshold** is **Complex**. Otherwise, it is **Simple**.

<!-- vale on -->

The appliance owns the category vocabulary.

### How the Lookup Works

Each category has a **Simple**, a **Complex**, and a **Fallback** rule. For a routed request, the appliance looks up a
rule in this order.

1. The semantic router reads the category and the complexity score for the prompt.

2. If the request has a score, the appliance uses the category's **Simple** rule or **Complex** rule, depending on where
   the score falls against the Complexity threshold.

3. If the request is not scored, or its **Simple** or **Complex** rule names no model, the appliance uses the category's
   **Fallback** rule.

4. If the **Fallback** rule names no model, the request goes to the box default model.

The **Fallback** rule keeps a category's traffic on a model you chose when scoring is unavailable or a banded rule is
empty. If a category has banded rules but no fallback model, the console warns you to pick one.

A rule can name a model the appliance serves locally, or a frontier model from one of the client's provider keys. Every
rule that sends a request off the appliance still follows the client's external inferencing settings and daily limit. A
rule that names a frontier model works only for a client with external inferencing enabled.

<!-- vale off -->

### Reasoning Depth per Rule

<!-- vale on -->

Every category rule also carries a reasoning depth in its **Thinking** column. A rule can inherit the depth from the
alias that handed the request to the semantic router, or set its own. For every value, refer to
[Thinking Directive Modes](../reference/thinking-modes.md#thinking-values-on-semantic-routing-rules).

**Inherited** and **off** are different settings. A rule left on **Inherited** follows each alias, so two aliases that
hand requests to the same rule can still reason to different depths. A rule set to **off** does not reason, whichever
alias the request came through.

### Examples

The following table shows four requests from one client, each answered by a different rule. The client's Complexity
threshold is the default of 50%.

| **Category and rule**              | **Model and Thinking**                                                        | **What happens**                                                                                                                                                                                                           |
| ---------------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Code refactoring** / **Complex** | `deepseek-v4-pro`, Thinking **Inherited**                                     | A coding agent sends `auto` and asks to restructure a module across several files. The prompt scores at or above 50%. The router picks `deepseek-v4-pro`.                                                                  |
| **Code development** / **Simple**  | `gemma-4`, Thinking **off**                                                   | A coding agent sends `auto` and asks for a short helper function. The prompt scores below 50%. The router picks `gemma-4` and turns reasoning off.                                                                         |
| **Code planning** / **Complex**    | A frontier model from the client's provider key, Thinking **effort** **high** | A request names `claude-opus-4-8`, whose alias is set to **Use Semantic Router rules**, and asks for a migration plan. The prompt scores at or above 50%. The router sends it off the appliance at a high reasoning level. |
| **General** / **Fallback**         | `glm-5.2`                                                                     | A request sends `auto`, and the semantic router cannot score it. The category's **Fallback** rule answers with `glm-5.2`.                                                                                                  |

The rules in this table are illustrative. Real rules depend on the models the appliance serves and the provider keys its
clients hold.

## The Complexity Threshold

The Complexity threshold is the boundary between the **Simple** and the **Complex** band. The console shows it as a
slider with a percentage. A request that scores at or above the threshold goes to the **Complex** rule, so a lower
threshold sends more requests there. The default is 50%.

<!-- vale Vale.Spelling = NO -->

A policy's **Routing** step sets a threshold for the clients that follow it, and each client can set its own. A client
without its own value follows the threshold of its workspace's policy, or the default of 50% when the policy sets none.
Selecting **Use default** returns the client to the value it inherits.

<!-- vale Vale.Spelling = YES -->

## The Semantic Router on the GPU

The semantic router runs on the appliance's GPUs and shares them with the main model. The appliance deploys it at
installation, before any local model. An appliance that answers only through frontier providers therefore still routes
semantically.

When a deploy starts a new GPU sharing group, the semantic router moves into that group, and its engine restarts once.
The appliance routes the requests that arrive during the restart without semantic classification. For how groups form,
refer to [GPU Sharing](./gpu-sharing.md). For the GPU requirements, refer to
[Suggested Hardware](../reference/hardware-requirements.md#gpu).

An operator can turn the semantic router off. Its engine stops and frees its GPU memory, while the main model keeps
serving without a restart. Without the semantic router, the category and **Thinking** columns of the routing rules have
no effect, nothing new is recorded, and `auto` requests go to the box default model.

When the appliance cannot run the semantic router, the console makes the toggle unavailable and names the reason. For
every reason, refer to
[Reasons the Semantic Router Is Unavailable](../reference/semantic-routing-reference.md#reasons-the-semantic-router-is-unavailable).

## One Mode per Appliance

Because the semantic router shares one set of GPUs with the models it routes to, an appliance runs its models in one of
two modes. Text mode runs a text model with the semantic router. Vision mode runs a text model with the semantic router
and a vision model.

A model's catalog entry decides its mode. A text model that shares its GPUs with a vision model has an entry that ends
in `-shared-with-vision`, such as `glm-5.3-shared-with-vision`. The vision model of that group has an entry that ends in
`-vision`, such as `qwen-3.5-9B-vision`. A text model with a plain name, such as `glm-5.3`, runs in text mode.

The deploy picker offers only models of the appliance's current mode. If you deploy a model of the other mode, the
appliance refuses it. The message names both modes and tells you to remove the current models first or to move the model
into the current mode's group. For the deploy steps, refer to [Deploy a Model](../how-to-guides/deploy-a-model.md).

A model whose catalog entry names no GPU count and no group, such as a model you bring yourself, does not set a mode of
its own. The deploy wizard's **GPU sharing** step opens it on the group the appliance already runs, so it shares the
GPUs with that group. On an appliance that serves only the semantic router, that group is the semantic router's own.

Vision preprocessing needs a vision-mode text model. On a vision-mode appliance, image requests that send `auto` are
routed too, and the **Overview** page shows a **Vision preprocessing** card. For how image requests are handled, refer
to [Vision Preprocessing](./vision-preprocessing.md).

## Usage Reporting

The **Usage** page reports where routed traffic went and why. Its **Semantic routing** table counts the requests that
each rule answered, and a line after the table counts the requests settled before the semantic router ran. Together,
they account for every request in the period. The **Local vs external** card reports how much traffic left the
appliance. For every column and value, refer to
[Usage Metrics Reference](../reference/usage-metrics-reference.md#semantic-routing).

## Decision Recording

Decision recording writes one row per classified request for a client, so that an operator can tune the categories and
the Complexity threshold against the traffic the client actually sends.

<!-- vale Vale.Spelling = NO -->

The workspace's policy decides whether its clients are recorded, and a client can be excluded from its policy's
recording. Only the requests the semantic router reads are recorded, and nothing new is recorded while the semantic
router is off. Serving a request always takes priority over writing a decision row.

<!-- vale Vale.Spelling = YES -->

Recorded rows are for operator tuning. They are not a compliance audit log, and they are not shipped off the appliance.
For each recording control and its default, refer to
[Decision Recording Controls](../reference/semantic-routing-reference.md#decision-recording-controls).

## Metrics and Dashboards

The appliance ships a Grafana dashboard, **Launchpad — Semantic prompt classification & routing**. The dashboard leads
with the share of traffic that the semantic router answered, so that an operator can tell at a glance how much traffic
it routes.

## Resources

- [Configure Semantic Routing](../how-to-guides/configure-semantic-routing.md) walks through turning the semantic router
  on or off, setting routing for the policy a workspace follows and for a client, and recording routing decisions.

- [Manage a Client's Model Access](../how-to-guides/manage-client-model-access.md) walks through the Tier map and
  through allowing a client to reach external models.

- [Semantic Router Guard](./semantic-router-guard.md) explains the two checks the semantic router makes on each request
  it reads.

- [Semantic Routing Reference](../reference/semantic-routing-reference.md) lists the semantic router controls, their
  defaults, and what each value does.

- [Usage Metrics Reference](../reference/usage-metrics-reference.md) defines every field the **Usage** page reports.

- [Glossary](../reference/glossary.md) defines the routing terms used throughout this page.
