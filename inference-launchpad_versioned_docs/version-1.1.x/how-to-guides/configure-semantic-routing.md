---
sidebar_label: "Configure Semantic Routing"
title: "Configure Semantic Routing"
description:
  "Step-by-step guidance for platform administrators on how to set the Complexity threshold, author category rules,
  override both for a client, and turn on Decision recording on a PaletteAI Inference Launchpad appliance."
hide_table_of_contents: false
sidebar_position: 2.2
tags: ["paletteai-inference-launchpad", "routing", "semantic-routing", "how-to"]
keywords:
  [
    "launchpad",
    "ai",
    "semantic routing",
    "complexity threshold",
    "coding",
    "everything else",
    "simple",
    "complex",
    "decision recording",
  ]
---

This guide explains how a platform administrator sets and overrides the appliance's semantic routing rules on a
PaletteAI Inference Launchpad appliance. For what the semantic router does, how it combines with the Tier map, and how a
client inherits from the box, refer to [Routing Behavior](../explanation/routing-behavior.md).

## Prerequisites

- A running PaletteAI Inference Launchpad appliance, with the console reachable.
- Console access with permission to edit routing settings.
- One or more served models to route requests to. To deploy a model, refer to [Deploy a Model](./deploy-a-model.md).
- _(Per-client steps only)_ An existing client. To create one, refer to [Create a Client](./create-a-client.md).
- _(Off-box category rules only)_ Egress enabled for the client that uses the rule. To enable egress, refer to
  [Manage a Client's Model Access](./manage-client-model-access.md#allow-a-client-to-reach-external-models).

## Set the Box-Wide Complexity Threshold

Use these steps to set the boundary between the **Simple** and the **Complex** band for every client that follows the
box.

1. From the left main menu, select **Settings**.

2. Select the **Configurations** tab.

3. On the **Semantic routing** card, enter a value for **Complexity threshold**. The value is between `0` and `1` and is
   shown as a percentage. A lower value sends more traffic to the **Complex** rule.

4. Select **Save**.

## Author Category Rules on the Box

Use these steps to choose which model answers each combination of category and complexity band for every client that
follows the box.

1. From the left main menu, select **Settings**.

2. Select the **Configurations** tab.

3. On the **Semantic routing** card, find the **Coding** row and the **Everything else** row.

4. For each row, choose a model for the **Simple** band and a model for the **Complex** band. To answer requests the
   classifier could not score, also choose a model for the bare category row.

5. _(External target only)_ To route a category to a frontier or external target, choose that target in the row. The
   default-deny egress gate still applies to each client that uses the rule.

6. Select **Apply** to apply the pending changes.

## Override the Complexity Threshold for a Client

Use these steps to give one client its own boundary between **Simple** and **Complex**. An empty value means the client
follows the box.

1. From the left main menu, select **Access & Policy** > **Clients**.

2. Select the client to open its detail panel.

3. In the **Routing** section, find the **Semantic routing** card.

4. Enter a value for **Complexity threshold**. Leave the field empty to follow the box.

5. Select **Save**.

## Override Category Rules for a Client

Use these steps to give one client its own model for each category and band. Any row you leave as the box set it stays
inherited from the box.

1. From the left main menu, select **Access & Policy** > **Clients**.

2. Select the client to open its detail panel.

3. In the **Routing** section, find the **Semantic routing** card. The rows are seeded from the box setting the client
   currently follows.

4. For each row you want the client to override, choose a model for the **Simple** band and a model for the **Complex**
   band. To answer requests the classifier could not score, also choose a model for the bare category row.

5. Select **Apply** to apply the pending changes.

:::info

The **Semantic routing** card governs every request from this client that sends `auto`, and every request whose alias is
set to **Choose per request** in the client's Tier map. To hand an alias to the semantic router, edit the Tier map row
and set its **Model** column to **Choose per request**.

:::

## Turn On Decision Recording

Use these steps to record one CSV row per classification for a client, so you can tune the categories and the Complexity
threshold against real traffic.

1. From the left main menu, select **Access & Policy** > **Clients**.

2. Select the client to open its detail panel.

3. In the **Decision recording** section, turn recording on. The switch survives an appliance restart.

4. Let the appliance run long enough to record traffic that represents your workload.

## Download the Recorded CSV

1. From the left main menu, select **Access & Policy** > **Clients**.

2. Select the client to open its detail panel.

3. In the **Decision recording** section, select **Download**.

## Delete the Recorded CSV

1. From the left main menu, select **Access & Policy** > **Clients**.

2. Select the client to open its detail panel.

3. In the **Decision recording** section, select **Delete**.

4. In the confirmation dialog, confirm the deletion.

## Next Steps

- [Manage a Client's Model Access](./manage-client-model-access.md)
- [View Client Usage](./view-client-usage.md)
