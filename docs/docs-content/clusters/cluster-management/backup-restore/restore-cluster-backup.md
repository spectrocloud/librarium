---
sidebar_label: "Restore Cluster Backup"
title: "Restore Cluster Backup"
description: "Learn how to restore a cluster backup to the source or a different cluster."
hide_table_of_contents: false
sidebar_position: 40
tags: ["clusters", "cluster management", "backup"]
---

This guide provides instructions to restore a cluster backup in Palette. You can restore a backup to the same cluster
you created it from or to a different cluster within the same project. The following terms are used to identify the
backup source and destination.

- _Source cluster_ - The cluster from which you created the backup.

- _Destination cluster_ - The cluster from which you want to restore the backup.

Before you restore a backup, take a moment and review the storage classes in the destination cluster. The following
section provides details about the storage classes and how to identify them.

## Storage Class

A [storage class](https://kubernetes.io/docs/concepts/storage/storage-classes/) is a Kubernetes resource that helps
provision persistent volumes dynamically. When restoring a backup with persistent volumes, you need the storage classes
in the destination cluster. Storage classes in the destination cluster must match the storage classes in the source
cluster.

<br />

### Default Storage Class

When you create a cluster profile, Palette _usually_ creates a default storage class called `spectro-storage-class`. In
some cases, such as when you create a cluster profile for specific cloud providers' managed Kubernetes service, Palette
does not create a default storage class. For example, when you create a cluster profile for GCP GKE using the
[GKE Managed GCE Persistent Disk Driver](https://docs.spectrocloud.com/integrations/gce) storage pack, Palette will not
create a storage class by default. In this scenario, you can define a custom storage class in the cluster profile or
create one after deploying the cluster.

<br />

### Identify Storage Classes

Below are different methods to identify the storage classes of your source and destination clusters.

You can review the cluster profile's Container Storage Interface (CSI) layer configuration YAML. If the CSI YAML defines
the storage classes, you will find them within the `storageClasses` attribute. Below is an example of a CSI YAML that
defines two storage classes, `spectro-storage-class` and `addon-storage-class`.

<br />

```yaml
storageClasses:
  - name: spectro-storage-class
    annotations:
      storageclass.kubernetes.io/is-default-class: "true"
      type: "gp2"
  - name: addon-storage-class
```

Another method to identify the storage classes in the destination cluster is to use the kubectl CLI. If you have access
to the destination cluster, you can issue the following command to view a list of storage classes.

```bash
kubectl get storageclasses --all-namespaces
```

Review the output from the above command. If the output contains the storage classes you need, you can proceed with the
restore operation. Otherwise, you can create the required storage classes in the destination cluster.

## Create Storage Classes

If there is a mismatch between storage classes in the source and destination cluster, create the required new storage
classes in the destination cluster. To define a new storage class in the destination cluster, you will need to define a
[StorageClass resource](https://kubernetes.io/docs/concepts/storage/storage-classes/#the-storageclass-resource) manifest
and apply it using kubectl. Alternatively, you can define the storage classes in the cluster profile through a manifest
layer and apply the updates to the cluster before initiating a restore.

:::info

A restore operation only restores the specified namespaces, cluster-scoped resources, and persistent volumes from the
backup. To learn more about the restore operation, refer to the Velero
[Restore Reference](https://velero.io/docs/main/restore-reference).

:::

### Prerequisites

- The source cluster is available and healthy in Palette.

:::warning

If the source cluster is unavailable in Palette, you cannot restore its backup through the Palette user interface. Reach
out to our support team at [support@spectrocloud.com](mailto:support@spectrocloud.com) for additional guidance.

:::

- A destination cluster is available and healthy in Palette.

- The destination cluster must belong to the same project as the source cluster.

- A backup is created for the source cluster. Check out the [Create Cluster Backup](create-cluster-backup.md) for
  guidance on how to create a backup.

- Ensure the storage classes in the destination cluster match the storage classes in the source cluster.

- If the backup location is configured using dynamic credentials, such as the AWS Security Token Service (STS)
  authentication method, ensure you define a trust relationship with the destination cluster. The trust relationship
  enables the destination cluster to assume the necessary IAM role to access the backup files. Refer to the
  [Add a Backup Location using Dynamic Credentials](add-backup-location-dynamic.md) guide.

### Instructions

Use the following instructions in Palette to restore a backup to a destination cluster.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and click on **Clusters**.

3. Select the source cluster to view its details page.

4. Navigate to the **Backups** tab and click on **Backups** in the nested tabs. Palette displays a list of available
   backups.

5. Select a backup you want to restore from the list.

6. Click on the **Restore Backup** button at the bottom, as highlighted in the screenshot below.

![A screenshot highlighting the details of a specific backup.](/clusters_cluster-management_backup-restore_restore.png)

7. In the restore operation wizard, select the destination cluster where you want to restore the backup. For example,
   you can select the current or a different cluster. You can initiate a restore operation on any destination cluster in
   the same project as the source cluster. A backup does not store infrastructure-related information, such as node
   pools and configuration. Therefore, the destination cluster can have a different infrastructure provider than the
   source cluster.

You can include specific namespaces, Persistent Volumes (PVs), and cluster-scoped resources.

![A screenshot highlighting the restore operation configurations.](/clusters_cluster-management_backup-restore_confirm-restore.png)

8. Review the restore operation configurations, and click on the **Confirm Restore** button at the bottom.

You now have successfully initiated a restore operation. Palette displays the status of the restore operation in the
**Restores** nested tab. You can navigate to the **Events** tab to view the logs for the restore operation.

### Validate

Use the following steps to validate restoring a cluster backup.

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Select the destination cluster where you want to restore the backup.

4. In the cluster details **Overview** tab, take note of the cluster's **Last Modified** field. The cluster's last
   modified timestamp will be updated to the time when you initiated the restore operation.

5. Navigate to the **Backups** tab and click on **Restores** in the nested tabs. Palette displays the status, restore
   timestamp, source cluster, and the backup name for each restore operation you performed for the current cluster. The
   screenshot below shows an example restore operation.

![A screenshot highlighting the restoration status for the destination cluster.](/clusters_cluster-management_backup-restore_verify-restore.png)

You restored the backup successfully when the backup status displays _Completed_.

:::info

Remember, a backup does not include the cluster profile of the source cluster. Therefore, the restore operation will not
change the cluster profile of the destination cluster.

:::

6. To review the backup logs, navigate to the **Events** tab.

7. Examine the logs. Each log contains a status message. When the restore operation is complete, all the
   namespace-scoped resources contain your desired backed-up data.
