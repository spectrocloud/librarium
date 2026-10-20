---
sidebar_label: "Share a GPU Between Models"
title: "Share a GPU Between Models"
description:
  "Step-by-step guidance for platform operators on how to deploy a model that shares a GPU with other models on a
  PaletteAI Inference Launchpad appliance, and how to change the GPU memory share of a model that already runs."
hide_table_of_contents: false
sidebar_position: 1.1
tags: ["paletteai-inference-launchpad", "models", "gpu", "how-to"]
keywords: ["launchpad", "ai", "gpu sharing", "gpu memory share", "deploy", "group", "accelerator"]
---

This guide explains how to deploy a model that shares a GPU with the other models of a group, and how to change the GPU
memory share of a model that already runs. The appliance names the group, so you never type a group name. The console
calls each GPU an accelerator. For how groups, shares, and the semantic router fit together, refer to
[GPU Sharing](../explanation/gpu-sharing.md).

## Prerequisites

- A running PaletteAI Inference Launchpad appliance, with the admin console reachable and operator access.

- A model in the appliance catalog. To place a model in the catalog, refer to [Upload a Model](./upload-a-model.md).

- _(Change a share only)_ A model that already runs on the appliance.

## Deploy a Model That Shares a GPU

1. From the left main menu, select **Cluster**, and then select the **Models** tab.

2. Select **Deploy Model**. The **Deploy a model** wizard opens on the **Model and placement** step.

3. Open the **Model** drop-down menu and select the model.

4. In **Nodes**, select the nodes that run the model. When the appliance already runs a sharing group, the wizard starts
   with **GPU sharing** on, so you can also select a node whose GPUs are all in use.

5. Select **Next**. The **Serving** step opens.

6. _(Optional)_ Change the engine's serving settings, such as **Extra arguments** and **Environment variables**.

7. Select **Next**. The **GPU sharing** step opens.

8. Confirm that the **GPU sharing** toggle is on. If it is off, turn it on. The step states the group that the model
   joins in one line, such as `This model joins text-router. Inference Launchpad runs one mode, and this is it.` When no
   group runs and the model's recipe names none, the line reads `Inference Launchpad names the group after this model.`

9. In the **Shared GPU memory** panel, enter the model's share in its **GPU memory share** field. The share is a
   percentage of one GPU's memory.

10. Review the total that the panel reports under the bar. The panel reads
    `The shares add up to <total> of one accelerator, which fits.` when the plan fits. In the message, `<total>` is the
    sum of the shares, in percent. If the panel reports a problem instead, refer to
    [Resolve a Refused Sharing Plan](#resolve-a-refused-sharing-plan).

11. _(Optional)_ To make room for the new model, lower the share of another member of the group in its **GPU memory
    share** field. A member marked **not editable**, such as the **Semantic Router**, keeps its share.

12. Select **Deploy**. If the deploy changes the share of another model, a confirmation names each model that restarts.
    Select **Deploy** again to confirm.

The model appears on the **Models** tab, and its **Group** column names the group that it joined. The console shows a
message such as `glm-5.3-shared-with-vision is being deployed. Its state shows when it can serve.`

If the deploy starts a new group, the semantic router moves into it, and routing pauses briefly while its engine
restarts.

### Verify the Shared Deploy

1. On the **Models** tab, confirm that the model's **Group** column names the group, such as `text-router`.

2. Wait until the model's health chip reads `N/N healthy`.

3. Select the **Nodes** tab. Confirm that the row of each node that runs the model names the group and lists the model
   with its share. The row also reports the node's GPU memory in GB and the memory that is left, such as
   `2 of 2 shareable · 180 GB free (94%)`.

## Change a Running Model's GPU Memory Share

1. From the left main menu, select **Cluster**, and then select the **Models** tab.

2. On the model's row, open the three-dot menu and select **GPU sharing**. The **GPU sharing** step opens on the values
   that the model runs with today.

3. In the **Shared GPU memory** panel, change the model's share in its **GPU memory share** field. You can also change
   the share of any other member, except a member marked **not editable**. **Save** becomes available after you change a
   value.

4. Review the total that the panel reports. If the panel reports a problem, refer to
   [Resolve a Refused Sharing Plan](#resolve-a-refused-sharing-plan).

5. Select **Save**. A confirmation names each model that restarts. Select **Save** again to confirm. The model restarts
   with its new share, and so does any other member whose share you changed.

To change the model's nodes, GPU width, or serving settings instead, select **Serving configuration** from the same
three-dot menu. The nodes and the GPU width open on the placement that the model already has, so they stay selected even
on a node that has no free GPU.

## Resolve a Refused Sharing Plan

When the panel refuses a plan, **Deploy** and **Save** are unavailable, and the panel states the problem. Use the
following table to fix it.

| **What the panel reports**                                               | **What to do**                                                                                  |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| `The shares add up to more than the accelerator holds.`                  | Lower the share of the new model, or of another member, until the total is 100 percent or less. |
| `A model reserves no share of the accelerator.`                          | Enter a share greater than `0` for that model.                                                  |
| `A model has no explicit share, so the planned total cannot include it.` | Enter a share for every member of the group.                                                    |

A total of more than 90 percent shows a warning on the **Free** row but does not block **Deploy** or **Save**. To give
the engines room for their own overhead, lower a share until the total is 90 percent or less.

## Next Steps

To learn how the appliance names the group and why the semantic router counts in the total, refer to
[GPU Sharing](../explanation/gpu-sharing.md). To deploy a model that takes whole GPUs, refer to
[Deploy a Model](./deploy-a-model.md). To turn the semantic router off and free its share, refer to
[Configure Semantic Routing](./configure-semantic-routing.md).
