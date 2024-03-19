---
sidebar_label: "Additional Capabilities"
title: "Additional Capabilities"
description: "Learn more about Palette's Additional Capabilities."
icon: ""
hide_table_of_contents: false
sidebar_position: 80
tags: ["getting-started"]
---

Palette offers a range of additional capabilities designed to enable its users to deploy, scale, and effectively manage
Kubernetes workloads across a wide variety of environments and deployment options. These environments include different
public cloud providers, data centers like [VMware vSphere](https://www.vmware.com/products/vsphere.html), bare metal
with [Canonical MAAS](https://maas.io), and edge.

Whether managing thousands of clusters in remote locations with [Edge](./additional-capabilities.md#edge), enforcing
FIPS compliance with [VerteX](./additional-capabilities.md#palette-vertex), maximizing management control with
[self-hosted Palette](./additional-capabilities.md#self-hosted-palette), or integrating virtual machine workloads into
Kubernetes environments with [Virtual Machine Orchestrator](./additional-capabilities.md#virtual-machine-orchestrator),
Palette provides comprehensive solutions to meet different business needs. Learn more about each capability below.

![A drawing of Palette with humans interacting](/getting-started/getting-started_additional-capabilities_palette.png)

## Edge

Palette Edge enables you to deploy Kubernetes workloads in remote locations without having to provision high-bandwidth
connectivity from these sites back to the cloud. This means you can deploy Kubernetes clusters at scale to a wide range
of locations, including retail stores, hospitals, restaurants, cruise ships, manufacturing facilities, oil and gas
sites, and rural areas.

Palette Edge supports both VM and container-based workloads, multiple Kubernetes distributions, and Intel and ARM
hardware architectures. It is built on top of the open-source project [Kairos](https://kairos.io/), which enables the
creation and customization of immutable versions of operating systems. Additionally, Palette Edge is designed to scale
to tens of thousands of locations while enforcing policies locally within each cluster.

Edge clusters are Kubernetes clusters set up on Edge hosts. These hosts can be bare metal or virtual machines located in
isolated locations. Palette deploys and manages workload clusters at the Edge, and the services continue operating even
when the connection to the management plane is lost. You can manage Edge clusters locally on-site through the local UI,
or centrally through the Palette management plane. Palette Edge is able to meet your needs, regardless of the network
topology your deployments face. Check out the [Palette Edge](../clusters/edge/edge.md) page to learn more about Edge and
its features.

## Self-Hosted Palette

Palette is available as a fully self-hosted platform offering that you can leverage to manage all your Kubernetes
clusters. You can install an instance of the Palette management plane in your data center or public cloud provider using
different hosting models.

This option allows you to meet compliance and legal requirements once you have full control over your workloads,
determine who has access to them, and ensure that no sensitive data is exposed. You can also upgrade the platform at
your own pace and configure system settings through the
[System Console](../enterprise-version/system-management/system-management.md#system-console). Additionally, self-hosted
Palette enables deployments in air-gapped environments where access to the public cloud is not possible. Explore more on
the [Self-Hosted Palette](../enterprise-version/enterprise-version.md) page.

## Palette VerteX

Palette VerteX offers a simple, flexible, and secure way for government and regulated industries to deploy and manage
Kubernetes workloads containing sensitive and classified information. It is available as a self-hosted platform offering
that you can install in your data center or public cloud provider.

Palette VerteX is fully proven in operational environments as it has a Technology Readiness Level (TRL) 9 designation,
making it suitable for use in high-security production environments up to Impact Levels (IL) 5, 6, and 6+. It enables
you to deploy and manage the life cycle of multiple Kubernetes clusters in various environments. These include
virtualized and bare metal data centers (such as [VMware vSphere](https://www.vmware.com/products/vsphere.html) and
[Nutanix](https://www.nutanix.com/)), clouds (including [AWS](https://aws.amazon.com/govcloud-us/) and
[Azure](https://azure.microsoft.com/en-ca/explore/global-infrastructure/government) government clouds), and edge
locations (including air-gapped setups), which makes VerteX also appropriate for addressing challenges like intermittent
connectivity or low bandwidth.

Additionally, VerteX incorporates validated Federal Information Processing Standards (FIPS) 140-2 cryptographic modules
into its management plane and the Kubernetes clusters it deploys. It secures data in motion through encrypted Transport
Layer Security (TLS) communication channels, includes a suite of scanning tools, and offers CONUS support from a
dedicated public sector team. These capabilities ensure robust data protection for your organization’s infrastructure
and applications. To learn more, check out the [Palette VerteX](../vertex/vertex.md) documentation.

## Virtual Machine Orchestrator

Palette Virtual Machine Orchestrator (VMO) allows you to deploy and manage traditional VM workloads within a modern
Kubernetes environment, side by side with your containerized applications. With VMO, you can deploy, manage, and scale
VMs within the same cluster that hosts your containerized applications. VMs are managed as Kubernetes pods, ensuring
complete mapping between the VM and Kubernetes concepts.

Palette VMO simplifies infrastructure management and eliminates the need for a hypervisor by leveraging
[Canonical MAAS](https://maas.io). It works in self-hosted, airgapped, and in our SaaS environments. Learn more on the
[Virtual Machine Orchestrator](../vm-management/vm-management.md) page.
