---
title: "Network Ports"
metaTitle: "Network Communication and Ports Management Platform on Prem"
metaDescription: "Port-Direction-Purpose Management Platform and Workload Clusters"
icon: ""
hideToC: false
fullWidth: false
---
 
import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';


# SaaS Network Communications and Ports

The network ports for Palette in SaaS mode and on-prem are listed below.

![SaaS Network Diagram with ports](/architecture_networking-ports_saas-network-diagram.png "title=SaaS Network Diagram with ports")

<br />

#### Saas and Edge Hosts


![SaaS network diagram displaying the network paths for edge](/architecture_networking-ports_saas-network-diagram-edge.png)


The following ports must be reachable from a network perspective for Palette to operate properly.

## Management Platform

|Port            |Direction|Purpose                   |    
|:---------------|:---------|:-----------------------|
|HTTPS (tcp/443) |INBOUND        |Browser/API access to Management Platform|
|SSH (tcp/22)    |INBOUND        |Troubleshooting via SSH (optional) |
|NATS (tcp/4222) |INBOUND        |Agent running inside connecting to Management Platform|

## Workload Cluster


|Port            |Direction | Purpose|
|:---------------|:---------|:--------------|
|NATS (tcp/4222) |OUTBOUND       |Registry (packs, integrations), Pack containers, Application Updates|

# On-Prem Network Communications and Ports

The following diagram maps the network connections between the Palette components and deployed Kubernetes clusters.

![On-prem network diagram](/architecture_networking-ports_network-diagram.png "#title="network diagram")


The following ports must be reachable from a network perspective for Palette to operate properly.

## Management Platform

|Port            |Direction|Purpose                   |    
|:---------------|:---------|:-----------------------|
|HTTPS (tcp/443) |INBOUND        |Browser/API access to Management Platform|
|SSH (tcp/22)    |INBOUND        |Troubleshooting via SSH (optional) |
|NATS (tcp/4222) |INBOUND        |Message Bus for workload clusters|
|HTTPS (tcp/443) |OUTBOUND       |vSphere vCenter API,  Registry (packs, integrations), Pack containers, app updates.|
|HTTPS (tcp/6443)|OUTBOUND       |Workload K8s cluster API Server|


## Workload Cluster


|Port |Direction | Purpose|
|:---------------|:---------|:--------------|
|NATS (tcp/4222) |OUTBOUND       |Agent communication via Message Bus |
|HTTPS (tcp/443) |OUTBOUND       |vSphere vCenter API, Registry (packs, integrations), Pack containers, Application updates.
