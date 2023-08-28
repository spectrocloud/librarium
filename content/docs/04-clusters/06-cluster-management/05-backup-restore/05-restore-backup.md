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

This how-to guide provides instructions to restore a backup to a cluster in Palette. You can restore a backup to the same cluster from where you created it or to a different cluster within the same project. For simplicity, this guide uses the following terminology while referencing the clusters:
<br />

- *Source cluster* - The cluster from where you created the backup.


- *Destination cluster* - The cluster where you want to restore the backup


A restore operation will only restore the specified namespaces, cluster resources, and persistent volumes from the backup. Refer to the [Restore Reference](https://velero.io/docs/main/restore-reference) documentation by Velero to learn more about the restore workflow and the default restore order.

The following sections will outline the prerequisites and the steps to restore a backup to a destination cluster in Palette. 


# Prerequisites

- The source cluster. You can use the following steps to review the list of available clusters in Palette:
  - Log in to [Palette](https://console.spectrocloud.com/).
  - Verify you are in the desired project scope. 
  - Navigate to the left **Main Menu**, and click on the **Clusters** menu item. Palette will display the list of available clusters. 

  <br />

  <WarningBox>

  If the source cluster is unavailable in Palette, you cannot restore its backup. 

  </WarningBox>


- A backup created for the source cluster. Refer to the [Create a Cluster Backup](/clusters/cluster-management/backup-restore/create-backup) guide to learn about creating a backup. 


- A destination cluster. The destination cluster must belong to the same project as the source cluster. 


- Ensure that the destination cluster has a default [storage class](https://kubernetes.io/docs/concepts/storage/storage-classes/). A storage class is a Kubernetes resource that helps provision persistent volumes dynamically. When you restore a backup with persistent volumes, you will need the storage class. 

  You can review the cluster profile's storage layer and check for the storage class. Otherwise, if you are connected to your cluster via [kubectl](/clusters/cluster-management/palette-webctl), you can execute the following command to get the list of storage classes. <br /> <br />

  ```bash
  kubectl get storageclasses -A
  ```

  The default storage class in Palette-managed clusters is the `spectro-storage-class`. 



- If the destination cluster is an AWS EKS cluster, ensure the storage class type is `gp2`. 


- If the backup location is configured using the Security Token Service (STS) authentication method, ensure to define a trust relationship with the destination cluster. The trust relationship will allow the destination cluster to assume the necessary IAM role to access the backup files. You can define a trust relationship for your destination cluster similar to the one explained in the [Add a Backup Location using Security Token Service](/clusters/cluster-management/backup-restore/add-backup-location-sts) guide. 


# Instructions
Use the following instructions in Palette to restore a backup to a destination cluster. 
<br />

1. Log in to [Palette](https://console.spectrocloud.com/).


2. Navigate to the left **Main Menu**, and click on the **Clusters** menu item. 


3. Select the source cluster to view its details.


4. Navigate to the **Backups** tab and click on the **Backups** in the nested tabs. Palette will display a list of all available backups for the current cluster in the  **Backups** nested tab. The list will display both the scheduled and on-demand backups. 


5. Click on a particular backup you want to restore from the list. Palette will display the backup name, status, creation date, expiry date, list of backed-up namespaces, and a boolean field indicating whether the backup includes all disks and cluster resources.  


6. Click on the **Restore Backup** button at the bottom, as highlighted in the screenshot below. Palette will open a wizard for the restore operation. <br /> <br />

  ![A screenshot highlighting the details of a specific backup.](/clusters_cluster-management_backup-restore_restore.png)



7. In the restore operation wizard, select the destination cluster where you want to restore the backup. For example, you can select the current or a different cluster if desired. You can initiate a restore operation on any destination cluster in the same project as the source cluster. 

  A backup does not store infrastructure-related information, such as, the node pools and configuration. Therefore, the destination cluster can have a different infrastructure provider than the source cluster. 

  In addition, select the namespaces you want to restore. You can also select all persistent volumes (PVs) and cluster resources, as highlighted in the example screenshot below.

  ![A screenshot highlighting the restore operation configurations.](/clusters_cluster-management_backup-restore_confirm-restore.png)


8. Review the restore operation configurations, and click on the **Confirm Restore** button at the bottom. 



# Validate

You can follow the steps below to validate restoring a backup in Palette.
<br />

1. Navigate to the left **Main Menu**, and click on the **Clusters** menu item. 


2. Select the destination cluster you restored. You will land on the cluster's **Overview** tab. Palette will display the details of the selected cluster. 


3. Notice the cluster's **Last Modified** field. It will display the timestamp when the cluster is last modified. 


4. Navigate to the **Backups** > **Restores** tab. Palette will display the status, restoration timestamp, the source cluster, and the backup name for each restore operation you performed for the current cluster. The screenshot below highlights an example restore operation.  

  ![A screenshot highlighting the restoration status for the destination cluster.](/clusters_cluster-management_backup-restore_verify-restore.png)

  You restored the backup successfully when the backup status displays *Completed*.
  <br />
  <InfoBox>

  Remember, a backup does not back up the source cluster profile. Therefore, the restore operation will not include the source cluster profile either.

  </InfoBox>
  <br />


5. We encourage you to review the logs to understand the restore events better. To review the logs, navigate to the **Events** tab. 


6. Examine the logs. Each log will display the verbose status message. When the restoration is completed, you will notice all the cluster resources and the persistent volumes contain your desired backed-up data. 

  Alternatively, if you are connected to the cluster, you can print the logs on the console using utilities like [kubectl](/clusters/cluster-management/palette-webctl) or [Kubernetes dashboard](/integrations/kubernetes-dashboard). 