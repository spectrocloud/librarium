---
sidebar_label: "Required IAM Policies"
title: "Required IAM Policies"
description: "A list of required IAM policies that Palette requires."
hide_table_of_contents: false
tags: ["public cloud", "aws", "iam"]
---

Palette requires proper Amazon Web Services (AWS) permissions to operate and perform actions on your behalf. You must
grant these permissions to the Identity and Access Management (IAM) User or Role that you use to connect your AWS
account to Palette.

You have two options for granting permissions to Palette:

- The [Core IAM Policies](./core-iam-policies.md) are a set of AWS-managed and customer-managed policies that grant
  broader permissions for Palette to operate. Using these policies reduces the prerequisites required compared to the
  minimum permissions policies.

- The [Minimum Permissions Policies](./minimum-permissions-policies.md) are a set of customer-managed policies that are
  designed to follow the
  [principle of least privilege](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#grant-least-privilege).
  Use the dynamic policy to allow Palette to operate and create Virtual Private Cloud (VPC) resources as needed, or the
  static policy to deploy clusters within an existing VPC without provisioning or deleting foundational network
  resources.

:::warning

You can attach a maximum of ten managed policies to an IAM User or Role. Exceeding this limit results in cluster
deployment failures. If you have to exceed the limit, consider combining policies into a custom-managed policy. You can
learn more about AWS IAM limits in the
[IAM Quotas](https://docs.aws.amazon.com/us_en/IAM/latest/UserGuide/reference_iam-quotas.html) reference guide.

:::

You can use Palette CLI to verify you have setup the correct permissions. Check out the Palette CLI
[`validate-auth`](../../../../automation/palette-cli/commands/validate-auth.md) command section for more information.

## Roles and Policies

Palette creates and attaches IAM roles and policies to the clusters it deploys. Depending on which type of cluster you
deploy, either AWS Elastic Kubernetes Service (EKS) or Infrastructure as a Service (IaaS) using Elastic Compute Cloud (EC2) instances, Palette creates and attaches different IAM roles and policies.

Select the tab below to review the IAM roles and policies attached to the cluster's IAM role and the node group's IAM
role.

<Tabs queryString="service">
<TabItem label="EKS" value="eks">

When you deploy an EKS cluster using Palette, two IAM roles are created automatically. One IAM role is for the cluster,
and the other IAM role for the worker node group.

The cluster's IAM role is named in the following syntax, `[cluster-name]-iam-service-role`, and the node group's IAM
role is named as `ng-role_worker-pool-[random-string]`. These two IAM roles have customer-managed and AWS-managed IAM
policies. You can attach more IAM policies to any of these IAM roles if needed. The following table lists the IAM
policies attached to the cluster's IAM role and the node group's IAM role.

| **Policy Name**                    | **Type**    | **Attached to the cluster's IAM role?** | **Attached to the node group's IAM role?** | **Description**                                                                          |
| ---------------------------------- | ----------- | --------------------------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------- |
| AmazonEKSClusterPolicy             | AWS managed | ✅                                      | ❌                                         | Provides the cluster permission to manage compute resources.                             |
| AmazonEC2ContainerRegistryReadOnly | AWS managed | ❌                                      | ✅                                         | Provides the node group permission to pull images from Amazon Elastic Container Registry (ECR).                       |
| AmazonEKS_CNI_Policy               | AWS managed | ❌                                      | ✅                                         | Provides the node group permission to manage network resources.                          |
| AmazonEKSWorkerNodePolicy          | AWS managed | ❌                                      | ✅                                         | This policy allows Amazon EKS worker nodes to connect to Amazon EKS Clusters.            |
| AmazonSSMManagedInstanceCore       | AWS managed | ❌                                      | ✅                                         | The policy for Amazon EC2 Role to enable AWS Systems Manager service core functionality. |

In addition to the policies listed above, if you specified other IAM policies during the AWS account registration, those
policies are also attached to the cluster's IAM role and the node group's IAM role.

</TabItem>
<TabItem label="IaaS" value="iaas">

When you deploy an IaaS cluster using Palette, two IAM roles are created automatically. One IAM role is for the cluster
control nodes, and the other IAM role for the worker nodes.

The control plane nodes IAM role is named `control-plane.cluster-api-provider-aws.sigs.k8s.io`, and the node group's IAM
role is named as `nodes.cluster-api-provider-aws.sigs.k8s.io`. These two IAM roles have customer-managed and AWS-managed
IAM policies. You can attach more IAM policies to any of these IAM roles if needed. The following table lists the IAM
policies attached to the cluster's IAM role and the node group's IAM role.

| **Policy name**                                      | **Type**         | **Attached to the control plane IAM role?** | **Attached to the node group's IAM role?** | **Description**                                                                                |
| ---------------------------------------------------- | ---------------- | ------------------------------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| control-plane.cluster-api-provider-aws.sigs.k8s.io   | Customer-managed | ✅                                          | ❌                                         | Provides the control plane nodes access to compute services such as EC, autoscaling, and more. |
| controllers-eks.cluster-api-provider-aws.sigs.k8s.io | Customer-managed | ✅                                          | ❌                                         | Provides the control plane nodes access to EKS services and AWS SSM.                           |
| controllers.cluster-api-provider-aws.sigs.k8s.io     | Customer-managed | ✅                                          | ❌                                         | Provides the control plane nodes access to network resources, S3, and other services.          |
| nodes.cluster-api-provider-aws.sigs.k8s.io           | Customer-managed | ✅                                          | ✅                                         | Provides access to services EC2 and ECR.                                                       |
| AmazonEKSWorkerNodePolicy                            | AWS managed      | ❌                                          | ✅                                         | This policy allows Amazon EKS worker nodes to connect to Amazon EKS Clusters.                  |

In addition to the policies listed above, if you specified other IAM policies during the AWS account registration, those
policies are also attached to the cluster's IAM role and the node group's IAM role. Other policies may also be attached
to the IAM roles depending on the storage layer and network layer pack you choose.

</TabItem>

</Tabs>

:::warning

Be aware that AWS has a default limit of 10 policies per role. If you exceed this limit, the cluster deployment may fail
due to the IAM role policy limit. Request a
[service quota increase](https://docs.aws.amazon.com/servicequotas/latest/userguide/request-quota-increase.html) for the
AWS account to increase the limit.

:::
