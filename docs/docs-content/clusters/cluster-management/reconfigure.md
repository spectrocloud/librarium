---
sidebar_label: "Reconfigure"
title: "Reconfigure"
description: "Reconfiguration-scaling Events on Palette"
hide_table_of_contents: false
sidebar_position: 0
tags: ["clusters", "cluster management"]
---

Scaling a cluster up or down involves changing the size of node pools. The following are the steps to scale up/down a cluster:

- Access the ‘Nodes’ view of the cluster.
- For the desired node pool, change the size directly from the nodes panel or edit node pool settings.
- After the node pool configuration is updated, the scale-up/down operation is initiated in a few minutes.
- Provisioning status is updated with the ongoing progress of the scale operation.

:::info
The master node pool is scaled from 1 to 3 or 3 to 5 nodes, etc. However, the scale-down operation is not supported for master nodes.
:::

## Reconfiguring the Cluster Nodes

The following are the steps to reconfigure worker pool nodes:

- Access the 'Nodes' view for the cluster.
- Edit the settings of the desired node pool.
- Change the number of nodes, rolling update setting, availability zones, flavor, and Disk size to the desired settings.
- Save the node pool settings. After the node pool settings are updated, the node pool reconfiguration begins within a few minutes. The older nodes in the node pool are deleted and replaced by new nodes launched with a new instance type configured.
- Provisioning status is updated with the ongoing progress of nodes being deleted and added.

## Adding a New Worker Pool

The following are the steps to add a new worker node pool to a cluster:

- Invoke the option to ‘Add Node Pool’ from the cluster’s node information page.
- Provide node pool settings as follows:
  - A descriptive name for the node pool
  - The number of nodes in the node pool
  - Rolling update setting, availability zones, flavor, and Disk size settings
  - Save the node pool settings

The new worker pool settings are updated, and cluster updates begin within a few minutes. Provisioning status updates will be available with the ongoing progress of tasks related to adding new nodes.

## Removing a Worker Pool

The following steps need to be performed to remove a worker pool from the cluster:

- Access the ‘Nodes’ view of the cluster
- Delete the desired worker pool and confirm the deletion
- Upon confirmation, the worker node deletion begins in a few minutes

:::info
Support of reconfiguration is not available for existing clusters imported into Palette for any cloud type.
:::
