---
sidebar_label: "EKS Hybrid Nodes"
title: "EKS Hybrid Nodes"
description: "Learn about how Palette supports deployment of Amazon EKS Hybrid Nodes."
tags: ["public cloud", "aws", "eks hybrid nodes"]
hide_table_of_contents: false
---

Palette supports management of
[Amazon EKS Hybrid Nodes](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-overview.html). Using Palette to
manage Amazon EKS Hybrid Nodes provides the following benefits:

- Easier Setup: Palette automates the process of setting up and connecting on-prem devices (bare metal or virtual
  machines) to EKS clusters, reducing the need for manual configuration.

- Centralized Management: Palette offers a single interface to manage the lifecycle of EKS Hybrid Nodes, ensuring
  consistent control over Kubernetes resources across on-prem, edge, and AWS environments.

- Improved Recovery Options: Palette supports managing multiple edge sites under a single control plane, making it
  easier to move workloads to other sites in case of hardware or site failures.

Using Amazon EKS Hybrid Nodes also reduces resource usage at edge locations by operating the control plane in AWS
instead of at each edge site. This minimizes CPU, memory, and storage device wear on edge hosts while leaving more
capacity for workloads.

## Resources

To learn more about Palette and Amazon EKS Hybrid Nodes, check out the following resources:

- [Architecture](./architecture.md)

- [Import EKS Cluster and Enable Hybrid Mode](./import-eks-cluster-enable-hybrid-mode.md)

- [Create Hybrid Node Pools](./create-hybrid-node-pools.md)

- [Bringing Amazon EKS Hybrid Nodes to life with Palette](https://www.spectrocloud.com/blog/eks-hybrid-nodes)
