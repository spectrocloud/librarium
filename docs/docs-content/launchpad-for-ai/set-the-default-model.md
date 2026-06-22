---
sidebar_label: "Set the Default Model"
title: "Set the Default Model"
description:
  "Step-by-step guidance for platform operators on how to set the default model that handles unrouted requests on a
  running Launchpad for AI appliance."
hide_table_of_contents: false
sidebar_position: 16
tags: ["launchpad-for-ai", "models", "how-to"]
---

This guide explains how to set the default model on a running Launchpad for AI appliance. If a request does not name a model, the appliance routes it to the default model. For how the appliance routes requests, refer to
[Architecture](./architecture.md).

## Prerequisites

- A running Launchpad for AI appliance, with the admin console reachable and operator access.
- The model you want to make default already added and serving. To add and verify a model, refer to
  [Add a Model](./add-a-model.md).

## Set the Default Model

Set the default model from the _Control Room_. You can only select a model that the appliance currently serves.

1. From the left main menu, select **Control Room**.

2. Open the **switch default model** drop-down menu and select the model to make default.

3. Select **Apply fix**, and then confirm.

For what happens to requests that are in progress when you change the default model, refer to
[Architecture](./architecture.md).

## Next Steps

To add another model to the appliance, refer to [Add a Model](./add-a-model.md).
