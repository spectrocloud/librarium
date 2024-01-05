---
sidebar_label: "Palette Virtual Clusters"
title: "Create Palette Virtual Clusters"
description: "Create virtual clusters in Palette"
hide_table_of_contents: false
sidebar_custom_props: 
  icon: "nodes"
tags: ["clusters", "virtual clusters"]
---


Palette Virtual Clusters are nested Kubernetes clusters within a Host Cluster. Virtual clusters share the host cluster resources, such as CPU, memory, storage, container network interface (CNI), and container storage interface (CSI). By default, virtual clusters use [k3s](https://github.com/k3s-io/k3s), a highly available, certified Kubernetes distribution designed for production workloads.

Palette provisions and orchestrates virtual clusters to make the lightweight Kubernetes technology stack and tools ecosystem available to you. Deploy virtual clusters on both new and imported Host Clusters and attach application profiles.

Palette also supports Day-2 operations such as upgrades, backup, and restore to keep virtual clusters secure, compliant, and up to date. Additionally, Palette provides visibility into the workloads deployed inside your virtual clusters and the associated costs.

## Get Started


To get started, refer to [Add Virtual Clusters to a Cluster Group](deploy-virtual-cluster.md).

## Kubernetes Distributions

The following Kubernetes distributions are supported for virtual clusters:

| **Name** | **Description** |
| --- | --- |
| **K3s** | [K3s](https://k3s.io) is a lightweight, certified Kubernetes distribution designed for production workloads. |
| **Kubernetes**| The Cloud Native Computing Foundation (CNCF) [Kubernetes distribution](https://www.cncf.io/projects/kubernetes). |


Refer to the [Create and Manager Cluster Groups](../cluster-groups/create-cluster-group.md#palette-virtual-cluster-configuration) to learn how to configure your cluster group to use a specific Kubernetes distribution.

### Minimum Resource Requirements

The following table lists the minimum resource requirements for virtual clusters and the minimum resource requirements for the underlying Kubernetes distribution.

 |**Resource Type** | **Default**   |**K3s Minimum Limit**| **Kubernetes Minimum Limit**|
 |------------------------------|-------------------|-----------------| -----------------|
 | CPU (per request)            | 4                 | 4               | 4               |
 | Memory (per request)         | 4 GiB             | 3 GiB           | 4 GiB         |
 | Storage (per request)        | 2 GiB            | 0 GiB           | 2 GiB           |

## Network Connectivity

Virtual clusters support two network endpoint types: Load Balancer and Ingress. The network endpoint type determines how virtual clusters are exposed to external traffic. You specify the network endpoint type in Cluster Group Settings.

- **Load Balancer**: The Host Cluster must support dynamic provisioning of load balancers, either via a Cloud Controller Manager in the public cloud or a bare metal load balancer provider such as MetalLB.

- **Ingress**: The Nginx Ingress Controller must be deployed on the Host Cluster with SSL passthrough enabled. This allows TLS termination to occur at the virtual cluster's Kubernetes API server.

   A wildcard DNS record must be configured that maps to the load balancer associated with the NGINX Ingress Controller. For example:

   `*.myapp.mydomain.com`


## Resources

- [Add Virtual Clusters to a Cluster Group](deploy-virtual-cluster.md)

- [Configure OIDC for Virtual Clusters](configure-oidc-virtual-cluster.md)