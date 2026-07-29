---
sidebar_label: "Virtual Machine Management"
title: "Virtual Machine Management"
description: "Learn about managing VMs using PaletteAI VM Launchpad"
hide_table_of_contents: false
sidebar_position: 3
tags: ["vmo", "vm launchpad", "quick start", "virtual machines", "VMs"]
---

Use PaletteAI VM Launchpad to create, configure, monitor, and maintain virtual machines on Kubernetes. VM Launchpad provides UI
workflows for common VM operations while preserving access to the underlying KubeVirt resources when you need advanced
configuration.

## Virtual Machine Workflows

| **Workflow**                                        | **Description**                                                                  |
| --------------------------------------------------- | -------------------------------------------------------------------------------- |
| [Create VMs](./creating.md)                         | Create VMs from templates, golden images, ISOs, or blank disks.                  |
| [Manage VMs](./managing.md)                         | Start, stop, migrate, edit, diagnose, and delete VMs.                            |
| [Instance Types & Preferences](./instance-types.md) | Standardize compute sizing and hardware defaults.                                |
| [Manage Snapshots](./snapshots.md)                  | Create snapshots, restore VMs, define snapshot policies, and clone VMs.          |
| [Manage Packages](./packages.md)                    | Upload and serve packages for airgap guest agent and driver workflows.           |
| [Finalization Templates](./image-customization.md)  | Create auto-install scripts and customization templates for golden image builds. |

## Related Workflows

- [Create a Golden Image](./golden-images.md)
- [Template Management](./templates.md)
- [Create Your First VM](../quick-start.md)
