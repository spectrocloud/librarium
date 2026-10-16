---
sidebar_label: "Semantic Router Guard"
title: "Semantic Router Guard"
description:
  "An explanation of the guard that the semantic router applies to each routed request on a PaletteAI Inference
  Launchpad appliance: its two checks, which requests each check applies to, and what happens when a check refuses one."
hide_table_of_contents: false
sidebar_position: 7.2
tags: ["paletteai-inference-launchpad", "explanation", "routing", "semantic-routing", "guard", "security"]
keywords:
  [
    "launchpad",
    "ai",
    "guard",
    "semantic router",
    "prompt attack",
    "jailbreak",
    "personal data",
    "403",
    "external inferencing",
  ]
---

The guard is two checks that the semantic router of a PaletteAI Inference Launchpad appliance runs on each request it
reads to pick a category. This page explains the two checks, which requests each one applies to, and what happens when a
check refuses a request. For which requests the semantic router reads, refer to
[What Reaches the Semantic Router](./routing-behavior.md#what-reaches-the-semantic-router).

## The Two Checks

The guard makes two checks, and both are on by default. Each check has its own toggle on the **Semantic router** card
under **Settings** > **Configurations**.

| **Check**      | **What it looks for**                      | **Which requests it applies to**                                                                  |
| -------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| Prompt attacks | Prompt attacks, such as jailbreak attempts | Every request the semantic router reads, whichever route the request would have taken.            |
| Personal data  | Personal data in the prompt                | Only requests that would leave the box for a frontier provider or an external inference endpoint. |

Ordinary coding and general work does not fail either check.

## When a Check Refuses a Request

A request read as a prompt attack is refused with HTTP `403`, whichever route it would have taken.

A request that carries personal data and would leave the box is refused with HTTP `403`, and nothing from it leaves the
box. A request that a local model answers is not held back for personal data.

## Resources

- [Guard Toggles](../reference/semantic-routing-reference.md#guard-toggles) lists both states of each toggle.

- [Configure Semantic Routing](../how-to-guides/configure-semantic-routing.md#turn-the-guard-checks-on-or-off) walks
  through turning each check on or off.

- [Routing Behavior](./routing-behavior.md) explains how the Tier map and the semantic router pick the model for each
  request.
