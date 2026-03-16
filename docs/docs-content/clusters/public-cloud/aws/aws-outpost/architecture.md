---
sidebar_label: "Architecture"
title: "Architecture"
description: "Learn about the architecture used for AWS Outposts."
hide_table_of_contents: false
tags: ["public cloud", "aws", "aws outposts"]
sidebar_position: 10
---

Palette supports the deployment of [Agent Mode](../../../../deployment-modes/agent-mode/agent-mode.md) Edge hosts in
your [AWS Outposts](https://aws.amazon.com/outposts/) environments. Follow the steps in the
[Prepare Environment](./prepare-environment.md) page to prepare your Outpost server to use Palette.

These are some of the architectural highlights when using Palette with your AWS Outposts environment.

- AWS Outposts extends the Virtual Private Cloud (VPC) from your AWS cloud account into your local environment, while
  providing a connection between your on premises network and AWS.

- Your AWS Outposts server is connected to your local network through the Local Network Interface (LNI) and maintains a
  service link to the AWS region.

- Configure a [capacity task](https://docs.aws.amazon.com/outposts/latest/userguide/modify-instance-capacity.html) to
  provision the compute and storage capacity available on your Outposts server. This capacity configures the
  `c6id.metal` instance type on your on-premises environment.

- Create a [subnet](https://docs.aws.amazon.com/outposts/latest/server-userguide/launch-instance.html#create-subnet) in
  your VPC for your Outpost server to allow workloads running on the Outpost to communicate with resources in the VPC. A
  subnet is required per Outpost server.

- Launch an [Amazon Elastic Compute Cloud (EC2)](https://aws.amazon.com/ec2/) configured with your instance size,
  Outpost VPC, and subnet. Configure [Agent Mode](../../../../deployment-modes/agent-mode/agent-mode.md) using the
  instance user data, enabling you to register and connect your Edge host to Palette.

The following diagram presents an overview of an AWS Outposts environment.

![AWS Outposts architecture](/aws-outposts-architecture-diagram.webp)
