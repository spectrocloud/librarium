---
title: "Architecture"
metaTitle: "AWS Architecture with Palette"
metaDescription: "Learn about Palette and the architecture used to support Palette"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# AWS IaaS Architecture


The following are some architectural highlights of the Amazon Web Services (AWS) clusters, provisioned by Palette:


- Kubernetes nodes can be distributed across multiple availability zones (AZs) to achieve high availability (HA). For each of the AZs that you select, a public subnet and a private subnet is created.


- All the control plane nodes and worker nodes are created within the private subnets, so there is no direct public access available.


- A Network Address Translation (NAT) Gateway is created in the public subnet of each AZ, to allow nodes in the private subnet to be able to go out to the internet or call other AWS services.


- An Internet Gateway (IG) is created for each Virtual Private Cloud (VPC), to allow Secure Shell Protocol (SSH) access to the bastion node for debugging purposes. SSH into Kubernetes nodes is only available through the bastion node. A bastion node helps to provide access to the Amazon Elastic Compute Cloud (EC2) instances. This is because the EC2 instances are created in a private subnet and the bastion node operates as a secure, single point of entry into the infrastructure. The bastion node can be accessed via SSH or Remote Desktop (RDP).


- The Kubernetes API Server endpoint is accessible through an Elastic Load Balancing (ELB), which load balances across all the control plane nodes.

![A diagram of AWS architecture](clusters_aws_architecture_aws_cluster_architecture.png)


# AWS EKS Architecutre

Palette also supports deploying and managing AWS Elastic Kubernetes Service (EKS) clusters. Review the architectural highlights pertaining to EKS when managed by Palette.

- Cluster resources such as Virtual Machines (VMs) can be provisioned into an existing infrastructure (Gateways, VPCs, Subnets etc.) as part of static provisioning as well as new dedicated infrastructure as part of dynamic provisioning.


- Palette supports the usage of [EKS Fargate Profiles](https://docs.aws.amazon.com/eks/latest/userguide/fargate-profile.html).


- Spot instance support

 ![eks_cluster_architecture.png](clusters_aws_create-and-manage-aws-eks-cluster_architecture.png)


# Spot Instances

By default, worker pools are configured to use on-demand instances. However, to take advantage of discounted spot instance pricing you can specify Spot instances when creating a cluser. The **On-Spot** option can be selected in the node config page during cluster creation. This option allows you to specify a maximum bid price for the nodes as a percentage of the on-demand price. Palette tracks the current price for spot instances and launches nodes, when the spot price falls in the specified range.