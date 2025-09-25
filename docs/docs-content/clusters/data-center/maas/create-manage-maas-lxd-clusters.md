---
sidebar_label: "Create and Manage MAAS Clusters Using LXD VMs"
title: "Create and Manage MAAS Clusters Using LXD VMs"
description: "Learn how to create and manage MAAS clusters using LXD VMs in Palette."
hide_table_of_contents: false
tags: ["data center", "maas", "lxd"]
---

Palette supports creating and managing Kubernetes clusters deployed to a MAAS account with LXD Virtual Machines (VMs)
enabled. This section guides you through how to create a Kubernetes cluster in MAAS that uses LXD VMs and is managed by
Palette.

:::preview

:::

## Prerequisites


- A [MAAS account registered in Palette](register-manage-maas-cloud-accounts.md). All MAAS-registered Palette accounts must use either a System Private Gateway or Private Cloud Gateway (PCG) to connect to the MAAS environment. For more information on which PCG to use, refer to our MAAS [Architecture](architecture.md/#pcg-deployment-options) guide.
     - If your Palette instance does not have a direct connection to the MAAS environment, you must manually [deploy a PCG cluster](../../pcg/deploy-pcg/maas.md) to your MAAS environment.
     - If you are using a self-hosted Palette or Palette VerteX instance that has a direct connection to your MAAS environment, you can use Palette's [System Private Gateway](architecture.md/#system-private-gateway). 

- A [cluster profile](../../../profiles/cluster-profiles/cluster-profiles.md) for the MAAS environment. The Operating System (OS) image used in your cluster profile must be downloaded and available in
  your MAAS environment. Review [How to use standard images](https://canonical.com/maas/docs/about-images) for
  guidance on downloading OS images for MAAS.


- MAAS hosts that support KVM or LXD VMs.
:::info

<!-- prettier-ignore-start -->

By default, Palette registers a DNS record in MAAS for the deployed cluster and links it to the IP addresses of the
control plane nodes. However, you can use the <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="integrations/packs/?pack=kubernetes&tab=custom#custom-api-server-endpoint-for-maas-clusters" /> pack to configure a custom API server endpoint for your cluster instead.

<!-- prettier-ignore-end -->

:::

## Deploy a MAAS Cluster with LXD Enabled

1.  Log in to [Palette](https://console.spectrocloud.com).

2.  Ensure you are in the correct project scope.

3.  From the left main menu, select **Clusters**, and choose either **Create Cluster** or **Add New Cluster**.

4.  In the **Data Center** section, select **MAAS**.

5.  In the bottom-right corner, click **Start MAAS Configuration**.

6.  Enter the basic information for your cluster, including the **Cluster name**, **Description**, and **Tags**. 

7.  From the **Cloud Account** drop-down menu, select your MAAS cloud account, and click **Next**.

8.  Select the cluster profile for your MAAS cluster.

9.  Review and override pack parameters as desired. Select **Next**.

10. Select a **Domain** from the drop-down menu. 

11. To use a MAAS bare metal host as a hypervisor for your control plane components, activate the **Host LXD-Based Control Planes** switch. If you want to use MAAS LXD instead of bare metal, leave this option disabled. Select **Next**.

![Activating the Host LXD-Based Control Planes switch](../../../../../static/assets/docs/images/clusters_data-center_maas_profile-lxd-4-7-b.webp)

11. Configure the control plane and worker node pools. The following input fields apply to MAAS control plane and worker
    node pools. For a detailed list of input fields that are common across environments and their usage, refer to our
    [Node Pools](../../cluster-management/node-pool.md/#node-pool-configuration-settings) guide. Select **Next** when finished.

    #### Control Plane Pool Cloud Configuration

| **Parameter** | **Description** |
| --- | --- |
| **Resource Pool** | The MAAS resource pool from which to select available servers for deployment. Filter available servers to only those that have at least the amount of CPU and Memory selected. |
| **Tags** | Select one or more MAAS tags that machines must have to be included in the control plane pool. We recommend using MAAS automatic tags so that the pool membership updates dynamically as machines begin or cease to match the criteria. To learn more about MAAS automatic tags, refer to the [MAAS Tags](https://maas.cloud.cbh.kth.se/MAAS/docs/cli/how-to-tag-machines.html#heading--how-to-create-automatic-tags) documentation. |

    #### Worker Pool Cloud Configuration

| **Parameter** | **Description** |
| --- | --- |
| **Use LXD VMs** | Select this option if you want your worker nodes to use MAAS LXD instead of bare metal. This option is only displayed if you have KVM or LXD enabled on MAAS and you did _not_ select **Host LXD-Based Control Planes** on step 11. |
| **Resource Pool** | The MAAS resource pool from which to select available servers for deployment. Filter available servers to only those that have at least the amount of CPU and Memory selected. |
| **Tags** | Specify the MAAS machine tags so that Palette can deploy nodes onto the MAAS machines that match the provided tags. To learn more about MAAS tags, refer to the [MAAS Tags](https://canonical.com/maas/docs/about-machine-groups#p-22953-tags) documentation. |

      ![Use LXD VMs switch](/clusters_data-center_maas_profile-lxd-worker-4-7-b.webp)

<!-- prettier-ignore-start -->

12. On the **Optional cluster settings** page, select from among the items on the left menu to configure additional
    options. Refer to applicable guide for additional information.

    | **Left Menu Item** | **Additional Information** |
    | --- | --- |
    | **Manage machines** | [OS Patching](../../cluster-management/os-patching.md) |
    | **Schedule scans** | [Compliance Scan](../../cluster-management/compliance-scan.md#configuration-security) |
    | **Schedule backups** | [Backup and Restore](../../cluster-management/backup-restore/backup-restore.md) |
    | **RBAC** | - [Create Role Bindings](../../cluster-management/cluster-rbac.md#create-role-bindings) <br /> - <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes&tab=custom" /> | 

<!-- prettier-ignore-end -->


13. Select **Validate** to review the cluster configuration and settings summary.

14. Select **Finish Configuration** to deploy the cluster. Provisioning can take several minutes.

To monitor the status of your cluster deployment, from the left main menu, select **Clusters** and choose your cluster.
The cluster **Overview** tab displays the status and health of your cluster, as well as deployment details. Refer to the
**Events** tab to monitor the deployment in real time.

## Validate

Use the following steps to You can validate your cluster is up and in **Running** state.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Ensure you are in the correct project scope.

3. From the left main menu, select **Clusters**. The **Clusters** page displays a list of all available clusters that
   Palette manages.

4. Select the cluster you deployed. On the **Overview** tab, ensure the **Cluster Status** is **Running** and that the
   cluster has a **Health** status of **Healthy**.

## Delete a MAAS Cluster

Take the following steps to delete a MAAS cluster. Note that when you delete a MAAS cluster, all machines and associated storage disks that were created for the cluster are removed.

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. From the left main menu, select **Clusters**.

3. Select the cluster you want to delete.

4. In the top-right, select the **Settings** drop-down menu, and choose **Delete**.

The cluster status is updated to **Deleting** while cluster resources are being deleted. When all resources are
successfully deleted, the cluster status is updated to **Deleted** and the cluster is removed from the list. The delete
operation returns the edge hosts to the **Ready** state. All the artifacts related to the Kubernetes distribution are
removed.

## Upgrade a MAAS Cluster

Upgrade a MAAS cluster to enhance the performance and functionality of the cluster. To learn more about managing a MAAS
cluster, refer to [Manage Clusters](../../cluster-management/cluster-updates.md).

To protect your data, we recommend you create a backup of your MAAS cluster before proceeding with any upgrades or
infrastructure changes. Review our
[Backup and Restore](../../cluster-management/backup-restore/backup-restore.md) guide for additional information.

:::warning

Ensure that the OS image used in your cluster profile is downloaded and available in
  your MAAS environment before attempting to upgrade your cluster. Review [How to use standard images](https://canonical.com/maas/docs/about-images) for
  guidance on downloading compatible OS images for MAAS.

:::

## Next Steps

Now that you have deployed a MAAS cluster, you can start developing and deploying applications to your cluster. We
recommend you review the Day-2 operations and become familiar with the cluster management tasks. Check out the
[Manage Clusters](../../cluster-management/cluster-management.md) documentation to learn more about Day-2
responsibilities.
