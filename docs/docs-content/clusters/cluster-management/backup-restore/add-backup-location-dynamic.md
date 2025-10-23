---
sidebar_label: "Add Backup Location using Dynamic Credentials"
title: "Add Backup Location using Dynamic Credentials"
description: "Learn how to add a backup location in Palette using dynamic access credentials."
hide_table_of_contents: false
sidebar_position: 20
tags: ["clusters", "cluster management", "backup"]
---

This guide provides instructions for how to add a backup location in Palette using dynamic access credentials. You use
the dynamic access credentials to authenticate Palette with the backup location service provider. Refer to the
[Backup Location](./backup-restore.md#backup-locations-and-credentials) section to learn more about the supported
service providers.

Depending on the infrastructure provider, there may be limitations or different prerequisites.

## Dynamic Credentials with AWS STS

To support dynamic credentials with AWS, Palette uses the AWS Security Token Service (STS) authentication method. You
can use AWS STS when adding an S3 bucket as the backup location. The following sections outline the prerequisites and
provide detailed steps to add an S3 bucket as the backup location using the STS authentication method.

:::warning

Palette supports AWS STS only when your Palette’s hosting environment and the backup location service provider are the
same. Palette SaaS is hosted on AWS, so you can use AWS STS to add an S3 bucket as the backup location. Similarly, if
you have a self-hosted Palette or Palette VerteX deployed in AWS, you can use AWS STS to add an S3 bucket as the backup
location. Otherwise, you cannot use AWS STS to add an S3 bucket as the backup location.

:::

You can use the same AWS account in which you deploy your Kubernetes cluster to add an S3 bucket as the backup location.
You can also use a different AWS account to add an S3 bucket as the backup location. Select the tab below that best
matches your use case.

- [Single Cloud Account with AWS STS](#single-cloud-account-with-aws-sts) <!-- omit in toc -->

- [Multiple Cloud Accounts with AWS STS](#multiple-cloud-accounts-with-aws-sts) <!-- omit in toc -->

## Single Cloud Account with AWS STS

Use the following steps to add an S3 bucket as the backup location using the STS authentication method when you have one
cloud account.

### Prerequisites

- If you are using a self-hosted Palette or Vertex instance, you must configure an AWS account at the instance-level to
  allow tenants to add AWS accounts using STS. For more information, refer to the
  [Add AWS Accounts Using STS](../../public-cloud/aws/add-aws-accounts/configure-aws-sts-account.md) guide.

- Both your Palette environment instance and the S3 bucket are hosted on AWS. This prerequisite is more applicable to
  self-hosted Palette and Palette VerteX customers. Palette SaaS in hosted in an AWS environment.

- An AWS account. This account is assumed to be the same account where you deploy Kubernetes clusters. Refer to the
  [Multiple Cloud Accounts with AWS STS](add-backup-location-dynamic.md#multiple-cloud-accounts-with-aws-sts) section to
  learn how to add a backup location when the cluster deployment cloud account differs from the backup cloud account.

- An S3 bucket in the AWS account. The bucket will store the backup of your clusters or workspaces.

- The following IAM policy must be created in your AWS Account. Replace the `BUCKET-NAME` placeholder in the policy
  below with your bucket name. Refer to the
  [Creating IAM policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create-console.html) for
  additional guidance.

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
        "Resource": ["arn:aws:s3:::BUCKET-NAME/*"]
      },
      {
        "Effect": "Allow",
        "Action": ["s3:ListBucket"],
        "Resource": ["arn:aws:s3:::BUCKET-NAME"]
      }
    ]
  }
  ```

- If the S3 bucket is using a customer managed AWS Key Management Service (KMS) key for server-side encryption, ensure
  the Palette IAM role has the necessary permissions to access the KMS key. Otherwise, Palette will be unable to put
  objects in the S3 bucket, resulting in backup or restore failure. Check out the
  [Troubleshooting key access](https://docs.aws.amazon.com/kms/latest/developerguide/policy-evaluation.html) guide to
  learn more about common KMS issues.

- If you are using a custom Certificate Authority (CA) for SSL/TLS connections, provide the x509 certificate in
  Privacy-Enhanced Mail (PEM) format to Palette.

  :::tip

  Use the IAM Policy Simulator to verify the IAM role has the necessary permissions to access a customer managed KMS
  key. Refer to the
  [Testing IAM policies with the IAM policy simulator](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_testing-policies.html)
  guide to learn more.

  :::

### Instructions

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Navigate to **Project Settings** and click on **Backup Locations**.

3. Click on the **Add New Backup Location** button. Palette will open a wizard to configure the new backup location, as
   highlighted in the screenshot below.

   ![A screenshot highlighting the wizard and configuration fields to add a backup location in Palette.](/clusters_cluster-management_backup-restore_add_aws_account.webp)

4. Fill out the input fields listed in the table.

   | **Configuration Field** | **Value**                                                                                                                                                                                                                                                                                     |
   | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Location Name**       | Provide a name of your choice.                                                                                                                                                                                                                                                                |
   | **Location Provider**   | Select AWS from the **drop-down** Menu.                                                                                                                                                                                                                                                       |
   | **Certificate**         | Provide the CA bundle in PEM format if you are using a custom certificate bundle to establish SSL/TLS sessions.                                                                                                                                                                               |
   | **S3 Bucket**           | The name of the S3 bucket you created in the object store. The bucket name must be DNS-compliant. For more information, refer to the [Bucket naming rules](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html) defined by AWS.                                      |
   | **Region**              | Region where the S3 bucket is hosted. You can check region codes in the [Service endpoints](https://docs.aws.amazon.com/general/latest/gr/s3.html#s3_region) section in the AWS documentation.                                                                                                |
   | **S3 URL**              | Optional S3 URL. If you choose to provide a value, refer to the [Methods for accessing a bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-bucket-intro.html#virtual-host-style-url-ex) guide to determine the bucket URL and enable the **Force S3 path style** checkbox. |

5. Next, choose the **STS** authentication method. When you choose the STS authentication method, you must create a new
   IAM role and provide its Amazon Resource Name (ARN) to Palette. Check out the
   [Creating a role using custom trust policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-custom.html)
   guide from Amazon for additional guidance.

6. Log in to your AWS Account and create a new IAM role. Attach the IAM policy specified in the
   [Prerequisites](#prerequisites) section. Use the following configuration while creating the IAM role.

| **AWS Console Field** | **Value**                                                                           |
| --------------------- | ----------------------------------------------------------------------------------- |
| Trusted entity type   | Select _AWS account_                                                                |
| AWS account           | Select the **Another AWS account** radio button.                                    |
| AWS Account ID        | Use the one displayed in Palette, which is Palette's account ID.                    |
| Options               | Select the **Require external ID** checkbox.                                        |
| External ID           | Use the one displayed in Palette. Palette generates the external ID.                |
| Permissions policies  | Attach the IAM policy defined in the [Prerequisites](#prerequisites) section above. |
| Role name             | Provide a name of your choice.                                                      |
| Role description      | Provide an optional description.                                                    |

<br />

![A view of the IAM Role creation screen](/clusters_cluster-management_backup_restore_add-backup-location-dynamic_aws_create_role.webp)

7. Review the details of the newly created IAM role.

<br />

![A view of the IAM Role creation summary screen](/clusters_cluster-management_backup_restore_add-backup-location-dynamic_aws_create_role_summary.webp)

8. Copy the IAM role Amazon Resource Name (ARN)

9. Switch back to Palette, and resume the backup location creation wizard. Paste the copied IAM role ARN into the
   **ARN** input field.

10. Click on **Validate**. Palette will display a validation status message. If the validation status message indicates
    a success, proceed to the next step. If the validation status message indicates an error, review the error message
    and verify the IAM configurations you provided. Ensure you have provided the correct IAM role ARN, Palette external
    ID, and that the IAM role has the required IAM policy permissions mentioned in the [Prerequisites](#prerequisites)
    section.

11. Click on the **Create** button.

You now have a backup location for Palette to store the backup of your clusters or workspaces. This backup location uses
AWS STS to authenticate Palette with the S3 bucket in the same AWS account you deploy your Kubernetes cluster.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Navigate to **Project Settings** and click on **Backup Locations**.

3. The **Backup Locations** page will display a list of all backup locations configured for the current project.

4. Search for the newly added backup location in the list. The presence of the backup location validates that you
   successfully added a new backup location.

## Multiple Cloud Accounts with AWS STS

Suppose your Kubernetes cluster is deployed in _AWS Account A_, and you want to create the backup in _AWS Account B_,
but the Palette instance is hosted in _AWS Account C_. In this scenario, Palette will allow you to use the STS
authentication method to add a backup location. The diagram below presents this scenario and shows the order of
authentication you must follow.

![A diagram highlighting the order of authentication required when the backup cloud account differs from the cluster deployment cloud account.](/clusters_cluster-management_backup-restore_separate-cloud-accounts.webp)

A multi-cloud account scenario requires you to perform the following authentication steps.

1. Grant Palette access to the cluster in AWS Account A. When you register a primary cloud account in Palette, you
   authenticate and authorize Palette to deploy clusters in the cloud account. Check out the
   [Add AWS Account](../../public-cloud/aws/add-aws-accounts.md) to guidance on how to add an AWS account in Palette.

2. Give Palette permission to use the S3 buckets in AWS Account B. Set the bucket permissions and link them to an IAM
   role. Then, update the IAM role to let Palette assume it.

3. Authorize the cluster with AWS Account B for S3 bucket access. Update the IAM role to allow Palette clusters to
   assume it.

Use the following steps to add an S3 bucket as the backup location using the STS authentication method when you have
multiple cloud accounts.

### Prerequisites

- If you are using a self-hosted Palette or Vertex instance, you must configure an AWS account at the instance-level to
  allow tenants to add AWS accounts using STS. For more information, refer to the
  [Add AWS Accounts Using STS](../../public-cloud/aws/add-aws-accounts/configure-aws-sts-account.md) guide.

- Both your Palette environment instance and the S3 bucket are hosted on AWS. This prerequisite is more applicable to
  self-hosted Palette and Palette VerteX customers. Palette SaaS is hosted in an AWS environment.

- An AWS account where you deploy Kubernetes clusters. This account will be referred to as _AWS Account A_.

- Another AWS account where you want to create the backup location. This account will be referred to as _AWS Account B_.
  This is the AWS account where you want to create the backup location.

- An S3 bucket in AWS Account B. The bucket will store the backup of your clusters or workspaces.

- If you are using a custom Certificate Authority (CA) for SSL/TLS connections, provide the x509 certificate in
  Privacy-Enhanced Mail (PEM) format to Palette.

- The following IAM policy must be created in your AWS Account B. Replace the `BUCKET-NAME` placeholder in the policy
  below with your bucket name. Refer to the
  [Creating IAM policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create-console.html) for
  additional guidance.

<br />

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
      "Resource": ["arn:aws:s3:::BUCKET-NAME/*"]
    },
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": ["arn:aws:s3:::BUCKET-NAME"]
    }
  ]
}
```

<br />

### Instructions

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Navigate to **Project Settings** and click on **Backup Locations**.

3. Click on the **Add New Backup Location** button. Palette will open a wizard to configure the new backup location, as
   shown in the screenshot below.

   ![A screenshot highlighting the wizard and configuration fields to add a backup location in Palette.](/clusters_cluster-management_backup-restore_add_aws_account.webp)

4. Fill out the input fields listed in the table below.

   | **Configuration Field** | **Value**                                                                                                                                                                                                                                                                                   |
   | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Location Name**       | Provide a name of your choice.                                                                                                                                                                                                                                                              |
   | **Location Provider**   | Select AWS from the **drop-down** Menu.                                                                                                                                                                                                                                                     |
   | **Certificate**         | Optional service provider x509 certificate.                                                                                                                                                                                                                                                 |
   | **S3 Bucket**           | The S3 bucket name you created in the object store. The bucket name must be DNS-compliant. For more information, refer to the [Bucket naming rules](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html) defined by AWS.                                           |
   | **Region**              | Region where the S3 bucket is hosted. You can check the region code from the [Service endpoints](https://docs.aws.amazon.com/general/latest/gr/s3.html#s3_region) section in the AWS documentation.                                                                                         |
   | **S3 URL**              | Optional S3 bucket URL. If you provide a value, refer to the [Methods for accessing a bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-bucket-intro.html#virtual-host-style-url-ex) guide to determine the bucket URL, and select the **Force S3 path style** checkbox. |

5. Next, choose the **STS** authentication method. When you choose the STS authentication method, you must create a new
   IAM role and provide its Amazon Resource Name (ARN) to Palette. Check out the
   [Creating a role using custom trust policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-custom.html)
   guide from Amazon for additional guidance.

6. Switch to AWS Account B to create a new IAM role. The IAM role must have the necessary IAM policy attached, which you
   defined in the prerequisites section above. Refer to the
   [Creating a role to delegate permissions to an IAM user](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html)
   guide to learn how to create an IAM role. Use the following configuration while creating the IAM role.

| **AWS Console Field**   | **Value**                                                                           |
| ----------------------- | ----------------------------------------------------------------------------------- |
| **Trusted entity type** | Select the **AWS account** option.                                                  |
| **AWS account**         | Select the **Another AWS account** radio button.                                    |
| **AWS Account ID**      | Use the one displayed in Palette, which is Palette's account ID.                    |
| **Options**             | Select the **Require external ID** checkbox.                                        |
| External ID             | Use the one displayed in Palette. Palette generates the external ID.                |
| Permissions policies    | Attach the IAM policy defined in the [Prerequisites section](#prerequisites) above. |
| Role name               | Provide a name of your choice.                                                      |
| Role description        | Provide an optional description.                                                    |

<br />

![A view of the IAM Role creation screen](/clusters_cluster-management_backup_restore_add-backup-location-dynamic_aws_create_role.webp)

7. Review the details of the newly created IAM role in AWS Account B.

<br />

![A view of the IAM Role creation summary screen](/clusters_cluster-management_backup_restore_add-backup-location-dynamic_aws_create_role_summary.webp)

8. In the IAM role's **Trust relationships** section, a relationship will already be defined for Palette so that Palette
   can assume this role under specified conditions.

9. Edit the existing trust policy of the newly created IAM role in AWS Account B. Append the following permission to the
   existing trust policy. This step will authorize the cluster in AWS Account A to assume the current IAM role. Replace
   the `[ACCOUNT-ID-FOR-AWS-ACCOUNT-A]` placeholder with the AWS account ID for AWS Account A. <br /> <br />

<br />

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

Your IAM trust policy should be similar to the policy defined below. The IAM policy has two trust relationships, one for
Palette and another for the AWS Account A. <br />

<br />

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::[AWS-ACCOUNT-ID-OF-PALETTE]:root"
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

In your case, the `[AWS-ACCOUNT-ID-OF-PALETTE]` and `[YOUR-EXTERNAL-ID]` placeholders will contain the values you used
while creating the IAM role.

<br />

:::info

Check out
[How to use trust policies with IAM roles](https://aws.amazon.com/blogs/security/how-to-use-trust-policies-with-iam-roles/)
for a deep dive into the IAM trust policies.

:::

10. Copy the IAM role ARN from AWS Account B.

11. Switch back to Palette, and resume the backup location creation wizard. Paste the copied IAM role ARN into the
    **ARN** field.

12. Click on **Validate**. Palette will display a validation status message. If the validation status message indicates
    a success, proceed to the next step. If the validation status message indicates an error, review the error message
    and verify the IAM configurations you provided. Ensure you have provided the correct IAM role ARN, Palette external
    ID, and that the IAM role has the required IAM policy permissions mentioned in the
    [Prerequisites section](#prerequisites).

13. Click on the **Create** button.

You now have a backup location for Palette to use to store the backup of your clusters or workspaces. This backup
location is using AWS STS to authenticate Palette with the S3 bucket in AWS Account B.

### Validate

Use the following steps to validate adding the new backup location.

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Navigate to **Project Settings** and click on **Backup Locations**.

3. The **Backup Locations** page will display a list of all backup locations configured for the current project.

4. Search for the newly added backup location in the list. The presence of the backup location validates that you have
   successfully added a new backup location.

## Next Steps

You can now use the newly added backup location to create a backup of your clusters or workspaces. Refer to the
[Create a Backup](create-cluster-backup.md) guide to learn how to create a backup of your clusters or workspaces.
