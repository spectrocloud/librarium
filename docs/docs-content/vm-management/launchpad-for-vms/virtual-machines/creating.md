---
sidebar_label: "Creating VMs"
title: "Creating VMs"
description: "Learn how to create VMs using the VM Launchpad Appliance"
icon: " "
hide_table_of_contents: false
sidebar_position: 10
tags: ["vmo", "vm launchpad"]
---

This guide walks through the VM creation wizard and batch creation options in Launchpad.

## Overview

The VM creation wizard guides you through seven steps: **Source**, **Compute**, **Storage**, **Network**, **Hardware**,
**Lifecycle**, and **Review**. Each step configures a different aspect of the virtual machine. The wizard supports
creating VMs from [templates](./templates.md), [golden images](./golden-images.md), ISOs, or blank disks.

:::tip

Use the **Advanced** button to open the YAML preview drawer. The preview updates live as you change selections in each
step.

:::

## Prerequisites

- A cluster created using the Launchpad Appliance. Refer to [Install Launchpad for VMs](../install-vmla-iso.md) for
  guidance.

- Credentials to access the Launchpad UI hosted on your cluster. You can use either Keycloak OIDC credentials or local
  admin credentials configured during cluster creation.

## Create a Virtual Machine

After your ISO is uploaded, you are ready to deploy a VM.

1.  From the left main menu, select **Workloads** > **Virtual Machines**.

2.  Select **Create VM**.

    ![Screenshot showing Create VM button](/vmo/vm-management_vmo_first-vm-create-4-9.webp)

3.  The **Create Virtual Machine** wizard opens. Complete the following fields on the **Source** wizard step.

    | **Parameter** | **Description**                                                                                                                            |
    | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
    | **Source**    | Select **Image/ISO**.                                                                                                                      |
    | **OS**        | Select **Linux**.                                                                                                                          |
    | **Namespace** | Select the namespace that contains your ISO. For this guide, select `vmo-golden-images` where you uploaded your ISO.                       |
    | **VM Name**   | Enter a unique name for the VM. This field only accepts lowercase letters, numbers, and hyphens. The name must end with a letter or digit. |

