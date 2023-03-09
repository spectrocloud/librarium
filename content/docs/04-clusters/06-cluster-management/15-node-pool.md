---
title: "Node Pools"
metaTitle: "Node Pools"
metaDescription: "Learn about the node pools and applying changes to a node pool."
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Overview

You have the ability to update node pools for active clusters and the option to create a new node pool for the cluster.

<br />

<WarningBox>

Ensure you exercise caution when modifying node pools. We recommend creating a [backup](/clusters/cluster-management/backup-restore) before you make a change in the event a configuration change causes an issue.

</WarningBox>


# Create a New Node Pool

You can create a new node pool for an active cluster. To create a new node pool follow the steps below.

1. Ensure you are in the correct scope or project.


2. Navigate to the left **Main Menu** and click on **Clusters**.


3. Click on the row of the cluster you want to edit the node pool.


4. Click on the **Nodes** tab.


5. Click on **New Node Pool**. 


6. Fill out the input fields in the **Add node pool** page. The following table contains an explanation of the available input parameters.


### Master Node Pool

| Property | Description |
|-----------|-------------|
| **Node pool name** | A descriptive name for the node pool. |
| **Number of nodes in the pool** | Number of nodes to be provisioned for the node pool. For the master pool, this number can be 1, 3, or 5. |
| **Allow worker capability** | Select this option to allow workloads to be provisioned on master nodes. |
| **Additional Labels** | Optional labels apply placement constraints on a pod. For example, you can add a label to make a node eligible to receive the workload. To learn more, refer to the [Overview on Labels](/clusters/cluster-management/taints#overviewonlabels). |
| **Taints** | Sets toleration to pods and allows (but does not require) the pods to schedule onto nodes with matching taints. To learn more, refer to the [Overview on Taints](/clusters/cluster-management/taints#overviewontaints).|
| **Availability Zones** | The Availability Zones from which to select available servers for deployment. If you select multiple zones, Palette will deploy servers evenly across them as long as sufficient servers are available to do so. |


### Worker Node Pool

| Property | Description |
|-----------|-------------|
| **Node pool name** | A descriptive name for the node pool. |
| **Number of nodes in the pool** | Number of nodes to be provisioned for the node pool.|
| **Additional Labels** | Optional labels apply placement constraints on a pod. For example, you can add a label to make a node eligible to receive the workload. To learn more, refer to the [Overview on Labels](/clusters/cluster-management/taints#overviewonlabels). |
| **Taints** | Sets toleration to pods and allows (but does not require) the pods to schedule onto nodes with matching taints. To learn more, refer to the [Overview on Taints](/clusters/cluster-management/taints#overviewontaints).|
| **Rolling update** | There are two available options: **Expand First** and **Contract First**. Review descriptions of these options in the table below for more details.|
| **Availability Zones** | The Availability Zones from which to select available servers for deployment. If you select multiple zones, Palette will deploy servers evenly across them as long as sufficient servers are available to do so. |
 
**Note**: Currently Palette does not support Autoscaler for Azure clusters.

<br />

#### Rolling Update Options for Node Pools

| Property | Description |
|-----------|-------------|
| **Expand First** | Palette launches a new node first, then shuts down the old node before providing updates. |
| **Contract First** | Palette shuts down the old node first, then launches a new node before providing updates.|


7. Click on **Confirm** to create the new node pool.


# Change a Node Pool

Palette allows its users to apply changes to a node pool, including its taints label for a running cluster. To make changes to the an active cluster's node pools, follow the steps below. 

1. Ensure you are in the correct scope or project.


2. Navigate to the left **Main Menu** and click on **Clusters**.


3. Click on the row of the cluster you want to edit the node pool.


4. Click on the **Nodes** tab.


5. The nodes details page is where you can review the existing node pools and their configuration. You can also add a new node pool from this page. Click on the **Edit** button to make changes to the node pool.


6. Make changes as needed.


7. Click on **Confirm** to update the node pool.
