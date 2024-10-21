---
sidebar_label: "AWS Cluster Autoscaler"
title: "AWS Cluster Autoscaler"
description: "AWS Cluster Autoscaler for Spectro Cloud Palette"
hide_table_of_contents: true
type: "integration"
category: ["system app", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.dev.spectrocloud.com/v1/aws-cluster-autoscaler/blobs/sha256:f86813591b3b63b3afcf0a604a7c8c715660448585e89174908f3c6a421ad8d8?type=image.webp"
tags: ["packs", "aws-cluster-autoscaler", "system app", "eks"]
---

The Kubernetes EKS clusters are resized under the following conditions:

- Scale-up: The Cluster Autoscaler triggers a scale-up operation if insufficient cluster resources lead to multiple pod
  failures. The pods become eligible for scheduling on the new nodes. The Cluster Autoscaler checks for pod failures
  every 30 seconds and schedules impacted pods on new nodes. Scaling up will not happen when the given pods have node
  affinity.

- Scale-down: The Cluster Autoscaler triggers a scale-down operation if nodes are underutilized for ten continuous
  minutes, and their pods are eligible for rescheduling on other available nodes. The node utilization threshold for
  scaling down a node defaults to 50% of the node's capacity. The Cluster Autoscaler calculates the node utilization
  threshold based on CPU and memory utilization. In scenarios where the node is underutilized, the Cluster Autoscaler
  migrates the pods from underutilized nodes to other available nodes and then shuts down the underutilized nodes.

:::warning

Existing cluster profiles that use the manifest-based Cluster Autoscaler pack version 1.28.x or earlier cannot be
upgraded directly to version 1.29.x of the pack based on Helm. To use version 1.29.x, you must first remove the old
version of the pack from the cluster profile and then add the new one.

:::

## Versions Supported

<Tabs queryString="parent">

<TabItem label="1.29.x" value="1.29.x">

## Create IAM Policy

The Helm-based Cluster Autoscaler pack is available for Amazon EKS host clusters. To deploy the pack, you must first
define an IAM policy in the AWS account associated with Palette. This policy allows the Cluster Autoscaler to scale the
cluster's node groups.

Use the following steps to create the IAM policy and deploy the Cluster Autoscaler pack.

1. In AWS, create a new IAM policy using the snippet below and give it a name, for example,
   _PaletteEKSClusterAutoscaler_. Refer to the
   [Creating IAM policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create.html) guide for
   instructions.

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "autoscaling:DescribeAutoScalingGroups",
           "autoscaling:DescribeAutoScalingInstances",
           "autoscaling:DescribeLaunchConfigurations",
           "autoscaling:DescribeScalingActivities",
           "autoscaling:DescribeTags",
           "ec2:DescribeInstanceTypes",
           "ec2:DescribeLaunchTemplateVersions"
         ],
         "Resource": ["*"]
       },
       {
         "Effect": "Allow",
         "Action": [
           "autoscaling:SetDesiredCapacity",
           "autoscaling:TerminateInstanceInAutoScalingGroup",
           "ec2:DescribeImages",
           "ec2:GetInstanceTypesFromInstanceRequirements",
           "eks:DescribeNodegroup"
         ],
         "Resource": ["*"]
       }
     ]
   }
   ```

2. Copy the IAM policy
   [Amazon Resource Name (ARN)](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference-arns.html). Your policy ARN
   should be similar to `arn:aws:iam::123456789:policy/PaletteEKSClusterAutoscaler`.

3. During the cluster profile creation, modify the `managedMachinePool.roleAdditionalPolicies` section in the
   **values.yaml** file of the Kubernetes pack with the created IAM policy ARN. Palette will attach the IAM policy to
   your cluster's node group during cluster deployment. The snapshot below illustrates the specific section to update
   with the policy ARN.

   ![A snapshot displaying the ARN added to the Kubernetes pack's manifest.](/integrations_aws-cluster-autoscaler_k8s-manifest.webp)

   For example, the code block below displays the updated `managedMachinePool.roleAdditionalPolicies` section with a
   sample policy ARN.

   ```yaml
   managedMachinePool:
     # roleName: {{ name of the self-managed role | format "${string}" }}
     # A list of additional policies to attach to the node group role
     roleAdditionalPolicies:
       - "arn:aws:iam::123456789:policy/PaletteEKSClusterAutoscaler"
   ```

   :::tip

   Instead of updating the Kubernetes pack's **values.yaml** file, you can alternatively add an inline IAM policy to the
   cluster's node group post deployment. Refer to the
   [Adding IAM identity permissions](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_manage-attach-detach.html#add-policies-console)
   guide to learn how to embed an inline policy for a user or role.

   :::

4. Once you included all the [infrastructure pack layers](../profiles/profiles.md) to your cluster profile, add the AWS
   Cluster Autoscaler pack.

   :::warning

   The **values.yaml** file of the Cluster Autoscaler pack includes a section for setting the minimum and maximum size
   of the autoscaling groups. However, this section should not be used, and this configuration must be done from the
   Palette UI, according to step **5** of this guide.

   :::

5. Next, use the created cluster profile to [deploy a cluster](../clusters/public-cloud/deploy-k8s-cluster.md). In the
   **Nodes Config** section, specify the minimum and maximum number of worker pool nodes and the instance type that
   suits your workload. Your worker pool will have at least the minimum number of nodes you set up, and when scaling up,
   it will not exceed the maximum number of nodes configured. Note that each configured node pool will represent one
   ASG.

   The snapshot below displays an example of the cluster's **Nodes Config** section.

   ![A snapshot displaying the minimum and maximum node count in Palette.](/integrations_aws-cluster-autoscaler_node-count.webp)

   :::tip

   You can also [edit the minimum and maximum number of worker pool nodes](#resize-the-cluster) for a deployed cluster
   directly in the Palette UI.

   :::

## Resize the Cluster

In this example, you will resize the worker pool nodes to better understand the scaling behavior of the Cluster
Autoscaler pack. First, you will create a cluster with large-sized worker pool instances. Then, you will manually reduce
the instance size. This will lead to insufficient resources for existing pods and multiple pod failures in the cluster.
As a result, the Cluster Autoscaler will provision new smaller-sized nodes with enough capacity to accommodate the
current workload and reschedule the affected pods on new nodes. Follow the steps below to trigger the Cluster Autoscaler
and the pod rescheduling event.

1. During the cluster deployment, in the **Nodes Config** section, choose a large-sized instance type. For example, you
   can select the worker pool instance size as **t3.2xlarge** (8 vCPUs, 32 GB RAM) or higher.

2. Once the cluster is deployed, go to the **Nodes** tab in the cluster details page in Palette. Observe the count and
   size of nodes. The snapshot below displays one node of the type **t3.2xlarge** in the cluster's worker pool.

   ![A snapshot displaying one node of the type **t3.2xlarge** in the worker pool.](/integrations_aws-cluster-autoscaler_one-node.webp)

3. Manually reduce the instance size in the worker pool configuration to **t3.medium** (2 vCPUs, 8 GB RAM). The snapshot
   below shows how to change the instance size in the node pool configuration.

   ![A snapshot displaying how to edit node pool configuration.](/integrations_aws-cluster-autoscaler_edit-node.webp)

4. Wait a few minutes for the new nodes to be provisioned. Reducing the node size will make the Cluster Autoscaler shut
   down the large node and provision smaller-sized nodes with enough capacity to accommodate the current workload. Note
   that the new node count will be within the minimum and maximum limits specified in the worker pool configuration
   wizard.

   The snapshot below displays the newly created **t3.medium** nodes. These two smaller-sized nodes will efficiently
   manage the same workload as the single larger-sized node.

   ![A snapshot displaying new nodes of the size **t3.medium** spin up automatically, *collectively* providing enough capacity to accommodate the current workload. ](/integrations_aws-cluster-autoscaler_two-nodes.webp)

</TabItem>

<TabItem label="1.28.x" value="1.28.x">

## Create IAM Policy

The manifest-based Cluster Autoscaler pack is available for Amazon EKS host clusters. To deploy the pack, you must first
define an IAM policy in the AWS account associated with Palette. This policy allows the Cluster Autoscaler to scale the
cluster's node groups.

Use the following steps to create the IAM policy and deploy the Cluster Autoscaler pack.

1. In AWS, create a new IAM policy using the snippet below and give it a name, for example,
   _PaletteEKSClusterAutoscaler_. Refer to the
   [Creating IAM policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create.html) guide for
   instructions.

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "autoscaling:DescribeAutoScalingGroups",
           "autoscaling:DescribeAutoScalingInstances",
           "autoscaling:DescribeLaunchConfigurations",
           "autoscaling:DescribeScalingActivities",
           "autoscaling:DescribeTags",
           "ec2:DescribeInstanceTypes",
           "ec2:DescribeLaunchTemplateVersions"
         ],
         "Resource": ["*"]
       },
       {
         "Effect": "Allow",
         "Action": [
           "autoscaling:SetDesiredCapacity",
           "autoscaling:TerminateInstanceInAutoScalingGroup",
           "ec2:DescribeImages",
           "ec2:GetInstanceTypesFromInstanceRequirements",
           "eks:DescribeNodegroup"
         ],
         "Resource": ["*"]
       }
     ]
   }
   ```

