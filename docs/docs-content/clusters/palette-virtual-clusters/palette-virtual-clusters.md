---
sidebar_label: "Palette Virtual Clusters"
title: "Create Palette Virtual Clusters"
description: "Create virtual clusters in Palette"
hide_table_of_contents: false
sidebar_custom_props:
  icon: "nodes"
tags: ["clusters", "virtual clusters"]
---

Palette Virtual Clusters are nested Kubernetes clusters within a Host Cluster. Virtual clusters share the host cluster
resources, such as CPU, memory, storage, container network interface (CNI), and container storage interface (CSI).
Virtual clusters use the CNCF [Kubernetes](https://www.cncf.io/projects/kubernetes) distribution. Virtual clusters are
supported in both connected and airgapped environments.

:::info

On Palette VerteX, virtual clusters use a FIPS-compiled vCluster pack automatically, so strict-FIPS tenants can
provision virtual clusters without additional configuration.

:::

Palette provisions and orchestrates virtual clusters to make the lightweight Kubernetes technology stack and tools
ecosystem available to you. Deploy virtual clusters on both new and imported Host Clusters and attach application
profiles.

Palette also supports Day-2 operations such as upgrades, backup, and restore to keep virtual clusters secure, compliant,
and up to date. Additionally, Palette provides visibility into the workloads deployed inside your virtual clusters and
the associated costs.

## Get Started

To get started, refer to [Deploy a Virtual Cluster to a Cluster Group](deploy-virtual-cluster.md).

## Kubernetes Distribution

Virtual clusters use the Cloud Native Computing Foundation (CNCF) [Kubernetes](https://www.cncf.io/projects/kubernetes)
distribution. Refer to
[Create and Manage Cluster Groups](../cluster-groups/create-cluster-group.md#palette-virtual-cluster-configuration) for
guidance on configuring your cluster group.

### Minimum Resource Requirements

The following table lists the minimum resource requirements for virtual clusters.

| **Resource Type**     | **Default** | **Minimum Limit** |
| --------------------- | ----------- | ----------------- |
| CPU (per request)     | 4           | 4                 |
| Memory (per request)  | 4 GiB       | 4 GiB             |
| Storage (per request) | 2 GiB       | 2 GiB             |

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

## Upgrade Virtual Clusters

The [vCluster version](https://www.vcluster.com/releases/en/changelog) may be updated in a Palette release, which can
introduce breaking changes that affect newly created virtual clusters.

To avoid disruptions, Palette locks the vCluster version for each cluster group, ensuring virtual clusters can still be
provisioned successfully within existing groups, even across Palette updates.

If you want to use the latest version of vCluster on your virtual clusters, you must prompt Palette to upgrade your
cluster group at a time that suits you. Refer to [Upgrade Cluster Groups](../cluster-groups/vcluster-upgrades.md) for
guidance.

## Resources

- [Add Virtual Clusters to a Cluster Group](deploy-virtual-cluster.md)

- [Configure OIDC for Virtual Clusters](configure-oidc-virtual-cluster.md)
