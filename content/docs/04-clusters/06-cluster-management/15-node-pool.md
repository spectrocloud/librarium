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

# Node Pools


A node pool is a group of nodes within a cluster that all have the same configuration. Node pools allow you to create pools of nodes that can be used for different workloads. For example, you can create a node pool for your production workloads and another node pool for your development workloads. You can update node pools for active clusters or create a new node pool for the cluster. 

<br />

<WarningBox>

Ensure you exercise caution when modifying node pools. We recommend creating a [backup](/clusters/cluster-management/backup-restore) before you make a change in the event a configuration change causes an issue.

</WarningBox>

## Repave Behavior and Configuration

In Kubernetes, the term "repave" refers to the process of replacing a node with a new node. [Repaving](/glossary-all#repavement) is a common practice in Kubernetes to ensure that nodes are deployed with the latest version of the operating system and Kubernetes. Repaving is also used to replace nodes that are unhealthy or have failed. You can configure the repave time interval for a node pool. 

The ability to configure the repave time interval for all node pools except the master pool. The default repave time interval is 900 seconds (15 minutes). You can configure the node repave time interval during the cluster creation process or after the cluster is created. To modify the repave time interval after the cluster is created, follow the [Change a Node Pool](#changeanodepool) instructions below.


<br />

## Node Pool Configuration Settings

The following tables contain the configuration settings for node pools. Depending on the type of node pool, some of the settings may not be available.

<br />

### Master Node Pool

| **Property** | **Description** |
|-----------|-------------|
| **Node pool name** | A descriptive name for the node pool. |
| **Number of nodes in the pool** | Number of nodes to be provisioned for the node pool. For the master pool, this number can be 1, 3, or 5. |
| **Allow worker capability** | Select this option to allow workloads to be provisioned on master nodes. |
| **Additional Labels** | Optional labels apply placement constraints on a pod. For example, you can add a label to make a node eligible to receive the workload. To learn more, refer to the [Overview on Labels](/clusters/cluster-management/taints#overviewonlabels). |
| **Taints** | Sets toleration to pods and allows (but does not require) the pods to schedule onto nodes with matching taints. To learn more, refer to the [Overview on Taints](/clusters/cluster-management/taints#overviewontaints).|
| **Availability Zones** | The Availability Zones from which to select available servers for deployment. If you select multiple zones, Palette will deploy servers evenly across them as long as sufficient servers are available to do so. |
| **Disk Size** | Give the required storage size. |


### Worker Node Pool

| **Property** | **Description** |
|-----------|-------------|
| **Node pool name** | A descriptive name for the worker pool. |
| **Number of nodes in the pool** | Number of nodes to be provisioned for the node pool. |
| **Node repave interval** | The time interval in seconds between repaves. The default value is 900 seconds (15 minutes). |
| **Additional Labels** | Optional labels apply placement constraints on a pod. For example, you can add a label to make a node eligible to receive the workload. To learn more, refer to the [Overview on Labels](/clusters/cluster-management/taints#overviewonlabels). |
| **Taints** | Sets toleration to pods and allows (but does not require) the pods to schedule onto nodes with matching taints. To learn more, refer to the [Overview on Taints](/clusters/cluster-management/taints#overviewontaints).|
| **Rolling update** |  Apply the update policy. **Expand first** launches new nodes and then terminates old notes. **Contract first** terminates old nodes and then launches new ones. |
| **Instance Option** | AWS options for compute capacity. **On Demand** gives you full control over the instance lifecycle without long-term commitment. **Spot** allows the use of spare EC2 capacity at a discount but which can be reclaimed if needed. |
| **Instance Type** |The compute size. |
| **Availability Zones** | The Availability Zones from which to select available servers for deployment. If you select multiple zones, Palette will deploy servers evenly across them as long as sufficient servers are available to do so. |
| **Disk Size** | Give the required storage size. |
 

<br />


<WarningBox>

Some features may not be available for all infrastructure providers. Review each infrastructure provider's node pool configuration settings to learn more.

</WarningBox>

<br />


## Create a New Node Pool


### Prerequisites


* A Palette-deployed cluster.


* Sufficient permissions to edit the cluster.


### Create Node Pool


You can create a new node pool for an active cluster. To create a new node pool follow the steps below.

1. Log in to [Palette](https://console.spectrocloud.com).


2. Navigate to the left **Main Menu** and click on **Clusters**.


3. Click on the row of the cluster you want to edit the node pool.


4. Click on the **Nodes** tab.


5. Click on **New Node Pool**. 


6. Fill out the input fields in the **Add node pool** page. Refer to the [Node Pool Configuration Settings](#nodepoolconfigurationsettings) tables for more information on each field.




<br />

7. Click on **Confirm** to create the new node pool.


### Validate

After you create a new node pool, you can validate the node pool by following the steps below.

1. Log in to [Palette](https://console.spectrocloud.com).


2. Navigate to the left **Main Menu** and click on **Clusters**.


3. Click on the row of the cluster you added the new node pool.


4. Click on the **Nodes** tab.


5. Ensure the new node pool is listed in the **Node Pools** section and that all compute instances are in the healthy status. 

## Change a Node Pool


You can apply changes to a node pool after a cluster is created and deployed. You can change the node pool's taints label, node repavement interval, number of compute instances in the node pool and more. To make changes to an active cluster's node pools, follow the steps below. 

### Prerequisites


* A Palette deployed cluster.


* Sufficient permissions to edit the cluster.


### Edit Node Pool


1. Log in to [Palette](https://console.spectrocloud.com).


2. Navigate to the left **Main Menu** and click on **Clusters**.


3. Select a cluster to edit the node pool.


4. Click on the **Nodes** tab.


5. The nodes details page is where you can review the existing node pools and their configuration. You can also add a new node pool from this page. Click on the **Edit** button to make changes to the node pool.


6. Make the changes as needed. Refer to the [Node Pool Configuration Settings](#nodepoolconfigurationsettings) tables for more information on each field. 


7. Click on **Confirm** to update the node pool.

### Validate

After you have modified a new node pool, you can validate the node pool by following the steps below.

1. Log in to [Palette](https://console.spectrocloud.com).


2. Navigate to the left **Main Menu** and click on **Clusters**.


3. Select the cluster with the new node pool.


4. Click on the **Nodes** tab.


5. Ensure the new node pool is listed in the **Node Pools** section and that all compute instances are in the healthy status. 

<br />