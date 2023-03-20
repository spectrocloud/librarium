---
title: "Take a VM Snapshot"
metaTitle: "Take a Snapshot of the VM"
metaDescription: "Learn how to"
icon: " "
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

# Overview

A snapshot is a copy of a virtual machine's (VM) disk file at a given point in time. Snapshots provide a change log for the virtual disk and are used to restore a VM to a particular point in time. Snapshots should not be used as a backup method, as running a VM on a snapshot for extended periods of time can cause instability and data loss.

You can take a snapshot of a VM that is online (**Running** state) or offline (**Stopped** state). When you take a snapshot of a running VM, the controller checks for the QEMU guest agent in the VM. If the guest agent is present, the controller freezes the VM file system before it takes the snapshot and unfreezes the file system afterwards. This provides for crash consistency.

For optimal snapshots, we recommend taking snapshots of online VMs that have the QEMU Guest Agent installed. If the guest agent is not installed, a best effort snapshot is taken.

<br />

<InfoBox>

To check whether the VM has the ``qemu-guest-agent`` running, look for ``AgentConnected`` in **Virtual Machines > Snapshots** tab. The ``vmSnapshot Status`` will show if the snapshot was taken online and with or without guest agent participation.

</InfoBox>

<br />

You can take a snapshot of an online VM that has hotplugged disks. Only persistent hotplugged disks will be included in the snapshot. Only disks with a snapshot-supported storage class defined are included in snapshots. If no eligible disk is found, the snapshot action is not possible.

Snapshots are available from the **Snapshots** tab when you display a VM.

You can view the snapshot phase for a VM from the **Snapshots** tab. The ``vmSnapshot Status`` shows the following statuses: **InProgress**, **Succeeded**, or **Failed**. 

The default time for a snapshot is five minutes. If the snapshot has not succeessfully completed within that time, it's status will display **Failed**. The VM will be unfrozen and the snapshot content will be cleaned up if necessary. The snapshot will remain in Failed state until you delete it. You can change the default snapshot time to meet your workload requirements.






