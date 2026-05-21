---
sidebar_label: "Create and Manage MAAS Clusters"
title: "Create and Manage MAAS Clusters"
description: "Learn how to create and manage MAAS clusters in Palette."
hide_table_of_contents: false
tags: ["data center", "maas"]
sidebar_position: 20
---

Palette supports creating and managing Kubernetes clusters deployed to a MAAS account. This section guides you on how to
create a Kubernetes cluster in MAAS that is managed by Palette.

## Prerequisites

- An installed PCG if you do not have a direct connection to the MAAS environment. Review
  [Deploy to MAAS](../../pcg/deploy-pcg/maas.md) for guidance.

  If are self-hosting Palette and have a direct connection to the MAAS environment, you can select **Use System Private
  Gateway**. To learn more about when you would use Palette's PCG or the System Private Gateway, refer to the
  [Architecture](architecture.md) page to learn more.

- A MAAS account registered in Palette. Refer to the
  [Register and Manage MAAS Cloud Accounts](register-manage-maas-cloud-accounts.md) if you need to register a MAAS
  account in Palette.

- A cluster profile for the MAAS environment. Review
  [Cluster Profiles](../../../profiles/cluster-profiles/cluster-profiles.md) for more information.

- Verify that the required Operating System (OS) images you use in your cluster profiles are downloaded and available in
  your MAAS environment. Review the [How to use standard images](https://canonical.com/maas/docs/about-images) for
  guidance on downloading OS images for MAAS.

:::info

By default, Palette registers a DNS record in MAAS for the deployed cluster and links it to the IP addresses of the
control plane nodes of the cluster. However, you may choose not to depend on MAAS for your cluster DNS record. The
Kubernetes pack allows you to configure a custom API server endpoint for your cluster instead.

<!-- prettier-ignore-start -->

This feature is only supported in Palette eXtended Kubernetes (PXK). Refer to the <VersionedLink
  text="Custom API Server Endpoint for MAAS Clusters"
  url="/integrations/packs/?pack=kubernetes"
/>
section of the pack Additional Guidance for further information.

<!-- prettier-ignore-end -->

:::

- If configuring the **Cert Manager** pack , ensure that you use version 1.19.1 or later. It is also important to
  ensure:
  - `crds.enabled` is set to `false`.
  - `cainjector.enabled` is set to `false` or `cainjector.replicas` is set to `0`.
  - `nodeSelector` or `nodeAffinity` is set to prevent scheduling of Cert Manager on control pane nodes.

## Deploy a MAAS Cluster

1.  Log in to [Palette](https://console.spectrocloud.com).

2.  Ensure you are in the correct project scope.

3.  From the left **Main Menu**, select **Clusters** and click **Add New Cluster**.

4.  In **Data Center**, select **MAAS**.

5.  In the bottom-right corner, click **Start MAAS Configuration**.

6.  Complete the following information. Select **Next** when finished.

    | **Field**         | **Description**                                                                                                                                                                                                                          |
    | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Cluster Name**  | Enter a custom name for the cluster.                                                                                                                                                                                                     |
    | **Description**   | (Optional) Provide context about the cluster.                                                                                                                                                                                            |
    | **Tags**          | (Optional) Assign any desired cluster tags. You can use tags to filter and organize clusters in Palette. Example: `env:test`.                                                                                                            |
    | **Cloud Account** | Select the appropriate MAAS account under which to deploy the cluster. If the account is not listed, select **Add New Account**, and follow the prompts to [add your MAAS account](./register-manage-maas-cloud-accounts.md) to Palette. |

7.  <PartialsComponent category="cluster-templates" name="profile-vs-template" />

8.  <PartialsComponent category="profiles" name="cluster-profile-variables-deployment" />

9.  Fill out the following fields on the **Cluster Config** step. Select **Next** when finished.

    | **Field**                         | **Description**                                                                                                                                                                                                                                                                                                                                                                                            |
    | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Domains**                       | Register a DNS record in the selected domain for the deployed cluster. The DNS record links to the IP addresses of the control plane nodes.                                                                                                                                                                                                                                                                |
    | **SSH Keys (Optional)**           | Inject public Secure Shell (SSH) keys into `~/.ssh/authorized_keys` on each control plane and worker node, including LXD VMs. The list is populated using the keys in **Tenant Settings** or **Project Settings** > **Security** > **SSH Keys**. Select **Add Item** to [add additional keys](/clusters/cluster-management/ssh/ssh-keys/).                                                                 |
    | **NTP Servers (Optional)**        | Specify Network Time Protocol (NTP) servers for the cluster nodes. The servers you provide override the machine image defaults. We recommend specifying at least one NTP server to prevent time drift issues.                                                                                                                                                                                              |
    | **Host LXD-Based Control Planes** | Activate to use this cluster as an LXD-based control plane (hypervisor) for running control plane components as LXD VMs. To create a workload cluster that leverages MAAS LXD or use an existing host LXD-based control plane, leave this option disabled. Refer to [Create and Manage MAAS Clusters Using LXD VMs](create-manage-maas-lxd-clusters.md) for more information on leveraging LXD in Palette. |

10. Configure the control plane and, optionally, worker node pools.

    The following input fields apply to MAAS control plane and worker node pools. For a detailed list of input fields
    that are common across environments and their usage, refer to our
    [Node Pools](../../cluster-management/node-pool.md#node-pool-configuration-settings) guide. Select **Next** when
    finished.

    | **Parameter**          | **Description**                                                                                                                                                                                                                                                                                                                              |
    | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Resource pool**      | The MAAS resource pool from which to deploy nodes.                                                                                                                                                                                                                                                                                           |
    | **Minimum CPU**        | Only select machines from the **Resource pool** that have at least the specified amount of CPU.                                                                                                                                                                                                                                              |
    | **Minimum Memory**     | Only select machines from the **Resource pool** that have at least the specified amount of memory.                                                                                                                                                                                                                                           |
    | **Availability zones** | The MAAS zones in which to deploy nodes. Palette distributes nodes across the selected zones for high availability.                                                                                                                                                                                                                          |
    | **Tags**               | Controls which MAAS machines to use for the node pool based on [MAAS tags](https://canonical.com/maas/docs/about-machine-groups#p-22953-tags). If you specify multiple tags, Palette only selects machines that have _all_ of the specified tags. <br /> <br /> **WARNING:** Modifying tags on an existing node pool triggers a node repave. |

11. <PartialsComponent category="clusters" name="cluster-settings" />

12. Select **Validate** to review your cluster configurations and settings.

13. If no changes are needed, select **Finish Configuration** to deploy your cluster.

To monitor the status of your cluster deployment, from the left main menu, select **Clusters** and choose your cluster.
The cluster **Overview** tab displays the status and health of your cluster, as well as deployment details. Use the
**Events** tab to monitor the deployment in real time. Provisioning may take several minutes.

## Validate

You can validate your cluster is available by reviewing the cluster details page. Navigate to the left **Main Menu** and
click **Clusters**. The **Clusters** page lists all available clusters that Palette manages. Select the cluster to
review its details page. Ensure the **Cluster Status** field contains the value **Running**.

## Delete a MAAS Cluster

When you delete a MAAS cluster, all machines and associated storage disks that were created for the cluster are removed.

Follow these steps to delete a MAAS cluster.

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Navigate to the **Main Menu** and click **Clusters**.

3. Select the cluster you want to delete.

4. Click the **Settings drop-down Menu**, and choose **Delete**.

The cluster status is updated to **Deleting** while cluster resources are being deleted. When all resources are
successfully deleted, the cluster status is updated to **Deleted** and the cluster is removed from the list. The delete
operation returns the edge hosts to the **Ready** state. All the artifacts related to the Kubernetes distribution are
removed.

## Upgrade a MAAS Cluster

Upgrade a MAAS cluster to enhance the performance and functionality of the cluster. To learn more about managing a MAAS
cluster, refer to [Manage Clusters](../../cluster-management/cluster-updates.md).

To protect your data, we recommend you create a backup of your MAAS cluster before proceeding with any upgrades or
infrastructure changes. Review instructions provided in the
[Backup and Restore](../../cluster-management/backup-restore/backup-restore.md).

:::warning

Ensure that the Operating System (OS) images selected for your cluster are downloaded and available for your MAAS
configuration to eliminate errors in Palette. You can refer to the
[How to use standard images](https://canonical.com/maas/docs/about-images) guide for instructions on downloading OS
images compatible with their respective MAAS environment.

:::

## Next Steps

Now that you’ve deployed a MAAS cluster, you can start developing and deploying applications to your cluster. We
recommend you review the Day-2 operations and become familiar with the cluster management tasks. Check out the
[Manage Clusters](../../cluster-management/cluster-management.md) documentation to learn more about Day-2
responsibilities.
