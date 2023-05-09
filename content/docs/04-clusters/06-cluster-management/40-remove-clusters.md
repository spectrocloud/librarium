---
title: "Cluster Removal"
metaTitle: "Remove Cluster"
metaDescription: "Learn how to remove a cluster deployed and managed by Palette"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';



# Delete a Cluster

When you delete a cluster it results in the removal of all compute instances and associated resources created for the cluster. To perform a cluster deletion, use the following steps. 

# Prerequisites

* A host cluster.



# Removal

1. Log into [Palette](https://console.spectrocloud.com) and ensure you are in the correct project scope.


2. Navigate to the left **Main Menu** and click on **Clusters**


3. Click on the cluster that you want to remove.


4. Click on the **Settings** drop-down menu.


5. Click on **Delete Cluster**


6. Type in the name of the cluster and click on **OK**

The cluster status is updated to **Deleting** while cluster resources are being deleted. Once all resources are successfully deleted, the cluster status is updated to **Deleted** and removed from the list of clusters.


# Validation

To validate the host cluster is deleted, use the following steps.

1. Log in to [Palette](https://console.spectrocloud.com).


2. Navigate to the left **Main Menu** and click on **Cluster**.


4. Click on the check box **Deleted only** to view all the clusters deleted in the last 72 hours.

The cluster you deleted is now listed along with other previously deleted clusters.



# Force Delete a Cluster

If a cluster is stuck in the **Deletion** state for a minimum of 15 minutes it becomes eligible for force deletion. You can force delete a cluster from the tenant and project admin scope.

To force delete a cluster follow the same steps outlined above. However, after 15 minutes, a **Force Delete Cluster** option is available in the **Settings** drop-down menu. The **Settings** drop-down menu will provide you with an estimated time left before the force deletion becomes available.

<br />


A force delete can result in resources Palette provisioned being missed in the removal process. Verify there are no remaining Palette-provisioned resources. Use the following list to help you identify resources to remove.

<br />

<WarningBox>

Failure in removing provisioned resources can result in unexpected costs.   

</WarningBox>

<br />

**Azure**

- Virtual Network (VNet)
- Static Public IPs
- Virtual Network Interfaces
- Load Balancers
- VHD
- Managed Disks
- Virtual Network Gateway



**AWS**

- VPC
- Elastic IP
- Elastic Network Interfaces
- Internet Gateway
- Elastic Load Balancers
- EBS Volumes
- NAT Gateway


**GCP**

- Virtual Private Cloud (VPC) Network
- Static External IP Address
- Network Interfaces 
- Cloud NAT
- Cloud Load Balancing
- Persistent Disks
- Cloud Router




