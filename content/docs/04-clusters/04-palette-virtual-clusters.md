---
title: "Palette Virtual Clusters"
metaTitle: "Create Palette virtual clusters"
metaDescription: "Create virtual clusters in Palette"
icon: "nodes"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import InfoBox from 'shared/components/InfoBox';
import WarningBox from 'shared/components/WarningBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";


# Palette Virtual Clusters Overview

Palette Virtual Clusters run as nested Kubernetes clusters within a Host Cluster. Virtual clusters share the host cluster resources, such as CPU, memory, and storage, container network interface (CNI), and container storage interface (CSI). By default, virtual clusters use [k3s](https://github.com/k3s-io/k3s), a highly available, certified Kubernetes distribution designed for production workloads.

Palette provisions and orchestrates virtual clusters to make the lightweight Kubernetes technology stack and tools ecosystem available to you. Deploy virtual clusters on both new and imported Host Clusters and attach application profiles.

Palette also supports Day 2 operations such as upgrades, backup, and restore to keep virtual clusters secure, compliant, and up to date. Additionally, Palette provides visibility into the workloads running inside your virtual clusters and the associated costs.

To get started, refer to [Add Virtual Clusters to a Host Cluster](/clusters/palette-virtual-clusters/add-virtual-cluster-to-host-cluster).


<br />

## Network Connectivity

Two virtual cluster accessibility options are supported:<p></p><br />
- **Load Balancer**: The Host Cluster must support dynamic provisioning of load balancers, either via a Cloud Controller Manager in the public cloud or a bare metal load balancer provider such as MetalLB.<p></p><br />

- **Ingress**: The NGINX Ingress Controller must be deployed on the Host Cluster with SSL passthrough enabled. This allows TLS termination to occur at the virtual cluster's Kubernetes API server.<br />

   A wildcard DNS record must be configured that maps to the load balancer associated with the NGINX Ingress Controller. For example:

   `*.myapp.mydomain.com`

<br />
<br />


## Resources

- [Deploy a Virtual Cluster to a Cluster Group](/clusters/palette-virtual-clusters/deploy-virtual-cluster)
