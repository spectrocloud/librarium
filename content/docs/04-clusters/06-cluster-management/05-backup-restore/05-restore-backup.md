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

This how-to guide provides instructions to restore a backup to a cluster in Palette. You can restore a backup to the same cluster from where you created it or to a different cluster within the same project. 
For simplicity, this guide uses the following terminology while referencing the clusters:
<br />

- *Source cluster* - The cluster from where you created the backup.


- *Target cluster* - The cluster where you want to restore the backup

The following sections will outline the prerequisites and the steps to restore a backup to a target cluster in Palette. You can refer to the [Cluster Backup and Restore](/clusters/cluster-management/backup-restore) guide to learn about the fundamentals of backup and restore. 


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


- A target cluster. The target cluster must belong to the same project as the source cluster. 


# Instructions
Use the following instructions in Palette to restore a backup to a target cluster. 
<br />

1. Log in to [Palette](https://console.spectrocloud.com/).


2. Navigate to the left **Main Menu**, and click on the **Clusters** menu item. 


3. Select the specific cluster to view its details. It should be the source cluster for which you created the backup. 


4. Navigate to the **Backups** tab and click on the **Backups** in the nested tabs. Palette will display a list of all available backups for the current cluster in the  **Backups** nested tab. The list will display both the scheduled and on-demand backups. 


5. Click on a particular backup you want to restore from the list. Palette will display the backup name, status, creation date, expiry date, list of backed-up namespaces, and a boolean field indicating whether the backup includes all disks and cluster resources.  


6. Click on the **Restore Backup** button at the bottom, as highlighted in the screenshot below. Palette will open a wizard for the restore operation. <br /> <br />

  ![A screenshot highlighting the details of a specific backup.](/clusters_cluster-management_backup-restore_restore.png)



7. In the restore operation wizard, select the target cluster where you want to restore the backup. For example, you can select the current or a different cluster if desired. You can initiate a restore operation on any target cluster in the same project as the source cluster. 

  A backup does not store infrastructure-related information, such as, the node pools and configuration. Therefore, the target cluster can have a different infrastructure provider than the source cluster.   <br /> <br />

  <WarningBox>

  Suppose the target cluster is deployed in a different cloud account than the backup location. In that case, you must pre-create a storage class on the target cluster before initiating the restore operation. While creating a storage class for the target cluster on EKS,  specify **gp2 storage class**. Whereas for all other cloud environments, specify **spectro-storage-class**. In addition, you must ensure that the backup location has authorized	the target cloud account using the necessary IAM permissions to access the backup files. 

  </WarningBox>
  <br />

  In addition, select the namespaces you want to restore. You can also select all persistent volumes (PVs) and cluster resources, as highlighted in the example screenshot below.

  ![A screenshot highlighting the restore operation configurations.](/clusters_cluster-management_backup-restore_confirm-restore.png)


8. Review the restore operation configurations, and click on the **Confirm Restore** button at the bottom. 



# Validate

You can follow the steps below to validate restoring a backup in Palette.
<br />

1. Navigate to the left **Main Menu**, and click on the **Clusters** menu item. 


2. Select the target cluster you restored. You will land on the cluster's **Overview** tab. Palette will display the details of the selected cluster. 


3. Notice the cluster's **Last Modified** field. It will display the timestamp when the cluster is last modified. 


4. Navigate to the **Backups** > **Restores** tab. Palette will display the status, restoration timestamp, the source cluster, and the backup name for each restore operation you performed for the current cluster as the target. The screenshot below highlights an example restore operation.  

  ![A screenshot highlighting the restoration status for the target cluster.](/clusters_cluster-management_backup-restore_verify-restore.png)

  If the backup status displays *Completed*, it means the backup was successfully restored.


5. If you want to review the logs, navigate to the **Events** tab. 


6. Examine the logs. Each log will display the verbose status message. The restoration is complete when you notice all the resources and the persistent volumes contain your desired backed-up data. 

  Alternatively, if you are connected to the cluster, you can print the logs on the console using utilities like kubectl or k8s dashboard. 