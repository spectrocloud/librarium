---
sidebar_label: "The Thinking Directive"
title: "The Thinking Directive"
description:
  "How the Thinking directive on the Tier Map controls reasoning depth by effort level, why the off option is disabled
  for some providers, how each engine interprets the level, and the shared output allowance that reasoning and answer
  tokens draw from."
hide_table_of_contents: false
sidebar_position: 8
tags: ["paletteai-inference-launchpad", "routing", "tier-map", "thinking", "explanation"]
keywords: ["launchpad", "ai", "thinking", "reasoning", "effort", "tier map"]
---

The Thinking directive is a per-tier setting on the [Tier Map](../reference/glossary.md#tier-map) that tells the tier's
resolved model how much reasoning to do before it answers. Each Tier Map row carries its own Thinking directive, so
different tiers on the same appliance can reason at different depths.

Reasoning is a hidden generation phase that a reasoning-capable model runs before it produces the visible answer. The
hidden phase costs tokens and adds latency. Setting the Thinking directive is how a platform administrator trades that
cost against answer quality for each tier. To perform this task, refer to
[Set the Thinking Directive for a Tier](../how-to-guides/set-tier-thinking.md). For the values each mode carries, refer
to [Thinking Directive Modes](../reference/thinking-modes.md).

## How Each Mode Is Interpreted

The console offers three modes: **off**, **on**, and **effort**. The tier's engine and its resolved model together
decide what the mode does at request time.

- **off** turns reasoning off. On a reasoning-capable model, the model skips the hidden phase and answers directly.

- **on** turns reasoning on at medium effort. It is a shorthand for `effort:medium`.

- **effort** turns reasoning on at the level you pick. The five levels are `low`, `medium`, `high`, `xhigh`, and `max`.
  Each level maps to the model's native effort control.

:::info

Selecting **on** without a level uses `medium`. The behavior is the same as `effort:medium`, but the picker does not
show the cost difference between **off** and **on**.

:::

## Model-Aware Off

Some frontier providers do not expose a switch that turns reasoning off. For these providers, a Thinking value of
**off** has no meaning at the wire, so the console does not offer it. The Tier Map's Thinking selector disables **off**
whenever the tier resolves to one of the following models.

- OpenAI o-series models.

- OpenAI GPT-5 family models.

For a tier that resolves to one of these models, the selector offers only **on** and **effort**.

## When the Engine Has No Thinking Surface

Some engines have no reasoning surface at all. A small chat model that ships without a reasoning phase is the common
case. When the tier's resolved model runs on such an engine, the appliance accepts the Thinking directive and the engine
ignores it, because there is no phase for the directive to act on.

To make this state visible, the Tier Map row renders the **Thinking** column in a grey chip that reads
`ignored — no thinking surface`. The gateway passes the request through unchanged, so the request does not fail. The
directive takes effect the moment a reasoning-capable model serves the tier.

## Per-Engine Effort Behavior

An `effort:<level>` directive maps to each model's native effort control. How the mapping behaves depends on the engine
family.

- **Anthropic frontier models**. Every level takes effect. Reasoning depth rises monotonically from `low` to `max`.

- **OpenAI frontier models**. Each model version supports its own set of levels. A level deeper than the model supports
  silently reduces to the deepest supported level. The request does not fail.

- **Local models**. The engine honors **on** and **off**. Most local models do not read a graded level, because effort
  grading lives in the model's own prompt template rather than in an API parameter the gateway can push. The Tier Map
  still shows the level that was set.

- **Engines with no reasoning surface**. The directive is accepted and ignored. Refer to
  [When the Engine Has No Thinking Surface](#when-the-engine-has-no-thinking-surface).

## Shared Output Allowance

Reasoning tokens and the visible answer draw from a single output-token allowance per request. A deep effort level can
consume the whole allowance during the hidden phase, so the answer starts against a zero budget and the reply is empty.
The reasoning tokens are still charged.

The appliance raises the output allowance when reasoning is on, which makes the empty-reply case rare in practice. A
client that sets a small output-token limit on its own request still has this risk.

:::warning

If a client sets a small output-token limit on a request that reaches a tier configured for a deep effort level, the
reply can be empty. Charge for the reasoning tokens still applies.

:::

## Legacy Tier Rules with a Token Budget

Earlier PaletteAI Inference Launchpad versions exposed a **budget** mode on the Thinking picker, which took a token
count. The current console no longer offers **budget** as a picker choice, but a tier rule saved under an earlier
release still works. The console reads the saved token budget, maps it to the closest effort level, and displays the
rule as that effort level. Rules do not need to be re-saved.
