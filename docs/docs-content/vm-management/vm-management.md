---
sidebar_label: "Virtual Machine Orchestrator"
title: "Virtual Machine Orchestrator"
description:
  "Learn about the Palette's Virtual Machine Orchestrator solution for managing containerized and virtualized
  applications."
hide_table_of_contents: false
sidebar_custom_props:
  icon: "server"
tags: ["vmo"]
---

Palette Virtual Machine Orchestrator (VMO) provides a unified platform for deploying, managing, and scaling Virtual
Machines (VMs) and containerized applications within Kubernetes clusters. Palette VMO supports deployment to edge
devices and bare metal servers in data centers.

Palette VMO simplifies infrastructure management, improves resource utilization, and eliminates hypervisor costs.

![A drawing of VMs deployed to Palette](/vm-mangement_vmo-diagram.webp)

## Use Cases

You will benefit from Palette VMO in the following cases:

- You are planning to gradually shift from VMs to containers and want to continue using both during the transition.

- Your established infrastructure combines containers and VMs, and you want to manage them more effectively.

- You are integrating new VM-based applications into an existing containerized infrastructure.

- You are managing edge locations with VM-based workloads and would like to stop using a hypervisor.

## Get Started

To get started with Palette VMO, review the [Architecture](./architecture.md) page to learn about the components
involved in enabling VMO for your infrastructure. If you want to use VMO in airgapped instances of self-hosted Palette
or Palette VerteX, review the [Install VMO in Airgap Environments](./install-vmo-in-airgap.md) guide. Then, review the
[Create a VMO Profile](./create-vmo-profile.md) guide to prepare everything you need to deploy your first VMO cluster.

Once your VMO cluster is up and healthy, refer to the [Create and Manage VMs](./create-manage-vm/create-manage-vm.md)
section for information on deploying VMs from existing Palette templates and performing standard VM operations. You can
also learn how to migrate VMs from VMware vSphere to a VMO cluster using the
[Virtual Machine Migration Assistant](./vm-migration-assistant/vm-migration-assistant.md). Alternatively, review the
[Advanced Topics](./create-manage-vm/advanced-topics/advanced-topics.md) section to understand how you can create VM and
disk templates, manage the VM resources, and perform other advanced operations.

Finally, refer to the [Role-based Access Control (RBAC)](./rbac/rbac.md) section for information on configuring roles
and permissions for your VMs.

## Resources

- [Architecture](./architecture.md)

- [Install VMO in Airgap Environments](./install-vmo-in-airgap.md)

- [Create a VMO Profile](./create-vmo-profile.md)

- [Configure Private CA Certificate to enable trust with Self-Hosted Palette or Palette VerteX](./configure-private-ca-certificate.md)

- [Create and Manage VMs](./create-manage-vm/create-manage-vm.md)

- [Advanced Topics](./create-manage-vm/advanced-topics/advanced-topics.md)

- [Import and Deploy OVAs to Palette VMO](./create-manage-vm/advanced-topics/deploy-import-ova.md)

- [RBAC](./rbac/rbac.md)

- [Virtual Machine Migration Assistant](./vm-migration-assistant/vm-migration-assistant.md)
