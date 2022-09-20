---
title: "Nested Clusters (Beta)"
metaTitle: "Creating nested clusters on Palette"
metaDescription: "The methods of creating clusters for a speedy deployment on any CSP"
icon: "nodes"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import InfoBox from 'shared/components/InfoBox';
import WarningBox from 'shared/components/WarningBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";


# Nested Clusters Overview

Nested Clusters are Kubernetes clusters that run within an existing cluster (also known as a Host Cluster) and share selected resources. By default, Nested Clusters will use [k3s](https://github.com/k3s-io/k3s) as virtual Kubernetes cluster, which is a highly available, certified Kubernetes distribution designed for production workloads.

Palette provisions and orchestrates Nested Clusters and makes it easy to use the lightweight, Kubernetes technology stack and tools ecosystem. Deploy Nested Clusters on both new and imported Host Clusters as simple as following the wizard and attaching Add-on profiles.

Palette also supports Day 2 operations such as upgrades, backup/restore and more, to keep Nested Clusters secure, compliant, and up to date. Additionally, it provides visibility into the workloads running inside your Nested Clusters and its associated costs.

To get started and create your Nested Cluster, see the [Nested Cluster Quick Start](/clusters/nested-clusters/cluster-quickstart) page.


<br />

## Accessibility Options

Two Nested Cluster accessibility options are supported:<p></p><br />
1. **Load Balancer** <br />
The Host Cluster must support dynamic provisioning of load balancers, either via a Cloud Controller Manager in the public cloud or a bare metal load balancer provider, such as MetalLB.<p></p><br />

1. **Ingress** <br />
The NGINX Ingress Controller must be deployed on the Host cluster with SSL passthrough enabled. This allows TLS termination to occur at the Nested Cluster's Kubernetes API server.<br />

   A wildcard DNS record must be configured that maps to the load balancer associated with the NGINX Ingress Controller.

   For example:

   `*.nested.host.1.spectrocloud.com`

<br />
<br />


