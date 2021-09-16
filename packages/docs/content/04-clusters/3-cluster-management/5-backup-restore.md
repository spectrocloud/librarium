---
title: "BackUp and Restore"
metaTitle: "Managing Cluster Update Events on Spectro Cloud"
metaDescription: "Events and Notifications on Cluster Updates"
hideToC: false
fullWidth: false
---

import Tabs from '@librarium/shared/src/components/ui/Tabs';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import InfoBox from '@librarium/shared/src/components/InfoBox';
import PointsOfInterest from '@librarium/shared/src/components/common/PointOfInterest';




 # Backup and Restore

Spectro Cloud provides a convenient backup option to backup the Kubernetes cluster state into object storage and restores it at a later point in time if required to the same or a different cluster. Besides backing up Kubernetes native objects like Pods, DaemonSets, Services, etc, persistent volumes can also be optionally snapshotted and maintained as part of the backup. Internally, Spectro Cloud leverages an open source tool called Velero to provide these capabilities. Multiple backups of a cluster can be maintained simultaneously. 

### Backup Locations

AWS S3 and other S3 compliant object stores such as MinIO are currently supported as backup locations. These locations can be configured and managed from the 'Settings' option under 'Project' and can be selected as a backup location while backing up any cluster in the project. 

The following details are required to configure a backup location:

* Location Name: Name of your choice
* Location Provider: AWS (This is currently the only choice on the UI. Choose this option when backing up to AWS S3 or any S3 compliance object store)
* Certificate: Required for MinIO
* S3 Bucket: S3 bucket name that must be pre-created on the object store.
* Configuration: region={region-name},s3ForcePathStyle={true/false},s3Url={S3 URL}. S3 URL need not be provided for AWS S3
* Account Information - Details of the account which hosts the S3 bucket to be specified as Credentials or STS

    * Credentials - Provide access key and secret key. 
    * STS - Provide the ARN and External ID of the IAM role that has permission to perform all S3 operations. The STS role provided in the backup location should have a trust setup with the account used to launch the cluster itself and should have the permission to assume the role. 
    #### AWS S3 Permissions:

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

    #### Trust Setup Example:

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


### Create  backup

Backups can be scheduled or initiated on-demand as required. The following information is required for configuring a backup:

* Backup Prefix /Backup Name: 
	* For scheduled backup, a name will be generated internally, add a prefix of our choice to append with the generated name.
	* For On Demand backup, a name of user choice can be used.
* Select the backup location.
* Backup Schedule: Create a backup schedule of your choice from the drop-down, applicable only to scheduled backups.

* Expiry Date: Select an expiry date for the backups. The backup will be automatically removed on the expiry date. 
* Include all disks: Optionally backup persistent disks as part of the backup.
* Include Cluster Resources : Select or deselect on your choice.
* Namespaces: Provide namespaces that need to be backed up. If left empty then all the Namespaces will be backed up.


### Backup Scheduling Options:
* Customize your backup for the exact month, day, hour and minute of the user's choice.
* Every week on Sunday at midnight.
* Every two weeks at midnight.
* Every month on the 1st at midnight.
* Every two months on the 1st at midnight.

### Restore Backup

Backups created manually or as part of the schedule are listed under the Backup/Restore page of the cluster. Restore operation can be initiated by selecting the restore option for a specific backup. You would be prompted to select a target cluster where you would like the backup to be restored. The progress of the restore can be tracked from the target cluster's backup/restore page. The Restore can be done to the cluster which is running on the same project.

<WarningBox>
When restoring backups to a cluster running on a cloud that is different from the source cluster, there might be some manual steps required. As an example, you might need to pre-create a storage class on the cluster before initiating restore. This applies to the clusters which are created on EKS to other clouds or vice versa.
</WarningBox>

<WarningBox>
When restoring your backup to a cluster launched using a cloud account different from the one used for the source account, permissions need to be granted before restore is initiated to the new cluster.  
</WarningBox>


### Steps:

|Add a Backup Location|
|---------------------|
|Go to Project Settings -> Backup locations  -> Add a New Backup location|

|On Demand Backup   |
|-------------------|
|Select the cluster to Backup -> Settings -> Cluster Settings ->Schedule Backups| 


|Scheduled Backup |
|-----------------|
|Cluster Creation -> Policies -> Backup Policies|

