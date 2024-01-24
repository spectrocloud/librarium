---
sidebar_label: "Palette Virtual Clusters"
title: "Create Palette Virtual Clusters"
description: "Create virtual clusters in Palette"
hide_table_of_contents: false
sidebar_custom_props:
  icon: "nodes"
tags: ["clusters", "virtual clusters"]
---

Palette Virtual Clusters run as nested Kubernetes clusters within a Host Cluster. Virtual clusters share the host
cluster resources, such as CPU, memory, and storage, container network interface (CNI), and container storage interface
(CSI). By default, virtual clusters use [k3s](https://github.com/k3s-io/k3s), a highly available, certified Kubernetes
distribution designed for production workloads.

Palette provisions and orchestrates virtual clusters to make the lightweight Kubernetes technology stack and tools
ecosystem available to you. Deploy virtual clusters on both new and imported Host Clusters and attach application
profiles.

Palette also supports Day-2 operations such as upgrades, backup, and restore to keep virtual clusters secure, compliant,
and up to date. Additionally, Palette provides visibility into the workloads deployed inside your virtual clusters and
the associated costs.

## Get Started

To get started, refer to [Add Virtual Clusters to a Cluster Group](deploy-virtual-cluster.md).

## Network Connectivity

Virtual clusters support two network endpoint types: Load Balancer and Ingress. The network endpoint type determines how
virtual clusters are exposed to external traffic. You specify the network endpoint type in Cluster Group Settings.

- **Load Balancer**: The Host Cluster must support dynamic provisioning of load balancers, either via a Cloud Controller
  Manager in the public cloud or a bare metal load balancer provider such as MetalLB.

- **Ingress**: The Nginx Ingress Controller must be deployed on the Host Cluster with SSL passthrough enabled. This
  allows TLS termination to occur at the virtual cluster's Kubernetes API server.

  A wildcard DNS record must be configured that maps to the load balancer associated with the NGINX Ingress Controller.
  For example:

  `*.myapp.mydomain.com`
