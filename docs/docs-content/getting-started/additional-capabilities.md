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
Kubernetes workloads across a wide variety of environments and deployment options.

This section will introduce you to some of Palette's additional capabilities, which include:

- Managing thousands of clusters in remote locations with [Edge](./additional-capabilities.md#edge).
- Self-hosting the Palette management plane in your own environment with
  [Self-Hosted Palette](./additional-capabilities.md#self-hosted-palette).
- Integrating virtual machine workloads into Kubernetes environments with
  [Virtual Machine Orchestrator](./additional-capabilities.md#virtual-machine-orchestrator).

![A drawing of Palette with humans interacting](/getting-started/getting-started_additional-capabilities_palette.webp)

## Edge

Palette Edge enables you to deploy Kubernetes workloads in remote locations characterized by limited or intermittent
connectivity and limited compute infrastructure. This means you can deploy Kubernetes clusters at scale and ensure
application performance, availability, security, and lifecycle management across a diverse range of edge locations.
These locations include hospitals, retail stores, Telco environments, restaurants, manufacturing facilities, rural
areas, and many more.

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

By default, the Palette management plane is available as a multi-tenant SaaS deployment in a public cloud with multiple
availability zones. Should you need it, Palette is also offered as a dedicated SaaS instance, as well as a fully
self-hosted option that allows your teams to directly deploy and manage a private instance of the Palette management
plane in your data center or public cloud provider.

Self-hosted Palette puts you in full control of the management plane, including its configuration and the timing of
upgrades. A self-hosted instance may be necessary to meet compliance requirements or your organization's security
policies. You may also need to deploy an instance of Palette within an airgapped facility to manage clusters where
access to any outside service is not possible. Explore more on the
[Self-Hosted Palette](https://docs.spectrocloud.com/enterprise-version/) page.

## Virtual Machine Orchestrator

Palette Virtual Machine Orchestrator (VMO) allows you to deploy, manage, and scale traditional VM workloads within a
modern Kubernetes environment, side by side with your containerized applications. It lets you apply to VMs the same
lifecycle management capabilities as Palette applies to containers, including backups.

VMO uses the CNCF project [KubeVirt](https://kubevirt.io) to manage VMs as Kubernetes pods, ensuring complete mapping
between the VM and Kubernetes concepts. This solution also has near complete feature parity with
[VMware vSphere](https://www.vmware.com/products/vsphere.html), including capabilities such as live migration.

Palette VMO can be used on edge hosts, giving the ability to deploy VM workloads at the edge without the overhead of a
hypervisor layer. This is achieved by leveraging [Canonical MAAS](https://maas.io). Additionally, VMO can also be used
in self-hosted, airgapped, and in our SaaS environments. Learn more on the
[Virtual Machine Orchestrator](../vm-management/vm-management.md) page.
