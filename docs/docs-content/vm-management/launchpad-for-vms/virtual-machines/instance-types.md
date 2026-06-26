---
sidebar_label: "Instance Types & Preferences"
title: "Instance Types & Preferences"
description: "Learn about instance types and preferences"
icon: " "
hide_table_of_contents: false
sidebar_position: 5
tags: ["vmo", "vm launchpad", "instance types", "preferences"]
---

Instance types and preferences provide predefined compute and hardware profiles for VMs. Use them to standardize sizing
and reduce configuration errors.

## VM Instance Types

**VirtualMachineClusterInstancetype** resources define CPU and memory presets. They are cluster-scoped and available in
all namespaces.

### What VM Instance Types Define

| Field         | Description                                                                                                                                                        |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **CPU**       | Guest-visible vCPU count.                                                                                                                                          |
| **Memory**    | Guest-visible memory, such as 2Gi or 4Gi.                                                                                                                          |
| **CPU Model** | Optional. The named x86 CPU model exposed to the guest, such as `Skylake-Server` or `EPYC-Rome`, or a passthrough mode such as `host-model` or `host-passthrough`. |

VM instance types do not define storage, network, or other hardware. Those come from the VM spec, template, or
preference.

### Built-in and Custom Instance Types

Launchpad and KubeVirt ship with example instance types, such as `u1.small`, `u1.medium`, and `cx1.medium`. Cluster
administrators can add custom instance types through the Custom Resource Definition (CRD) or the Instance Types page
under **Workloads** > **Instance Types**.

### Prefix Conventions

Instance types are often grouped by a naming prefix.

| Prefix  | Typical Use                           |
| ------- | ------------------------------------- |
| **u1**  | General purpose (balanced CPU/memory) |
| **cx1** | Compute optimized (more CPU)          |
| **mx1** | Memory optimized (more memory)        |

The VM creation wizard displays instance types in a **FilterableCardSelector** with collapsible groups. You can filter
by name or spec. For example, search for `4` to find 4 vCPU types.

### CPU Model Field

The **CPU Model** dropdown in the Create/Edit Instance Type modal is populated dynamically from the cluster. It lists
only the models that at least one schedulable worker node reports as supported, as discovered from KubeVirt's
`cpu-model-migration.node.kubevirt.io/<Model>` node labels (written by KubeVirt's node-labeller based on each node's
physical CPU features).

Two warnings can appear inline under the select:

- **This CPU model is not available on any cluster node. VMs may fail to schedule.** The selected model is not supported
  by any node in the cluster. This warning commonly appears after importing an instance type or template from another
  cluster with different CPU hardware. Pick a supported model from the dropdown, or add a node that exposes the required
  CPU features.
- **This model is not supported by all nodes. Live migration may be restricted.** The model is supported by some nodes
  but not all. VMs using this model can still schedule, but live migration between nodes is constrained to the subset
  that supports the model.

When an instance type or template references a model that the current cluster does not expose, the dropdown preserves
the original value as `<ModelName> (unsupported in current cluster)` so importing does not silently drop the setting.
You can keep the preserved value or choose a supported model before saving.

:::info

The list of discovered CPU models is cached for up to three minutes. The dropdown reflects an added, removed, or
cordoned worker node within one cache window.

:::

### Instance Types in the Wizard

1. In the **Compute** step, select **Instance Type** (recommended).
2. Browse or filter the instance type cards. Each card shows CPU, memory, and other spec details.
3. Select an instance type. The **SpecPreview** shows the applied settings.
4. The generated VM spec uses `spec.instancetype` and omits explicit `cpu` and `memory` from the domain. The instance
   type provides those values.

### Custom Mode vs Instance Type Mode

In the **Compute** step, you choose between two modes.

| Mode              | Behavior                                                                                                                            |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Instance Type** | Select a predefined profile. CPU and memory come from the instance type. Run strategy and eviction strategy are still configurable. |
| **Custom**        | Set CPU cores and memory manually. Full control over resource requests, limits, and scheduling.                                     |

