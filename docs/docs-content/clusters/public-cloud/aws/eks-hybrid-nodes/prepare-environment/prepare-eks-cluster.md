---
sidebar_label: "Prepare EKS Cluster"
title: "Prepare EKS Cluster"
description: "Learn how to prepare your Amazon EKS cluster for Amazon EKS Hybrid Nodes."
hide_table_of_contents: false
tags: ["public cloud", "aws", "eks hybrid nodes"]
sidebar_position: 4
---

This guide explains how to create an EKS cluster with the required configuration so it can be imported into Palette.

## Prerequisites

- Access to the AWS Management Console.

- _(Optional)_ The [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) is installed
  and configured for your account.

- Network connectivity between your on-prem environments and AWS.

  - An AWS VPC and subnet setup as guided in
    [AWS VPC and subnet setup](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-networking.html#hybrid-nodes-networking-vpc).
    During cluster creation, you will need to specify your configured VPC and subnets, as well as the CIDR block for
    your AWS node network.

  - A cluster security group is configured for your
    [Amazon EKS Hybrid Nodes environment](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-networking.html#hybrid-nodes-networking-cluster-sg).
    During cluster creation, you will need to specify this as an additional security group.

  - Your on-prem network is configured for hybrid network connectivity as guided in
    [On-premises networking configuration](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-networking.html#hybrid-nodes-networking-on-prem).
    During cluster creation, you will need to provide the CIDR blocks for your on-prem node and pod network.

- An Amazon EKS cluster Identity and Access Management (IAM) role created with the necessary policies attached as guided
  in
  [Step 1: Create cluster IAM role](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-cluster-create.html#hybrid-nodes-cluster-create-iam).
  You will need to specify the IAM role during cluster creation.

- An Amazon EKS node IAM role created with the necessary policies attached as guide in
  [Amazon EKS node IAM role](https://docs.aws.amazon.com/eks/latest/userguide/create-node-role.html). You will need to
  specify the IAM role when creating a managed node group for your cluster.

## Create the EKS Cluster

These steps use the AWS Management Console.

1. Log in to the [Amazon EKS console](https://console.aws.amazon.com/eks/home#/clusters).

2. Click **Create cluster**.

3. On the **Configure cluster** page, select **Custom configuration** in **Configuration options**.
4. In the **Cluster configuration** section, enter a cluster **Name**.

5. Select your Amazon EKS cluster IAM role for the **Cluster IAM role**. For example, `myAmazonEKSClusterRole`.

6. In the **Cluster access** section, select **EKS API and ConfigMap** as the **Cluster authentication mode**.

7. You can configure the remaining options as needed. Click **Next** when complete.

8. On the **Specify networking** page, in the **Networking** section, select your Amazon EKS Hybrid VPC and subnets for
   **VPC** and **Subnets**.

9. For **Additional security groups**, select the security group created for your Amazon EKS Hybrid Nodes environment.

10. For **Choose cluster IP address family**, ensure **IPv4** is selected.

11. Enable the toggle for **Configure Kubernetes service IP address block**, and provide the CIDR block for your AWS
    node network in the **Service IPv4 range** field.

    For example, `10.100.0.0/16`.

12. Enable the toggle for **Configure remote networks to enable hybrid nodes**.

13. Click **Add new CIDR block** for **Remote node networks** and provide the CIDR block for your on-prem node network
    in the **Node CIDR block** field.

    For example, `10.200.0.0/16`.

    Add as many entries as needed.

14. Click **Add new CIDR block** for **Remote pod networks** and provide the CIDR block for your on-prem pod network in
    the **Pod CIDR block** field.

    For example, `192.168.0.0/16`.

    Add as many entries as needed.

15. In the **Cluster endpoint access** section, select the **Public** or **Private** option.

    :::warning

    The **Public and private** option is not supported for Amazon EKS Hybrid Nodes.

    :::

16. You can configure the remaining options as needed. Click **Next** when complete.

17. On the **Configure observability** page, configure the options as needed. Click **Next** when complete.

18. On the **Select add-ons** page, you must check the box to enable the **Amazon VPC CNI** in **AWS add-ons**.

    :::info

    The "Not compatible with Hybrid Nodes" warning is ignored in this case as affinity rules will be configured during
    the [Configure CNI for Hybrid Nodes](../import-eks-cluster-enable-hybrid-mode.md#configure-cni-for-hybrid-nodes)
    steps to ensure compatibility with your hybrid nodes.

    :::

19. Select the remaining add-ons as needed. Click **Next** when complete.

20. On the **Configure selected add-ons settings** page, configure the add-ons as needed. Click **Next** when complete.

21. On the **Review and create** page, review your settings and click **Create** when ready.

22. Wait until the cluster status shows **Active** in the EKS console before moving onto the next step.

23. Follow the steps in
    [Create a managed node group for your cluster](https://docs.aws.amazon.com/eks/latest/userguide/create-managed-node-group.html)
    to create a managed node group with the following configuration:

    - **Minimum size** - The node group must contain _at least one node_ to host the Palette agent, which is essential
      for Palette to manage the cluster. Due to the EKS architecture, the Palette agent cannot be installed on the EKS
      control plane.

    - **Instance types** - The node must use an instance type of at least **t3.xlarge** to ensure adequate resources.
    - **Disk size** - AWS sets a default storage of **20 GB** for Linux-based EKS worker nodes (the
      [diskSize](https://docs.aws.amazon.com/eks/latest/APIReference/API_CreateNodegroup.html#API_CreateNodegroup_RequestSyntax)
      parameter), and we recommend this as the minimum size.

    You can configure all other options as needed.

    :::warning

    To maintain continuous management capabilities, at least one worker node should remain available at all times for
    the Palette agent to operate.

    :::

24. _(Optional)_ Obtain the kubeconfig for the cluster by following the steps in
    [Step 3: Update kubeconfig](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-cluster-create.html#hybrid-nodes-cluster-create-kubeconfig).

## Validate

1. In the EKS console, click on your cluster.

2. Click the **Compute** tab.

3. In the **Node groups** section, ensure that your newly created node group is **Active**.

4. _(Optional)_ If you obtained the kubeconfig for the cluster, using kubectl, check that nodes are **Ready** by issuing
   the following command.

   ```bash
   kubectl get nodes
   ```

   Example output

   ```shell hideClipboard
   NAME          STATUS   ROLES    AGE    VERSION
   worker-node   Ready    <none>   28h    v1.30.0
   ```

## Next Steps

If you have completed all sections as highlighted in [Prepare Environment](./prepare-environment.md), you can now
proceed to [import the cluster into Palette](../import-eks-cluster-enable-hybrid-mode.md).
