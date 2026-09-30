---
sidebar_label: "Set the Thinking Directive for a Tier"
title: "Set the Thinking Directive for a Tier"
description:
  "Step-by-step guidance for platform administrators on how to set the Thinking directive for a tier on the Tier map of
  a PaletteAI Inference Launchpad appliance."
hide_table_of_contents: false
sidebar_position: 2
tags: ["paletteai-inference-launchpad", "routing", "tier-map", "thinking", "how-to"]
keywords:
  ["launchpad", "ai", "thinking", "reasoning", "tier map", "budget", "routing"]
---

This guide explains how to set the Thinking directive for a tier on the
[Tier Map](../reference/glossary.md#tier-map) of a PaletteAI Inference Launchpad appliance. For what the directive
does and how each mode is interpreted, refer to [The Thinking Directive](../explanation/thinking-directive.md). For
the value each mode carries at request time, refer to [Thinking Directive Modes](../reference/thinking-modes.md).

## Prerequisites

- A running PaletteAI Inference Launchpad appliance, with the console reachable.

- Console access with permission to edit routing settings.

- At least one tier with a resolved model on the Tier map. To place a model on the appliance, refer to
  [Deploy a Model](./deploy-a-model.md).

## Set the Thinking Directive

1. From the left main menu, select **Routing**.

2. On the **Tier map** card, find the row for the tier you want to change and select **edit**.

3. In the **Thinking** selector, choose **off**, **on**, or **budget**.

4. _(**budget** only)_ In the field next to the selector, enter a positive token count, such as `4096`.

5. Select **Apply tier** and confirm the plan card.

## Validate

- The **Tier map** row shows the new directive in the **Thinking** column, formatted as `on`, `off`, or `budget:<n>`.

- Send a request through the tier and open its trace. On a reasoning-capable model, the response reports a non-zero
  reasoning-token count.

## Next Steps

- [The Thinking Directive](../explanation/thinking-directive.md)

- [Thinking Directive Modes](../reference/thinking-modes.md)

- [Manage a Client's Model Access](./manage-client-model-access.md)
