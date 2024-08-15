---
sidebar_label: "AWS-EBS"
title: "AWS EBS"
description: "AWS EBS CSI pack for AWS Clusters"
type: "integration"
category: ["storage", "amd64", "fips"]
sidebar_class_name: "hide-from-sidebar"
tags: ["packs", "aws-ebs", "storage"]
---

## Versions Supported

<Tabs queryString="parent">

<TabItem label="1.30.x" value="1.30.x">

### KMS Encryption Policy

If you want to use KMS encryption, you must attach the following IAM policy to the Palette IAM role that is used to
create the cluster.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "VisualEditor0",
      "Effect": "Allow",
      "Action": ["kms:GenerateDataKeyWithoutPlaintext", "kms:CreateGrant"],
      "Resource": "*"
    }
  ]
}
```

</TabItem>

<TabItem label="1.28.x" value="1.28.x">

If you want to use KMS encryption, you must attach the following IAM policy to the Palette IAM role that is used to
create the cluster.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "VisualEditor0",
      "Effect": "Allow",
      "Action": ["kms:GenerateDataKeyWithoutPlaintext", "kms:CreateGrant"],
      "Resource": "*"
    }
  ]
}
```

</TabItem>

<TabItem label="1.26.x" value="1.26.x">

If you want to use KMS encryption, you must attach the following IAM policy to the Palette IAM role that is used to
create the cluster.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "VisualEditor0",
      "Effect": "Allow",
      "Action": ["kms:GenerateDataKeyWithoutPlaintext", "kms:CreateGrant"],
      "Resource": "*"
    }
  ]
}
```

</TabItem>

<TabItem label="1.24.x" value="1.24.x">

If you want to use KMS encryption, you must attach the following IAM policy to the Palette IAM role that is used to
create the cluster.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "VisualEditor0",
      "Effect": "Allow",
      "Action": ["kms:GenerateDataKeyWithoutPlaintext", "kms:CreateGrant"],
      "Resource": "*"
    }
  ]
}
```

</TabItem>
</Tabs>

## Terraform

Use the following Terraform snippet to reference the AWS EBS CSI pack in your Terraform template. Update the version
number as needed.

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "aws-ebs-csi" {
  name    = "csi-aws-ebs"
  version = "1.30.0"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```
