---
title: "Add Backup Location using Security Token Service"
metaTitle: "Add Backup Location using Security Token Service"
metaDescription: "Learn how to add an AWS account as the backup location in Palette using the STS method."
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Add a Backup Location using the Security Token Service

Platte supports the Security Token Service (STS) authentication method only when both the following conditions are met:
<br />

1. Your Palette instance is hosted in AWS. If you use Palette SaaS or have an on-premises or self-hosted Palette deployed in AWS, you will get the STS option while adding a backup location. In all other cases, Palette does not support the STS method. 


2. You want to add an AWS account as the backup location provider. The AWS account can be the same or different than your Palette instance. 


An example will help you better understand the steps you will learn in this guide. Suppose, your Kubernetes cluster is deployed in *AWS Account A*, and you want to create the backup in *AWS Account B*, whereas the Palette instance is hosted in *AWS Account C*. This scenario is a *generic* use case when you can use the STS method to add a backup location. The diagram below presents the generic use case and highlights the specific order of authentication you must follow. 

![A diagram highlighting the use-case when the backup cloud account differs from the cluster deployment cloud account.](/clusters_cluster-management_backup-restore_separate-cloud-accounts.png)

<br />
<InfoBox>

The steps you will learn in this guide will apply even if any two or more entities, the cluster, the bucket, or Palette, share the cloud accounts. 

</InfoBox>
<br />


## Overview of the Authentication Mechanism
In the generic scenario described in the diagram above, you must ensure to implement the following order of authentication:
<br />

1. Authenticate Palette to administer the cluster in AWS Account A. When you register a primary cloud account in Palette, you authenticate and authorize Palette to deploy clusters in the cloud account. Refer to the [Add AWS Account](/clusters/public-cloud/aws/add-aws-accounts) guide to learn more. 


2. Authenticate Palette to access the S3 buckets in AWS Account B. You achieve this step by defining the access permissions for the storage bucket and associate the permissions with an IAM role. Next, you define a trust relationship in the IAM role to allow Palette to assume the role. 


3. Authenticate the cluster to access the S3 buckets in AWS Account B. You define another trust relationship in the IAM role to allow the cluster to assume the role. 



The following sections will outline the prerequisites and the detailed steps to add an S3 bucket as the backup location in AWS Account B using the STS authentication method. 
<br />

# Prerequisites

* An *AWS Account A*. It is the AWS account where you have deployed the Kubernetes cluster. 


* An *AWS Account B*. It is the AWS account where you want to create the backup location. 


* An S3 bucket in the AWS Account B. The bucket will store the backup of your clusters or workspaces. 


* The following IAM policy created in your AWS Account B. Replace the `BUCKET-NAME` placeholder in the policy below with your bucket name.  Refer to the [Creating IAM policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create-console.html) for additional guidance. <br /> <br />

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


# Instructions

