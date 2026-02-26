---
sidebar_label: "Architecture"
title: "Architecture"
description: "Learn about the architecture used for AWS Outposts."
hide_table_of_contents: false
tags: ["public cloud", "aws", "aws outposts"]
sidebar_position: 30
---

Palette allows you to use AWS Outposts servers as Edge hosts. AWS Outposts allow you to run Palette in a self-hosted server while still maintaining the benefits of the AWS environment. 

These are some of the architectural highlights when using Palette to manage your AWS Outposts.

##  Edge Hosts on AWS Outposts Architecture 

You must order and
[install an AWS Outposts server](https://docs.aws.amazon.com/outposts/latest/install-server/install-server.html) at your
site before you can configure your Edge host. AWS manages the delivery and initial configuration of the AWS outposts server at your site.

- Palette Edge hosts require a bare metal server for AWS Outposts. AWS provides AWS Outposts servers in specific configurations. We recommend the **c6id.32xlarge** configuration for your server. 
  
- You must configure your AWS Outposts server's capacity with an **Instance type** of **c6id.metal** and set the **Instance quantity** to **1**. 
  
- You must [Create a subnet](https://docs.aws.amazon.com/outposts/latest/server-userguide/launch-instance.html#create-subnet)
   for your Outpost. This ensures that your server can communicate with Palette.
  
Follow the steps in
[Configure Edge on AWS Outpost](./configure-edge-on-aws-outpost.md) to configure your edge host.

## Network structure

Palette Edge on AWS Outposts extends your VPC into your on-premises environment. 

In the following diagram, your AWS Outposts server is installed at your site and runs an EC2 bare metal instance. This instance hosts Palette Edge in Agent Mode as well as Kubernetes. 

The Edge host is on an Outpost subnet within your AWS VPC and receives a private IP address. 

Your Outpost server remains connected to your local network through the Local Network Interface (LNI) and also maintains a connection to the AWS region. Palette runs locally on your Edge host and includes a local control plane, and your clusters will continue to function even if connectivity to AWS is lost. 


