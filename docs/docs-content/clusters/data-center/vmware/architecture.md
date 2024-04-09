---
sidebar_label: "Architecture"
title: "Architecture"
description: "Learn about the architecture used to support VMware clusters through Palette."
hide_table_of_contents: false
sidebar_position: 10
tags: ["data center", "vmware", "architecture"]
---

## Overview

Palette supports using VMware vSphere as a data center provider. You can deploy Kubernetes clusters to your vSphere
environment using Palette. Below are some key features of the Palette VMware architecture:

- Kubernetes nodes can be distributed across multiple-compute clusters, which serve as distinct fault domains.

- Support for static IP addresses, as well as DHCP. If you are using Dynamic Host Configuration Protocol (DHCP), Dynamic
  DNS is required.

- Support for IP address pool management for assigning blocks of IPs dedicated to clusters or projects.

- A Private Cloud Gateway (PCG) must be setup within the VMware vSphere environment to communicate with the Palette
  management platform and the VMware vCenter that installed in the private data center.

  The PCG facilitates communication between Palette and your infrastructure environment. The PCG is necessary in
  environments where Palette does not have direct network access. Many infrastructure environments are placed in a
  private network that blocks connections originating externally. The PCG connects to Palette, and acts as an endpoint,
  allowing you to target the environment when deploying clusters in Palette.

  ![vmware_arch_oct_2020.webp](/clusters_vmware_architecture_arch-overview.webp)

You can learn more in the [PCG Architecture](../../pcg/architecture.md) section.

## Zone Tagging

You can use tags to create node zones and regions for your Kubernetes clusters. The node zones and regions can be used
to dynamically place Kubernetes workloads and achieve higher availability. Kubernetes nodes inherit the zone and region
tags as [Labels](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/). Kubernetes workloads can
use the node labels to ensure that the workloads are deployed to the correct zone and region.

The following is an example of node labels that are discovered and inherited from vSphere tags. The tag values are
applied to Kubernetes nodes in vSphere.

<!-- prettier-ignore-start -->

```yaml hideClipboard
topology.kubernetes.io/region=usdc 
topology.kubernetes.io/zone=zone3 
failure-domain.beta.kubernetes.io/region=usdc
failure-domain.beta.kubernetes.io/zone=zone3
```
<!-- prettier-ignore-end -->

:::info

To learn more about node zones and regions, refer to the
[Node Zones/Regions Topology](https://cloud-provider-vsphere.sigs.k8s.io/cloud_provider_interface.html) section of the
Cloud Provider Interface documentation.

:::

Zone tagging is required to install Palette and is helpful for Kubernetes workloads deployed in vSphere clusters through
Palette if they have persistent storage needs. Use vSphere tags on data centers and compute clusters to create distinct
zones in your environment. You can use vSphere
[Tag Categories and Tags](https://docs.vmware.com/en/VMware-vSphere/8.0/vsphere-vcenter-esxi-management/GUID-16422FF7-235B-4A44-92E2-532F6AED0923.html)
to create zones in your vSphere environment and assign them to vSphere objects.

The zone tags you assign to your vSphere objects, such as a datacenter and clusters are applied to the Kubernetes nodes
you deploy through Palette into your vSphere environment. Kubernetes clusters deployed to other infrastructure
providers, such as public cloud may have other native mechanisms for auto discovery of zones.

For example, assume a vCenter environment contains three compute clusters, cluster-1, cluster-2, and cluster-3. To
support this environment you create the tag categories `k8s-region` and `k8s-zone`. The `k8s-region` is assigned to the
datacenter, and the `k8s-zone` tag is assigned to the compute clusters.

The following table lists the tag values for the data center and compute clusters.

| **vSphere Object** | **Assigned Name** | **Tag Category** | **Tag Value** |
| ------------------ | ----------------- | ---------------- | ------------- |
| **Datacenter**     | dc-1              | k8s-region       | region1       |
| **Cluster**        | cluster-1         | k8s-zone         | az1           |
| **Cluster**        | cluster-2         | k8s-zone         | az2           |
| **Cluster**        | cluster-3         | k8s-zone         | az3           |

Create a tag category and tag values for each datacenter and cluster in your environment. Use the tag categories to
create zones. Use a name that is meaningful and that complies with the tag requirements listed in the following section.

### Tag Requirements

The following requirements apply to tags:

- A valid tag must consist of alphanumeric characters.

- The tag must start and end with an alphanumeric character.

- The regex used for tag validation is `(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?`
