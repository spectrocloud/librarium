---
sidebar_label: "AWS Cluster Autoscaler"
title: "AWS Cluster Autoscaler"
description: "AWS Cluster Autoscaler for Spectro Cloud Palette"
hide_table_of_contents: true
type: "integration"
category: ["system app", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.dev.spectrocloud.com/v1/aws-cluster-autoscaler/blobs/sha256:f86813591b3b63b3afcf0a604a7c8c715660448585e89174908f3c6a421ad8d8?type=image/png"
tags: ["packs", "aws-cluster-autoscaler", "system app", "network"]
---

Palette supports autoscaling for AWS EKS clusters by using the AWS Cluster Autoscaler pack. The Cluster Autoscaler
dynamically scales cluster resources. It monitors the workload and provisions or shuts down cluster nodes to maximize
the cluster's performance and make it more resilient to failures. It resizes the Kubernetes cluster in the following two
conditions:

- Scale-up: The Cluster Autoscaler triggers a scale-up operation if insufficient cluster resources lead to multiple pod
  failures. The pods become eligible for scheduling on the new nodes. The Cluster Autoscaler checks for pod failures
  every 30 seconds and schedules impacted pods on new nodes. Scaling up will not happen when the given pods have node
  affinity.

- Scale-down: The Cluster Autoscaler triggers a scale-down operation if nodes are underutilized for ten continuous
  minutes, and their pods are eligible for rescheduling on other available nodes. The node utilization threshold for
  scaling down a node defaults to 50% of the node's capacity. The Cluster Autoscaler calculates the node utilization
  threshold based on CPU and memory utilization. In scenarios where the node is underutilized, the Cluster Autoscaler
  migrates the pods from underutilized nodes to other available nodes and then shuts down the underutilized nodes.

Cluster Autoscaler pack is deployed as a
[_Deployment_](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) in your cluster and utilizes
[Amazon EC2 Auto Scaling Groups](https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html)
to manage node groups.

## Versions Supported

<Tabs queryString="version">

<TabItem label="1.26.x" value="1.26.x">

## Prerequisites

- Kubernetes 1.24.x or higher.

- Permission to create an IAM policy in the AWS account you use with Palette.

- IAM policy - A
  [Full Cluster Autoscaler Features](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/aws/README.md#full-cluster-autoscaler-features-policy-recommended)
  IAM policy must be attached to the EKS cluster's node group. The policy must allow the Cluster Autoscaler to scale the
  cluster's node groups.

  There are two ways to achieve this prerequisite. You can define the policy as a _customer-managed_ policy in the AWS
  account and use its Amazon Resource Name (ARN) in the cluster profile. Alternatively, you can attach the IAM policy as
  an _inline_ policy to the node group if you have already deployed your cluster. Refer to the [Usage](#usage) section
  below to learn more.

- Updated Kubernetes layer manifest - The Kubernetes pack's manifest should be updated with the newly created IAM policy
  ARN. The YAML code block below displays the `managedMachinePool.roleAdditionalPolicies` section to update in the
  Kubernetes pack's manifest. Refer to the [Usage](#usage) section below for more details with an example.

  <br />

  ```yaml
  managedMachinePool:
    #roleName: {{ name of the self-managed role | format "${string}" }}
    ## A list of additional policies to attach to the node group role
    roleAdditionalPolicies:
    - {{ arn for the policy1 | format "${string}" }}
  ```

  <br />

## Usage

Cluster Autoscaler helps improve your cluster's performance and makes your cluster more resilient to failures. It
automatically adjusts the number of nodes in your cluster based on the current workload. In other words, Cluster
Autoscaler monitors the resource utilization, such as CPU and memory, and the number of pods active in your cluster and
scales the cluster when either of these events occurs:

<br />

- Multiple pods fail due to resource contention. In this case, the Cluster Autoscaler will provision more nodes.

- Nodes are underutilized for a specific period. In this case, the Cluster Autoscaler will reschedule the pods onto
  other nodes and shut down the underutilized node.
  <br />

### Deploy Cluster Autoscaler

To deploy the Cluster Autoscaler pack, you must first define an IAM policy in the AWS account associated with Palette.

Next, update the cluster profile to specify the IAM policy ARN in the Kubernetes pack's manifest. Palette will attach
that IAM policy to your cluster's node group during deployment. Note that Palette automatically creates two IAM roles in
the AWS account when you deploy an EKS cluster. One role is for the cluster, and another for the cluster's node group.
The cluster's IAM role name will have the following naming convention, `[your-cluster-name]-iam-service-role`, and the
node group's IAM role name will follow the `ng-role_worker-pool-[random-string]` naming convention.

The following steps provide detailed instructions for deploying the Cluster Autoscaler pack.

<br />

1. Define the new IAM policy using the policy outlined below, and give it a name, for example,
   _PaletteEKSClusterAutoscaler_.
   <br />

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

2. Copy the IAM policy ARN to the clipboard for the next step. For example, the policy ARN will be similar to
   `arn:aws:iam::650628870702:policy/PaletteEKSClusterAutoscaler`.

3. In your cluster profile, and update the `managedMachinePool.roleAdditionalPolicies` section in the Kubernetes pack's
   manifest with the newly created IAM policy ARN. The snapshot below displays the specific section to update with the
   policy ARN.

![A snapshot displaying the ARN added to the Kubernetes pack's manifest.](/integrations_aws-cluster-autoscaler_k8s-manifest.png)

For example, the code block below displays the updated `managedMachinePool.roleAdditionalPolicies` section with a sample
policy ARN, `"arn:aws:iam::650628870702:policy/PaletteEKSClusterAutoscaler"`. Before you use the following code block,
replace the ARN below with yours.

<br />

```yaml
managedMachinePool:
  # roleName: {{ name of the self-managed role | format "${string}" }}
  # A list of additional policies to attach to the node group role
  roleAdditionalPolicies:
    - "arn:aws:iam::650628870702:policy/PaletteEKSClusterAutoscaler"
```

{" "}

<br />

:::info

If you do not want to update the Kubernetes pack's manifest, you can add an _inline_ IAM policy to the cluster's node
group post deployment. Refer to this
[AWS guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_manage-attach-detach.html#add-policies-console)
on how to embed an inline policy for a user or role. Refer to the
[AWS IAM documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_managed-vs-inline.html) for the
differences between managed and inline policies.

:::

4. In the cluster deployment wizard, when you are in the **Nodes configuration** section, you must enter the minimum and
   maximum number of worker pool nodes, and the instance type (size) that suits your requirement.

You must provide the node count limits because the Cluster Autoscaler uses an Auto Scaling Group to manage the cluster's
node group. An Auto Scaling Group requires a minimum and maximum count and the selection of an instance type. You can
choose an instance type that suits your requirement.

For example, the snapshot below displays the cluster's minimum and maximum capacity.

![A snapshot displaying the minimum and maximum node count in Palette.](/integrations_aws-cluster-autoscaler_node-count.png)

<br />

### Resize the Cluster

To better understand the scaling behavior of the Cluster Autoscaler and its impact on a cluster, do the following
exercise to gain firsthand experience with the scaling behavior.

In the following example scenario, you will first create a cluster with large-sized worker pool instances. Next, you
will manually reduce the instance size, leading to insufficient resources for existing pods and multiple pod failures in
the cluster. As a result, the Cluster Autoscaler will provision new smaller-sized nodes with enough capacity to
accommodate the current workload and reschedule those contending pods on new nodes. Also, the new nodes' count will be
within the minimum and maximum limit you specified for the worker pool.

Use the following steps to trigger the pod rescheduling event manually:

<br />

1. In the cluster deployment wizard, while defining the **Nodes configuration**, choose a large-sized instance type. For
   example, you can choose your worker pool to have instance size **t3.2xlarge** (8 vCPUs, 32 GB RAM) or higher.

2. After your cluster is successfully deployed, navigate to the **Nodes** tab in the cluster details page in Palette,
   and note the count and size of nodes. The snapshots below display one node of the type **t3.2xlarge** in the worker
   pool of a successfully deployed cluster.

![A snapshot displaying one node of the type **t3.2xlarge** in the worker pool.](/integrations_aws-cluster-autoscaler_one-node.png)

3. Manually reduce the instance size in the worker-pool configuration to a **t3.medium** (2 vCPUs, 8 GB RAM). The
   snapshot below displays how to edit the instance size in the node pool configuration.

![A snapshot displaying how to edit node pool configuration.](/integrations_aws-cluster-autoscaler_edit-node.png)

4. Wait for a few minutes for the new nodes to provision. Reducing the node size will make the Cluster Autoscaler shut
   down the large node and provision smaller-sized nodes with enough capacity to accommodate the current workload. Also,
   the new node count will be within the minimum and maximum limit you specified for the worker pool configuration
   wizard.

The following snapshot displays two new nodes of the size **t3.medium** spin up automatically. These two smaller-sized
nodes will be able to handle the same workload as a single larger-sized node.

![A snapshot displaying new nodes of the size **t3.medium** spin up automatically, *collectively* providing enough capacity to accommodate the current workload. ](/integrations_aws-cluster-autoscaler_two-nodes.png)

{" "}

<br />

</TabItem>

<TabItem label="1.22.x" value="1.22.x">

## Prerequisites

- Kubernetes 1.19.x or higher.

- Permission to create an IAM policy in the AWS account you use with Palette.

- IAM policy - A
  [Full Cluster Autoscaler Features](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/aws/README.md#full-cluster-autoscaler-features-policy-recommended)
  IAM policy must be attached to the EKS cluster's node group. The policy must allow the Cluster Autoscaler to scale the
  cluster's node groups.

  There are two ways to achieve this prerequisite. You can define the policy as a _customer-managed_ policy in the AWS
  account and use its Amazon Resource Name (ARN) in the cluster profile. Alternatively, you can attach the IAM policy as
  an _inline_ policy to the node group if you have already deployed your cluster. Refer to the [Usage](#usage) section
  below to learn more.

- Updated Kubernetes layer manifest - The Kubernetes pack's manifest should be updated with the newly created IAM policy
  ARN. The YAML code block below displays the `managedMachinePool.roleAdditionalPolicies` section to update in the
  Kubernetes pack's manifest. Refer to the [Usage](#usage) section below for more details with an example.

  <br />

  ```yaml
  managedMachinePool:
    #roleName: {{ name of the self-managed role | format "${string}" }}
    ## A list of additional policies to attach to the node group role
    roleAdditionalPolicies:
    - {{ arn for the policy1 | format "${string}" }}
  ```

  <br />

## Usage

Cluster Autoscaler helps improve your cluster's performance and makes your cluster more resilient to failures. It
automatically adjusts the number of nodes in your cluster based on the current workload. In other words, Cluster
Autoscaler monitors the resource utilization, such as CPU and memory, and the number of pods active in your cluster and
scales the cluster when either of these events occurs:

<br />

- Multiple pods fail due to resource contention. In this case, the Cluster Autoscaler will provision more nodes.

- Nodes are underutilized for a specific period. In this case, the Cluster Autoscaler will reschedule the pods onto
  other nodes and shut down the underutilized node.
  <br />

### Deploy Cluster Autoscaler

To deploy the Cluster Autoscaler pack, you must first define an IAM policy in the AWS account associated with Palette.

Next, update the cluster profile to specify the IAM policy ARN in the Kubernetes pack's manifest. Palette will attach
that IAM policy to your cluster's node group during deployment. Note that Palette automatically creates two IAM roles in
the AWS account when you deploy an EKS cluster. One role is for the cluster, and another for the cluster's node group.
The cluster's IAM role name will have the following naming convention, `[your-cluster-name]-iam-service-role`, and the
node group's IAM role name will follow the `ng-role_worker-pool-[random-string]` naming convention.

The following steps provide detailed instructions for deploying the Cluster Autoscaler pack.

<br />

1. Define the new IAM policy using the policy outlined below, and give it a name, for example,
   _PaletteEKSClusterAutoscaler_.
   <br />

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

2. Copy the IAM policy ARN to the clipboard for the next step. For example, the policy ARN will be similar to
   `arn:aws:iam::650628870702:policy/PaletteEKSClusterAutoscaler`.

3. In your cluster profile, and update the `managedMachinePool.roleAdditionalPolicies` section in the Kubernetes pack's
   manifest with the newly created IAM policy ARN. The snapshot below displays the specific section to update with the
   policy ARN.

![A snapshot displaying the ARN added to the Kubernetes pack's manifest.](/integrations_aws-cluster-autoscaler_k8s-manifest.png)

For example, the code block below displays the updated `managedMachinePool.roleAdditionalPolicies` section with a sample
policy ARN, `"arn:aws:iam::650628870702:policy/PaletteEKSClusterAutoscaler"`. Before you use the following code block,
replace the ARN below with yours.

<br />

```yaml
managedMachinePool:
  # roleName: {{ name of the self-managed role | format "${string}" }}
  # A list of additional policies to attach to the node group role
  roleAdditionalPolicies:
    - "arn:aws:iam::650628870702:policy/PaletteEKSClusterAutoscaler"
```

{" "}

<br />

:::info

If you do not want to update the Kubernetes pack's manifest, you can add an _inline_ IAM policy to the cluster's node
group post deployment. Refer to this
[AWS guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_manage-attach-detach.html#add-policies-console)
on how to embed an inline policy for a user or role. Refer to the
[AWS IAM documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_managed-vs-inline.html) for the
differences between managed and inline policies.

:::

4. In the cluster deployment wizard, when you are in the **Nodes configuration** section, you must enter the minimum and
   maximum number of worker pool nodes, and the instance type (size) that suits your requirement.

You must provide the node count limits because the Cluster Autoscaler uses an Auto Scaling Group to manage the cluster's
node group. An Auto Scaling Group requires a minimum and maximum count and the selection of an instance type. You can
choose an instance type that suits your requirement.

For example, the snapshot below displays the cluster's minimum and maximum capacity.

![A snapshot displaying the minimum and maximum node count in Palette.](/integrations_aws-cluster-autoscaler_node-count.png)

<br />

### Resize the Cluster

To better understand the scaling behavior of the Cluster Autoscaler and its impact on a cluster, do the following
exercise to gain firsthand experience with the scaling behavior.

In the following example scenario, you will first create a cluster with large-sized worker pool instances. Next, you
will manually reduce the instance size, leading to insufficient resources for existing pods and multiple pod failures in
the cluster. As a result, the Cluster Autoscaler will provision new smaller-sized nodes with enough capacity to
accommodate the current workload and reschedule those contending pods on new nodes. Also, the new nodes' count will be
within the minimum and maximum limit you specified for the worker pool.

Use the following steps to trigger the pod rescheduling event manually:

<br />

1. In the cluster deployment wizard, while defining the **Nodes configuration**, choose a large-sized instance type. For
   example, you can choose your worker pool to have instance size **t3.2xlarge** (8 vCPUs, 32 GB RAM) or higher.

2. After your cluster is successfully deployed, navigate to the **Nodes** tab in the cluster details page in Palette,
   and note the count and size of nodes. The snapshots below display one node of the type **t3.2xlarge** in the worker
   pool of a successfully deployed cluster.

![A snapshot displaying one node of the type **t3.2xlarge** in the worker pool.](/integrations_aws-cluster-autoscaler_one-node.png)

3. Manually reduce the instance size in the worker-pool configuration to a **t3.medium** (2 vCPUs, 8 GB RAM). The
   snapshot below displays how to edit the instance size in the node pool configuration.

![A snapshot displaying how to edit node pool configuration.](/integrations_aws-cluster-autoscaler_edit-node.png)

4. Wait for a few minutes for the new nodes to provision. Reducing the node size will make the Cluster Autoscaler shut
   down the large node and provision smaller-sized nodes with enough capacity to accommodate the current workload. Also,
   the new node count will be within the minimum and maximum limit you specified for the worker pool configuration
   wizard.

The following snapshot displays two new nodes of the size **t3.medium** spin up automatically. These two smaller-sized
nodes will be able to handle the same workload as a single larger-sized node.

![A snapshot displaying new nodes of the size **t3.medium** spin up automatically, *collectively* providing enough capacity to accommodate the current workload. ](/integrations_aws-cluster-autoscaler_two-nodes.png)

{" "}

<br />

</TabItem>

</Tabs>

## Troubleshooting

If you are facing the `LimitExceeded: Cannot exceed quota for PoliciesPerRole:10` error in the cluster deployment logs,
it may be because the default IAM role Palette creates for the node group already has 10 policies attached to it, and
you are trying to attach one more. By default, your AWS account will have a quota of 10 managed policies per IAM role.
To fix the error, follow the instruction in this
[AWS guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_iam-quotas.html#reference_iam-quotas-entities) to
request a quota increase.

If you encounter an `executable aws-iam-authenticator not found` error in your terminal when attempting to access your
EKS cluster from your local machine, it may be due to the
[aws-iam-authenticator](https://github.com/kubernetes-sigs/aws-iam-authenticator) plugin missing from your local
environment. You can find the installation steps for the aws-iam-authenticator in the following
[install guide](https://docs.aws.amazon.com/eks/latest/userguide/install-aws-iam-authenticator.html).

## Terraform

You can reference the AWS Cluster Autoscaler pack in Terraform with a data resource.

```hcl
data "spectrocloud_registry" "public_registry" {
 name = "Public Repo"
}

data "spectrocloud_pack_simple" "aws-cluster-autoscaler" {
 name    = "aws-cluster-autoscaler"
 version = "1.26.3"
 type = "helm"
 registry_uid = data.spectrocloud_registry.public_registry.id
}
```

## References

- [Cluster Autoscaler on AWS](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/aws/README.md)

- [Amazon EKS Autoscaling](https://docs.aws.amazon.com/eks/latest/userguide/autoscaling.html)

- [AWS IAM Authenticator Plugin](https://github.com/kubernetes-sigs/aws-iam-authenticator)
