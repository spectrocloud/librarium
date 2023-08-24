---
title: "Add a Backup Location"
metaTitle: "Add a Backup Location"
metaDescription: "Learn how to add a backup location in Palette. Adding a backup location is a standard step whether you want to create a cluster backup or a workspace backup."
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Add a Backup Location

This how-to guide provides instructions on how to add a backup location in Palette. 
You must add a backup location before creating a backup of a cluster or workspace.
The following sections describe the prerequisites and the steps to add a backup location in Palette. You can refer to the [Cluster Backup and Restore](/clusters/cluster-management/backup-restore) guide to learn more about the fundamentals of backup and restore. 

Select the tab that matches the environment you want to create a backup.
<br />

<Tabs>
<Tabs.TabPane tab="AWS" key="aws">

## Prerequisites

* An S3 bucket in the AWS account. The bucket will store the backup of your clusters or workspaces. 


* Add the following IAM policy to your AWS account. Replace the `BUCKET-NAME` placeholder in the policy below with your bucket name.  Refer to the [Creating IAM policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create-console.html) for additional guidance. 

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

## Add an AWS S3 Bucket as the Backup Location

1. Log in to [Palette](https://console.spectrocloud.com/).


2. Navigate to the **Project Settings** > **Backup Locations** page. 


3. Click on the **Add New Backup Location** button. Palette will open a wizard to configure the new backup location, as highlighted in the screenshot below. 

	![A screenshot highlighting the wizard and configuration fields to add a backup location in Palette.](/clusters_cluster-management_backup-restore_add_aws_account.png)


4. Fill out the required input fields. 

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

  Palette supports the STS credentials method for adding only the AWS cloud as the backup location. Palette does not support the STS credentials method for adding other backup location providers, such as Azure, GCP, or MinIO. 
	
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

* A service account with the Storage Admin assigned role.


* Pre-created bucket at the GCP object storage.

<br /> 

## Add a GCP Bucket as the Backup Location

1. Log in to [Palette](https://console.spectrocloud.com/).


2. Navigate to the **Project Settings** and click on **Backup Locations** page. 


3. Click on the **Add New Backup Location** button. 


4. Fill out the following input fields.

	|**Field**|**Value**|
	|---|---|
	|**Location Name**|Name of your choice.|
	|**Location Provider**|Select GCP from the drop-down field. |
	| **Bucket** | The name of the bucket pre-created in the GCP object store.|
	| **JSON Credentials** | Provide the JSON credentials for the external authentication of the GCP storage. Ensure the associated service account has sufficient permissions to perform the required bucket operations. |


5. Click **Create** to finish the backup location creation wizard.

<br /> 	

</Tabs.TabPane>

<Tabs.TabPane tab="MinIO" key="minio">

## Prerequisites

* S3 bucket with Read/Write Access


* A unique access key (username) and corresponding secret key (password) from MinIO Console. 


* Service provider certificate (Optional)

<br /> 

## Add a MinIO Bucket as the Backup Location


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


5. Next, provide the MiniIO unique **Access Key** and **Secret Key**. You can procure a unique access key and the corresponding secret key from the MinIO console. Ensure that the MinIO user has sufficient permissions to perform the required bucket operations. You can refer to the [MinIO official documentation](https://min.io/docs/minio/kubernetes/upstream/administration/identity-access-management/minio-user-management.html#access-keys) to know more.


6. Click **Create** to complete the backup location creation. 

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

## Add the Backup in Azure Blob


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
	| **Client ID** | Provide the Azure client ID of the service principal. Ensure the service principal has sufficient permissions to perform the required bucket operations. |
	| **Subscription ID** |Provide the Azure subscription ID where you have created the Resource Group and the Azure Storage resource.|
	| **Client Secret** | Provide the Azure client secret for the service principal you created for Palette to assume. |


5. Click **Create** to finish the backup location creation wizard.

<br /> 

</Tabs.TabPane>

</Tabs>


# Validate

You can follow the steps outlined below to validate adding a backup location.
<br />

1. Log in to [Palette](https://console.spectrocloud.com).


2. Select the desired project scope from the **drop-down Menu** at the top-left corner. 


3. Navigate to the **Project Settings** > **Backup Locations** page. Palette will display all backup locations configured for the current project on this page, including the newly added one. This step validates that you have successfully added the backup location. 


