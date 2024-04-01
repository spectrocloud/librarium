---
sidebar_label: "VMware"
title: "VMware"
description: "Learn how to configure VMware to create VMware clusters in Palette."
hide_table_of_contents: false
sidebar_position: 30
tags: ["data center", "vmware"]
---

Palette supports VMware as a data center provider, enabling you to deploy and manage Kubernetes clusters on VMware
virtual machines. Palette achieves this through the [Private Cloud Gateway (PCG)](../../pcg/architecture.md),
establishing a secure connection from the internal network to the internet-accessible Palette instance and effectively
bypassing NAT gateways and firewalls.

:::info

Palette supports the ability to manage your VMware workloads on the same Kubernetes infrastructure as your other
applications. Palette Virtual Machine Orchestrator (VMO) provides a unified platform for managing containerized and
virtualized applications. This solution allows organizations to onboard, deploy, manage, and scale VMs within the same
cluster as their containerized applications. Check out the [VMO documentation](../../../vm-management/vm-management.md)
for more information.

:::
