---
sidebar_label: "Infrastructure"
title: "Infrastructure"
description:
  "Manage the namespaces, storage, and networking that back virtual machines on the Launchpad for VMs appliance."
hide_table_of_contents: false
sidebar_position: 4
tags: ["vmo", "vm launchpad appliance", "infrastructure", "namespaces", "storage", "networking"]
---

Use the **Infrastructure** section to manage the foundational platform resources that virtual machines depend on: the
namespaces VMs run in, the storage that backs their disks, and the networks they attach to. Launchpad for VMs surfaces
these Kubernetes constructs through dedicated UI workflows, while preserving direct access to the underlying resources
when you need advanced configuration.

Configure these resources before or while creating VMs. The VM creation wizard draws on the namespaces, StorageClasses,
and Network Attachment Definitions (NADs) you define here.

## Infrastructure Resources

| **Resource**                  | **Description**                                                                         |
| ----------------------------- | --------------------------------------------------------------------------------------- |
| [Namespaces](./namespaces.md) | Create, adopt, and edit managed namespaces, and apply resource quotas and limit ranges. |

## Related Workflows

- [Virtual Machine Management](../virtual-machines/virtual-machines.md)
- [Create Your First VM](../quick-start.md)
