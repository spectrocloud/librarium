---
title: "Scaling"
metaTitle: "Managing Cluster Update Events on Spectro Cloud"
metaDescription: "Events and Notifications on Cluster Updates"
hideToC: false
fullWidth: false
---

import Tabs from '@librarium/shared/src/components/ui/Tabs';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import InfoBox from '@librarium/shared/src/components/InfoBox';
import PointsOfInterest from '@librarium/shared/src/components/common/PointOfInterest';




# Scaling a Cluster
Scaling a cluster up or down involves changing the size of node pools. The following steps need to be performed to scale up/down a cluster:
* Access the ‘Nodes’ view of the cluster
* For the desired node pool change the size directly from the nodes panel or by editing node pool settings.
* After the node pool configuration is updated, the scale-up/down operation is initiated in a few minutes.
* Provisioning status is updated with the ongoing progress of the scale operation.

<InfoBox>
The master node pool may be scaled from 1 to 3 or 3 to 5 nodes, etc. Scale-down operation is not supported for master nodes.
</InfoBox>

## Reconfiguring the Cluster Nodes
  
The following steps need to be performed to reconfigure worker pool nodes: 
* Access the 'Nodes' view for the cluster.
* Edit the settings of the desired node pool.
* Change the number of nodes, rolling update setting, availability zones, flavor, and Disk size to the desired settings.
* Save the node pool settings. After the node pool settings are updated, the node pool reconfiguration begins within a few minutes. The older nodes in the node pool are deleted one by one and replaced by new nodes launched with a new instance type configured.
* Provisioning status is updated with the ongoing progress of nodes being deleted and added.

## Adding a New Worker Pool

The following steps need to be performed to add a new worker node pool to a cluster:-
* Invoke the option to ‘Add Node Pool’ from the cluster’s node information page.
* Provide node pool settings as follows:-
    * A descriptive name for the node pool.
    * The number of nodes in the node pool.
    * Rolling update setting, availability zones, flavor, and Disk size settings.
    * Save the node pool settings. The new worker pool settings are updated and cluster updates begin within a few minutes. Provisioning status is updated with the ongoing progress of tasks related to the addition of new nodes.


## Removing a Worker Pool
The following steps need to be performed to remove a worker pool from the cluster:
* Access the ‘Nodes’ view of the cluster.    
* Delete the desired worker pool and confirm the deletion.
* Upon confirmation, the worker node deletion begins in a few minutes.
