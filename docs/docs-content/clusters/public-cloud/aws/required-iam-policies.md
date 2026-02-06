---
sidebar_label: "Required IAM Policies"
title: "Required IAM Policies"
description: "A list of required IAM policies that Palette requires."
hide_table_of_contents: false
tags: ["public cloud", "aws", "iam"]
sidebar_position: 50
---

Palette requires proper Amazon Web Services (AWS) permissions to operate and perform actions on your behalf. These
permissions must be granted to the IAM User or IAM Role that you use to connect your AWS account to Palette.

There are two options for granting permissions to Palette. You can use the [Core IAM Policies](#core-iam-policies) or
the [Minimum Permissions Policies](#minimum-permissions-policies):

- The Core IAM policies are a set of AWS managed and customer-managed policies that grant broad permissions for Palette
  to operate.

- The Minimum Permissions policies are a set of customer-managed policies that are designed to follow the
  [principle of least privilege](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#grant-least-privilege).
  Use the dynamic policy to allow Palette to operate and create VPC resources as needed or the static policy to deploy
  clusters within an existing VPC without provisioning or deleting foundational network resources.

:::warning

You can attach a maximum of ten managed policies to an IAM User or Role. Exceeding this limit will result in cluster
deployment failures. If you find yourself in a scenario where you are exceeding the limit, consider combining policies
into a custom-managed policy. You can learn more about AWS IAM limits in the
[IAM Quotas](https://docs.aws.amazon.com/us_en/IAM/latest/UserGuide/reference_iam-quotas.html) reference guide.

:::

:::tip

You can use Palette CLI to verify you have setup the correct permissions. Check out the Palette CLI
[`validate-auth`](../../../automation/palette-cli/commands/validate-auth.md) command section for more information.

:::

## Core IAM Policies

The following core IAM policies include all the permissions needed for Palette to deploy and manage clusters on AWS:

- **PaletteControllerPolicy**
- **PaletteControlPlanePolicy**
- **PaletteNodesPolicy**
- **PaletteDeploymentPolicy**

If you want to deploy AWS EKS clusters, make sure to also attach the **PaletteControllersEKSPolicy** on top of the core
policies. Check out the [Controllers EKS Policy](#controllers-eks-policy) section to review the IAM policy.

Additional IAM policies may be required depending on the use case. Check out the
[Additional IAM Policies for Specific Use Cases](#additional-iam-policies-for-specific-use-cases) section for more
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

## Minimum Permissions Policies

The following policies are designed from the
[principle of least privilege](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#grant-least-privilege).
You can use these policies to narrow the permissions Palette requires to operate instead of using the
[Core IAM Policies](#core-iam-policies).

After adding these policies to your IAM User or Role, you must also create the required CloudFormation stack for Palette
manually in your AWS region. Finally, you must configure the Kubernetes layer of your cluster profiles to use the
manually created CloudFormation stack instead of allowing Palette to manage the stack automatically.

<!-- prettier-ignore-start -->

:::info

If you are wanting to use minimum permissions policies for deploying AWS IaaS clusters, you must use the
<VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes" /> pack for the
Kubernetes layer of your cluster profiles.

This is because the required `manageCloudFormationStackManually` property to use the manually created CloudFormation
stack is only supported in this pack.

:::

<!-- prettier-ignore-end -->

### Add Minimum Permissions Policies to IAM User or Role

Add at least one or more of these policies to your IAM User or Role based on your use case:

- **Minimum IaaS Dynamic Permissions** allows full lifecycle provisioning and management of EC2, VPC, and load balancing
  resources, with IAM access limited to passing Cluster API–managed roles and scoped Secrets Manager usage.

- **Minimum IaaS Static Permissions** allows management of EC2 instances, security groups, and load balancers within
  existing VPC infrastructure, while restricting core network provisioning and limiting IAM access to Cluster
  API–managed roles with scoped Secrets Manager usage.

- **Minimum EKS Dynamic Permissions** allows full lifecycle provisioning of EKS clusters and node groups, including
  required EC2 and VPC resources, with scoped IAM permissions for OIDC provider management and Cluster API role usage to
  enable IRSA.

- **Minimum EKS Static Permissions** allows management of EKS clusters and node groups within pre-existing EC2 and VPC
  infrastructure, with restricted network provisioning and scoped IAM permissions for OIDC provider management and
  Cluster API role usage to enable IRSA.

<Tabs queryString="min-permissions">

<TabItem label="Minimum IaaS Dynamic Permissions" value="minimum-iaas-dynamic-permissions">

The following policy allows Palette to operate and create VPC resources as needed while retaining minimal permissions
for deploying AWS IaaS clusters through Palette.

<PartialsComponent category="permissions" name="aws-iaas-dynamic-permissions" />

</TabItem>

<TabItem label="Minimum IaaS Static Permissions" value="minimum-iaas-static-permissions">

The following policy allows Palette to operate within an existing VPC while retaining minimal permissions for deploying
AWS IaaS clusters through Palette.

<PartialsComponent category="permissions" name="aws-iaas-static-permissions" />

</TabItem>

<TabItem label="Minimum EKS Dynamic Permissions" value="minimum-eks-dynamic-permissions">

The following policy allows Palette to operate and create VPC resources as needed while retaining minimal permissions
for deploying AWS EKS clusters through Palette.

<PartialsComponent category="permissions" name="aws-eks-dynamic-permissions" />

</TabItem>

<TabItem label="Minimum EKS Static Permissions" value="minimum-eks-static-permissions">

The following policy allows Palette to operate within an existing VPC while retaining minimal permissions for deploying
AWS EKS clusters through Palette.

<PartialsComponent category="permissions" name="aws-eks-static-permissions" />

</TabItem>

</Tabs>

:::warning

The following are important points to be aware of.

- These permissions specified do not include all the permissions required for all possible use cases and for taking full
  advantage of all Palette features. Additional permissions may be required based on the specific use case. Check out
  the [Additional IAM Policies for Specific Use Cases](#additional-iam-policies-for-specific-use-cases) section for more
  information.

- These IAM policies cannot be used as an inline policy, as it exceeds the 2048 non-whitespace character limit by AWS.
  Break policy into multiple inline policies or create new managed policies.

- The following IAM warning is expected and can be ignored:

  > These policies define some actions, resources, or conditions that do not provide permissions. _To grant access,
  > policies must have an action that has an applicable resource or condition_.

:::

### Create CloudFormation Stacks for Palette

When using the minimum permissions policies, you must manually create the CloudFormation stack that Palette uses to
create the required [CAPA](https://github.com/kubernetes-sigs/cluster-api-provider-aws) roles. This is not required when
using the [core policies](#core-iam-policies), as the stack is created automatically using the more permissive policies.

1. Use the following command to create a file named `palette-cloudformation-input-template.yaml` with the necessary
   CloudFormation template for creating the required CAPA roles.

   <PartialsComponent category="permissions" name="aws-palette-cloud-formation-input-template" />

2. Once the file is created, use the following steps in the AWS Console or AWS CLI to create the CloudFormation stack.

   <Tabs queryString="cfn-stack">

   <TabItem label="AWS Console" value="aws-console">

   1. Log in to the [AWS Management Console](https://aws.amazon.com/console/) and navigate to the **CloudFormation**
      service.

   2. Create a new stack by clicking on the **Create stack** button and selecting **With new resources (standard)**.

   3. Leave the **Choose an existing template** option selected, and under the **Specify template** section, select
      **Upload a template file**. Click **Choose file** and select the `palette-cloudformation-input-template.yaml` file
      you created earlier. Click **Next**.

   4. Provide the **Stack name** as `cluster-api-provider-aws-sigs-k8s-io` and click **Next**.

   5. On the **Configure stack options** page, check the box for **I acknowledge that AWS CloudFormation might create
      IAM resources with customized names**.

      Configure any additional options as needed and click **Next**.

   6. Review the stack configuration and click **Submit** to create the CloudFormation stack.

   7. Wait for the stack creation to complete. You can monitor the progress in the CloudFormation console.

   </TabItem>

   <TabItem label="AWS CLI" value="aws-cli">

   1. Use the following command to create the CloudFormation stack using AWS CLI. Make sure to replace `<aws-region>`
      with the AWS region you are using for your cluster deployments.

      This command assumes you are in the same directory where the `palette-cloudformation-input-template.yaml` file is
      located.

      ```bash
      aws cloudformation create-stack \
        --stack-name cluster-api-provider-aws-sigs-k8s-io \
        --template-body file://palette-cloudformation-input-template.yaml \
        --capabilities CAPABILITY_NAMED_IAM \
        --region <aws-region>
      ```

      ```shell title="Example output"
      {
          "StackId": "arn:aws:cloudformation:us-west-1:123456789012:stack/cluster-api-provider-aws-sigs-k8s-io/8cc59d10-0364-11f1-83cd-0affdad4978f"
      }
      ```

   2. Wait for the stack creation to complete. You can monitor the progress in the
      [CloudFormation console](https://console.aws.amazon.com/cloudformation/home).

   </TabItem>

   </Tabs>

### Enable Manual CloudFormation Stack Management

After creating the CloudFormation stack, you must configure the Kubernetes layer of your cluster profiles to use the
manually created stack instead of allowing Palette to manage the stack automatically.

<Tabs queryString="cluster-profile">

<TabItem label="AWS IaaS Cluster Profiles" value="aws-iaas-cluster-profiles">

:::info

Only the <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes" /> pack
supports the `manageCloudFormationStackManually` configuration.

:::

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Profiles**..

3. Choose an existing cluster profile or
   [create a new cluster profile](../../../profiles/cluster-profiles/create-cluster-profiles/create-cluster-profiles.md).
   For more information on cluster profiles, refer to the
   [cluster profiles](../../../profiles/cluster-profiles/cluster-profiles.md) page.

4. Once in the cluster profile overview with all the layers listed, select the Kubernetes layer to view the **Edit
   Pack** page.

5. In the YAML editor, add the `manageCloudFormationStackManually` field and set the value to `true` as shown below.

   ```yaml {5-6}
   pack:
   ---
   kubeadmconfig:
   ---
   manageCloudFormationStackManually:
     enabled: true
   ```

6. Select **Confirm Updates** to save the changes to the Kubernetes layer.

7. Click **Save Changes** to save the cluster profile.

</TabItem>

<TabItem label="AWS EKS Cluster Profiles" value="aws-eks-cluster-profiles">

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Profiles**..

3. Choose an existing cluster profile or
   [create a new cluster profile](../../../profiles/cluster-profiles/create-cluster-profiles/create-cluster-profiles.md).
   For more information on cluster profiles, refer to the
   [cluster profiles](../../../profiles/cluster-profiles/cluster-profiles.md) page.

4. Once in the cluster profile overview with all the layers listed, select the Kubernetes layer to view the **Edit
   Pack** page.

5. In the YAML editor, add the `manageCloudFormationStackManually` field and set the value to `true` as shown below.

   ```yaml {7-8}
   pack:
   ---
   managedControlPlane:
   ---
   managedMachinePool:
   ---
   manageCloudFormationStackManually:
     enabled: true
   ```

6. If you want to provide a different role for the Control Plane and Worker Node pools, you can specify the role names
   in the `managedControlPlane` and `managedMachinePool` sections as shown below. If you do not specify role names, the
   default role names created by the CloudFormation stack will be used.

   ```yaml title="Example role names" {4,7}
   pack:
   ---
   managedControlPlane:
     roleName: "eks-controlplane.cluster-api-provider-aws.sigs.k8s.io"
   ---
   managedMachinePool:
     roleName: "eks-nodegroup.cluster-api-provider-aws.sigs.k8s.io"
   ---
   manageCloudFormationStackManually:
     enabled: true
   ```

7. Select **Confirm Updates** to save the changes to the Kubernetes layer.

8. Click **Save Changes** to save the cluster profile.

</TabItem>

</Tabs>

#### IAM Role Naming Requirements for AWS EKS

TBD: Add instructions to configure the IAM roles for the control plane and worker nodes when using the minimum
permissions policies for AWS EKS clusters.

## Additional IAM Policies for Specific Use Cases

### Controllers EKS Policy

If you plan to deploy AWS EKS host clusters, make sure to attach the **PaletteControllersEKSPolicy** on top of the
[Core IAM](#core-iam-policies). If you are using the [minimum permissions policies](#minimum-permissions-policies) for
EKS (static or dynamic), this is _not_ required.

<PartialsComponent category="permissions" name="aws-eks-controller-policy" />

### Host Resource Groups Policy

If you plan to deploy AWS IaaS clusters on
[Amazon EC2 Dedicated Hosts](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/dedicated-hosts-overview.html), you
must attach the **PaletteHostResourceGroupsPolicy** on top of the [Core IAM](#core-iam-policies) or
[Minimum Permissions](#minimum-permissions-policies) policies.

<PartialsComponent category="permissions" name="aws-host-resource-groups-policy" />

### Global Role Additional Policies

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
