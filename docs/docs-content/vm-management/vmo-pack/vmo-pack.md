---
sidebar_label: "VMO Pack"
title: "VMO Pack"
description: "Learn about the VMO Pack. If you are new to VMO, we recommend using the VM Launchpad instead."
hide_table_of_contents: false
sidebar_position: 0
tags: ["vmo", "vmo pack"]
---

<!-- prettier-ignore-start -->

Virtual Machine Orchestrator (VMO) Pack is the original approach to running VMs on Palette-managed Kubernetes
clusters. With VMO Pack, you use Palette to deploy the <VersionedLink text="Virtual Machine Orchestrator" url="/integrations/packs/?pack=virtual-machine-orchestrator" /> pack
as an add-on cluster profile. The VMO pack bundles KubeVirt, Containerized Data Importer (CDI), Multus CNI, a snapshot controller, and the Spectro VM Dashboard into a single add-on.
You can attach this add-on to Palette-managed clusters or [imported clusters](../../clusters/imported-clusters/imported-clusters.md) and then access the VM dashboard through
Palette using the Spectro Proxy.

:::tip

We recommend using the [VM Launchpad](../vm-launchpad/vm-launchpad.md) for new VMO deployments. The
appliance provides a dedicated VM management UI with built-in golden image workflows, snapshot policies, airgapped package
management, and identity management capabilities that are not available in Pack VMO. Refer to the [Deployment Approaches table](../vm-management.md#deployment-approaches) for a comparison between VM Launchpad and VMO Pack. 

:::

<!-- prettier-ignore-end -->

## Use Cases

VMO Pack is appropriate in the following scenarios:

- You have existing VMO clusters deployed through Palette that you want to continue managing.

- You want to add VM capabilities to Palette-managed or imported clusters that are already integrated with Palette.

- You need Palette-managed cluster lifecycle operations (provisioning, scaling, upgrades) alongside VM management.

## Limitations

- A Palette connection is required to create your VMO pack.

- The VM dashboard is typically accessed through Palette. On locally managed Edge clusters that operate without a
  Palette connection, the dashboard still runs on the cluster, but Palette-managed OIDC is unavailable. In that case,
  configure local authentication, Keycloak, or an external OIDC provider on the pack instead. Refer to
  [Deployment Modes and Authentication](./deployment-modes-and-authentication.md) for guidance. If the VMO pack is not
  in a healthy state, the VM dashboard becomes unavailable.

- Networking and storage management are configured through Kubernetes manifests rather than through a dedicated
  management interface.

- Golden image building, snapshot policies, and air-gap package management are not available. These capabilities are
  exclusive to the [VM Launchpad](../vm-launchpad/vm-launchpad.md).

## Get Started

1. Review the [Architecture](../architecture.md) page to learn about the components included in the VMO pack.

2. Review [Deployment Modes and Authentication](./deployment-modes-and-authentication.md) to decide how the VM
   management UI is reached and which identity provider users authenticate against.

3. Follow the [Create a VMO Profile](./create-vmo-profile.md) guide to build your VMO add-on cluster profile. If you are
   deploying in an airgapped environment, review the [Install VMO in Airgap Environments](./install-vmo-in-airgap.md)
   guide first.

4. Deploy a cluster with the VMO add-on profile attached, then refer to the
   [Create and Manage VMs](./create-manage-vm/create-manage-vm.md) section for guidance on deploying VMs and performing
   standard VM operations.

5. Explore the [Advanced Topics](./create-manage-vm/advanced-topics/advanced-topics.md) section to learn how to create
   VM and disk templates, manage VM resources, and perform other advanced operations.

If you are moving an existing cluster from an earlier pack version, refer to
[Upgrade the VMO Pack](./upgrade-vmo-pack.md) for the differences between the two generations of the pack and for the
upgrade procedure.
