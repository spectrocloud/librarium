---
sidebar_label: "Add Backup Location using Static Credentials"
title: "Add Backup Location using Static Credentials"
description: "Learn how to add a backup location in Palette using static access credentials."
hide_table_of_contents: false
sidebar_position: 10
tags: ["clusters", "cluster management", "backup"]
---

This guide provides instructions to add a backup location in Palette using static credentials. Below is an overview of
the steps involved:

1. Create a storage bucket to store the backup files. For example, if you configure the backup location in AWS, you will
   need an S3 bucket.

2. Define the access permissions for the storage bucket and associate the permissions with an IAM entity. The IAM entity
   may be a user, service principal, or role depending on your infrastructure provider.

3. Generate the static credentials for the IAM entity with sufficient permissions to perform bucket-related operations.

4. Share the static credentials with Palette so that it can assume the IAM entity's role to perform bucket-related
   operations.

The following sections provide detailed instructions. Select the environment where you want to create a backup.

- [AWS](#aws)

- [GCP](#gcp)

- [MinIO](#minio)

- [Azure](#azure)

## AWS

### Prerequisites

- An AWS account.

- An S3 bucket in the AWS account. The bucket will store the backup of your clusters or workspaces.

- Add the following IAM policy to your AWS account. Replace the `BUCKET-NAME` placeholder in the policy below with your
  bucket name. Refer to the
  [Creating IAM policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create-console.html) for
  additional guidance. <br /> <br />

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

- Create an IAM user in your AWS account. While creating the IAM user, attach the IAM policy you defined in the previous
  prerequisite item. Refer to the
  [Creating an IAM user in your AWS account](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html)
  guide to learn how to create an IAM user.

- AWS will generate and display an access key for the newly created IAM user. An access key is made of up two parts - an
  _access key ID_ and a _secret access key_. Copy both parts of the access key to a clipboard to use later in this
  guide. AWS will not display the secret access key again.

  If you skip copying the secret access key, refer to the
  [Managing access keys for IAM users](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html)
  guide to learn how to create a new access key.

- If the S3 bucket is using a customer managed AWS Key Management Service (KMS) key for server-side encryption, ensure
  the Palette IAM user has the necessary permissions to access the KMS key. Otherwise, Palette will be unable to put
  objects in the S3 bucket and result in backup or restore failure. Check out the
  [Troubleshooting key access](https://docs.aws.amazon.com/kms/latest/developerguide/policy-evaluation.html) guide to
  learn more about common KMS issues.

  :::tip

  Use the IAM Policy Simulator to verify the IAM role has the necessary permissions to access a customer managed KMS
  key. Refer to the
  [Testing IAM policies with the IAM policy simulator](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_testing-policies.html)
  guide to learn more.

  :::

### Add an AWS S3 Bucket

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Navigate to **Project Settings** and click on **Backup Locations**.

3. Click on the **Add New Backup Location** button.

4. Fill out the input fields listed in the table below.

   | **Configuration Field** | **Value**                                                                                                                                                                                                                                                                                                                 |
   | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Location Name**       | Provide a name of your choice.                                                                                                                                                                                                                                                                                            |
   | **Location Provider**   | Select AWS from the **drop-down** Menu.                                                                                                                                                                                                                                                                                   |
   | **Certificate**         | Optional Service provider certificate.                                                                                                                                                                                                                                                                                    |
   | **S3 Bucket**           | Name of the S3 bucket you created in the object store. The bucket name must be DNS-compliant. For more information, refer to the [Bucket naming rules](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html) defined by AWS.                                                                      |
   | **Region**              | Region where the S3 bucket is hosted. You can check the region code from the [Service endpoints](https://docs.aws.amazon.com/general/latest/gr/s3.html#s3_region) section in the AWS documentation.                                                                                                                       |
   | **S3 URL**              | Optional bucket URL. If you choose to provide a value, refer to the [Methods for accessing a bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-bucket-intro.html#virtual-host-style-url-ex) guide to determine the bucket URL. If you provided an S3 URL, enable the **Force S3 path style** checkbox. |

5. Next, choose the _Credentials_ validation method. If you want to use dynamic credentials through the AWS STS service,
   refer to the [Add a Backup Location using Dynamic Credentials](add-backup-location-dynamic.md) for guided
   instructions.

6. Provide the IAM user's access key if you chose the **Credentials** method. The IAM user must have the necessary IAM
   policy attached, which you defined in the prerequisites section above. The specified policy allows Palette to create
   a backup in the S3 bucket.

7. Click on the **Validate** button. Palette will display a validation status message. If the validation status message
   indicates a success, proceed to the next step. If the validation status message indicates an error, review the error
   message and verify the configurations you provided.

8. Click on the **Create** button.

You have completed configuring and adding a backup location to Palette with static credentials.

### Validate

Use the following steps to validate adding the new backup location.

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Navigate to **Project Settings** and click on **Backup Locations**.

3. The **Backup Locations** page will display a list of all backup locations configured for the current project.

4. Search for the newly added backup location in the list. The presence of the backup location validates that you
   successfully added a new backup location.

## GCP

### Prerequisites

- A GCP account.

- A storage bucket in the GCP account.

- A service account with sufficient permissions to perform the required read and write operations on the bucket. For
  simplicity, you can assign the storage administrator role to the service account to grant complete control of the
  storage bucket. Refer to the
  [IAM roles for Cloud Storage](https://cloud.google.com/storage/docs/access-control/iam-roles) document to learn about
  the available roles.

- JSON credentials for the service account. Refer to the
  [Create access credentials](https://developers.google.com/workspace/guides/create-credentials#service-account) to
  learn how to create the credentials for the service account.

### Add a GCP Bucket

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Navigate to **Project Settings** and click on **Backup Locations**.

3. Click on the **Add New Backup Location** button.

4. Fill out the input fields listed in the table below.

   | **Field**             | **Value**                                                                                                                                                                                    |
   | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Location Name**     | Provide a name of your choice.                                                                                                                                                               |
   | **Location Provider** | Select GCP from the **drop-down** Menu.                                                                                                                                                      |
   | **Bucket**            | The name of the bucket you created in the GCP object store.                                                                                                                                  |
   | **JSON Credentials**  | Provide the JSON credentials for the external authentication of the GCP storage. Ensure the associated service account has sufficient permissions to perform the required bucket operations. |

5. Click on the **Validate** button. Palette will display a validation status message. If the validation status message
   indicates a success, proceed to the next step. If the validation status message indicates an error, review the error
   message and verify the configurations you provided.

6. Click on the **Create** button.

You have completed configuring and adding a backup location to Palette with static credentials.

### Validate

Use the following steps to validate adding the new backup location.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to **Project Settings** and click on **Backup Locations**.

3. The **Backup Locations** page will display a list of all backup locations configured for the current project.

4. Search for the newly added backup location in the list. The presence of the backup location validates that you
   successfully added a new backup location.

## MinIO

### Prerequisites

- A MinIO account.

- An S3-compliant bucket in the MinIO account.

- IAM policy in your MinIO account to authorize a MinIO user to perform the required read and write operations on the
  MinIO bucket. MinIO uses Policy-Based Access Control (PBAC) to control which IAM identities can access the resources
  and what actions the IAM identities are authorized to perform on the specific resources. Refer to the
  [MinIO Access Management](https://min.io/docs/minio/linux/administration/identity-access-management/policy-based-access-control.html#access-management)
  guide to learn more about the IAM policy requirements.

- A MinIO user assigned to the IAM policy defined above. You can learn more about MinIO access management in the
  [MinIO object storage for Kubernetes](https://min.io/docs/minio/kubernetes/upstream/administration/identity-access-management.html)
  documentation.

- An access key for the MinIO user. You can create an access key from the MinIO console. Refer to the
  [MinIO official documentation](https://min.io/docs/minio/kubernetes/upstream/administration/identity-access-management/minio-user-management.html#access-keys)
  to learn about creating access keys.

- An optional service provider x509 certificate.

### Add a MinIO Bucket

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Navigate to the **Project Settings** and click on **Backup Locations**.

3. Click on the **Add New Backup Location** button.

4. Fill out the following input fields. Refer to the table below to learn more.

   | **Field**               | **Value**                                                                   |
   | ----------------------- | --------------------------------------------------------------------------- |
   | **Location Name**       | Provide a name of your choice.                                              |
   | **Location Provider**   | Select MinIO from the drop-down field.                                      |
   | **Certificate**         | Service provider certificate, if your organization prefers it.              |
   | **S3 Bucket**           | The name of the S3 bucket you created in the MinIO object store.            |
   | **Region**              | The region where the MinIO server is configured. Example: `us-east-1`       |
   | **S3 URL**              | The MinIO object storage console URL. Example: `http://12.123.234.567:0000` |
   | **Force S3 path style** | This value is required for MinIO.                                           |

   <br />

   :::warning

   Ensure you check the **Force S3 path style** checkbox. S3 path style is required by Velero to access the MinIO object
   storage. Palette uses [Velero](https://velero.io/docs) to create backups.

   :::

5. Next, provide the access key for the MiniIO user. The access key has two parts - the _access key ID_ and the _secret
   key_.

6. Click on the **Create** button.

You have completed configuring and adding a backup location to Palette with static credentials.

### Validate

Use the following steps to validate adding the new backup location.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to **Project Settings** and click on **Backup Locations**.

3. The **Backup Locations** page will display a list of all backup locations configured for the current project.

4. Search for the newly added backup location in the list. The presence of the backup location validates that you
   successfully added a new backup location.

## Azure

### Prerequisites

- An active Azure cloud account. You will need the following Azure items to complete the backup setup:

  - Tenant ID
  - Subscription ID

- An Azure storage account in the Azure account. You will need to be aware of the values for the following Azure storage
  items:
  - Resource group name
  - Storage account name
  - Stock-Keeping Unit (SKU)

Refer to the
[Create a storage account](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-create?tabs=azure-portal)
guide to learn how to create an Azure storage account

- A container in the Azure Storage account. Refer to the
  [Manage blob containers using the Azure portal](https://learn.microsoft.com/en-us/azure/storage/blobs/blob-containers-portal)
  guide to learn how to create an Azure storage container.

- An Azure service principal with sufficient permissions to perform the required read and write operations on the
  container. You will need the values of the following items:
  - Client ID
  - Client Secret

Check out the
[Work with Azure service principal using the Azure CLI](https://learn.microsoft.com/en-us/cli/azure/create-an-azure-service-principal-azure-cli#what-is-an-azure-service-principal)
guide to learn more about Azure service principals.

### Add an Azure Blob Container

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to **Project Settings** and click on **Backup Locations**.

3. Click on the **Add New Backup Location** button.

4. Fill out the input fields listed in the table below.

   | **Field**              | **Value**                                                                        |
   | ---------------------- | -------------------------------------------------------------------------------- |
   | **Location Name**      | Provide a name of your choice.                                                   |
   | **Location Provider**  | Select Azure from the **drop-down** Menu.                                        |
   | **Container Name**     | Name of the container created in the Azure storage.                              |
   | **Storage Name**       | Name of the Azure storage resource.                                              |
   | **Stock-Keeping Unit** | Azure storage resource SKU.                                                      |
   | **Tenant ID**          | Azure tenant ID.                                                                 |
   | **Subscription ID**    | Azure subscription ID where you created the Azure storage resource.              |
   | **Resource Group:**    | Azure resource group name.                                                       |
   | **Client ID**          | Azure client ID of the service principal.                                        |
   | **Client Secret**      | Azure client secret for the service principal you created for Palette to assume. |

5. Click on the **Validate** button. Palette will display a validation status message. If the validation status message
   indicates a success, proceed to the next step. If the validation status message indicates an error, review the error
   message and verify the configurations you provided.

6. Click on the **Create** button.

You have completed configuring and adding a backup location to Palette with static credentials.

### Validate

Use the following steps to validate adding the new backup location.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to **Project Settings** and click on **Backup Locations**.

3. The **Backup Locations** page will display a list of all backup locations configured for the current project.

4. Search for the newly added backup location in the list. The presence of the backup location validates that you
   successfully added a new backup location.

## Next Steps

You can now use the newly added backup location to create a backup of your clusters or workspaces. Refer to the
[Create a Backup](create-cluster-backup.md) guide to learn how to create a backup of your clusters or workspaces.
