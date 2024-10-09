---
sidebar_label: "Agent Mode"
title: "Agent Mode"
description: "Learn about agent mode, its use cases, and how to deploy a cluster in agent mode. "
hide_table_of_contents: false
sidebar_position: 20
tags: ["edge"]
---

In agent mode, you bring your own host, which can be any host that meets the minimum hardware requirements, regardless
of the environment. This includes options like an AWS EC2 instance or a Raspberry Pi in your own home. All you need to
do to have Palette manage your host is to [download and install the Palette agent](./install-agent-host.md).

The diagram below illustrates the agent mode cluster provisioning workflow.

![Architecture Diagram for Agent Mode](/deployment-modes_agent-mode.webp)

## Use Cases

Agent mode is designed to work across a variety of environments, including public clouds, on-prem data centers, and Edge
locations. Currently, the validated use case for agent mode includes [Edge](../../clusters/edge/edge.md).

| Use Case | Supported Environments                                                                                                  |
| -------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Edge** | [VMware vSphere](../../clusters/edge/site-deployment/virtual-deployment/virtual-deployment.md)<br />Bare metal machines |

## Resources

- [Architecture](./architecture.md)

- [Install Palette Agent](install-agent-host.md)

- [Manage Hosts in Agent Mode](./manage-agent/manage-agent.md)
