---
sidebar_label: "Replace a Model"
title: "Replace a Model"
description:
  "Step-by-step guidance for platform operators on how to put a newer version of a model, or a different model, on a
  node by removing the current model and then deploying the replacement."
hide_table_of_contents: false
sidebar_position: 1.2
tags: ["paletteai-inference-launchpad", "models", "how-to"]
keywords: ["launchpad", "ai", "replace", "upgrade", "model", "version", "weights", "remove", "deploy", "day-2"]
---

Put a newer version of a model you already serve, or a different model, onto a node. There is no in-place replace and no
rolling upgrade. Remove the current model from the node, then deploy the model you want from **Deploy New Model**.

Use this procedure in either of the following situations:

- **Same model, newer version.** The newer version is already in the catalog. Remove the version that is serving, then
  deploy the newer version.
- **Different model.** Remove the model that occupies the node, then deploy the model you want.

## Prerequisites

- A running PaletteAI Inference Launchpad appliance, with the admin console reachable and operator access.
- The replacement model already in the appliance catalog, with its weights on every node that should serve it. For a
  newer version that is not in the catalog yet, upload it first. Refer to [Upload a Model](./upload-a-model.md). A node
  that does not have the model's weights is not selectable.
- Enough GPU capacity on the target node after you remove the current model. To confirm support, refer to
  [Certified Models by Hardware](../reference/certified-models-by-hardware.md).

## Considerations

Review these points before you remove anything.

- **Other nodes.** Expect the model to keep serving on every other node that runs it. Refer to
  [Model Provisioning Lifecycle](../explanation/architecture.md#model-provisioning-lifecycle).
- **Default model.** After removing the cluster default, switch the default to the replacement once it is serving. Refer
  to [The Default Model](../explanation/architecture.md#the-default-model).
- **Routing and quotas.** If the replacement uses a different name than the current model, update any client tier maps
  that pointed at the old name. Refer to [Request Routing](../explanation/architecture.md#request-routing).
- **Last node.** Deploy the replacement after removing the model from its last node, or the model is no longer deployed
  anywhere. Refer to [Model Provisioning Lifecycle](../explanation/architecture.md#model-provisioning-lifecycle).

## Replace the Model on One Node

1. From the left main menu, select **Cluster**, and then select the **Models** tab.

2. Expand the model you want to replace.

3. On the node that should run the replacement, open the three-dot menu and select **Remove**.

4. Review the preview. It states that the appliance removes the model from that node and stops serving it.

5. Select **Confirm & apply**.

6. Wait until that node no longer lists the model and its GPUs are free. The model row shows `deleting` while the engine
   stops. Other nodes that still serve the model keep running it.

7. Deploy the replacement onto that node only, as described in [Deploy the Replacement](#deploy-the-replacement).

## Replace the Model on Every Node

1. From the left main menu, select **Cluster**, and then select the **Models** tab.

2. On the model row, select the trash icon. The **Remove model from cluster** dialog opens.

3. Confirm that you intend to stop the model on every node. If it is the default model, the dialog warns you and asks
   you to type the model name.

4. Select **Remove**.

5. Wait until the model is gone from every node.

6. Deploy the replacement onto every node that should serve it, as described in
   [Deploy the Replacement](#deploy-the-replacement).

## Deploy the Replacement

1. Select **Deploy New Model**. The **Deploy model** dialog opens.

2. Select the newer version or the different model.

3. In **Nodes**, select only the node or nodes you just freed. Leave nodes that should keep the previous model
   unselected. If a node cannot run the model, it is not selectable and states why, such as missing weights or too few
   free GPUs. If **Deploy** is unavailable, finish removing the previous model, or free capacity, then try again. Refer
   to [Resolve a Blocked Deployment](./deploy-a-model.md#resolve-a-blocked-deployment).

4. Select **Deploy**, review the preview, and then select **Confirm & apply**.

5. Wait until the replacement is running on each node you selected, then verify it. Refer to
   [Verify the Model Is Serving](./deploy-a-model.md#verify-the-model-is-serving).

If you removed the default model, switch the default to the replacement after the replacement is serving. Refer to
[Switch the Default Model](./set-the-default-model.md).

### Stop a Deploy That Is Still in Progress

If the replacement is still deploying on a node, you can stop that deploy and try again.

1. Expand the model row.

2. On the node that is still deploying, select **Abort**, and then select **Abort** in the confirmation.

That node's deploy stops. The node is free to deploy to again, and the model you removed does not come back on its own.
Deploys that are still in progress on other nodes continue. Deploy the replacement onto the freed node again from
**Deploy New Model**.

## Verify the Replacement

1. From the left main menu, select **Cluster**, and then select the **Models** tab. Confirm the replacement is listed as
   serving on every node you deployed to.
2. Send a request that names the replacement, and confirm you receive a successful response.
3. Open [View Client Usage](./view-client-usage.md) and confirm the replacement records new requests.

Client routing and quotas survive a remove-then-deploy. Refer to
[Request Routing](../explanation/architecture.md#request-routing).

## Next Steps

- [Deploy a Model](./deploy-a-model.md)
- [Switch the Default Model](./set-the-default-model.md)
- [Manage a Client's Model Access](./manage-client-model-access.md)
- [View Client Usage](./view-client-usage.md)
