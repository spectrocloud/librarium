---
sidebar_label: "Cluster Removal"
title: "Cluster Removal"
description: "Learn how to remove a cluster deployed and managed by Palette."
hide_table_of_contents: false
sidebar_position: 220
tags: ["clusters", "cluster management"]
---


When you delete a cluster it results in the removal of all compute instances and associated resources created for the cluster. Use the following steps to delete a cluster. 

### Prerequisites

* A host cluster.



## Delete a Cluster

1. Log in to [Palette](https://console.spectrocloud.com) and ensure you are in the correct project scope.


2. Navigate to the left **Main Menu** and click on **Clusters**.


3. Click on the cluster you want to delete.


4. Click on the **Settings drop-down Menu**.


5. Click on **Delete Cluster**.


6. Type the cluster name and click on **OK**.

The cluster status is updated to **Deleting** while cluster resources are removed. When all resources are successfully deleted, the cluster status is updated to **Deleted**, and the cluster is removed from the cluster list.


## Validate

To validate the host cluster is deleted, use the following steps.

1. Log in to [Palette](https://console.spectrocloud.com).


2. Navigate to the left **Main Menu** and click on **Cluster**.


3. Check the box labeled **Deleted only** to view all the clusters deleted in the last 72 hours.

The cluster you deleted is now listed along with other previously deleted clusters.



## Force Delete a Cluster

If a cluster is stuck in the **Deleting** state for a minimum of 15 minutes, it becomes eligible for force deletion. You can force delete a cluster from the tenant and project admin scope.

To force delete a cluster, follow the same steps outlined above. After 15 minutes, a **Force Delete Cluster** option is available in the **Settings drop-down Menu**. The drop-down menu will provide you with an estimated remaining time left before the force deletion becomes available.

A force delete can result in Palette-provisioned resources being missed in the removal process. Verify there are no remaining resources. Use the following list to help you identify resources to remove.

:::caution

Failure to remove provisioned resources can result in unexpected costs.   

:::


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




