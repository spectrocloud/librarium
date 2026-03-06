---
sidebar_label: "Architecture"
title: "Architecture"
description: "Learn about the architecture used for AWS Outposts."
hide_table_of_contents: false
tags: ["public cloud", "aws", "aws outposts"]
sidebar_position: 10
---

Palette allows you use an Amazon Elastic Compute Cloud (EC2) instance deployed on an AWS Outposts server as either a self-hosted Palette instance or a Palette Edge host in [Agent Mode](../../../../deployment-modes/agent-mode/agent-mode.md). This lets you run Kubernetes in your on premises environment while still maintaining the benefits of the AWS ecosystem. 

In Agent Mode, your Amazon EC2 instance runs Kubernetes as an Edge host and is managed by Palette's multi-tenant environment. You must register your Edge host with Palette before you can add it to your node pools. If you lose connectivity to AWS or Palette, your clusters can continue to function until for up to seven days.  

In a self-hosted Palette instance, you deploy your Palette instance on an EC2 instance on AWS Outposts. Your Kubernetes clusters are managed by your local Palette and the control plane is inside your on premises environment. If you lose connectivity to AWS, your clusters will continue to function until connectivity returns. This is valuable for environments requiring stricter controls. 

Follow the steps in [Prepare Environment](./prepare-environment.md) to prepare your Outposts server to use Palette.

## Network structure

AWS Outposts extends your virtual private cloud (VPC) into your local environment while providing a connection between your on premises network and AWS.

In the following diagram, your AWS Outposts server is installed at your site and sits within your local on premises
network. Your AWS Outposts server remains connected to your local network through the Local Network Interface (LNI) but
also maintains a service link to the AWS region.

The Edge host is deployed on a single EC2 instance and is in an Outposts subnet inside your network. This instance is
deployed in Agent Mode.

![AWS Outposts network architecture](/clusters_public-cloud_aws_aws-outpost_architecture.webp)
