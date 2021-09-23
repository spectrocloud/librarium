---
title: "Enterprise Cluster Management"
metaTitle: "System Console Dashboard"
metaDescription: " Features to enhance the enterprise clusters"
icon: ""
hideToC: false
fullWidth: false
---

import InfoBox from '@librarium/shared/src/components/InfoBox';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import PointsOfInterest from '@librarium/shared/src/components/common/PointOfInterest';
import Tooltip from "@librarium/shared/src/components/ui/Tooltip";



# Backup and Restore for Enterprise Clusters

Spectro Cloud provides convenient backup options to backup the Enterprise Kubernetes cluster state into object storage. It restores it at a later point in time if required to the same or a different cluster. Besides backing up Kubernetes native objects like Pods, DaemonSets, Services, etc., snapshot of persistent volumes is taken and maintained as part of the backup. The two options of backup creation are:
* FTP
* S3

FTP mode backup is sending the backup data of your enterprise cluster to a dedicated FTP server using the File Transfer Protocol (FTP).

S3 buckets for backup make it trivial for everyone to use Amazon’s infrastructure for remote backups and secure cluster objects online. In addition, this feature provides the advantages of scheduling, strong encryption, compression, easy access to your back-up files. 

## Instructions

* Login to your enterprise mode as administrator

  * https://system_IP/system
  * Username: admin
  * Password: custom password
* Select administration from left panel
* On the administration page, select Backup /Restore from the top ribbon
* Complete the Backup configuration wizard to complete the mode of backup creation
* Select the mode of backup from the two available option - FTP and S3
### FTP

The following information are filled to create a backup location in FTP mode
* ftp:// server details
* The directory name for the backup storage
* Username and Password to login to the server
* Scheduling details of the backup
	* Interval is specifying the number of days between two consecutive backups
	* Retention period for backup in days
	* Hours of the day (UTC 0 to 23 hours) specifying the time of the specified day to take the backup
* This configuration is saved and used for creating an FTP backup by clicking the +create FTP backup button on the top right corner of the page
* The configuration can be edited as per requirements
* Delete / Restore a specific backup from the actions panel

<InfoBox>
The saved configuration details can be used to create multiple backup locations. 
Any changes can be made to the existing configuration and saved for reuse. 
</InfoBox>

### S3 Backup Location

<WarningBox>

An AWS S3 bucket created is a prerequisite.

The following permissions needs to be enabled.

</WarningBox>

#### Permission Sets

|On EC2|
|------|
|DescribeVolumes|
|DescribeSnapshots|
|CreateTags|
|CreateVolume|
|CreateSnapshot|
|DeleteSnapshot|


|On S3|
|---------|
|GetObject|
|DeleteObject|
|PutObject|
|AbortMultipartUpload|
|ListMultipartUploadParts|
|ListBucket|

The following information are needed
* AWS Account Access key
* AWS Account Secret Key
* AWS Region
* AWS Bucket name
* Folder name to which the back up is stored in the S3 bucket
* Scheduling details of the backup,
	* Interval specifies the number of days between two consecutive backups
	* Retention period of backup in days
	* Hours of the day (UTC 0 to 23 hours) specifies the time of the specified day to take the backup
* Validate the information and save the configurations
* The saved configuration is used for creating an S3 backup by clicking the +create S3 backup button on the top right corner of the page
* Once the backup is created, the details such as backup uid, mode, status, finish time, and actions is viewed from the console for individual backup
* Delete / Restore a specific backup from the actions panel 

<InfoBox>
The saved configuration details can be used to create multiple backup locations. Any changes can be made to the existing configuration and saved for reuse. 
</InfoBox>
