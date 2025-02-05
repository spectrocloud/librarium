---
sidebar_label: "Prepare EKS Cluster"
title: "Prepare EKS Cluster"
description: "Learn how to prepare your Amazon EKS cluster for Amazon EKS Hybrid Nodes."
hide_table_of_contents: false
tags: ["public cloud", "aws", "eks hybrid nodes"]
sidebar_position: 4
---

This guide explains how to create an EKS cluster with the essential prerequisites so it can be imported later into Palette. The cluster must have the following:

1. At least **one worker node pool**.
2. Use the **AWS VPC CNI** (default networking).
3. Be connected to the appropriate VPC and subnets.
4. Assigned the necessary IAM roles and permissions.

## Prerequisites

Before you create the cluster, ensure you have:

- **AWS CLI** (v2 recommended), correctly configured with credentials that have permission to create EKS resources.  
- **IAM Permissions** sufficient to create or manage:
  - EKS clusters (attach or create an appropriate role for EKS)  
  - VPCs, subnets, security groups (if not already existing)  
  - IAM roles for worker nodes  
- **Existing VPC and Subnets**:
  - Must span at least two Availability Zones  
  - Tagged for auto-discovery if using certain tools like `eksctl` (e.g., `Key=kubernetes.io/cluster/CLUSTER_NAME`, `Value=shared`)
- **Kubernetes Version**: Decide on a K8s version supported by both Amazon EKS and Palette (e.g., 1.24+).

## Create or Select a VPC for EKS

If you already have a VPC:
- Confirm it has private (and optionally public) subnets in at least two Availability Zones.  
- Tag subnets properly if you’ll use them for EKS node groups (e.g., `kubernetes.io/cluster/CLUSTER_NAME=shared`).

If you don’t have a suitable VPC:
- Use the AWS Console or `eksctl` to create one automatically.  
- Example (via `eksctl`):

```
eksctl create cluster \
  --name my-hybrid-eks-cluster \
  --region us-east-1 \
  --without-nodegroup
```

This command can auto-provision a VPC for you, but you can also specify subnets/VPC IDs as needed.

## Create the EKS Cluster

### Option A: Using the AWS Console

1. **Open the EKS service** in the AWS Management Console.  
2. Click **Create cluster**, then configure:
   - **Name**: For example, `my-hybrid-eks-cluster`  
   - **Kubernetes version**: Choose a version compatible with your environment  
   - **Cluster Service Role**: Either select an existing IAM role with EKS permissions or create a new one with the recommended AWS-managed policies (e.g., `AmazonEKSClusterPolicy`, `AmazonEKSServicePolicy`, etc.)  
   - **Networking**:
     - Choose your VPC  
     - Pick at least two subnets in different Availability Zones  
     - Keep **Amazon VPC CNI** as the networking add-on  
3. **Review and create** the cluster  
4. Wait until the cluster status shows **Active** in the EKS console

### Option B: Using `eksctl`

If you prefer the CLI, you can specify your subnets and one node group from the start. For example:

```
eksctl create cluster \
  --name my-hybrid-eks-cluster \
  --version 1.24 \
  --region us-east-1 \
  --vpc-private-subnets subnet-xxx,subnet-yyy \
  --nodegroup-name worker-nodes \
  --node-type t3.medium \
  --nodes 2 \
  --managed
```

- Replace `subnet-xxx` and `subnet-yyy` with the IDs of your private subnets.  
- Adjust **instance type**, **node count**, or **region** as needed.

In both methods, you must ensure:
- The **VPC CNI** remains the default networking add-on (amazon-vpc-cni-k8s).  
- There is at least **one** worker node group (a managed node group in the console or via `eksctl`).

## Configure IAM Roles for Worker Nodes

Your worker nodes need an IAM role that includes these AWS managed policies:

- **AmazonEKSWorkerNodePolicy**  
- **AmazonEKS_CNI_Policy**  
- **AmazonEC2ContainerRegistryReadOnly**  

If you use the EKS console or `eksctl` to create the node group, an appropriate role can often be generated automatically. Otherwise:

1. **Create** an IAM role for EC2.  
2. **Attach** these policies.  
3. **Associate** the IAM role with your node group’s launch template or directly in the EKS console.

## Verify Cluster Readiness

After the cluster is created:

- **Check Cluster Status**:

```
aws eks describe-cluster \
  --name my-hybrid-eks-cluster \
  --region us-east-1 \
  --query "cluster.status"
```

Should return `"ACTIVE"`.

- **Confirm Node Group**:
  - In the EKS console, under **Compute** → **Node groups**, ensure at least one node group is **Active**.  
  - If using `kubectl`, ensure nodes are **Ready**:

```
kubectl get nodes
```

- **Confirm AWS VPC CNI**:
  - Check that the `amazon-vpc-cni-k8s` DaemonSet is running:

```
kubectl get ds -n kube-system amazon-vpc-cni
```

  - Pods should be in a `Running` state.

When these validations pass, your EKS cluster is prepared with the necessary VPC, subnets, IAM roles, and at least one node pool. It is now ready to be **imported into Palette** if desired.

## Next Steps

- **(Optional) Import into Palette**: You can now proceed with the steps to bring this cluster under Palette management.  
- **Configure Additional Features**: Set up logging, metrics, or other add-ons as needed.  
- **Attach Hybrid Nodes**: Follow instructions for registering edge hosts (on-premises) if you plan to use Amazon EKS Hybrid Nodes.
