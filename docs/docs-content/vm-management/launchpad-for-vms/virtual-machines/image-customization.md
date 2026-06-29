---
sidebar_label: "Finalization Templates"
title: "Create Finalization Templates"
description: "Learn how to create finalization templates and scripts for golden images."
icon: " "
hide_table_of_contents: false
sidebar_position: 2
tags: ["vmo", "vm launchpad", "golden images", "customization", "scripts"]
---

In Launchpad for VMs, finalization templates define seal and generalize scripts for [golden image](./golden-images.md)
finalization. They prepare the OS for cloning by removing machine-specific data and assigning a unique identity to each
clone. Create custom finalization templates for other Linux distributions, such as Alpine, Arch, and SUSE. You can also
create custom templates when you need to modify seal logic, include cleanup scripts, include custom scripts, or complete
security hardening and compliance checks.

## Finalization Templates

A **finalization template** is a reusable script (or script reference) that runs inside the builder VM during the
**Finalize** step. The script:

- Cleans cloud-init state, SSH host keys, machine-id, logs, and caches.
- Removes network persistence, such as `udev` rules and DHCP leases.
- Runs `sysprep` with generalize and shutdown for Windows.
- Prepares the image for cloning without identity conflicts.

Launchpad stores finalization templates as CRDs and manages them under **Image Catalog** > **Finalize Templates**.

<!-- vale write-good.TooWordy = NO -->

## Built-in Finalize Templates

<!-- vale write-good.TooWordy = YES -->

Launchpad includes built-in finalization templates.

| **Template**               | **OS Type**     | **Description**                                                                                                                                                           |
| -------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **RHEL / CentOS / Fedora** | `rhel/centos`   | Generalize the RHEL family: cloud-init cleanup, unregister subscription-manager, remove SSH host keys, truncate machine-id.                                               |
| **Ubuntu / Debian**        | `ubuntu/debian` | Generalize Ubuntu or Debian: cloud-init cleanup, remove SSH host keys, truncate machine-id, clear logs and history.                                                       |
| **Windows**                | `windows`       | Generalize Windows: run `sysprep` with `/generalize /oobe /shutdown`. Also installs QEMU guest agent from the Launchpad [package server](./packages.md) before `sysprep`. |

You can reference built-in templates when you create custom templates. Launchpad prevents deletion of built-in
templates.

### Create a Custom Template

1. Navigate to **Image Catalog** > **Finalize Templates**.
2. Select **Create Template**.
3. Complete the following fields on the **Create Finalize Template** page and select **Create**.

   | **Parameter**   | **Description**                                                                                                                      |
   | --------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
   | **Name**        | Enter a unique name for the template.                                                                                                |
   | **Description** | Enter a description for the template.                                                                                                |
   | **OS Type**     | `linux`, `windows`, `ubuntu`, `rhel`, or another supported value. Launchpad uses this value to filter templates during finalization. |
   | **Script**      | Select the option on how to add the script: **Editor**, **Template**, **Upload**, or **URL**.                                        |

The finalization template is available on the **Finalize Template** page.

#### Script Behavior by OS

| **OS**      | **Script Type**     | **Requirements**                                                                                                                                                                                            |
| ----------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Linux**   | Bash                | Must complete successfully. Avoid shell options that stop the script after the first error if you need partial cleanup to succeed. The script runs as root. End with `sync` and a clear completion message. |
| **Windows** | Batch or PowerShell | Must run `sysprep` or another generalization tool. The built-in Windows template uses `sysprep` with `/generalize /oobe /shutdown`.                                                                         |

## Apply Templates during Finalization

When you select **Finalize** on a builder VM, Launchpad applies the template in the following order.

1. The finalization page loads available finalization templates.
2. Launchpad filters templates by **OS Type**. It infers the guest OS from the builder VM or uses the value you select.
   - `ubuntu/debian` builders display Ubuntu/Debian and generic Linux templates.
   - `rhel/centos/fedora` builders display RHEL-family templates.
   - `windows` builders display Windows templates.
   - `other` builders display any templates for a guest OS not supported by the other templates.
