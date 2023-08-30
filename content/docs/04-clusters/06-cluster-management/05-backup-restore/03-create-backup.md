---
title: "Create Cluster Backup"
metaTitle: "Create Cluster Backup"
metaDescription: "Learn how to create a cluster backup to an existing backup location."
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';



# Create a Cluster Backup

This guide provides instructions for how to create a cluster backup using Palette. You can refer to the cluster from where you create the backup as the *source cluster*. 

A backup operation will only back up specific namespaces, cluster resources, and persistent volumes from the source cluster. It does not copy the source cluster profile to the backup object. A backup operation can only back up the cluster resources defined [here](https://velero.io/docs/main/restore-reference/#restore-order). Refer to the [How Velero Works](https://velero.io/docs/main/how-velero-works/) and [Backup Reference](https://velero.io/docs/main/backup-reference/) documentation by Velero to learn more.
<br/>
<InfoBox>

A backup operation does not copy the source cluster profile to the backup object. 

</InfoBox>
<br />

You can schedule a cluster backup or initiate a backup on demand. You can define a backup schedule in the cluster configuration for an existing cluster or while deploying a cluster. Palette supports scheduling re-accruing backups, with the ability to customize the frequency and the time. You can also specify the backup expiry period, meaning the duration, after which Palette will delete the backup automatically. For example, you can schedule a backup for every week on Sunday at midnight and trigger it to expire after three months after the backup date. In addition, you can initiate a backup on demand for an existing cluster. 



The following sections will describe the prerequisites and the detailed instructions to create a cluster backup.


# Prerequisites

- A backup location added in Palette. Refer to the [Add a Backup Location](/clusters/cluster-management/backup-restore/add-backup-location) guide to learn about adding a backup location. 


# Instructions

You can create a cluster backup either on a specified schedule or on-demand. Choose the applicable use case - *Schedule a backup* or *Initiate an on-demand backup*. 
<br />

<Tabs>
<Tabs.TabPane tab="Schedule a Backup" key="schedulebackup">

<br />

1. Log in to [Palette](https://console.spectrocloud.com/).


2. Navigate to the left **Main Menu**, and select **Clusters**. 


3. Select a cluster to view its details page. It should be the cluster for which you want to schedule a backup. Ensure that the cluster status is *Healthy*. 


4. Click on the **Settings drop-down Menu** on the top right corner, and select **Cluster Settings**.


5. Next, on the **Settings Menu**, select the **Schedule Backups**. The screenshot below highlights the fields for scheduling a backup. 

	![A screenshot highlighting the fields for scheduling a backup for an existing cluster.](/clusters_cluster-management_backup-restore_scheduled-backup.png)


6. Fill out the required input fields to schedule a backup. Refer to the table to learn more about each input field.

	|**Field**|**Description**|
	|---|---|
	|**Backup prefix**|Palette will generate a name automatically. Provide a prefix string you want to prepend to the auto-generated name. |
	|**Select backup location**|Choose a backup location. You must configure a location before creating a backup. |
	|**Backup schedule**|Create a backup schedule of your choice from the **drop-down Menu**. You can review the scheduling options below the current table.|
	|**Select period until expiry**|Select an expiry duration for the backups. Palette will delete the backup after the expiry duration.|
	|**Include all disks**|Toggle this option to include all the disks in the backup.|
	|**Include cluster resources**|Your choice.|
	|**Include Namespaces** (Optional)| Palette will backup all namespaces by default. However, you can remove specific namespaces per your choice. |

	A cluster backup supports the following scheduling options:	

	* Customize your backup for the exact month, day, hour, and minute of the user's choice
	* Every week on Sunday at midnight
	* Every two weeks at midnight
	* Every month on the first at midnight
	* Every two months on the first at midnight
	* Never


7. Click on the **Save Changes** button at the bottom. 


</Tabs.TabPane>

<Tabs.TabPane tab="On-demand Backup" key="initiateondemand">

<br />


1. Log in to [Palette](https://console.spectrocloud.com/).


2. Navigate to the left **Main Menu**, and click on the **Clusters** menu item. 


3. Select the specific cluster to view its details. It should be the cluster for which you want to schedule a backup. Ensure that the cluster status shows *Healthy*. 


4. Navigate to the **Backups** tab and click on the **Create Backup** button. The screenshot below highlights a popup window that Palette will open after clicking the button. The popup windows will contain the fields for initiating an on-demand backup. <br /><br />

	![A screenshot highlighting the fields for an on-demand backup for an existing cluster.](/clusters_cluster-management_backup-restore_ondemand-backup.png)



5. Use the following information to configure a scheduled backup.

	|**Field**|**Description**|
	|---|---|
	|**Backup name**|Provide a name of your choice. |
	|**Select backup location**|Choose a backup location. You must configure a location before creating a backup. |
	|**Select period until expiry**|Select an expiry duration for the backup. The backup will be automatically removed after the expiry duration.|
	|**Include all disks**|Your choice.|
	|**Include cluster resources**|Your choice.|
	|**Include Namespaces** (Optional)| Palette will backup all namespaces by default. However, you can remove specific namespaces per your choice. |


6. Click on the **Create Backup** button at the bottom. 


</Tabs.TabPane>
</Tabs>


# Validate

You can follow the steps below to validate creating a backup in Palette.
<br />

1. Navigate to the left **Main Menu**, and click on the **Clusters** menu item. 


2. Select the cluster from where you created the backup. Palette will display the details of the selected cluster. 


3. Navigate to the **Backups** tab and click on the **Backups** nested tab. Palette will display a list of all available backups for the current cluster, including the newly created one. The screenshot below highlights an example backup. This step validates that you have successfully created the backup. 

  ![A screenshot highlighting the list of available backups for the specific cluster.](/clusters_cluster-management_backup-restore_view-backup.png)


4. You can optionally click on the newly created backup from the list to view its details. Palette will display the backup name, status, creation date, expiry date, list of backed-up namespaces, and a boolean field indicating whether the backup includes all disks and cluster resources. 
