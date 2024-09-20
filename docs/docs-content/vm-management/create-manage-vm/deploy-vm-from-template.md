---
sidebar_label: "Deploy VM From a Template"
title: "Deploy VM From a Template"
description: "Learn how to deploy a VM from a template using Palette Virtual Machine Orchestrator"
hide_table_of_contents: false
sidebar_position: 0
tags: ["vmo"]
---

You can deploy a Virtual Machine (VM) using Palette's out-of-the-box templates or from templates that your
organization's administrator provides.

## Prerequisites

- An active cluster with the Virtual Machine Orchestrator (VMO) pack. Review
  [Create a VMO Profile](../create-vmo-profile.md) to configure the dashboard.

  - If this is an Edge cluster with VMs as Edge hosts, such as a VM in VMware vCenter, the VM Edge host must support
    hardware-assisted virtualization to the guest Operating System (OS).

- Outbound internet connectivity for port 443 is allowed so that you and your applications can connect with the Spectro
  Cloud reverse proxy.

- Users or groups must be mapped to a Virtual Machine Role-Based Access Control (RBAC) role. You can create a custom
  role through a manifest and use Palette's RoleBinding feature to associate users and groups with the role. Refer to
  the [Create Role Bindings](../../clusters/cluster-management/cluster-rbac.md#create-role-bindings) guide to learn
  more.

- A namespace for VMs. Although you can deploy VMs from the default namespace, we recommend creating at least one
  namespace dedicated to VMs as a way to organize and manage them. To learn how to create a namespace, check out
  [Create a Namespace](../../clusters/cluster-management/namespace-management.md#create-a-namespace).

## Deploy VM from a Template

These steps will help guide you to deploy a VM from an out-of-the-box VM template.

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click **Clusters** and select the cluster in which you deploy VMs.

3. Click the **Virtual Machines** tab.

4. Select the appropriate namespace from the **drop-down Menu**.

5. From the **Virtual Machines** tab that appears, click **New Virtual Machine**.

6. Click the **New Virtual Machine** button. Available templates are displayed based on supported OS.

7. You can deploy from a template or create an empty VM as follows:

   - To deploy from a template, select one of the VM templates. These can be Palette's out-of-the-box templates or
     templates that you or your administrator created.

   - To create an empty VM, close the templates choice page and install the OS using a different method.

8. Give the VM a name and specify memory and CPUs.

   :::info

   You can change the memory and CPU values after the VM is deployed. By default, the hotplug feature is enabled for
   both [memory](https://kubevirt.io/user-guide/compute/memory_hotplug/#memory-hotplug-in-action) and
   [CPU](https://kubevirt.io/user-guide/compute/cpu_hotplug/), allowing changes to be applied without rebooting the VM
   through live migration.

   :::

9. Optionally, you can enable the checkbox to start the VM automatically after creation.

10. Click the **Next** button, which displays the YAML file. Tooltip help is available when you hover over lines in the
    file.

11. Review the YAML file and click the **Next** button when you are done.

12. Click **Create Virtual Machine**.

VM status will display as **Starting** for several minutes while the required resources are built and the image is
pulled from the registry. If you did not enable the checkbox to start the VM automatically, VM status displays as
**Stopped** until the VM is fully deployed.

:::warning

VMs do not self-heal. If a VM is running on a node that fails, the VM is re-scheduled to a different node. Similar to
live migration, to provide high availability, the disks should be `ReadWriteMany` so that they can be mounted on other
nodes when the VM is restarting.

:::

## Validate

1. Log in to [Palette](https://console.spectroloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Select the host cluster that contains your VMs to view its details page.

4. Click on the **Virtual Machines** tab.

5. Review the list of VMs and ensure the new VM is displayed and has the status **Running**.

## Next Steps

Try installing your applications. If you did not install the QEMU guest agent as part of the VM deployment, you can
install it now. The guest agent displays additional details in the **Virtual Machines** > **Details** tab.

You can update the VM configuration from the VM console or from tabs when you click on the VM. Learn about updates you
can make in the [Update VM Configuration](./update-vm-configuration.md) guide.
