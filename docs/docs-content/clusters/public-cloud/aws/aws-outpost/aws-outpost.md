---
sidebar_label: "AWS Outposts"
title: "AWS Outposts"
description: "Learn about how Palette supports deployment of AWS Outposts."
tags: ["public cloud", "aws", "aws outposts"]
hide_table_of_contents: false
---

Palette supports installing [Agent Mode](../../../../deployment-modes/agent-mode/agent-mode.md) Edge hosts on an EC2
instance on [AWS Outposts](https://docs.aws.amazon.com/outposts/latest/server-userguide/what-is-outposts.html) servers.

AWS Outposts provides the benefits of an AWS-managed service while also allowing you access to locally managed
resources. This decreases latency and allows for local data processing.

Palette allows you to run Kubernetes clusters locally in your AWS Outposts instance. If you lost connectivity to AWS or Palette, your existing clusters continue to operate locally. 


## Resources

- [Architecture](./architecture.md)
- [Prepare Environment](./prepare-environment.md)
- [Configure Edge on AWS Outpost](./configure-edge-on-aws-outpost.md)
