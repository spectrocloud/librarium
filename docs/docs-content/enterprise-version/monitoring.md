---
sidebar_label: "Cluster Monitoring Metrics"
title: "Enterprise Cluster Monitoring Metrics"
description: "Enterprise Cluster Monitoring Metrics for Palette's Enterprise (on-premises) variant."
icon: ""
hide_table_of_contents: false
sidebar_position: 60
tags: ["self-hosted", "enterprise", "monitoring"]
---
  
## Pods Monitoring Metrics
### Namespaces to Monitor Pods

|**Namespaces** |**Interpretation**|
|-----------|--------------|
|**ui-system** |Palette Management UI|
|**cp-system** |System Management UI|
|**nats-system**| Message System|
|**ingress-nginx**| Ingress services|
|**hubble-system**|Core backend services|
|**jet-system**|Pivot Tenant Clusters|

### Exceptions

The below pods are dynamically created from jobs and can be excluded from monitoring.


|**Pods Prefix** |**Namespace**|
|-----------|--------------|
|ingress-nginx-admission-patch- |ingress-nginx|
|ingress-nginx-admission-create- |ingress-nginx|
|packsync- |hubble-system|
|cleanup- |hubble-system|



## CPU and Memory Monitoring Metrics

### Default Specifications
* CPU: 4 vCPU
* RAM: 8 GB RAM
* CP Nodes: 3

### Thresholds
* CPU warn [per node ] > 70%
* CPU alert [per node] > 80%
* Memory Warn [per node] > 80%
* Memory Alert [per node] > 90%

### Node Monitoring Metrics
 #### Number of Nodes: 3
 #### Node Alerts
* Node up
* Node down
* Node unreachable

