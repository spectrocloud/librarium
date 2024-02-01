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

Palette Virtual Machine Orchestrator (VMO) provides a unified platform for managing containerized and virtualized
applications. This solution allows organizations to onboard, deploy, manage, and scale VMs within the same cluster as
their containerized applications. Palette VM Orchestrator simplifies managing infrastructure, improves resource
utilization, and removes the cost of having a hypervisor.

![A drawing of VMs deployed to Palette](/docs_vm-mangement_vmo-diagram.png)

## Use Cases

Palette VM Orchestrator is particularly suitable in the following scenarios:

- Organizations that want to remove their virtualization infrastructure due to an aging environment or to reduce costs.
  By using Palette VM Orchestrator, legacy applications and modern, containerized applications can be deployed on VMs.

- Edge locations with a few VMs deployed and where a hypervisor is no longer desired.

## Prerequisites

Palette Virtual Machine Orchestrator requires the following:

- Palette version 3.3.0 or higher.

- For data centers, production VMs are supported on bare metal Kubernetes clusters deployed on Canonical MAAS. To learn
  how to configure MAAS and create MAAS clusters in Palette, refer to the
  [Install and Manage MAAS Gateway](../clusters/data-center/maas/install-manage-maas-pcg.md) guide.

- To use VMO on Edge, contact our support team by sending an email to
  [support@spectrocloud.com](mailto:support@spectrocloud.com)

- VMs with Persistent Volume Claim (PVC) must have a StorageClass that supports `ReadWriteMany` (`RWX`) access mode for
  seamless live migration to a different node - either when triggered manually or during a Kubernetes upgrades.

  :::warning

  In environments that use nested virtualization, where VMs operate inside of VMs due to lack of hardware to host VMs,
  it is technically possible to operate VMs in Kubernetes by setting the KubeVirt resource `useEmulation` to true.
  However, we do not recommend this approach.

  :::

## Get Started With VM Orchestrator

To get started, review [Virtual Machine Orchestrator Pack](vm-packs-profiles/vm-packs-profiles.md) to learn about its
components.

Review [Create a VMO Profile](vm-packs-profiles/create-vmo-profile.md) and
[Add Roles and Role Bindings](vm-packs-profiles/add-roles-and-role-bindings.md) to learn how to create the cluster
profile and add roles and permissions that allow users to create and manage Virtual Machines (VMs).

Palette VM Orchestrator provides various methods to quickly deploy VMs from out-of-the-box templates or from your
organization's templates. To learn more about using and creating templates, review
[Deploy VM From a Template](create-manage-vm/standard-vm-operations/deploy-vm-from-template.md) and
[Create a VM Template](create-manage-vm/create-vm-template.md).

## Feature Gates

Palette VM Orchestrator utilizes open-source KubeVirt as a component of the **Virtual Machine Orchestrator** pack to
manage VMs and enables the following KubeVirt feature gates by default:

- LiveMigration
- Snapshot
- HotplugVolumes
- VMExport
- ExpandDisks
- HotplugNICs
- VMLiveUpdateFeatures

KubeVirt offers other feature gates you may find useful and which you can enable using
[Kubernetes feature gates](https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/). To enable
more KubeVirt feature gates, you can modify the `kubevirt.kubevirtResource.additonalFeatureGates` parameter in the
**Virtual Machine Orchestrator** manifest.

For more information on KubeVirt feature gates, refer to the
[KubeVirt user guide](https://kubevirt.io/user-guide/operations/activating_feature_gates/).

## Kubevirt Plugins

VMO includes the following Kubevirt plugins:

- [Kubevirt-Velero](https://github.com/kubevirt/kubevirt-velero-plugin) - VMO includes the Kubevirt-Velero plugin, which
  allows you to back up and restore VMs using Velero. This installs Velero snapshot controller and Custom Resource
  Definitions required by Velero. Refer to the
  [Virtual Machine Orchestrator Pack](./vm-packs-profiles/vm-packs-profiles.md) guide for more information.

## Resources

- [Virtual Machine Orchestrator Pack](vm-packs-profiles/vm-packs-profiles.md)

- [Create a VMO Profile](vm-packs-profiles/create-vmo-profile.md)

- [Add Roles and Role Bindings](vm-packs-profiles/add-roles-and-role-bindings.md)

- [Create and Manage VMs](create-manage-vm/create-manage-vm.md)

- [Standard VM Operations](create-manage-vm/standard-vm-operations/standard-vm-operations.md)

- [Deploy VM from a Template](create-manage-vm/standard-vm-operations/deploy-vm-from-template.md)

- [Create a VM Template](create-manage-vm/create-vm-template.md)

- [VM Roles and Permissions](vm-roles-permissions.md)

- [KubeVirt user guide](https://kubevirt.io/user-guide/operations/activating_feature_gates/)
