---
sidebar_label: "Thinking Directive Modes"
title: "Thinking Directive Modes"
description:
  "Reference of the Thinking directive modes on the Tier Map, the effort levels, per-engine interpretation, and the
  console states that override the setting."
hide_table_of_contents: false
sidebar_position: 4.8
tags: ["paletteai-inference-launchpad", "routing", "tier-map", "thinking", "reference"]
keywords: ["launchpad", "ai", "thinking", "reasoning", "effort", "tier map"]
---

This reference lists the Thinking directive modes on the [Tier Map](./glossary.md#tier-map) of a PaletteAI Inference
Launchpad appliance, the effort levels, how each engine family interprets the level, and the console states that
override the setting. For the concept behind the directive, refer to
[The Thinking Directive](../explanation/thinking-directive.md). For the steps to set the directive, refer to
[Set the Thinking Directive for a Tier](../how-to-guides/set-tier-thinking.md).

## Modes

| **Mode**   | **Authored value** | **What the model does**                                                                                    |
| ---------- | ------------------ | ---------------------------------------------------------------------------------------------------------- |
| **off**    | `off`              | The model does not reason. It answers each request directly.                                               |
| **on**     | `on`               | The model reasons at medium effort. Equivalent to `effort:medium`.                                         |
| **effort** | `effort:<level>`   | The model reasons at the chosen level. Each level maps to the model's native effort control on the engine. |

## Effort Levels

<!-- vale off -->

| **Level** | **Authored value** | **Relative depth**                        |
| --------- | ------------------ | ----------------------------------------- |
| low       | `effort:low`       | Shortest hidden phase the model supports. |
| medium    | `effort:medium`    | Default depth. Selected by a bare **on**. |
| high      | `effort:high`      | Deeper reasoning than `medium`.           |
| xhigh     | `effort:xhigh`     | Deeper reasoning than `high`.             |
| max       | `effort:max`       | Deepest hidden phase the model supports.  |

<!-- vale on -->

## Per-Engine Interpretation of Effort

| **Engine family**                 | **How the level is treated**                                                                                                      |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Anthropic frontier                | Every level takes effect. Reasoning depth rises monotonically from `low` to `max`.                                                |
| OpenAI frontier                   | Each model version supports its own set of levels. A level deeper than the model supports reduces to the deepest supported level. |
| Local models                      | Only **on** and **off** are honored. Most local models do not read a graded level.                                                |
| Engines with no reasoning surface | The directive is accepted and ignored. The row shows the ignored chip.                                                            |

## Console States That Override the Setting

| **State**                                         | **When it appears**                                                        | **Effect**                                                        |
| ------------------------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `off` is disabled                                 | The tier resolves to an OpenAI o-series or GPT-5 family model.             | The selector does not offer **off** for that tier.                |
| Grey chip reading `ignored — no thinking surface` | The tier's resolved model runs on an engine that has no reasoning surface. | The engine ignores the directive; the request is served normally. |