2. Copy the IAM policy
   [Amazon Resource Name (ARN)](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference-arns.html). Your policy ARN
   should be similar to `arn:aws:iam::123456789:policy/PaletteEKSClusterAutoscaler`.

3. During the cluster profile creation, modify the `managedMachinePool.roleAdditionalPolicies` section in the
   **values.yaml** file of the Kubernetes pack with the created IAM policy ARN. Palette will attach the IAM policy to
   your cluster's node group during cluster deployment. The snapshot below illustrates the specific section to update
   with the policy ARN.

   ![A snapshot displaying the ARN added to the Kubernetes pack's manifest.](/integrations_aws-cluster-autoscaler_k8s-manifest.webp)

   For example, the code block below displays the updated `managedMachinePool.roleAdditionalPolicies` section with a
   sample policy ARN.

   ```yaml
   managedMachinePool:
     # roleName: {{ name of the self-managed role | format "${string}" }}
     # A list of additional policies to attach to the node group role
     roleAdditionalPolicies:
       - "arn:aws:iam::123456789:policy/PaletteEKSClusterAutoscaler"
   ```

   :::tip

   Instead of updating the Kubernetes pack's **values.yaml** file, you can alternatively add an inline IAM policy to the
   cluster's node group post deployment. Refer to the
   [Adding IAM identity permissions](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_manage-attach-detach.html#add-policies-console)
   guide to learn how to embed an inline policy for a user or role.

   :::

4. Once you included all the [infrastructure pack layers](../profiles/profiles.md) to your cluster profile, add the AWS
   Cluster Autoscaler pack.

5. Next, use the created cluster profile to [deploy a cluster](../clusters/public-cloud/deploy-k8s-cluster.md). In the
   **Nodes Config** section, specify the minimum and maximum number of worker pool nodes and the instance type that
   suits your workload. Your worker pool will have at least the minimum number of nodes you set up, and when scaling up,
   it will not exceed the maximum number of nodes configured. Note that each configured node pool will represent one
   ASG.

   The snapshot below displays an example of the cluster's **Nodes Config** section.

   ![A snapshot displaying the minimum and maximum node count in Palette.](/integrations_aws-cluster-autoscaler_node-count.webp)

   :::tip

   You can also [edit the minimum and maximum number of worker pool nodes](#resize-the-cluster) for a deployed cluster
   directly in the Palette UI.

   :::

## Resize the Cluster

In this example, you will resize the worker pool nodes to better understand the scaling behavior of the Cluster
Autoscaler pack. First, you will create a cluster with large-sized worker pool instances. Then, you will manually reduce
the instance size. This will lead to insufficient resources for existing pods and multiple pod failures in the cluster.
As a result, the Cluster Autoscaler will provision new smaller-sized nodes with enough capacity to accommodate the
current workload and reschedule the affected pods on new nodes. Follow the steps below to trigger the Cluster Autoscaler
and the pod rescheduling event.

1. During the cluster deployment, in the **Nodes Config** section, choose a large-sized instance type. For example, you
   can select the worker pool instance size as **t3.2xlarge** (8 vCPUs, 32 GB RAM) or higher.

2. Once the cluster is deployed, go to the **Nodes** tab in the cluster details page in Palette. Observe the count and
   size of nodes. The snapshot below displays one node of the type **t3.2xlarge** in the cluster's worker pool.

   ![A snapshot displaying one node of the type **t3.2xlarge** in the worker pool.](/integrations_aws-cluster-autoscaler_one-node.webp)

3. Manually reduce the instance size in the worker pool configuration to **t3.medium** (2 vCPUs, 8 GB RAM). The snapshot
   below shows how to change the instance size in the node pool configuration.

   ![A snapshot displaying how to edit node pool configuration.](/integrations_aws-cluster-autoscaler_edit-node.webp)

4. Wait a few minutes for the new nodes to be provisioned. Reducing the node size will make the Cluster Autoscaler shut
   down the large node and provision smaller-sized nodes with enough capacity to accommodate the current workload. Note
   that the new node count will be within the minimum and maximum limits specified in the worker pool configuration
   wizard.

   The snapshot below displays the newly created **t3.medium** nodes. These two smaller-sized nodes will efficiently
   manage the same workload as the single larger-sized node.

   ![A snapshot displaying new nodes of the size **t3.medium** spin up automatically, *collectively* providing enough capacity to accommodate the current workload. ](/integrations_aws-cluster-autoscaler_two-nodes.webp)

</TabItem>

<TabItem label="1.27.x" value="1.27.x">

## Create IAM Policy

The manifest-based Cluster Autoscaler pack is available for Amazon EKS host clusters. To deploy the pack, you must first
define an IAM policy in the AWS account associated with Palette. This policy allows the Cluster Autoscaler to scale the
cluster's node groups.

Use the following steps to create the IAM policy and deploy the Cluster Autoscaler pack.

1. In AWS, create a new IAM policy using the snippet below and give it a name, for example,
   _PaletteEKSClusterAutoscaler_. Refer to the
   [Creating IAM policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create.html) guide for
   instructions.

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "autoscaling:DescribeAutoScalingGroups",
           "autoscaling:DescribeAutoScalingInstances",
           "autoscaling:DescribeLaunchConfigurations",
           "autoscaling:DescribeScalingActivities",
           "autoscaling:DescribeTags",
           "ec2:DescribeInstanceTypes",
           "ec2:DescribeLaunchTemplateVersions"
         ],
         "Resource": ["*"]
       },
       {
         "Effect": "Allow",
         "Action": [
           "autoscaling:SetDesiredCapacity",
           "autoscaling:TerminateInstanceInAutoScalingGroup",
           "ec2:DescribeImages",
           "ec2:GetInstanceTypesFromInstanceRequirements",
           "eks:DescribeNodegroup"
         ],
         "Resource": ["*"]
       }
     ]
   }
   ```

2. Copy the IAM policy
   [Amazon Resource Name (ARN)](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference-arns.html). Your policy ARN
   should be similar to `arn:aws:iam::123456789:policy/PaletteEKSClusterAutoscaler`.

3. During the cluster profile creation, modify the `managedMachinePool.roleAdditionalPolicies` section in the
   **values.yaml** file of the Kubernetes pack with the created IAM policy ARN. Palette will attach the IAM policy to
   your cluster's node group during cluster deployment. The snapshot below illustrates the specific section to update
   with the policy ARN.

   ![A snapshot displaying the ARN added to the Kubernetes pack's manifest.](/integrations_aws-cluster-autoscaler_k8s-manifest.webp)

   For example, the code block below displays the updated `managedMachinePool.roleAdditionalPolicies` section with a
   sample policy ARN.

   ```yaml
   managedMachinePool:
     # roleName: {{ name of the self-managed role | format "${string}" }}
     # A list of additional policies to attach to the node group role
     roleAdditionalPolicies:
       - "arn:aws:iam::123456789:policy/PaletteEKSClusterAutoscaler"
   ```

   :::tip

   Instead of updating the Kubernetes pack's **values.yaml** file, you can alternatively add an inline IAM policy to the
   cluster's node group post deployment. Refer to the
   [Adding IAM identity permissions](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_manage-attach-detach.html#add-policies-console)
   guide to learn how to embed an inline policy for a user or role.

   :::

4. Once you included all the [infrastructure pack layers](../profiles/profiles.md) to your cluster profile, add the AWS
   Cluster Autoscaler pack.

5. Next, use the created cluster profile to [deploy a cluster](../clusters/public-cloud/deploy-k8s-cluster.md). In the
   **Nodes Config** section, specify the minimum and maximum number of worker pool nodes and the instance type that
   suits your workload. Your worker pool will have at least the minimum number of nodes you set up, and when scaling up,
   it will not exceed the maximum number of nodes configured. Note that each configured node pool will represent one
   ASG.

   The snapshot below displays an example of the cluster's **Nodes Config** section.

   ![A snapshot displaying the minimum and maximum node count in Palette.](/integrations_aws-cluster-autoscaler_node-count.webp)

   :::tip

   You can also [edit the minimum and maximum number of worker pool nodes](#resize-the-cluster) for a deployed cluster
   directly in the Palette UI.

   :::

## Resize the Cluster

In this example, you will resize the worker pool nodes to better understand the scaling behavior of the Cluster
Autoscaler pack. First, you will create a cluster with large-sized worker pool instances. Then, you will manually reduce
the instance size. This will lead to insufficient resources for existing pods and multiple pod failures in the cluster.
As a result, the Cluster Autoscaler will provision new smaller-sized nodes with enough capacity to accommodate the
current workload and reschedule the affected pods on new nodes. Follow the steps below to trigger the Cluster Autoscaler
and the pod rescheduling event.

1. During the cluster deployment, in the **Nodes Config** section, choose a large-sized instance type. For example, you
   can select the worker pool instance size as **t3.2xlarge** (8 vCPUs, 32 GB RAM) or higher.

2. Once the cluster is deployed, go to the **Nodes** tab in the cluster details page in Palette. Observe the count and
   size of nodes. The snapshot below displays one node of the type **t3.2xlarge** in the cluster's worker pool.

   ![A snapshot displaying one node of the type **t3.2xlarge** in the worker pool.](/integrations_aws-cluster-autoscaler_one-node.webp)

3. Manually reduce the instance size in the worker pool configuration to **t3.medium** (2 vCPUs, 8 GB RAM). The snapshot
   below shows how to change the instance size in the node pool configuration.

   ![A snapshot displaying how to edit node pool configuration.](/integrations_aws-cluster-autoscaler_edit-node.webp)

4. Wait a few minutes for the new nodes to be provisioned. Reducing the node size will make the Cluster Autoscaler shut
   down the large node and provision smaller-sized nodes with enough capacity to accommodate the current workload. Note
   that the new node count will be within the minimum and maximum limits specified in the worker pool configuration
   wizard.

   The snapshot below displays the newly created **t3.medium** nodes. These two smaller-sized nodes will efficiently
   manage the same workload as the single larger-sized node.

   ![A snapshot displaying new nodes of the size **t3.medium** spin up automatically, *collectively* providing enough capacity to accommodate the current workload. ](/integrations_aws-cluster-autoscaler_two-nodes.webp)

</TabItem>

<TabItem label="1.26.x" value="1.26.x">

## Create IAM Policy

The manifest-based Cluster Autoscaler pack is available for Amazon EKS host clusters. To deploy the pack, you must first
define an IAM policy in the AWS account associated with Palette. This policy allows the Cluster Autoscaler to scale the
cluster's node groups.

Use the following steps to create the IAM policy and deploy the Cluster Autoscaler pack.

1. In AWS, create a new IAM policy using the snippet below and give it a name, for example,
   _PaletteEKSClusterAutoscaler_. Refer to the
   [Creating IAM policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create.html) guide for
   instructions.

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "autoscaling:DescribeAutoScalingGroups",
           "autoscaling:DescribeAutoScalingInstances",
           "autoscaling:DescribeLaunchConfigurations",
           "autoscaling:DescribeScalingActivities",
           "autoscaling:DescribeTags",
           "ec2:DescribeInstanceTypes",
           "ec2:DescribeLaunchTemplateVersions"
         ],
         "Resource": ["*"]
       },
       {
         "Effect": "Allow",
         "Action": [
           "autoscaling:SetDesiredCapacity",
           "autoscaling:TerminateInstanceInAutoScalingGroup",
           "ec2:DescribeImages",
           "ec2:GetInstanceTypesFromInstanceRequirements",
           "eks:DescribeNodegroup"
         ],
         "Resource": ["*"]
       }
     ]
   }
   ```

