---
sidebar_label: "Required IAM Policies"
title: "Required IAM Policies"
description: "A list of required IAM policies that Palette requires."
hide_table_of_contents: false
tags: ["public cloud", "aws", "iam"]
sidebar_position: 50
---

Palette requires proper Amazon Web Services (AWS) permissions to operate and perform actions on your behalf. The
following policies include all the permissions needed for Palette to deploy and manage clusters on AWS.

- **PaletteControllerPolicy**

- **PaletteControlPlanePolicy**

- **PaletteNodesPolicy**

- **PaletteDeploymentPolicy**

Additional IAM policies may be required depending on the use case. For example, AWS Elastic Kubernetes Service (EKS)
requires the **PaletteControllersEKSPolicy**. Check out the [Controllers EKS Policy](#controllers-eks-policy) section to
review the IAM policy.

:::warning

You can attach a maximum of ten managed policies to an IAM User or role. Exceeding this limit will result in cluster
deployment failures. If you find yourself in a scenario where you are exceeding the limit, consider combining policies
into a custom-managed policy. You can learn more about AWS IAM limits in the
[IAM Quotas](https://docs.aws.amazon.com/us_en/IAM/latest/UserGuide/reference_iam-quotas.html) reference guide.

:::

If you want to narrow down the IAM permissions, you can use the [Minimum Permissions](#minimum-permissions-policies)
policies. These policies are designed to follow the
[principle of least privilege](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#grant-least-privilege).
You can also use the Static Policy for deploying clusters within an existing VPC without provisioning or deleting
foundational network resources.

:::tip

You can use Palette CLI to verify you have setup the correct permissions. Check out the Palette CLI
[`validate-auth`](../../../automation/palette-cli/commands/validate-auth.md) command section for more information.

:::

## Core IAM Policies

The four core IAM policies are required for Palette to operate.

<Tabs queryString="iam-policies">

<TabItem label="Controller Policy" value="Controller Policy">

<PartialsComponent category="permissions" name="aws-controller-policy" />

</TabItem>

<TabItem label="Control Plane Policy" value="Control Plane Policy">

<PartialsComponent category="permissions" name="aws-control-plane-policy" />

</TabItem>

<TabItem label="Nodes Policy" value="Nodes Policy">

<PartialsComponent category="permissions" name="aws-nodes-policy" />

</TabItem>

<TabItem label="Deployment Policy" value="Deployment Policy">

<PartialsComponent category="permissions" name="aws-deployment-policy" />

</TabItem>

</Tabs>

## Minimum Permissions Policies

The following policies are designed from the
[principle of least privilege](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#grant-least-privilege).
You can use these policies to narrow the permissions Palette requires to operate instead of using the
[Core IAM Policies](#core-iam-policies).

The **Minimum Dynamic Permissions** grants broad permissions across EC2, VPC, and Elastic Container Registry (ECR),
allowing complete control over the lifecycle of virtual network and compute resources. This includes creating,
modifying, and deleting VPCs, subnets, internet gateways, and route tables, as well as managing Docker images in ECR.

In contrast, the **Static Policy** is more restrictive, omitting permissions for creating and deleting core VPC
components and excluding ECR access. However, it includes additional permissions for managing EC2 volumes and accessing
S3 bucket encryption configurations.

Both policies provide similar access to CloudFormation, Elastic Load Balancing, IAM roles, and Secrets Manager. However,
the **Dynamic Policy** supports full EC2 and network resource control, while the **Static Policy** is tailored for
managing existing infrastructure without provisioning or deleting foundational network resources.

<Tabs queryString="min-permissions">
<TabItem label="Minimum Dynamic Permissions" value="Minimum Dynamic Permissions">

The following policy allows Palette to operate and create VPC resources as needed while retaining minimal permissions
for deploying clusters through Palette.

<PartialsComponent category="permissions" name="aws-dynamic-permissions" />

</TabItem>

<TabItem label="Minimum Static Permissions" value="Minimum Static Permissions">

The following policy allows Palette to operate within an existing VPC while retaining minimal permissions for deploying
clusters through Palette.

<PartialsComponent category="permissions" name="aws-static-permissions" />

</TabItem>

</Tabs>

:::warning

The following are important points to be aware of.

- These permissions specified do not include all the permissions required for all possible use cases and for taking full
  advantage of all Palette features. Additional permissions may be required based on the specific use case.

- Ensure that the IAM Role or IAM User created contain all the core policies defined above, or one of the minimum
  permissions policies.

- These IAM policies cannot be used as an inline policy, as it exceeds the 2048 non-whitespace character limit by AWS.
  Break policy into multiple inline policies or create new managed policies.

- The following IAM warning is expected and can be ignored:

> These policies define some actions, resources, or conditions that do not provide permissions. _To grant access,
> policies must have an action that has an applicable resource or condition_.

:::

## Controllers EKS Policy

If you plan to deploy AWS EKS host clusters, make sure to attach the **PaletteControllersEKSPolicy** on top of the
[Core IAM](#core-iam-policies) or [Minimum Permissions](#minimum-permissions-policies) policies.

<PartialsComponent category="permissions" name="aws-eks-controller-policy" />

## Host Resource Groups Policy

If you plan to deploy AWS IaaS clusters on
[Amazon EC2 Dedicated Hosts](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/dedicated-hosts-overview.html), you
must attach the **PaletteHostResourceGroupsPolicy** on top of the [Core IAM](#core-iam-policies) or
[Minimum Permissions](#minimum-permissions-policies) policies.

<PartialsComponent category="permissions" name="aws-host-resource-groups-policy" />

## Global Role Additional Policies

There may be situations where additional node-level policies must be added to your deployment. For instance, when you
create a host cluster with the **AWS EBS CSI** storage layer, ensure **AmazonEBSCSIDriverPolicy** is included. To add
additional node-level policies, switch to the **Tenant Admin** project, and click on the **Tenant Settings** on the
**Main Menu**. Click on **Cloud Accounts**. Add an account if one does not exists. After validation of the AWS
credentials, ensure `Add IAM policies` are enabled. You can specify additional amazon resource names (ARN) to be
attached. The attached policies will be included to all the clusters launched with this specific AWS cloud Account.

**AmazonEBSCSIDriverPolicy:**

<PartialsComponent category="permissions" name="aws-ebs-csi-driver-policy" />

## Roles and Policies

Palette creates and attaches IAM roles and policies to the clusters it deploys. Depending on which type of cluster you
deploy, either AWS EKS or IaaS (using EC2 instances), Palette creates and attaches different IAM roles and policies.

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
| AmazonEC2ContainerRegistryReadOnly | AWS managed | ❌                                      | ✅                                         | Provides the node group permission to pull images from Amazon ECR.                       |
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
