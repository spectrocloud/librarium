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

:::preview

:::

The diagram below illustrates the agent mode cluster provisioning workflow.

![Architecture Diagram for Agent Mode](/deployment-modes_agent-mode.webp)

The order of operations can be summarized as follows:

1. You provide a host as well as an Operating System (OS) that will operate on your host.

2. You install the Palette agent on your host. Alternatively, you may build the Palette agent into your OS image.

3. You create a cluster profile in Palette. The profile contains the Kubernetes distribution, the Container Network
   Interface (CNI), the Container Storage Interface (CSI) as well as any other applications.

4. If the agent is installed on your host in connected mode, it will register the host with Palette.

   If the agent is installed on your host in airgap mode, you will need to export the cluster profile. Depending on
   whether your host has access to image registries, you may also need to build a content bundle.

5. If the agent is installed on your host in connected mode, you can use the registered host to provision a cluster with
   your cluster profile.

   If the agent is installed on your host in airgap mode, you can use the exported cluster profile to provision a
   cluster from Local UI.

## Use Cases

Agent mode is designed to work across a variety of environments, including public clouds, on-prem data centers, and Edge
locations. Currently, the validated use case for agent mode includes [Edge](../../clusters/edge/edge.md).

| Use Case | Supported Environments                                                                                                  |
| -------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Edge** | [VMware vSphere](../../clusters/edge/site-deployment/virtual-deployment/virtual-deployment.md)<br />Bare metal machines |

## Next Steps

Review the architecture and basic hardware requirements for operating clusters in agent mode in
[Architecture](./architecture.md).

Follow the instructions in [Install Palette Agent](install-agent-host.md) to install the agent on your host and deploy
your first agent-mode cluster.

## Resources

- [Architecture](./architecture.md)

- [Install Palette Agent](install-agent-host.md)

- [Manage Hosts in Agent Mode](./manage-agent/manage-agent.md)
