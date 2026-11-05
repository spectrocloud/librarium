---
sidebar_label: "Deploy a Model"
title: "Deploy a Model"
description:
  "Step-by-step guidance for platform operators on how to deploy an LLM model to a running PaletteAI Inference Launchpad
  appliance, choose which nodes run it, and verify that it is serving."
hide_table_of_contents: false
sidebar_position: 1
tags: ["paletteai-inference-launchpad", "models", "how-to"]
keywords: ["launchpad", "ai", "deploy", "model", "nodes", "placement", "multi-node"]
---

This guide explains how to deploy a model to a running PaletteAI Inference Launchpad appliance, choose which nodes run
it, and verify that the model is serving requests. On a multi-node appliance, you select the target nodes in the deploy
wizard. For why you would pin a model to some nodes and not others, refer to
[Model Placement](../explanation/model-placement.md).

## Prerequisites

- A running PaletteAI Inference Launchpad appliance, with the admin console reachable and operator access.
- At least one node that can host the model you intend to deploy, or a sharing group that the model can join. For
  sharing groups, refer to [GPU Sharing](../explanation/gpu-sharing.md).
- The model present in the appliance catalog and able to fit at least one node's available GPU resources. To confirm
  support, refer to [Certified Models by Hardware](../reference/certified-models-by-hardware.md) and
  [Suggested Hardware](../reference/hardware-requirements.md). To place a model in the appliance catalog, follow
  [Upload a Model](./upload-a-model.md) first.

## Deploy a Model

1. From the left main menu, select **Cluster**. The page opens on the **Nodes** tab.

2. Select the **Models** tab, and then select **Deploy Model**. The **Deploy a model** wizard opens on the **Model and
   placement** step. The wizard's three steps are **Model and placement**, **Serving**, and **GPU sharing**. Select
   **Next** and **Previous** to move between them.

