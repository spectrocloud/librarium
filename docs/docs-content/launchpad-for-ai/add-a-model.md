---
sidebar_label: "Add a Model"
title: "Add a Model"
description:
  "Step-by-step guidance for platform operators on how to add an LLM model to a running Launchpad for AI appliance and
  verify that it is serving."
hide_table_of_contents: false
sidebar_position: 15
tags: ["launchpad-for-ai", "models", "how-to"]
---

This guide explains how to add a model to a running Launchpad for AI appliance and verify that the model is serving
requests. For background on the appliance and how it routes requests, refer to
[What is Launchpad for AI?](./launchpad-for-ai.md) and [Architecture](./architecture.md).

Launchpad for AI provides a set of recommended models, including GLM, DeepSeek, and Kimi. You can deploy models beyond
the recommended list, but any model must fit within the GPU resources available on the appliance. Before you select a
model, check the [Supported LLM Models](./supported-models.md) and [Hardware Requirements](./hardware-requirements.md)
reference pages to confirm that your appliance can support it.

## Prerequisites

- A running Launchpad for AI appliance, with the admin console reachable and operator access.
- At least one node with free capacity for the model you intend to add.
- The desired model present in the appliance catalog.

## Add a Model

1. From the left main menu, select **Orchestration**, and then select the **Fleet** tab.

2. In the **Deploy new model** section, open the model drop-down menu and select the model to add.

3. (Optional) Open the engine drop-down menu and select an engine. Leave it on the automatic option to let the appliance
   choose the engine.

4. Confirm that the placement line shows a best-fit node. If the card shows **Deploy held** with a reason, such as no
   node with enough free GPUs, resolve that reason before you continue.

5. Select **Deploy**, review the deployment summary, and then confirm.

   The appliance selects the node and brings the model online for you. For how placement and provisioning work, refer to
   [Architecture](./architecture.md).

### Verify the Model Is Available

Confirm the model is serving before you route traffic to it.

1. Stay on the _Fleet_ tab and locate the model in the _Fleet models_ table.

2. Confirm that the model state reads `ready`. An amber state means the model is still provisioning or running its smoke
   test, and a red state means the model failed.

3. Confirm that the model detail reads `serving · smoke-test passed` and that the model is marked routable.

For why a model becomes routable only after its smoke test passes, refer to [Architecture](./architecture.md).

## Next Steps

If a request does not name a model, the appliance routes it to the default model. Refer to
[Set the Default Model](./set-the-default-model.md) to learn how to configure the default.
