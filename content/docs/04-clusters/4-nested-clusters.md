---
title: "Nested Clusters"
metaTitle: "Creating nested clusters on Palette"
metaDescription: "The methods of creating clusters for a speedy deployment on any CSP"
icon: "clusters"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import InfoBox from 'shared/components/InfoBox';
import WarningBox from 'shared/components/WarningBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";


# Nested Clusters Overview

Nested Clusters are Kubernetes clusters that run within an existing cluster (also known as a host cluster) and share selected resources. They are lightweight, cost-effective, secure, and resource efficient. Nested Clusters enable the rapid creation of securely-isolated environments for application testing and development without the infrastructure and operational overhead typically entailed by additional Kubernetes clusters.

Palette provisions and orchestrates Nested Clusters and makes it easy to use the Kubernetes technology stack and tools eco-system. It can deploy Nested Clusters on both new and imported host clusters. Palette also supports Day 2 operations such as upgrades, backup/restore and more, to keep Nested Clusters secure, compliant, and up-to-date. Additionally, it provides visibility into the workloads running inside your Nested Clusters and their associated costs.

To get started and create your nested cluster, see the [Nested Cluster Quick Start](/clusters/nested-clusters/cluster-quickstart) page.


<br />

## Accessibility options

Two Nested Cluster accessibility options are supported:
- **LoadBalancer**
  - The host cluster must support dynamic provisioning of load balancers, either via a Cloud Controller Manager in the public cloud or a bare metal load balancer provider, such as MetalLB.

- **Ingress**
  - The NGINX Ingress Controller must be deployed on the Host cluster with the SSL pass through enabled. This allows TLS termination to occur at the Nested Cluster's Kubernetes API server.

  - A wildcard DNS record must be configured that maps to the load balancer associated with the NGINX Ingress Controller, e.g., *.nested.host.1.spectrocloud.com.

<br />



