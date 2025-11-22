---
sidebar_label: "Cluster Removal"
title: "Cluster Removal"
description: "Learn how to remove a cluster deployed and managed by Palette."
hide_table_of_contents: false
sidebar_position: 220
tags: ["clusters", "cluster management"]
---

When you delete a cluster it results in the removal of all compute instances and associated resources created for the
cluster. Use the following steps to delete a cluster.

### Prerequisites

- A host cluster.

## Removal

1. Log in to [Palette](https://console.spectrocloud.com) and ensure you are in the correct project scope.

2. Navigate to the left **Main Menu** and click on **Clusters**.

3. Click on the cluster you want to delete.

4. Click on the **Settings drop-down Menu**.

5. Click on **Delete Cluster**.

6. Type the cluster name and click on **OK**.

The cluster status is updated to **Deleting** while cluster resources are removed. When all resources are successfully
deleted, the cluster status is updated to **Deleted**, and the cluster is removed from the cluster list.

## Validate

To validate the host cluster is deleted, use the following steps.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and click on **Cluster**.

3. Check the box labeled **Deleted only** to view all the clusters deleted in the last 72 hours.

The cluster you deleted is now listed along with other previously deleted clusters.

## Force Delete a Cluster

If a cluster is stuck in the **Deleting** state for 15 minutes, it becomes eligible for force deletion. You can force
delete a cluster from the tenant and project admin scope.

To force delete a cluster, follow the steps to delete the cluster. After 15 minutes, a **Force Delete Cluster** option
is available in the **Settings Menu**. The **drop-down Menu** will provide you with an estimated remaining time left
before the force deletion becomes available.

:::tip

To ensure a complete cleanup of all associated resources, verify that your cloud credentials are valid and correctly
configured. Force-deleting a cluster may leave some cloud resources behind if your cloud account credentials are
invalid.

:::

### Remove Lingering Resources

A force delete can result in Palette-provisioned resources being missed in the removal process. Verify there are no
remaining resources by visiting the deployed resources in the target cluster's infrastructure provider environment. Use
one of the following lists for your environment to help you identify resources to remove.

:::warning

Failure to remove provisioned resources can result in unexpected costs.

:::

#### Azure

- Virtual Network (VNet)
- Static Public IP addresses
- Virtual Network Interfaces
- Load Balancers
- Virtual Hard Disk (VHD)
- Managed Disks
- Virtual Network Gateway

#### AWS

- VPC
- Elastic IP addresses
- Elastic Network Interfaces
- Internet Gateway
- Elastic Load Balancers
- EBS Volumes
- Network Address Translation (NAT) Gateway

#### GCP

- Virtual Private Cloud (VPC) Network
- Static External IP addresses
- Network Interfaces
- Cloud NAT
- Cloud Load Balancing
- Persistent Disks
- Cloud Router

#### VMware

- VMs: control planes, workers, High Availability Proxy (HAProxy), and Load Balancers
- VM Templates
- VM Clones
- Cluster-specific VM Folders
- Static IP and Virtual IP (VIP) address reservations
- IP and VIP Addresses in use
- Domain Name System (DNS) Records
- Datastore leftovers: orphaned VM Disk (VMDK) files and VM directories
- VM and Storage Snapshots
- Load Balancers (NSX, Avi, or others specific to the deployment)
- Firewall Sections and Rules
- Resource Pools
- Template Folders
- Installation ISO Images
