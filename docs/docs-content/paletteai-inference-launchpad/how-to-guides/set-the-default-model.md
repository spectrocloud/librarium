---
sidebar_label: "Set the Default Model"
title: "Set the Default Model"
description:
  "Guidance for platform operators on how a PaletteAI Inference Launchpad appliance sets the default model for unrouted
  requests, and how to switch it from the Overview page when the current default becomes unavailable."
hide_table_of_contents: false
sidebar_position: 2
tags: ["paletteai-inference-launchpad", "models", "how-to"]
---

This guide explains how the default model is set on a running PaletteAI Inference Launchpad appliance and how to switch
it. If a request does not name a model, the appliance routes it to the default model. For how the appliance routes
requests, refer to [Architecture](../explanation/architecture.md).

The appliance sets the default model for you and does not switch it to a different model on its own. As a result, the
console has no dedicated control to choose the default during normal operation. You change the default from the
**Overview** page only when the appliance flags the current default as unavailable.

## Prerequisites

- A running PaletteAI Inference Launchpad appliance, with the admin console reachable and operator access.
- A model other than the current default already deployed and serving, so that a healthy model is available to switch
  to. To deploy and verify a model, refer to [Deploy a Model](./deploy-a-model.md).

## How the Default Model Is Set

- The model you deploy during initial appliance setup becomes the default model.
- If you deploy only one model, that model serves as the default.

## Switch the Default Model After an Incident

When the current default model stops serving, for example after you remove it or the node hosting it goes down, the
**Overview** page raises an incident and offers a one-step fix to point the default at a model that is currently
serving.

1. From the left main menu, select **Overview**.
2. In the **Decisions waiting on you** card, locate the active incident for the default model.
3. Open the **switch default model** drop-down menu and select a model that the appliance currently serves.
4. Select **Apply Fix**, and then select **Confirm & apply**.

The appliance switches the default model and re-runs its health check to confirm the new default recovers.

:::info

If no model is currently serving, the card reports that there is nothing to switch to. Deploy a model from the
**Cluster** tab first, then return to the **Overview** page. Refer to [Deploy a Model](./deploy-a-model.md).

:::

For what happens to requests that are in progress when the default model changes, refer to
[Architecture](../explanation/architecture.md).

## Next Steps

- **Generate an API token** to send requests to the default model. Refer to
  [Generate an API Token](./generate-an-api-token.md).
- **Deploy another model** to the appliance. Refer to [Deploy a Model](./deploy-a-model.md).
