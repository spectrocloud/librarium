---
sidebar_label: "Deploy a Model"
title: "Deploy a Model"
description:
  "Step-by-step guidance for platform operators on how to deploy an LLM model to a running PaletteAI Inference Launchpad
  appliance and verify that it is serving."
hide_table_of_contents: false
sidebar_position: 1
tags: ["paletteai-inference-launchpad", "models", "how-to"]
---

This guide explains how to deploy a model to a running PaletteAI Inference Launchpad appliance and verify that the model
is serving requests. The appliance places the model automatically on the best-fit node. For how placement and the deploy
lifecycle work, refer to [Model Provisioning Lifecycle](../explanation/architecture.md#model-provisioning-lifecycle).

## Prerequisites

- A running PaletteAI Inference Launchpad appliance, with the admin console reachable and operator access.
- At least one node with free capacity for the model you intend to deploy.
- The model present in the appliance catalog and able to fit the appliance's available GPU resources. To confirm
  support, refer to [Certified Models by Hardware](../reference/certified-models-by-hardware.md) and
  [Suggested Hardware](../reference/hardware-requirements.md). To place a model in the appliance catalog, follow
  [Upload a Model](./upload-a-model.md) first.

## Deploy a Model

1. From the left main menu, select **Cluster**.

2. Select **Deploy model** to open the deploy panel.

3. Review the **cluster capacity** line to find which nodes have free GPUs. Each node shows either a free count, such as
   `N of T free`, or `allocation unknown`.

4. Open the model drop-down menu and select the model to deploy.

5. _(Optional)_ Open the engine drop-down menu and select an engine. Leave it on **engine (auto)** to let the appliance
   choose the engine. For what an engine is and when you would override the automatic choice, refer to
   [Inference Engines](../explanation/inference-engines.md).

6. Confirm that the **will deploy to** line shows a best-fit node. If the panel shows **Deploy held** with a reason, or
   the **Deploy** button is unavailable, no node currently fits the model. Refer to
   [Resolve a Blocked Deployment](#resolve-a-blocked-deployment) before you continue.

7. Select **Deploy**, review the deployment preview, and then select **Confirm & apply**.

### Verify the Model Is Serving

Confirm the model is serving before you route traffic to it.

1. Locate the model in the _Model_ table on the **Cluster** page.

2. Confirm that the model health reads `N/N healthy` and that its state reaches `ready` or `serving`. A state of
   `deploying` or `smoke-testing` means the model is still coming online, and a state of `failed` or
   `verification failed` means the model did not come online.

:::info

While a model is deploying, a node hosting it can briefly report a `Degraded` or `Not serving` state. This is expected
during deployment and clears once the model finishes coming online, at which point the node returns to a healthy state.

:::

For why a model becomes routable only after it passes its smoke test, refer to
[Model Provisioning Lifecycle](../explanation/architecture.md#model-provisioning-lifecycle).

## Resolve a Blocked Deployment

If no node can host the model you selected, the **Deploy** button is unavailable and the panel explains why. The reason
is one of the following:

- The model is already deployed on every node in the cluster.
- The model needs GPUs, but no node in the cluster has a GPU.
- No node has enough free GPUs for the model because every GPU node is full.
- No node has enough free GPUs for the model, and some nodes report `allocation unknown`.

To resolve the reason, free GPUs on a node by draining or shutting down another model, add capacity to the cluster, or
resolve the unknown allocation on the affected nodes. Then deploy the model again.

## Next Steps

To change which model handles requests that do not name a model explicitly, refer to
[Switch the Default Model](./set-the-default-model.md). To let a text-only model answer questions about images, refer to
[Enable Vision Preprocessing](./enable-vision-preprocessing.md). To bring a model that is not in the certified catalog,
refer to [Bring Your Own Model](./bring-your-own-model.md).
