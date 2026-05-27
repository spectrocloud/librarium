# Managing VMs

This guide covers the VM list page, VM actions, the VM detail page, and day-to-day operations.

## VM List Page

Navigate to **Workloads > Virtual Machines** (`/vms`) to see all virtual machines.

### Default View

- **All Namespaces** — The list defaults to showing VMs across all namespaces you can access. For users with cluster-wide access (ClusterRoleBinding or VMO IAM role mapping), this means all managed namespaces. For OIDC users with namespace-scoped RoleBindings (granted via **Settings > Access Management**), only VMs in their permitted namespaces appear. Use the namespace dropdown to filter further by a specific namespace or to see per-namespace counts.
- **Status Indicators** — Each VM shows its status: Running, Stopped, Pending, Failed, or other KubeVirt states. The status reflects the `VirtualMachineInstance` (VMI) when the VM is running.
- **Columns** — Name, namespace, status, node (when running), CPU, memory, run strategy, OS type, and other metadata. Columns can be shown or hidden via the column visibility control.

### Filtering and Sorting

- Use the filter bar to filter by status, namespace, node, run strategy, memory, OS type, and OS flavor.
- Click column headers to sort. The table supports multi-column sort in some views.
- Use the search box to find VMs by name or other attributes.

### Actions from the List

From the VM list, you can:

- **Start** — Start a stopped VM.
- **Stop** — Gracefully stop a running VM.
- **Restart** — Restart a running VM.
- **Delete** — Delete the VM and its owned DataVolumes (with confirmation).
- **Open Console** — Open the VNC console in a new tab (when the VM is running).
- **Clone** — Create a copy of the VM with a new name and namespace.
- **Create Template** — Create a VmTemplate from the VM.

Right-click a row for a context menu with additional actions.

---

## VM Actions

### Start, Stop, Restart

- **Start** — Starts the VM. For VMs with `runStrategy: Manual` or `runStrategy: Halted`, this creates or resumes the VMI.
- **Stop** — Stops the VM. Sends a graceful shutdown signal to the guest. Falls back to a runStrategy patch if the stop subresource is unavailable.
- **Restart** — Stops and then starts the VM. The guest receives a reboot signal when the QEMU guest agent is installed.

> **Note:** Stop and restart require the VM to be running. For VMs with `runStrategy: Always`, stop temporarily sets the strategy to Halted.

### Pause and Unpause

- **Pause** — Pauses the VM. The guest is suspended; CPU and memory state are preserved in memory.
- **Unpause** — Resumes a paused VM.

Pause/unpause are useful for short-term suspension without writing to disk.

### Live Migration

- **Migrate** — Live-migrates the VM to another node. The VM continues running during migration with minimal downtime. Requires the cluster to have live migration enabled (KubeVirt feature gate) and appropriate storage (e.g., shared storage or storage migration support).

Migration status can be viewed in the VM detail page or via the migrations API.

### Hot-Plug Volumes

- **Add Volume** — Attach a new volume to a running VM. The volume must be a DataVolume or PVC. The disk appears in the guest after attachment.
- **Remove Volume** — Detach a volume from a running VM. The volume must support hot-unplug. Ensure the guest has unmounted the disk before removing.

Hot-plug requires the `HotplugVolumes` feature gate and appropriate storage configuration.

---

## VNC Console

The VNC console provides a browser-based remote desktop to the VM.

### Opening the Console

1. Ensure the VM is running.
2. From the VM list or detail page, click **Open VNC Console** or use the Console tab.
3. A new tab opens with a noVNC-based viewer. You can interact with the VM as if at its keyboard.

### Console Features

- **Clipboard Support** — Copy and paste between your machine and the guest when the QEMU guest agent is installed and running.
- **Full Screen** — Use the full-screen control for a larger view.
- **Reconnect** — If the connection drops, refresh or reopen the console to reconnect.

> **Note:** The VNC console requires the VM to be running. If the VM is stopped, start it first from the Overview tab or VM list.

---

## VM Detail Page

Click a VM name to open its detail page. The page has several tabs.

### Overview Tab

- **Status** — Current VM and VMI status.
- **Compute** — CPU, memory, run strategy, eviction strategy.
- **Storage** — Root disk and additional disks with size and StorageClass.
- **Network** — Interfaces and their types (pod network, Multus NAD).
- **Node** — The node where the VMI is running (when running).
- **Actions** — Start, stop, restart, pause, unpause, migrate, clone, delete, open console.

### YAML Tab

