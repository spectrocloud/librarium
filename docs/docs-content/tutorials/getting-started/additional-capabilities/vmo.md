---
sidebar_label: "Virtual Machine Orchestrator"
title: "Virtual Machine Orchestrator"
description: "Learn more about the Palette Virtual Machine Orchestrator (VMO)."
icon: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["getting-started", "tutorial"]
---

Palette Virtual Machine Orchestrator (VMO) allows you to deploy, manage, and scale traditional VM workloads within a
modern Kubernetes environment, side by side with your containerized applications. It lets you apply to VMs the same
lifecycle management capabilities as Palette applies to containers, including backups.

VMO uses the CNCF project [KubeVirt](https://kubevirt.io) to manage VMs as Kubernetes pods, ensuring complete mapping
between the VM and Kubernetes concepts. This solution also has near complete feature parity with
[VMware vSphere](https://www.vmware.com/products/vsphere.html), including capabilities such as live migration.

Palette VMO can be used on edge hosts, giving the ability to deploy VM workloads at the edge without the overhead of a
hypervisor layer. This is achieved by leveraging [Canonical MAAS](https://maas.io). Additionally, VMO can also be used
in self-hosted, airgapped, and in our SaaS environments. Learn more on the
[Virtual Machine Orchestrator](../../../vm-management/vm-management.md) page.

## Resources

To learn more about Palette VMO, review the [Architecture](../../../vm-management/architecture.md) page to learn about
the components involved in enabling VMO for your infrastructure. Then, review the
[Create a VMO Profile](../../../vm-management/create-vmo-profile.md) guide to prepare everything you need to deploy your
first cluster with VMO.

Check out the following video for a tour of Palette's Virtual Machine Orchestrator (VMO) capability. It shows how you
can model, deploy, and manage VM workloads alongside containers in your clusters.

<br />

<YouTube
  url="https://www.youtube.com/embed/N7dQ6jmEkCQ"
  title="Webinar | The new home for your VMs: Kubernetes"
  referrerpolicy="strict-origin-when-cross-origin"
/>
