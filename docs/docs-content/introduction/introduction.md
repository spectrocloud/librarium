---
sidebar_label: "What is Palette?"
title: "What is Palette?"
description:
  "Learn what Spectro Cloud's Palette platform is, and how it reduce the complexities your encounter today with
  Kubernetes."
icon: ""
hide_table_of_contents: false
sidebar_custom_props:
  icon: "palette"
slug: /
---

Palette is a complete and integrated platform that enables organizations to effectively manage the entire lifecycle of
any combination of new or existing, simple or complex, small or large Kubernetes environments, whether in a data center
or the cloud.

With a unique approach to managing multiple clusters, Palette gives IT teams complete control, visibility, and
production-scale efficiencies to provide developers with highly curated Kubernetes stacks and tools based on their
specific needs, with granular governance and enterprise-grade security.

:::tip

Make sure to check out the [Getting Started](../getting-started/getting-started.md) section to learn how you can use
Palette to deploy and update your Kubernetes clusters. This section contains hands-on tutorials for Amazon Web Services
(AWS), Microsoft Azure and Google Cloud Platform (GCP).

:::

Palette VerteX edition is also available to meet the stringent requirements of regulated industries such as government
and public sector organizations. Palette VerteX integrates Spectro Cloud’s Federal Information Processing Standards
(FIPS) 140-3 cryptographic modules. To learn more about FIPS-enabled Palette, check out
[Palette VerteX](../self-hosted-setup/vertex/vertex.md).

![Palette product high level overview eager-load](/docs_introduction_product-overview.webp)

## What Makes Palette Different?

Palette helps our customers accelerate and grow through Kubernetes management at scale.

### Full-Stack Management

Unlike rigid and prepackaged Kubernetes solutions, Palette allows users to construct flexible stacks from OS,
Kubernetes, container network interfaces (CNI), and container storage interfaces (CSI) to additional add-on application
services. As a result, the entire stack - not just the infrastructure - of Kubernetes is deployed, updated, and managed
as one unit, without split responsibility from virtual machines, base OS, Kubernetes infra, and add-ons.

### End-to-End Declarative Lifecycle Management

Palette offers the most comprehensive profile-based management for Kubernetes. It enables teams to drive consistency,
repeatability, and operational efficiency across multiple clusters in multiple environments with comprehensive day 0 -
day 2 management.

### Any Environment

Palette has the richest coverage in supported environments that includes:

- Public Clouds: AWS, Azure, and Google Cloud. Palette supports both IaaS and managed Kubernetes services AWS EKS, Azure
  AKS, and Google GKE.
- Data Centers: VMware, Nutanix, and OpenStack
- Bare Metal: Canonical MAAS
- Edge

## What is Under the Hood?

Palette uniquely extends and integrates the Cloud Native Computing Foundation (CNCF) open source Cluster API project.
Palette does this by providing comprehensive full-stack modeling and orchestration, governance, security, and day 0 -
day 2 management capabilities.

With Palette’s Cluster Profiles, teams can define full-stack clusters that include both the Kubernetes infrastructure
and any add-on application services. Cluster Profiles enable a repeatable way to deploy and reuse clusters across any
environment. Palette also enables importing of existing Kubernetes environments and creating equivalent Cluster
Profiles.

![2-what-is-sc](/docs_introduction_palette-components.webp)

## Who Can Benefit From Palette?

Palette provides benefits to developers and platform engineers who maintain Kubernetes environments.

### Developers

Development teams will get the flexibility and freedom they are looking for to increase the speed of innovation, whether
it is the cluster template with the add-on application services or choosing a Kubernetes version with integrations like
logging, monitoring, and service mesh for your application development. They need not worry about Kubernetes
configurations but focus on the stuff that matters.

### IT Operations and SREs

Declarative management makes life easier for IT teams, with consistency, repeatability, and all the enterprise-grade
controls and governance they need - especially when moving to production
[Cluster Profiles](../profiles/cluster-profiles/cluster-profiles.md) enable them to define and re-use full-stack
clusters and support them across the entire lifecycle without having to write scripts, as well as integrate with
existing tools and methodologies.

### IT Executives

With an open and enterprise-grade platform, IT leaders can get peace of mind without being locked into proprietary
orchestration technologies or one-size-fits-all solutions. This helps lower the total cost of ownership (TCO) and reduce
operational risk.

## Next Steps

Learn more about Palette and how it can improve your Kubernetes experience and those in your organization. Try
[Palette](https://console.spectrocloud.com/) for [free](https://www.spectrocloud.com/free-tier) today and experience a
better way of working with Kubernetes.

- [App Mode and Cluster Mode](palette-modes.md)

- [Palette Architecture](../architecture/architecture-overview.md)
