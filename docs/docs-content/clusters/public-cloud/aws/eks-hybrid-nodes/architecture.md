---
sidebar_label: "Architecture"
title: "Architecture"
description: "Learn about the architecture used by Amazon EKS Hybrid Nodes when deployed with Palette."
hide_table_of_contents: false
tags: ["public cloud", "aws", "architecture", "eks hybrid nodes"]
sidebar_position: 0
---

Palette enables importing and managing Amazon Elastic Kubernetes Service (Amazon EKS) Hybrid Nodes. For an overview of
all necessary prerequisites, refer to
[Prerequisite setup for hybrid nodes](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-prereqs.html).

These are some of the architectural highlights when using Palette to manage your Amazon EKS Hybrid Nodes.

- Add a [Cilium](https://cilium.io/) Container Network Interface (CNI) layer to your Amazon EKS cluster to handle
  networking for hybrid nodes using affinity rules.

- Create hybrid node pools comprising edge hosts that have been registered with Palette.

- Define cluster profiles to collectively manage your hybrid nodes. Each cluster profile for a hybrid node pool includes
  the following configurable layers:

  - If you are using [Appliance Mode](../../../../deployment-modes/appliance-mode.md), configure the Operating System
    (OS) layer to reference the provider image built during the
    [EdgeForge](../../../edge/edgeforge-workflow/edgeforge-workflow.md) workflow and optional customizations for your
    hybrid nodes.

  - Configure the Kubernetes layer to specify the correct [Amazon EKS Distro](https://distro.eks.amazonaws.com/) kubelet
    version to be installed on hybrid nodes.

## Hybrid Network Connectivity

Network connectivity between your on-prem environments, edge locations, and Amazon EKS cluster must be established
before Palette can manage your Amazon EKS Hybrid Nodes.

In the following example, an Amazon EKS cluster is connected to an on-prem data center and edge location through an AWS
Transit Gateway and AWS Site-to-Site Virtual Private Network (VPN).

![Example Amazon EKS Hybrid Nodes network architecture](/aws_eks-hybrid_architecture_eks-hybrid-architecture.webp)

Hybrid network connectivity can be configured using a variety of methods, such as:

- [AWS Site-to-Site VPN](https://docs.aws.amazon.com/vpn/latest/s2svpn/VPC_VPN.html)
- [AWS Direct Connect](https://docs.aws.amazon.com/whitepapers/latest/aws-vpc-connectivity-options/aws-direct-connect.html)
- [Software VPN](https://docs.aws.amazon.com/whitepapers/latest/aws-vpc-connectivity-options/software-vpn.html)

Refer to
[Network-to-Amazon VPC connectivity options](https://docs.aws.amazon.com/whitepapers/latest/aws-vpc-connectivity-options/network-to-amazon-vpc-connectivity-options.html)
for guidance on all available options.

### Configuration Requirements

If using a VPN or AWS Direct Connect between AWS and your on-prem and edge environments, review the following
configuration requirements.

#### AWS

<!-- Commented out until greenfield provisioning is available -->
<!-- Configure your EKS cluster with static placement so that your nodes are assigned to specific Availability Zones (AZs)
and fixed networking configurations. This is required because of the following reasons:

- The VPN configuration must be set up with predefined routes and IP ranges.
- Node placement cannot change dynamically across AZs.
- Network paths need to remain consistent for VPN tunnels to function properly. -->

Traffic routing in the Amazon EKS VPC requires the following mapping for hybrid nodes:

- Route table entries mapping hybrid node CIDR ranges to VPN endpoint.  
  For example, Hybrid Node CIDR 10.200.0.0/16 → VPN endpoint 172.16.0.1.

- Route table entries mapping hybrid pod CIDR ranges to VPN endpoint.  
  For example, Hybrid Pod CIDR 192.168.0.0/16 → VPN endpoint 172.16.0.1.

- For AWS Direct Connect, map traffic to appropriate private subnet CIDR.  
  For example, both CIDRs 10.200.0.0/16 & 192.168.0.0/16 → Private subnet 172.16.1.0/24.

For AWS VPNs, configure two static routes for each of the following CIDRs:

- Hybrid Node CIDR block.  
  For example, Hybrid Node CIDR 10.200.0.0/16 → VPN endpoint 172.16.0.1.

- Hybrid Pod CIDR block.  
  For example, Hybrid Pod CIDR 192.168.0.0/16 → VPN endpoint 172.16.0.1.

If you're using a Virtual Private Gateway or Transit Gateway, route propagation can be enabled to automatically populate
your VPC route tables. Ensure you verify your route tables after propagation.

## Operating System Compatibility

Palette supports the same operating systems as AWS. Refer to
[Prepare operating system for hybrid nodes](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-os.html) for
details.

## Supported Edge Hosts

Palette allows you to use your edge hosts as your Amazon EKS Hybrid Nodes. Your edge hosts need to be registered with
Palette before you can add them to your node pools.

If you want to use your edge hosts as Amazon EKS Hybrid Nodes, they must have been registered using one of the following
methods:

- [Agent Mode](../../../../deployment-modes/agent-mode/agent-mode.md)
- [Appliance Mode](../../../../deployment-modes/appliance-mode.md) using the
  [EdgeForge workflow](../../../edge/edgeforge-workflow/edgeforge-workflow.md).

Follow the steps in [Prepare Edge Hosts](./prepare-environment/prepare-edge-hosts.md) to prepare your edge hosts using
either of these methods.

## Authentication and Access Management

Palette supports the following authentication methods for your hybrid nodes:

- [AWS Systems Manager (SSM)](https://docs.aws.amazon.com/systems-manager/latest/userguide/what-is-systems-manager.html)

  - It is recommended to use AWS SSM Hybrid Activations if you lack Public Key Infrastructure (PKI) and certificates for
    your on-prem environment. AWS SSM hybrid activations allow you to register and manage your hybrid nodes without
    requiring a CA-signed certificate.

- [AWS Identity and Access Management (IAM) Roles Anywhere](https://docs.aws.amazon.com/rolesanywhere/latest/userguide/introduction.html)

  - IAM Roles Anywhere is not supported on some operating systems. Refer to the
    [Operating system considerations](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-os.html#_operating_system_considerations)
    for up-to-date guidance.
  - This is the recommended approach if you have existing Public Key Infrastructure (PKI) and certificates for your
    on-prem environment.

Refer to
[Prepare credentials for hybrid nodes](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-creds.html) for
guidance on how to set up credentials for your hybrid nodes.

## Amazon EKS Cluster Requirements

Follow the steps in [Prepare EKS Cluster](./prepare-environment/prepare-eks-cluster.md) to create an Amazon EKS cluster
that can be imported into Palette.

The following is an overview of the cluster requirements:

- **Hybrid Node Enablement**: The cluster must be enabled for hybrid nodes, as outlined in
  [Create an Amazon EKS cluster with hybrid nodes](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-cluster-create.html).

- **Container Network Interface (CNI)**: The **AWS VPC CNI** must be used as the cluster’s CNI as it is needed for cloud
  worker nodes to function. Although the AWS Console may display a warning indicating that the AWS VPC CNI is not
  supported for hybrid nodes, this can be safely disregarded.

- **Worker Node Requirements for the Palette Agent**: At least one worker node is required to host the Palette agent,
  which is essential for Palette to manage the cluster. Due to the EKS architecture, the Palette agent cannot be
  installed on the EKS control plane.

  - **Minimum Instance Type**: Worker nodes must use an instance type of at least **t3.xlarge** to ensure adequate
    resources. AWS sets a default storage of 20 GB for Linux-based EKS worker nodes (the
    [diskSize](https://docs.aws.amazon.com/eks/latest/APIReference/API_CreateNodegroup.html#API_CreateNodegroup_RequestSyntax)
    parameter), and we recommend this as the minimum size.

  - **Ongoing Node Availability**: To maintain continuous management capabilities, at least one worker node should
    remain available at all times for the Palette agent to operate effectively.
