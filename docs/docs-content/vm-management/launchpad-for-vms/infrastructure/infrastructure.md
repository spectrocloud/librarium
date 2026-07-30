---
sidebar_label: "Infrastructure"
title: "Infrastructure"
description:
  "Manage the networking, storage, and namespaces that back virtual machines on the Launchpad for VMs appliance."
hide_table_of_contents: false
sidebar_position: 4
tags: ["vmo", "vm launchpad appliance", "infrastructure", "networking", "storage", "namespaces"]
---

Use the **Infrastructure** section of Virtual Machine Orchestrator (VMO) to manage the foundational platform resources
that VMs depend on, such as the networks they attach to, the storage that backs their disks, and the namespaces VMs run
in. VMO surfaces these Kubernetes constructs through dedicated UI workflows, while preserving direct access to the
underlying resources when you need advanced configuration.

Configure these resources before or while creating VMs. The VM creation wizard draws on the network attachment
definitions, StorageClasses, and namespaces you define here.

## Infrastructure Resources

| **Resource**                  | **Description**                                                                                                                                |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| [Networks](./networking.md)   | Create Network Attachment Definitions that expose bridge, `macvlan`, or SR-IOV networks to VMs, and bulk-create one NAD per VLAN from a range. |
| [Storage](./storage.md)       | Manage StorageClasses, storage pools, PersistentVolumeClaims, and DataVolumes that back VM disks.                                              |
| [Namespaces](./namespaces.md) | Create, adopt, and edit managed namespaces, and apply resource quotas and limit ranges.                                                        |

## Related Workflows

- [Virtual Machine Management](../virtual-machines/virtual-machines.md)
- [Create Your First VM](../quick-start.md)
