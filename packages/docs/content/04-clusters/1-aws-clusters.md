---
title: "Creating AWS Clusters"
metaTitle: "Creating AWS Clusters in Spectro Cloud"
metaDescription: "Detailed instructions on how to create clusters on Amazon AWS within Spectro Cloud"
icon: ""
---

# Overview

The Following is the deployment architecture for AWS cluster. 

The Kubernetes nodes are distributed across multiple AZs to achieve high availability. For each of the AZ that you choose, a public subnet and a private subnet is created. 

All the control plane nodes and worker nodes are created within the private subnets so there is no direct public access available. 

A NAT gateway is created in the public subnet of each AZ, to allow nodes in the private subnet be able to go out to the internet or call other AWS services. 

An Internet gateway is created for each VPC, to allow SSH access to the bastion node for debugging purposes. SSH into kubernetes nodes is only available through the Bastion node. 

The APIServer endpoint is accessible through an ELB, which load balancing across all the control plane nodes.

![aws_cluster_architecture.png](aws_cluster_architecture.png)
