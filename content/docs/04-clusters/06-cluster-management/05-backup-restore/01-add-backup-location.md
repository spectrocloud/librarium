---
title: "Add Backup Location using Access Credentials"
metaTitle: "Add Backup Location using Access Credentials"
metaDescription: "Learn how to add a backup location in Palette. Adding a backup location is a standard step whether you want to create a cluster backup or a workspace backup."
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Add a Backup Location using the Access Credentials

This how-to guide presents instructions for adding a backup location in Palette using the long-term access credentials method. Below is an overview of the steps involved:
<br />

1. Create a storage bucket to store the backup files. For example, if you configure the backup location in AWS, you will need an S3 bucket. Another example is if you configure the backup location in Azure, you will need a container in the Azure Storage account.


2. Define the access permissions for the storage bucket and associate the permissions with an IAM entity. Depending on your cloud or data center platform, the IAM entity can be a user, service principal, or role. 


3. Generate the long-term access credentials for the IAM entity with sufficient permissions to perform the bucket-related operations. When you generate the long-term access credentials for an IAM entity, you do not embed the application's identity that will use the credentials. In your case, you do not use Palette's identity while generating the access credentials. Therefore, any application with access to the credentials can assume the IAM entity's role. Next, you will share the credentials with Palette so that it can assume the IAM entity's role to perform the bucket-related operations.   


The following sections will provide more detailed instructions. Select the tab that matches the environment where you want to create a backup.
<br />

<Tabs>
<Tabs.TabPane tab="AWS" key="aws">

## Prerequisites

* An AWS account. 


* An S3 bucket in the AWS account. The bucket will store the backup of your clusters or workspaces. 


* Add the following IAM policy to your AWS account. Replace the `BUCKET-NAME` placeholder in the policy below with your bucket name.  Refer to the [Creating IAM policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create-console.html) for additional guidance. <br /> <br />

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

## Add an AWS S3 Bucket 

