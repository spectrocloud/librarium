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

KubeVirt allows hot plugging additional storage into an active VM. Both block and file system volume types are
supported. Disks are "hot plugged" into your VMs, meaning that you do not need to power off the VM in order to add
disks.

### Prerequisites

- A deployed VM in an active cluster that has the Virtual Machine Orchestrator (VMO) pack.

### Add a Disk

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click **Clusters** and click on your cluster.

3. Navigate to **Virtual Machines** and select the VM you want to configure. Select **Configuration** > **Storage** tabs
   and click the **Add disk** button. Select the **Empty disk (blank)** option.

4. Review the parameters and update as needed. You can specify the disk size, disk type (**Disk**, **CD-ROM**, or
   **LUN**), and network interface.

   The interface type determines out-of-the-box operating system (OS) support and disk performance. Choose from the
   following.

   | Interface type | Description                                                                                                                                                                                                                                                                                                                                        |
   | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **VirtIO**     | Optimized for best performance, but the operating system may require additional Virtio drivers.                                                                                                                                                                                                                                                    |
   | **SATA**       | Most operating systems support Serial Advanced Technology Attachment (SATA). However, it offers lower performance.                                                                                                                                                                                                                                 |
   | **SCSI**       | A paravirtualized Internet Small Computer System Interface (iSCSI) hard disk drive (HDD) driver that offers similar functionality to the `virtio-block` device but with some additional enhancements. In particular, this driver supports attaching hundreds of devices and uses the standard SCSI device naming scheme for device identification. |

5. Next, specify the access mode for your disk.

   | Access mode           | Description                                                                  |
   | --------------------- | ---------------------------------------------------------------------------- |
   | Read-Write-Once (RWO) | Ensures that only one client can write to the volume at any given time.      |
   | Read-Write-Many (RWX) | Allows multiple clients to read from and write to the volume simultaneously. |
   | Read-Only-Many (ROX)  | Permits multiple clients to read data only.                                  |

6. Specify the volume mode for your disk.

   | Volume mode | Description                                                                                                                          |
   | ----------- | ------------------------------------------------------------------------------------------------------------------------------------ |
   | Filesystem  | The volume is formatted with a filesystem. The OS manages the volume using a directory structure, where files are stored in folders. |
   | Block       | The volume is presented as a raw block device. The OS manages the volume at the block level, without any filesystem structure.       |

7. If you'd like to allocate storage to the VM right away, check **Enable preallocation**. Otherwise, the storage is
   allocated to your VM as data is written to the storage.

8. Expand the **Advanced settings** menu to display two more configuration settings.

   - **Share this disk between multiple VirtualMachines** allows multiple VMs to use this disk.
   - If you enable disk sharing, the **Set SCSI reservation for disk** option enforces virtual disk locking at the SCSI
     level, ensuring that only one VM can write to the disk at a time. This option is only available for disks
     configured with the LUN type and SCSI interface.

   :::warning

   When enabling **Share this disk between multiple VirtualMachines**, you must set the `cache: none` configuration on
   your shareable disk to ensure that KubeVirt provides safe access across multiple VMs. VMs will fail to boot if this
   configuration is not set.

   Select the **YAML** tab and provide the following configuration for your VM.

   ```yaml {8}
   template:
     spec:
       domain:
         devices:
           disks:
             - name: shareable-disk
               shareable: true
               cache: none
   ```

   :::

9. After completing the configuration, click **Add**.

### Validate

The **Disks** tab lists the newly added disk as `PersistingHotplug`.

## Add Network Interfaces

You can add additional network interfaces to a VM. By default, VMs use the native networking already configured in the
pod. Typically, this means using the Bridge option, and your VM has the same IP address as the pod. This approach makes
interoperability possible. The VM can integrate with different cases like sidecar containers and pod masquerading.

When using pod masquerading, you choose a CIDR for which VMs are not assigned a private IP, and instead use Network
Address Translation (NAT) behind the pod IP.

<!-- prettier-ignore-start -->

Multus is a secondary network that uses Multus-CNI. Multus allows you to attach multiple network interfaces to pods in
Kubernetes. If you use Multus as your network, ensure that Multus is installed across your cluster and that you have
created a default `NetworkAttachmentDefinition` CRD. For more information, refer to the <VersionedLink text="Multus CNI" url="/integrations/packs/?pack=cni-multus" />  pack.

<!-- prettier-ignore-end -->

### Prerequisites

- A deployed VM in an active cluster that has the Virtual Machine Orchestrator (VMO) pack.

- The VM must be in the **Stopped** state.

### Add an Interface

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click **Clusters** and click on your cluster.

3. Navigate to **Virtual Machines > Network Interfaces** and click the **Add network interface** button.

4. Review the parameters and update as needed. Interface types are: **Masquerade**, **Bridge**, and **SR-IOV**.

5. Click **Add** when you are done.

:::info

Multus allows hot plugging network interfaces only when interfaces use the **Virtio** model connected through bridge
binding.

:::

### Validate

The **Network Interfaces** tab lists the newly added interface.

## Resources

<!-- prettier-ignore-start -->

- <VersionedLink text="Multus CNI" url="/integrations/packs/?pack=cni-multus" />

<!-- prettier-ignore-end -->
