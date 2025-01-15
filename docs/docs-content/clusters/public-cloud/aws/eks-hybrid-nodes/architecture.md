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

  - Configure the Operating System (OS) layer to reference the provider image built during the
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

#### On-Prem and Edge Locations

For on-prem and edge VPNs, set up IPsec Phase 1 tunnels with Phase 2 security associations for the following:

- Hybrid Node subnet to EKS VPC CIDR.  
  For example, Hybrid Node subnet 10.201.0.0/16 → EKS VPC CIDR 10.100.0.0/16.

- Hybrid Node pod CIDR to EKS VPC CIDR.  
  For example, Hybrid Node Pod CIDR 192.168.0.0/16 → EKS VPC CIDR 10.100.0.0/16.

You should also configure Border Gateway Protocol (BGP) or static routes on your on-prem or edge location router to
ensure network traffic reaches the correct hybrid nodes. For static routing, this is explained in more detail during the
[Configure Hybrid Node Networking for VPN Solutions](./create-hybrid-node-pools.md#configure-hybrid-node-networking-for-vpn-solutions)
steps.

A route must exist to send all traffic destined for the Amazon EKS VPC through a centralized VPN gateway, or
alternatively, a unique VPN server IP can be defined for each hybrid node during the
[Create Hybrid Node Pool](./create-hybrid-node-pools.md#create-hybrid-node-pool) steps.

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
- [EdgeForge Workflow](../../../edge/edgeforge-workflow/edgeforge-workflow.md)
  - Part of the EdgeForge workflow is to create [Kairos-based images](https://kairos.io/) containing the OS and the
    desired Kubernetes versions. These are named provider images. You also need to ensure the required bind mounts are
    specified in the user-data configuration. Refer to the [Bind Mount Requirements](#bind-mount-requirements) section
    for more information.

:::warning

Your edge host package managers must have up-to-date package indexes. This is to ensure that dependency packages for
[`nodeadm`](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-nodeadm.html) can be successfully downloaded
and installed.

For example, on Ubuntu, you would issue the following command.

```shell
sudo apt-get update
```

Adjust to your operating system and package manager on your edge hosts.

:::

### Bind Mount Requirements

If you are using [Appliance Mode](../../../../deployment-modes/appliance-mode.md) to deploy your edge hosts, ensure the
following bind mounts are specified in the user-data configuration. Add the following snippet to your user-data file.

```yaml
install:
  extra-dirs-rootfs:
    - /eks-hybrid
  bind_mounts:
    - /eks-hybrid
    - /etc/aws
    - /etc/containerd
    - /etc/eks
    - /etc/iam
    - /etc/modules-load.d
    - /var/lib/amazon
```

This snippet ensures that the required directories are mounted and available on your edge hosts.

### Build Provider Images with Specific Arguments

If using the EdgeForge Workflow, you must include the following in your `.arg` file during the
[build steps for provider images](../../../edge/edgeforge-workflow/palette-canvos/build-provider-images.md#build-provider-images).

```shell
K8S_DISTRIBUTION=nodeadm
K8S_VERSION=<kubernetesVersion>  # supported versions: [ 1.28.0 | 1.29.0 | 1.30.0 | 1.31.0 ]
```

Replace `<kubernetesVersion>` with your version of Kubernetes. For example, `1.29.0`.

## Authentication and Access Management

Palette supports the following authentication methods for your hybrid nodes:

- [AWS Systems Manager (SSM)](https://docs.aws.amazon.com/systems-manager/latest/userguide/what-is-systems-manager.html)
- [AWS Identity and Access Management (IAM) Roles Anywhere](https://docs.aws.amazon.com/rolesanywhere/latest/userguide/introduction.html)

Refer to
[Prepare credentials for hybrid nodes](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-creds.html) for
guidance on how to set up credentials for your hybrid nodes.