1. Log in to [Palette](https://console.spectrocloud.com/).


2. Navigate to the **Project Settings** and click on **Backup Locations** page. 


3. Click on the **Add New Backup Location** button. 


4. Fill out the following input fields. 

	|**Configuration Field**|**Value**|
	|---|---|
	|**Location Name**|Name of your choice.|
	|**Location Provider**|Select AWS from the drop-down field. |
	|**Certificate**|Service provider certificate. It is optional for AWS.|
	|**S3 Bucket**|S3 bucket name must be pre-created in the object-store. The bucket name must be DNS-compliant. For more information, refer to the [Bucket naming rules](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html) defined by AWS.|
	|**Region**|Region where the S3 bucket is hosted. You can check the region code from the [Service endpoints](https://docs.aws.amazon.com/general/latest/gr/s3.html#s3_region) section in the AWS documentation.|
	|**S3 URL**|It is an optional field. If you choose to provide a value, refer to the [Methods for accessing a bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-bucket-intro.html#virtual-host-style-url-ex) guide to determine the bucket URL. If you provided an S3 URL, select the **Force S3 path style** checkbox.|


5. Next, choose the **Credentials** validation method. If you want to choose the STS method instead, refer to the [Add a Backup Location using Security Token Service](/clusters/cluster-management/backup-restore/add-backup-location-sts) for guided instructions. 


6. Provide the IAM user's access key if you chose the Credentials method. The IAM user must have the necessary IAM policy attached, which you defined in the prerequisites section above. The policy will allow Palette to create a backup in the S3 bucket. 
  
  If you do not have an IAM user, refer to the [Creating an IAM user in your AWS account](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html) document to learn how to create an IAM user. While creating the IAM user, ensure to attach the IAM policy you defined in the prerequisites section above. After creating the new IAM user, AWS will automatically generate and display an access key. 

  Alternatively, you can create a new access key for an existing IAM user. Refer to the [Managing access keys for IAM users](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html) document to learn about creating an access key for a particular IAM user. 



7. Click on the **Validate** button. 


8. Click **Create** to complete the backup location addition.

<br /> 


</Tabs.TabPane>

<Tabs.TabPane tab="GCP" key="gcp">

## Prerequisites

* A GCP account. 


* A storage bucket in the GCP account.


* A service account with sufficient permissions to perform the required read and write operations on the bucket. For simplicity, you can assign the storage administrator role to the service account to grant complete control of the storage bucket. Refer to the [IAM roles for Cloud Storage](https://cloud.google.com/storage/docs/access-control/iam-roles) document to learn about the available roles. 


* JSON credentials for the service account. Refer to the [Create access credentials](https://developers.google.com/workspace/guides/create-credentials#service-account) to learn how to create the credentials for the service account. 

<br /> 

## Add a GCP Bucket 

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


5. Click **Create** to complete the backup location addition.

<br /> 	

</Tabs.TabPane>

<Tabs.TabPane tab="MinIO" key="minio">

## Prerequisites

* A MinIO account.


* An S3-compliant bucket in the MinIO account. 


* IAM policy in your MinIO account to authorize a MinIO user to perform the required read and write operations on the MinIO bucket. A principal is an IAM identity. MinIO uses Policy-Based Access Control (PBAC) to control which IAM identities can access the resources and what actions the IAM identities are authorized to perform on the specific resources.


* A MinIO user assigned with the IAM policy defined above. You can learn more about MinIO access management in the [MinIO object storage for Kubernetes](https://min.io/docs/minio/kubernetes/upstream/administration/identity-access-management.html) official documentation.


* An access key for the MinIO user. You can create an access key from the MinIO console. Refer to the [MinIO official documentation](https://min.io/docs/minio/kubernetes/upstream/administration/identity-access-management/minio-user-management.html#access-keys) to learn about creating access keys. 


* (Optional) Service provider certificate, if your organization prefers it.

<br /> 

## Add a MinIO Bucket 


1. Log in to [Palette](https://console.spectrocloud.com/).


2. Navigate to the **Project Settings** and click on **Backup Locations** page. 


3. Click on the **Add New Backup Location** button.


4. Fill out the following input fields. 

	|**Field**|**Value**|
	|---|---|
	|**Location Name**|Name of your choice.|
	|**Location Provider**|Select MinIO from the drop-down field. |
	|**Certificate**|Service provider certificate, if your organization prefers it.|
	|**S3 Bucket**|S3 bucket name must be pre-created in the MinIO object-store. |
	| **Region** | Region in which Minio server is configured. Example: `us-east-1` |
	|**S3 URL** | URL of the MinIO object storage console. Example: `http://12.123.234.567:0000`|
	|**Force S3 path style** | To force S3 path style addressing or else the URL will be converted to virtual-hosted style addressing with bucket name appended to the URL. This is an optional setting. |


5. Next, provide the access key for the MiniIO user. The access key will have two parts - the access key ID and the secret key.  


6. Click **Create** to complete the backup location addition.

<br />	

</Tabs.TabPane>

<Tabs.TabPane tab="Azure" key="azure">

## Prerequisites

* An active Azure cloud account. Note down the following information for the cloud account:
  * Tenant ID
  * Subscription ID


* An Azure storage account in the Azure account. Refer to the [Azure documentations](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-create?tabs=azure-portal) to learn how to create an Azure storage account. Note down the following information for the Azure storage account.
  * Resource group name
	* Storage account name
  * Stock-Keeping Unit (SKU)
	

* A container in the Azure Storage account. 


* A service principal with sufficient permissions to perform the required read and write operations on the container. Note down the following information for the cloud account:
  * Client ID
  * Client Secret	

<br /> 	

## Add an Azure Blob Container


1. Log in to [Palette](https://console.spectrocloud.com/).


2. Navigate to the **Project Settings** and click on **Backup Locations** page. 


3. Click on the **Add New Backup Location** button. 


4. Fill out the following input fields. 

	|**Field**|**Value**|
	|---|---|
	|**Location Name**|Name of your choice.|
	|**Location Provider**|Select Azure from the drop-down field. |
	|**Container Name:** | Name of the container created in the Azure storage. |
	| **Storage Name** | Name of the Azure storage resource. |
	| **Stock-Keeping Unit** | Azure storage resource SKU. |
	|**Tenant ID** | Azure tenant ID.|
	| **Subscription ID** | Azure subscription ID where you have created the Azure storage resource.|
	| **Resource Group:** | Azure resource group name. |
	| **Client ID** | Azure client ID of the service principal. |
	| **Client Secret** | Azure client secret for the service principal you created for Palette to assume. |
	


5. Click **Create** to complete the backup location addition.

<br /> 

</Tabs.TabPane>

</Tabs>


# Validate

When you finish adding a backup location, Palette will display the newly added backup location on the **Backup Locations** page. Follow the steps below to validate adding the new backup location.
<br />

1. Navigate to the **Project Settings** and click on **Backup Locations** page. 


2. The **Backup Locations** page will display a list of all backup locations configured for the current project. 


3. Search for the newly added backup location in the list. If you find the backup location, it will validate that you have successfully added the backup location. 