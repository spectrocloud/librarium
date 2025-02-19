---
sidebar_label: "VM Migration Assistant"
title: "Virtual Machine Migration Assistant"
description:
  "Learn about how Palette's Virtual Machine (VM) Migration Assistant can be used to migrate VMs to your Virtual Machine
  Orchestrator cluster."
icon: " "
hide_table_of_contents: false
sidebar_position: 60
tags: ["vmo"]
---

During large scale Kubernetes adoptions, workloads are often rehosted or migrated instead of being redeployed from
scratch. This process allows system administrators to copy the application, together with its data, to a Kubernetes
cluster. However, the migration of Virtual Machines (VMs) can be time consuming if done manually, so it is often
automated with open source tools such as [Forklift](https://github.com/kubev2v/forklift).

<!-- prettier-ignore-start -->

Palette provides the ability to migrate VMs from VMware vSphere to Virtual Machine Orchestrator (VMO) using the Virtual Machine Migration Assistant (VM Migration Assistant).
The <VersionedLink text="VM Migration Assistant" url="/integrations/packs/?pack=vm-migration-assistant"/> is an
add-on pack that can be added to your cluster profile and works alongside the
<VersionedLink text="VMO" url="/integrations/packs/?pack=virtual-machine-orchestrator" /> pack.

<!-- prettier-ignore-end -->

## Resources

- [Create a VM Migration Assistant Cluster Profile](./create-vm-migration-assistant-profile.md)
- [Create Source Providers](./create-source-providers.md)
- [Create Migration Plans](./create-migration-plans.md)
- [Start Migration Plans](./start-migration-plans.md)
- [Cancel Active Migration Plans](./cancel-active-migration-plans.md)
- [Additional Configuration](./additional-configuration.md)
