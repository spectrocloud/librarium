---
sidebar_label: "Locate VM Disks"
title: "Locate VM Disks"
description: "Learn how to locate disks within virtual machines when using Palette's Virtual Machine Orchestrator (VMO)"
hide_table_of_contents: false
sidebar_position: 60
tags: ["vmo"]
---

When managing Virtual Machines (VMs) using Virtual Machine Orchestrator (VMO), you may need to extend the disks on the
VMs. When a VM has multiple disks of the same size, locating the disks on each VM can be difficult. Use this guide to
help you locate disks on Linux and Windows VMs.

## Prerequisites

- A deployed VM in an active cluster that has the Virtual Machine Orchestrator (VMO) pack.

- Access to the VMO cluster.

## Locate Disks

<Tabs groupId="operating-system">

<TabItem label="Linux" value="linux">

1. Open a shell session on the VM. Refer to our [Virtctl](./advanced-topics/access-cluster-with-virtctl.md) guide for
   help with accessing Linux VMs locally.

2. Use the following `kubectl` command to locate the `virt-launcher` pod. This is the pod that contains the VM disks.

   ```sh
   kubectl get pods --all-namespaces --selector kubevirt.io=virt-launcher
   ```

   ```shell hideClipboard title="Example output"
   NAMESPACE    NAME                                   READY   STATUS             RESTARTS   AGE
   my-vms       virt-launcher-vmname-9qz6n             3/3     Running            0          2h31m
   ```

