---
sidebar_label: "Architecture"
title: "Agent Mode Architecture"
description: "Learn about the architecture of agent mode and its minimal hardware requirements."
hide_table_of_contents: false
sidebar_position: 20
tags: ["edge"]
---

The following are architectural highlights of clusters deployed using in agent mode.

- You can bring an existing host with your an Operating System (OS) of your choice.

- You may also build the Palette agent into your OS image to have the agent natively installed on your host.

- Support for bare metal, public clouds, data centers, and Edge devices.

- Support for single-node and multi-node deployments.

- Customizable site properties such as network proxies and certificates for Edge deployments.

- Configurable Kubernetes API servers to work with virtual IP address (VIP) or Dynamic DNS.

![Architecture Diagram for Agent Mode](/deployment-modes_agent-mode.webp)

## Minimum Device Requirements

Agent mode deployments support both AMD64 and ARM64 architecture.

| Component | Requirement                                                                                                                                               |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CPU       | - Intel: i3, i5, i7, i9, Xeon series <br /> - AMD: Ryzen 3, 5, 7, 9, and Epyc series                                                                      |
| CPU Core  | Minimum two cores.                                                                                                                                        |
| Memory    | Minimum 8 GB.                                                                                                                                             |
| Storage   | Main drive requires a minimum of 100 GB storage to accommodate the Operating System (OS), Kubernetes, and workloads. The main drive must be an SSD drive. |
