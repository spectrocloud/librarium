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

This section focuses on cluster management and its node pools.

<br />


# Create a New Node Pool

You can create a new node pool for an active cluster. To create a new node pool follow the steps below.

1. Ensure you are in the correct scope or project.

2. Navigate to the left **Main Menu** and click on **Clusters**

3. Click on the row of the cluster you want to edit the node pool.

4. Click on the **Nodes** tab.

5. Click on **New Node Pool**. 

6. Fill out the input fields in the **Add node pool** page. The following table contains an explanation of the available input parameters.
 

|**Parameter**     | **Description**|
|------------------|---------------|
|**Name**          |A descriptive name for the node pool.|
|**Size**          |Number of VMs to be provisioned for the node pool. For the master pool, this number can be 1, 3, or 5.|
|**Allow worker capability (master pool)**|Select this option for allowing workloads to be provisioned on master nodes.|
|**Instance type** |Select the AWS instance type to be used for all nodes in the node pool.|
|**Rolling Update**| Rolling update has two available options. Review the [Update Parameter](#update-parameter-table) table below for more details.
|**Availability Zones**| Choose one or more availability zones. Palette provides fault tolerance to guard against failures like hardware failures, network failures, etc. by provisioning nodes across availability zones if multiple zones are selected.|

### Update Parameter Table

|**Parameter**     | **Description**|
|------------------|---------------|
| **Expand First** | Launches the new node and then shut down the old node. |
| **Contract First**| Shut down the old node first and then launches the new node. |

7. Click on **Confirm** to create the new node pool.


# Modify Node Pools

Palette allows its users to apply changes to a node pool, including its taints label for a running cluster. To make changes to the an active cluster's node pools, follow the steps below. 

1. Ensure you are in the correct scope or project.

2. Navigate to the left **Main Menu** and click on **Clusters**

3. Click on the row of the cluster you want to edit the node pool.

4. Click on the **Nodes** tab.

5. The nodes details page is where you can review the existing node pools and their configuration. You can also add a new node pool from this page. Click on the **Edit** button to make changes to the node pool.

6. Make changes as needed.

7. Click on **Confirm** to update the node pool.
