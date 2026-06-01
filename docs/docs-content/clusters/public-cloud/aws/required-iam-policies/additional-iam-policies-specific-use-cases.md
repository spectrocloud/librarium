---
sidebar_label: "Additional IAM Policies"
title: "Additional IAM Policies for Specific Use Cases"
description: "How to add additional IAM policies for specific use cases to your AWS account for Palette."
hide_table_of_contents: false
tags: ["public cloud", "aws", "iam"]
sidebar_position: 30
---

The following sections list additional Identity and Access Management (IAM) policies that may be required for specific
use cases.

## Controllers EKS Policy

If you plan to deploy Amazon Web Services (AWS) Elastic Kubernetes Service (EKS) host clusters, make sure to attach the
**PaletteControllersEKSPolicy** on top of the [Core IAM Policies](./core-iam-policies.md).

If you are using the [Minimum Permissions Policies](./minimum-permissions-policies.md) for EKS (static or dynamic), this
is _not_ required.

<PartialsComponent category="permissions" name="aws-eks-controller-policy" />

## Global Role Additional Policies

There may be situations where additional node-level policies must be added to your deployment. For instance, when you
create a host cluster with the **AWS EBS CSI** storage layer, ensure **AmazonEBSCSIDriverPolicy** is included.

This is _not_ required when using [Minimum Permissions Policies](./minimum-permissions-policies.md).

Use the following steps to add node-level policies.

1. Log in to Palette.
2. Switch to the **Tenant Admin** project, and click on the **Tenant Settings** on the main menu.
3. Click on **Cloud Accounts**.
4. Add an AWS account if one does not exist.
5. After validation of the AWS credentials, ensure `Add IAM policies` are enabled. You can specify additional Amazon
   Resource Names (ARNs) to be attached. The attached policies will be included to all the clusters launched with this
   specific AWS cloud Account.

**AmazonEBSCSIDriverPolicy:**

<PartialsComponent category="permissions" name="aws-ebs-csi-driver-policy" />

## Host Resource Groups Policy

If you plan to deploy AWS IaaS clusters on
[Amazon Elastic Compute Cloud (EC2) Dedicated Hosts](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/dedicated-hosts-overview.html),
you must attach the **PaletteHostResourceGroupsPolicy** on top of the [Core IAM Policies](./core-iam-policies.md) or
[Minimum Permissions Policies](./minimum-permissions-policies.md).

<PartialsComponent category="permissions" name="aws-host-resource-groups-policy" />

## EKS Pod Identity with Minimum Permissions Policies

:::info

These permissions have been included in the prerequisites steps for enabling EKS Pod Identity in the
[Add AWS Accounts](../add-aws-accounts.md) guide and are mentioned here for posterity and reference.

:::

If you are using [Minimum Permissions Policies](./minimum-permissions-policies.md) for EKS (static or dynamic) and you
want to enable EKS Pod Identity, the following permissions policy must also be assigned to the IAM role or IAM target
role created for Palette (for example, `SpectroCloudPaletteRole` or `SpectroCloudPaletteTargetRole`).

<!-- prettier-ignore-start -->

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "eks:DescribeAddonVersions",
        "eks:CreateAddon",
        "eks:UpdateAddon"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": ["iam:PassRole"],
      "Resource": "*"
    }
  ]
}
```

<!-- prettier-ignore-end -->
