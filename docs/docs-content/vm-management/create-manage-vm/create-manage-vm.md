---
sidebar_label: "Create and Manage VMs"
title: "Create and Manage VMs"
description: "Learn methods to create VMs using Palette's Virtual Machine Orchestrator.."
icon: " "
hide_table_of_contents: false
tags: ["vmo"]
---

Palette Virtual Machine Orchestrator (VMO) allows you to deploy and manage Virtual Machines (VMs) alongside containerized applications.

## Prerequisites

- Outbound internet connectivity for port 443 is allowed so that you and your applications can connect with the Spectro Cloud reverse proxy.

- Users or groups must be mapped to a Virtual Machine RBAC role. You can create a custom role through a manifest and use Palette's RoleBinding feature to associate users and groups with the role. Refer to the [Create Role Bindings](../../clusters/cluster-management/cluster-rbac.md#create-role-bindings) guide to learn more.

- A namespace for VMs. Although you can deploy VMs from the default namespace, we recommend creating at least one namespace dedicated to VMs as a way to organize and manage them. To learn how to create a namespace, check out [Create a Namespace](../../clusters/cluster-management/namespace-management.md#create-a-namespace).

## VM Creation

You can create a VM three ways:

<br />

- Deploy a VM from a template. Palette provides out-of-the-box templates, or your organization may provide templates. For the latter, refer to the [Create a VM Template](create-vm-template.md) guide.

- Create an empty VM and install the Operating System (OS) using a standard method, such as a Preboot Execution Environment (PXE) or optical disk image (ISO).

- Clone an existing VM.

Administrators can also import VMs from their existing VMware vSphere environment into Palette.

Although no additional components are required in VMs, the **QEMU Guest Agent** is an optional component that runs inside a VM and provides runtime information.

Additionally, Virtio is a virtualization standard for network and disk device drivers where only the guest's device driver knows it is deployed in a virtual environment, and cooperates with the hypervisor. This enables guests to receive high performance network and disk operations and provides most of the performance benefits of paravirtualization.

<br />

:::warning

We recommend installing the QEMU guest agent to display additional details in Palette Virtual Machine Orchestrator. We also recommend installing VirtIO drivers to ensure you can use the paravirtualized hardware properly.

:::

## Resources

- [Standard VM Operations](standard-vm-operations/standard-vm-operations.md)

- [Deploy VM from a Template](standard-vm-operations/deploy-vm-from-template.md)

- [Create a VM Template](create-vm-template.md)
