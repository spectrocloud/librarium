---
sidebar_label: "Set a System Prompt"
title: "Set a System Prompt"
description:
  "Step-by-step guidance for platform administrators on how to set a default system prompt and per-model system prompts
  on a PaletteAI Inference Launchpad appliance."
hide_table_of_contents: false
sidebar_position: 2.5
tags: ["paletteai-inference-launchpad", "settings", "system-prompt", "how-to"]
keywords: ["launchpad", "ai", "system prompt", "default instruction", "per model instructions", "settings"]
---

This guide explains how to set a [system prompt](../reference/glossary.md#system-prompt) on a PaletteAI Inference
Launchpad appliance. The console calls a system prompt an instruction. You set one default instruction for every model,
and you can give a model its own instruction that replaces the default. To learn which requests receive the instruction,
refer to [System Prompts](../explanation/architecture.md#system-prompts).

## Prerequisites

- A running PaletteAI Inference Launchpad appliance, with the console reachable.

- Console access as a person who holds the **Platform administrator** role.

- _(Per-model instructions only)_ A model in the appliance catalog. To place a model in the catalog, refer to
  [Upload a Model](./upload-a-model.md).

- _(Validation only)_ A model that is deployed and serving. To deploy a model, refer to
  [Deploy a Model](./deploy-a-model.md).

## Set the Default Instruction

1. From the left main menu, select **Settings**.

2. On the **Settings** menu, under **Request handling**, select **Prompt Instructions**.

3. In the **Default instruction** field, enter the instruction for every model that has no instruction of its own. For
   example, `Answer every question in Spanish.`

4. Select **Apply**.

   A **Prompt settings saved** message appears.

## Set an Instruction for One Model

1. From the left main menu, select **Settings**.

2. On the **Settings** menu, under **Request handling**, select **Prompt Instructions**.

3. Under **Per model instructions**, select **Add per model instruction**.

4. From the **Model** drop-down menu, select the model.

5. In the **Instruction** field, enter the instruction for that model.

6. _(Optional)_ To give another model its own instruction, repeat steps 3 - 5.

7. Select **Apply**.

   A **Prompt settings saved** message appears.

## Remove an Instruction

1. From the left main menu, select **Settings**.

2. On the **Settings** menu, under **Request handling**, select **Prompt Instructions**.

3. Remove the instruction you no longer need.

   - To remove the default instruction, clear the **Default instruction** field.

   - To remove the instruction for one model, select the trash icon on that model's row under **Per model
     instructions**.

4. Select **Apply**.

   A **Prompt settings saved** message appears.

## Validate

Use the **Chat** tab on the **Diagnose** page for this check, not a coding agent.

1. From the left main menu, select **Diagnose**.

2. Select the **Chat** tab.

3. From the **Model** drop-down menu, select a model that receives the instruction.

4. Send a message that the instruction affects. For example, with the instruction `Answer every question in Spanish.`,
   send `What is Kubernetes?`.

5. Confirm that the reply follows the instruction. With the example instruction, the reply is in Spanish.

## Next Steps

- [System Prompts](../explanation/architecture.md#system-prompts)

- [Create a Client](./create-a-client.md)