4.  Configure any additional **Source** options for your VM. Select **Next** when you complete this page.

    | **Parameter**     | **Description**                                                                                                                                                                                                                                                                                                                                                                                             |
    | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Batch**         | Select **Create multiple VMs**. Under **Count**, enter the number of VMs to create. From the **Naming** drop-down menu, select the naming convention: `name-1, name-2` or `name01, name02`. Under **Start #**, enter the number where the naming convention begins.                                                                                                                                         |
    | **VM Preference** | In the **Filter preferences** field, enter the operating system family name, or select the operating system family from the available options. Linux distributions are available for Linux image/ISOs, and Windows preferences are available only for Windows image/ISOs.                                                                                                                                   |
    | **Labels**        | Enter key-value pair labels to add to your VM.                                                                                                                                                                                                                                                                                                                                                              |
    | **Annotations**   | Enter key-value pair Kubernetes annotations to add to your VM. Select **Disable PCI Hole 64-bit** when you use legacy operating systems, such as Windows XP or Windows 2003. Launchpad sets the `kubevirt.io/disablePCIHole64: "true"` annotation on the VMI template spec. Refer to [Running legacy Windows versions](https://kubevirt.io/user-guide/user_workloads/legacy_windows/) for more information. |

5.  On the **Compute** wizard step, select **Instance Type** to use predefined instance types, or select **Custom** to
    set CPU and memory resource options manually.

    | **Mode**          | **Description**                                                                                                                                                      |
    | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Instance Type** | Select a predefined CPU and memory profile. The `u1` prefix indicates general-purpose types with balanced CPU and memory.                                            |
    | **Custom**        | Set CPU and memory resources manually. Consider what the operating system and any applications running in the operating system need before you select custom values. |

    :::warning

    If you select an instance type during VM creation, you cannot change the CPU cores, CPU sockets, CPU threads, or
    memory. To change the instance type after provisioning, power off the VM, update the VM YAML file, and then restart
    the VM.

    :::

    If you select **Custom**, configure the following parameters.

    | **Parameter**                  | **Description**                                                                                                                        |
    | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
    | **CPU Cores**                  | Enter the number of vCPUs for the VM. This value is visible to the guest operating system.                                             |
    | **Memory**                     | Enter the amount of memory for the VM and select `Gi` for gigabytes or `Mi` for megabytes.                                             |
    | **Run Strategy**               | From the drop-down menu, select **Always**, **RerunOnFailure**, **Manual**, or **Halted** for the VM default power behavior.           |
    | **Resource Requests & Limits** | Optional. Control Kubernetes resource reservations for overcommit and QoS. Set memory requests lower than guest memory for overcommit. |

6.  In the **Scheduling** section, select the eviction strategy for the VM.

    | **Parameter**         | **Description**                                                                                                        |
    | --------------------- | ---------------------------------------------------------------------------------------------------------------------- |
    | **Eviction Strategy** | From the drop-down menu, select **LiveMigrate**, **LiveMigrateIfPossible**, or **None**.                               |
    | **Grace Period**      | Enter the number of seconds to allow a VM to shut down cleanly before it is forcefully terminated.                     |
    | **Priority Class**    | Enter a priority class value. VMs with a higher priority number are scheduled before VMs with a lower priority number. |
    | **Start Strategy**    | From the drop-down menu, select **Normal** or **Paused**.                                                              |

<!-- Grace Period and Priority class from Kubevirt as per JH -->

7. On the **Storage** wizard step, verify that a root disk is configured. The root disk is automatically populated from
   the ISO you selected in the **Source** step. Adjust the disk size in `Gi` or `Mi`. When you create a VM from a
   template, this value overrides the template default value.

8. Select the **Storage Class** from the drop-down menu.

9. (Optional) Add **Additional Disks** by selecting **Add Disk**, and add **Additional CD-ROMs** by selecting **Add
   CD-ROM**.

10. Select the **Boot Order** for the VM. By default, **Disk** is selected. Alternatively, you can boot from **CD-ROM**
    or **Network**. Then select **Next**.

11. On the **Network** wizard step, the VM has one interface assigned with the **Pod Network (masquerade)** mode by
    default. This option provides outbound connectivity via NAT. Select **Add NIC** to add additional NICs as needed,
    and select either **Pod Network (masquerade)** or **Multus Network (bridge)**. You can create additional Network
    Attachment Definitions (NADs) in **Infrastructure** > **Networks**.

    Under **DNS Settings**, you can optionally define the Hostname and Subdomain for the VM.

    When batch mode is enabled and you have bridge NICs, a **Batch Static IP Assignment** section appears. Enter
    IP/CIDR, gateway, and DNS for each VM. Use **Fill Down** to auto-increment IPs by incrementing the last octet (for
    example, `192.168.1.10/24` → `192.168.1.11/24`, `192.168.1.12/24`). Then select **Next**.

    :::info

    The file server is available on the **Pod Network (masquerade)** network. If you need to install QEMU or other
    binaries, install them during the golden image build over the **Pod Network (masquerade)** network.

    :::

12. For **Hardware** (optional), configure any advanced hardware settings required for the VM. This step can be skipped
    for basic VMs. Then select **Next**.

    <details>

    <summary>Display optional advanced hardware settings.</summary>

    | **Category**         | **Setting**                   | **Description**                                                                                               |
    | -------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------- |
    | **Firmware**         | **UEFI / EFI Boot**           | Enable UEFI instead of BIOS.                                                                                  |
    | **Firmware**         | **Secure Boot**               | Requires EFI. Enables SMM.                                                                                    |
    | **Firmware**         | **Persistent EFI Variables**  | Persist NVRAM. Requires the VMPersistentState feature gate.                                                   |
    | **Firmware**         | **Machine Type**              | Override the default machine type, such as `q35`.                                                             |
    | **Firmware**         | **SMBIOS**                    | Optionally configure UUID and serial values.                                                                  |
    | **CPU Advanced**     | **CPU Model**                 | Select `host-passthrough`, `host-model`, or a named model, such as `Skylake-Server` or `EPYC-Rome`.           |
    | **CPU Advanced**     | **Dedicated CPU Placement**   | Pin vCPUs to physical cores.                                                                                  |
    | **CPU Advanced**     | **NUMA Topology Passthrough** | Pass host NUMA topology to the guest.                                                                         |
    | **CPU Advanced**     | **CPU Features**              | Add require, force, disable, or forbid rules for specific CPU features.                                       |
    | **Devices**          | **Virtio RNG**                | Add a random number generator.                                                                                |
    | **Devices**          | **Tablet Input**              | Add a USB tablet for pointer precision.                                                                       |
    | **Devices**          | **Headless**                  | Create the VM without a graphics device.                                                                      |
    | **Devices**          | **Video Type**                | Select VGA, Virtio, or Bochs.                                                                                 |
    | **Devices**          | **TPM**                       | Add a Trusted Platform Module. The TPM can be ephemeral or persistent.                                        |
    | **Devices**          | **USB Redirection**           | Enable client passthrough. Requires KubeVirt 0.44 or later.                                                   |
    | **Features**         | **ACPI** and **APIC**         | Enable ACPI or APIC. These are usually enabled by default.                                                    |
    | **Features**         | **HyperV Enlightenments**     | Configure Windows VM settings, such as relaxed, VAPIC, and spinlocks.                                         |
    | **Clock and Timers** | **Clock Mode**                | Select UTC or timezone.                                                                                       |
    | **Clock and Timers** | **Timers**                    | Configure PIT, RTC, HPET, or HyperV timers.                                                                   |
    | **Memory**           | **Hugepages**                 | Enable hugepages and set the page size to 2Mi or 1Gi.                                                         |
    | **Memory**           | **Overcommit Guest Overhead** | Exclude per-VM overhead from the memory request.                                                              |
    | **Security**         | **Confidential Computing**    | Select AMD SEV, SEV-SNP, or Intel TDX when supported by the cluster.                                          |
    | **Host Devices**     | **PCI or GPU passthrough**    | Attach PCI or GPU devices discovered and registered in KubeVirt. Use **Cluster Device Management** if needed. |

    </details>

    :::info

    The **CPU Model** drop-down menu is populated dynamically from the cluster and lists only the models supported by at
    least one schedulable worker node, discovered from KubeVirt's `cpu-model-migration.node.kubevirt.io/<Model>` node
    labels. The discovered model list is cached for up to three minutes.

    If a VM or template references a model the cluster does not expose, the drop-down menu preserves it as
    `<ModelName> (unsupported in current cluster)` so the value is not silently dropped. Launchpad also warns you when
    the selected CPU model is unavailable on all nodes or is available only on some nodes.

    :::

13. On the **Lifecycle** page, configure snapshot policy and Cloud-Init settings.

    The following table describes the snapshot policy options. Refer to [Snapshot Policies](./snapshots.md) for more
    information.

    <details>

    <summary>Display Snapshot Policy settings.</summary>

    | **Setting**         | **Description**                                                                                                                   |
    | ------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
    | **Snapshot Policy** | Use **None (no snapshot policy)**, or select a snapshot policy to attach to the VM after creation.                                |
    | **Create**          | Select **Create** to launch the **Create Snapshot Policy** mini-wizard.                                                           |
    | **Display Name**    | Enter the user-facing name for the snapshot policy.                                                                               |
    | **Resource Name**   | Enter the Kubernetes resource name for the snapshot policy.                                                                       |
    | **Description**     | Enter an optional description for the snapshot policy.                                                                            |
    | **Interval**        | Select the automatic snapshot interval. Intervals range from every hour to every seven days.                                      |
    | **Max Retention**   | Enter the maximum number of snapshots to retain per VM. Shorter intervals and higher retention values can increase storage usage. |

    </details>

    :::info

    Snapshot policies define automatic snapshot schedules, including interval, retention count, and time window. VMs
    created from a template inherit the template's snapshot policy annotation if one is set.

    :::

    The following table describes the **Cloud-Init** options.

    <details>

    <summary>Display Cloud-Init settings.</summary>

    | **Setting**                         | **Description**                                                                                                                                                                                                                                                                                 |
    | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Datasource indicator**            | View the datasource used by the VM. A **Datasource: ConfigDrive (inherited from template)** badge appears when a template forces ConfigDrive.                                                                                                                                                   |
    | **Install QEMU guest agent?**       | Select **Yes** or **No**. This field is required before the VM can be created. Select **Yes** to install the guest agent through cloud-init.                                                                                                                                                    |
    | **Use internal package repository** | Keep the internal VMO repository configured in the guest after the guest agent installation. This field appears only when guest agent installation is enabled.                                                                                                                                  |
    | **User Data**                       | Enter cloud-init user data with the **Cloud-Init Editor**. Linux cloud-init content typically begins with `#cloud-config`.                                                                                                                                                                      |
    | **Network Data**                    | Optionally enter Netplan v2 YAML for interfaces, static IPs, routes, and nameservers at first boot. If you assigned static bridge IPs in the **Network** step, Launchpad automatically generates and merges network data on submit. Use the **Network Data** field only for advanced overrides. |

    </details>

    :::warning

    If you enable guest agent installation, upload the `qemu-guest-agent` package for your operating system and
    architecture to the internal repository under **Image Catalog** > **Packages** before launching the VM. Otherwise,
    the agent installation fails. This reminder does not block VM creation.

    :::

    (Optional) Access the **Cloud-Init Editor** by selecting **Cloud-Init Configuration** under **User Data**. The
    editor supports the following user data input modes.

    <details>

    <summary>Display the Cloud-Init editor.</summary>

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

14. Select **Finish** to provision your VM.

## Validate

1. From the left main menu of the Launchpad console, select **Workloads** > **Virtual Machines**.

2. Locate your VM in the list. The status column displays **Provisioning** while the VM is being created and changes to
   **Running** after the VM starts.

3. Select the VM to view its details, including IP address, the node the VM is running on, and metrics.

   :::info

   When the VM is running, you can change the CPU core count, CPU thread count, or memory, but you must restart the VM
   to apply the change. You can change the number of CPU sockets without restarting the VM, but this causes the VM to
   live migrate to another node in the cluster.

   :::

4. Select the **Console** tab to open a noVNC-based remote console. You can interact with the VM as if you were at its
   keyboard.

   ![Screenshot of a running VM console](/launchpad-for-vms_quick-start_console.webp)
