---
sidebar_label: "The Thinking Directive"
title: "The Thinking Directive"
description:
  "How the Thinking directive on the Tier Map controls reasoning depth, why the off option is disabled for some
  providers, and how a token budget is interpreted across engines."
hide_table_of_contents: false
sidebar_position: 6
tags: ["paletteai-inference-launchpad", "routing", "tier-map", "thinking", "explanation"]
keywords: ["launchpad", "ai", "thinking", "reasoning", "budget", "tier map"]
---

The Thinking directive is a per-tier setting on the [Tier Map](../reference/glossary.md#tier-map) that tells the
tier's resolved model how much reasoning to do before it answers. Each Tier Map row carries its own Thinking
directive, so different tiers on the same appliance can reason at different depths.

Reasoning is a hidden generation phase that a reasoning-capable model runs before it produces the visible answer. The
hidden phase costs tokens and adds latency. Setting the Thinking directive is how a platform administrator trades that
cost against answer quality for each tier. To perform this task, refer to
[Set the Thinking Directive for a Tier](../how-to-guides/set-tier-thinking.md). For the exact values each mode
carries, refer to [Thinking Directive Modes](../reference/thinking-modes.md).

## How Each Mode Is Interpreted

The console offers three modes: **off**, **on**, and **budget**. The tier's engine and its resolved model together
decide what the mode does at request time.

- **off** turns reasoning off. On a reasoning-capable model, the model skips the hidden phase and answers directly.

- **on** turns reasoning on with no explicit budget. The model reasons at the depth its own defaults choose.

- **budget** turns reasoning on with a token-budget hint. The value is a hint, not a hard cap. Refer to
  [Budget Is a Hint, Not a Cap](#budget-is-a-hint-not-a-cap) below for what each engine family does with it.

## Model-Aware Off

Some frontier providers do not expose a switch that turns reasoning off. For these providers, a Thinking value of
**off** has no meaning at the wire, so the console does not offer it. The Tier Map's Thinking selector disables
**off** whenever the tier resolves to one of the following models.

- OpenAI o-series models.

- OpenAI GPT-5 family models.

For a tier that resolves to one of these models, the selector offers only **on** and **budget**.

## When the Engine Has No Thinking Surface

Some engines have no reasoning surface at all. A small chat model that ships without a reasoning phase is the common
case. When the tier's resolved model runs on such an engine, the appliance accepts the Thinking directive and the
engine ignores it, because there is no phase for the directive to act on.

To make this state visible, the Tier Map row renders the **Thinking** column in a grey chip that reads
`ignored — no thinking surface`. The gateway passes the request through unchanged, so the request does not fail. The
directive takes effect the moment a reasoning-capable model serves the tier.

## Budget Is a Hint, Not a Cap

The `budget:<n>` value is a hint. How each engine family treats the value is described below.

- **Anthropic frontier models, version 4.6 and earlier**. The provider treats the value as a target it aims for, not
  as a limit. The provider's own documentation describes it as a target.

- **Anthropic frontier models, version 5 and later**. The value has no observable effect. Reasoning runs to the full
  output allowance regardless of the number set.

- **Local models**. No chat template that ships with the appliance reads the value. Local models ignore the budget on
  every family tested.

:::warning

Do not rely on `budget:<n>` to bound spend or response length. Use
[client quotas](../how-to-guides/manage-client-quotas.md) for spend, and the request's own output-token limit for
response length.

:::
