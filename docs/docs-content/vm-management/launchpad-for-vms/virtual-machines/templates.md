---
sidebar_label: "Template Management"
title: "Template Management"
description: "Learn how to manage templates in VM Launchpad."
icon: " "
hide_table_of_contents: false
sidebar_position: 4
tags: ["vmo", "vm launchpad", "templates"]
---

VM templates in Launchpad for VMs define reusable VM specifications for base image, compute, network, storage, and
hardware settings. Create VMs from templates to standardize provisioning across teams.

## Namespace Limitations

Templates are also the required mechanism for provisioning a VM across namespaces. When you create a VM, you can only
select an ISO, golden image, or other source DataVolume that resides in the **same namespace** as the VM. If the source
lives in a different namespace, it is not selectable, and the source list appears empty. Because templates are
cluster-scoped, creating a template from the source lets you launch VMs from it in any namespace you can access. To use
a [golden image](./golden-images.md) or ISO from one namespace in another namespace, create a template from it first.

## Template Overview

A `VmTemplate` resource stores a reusable VM configuration with the following components.

| **Component** | **Description**                                                                         |
| ------------- | --------------------------------------------------------------------------------------- |
| Source        | A DataVolume template that clones from a golden image or persistent volume claim (PVC). |
| Compute       | CPU, memory, instance type, run strategy, and eviction strategy.                        |
| Storage       | Root disk size, StorageClass, and extra disks.                                          |
| Network       | Pod network and Multus Network Attachment Definition (NAD) interfaces.                  |
| Hardware      | Firmware, devices, features, and other KubeVirt hardware settings.                      |

