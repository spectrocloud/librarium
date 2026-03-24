---
sidebar_label: "Core IAM Policies"
title: "Core IAM Policies"
description: "How to add core IAM policies to your AWS account for Palette."
hide_table_of_contents: false
tags: ["public cloud", "aws", "iam"]
sidebar_position: 10
---

The following four Identity and Access Management (IAM) policies include all the permissions needed for Palette to
deploy and manage clusters on AWS. Make sure to attach these policies to the IAM User or Role that Palette uses to
access your AWS account.

- If you want to deploy AWS Elastic Kubernetes Service (EKS) clusters, make sure to also attach the
  **PaletteControllersEKSPolicy** on top of the core policies. Check out the
  [Controllers EKS Policy](./additional-iam-policies-specific-use-cases.md#controllers-eks-policy) section to review the
  IAM policy.

- Additional IAM policies may be required depending on the use case. Check out the
  [Additional IAM Policies for Specific Use Cases](./additional-iam-policies-specific-use-cases.md) section for more
  information.

<Tabs queryString="iam-policies">

<TabItem label="PaletteControllerPolicy" value="palette-controller-policy">

<PartialsComponent category="permissions" name="aws-controller-policy" />

</TabItem>

<TabItem label="PaletteControlPlanePolicy" value="palette-control-plane-policy">

<PartialsComponent category="permissions" name="aws-control-plane-policy" />

</TabItem>

<TabItem label="PaletteNodesPolicy" value="palette-nodes-policy">

<PartialsComponent category="permissions" name="aws-nodes-policy" />

</TabItem>

<TabItem label="PaletteDeploymentPolicy" value="palette-deployment-policy">

<PartialsComponent category="permissions" name="aws-deployment-policy" />

</TabItem>

</Tabs>
