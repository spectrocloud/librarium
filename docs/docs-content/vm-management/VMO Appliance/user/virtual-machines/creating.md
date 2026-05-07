# Creating VMs

This guide walks through the VM creation wizard and batch creation options in VMO Manager.

## Overview

The VM creation wizard guides you through seven steps: **Source**, **Compute**, **Storage**, **Network**, **Hardware**, **Lifecycle**, and **Review**. Each step configures a different aspect of the virtual machine. The wizard supports creating VMs from [templates](templates), [golden images](../image-catalog/golden-images), ISOs, or blank disks.

> **Tip:** Use the **Advanced** button to open the YAML preview drawer. The preview updates live as you change selections in each step.

---

## Step 1: Source

Choose where the VM disk comes from and set basic identity.

### Source Types

| Type | Description |
|------|-------------|
| **Template** | Use an existing VmTemplate. The template defines the base image, compute, network, and hardware. You can override some settings in later steps. |
| **Image / ISO** | Select a DataVolume from the picker. `[Image]` entries are DataVolumes marked as golden images and are cloned into the rootdisk, so the VM boots directly into the OS. `[ISO]` entries are installer media and are attached as a CD-ROM; the rootdisk starts blank and the OS is installed on first boot. |
| **Blank** | Create an empty DataVolume. Use for PXE boot or manual installation. |

### Identity

- **Namespace** — The Kubernetes namespace where the VM will be created. Must be a managed namespace (labeled `app.kubernetes.io/managed-by=vmo-manager`).
- **VM Name** — Must follow Kubernetes DNS-1123 rules: lowercase, alphanumeric, hyphens. No spaces or underscores.
- **Guest OS** — Linux or Windows. Affects which VM preferences are shown (preferences are filtered by OS family).

### VM Preference (Optional)

Optionally select a **VirtualMachineClusterPreference** for CPU topology, machine type, firmware, and device defaults. Preferences are filtered by the selected Guest OS. Linux preferences are hidden when Windows is selected, and vice versa.

### Batch Mode

Enable **Create multiple VMs** to provision several VMs in one operation:

- **Count** — Number of VMs to create (1–50).
- **Naming** — Choose `name-1, name-2` (dash) or `name01, name02` (padded).
- **Start #** — Starting index for the suffix (e.g., 1 for `name-1`, 0 for `name-0`).

Generated names are shown as you type. For example, with base name `web` and count 3, dash naming produces `web-1`, `web-2`, `web-3`.

### Labels (Optional)

Add Kubernetes labels to the VM. Labels use `key=value` format and must comply with label naming rules.

---

## Step 2: Compute

Configure CPU, memory, and runtime behavior.

### Instance Type vs Custom

See [Instance Types & Preferences](instance-types) for details on available compute profiles.

| Mode | Description |
|------|-------------|
| **Instance Type** | Select a predefined compute profile (e.g., `u1.small`, `cx1.medium`). CPU and memory are defined by the instance type. Recommended for consistency. |
| **Custom** | Set CPU cores and memory manually. Use for workloads that need specific sizing. |

### Custom Mode Options

- **CPU Cores** — Guest-visible vCPU count.
- **Memory** — Guest-visible memory in Gi or Mi.
- **Run Strategy** — Always, RerunOnFailure, Manual, or Halted.
- **Resource Requests & Limits** — Optional. Control Kubernetes resource reservations for overcommit and QoS. Set memory requests lower than guest memory for overcommit.
- **Scheduling** — Eviction strategy (LiveMigrate, LiveMigrateIfPossible, None), hostname, grace period, priority class, node selector, and tolerations.

### Instance Type Mode

When Instance Type is selected, CPU and memory come from the chosen `VirtualMachineClusterInstancetype`. Run strategy and eviction strategy are still configurable in the Scheduling section.

---

## Step 3: Storage

Configure the root disk and additional disks.

### Root Disk

- **Size** — Disk size in Gi or Mi. When creating from a template, this is an override (the template may define a default).
- **Storage Class** — Use cluster default or select a specific StorageClass.

### Additional Disks

Click **Add Disk** to attach extra data volumes. Each disk has a name, size (Gi), and optional Storage Class.

### Boot Order

Choose the first boot device:

- **Disk** — Boot from the root disk (typical for golden images and templates).
- **CD-ROM** — Boot from an attached ISO (available when source is Image/ISO).
- **Network** — PXE boot from the network.

---

## Step 4: Network

Configure network interfaces.

### Default Interface

By default, the VM has one interface using the **pod network** (masquerade). This provides outbound connectivity via NAT.

### Additional NICs

Click **Add NIC** to add interfaces. Each interface can be:

- **Pod Network (masquerade)** — Uses the default pod network.
- **Multus Network (bridge)** — Attach to a Network Attachment Definition (NAD). Select the NAD from the dropdown. You can create a new NAD from the wizard if you have permission.

### Static IP (Bridge NICs)

For bridge-type NICs, expand **Static IP configuration** to set:

