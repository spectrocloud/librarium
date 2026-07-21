---
sidebar_label: "Set the Default Model"
title: "Set the Default Model"
description:
  "Step-by-step guidance for platform operators on how to set the default model that handles unrouted requests on a
  running PaletteAI Inference Launchpad appliance."
hide_table_of_contents: false
sidebar_position: 2
tags: ["paletteai-inference-launchpad", "models", "how-to"]
---

This guide explains how to set the default model on a running PaletteAI Inference Launchpad appliance. If a request does
not name a model, the appliance routes it to the default model. For how the appliance routes requests, refer to
[Architecture](../explanation/architecture.md).

## Prerequisites

- A running PaletteAI Inference Launchpad appliance, with the admin console reachable and operator access.
- The model you want to make default already deployed and serving. To deploy and verify a model, refer to
  [Deploy a Model](./deploy-a-model.md).

## Set the Default Model

Set the default model from the _Overview_. You can only select a model that the appliance currently serves.

1. From the left main menu, select **Overview**.

2. Open the **switch default model** drop-down menu and select the model to make default.

3. Select **Apply fix**, and then confirm.

For what happens to requests that are in progress when you change the default model, refer to
[Architecture](../explanation/architecture.md).

## Next Steps

To deploy another model to the appliance, refer to [Deploy a Model](./deploy-a-model.md).
