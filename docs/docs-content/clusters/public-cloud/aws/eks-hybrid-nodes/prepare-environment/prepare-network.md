---
sidebar_label: "Prepare Network"
title: "Prepare Network"
description: "Learn how to prepare your network for Amazon EKS Hybrid Nodes."
hide_table_of_contents: false
tags: ["public cloud", "aws", "eks hybrid nodes"]
sidebar_position: 1
---

Preparing your network for Amazon EKS Hybrid Nodes involves configuring both the AWS environment and your edge location.
You’ll also need a secure inter-site connection to enable communication between the edge hosts and your Amazon
EKS cluster.

The three main areas you need to configure are:

1. AWS Region
2. Edge Location
3. Inter-Site Connectivity

This section provides example configurations for each of these areas. The full example is represented in the following diagram.

![Example Amazon EKS Hybrid Nodes network architecture](/eks-hybrid_prepare-environment_prepare-network_network-example.webp)

<!-- [Prepare networking for hybrid nodes](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-networking.html) -->

## AWS Region

- Outline required subnets, route tables, NAT/IGW, security groups, etc.

## Edge Location

- Describe the local environment, IP ranges, firewall settings, and DNS considerations.

## Inter-Site Connectivity

- Provide details on typical VPN or AWS Direct Connect setups, including routing, BGP settings, and required IP address
  blocks.
