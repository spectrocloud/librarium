---
sidebar_label: "Create and Manage CloudStack Clusters"
title: "Create and Manage CloudStack Clusters"
description: "Learn how to create and managed CloudStack clusters in Palette."
hide_table_of_contents: false
sidebar_position: 20
tags: ["data center", "cloudstack"]
---

You can deploy Kubernetes clusters on Apache CloudStack using Palette. Use the following steps to create and manage
CloudStack clusters in Palette.

## Limitations

TBC

## Prerequisites

Before you begin, ensure that you have the following prerequisites:

- A CloudStack account registered in Palette. Refer to the
  [Add CloudStack Accounts to Palette](./add-cloudstack-accounts.md) guide to learn how to add CloudStack accounts.

- A cluster profile for the CloudStack environment. You can learn how to create a cluster profile by following the steps
  in the
  [Create a Cluster Profile](../../../profiles/cluster-profiles/create-cluster-profiles/create-cluster-profiles.md)
  guide.

- Depending on the network type you select for the cluster, you may need to create an IP Address Management (IPAM) pool
  or define a search domain. Use the following guidelines to create an IPAM pool or define a search domain.

  - An IP Address Management (IPAM) pool is required to assign static IP addresses to the nodes in the cluster. You can
    learn how to create an IPAM pool by following the steps in the
    [Create and Manage IPAM Node Pools](../../pcg/manage-pcg/create-manage-node-pool.md) guide.

  - A search domain, also called DNS mapping, can be used to assign cluster nodes to a specific network, cluster, and
    data center. Check out the [Add DNS Mapping](../../pcg/manage-pcg/add-dns-mapping.md) guide to learn how to add
    multiple DNS mappings to a PCG.

## Create a CloudStack Cluster

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Click **Add New Cluster** on the Create a New Cluster page.

4. Select **Apache CloudStack** and click the **Start Apache CloudStack Configuration** button.

5. Fill out the input fields. Use the table below to learn more about each input fields. Click on the **Next** button
   when you are done.

   | Field Name        | Description                                                                                                                                                                     | Required |
   | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
   | **Cluster name**  | The name of the cluster.                                                                                                                                                        | Yes      |
   | **Description**   | A brief description of the cluster.                                                                                                                                             | No       |
   | **Tags**          | Tags to help you identify the cluster.                                                                                                                                          | No       |
   | **Cloud Account** | The Apache CloudStack account to use for the cluster. If no account is available, ensure you [deployed a PCG](../../pcg/deploy-pcg/vmware.md) into the Apache CloudStack environment. | Yes      |

6. <PartialsComponent category="cluster-templates" name="profile-vs-template" />

7. <PartialsComponent category="profiles" name="cluster-profile-variables-deployment" />

8. Fill out the VMware vSphere configuration details for the cluster. Refer to the table below to learn more about each
   option. Click **Next** to proceed.

   | Field Name                | Description                                                                                                                                                                                                 | Required |
   | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
   | **Zone**            | The VMware vSphere data center where the cluster and its nodes will be deployed.                                                                                                                            | Yes      |
   | **Project Name**     | The folder in the data center where the cluster and its nodes will be deployed. Check the box **Append cluster name** if you want the cluster name appended to the folder name.                             | Yes      |
      | **SSH Key**               | The SSH key to use for the cluster. Check out the [Create and Upload an SSH Key](../../cluster-management/ssh/ssh-keys.md#create-and-upload-an-ssh-key) guide to learn how to upload an SSH key to Palette. | No       |
   | **Static placement**          | The network type to use for the cluster. Select **Static IP** if you want to use static IP addresses. Select **DHCP** if you want to use Dynamic Host Configuration Protocol (DHCP).                        | Yes      |
   | **Sync cluster with CloudStack Kubernetes Service (CKS)**               | asdf | No       |
   | **Update worker pools in parallel**           | asdf                                          | No       |


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
   | **Compute offering**    | The number of CPUs to allocate to the control plane nodes.       |
   | **Networks (optional)** | The amount of memory to allocate to the control plane nodes.     |
   

   ### Worker Plane Pool Configuration

   | Field Name                      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
   | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Node Pool Name**              | The name of the control plane node pool.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
   | **Enable Autoscaler**           | Scale the pool horizontally based on its per-node workload counts. The **Minimum size** specifies the lower bound of nodes in the pool, and the **Maximum size** specifies the upper bound. Setting both parameters to the same value results in a static node count. Refer to the Cluster API [autoscaler documentation](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/clusterapi/README.md) for more information on autoscaling. <br /> <br /> **NOTE:** Autoscaler is not supported for VMware vSphere clusters deployed using an [IP Address Management (IPAM) node pool](../../pcg/manage-pcg/create-manage-node-pool.md) with [static placement configured](../../pcg/deploy-pcg/vmware.md#static-placement-configuration). |
   | **Node Repave Interval**        | The interval at which the worker nodes are repaved in seconds. Refer to the [Repave Behavior and Configuration](../../cluster-management/node-pool.md#repave-behavior-and-configuration) for additional information about repave behaviors.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
   | **Number of Nodes in the Pool** | Number of nodes to be provisioned for the node pool. This field is hidden if **Enable Autoscaler** is toggled on.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
   | **Rolling Update**              | Choose between **Expand First** and **Contract First** to determine the order in which nodes are added or removed from the worker node pool. Expand first adds new nodes before removing old nodes. Contract first removes old nodes before adding new nodes.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
   | **Additional Labels**           | Additional labels to apply to the control plane nodes.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | **Taints**                      | Taints to apply to the control plane nodes. If enabled, an input field is displayed to specify the taint key, value and effect. Check out the [Node Labels and Taints](../../cluster-management/taints.md) page to learn more.                                                                                                                                                                                                                                                                                                                                                                               | Field Name | Description                                                      |
   | ---------- | ---------------------------------------------------------------- |
   | **Compute offering**    | The number of CPUs to allocate to the control plane nodes.       |
   | **Networks (optional)** | The amount of memory to allocate to the control plane nodes.     |                                                                                                                                                           |

    You can click **Copy from Control Plane Pool** if you want to re-use the Control Plane Pool's **Compute offering** and **Networks**.

   Click on the **Next** button when you are done.

<!-- prettier-ignore-start -->

10. On the **Optional cluster settings** page, select from among the items on the left menu to configure additional
    options. Refer to the applicable guide for additional information.

    | **Left Menu Item** | **Additional Information** |
    | --- | --- |
    | **Cluster Timezone** | (Optional) Set the timezone to be used for the cluster |
    | **Manage machines** | [OS Patching](../../cluster-management/os-patching.md) |
    | **Schedule scans** | [Compliance Scan](../../cluster-management/compliance-scan.md#configuration-security) |
    | **Schedule backups** | [Backup and Restore](../../cluster-management/backup-restore/backup-restore.md) |
    | **RBAC** | - [Create Role Bindings](../../cluster-management/cluster-rbac.md#create-role-bindings) <br /> - <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes&tab=custom" /> | 

<!-- prettier-ignore-end -->

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
