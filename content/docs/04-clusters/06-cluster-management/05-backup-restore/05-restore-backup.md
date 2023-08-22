---
title: "Restore a Cluster Backup"
metaTitle: "Restore a Cluster Backup"
metaDescription: "Restore a Cluster Backup"
hideToC: false
fullWidth: false
---

import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

# Restore a Cluster Backup

This how-to guide provides instructions to restore a backup to a target cluster in Palette. 
A target cluster is the one where you want to restore the backup. 
An originating cluster is the one from where you created the backup.
You can restore a backup to any cluster, the originating or the target cluster, provided both the following conditions are met:
<br />

1. The originating cluster is still available in Palette. 


2. The target cluster must belong to the same project as the originating cluster. 


The following sections will describe the prerequisites and the steps to restore a backup to a target cluster in Palette. You can refer to the [Cluster Backup and Restore](/clusters/cluster-management/backup-restore) guide to learn about the fundamentals of backup and restore. 


# Prerequisites

- A backup location added for the current project in Palette. Refer to the [Add a Backup Location](/clusters/cluster-management/backup-restore/add-backup-location) guide to learn about adding a backup location. 


- A backup created in the current project in Palette. Refer to the [Create a Cluster Backup](/clusters/cluster-management/backup-restore/create-backup) guide to learn about creating a backup. 


# Instructions
Use the following instructions in Palette to restore a backup to a target cluster. 
<br />

1. Log in to [Palette](https://console.spectrocloud.com/).


2. Navigate to the left **Main Menu**, and click on the **Clusters** menu item. 


3. Select the specific cluster to view its details. It should be the originating cluster for which you created the backup. 


4. Navigate to the **Backups** tab and click on the **Backups** in the nested tabs. Palette will display a list of all available backups for the current cluster in the  **Backups** nested tab. The list will display both the scheduled and on-demand backups. 


5. Click on a particular backup you want to restore from the list. Palette will display the backup name, status, creation date, expiry date, list of backed-up namespaces, and a boolean field indicating whether the backup includes all disks and cluster resources.  


6. Click on the **Restore Backup** button at the bottom, as highlighted in the screenshot below. Palette will open a wizard for the restore operation. 

  ![A screenshot highlighting the details of a specific backup.](/clusters_cluster-management_backup-restore_restore.png)



7. In the restore operation wizard, select the target cluster where you want the backup to be restored. For example, you can select the current or a different cluster if desired. You can initiate a restore operation on any target cluster in the same project as the originating cluster. A backup does not store infrastructure-related information, like the node pools and their configuration. Therefore, the target cluster can have a different infrastructure provider as compared to the originating cluster.   <br /> <br />

	<WarningBox>

	Suppose the target cluster is deployed in a different cloud account than the backup location. In that case, you must pre-create a storage class on the target cluster before initiating the restore operation. While creating a storage class for the target cluster on EKS,  specify **gp2 storage class**. Whereas for all other cloud environments, specify **spectro-storage-class**. In addition, you must ensure that the backup location has authorized	the target cloud account using the necessary IAM permissions to access the backup files. 

	</WarningBox>


8. Review and confirm the restore operation, and click on the **Restore** button. 


9. To track the restoration progress, navigate to the target cluster. Palette will display the restoration progress in the **Backups** > **Restores** tab. 


# Validate

You can follow the steps outlined below to validate restoring a backup.
<br />

1. Switch to Palette.


2. Select the specific project scope from the **drop-down Menu** at the top-left corner. You must select the project scope to which the target cluster belongs.


3. Navigate to the left **Main Menu**, and click on the **Clusters** menu item. 


4. Select the target cluster you restored. You will land on the cluster's **Overview** tab. Palette will display the details of the selected cluster. 


5. Notice the cluster's **Last Modified** field. It will display the timestamp when the cluster is last modified. 


6. Navigate to the **Events** tab to view the logs. 


7. Examine the logs. The restoration is complete when you notice all the resources and the volumes contain your desired backed-up data. Alternatively, if you are connected to the cluster, you can print the logs on the console using utilities like kubectl or k8s dashboard. This step validates that you have successfully restored the backup to the target cluster. 