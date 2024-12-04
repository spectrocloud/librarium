---
sidebar_label: "Create Cluster Backup"
title: "Create Cluster Backup"
description: "Learn how to create a cluster backup to an existing backup location."
hide_table_of_contents: false
sidebar_position: 30
tags: ["clusters", "cluster management", "backup"]
---

This guide provides instructions for how to create a cluster backup using Palette. You can refer to the cluster from
where you created the backup as the _source cluster_.

A backup operation can only back up specified namespaces, cluster-scoped resources, and Persistent Volumes (PVs) from
the source cluster.

:::info

Palette uses Velero to provide backup and restore capabilities. Check out their
[Restore Reference](https://velero.io/docs/main/restore-reference) and
[Backup Reference](https://velero.io/docs/main/backup-reference) to learn more about the project.

:::

You can schedule a cluster backup or initiate a backup on demand. You can define a backup schedule during cluster
creation or in the cluster settings of an existing cluster.

Palette supports scheduling recurring backups, with the ability to customize the frequency and the time. You can also
specify the backup expiry period, meaning the duration after which Palette will delete the backup automatically. For
example, you can schedule a backup for every week on Sunday at midnight and automatically expire the backup after three
months. Additionally, you can initiate a backup on demand for an existing cluster.

## Prerequisites

- An available backup location in Palette. Refer to the
  [Add a Backup Location using Static Credentials](add-backup-location-static.md) or
  [Add a Backup Location using Dynamic Credentials](add-backup-location-dynamic.md).

- An active cluster in Palette.

<!-- prettier-ignore -->
- If you want to include volume snapshots in the backup, ensure that your CSI driver supports volume snapshots. For more
  information about volume support, review the CSI pack README for your CSI driver in use. Refer to the [Volume Snapshots](backup-restore.md#volume-snapshots) section for more information.

## Enablement

<Tabs>

<TabItem label="Schedule a Backup" value="schedule-backup">

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Navigate to the left **Main Menu**, and then select **Clusters**. The list of clusters appears.

3. Select a cluster you want to back up. The cluster **Overview** appears. Ensure the cluster status is _Healthy_.

4. Click on the **Settings Menu** in the top right corner, and select **Cluster Settings**. The **Settings** pane
   appears.

5. Select **Schedule Backups**. The backup configuration appears.

   ![A screenshot highlighting the fields for scheduling a backup for an existing cluster.](/clusters_cluster-management_backup-restore_scheduled-backup.webp)

6. Fill out the required input fields to schedule a backup. Refer to the following table to learn more about each input
   field.

   | **Field**                          | **Description**                                                                                                                          |
   | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
   | **Backup prefix**                  | Palette will generate a name automatically. Provide a prefix string you want to prepend to the auto-generated name.                      |
   | **Select backup location**         | Choose a backup location. You must configure a location before creating a backup.                                                        |
   | **Backup schedule**                | Create a backup schedule of your choice. Palette provides several scheduling options, including a fully customized date.                 |
   | **Select period until expiry**     | Select an expiry duration for the backups. Palette will delete the backup after the expiry duration.                                     |
   | **Include all disks**              | Select this checkbox if you want to include all the disks in the backup.                                                                 |
   | **Include cluster-wide resources** | Select one the options from the dropdown. The available options are **Auto**, **Always** and **Never**. **Auto** is selected by default. |
   | **Include Namespaces** (Optional)  | Palette will back up all namespaces by default. However, you can specify any namespaces you do not want backed up.                       |

   :::info

   In Kubernetes, there are two types of resources: cluster-scoped and namespace-scoped.

   Cluster-scoped resources, such as StorageClasses, ClusterRoles, and others, are visible and accessible to all users
   in the cluster, regardless of the namespaces.

   Namespace-scoped resources, like Pods, Deployments, Services, and others, belong to a specific namespace and can only
   be accessed by users with the necessary permissions.

   :::

   A cluster backup supports the following scheduling options:

   - You can customize your backup to occur at a specific month, day, hour, and minute that suits your needs.
   - Every week on Sunday at midnight
   - Every two weeks at midnight
   - Every month on the first at midnight
   - Every two months on the first at midnight
   - Never

   A cluster-wide backup operation of the source cluster can be configured using three options. The following table
   summarizes the different options.

   | **Backup Configuration** | **Description**                                                                                                                                                             |
   | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Always**               | Include all cluster-wide resources regardless of any selected namespaces. This option is designed for restore operations to be performed exclusively on the source cluster. |
   | **Auto**                 | Include persistent volumes that are linked to claims within the selected namespaces, but exclude cluster-wide resources. This is the default option for new backups.        |
   | **Never**                | Excludes all cluster-wide resources, including persistent volumes.                                                                                                          |

7. Click on **Save Changes**. Depending on the size of the cluster, the backup process may take some time to complete.
   You can view the status of the backup in the **Backups** tab.

</TabItem>

<TabItem label="On-Demand backup" value="on-demand-backup">
1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Select a cluster you want to back up. Ensure the cluster status is _Healthy_.

4. Navigate to the **Backups** tab and click on the **Create Backup** button. The **Create Backup** window appears.

   ![A screenshot highlighting the fields for an on-demand backup for an existing cluster.](/clusters_cluster-management_backup-restore_ondemand-backup.webp)

5. Use the following information to configure a scheduled backup.

   | **Field**                          | **Description**                                                                                                                                                                                                                                                                                                                                                |
   | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Backup name**                    | Provide a name for the backup.                                                                                                                                                                                                                                                                                                                                 |
   | **Select backup location**         | Choose a backup location. You must configure a backup location before creating a backup. Refer to the [Add a Backup Location using Static Credentials](add-backup-location-static.md) or [Add a Backup Location using Dynamic Credentials](add-backup-location-dynamic.md) guides to learn about adding a backup location using static or dynamic credentials. |
   | **Select period until expiry**     | Select an expiry duration for the backup. The backup will be automatically removed after the expiry duration.                                                                                                                                                                                                                                                  |
   | **Include all disks**              | Select this checkbox if you want to include PVs and volume snapshots in the backup.                                                                                                                                                                                                                                                                            |
   | **Include cluster-wide resources** | Select one the options from the dropdown. The available options are **Auto**, **Always** and **Never**. **Auto** is selected by default.                                                                                                                                                                                                                       |
   | **Include Namespaces** (Optional)  | Palette will back up all namespaces by default. However, you can specify namespaces you do not want backed up.                                                                                                                                                                                                                                                 |

   :::info

   In Kubernetes, there are two types of resources: cluster-scoped and namespace-scoped.

   Cluster-scoped resources, such as StorageClasses, ClusterRoles, and others, are visible and accessible to all users
   in the cluster, regardless of the namespaces.

   Namespace-scoped resources, like Pods, Deployments, Services, and others, belong to a specific namespace and can only
   be accessed by users with the necessary permissions.

   :::

   A cluster-wide backup operation of the source cluster can be configured using three options. The following table
   summarizes the different options.

   | **Backup Configuration** | **Description**                                                                                                                                                             |
   | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Always**               | Include all cluster-wide resources regardless of any selected namespaces. This option is designed for restore operations to be performed exclusively on the source cluster. |
   | **Auto**                 | Include persistent volumes that are linked to claims within the selected namespaces, but exclude cluster-wide resources. This is the default option for new backups.        |
   | **Never**                | Excludes all cluster-wide resources, including persistent volumes.                                                                                                          |

6. Click on the **Create Backup** button. Depending on the size of the cluster, the backup process may take some time to
   complete. You can view the status of the backup in the **Backups** tab.

</TabItem>

</Tabs>

## Validate

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Navigate to the left **Main Menu**, and then select **Clusters**.

3. Select the cluster that you configured a backup for. The cluster **Overview** appears.

4. Navigate to the **Backups** tab and click on the **Backups** nested tab. Palette displays a list of all available
   backups for the current cluster, including the newly created one.

   ![A screenshot highlighting the list of available backups for the specific cluster.](/clusters_cluster-management_backup-restore_view-backup.webp)

5. You can click on the newly created backup from the list to view its details. Palette displays the backup name,
   status, creation date, expiry date, list of backed-up namespaces, and a boolean field indicating whether the backup
   includes all disks and cluster-scoped resources.

## Next Steps

When the backup is available, you can restore it to the same or to a different cluster. Refer to the
[Restore a Cluster Backup](restore-cluster-backup.md) guide to learn more about restoring a backup.
