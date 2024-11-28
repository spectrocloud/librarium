---
sidebar_label: "Clone a VM"
title: "Clone a VM"
description: "Learn how to clone a VM from a template using Palette Virtual Machine Orchestrator."
icon: " "
hide_table_of_contents: false
sidebar_position: 40
tags: ["vmo"]
---

A VM clone is a copy of an existing virtual machine (VM). The cloned VM has the same configuration settings and
identifiers as the parent VM. After you clone a VM, the cloned VM acts as a separate virtual machine.

Cloning is a quick way to create a new virtual machine that shares the same properties as the parent. You may want to
clone a VM for the following reasons:

- Software testing. Developers can clone an active VM to test new changes to their code.

- Forensics. Security administrators can clone an infected machine and connect it to an air-gaped network to investigate
  the source of the infection while the parent VM can be destroyed or remediated.

## Prerequisites

- An active cluster in Palette with the Virtual Machine Orchestrator (VMO) pack.

  :::warning

  Ensure that the **Snapshot** feature gate is enabled in the Virtual Machine Orchestrator (VMO) pack. This is enabled
  by default, but may be modified during cluster profile creation and editing. This feature gate allows Palette to
  access the KubeVirt resources required for correctly cloning your VMs and their data volumes. Learn more about the
  KubeVirt clone capabilities on the [Clone API](https://kubevirt.io/user-guide/storage/clone_api/#clone-api) page in the
  official project documentation.

  Select the VMO pack in your cluster profile. Then, click on **Values** under the **Pack Details** section. Verify that
  `Snapshot` is present in the `charts.virtual-machine-orchestrator.kubevirt.kubevirtResources.additionalFeatureGates`
  field.

  ```yaml hideClipboard {5}
  kubevirtResource:
  name: kubevirt
  useEmulation: false
  additionalFeatureGates:
    - Snapshot
  ```

  :::

- Outbound internet connectivity for port 443 is allowed so that you and your applications can connect with the Spectro
  Cloud reverse proxy.

- Users or groups must be mapped to a Virtual Machine RBAC role. You can create a custom role through a manifest and use
  Palette's RoleBinding feature to associate users and groups with the role. Refer to the
  [Create Role Bindings](../../clusters/cluster-management/cluster-rbac.md#create-role-bindings) guide to learn more.

- A namespace for VMs. Although you can deploy VMs from the default namespace, we recommend creating at least one
  namespace dedicated to VMs as a way to organize and manage them. To learn how to create a namespace, check out
  [Create a Namespace](../../clusters/cluster-management/namespace-management.md#create-a-namespace).

## Clone a VM

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click **Clusters** and click on your cluster.

3. Click on the **Virtual Machine** tab.

4. Select the VM to clone and click either the **three-dot Menu** or **Actions**.

5. Power off the parent VM and click **Clone**. If you forget to power it off, the parent VM will automatically be
   powered off while cloning is in progress.

6. Give the clone a name, an optional description, and select a namespace.

7. Optionally, you can enable the checkbox to start the cloned VM automatically when cloning is complete.

## Validate

From the **Virtual Machines** tab, verify the cloned VM is listed and displays **Running** status.
