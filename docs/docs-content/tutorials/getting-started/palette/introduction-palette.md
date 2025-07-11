---
sidebar_label: "Introduction to Palette"
title: "Introduction to Palette"
description: "Learn about Spectro Cloud Palette."
icon: ""
hide_table_of_contents: false
sidebar_position: 0
tags: ["getting-started", "tutorial"]
---

Palette is a complete and integrated platform that enables organizations to effectively manage the entire lifecycle of
any combination of new or existing Kubernetes environments, whether in a data center or the cloud.

With a unique approach to managing multiple clusters, Palette gives IT teams complete control, visibility, and
production-scale efficiencies to provide developers with highly curated Kubernetes stacks and tools based on their
specific needs, with granular governance and enterprise-grade security.

![Palette product high level overview eager-load](/getting-started/getting-started_introduction-palette_product-overview.webp)

## Supported Environments

Palette has the richest coverage in supported environments that includes:

- **Public Clouds**: AWS, Azure, and Google Cloud. Palette supports both IaaS and managed Kubernetes services, such as
  AWS EKS, Azure AKS, and Google GKE.
- **Data Centers**: VMware, Nutanix, and OpenStack
- **Bare Metal**: Canonical MAAS
- **Edge**

The Palette Getting Started section covers deployment flows for clusters hosted in [AWS](./aws/aws.md),
[Azure](./azure/azure.md), [Google Cloud](./gcp/gcp.md) and [VMware vSphere](./vmware/vmware.md).

## Cluster Profiles

Cluster profiles are the declarative, full-stack models that Palette follows when it provisions, scales, and maintains
your clusters. Cluster profiles are composed of layers using packs, Helm charts, Zarf packages, or cluster manifests to
meet specific types of workloads on your Palette cluster deployments. You can create as many profiles as needed for your
workloads.

Cluster profiles provide you with a repeatable deployment process for all of your development and production
environments. They also give you visibility on the layers, packages and versions present on your deployed clusters.

Finally, if you want to update or maintain your deployed workloads, cluster profiles give you the flexibility to make
changes to all clusters deployed with the profile by removing, swapping or adding a new layer. Palette will then
reconcile the current state of your workloads with the desired state specified by the profile.

Below are cluster profile types you can create:

- _Infrastructure_ profiles provide the essential components for workload cluster deployments within a
  [tenant](../../../glossary-all.md#tenant): Operating System (OS), Kubernetes, Network, and Storage.

- _Add-on_ profiles are exclusively composed of add-on layers. They usually do not contain infrastructure components and
  are instead designed for reusability across multiple clusters and multiple projects within a tenant.

- _Full profiles_ combine infrastructure packs with add-on layers. By adding layers, you can enhance cluster
  functionality. For example, you might add system apps, authentication, monitoring, ingress, load balancers, and more
  to your cluster.

## Packs

Packs are the smallest component of a cluster profile. Each layer of a cluster profile is made up of a specific pack.
Palette provides packs that are tailored for specific uses to support the core infrastructure a cluster needs. You can
also use add-on packs or create your own custom pack to extend Kubernetes functionality. Check out the
[Packs List](../../../integrations/integrations.mdx) page to learn more about individual packs.

## Next Steps

On this page, you became familiar with Palette, its core concepts, and the supported environments. Choose your preferred
infrastructure provider from the following list to start exploring Palette:

- [Deploy a Cluster to Amazon Web Services (AWS)](./aws/aws.md)
- [Deploy a Cluster to Azure](./azure/azure.md)
- [Deploy a Cluster to Google Cloud Platform (GCP)](./gcp/gcp.md)
- [Deploy a Cluster to VMware](./vmware/vmware.md)
