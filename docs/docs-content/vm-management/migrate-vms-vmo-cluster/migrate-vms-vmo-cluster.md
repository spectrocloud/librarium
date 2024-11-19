---
sidebar_label: "Migrate VMs to a VMO Cluster"
title: "Migrate VMs to a VMO Cluster"
description: "Learn how to migrate VMs to Palette VMO."
icon: " "
hide_table_of_contents: false
sidebar_position: 60
tags: ["vmo"]
---

During large scale Kubernetes adoptions, workloads are often rehosted or migrated instead of being redeployed from
scratch. This process allows system administrators to copy the application, together with its data, to a Kubernetes
cluster. However, the migration of VMs can be time consuming if done manually, so it is often automated with open source
tools such as [Forklift](https://github.com/kubev2v/forklift).

Palette provides the ability to migrate Virtual Machines (VMs) from VMware vSphere to Palette VMO using the VM Migration
Assistant or the [Palette CLI](../../automation/palette-cli/palette-cli.md).

## Migration Methods

Choose from the following methods to migrate your VMs to your VMO cluster:

- [Migrate a VM to a VMO cluster using the VM Migration Assistant](./vm-migration-assistant.md)
- [Migrate a VM to a VMO cluster using the Palette CLI](./migrate-vm-kubevirt.md)
