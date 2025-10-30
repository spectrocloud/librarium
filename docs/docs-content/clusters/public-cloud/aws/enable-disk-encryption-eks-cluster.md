---
sidebar_label: "Enable Disk Encryption for EKS Cluster"
title: "Enable Disk Encryption for EKS Cluster"
description: "Learn how to use an AWS KMS key to encrypt root volumes for EKS cluster worker nodes."
tags: ["public cloud", "aws", "eks", "kms"]
sidebar_position: 45
---

Palette allows you to enable encryption on Elastic Block Store (EBS) root volumes for Elastic Kubernetes Service (EKS)
cluster worker nodes using AWS Key Management Service (KMS) keys, specifically customer managed keys.

Once disk encryption is enabled, all current and new worker nodes in the cluster will have their root volumes encrypted
using the specified KMS key. This includes any disk changes made to the worker node pools using
[node pool customization](./eks.md#cloud-configuration-settings).

Enabling disk encryption on an existing cluster will trigger a
[worker node pool repave](../../cluster-management/node-pool.md#repave-behavior-and-configuration), which will replace
the existing worker nodes with new nodes that have encrypted root volumes. This may cause temporary downtime for
workloads operating on the cluster, so ensure you have planned for this before proceeding.

## Prerequisites

- An AWS account added to Palette. Review [Add AWS Account](./add-aws-accounts/add-aws-accounts.md) for guidance.

- The IAM user or role used by Palette has the required policies attached as listed in
  [Required IAM Policies](required-iam-policies.md), including the
  [**PaletteControllersEKSPolicy**](required-iam-policies.md#controllers-eks-policy) policy.

  - The following additional permissions are required for Palette to list and use the KMS key for disk encryption. Add
    these permissions to the **PaletteControllersEKSPolicy** policy in your AWS account:

    - `kms:ListKeys`
    - `kms:ListAliases`

    <br />

    <details>

    <summary> Example PaletteControllersEKSPolicy Snippet </summary>

    ```json hideClipboard {11-12}
    ...
        {
          "Condition": {
            "ForAnyValue:StringLike": {
              "kms:ResourceAliases": "alias/cluster-api-provider-aws-*"
            }
          },
          "Action": [
            "kms:CreateGrant",
            "kms:DescribeKey",
            "kms:ListKeys",
            "kms:ListAliases"
          ],
          "Resource": [
            "*"
          ],
          "Effect": "Allow"
        }
    ...
    ```

    </details>

- A KMS customer managed key created in the AWS region you intend to deploy EKS clusters using Palette. You will need to
  provide the [key ID](https://docs.aws.amazon.com/kms/latest/developerguide/find-cmk-id-arn.html) when enabling disk
  encryption in Palette. The KMS key must meet the following requirements:

  - Key type = **Symmetric**
  - Key usage = **Encrypt and decrypt**
  - A key policy that gives the **AWSServiceRoleForAutoScaling** service-linked role permissions to use the KMS key.
    Refer to the
    [Required AWS KMS key policy for use with encrypted volumes](https://docs.aws.amazon.com/autoscaling/ec2/userguide/key-policy-requirements-EBS-encryption.html)
    guide for detailed information on the required key policy.

    <details>

    <summary> Example Key Policy </summary>

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
          "Action": ["kms:Encrypt", "kms:Decrypt", "kms:ReEncrypt*", "kms:GenerateDataKey*", "kms:DescribeKey"],
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

<Tabs>

<TabItem value="new-cluster-profile" label="New Cluster Profile">

1. Log in to [Palette](https://console.spectrocloud.com).

2. In the left main menu, click **Profiles**.

3. Create a new cluster profile for an AWS EKS cluster. Refer to the
   [Create a Cluster Profile](../../../profiles/cluster-profiles/create-cluster-profiles/create-cluster-profiles.md)
   guide for more information.

4. Once you have configured your profile and are viewing the **Profile Layers** step, click on the **Kubernetes** layer
   to edit this pack.

5. Under **Pack Details**, select **Values** and use the YAML editor to add the following configuration. Replace
   `<kms-key-id>` with the key ID of your AWS KMS key.

   ```yaml
   cloud:
     aws:
       encrypted: true
       encryptionKey: <kms-key-id>
   ```

   :::info

   The `cloud` section needs to be added at the top level of the YAML file, not nested under any other section.

   :::

6. Click **Confirm Updates** once you have added the configuration.

7. On the **Profile Layers** step, click **Next**.

8. Click **Finish Configuration**.

You can now use this cluster profile to [create a new EKS cluster](./eks.md) with disk encryption enabled. Wait until
the new cluster is fully provisioned before proceeding to [validate the disk encryption](#validate).

</TabItem>

<TabItem value="existing-cluster" label="Existing Cluster">

1. Log in to [Palette](https://console.spectrocloud.com).

2. In the left main menu, click **Profiles**.

3. Locate and select your EKS cluster profile.

4. Create a new version of your cluster profile. Refer to the
   [Version a Cluster Profile](../../../profiles/cluster-profiles/modify-cluster-profiles/version-cluster-profile.md)
   guide for more information.

5. Click on the **Kubernetes** layer to edit the pack.

6. Under **Pack Details**, select **Values** and use the YAML editor to add the following configuration. Replace
   `<kms-key-id>` with the key ID of your AWS KMS key.

   ```yaml
   cloud:
     aws:
       encrypted: true
       encryptionKey: <kms-key-id>
   ```

   :::info

   The `cloud` section needs to be added at the top level of the YAML file, not nested under any other section.

   :::

7. Click **Confirm Updates** once you have added the configuration.

8. On the **Cluster Profile** page, click **Save Changes**.

9. In the left main menu, click **Clusters**.

10. Locate and select the EKS cluster you want to enable disk encryption on.

11. Click on the **Profile** tab.

12. Click the version drop-down menu for the infrastructure layers and select the new version of the cluster profile you
    just created, then click **Review & Save**.

13. In the pop-up window, click **Review changes in Editor**.

14. In the configuration diff window, review the configuration changes, then click **Update**.

    :::caution

    Once you click **Update**, a
    [worker node pool repave](../../cluster-management/node-pool.md#repave-behavior-and-configuration) is triggered,
    which will cause the worker nodes to be replaced with new nodes that have encrypted root volumes. This may cause
    temporary downtime for workloads operating on the cluster. Ensure you have planned for this downtime before
    proceeding.

    :::

15. Wait for the repave to complete before [validating the changes](#validate).

</TabItem>

</Tabs>

## Validate

1. Log in to the [Amazon EKS console](https://console.aws.amazon.com/eks/home#/clusters).

2. Find and click on your EKS cluster.

3. Click on the **Compute** tab and click on one of your worker pools within the **Node Groups** section.

4. In the **Node group configuration** section, click **Launch template** to view the details of the launch template
   used by the worker pool.

5. In the **Launch template version details** section, select the **Storage** tab.

6. Verify that the volumes are encrypted and that the **Key** is set to the KMS key ID you specified in the cluster
   profile.

   ![Example of encrypted volume in EKS launch template](/public-cloud_aws_enable-disk-encryption-eks-cluster_aws-encryption-validation.webp)
