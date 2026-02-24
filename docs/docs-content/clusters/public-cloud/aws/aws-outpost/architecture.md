---
sidebar_label: "Architecture"
title: "Architecture"
description: "Learn about the architecture used for AWS Outposts."
hide_table_of_contents: false
tags: ["public cloud", "aws", "aws outposts"]
sidebar_position: 30
---

Palette allows you to use an AWS Outpost server at Edge.

These are some of the architectural highlights when using Palette to manage your AWS Outpost.

## Limitations

Only Ubuntu is supported for AWS Outposts servers.

## Supported Edge Hosts

Palette allows you to set up your AWS Outpost as an edge host. You must register your edge hosts with Palette before you
can add them to your node pools.

You can only use AWS Outpost as an edge host if you register it in
[Agent Mode](../../../../deployment-modes/agent-mode/agent-mode.md). Follow the steps in Follow the steps in
[Configure Edge on AWS Outpost](./configure-edge-on-aws-outpost.md) to configure your edge host.
