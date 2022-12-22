---
title: "Architecture"
metaTitle: "Azure Architecture with Palette"
metaDescription: "Learn about how Palette integrates with Azure and the architecture that powers the integration"
hideToC: false
fullWidth: false
---

# Azure IaaS Architecture

The following are some architectural highlights of Azure clusters deployed by Palette:

- Azure cluster resources are placed within an existing Resource Group.


- Nodes are provisioned within a Virtual Network that is auto-created or preexisting, with one subnet for control plane nodes and one for worker nodes. These two subnets are secured with separate Network Security Groups. Both subnets can span across multiple availability zones (AZs).  


- Worker nodes are distributed across multiple AZs.


- None of the control plane nodes and worker nodes have public IPs attached. The Kubernetes API Server endpoint is accessed through a public load balancer.


![An Azure IaaS architecture diagram](clusters_azure_architecture_iaas-overview.png)



# Azure AKS Architecture

The integration between Palette and Azure AKS unlocks the following capabilities.

- Palette platform enables containerized applications' effortless deployment and management with fully-managed AKS. 


- Palette provides the you with a with serverless Kubernetes experience, an integrated continuous integration and continuous delivery (CI/CD) experience, and enterprise-grade security and governance.


- Palette helps you unite the development and operations to a single platform.  This unification helps you achieve faster builds, delivery, and scaling of applications with credence.


- The infrastructure has event-driven autoscaling and triggers that enable elastic provisioning for self-managed infrastructure.


- Leverage extensive authentication and authorization capabilities by using Azure Active Directory and dynamic rules enforcement, across multiple clusters with Azure Policy.


![An Azure AKS architecture diagram](clusters_azure_architecture_aks-diagram.png)