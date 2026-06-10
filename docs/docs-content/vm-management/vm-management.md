---
sidebar_label: "Virtual Machine Orchestrator"
title: "Virtual Machine Orchestrator"
description:
  "Learn about Palette Virtual Machine Orchestrator (VMO) for managing VMs alongside containers in Kubernetes clusters."
hide_table_of_contents: false
sidebar_custom_props:
  icon: "server"
tags: ["vmo"]
---

Palette Virtual Machine Orchestrator (VMO) enables you to run and manage VMs alongside containers on Kubernetes. Instead
of maintaining separate hypervisor and container platforms, VMO consolidates both workload types into a single
infrastructure layer built on [KubeVirt](https://kubevirt.io/). You can deploy VMO on bare metal servers in data
centers, at Edge locations, and in airgapped or regulated environments.

With VMO, you can create, start, stop, migrate, snapshot, and clone VMs using the same Kubernetes cluster that runs your
containerized applications. VMO handles the underlying infrastructure, including storage, networking, identity
management, and observability, so you do not need to assemble and maintain separate tools for each concern.

![A drawing of VMs deployed to Palette](/vmo/vm-mangement_vmo-diagram-4-9.webp)

## Use Cases

VMO is designed for organizations that need to manage VM workloads on Kubernetes. Common scenarios include:

- **Hypervisor consolidation** - Replace a traditional hypervisor with a Kubernetes-native VM runtime to reduce
  licensing costs, simplify operations, and unify your infrastructure management.

- **VM-to-container migration** - Run VMs and containers side by side during a gradual transition. Move workloads to
  containers at your own pace without maintaining two separate platforms.

- **Edge and distributed sites** - Deploy VMs at Edge locations and remote sites where a standalone, self-contained
  platform is easier to operate than a centrally managed hypervisor.

- **Airgapped and regulated environments** - Run VMs in disconnected or compliance-sensitive environments with built-in
  FIPS 140-3 support, airgapped package management, and standalone identity management.

## Deployment Approaches

VMO is available through two deployment approaches: [VM Launchpad Appliance](#vm-launchpad-appliance-recommended)
(recommended) and [VMO Pack](#vmo-pack).

| **Capability**                         | **VM Launchpad Appliance**           | **VMO Pack**                                                                           |
| -------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------- |
| **Palette connection**                 | Not supported                        | Required for profile authoring; optional at runtime with locally managed Edge clusters |
| **Deployment method**                  | Bootable ISO                         | Palette cluster profile or exported cluster definition                                 |
| **Golden image builder**               | Yes                                  | No                                                                                     |
| **Snapshot policies**                  | Yes                                  | No                                                                                     |
| **Airgapped package management**       | Yes                                  | No                                                                                     |
| **Built-in identity management**       | Yes (OIDC, Keycloak, local accounts) | Palette-managed OIDC                                                                   |
| **Observability (metrics dashboards)** | Built-in (OTel, PromQL)              | Requires external setup                                                                |
| **VM Migration Assistant**             | Yes                                  | Yes                                                                                    |
| **Cluster lifecycle management**       | Self-managed (Local UI)              | Palette-managed or self-managed (Local UI)                                             |
| **Imported cluster support**           | No                                   | Yes                                                                                    |

### VM Launchpad Appliance (Recommended)

The [VM Launchpad Appliance](./launchpad-for-vms/launchpad-for-vms.md) is the recommended way to deploy VMO. It provides
a standalone, bootable ISO that you install directly on bare metal or Edge devices. After installation, link your
devices together to form a cluster with VMO preconfigured and ready to use. No connection to Palette is required.

The appliance includes a purpose-built management UI designed specifically for VM operations, with built-in identity and
access management, golden image workflows, airgapped package management, snapshot policies, and observability
dashboards. This self-contained approach is well suited for distributed sites, Edge locations, airgapped environments,
and regulated environments.

If you are new to VMO, start with the VM Launchpad Appliance. Refer to
[Install VM Launchpad](./launchpad-for-vms/install-vmla-iso.md) to get started.

### VMO Pack

<!-- prettier-ignore-start -->

[VMO Pack](./vmo-pack/vmo-pack.md) is the original approach to deploying VMO. You create a cluster through Palette
and add the <VersionedLink text="Virtual Machine Orchestrator" url="/integrations/packs/?pack=virtual-machine-orchestrator" /> pack
to a curated [cluster profile](./vmo-pack/create-vmo-profile.md). VM management is accessed through the Palette UI.

<!-- prettier-ignore-end -->

VMO Pack remains fully supported. However, we recommend using the VM Launchpad Appliance for new deployments because it
provides a dedicated VM management experience with standalone authentication, operational tooling, and capabilities that
are not available in the pack approach.

## Next Steps

Take the following steps to get started with VMO. Once you have a VMO cluster, you can also explore the
[Virtual Machine Migration Assistant](./vm-migration-assistant/vm-migration-assistant.md) to learn how you can migrate
existing VMs from VMware vSphere to your VMO cluster.

<Tabs>

<TabItem label="VM Launchpad Appliance" value="appliance">

1. Review the [VM Launchpad Appliance](./launchpad-for-vms/launchpad-for-vms.md) overview to learn about the appliance
   architecture and capabilities.

2. Follow the [Install VM Launchpad](./launchpad-for-vms/install-vmla-iso.md) guide to install the appliance on your
   devices and create your cluster.

3. Use the [Create Your First VM](./launchpad-for-vms/quick-start.md) guide to deploy your first VM.

</TabItem>

<TabItem label="VMO Pack" value="pack">

1. Review the [Architecture](./architecture.md) page to learn about the components involved in enabling VMO.

2. Follow the [Create a VMO Profile](./vmo-pack/create-vmo-profile.md) guide to prepare everything you need to deploy
   your first VMO cluster. If you are using VMO in an airgapped environment, review the
   [Install VMO in Airgap Environments](./vmo-pack/install-vmo-in-airgap.md) guide first.

3. Refer to the [Create and Manage VMs](./vmo-pack/create-manage-vm/create-manage-vm.md) section for information on
   deploying VMs and performing standard VM operations.

4. Review the [Advanced Topics](./vmo-pack/create-manage-vm/advanced-topics/advanced-topics.md) section to learn how to
   create VM and disk templates, manage VM resources, and perform other advanced operations.

</TabItem>

</Tabs>
