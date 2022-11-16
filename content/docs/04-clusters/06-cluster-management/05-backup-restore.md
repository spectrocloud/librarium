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
* [Workspace](/workspace/workload-features#workspaceoperator) Backup and Restore for multiple clusters managed from workspaces.

# Cluster Backup and Restore

Palette provides a convenient backup option to back up the Kubernetes cluster state into object storage and restores it at a later point in time if required to the same or a different cluster. Besides backing up Kubernetes native objects such as Pods, DaemonSets, and Services, persistent volumes can also be snapshotted and maintained as part of the Backup. Internally, Palette leverages an open-source tool called Velero to provide these capabilities. In addition, multiple backups of a cluster can be maintained simultaneously.

Palette leverages the BackUps to the following locations:

<br />

#### Amazon Web Services (AWS) S3 Buckets: [Prerequisites](/clusters/cluster-management/backup-restore#foranamazonwebservices(aws)bucketasbackuplocation), [Configure your Backup](/clusters/cluster-management/backup-restore#configureyourbackupinawss3)

#### Google Cloud Platform (GCP) Buckets: [Prerequisites](/clusters/cluster-management/backup-restore#foragooglecloudplatform(gcp)backuplocation), [Configure your Backup](/clusters/cluster-management/backup-restore#configureyourbackupingcpbucket)

#### MinIO S3 Buckets: [Prerequisites](/clusters/cluster-management/backup-restore#forminios3backup), [Configure your Backup](/clusters/cluster-management/backup-restore#configureyourbackupinminio)

#### Azure Blob:[Prerequisites](/clusters/cluster-management/backup-restore#forazureblobbackup),[Configure your Backup](/clusters/cluster-management/backup-restore#configureyourbackupinazure:azureblob)

# Prerequisites

## For an Amazon Web Services (AWS) Bucket as Backup Location

* The Amazon Simple Storage Service (S3) permissions listed in the next section need to be configured in the AWS account to provision Backup through Palette.

* Pre-created bucket at the AWS Console.

## For a Google Cloud Platform (GCP) Backup Location

* GCP service account with a `storage admin` role.

* Pre-created bucket at the GCP object storage.

## For MinIO S3 Backup

* S3 bucket with Read/Write Access

* A unique access key (username) and corresponding secret key (password) from MinIO Console. 

* Service provider certificate (Optional)

## For Azure Blob Backup

* An active Azure cloud account with the following pieces of information noted down:
  * Tenant Id
  * Client Id
  * Subscription Id
  * Client Secret created


* An [Azure storage account](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-create?tabs=azure-portal) created with the following information to be noted down for Palette use:
  * Storage Name: Custom name given to the Azure storage created.
  * Stock-keeping unit


* A container to be created in the Azure Storage account

# Backup Locations

Creating the backup location is identical for both cluster and workspace backup. AWS S3 and other S3 compliant object stores such as MinIO and GCP Buckets are currently supported as backup locations. These locations can be configured and managed under the **Project** > **Settings** option and can be selected as a backup location, while backing up any cluster in the project.

## Configure your Backup in AWS S3 

The following details are required to configure a backup location in AWS:

1. **Location Name**: Name of your choice.


2. **Location Provider**: AWS


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
                    "arn:aws:s3:::BUCKET-NAME/*"
                ]
            },
            {
                "Effect": "Allow",
                "Action": [
                    "s3:ListBucket"
                ],
                "Resource": [
                    "arn:aws:s3:::BUCKET-NAME"
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


5. Click Create to complete the location creation wizard.

## Configure your Backup in MinIO

The following details are required to configure a backup location in MinIO:

1. **Location Name**: Name of your choice.


2. **Location Provider**: Minio


3. **Certificate**: Optionally required for MinIO.


4. **S3 Bucket**: S3 bucket name must be pre-created on the MinIO object-store.


5. **Region**: Region in which Minio server is configured. Example: us-east-1


6. **S3 URL**: Url of the MinIO object storage console. Example: `http://12.123.234.567:0000'


7. **Force S3 path style** : To force S3 path style addressing or else the url will be converted to virtual-hosted style addressing with bucket name appended to the url.This is an optional setting.


8. Provide the MiniIO unique **Access Key** and **Secret Key**. An unique access key (username) and corresponding secret key (password) can be obtained for every MinIO user account from MinIO console.


9. Click **Create** to complete the location creation wizard. 


## Configure your Backup in Azure: Azure Blob

The following details are required to configure a backup location in Azure:

1. **Location Name**: A custom name for the storage location getting created.


2. **Location Provider:** Select **Azure** from the drop-down.


3. **Container Name:** The container created in Azure Storage.


4. **Storage Name**: Name of the Azure storage created.


5. **Stock-Keeping Unit**: Information from the Azure storage.


6. **Resource Group:** Azure Resource Group name


7. **Tenant ID:** Azure Account Credential.


8. **Client ID:** Azure Account Credential.


9. **Subscription ID**: Azure Account Credential.


10. **Client Secret:** Secret created in the Azure console needs to be validated.


11. Click **Create** to complete the location creation wizard.


## Add a Backup Location

Go to **Project Settings** > **Backup locations** > **Add a New Backup location**.


## Create a Cluster Backup

Backups can be scheduled or initiated in an on-demand basis during cluster creation as well as can be scheduled for a running cluster. The following information is required for configuring a cluster backup:

1. **Backup Prefix / Backup Name**:
  * For scheduled backup, a name will be generated internally, add a prefix of our choice to append with the generated name.
  * For an on demand Backup, a name of user choice can be used.


2. Select the **Backup location**.


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


2. Next, you would be prompted to select a target cluster where you would like the backup to be restored. The progress of the restore operation can be tracked from the target cluster's backup/restore page. 


3. Finally, restore operation can be done to the cluster running on the same project.


<WarningBox>
Some manual steps might be required, when restoring backups to a cluster running on a cloud different from the source cluster. For example, you might need to pre-create a storage class on the cluster before initiating restore procedures:
  For EKS, please specify <b>gp2 storage class</b>.
  For other cloud environments, please specify <b>spectro-storage-class</b>.
</WarningBox>

<WarningBox>
When restoring your backup to a cluster launched using a cloud account different from the one used for the source account, permissions need to be granted before restoration is initiated to the new cluster.  
</WarningBox>

<InfoBox>
    This operation can be performed on all cluster types across all clouds.
</InfoBox>
