---
sidebar_label: "Thinking Directive Modes"
title: "Thinking Directive Modes"
description:
  "Reference of the Thinking directive modes on the Tier map, the value each mode carries at request time, the console
  states that override the setting, and how each engine family interprets a token budget."
hide_table_of_contents: false
sidebar_position: 4.8
tags: ["paletteai-inference-launchpad", "routing", "tier-map", "thinking", "reference"]
keywords: ["launchpad", "ai", "thinking", "reasoning", "budget", "tier map"]
---

This reference lists the Thinking directive modes on the Tier map of a PaletteAI Inference Launchpad appliance, the
value each mode carries at request time, the console states that override the setting, and how each engine family
interprets a token budget. For the concept behind the directive, refer to
[The Thinking Directive](../explanation/thinking-directive.md). For the steps to set the directive, refer to
[Set the Thinking Directive for a Tier](../how-to-guides/set-tier-thinking.md).

## Modes

| **Mode**   | **Authored value** | **What the model does**                                                                          |
| ---------- | ------------------ | ------------------------------------------------------------------------------------------------ |
| **off**    | `off`              | The model does not reason. It answers each request directly.                                     |
| **on**     | `on`               | The model reasons at the depth its own defaults choose. No token budget is set.                  |
| **budget** | `budget:<n>`       | The model reasons with a token-budget hint of `<n>` tokens. The value is a hint, not a hard cap. |

## Per-Engine Interpretation of Budget

| **Engine family**                           | **How the value is treated**                                                                   |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Anthropic frontier, version 4.6 and earlier | A target the provider aims for, not a limit.                                                   |
| Anthropic frontier, version 5 and later     | No observable effect. Reasoning runs to the full output allowance.                             |
| Local models                                | Not read. No chat template that ships with the appliance reads the value on any family tested. |

## Console States That Override the Setting

| **State**                                         | **When it appears**                                                                     | **Effect**                                                        |
| ------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `off` is disabled                                 | The tier resolves to an OpenAI o-series or GPT-5 family model.                          | The selector does not offer **off** for that tier.                |
| Grey chip reading `ignored — no thinking surface` | The tier's resolved model runs on an engine that has no reasoning surface.              | The engine ignores the directive; the request is served normally. |
