---
sidebar_label: "Palette Additional Capabilities"
title: "Palette Additional Capabilities"
description: "Learn more about Palette's Additional Capabilities."
icon: ""
hide_table_of_contents: false
sidebar_position: 80
tags: ["getting-started"]
---

Palette offers a range of additional capabilities designed to extend the functionality and versatility of Kubernetes
workloads. These features comprise diverse deployment scenarios, ensuring organizations can manage their workloads
across different environments. This can include data centers such as VMware vSphere and OpenStack, bare metal, or public
cloud using your cloud accounts.

Whether deploying workloads in remote locations with [Edge](./additional-capabilities.md#edge), enforcing FIPS
compliance with [VerteX](./additional-capabilities.md#palette-vertex), maximizing management control with
[self-hosted Palette](./additional-capabilities.md#self-hosted-palette), or integrating virtual machine workloads into
Kubernetes environments with [Virtual Machine Orchestrator](./additional-capabilities.md#virtual-machine-orchestrator),
Palette provides comprehensive solutions to meet different business needs. Learn more about each capability below.

![A drawing of Palette with humans interacting](/getting-started/getting-started_additional-capabilities_palette.png)

## Edge

Palette Edge enables you to deploy Kubernetes workloads in remote or rural locations without having to provision
high-bandwidth connectivity from these sites back to the cloud. It supports both VM and container-based workloads,
multiple Kubernetes distributions, and Intel and ARM hardware architectures. Palette Edge is built on top of the
open-source project [Kairos](https://kairos.io/), which provides an immutable and highly available operating system with
zero-downtime rolling upgrades. Additionally, it is designed to scale to tens of thousands of locations while enforcing
policies locally within each cluster.

Edge clusters are Kubernetes clusters set up on Edge hosts. These hosts can be bare metal or virtual machines located in
isolated locations. Palette deploys and manages workload clusters at the Edge, and the services continue operating even
when the connection to the management plane is lost. You can manage Edge clusters locally on-site through the Edge
Management console, or centrally through the Palette management plane. Palette Edge is able to meet your needs,
regardless of the network topology your deployments face. Check out the [Palette Edge](../clusters/edge/edge.md) page to
learn more about Edge and its features.

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

Palette VerteX offers a simple, flexible, and secure way for government and regulated industries to manage Kubernetes
workloads containing sensitive and classified information. It is available as a self-hosted platform offering that you
can install in your data center or public cloud provider.

Palette VerteX incorporates validated Federal Information Processing Standards (FIPS) 140-2 cryptographic modules into
the Kubernetes clusters it deploys, ensuring robust data protection for your organization’s infrastructure and
applications. To learn more, check out the [Palette VerteX](../vertex/vertex.md) documentation.

## Virtual Machine Orchestrator

Palette Virtual Machine Orchestrator (VMO) allows you to deploy and manage traditional VM workloads within a modern
Kubernetes environment, side by side with your containerized applications. With VMO, you can deploy, manage, and scale
VMs within the same cluster that hosts your containerized applications. VMs are managed as Kubernetes pods, ensuring
complete mapping between the VM and Kubernetes concepts.

Palette VMO simplifies infrastructure management and eliminates the need for a hypervisor by leveraging Canonical’s
Metal As A Service (MAAS). It works in self-hosted, air-gapped, and in our SaaS environments. Learn more on the
[Virtual Machine Orchestrator](../vm-management/vm-management.md) page.
