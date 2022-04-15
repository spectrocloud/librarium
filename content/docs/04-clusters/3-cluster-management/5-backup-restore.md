---
title: "BackUp and Restore"
metaTitle: "Managing Cluster Update Events on Palette"
metaDescription: "Events and Notifications on Cluster Updates"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview

Palette provides two ways to back up and restore Kubernetes clusters:

* Cluster Backup and Restore for a single cluster which is managed from within the cluster.
* [Workspace](/workspace) Backup and Restore for multiple clusters managed from workspaces.

# Cluster Backup and Restore

Palette provides a convenient backup option to back up the Kubernetes cluster state into object storage and restores it at a later point in time if required to the same or a different cluster. Besides backing up Kubernetes native objects such as Pods, DaemonSets, and Services, persistent volumes can also be snapshotted and maintained as part of the Backup. Internally, Palette leverages an open-source tool called Velero to provide these capabilities. In addition, multiple backups of a cluster can be maintained simultaneously.

# Workspace Backup and Restore

Palette users can create cluster backups from within a workspace (usually consisting of multiple clusters) and restore them later time as desired. Palette allows granular controls within a workspace for users to perform specific tasks within the workspace, without having the ability to update workspace details. In order to provide granular access within a workspace for specific actions, Palette provides the following two roles:

## Workspace Operator

Users assigned the `workspace operator` role can only perform back and restore actions within the workspace.

## Workspace Admin

A role that has all admin permissions and privileges within the workspace.

## Create your Workspace Roles

To create your workspace role, follow the steps below:

1. Login to Palette management console as Tenant Admin.


2. Go to the **Users and Teams** option.