3. Open the **Model** drop-down menu and select the model to deploy. The menu lists only models of the appliance's
   current mode. For the two modes, refer to
   [One Mode per Appliance](../explanation/routing-behavior.md#one-mode-per-appliance).

4. _(Optional)_ Open the **GPU width** drop-down menu and select the number of GPUs that one replica of the model runs
   across. Leave it on **The recipe's default** to use the width that the model's recipe sets.

5. In **Nodes**, select every node that should run the model. You cannot select a node whose GPUs are all in use, or
   that has fewer free GPUs than the GPU width. If the model joins a GPU sharing group that already holds the GPUs on a
   node, you can select that node. For the full list of reasons a node cannot run a model, refer to
   [Why a Node Cannot Be Chosen](../explanation/model-placement.md#why-a-node-cannot-be-chosen).

6. Select **Next**. The **Serving** step opens.

7. _(Optional)_ Change the engine's serving settings, such as **Extra arguments** and **Environment variables**.

8. Select **Next**. The **GPU sharing** step opens.

9. To give the model whole GPUs of its own, turn off the **GPU sharing** toggle. To share a GPU with the models of a
   group instead, follow [Share a GPU Between Models](./share-a-gpu-between-models.md).

10. Select **Deploy**.

The appliance brings the model through gate, provision, smoke-test, and ready stages on each chosen node. For that
lifecycle, refer to [Model Provisioning Lifecycle](../explanation/architecture.md#model-provisioning-lifecycle).

The **Models** tab lists the semantic router as **Semantic Router**, beside the models you deploy.

If the model belongs to the other mode, the appliance refuses the deploy with a message such as the following.

```text hideClipboard title="Example message"
<model> runs as text-router-vision, and this box already runs text-router. One box runs one mode, because the semantic router shares one set of GPUs: remove the text-router models first, or move this model into the text-router group.
```

In the message, `<model>` is the model you selected. On an appliance that already runs vision-mode models, the message
swaps the two mode names. Remove the models of the current mode first, or deploy a model whose catalog entry belongs to
the current mode.

If the model's catalog entry names no GPU count and no group, the **GPU sharing** step opens on the group the appliance
already runs. For why, refer to [One Mode per Appliance](../explanation/routing-behavior.md#one-mode-per-appliance).

:::info

A deploy from the console always records the nodes you selected. The model runs only on that list. It does not start
automatically on a node you add to the cluster later. To run it on additional nodes, refer to
[Add a Model to More Nodes](#add-a-model-to-more-nodes).

:::

### Verify the Model Is Serving

Confirm the model is serving before you route traffic to it.

1. Locate the model in the **Model** table on the **Cluster** page.

2. Confirm that the **Nodes** column reads `N of M nodes`, where `N` is the number of nodes you chose and `M` is the
   number of nodes in the cluster. The health chip counts serving against the chosen set, so `2/2 healthy` means every
   chosen node is serving.

3. Expand the model row. Only the nodes you chose are listed. A node you did not select is absent, which means it was
   never asked to run this model.

   ![Expanded model row showing two of three chosen nodes with a two of two healthy chip; both chosen nodes read Serving.](/assets/docs/images/deploy-a-model_subset-placement.webp)

4. Confirm that each listed node's state reaches `ready` or `serving`. A state of `deploying` or `smoke-testing` means
   the model is still coming online on that node. A state of `Waiting to start` means the node is chosen and no engine
   has reported yet. A state of `failed` or `verification failed` means the model did not come online on that node.

:::info

While a model is deploying, a node hosting it can briefly report a `Degraded` or `Not serving` state. This is expected
during deployment and clears once the model finishes coming online, at which point the node returns to a healthy state.

:::

For why a model becomes routable only after it passes its smoke test, refer to
[Model Provisioning Lifecycle](../explanation/architecture.md#model-provisioning-lifecycle).

## Review or Change an Engine Argument That Uses JSON

When a `{ } JSON` chip appears on an **Extra arguments** row in the **Deploy a model** wizard, use the JSON argument
editor to review or change the value for this deploy. For background on when the recipe carries a JSON-valued argument,
refer to [Engine Arguments](../explanation/inference-engines.md#engine-arguments).

1. On the **Cluster** page, select the **Models** tab, and then select **Deploy Model**. The **Deploy a model** wizard
   opens.

2. Choose the model in the **Model** drop-down menu and its nodes in **Nodes**, and then select **Next** to open the
   **Serving** step.

3. Under **Extra arguments**, locate a row whose value is a `{ } JSON` chip followed by a one-line preview of its
   top-level fields.

4. Select **Edit JSON** on that row. The dialog opens with the argument's flag in its title, for example
   `Edit --kv-transfer-config`, and the sub-line `Changes apply to this deploy only. Field names come from the engine.`

5. On the **Form** tab, change values in place. Every field carries its type as a badge: `string`, `number`, `boolean`,
   or `null`. A boolean field renders as a `true` / `false` button pair. A number field rejects non-numeric text with
   `Enter a number.` A byte field shows its size in readable units, such as `64 GiB.` A per-rank byte field also shows
   the node total for the model's tensor-parallel width. A `null` field is not editable on this tab and reads
   `Set a value on the Raw JSON tab.`

   To add or remove a field, switch to the **Raw JSON** tab. A note at the top of the **Form** tab makes this explicit:
   `Add or remove fields on the Raw JSON tab. The form edits values only, so a typo cannot invent a key the engine ignores.`

6. On the **Raw JSON** tab, review the whole document, or add and remove fields. The tab validates on every keystroke.
   When the text does not parse, the error appears as `Line N: [message]`, **Apply** is unavailable, and the **Form**
   tab is unavailable with the tooltip `Fix the JSON error first.` Correct the parse error to re-enable both.

7. If the editor shows the warning
   `[key] is the text '[value]', not the boolean [value]. Engines read any non-empty text as true.`, select **Convert to
   boolean [value]**. If it shows the softer nudge for a quoted number, select **Convert to number [value]**.

8. Select **Apply** to keep the change, or **Cancel** to discard it. **Apply** writes the argument back for this deploy
   only.

## Add a Model to More Nodes

To run an already deployed model on additional nodes, change the model's nodes from its row on the **Models** tab.

1. From the left main menu, select **Cluster**, and then select the **Models** tab.

2. On the model's row, open the three-dot menu and select **Serving configuration**. The nodes and the GPU width open on
   the placement that the model already has.

3. In **Nodes**, select each additional node. **Save** becomes available after you change a value.

4. Select **Save**. A confirmation states that the model redeploys and stops serving until its engine comes back. Select
   **Save** again to confirm.

## Remove a Model from a Node

To stop a model on one node and leave it running elsewhere, expand the model row and remove it from that node.

1. From the left main menu, select **Cluster**, and then select the **Models** tab.

2. Expand the model row, open the node's three-dot menu, and select **Remove**.

3. Review the preview, and then select **Confirm & apply**.

The node stays visible while its engine shuts down. It reads **Removing** with the message
`No longer chosen. Its engine is shutting down.` The row disappears once the engine is gone. The model's endpoint and
the remaining chosen nodes keep serving.

![Expanded model row showing one of three chosen nodes. One node reads Removing, and the other chosen node remains Serving.](/assets/docs/images/deploy-a-model_removing-node.webp)

To remove the model from every node, use the trash icon on the model's row instead of a per-node **Remove**.

## Resolve a Blocked Deployment

If a deployment cannot proceed, the wizard explains why. Common reasons include the following:

- You have not chosen a node.
- Every model in the catalog already runs on the cluster, so the **Model** drop-down menu offers no model. To change a
  running model, use its row on the **Models** tab.
- All the GPUs on a node are in use, or the node has fewer free GPUs than the model's GPU width.
- A node's GPU product does not match the GPU product that the model requires.
- The model's weights are not staged on that node, or only the metadata is staged.
- The node's GPU allocation is unknown. Unknown capacity is treated as unusable, not as free.
- The node is not ready, or it is cordoned.
- The GPU sharing plan is refused. For the three refused plans and how to fix each one, refer to
  [Resolve a Refused Sharing Plan](./share-a-gpu-between-models.md#resolve-a-refused-sharing-plan).

To resolve the reason, free GPUs on a node by removing another model from that node, stage the model's weights on the
node, add capacity to the cluster, or resolve the unknown allocation on the affected nodes. Then deploy the model again.
To replace what a node is serving, refer to [Replace a Model](./replace-a-model.md). For the full list of eligibility
reasons, refer to [Model Placement](../explanation/model-placement.md).

## Next Steps

To deploy a model that shares a GPU with other models, refer to
[Share a GPU Between Models](./share-a-gpu-between-models.md). To put a newer version or a different model on a node,
refer to [Replace a Model](./replace-a-model.md). For why you would pin a model to some nodes and not others, refer to
[Model Placement](../explanation/model-placement.md). To let a text-only model answer questions about images, refer to
[Enable Vision Preprocessing](./enable-vision-preprocessing.md). To bring a model that is not in the certified catalog,
refer to [Bring Your Own Model](./bring-your-own-model.md).
