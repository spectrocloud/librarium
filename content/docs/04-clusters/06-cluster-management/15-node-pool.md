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

### Master Pool

|**Parameter**     | **Description**|
|------------------|---------------|
|**Name**          |A descriptive name for the node pool.|
|**Size**          |Number of VMs to be provisioned for the node pool. For the master pool, this number can be 1, 3, or 5.|
|**Allow worker capability **|Select this option for allowing workloads to be provisioned on master nodes.|
|**[Labels](/clusters/cluster-management/taints#overviewonlabels)**| Add a label to apply placement constraints on a pod, such as a node eligible for receiving the workload. 
|**[Taints](/clusters/cluster-management/taints#overviewontaints)**|To set toleration to pods and allow (but do not require) the pods to schedule onto nodes with matching taints.|
|**Instance type** |Select the AWS instance type to be used for all nodes in the node pool.|
|**Availability Zones**| Choose one or more availability zones. Palette provides fault tolerance to guard against hardware failures, network failures, etc., by provisioning nodes across availability zones if multiple zones are selected.|
|**Disk Size**|Give the required storage size|

### Worker Pool

|**Parameter**     | **Description**|
|------------------|---------------|
|**Name**          |A descriptive name for the node pool.|
|**Enable Autoscaler**|You can enable the autoscaler, by toggling the **Enable Autoscaler** button. Autoscaler scales up and down resources between the defined minimum and the maximum number of nodes to optimize resource utilization.|
||Set the scaling limit by setting the **Minimum Size** and **Maximum Size**, as per the workload the number of nods will scale up from minimum set value to maximum set value and the scale down from maximum set value to minimum set value|
|**Size**          |Number of VMs to be provisioned for the node pool.|
|**Rolling Update**| Rolling update has two available options. Review the [Update Parameter](#update-parameter-table) table below for more details.
|**[Labels](/clusters/cluster-management/taints#overviewonlabels)**|Add a label to apply placement constraints on a pod, such as a node eligible for receiving the workload.
|**[Taints](/clusters/cluster-management/taints#overviewontaints)**|To set toleration to pods and allow (but do not require) the pods to schedule onto nodes with matching taints.|
|**Instance type** |Select the AWS instance type to be used for all nodes in the node pool.|
|**Availability Zones**| Choose one or more availability zones. Palette provides fault tolerance to guard against hardware failures, network failures, etc., by provisioning nodes across availability zones if multiple zones are selected.|
|**Disk Size**|Provide the required storage size
 

#### Update Parameter Table

|**Parameter**     | **Description**|
|------------------|---------------|
| **Expand First** | Launches the new node and then shut down the old node. |
| **Contract First**| Shut down the old node first and then launches the new node. |


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
