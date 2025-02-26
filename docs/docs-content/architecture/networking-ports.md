---
sidebar_label: "Network Ports"
title: "Network Communication and Ports"
description: "Port-Direction-Purpose Management Platform and Workload Clusters"
icon: ""
hide_table_of_contents: false
# toc_min_heading_level: 2
toc_max_heading_level: 2
sidebar_position: 20
---

Depending on what version of Palette you are using, the internal architecture and network communication will be
different. Before Palette 4.0.0 the management platform communicated with the workload cluster via NATS. Starting with
Palette 4.0.0, the management platform communicates with the workload cluster via gRPC.

## SaaS Network Communications and Ports

The following ports must be reachable from a network perspective for Palette SaaS to function correctly.

### SaaS Managed Without a PCG

![SaaS Network Diagram with ports without a PCG](/architecture_networking-ports_saas-network-diagram-grpc-no-pcg.webp)

### SaaS Managed With a PCG

![SaaS Network Diagram with ports using a PCG](/architecture_networking-ports_saas-network-diagram-grpc.webp "title=SaaS Network Diagram with ports w/PCG")

### SaaS Managed With Edge

![SaaS network diagram displaying the network paths for edge](/architecture_networking-ports_saas-network-diagram-edge-grpc.webp)

## Network Ports

The following ports must be reachable from a network perspective for Palette to operate properly.

### Management Platform

| Port            | Direction | Purpose                                                      |
| :-------------- | :-------- | :----------------------------------------------------------- |
| HTTPS (tcp/443) | INBOUND   | Browser/API access to management platform .                  |
| HTTPS (tcp/443) | INBOUND   | gRPC communication between Palette and the workload cluster. |

### Workload Cluster

| Port            | Direction | Purpose                                                                    |
| :-------------- | :-------- | :------------------------------------------------------------------------- |
| HTTPS (tcp/443) | OUTBOUND  | API access to management platform and gRPC                                 |
| HTTPS (tcp/443) | OUTBOUND  | gRPC, Registry (packs, integrations), Pack containers, Application Updates |

:::info

You can expose inbound port 22 for SSH if you would like to access your cluster nodes for troubleshooting remotely. This
is entirely optional and not required for Palette to operate appropriately.

:::

## Self-Hosted Network Communications and Ports

![On-prem network diagram](/architecture_networking-ports_on_prem_network-diagram-grpc.webp)

The following ports must be reachable from a network perspective for Palette self-hosted to function correctly.

### Management Platform

| **Port**         | **Direction** | **Purpose**                                                                             |
| :--------------- | :------------ | :-------------------------------------------------------------------------------------- |
| HTTPS (tcp/443)  | INBOUND       | Browser/API access to management platform, gRPC                                         |
| HTTPS (tcp/443)  | OUTBOUND      | vSphere vCenter API, Registry (packs, integrations), Pack containers, app updates, gRPC |
| HTTPS (tcp/6443) | OUTBOUND      | Workload K8s cluster API Server                                                         |

### Workload Cluster

| **Port**        | **Direction** | **Purpose**                                                                                     |
| :-------------- | :------------ | :---------------------------------------------------------------------------------------------- |
| HTTPS (tcp/443) | OUTBOUND      | API access to management platform                                                               |
| HTTPS (tcp/443) | OUTBOUND      | vSphere vCenter API, gRPC, Registry (packs, integrations), Pack containers, Application updates |

:::info

You can expose inbound port 22 for SSH if you would like to access your cluster nodes for troubleshooting remotely. This
is entirely optional and not required for Palette to operate appropriately.

:::
