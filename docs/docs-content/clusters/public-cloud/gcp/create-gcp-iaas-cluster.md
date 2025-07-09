---
sidebar_label: "Create and Manage GCP IaaS Cluster"
title: "Create and Manage GCP IaaS Cluster"
description: "Learn how to add and manage an IaaS cluster deployed to GCP."
hide_table_of_contents: false
sidebar_position: 20
---

Palette supports creating and managing Kubernetes clusters deployed to a Google Cloud Platform (GCP) account. This
section guides you to create an IaaS Kubernetes cluster in GCP that Palette manages.

## Limitations

- GPU machine types cannot be used to configure node pools.

## Prerequisites

Ensure the following requirements are met before you attempt to deploy a cluster to GCP:

- Access to a GCP cloud account

- You have added a GCP account in Palette. Review
  [Register and Manage GCP Accounts](/clusters/public-cloud/gcp/add-gcp-accounts) for guidance.

- An infrastructure cluster profile for GCP. Review
  [Create an Infrastructure Profile](../../../profiles/cluster-profiles/create-cluster-profiles/create-infrastructure-profile.md)
  for guidance.

- An SSH Key that is uploaded to Palette and available for usage. Refer to the
  [SSH Keys](../../cluster-management/ssh/ssh-keys.md) guide to learn how to create an SSH key and upload the public key
  to Palette.

- Palette creates compute, network, and storage resources while provisioning Kubernetes clusters. Ensure there is
  sufficient capacity in the preferred GCP region to create the following resources:
  - Virtual Private Cloud (VPC) Network
  - Static External IP Address
  - Network Interfaces
  - Cloud NAT
  - Cloud Load Balancing
  - Persistent Disks
  - Cloud Router

<<<<<<< HEAD
:::warning For static network deployments, you must have port 6443 open between Palette and the Workload cluster. Refer
to the [Network Ports](../../../architecture/networking-ports.md) documentation for detailed network architecture
diagrams and to learn more about the ports used for communication. :::
=======
:::warning

For static network deployments, you must have port 6443 open between Palette and the Workload cluster. Refer to the [Network Ports](../../../architecture/networking-ports.md) documentation for detailed network architecture diagrams and to learn more about the ports used for communication.

:::
>>>>>>> 4440c69b4 (PCP-4838: fix warning admonition)

## Deploy a GCP Cluster

1. Log in to [Palette](https://console.spectrocloud.com).

2. Ensure you are in the correct project scope.

3. From the left **Main Menu** select **Clusters**, and click **Add New Cluster**.

4. In **Public Clouds**, under **Infrastructure Provider**, select **GCP IaaS**.

5. In the bottom-right corner, click **Start GCP IaaS Configuration**.

6. Fill out the following basic information and click **Next**.

   | **Field**         | **Description**                                                                                                                                                                                |
   | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Cluster Name**  | A custom name for the cluster.                                                                                                                                                                 |
   | **Description**   | Use the description to provide context about the cluster.                                                                                                                                      |
   | **Tags**          | Assign any desired cluster tags. Tags on a cluster are propagated to the Virtual Machines (VMs) deployed to the computing environments. Example: `region:us-central1` or `zone:us-central1-a`. |
   | **Cloud Account** | If you already added your GCP account in Palette, select it from the **drop-down Menu**. Otherwise, click **Add New Account** and add your GCP account information.                            |

7. Click **Add Cluster Profile**, select a cluster profile, and click **Next**. Palette displays the cluster profile
   layers.

8. Review the profile layers and customize parameters as desired in the YAML files that display when you select a layer.
   By default, the pack parameters contain values from the cluster profile.

9. Fill out the following parameters and click **Next** when you are done.

   | **Parameter**        | **Description**                                                                                                                                                                             |
   | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Project**          | The project to which the cluster belongs.                                                                                                                                                   |
   | **Region**           | Choose the desired GCP region to deploy the cluster.                                                                                                                                        |
   | **SSH Key**          | Choose the desired SSH key. Refer to the [SSH Keys](../../cluster-management/ssh/ssh-keys.md) guide to learn how to create an SSH key and upload the public key to Palette.                 |
   | **Static Placement** | Check the **Static Placement** box to deploy resources into a pre-existing VPC. Review the [Static Placement](#static-placement) table below to learn more about the required input fields. |

   #### Static Placement

   | **Parameter**            | **Description**                                               |
   | ------------------------ | ------------------------------------------------------------- |
   | **Virtual Network**      | Select the virtual network from the **drop-down Menu**.       |
   | **Control plane subnet** | Select the control plane network from the **drop-down Menu**. |
   | **Worker Network**       | Select the worker network from the **drop-down Menu**.        |

10. Configure the control plane and worker node pool. Specify availability zones, instance types, disk size, the number
    of nodes, and
    [autoscaler support](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/clusterapi/README.md),
    as necessary. Refer to the [Node Pool](../../cluster-management/node-pool.md) documentation to learn more about the
    node pool configuration.

    The minimum number of CPUs and amount of memory depend on your cluster profile, but in general you need at least 4
    CPUs and 4 GB of memory both in the control plane pool and across all worker pools.

    :::info

    You can add new worker pools to customize specific worker nodes to run specialized workloads. For example, the
    default worker pool may be configured with the c2.standard-4 instance types for general-purpose workloads. You can
    configure another worker pool with instance type g2-standard-4 to leverage supported machine types.

    :::

11. An optional taint label can be applied to a node pool during the cluster creation. You can edit the taint label on
    existing clusters. Review the [Node Pool](../../cluster-management/node-pool.md) management page to learn more.
    Toggle the **Taint** button to create a label.

12. Enable or disable node pool taints. If tainting is enabled, then you need to provide values for the following
    parameters.

    | **Parameter** | **Description**                                                                                                                      |
    | ------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
    | **Key**       | Custom key for the taint.                                                                                                            |
    | **Value**     | Custom value for the taint key.                                                                                                      |
    | **Effect**    | Choose the preferred pod scheduling effect from the drop-down Menu. Review the [Effect Table](#effect-table) below for more details. |

    #### Effect Table

    | **Parameter**        | **Description**                                                                                                              |
    | -------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
    | **NoSchedule**       | A pod that cannot tolerate the node taint and should not be scheduled to the node.                                           |
    | **PreferNoSchedule** | The system will avoid placing a non-tolerant pod on the tainted node but is not guaranteed.                                  |
    | **NoExecute**        | New pods will not be scheduled on the node, and existing pods on the node will be evicted if they do not tolerate the taint. |

13. Click **Next** after configuring the node pool.

14. The settings page is where you can configure the patching schedule, security scans, backup settings, and set up Role
    Based Access Control (RBAC). Review the cluster settings and make changes if needed. Click **Validate**.

15. Review the settings summary and click **Finish Configuration** to deploy the cluster. Be aware that provisioning
    IaaS clusters can take approximately 15 - 30 min depending on the cluster profile and the node pool configuration.

You can monitor cluster deployment progress on the cluster details page.

## Validate

You can validate that your cluster is up and available by reviewing the cluster details page.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and click **Clusters**.

3. The **Clusters** page lists the available clusters that Palette manages. Select your cluster to review its details.

4. From the cluster details page, verify the **Cluster Status** field displays **Running**.