- **IP/CIDR** — e.g., `192.168.1.10/24`
- **Gateway** — e.g., `192.168.1.1`
- **DNS** — Comma-separated DNS server IPs

### Batch Static IP Assignment

When batch mode is enabled and you have bridge NICs, a **Batch Static IP Assignment** section appears. Enter IP/CIDR, gateway, and DNS for each VM. Use **Fill Down** to auto-increment IPs by incrementing the last octet (e.g., `192.168.1.10/24` → `192.168.1.11/24`, `192.168.1.12/24`).

---

## Step 5: Hardware

Optional advanced hardware settings. This step can be skipped for basic VMs.

### Firmware

- **UEFI / EFI Boot** — Enable UEFI instead of BIOS.
- **Secure Boot** — Requires EFI. Enables SMM.
- **Persistent EFI Variables** — Persist NVRAM (requires VMPersistentState feature gate).
- **Machine Type** — Override default (e.g., `q35`).
- **SMBIOS** — Optional UUID and serial.

### CPU Advanced

- **CPU Model** — `host-passthrough`, `host-model`, or a named model (e.g., `Skylake-Server`, `EPYC-Rome`). The dropdown is populated dynamically from the cluster and lists only the models supported by at least one schedulable worker node (discovered from KubeVirt's `cpu-model-migration.node.kubevirt.io/<Model>` node labels). Two inline warnings may appear:
  - *"This CPU model is not available on any cluster node. VMs may fail to schedule."* — The selected model is not supported by any node. Common after importing a template from a cluster with different CPU hardware.
  - *"This model is not supported by all nodes. Live migration may be restricted."* — The model is supported by some nodes but not all, so live migration is constrained to the subset.

  When a VM or template references a model the cluster does not expose, the dropdown preserves it as `<ModelName> (unsupported in current cluster)` so the value is not silently dropped.

  > **Refresh cadence:** The discovered model list is cached for up to 3 minutes. Adding, removing, or cordoning a worker node will reflect in the dropdown within one cache window (up to 3 minutes).

- **Dedicated CPU Placement** — Pin vCPUs to physical cores.
- **NUMA Topology Passthrough** — Pass host NUMA topology to the guest.
- **CPU Features** — Add require/force/disable/forbid for specific features.

### Devices

- **Virtio RNG** — Random number generator.
- **Tablet Input** — USB tablet for pointer precision.
- **Headless** — No graphics device.
- **Video Type** — VGA, Virtio, or Bochs.
- **TPM** — Trusted Platform Module (ephemeral or persistent).
- **USB Redirection** — Client passthrough (requires KubeVirt 0.44+).

### Features

- **ACPI**, **APIC** — Usually enabled by default.
- **HyperV Enlightenments** — For Windows VMs (relaxed, VAPIC, spinlocks).

### Clock and Timers

- **Clock Mode** — UTC or timezone.
- **Timers** — PIT, RTC, HPET, HyperV timer configuration.

### Memory

- **Hugepages** — Enable and set page size (2Mi or 1Gi).
- **Overcommit Guest Overhead** — Exclude per-VM overhead from memory request.

### Security

- **Confidential Computing** — AMD SEV, SEV-SNP, or Intel TDX (when supported by the cluster).

### Host Devices

Attach PCI or GPU devices for passthrough. Devices must be discovered and registered in KubeVirt. Use **Cluster Device Management** to register devices if you have admin permission.

---

## Step 6: Lifecycle

Optional lifecycle policies and cloud-init configuration.

### Snapshot Policy

Select a **VmSnapshotPolicy** to attach to the VM after creation. The policy defines automatic snapshot schedules (interval, retention count, time window). VMs created from a template inherit the template's snapshot policy annotation if one is set.

> **Note:** Snapshot policies are created under **Workloads > Snapshot Policies**. See [Snapshots & Clones](snapshots) for details on creating policies. You can also create a new policy from the Lifecycle step if you have permission.

### Cloud-Init

Expand **Cloud-Init** to configure guest initialization. This section is collapsed by default.

- **Install QEMU Guest Agent** — When enabled (default), cloud-init is augmented to install the guest agent. Required for VNC clipboard, guest agent diagnostics, and live migration features.
- **User Data** — YAML or script. For Linux, typical content starts with `#cloud-config`.

> **Warning:** Cloud-init runs only at first boot. Changes to user-data after the VM has booted do not re-run unless you use `cloud-init clean` and reboot.

---

## Step 7: Review

Review the configuration before creating.

### Summary Sections

Each section (Source, Compute, Storage, Network, Hardware, Lifecycle) shows a summary. Click **Edit** to jump back to that step.

### Cloud-Init Summary

The Lifecycle summary section always appears in the Review step and shows whether QEMU Guest Agent is enabled and whether user-data or network-data has been configured. To edit these values, click **Edit** next to Lifecycle or navigate back to the Lifecycle step.

### YAML Preview

Click **Advanced** to open the YAML drawer. The preview shows the full `VirtualMachine` manifest and updates live as you change any step. The preview is read-only; use it to verify the final spec before creating.

Cloud-init user-data and network-data — including network-data auto-generated from static bridge IPs — are reflected in the `cloudInitNoCloud` volume in the preview.

### Validation

Errors and warnings are shown at the top of the Review step. Fix any errors before creating. Warnings may indicate non-fatal issues (e.g., missing preference for selected OS).

---

## Batch Creation

When batch mode is enabled:

1. Set the base VM name and count in Source.
2. Configure network, storage, and compute as usual. Batch static IPs are configured per-NIC in Network.
3. Click **Create** or **Finish**. The wizard creates each VM sequentially, applying per-VM names and static IPs from the batch configuration.

> **Tip:** Use **Fill Down** in the Batch Static IP Assignment table to quickly populate IPs for multiple VMs by incrementing the last octet.

---

## CSV Import

For bulk creation from templates, use **CSV Import** instead of the wizard:

1. In the Create VM modal, switch to the **CSV Import** tab.
2. Download the example CSV to see the required format.
3. Create a CSV with columns: `vmName`, `templateName`, `templateNamespace`, `namespace`, `cpuCores`, `memory`, `diskSize`, `storageClass`, `runStrategy`, `guestOS`, `labels`.
4. Drop the CSV file or click to browse.
5. Review the parsed rows and click **Create** to provision all VMs.

Required columns: `vmName`, `templateName`. Optional: `templateNamespace`, `namespace`, `cpuCores`, `memory`, `diskSize`, `storageClass`, `runStrategy`, `guestOS`, `labels`. Labels use `key=value;key2=value2` format.

---

## Creating from Different Sources

### From Template

1. Select **Template** as the source type.
2. Choose the namespace and template from the dropdowns.
3. The wizard pre-fills compute, storage, network, and hardware from the template. Override as needed.
4. Set the VM name and complete the remaining steps.

### From ISO / Image

1. Select **Image / ISO** as the source type.
2. Choose a DataVolume from the dropdown. Each entry is prefixed with its type:
   - **`[Image]`** — a pre-installed disk image. Selecting it clones the image into the VM's rootdisk. No CD-ROM is attached; the VM boots directly into the OS.
   - **`[ISO]`** — installer media. Selecting it attaches the ISO as a CD-ROM drive. The rootdisk starts blank and the OS is installed on first boot.
3. Set the VM name. In Storage, choose **CD-ROM** as the first boot device when installing from an `[ISO]`. For `[Image]` sources the CD-ROM option is hidden automatically.
4. Complete Compute, Network, Hardware, and Lifecycle.

### From Blank Disk

1. Select **Blank** as the source type.
2. A blank DataVolume is created. Use **Network** as first boot device for PXE, or attach an ISO later.
3. Complete the remaining steps.

### From URL

Creating a VM from a URL (importing a disk image from a remote URL) is supported via the DataVolume API. Use the generic CRD catalog or `kubectl` to create a DataVolume with `spec.source.http` or `spec.source.registry`, then create a VM from that DataVolume using the Image/ISO source type once the import completes.

---

## Cloud-Init Configuration

Cloud-init configures the guest OS at first boot. In the **Lifecycle step**, expand **Cloud-Init** to edit:

- **User Data** — YAML or script. For Linux, typical content includes `#cloud-config` YAML with packages, users, and runcmd.
- **Network Data** — Optional. Network configuration (e.g., static IPs, routes).
- **Install QEMU Guest Agent** — When enabled (default), cloud-init is augmented to install the guest agent from the VMO package repository. Required for VNC clipboard, guest agent diagnostics, and live migration features.

> **Warning:** Cloud-init runs only at first boot. Changes to user-data after the VM has booted do not re-run unless you use cloud-init's `cloud-init clean` and reboot.

---

## API Reference

### Unified VM Creation Endpoint

`POST /api/v1/vm/apply` is the recommended API endpoint for creating VMs programmatically. It accepts a full KubeVirt `VirtualMachine` manifest along with VMO-specific options (cloud-init, sysprep, guest agent installation, snapshot policy).

**Dry-run validation:** Append `?dryRun=true` to validate the manifest without creating the VM. The endpoint returns validation results and the resolved manifest.

The VM creation wizard uses this endpoint internally. The wizard UX is unchanged -- this is a backend improvement that enables more flexible programmatic VM creation.

### Deprecated Endpoints

The following endpoints still work but are deprecated in favor of `POST /api/v1/vm/apply`:

| Endpoint | Replacement |
|----------|-------------|
| `POST /api/v1/vm/create-from-template` | `POST /api/v1/vm/apply` with a template-derived manifest |
| `POST /api/v1/vm/create-from-iso` | `POST /api/v1/vm/apply` with an ISO source disk |

Existing integrations using the deprecated endpoints will continue to function. Migration to the unified endpoint is recommended for new integrations.