3. From the listed users, select the user to be assigned with workspace roles. See here for [User Creation](/projects/#projects).


4. Select the **Workspace Roles** tab and click **+ New Workspace Role** to create a new role.


5. Fill the following information into the **Add Roles to User-Name** wizard:
   * Project
   * Workspace
   * Choose the role from the options:
      * Workspace Admin
      * Workspace Operator


6. Confirm the information provided to complete the wizard.


7. The user set with the Workspace role can take Workspace-wide backup and Restores in compliance with their permissions and privileges.

# Prerequisites

## For AWS Bucket as Backup Location

* The AWS S3 permissions listed in the next section need to be configured in the AWS account to provision Backup through Palette.

* Pre-created bucket at the AWS or MinIO object-store.

## For GCP Backup Location

* GCP service account with a `storage admin` role.

* Pre-created bucket at the GCP object storage.

# Backup Locations

Creating the backup location is identical for both cluster and workspace backup. AWS S3 and other S3 compliant object stores such as MinIO and GCP Buckets are currently supported as backup locations. These locations can be configured and managed under the **Project** > **Settings** option and can be selected as a backup location, while backing up any cluster in the project.

## Configure your Backup in AWS S3 

The following details are required to configure a backup location in AWS:

1. **Location Name**: Name of your choice.


2. **Location Provider**: AWS (This is currently the only choice on the UI. Choose this option when backing up to AWS S3 or any S3 compliance object store).


3. **Certificate**: Required for MinIO.


4. **S3 Bucket**: S3 bucket name must be pre-created on the object-store.


5. **Configuration**: region={region-name},s3ForcePathStyle={true/false},s3Url={S3 URL}. S3 URL need not be provided for AWS S3.


6. **Account Information** - Details of the account which hosts the S3 bucket to be specified as Credentials or STS.
     * Credentials - Provide access key and secret key.
     * STS - Provide the ARN and External ID of the IAM role that has permission to perform all S3 operations. The STS role provided in the backup location should have a trust set up with the account used to launch the cluster itself and should have the permission to assume the role.


7. Palette mandates the AWS S3 Permissions while users use the static role to provision worker nodes.

#### AWS S3 Permissions

    ```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": [
                    "ec2:DescribeVolumes",
                    "ec2:DescribeSnapshots",
                    "ec2:CreateTags",
                    "ec2:CreateVolume",
                    "ec2:CreateSnapshot",
                    "ec2:DeleteSnapshot"
                ],
                "Resource": "*"
            },
            {
                "Effect": "Allow",
                "Action": [
                    "s3:GetObject",
                    "s3:DeleteObject",
                    "s3:PutObject",
                    "s3:AbortMultipartUpload",
                    "s3:ListMultipartUploadParts"
                ],
                "Resource": [
                    "arn:aws:s3:::${BUCKET}/*"
                ]
            },
            {
                "Effect": "Allow",
                "Action": [
                    "s3:ListBucket"
                ],
                "Resource": [
                    "arn:aws:s3:::${BUCKET}"
                ]
            }
        ]
    }
     
    ```

#### Trust Setup Example

    ```json
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Principal": {
            "AWS": "arn:aws:iam::141912899XX99:root"
          },
          "Action": "sts:AssumeRole",
          "Condition": {}
        }
      ]
    }
    ```

## Configure your Backup in GCP Bucket

These locations can be configured and managed from the 'Settings' option under 'Project' and can be selected as a backup location while backing up any cluster in the project.

The following details are required to configure a backup location in GCP:

1. **Location Name**: Name of your choice.


2. **Location Provider**: Google Cloud (Choose this option when backing up to the GCP bucket object store).


3. **Bucket**: The name of the bucket name pre-created on the object store.


4. **JSON Credentials**: For external authentication of the GCP storage.


## Add a Backup Location

Go to **Project Settings** > **Backup locations** > **Add a New Backup location**.

# Create a Backup

The below section will describe:

* Create a Cluster Backup
* Create a Workspace Backup

## Create a Cluster Backup

Backups can be scheduled or initiated in an on demand basis during cluster creation as well as can be scheduled for a running cluster. The following information is required for configuring a cluster backup:

1. **Backup Prefix / Backup Name**:
  * For scheduled backup, a name will be generated internally, add a prefix of our choice to append with the generated name.
  * For an on demand backup, a name of user choice can be used.


2. Select the backup location.


3. **Backup Schedule**: Create a backup schedule of your choice from the drop-down, applicable only to scheduled backups.


4. **Expiry Date**: Select an expiry date for the backups. The backup will be automatically removed on the expiry date.


5. **Include all disks**: Optionally backup persistent disks as part of the backup.


6. **Include Cluster Resources**: Select or deselect on your choice.


7. **Namespaces**: Provide namespaces that need to be backed up. If left empty then all the Namespaces will be backed up.

|On Demand Backup   |
|-------------------|
|Select the cluster from **Backup** > **Settings** > **Cluster Settings** > **Schedule Backups**|

|Scheduled Backup |
|-----------------|
|**Cluster Creation** > **Policies** > **Backup Policies**|

## Create a Workspace Backup

Backups can be scheduled or initiated in an on demand basis, during the workspace creation. The following information is required for configuring a Workspace Backup, on demand:

1. Backup Prefix / Backup Name: For scheduled backup, a name will be generated internally, add a prefix of our choice to append with the generated name. For an on demand backup, a name of user choice can be used.


2. Select the backup location.


3. **Backup Schedule**: Create a backup schedule of your choice from the drop-down, applicable only to scheduled backups.


4. **Expiry Date**: Select an expiry date for the backups. The backup will be automatically removed on the expiry date.


5. **Include all disks**: Optionally backup persistent disks as part of the backup.


6. **Include Cluster Resources**: Select or deselect on your choice.


|On Demand Backup   |
|-------------------|
|Select the **Workspace to Backup** > **Settings** > **Schedule Backups**|


|Scheduled Backup |
|-----------------|
|**Workspace Creation** > **Policies** > **Backup Policies**|


### Backup Scheduling Options

Both the cluster and workspace backup support the following scheduling options:

* Customize your backup for the exact month, day, hour, and minute of the user's choice
* Every week on Sunday at midnight
* Every two weeks at midnight
* Every month on the 1st at midnight
* Every two months on the 1st at midnight

# Restore a Backup

Backups created manually or as part of the schedule are listed under the Backup/Restore page of the cluster. 

1. Restore operation can be initiated by selecting the restore option for a specific backup. 


1. Next, you would be prompted to select a target cluster where you would like the backup to be restored. The progress of the restore operation can be tracked from the target cluster's backup/restore page. 


1. Finally, restore operation can be done to the cluster running on the same project.

<WarningBox>
Some manual steps might be required, when restoring backups to a cluster running on a cloud different from the source cluster. For example, you might need to pre-create a storage class on the cluster before initiating restore procedures:
  For EKS, please specify <b>gp2 storage class</b>.
  For other cloud environments, please specify <b>spectro-storage-class<b/>.
</WarningBox>

<WarningBox>
When restoring your backup to a cluster launched using a cloud account different from the one used for the source account, permissions need to be granted before restoration is initiated to the new cluster.  
</WarningBox>

<InfoBox>
    This operation can be performed on all cluster types across all clouds.
</InfoBox>
