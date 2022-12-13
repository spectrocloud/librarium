---
title: "Architecture"
metaTitle: "Azure Architecture with Palette"
metaDescription: "Learn about how Palette integrates with Azure and the architecture that powers the integration"
hideToC: false
fullWidth: false
---

# Azure Architecture

The following are some architectural highlights of Azure clusters deployed by Palette:

- Azure cluster resources are placed within an existing Resource Group.


- Nodes are provisioned within a Virtual Network that is auto-created or preexisting, with one subnet for control plane nodes and one for worker nodes. These two subnets are secured with separate Network Security Groups. Both subnets can span across multiple availability zones (AZs).  


- Worker nodes are distributed across multiple AZs.


- None of the control plane nodes and worker nodes have public IPs attached. The Kubernetes API Server endpoint is accessed through a public load balancer.

![azure_cluster_architecture.png](clusters_azure_architecture_overview-diagram.png)