# Snapshots & Clones

VMO Manager supports VM snapshots for point-in-time backups and VM cloning for duplicating VMs with new identities.

## Snapshots

A **VirtualMachineSnapshot** captures the disk state of a VM at a point in time. You can restore the VM to that state later or use the snapshot as a source for clones.

### Creating a Snapshot

1. Open the VM detail page.
2. Go to the **Snapshots** tab.
3. Click **Create Snapshot**.
4. Enter a name for the snapshot (must follow Kubernetes naming rules).
5. Confirm. The snapshot is created. CDI and the snapshot controller handle the actual snapshot process.

> **Note:** The VM should be stopped or running with supported storage. Some storage backends require the VM to be stopped for consistent snapshots.

### Restoring from a Snapshot

1. Open the VM detail page and go to the **Snapshots** tab.
2. Find the snapshot you want to restore.
3. Click **Restore**.
4. Confirm. The VM's disks are replaced with the snapshot contents. The VM may need to be restarted.

> **Warning:** Restore overwrites the current disk state. Ensure you have backed up any important data before restoring.

### Snapshot Policies

**VmSnapshotPolicy** defines automatic snapshot schedules. When attached to a VM, the policy creates snapshots on a schedule and prunes old ones based on retention rules.

#### Creating a Snapshot Policy

1. Navigate to **System > Snapshot Policies** (or create from the VM wizard Lifecycle step).
2. Click **Create Snapshot Policy**.
3. Configure:
   - **Name** — Kubernetes resource name.
   - **Display Name** — Human-readable name.
   - **Interval** — How often to create snapshots (e.g., every hour, every 24 hours, every 7 days).
   - **Max Retention** — Maximum number of snapshots to keep per VM. Older snapshots are pruned automatically.
   - **Retention Days** — Optional. Keep snapshots for at least this many days before pruning.
   - **Time Window** — Optional. Restrict snapshot creation to a specific time window (cron expression).
   - **Failure Deadline** — Optional. Time limit for snapshot creation before marking as failed.

4. Save. The policy is created as a `VmSnapshotPolicy` CRD.

#### Deleting a Snapshot Policy

1. Navigate to **System > Snapshot Policies**.
2. Click **Delete** on the policy row, or use the detail drawer's Delete button.
3. Type the policy name to confirm.

If any VMs have this policy attached, the delete is blocked. A dialog shows the
list of attached VMs. Detach the policy from those VMs first (via the VM detail
page or the **Detach** action).

#### Attaching a Policy to a VM

- **At creation** — In the VM creation wizard, Lifecycle step, select the snapshot policy from the dropdown. The policy is attached after the VM is created.
- **From template** — Templates can have a `vmo-manager.spectrocloud.com/snapshot-policy` annotation. VMs created from the template inherit this policy when the "Attach snapshot policy" option is checked.
- **On existing VM** — Use the VM detail page or API to attach the policy to an existing VM.

#### Snapshot Schedules

Snapshot policies use **VmSnapshotSchedule** resources internally. The scheduler runs periodically (e.g., every minute), evaluates which VMs are targeted by policies, and creates `VirtualMachineSnapshot` resources. Snapshots created by policies are labeled `vmo-manager.spectrocloud.com/scheduled: "true"`.

---

## Cloning VMs

Cloning creates a new VM with a copy of the source VM's disks. The clone gets a new name, namespace, and unique identity (e.g., new machine-id when the guest agent or cloud-init handles it).

### Clone Process

1. From the VM list or detail page, click **Clone** (or use the context menu).
2. Enter the new VM name and namespace.
3. Confirm. The system:
   - Creates a new DataVolume that clones from the source VM's root disk.
   - Creates a new VirtualMachine with `runStrategy: Halted` that uses the cloned DataVolume.
   - The clone starts stopped so you can review or adjust it before starting.

### When to Clone

- **Duplicate a configured VM** — Clone a VM that has software installed, configurations applied, etc.
- **Test from a known state** — Clone a VM to test changes without affecting the original.
- **Batch similar VMs** — Clone once, then customize each clone (e.g., hostname, static IP via cloud-init).

> **Tip:** For production workflows, prefer creating VMs from templates with golden images. Cloning is useful for one-off duplicates or when the source VM is a one-off configuration.

---

## Snapshot vs Clone

| Operation | Result |
|-----------|--------|
| **Snapshot** | Creates a point-in-time copy of the VM's disks. The VM continues running. You can restore to the snapshot later or create a new VM from the snapshot. |
| **Clone** | Creates a new VM with cloned disks. The clone is independent. The source VM is unchanged. |

Snapshots are for backup and restore. Clones are for duplicating a VM into a new instance.
