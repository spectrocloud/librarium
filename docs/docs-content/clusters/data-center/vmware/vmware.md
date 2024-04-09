---
sidebar_label: "VMware"
title: "VMware"
description: "Learn how to configure VMware to create VMware clusters in Palette."
hide_table_of_contents: false
sidebar_position: 30
tags: ["data center", "vmware"]
---

Palette supports VMware as a datacenter provider, enabling you to deploy and manage Kubernetes clusters on VMware
virtual machines. Palette achieves this through a [Private Cloud Gateway (PCG)](../../pcg/architecture.md),
which establishes a secure connection from the internal network to the internet-accessible Palette instance and effectively
bypassing NAT gateways and firewalls.

Palette supports VMware as a data center provider. With this, you can deploy and manage Kubernetes clusters on VMware
virtual machines. For this to work, Palette uses a [Private Cloud Gateway (PCG)](../../pcg/architecture.md), which
creates a secure connection from the internal network to the internet-accessible Palette instance, ultimately bypassing
the need to create firewall rules or other network configurations allowing external connections to the internal network.

:::tip

Palette supports the ability to manage your VMware workloads on the same Kubernetes infrastructure as your other
applications through the Palette Virtual Machine Orchestrator (VMO). VMO provides a unified platform for managing
containerized and virtualized applications. This solution allows organizations to onboard, deploy, manage, and scale VMs
within the same cluster as their containerized applications. Check out the
[VMO documentation](../../../vm-management/vm-management.md) for more information.

:::

## Get Started

To get started with VMware as your target platform for deploying Kubernetes clusters, you need to deploy a PCG in your
VMware environment. The PCG acts as a bridge between your VMware environment and Palette, enabling secure communication
between the two. Start by reviewing the [Deploy a PCG in VMware vSphere](../../pcg/deploy-pcg/vmware.md) guide.

:::info

If you are using a self-hosted Palette or VerteX instance, you can skip the PCG deployment and use the System PCG that
is already available in the instance. Review the [System PCG](../../pcg/architecture.md#system-private-gateway) section
of the PCG architecture page for more information.

:::

After you have deployed the PCG, you can proceed to create and manage VMware clusters in Palette. Refer to the
[Create and Manage VMware Clusters](create-manage-vmware-clusters.md) guide for detailed instructions.

## Resources

- [Create and Manage VMware Clusters](create-manage-vmware-clusters.md)

- [Permissions](permissions.md)
