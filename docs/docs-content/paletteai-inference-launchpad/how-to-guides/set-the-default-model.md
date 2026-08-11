---
sidebar_label: "Switch the Default Model"
title: "Switch the Default Model"
description:
  "Task guidance for platform operators on how to switch the default model on a PaletteAI Inference Launchpad appliance
  from the Overview page when the current default is no longer serving."
hide_table_of_contents: false
sidebar_position: 2
tags: ["paletteai-inference-launchpad", "models", "how-to"]
---

This guide shows how to switch the default model on a running PaletteAI Inference Launchpad appliance when the current
default is no longer serving. The appliance sets and maintains the default model for you; for how the default is chosen
and applied, refer to [The Default Model](../explanation/architecture.md#the-default-model).

## Prerequisites

- A running PaletteAI Inference Launchpad appliance, with the admin console reachable and operator access.
- A model other than the current default already deployed and serving, so that a healthy model is available to switch
  to. To deploy and verify a model, refer to [Deploy a Model](./deploy-a-model.md).

## Switch the Default Model

When the current default model stops serving, the **Overview** page raises an incident and offers a one-step fix to
point the default at a model that is currently serving.

1. From the left main menu, select **Overview**.
2. In the **Decisions waiting on you** card, locate the active incident for the default model.
3. Open the **switch default model** drop-down menu and select a model that the appliance currently serves.
4. Select **Apply Fix**, and then select **Confirm & apply**.

The appliance switches the default model and re-runs its health check to confirm the new default recovers. For what
happens to requests already in progress when the default changes, refer to
[Request Routing](../explanation/architecture.md#request-routing).

:::info

If no model is currently serving, the card reports that there is nothing to switch to. Deploy a model from the
**Cluster** tab first, then return to the **Overview** page. Refer to [Deploy a Model](./deploy-a-model.md).

:::

## Next Steps

- **Generate an API token** to send requests to the default model. Refer to
  [Generate an API Token](./generate-an-api-token.md).
- **Deploy another model** to the appliance. Refer to [Deploy a Model](./deploy-a-model.md).