Instance type mode is recommended for consistency across teams. Custom mode is for workloads that need specific sizing
not covered by instance types.

## VM Preferences

**VirtualMachineClusterPreference** resources define OS-specific hardware and device defaults. They are cluster-scoped
and filtered by guest OS.

### What VM Preferences Define

| Setting          | Examples                                         |
| ---------------- | ------------------------------------------------ |
| **Machine type** | `q35`, `pc-q35-rhel9.2.0`                        |
| **Firmware**     | EFI, Secure Boot, SMBIOS                         |
| **Devices**      | RNG, tablet, video type, TPM                     |
| **Features**     | ACPI, APIC, Hyper-V enlightenments (for Windows) |
| **Clock**        | UTC versus timezone, timer configuration         |

VM preferences do not define CPU or memory. Those come from the instance type or custom compute settings.

### Filter by OS

VM preferences are filtered by the **Guest OS** selected in the Source step.

| Guest OS    | Shows                         | Hides                        |
| ----------- | ----------------------------- | ---------------------------- |
| **Linux**   | Linux and "any" preferences   | Windows-specific preferences |
| **Windows** | Windows and "any" preferences | Linux-specific preferences   |

This ensures you do not apply a Windows preference, such as Hyper-V, to a Linux VM or vice versa.

### Preferences in the Wizard

1. In the **Source** step, set **Guest OS** (Linux or Windows).
2. Expand **VM Preference** (optional, collapsible section).
3. Browse or filter preference cards. Select a preference or leave it set to **None**.
4. The selected preference's settings are applied to the VM spec. The **SpecPreview** shows key settings, such as
   **EFI**, **Hyper-V**, and **q35**.

## How VM Instance Types and VM Preferences Work Together

| Component             | Provides                                  |
| --------------------- | ----------------------------------------- |
| **VM Instance Type**  | CPU, memory                               |
| **VM Preference**     | Machine type, firmware, devices, features |
| **Template / Wizard** | Storage, network, cloud-init, lifecycle   |

When both are selected:

- The VM spec includes `spec.instancetype` (for CPU/memory) and `spec.preference` (for hardware defaults).
- The domain is built by merging: instance type for resources, preference for devices/firmware, and explicit wizard
  choices for overrides.

## Manage Instance Types and Preferences

Manage both resource types from the **Workloads** menu. They use the generic CRD resource UI, so you can list, create,
edit, and delete them the same way. Changes apply to newly created VMs and templates. Existing VMs are not modified.

| Resource       | Manage from                        | Example custom names                    |
| -------------- | ---------------------------------- | --------------------------------------- |
| Instance types | **Workloads** > **Instance Types** | `app-small`, `app-medium`, `db-large`   |
| Preferences    | **Workloads** > **Preferences**    | `rhel9-secure`, `windows-2022-standard` |

### Create a Custom Instance Type

Create a custom instance type when the built-in profiles do not match your sizing needs. This task requires cluster
administrator permissions.

1. From the left main menu, select **Workloads** > **Instance Types**.

2. Select **New Instance Type**.

3. In the **Name** field, enter a name for the instance type, such as `app-medium`.