2. Copy the IAM policy
   [Amazon Resource Name (ARN)](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference-arns.html). Your policy ARN
   should be similar to `arn:aws:iam::123456789:policy/PaletteEKSClusterAutoscaler`.

3. During the cluster profile creation, modify the `managedMachinePool.roleAdditionalPolicies` section in the
   **values.yaml** file of the Kubernetes pack with the created IAM policy ARN. Palette will attach the IAM policy to
   your cluster's node group during cluster deployment. The snapshot below illustrates the specific section to update
   with the policy ARN.

   ![A snapshot displaying the ARN added to the Kubernetes pack's manifest.](/integrations_aws-cluster-autoscaler_k8s-manifest.webp)

   For example, the code block below displays the updated `managedMachinePool.roleAdditionalPolicies` section with a
   sample policy ARN.

   ```yaml
   managedMachinePool:
     # roleName: {{ name of the self-managed role | format "${string}" }}
     # A list of additional policies to attach to the node group role
     roleAdditionalPolicies:
       - "arn:aws:iam::123456789:policy/PaletteEKSClusterAutoscaler"
   ```

   :::tip

   Instead of updating the Kubernetes pack's **values.yaml** file, you can alternatively add an inline IAM policy to the
   cluster's node group post deployment. Refer to the
   [Adding IAM identity permissions](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_manage-attach-detach.html#add-policies-console)
   guide to learn how to embed an inline policy for a user or role.

   :::

4. Once you included all the [infrastructure pack layers](../profiles/profiles.md) to your cluster profile, add the AWS
   Cluster Autoscaler pack.

5. Next, use the created cluster profile to [deploy a cluster](../clusters/public-cloud/deploy-k8s-cluster.md). In the
   **Nodes Config** section, specify the minimum and maximum number of worker pool nodes and the instance type that
   suits your workload. Your worker pool will have at least the minimum number of nodes you set up, and when scaling up,
   it will not exceed the maximum number of nodes configured. Note that each configured node pool will represent one
   ASG.

   The snapshot below displays an example of the cluster's **Nodes Config** section.

   ![A snapshot displaying the minimum and maximum node count in Palette.](/integrations_aws-cluster-autoscaler_node-count.webp)

   :::tip

   You can also [edit the minimum and maximum number of worker pool nodes](#resize-the-cluster) for a deployed cluster
   directly in the Palette UI.

   :::

## Resize the Cluster

In this example, you will resize the worker pool nodes to better understand the scaling behavior of the Cluster
Autoscaler pack. First, you will create a cluster with large-sized worker pool instances. Then, you will manually reduce
the instance size. This will lead to insufficient resources for existing pods and multiple pod failures in the cluster.
As a result, the Cluster Autoscaler will provision new smaller-sized nodes with enough capacity to accommodate the
current workload and reschedule the affected pods on new nodes. Follow the steps below to trigger the Cluster Autoscaler
and the pod rescheduling event.

1. During the cluster deployment, in the **Nodes Config** section, choose a large-sized instance type. For example, you
   can select the worker pool instance size as **t3.2xlarge** (8 vCPUs, 32 GB RAM) or higher.

2. Once the cluster is deployed, go to the **Nodes** tab in the cluster details page in Palette. Observe the count and
   size of nodes. The snapshot below displays one node of the type **t3.2xlarge** in the cluster's worker pool.

   ![A snapshot displaying one node of the type **t3.2xlarge** in the worker pool.](/integrations_aws-cluster-autoscaler_one-node.webp)

3. Manually reduce the instance size in the worker pool configuration to **t3.medium** (2 vCPUs, 8 GB RAM). The snapshot
   below shows how to change the instance size in the node pool configuration.

   ![A snapshot displaying how to edit node pool configuration.](/integrations_aws-cluster-autoscaler_edit-node.webp)

4. Wait a few minutes for the new nodes to be provisioned. Reducing the node size will make the Cluster Autoscaler shut
   down the large node and provision smaller-sized nodes with enough capacity to accommodate the current workload. Note
   that the new node count will be within the minimum and maximum limits specified in the worker pool configuration
   wizard.

   The snapshot below displays the newly created **t3.medium** nodes. These two smaller-sized nodes will efficiently
   manage the same workload as the single larger-sized node.

   ![A snapshot displaying new nodes of the size **t3.medium** spin up automatically, *collectively* providing enough capacity to accommodate the current workload. ](/integrations_aws-cluster-autoscaler_two-nodes.webp)

</TabItem>

<TabItem label="1.22.x" value="1.22.x">

## Create IAM Policy

The manifest-based Cluster Autoscaler pack is available for Amazon EKS host clusters. To deploy the pack, you must first
define an IAM policy in the AWS account associated with Palette. This policy allows the Cluster Autoscaler to scale the
cluster's node groups.

Use the following steps to create the IAM policy and deploy the Cluster Autoscaler pack.

1. In AWS, create a new IAM policy using the snippet below and give it a name, for example,
   _PaletteEKSClusterAutoscaler_. Refer to the
   [Creating IAM policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create.html) guide for
   instructions.

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "autoscaling:DescribeAutoScalingGroups",
           "autoscaling:DescribeAutoScalingInstances",
           "autoscaling:DescribeLaunchConfigurations",
           "autoscaling:DescribeScalingActivities",
           "autoscaling:DescribeTags",
           "ec2:DescribeInstanceTypes",
           "ec2:DescribeLaunchTemplateVersions"
         ],
         "Resource": ["*"]
       },
       {
         "Effect": "Allow",
         "Action": [
           "autoscaling:SetDesiredCapacity",
           "autoscaling:TerminateInstanceInAutoScalingGroup",
           "ec2:DescribeImages",
           "ec2:GetInstanceTypesFromInstanceRequirements",
           "eks:DescribeNodegroup"
         ],
         "Resource": ["*"]
       }
     ]
   }
   ```

2. Copy the IAM policy
   [Amazon Resource Name (ARN)](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference-arns.html). Your policy ARN
   should be similar to `arn:aws:iam::123456789:policy/PaletteEKSClusterAutoscaler`.

3. During the cluster profile creation, modify the `managedMachinePool.roleAdditionalPolicies` section in the
   **values.yaml** file of the Kubernetes pack with the created IAM policy ARN. Palette will attach the IAM policy to
   your cluster's node group during cluster deployment. The snapshot below illustrates the specific section to update
   with the policy ARN.

   ![A snapshot displaying the ARN added to the Kubernetes pack's manifest.](/integrations_aws-cluster-autoscaler_k8s-manifest.webp)

   For example, the code block below displays the updated `managedMachinePool.roleAdditionalPolicies` section with a
   sample policy ARN.

   ```yaml
   managedMachinePool:
     # roleName: {{ name of the self-managed role | format "${string}" }}
     # A list of additional policies to attach to the node group role
     roleAdditionalPolicies:
       - "arn:aws:iam::123456789:policy/PaletteEKSClusterAutoscaler"
   ```

   :::tip

   Instead of updating the Kubernetes pack's **values.yaml** file, you can alternatively add an inline IAM policy to the
   cluster's node group post deployment. Refer to the
   [Adding IAM identity permissions](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_manage-attach-detach.html#add-policies-console)
   guide to learn how to embed an inline policy for a user or role.

   :::

4. Once you included all the [infrastructure pack layers](../profiles/profiles.md) to your cluster profile, add the AWS
   Cluster Autoscaler pack.

5. Next, use the created cluster profile to [deploy a cluster](../clusters/public-cloud/deploy-k8s-cluster.md). In the
   **Nodes Config** section, specify the minimum and maximum number of worker pool nodes and the instance type that
   suits your workload. Your worker pool will have at least the minimum number of nodes you set up, and when scaling up,
   it will not exceed the maximum number of nodes configured. Note that each configured node pool will represent one
   ASG.

   The snapshot below displays an example of the cluster's **Nodes Config** section.

   ![A snapshot displaying the minimum and maximum node count in Palette.](/integrations_aws-cluster-autoscaler_node-count.webp)

   :::tip

   You can also [edit the minimum and maximum number of worker pool nodes](#resize-the-cluster) for a deployed cluster
   directly in the Palette UI.

   :::

## Resize the Cluster

In this example, you will resize the worker pool nodes to better understand the scaling behavior of the Cluster
Autoscaler pack. First, you will create a cluster with large-sized worker pool instances. Then, you will manually reduce
the instance size. This will lead to insufficient resources for existing pods and multiple pod failures in the cluster.
As a result, the Cluster Autoscaler will provision new smaller-sized nodes with enough capacity to accommodate the
current workload and reschedule the affected pods on new nodes. Follow the steps below to trigger the Cluster Autoscaler
and the pod rescheduling event.

1. During the cluster deployment, in the **Nodes Config** section, choose a large-sized instance type. For example, you
   can select the worker pool instance size as **t3.2xlarge** (8 vCPUs, 32 GB RAM) or higher.

2. Once the cluster is deployed, go to the **Nodes** tab in the cluster details page in Palette. Observe the count and
   size of nodes. The snapshot below displays one node of the type **t3.2xlarge** in the cluster's worker pool.

   ![A snapshot displaying one node of the type **t3.2xlarge** in the worker pool.](/integrations_aws-cluster-autoscaler_one-node.webp)

3. Manually reduce the instance size in the worker pool configuration to **t3.medium** (2 vCPUs, 8 GB RAM). The snapshot
   below shows how to change the instance size in the node pool configuration.

   ![A snapshot displaying how to edit node pool configuration.](/integrations_aws-cluster-autoscaler_edit-node.webp)

4. Wait a few minutes for the new nodes to be provisioned. Reducing the node size will make the Cluster Autoscaler shut
   down the large node and provision smaller-sized nodes with enough capacity to accommodate the current workload. Note
   that the new node count will be within the minimum and maximum limits specified in the worker pool configuration
   wizard.

   The snapshot below displays the newly created **t3.medium** nodes. These two smaller-sized nodes will efficiently
   manage the same workload as the single larger-sized node.

   ![A snapshot displaying new nodes of the size **t3.medium** spin up automatically, *collectively* providing enough capacity to accommodate the current workload. ](/integrations_aws-cluster-autoscaler_two-nodes.webp)

</TabItem>

</Tabs>

## Troubleshooting

### Scenario - Quota Limits Exceeded

You may observe the `LimitExceeded: Cannot exceed quota for PoliciesPerRole:10` error in the cluster deployment logs.
This may happen because the default IAM role that Palette creates for the node group already has 10 policies attached,
and you are trying to attach one more. By default, your AWS account will have a quota of 10 managed policies per IAM
role. The workaround is to follow the instructions in the
[IAM object quotas](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_iam-quotas.html#reference_iam-quotas-entities)
guide to request a quota increase.

### Scenario - IAM Authenticator not Found

You may encounter an `executable aws-iam-authenticator not found` error in your terminal when attempting to access your
EKS cluster from your local machine. This may happen due to the
[aws-iam-authenticator](https://github.com/kubernetes-sigs/aws-iam-authenticator) plugin missing from your local
environment. The workaround is to install the IAM Authenticator. Refer to the
[IAM Authenticator](https://github.com/kubernetes-sigs/aws-iam-authenticator) GitHub page for more information.

## Terraform

You can reference the AWS Cluster Autoscaler pack in Terraform with a data resource.

```hcl
data "spectrocloud_registry" "public_registry" {
 name = "Public Repo"
}

data "spectrocloud_pack_simple" "aws-cluster-autoscaler" {
 name    = "aws-cluster-autoscaler"
 version = "1.29.2"
 type = "helm"
 registry_uid = data.spectrocloud_registry.public_registry.id
}
```
