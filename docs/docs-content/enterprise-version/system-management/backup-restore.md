---
sidebar_label: "Backup and Restore"
title: "Backup and Restore"
description: "Learn how to enable backup and restore for self-hosted Palette."
icon: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["palette", "management", "self-hosted", "backup", "restore"]
keywords: ["self-hosted", "enterprise"]
---

You can enable backup and restore for your self-hosted Palette cluster to ensure that your Palette configuration data is
backed up and can be restored in case of a disaster or a cluster failure. Palette supports two backup modes:

- File Transfer Protocol (FTP) - Send the backup data of your enterprise cluster to a dedicated FTP server. Refer to the
  [FTP](#ftp) section for more information.

- Amazon Simple Storage Service (S3) - Send the backup data of your enterprise cluster to object storage using AWS S3.
  Refer to the [S3](#s3) section for more information.

:::warning

Backup and Restore is not supported for self-hosted Palette installed through a Helm Chart.

:::

## FTP

Use the following instructions to configure FTP backup for your enterprise cluster.

### Prerequisites

- A dedicated FTP server with sufficient storage space to store the backup data.

- Credentials to access the FTP server.

### Instructions

1. Log in to [Palette](https://console.spectrocloud.com) as an administrator. Refer to the
   [Access the System Console](../system-management/system-management.md#access-the-system-console) section for more
   information.

2. From the left **Main Menu**, select **Administration**.

3. Click on the **Backup/Restore** tab.

4. Select the **FTP** tab and fill out the following fields:

   | **Field**            | **Description**                                                           |
   | -------------------- | ------------------------------------------------------------------------- |
   | **Server**           | The FTP server URL.                                                       |
   | **Directory**        | The directory name for the backup storage.                                |
   | **Username**         | The username to log in to the FTP server.                                 |
   | **Password**         | The password to log in to the FTP server.                                 |
   | **Interval**         | The number of days between backups.                                       |
   | **Retention Period** | The number of days to retain the backup.                                  |
   | **Hours of the day** | The time of the day to take the backup. The time of day is in UTC format. |

5. Click on **Validate** to validate the FTP server configuration. If the validation is successful, the **Save** button
   is enabled. Otherwise, an error message is displayed. In case of an error, correct verify the FTP server
   configuration and click on **Validate** again.

### Validate

Validation is part of the backup configuration wizard. You can verify that a backup initiates at the scheduled time and
is successfully uploaded to the FTP server.

## S3

Use the following instructions to configure S3 backup for your enterprise cluster.

### Prerequisites

- An Amazon Web Services (AWS) account.

- An AWS S3 bucket.

- An AWS IAM user with the following IAM permissions attached. Ensure you replace the bucket name in the `Resource`
  field with the name of your S3 bucket.

  ```json
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Sid": "s3Permissions",
        "Effect": "Allow",
        "Action": [
          "s3:GetObject",
          "s3:ListBucket",
          "s3:DeleteObject",
          "s3:PutObject",
          "s3:AbortMultipartUpload",
          "s3:ListMultipartUploadParts"
        ],
        "Resource": ["arn:aws:s3:::REPLACE_ME_WITH_YOUR_BUCKET_NAME", "arn:aws:s3:::REPLACE*ME_WITH_YOUR_BUCKET_NAME/*"]
      },
      {
        "Sid": "ec2Permissions",
        "Effect": "Allow",
        "Action": [
          "ec2:DescribeVolumes",
          "ec2:DescribeSnapshots",
          "ec2:CreateTags",
          "ec2:CreateVolume",
          "ec2:CreateSnapshot",
          "ec2:DeleteSnapshot"
        ],
        "Resource": ["_"]
      }
    ]
  }
  ```

- Credentials to the IAM user. You need the AWS access key ID and the AWS secret access key.

### Instructions

1. Log into the Palette system console as an administrator. Refer to the
   [Access the System Console](../system-management/system-management.md#access-the-system-console) section for more
   information.

2. From the left **Main Menu**, select **Administration**.

3. Click on the **Backup/Restore** tab.

4. Select the **FTP**tab and fill out the following fields:

   | **Field**            | **Description**                                                           |
   | -------------------- | ------------------------------------------------------------------------- |
   | **Server**           | The FTP server URL.                                                       |
   | **Directory**        | The directory name for the backup storage.                                |
   | **Username**         | The username to log in to the FTP server.                                 |
   | **Password**         | The password to log in to the FTP server.                                 |
   | **Interval**         | The number of days between backups.                                       |
   | **Retention Period** | The number of days to retain the backup.                                  |
   | **Hours of the day** | The time of the day to take the backup. The time of day is in UTC format. |

5. Click on **Validate** to validate the S3 configuration. If the validation is successful, the **Save** button is
   enabled. Otherwise, an error message is displayed. In case of an error, correct verify the S3 configuration and click
   on **Validate** again.

### Validate

Validation is part of the backup configuration wizard. You can validate a backup initiates at the scheduled time and
successfully uploads to the S3 bucket.
