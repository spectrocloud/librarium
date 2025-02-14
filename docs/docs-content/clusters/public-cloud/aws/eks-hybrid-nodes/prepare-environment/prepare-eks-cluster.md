---
sidebar_label: "Prepare EKS Cluster"
title: "Prepare EKS Cluster"
description: "Learn how to prepare your Amazon EKS cluster for Amazon EKS Hybrid Nodes."
hide_table_of_contents: false
draft: true
tags: ["public cloud", "aws", "eks hybrid nodes"]
sidebar_position: 4
---

This guide explains how to create an EKS cluster with the required configuration so it can be imported into Palette.

## Prerequisites

- Network connectivity between your on-prem environments and AWS.

  - An AWS VPC and subnet setup as guided in [AWS VPC and subnet setup](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-networking.html#hybrid-nodes-networking-vpc). During cluster creation, you will need to specify your configured VPC and subnets, as well as the CIDR block for your AWS node network.

  - A cluster security group is configured for your [Amazon EKS Hybrid Nodes environment](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-networking.html#hybrid-nodes-networking-cluster-sg). During cluster creation, you will need to specify this as an additional security group.

  - Your on-prem network is configured for hybrid network connectivity as guided in [On-premises networking configuration](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-networking.html#hybrid-nodes-networking-on-prem). During cluster creation, you will need to provide the CIDR blocks for your on-prem node and pod network.

- An Amazon EKS cluster Identity and Access Management (IAM) role created with the necessary policies attached as guided in [Step 1: Create cluster IAM role](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-cluster-create.html#hybrid-nodes-cluster-create-iam). You will need to specify the IAM role during cluster creation.

## Create the EKS Cluster

These steps use the AWS Management Console.

1. Log in to the [Amazon EKS console](https://console.aws.amazon.com/eks/home#/clusters).

2. Click **Create cluster**.

3. On the **Configure cluster** page, select **Custom configuration** in **Configuration options**.
   
4. In the **Cluster configuration** section, enter a cluster **Name**.

5. Select your Amazon EKS cluster IAM role for the **Cluster IAM role**. For example, `myAmazonEKSClusterRole`.

6. In the **Cluster access** section, select **EKS API and ConfigMap** as the **Cluster authentication mode**.

7. On the **Configure cluster** page, you can configure the remaining options as needed. Click **Next** when complete.

8. On the **Specify networking** page, in the **Networking** section, select your Amazon EKS Hybrid VPC and subnets for **VPC** and **Subnets**.

9. For **Additional security groups**, select the security group created for your Amazon EKS Hybrid Nodes environment.

10. For **Choose cluster IP address family**, ensure **IPv4** is selected.

11. Enable the toggle for **Configure Kubernetes service IP address block**, and provide the CIDR block for your AWS node network in the **Service IPv4 range** field.

    For example, `10.100.0.0/16`.

12. Enable the toggle for **Configure remote networks to enable hybrid nodes**.

13. Click **Add new CIDR block** for **Remote node networks** and provide the CIDR block for your on-prem node network in the **Node CIDR block** field.

    For example, `10.200.0.0/16`.

    Add as many entries as needed.

14. Click **Add new CIDR block** for **Remote pod networks** and provide the CIDR block for your on-prem pod network in the **Pod CIDR block** field.

    For example, `192.168.0.0/16`.

    Add as many entries as needed.

15. In the **Cluster endpoint access** section, select the **Public** or **Private** option.

    :::warning
    
    The **Public and private** option is not supported for Amazon EKS Hybrid Nodes.

    :::

16. On the **Specify networking** page, you can configure the remaining options as needed. Click **Next** when complete.

17. On the **Configure observability** page, configure the options as needed. Click **Next** when complete.

18. On the **Configure observability** page, configure the options as needed. Click **Next** when complete.

19. On the **Select add-ons** page, you must check the box to enable the **Amazon VPC CNI** in **AWS add-ons**.

    :::info

    The "Not compatible with Hybrid Nodes" warning is ignored in this case as affinity rules will be configured during the [Configure CNI for Hybrid Nodes](../import-eks-cluster-enable-hybrid-mode.md#configure-cni-for-hybrid-nodes) steps to ensure compatibility with your hybrid nodes.

    :::

20. On the **Select add-ons** page, configure the remaining options as needed. Click **Next** when complete.

21. On the **Configure selected add-ons settings** page, configure the options as needed. Click **Next** when complete.

22. On the **Review and create** page, review your settings and click **Create** when ready.

23. Wait until the cluster status shows **Active** in the EKS console.

24. TBD

## Configure IAM Roles for Worker Nodes

Your worker nodes need an IAM role that includes these AWS managed policies:

- **AmazonEKSWorkerNodePolicy**
- **AmazonEKS_CNI_Policy**
- **AmazonEC2ContainerRegistryReadOnly**

If you use the EKS console or `eksctl` to create the node group, an appropriate role can often be generated
automatically. Otherwise:

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

When these validations pass, your EKS cluster is prepared with the necessary VPC, subnets, IAM roles, and at least one
node pool. It is now ready to be **imported into Palette** if desired.

## Next Steps

- **(Optional) Import into Palette**: You can now proceed with the steps to bring this cluster under Palette management.
