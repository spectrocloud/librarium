---
sidebar_label: "Crossplane"
title: "Crossplane"
description: "Learn how to use Crossplane with Palette and Palette VerteX."
hide_table_of_contents: false
sidebar_position: 0
tags: ["crossplane", "iac", "automation", "infrastructure as code"]
---

Palette supports the open source Cloud Native Computing Foundation (CNCF) project
[Crossplane](https://www.crossplane.io/). Crossplane transforms Kubernetes clusters into universal control planes,
extending the Kubernetes API and enabling infrastructure resource provisioning and management across major
infrastructure providers.

These resources, called
[Managed Resources (MR)](https://docs.crossplane.io/v2.0/managed-resources/managed-resources/#managed-resource-fields)
within the Crossplane environment, are essentially Kubernetes Custom Resource Definitions (CRDs) that represent
infrastructure resources as native Kubernetes objects. Because they are Kubernetes objects, you can interact with them
using standard commands like `kubectl describe`. When users create a managed resource, Crossplane interacts with the
infrastructure provider API to request the creation of the resource within the provider's environment.

## Palette Provider

You can use the Palette Crossplane Provider to interact with the Palette API and create resources declaratively.

Refer to the [Palette Provider](https://marketplace.upbound.io/providers/crossplane-contrib/provider-palette/v0.12.0)
page for a complete list of managed resources and examples.

## Get Started

For examples of end-to-end cluster provisioning with Crossplane, review the following guides:

- [Deploy an AWS IaaS Cluster with Crossplane](./deploy-cluster-aws-crossplane.md)
- [Deploy an Azure IaaS Cluster with Crossplane](./deploy-cluster-azure-crossplane.md)
- [Deploy a GCP IaaS Cluster with Crossplane](./deploy-cluster-gcp-crossplane.md)

## Resources

- [Crossplane Documentation](https://docs.crossplane.io/latest/)
