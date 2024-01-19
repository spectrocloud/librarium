---
sidebar_label: "Take a VM Snapshot"
title: "Take a Snapshot of the VM"
description: "Learn how to snapshot a VM using Palette Virtual Machine Orchestrator.."
icon: " "
hide_table_of_contents: false
sidebar_position: 30
tags: ["vmo"]
---

A snapshot is a copy of a virtual machine's (VM) disk file at a given point in time. Snapshots provide a change log for
the virtual disk and are used to restore a VM to a particular point in time.

You can take a snapshot of a VM that is online (**Running** state) or offline (**Stopped** state). When you take a
snapshot of an active VM, the controller checks for the QEMU guest agent in the VM. If the guest agent is present, the
controller freezes the VM file system before it takes the snapshot and unfreezes the file system afterwards. This
provides for crash consistency.

<br />

:::info

For optimal snapshots, we recommend taking snapshots of online VMs that have the QEMU Guest Agent installed. If the
guest agent is not installed, a best effort snapshot is taken.

To check whether the VM has the `qemu-guest-agent` active, look for `AgentConnected` in the **Virtual Machines >
Snapshots** tab. The `vmSnapshot Status` will display if the snapshot was taken online and with or without guest agent
participation.

:::

<br />

You can take a snapshot of an online VM that has hotplugged disks. Only persistent hotplugged disks will be included in
the snapshot. Only disks with a snapshot-supported storage class defined are included in snapshots. If no eligible disk
is found, the **Snapshot** action is not possible.

## Prerequisites

- A deployed VM.

## Take a Snapshot

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click **Clusters** and select your cluster.

3. Navigate to **Virtual Machines > Snapshots**, and click the **Take snapshot** button.

:::warning

In some situations, such as with the Fedora operating system, SELinux on the guest prevents the QEMU guest agent from
quiescing the target filesystem. As a workaround, you can do one of the following:

- Generate an appropriate local security module that permits `qemu-ga` to operate correctly. This is the preferred
  workaround.

- Turn off SELinux **Enforcing** mode before the snapshot by issuing the `setenforce 0` command as the root user.
  Enforcing can be re-enabled after the snapshot using the `setenforce 1` command.

:::

The **Snapshots** tab displays the `vmSnapshot Status` parameter with snapshot phases for the VM: **InProgress**,
**Succeeded**, or **Failed**.

The default time for a snapshot is five minutes. If the snapshot has not successfully completed within that time, it's
status will display as **Failed**. The VM will be unfrozen and the snapshot content will be cleaned up if necessary. The
snapshot will remain in **Failed** state until you delete it. You can change the default snapshot time to meet your
workload requirements.

<br />

:::warning

Snapshots should not be used as a backup method, as running a VM on a snapshot for extended periods of time can cause
instability and data loss.

:::

## Validate

1. From the **Snapshots** tab, verify the `vmSnapshot Status` parameter displays **Succeeded**.

2. If the snapshot status displays as **Failed**, delete the snapshot and take a new one. You may need to change the
   default snapshot time in the VM configuration.
