---
sidebar_label: "Locate VM Disks"
title: "Locate VM Disks"
description: "Learn how to locate disks within virtual machines when using Palette's Virtual Machine Orchestrator (VMO)"
hide_table_of_contents: false
sidebar_position: 60
tags: ["vmo"]
---

When managing virtual machines (VMs) using Virtual Machine Orchestrator (VMO), you may need to extend the disks on the
VMs. When a VM has multiple disks of the same size, locating the disks on each VM can be difficult. The following
sections help you locate disks on VMs running Linux and Windows operating systems.

## Prerequisites

- A deployed VM in an active cluster that has the Virtual Machine Orchestrator (VMO) pack.

- Access to the VMO cluster.

## Locate Disks

<Tabs groupId="operating-system">

<TabItem label="Linux" value="linux">

1. Start a shell connection on the VM. Refer to our [Virtctl](./advanced-topics/access-cluster-with-virtctl.md) guide
   for help with accessing VMs.

2. You need to access the `virt-launcher` pod to be able to list the VM disks. Use the following `kubectl` command to
   find the pod.

   ```sh
   kubectl get pods --all-namespaces --selector kubevirt.io=virt-launcher
   ```

   ```shell hideClipboard title="Example output"
   NAMESPACE    NAME                                   READY   STATUS             RESTARTS   AGE
   my-vms       virt-launcher-vmname-9qz6n             3/3     Running            0          2h31m
   ```

3. Open a shell inside the `virt-launcher` pod. Replace `<namespace>` with the namespace where the pod is located, and
   `vm-name` with the name of the `virt-launcher` pod.

   ```sh
   kubectl exec --stdin --tty --namespace <namespace> <vm-name> -- /bin/bash
   ```

4. Issue the following command to list the VM block devices.

   ```sh
   virsh domblklist 1
   ```

   ```shell hideClipboard title="Example output"
   Target     Source
   ------------------------------------------------
   vda        /dev/datavolume-os
   vdb        /dev/disk-blk-2
   vdc        /dev/disk-blk-3
   sda        /dev/disk-scsi-4
   sdb        /dev/disk-scsi-5
   ```

   You will use this output during [validation](#validate) to match the disks found on the Palette VMO cluster's
   **Virtual Machines** > **Disks** tab.

</TabItem>

<TabItem label="Windows" value="windows">

On Windows, you need to go 1 step deeper. Start the same way be launching a shell into the `virt-launcher` pod of the VM
in question. The run `virsh dumpxml 1` to get the full PCI info

![virsh-dumpxml](/locate-vm-disks-images/virsh-dumpxml.webp)

- For virtio devices, every disk is attached to its own PCIe controller. This makes the bus parameter the identifying
  factor.
- For scsi devices, every disk is attached to the same SCSI controller. This makes the unit parameter the identifying
  factor.

Next you need to log into Windows itself and run the following powershell command
`Get-PhysicalDisk | ft DeviceId,FriendlyName,{$_.Size /1GB},PhysicalLocation`

![ps-get-partition](/locate-vm-disks-images/ps-get-partition.webp)

Finally, use `Get-Partition -DriveLetter <drive> | Get-Disk` to get the correct device ID for a specific drive letter

![ps-get-physicaldisk](/locate-vm-disks-images/ps-get-physicaldisk.webp)

Here drive F: is disk number 3, which is the SCSI drive in LUN 0. We can find this as `/dev/disk-scsi-4` in the dumpxml
output table. This matches to the disk named `disk-scsi-4` in the VMO GUI.

For drive E:, we get disk number 2, which is the Virtio drive on Bus 9, which is `/dev/disk-blk-3` in the dumpxml output
table and `disk-scsi-3` in the VMO GUI.

</TabItem>

</Tabs>

## Validate

<Tabs groupId="operating-system">

<TabItem label="Linux" value="linux">

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click **Clusters** and click on your cluster.

3. Navigate to the **Virtual Machines** > **Disks** tab.

4. Use the final output from the [Locate Disks](#locate-disks) steps to help match the disk names in Palette. For
   example, if the source for a disk in the terminal output is `/dev/disk-blk-2`, this would match `disk-blk-2` in
   Palette. With this match, you can now determine the target for the disk as displayed in the `Target` column.

</TabItem>

<TabItem label="Windows" value="windows">

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click **Clusters** and click on your cluster.

3. Navigate to the **Virtual Machines** > **Disks** tab.

4. Use the final output from the [Locate Disks](#locate-disks) steps to help match the disk names listed in Palette.
   Here are some examples based on the example outputs that were provided.

   - Drive `F:` is disk number `3`, which is the SCSI drive in `LUN 0`. We can find this as `/dev/disk-scsi-4` in the
     `virsh dumpxml 1` output table. This matches to the disk named `disk-scsi-4` in Palette.

   - For drive `E:`, we get disk number `2`, which is the Virtio drive on `Bus 9`, which is `/dev/disk-blk-3` in the
     `virsh dumpxml 1` output table and `disk-scsi-3` in Palette.

</TabItem>

</Tabs>
