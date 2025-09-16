---
sidebar_label: "Create and Manage VMs"
title: "Create and Manage VMs"
description: "Learn methods to create VMs using Palette's Virtual Machine Orchestrator.."
hide_table_of_contents: false
tags: ["vmo"]
---

Palette Virtual Machine Orchestrator (VMO) allows you to deploy and manage Virtual Machines (VMs) alongside
containerized applications.

## VM Creation

You can create a VM in one of the following ways:

- Deploy a VM from a template. Palette provides out-of-the-box templates, or your organization may provide templates.
  For the latter, refer to the [Create a VM Template](./advanced-topics/create-vm-template.md) guide.

- Create an empty VM and install the Operating System (OS) using a standard method, such as a Pre-boot Execution
  Environment (PXE) or optical disk image (ISO).

- Clone an existing VM. For more information, refer to [Clone a VM](./clone-vm.md).

Administrators can also import VMs from their existing VMware vSphere environment into Palette.

### Optional Components

Although no additional components are required in VMs, the **QEMU Guest Agent** is an optional component that runs
inside a VM and provides runtime information.

Additionally, Virtio is a virtualization standard for network and disk device drivers where only the guest's device
driver knows it is deployed in a virtual environment, and cooperates with the hypervisor. This enables guests to receive
high performance network and disk operations and provides most of the performance benefits of para-virtualization.

:::warning

We recommend installing the QEMU guest agent to display additional details in Palette Virtual Machine Orchestrator. We
also recommend installing VirtIO drivers to ensure you can use the para-virtualized hardware properly.

:::

## VM Management

After creating your VMs, you can make updates to the VM such as adding disk storage and adding network interfaces. You
can also take snapshots of the VMs and use those snapshots to provision other VMs. You can also migrate them to a
different node. Refer to the following resources to learn about VM management.

- [Migrate VM to Different Node](./migrate-vm-to-different-node.md)
- [Update VM Configuration](./update-vm-configuration.md)
- [Take Snapshot of VM](./take-snapshot-of-vm.md)

<!-- prettier-ignore-start -->

:::warning

Ensure that you delete all virtual machines before removing the
<VersionedLink text="Virtual Machine Orchestrator" url="/integrations/packs/?pack=virtual-machine-orchestrator" /> pack
from your cluster.

:::

<!-- prettier-ignore-end -->

## Advanced Topics

Beyond the standard Virtual Machine (VM) operations such as deployment, clone, and migration, Palette Virtual Machine
Orchestrator (VMO) supports further customization and advanced use cases. For more information, refer to the
[Advanced Topics](./advanced-topics/advanced-topics.md) section.
