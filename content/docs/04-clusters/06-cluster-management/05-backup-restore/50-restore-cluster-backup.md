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


Before you restore a backup, an important consideration is regarding the storage classes in the destination cluster. The following section will provide more details. 
<br />

## Storage Class

A [storage class](https://kubernetes.io/docs/concepts/storage/storage-classes/) is a Kubernetes resource that helps provision persistent volumes dynamically. In the case of a restore, you will need the storage classes in the destination cluster when you restore a backup with persistent volumes. It is necessary to have the storage classes in the destination cluster match the storage classes in the source cluster. 
<br />

### Default Storage Class
When you create a cluster profile, Palette *usually* creates a storage class, `spectro-storage-class`, by default. In some cases, Palette does not create a storage class by default. Such scenarios arise when you create a cluster profile for specific cloud providers' managed Kubernetes service. For example, when you create a cluster profile for GCP GKE using the  [GKE Managed GCE Persistent Disk Driver](https://docs.spectrocloud.com/integrations/gce) storage pack, Palette will not create a storage class by default. In such cases, you can define a custom storage class in the cluster profile or create one after deploying the cluster. 

<br />

### Identify Storage Classes
Below are the different methods to identify the storage classes of your source and destination clusters. 
<br />

- You can review the cluster profile's storage layer manifest. If the storage layer manifest defines the storage classes, you will find them within the `storageClasses` attribute, as the code snippet below highlights. <br /> <br />

  ```yaml
  storageClasses: 
    # Default Storage Class
      - name: spectro-storage-class
      # annotation metadata
        annotations:
          storageclass.kubernetes.io/is-default-class: "true"
          # EBS volume type: io1, io2, gp2, gp3, sc1, st1, standard
          type: "gp2"
      # Additional Storage Class 
      # - name: addon-storage-class
  ```


- If you are connected to your cluster via [kubectl](/clusters/cluster-management/palette-webctl) and your cluster is active. In that case, you can execute the following command to get the list of storage classes. <br /> <br />

  ```bash
  kubectl get storageclasses -A
  ```

<br />

### Create Storage Classes
If there is a mismatch between the storage classes in the destination cluster and the source cluster, create the required new storage classes in the destination cluster. To define a new storage class in the destination cluster, you'll need to define a [StorageClass resource](https://kubernetes.io/docs/concepts/storage/storage-classes/#the-storageclass-resource) manifest and apply it using the kubectl. Another way is to define the storage classes in the cluster profile and apply the updates to the cluster before initiating a restore.  
<br />

A restore operation will only restore the specified namespaces, cluster-scoped resources, and persistent volumes from the backup. Refer to the [Restore Reference](https://velero.io/docs/main/restore-reference) documentation by Velero to learn more about the restore workflow and the default restore order. The following sections will outline the prerequisites and the steps to restore a backup.

# Prerequisites

- The source cluster is available in Palette. 
  <br />

  <WarningBox>

  If the source cluster is unavailable in Palette, you cannot restore its backup. 

  </WarningBox>


- A destination cluster is available in Palette. The destination cluster must belong to the same project as the source cluster. 


- A backup is created for the source cluster. Refer to the [Create Cluster Backup](/clusters/cluster-management/backup-restore/create-cluster-backup) guide to learn about creating a backup. 


- Ensure the storage classes in the destination cluster match the storage classes in the source cluster. 


- If the backup location is configured using the dynamic credentials, such as AWS Security Token Service (STS) authentication method, ensure you define a trust relationship with the destination cluster. The trust relationship enables the destination cluster to assume the necessary IAM role to access the backup files. Refer to the [Add a Backup Location using Dynamic Credentials](/clusters/cluster-management/backup-restore/add-backup-location-dynamic) guide. 


# Instructions
Use the following instructions in Palette to restore a backup to a destination cluster. 
<br />

1. Log in to [Palette](https://console.spectrocloud.com/).


2. Navigate to the left **Main Menu**, and click on **Clusters**. 


3. Select the source cluster to view its details page.


4. Navigate to the **Backups** tab and click on the **Backups** in the nested tabs. Palette will display a list of all available backups for the current cluster in the **Backups** nested tab. The list will display both the scheduled and on-demand backups. 


5. Select a backup you want to restore from the list. Palette will display the backup name, status, creation date, expiry date, list of backed-up namespaces, and a boolean field indicating whether the backup includes all disks and cluster-scoped resources.  


6. Click on the **Restore Backup** button at the bottom, as highlighted in the screenshot below. Palette will open a wizard for the restore operation. <br /> <br />

  ![A screenshot highlighting the details of a specific backup.](/clusters_cluster-management_backup-restore_restore.png)



7. In the restore operation wizard, select the destination cluster where you want to restore the backup. For example, you can select the current or a different cluster if desired. You can initiate a restore operation on any destination cluster in the same project as the source cluster. A backup does not store infrastructure-related information, such as, the node pools and configuration. Therefore, the destination cluster can have a different infrastructure provider than the source cluster. 

  In addition, select the namespaces you want to restore. You can also select all Persistent Volumes (PVs) and cluster-scoped resources to include in the restore, as highlighted in the example screenshot below.

  ![A screenshot highlighting the restore operation configurations.](/clusters_cluster-management_backup-restore_confirm-restore.png)


8. Review the restore operation configurations, and click on the **Confirm Restore** button at the bottom. This step completes restoring a cluster backup.



# Validate

Use the following steps to validate the restoring a cluster backup.
<br />

1. Log in to [Palette](https://console.spectrocloud.com/).


2. Navigate to the left **Main Menu**, and select **Clusters**. 


3. Select the destination cluster you restored. You will land on the cluster's **Overview** tab. Palette will display the details of the selected cluster. 


4. In the  **Overview** tab, notice the cluster's **Last Modified** field. It will display the timestamp when the cluster is last modified. 


5. Navigate to the **Backups** tab and click on the **Restores** nested tab. Palette will display the status, restoration timestamp, the source cluster, and the backup name for each restore operation you performed for the current cluster. The screenshot below highlights an example restore operation.  

  ![A screenshot highlighting the restoration status for the destination cluster.](/clusters_cluster-management_backup-restore_verify-restore.png)

  You restored the backup successfully when the backup status displays *Completed*.
  <br />
  <InfoBox>

  Remember, a backup does not includes the cluster profile of the source cluster. Therefore, the restore operation will not change the cluster profile of the destination cluster.

  </InfoBox>
  <br />


6. To review the backup logs, navigate to the **Events** tab. 


7. Examine the logs. Each log contains a status message. When the restoration is completed, you will notice all the namespace-scoped resources contain your desired backed-up data. 

  Alternatively, if you are connected to the cluster, you can print the logs on the console using utilities like [kubectl](/clusters/cluster-management/palette-webctl) or [Kubernetes dashboard](/integrations/kubernetes-dashboard). 