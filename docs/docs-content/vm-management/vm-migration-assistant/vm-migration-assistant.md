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
cluster. However, the migration of Virtual Machines (VMs) can be time consuming if done manually, so it is often automated with open source
tools such as [Forklift](https://github.com/kubev2v/forklift).

<!-- prettier-ignore-start -->

Palette provides the ability to migrate VMs from VMware vSphere to Virtual Machine Orchestrator (VMO) using the Virtual Machine Migration Assistant (VM Migration Assistant).
The <VersionedLink text="VM Migration Assistant" url="/integrations/packs/?pack=vm-migration-assistant-pack"/> is an
add-on pack that can be added to your cluster profile and works alongside the
<VersionedLink text="VMO" url="/integrations/packs/?pack=virtual-machine-orchestrator" /> pack.

<!-- prettier-ignore-end -->

## Access Pack

To get access to the Virtual Machine Migration Assistant Pack, contact our support team by sending an email to
support@spectrocloud.com. Include the following information in your email:

- Your full name
- Organization name (if applicable)
- Email address
- Phone number (optional)

Our dedicated Support team will promptly get in touch with you to provide the necessary credentials and assistance
required to get access.

## Resources

- [Create a VM Migration Assistant Cluster Profile](./create-vm-migration-assistant-profile.md)
- [Migrate VMs to a VMO cluster using the VM Migration Assistant](./migrate-vms-vmo-cluster.md)
- [Additional Configuration](./additional-configuration.md)
