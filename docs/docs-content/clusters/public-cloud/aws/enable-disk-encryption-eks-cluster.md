---
sidebar_label: "Enable Disk Encryption for EKS Cluster"
title: "Enable Disk Encryption for EKS Cluster"
description: "Learn how to create an AWS KMS key to encrypt root volumes for EKS cluster worker nodes."
tags: ["public cloud", "aws", "eks", "kms"]
sidebar_position: 45
---

TBC

## Prerequisites

- An AWS account added to Palette. Review [Add AWS Account](add-aws-accounts.md) for guidance.

- The IAM user or role used by Palette has the required policies attached as listed in [Required IAM Policies](required-iam-policies.md), including the [**PaletteControllersEKSPolicy**](required-iam-policies.md#controllers-eks-policy) policy.

  - The following additional permissions are required for Palette to use the KMS key for disk encryption:

    - `kms:ListKeys`
    - `kms:ListAliases`

    Add these permissions to the **PaletteControllersEKSPolicy** policy in your AWS account.

    <details>

    <summary> Example Policy Snippet </summary>

    ```json hideClipboard {8}
    ...
        {
          "Condition": {
            "ForAnyValue:StringLike": {
              "kms:ResourceAliases": "alias/cluster-api-provider-aws-*"
            }
          },
          "Action": ["kms:CreateGrant", "kms:DescribeKey", "kms:ListKeys", "kms:ListAliases"],
          "Resource": ["*"],
          "Effect": "Allow"
        }
    ...
    ```

    </details>

- An AWS KMS key created in the AWS region you intend to deploy EKS clusters using Palette.

  - The **Key type** must be **Symmetric** and the **Key usage** must be set to **Encrypt and decrypt**.
  - A suitable key policy must be attached to the KMS key. Refer to the [Required AWS KMS key policy for use with encrypted volumes](https://docs.aws.amazon.com/autoscaling/ec2/userguide/key-policy-requirements-EBS-encryption.html) guide for more information on the required key policy.

    <details>

    <summary> Example KMS Key Policy </summary>

    ```json hideClipboard
    {
      "Version": "2012-10-17",
      "Id": "key-consolepolicy-3",
      "Statement": [
        {
          "Sid": "Allow use of the key",
          "Effect": "Allow",
          "Principal": {
            "AWS": "arn:aws:iam::111222333444:role/aws-service-role/autoscaling.amazonaws.com/AWSServiceRoleForAutoScaling"
          },
          "Action": [
            "kms:Encrypt",
            "kms:Decrypt",
            "kms:ReEncrypt*",
            "kms:GenerateDataKey*",
            "kms:DescribeKey"
          ],
          "Resource": "*"
        },
        {
          "Sid": "Allow attachment of persistent resources",
          "Effect": "Allow",
          "Principal": {
            "AWS": "arn:aws:iam::111222333444:role/aws-service-role/autoscaling.amazonaws.com/AWSServiceRoleForAutoScaling"
          },
          "Action": "kms:CreateGrant",
          "Resource": "*",
          "Condition": {
            "Bool": {
              "kms:GrantIsForAWSResource": "true"
            }
          }
        }
      ]
    }
    ```

    </details>

## Enable Disk Encryption

TBC

## Validate

TBC
