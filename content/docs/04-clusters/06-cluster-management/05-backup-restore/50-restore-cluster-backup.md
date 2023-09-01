---
title: "Restore Cluster Backup"
metaTitle: "Restore Cluster Backup"
metaDescription: "Learn how to restore a cluster backup to the source or a different cluster."
hideToC: false
fullWidth: false
---

import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

# Restore a Cluster Backup

This guide provides instructions for how to restore a backup to a cluster in Palette. You can restore a backup to the same cluster from where you created it or to a different cluster within the same project. To help you better understand the restore process, the following terminology will be used:
<br />

- *Source cluster* - The cluster from where you created the backup.


- *Destination cluster* - The cluster where you want to restore the backup


Before you restore a backup, take a moment and review the storage classes in the destination cluster. The following section will provide more details about the storage classes and how to identify them.

<br />

## Storage Class

A [storage class](https://kubernetes.io/docs/concepts/storage/storage-classes/) is a Kubernetes resource that helps provision persistent volumes dynamically. In the case of a restore, you will need the storage classes in the destination cluster when you restore a backup with persistent volumes. It is necessary to have the storage classes in the destination cluster match the storage classes in the source cluster. 
<br />

### Default Storage Class
When you create a cluster profile, Palette *usually* creates a storage class, `spectro-storage-class`, by default. In some cases, Palette does not create a storage class by default. Such scenarios arise when you create a cluster profile for specific cloud providers' managed Kubernetes service. For example, when you create a cluster profile for GCP GKE using the  [GKE Managed GCE Persistent Disk Driver](https://docs.spectrocloud.com/integrations/gce) storage pack, Palette will not create a storage class by default. In such cases, you can define a custom storage class in the cluster profile or create one after deploying the cluster. 

<br />

### Identify Storage Classes

Below are the different methods to identify the storage classes of your source and destination clusters. 


You can review the cluster profile's Container Storage Interface (CSI) layer configuration YAML. If the CSI YAML defines the storage classes, you will find them within the `storageClasses` attribute. Below is an example of a CSI YAML that defines two storage classes, `spectro-storage-class` and `addon-storage-class`.

<br />


```yaml
storageClasses: 
    - name: spectro-storage-class
      annotations:
        storageclass.kubernetes.io/is-default-class: "true"
        type: "gp2"
    - name: addon-storage-class
```



Another method to identify the storage classes in the destination cluster is to use the kubectl CLI. If you have access to the destination cluster, you can execute the following command to get the list of storage classes.

<br />

```bash
kubectl get storageclasses --all-namespaces
```

Review the output from the above command. If the output contains the storage classes you need, you can proceed with the restore operation. Otherwise, you can create the required storage classes in the destination cluster.

<br />

### Create Storage Classes
If there is a mismatch between the storage classes in the destination cluster and the source cluster, create the required new storage classes in the destination cluster. To define a new storage class in the destination cluster, you will need to define a [StorageClass resource](https://kubernetes.io/docs/concepts/storage/storage-classes/#the-storageclass-resource) manifest and apply it using the kubectl. Another way is to define the storage classes in the cluster profile through a manifest layer and apply the updates to the cluster before initiating a restore. 

<br />


<InfoBox>

A restore operation will only restore the specified namespaces, cluster-scoped resources, and persistent volumes from the backup. To learn more about the inner workings of a restore operation, refer to the [Restore Reference](https://velero.io/docs/main/restore-reference) documentation by Velero.

</InfoBox>

# Prerequisites

- The source cluster is available and healthy in Palette. 

  <br />

  <WarningBox>

  If the source cluster is unavailable in Palette, you cannot restore its backup. 

  </WarningBox>


- A destination cluster is available and healthy in Palette. 


- The destination cluster must belong to the same project as the source cluster. 


- A backup is created for the source cluster. Check out the [Create Cluster Backup](/clusters/cluster-management/backup-restore/create-cluster-backup) for guidance on how to create a backup.


- Ensure the storage classes in the destination cluster match the storage classes in the source cluster. 


- If the backup location is configured using dynamic credentials, such as the AWS Security Token Service (STS) authentication method, ensure you define a trust relationship with the destination cluster. The trust relationship enables the destination cluster to assume the necessary IAM role to access the backup files. Refer to the [Add a Backup Location using Dynamic Credentials](/clusters/cluster-management/backup-restore/add-backup-location-dynamic) guide. 


# Instructions

Use the following instructions in Palette to restore a backup to a destination cluster. 

<br />

1. Log in to [Palette](https://console.spectrocloud.com/).


2. Navigate to the left **Main Menu** and click on **Clusters**. 


3. Select the source cluster to view its details page.


4. Navigate to the **Backups** tab and click on the **Backups** in the nested tabs. A list of available backups are displayed.



5. Select a backup you want to restore from the list.


6. Click on the **Restore Backup** button at the bottom, as highlighted in the screenshot below. 

  <br />


  ![A screenshot highlighting the details of a specific backup.](/clusters_cluster-management_backup-restore_restore.png)



7. In the restore operation wizard, select the destination cluster where you want to restore the backup. For example, you can select the current or a different cluster. You can initiate a restore operation on any destination cluster in the same project as the source cluster. A backup does not store infrastructure-related information, such as, the node pools and configuration. Therefore, the destination cluster can have a different infrastructure provider than the source cluster. 

  You have the option to include specific namespaces, Persistent Volumes (PVs) and cluster-scoped resources.

  ![A screenshot highlighting the restore operation configurations.](/clusters_cluster-management_backup-restore_confirm-restore.png)


8. Review the restore operation configurations, and click on the **Confirm Restore** button at the bottom. 


You now have successfully initiated a restore operation. Palette will display the status of the restore operation in the **Restores** nested tab. You can navigate to the **Events** tab to view the logs for the restore operation.



# Validate

Use the following steps to validate the restoring a cluster backup.
<br />

1. Log in to [Palette](https://console.spectrocloud.com/).


2. Navigate to the left **Main Menu** and select **Clusters**. 


3. Select the destination cluster you initiated a backup restore operation. 


4. In the cluster details **Overview** tab, take note of the cluster's **Last Modified** field. The cluster's last modified timestamp will be updated to the time when you initiated the restore operation. 


5. Navigate to the **Backups** tab and click on the **Restores** nested tab. Palette displays the status, restoration timestamp, the source cluster, and the backup name for each restore operation you performed for the current cluster. The screenshot below highlights an example restore operation. 

  <br />

  ![A screenshot highlighting the restoration status for the destination cluster.](/clusters_cluster-management_backup-restore_verify-restore.png)

  You restored the backup successfully when the backup status displays *Completed*.

  <br />

  <InfoBox>

  Remember, a backup does not include the cluster profile of the source cluster. Therefore, the restore operation will not change the cluster profile of the destination cluster.

  </InfoBox>


6. To review the backup logs, navigate to the **Events** tab. 


7. Examine the logs. Each log contains a status message. When the restoration is completed, you will notice all the namespace-scoped resources contain your desired backed-up data.