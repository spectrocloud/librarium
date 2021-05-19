---
title: "SAAS Network Communication and Ports"
metaTitle: "Network Communication and Ports Management Platform - SAAS"
metaDescription: "Port-Direction-Purpose Management Platform and Workload Clusters in Spectro SAAS"
icon: ""
hideToC: false
fullWidth: false
---
 
import Tabs from '@librarium/shared/src/components/ui/Tabs';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import InfoBox from '@librarium/shared/src/components/InfoBox';
import PointsOfInterest from '@librarium/shared/src/components/common/PointOfInterest';


# SAAS Network Communications and Ports

![saas_networks_ports.png](saas_networks_ports.png)

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
