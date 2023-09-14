---
sidebar_label: "Cluster Profiles"
title: "Cluster Profiles"
description: "Understanding the Cluster Profiles Concept and how they make Spectro Cloud powerful"
hide_table_of_contents: false
tags: ["profiles", "cluster profiles"]
---

You can create the following types of cluster profiles using packs and other components to meet specific types of workloads on your Palette cluster deployments. 

- **Cluster profiles** - You can build three types of cluster profiles:

  - *Infrastructure* profiles provide the essential components for workload cluster deployments within a tenant: Operating System (OS), Kubernetes, Network, and Storage. Collectively, these layers form the infrastructure for your cluster. For more information, review the [Create an Infrastructure Profile] guide.
 
  - *Full profiles* combine infrastructure packs with add-on layers. By adding layers, you can enhance cluster functionality. For example, you might add system apps, authentication, monitoring, ingress, load balancers, and more to your cluster. Refer to the [Create a Full Profile] guide for more details.

  - *Add-on* profiles are exclusively composed of add-on layers. They do not contain infrastructure components and are instead designed for reusability across multiple clusters and multiple projects within a tenant. They provide the flexibility to configure clusters based on specific requirements. Refer to the [Create an Add-on Profile] guide for more information.

The diagram below illustrates how you can build on core infrastructure layers with add-on layers to build a full cluster profile. You can also create separate add-on profiles to reuse among multiple clusters.

<<< PLACEHOLDER FOR UPDATED DIAGRAM >>


## Profile Layers

Each profile layer provides a specific functionality. Profile layers can be packs, Helm Charts, or manifests, as described in the table.

| **Layer** | **Description** |
|-----------|---------------------------|
| **Packs** | Packs are built using integration-specific templates. We maintain a public pack registry of packs that are available to all tenants. Check out the [Packs List](/integrations) reference to learn more. |
| **Helm Charts** | Helm charts are a collection of Kubernetes resource files capable of deploying various services. We provide both a public and a private Helm registry. Additionally, your organization can add any public or private Helm registries to Palette to leverage charts from those registries. Palette promotes Container Storage Interface (CSI) and Container Network Interface (CNI) layers to be added as Helm Charts from customized Helm registries and linked to Spectro Registry packs. <<< COME BACK TO THIS SENTENCE >>> |
| **Manifests** | You can construct profile layers using raw manifests to provision Kubernetes resources that are unavailable in Palette or Helm Charts. Manifests also provide a pass-through mechanism to orchestrate Kubernetes resources in a cluster. For example, specific integrations may require the creation of secrets or Custom Resource Definitions (CRDs). By attaching a manifest file to a layer in a cluster profile, you can provision these additional resources. |



