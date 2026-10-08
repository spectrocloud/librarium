---
sidebar_label: "Routing Behavior"
title: "Routing Behavior"
description:
  "An explanation of how PaletteAI Inference Launchpad decides which model answers each request: the Tier map, the
  semantic router, where routing rules live, the guard, and how the semantic router shares the GPUs."
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
requests: the **Tier map** handles requests that name a model alias, and the **Semantic routing** rules handle the ones
the Tier map hands on or never receives. This page explains how the appliance walks the two controls in order, where the
rules live, how the semantic router chooses a model from a category and a complexity band, how its guard screens each
routed turn, and how it shares the appliance's GPUs. Read it to understand these ideas before you author routing rules,
so the rules you write match the requests your clients actually send.

## The Two-Stage Routing Decision

The appliance decides which model answers a request in two stages, in this order.

- **Stage 1: Tier map.** The Tier map rewrites a model alias the client sent to a model the appliance serves. If a Tier
  map row matches, the appliance uses the row's Model, attaches its Thinking directive, and the semantic router does not
  pick the model.

- **Stage 2: Semantic routing.** For requests that Stage 1 does not settle, the semantic router reads the prompt and
  picks a model from a category and a complexity band. Only some requests reach this stage; which requests those are is
  the source of the most common misconfiguration on the appliance.

## Where Routing Rules Live

Routing has three layers. Each layer sets the Tier map and the semantic routing rules for the layer beneath it.

<!-- vale off -->

| **Layer**              | **What it holds**                                                                                                                                                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Box defaults           | The defaults the appliance ships, which are the default alias map and the box default model. There is no box-level routing editor.                                                                                        |
| The workspace's policy | The **Routing** step of a policy under **Access & Policy** > **Policies**. A workspace follows one policy, and every client in the workspace runs under that policy's Tier map, Complexity threshold, and category rules. |
| The client             | The client's own rules, set in the **Routing** step of the **Add client** wizard or on the **Routing** tab of the client drawer. A client's own rules override its policy.                                                |

<!-- vale on -->

Every row in a client's routing starts filled with the model and reasoning depth that applies to the client today, so an
operator always reads the rule a request actually follows. Changing a row makes that row the client's own. **Use
defaults** removes the client's own rules, and the client follows what it inherits again.

<!-- vale off -->

{/* NEEDS REVIEW: Use defaults returns a client to its workspace's policy where the policy sets routing, but the console copy calls this the defaults. Confirm with engineering how the docs should name the inherited layer. */}

<!-- vale on -->