4. _(Optional)_ To author the resource directly as YAML, select the `</>` toggle, edit the manifest, and select **Apply
   YAML**. Refer to [YAML Drawer](#yaml-drawer) for details.

5. In the **CPU** section, configure the following settings. For field definitions, refer to
   [What VM Instance Types Define](#what-vm-instance-types-define) and [CPU Model Field](#cpu-model-field).

   | Setting                            | Description                                                                                                                                                                                                                       |
   | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Guest vCPUs**                    | The number of vCPUs exposed to the guest.                                                                                                                                                                                         |
   | **CPU Model**                      | Select **Host Model (default)** or **host-passthrough**.                                                                                                                                                                          |
   | **Max Sockets**                    | Enables CPU hot plug when set to a value greater than **Guest vCPUs**. Defaults to `auto`. Refer to [CPU Socket Changes](./managing.md#cpu-socket-changes-directional-behavior) for the runtime behavior when you change sockets. |
   | **Dedicated CPU Placement**        | Pins the guest vCPUs to dedicated physical CPUs on the host.                                                                                                                                                                      |
   | **Isolate Emulator Thread**        | Isolates the QEMU emulator thread onto its own CPU. Helpful for jitter-sensitive applications.                                                                                                                                    |
   | **NUMA Guest Mapping Passthrough** | Passes the host NUMA topology to the guest. Can improve performance for NUMA-aware applications.                                                                                                                                  |

6. In the **Memory** section, configure the following settings.

   <!-- vale Vale.Terms = NO -->

   | Setting              | Description                                                                                                                          |
   | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
   | **Guest Memory**     | The memory exposed to the guest, in `Mi`, `Gi`, or `Ti`.                                                                             |
   | **Max Guest Memory** | Enables memory hot plug when set to a value greater than **Guest Memory**.                                                           |
   | **Hugepages Size**   | Select **None (standard pages)**, **2Mi**, or **1Gi**. Larger pages can improve CPU performance for VMs with large **Guest Memory**. |
   | **Overcommit %**     | The overcommit percentage applied on the hypervisor. A value of `0` applies no overcommit.                                           |

   <!-- vale Vale.Terms = YES -->

7. _(Optional)_ In the **Devices** section, add devices.

   | Device           | Description                                |
   | ---------------- | ------------------------------------------ |
   | **GPUs**         | Map the VM to GPUs on the host.            |
   | **Host Devices** | Add PCI passthrough or other host devices. |

8. _(Optional)_ In the **Advanced** section, configure the following settings.

   | Setting                              | Description                                                                                                                                                                                        |
   | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **IO Threads Policy**                | Controls disk I/O isolation. Set to **None** (default), `auto`, `shared`, or `supplementalPool`. Refer to [IO Thread Policy](https://kubevirt.io/user-guide/storage/disks_and_volumes/#iothreads). |
   | **AMD SEV (Confidential Computing)** | Enables memory encryption.                                                                                                                                                                         |

9. _(Optional)_ Add **Labels** as key-value pairs to organize the resource.

10. Select **Create Instance Type** to save the instance type.

The new instance type appears in the **Instance Types** list and becomes available in the **Compute** step of the
[VM creation](./creating.md#create-a-virtual-machine) wizard.

### Create a Custom Preference

Create a custom preference to define OS-specific hardware and device defaults, such as `rhel9-secure` or
`windows-2022-standard`. This task requires cluster administrator permissions.

1. From the left main menu, select **Workloads** > **Preferences**.

2. Select **New Preference**.

3. In the **Name** field, enter a name for the preference, such as `rhel9-secure`.

4. _(Optional)_ To author the resource directly as YAML, select the `</>` toggle, edit the manifest, and select **Apply
   YAML**. Refer to [YAML Drawer](#yaml-drawer) for details.

5. In the **CPU** section, configure the following settings.

   | Setting           | Description                                                                                                                                                                                                                  |
   | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Topology**      | Sets how the guest vCPUs map to sockets, cores, and threads. **Spread** (default) distributes them evenly for the best NUMA performance. You can instead select **Prefer Cores**, **Prefer Sockets**, or **Prefer Threads**. |
   | **Spread Across** | When **Topology** is **Spread**, sets the units to spread vCPUs across: **Sockets & Cores** (recommended), **Cores & Threads**, or **Sockets, Cores, & Threads**.                                                            |
   | **Spread Ratio**  | Sets the ratio of vCPUs per spread unit.                                                                                                                                                                                     |

6. In the **Devices** section, configure the following settings.

   | Setting             | Description                                                                                                                                                                               |
   | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Disk Bus**        | `virtio` offers the best performance. Use `sata` or `scsi` for legacy disks.                                                                                                              |
   | **Disk Cache**      | `writethrough` is safest because it writes to the host and guest simultaneously. `writeback` improves performance but risks data loss if the host fails. `none` turns off the disk cache. |
   | **Interface Model** | Sets the network interface. `virtio` is the fastest. `e1000` and `e1000e` provide broad support without `virtio` drivers.                                                                 |
   | **Hardware RNG**    | Enabled by default. Provides cryptographic entropy and is recommended for all VMs.                                                                                                        |

7. In the **Machine & Firmware** section, configure the following settings.

   | Setting                      | Description                                                                                                      |
   | ---------------------------- | ---------------------------------------------------------------------------------------------------------------- |
   | **Machine Type**             | `q35` is a modern chipset with PCIe support. `pc (i440fx)` is a legacy chipset that supports PCI only.           |
   | **Termination Grace Period** | The time, in seconds, to wait for a graceful shutdown before the VM is forced off.                               |
   | **EFI Boot**                 | Enabled by default. Uses UEFI firmware, which is required for Secure Boot and modern OS installers.              |
   | **Secure Boot**              | Enabled by default. Requires **EFI Boot** and **SMM**. Validates the boot chain to help prevent attacks at boot. |

8. In the **Features** section, enable the options your guest OS requires.

   | Feature                    | Description                                                                                                 |
   | -------------------------- | ----------------------------------------------------------------------------------------------------------- |
   | **SMM**                    | System Management Mode. Enabled by default with **EFI Boot**.                                               |
   | **ACPI**                   | Advanced Configuration and Power Interface. Required for graceful shutdown on most guest operating systems. |
   | **APIC**                   | Advanced Programmable Interrupt Controller. Required for multi-core VMs.                                    |
   | **PV Spinlock**            | Reduces CPU overhead from lock contention on Linux guests through paravirtual spinlock optimization.        |
   | **Hyper-V Enlightenments** | Windows-specific paravirtual optimizations that improve Windows guest performance.                          |

9. In the **Clock** section, configure the following settings.

   | Setting                                   | Description                                                                                                                                  |
   | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
   | **UTC Clock Offset**                      | Sets the guest hardware clock to UTC. Enabled by default and recommended for Linux. Turn it off for Windows guests, which expect local time. |
   | **Windows Timers (HPET/PIT/RTC/Hyper-V)** | Applies the standard Windows timer configuration.                                                                                            |

10. In the **Annotations** section, the **Descheduler eviction annotation** is enabled by default. It marks the VM as
    eligible for descheduler-initiated live migration to improve cluster balance.

11. _(Optional)_ Add **Labels** as key-value pairs to organize the resource.

12. Select **Create Preference** to save the preference.

The new preference appears in the **Preferences** list and becomes available in the **Source** step of the
[VM creation](./creating.md#create-a-virtual-machine) wizard.

### YAML Drawer

The create and edit modals for both Instance Types and Preferences include a **YAML drawer**. Select the `</>` toggle to
open it. The drawer shows the complete KubeVirt resource manifest, not just the spec, so you can author or inspect the
full object.

```yaml
apiVersion: instancetype.kubevirt.io/v1beta1
kind: VirtualMachineClusterInstancetype # or VirtualMachineClusterPreference
metadata:
  name: my-instance-type
  labels:
    tier: compute
spec:
  cpu:
    guest: 4
  memory:
    guest: 8Gi
```

#### Behavior

| Field             | Create mode                                               | Edit mode                                                   |
| ----------------- | --------------------------------------------------------- | ----------------------------------------------------------- |
| `metadata.name`   | Syncs into the name field when you select **Apply YAML**. | Ignored because Kubernetes does not allow in-place renames. |
| `metadata.labels` | Applied to the form on **Apply YAML**.                    | Applied to the form on **Apply YAML**.                      |
| `spec`            | Applied to the form on **Apply YAML**.                    | Applied to the form on **Apply YAML**.                      |

If the YAML contains syntax errors, the editor catches them before running Apply. An error message appears in the drawer
footer, and the form does not change.
