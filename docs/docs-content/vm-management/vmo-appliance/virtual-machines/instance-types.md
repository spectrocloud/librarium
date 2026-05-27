# Instance Types & Preferences

Instance types and preferences provide predefined compute and hardware profiles for VMs. Use them to standardize sizing and reduce configuration errors.

## Instance Types

**VirtualMachineClusterInstancetype** resources define CPU and memory presets. They are cluster-scoped and available in all namespaces.

### What Instance Types Define

- **CPU** — Guest-visible vCPU count.
- **Memory** — Guest-visible memory (e.g., 2Gi, 4Gi).
- **CPU Model** — Optional. The named x86 CPU model exposed to the guest (e.g., `Skylake-Server`, `EPYC-Rome`), or a passthrough mode such as `host-model` or `host-passthrough`.

Instance types do not define storage, network, or other hardware. Those come from the VM spec, template, or preference.

### CPU Model Field

The **CPU Model** dropdown in the Create/Edit Instance Type modal is populated dynamically from the cluster. It lists only the models that at least one schedulable worker node reports as supported, as discovered from KubeVirt's `cpu-model-migration.node.kubevirt.io/<Model>` node labels (written by KubeVirt's node-labeller based on each node's physical CPU features).

Two warnings can appear inline under the select:

- **This CPU model is not available on any cluster node. VMs may fail to schedule.** — The selected model is not supported by any node in the cluster. This commonly appears after importing an instance type or template from another cluster with different CPU hardware. Pick a supported model from the dropdown, or add a node that exposes the required CPU features.
- **This model is not supported by all nodes. Live migration may be restricted.** — The model is supported by some nodes but not all. VMs using this model can still schedule, but live migration between nodes is constrained to the subset that supports the model.

When an instance type or template references a model that the current cluster does not expose, the dropdown preserves the original value as `<ModelName> (unsupported in current cluster)` so importing does not silently drop the setting. You can keep the preserved value or choose a supported model before saving.

> **Refresh cadence:** The list of discovered CPU models is cached for up to 3 minutes. Adding, removing, or cordoning a worker node will reflect in the dropdown within one cache window (up to 3 minutes).

### Built-in and Custom Instance Types

VMO Manager and KubeVirt ship with example instance types (e.g., `u1.small`, `u1.medium`, `cx1.medium`). Cluster administrators can add custom instance types via the CRD or the Instance Types page under **Workloads > Instance Types**.

### Grouping by Prefix

Instance types are often grouped by a naming prefix:

| Prefix | Typical Use |
|--------|-------------|
| **u1** | General purpose (balanced CPU/memory) |
| **cx1** | Compute optimized (more CPU) |
| **mx1** | Memory optimized (more memory) |

The VM creation wizard displays instance types in a **FilterableCardSelector** with collapsible groups. You can filter by name or spec (e.g., "4" to find 4 vCPU types).

### Using Instance Types in the Wizard

1. In the **Compute** step, select **Instance Type** (recommended).
2. Browse or filter the instance type cards. Each card shows CPU, memory, and other spec details.
3. Select an instance type. The **SpecPreview** shows the applied settings.
4. The generated VM spec uses `spec.instancetype` and omits explicit `cpu` and `memory` from the domain. The instance type provides those values.

---

## Preferences

**VirtualMachineClusterPreference** resources define OS-specific hardware and device defaults. They are cluster-scoped and filtered by guest OS.

### What Preferences Define

- **Machine type** — e.g., `q35`, `pc-q35-rhel9.2.0`.
- **Firmware** — EFI, Secure Boot, SMBIOS.
- **Devices** — RNG, tablet, video type, TPM.
- **Features** — ACPI, APIC, HyperV enlightenments (for Windows).
- **Clock** — UTC vs timezone, timer configuration.

Preferences do not define CPU or memory. Those come from the instance type or custom compute settings.

### Filtering by OS

Preferences are filtered by the **Guest OS** selected in the Source step:

- **Linux** — Shows Linux and "any" preferences. Windows-specific preferences are hidden.
- **Windows** — Shows Windows and "any" preferences. Linux-specific preferences are hidden.

This ensures you do not apply a Windows preference (e.g., HyperV) to a Linux VM or vice versa.

### Using Preferences in the Wizard

1. In the **Source** step, set **Guest OS** (Linux or Windows).
2. Expand **VM Preference** (optional, collapsible section).
3. Browse or filter preference cards. Select a preference or leave as "None".
4. The selected preference's settings are applied to the VM spec. The **SpecPreview** shows key settings (e.g., "EFI", "HyperV", "q35").

---

## How Instance Type and Preference Work Together

| Component | Provides |
|-----------|----------|
| **Instance Type** | CPU, memory |
| **Preference** | Machine type, firmware, devices, features |
| **Template / Wizard** | Storage, network, cloud-init, lifecycle |

When both are selected:

- The VM spec includes `spec.instancetype` (for CPU/memory) and `spec.preference` (for hardware defaults).
- The domain is built by merging: instance type for resources, preference for devices/firmware, and explicit wizard choices for overrides.

---

## Custom Mode vs Instance Type Mode

In the **Compute** step, you choose:

| Mode | Behavior |
|------|----------|
| **Instance Type** | Select a predefined profile. CPU and memory come from the instance type. Run strategy and eviction strategy are still configurable. |
| **Custom** | Set CPU cores and memory manually. Full control over resource requests, limits, and scheduling. |

Instance type mode is recommended for consistency across teams. Custom mode is for workloads that need specific sizing not covered by instance types.

---

## Managing Instance Types and Preferences

### Instance Types

- **Workloads > Instance Types** — List, create, edit, delete `VirtualMachineClusterInstancetype` resources.
- Create custom instance types for organization-specific sizing (e.g., `app-small`, `app-medium`, `db-large`).

### Preferences

- **Workloads > Preferences** — List, create, edit, delete `VirtualMachineClusterPreference` resources.
- Create custom preferences for specific OS versions or security requirements (e.g., `rhel9-secure`, `windows-2022-standard`).

Both use the generic CRD resource UI. Changes apply to newly created VMs and templates; existing VMs are not modified.

### YAML Drawer

The create and edit modals for both Instance Types and Preferences include a **YAML drawer** (click the `<>` toggle). The drawer shows the complete KubeVirt resource manifest — not just the spec — so you can author or inspect the full object:

```yaml
apiVersion: instancetype.kubevirt.io/v1beta1
kind: VirtualMachineClusterInstancetype   # or VirtualMachineClusterPreference
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

**Behaviour:**

| Field | Create mode | Edit mode |
|-------|-------------|-----------|
| `metadata.name` | Syncs into the name field when you click **Apply YAML** | Ignored — name is locked (K8s does not allow in-place renames) |
| `metadata.labels` | Applied to the form on **Apply YAML** | Applied to the form on **Apply YAML** |
| `spec` | Applied to the form on **Apply YAML** | Applied to the form on **Apply YAML** |

Invalid YAML (syntax errors) is caught before Apply is executed — an error message appears in the drawer footer and no changes are made to the form.
