# Templates

VmTemplates are reusable VM specifications that define a base image, compute, network, storage, and hardware settings. Create VMs from templates to ensure consistency and speed up provisioning.

## What Are Templates?

A **VmTemplate** is a Kubernetes custom resource (`VirtualMachineTemplate` in the KubeVirt ecosystem) that encapsulates:

- **Source** — A DataVolume template that clones from a golden image or PVC.
- **Compute** — CPU, memory, instance type, run strategy, eviction strategy.
- **Storage** — Root disk size, StorageClass, additional disks.
- **Network** — Network interfaces (pod network, Multus NADs).
- **Hardware** — Firmware, devices, features (EFI, TPM, HyperV, etc.).

Templates are namespace-scoped. You create VMs from a template by selecting it in the VM creation wizard; the wizard pre-fills settings from the template and allows overrides.

---

## Creating Templates

### From the Wizard

1. Navigate to **Workloads > Templates**.
2. Click **Create Template**.
3. The same wizard used for VM creation opens in **template mode**. Steps are similar:
   - **Source** — Select the source DataVolume (golden image) and namespace. Set template name, display name, description, and Guest OS.
   - **Compute** — Instance type or custom CPU/memory.
   - **Storage** — Root disk size, StorageClass, boot order.
   - **Network** — Interfaces and NADs.
   - **Hardware** — Firmware, devices, features.
   - **Lifecycle** — Optional snapshot policy (stored as template annotation).
   - **Review** — Verify and create.

4. Click **Create Template**. The template is saved as a `VmTemplate` CRD.

### From an Existing VM

1. Open the VM detail page.
2. Click **Create Template** (or use the context menu from the VM list).
3. The wizard opens with the VM's configuration pre-filled. Adjust as needed and save.

When creating from an existing VM, the template references the VM's root disk (or its source DataVolume) as the clone source. Ensure the source is a suitable golden image (sealed and generalized).

---

## Creating VMs from Templates

1. In the VM creation wizard, select **Template** as the source type.
2. Choose the **namespace** and **template** from the dropdowns.
3. The wizard applies template defaults: compute, storage, network, hardware. Override any setting in the subsequent steps.
4. Set the VM name and complete the wizard. The VM is created with a DataVolume that clones from the template's source image.

> **Tip:** Templates can specify an instance type. When the template uses an instance type, the Compute step shows the instance type as selected. You can switch to custom mode to override CPU and memory.

---

## Editing Templates

1. Navigate to **Workloads > Templates**.
2. Click a template name to open its detail page, or use the context menu to edit.
3. Edit the template using the form or YAML. Changes apply to the `VmTemplate` resource.
4. **Existing VMs are not updated** — Template edits affect only newly created VMs. Existing VMs retain their original configuration.

---

## Export and Import

### Export

Export a template to a JSON file for backup or transfer:

1. Open the template detail page.
2. Use the **Export** action to download the template manifest as JSON.

The export includes the full `VmTemplate` spec and metadata.

### Import

Import a template from a JSON file:

1. Navigate to **Workloads > Templates**.
2. Click **Import Template**.
3. Select or drop the JSON file.
4. Review the template. If a template with the same name exists, you can choose to **reconcile** (update) or **skip**.
5. Complete the import. The template is created or updated in the cluster.

### Reconciliation

When importing, if a template with the same name and namespace already exists:

- **Reconcile** — Update the existing template with the imported spec. Use when syncing templates across environments.
- **Skip** — Leave the existing template unchanged. Use when you want to avoid overwriting local changes.

### Importing Templates Across Clusters

Imported templates may reference a CPU model that the current cluster does not expose (for example, importing an Intel-era template into an AMD cluster). VMO Manager preserves the original CPU model value rather than dropping it — when you open the imported template or create a VM from it, the Hardware step's **CPU Model** dropdown shows `<ModelName> (unsupported in current cluster)`. An inline warning indicates the model is not available on any node, and VMs using it may fail to schedule. Pick a supported model from the dropdown before creating the VM, or add a node that provides the required CPU features. See [Creating VMs](creating.md#step-5-hardware) for details on the CPU Model field.

---

## Template Annotations

Templates support annotations for integration:

- **`vmo-manager.spectrocloud.com/snapshot-policy`** — Name of a snapshot policy to attach to VMs created from this template. When set, the VM creation wizard offers to attach this policy to new VMs.

---

## Best Practices

- **Use golden images** — Create templates from sealed, generalized golden images rather than one-off VM disks. Golden images ensure consistent machine-id, SSH keys, and cloud-init state across clones.
- **Version templates** — Use naming conventions (e.g., `ubuntu-22.04-v1`, `ubuntu-22.04-v2`) when iterating on templates.
- **Document with display name and description** — Set a human-readable display name and description so users can identify templates quickly.
- **Attach snapshot policies** — For critical workloads, attach a snapshot policy at the template level so all VMs created from it get automatic backups.
