---
sidebar_label: "Create Your First Template"
title: "Create Your First Template"
description: "Learn how to create and manage templates in VM Launchpad."
icon: " "
hide_table_of_contents: false
sidebar_position: 2
tags: ["vmo", "vm launchpad", "templates"]
---

<!-- vale off -->

VM templates are reusable VM specifications that define a base image, compute, network, storage, and hardware settings.
Create VMs from templates to standardize provisioning across teams.

## What Are Templates?

A `VmTemplate` resource stores a reusable VM configuration that can include:

- **Source** — A DataVolume template that clones from a golden image or persistent volume claim (PVC).
- **Compute** — CPU, memory, instance type, run strategy, and eviction strategy.
- **Storage** — Root disk size, StorageClass, and additional disks.
- **Network** — Pod network and Multus Network Attachment Definition (NAD) interfaces.
- **Hardware** — Firmware, devices, features, and other KubeVirt hardware settings.

Templates are cluster-scoped. Any user with template read permissions can list and read templates from any namespace.
Review [Cross-Namespace Disclosure](#cross-namespace-disclosure) before you save a VM that contains inline cloud-init
data as a template.

## Create Your First Template

1. Navigate to **Workloads** > **Templates**.

2. Select **Create Template**.

3. The VM creation wizard opens in template mode. Complete the following steps.

   | **Parameter** | **Description**                                                                                                                  |
   | ------------- | -------------------------------------------------------------------------------------------------------------------------------- |
   | **Source**    | Select the source DataVolume and namespace. Set the template name, display name, description, guest OS, labels, and annotations. |
   | **Compute**   | Select an instance type or set custom CPU and memory values.                                                                     |
   | **Storage**   | Configure the root disk size, StorageClass, and boot order.                                                                      |
   | **Network**   | Configure pod network or Multus NAD interfaces.                                                                                  |
   | **Hardware**  | Configure firmware, devices, and features.                                                                                       |
   | **Lifecycle** | Configure an optional snapshot policy that is stored as a template annotation.                                                   |
   | **Review**    | Verify the settings and create the template.                                                                                     |

4. Select **Create Template**. Launchpad saves the template as a `VmTemplate` custom resource.

## Create a Template from an Existing VM

1. Open the VM detail page.

2. Select **Create Template** from the VM actions menu.

3. Review the configuration that Launchpad pre-fills from the VM.

4. Update any values that should differ from the source VM and save the template.

When you create a template from an existing VM, the template references the VM's root disk or source DataVolume as the
clone source. Use sealed and generalized golden images as template sources whenever possible.

### Preserved Fields

Launchpad copies the following fields from the source VM into the template:

- **Cloud-init** — Inline `userData` and `networkData` values for NoCloud and ConfigDrive datasources.
- **Compute** — CPU topology, memory, and instance type reference.
- **Firmware** — Bootloader mode, Secure Boot, kernel boot, and ACPI settings. Per-VM firmware UUID and serial values
  are removed.
- **Preference** — The `spec.preference` reference, when set.
- **Networks and disks** — Interface bindings, NAD references, and disk topology.
- **Hardware** — Devices, feature flags, clock settings, and timer settings.
- **User-applied labels and annotations** — Team tags, cost center labels, and other user metadata.

### Removed Fields

Launchpad removes fields that are per-VM, security-sensitive, or namespace-bound:

- **Cloud-init Secret references** — `userDataSecretRef` and `networkDataSecretRef` values.
- **Access credentials** — SSH key injection that references the original VM creator's Secrets.
- **MAC addresses** — Interface MAC addresses that could collide when the template creates new VMs.
- **Hostname and subdomain** — Per-VM identity fields.
- **Run strategy** — The create-from-template flow decides whether the new VM starts automatically.
- **KubeVirt-managed metadata** — KubeVirt, CDI, and wizard breadcrumb annotations that do not represent user intent.

If Launchpad removes a field, the success dialog lists the fields that were not copied so you can reattach anything
required for future VMs.

### Cross-Namespace Disclosure

Because templates are cluster-scoped, inline cloud-init `userData` and `networkData` values in a template are readable
across namespaces by users with template read permissions. Remove embedded secrets, such as SSH private keys, passwords,
and tokens, before you save or share a template.

## Create VMs from Templates

1. In the VM creation wizard, select **Template** as the source type.

2. Select the namespace and template.

3. Review the defaults that the template applies to compute, storage, network, and hardware settings.

4. Override any values required for the new VM.

5. Set the VM name and complete the wizard.

If the template contains cloud-init data, the **Lifecycle** step pre-fills the **User Data** and **Network Data**
fields. Edit these values to customize the new VM. If the template uses ConfigDrive, Launchpad displays a **Datasource:
ConfigDrive** indicator in the Lifecycle step.

## Edit Templates

1. Navigate to **Workloads** > **Templates**.

2. Select a template name to open its detail page, or use the row actions menu.

3. Edit the template using the form or YAML editor.

4. Save the template.

Template edits affect only VMs you create after the edit. Existing VMs keep their original configuration.

## Export and Import Templates

### Export a Template

1. Open the template detail page.

2. Select **Export** to download the template manifest as a JSON file.

The export includes the full `VmTemplate` spec and metadata.

### Import a Template

1. Navigate to **Workloads** > **Templates**.

2. Select **Import Template**.

3. Select or drop the JSON file.

4. Review the template.

5. If a template with the same name exists, choose whether to reconcile the template or skip the import.

6. Complete the import.

When you import a template that references a CPU model the current cluster does not expose, Launchpad preserves the CPU
model value. The **CPU Model** dropdown displays the model as unsupported and warns that VMs using it may fail to
schedule. Select a supported CPU model before you create a VM, or add a node that provides the required CPU features.

## Template Annotations

The template wizard exposes user annotations in the Source step. These annotations are stored on the `VmTemplate`
resource and are carried forward when users create VMs from the template.

The following annotations are managed by Launchpad and are not editable through the user annotations field.

| **Annotation**                                 | **Set By**                   | **Purpose**                                                                        |
| ---------------------------------------------- | ---------------------------- | ---------------------------------------------------------------------------------- |
| `vmo-manager.spectrocloud.com/snapshot-policy` | Lifecycle step               | Identifies the snapshot policy to attach to VMs created from the template.         |
| `kubevirt.io/disablePCIHole64`                 | Disable PCI Hole 64 checkbox | Provides compatibility for legacy Windows guest operating systems on Q35 machines. |
| `app.kubernetes.io/managed-by`                 | Launchpad                    | Marks the resource as managed by Launchpad.                                        |

## Best Practices

- Use sealed and generalized golden images instead of one-off VM disks.
- Version template names, such as `ubuntu-22-04-v1` and `ubuntu-22-04-v2`, when you iterate on a template.
- Add a display name and description so users can identify the template.
- Attach a snapshot policy at the template level for workloads that need automatic backups.

## Next Steps

After you deploy your first template, follow the [Create Your First VM](../quick-start.md) guide to deploy your first
VM.
