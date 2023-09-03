---
sidebar_label: "Network Ports"
title: "Network Communication and Ports"
description: "Port-Direction-Purpose Management Platform and Workload Clusters"
icon: ""
hide_table_of_contents: false
sidebar_position: 20
---


Depending on what version of Palette you are using, the internal architecture and network communication will be different. Before Palette 4.0.0 the management platform communicated with the workload cluster via NATS. Starting with Palette 4.0.0, the management platform communicates with the workload cluster via gRPC. Use the tabs below to view the network communication and ports for each architecture.

## SaaS Network Communications and Ports



# SaaS Network Communications and Ports

The following ports must be reachable from a network perspective for Palette SaaS to function correctly.

![SaaS Network Diagram with ports](/architecture_networking-ports_saas-network-diagram.png "title=SaaS Network Diagram with ports")



#### SaaS Managed


![SaaS network diagram displaying the network paths for edge](/architecture_networking-ports_saas-network-diagram-edge.png)


The following ports must be reachable from a network perspective for Palette to operate properly.

## Management Platform

|Port            |Direction|Purpose                   |    
|:---------------|:---------|:-----------------------|
|HTTPS (tcp/443) |INBOUND        |Browser/API access to management platform|
|NATS (tcp/4222) |INBOUND        |Agent running inside connecting to management platform|


## Workload Cluster


|Port            |Direction | Purpose|
|:---------------|:---------|:--------------|
|HTTPS (tcp/443) |OUTBOUND | API access to management platform|
|NATS (tcp/4222) |OUTBOUND       |Registry (packs, integrations), Pack containers, Application Updates|
|NATS (tcp/4222) |OUTBOUND       |Registry (packs, integrations), Pack containers, Application Updates|

:::info

You can expose inbound port 22 for SSH if you would like to access your cluster nodes for troubleshooting remotely. This is entirely optional and not required for Palette to operate appropriately.

:::


# Self-Hosted Network Communications and Ports

The following ports must be reachable from a network perspective for Palette Sefl-Hosted to function correctly.


![On-prem network diagram](/architecture_networking-ports_network-diagram.png "#title="network diagram")

## Management Platform

|Port            |Direction|Purpose                   |    
|:---------------|:---------|:-----------------------|
|HTTPS (tcp/443) |INBOUND        |Browser/API access to management platform|
|NATS (tcp/4222) |INBOUND        |Message Bus for workload clusters|
|HTTPS (tcp/443) |OUTBOUND       |vSphere vCenter API,  Registry (packs, integrations), Pack containers, app updates.|
|HTTPS (tcp/6443)|OUTBOUND       |Workload K8s cluster API Server|


## Workload Cluster


|Port |Direction | Purpose|
|:---------------|:---------|:--------------|
|HTTPS (tcp/443) |OUTBOUND | API access to management platform|
|NATS (tcp/4222) |OUTBOUND       |Agent communication via message bus |
|HTTPS (tcp/443) |OUTBOUND       |vSphere vCenter API, Registry (packs, integrations), Pack containers, Application updates.

:::info

You can expose inbound port 22 for SSH if you would like to access your cluster nodes for troubleshooting remotely. This is entirely optional and not required for Palette to operate appropriately.

:::
