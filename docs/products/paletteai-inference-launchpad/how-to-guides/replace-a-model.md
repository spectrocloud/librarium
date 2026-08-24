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

The appliance does not support in-place replacement. To change the model or version a node serves, remove the current
model and then deploy the replacement from **Deploy New Model**.

## Prerequisites

- Operator access to a running PaletteAI Inference Launchpad appliance.
- The replacement model in the appliance catalog. If it is not there yet, refer to
  [Upload a Model](./upload-a-model.md).
- Enough free GPU capacity on the target node after you remove the current model. Refer to
  [Certified Models by Hardware](../reference/certified-models-by-hardware.md).

## Considerations

- **Other nodes.** A per-node remove affects only the target node. Refer to
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
4. Review the preview, then select **Confirm & apply**.
5. Wait until the model clears from the node. The row shows `deleting` while the engine stops.
6. Deploy the replacement onto that node only. Refer to [Deploy the Replacement](#deploy-the-replacement).

## Replace the Model on Every Node

1. From the left main menu, select **Cluster**, and then select the **Models** tab.
2. On the model row, select the trash icon. The **Remove model from cluster** dialog opens.
3. If the model is the cluster default, type the model name to confirm.
4. Select **Remove**.
5. Wait until the model clears from every node.
6. Deploy the replacement onto every node that should serve it. Refer to
   [Deploy the Replacement](#deploy-the-replacement).

## Deploy the Replacement

1. Select **Deploy New Model**. The **Deploy model** dialog opens.
2. Select the newer version or the different model.
3. In **Nodes**, select the node or nodes you just freed.
4. Select **Deploy**, review the preview, and then select **Confirm & apply**.
5. Wait until the replacement is running on each node you selected. Refer to
   [Verify the Model Is Serving](./deploy-a-model.md#verify-the-model-is-serving).

If a node is not selectable, it is missing the model's weights or has too few free GPUs. If **Deploy** is unavailable,
finish removing the previous model or free capacity, then try again. Refer to
[Resolve a Blocked Deployment](./deploy-a-model.md#resolve-a-blocked-deployment).

If you removed the default model, switch the default to the replacement once it is serving. Refer to
[Switch the Default Model](./set-the-default-model.md).

### Stop a Deploy That Is Still in Progress

1. Expand the model row.
2. On the node that is still deploying, select **Abort**. In the confirmation, select **Abort** again.

That node returns to a deployable state. Redeploy from **Deploy New Model**.

## Verify the Replacement

1. From the left main menu, select **Cluster**, and then select the **Models** tab.
2. Confirm the replacement is listed as serving on every node you deployed to.
3. Send a request that names the replacement, and confirm you receive a successful response.
4. Open [View Client Usage](./view-client-usage.md) and confirm the replacement records new requests.

Client routing and quotas survive a remove-then-deploy. Refer to
[Request Routing](../explanation/architecture.md#request-routing).

## Next Steps

- [Deploy a Model](./deploy-a-model.md)
- [Switch the Default Model](./set-the-default-model.md)
- [Manage a Client's Model Access](./manage-client-model-access.md)
- [View Client Usage](./view-client-usage.md)
