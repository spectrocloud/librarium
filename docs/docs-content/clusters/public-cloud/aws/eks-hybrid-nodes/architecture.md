---
sidebar_label: "Architecture"
title: "Architecture"
description: "Learn about the architecture used by Amazon EKS Hybrid Nodes when deployed with Palette."
hide_table_of_contents: false
tags: ["public cloud", "aws", "architecture", "eks hybrid nodes"]
sidebar_position: 0
---

Palette enables importing and managing Amazon Elastic Kubernetes Service (Amazon EKS) Hybrid Nodes. Review the following
architectural highlights when using Palette to manage your Amazon EKS Hybrid Nodes.

- Create hybrid node pools comprised of edge hosts that have been registered with Palette.

- Define cluster profiles to collectively manage your hybrid nodes. Each cluster profile for a hybrid node pool includes
  the following layers:

  - Configure Operating System (OS) layers to reference the provider image built during the
    [EdgeForge](../../../edge/edgeforge-workflow/edgeforge-workflow.md) workflow and optional customizations for your
    hybrid nodes.

  - Configure Kubernetes layers to specify the correct [Amazon EKS Distro](https://distro.eks.amazonaws.com/) version to
    be installed on hybrid nodes.

  - Configure Container Network Interface (CNI) layers to handle networking for hybrid nodes using affinity rules.

## Hybrid Network Connectivity

Network connectivity between your on-premises environments, edge locations, and Amazon EKS cluster must be established
before Palette can manage your Amazon EKS Hybrid Nodes.

In the following example, an Amazon EKS cluster is connected to an on-premises datacenter and edge location through an
AWS Transit Gateway and AWS Site-to-Site Virtual Private Network (VPN).

![Example Amazon EKS Hybrid Nodes network architecture](/aws_eks-hybrid_architecture_eks-hybrid-architecture.webp)

Hybrid network connectivity can be configured using a variety of methods, such as:

- [AWS Site-to-Site VPN](https://docs.aws.amazon.com/vpn/latest/s2svpn/VPC_VPN.html)
- [AWS Direct Connect](https://docs.aws.amazon.com/whitepapers/latest/aws-vpc-connectivity-options/aws-direct-connect.html)
- [Software VPN](https://docs.aws.amazon.com/whitepapers/latest/aws-vpc-connectivity-options/software-vpn.html)

Refer to
[Network-to-Amazon VPC connectivity options](https://docs.aws.amazon.com/whitepapers/latest/aws-vpc-connectivity-options/network-to-amazon-vpc-connectivity-options.html)
for guidance on all available options.

### Configuration Requirements

If using a VPN or AWS Direct Connect between AWS and your on-premises and edge environments, review the following
configuration requirements.

- Configure your EKS cluster with static placement so that your nodes are assigned to specific Availability Zones (AZs)
  and fixed networking configurations. This is required because of the following reasons:

  - The VPN configuration must be set up with predefined routes and IP ranges.
  - Node placement cannot change dynamically across AZs.
  - Network paths need to remain consistent for VPN tunnels to function properly.

- Traffic routing in the Amazon EKS VPC requires the following mapping for hybrid nodes:

  - Route table entries mapping hybrid node CIDR ranges to VPN endpoint.  
    For example, Hybrid Node CIDR 10.200.0.0/16 → VPN endpoint 172.16.0.1.

  - Route table entries mapping hybrid pod CIDR ranges to VPN endpoint.  
    For example, Hybrid Pod CIDR 192.168.0.0/16 → VPN endpoint 172.16.0.1.

  - For AWS Direct Connect, map traffic to appropriate private subnet CIDR.  
    For example, Both CIDRs 10.200.0.0/16 & 192.168.0.0/16 → Private subnet 172.16.1.0/24.

- For AWS VPNs, configure two static routes for each of the following connections:

  - Hybrid Node CIDR block.  
    For example, Hybrid Node CIDR 10.200.0.0/16 → VPN endpoint 172.16.0.1.

  - Hybrid Pod CIDR block.  
    For example, Hybrid Pod CIDR 192.168.0.0/16 → VPN endpoint 172.16.0.1.

  If you're using a Virtual Private Gateway or Transit Gateway, route propagation can be enabled to automatically
  populate your VPC route tables. Ensure you verify your route tables after propagation.

- For on-premises and edge VPNs, set up IPsec Phase 1 tunnels with Phase 2 security associations for the following:

  - Hybrid Node subnet to EKS VPC CIDR.  
    For example, Hybrid Node Subnet 10.201.0.0/16 → EKS VPC CIDR 10.100.0.0/16.

  - Hybrid Node pod CIDR to EKS VPC CIDR.  
    For example, Hybrid Node Pod CIDR 192.168.0.0/16 → EKS VPC CIDR 10.100.0.0/16.

  You should also enable either Border Gateway Protocol (BGP) routing or static routes to ensure proper traffic flow
  through VPN tunnels.

- For non-primary VPN servers, either broadcast routes via BGP or configure static routes to redirect EKS VPC CIDR
  traffic appropriately.

## Operating System Compatibility

Palette supports the same operating systems as AWS. Refer to
[Prepare operating system for hybrid nodes](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-os.html) for
guidance.

Edge hosts require additional dependencies and you can build these into provider images using the
[EdgeForge Workflow](../../../edge/edgeforge-workflow/edgeforge-workflow.md).

## Authentication and Access Management

Palette supports the following authentication methods for your hybrid nodes:

- [AWS Systems Manager (SSM)](https://docs.aws.amazon.com/systems-manager/latest/userguide/what-is-systems-manager.html)
- [AWS Identity and Access Management (IAM) Roles Anywhere](https://docs.aws.amazon.com/rolesanywhere/latest/userguide/introduction.html)

Refer to
[Prepare credentials for hybrid nodes](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-creds.html) for
guidance on how to setup credentials for your hybrid nodes.
