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


# SAAS Network Communications and Ports

The network ports for Palette in SaaS mode and on-prem are listed below.

![saas_networks_ports.png](/architecture_networking-ports_saas-network-diagram.png "title=SaaS Network Diagram")

## Management Platform

|Port            |Direction|Purpose                   |    
|:---------------|:---------|:-----------------------|
|HTTPS (tcp/443) |IN        |Browser/API access to Management Platform|
|SSH (tcp/22)    |IN        |Troubleshooting via SSH (optional) |
|NATS (tcp/4222) |IN        |Agent running inside connecting to Management Platform|

## Workload Cluster

|Port            |Direction | Purpose|
|:---------------|:---------|:--------------|
|HTTPS (tcp/6443)|IN        |Kubernetes API Server|
|SSH (tcp/22)    |IN        |Troubleshooting via SSH (optional) |
|NATS (tcp/4222) |OUT       |Registry (packs, integrations), Pack containers, Application Updates|

# On-Premises Network Communications and Ports


![network_communication_ports.png](/architecture_networking-ports_network-diagram.png "#title="network diagram")



## Management Platform

|Port            |Direction|Purpose                   |    
|:---------------|:---------|:-----------------------|
|HTTPS (tcp/443) |IN        |Browser/API access to Management Platform|
|SSH (tcp/22)    |IN        |Troubleshooting via SSH (optional) |
|NATS (tcp/4222) |IN        |Message Bus for workload clusters|
|HTTPS (tcp/443) |OUT       |VSphere vCenter API,  Registry (packs, integrations), Pack containers, app updates.|
|HTTPS (tcp/6443)|OUT       |Workload K8s cluster API Server|


## Workload Cluster


|Port |Direction | Purpose|
|:---------------|:---------|:--------------|
|HTTPS (tcp/6443)|IN        |Kubernetes API Server|
|SSH (tcp/22)    |IN        |Troubleshooting via SSH (optional) |
|NATS (tcp/4222) |OUT       |Agent communication via Message Bus |
|HTTPS (tcp/443) |OUT       |VSphere vCenter API, Registry (packs, integrations), Pack containers, Application updates.
