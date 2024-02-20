---
sidebar_label: "Create and Manage MAAS Clusters"
title: "Create and Manage MAAS Clusters"
description: "Learn how to create and manage MAAS clusters in Palette."
hide_table_of_contents: false
tags: ["data center", "maas"]
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
  your MAAS environment. Review the [How to use standard images](https://maas.io/docs/how-to-use-standard-images) for
  guidance on downloading OS images for MAAS.

## Deploy a MAAS Cluster

To deploy a new MAAS cluster:

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Navigate to the **Main Menu** and click **Clusters**. Then click the **Add New Cluster** button.

3. Click **Deploy New Cluster** on the Create a New Cluster page.

4. Select **MAAS** and click the **Start MAAS Configuration** button.

5. Provide basic cluster information: **Cluster name**, **Description**, and **Tags**.

6. Select your MAAS cloud account from the **drop-down Menu** and click **Next**.

7. Select the cluster profile for your MAAS cluster.

8. Review and override pack parameters as desired and click **Next**. By default, parameters for all packs are set with
   values defined in the cluster profile.

9. Select a domain from the **Domain drop-down Menu** and click **Next**.

10. Configure the control plane and worker node pools. The following input fields apply to MAAS control plane and worker
    node pools. For a description of input fields that are common across target platforms refer to the
    [Node Pools](../../cluster-management/node-pool.md) management page. Click **Next** when you are done.

    #### Control Plane Pool configuration

    - Cloud configuration:

      - Resource Pool: The MAAS resource pool from which to select available servers for deployment. Filter available
        servers to only those that have at least the amount of CPU and Memory selected.

    <br />

    #### Worker Pool configuration

    - Cloud configuration:

      - Resource Pool: The MAAS resource pool from which to select available servers for deployment. Filter available
        servers to only those that have at least the amount of CPU and Memory selected.

11. You can configure the following cluster management features now if needed, or you can do it later:

    - Manage machines
    - Schedule scans
    - Schedule backups
    - Role-based access control (RBAC)
    - Location

12. Review settings and deploy the cluster.

## Validate

You can validate your cluster is available by reviewing the cluster details page. Navigate to the left **Main Menu** and
click **Clusters**. The **Clusters** page lists all available clusters that Palette manages. Select the cluster to
review its details page. Ensure the **Cluster Status** field contains the value **Running**.

<br />

## Delete a MAAS Cluster

When you delete a MAAS cluster, all machines and associated storage disks that were created for the cluster are removed.

Follow these steps to delete a MAAS cluster.

<br />

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Navigate to the **Main Menu** and click **Clusters**.

3. Select the cluster you want to delete.

4. Click the **Settings drop-down Menu**, and choose **Delete**.

The cluster status is updated to **Deleting** while cluster resources are being deleted. When all resources are
successfully deleted, the cluster status is updated to **Deleted** and the cluster is removed from the list. The delete
operation returns the edge hosts to the **Ready** state. All the artifacts related to the Kubernetes distribution are
removed.

<br />

## Upgrade a MAAS Cluster

Upgrade a MAAS cluster to enhance the performance and functionality of the cluster. To learn more about managing a MAAS
cluster, refer to [Manage Clusters](../../cluster-management/cluster-updates.md).

To protect your data, we recommend you create a backup of your MAAS cluster before proceeding with any upgrades or
infrastructure changes. Review instructions provided in the
[Backup and Restore](../../cluster-management/backup-restore/backup-restore.md).

<br />

:::warning

Ensure that the Operating System (OS) image selected for your cluster are downloaded and available for your MAAS
configuration to eliminate errors in Palette. You can refer to the
[How to use standard images](https://maas.io/docs/how-to-customise-images) guide for instructions on downloading OS
images compatible with their respective MAAS environment.

:::

## Next Steps

Now that you’ve deployed a MAAS cluster, you can start developing and deploying applications to your cluster. We
recommend you review the Day-2 operations and become familiar with the cluster management tasks. Check out the
[Manage Clusters](../../cluster-management/cluster-management.md) documentation to learn more about Day-2
responsibilities.