3. Open a shell session in the `virt-launcher` pod. Replace `<namespace>` with the namespace where the pod is located
   and `<vm-name>` with the name of the `virt-launcher` pod.

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

   Use this output to help [Match Disks](#match-disks) on the Palette VMO cluster's **Virtual Machines** > **Disks**
   tab.

</TabItem>

<TabItem label="Windows" value="windows">

1. Connect to the VM and open the Windows Command Prompt (`cmd`) terminal.

2. Use the following `kubectl` command to locate the `virt-launcher` pod. This is the pod that contains the VM disks.

   ```sh
   kubectl get pods --all-namespaces --selector kubevirt.io=virt-launcher
   ```

   ```shell hideClipboard title="Example output"
   NAMESPACE    NAME                                   READY   STATUS             RESTARTS   AGE
   my-vms       virt-launcher-vmname-9qz6n             3/3     Running            0          2h31m
   ```

3. Open a shell session in the `virt-launcher` pod. Replace `<namespace>` with the namespace where the pod is located
   and `<vm-name>` with the name of the `virt-launcher` pod.

   ```sh
   kubectl exec --stdin --tty --namespace <namespace> <vm-name> -- /bin/bash
   ```

4. Issue the following command to list the VM block devices.

   ```sh
   virsh dumpxml 1
   ```

   ```xml hideClipboard title="Example output"
     <devices>
       <emulator>/usr/libexec/qemu-kvm</emulator>
       <disk type='block' device='disk' model='virtio-non-transitional'>
         <driver name='qemu' type='raw' cache='writethrough' error_policy='stop' discard='unmap'/>
         <source dev='/dev/datavolume-os' index='5'/>
         <backingStore/>
         <target dev='vda' bus='virtio'/>
         <boot order='1'>
         <alias name='ua-datavolume-os'/>
         <address type='pci' domain='0x0000' bus='0x07' slot='0x00' function='0x0'/>
       </disk>
       <disk type='block' device='disk' model='virtio-non-transitional'>
         <driver name='qemu' type='raw' cache='writethrough' error_policy='stop' discard='unmap'/>
         <source dev='/dev/disk-blk-2' index='4'/>
         <backingStore/>
         <target dev='vdb' bus='virtio'/>
         <alias name='ua-disk-blk-2'/>
         <address type='pci' domain='0x0000' bus='0x08' slot='0x00' function='0x0'/>
       </disk>
       <disk type='block' device='disk' model='virtio-non-transitional'>
         <driver name='qemu' type='raw' cache='writethrough' error_policy='stop' discard='unmap'/>
         <source dev='/dev/disk-blk-3' index='3'/>
         <backingStore/>
         <target dev='vdc' bus='virtio'/>
         <alias name='ua-disk-blk-3'/>
         <address type='pci' domain='0x0000' bus='0x09' slot='0x00' function='0x0'/>
       </disk>
       <disk type='block' device='disk'>
         <driver name='qemu' type='raw' cache='writethrough' error_policy='stop' discard='unmap'/>
         <source dev='/dev/disk-scsi-4' index='2'/>
         <backingStore/>
         <target dev='sda' bus='scsi'/>
         <alias name='ua-disk-scsi-4'/>
         <address type='drive' controller='0' bus='0' target='0' unit='0'/>
       </disk>
       <disk type='block' device='disk'>
         <driver name='qemu' type='raw' cache='writethrough' error_policy='stop' discard='unmap'/>
         <source dev='/dev/disk-scsi-5' index='1'/>
         <backingStore/>
         <target dev='sdb' bus='scsi'/>
         <alias name='ua-disk-scsi-5'/>
         <address type='drive' controller='0' bus='0' target='0' unit='1'/>
       </disk>
     </devices>
   ```

   - For Virtio devices, every disk is attached to its own PCIe controller. This makes the `bus` parameter the
     identifying factor.
   - For SCSI devices, every disk is attached to the same SCSI controller. This makes the `unit` parameter the
     identifying factor.

5. Enter `exit` to close the session on the pod.

6. On the Windows VM, open a PowerShell terminal and issue the following command.

   ```powershell
   Get-PhysicalDisk | ft DeviceId,FriendlyName,{$_.Size /1GB},PhysicalLocation
   ```

   ```shell hideClipboard title="Example output"
   DeviceId FriendlyName      $_.Size /1GB PhysicalLocation
   -------- ------------      ------------ -------------------------------
   2        Red Hat VirtIO              10 PCI Slot 0 : Bus 9 : Device 0 : Function 0 : Adapter 3 : Port 0 : Target 0 : LUN 0
   1        Red Hat VirtIO              10 PCI Slot 0 : Bus 8 : Device 0 : Function 0 : Adapter 2 : Port 0 : Target 0 : LUN 0
   3        QEMU QEMU HARDDISK          10 PCI Slot 0 : Bus 5 : Device 0 : Function 0 : Adapter 4 : Port 0 : Target 0 : LUN 0
   4        QEMU QEMU HARDDISK          10 PCI Slot 0 : Bus 5 : Device 0 : Function 0 : Adapter 4 : Port 0 : Target 0 : LUN 1
   0        Red Hat VirtIO              80 PCI Slot 0 : Bus 7 : Device 0 : Function 0 : Adapter 1 : Port 0 : Target 0 : LUN 0
   ```

7. Issue the following PowerShell command to get the correct device ID for a specific drive letter. Replace
   `<drive-letters>` with the drives you want to target.

   ```powershell
   Get-Partition -DriveLetter <drive-letters> | get-disk
   ```

   In the following example, drives `E` and `F` are targeted.

   ```powershell hideClipboard title="Example command"
   Get-Partition -DriveLetter E, F | Get-Disk
   ```

   ```powershell hideClipboard title="Example output"
   Number FriendlyName           SerialNumber HealthStatus OperationalStatus TotalSize PartitionStyle
   ------ ------------           ------------ ------------ ---------------- ---------- --------------
   2      Red Hat VirtIO                      Healthy     Online                 10 GB GPT
   3      QEMU QEMU HARDDISK                  Healthy     Online                 10 GB GPT
   ```

Use these outputs to help [Match Disks](#match-disks) on the Palette VMO cluster's **Virtual Machines** > **Disks** tab.

</TabItem>

</Tabs>

## Match Disks

<Tabs groupId="operating-system">

<TabItem label="Linux" value="linux">

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Clusters** and click on your cluster.

3. Navigate to the **Virtual Machines** > **Disks** tab.

4. Use the final output from the [Locate Disks](#locate-disks) section to help match the disk names in Palette.

   For example, if the source for a disk in the terminal output is `/dev/disk-blk-2`, this would match `disk-blk-2` in
   Palette. With this match, you can now determine the target for the disk as displayed in the `Target` column from the
   `virsh domblklist 1` output table.

   ```shell hideClipboard title="Example output" {4}
   Target     Source
   ------------------------------------------------
   vda        /dev/datavolume-os
   vdb        /dev/disk-blk-2
   vdc        /dev/disk-blk-3
   sda        /dev/disk-scsi-4
   sdb        /dev/disk-scsi-5
   ```

</TabItem>

<TabItem label="Windows" value="windows">

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Clusters** and click on your cluster.

3. Navigate to the **Virtual Machines** > **Disks** tab.

4. Use the final outputs from the [Locate Disks](#locate-disks) section to help match the disk names listed in Palette
   to their drive letters. Here are some examples for SCSI and Virtio drives based on the example outputs provided in
   the [Locate Disks](#locate-disks) section.

   <!-- prettier-ignore -->
   <details>
   <summary> Virtio Example </summary>

   1. Palette shows a disk named `disk-blk-3`.
   2. In `virsh dumpxml 1`, the same device appears as `/dev/disk-blk-3`.

      ```xml hideClipboard
      <disk …>
       <source dev='/dev/disk-blk-3'/>
       <target dev='vdc' bus='virtio'/> <!-- Virtio drive, so bus number is the identifiable factor. -->
       <address … bus='0x09' …/>        <!-- Bus number is 0x09 in hexadecimal, which is 9 in decimal. -->
      </disk>
      ```

   3. The `Get-PhysicalDisk` output lists `DeviceId 2` on `Bus 9`, matching the `bus` value from the `virsh dumpxml 1`
      output.
   4. The `Get-Partition -DriveLetter E | get-disk` output displays `Number 2`. This confirms that drive **E** maps to
      `DeviceId 2` and, subsequently, `disk-blk-3` in Palette.

   </details>

   <!-- prettier-ignore -->
   <details>
   <summary> SCSI Example </summary>

   1. Palette shows a disk named `disk-scsi-4`.
   2. In `virsh dumpxml 1`, the same device appears as `/dev/disk-scsi-4`.

      ```xml hideClipboard
      <disk …>
       <source dev='/dev/disk-scsi-4'/>
       <target dev='sda' bus='scsi'/>   <!-- SCSI drive, so unit number is the identifiable factor. -->
       <address … unit='0'/>
      </disk>
      ```

   3. The `Get-PhysicalDisk` output lists `DeviceId 3` on `LUN 0`, matching the `unit` value from the `virsh dumpxml 1`
      output.
   4. The `Get-Partition -DriveLetter F | get-disk` output displays `Number 3`. This confirms that drive **F** maps to
      `DeviceId 3` and, subsequently, `disk-scsi-4` in Palette.

   </details>

   The following table demonstrates how the information is linked together for these examples.

   | Palette Disk Name | Source from `virsh dumpxml 1` | Identifier (Bus/LUN)  | `Get-PhysicalDisk` → `DeviceId` | `Get-Partition` → `Number` | Drive |
   | ----------------- | ----------------------------- | --------------------- | ------------------------------- | -------------------------- | ----- |
   | `disk-blk-3`    | `/dev/disk-blk-3`             | `bus='0x09'`, `Bus 9` | `2`                             | `2`                        | `E` |
   | `disk-scsi-4`   | `/dev/disk-scsi-4`            | `unit='0'`, `LUN 0`   | `3`                             | `3`                        | `F` |

</TabItem>

</Tabs>
