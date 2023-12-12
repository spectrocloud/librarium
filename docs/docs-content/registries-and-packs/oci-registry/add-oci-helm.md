---
sidebar_label: "Add OCI Helm Registry"
title: "Add OCI Helm Registry"
description: "Learn how to add your own OCI Helm Registry to Palette"
icon: ""
hide_table_of_contents: false
sidebar_position: 10
---

You can add an OCI type Helm registry to Palette and use the Helm Charts in your cluster profiles. 



## Prerequisites

- You must have a private OCI type Helm registry that supports basic authentication. Public OCI registries are not supported.

- Credentials to access the OCI registry. If you are using an AWS ECR registry, you must have the AWS credentials to an IAM user or add a trust relationship to an IAM role so that Palette can access the registry.

- Tenant admin access to Palette.

- If you are using an AWS ECR registry, ensure you have the following IAM permissions attached to the IAM user or role that you are using to access the registry. You can reduce the `Resource` scope from `*` to the specific Amazon Resource Name (ARN) of the AWS ECR registry you are using..
  
  ```json
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Sid": "VisualEditor0",
        "Effect": "Allow",
        "Action": [
          "ecr-public:DescribeRegistries",
          "ecr:DescribeImageReplicationStatus",
          "ecr:ListTagsForResource",
          "ecr:ListImages",
          "ecr:DescribeRepositories",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetLifecyclePolicy",
          "ecr-public:DescribeImageTags",
          "ecr-public:DescribeImages",
          "ecr:GetRegistryPolicy",
          "ecr-public:GetAuthorizationToken",
          "ecr:DescribeImageScanFindings",
          "ecr:GetLifecyclePolicyPreview",
          "ecr:GetDownloadUrlForLayer",
          "ecr-public:GetRepositoryCatalogData",
          "ecr:DescribeRegistry",
          "ecr:GetAuthorizationToken",
          "ecr-public:GetRepositoryPolicy",
          "ecr-public:DescribeRepositories",
          "ecr:BatchGetImage",
          "ecr:DescribeImages",
          "ecr-public:GetRegistryCatalogData",
          "ecr-public:ListTagsForResource",
          "ecr-public:BatchCheckLayerAvailability",
          "ecr:GetRepositoryPolicy"
        ],
        "Resource": "*"
      }
    ]
  }
  ```

## Add OCI Helm Registry

Use the following steps to add an OCI type Helm registry to Palette. Select the tab that corresponds to the type of OCI registry you are adding.


<Tabs groupId="registry">
<TabItem value="basic" label="Basic">

a

</TabItem>

<TabItem value="aws" label="AWS ECR">

b
</TabItem>


</Tabs>


## Validate


<Tabs groupId="registry">
<TabItem value="basic" label="Basic">

a

</TabItem>

<TabItem value="aws" label="AWS ECR">

b
</TabItem>


</Tabs>