3. You select a finalization template (or "None" for basic finalization).
4. The system stops the VM, ejects media, starts the VM, waits for the guest agent, and then runs the selected
   template's script through cloud-init or a similar mechanism.
5. When the script completes, the system stops the VM and cleans up the builder. The DataVolume is the sealed golden
   image.

## Template Selection Priority

When you open the finalization page, the system picks a default template in this order.

1. **Pre-selected from builder**: If the builder VM has an annotation with a template ID, the system selects that
   template.
2. **Match by guest OS**: The first template whose `osType` matches the guest OS. For example, `ubuntu` matches Ubuntu
   and `windows` matches Windows.
3. **First built-in**: The first built-in template.
4. **First available**: The first template in the list.

You can override the selection before starting finalization.

## Auto-Install Scripts

**Auto-install scripts** differ from finalization templates. They run during **OS installation** (first boot of the
builder VM), not during finalization.

| **OS**      | **Format**       | **Purpose**                                                                      |
| ----------- | ---------------- | -------------------------------------------------------------------------------- |
| **Linux**   | Cloud-init YAML  | `preseed`, kickstart, or cloud-init `autoinstall` to automate OS installation.   |
| **Windows** | Autounattend.xml | Unattended installation answers (product key, disk partitioning, user creation). |

Launchpad manages auto-install scripts under **Image Catalog** > **Auto Install Scripts**. The page lists each script
with its name, OS type, and description. When building a golden image, you select an auto-install script to inject into
the builder VM's cloud-init or to attach as Autounattend.xml. Set a script as the OS default to auto-populate the
builder for that OS.

### Built-in Auto Install Scripts

Launchpad includes built-in auto-install scripts.

| **Script**                                 | **OS Type**       | **Description**                                                                                                                                                                                   |
| ------------------------------------------ | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **RHEL / CentOS Kickstart**                | `RHEL / CentOS`   | Minimal Kickstart configuration for unattended RHEL or CentOS installation.                                                                                                                       |
| **Ubuntu Autoinstall (Jammy-only)**        | `Ubuntu / Debian` | Cloud-init `autoinstall` configuration for unattended Ubuntu Server installation. The airgap variant targets Ubuntu 22.04 (Jammy) only, while the connected variant works across Ubuntu releases. |
| **Windows Unattend (legacy)**              | `Windows`         | Basic Autounattend.xml for unattended Windows installation with OOBE bypass.                                                                                                                      |
| **Windows 11 / Server 2022+ Autounattend** | `Windows`         | Autounattend.xml for unattended Windows 11 and Windows Server 2022 or newer installation, with EFI partitioning and OOBE bypass.                                                                  |

You can reference or copy a built-in script when you create your own.

### Create an Auto Install Script

1. Navigate to **Image Catalog** > **Auto Install Scripts**.

2. Select **Create Script**.

3. Complete the following fields in the **Create Auto Install Script** dialog and select **Create**.

   | **Parameter**    | **Description**                                                                                                                                                    |
   | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | **Name**         | Enter a unique name for the script.                                                                                                                                |
   | **Description**  | Enter an optional description for the script.                                                                                                                      |
   | **OS Type**      | Select the target OS, such as **RHEL / CentOS**, **Ubuntu / Debian**, or **Windows**. Select **Custom** for another OS.                                            |
   | **OS Default**   | Select this option to set the script as the default for its OS type. Launchpad auto-populates the script in the builder when you build a golden image for that OS. |
   | **Script**       | Select how to add the script: **Editor**, **Template**, **Upload**, or **URL**. Linux scripts use cloud-init YAML, and Windows scripts use Autounattend.xml.       |
   | **Network Data** | Optionally provide Netplan network configuration to apply during installation.                                                                                     |

### How Templates and Auto-Install Work Together

1. **Build**: The [golden image builder VM](./golden-images.md#build-the-os) boots with an ISO and auto-install script.
   The OS installs unattended.
2. **Finalize**: After the OS is installed, you apply a finalization template. The seal script generalizes the image.

Use auto-install scripts to install the OS. Use finalization templates to prepare the image for cloning.
