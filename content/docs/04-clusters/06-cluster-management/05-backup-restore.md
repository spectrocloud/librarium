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

A backup is a persistent state of Kubernetes resources, ranging from objects such as Pods, DaemonSets, Services, to persistent volumes. A backup allows you to save the current state of a cluster and restore it at a later point in time if needed. You can restore a backup to the same or a different cluster. 


You can schedule and take a backup of a specific cluster or an entire [workspace](/workspace). Also, you can maintain multiple backups of a cluster or a workspace. This guide provides instructions for creating and restoring a cluster backup. You can refer to the [Manage Palette Workspace](/workspace/workload-features#managepaletteworkspace) guide to learn more about backup and restore actions for a workspace. 


Before you create a backup, the initial step is to configure a backup location in Palette. A backup location is an object storage. Palette supports the following object storages as the backup location.

- Amazon Web Services (AWS) Simple Storage Service (S3) bucket

- Google Cloud Platform (GCP) bucket

- MinIO S3 bucket

- Azure blob storage

When you create a backup location, you authorize Palette to perform S3 operations in the environment the object storage resides. A common use case is to back up a cloud account that is different from the one where Palette deploys clusters. In this scenario, you must authorize the latter cloud account, as the diagram below highlights. The numerical points 1, 2, and 3 highlighted in the diagram below signify the following sequence you follow in Palette.
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

<br /> 	

## Configure an AWS S3 Bucket as the Backup Location

1. Log in to [Palette](https://console.spectrocloud.com/).


2. Navigate to the **Project Settings** > **Backup Locations** page. 


3. Click on the **Add New Backup Location** button. Palette will open a wizard to configure the new backup location, as highlighted in the screenshot below. 

	![A screenshot highlighting the wizard and configuration fields to add a backup location in Palette.](/clusters_cluster-management_backup-restore_add_aws_account.png)


4. Provide the following configuration in the wizard to configure an AWS S3 Bucket as the backup location. 

	|**Configuration Field**|**Value**|
	|---|---|
	|**Location Name**|Name of your choice.|
	|**Location Provider**|Select AWS from the drop-down field. |
	|**Certificate**|It is optional for AWS, and required only for MinIO.|
	|**S3 Bucket**|S3 bucket name must be pre-created in the object-store. The bucket name must be DNS-compliant. For more information, refer to the [Bucket naming rules](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html) defined by AWS.|
	|**Region**|Region where the S3 bucket is hosted. You can check the region code from the [Service endpoints](https://docs.aws.amazon.com/general/latest/gr/s3.html#s3_region) section in the AWS documentation.|
	|**S3 URL**|It is an optional field. If you choose to provide a value, refer to the [Methods for accessing a bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-bucket-intro.html#virtual-host-style-url-ex) guide to determine the bucket URL. If you provided an S3 URL, select the **Force S3 path style** checkbox.|


5. Next, choose a validation method, **Credentials** or **STS**. This step will validate the AWS account to store the backup. <br /> <br />

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

8. Click **Create** to finish the location creation wizard. 

<br /> 


</Tabs.TabPane>

<Tabs.TabPane tab="GCP" key="gcp">

## Prerequisites

* GCP service account with a `storage admin` role.


* Pre-created bucket at the GCP object storage.

<br /> 

## Configure a GCP Bucket as the Backup Location

1. Log in to [Palette](https://console.spectrocloud.com/).


2. Navigate to the **Project Settings** > **Backup Locations** page. 


3. Click on the **Add New Backup Location** button. Palette will open a wizard to configure the new backup location.


4. Use the following details to configure a backup location in GCP.

	|**Field**|**Value**|
	|---|---|
	|**Location Name**|Name of your choice.|
	|**Location Provider**|Select GCP from the drop-down field. |
	| **Bucket** | The name of the bucket pre-created in the GCP object store.|
	| **JSON Credentials** | Provide the JSON credentials for the external authentication of the GCP storage.|


5. Click **Create** to finish the backup location creation wizard.

<br /> 	

</Tabs.TabPane>

<Tabs.TabPane tab="MinIO" key="minio">

## Prerequisites

* S3 bucket with Read/Write Access


* A unique access key (username) and corresponding secret key (password) from MinIO Console. 


* Service provider certificate (Optional)

<br /> 

## Configure a MinIO Bucket as the Backup Location


1. Log in to [Palette](https://console.spectrocloud.com/).


2. Navigate to the **Project Settings** > **Backup Locations** page. 


3. Click on the **Add New Backup Location** button. Palette will open a wizard to configure the new backup location.


4. Use the following details to configure a backup location in MinIO. 

	|**Field**|**Value**|
	|---|---|
	|**Location Name**|Name of your choice.|
	|**Location Provider**|Select MinIO from the drop-down field. |
	|**Certificate**|Required for MinIO.|
	|**S3 Bucket**|S3 bucket name must be pre-created in the MinIO object-store. |
	| **Region** | Region in which Minio server is configured. Example: `us-east-1` |
	|**S3 URL** | URL of the MinIO object storage console. Example: `http://12.123.234.567:0000`|
	|**Force S3 path style** | To force S3 path style addressing or else the URL will be converted to virtual-hosted style addressing with bucket name appended to the URL. This is an optional setting. |


5. Next, provide the MiniIO unique **Access Key** and **Secret Key**. You can procure a unique access key (username) and the corresponding secret key (password) from the MinIO console.


6. Click **Create** to finish the location creation wizard. 

<br />	

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


1. Log in to [Palette](https://console.spectrocloud.com/).


2. Navigate to the **Project Settings** > **Backup Locations** page. 


3. Click on the **Add New Backup Location** button. Palette will open a wizard to configure the new backup location.


4. Use the following details to configure a backup location in Azure. 

	|**Field**|**Value**|
	|---|---|
	|**Location Name**|Name of your choice.|
	|**Location Provider**|Select Azure from the drop-down field. |
	|**Container Name:** | Provide the container created in the Azure Storage. |
	| **Storage Name** | Name of the Azure Storage resource. |
	| **Stock-Keeping Unit** | Get this information from the Azure Storage resource. |
	| **Resource Group:** | Provide the Azure Resource Group name. |
	|**Tenant ID** | Provide the Azure tenant ID.|
	| **Client ID** | Provide the Azure client ID of the service principal. |
	| **Subscription ID** |Provide the Azure subscription ID where you have created the Resource Group and the Azure Storgae resource.|
	| **Client Secret** | Provide the Azure client secret for the service principal you created for Palette to assume. |


5. Click **Create** to finish the backup location creation wizard.

<br /> 

</Tabs.TabPane>

</Tabs>

## Create a Cluster Backup

You can schedule a backup or initiate a backup on demand. You can define a backup schedule in the cluster configuration for an existing cluster or while deploying a cluster. Palette supports scheduling a backup for a specific timestamp or scheduling it a specific frequency. You can also specify the backup expiry period, meaning the duration after which Palette will delete the backup automatically. For example, you can schedule a backup for every week on Sunday at midnight and trigger it will expire after 3 months from the backup date. You can also initiate a backup on demand for an existing cluster. 

Use the following instructions in Palette to create a backup for an existing cluster. Choose the applicable use case - schedule a backup or initiate an on-demand backup. 

<br />

<Tabs>
<Tabs.TabPane tab="Schedule a backup" key="schedulebackup">

<br />

1. Log in to [Palette](https://console.spectrocloud.com/).


2. Navigate to the left **Main Menu**, and click on the **Clusters** menu item. 


3. Select the specific cluster to view its details. It should be the cluster for which you want to schedule a backup. Ensure that the cluster status shows *Healthy*. 


4. Click on the **Settings drop-down Menu** on the top right corner, and select **Cluster Settings**. Palette will open a collapsible blade containing the cluster settings on the right. 


5. Next, on the **Settings Menu**, select the **Schedule Backups** menu item. The screenshot below highlights the fields for scheduling a backup. 

	![A screenshot highlighting the fields for scheduling a backup for an existing cluster.](/clusters_cluster-management_backup-restore_scheduled-backup.png)


6. Use the following information to configure a scheduled backup.

	|**Field**|**Description**|
	|---|---|
	|**Backup prefix**|Palette will generate a name automatically. Provide a prefix string you want to prepend to the auto-generated name. |
	|**Select backup location**|Choose a backup location. You must configure a location before creating a backup. |
	|**Backup schedule**|Create a backup schedule of your choice from the **drop-down Menu**. You can review the cheduling options below the current table.|
	|**Select period until expiry**|Select an expiry duration for the backups. Palette will delete the backup after the expiry duration.|
	|**Include all disks**|Your choice.|
	|**Include cluster resources**|Your choice.|
	|**Include Namespaces** (Optional)| Palette will backup all namespaces by default. However, you can unselect specific namespaces per your choice. |

	A cluster backup supports the following scheduling options:	

	* Customize your backup for the exact month, day, hour, and minute of the user's choice
	* Every week on Sunday at midnight
	* Every two weeks at midnight
	* Every month on the 1st at midnight
	* Every two months on the 1st at midnight
	* Never


7. Click on the **Save Changes** button at the bottom. 


</Tabs.TabPane>

<Tabs.TabPane tab="Initiate an on-demand backup" key="initiateondemand">

<br />


1. Log in to [Palette](https://console.spectrocloud.com/).


2. Navigate to the left **Main Menu**, and click on the **Clusters** menu item. 


3. Select the specific cluster to view its details. It should be the cluster for which you want to schedule a backup. Ensure that the cluster status shows *Healthy*. 


4. Navigate to the **Backups** tab and click on the **Create Backup** button. The screenshot below highlights a popup window that Palette will open after clicking the button. The popup windows will contain the fields for initiating an on-demand backup. 

	![A screenshot highlighting the fields for an on-demand backup for an existing cluster.](/clusters_cluster-management_backup-restore_ondemand-backup.png)



5. Use the following information to configure a scheduled backup.

	|**Field**|**Description**|
	|---|---|
	|**Backup name**|Provide a name of your choice. |
	|**Select backup location**|Choose a backup location. You must configure a location before creating a backup. |
	|**Select period until expiry**|Select an expiry duration for the backup. The backup will be automatically removed after the expiry duration.|
	|**Include all disks**|Your choice.|
	|**Include cluster resources**|Your choice.|
	|**Include Namespaces** (Optional)| Palette will backup all namespaces by default. However, you can unselect specific namespaces per your choice. |


6. Click on the **Create Backup** button at the bottom. 


</Tabs.TabPane>
</Tabs>

<br />

## Restore a Backup

You can restore a backup to any target cluster with supporting infrastructure in the same project. In other words, the target cluster and the backup's originating cluster must belong to the same project. 
<br />

1. Log in to [Palette](https://console.spectrocloud.com/).


2. Navigate to the left **Main Menu**, and click on the **Clusters** menu item. 


3. Select the specific cluster to view its details. It should be the cluster for which you want to restore a backup. 


4. Navigate to the **Backups** tab and click on the **Restores** in the nested tabs. 


5. Palette will display a list of all available backups in the  **Restores** section. The list will display both the scheduled and on-demand backups. 


6. Select a specific backup to restore. Palette will open a wizard for the restore operation. 


7. In the restore operation wizard, select the target cluster where you want the backup to be restored. For example, you can select the current or a different cluster, if desired. You can initiate a restore operation on all cluster types across all clouds if the target cluster belongs to the same project.  <br /> <br />

	<WarningBox>

	Suppose the target cluster is deployed in a different cloud account than the backup location. In that case, you must pre-create a storage class on the target cluster before initiating the restore operation. While creating a storage class for the target cluster on EKS,  specify **gp2 storage class**. Whereas for all other cloud environments, specify **spectro-storage-class**. In addition, you must ensure that the backup location has authorized	the target cloud account using the necessary IAM permissions to access the backup files. 

	</WarningBox>


8. Review and confirm the backup and the target cluster, and click on the **Restore** button. 


9. To track the restoration progress, navigate to the target cluster. Palette will display the restoration progress in the **Backups** > **Restores** tab. 