At the box level, an operator turns the semantic router and its two guard checks on or off on **Settings** >
**Configurations**. For what the switches do, refer to [The Guard](#the-guard) and
[The Semantic Router on the GPU](#the-semantic-router-on-the-gpu).

## The Tier Map

The Tier map answers this question: when a client asks for a model by alias, which model on the appliance actually
answers?

Each Tier map row has three columns.

- **Alias prefix.** The name the client sends, matched by prefix. Every Tier map starts with seven seeded presets, in
  this order: `claude-fable-`, `claude-opus-`, `claude-sonnet-`, `claude-haiku-`, `gpt-`, `gemini-`, and `grok-`. The
  seeded rows cannot be removed. You can also add a custom prefix.

- **Model.** A model the appliance serves, or the special picker value **Use Semantic Router rules**. When Model is a
  served model, the Tier map settles the request in Stage 1. When Model is **Use Semantic Router rules**, the alias is
  handed to the semantic router in Stage 2.

- **Thinking.** A directive attached to the chosen model that tells a reasoning-capable model how much reasoning to do
  before it answers. When the Tier map hands the alias to the semantic router, the directive becomes the inherited
  reasoning depth of the rule that answers. For the modes, levels, and per-engine behavior, refer to
  [The Thinking Directive](./thinking-directive.md).

<!-- vale off -->

A client that has no Tier map of its own follows the Tier map of its workspace's policy, or the default alias map when
the policy sets none. The console labels a seeded row that the inherited table leaves blank
`Not mapped, so the box default <model> answers it.` For a client that edits its own Tier map, the connect panel warns
that an alias left unmapped in that map makes an agent receive a `404`.

<!-- vale on -->

{/* NEEDS REVIEW: the console no longer shows the Fallback for unmatched requests control, and there is no other box default model control. Confirm with engineering where an operator sets the box default now, and whether a request that no rule settles still returns HTTP 404 in any case. */}

## What Reaches the Semantic Router

A request reaches the semantic router in exactly three cases.

- The request sends `auto` as the model.

- The request sends no model field, or sends an empty one. This behaves the same as `auto`.

- The request names an alias whose Tier map row is set to **Use Semantic Router rules**. The alias contributes its
  Thinking directive as the inherited reasoning depth.

Any other request is settled before the semantic router picks a model, by the served model it names, by a Tier map row,
by a request hint, or by the box default model. The **Usage** page counts these requests in a line such as
`21 requests were answered without routing`, and lists them in a table after that line.

:::warning

A client that sends `auto` bypasses the Tier map entirely. The most common misconfiguration on the appliance is an
operator who adds a Tier map row for a client such as Cursor, expecting that row to steer every request. Cursor sends
`auto` whenever its model picker is left on **Auto**, and that request never matches a Tier map row. It lands directly
on the client's **Semantic routing** rules instead. To steer this traffic, author a **Semantic routing** rule, not a
Tier map row.

When an operator enables a model in Cursor and selects it explicitly, as
[Use PaletteAI Inference Launchpad with Cursor](../how-to-guides/use-cursor.md) describes, Cursor sends that model name
and the matching Tier map row does apply.

:::

{/* NEEDS REVIEW: the narrowed claim that Cursor sends the selected model name, rather than `auto`, when the operator enables and explicitly selects a model in Cursor's picker is taken from the connect panel's Cursor instructions and needs SME confirmation against Cursor's shipped client behavior. */}

The **Semantic routing** rules in the console stay hidden behind the note `No alias sends its requests here yet.` until
at least one alias is set to **Use Semantic Router rules**. The rules still govern every request that sends `auto` or no
model.

## Categories and Complexity Bands

The semantic router reads each routed turn and keys every rule on two axes.

- **Category.** What the prompt is about. The six categories in the console are **Code planning**, **Code development**,
  **Code refactoring**, **Code review**, **Code test generation**, and **General**.

<!-- vale off -->

- **Complexity band.** A label the appliance derives from a complexity score. A request whose score is at or above the
  client's **Complexity threshold** is **Complex**. Otherwise, it is **Simple**.

<!-- vale on -->

The appliance owns the category vocabulary, and a later release may add or rename categories. A box configured before
this release may still show **Coding** and **Everything else** as extra rows marked `kept from an earlier setup`.

{/* NEEDS REVIEW: the routing editors show the six categories in sentence case, such as Code development, while the ticket's Usage screenshot shows Code Development in the Semantic routing table. Confirm that the two read the same before the docs settle on one form. */}

{/* NEEDS REVIEW: this release was built and tested as a clean install. Confirm the upgrade path from 1.1.x with the release owner, including what an upgraded box shows for rules authored under the earlier Coding and Everything else categories. */}

### How the Lookup Works

Each category has three rules, which are a **Simple** row, a **Complex** row, and a **Fallback** row. For a routed
request, the appliance looks up a rule in this order.

1. The semantic router reads the category and the complexity score for the prompt.

2. If the request has a score, the appliance uses the category's **Simple** row or **Complex** row, depending on where
   the score falls against the Complexity threshold.

3. If the request is not scored, the appliance uses the category's **Fallback** row.

4. If the row names no model, the request goes to the box default model.

The **Fallback** row is what keeps a category's traffic on a model you chose when scoring is unavailable. If a category
has banded rules but no fallback model, the console warns you to pick one, because a request in that category that is
not scored otherwise drops to the box default model.

A rule may name a model the appliance serves locally, or a frontier model from one of the client's provider keys. The
client's external inferencing settings and daily limit still apply to every rule that sends a request off the box, so a
rule that names a frontier model only works for a client with external inferencing enabled.

<!-- vale off -->

### Reasoning Depth per Rule

<!-- vale on -->

Every category row also carries a reasoning depth in its **Thinking** column.

| **Thinking value** | **What the rule does**                                                                                                                 |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Inherited**      | Uses the depth set on the Tier map alias that handed the request to the semantic router. The row shows it as `from tier map: <level>`. |
| **off**            | Turns reasoning off for this rule, whatever the alias says.                                                                            |
| **on**             | Turns reasoning on for this rule.                                                                                                      |
| **effort**         | Sets a reasoning level for this rule, which is **low**, **medium**, **high**, **xhigh**, or **max**.                                   |

**Inherited** and **off** are different answers. A rule left on **Inherited** follows each alias, so two aliases that
hand requests to the same rule can still reason to different depths. A rule set to **off** does not reason, whichever
alias the request came through.

### Four Worked Examples

Four requests from one client, each answered by a different row. The client's Complexity threshold is the default of
50%.

| **Category and row**               | **Rule**                                                                      | **What happens**                                                                                                                                                                                                     |
| ---------------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Code refactoring** / **Complex** | `deepseek-v4-pro`, Thinking **Inherited**                                     | A coding agent sends `auto` and asks to restructure a module across several files. The prompt scores at or above 50%. The router picks `deepseek-v4-pro`.                                                            |
| **Code development** / **Simple**  | `gemma-4`, Thinking **off**                                                   | A coding agent sends `auto` and asks for a short helper function. The prompt scores below 50%. The router picks `gemma-4` and turns reasoning off.                                                                   |
| **Code planning** / **Complex**    | A frontier model from the client's provider key, Thinking **effort** **high** | A request names `claude-opus-4-8`, whose alias is set to **Use Semantic Router rules**, and asks for a migration plan. The prompt scores at or above 50%. The router sends it off the box at a high reasoning level. |
| **General** / **Fallback**         | `glm-5.2`                                                                     | A request sends `auto`, and the semantic router cannot score it. The category's **Fallback** row answers with `glm-5.2`.                                                                                             |

The rules in this table are illustrative. Choose your own rules for the models your appliance serves and the provider
keys your clients hold.

## The Complexity Threshold

The Complexity threshold is the boundary between the **Simple** and the **Complex** band. The console shows it as a
slider with a percentage. A request that scores at or above the threshold goes to the **Complex** row, so a lower
threshold sends more requests there. The default is 50%.

A policy's **Routing** step sets a threshold for the clients that follow it, and each client can set its own. A client
that follows the default reads `Using the default of 50%.` under the slider. A client with its own value reads
`Set for this client. The default is 50%.` Selecting **Use default** returns the client to the value it inherits.

## The Guard

The same read that picks a request's category also screens each routed turn. This screen is the guard. It makes two
checks, and both are on by default.

- **Prompt attacks.** A turn read as a prompt attack is refused with HTTP `403`, whichever route it would have taken.

- **Personal data.** The guard screens for personal data only on turns that would leave the box, for a frontier provider
  or an external inference endpoint. Such a turn is refused with HTTP `403`, and nothing from it leaves the box. A turn
  that a local model answers is not held back for personal data.

Ordinary coding and general work is not flagged.

Each check has its own toggle on the **Semantic router** card under **Settings** > **Configurations**.

| **Toggle**                                                   | **When on**                                                                                            | **When off**                                       |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| **Refuse jailbreak attempts**                                | A turn the semantic router reads as a jailbreak attempt is refused.                                    | Turns are no longer refused as jailbreak attempts. |
| **Scan prompts for personal data before they leave the box** | A prompt bound for a provider is read in full first, and a prompt with personal data stays on the box. | No scan runs, and prompts reach providers unread.  |

## The Semantic Router on the GPU

The semantic router runs on the appliance's GPUs, beside the main model, sharing the same cards. The appliance deploys
it at installation, before any local model. A box that answers only through frontier providers therefore still routes
semantically.

When you deploy a main model, the semantic router moves onto that model's GPUs. Its engine restarts once, and routing
pauses briefly while it does. Because the semantic router needs room beside the main model, some models need at least
two GPUs on some hardware. For the models and GPUs this applies to, refer to
[Suggested Hardware](../reference/hardware-requirements.md#gpu).

An operator turns the semantic router on or off with the **Run the semantic router on this box** toggle on the
**Semantic router** card under **Settings** > **Configurations**. Turning it off stops its engine and frees its GPU
memory, while the main model keeps serving without a restart. Without the semantic router, the category and **Thinking**
columns of the routing rules do nothing, decision recording does nothing, and `auto` requests follow the box default
model. The **Semantic routing** rules then read
`The semantic router is not serving this box, so category rules have nothing to match and auto requests follow the box default.`

The toggle is unavailable, with the reason in the **Why the semantic router is unavailable** tooltip, in these cases.

| **Case**                                                   | **What it means**                                                                                   |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| The cluster has no GPU                                     | The semantic router needs a GPU and cannot run on this cluster.                                     |
| Every GPU is too small                                     | No card has enough graphics memory for the semantic router.                                         |
| The semantic router does not fit beside the deployed model | The cards the main model uses have no room left for the semantic router, so it is not deployed.     |
| The appliance cannot yet tell whether it fits              | The semantic router is held until the appliance can read whether it fits beside the deployed model. |

A missing GPU driver is different. The card shows it as an error that names the fix, and the toggle stays available.

## One Mode per Box

Because the semantic router shares one set of GPUs with the models it routes to, an appliance runs its models in one of
two modes. One mode is a text model with the semantic router, and the other is a text model with the semantic router and
a vision model. A model's catalog entry decides its mode.

| **Catalog entry name**        | **Mode**                                                                                     |
| ----------------------------- | -------------------------------------------------------------------------------------------- |
| Ends in `-shared-with-vision` | A text model that shares its GPUs with a vision model, such as `glm-5.3-shared-with-vision`. |
| Ends in `-vision`             | The vision model of that group, such as `qwen-3.5-9B-vision`.                                |
| A plain name                  | A text model that runs in text mode, such as `glm-5.3`.                                      |

The deploy picker offers only models of the appliance's current mode. A deploy of a model in the other mode is refused
with a message that names both modes and says to remove the current models first, or to move the model into the current
mode's group. For the deploy steps, refer to [Deploy a Model](../how-to-guides/deploy-a-model.md).

A model whose catalog entry names no GPU count and no group, such as a model you bring yourself, does not set a mode of
its own. The deploy dialog opens it on the group the appliance already runs, so it shares the GPUs with that group. On
an appliance that serves only the semantic router, that group is the semantic router's own.

Vision preprocessing needs a vision-mode text model. On a vision-mode appliance, image requests that send `auto` are
routed too, and the **Overview** page shows a **Vision preprocessing** card. For how image requests are handled, refer
to [Vision Preprocessing](./vision-preprocessing.md).

## Usage Reporting

The **Usage** page reports where routed traffic went and why.

- The **Semantic routing** table has one row per routing rule. It reports each rule's category, its complexity band, how
  the request reached the box, the model that answered, and the requests, tokens, cost, and average confidence for the
  row. A request the semantic router could not score shows `Not scored` as its band.

- The **Semantic routing** card ends with a line that counts the requests settled before the semantic router ran, such
  as `21 requests were answered without routing`, followed by a table of those requests. Its **Chosen by** column says
  why, which is a named model, an alias rule, a request hint, or the box default. When the semantic router handled every
  request, the line reads `Every request in this period went through the semantic router`.

- The **Local vs external** card reports how much traffic left the box.

Together, the **Semantic routing** table and the requests answered without routing account for every request in the
period. For the exact column names and values, refer to
[Usage Metrics Reference](../reference/usage-metrics-reference.md#semantic-routing).

## Decision Recording

Decision recording writes one row per classified turn for a client, so an operator can tune the categories and the
Complexity threshold against the traffic the client actually sends.

- Recording is per client and off by default. It lives on the **Recording** tab of the client drawer, and it needs the
  semantic router running.

- The tab reports **Turns recorded**, **Space used**, and **Dates covered**, and offers **Download CSV** and **Delete
  records**. **Delete records** asks for confirmation, and nothing is recovered afterward.

- Turns that the guard screened are stored redacted.

- The switch survives a restart. Turning recording on once keeps it on across appliance upgrades and node reboots until
  an operator turns it off.

- If a write to the record fails, the appliance disables recording rather than fail the request. Serving a client's
  request always takes priority over writing a decision row.

Recorded rows are for operator tuning. They are not a compliance audit log, and they are not shipped off the appliance.

## Metrics and Dashboards

The appliance ships a Grafana dashboard, **Launchpad — Semantic prompt classification & routing**, loaded through the
same dashboards mount as the other appliance dashboards. The dashboard leads with the share of traffic the semantic
router answered for, so an operator can know at a glance how much of the traffic the semantic router is choosing.

## Resources

- [Configure Semantic Routing](../how-to-guides/configure-semantic-routing.md) walks through turning the semantic router
  on or off, setting routing for the policy a workspace follows and for a client, and recording a client's decisions.

- [Manage a Client's Model Access](../how-to-guides/manage-client-model-access.md) walks through the Tier map and
  through allowing a client to reach external models.

- [Usage Metrics Reference](../reference/usage-metrics-reference.md) defines every field the **Usage** page reports.

- [Glossary](../reference/glossary.md) defines the routing terms used throughout this page.
