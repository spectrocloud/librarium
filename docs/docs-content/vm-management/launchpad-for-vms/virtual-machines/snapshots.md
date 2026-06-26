---
sidebar_label: "Manage Snapshots"
title: "Manage Snapshots"
description: "Learn about how to take, manage, and restore snapshots in Launchpad for VMs"
icon: " "
hide_table_of_contents: false
sidebar_position: 8
tags: ["vmo", "vm launchpad", "snapshots"]
---

Launchpad supports VM snapshots for point-in-time backups and VM cloning for duplicating VMs with new identities.

## Snapshots

A **VirtualMachineSnapshot** captures the disk state of a VM at a specific moment. You can restore the VM to that state
later or use the snapshot as a source for clones.

### Create a Snapshot

1. Navigate to **Workloads** > **Virtual Machines**, and select your VM to open the VM detail page.
2. Select the **Snapshots** tab.
3. Select **Take Snapshot**.
4. Enter a name for the snapshot or leave blank to use the auto-generated name.
5. Select **Create**. CDI and the snapshot controller handle the actual snapshot process.

:::info

If your storage backend supports online snapshots, you can leave the VM running. Otherwise, stop the VM first to ensure
the snapshot is consistent.

:::

### Restore from a Snapshot

1. Navigate to **Workloads** > **Virtual Machines**, and select your VM to open the VM detail page.
2. Select the **Snapshots** tab.
3. Find the snapshot you want to restore.
4. Select **Restore**. The VM must be stopped before restoring from a snapshot.
5. Confirm. The VM's disks are replaced with the snapshot contents. The VM may need to be restarted.

:::warning

Restore overwrites the current disk state. Ensure you have backed up any important data before restoring.

:::

### Snapshot Policies

**Snapshot Policy** defines automatic snapshot schedules. When attached to a VM, the policy creates snapshots on a
schedule and prunes old ones based on retention rules.

#### Create a Snapshot Policy

1. Navigate to **Workloads** > **Snapshot Policies**, or create a policy from the [VM creation wizard](./creating.md)
   Lifecycle step.

2. Select **Create Snapshot Policy**.

3. Configure the following fields. Fields marked with an asterisk (\*) are required.

   | **Field**         | **Description**                                                                                                                                                    |
   | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | **Name**          | The Kubernetes resource name for the policy, such as `daily-backup`. Required.                                                                                     |
   | **Display Name**  | The user-facing name for the policy, such as `Daily Backup`.                                                                                                       |
   | **Description**   | An optional description for the policy.                                                                                                                            |
   | **Interval**      | How often to create snapshots. Select **Every hour**, **Every 4 hours**, **Every 6 hours**, **Every 12 hours**, **Every 24 hours**, or **Every 7 days**. Required. |
   | **Max Retention** | The number of snapshots to keep per VM. Older snapshots are pruned automatically. Required.                                                                        |
   | **Enabled**       | Enable or disable automatic snapshots for the policy. Enabled by default.                                                                                          |

4. _(Optional)_ Under **Advanced Options**, configure the following fields.

   | **Field**             | **Description**                                                                                                                                                      |
   | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Failure Deadline**  | How long a snapshot can run before it is marked as failed. Select **None (no deadline)**, **5 minutes**, **15 minutes**, **30 minutes**, **1 hour**, or **2 hours**. |
   | **Retention Days**    | The number of days to keep snapshots. Enter `0` to use the **Max Retention** count only.                                                                             |
   | **Time Window (UTC)** | Restrict snapshots to a preferred time-of-day window, in UTC. Select **Any time** or a preset window, such as **00:00 - 04:00 UTC**.                                 |
   | **Snapshot Labels**   | Select **Add label** to apply custom key-value labels to the snapshot resources the policy creates.                                                                  |

5. Select **Create**. The policy is created as a `VmSnapshotPolicy` resource.

#### Delete a Snapshot Policy

1. Navigate to **Workloads** > **Snapshot Policies**.
2. Select **Delete** on the policy row, or use the detail drawer's Delete button.
3. Type the policy name to confirm.

If any VMs have this policy attached, the delete is blocked. A dialog shows the list of attached VMs. Detach the policy
from those VMs first (via the VM detail page or the **Detach** action).

#### Attach a Policy to a VM

| **Method**         | **Description**                                                                                                                                                                           |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **At creation**    | In the VM creation wizard Lifecycle step, select the snapshot policy from the drop-down menu. The policy is attached after the VM is created.                                             |
| **From template**  | Templates can have a `vmo-manager.spectrocloud.com/snapshot-policy` annotation. VMs created from the template inherit this policy when the **Attach snapshot policy** option is selected. |
| **On existing VM** | Use the VM detail page or API to attach the policy to an existing VM.                                                                                                                     |

#### Snapshot Schedules

Snapshot policies use `VmSnapshotSchedule` resources internally. The scheduler runs periodically, such as every minute,
evaluates which VMs are targeted by policies, and creates `VirtualMachineSnapshot` resources. Snapshots created by
policies are labeled `vmo-manager.spectrocloud.com/scheduled: "true"`.

## Clone VMs

Cloning creates a new VM with a copy of the source VM's disks. The clone gets a new name and unique identity, such as a
new machine ID when the guest agent or cloud-init handles it.

### Clone Process

1. Navigate to **Workloads** > **Virtual Machines**, and select **Clone** or use the context menu.

2. In the **Clone Virtual Machine** dialog, enter a **Clone Name**.

3. Select a **Clone Type**.

   | **Clone Type**  | **Description**                                                  |
   | --------------- | ---------------------------------------------------------------- |
   | **Light Clone** | Reuses the original image source. Faster and uses less storage.  |
   | **Full Clone**  | Copies all disk data. The clone is independent of the source VM. |

4. (Optional) Select **Start VirtualMachine once created** to power on the clone after it is created. Otherwise, the
   clone starts stopped so you can review or adjust it first.

5. Select **Clone**.

### When to Clone

| **Use case**                  | **Description**                                                                                       |
| ----------------------------- | ----------------------------------------------------------------------------------------------------- |
| **Duplicate a configured VM** | Clone a VM that has software installed or configurations applied.                                     |
| **Test from a known state**   | Clone a VM to test changes without affecting the original.                                            |
| **Batch similar VMs**         | Clone once, then customize each clone with settings such as hostname or static IP through cloud-init. |

:::tip

For production workflows, prefer creating VMs from [templates](./templates.md) with [golden images](./golden-images.md).
Cloning is useful for one-off duplicates or when the source VM is a one-off configuration.

:::

## Snapshot vs Clone

| Operation    | Result                                                                                                                                                |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Snapshot** | Creates a point-in-time copy of the VM's disks. The VM continues running. You can restore to the snapshot later or create a new VM from the snapshot. |
| **Clone**    | Creates a new VM with cloned disks. The clone is independent. The source VM is unchanged.                                                             |

Snapshots are for backup and restore. Clones are for duplicating a VM into a new instance.