Cluster-scoped templates let any user with template read permissions list and read templates from any namespace. Review
[Cross-Namespace Disclosure](#cross-namespace-disclosure) before you save a VM that contains inline cloud-init data as a
template.

## Create a Template

You can create a template from a [golden image](./golden-images.md) DataVolume or another source disk. For shared
templates, use a sealed and generalized golden image as the source.

1. Navigate to **Workloads** > **Templates**.

2. Select **New Template** > **New VM Template** to start the template wizard. You can also select **Create User Data
   Template** to create a custom `cloud-init` YAML configuration for VMs that use Linux or BSD templates. Select
   **Import from YAML** to import a generated YAML template.

3. The VM creation wizard opens in template mode. Complete the following fields on the **Source** wizard step, and
   select **Next**.

   | **Parameter**           | **Description**                                                                                                                                                                                                                                                                                                                                                                                                      |
   | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Name**                | Enter the hostname for the template. This name cannot contain more than 63 characters.                                                                                                                                                                                                                                                                                                                               |
   | **Display Name**        | Enter the human-readable display name for the template.                                                                                                                                                                                                                                                                                                                                                              |
   | **Source DV Namespace** | Select the namespace that contains the DataVolume.                                                                                                                                                                                                                                                                                                                                                                   |
   | **Source DataVolume**   | Select the DataVolume to use for the template, such as a golden image.                                                                                                                                                                                                                                                                                                                                               |
   | **Guest OS**            | Select either Linux or Windows.                                                                                                                                                                                                                                                                                                                                                                                      |
   | **Network Namespace**   | Select the namespace for the network.                                                                                                                                                                                                                                                                                                                                                                                |
   | **VM Preference**       | In the **Filter preferences** field, enter the operating system family name, or select the operating system family from the available options. Linux distributions appear for Linux **Guest OS** selection, and Windows preferences appear only for Windows **Guest OS** selection.                                                                                                                                  |
   | **Labels**              | Enter key-value pair labels to add to your template.                                                                                                                                                                                                                                                                                                                                                                 |
   | **Annotations**         | Enter key-value pair Kubernetes annotations to add to your template. Select **Disable PCI Hole 64-bit** when you use legacy operating systems, such as Windows XP or Windows 2003. VM Launchpad sets the `kubevirt.io/disablePCIHole64: "true"` annotation on the VMI template spec. Refer to [Running legacy Windows versions](https://kubevirt.io/user-guide/user_workloads/legacy_windows/) for more information. |

4. On the **Compute** wizard step, select **Instance Type** to use predefined instance types, or select **Custom** to
   set CPU and memory resource options manually.

   | **Mode**          | **Description**                                                                                                                                                      |
   | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Instance Type** | Select a predefined CPU and memory profile. The `u1` prefix indicates general-purpose types with balanced CPU and memory.                                            |
   | **Custom**        | Set CPU and memory resources manually. Consider what the operating system and any applications running in the operating system need before you select custom values. |

   For more about instance types and preferences, refer to [Instance Types & Preferences](./instance-types.md).

   :::warning

   If you select an instance type during VM creation, you cannot change the CPU cores, CPU sockets, CPU threads, or
   memory individually. You can change the instance type after provisioning, but the new CPU and memory values do not
   take effect until you restart the VM.

   :::

   If you select **Custom**, configure the following parameters.

   | **Parameter**                  | **Description**                                                                                                                        |
   | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
   | **CPU Cores**                  | Enter the number of vCPUs for the VM. This value is visible to the guest operating system.                                             |
   | **Memory**                     | Enter the amount of memory for the VM and select `Gi` for gigabytes or `Mi` for megabytes.                                             |
   | **Run Strategy**               | From the drop-down menu, select **Always**, **RerunOnFailure**, **Manual**, or **Halted** for the VM default power behavior.           |
   | **Resource Requests & Limits** | Optional. Control Kubernetes resource reservations for overcommit and QoS. Set memory requests lower than guest memory for overcommit. |

5. In the **Scheduling** section, select the eviction and scheduling strategy for the template. Select **Next**.

   | **Parameter**         | **Description**                                                                                                                                                                                                                              |
   | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Eviction Strategy** | From the drop-down menu, select **LiveMigrate**, **LiveMigrateIfPossible**, or **None**. Refer to [Kubervirt's Eviction Strategy](https://kubevirt.io/api-reference/main/definitions.html) for more information.                             |
   | **Grace Period**      | Enter the number of seconds to allow a VM to shut down cleanly before it is forcefully terminated.                                                                                                                                           |
   | **Priority Class**    | Enter a priority class value. Kubernetes schedules VMs with a higher priority number before VMs with a lower priority number.                                                                                                                |
   | **Start Strategy**    | From the drop-down menu, select **Normal** or **Paused**.                                                                                                                                                                                    |
   | **Node Selector**     | Enter the key-value pair to schedule VMs created from the template onto nodes with each specified label.                                                                                                                                     |
   | **Tolerations**       | Select **Add Toleration** to add any taints needed for the template. Refer to [Taints and Tolerations](../../../clusters/cluster-management/taints.md) for more information.                                                                 |
   | **Affinity Rules**    | Select **Node Affinity**, **Pod Affinity**, or **Pod Anti-Affinity**. Then select **Required during scheduling** or **Preferred during scheduling**. You can also add **Match Expressions** and **Match Fields** to filter affinity choices. |

6. On the **Storage** wizard step, verify that a root disk is configured. The root disk is automatically populated from
   the ISO you selected in the **Source** step. Adjust the disk size in `Gi` or `Mi`. When you create a VM from a
   template, this value overrides the template default value.

7. Select the **Storage Class** from the drop-down menu.

8. _(Optional)_ Add extra disks by selecting **Add Disk**, and add extra CD-ROMs by selecting **Add CD-ROM**.

9. Select the **Boot Order** for the VM. By default, **Disk** is selected. You can also boot from **Network**. Then
   select **Next**.

10. On the **Network** wizard step, the VM has one interface assigned with the **Pod Network (masquerade)** mode by
    default. This option provides outbound connectivity through NAT. Select **Add NIC** to add extra NICs as needed, and
    select either **Pod Network (masquerade)** or **Multus Network (bridge)**. You can create extra Network Attachment
    Definition (NAD) resources in **Infrastructure** > **Networks**.

    Under **DNS Settings**, you can optionally define the Hostname and Subdomain for the VM.

    When batch mode is enabled and you have bridge NICs, a **Batch Static IP Assignment** section appears. Enter
    IP/CIDR, gateway, and DNS for each VM. Use **Fill Down** to auto-increment IPs by incrementing the last octet (for
    example, `192.168.1.10/24` → `192.168.1.11/24`, `192.168.1.12/24`). Then select **Next**.

    The file server is available on the **Pod Network (masquerade)** network. If you need to install QEMU or other
    binaries, install them during the golden image build over the **Pod Network (masquerade)** network.

11. _(Optional)_ For **Hardware**, configure any advanced hardware settings required for the VM. You can skip this step
    for basic VMs. Then select **Next**.

    <Tabs>

    <TabItem value="firmware" label="Firmware">

    | **Setting**                  | **Description**                                             |
    | ---------------------------- | ----------------------------------------------------------- |
    | **UEFI / EFI Boot**          | Enable UEFI instead of BIOS.                                |
    | **Secure Boot**              | Requires EFI. Enables SMM.                                  |
    | **Persistent EFI Variables** | Persist NVRAM. Requires the VMPersistentState feature gate. |
    | **Machine Type**             | Override the default machine type, such as `q35`.           |
    | **SMBIOS**                   | Optionally configure UUID and serial values.                |

    </TabItem>

    <TabItem value="cpu-advanced" label="CPU Advanced">

    | **Setting**                   | **Description**                                                         |
    | ----------------------------- | ----------------------------------------------------------------------- |
    | **CPU Model**                 | Select `host-passthrough` or `host-model`.                              |
    | **Dedicated CPU Placement**   | Pin vCPUs to physical cores.                                            |
    | **NUMA Topology Passthrough** | Pass host NUMA topology to the guest.                                   |
    | **CPU Features**              | Add require, force, disable, or forbid rules for specific CPU features. |

    </TabItem>

    <TabItem value="devices" label="Devices">

    | **Setting**         | **Description**                                                            |
    | ------------------- | -------------------------------------------------------------------------- |
    | **Virtio RNG**      | Add a random number generator.                                             |
    | **Tablet Input**    | Add a USB input device for pointer precision.                              |
    | **Headless**        | Create the template without a graphics device.                             |
    | **Video Type**      | Select Default VGA, Virtio, VGA or Bochs.                                  |
    | **TPM**             | Add a Trusted Platform Module. The TPM uses ephemeral or persistent state. |
    | **USB Redirection** | Enable client passthrough. Requires KubeVirt 0.44 or later.                |

    </TabItem>

    <TabItem value="features" label="Features">

    | **Setting**               | **Description**                                                         |
    | ------------------------- | ----------------------------------------------------------------------- |
    | **ACPI** and **APIC**     | Enable ACPI or APIC. VM Launchpad enables these settings by default.    |
    | **HyperV Enlightenments** | Configure Windows VM settings, such as relaxed, VAPIC, and `spinlocks`. |

    </TabItem>

    <TabItem value="clock-and-timers" label="Clock and Timers">

    | **Setting**    | **Description**                             |
    | -------------- | ------------------------------------------- |
    | **Clock Mode** | Select UTC or timezone.                     |
    | **Timers**     | Configure PIT, RTC, HPET, or HyperV timers. |

    </TabItem>

    <TabItem value="memory" label="Memory">

    | **Setting**                   | **Description**                                                |
    | ----------------------------- | -------------------------------------------------------------- |
    | **Hugepages**                 | Enable large memory pages and set the page size to 2Mi or 1Gi. |
    | **Overcommit Guest Overhead** | Exclude per-VM overhead from the memory request.               |

    </TabItem>

    <TabItem value="security" label="Security">

    | **Setting**                | **Description**                                                      |
    | -------------------------- | -------------------------------------------------------------------- |
    | **Confidential Computing** | Select AMD SEV, SEV-SNP, or Intel TDX when supported by the cluster. |

    </TabItem>

    <TabItem value="host-devices" label="Host Devices">

    | **Setting**                | **Description**                                                                                               |
    | -------------------------- | ------------------------------------------------------------------------------------------------------------- |
    | **PCI or GPU passthrough** | Attach PCI or GPU devices discovered and registered in KubeVirt. Use **Cluster Device Management** if needed. |

    </TabItem>

    </Tabs>

    The **CPU Model** drop-down menu is populated dynamically from the cluster and lists only the models supported by at
    least one worker node that can schedule VMs, discovered from KubeVirt's
    `cpu-model-migration.node.kubevirt.io/<Model>` node labels. The discovered model list is cached for up to three
    minutes.

    If a VM or template references a model the cluster does not expose, the drop-down menu preserves it as
    `<ModelName> (unsupported in current cluster)` so the value is not silently dropped. VM Launchpad also warns you
    when the selected CPU model is unavailable on all nodes or is available only on some nodes.

12. On the **Lifecycle** page, configure snapshot policy and Cloud-Init settings. Snapshot policies define automatic
    snapshot schedules, including interval, retention count, and time window. VMs created from a template inherit the
    template's snapshot policy annotation if one is set.

    The following table describes the snapshot policy options. Refer to [Snapshot Policies](./snapshots.md) for more
    information.

    <details>

    <summary>Display Snapshot Policy settings.</summary>

    | **Setting**         | **Description**                                                                                                         |
    | ------------------- | ----------------------------------------------------------------------------------------------------------------------- |
    | **Snapshot Policy** | Use **None (no snapshot policy)**, or select a snapshot policy to attach to the VM after creation.                      |
    | **Create**          | Select **Create** to launch the **Create Snapshot Policy** mini-wizard.                                                 |
    | **Display Name**    | Enter the user-facing name for the snapshot policy.                                                                     |
    | **Resource Name**   | Enter the Kubernetes resource name for the snapshot policy.                                                             |
    | **Description**     | Enter an optional description for the snapshot policy.                                                                  |
    | **Interval**        | Select the automatic snapshot interval. Intervals range from every hour to every seven days.                            |
    | **Max Retention**   | Enter the number of snapshots to keep per VM. Shorter intervals and higher retention values can increase storage usage. |

    </details>

    The following table describes the **Cloud-Init** options.

    <details>

    <summary>Display Cloud-Init settings.</summary>

    | **Setting**                         | **Description**                                                                                                                                                                                                                                                                                    |
    | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Data source indicator**           | View the data source used by the VM. A **ConfigDrive data source inherited from template** badge appears when a template forces ConfigDrive.                                                                                                                                                       |
    | **Install QEMU guest agent?**       | Select **Yes** or **No**. This field is required before VM creation. Select **Yes** to install the guest agent through cloud-init.                                                                                                                                                                 |
    | **Use internal package repository** | Keep the internal Launchpad repository configured in the guest after the guest agent installation. This field appears only when guest agent installation is enabled.                                                                                                                               |
    | **User Data**                       | Enter cloud-init user data with the **Cloud-Init Editor**. Linux cloud-init content typically begins with `#cloud-config`.                                                                                                                                                                         |
    | **Network Data**                    | Optionally enter Netplan v2 YAML for interfaces, static IPs, routes, and nameservers at first boot. If you assigned static bridge IPs in the **Network** step, VM Launchpad automatically generates and merges network data on submit. Use the **Network Data** field only for advanced overrides. |

    </details>

    :::warning

    If you enable guest agent installation, upload the `qemu-guest-agent` package for your operating system and
    architecture to the internal repository under **Image Catalog** > **Packages** before launching the VM. Otherwise,
    the agent installation fails. This reminder does not block VM creation.

    :::

    _(Optional)_ Access the **Cloud-Init Editor** by selecting **Cloud-Init Configuration** under **User Data**. The
    editor supports the following user data input modes.

    <details>

    <summary>User data input modes</summary>

    | **Mode**     | **Description**                                                                                                                                                                                                                |
    | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | **Editor**   | Type or paste the payload directly.                                                                                                                                                                                            |
    | **Template** | Select a cloud-init config from the **Auto-Install Scripts** catalog. The list is filtered to cloud-init entries only because auto-install installer scripts have no effect on a VM that boots from an already-installed disk. |
    | **Upload**   | Load a `.yaml` or `.txt` file from your machine.                                                                                                                                                                               |
    | **URL**      | Fetch the payload from a reachable URL. Your browser performs the fetch.                                                                                                                                                       |

    </details>

    :::warning

    Cloud-init runs only at first boot. Changes to user data or network data after the VM boots do not run again unless
    you issue the `cloud-init clean` command and reboot.

    :::

13. On the **Review** page, verify the settings for the template and edit as needed.

14. Select **Create Template**. VM Launchpad saves the template as a `VmTemplate` custom resource.

Windows VMs follow the same template creation flow. You do not need to configure cloud-init for Windows templates.

## Create a Template from an Existing VM

1. Navigate to **Workloads** > **Virtual Machines**. Select the VM you want to create a template from.

2. Select the VM you want to use as a template and select **Save as Template** from the VM actions menu.

   ![Screenshot of VM actions mention Save as Template](/vmo/vm-management_vmo_templates_save-vm-template-4-9.webp)

3. On the **Save as a Template** page, review the configuration that VM Launchpad pre-fills from the VM.

4. Update any values that should differ from the source VM, enter an optional description, and select **Create
   Template**.

When you create a template from an existing VM, the template references the VM's root disk or source DataVolume as the
clone source. Use sealed and generalized golden images as template sources whenever possible.

## Template Generalization {#cross-namespace-disclosure}

When a template generalizes the OS for cloning purposes, the workflow preserves certain fields, and removes others. VM
Launchpad copies the following fields from the source VM into the template.

#### Generalization Fields Added

| **Field**                           | **Description**                                                                                                            |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| cloud-init                          | Inline `userData` and `networkData` values for NoCloud and ConfigDrive data sources.                                       |
| Compute                             | CPU topology, memory, and instance type reference.                                                                         |
| Firmware                            | Bootloader mode, Secure Boot, kernel boot, and ACPI settings. VM Launchpad removes per-VM firmware UUID and serial values. |
| Preference                          | The `spec.preference` reference, when set.                                                                                 |
| Networks and disks                  | Interface bindings, NAD references, and disk topology.                                                                     |
| Hardware                            | Devices, feature flags, clock settings, and timer settings.                                                                |
| User-applied labels and annotations | Team tags, cost center labels, and other user metadata.                                                                    |

#### Generalization Fields Removed

The following table displays the fields that VM Launchpad removes. These fields can contain per-VM, security-sensitive,
or namespace-bound values.

| **Field**                    | **Description**                                                                     |
| ---------------------------- | ----------------------------------------------------------------------------------- |
| cloud-init Secret references | `userDataSecretRef` and `networkDataSecretRef` values.                              |
| Access credentials           | SSH key injection that references the original VM creator's Secrets.                |
| MAC addresses                | Interface MAC addresses that could collide when the template creates new VMs.       |
| Hostname and subdomain       | Per-VM identity fields.                                                             |
| Run strategy                 | The create-from-template flow decides whether the new VM starts automatically.      |
| KubeVirt-managed metadata    | KubeVirt, CDI, and wizard breadcrumb annotations that do not represent user intent. |

If VM Launchpad removes a field, the success dialog lists the removed fields so you can reattach anything required for
future VMs.

:::warning

To avoid cross-namespace disclosure issues, users with template read permissions can read inline cloud-init `userData`
and `networkData` values in cluster-scoped templates across namespaces. Before you save or share a template, remove
embedded secrets, such as SSH private keys, passwords, and tokens.

:::

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

3. Select the JSON file.

4. Review the template.

5. If a template with the same name exists, choose whether to reconcile the template or skip the import.

6. Complete the import.

When you import a template that references a CPU model the current cluster does not expose, VM Launchpad preserves the
CPU model value. The **CPU Model** drop-down menu displays the model as unsupported and warns that VMs using it may fail
to schedule. Select a supported CPU model before you create a VM, or add a node that provides the required CPU features.

## Template Annotations

The template wizard exposes user annotations in the Source step. VM Launchpad stores these annotations on the
`VmTemplate` resource and carries them forward when users create VMs from the template.

VM Launchpad manages the following annotations, so users cannot edit them through the user annotations field.

| **Annotation**                                 | **Set By**                       | **Purpose**                                                                        |
| ---------------------------------------------- | -------------------------------- | ---------------------------------------------------------------------------------- |
| `vmo-manager.spectrocloud.com/snapshot-policy` | Lifecycle step                   | Identifies the snapshot policy to attach to VMs created from the template.         |
| `kubevirt.io/disablePCIHole64`                 | **Disable PCI Hole 64** checkbox | Provides compatibility for legacy Windows guest operating systems on Q35 machines. |
| `app.kubernetes.io/managed-by`                 | VM Launchpad                     | Marks the resource as managed by VM Launchpad.                                     |

## Best Practices

- Use sealed and generalized golden images instead of one-off VM disks.
- Version template names, such as `ubuntu-22-04-v1` and `ubuntu-22-04-v2`, when you iterate on a template.
- Add a display name and description so users can identify the template.
- Attach a snapshot policy at the template level for workloads that need automatic backups.

## Next Steps

After you deploy your template, follow the [Create A VM](./creating.md) guide to deploy the VM.