View and edit the raw `VirtualMachine` manifest. Use **Patch** for targeted changes or **Full Update** to replace the entire spec. Changes are applied immediately to the cluster.

> **Warning:** Editing YAML directly can lead to invalid or inconsistent state. Prefer the Edit form when possible.

### Snapshots Tab

- **Create Snapshot** — Create a `VirtualMachineSnapshot` of the VM. Snapshots capture the disk state at a point in time.
- **Restore** — Restore the VM from a snapshot. This replaces the current disk state with the snapshot contents.
- **List** — View existing snapshots, their status, and creation time.

### Metrics Tab

When metrics are configured (OTel collector, Victoria Metrics), the Metrics tab shows CPU and memory utilization over time. Dashboard widgets can be embedded for custom views.

### Console Tab

Quick access to the VNC console. Same as opening the console from the Overview tab.

---

## Editing a VM

### Patch (Targeted Edit)

Use patch for small, targeted changes (e.g., CPU cores, memory, run strategy). The Edit form in the Overview tab or YAML tab supports JSON patch operations. Only the modified fields are sent to the API.

### Full Update

Use full update when making broad changes. The entire `VirtualMachine` spec is replaced. Ensure you do not remove required fields (e.g., disks, networks).

### Edit Form Sections

The VM edit form groups settings into sections:

- **Compute** — CPU, memory, run strategy, eviction strategy, resource requests/limits.
- **Scheduling & Lifecycle** — Node selector, tolerations, priority class, termination grace period.
- **Hardware** — Firmware, devices, features (when available in the form).

Changes are applied when you save. The VM may need to be restarted for some changes to take effect (e.g., CPU cores, memory, firmware).

### CPU Socket Changes (Directional Behavior)

CPU **sockets** are handled differently from CPU cores and threads:

- **Increasing sockets on a running VM** — VMO Manager saves the spec and then
  triggers a **live migration** automatically. The VM keeps running; no restart
  is required. This works when KubeVirt's CPU hot-plug prerequisites are met
  (a `maxSockets` value at least as large as the new socket count, which VMO
  Manager ensures on save).
- **Decreasing sockets** — VMO Manager saves the spec, but the new socket count
  only takes effect after a **restart**. The UI surfaces a banner and a toast
  reminding you to restart.
- **Unchanged sockets** — Saves apply the patch with no side effects. Other
  compute-related edits (cores, threads, memory, firmware) still follow the
  standard "restart required" rule.

> The live-migration-on-increase flow depends on the cluster supporting
> KubeVirt live migration (feature gate enabled, compatible storage, and the
> VM's `evictionStrategy` allowing migration). If live migration fails after
> the patch succeeds, the VM keeps the new socket count in its spec — you can
> retry the migration with the **Migrate** action or restart the VM.
>
> **First-increase caveat:** KubeVirt only hot-plugs CPU sockets when
> `cpu.maxSockets` was present on the VirtualMachineInstance when it started.
> VMs created before VMO Manager started injecting this default will fail the
> auto-migration on their first socket increase, with a toast pointing at
> "Migrate". Restart the VM once so the new `maxSockets` takes effect on the
> running instance; subsequent socket increases will live-migrate as expected.
> In-UI edits also require the `vmo:vm:operate` permission to trigger the
> auto-migration — users with Update but not Operate will see a restart
> prompt instead.

---

## Deleting a VM

1. Click **Delete** from the VM list or detail page.
2. Confirm the deletion. The dialog may warn about owned resources (e.g., DataVolumes).
3. The VM and its owned DataVolumes are deleted. DataVolumes that are not owned by the VM (e.g., shared golden images) are not deleted.

> **Warning:** Deletion is irreversible. Ensure you have backups or snapshots if the data is important.

---

## Guest Agent Diagnostics

When the QEMU guest agent is installed and running in the guest, VMO Manager can query guest identity and other diagnostics.

### Diagnose Endpoint

The **Diagnose** action (or `/api/v1/vm/diagnose`) returns:

- **Hostname** — Guest hostname.
- **OS** — Guest operating system info.
- **Agent Version** — QEMU guest agent version when available.

This helps verify that the guest agent is working and that the VM is correctly configured.

### When the Guest Agent Is Missing

If the guest agent is not installed:

- VNC clipboard may not work.
- Some VM actions (e.g., graceful shutdown) may fall back to less graceful methods.
- Guest diagnostics will be unavailable.

Enable **Install QEMU Guest Agent** in the VM creation wizard (Review step, Cloud-Init section) to auto-inject installation via cloud-init. For existing VMs, install the guest agent manually from the package repository or use an image that already includes it.
