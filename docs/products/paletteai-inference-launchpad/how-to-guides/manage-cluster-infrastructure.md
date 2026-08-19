---
sidebar_label: "Manage Cluster Infrastructure"
title: "Manage Cluster Infrastructure"
description:
  "Index of the Local UI tasks that platform operators use to run day-two cluster infrastructure operations on a
  PaletteAI Inference Launchpad appliance."
hide_table_of_contents: false
sidebar_position: 0.5
tags: ["paletteai-inference-launchpad", "install", "upgrade", "how-to"]
keywords: ["launchpad", "ai", "local ui", "cluster", "scale", "upgrade", "day two"]
---

PaletteAI Inference Launchpad is an appliance. Day-one install and day-two cluster infrastructure operations use the
node's [Local UI](../reference/glossary.md#local-ui) at `https://<node-ip>:5080`, not the
[appliance console](../reference/glossary.md#appliance-console) that serves models after the cluster is running. The
following how-tos cover each infrastructure task.

| **Task**                                                                        | **What you do**                                                                           |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| [Access Local UI](/clusters/edge/local-ui/host-management/access-console/)      | Sign in to Local UI on the leader node.                                                   |
| [Create the Cluster](./install-the-appliance.md#deploy-the-cluster)             | Run the Local UI cluster wizard as part of day-one install.                               |
| [Upload a Content Bundle](./install-the-appliance.md#upload-the-content-bundle) | Upload the platform and application layers to the leader with the Palette CLI.            |
| [Scale the Cluster](/clusters/edge/local-ui/cluster-management/scale-cluster/)  | Link a new host and add or remove nodes from a pool.                                      |
| [Upgrade the Platform](./upgrade-the-platform.md)                               | Upload a newer content bundle, apply **Update** in Local UI, and roll the charts forward. |

## Next Steps

- [Install the Appliance](./install-the-appliance.md)
- [Upgrade the Platform](./upgrade-the-platform.md)
- [Deploy a Model](./deploy-a-model.md)
