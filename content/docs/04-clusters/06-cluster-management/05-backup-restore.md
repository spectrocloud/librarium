---
title: "Backup and Restore"
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

A backup is a persistent state of Kubernetes clusters, including the native objects such as Pods, DaemonSets, Services, and persistent volumes. A backup allows you to save the current state of a cluster and restore it at a later point in time if needed. You can restore a backup to the same or a different cluster. Internally, Palette leverages an open-source tool called *Velero* to provide backup and restore capabilities. 


Palette allows you to schedule and take a backup of a specific cluster or an entire [workspace](/workspace). Also, you can maintain multiple backups of a cluster or a workspace. This guide provides the instructions for creating and restoring a cluster backup. You can refer to the [Manage Palette Workspace](/workspace/workload-features#managepaletteworkspace) guide to create and restore a workspace backup. 


Before you create a backup, the initial step is to configure a backup location in Palette. A backup location is an object storage in the cloud. Palette supports the following object storages as the backup location.

- Amazon Web Services (AWS) S3 bucket

- Google Cloud Platform (GCP) bucket

- MinIO S3 bucket

- Azure blob storage

While configuring a backup location, you authorize Palette to perform S3 operations in the cloud account. An outstanding use case is when the backup cloud account differs from the one where Palette deploys the clusters. In such scenarios, you must also authorize the latter cloud account, as the diagram below highlights. The numerical points 1, 2, and 3 highlighted in the diagram below signify the following sequence you follow in Palette.
<br />

1. When registering a primary cloud account with Palette, you authorize Palette to deploy clusters in the cloud account. 


2. When adding a secondary cloud account as the backup location, you authorize Palette to store the backup in the cloud account. The secondary cloud account can be the same or different than the primary cloud account. 


3. If the secondary cloud account differs from the primary one, you must update the blob storage's access management rules to allow the primary cloud account access to the storage.


![A diagram highlighting a use-case when the backup cloud account is different from the cluster deployment cloud account.](/clusters_cluster-management_backup-restore_separate-cloud-accounts.png)


You can establish the authorization or a trust relationship between the cloud entities per the guidelines of your cloud service provider. For example, if you configuring the backup in AWS, you can use Security Token Service (STS), IAM roles, and a trust relationship. In the case of Azure, you can use Shared Access Signatures (SAS), AD roles, and service principal identities. Similarly, you can use service accounts, credentials, and IAM roles for GCP. 


The following section will describe the prerequisites and the steps to configure a backup location in Palette. Configuring a backup location is a common step whether you want to create a cluster backup or workspace backup. Choose a backup location provider that suits your needs. 
<br />

<Tabs>
<Tabs.TabPane tab="AWS" key="aws">

## Prerequisites

* An S3 bucket in the AWS account. The bucket will store the backup of your clusters or workspaces. 


* The following customer-managed IAM policy in the AWS account. You can give the policy a name of your choice. The policy should allow the principal to perform certain S3 and EC2 operations. Replace the `BUCKET-NAME` placeholder in the policy below with your bucket name. <br /> <br />

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

<br /> <br />	

## Configure an AWS S3 Bucket as the Backup Location

1. Log in to [Palette](https://console.spectrocloud.com/).


2. Navigate to the **Project Settings** > **Backup Locations** page and 


3. Click on the **Add New Backup Location** button. Palette will open a wizard to configure the new backup location, as highlighted in the screenshot below. 

	![A screenshot highlighting the wizard and configuration fields to add a backup location in Palette.](/clusters_cluster-management_backup-restore_add_aws_account.png)


4. Provide the following configuration in the wizard to configure an AWS S3 Bucket as the backup location. 

	|**Palette Configuration Field**|**Value**|
	|---|---|
	|Location Name|Name of your choice.|
	|Location Provider|Select AWS from the drop-down field. |
	|Certificate|It is optional for AWS, and required only for MinIO.|
	|S3 Bucket|S3 bucket name must be pre-created on the object-store. The bucket name must be DNS-compliant. For more information, refer to the [Bucket naming rules](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html) defined by AWS.|
	|Region|Region where the S3 bucket is hosted. You can check the region code from the [Service endpoints](https://docs.aws.amazon.com/general/latest/gr/s3.html#s3_region) section in the AWS documentation.|
	|S3 URL|It is an optional field. If you choose to provide a value, refer to the [Methods for accessing a bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-bucket-intro.html#virtual-host-style-url-ex) guide to determine the bucket URL. If you provided an S3 URL, select the **Force S3 path style** checkbox.|


5. Next, choose a validation method, *Credentials* or *STS*. This step will validate the AWS account to store the backup. <br /> <br />

	<Tabs>

  <Tabs.TabPane tab="Credentials" key="credentials">

  If you choose the Credentials method, provide an IAM user's access key. The IAM user must have the above permissions to allow Palette create a backup in the S3 bucket. You can use the following steps to create a new IAM user and generate the access key. <br /> <br />
	- Switch to the AWS console. Use the AWS account that hosts the S3 bucket.
	- Navigate to the IAM service, and select **Users** from the left **Main Menu**. 
	- Click on the **Create user** button to create a new user. 
	- Provide a name for the user. Ensure that the user has programmatic access.
	- Attach the IAM policy you defined above to the IAM user. Alternatively, you can add it as an inline policy. 
	- Review the user permissions and finish creating the user. 
	- AWS will generate and display the access key for the newly created user. Copy the newly generated access key id and secret access key, and paste them into Palette.

  </Tabs.TabPane>

  <Tabs.TabPane tab="STS" key="sts">

  If you use the STS method, you must create a new IAM role and provide its ARN. The IAM role must have the necessary IAM permissions defined above and a trust relationship. You can use the following steps to create the IAM role. <br /> <br />
	- Switch to the AWS console. Use the AWS account that hosts the S3 bucket.
	- Navigate to the IAM service, and select **Roles** from the left **Main Menu**. 
	- Click on the **Create role** button to create a new role. 
	- Use the following configuration while creating the IAM role in the AWS console. 

    |**AWS Console Field**|**Value**|
    |---|---|
    |Trusted entity type| AWS account.|
    |An AWS account|Select the Another AWS account radio button.|
    |AWS Account ID|Use the one displayed in Palette. It is Palette SaaS account ID.|
    |Options|Select the Require external ID checkbox.|
    |External ID|Use the one displayed in Palette. Palette generates the external ID.|
    |Permissions policies| Attach the IAM policy defined above.|
    |Role name|Your choice.|
    |Role description|Your choice.|
    
	- Review the trusted entities and the attached permissions. 
	- Finish creating the IAM role.
	- Copy the IAM role ARN and paste it into Palette.

  </Tabs.TabPane>

	</Tabs>



6. Click on the **Validate** button after providing the IAM user's access key or the IAM role ARN. 


7. If the backup cloud account differs from the one where Palette deploys the clusters. In such a scenario, you must also authorize the latter cloud account. You must update the existing trust policy by appending the following permission. The permission below will authorize the AWS account where Palette deploys the clusters to assume the current IAM role. <br /> <br />	

	```json
	{
		"Effect": "Allow",
		"Principal": {
				"AWS": "arn:aws:iam::[AWS-ACCOUNT-ID-WHERE-PALETTE-DEPLOYS-THE-CLUSTERS]:root"
		},
		"Action": "sts:AssumeRole"
	}
	```
	If you want to establish a trust relationship with a specific IAM role, say *SpectroCloudRole*, located within the AWS account that hosts your clusters. You can use the `"arn:aws:iam::[YOUR-AWS-ACCOUNT-ID-WHERE-PALETTE-DEPLOYS-THE-CLUSTERS]:role/SpectroCloudRole"` ARN instead. Your final trust policy will become similar to the policy defined below. It has two trust relationships, one for the Palette SaaS account and another for the AWS account that hosts your clusters. <br /> <br />

  ```json
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
            "AWS": "arn:aws:iam::[AWS-ACCOUNT-ID-OF-PALETTE-SaaS]:root"
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
            "AWS": "arn:aws:iam::[AWS-ACCOUNT-ID-WHERE-PALETTE-DEPLOYS-THE-CLUSTERS]:root"
        },
        "Action": "sts:AssumeRole"
      }
    ]
  }
  ```

<br /> <br />	


</Tabs.TabPane>

<Tabs.TabPane tab="GCP" key="gcp">

## Prerequisites

* GCP service account with a `storage admin` role.

* Pre-created bucket at the GCP object storage.

<br /> <br />	

## Configure a GCP Bucket as the Backup Location

These locations can be configured and managed from the 'Settings' option under 'Project' and can be selected as a backup location while backing up any cluster in the project.

The following details are required to configure a backup location in GCP:

1. **Location Name**: Name of your choice.


2. **Location Provider**: Google Cloud (Choose this option when backing up to the GCP bucket object store).


3. **Bucket**: The name of the bucket name pre-created on the object store.


4. **JSON Credentials**: For external authentication of the GCP storage.


5. Click Create to complete the location creation wizard.

<br /> <br />	

</Tabs.TabPane>

<Tabs.TabPane tab="MinIO" key="minio">

## Prerequisites

* S3 bucket with Read/Write Access

* A unique access key (username) and corresponding secret key (password) from MinIO Console. 

* Service provider certificate (Optional)

<br /> <br />	

## Configure a MinIO Bucket as the Backup Location


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

<br /> <br />	

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

<br /> <br />	

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

<br /> <br />	

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

<br /> <br />	

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
