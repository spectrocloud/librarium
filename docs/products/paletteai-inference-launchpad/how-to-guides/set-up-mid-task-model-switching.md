---
sidebar_label: "Set Up Mid-Task Model Switching"
title: "Set Up Mid-Task Model Switching"
description:
  "Step-by-step guidance for platform administrators on how to turn Mid-Task Model Switching on or off, change its
  switching settings, and choose the efficient and capable models for a client's alias on a PaletteAI Inference
  Launchpad appliance."
hide_table_of_contents: false
sidebar_position: 2.25
tags: ["paletteai-inference-launchpad", "routing", "settings", "how-to"]
keywords:
  [
    "launchpad",
    "ai",
    "mid-task model switching",
    "efficient model",
    "capable model",
    "confidence threshold",
    "judge model",
    "tier map",
    "coding assistant",
  ]
---

This guide explains how a platform administrator sets up
[Mid-Task Model Switching](../reference/glossary.md#mid-task-model-switching) on a PaletteAI Inference Launchpad
appliance. You turn the feature on in **Settings**. Then you choose the two models for a client's alias on the client's
**Routing** tab. To learn how a task moves between the two models, refer to
[Mid-Task Model Switching](../explanation/mid-task-model-switching.md).

## Prerequisites

- A running PaletteAI Inference Launchpad appliance, with the console reachable.

- Console access as a person who holds the **Platform administrator** role.

- _(Client steps only)_ An existing client. To create one, refer to [Create a Client](./create-a-client.md).

- _(Client steps only)_ An efficient model for most turns and a stronger capable model for the hard turns. To deploy a
  model, refer to [Deploy a Model](./deploy-a-model.md).

- _(External capable model only)_ External inferencing enabled for the client. To enable it, refer to
  [Manage a Client's Model Access](./manage-client-model-access.md#allow-a-client-to-reach-external-models).

- _(Judge model only)_ The semantic router running on the appliance. To turn it on, refer to
  [Configure Semantic Routing](./configure-semantic-routing.md#turn-the-semantic-router-on-or-off).

## Turn Mid-Task Model Switching On or Off

1. From the left main menu, select **Settings**.

2. On the **Settings** menu, under **Request handling**, select **Mid-Task Model Switching**.

3. Turn the **Use Mid-Task Model Switching on Inference Launchpad** toggle on or off. While the toggle is on, the
   **Switching settings** appear.

4. Select **Apply**.

## Change the Switching Settings

Use these steps while Mid-Task Model Switching is on. For what each setting does and its default, refer to
[The Switching Settings](../explanation/mid-task-model-switching.md#the-switching-settings).

1. From the left main menu, select **Settings**.

2. On the **Settings** menu, under **Request handling**, select **Mid-Task Model Switching**.

3. Under **Switching settings**, change any of these values.

   - In **Confidence threshold (%)**, enter a percentage.

   - In **Turns held on the capable model**, enter a whole number.

   - Turn the **Judge model** toggle on or off.

   To return all three settings to their defaults, select **Reset to defaults** instead.

4. Select **Apply**.

5. In the **Restart Mid-Task Model Switching?** dialog, select **Apply and restart**.

   An `Applied the Mid-Task Model Switching settings and restarted it.` message appears. The card shows the saved
   values.

## Choose the Models for a Client's Alias

Use these steps while Mid-Task Model Switching is on. To turn it on, refer to
[Turn Mid-Task Model Switching On or Off](#turn-mid-task-model-switching-on-or-off).

1. In the workspace drop-down menu in the console header, select the client's workspace.

2. From the left main menu, select **Access Management**, and then select the **Clients** tab.

3. Select the client to open its detail panel, and then select the **Routing** tab.

4. In the **Tier map**, find the alias that the client's coding assistant sends. Set its **Model** to **Use Mid-Task
   Model Switching for routing**.

   The **Mid-Task Model Switching** card appears.

5. From the **Efficient model** drop-down menu on the card, select the model for most turns.

6. From the **Capable model** drop-down menu, select the model for the hard turns.

7. Make sure that every other alias in the **Tier map** has a model.

8. On the **Tier map**, select **Save**, and then select **Save** in the **Save alias routing** dialog.

## Validate

1. From the left main menu, select **Settings**.

2. On the **Settings** menu, under **Request handling**, select **Mid-Task Model Switching**.

3. Confirm that the **Use Mid-Task Model Switching on Inference Launchpad** toggle shows the state that you applied.

4. If the toggle is on, confirm that the **Switching settings** show the values that you applied.

5. In the workspace drop-down menu in the console header, select the client's workspace.

6. From the left main menu, select **Access Management**, and then select the **Clients** tab.

7. Select the client to open its detail panel, and then select the **Routing** tab.

8. In the **Tier map**, confirm that the alias reads **Use Mid-Task Model Switching for routing**.

9. On the **Mid-Task Model Switching** card, confirm that **Efficient model** and **Capable model** show the models that
   you chose.

## Next Steps

- [Use Claude Code](./use-claude-code.md) to connect a coding assistant to the appliance.

- [Use Cursor](./use-cursor.md), [Use OpenAI Codex](./use-codex.md), or [Use OpenCode](./use-opencode.md) for the other
  supported tools.
