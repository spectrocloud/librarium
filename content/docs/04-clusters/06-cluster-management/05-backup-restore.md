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


# Cluster Backup and Restore

Palette provides two ways to back up and restore Kubernetes clusters:

* Cluster Backup and Restore for a single cluster which is managed from within the cluster.
* [Workspace](/workspace/workload-features#workspaceoperator) Backup and Restore for multiple clusters managed from workspaces.


Palette provides a convenient backup option to back up the Kubernetes cluster state into object storage and restores it at a later point in time if required to the same or a different cluster. Besides backing up Kubernetes native objects such as Pods, DaemonSets, and Services, persistent volumes can also be snapshotted and maintained as part of the Backup. Internally, Palette leverages an open-source tool called Velero to provide these capabilities. In addition, multiple backups of a cluster can be maintained simultaneously.

Palette leverages the BackUps to the following locations:
<br />

- Amazon Web Services (AWS) S3 Buckets


- Google Cloud Platform (GCP) Buckets


- MinIO S3 Buckets


- Azure Blob


This guide provides the instructions for configuring a backup location in Palette and creating and restoring a cluster backup. Creating the backup location is identical for both cluster and workspace backup. AWS S3 and other S3 compliant object stores such as MinIO and GCP Buckets are currently supported as backup locations. These locations can be configured and managed under the **Project Settings** section. You can add a new backup location by navigating to the **Project Settings** > **Backup locations**, and click on the **Add a New Backup location** button. The screenshot below highlights the wizard and configuration fields to add an AWS backup location in Palette. 

![A screenshot highlighting the wizard and configuration fields to add a backup location in Palette.](/clusters_cluster-management_backup-restore_add_aws_account.png)

Similarly, you can select MinIO, Google Cloud, or Azure as backup location providers. The following sections will outline the prerequisites and the steps to configure the backup locations in Palette. 
<br />

<Tabs>
<Tabs.TabPane tab="AWS" key="aws">

## Prerequisites

* The Amazon Simple Storage Service (S3) permissions listed in the next section need to be configured in the AWS account to provision Backup through Palette.

* Pre-created bucket at the AWS Console.

## Configure the Backup in AWS S3 Bucket

The following details are required to configure a backup location in AWS:

1. **Location Name**: Name of your choice.


2. **Location Provider**: AWS


3. **Certificate**: Required for MinIO.


4. **S3 Bucket**: S3 bucket name must be pre-created on the object-store. The bucket name must be DNS-compliant. For more information, refer to the [Bucket naming rules](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html) defined by AWS. 


5. **Region**: Region where the S3 bucket is hosted. You can check the region code from the [Service endpoints](https://docs.aws.amazon.com/general/latest/gr/s3.html#s3_region) section in the AWS documentation.


6. **S3 Url**: It is an optional field. If you choose to provide a value, refer to the [Methods for accessing a bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-bucket-intro.html#virtual-host-style-url-ex) guide to determine the bucket URL. If you provide a value for this field, select the **Force S3 path style** checkbox. 


7. **Validation Method** - You must choose a validation method to allow Palette to authenticate with your AWS account that hosts the S3 bucket for backup. In either method, you must define the following IAM policy allowing the principal to perform certain S3 and EC2 operations. Replace the `BUCKET-NAME` placeholder in the policy below with your bucket name. <br /> <br />
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

	If you choose the **Credentials** method, provide the IAM user's access key. You can use the following steps to generate an access key. <br /> <br />
	- Select an existing IAM user or create a new one. Allow the user to have programmatic access.
	- Attach or add the IAM policy you defined above to the IAM user. 
	- If you using an existing IAM user, generate the access key. If you have created a new IAM user, copy the newly generated access key. 
	- Paste the access key id and secret access key in Palette. <br /> <br />

  If you use the **STS** method, you must create a new IAM role and provide its ARN. The IAM role must have the necessary IAM permissions defined above and a trust relationship with the AWS account that hosts your clusters. 
	You can use the following steps to create the IAM role. <br /> <br />
	- Create a new IAM role in the AWS account that hosts the S3 bucket for backup. 
	- Use the following configuration while creating the IAM role. 

		|**Field**|**Value**|
		|---|---|
		|Trusted entity type|Another AWS account|
		|AWS Account ID|Use the one displayed in Palette. It is the AWS account ID where Palette is hosted.|
		|Options|Require external ID|
		|External ID|Use the one displayed in Palette. Palette generates the external ID.|
		|Permissions policies| Attach the IAM policy defined above|
		|Role name|Your choice|
		|Role description|Your choice|
		
	- Review the trusted entities and the attached permissions. 
	- Finish creating the IAM role. 
	- If Palette deploys your Kubernetes clusters in a different AWS account than that of the AWS account that hosts the S3 bucket, you must update the trust policy to define a trust relationship. The trust policy must allow the AWS account that hosts your clusters to assume the current IAM role. Append the following permission in your trust policy. <br /> <br />

		```json
			{
					"Effect": "Allow",
					"Principal": {
							"AWS": "arn:aws:iam::[YOUR-AWS-ACCOUNT-ID-WHERE-PALETTE-DEPLOYS-THE-CLUSTERS]:root"
					},
					"Action": "sts:AssumeRole"
			}
		``` 
	- You can use the following principal if you want a specific IAM role, *SpectroCloudRole*, from the AWS account that hosts your clusters to assume the current permissions. <br /> <br /> 
	
		```json
		"Principal": {
				"AWS": "arn:aws:iam::[YOUR-AWS-ACCOUNT-ID-WHERE-PALETTE-DEPLOYS-THE-CLUSTERS]:role/SpectroCloudRole"
		}
		```
	- Your trust policy will become similar to the policy defined below. It has two trust relationships, one for Palette and another for the AWS account that hosts your clusters. <br /> <br />

		```json
		{
				"Version": "2012-10-17",
				"Statement": [
						{
								"Effect": "Allow",
								"Principal": {
										"AWS": "arn:aws:iam::[AWS-ACCOUNT-WHERE-PALETTE-IS-HOSTED]:root"
								},
								"Action": "sts:AssumeRole",
								"Condition": {
										"StringEquals": {
												"sts:ExternalId": "[YOUR-EXTERNAL-ID]"
										}
								}
						}
			{
								"Effect": "Allow",
								"Principal": {
										"AWS": "arn:aws:iam::[YOUR-AWS-ACCOUNT-ID-WHERR-CLUSTERS-ARE-DEPLOYED]:role/SpectroCloudRole"
								},
								"Action": "sts:AssumeRole"
						}
				]
		}
		```
	- Copy the IAM role ARN and paste it in Palette. <br /> <br />

	Click on the **Validate** button after providing the IAM user's access key or the IAM role ARN. 


8. Palette mandates the AWS S3 Permissions while users use the static role to provision worker nodes.



</Tabs.TabPane>

<Tabs.TabPane tab="GCP" key="gcp">

## Prerequisites

* GCP service account with a `storage admin` role.

* Pre-created bucket at the GCP object storage.

## Configure the Backup in GCP Bucket

These locations can be configured and managed from the 'Settings' option under 'Project' and can be selected as a backup location while backing up any cluster in the project.

The following details are required to configure a backup location in GCP:

1. **Location Name**: Name of your choice.


2. **Location Provider**: Google Cloud (Choose this option when backing up to the GCP bucket object store).


3. **Bucket**: The name of the bucket name pre-created on the object store.


4. **JSON Credentials**: For external authentication of the GCP storage.


5. Click Create to complete the location creation wizard.


</Tabs.TabPane>

<Tabs.TabPane tab="MinIO" key="minio">

## Prerequisites

* S3 bucket with Read/Write Access

* A unique access key (username) and corresponding secret key (password) from MinIO Console. 

* Service provider certificate (Optional)


## Configure the Backup in MinIO

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


</Tabs.TabPane>

<Tabs.TabPane tab="Azure" key="azure">

## Prerequisites

* An active Azure cloud account with the following pieces of information noted down:
  * Tenant Id
  * Client Id
  * Subscription Id
  * Client Secret created


* An [Azure storage account](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-create?tabs=azure-portal) created with the following information to be noted down for Palette use:
  * Storage Name: Custom name given to the Azure storage created.
  * Stock-keeping unit


* A container to be created in the Azure Storage account

## Configure the Backup in Azure Blob

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

</Tabs.TabPane>

</Tabs>

## Create a Cluster Backup

Backups can be scheduled or initiated on demand during cluster creation. Backups can also be scheduled for a running cluster. The following information is required to configure a cluster backup:

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

## Restore a Backup

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
