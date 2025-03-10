---
sidebar_label: "Prepare Environment"
title: "Prepare Environment"
description: "Learn how to prepare your environment for Amazon EKS Hybrid Nodes."
tags: ["public cloud", "aws", "eks hybrid nodes"]
hide_table_of_contents: false
---

Before Palette can manage your Amazon EKS cluster and Amazon EKS Hybrid Nodes, you must suitably prepare your
environment. The [AWS documentation](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-prereqs.html)
provides an overview of the prerequisites and the high level steps that are required for Palette management are as
follows:

- Configure your AWS and hybrid network to allow communication between your Kubernetes control plane, worker nodes, and
  pods.

- Configure IAM credentials for your hybrid nodes using either AWS Systems Manager (AWS SSM) or AWS IAM Roles Anywhere.

- Register your edge hosts with Palette using either Agent Mode or Appliance Mode.

- Create your Amazon EKS cluster with the required configuration for successful import into Palette.

:::info

The steps described in
[Prepare cluster access for hybrid nodes](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-cluster-prep.html)
are performed as part of the
[Import EKS Cluster and Enable Hybrid Mode](../import-eks-cluster-enable-hybrid-mode.md#import-cluster) steps.

:::

## Resources

Use the following resources to help you prepare your environment.

- [Prepare Network](./prepare-network.md)

- [Prepare credentials for hybrid nodes](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-creds.html)

- [Prepare Edge Hosts](./prepare-edge-hosts.md)

- [Prepare EKS Cluster](./prepare-eks-cluster.md)
