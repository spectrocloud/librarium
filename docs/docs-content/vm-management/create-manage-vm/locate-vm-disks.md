---
sidebar_label: "Locate VM Disks"
title: "Locate VM Disks"
description: "Learn methods to locate disks within VMs using Palette's Virtual Machine Orchestrator"
hide_table_of_contents: false
tags: ["vmo"]
---

# Locate VM Disks

When managing virtual machines in VMO, you may also be responsible for extending disks in virtual machines. When a VM has multiple disks of the same size, it can be a challenge to figure out which disk is which. The following procedures help you locate the disks for Linux and Windows.

## Linux

The best way to start is to shell into the `virt-launcher` pod of the VM in question and run `virsh domblklist 1`

![virsh-domblklist](/locate-vm-disks-images/virsh-domblklist.webp)

This will give you the target names inside the guest and the disk names as defined in the Disks section of the VM in the GUI. For Linux, this is all you need.

## Windows
On Windows, you need to go 1 step deeper. Start the same way be launching a shell into the `virt-launcher` pod of the VM in question. The run `virsh dumpxml 1` to get the full PCI info:

![virsh-dumpxml](/locate-vm-disks-images/virsh-dumpxml.webp)

- For virtio devices, every disk is attached to its own PCIe controller. This makes the bus parameter the identifying factor.
- For scsi devices, every disk is attached to the same SCSI controller. This makes the bus parameter the identifying factor.

Next you need to log into Windows itself and run the following powershell command:
`Get-PhysicalDisk | ft DeviceId,FriendlyName,{$_.Size /1GB},PhysicalLocation`

![ps-get-partition](/locate-vm-disks-images/ps-get-partition.webp)

Finally, use `Get-Partition -DriveLetter <drive> | Get-Disk` to get the correct device ID for a specific driveletter:

![ps-get-physicaldisk](/locate-vm-disks-images/ps-get-physicaldisk.webp)

Here you can see drive F: is disk number 3, which is the SCSI drive in LUN 0. We can find this as `/dev/disk-scsi-4` in
the dumpxml output table. This matches to the disk named `disk-scsi-4` in the VMO GUI.

For driveletter E:, we get disk number 2, which is the Virtio drive on Bus 9, which is `/dev/disk-blk-3` in the dumpxml
output table and `disk-scsi-3` in the VMO GUI.
