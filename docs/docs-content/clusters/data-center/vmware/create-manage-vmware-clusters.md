---
sidebar_label: "Create and Manage VMware Clusters"
title: "Create and Manage VMware Clusters"
description: "Learn how to configure VMware to create VMware clusters in Palette."
hide_table_of_contents: false
sidebar_position: 20
tags: ["data center", "vmware"]
---

You can deploy Kubernetes clusters on VMware vSphere using Palette. Use the following steps to create and manage VMware
clusters in Palette.

## Prerequisites

Before you begin, ensure that you have the following prerequisites:

- A VMware vSphere user account with the necessary permissions to create and manage clusters. Refer to the
  [Required Permissions](./permissions.md) page for more information.

- A VMware account registered in Palette. VMware accounts are automatically registered when you deploy a Private Cloud
  Gateway (PCG) in Palette. Check out the [Deploy a PCG](../../pcg/deploy-pcg/vmware.md) guide to learn how to deploy a
  PCG.

  :::info

  If you have a self-hosted Palette or VerteX instance, you can use the System PCG instance that is deployed in a VMware
  environment. Refer to the [System PCG](../../pcg/architecture.md#system-private-gateway) to learn more about the
  system PCG.

  :::

- A cluster profile for the VMware vSphere environment. You can learn how to create a cluster profile by following the
  steps in the
  [Create a Cluster Profile](../../../profiles/cluster-profiles/create-cluster-profiles/create-cluster-profiles.md)
  guide.

- Depending on the network type you select for the cluster, you may need to create an IP Address Management (IPAM) pool
  or define a search domain. Use the following guidelines to create an IPAM pool or define a search domain.

  - An IP Address Management (IPAM) pool is required to assign static IP addresses to the nodes in the cluster. You can
    learn how to create an IPAM pool by following the steps in the
    [Create and Manage IPAM Node Pools](../../pcg/manage-pcg/create-manage-node-pool.md) guide.

  - A search domain, also called DNS mapping, can be used to assign cluster nodes to a specific network, cluster, and
    datacenter. Check out the [Add DNS Mapping](../../pcg/manage-pcg/add-dns-mapping.md) guide to learn how to add
    multiple DNS mappings to a PCG.

## Create a VMware Cluster

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Click **Deploy New Cluster** on the Create a New Cluster page.

4. Select **VMware** and click the **Start VMware Configuration** button.

5. Fill out the input fields. Use the table below to learn more about each input fields. Click on the **Next** button
   when you are done.

   | Field Name        | Description                                                                                                                                                                     | Required |
   | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
   | **Cluster name**  | The name of the cluster.                                                                                                                                                        | Yes      |
   | **Description**   | A brief description of the cluster.                                                                                                                                             | No       |
   | **Tags**          | Tags to help you identify the cluster.                                                                                                                                          | No       |
   | **Cloud Account** | The VMware vSphere account to use for the cluster. If no account is available, ensure you [deployed a PCG](../../pcg/deploy-pcg/vmware.md) into the VMware vSphere environment. | Yes      |

6. Select the cluster profile you want to use for the cluster. Click the **Next** to proceed.

7. Modify any cluster profile layers as needed. Click **Next** to continue.

8. Fill out the VMware vSphere configuration details for the cluster. Refer to the table below to learn more about each
   option. Click **Next** to proceed.

   | Field Name                | Description                                                                                                                                                                                             | Required |
   | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
   | **Datacenter**            | The VMware vSphere datacenter where the cluster and its nodes will be deployed.                                                                                                                         | Yes      |
   | **Deployment Folder**     | The folder in the datacenter where the cluster and its nodes will be deployed. Check the box **Append cluster name** if you want the cluster name appended to the folder name.                          | Yes      |
   | **Image Template Folder** | The folder in the datacenter where the image templates are stored. This is typically in the **spectro-templates** folder.                                                                               | Yes      |
   | **Network Type**          | The network type to use for the cluster. Select **Static IP** if you want to use static IP addresses. Select **DHCP** if you want to use Dynamic Host Configuration Protocol (DHCP).                    | Yes      |
   | **SSH Key**               | The SSH key to use for the cluster. Check out the [Create and Upload an SSH Key](../../cluster-management/ssh-keys.md#create-and-upload-an-ssh-key) guide to learn how to upload an SSH key to Palette. | No       |
   | **NTP Servers**           | The Network Time Protocol (NTP) servers to use for the cluster.                                                                                                                                         | No       |

   :::warning

   We recommend specifying Network Time Protocol (NTP) servers to ensure that the cluster nodes have the correct time.
   If no NTP servers are specified, it could lead to time drift issues.

   :::

9. Configure the control plane and worker node pool configurations. Click **Next** to proceed.

   ### Control Plane Pool Configuration

   :::tip

   To apply the same configuration to the worker node pool as the control plane node pool, click the **Copy from the
   Control Plane Pool** button. This will copy the control plane pool configuration to the worker node pool.

   :::

   | Field Name                      | Description                                                                                                                                                                                                                    |
   | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | **Node Pool Name**              | The name of the control plane node pool.                                                                                                                                                                                       |
   | **Number of nodes in the pool** | The number of control plane nodes. Allowed values are 1, 3, and 5.                                                                                                                                                             |
   | **Allow Worker Capability**     | Enable this option to workloads to be deployed on control plane nodes.                                                                                                                                                         |
   | **Additional Labels**           | Additional labels to apply to the control plane nodes.                                                                                                                                                                         |
   | **Taints**                      | Taints to apply to the control plane nodes. If enabled, an input field is displayed to specify the taint key, value and effect. Check out the [Node Labels and Taints](../../cluster-management/taints.md) page to learn more. |

   #### Cloud Configuration

   | Field Name | Description                                                      |
   | ---------- | ---------------------------------------------------------------- |
   | **CPU**    | The number of CPUs to allocate to the control plane nodes.       |
   | **Memory** | The amount of memory to allocate to the control plane nodes.     |
   | **Disk**   | The amount of disk space to allocate to the control plane nodes. |

   #### Fault Domain Configuration

   | Field Name          | Description                                             |
   | ------------------- | ------------------------------------------------------- |
   | **Compute Cluster** | The compute cluster to use for the control plane nodes. |
   | **Resource Pool**   | The resource pool to use for the control plane nodes.   |
   | **Datastore**       | The datastore to use for the control plane nodes.       |
   | **Network**         | The network to use for the control plane nodes.         |

   #### Network Configuration

   Depending on what option you selected for the **Network Type** field, the following fields are displayed.

   | Field Name        | Description                                                                                                                                                                                                                                                                                       | Network Type |
   | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
   | **IPAM Pool**     | The IPAM pool to use for the control plane nodes. An IPAM pool is required to assign IP addresses to the nodes in the cluster. You can learn how to create an IPAM pool by following the steps in the [Create and Manage IPAM Node Pools](../../pcg/manage-pcg/create-manage-node-pool.md) guide. | Static IP    |
   | **Search Domain** | The search domain to assign the cluster nodes in. If no search domain is defined, click on the **Define DNS** button and specify the search domain. Check out the [Add DNS Mapping](../../pcg/manage-pcg/add-dns-mapping.md) guide to learn how to add multiple DNS mappings to a PCG.            | DHCP         |

   ### Worker Plane Pool Configuration

   | Field Name                      | Description                                                                                                                                                                                                                                                   |
   | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Node Pool Name**              | The name of the control plane node pool.                                                                                                                                                                                                                      |
   | **Enable Autoscaler**           | Enable this option to automatically scale the worker nodes based on the workload.                                                                                                                                                                             |
   | **Node Repave Interval**        | The interval at which the worker nodes are repaved in seconds. Refer to the [Repave Behavior and Configuration](../../cluster-management/node-pool.md#repave-behavior-and-configuration) for additional information about repave behaviors.                   |
   | **Number of Nodes in the Pool** | The number of worker nodes.                                                                                                                                                                                                                                   |
   | **Rolling Update**              | Choose between **Expand First** and **Contract First** to determine the order in which nodes are added or removed from the worker node pool. Expand first adds new nodes before removing old nodes. Contract first removes old nodes before adding new nodes. |
   | **Additional Labels**           | Additional labels to apply to the control plane nodes.                                                                                                                                                                                                        |
   | **Taints**                      | Taints to apply to the control plane nodes. If enabled, an input field is displayed to specify the taint key, value and effect. Check out the [Node Labels and Taints](../../cluster-management/taints.md) page to learn more.                                |

   Click on the **Next** button when you are done.

10. You can configure the following cluster management features now if needed, or you can do it later:

    - OS Patching
    - Schedule scans
    - Schedule backups
    - Role Based Access Control (RBAC)
    - Location

    #### OS Patching

    Specify your preferred **OS Patching Schedule** for the cluster. Check out the
    [OS Patching](../../cluster-management/os-patching.md) page to learn more about OS patching.

    #### Scan Options

    Enable any scan options you want Palette to perform, and select a scan schedule. Palette provides support for
    Kubernetes configuration security, penetration testing, and conformance testing.

    #### Backup Options

    Schedule any backups you want Palette to perform. Review
    [Backup and Restore](../../cluster-management/backup-restore/backup-restore.md) for more information.

    #### RBAC Configuration

    RBAC configuration is required when you configure custom OIDC. You must map a set of users or groups to a Kubernetes
    RBAC role. To learn how to map a Kubernetes role to users and groups, refer to
    [Create Role Bindings](../../cluster-management/cluster-rbac.md#create-role-bindings). Refer to
    [Use RBAC with OIDC](../../../integrations/kubernetes.md#use-rbac-with-oidc) for an example.

    #### Location

    Specify the location of the cluster. The cluster location is added to the project dashboard location map.

11. Click on the **Validate** button and review the cluster configuration and settings summary.

12. Click **Finish Configuration** to deploy the cluster.

The cluster deployment process is initiated. You can monitor the cluster deployment progress by navigating to the left
**Main Menu** and selecting **Clusters**. Click on the cluster you just created to view the cluster details page. The
**Cluster Status** field displays the current status of the cluster.

## Validate

Use the following steps to validate that the cluster is available and healthy.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and click **Clusters**.

3. The **Clusters** page lists all available clusters that Palette manages. Select the cluster you deployed to review
   its details page.

4. Ensure the **Cluster Status** field contains the value **Running**.

:::tip

You can download the cluster's kubeconfig file to access the cluster using the Kubernetes command-line tool, kubectl.
Check out the [Access a Cluster](../../cluster-management/palette-webctl.md) guide to learn how to download the
kubeconfig file.

:::

## Next Steps

Now that you have a Kubernetes cluster deployed, you can start developing and deploying applications to your clusters.
We recommend you review the Day-2 responsibilities and become familiar with the cluster management tasks. Check out the
[Manage Clusters](../../cluster-management/cluster-management.md) documentation to learn more about Day-2
responsibilities.