1. Log in to [Palette](https://console.spectrocloud.com/).


2. Navigate to the **Project Settings** and click on **Backup Locations** page. 


3. Click on the **Add New Backup Location** button. Palette will open a wizard to configure the new backup location, as highlighted in the screenshot below. 

	![A screenshot highlighting the wizard and configuration fields to add a backup location in Palette.](/clusters_cluster-management_backup-restore_add_aws_account.png)


4. Fill out the following input fields. 

	|**Configuration Field**|**Value**|
	|---|---|
	|**Location Name**|Name of your choice.|
	|**Location Provider**|Select AWS from the drop-down field. |
	|**Certificate**|Service provider certificate. It is optional for AWS.|
	|**S3 Bucket**|S3 bucket name must be pre-created in the object-store. The bucket name must be DNS-compliant. For more information, refer to the [Bucket naming rules](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html) defined by AWS.|
	|**Region**|Region where the S3 bucket is hosted. You can check the region code from the [Service endpoints](https://docs.aws.amazon.com/general/latest/gr/s3.html#s3_region) section in the AWS documentation.|
	|**S3 URL**|It is an optional field. If you choose to provide a value, refer to the [Methods for accessing a bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-bucket-intro.html#virtual-host-style-url-ex) guide to determine the bucket URL. If you provided an S3 URL, select the **Force S3 path style** checkbox.|


5. Next, choose the **STS** validation method. 


6. When you choose the STS method, you must create a new IAM role and provide its ARN. 

  Swicth to the AWS Account B to create a new IAM role. The IAM role must have the necessary IAM policy attached, which you defined in the prerequisites section above. Refer to the [Creating a role to delegate permissions to an IAM user](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html) document to learn about creating an IAM role. Use the following configuration while creating the IAM role. 

  |**AWS Console Field**|**Value**|
  |---|---|
  |Trusted entity type| AWS account.|
  |AWS account|Select the *Another AWS account* radio button.|
  |AWS Account ID|Use the one displayed in Palette. It is Palette SaaS account ID.|
  |Options|Select the Require external ID checkbox.|
  |External ID|Use the one displayed in Palette. Palette generates the external ID.|
  |Permissions policies| Attach the IAM policy defined in the prerequisites section above.|
  |Role name|Your choice.|
  |Role description|Your choice.|


7. Review the details of the newly created IAM role in AWS Account B. 


8. In the **Trust relationships** section of the IAM role, a relationship will already be defined for Palette so that Palette can assume this role under specified conditions. The codeblock below displays an example trust relationship. <br /> <br />

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
    ]
  }
  ```

  In your case, the `[AWS-ACCOUNT-ID-OF-PALETTE-SaaS]` and `[YOUR-EXTERNAL-ID]` placeholders will contain the values you used while creating the IAM role. 


9. Edit the existing trust policy of the newly created IAM role in AWS Account B. Append the following permission to the existing trust policy. This step will authorize the cluster in AWS Account A to assume the current IAM role. Replace the `[ACCOUNT-ID-FOR-AWS-ACCOUNT-A]` placeholder with the AWS account ID for AWS Account A. <br /> <br />	

  ```json
  {
    "Effect": "Allow",
    "Principal": {
        "AWS": "arn:aws:iam::[ACCOUNT-ID-FOR-AWS-ACCOUNT-A]:root"
    },
    "Action": "sts:AssumeRole"
  }
  ```
	
	If you want to establish a trust relationship with a specific IAM role in AWS Account A, say *SpectroCloudRole*, you can use the `"arn:aws:iam::[ACCOUNT-ID-FOR-AWS-ACCOUNT-A]:role/SpectroCloudRole"` ARN instead. 
  
  Your final trust policy will become similar to the policy defined below. It has two trust relationships, one for the Palette SaaS account and another for the AWS Account A. <br /> <br />

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
      },
      {
        "Effect": "Allow",
        "Principal": {
            "AWS": "arn:aws:iam::[ACCOUNT-ID-FOR-AWS-ACCOUNT-A]:root"
        },
        "Action": "sts:AssumeRole"
      }
    ]
  }
  ```
  You can refer to the [How to use trust policies with IAM roles](https://aws.amazon.com/blogs/security/how-to-use-trust-policies-with-iam-roles/) blog by AWS to learn more.
  

10. Copy the ARN of the newly created IAM role from AWS.


11. Switch back to Palette where you left, and provide the IAM role ARN into the wizard to add the new backup location. 


12. Click on the **Validate** button. 


13. Click **Create** to complete the backup location addition.


# Validate

When you finish adding a backup location, Palette will display the newly added backup location on the **Backup Locations** page. Follow the steps below to validate adding the new backup location.
<br />

1. Navigate to the **Project Settings** and click on **Backup Locations** page. 


2. The **Backup Locations** page will display a list of all backup locations configured for the current project. 


3. Search for the newly added backup location in the list. If you find the backup location, it will validate that you have successfully added the backup location. 