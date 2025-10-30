---
sidebar_label: "Enable Secrets Encryption for EKS Cluster"
title: "Enable Secrets Encryption for EKS Cluster"
description: "Learn how to create an AWS KMS key to encrypt Kubernetes secrets for EKS Clusters."
tags: ["public cloud", "aws", "eks", "kms"]
sidebar_position: 40
---

We encourage using AWS Key Management Service (KMS) to provide envelope encryption of Kubernetes secrets stored in
Amazon Elastic Kubernetes Service (EKS) clusters. This encryption is a defense-in-depth security strategy to protect
sensitive data such as passwords, docker registry credentials, and Transport Layer Security (TLS) keys stored as
[Kubernetes Secrets](https://kubernetes.io/docs/concepts/configuration/secret/).

Palette provides an **Enable encryption** option, which is only available during the cluster creation process. You can
enable secrets encryption when you create an EKS cluster by toggling the **Enable encryption** button and providing the
Amazon Resource Name (ARN) of the KMS key. The **Enable encryption** option is available on the cluster creation
wizard's **Cluster Config** page for EKS.

## Prerequisites

- An AWS account added to Palette. Review [Add AWS Account](./add-aws-accounts/add-aws-accounts.md) for guidance.

- IAM user or role has attached policies listed in [Required IAM Policies](required-iam-policies.md).

- A **PaletteControllersEKSPolicy** created in AWS and attached to the IAM user or role that Palette is using. To create
  this policy, refer to [Controllers EKS Policy](required-iam-policies.md#controllers-eks-policy).

- An AWS KMS key created in the AWS region you intend to deploy cluster to with Palette.

- Ensure the IAM user or role Palette uses has at a minimum, permissions to list, describe, all KMS keys in the account.
  The describe and create grant permissions are only required for the KMS key that Palette uses to encrypt Kubernetes
  secrets.

  - `kms:ListKeys`
  - `kms:ListAliases`
  - `kms:DescribeKey`
  - `kms:CreateGrant`

  <br />

  ```json
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Sid": "Statement1",
        "Effect": "Allow",
        "Action": ["kms:ListKeys", "kms:ListAliases"],
        "Resource": ["*"]
      },
      {
        "Sid": "Statement2",
        "Effect": "Allow",
        "Action": ["kms:DescribeKey", "kms:CreateGrant"],
        "Resource": ["*"]
      }
    ]
  }
  ```

  Check out the
  [Create a KMS Key policy](https://docs.aws.amazon.com/kms/latest/developerguide/key-policy-overview.html) guide for
  more information on key policies.

## Create KMS Key

Use the following steps to configure a KMS key.

1. Log in to AWS console and navigate to the Key Management Service.

2. Select the region where your KMS key policy is created.

   :::warning

   Ensure you create the KMS key in the same region that you intend to deploy EKS clusters through Palette.
   Alternatively, you can create a multi-region KMS key that can be used across different regions. To learn how to
   create a multi-region key, review Amazon’s
   [Multi-Region Keys in AWS KMS](https://docs.aws.amazon.com/kms/latest/developerguide/multi-region-keys-overview.html)
   reference guide.

   :::

3. Create a KMS key of type **Symmetric** and with usage **Encrypt and decrypt**. Check out the AWS guide
   [Creating keys](https://docs.aws.amazon.com/kms/latest/developerguide/create-keys.html#create-symmetric-cmk) for
   guidance.

4. Ensure the IAM user or role that Palette is using has a policy attached with the following required IAM permissions.
   Replace the account ID and the placeholder `REPLACE_ME` with the name of IAM User. If you are using an IAM role,
   change the ARN to end with `:role/REPLACE_ME`.

   ```json
   {
       "Sid": "Allow Palette use of the KMS key",
       "Effect": "Allow",
       "Principal": {
           "AWS": "arn:aws:iam::123456789:user/REPLACE_ME"
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
   ```

   :::info

   If you are using IAM to delegate access to the KMS key, you can continue to do so without modifying the KMS key
   policy. Ensure the Palette IAM User or role have the proper custom IAM policy attached that grants it access to the
   KMS key. Refer to the
   [Using IAM policies with AWS KMS](https://docs.aws.amazon.com/kms/latest/developerguide/iam-policies.html) to learn
   more about managing KMS keys with IAM policies.

   :::

If you need more guidance creating a KMS key, review the AWS
[Creating KMS Keys](https://docs.aws.amazon.com/kms/latest/developerguide/create-cmk-keystore.html) reference guide.

## Validate

You can verify the KMS key is integrated with Palette. When you deploy an EKS cluster on AWS and toggle the **Enable
encryption** option at the Cluster Config step in the wizard, the KMS key ARN displays in the **drop-down Menu**.
