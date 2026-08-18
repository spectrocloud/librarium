---
sidebar_label: "Replace a Model"
title: "Replace a Model"
description:
  "Step-by-step guidance for platform operators on how to put a newer version of a model, or a different model, on a
  node by removing the current model and then deploying the replacement."
hide_table_of_contents: false
sidebar_position: 1.2
tags: ["paletteai-inference-launchpad", "models", "how-to"]
keywords: ["launchpad", "ai", "replace", "upgrade", "model", "version", "weights", "remove", "deploy"]
---

This guide explains how to put a different model, or a newer version of a model you already serve, onto a node. There is
no in-place replace and no rolling upgrade. You remove the current model from the node, then deploy the model you want
from **Deploy model**.

Use this procedure for both of the following:

- **Same model, newer version.** The newer version is already in the catalog. You remove the version that is serving,
  then deploy the newer version.
- **Different model.** You remove the model that occupies the node, then deploy the model you want.

The node stops serving the removed model until the replacement is ready. Requests that named the removed model fall back
to the default model, or fail if there is no default. For how the default is chosen, refer to
[The Default Model](../explanation/architecture.md#the-default-model).

## Prerequisites

- A running PaletteAI Inference Launchpad appliance, with the admin console reachable and operator access.
- The replacement model already in the appliance catalog. For a newer version that is not in the catalog yet, upload it
  first. Refer to [Upload a Model](./upload-a-model.md).
- Enough GPU capacity on the target node after you remove the current model. To confirm support, refer to
  [Certified Models by Hardware](../reference/certified-models-by-hardware.md).

## Before You Remove a Model

Review these points before you remove anything.

- **Default model.** If you remove the cluster default, requests that do not name a model have no fallback until you
  deploy a replacement and switch the default. After you remove it, the **Overview** page raises an incident. After the
  replacement is serving, switch the default. Refer to [Switch the Default Model](./set-the-default-model.md). Removing
  the default from the cluster requires you to type the model name to confirm.
- **Routing.** Local clients can call every local model by name. If the replacement uses a different name, update any
  client tier maps that pointed at the old name. Refer to
  [Manage a Client's Model Access](./manage-client-model-access.md). If the replacement keeps the same name, those maps
  continue to work after the new deploy is serving.
- **Last node.** Removing a model from its last node means it is no longer deployed anywhere. You must deploy it again
  to serve it.

## Remove the Model from a Node

1. From the left main menu, select **Cluster**.

2. In the _Model_ table, expand the model you want to replace.

3. On the node that should run the replacement, open the three-dot menu and select **Remove**.

4. Review the preview. It states that the appliance will remove the model from that node and stop serving it.

5. Select **Confirm & apply**.

Wait until that node no longer lists the model and its GPUs are free. The model row shows `deleting` while the engine
stops. Then deploy the replacement.

### Remove the Model from Every Node

To stop the model on every node at once, select **Remove model from cluster** on the model row. Confirm that you intend
to stop the model everywhere, then select **Remove**. If it is the default model, type the model name before **Remove**
is available.

## Deploy the Replacement

1. Select **Deploy model**.

2. Select the newer version or the different model.

3. Confirm that a node can host it. If **Deploy** is unavailable, the panel explains why, such as no free GPUs. Finish
   removing the previous model, or free capacity, then try again. Refer to
   [Resolve a Blocked Deployment](./deploy-a-model.md#resolve-a-blocked-deployment).

4. Select **Deploy**, review the preview, and then select **Confirm & apply**.

5. Verify that the replacement reaches `ready` or `serving`. Refer to
   [Verify the Model Is Serving](./deploy-a-model.md#verify-the-model-is-serving).

If you removed the default model, switch the default to the replacement after the replacement is serving. Refer to
[Switch the Default Model](./set-the-default-model.md).

## Next Steps

- [Deploy a Model](./deploy-a-model.md)
- [Switch the Default Model](./set-the-default-model.md)
- [Manage a Client's Model Access](./manage-client-model-access.md)
