---
title: "Take a VM Snapshot"
metaTitle: "Take a Snapshot of the VM"
metaDescription: "Learn how to"
icon: "users"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

# Overview

A snapshot is a copy of the virtual machine's disk file at a given point in time. Snapshots provide a change log for the virtual disk and are used to restore a VM to a particular point in time. Snapshots should not be considered as a backup. Running a virtual machine on a snapshot for extended periods of time can cause instability and data loss.

Snapshotting a virtualMachine is supported for online and offline VMs. When snapshotting a running VM, the controller will check for qemu guest agent in the VM. If the agent exists it will freeze the VM filesystems before taking the snapshot and unfreeze after the snapshot (for crash consistency).

We recommend taking online snapshots with the guest agent for a better snapshot, if not present a best effort snapshot will be taken.

Note: To check whether the vm has a ‘qemu-guest-agent’ running, check for 'AgentConnected' in the VM status.

There will be an indication in the vmSnapshot status if the snapshot was taken online and with or without guest agent participation.

Note: online snapshot with hotplugged disks is supported, only persistent hotplugged disks will be included in the snapshot.

Only disks with a snapshot-supported storage class defined are included in snapshots. If none eligible disk is found, the snapshot action will not be possible.

Snapshots are available from the Snapshots tab when displaying a VM.

You can check the vmSnapshot phase in the vmSnapshot status. It can be one of the following: 

- InProgress
- Succeeded 
- Failed

Note: the vmSnapshot has a default deadline of 5 minutes. If the vmSnapshot has not succeessfully completed before the deadline, it will be marked as Failed. The VM will be unfrozen and the created snapshot content will be cleaned up if necessary. The vmSnapshot object will remain in Failed state until deleted by the user. If required, the default 5 minutes deadline can be tweaked to be more relevant to a specific workload.Clone VM
Cloning a virtual machine creates a virtual machine that is a copy of the original. The new virtual machine is configured with the same virtual hardware, installed software, and other properties that were configured for the original virtual machine.

