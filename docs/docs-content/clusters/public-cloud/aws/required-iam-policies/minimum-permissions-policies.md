---
sidebar_label: "Minimum Permissions Policies"
title: "Minimum Permissions Policies"
description: "How to add minimum permissions policies to your AWS account for Palette."
hide_table_of_contents: false
tags: ["public cloud", "aws", "iam"]
sidebar_position: 20
toc_max_heading_level: 4
---

The following policies are designed from the
[principle of least privilege](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#grant-least-privilege).
You can use these policies to narrow the permissions Palette requires to operate instead of using the
[Core IAM Policies](./core-iam-policies.md).

## Step 1: Add Minimum Permissions Policies to IAM User or Role

Create an IAM User or Role with at least one of the policies listed based on your use case.

<Tabs queryString="min-permissions">

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

</Tabs>

:::warning

The following are important points to be aware of.

- These permissions specified do not include all the permissions required for all possible use cases and for taking full
  advantage of all Palette features. Additional permissions may be required based on the specific use case. Review the
  [Additional IAM Policies for Specific Use Cases](./additional-iam-policies-specific-use-cases.md) section for more
  information.

- These IAM policies cannot be used as an inline policy, as it exceeds the 2048 non-whitespace character limit by AWS.
  Break policy into multiple inline policies or create new managed policies.

- The following IAM warning is expected and can be ignored.

  > These policies define some actions, resources, or conditions that do not provide permissions. _To grant access,
  > policies must have an action that has an applicable resource or condition_.

:::

## Step 2: Choose CloudFormation Stack Management Option

Once you have created the IAM User or Role, there are two options for using minimum permissions policies:

- _Option 1_ - If you want Palette to manage the CloudFormation stack automatically, add the additional policies listed
  in the [Option 1: Automatic CloudFormation Stack Management](#option-1-automatic-cloudformation-stack-management)
  section.

- _Option 2_ - If you want to manage the CloudFormation stack manually and avoid adding additional permissions, follow
  the steps in the [Option 2: Manual CloudFormation Stack Management](#option-2-manual-cloudformation-stack-management)
  section to create the stack and configure your cluster profiles to use it.

<!-- prettier-ignore-start -->

  :::info

  If you want to use option 2 for deploying AWS Infrastructure as a Service (IaaS) clusters, you must use the
  <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes" /> pack for the
  Kubernetes layer of your cluster profiles.

  Only the PXK pack supports the `manageCloudFormationStackManually` property required to reference a manually
  created CloudFormation stack.

  :::

<!-- prettier-ignore-end -->

### Option 1: Automatic CloudFormation Stack Management

Assign the following additional permissions policy on top of the minimum permissions policies to your IAM User or Role.
These permissions allow Palette to manage the creation and lifecycle of the CloudFormation stack used for provisioning
the required [Cluster API Provider AWS (CAPA)](https://github.com/kubernetes-sigs/cluster-api-provider-aws) roles
automatically.

<PartialsComponent category="permissions" name="aws-cloudformation-stack-permissions" />

### Option 2: Manual CloudFormation Stack Management

After adding the minimum permissions policies to your IAM User or Role, you must perform the following additional steps
in the sections listed.

1. [Create CloudFormation Stacks for Palette](#create-cloudformation-stacks-for-palette).

2. [Configure Cluster Profiles for Manual CloudFormation Stack Management](#configure-cluster-profiles-for-manual-cloudformation-stack-management).

#### Create CloudFormation Stacks for Palette

When using the minimum permissions policies, you must manually create the CloudFormation stack that Palette uses to
create the required [Cluster API Provider AWS (CAPA)](https://github.com/kubernetes-sigs/cluster-api-provider-aws)
roles.

1. Create a file named `palette-cloudformation-input-template.yaml` and copy the contents of the following
   CloudFormation template. This template is used for creating the required CAPA roles.

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

   1. From the same directory where the `palette-cloudformation-input-template.yaml` file is located, execute the
      following command to create the CloudFormation stack using AWS CLI. Replace `<aws-region>` with the AWS region you
      are using for your cluster deployments.

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

#### Configure Cluster Profiles for Manual CloudFormation Stack Management

After creating the CloudFormation stack, you must configure the Kubernetes layer of your cluster profiles to use the
manually created stack. This ensures that Palette uses the existing stack rather than attempting to create and manage
one automatically.

<Tabs queryString="cluster-profile">

<TabItem label="AWS IaaS Cluster Profiles" value="aws-iaas-cluster-profiles">

:::info

Only the <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes" /> pack
supports the `manageCloudFormationStackManually` configuration.

:::

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Profiles**..

3. Choose an existing cluster profile or
   [create a new cluster profile](../../../../profiles/cluster-profiles/create-cluster-profiles/create-cluster-profiles.md).

4. Once in the cluster profile overview with all the layers listed, select the Kubernetes layer to view the **Edit
   Pack** page.

5. In the YAML editor, add the `manageCloudFormationStackManually.enabled` field and set the value to `true` as shown
   below.

   ```yaml {5-6}
   pack:
   ---
   kubeadmconfig:
   ---
   manageCloudFormationStackManually:
     enabled: true
   ```

6. **Confirm Updates** to save the changes to the Kubernetes layer.

7. **Save Changes** to the cluster profile.

</TabItem>

<TabItem label="AWS EKS Cluster Profiles" value="aws-eks-cluster-profiles">

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Profiles**..

3. Choose an existing cluster profile or
   [create a new cluster profile](../../../../profiles/cluster-profiles/create-cluster-profiles/create-cluster-profiles.md).

4. Once in the cluster profile overview with all the layers listed, select the Kubernetes layer to view the **Edit
   Pack** page.

5. In the YAML editor, add the `manageCloudFormationStackManually.enabled` field and set the value to `true` as shown
   below.

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

6. If you want to provide different IAM role names for node groups, you can specify them in the `managedControlPlane`
   and `managedMachinePool` sections. If you do not specify role names, the default values created by the CloudFormation
   stack are used.

   These default role names are shown in the following example. You can change the role names to your desired names, but
   make sure to follow the IAM Role Naming Requirements.

   ```yaml title="Example role names" {5,9}
   pack:
   ---
   managedControlPlane:
     ...
     roleName: "eks-controlplane.cluster-api-provider-aws.sigs.k8s.io"
   ---
   managedMachinePool:
     ...
     roleName: "eks-nodegroup.cluster-api-provider-aws.sigs.k8s.io"
   ---
   ```

   <details>

   <summary> IAM Role Naming Requirements </summary>

   When manually creating and providing IAM roles for EKS clusters through pack `roleName` values, all role names must
   follow the naming pattern `*.cluster-api-provider-aws.sigs.k8s.io`. This includes:

   - Control plane roles
   - Node group roles
   - Fargate profile roles

   The IAM permissions granted are scoped to this specific role naming pattern through the resource constraint defined
   in the [Minimum EKS Dynamic/Static Permissions](#step-1-add-minimum-permissions-policies-to-iam-user-or-role)
   (`arn:*:iam::*:role/*.cluster-api-provider-aws.sigs.k8s.io`). Deviating from this naming convention results in
   `AccessDenied` errors when the system attempts to perform operations such as `iam:GetRole`, `iam:PassRole`, or
   `iam:ListAttachedRolePolicies`.

   If your organizational policies or specific use cases require a different role naming pattern, you must explicitly
   add the corresponding resource Amazon Resource Name (ARN) pattern to the IAM policy's Resource field to grant the
   necessary permissions.

   ```json title="Example Resource ARN pattern for custom role names" {12}
   ...
        {
            "Sid": "IAMRolePermissions",
            "Effect": "Allow",
            "Action": [
                "iam:GetRole",
                "iam:PassRole",
                "iam:ListAttachedRolePolicies"
            ],
            "Resource": [
                "arn:*:iam::*:role/*.cluster-api-provider-aws.sigs.k8s.io",
                "arn:*:iam::*:role/my-custom-eks-role-*"
            ]
        }
   ...
   ```

   </details>

7. **Confirm Updates** to save the changes to the Kubernetes layer.

8. **Save Changes** to the cluster profile.

</TabItem>

</Tabs>
