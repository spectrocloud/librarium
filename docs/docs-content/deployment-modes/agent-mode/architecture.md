---
sidebar_label: "Architecture"
title: "Agent Mode Architecture"
description: "Learn about the architecture of agent mode and its minimal hardware requirements."
hide_table_of_contents: false
sidebar_position: 20
tags: ["edge"]
---

The following are architectural highlights of clusters deployed using agent mode.

- You can bring an existing host with an Operating System (OS) of your choice.

- You may also build the Palette agent into your OS image to have the agent natively installed on your host.

- Support for bare metal, public clouds, data centers, and Edge devices.

- Support for single-node and multi-node deployments.

- Customizable site properties such as network proxies and certificates for Edge deployments.

- Configurable Kubernetes API servers to work with virtual IP address (VIP) or Dynamic DNS.

![Architecture Diagram for Agent Mode](/deployment-modes_agent-mode.webp)

## Limitations

- The Palette Optimized Canonical distribution that supports Canonical Kubernetes is a Tech Preview feature and does not
  support the following:
  - Non-Edge environments
  - ARM64 architecture
  - OS other than Ubuntu
  - Palette VerteX
  - Custom installation paths for Kubernetes and its dependencies in [agent mode](../)
  - [Network overlay](../../../clusters/edge/networking/vxlan-overlay/)

## Supported Kubernetes Distributions

Agent mode deployments support the following Kubernetes distributions:

- PXK-E
- K3s
- Canonical

:::preview

The **Palette Optimized Canonical** distribution that supports Canonical Kubernetes is a Tech Preview feature and is
subject to change. Do not use this feature in production workloads.

:::

## Minimum Device Requirements

Agent mode deployments support both AMD64 and ARM64 architectures. The numbers presented in this section are the bare
minimum required for the operating system, Palette agent, and lightweight Kubernetes distributions only and do not
account for any application workloads. The actual requirement for your hardware depends on your workload.

| Component | Requirement                                                                                                                                              |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CPU Core  | Minimum four cores.                                                                                                                                      |
| Memory    | Minimum four GB.                                                                                                                                         |
| Storage   | Main drive requires a minimum of 32 GB storage to accommodate the Operating System (OS), Kubernetes, and workloads. The main drive must be an SSD drive. |
