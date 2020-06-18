---
title: "Prerequisites for AWS"
metaTitle: "Prerequisites for creating AWS Clusters in Spectro Cloud"
metaDescription: "Prerequisites for creating AWS Clusters in Spectro Cloud"
icon: ""
---

# Prerequisites

Spectro Cloud creates compute, network and storage resources on AWS during provisioning of Kubernetes clusters. The following pre-requisites should be met for successful creation of clusters.

# Cloud Account Permissions

Ensure that the IAM user or the ROOT user has the minimum permissions specified in the AWS Cloud Account section:  [Task: Create AWS Cloud Account](/clusters/task-create-aws-cloud-account)

# Resource Capacity

A sufficient capacity in the desired AWS region should exist for the creation of the following resources:

* vCpu
* VPC
* Elastic IP
* Internet Gateway
* Elastic Load Balancers
* NAT Gateway
