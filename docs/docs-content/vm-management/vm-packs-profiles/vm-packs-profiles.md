---
sidebar_label: "Virtual Machine Orchestrator Pack"
title: "Virtual Machine Orchestrator Pack"
description: "Learn about components of the Virtual Machine Orchestrator pack."
icon: " "
hide_table_of_contents: false
tags: ["vmo"]
---

The **Virtual Machine Orchestrator** pack provides a single-pack experience that consolidates all the dependencies
needed to deploy and manage VMs in your Kubernetes host cluster. You use **Virtual Machine Orchestrator** pack to create
a VMO cluster profile. The pack's components are described below. All the components are enabled by default in the
`charts:` section of the pack YAML configuration file.

<br />

- **Spectro VM Dashboard**: Enables access to a web console so you can manage and monitor your VMs. The console is
  accessible from the **Virtual Machines** tab that appears on the cluster overview page when using Palette Virtual
  Machine Orchestrator (VMO). The dashboard provides a web interface to create and manage VMs in your Kubernetes
  cluster.

- **KubeVirt**: Allows you to create VMs within a Kubernetes cluster using open-source [KubeVirt](https://kubevirt.io).
  KubeVirt provides feature gates you can enable in the Virtual Machine Orchestrator pack YAML file. To learn which
  feature gates Palette enables by default and how you can enable additional feature gates, check out the
  [Feature Gates](../vm-management.md#feature-gates) section.

  KubeVirt extends Kubernetes with additional virtualization resource types using Kubernetes Custom Resource Definitions
  (CRD) API. KubeVirt also includes controllers and agents that provide VM management capabilities on the cluster.
  Through KubeVirt you can use the Kubernetes API to manage VM resources similar to the way you manage Kubernetes
  resources.

- **KubeVirt CDI**: Provides persistent storage for Kubernetes clusters. It enables Persistent Volume Claims (PVCs) to
  be used as disks for KubeVirt VMs.

- **Volume Snapshot Controller**: A Kubernetes plugin that watches VolumeSnapshot CRD objects and manages the creation
  and deletion of volume snapshots. A snapshot represents a point-in-time copy of a volume.

- **Multus CNI**: A Controller Network Interface (CNI) plugin that enables multiple network interfaces to attach to
  Kubernetes pods. In this context, it is used to attach VM networks to the launched VM.

:::info

The **Spectro Proxy** pack enables the use of a reverse proxy with a Kubernetes cluster and is automatically installed
when you create the cluster with the default **Proxied** setting for **Access** during cluster profile creation. Check
out the [Spectro Proxy](../../integrations/frp.md) pack documentation to learn more.

:::

Administrators can configure the out-of-the-box add-on packs, cluster profiles, and VM templates that include commonly
used operating systems, or they can define their own VM templates to share with users.

# Resources

- [Spectro Proxy](../../integrations/frp.md)

- [Feature Gates](../vm-management.md#feature-gates)
