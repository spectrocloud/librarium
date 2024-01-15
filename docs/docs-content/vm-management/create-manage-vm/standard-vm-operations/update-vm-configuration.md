---
sidebar_label: "Update VM Configuration"
title: "Update VM Configuration"
description: "Learn how to add disk storage and network interfaces to a VM using Palette Virtual Machine Orchestrator."
icon: " "
hide_table_of_contents: false
sidebar_position: 10
tags: ["vmo"]
---

You can add storage and additional network interfaces to your virtual machines (VMs).

## Add Disk Storage

KubeVirt allows hot plugging additional storage into a running VM. Both block and file system volume types are supported.

## Prerequisites

- A deployed VM.

## Add a Disk

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click **Clusters** and click on your cluster.

3. Navigate to **Virtual Machines** > **Disks** tabs and click the **Add disk** button.

4. Review the parameters and update as needed. You can specify the disk size, disk type (Disk, CD-ROM, or LUN), and network interface.

   The interface type determines out-of-the-box operating system (OS) support and disk performance. Choose from the following:

   <br />

   - **virtio**: Optimized for best performance, but the operating system may require additional Virtio drivers.

   <br />

   - **sata**: Most operating systems support Serial ATA (SATA). However it offers lower performance.

   <br />

   - **scsi**: A paravirtualized Internet Small Computer System Interface (iSCSI) HDD driver that offers similar functionality to the virtio-block device but with some additional enhancements. In particular, this driver supports adding hundreds of devices and names devices using the standard SCSI device naming scheme.

5. Click **Add** when you are done.

## Validate

The **Disks** tab lists the newly added disk as `PersistingHotplug`.

<br />

## Add Network Interfaces

You can add additional network interfaces to a VM. By default, VMs use the native networking already configured in the pod. Typically, this means using the Bridge option, and your VM has the same IP address as the pod. This approach makes interoperability possible. The VM can integrate with different cases like sidecar containers and pod masquerading.

When using pod masquerading, you choose a CIDR for which VMs are not assigned a private IP, and instead use Network Address Translation (NAT) behind the pod IP.

Multus is a secondary network that uses Multus-CNI. Multus allows you to attach multiple network interfaces to pods in Kubernetes. If you use Multus as your network, ensure that Multus is installed across your cluster and that you have created a default `NetworkAttachmentDefinition` CRD. For more information, refer to the [Multus CNI](/integrations/multus-cni) guide.

## Prerequisites

- A deployed VM.

## Add an Interface

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click **Clusters** and click on your cluster.

3. Navigate to **Virtual Machines > Network Interfaces** and click the **Add network interface** button.

4. Review the parameters and update as needed. Interface types are: **Masquerade**, **Bridge**, and **SR-IOV**.

5. Click **Add** when you are done.

<br />

:::info

Multus allows hot plugging network interfaces only when interfaces use the **virtio** model connected through bridge binding.

:::

## Validate

The **Network Interfaces** tab lists the newly added interface.

# Resources

- [Multus CNI](../../../integrations/multus-cni.md)
