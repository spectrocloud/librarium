---
sidebar_label: "Create and Manage GCP GKE Cluster"
title: "Create and Manage GCP GKE Cluster"
description: "Learn how to add and manage a GKE cluster deployed to GCP with Palette."
hide_table_of_contents: false
sidebar_position: 30
tags: ["public cloud", "gcp"]
---

Palette supports creating and managing Kubernetes clusters using Google Kubernetes Engine (GKE). This section guides you
to create a Kubernetes cluster that is deployed to GKE and that Palette manages.

## Prerequisites

Ensure the following requirements are met before you attempt to deploy a cluster to GCP.

<br />

- Access to a GCP cloud account.

- You have added a GCP account in Palette. Review
  [Register and Manage GCP Accounts](/clusters/public-cloud/gcp/add-gcp-accounts) for guidance.

- An infrastructure cluster profile for GKE. Review
  [Create an Infrastructure Profile](../../../profiles/cluster-profiles/create-cluster-profiles/create-infrastructure-profile.md)
  for guidance.

- Palette creates compute, network, and storage resources while provisioning Kubernetes clusters. Ensure there is
  sufficient capacity in the preferred GCP region to create the following resources:
  - Virtual Private Cloud (VPC) Network
  - Static External IP Address
  - Network Interfaces
  - Cloud NAT
  - Cloud Load Balancing
  - Persistent Disks
  - Cloud Router

## Deploy a GKE Cluster

1. Log in to [Palette](https://console.spectrocloud.com) and ensure you are in the correct project scope.

2. Navigate to the left **Main Menu** and click on **Clusters**.

3. Click on **Add New Cluster**.

4. A prompt displays to either deploy or import a new cluster. Click on **Deploy New Cluster**.

5. Select **GCP** and click on **Start GCP Configuration**.

6. Populate the wizard page with the cluster name, description, and tags. Tags assigned to a cluster are propagated to
   the VMs deployed to the computing environments.

7. Select a GCP account, and click on **Next**.

8. Select the **Managed Kubernetes** row and select one of your GKE cluster profiles. Click on **Next**.

9. Review and customize pack parameters as desired. By default, parameters for all packs are set with values defined in
   the cluster profile. Click on **Next** to continue.

10. Fill out the following parameters, and click on **Next** when you are done.

<br />

| Parameter   | Description                                                   |
| ----------- | ------------------------------------------------------------- |
| **Project** | The project to which the cluster belongs.                     |
| **Region**  | Choose the desired GCP region in which to deploy the cluster. |

11. The Node configuration page is where you can specify the availability zones (AZ), instance types, disk size, and the
    number of nodes. Configure the worker node pool. The minimum number of CPUs and amount of memory depend on your
    cluster profile, but in general you need at least 4 CPUs and 4 GB of memory both in the control plane pool and
    across all worker pools.

<br />

:::info

You can add new worker pools to customize specific worker nodes to run specialized workloads. For example, the default
worker pool may be configured with the c2.standard-4 instance types for general-purpose workloads. You can configure
another worker pool with instance type g2-standard-4 to run GPU workloads.

:::

12. An optional taint label can be applied to a node pool during the cluster creation. You can edit the taint label on
    existing clusters. Review the [Node Pool](../../cluster-management/node-pool.md) management page to learn more.
    Toggle the **Taint** button to create a label.

13. Enable or disable node pool taints. If tainting is enabled, then you need to provide values for the following
    parameters.

    | **Parameter** | **Description**                                                                                                                          |
    | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
    | **Key**       | Custom key for the taint.                                                                                                                |
    | **Value**     | Custom value for the taint key.                                                                                                          |
    | **Effect**    | Choose the preferred pod scheduling effect from the **drop-down Menu**. Review the [Effect Table](#effect-table) below for more details. |

    #### Effect Table

    | **Parameter**        | **Description**                                                                                                              |
    | -------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
    | **NoSchedule**       | A pod that cannot tolerate the node taint and should not be scheduled to the node.                                           |
    | **PreferNoSchedule** | The system will avoid placing a non-tolerant pod to the tainted node but is not guaranteed.                                  |
    | **NoExecute**        | New pods will not be scheduled on the node, and existing pods on the node will be evicted if they do not tolerate the taint. |

14. Click on **Next** after configuring the node pool.

15. The **Settings** page is where you can configure the patching schedule, security scans, backup settings, and set up
    Role Based Access Control (RBAC). Review cluster settings and make changes if needed. Click on **Validate**.

16. Review the settings summary and click on **Finish Configuration** to deploy the cluster. Be aware that provisioning
    GKE clusters can take 15 - 30 minutes depending on the cluster profile and the node pool configuration.

You can monitor cluster deployment progress on the cluster details page.

## Validate

You can validate that your cluster is up and available by reviewing the cluster details page.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and click on **Clusters**.

3. The **Clusters** page lists the available clusters that Palette manages. Select your cluster to view its details
   page.

4. From the cluster details page, verify the **Cluster Status** field displays **Running**.
