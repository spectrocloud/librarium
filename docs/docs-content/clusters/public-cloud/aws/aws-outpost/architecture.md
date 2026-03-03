---
sidebar_label: "Architecture"
title: "Architecture"
description: "Learn about the architecture used for AWS Outposts."
hide_table_of_contents: false
tags: ["public cloud", "aws", "aws outposts"]
sidebar_position: 10
---

Palette allows you to configure AWS Outposts servers as a Palette Edge host. Your edge hosts need to be registered with
Palette before you can add them to your node pools. With an AWS Outposts server, you can run Palette in a locally hosted
environment while still maintaining the benefits of the AWS ecosystem.

## Limitations

You must order and
[install an AWS Outposts server](https://docs.aws.amazon.com/outposts/latest/install-server/install-server.html) on your
premises before you can configure your Edge host. AWS manages the delivery and initial configuration of the AWS outposts
server at your site.

You must configure your AWS Outposts server's
[capacity](<(https://docs.aws.amazon.com/outposts/latest/userguide/modify-instance-capacity.html)>) with an **Instance
type** of **c6id.metal** and set the **Instance quantity** to **1**.

You must
[create a subnet](https://docs.aws.amazon.com/outposts/latest/server-userguide/launch-instance.html#create-subnet) for
your Outpost. This ensures that your server can communicate with Palette.

Follow the steps in [Prepare Environment](./prepare-environment.md) to prepare your Outposts server.

## Agent Mode

In [Agent Mode](../../../../deployment-modes/agent-mode/agent-mode.md), your server maintains a connection to Palette's
multi-tenant environment.

### Network structure

AWS Outposts extends your VPC into your local environment while providing a connection between your on premises network
and AWS.

In the following diagram, your AWS Outposts server is installed at your site and sits within your local on premises
network. Your Outposts server remains connected to your local network through the Local Network Interface (LNI) but also
maintains a service link to the AWS region.

The Edge host is deployed on a single EC2 instance and is in an Outposts subnet inside your network. This instance is
deployed in Agent Mode.

Your clusters will continue to function even if connectivity to AWS is lost.
