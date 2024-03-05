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

Whether deploying workloads in remote locations with Edge, securing sensitive information with VerteX, maximizing
management control with self-hosted Palette, or integrating Virtual Machine workloads into Kubernetes environments with
Virtual Machine Orchestrator, Palette provides comprehensive solutions to meet different business needs. Learn more
about each capability below.

## Edge

Palette Edge enables you to deploy Kubernetes workloads in remote or rural locations without having to provision
high-bandwidth connectivity from these sites back to the cloud. Its secure and decentralized architecture allows
services to operate even without connection to the central management plane while enforcing policies locally.

Edge clusters are Kubernetes clusters set up on Edge hosts. These hosts can be bare metal or virtual machines located in
isolated locations. Palette deploys and manages workload clusters at the Edge through the Palette management console,
bringing computing and data storage closer to the source. This approach reduces latency and bandwidth issues that result
from central computing, enhancing overall application performance. Learn more on the
[Palette Edge](../clusters/edge/edge.md) page.

![A drawing of Edge architecture with humans interacting](/getting-started/getting-started_additional-capabilities_edge.png)

## Self-Hosted Palette

Palette is available as a fully self-hosted platform offering. You can install an instance of the Palette management
plane in your data center or public cloud provider to manage Kubernetes clusters.

This option gives you maximum control over the platform, as you are responsible for the day-to-day management.
Additionally, it enables deployments in air-gapped environments where access to the public cloud is not possible. Read
more on the [Self-Hosted Palette](../enterprise-version/enterprise-version.md) page.

## Palette VerteX

Palette VerteX offers a simple, flexible, and secure way for government and regulated industries to manage Kubernetes
workloads containing sensitive and classified information. It is available as a self-hosted platform offering that you
can install in your data center or public cloud provider.

Palette VerteX incorporates validated Federal Information Processing Standards (FIPS) 140-2 cryptographic modules into
the Kubernetes clusters it deploys, ensuring robust data protection for your organization’s infrastructure and
applications. Read more on [Palette VerteX](../vertex/vertex.md) page.

![A screenshot of Palette VerteX.](/getting-started/getting-started_additional-capabilities_vertex.png)

## Virtual Machine Orchestrator

Palette Virtual Machine Orchestrator (VMO) allows you to run and manage traditional VM workloads within a modern
Kubernetes environment, side by side with your containerized applications. With VMO, you can deploy, manage, and scale
VMs within the same cluster that hosts your containerized applications. VMs are managed as Kubernetes pods, ensuring
complete mapping between the VM and Kubernetes concepts.

Palette VMO simplifies infrastructure management and eliminates the need for a hypervisor by leveraging Canonical’s
Metal As A Service (MAAS). It works in self-hosted, air-gapped, and Spectro Cloud’s SaaS environments. Learn more on the
[Virtual Machine Orchestrator](../vm-management/vm-management.md) page.

![A screenshot of Palette VMO.](/getting-started/getting-started_additional-capabilities_vmo.png)
