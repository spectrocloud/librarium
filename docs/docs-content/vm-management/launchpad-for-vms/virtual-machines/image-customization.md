---
sidebar_label: "Customize Images"
title: "Create Scripts to Customize Images"
description: "Learn how to create customization scripts to use with golden images."
icon: " "
hide_table_of_contents: false
sidebar_position: 10
tags: ["vmo", "vm launchpad", "golden images", "customization", "scripts"]
---

In Launchpad for VMs, customization templates define seal and generalize scripts for golden image finalization. They
prepare the OS for cloning by removing machine-specific data and assigning a unique identity to each clone. Create
custom customization templates for other Linux distributions, such as Alpine, Arch, and SUSE. You can also create custom
templates when you need to modify seal logic, include cleanup scripts, include custom scripts, or complete security
hardening and compliance checks.

## Customization Templates

A **customization template** is a reusable script (or script reference) that runs inside the builder VM during the
**Finalize** step. The script:

- Cleans cloud-init state, SSH host keys, machine-id, logs, and caches.
- Removes network persistence, such as `udev` rules and DHCP leases.
- Runs `sysprep` with generalize and shutdown for Windows.
- Prepares the image for cloning without identity conflicts.

Launchpad stores customization templates as CRDs and manages them under **Image Catalog** > **Customization Templates**.

## Built-in Templates

Launchpad includes built-in customization templates.

| **Template**               | **OS Type** | **Description**                                                                                                                                          |
| -------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ubuntu / Debian**        | ubuntu      | Generalize Ubuntu or Debian: cloud-init cleanup, remove SSH host keys, truncate machine-id, clear logs and history.                                      |
| **RHEL / CentOS / Fedora** | `rhel`      | Generalize the RHEL family: cloud-init cleanup, unregister subscription-manager, remove SSH host keys, truncate machine-id.                              |
| **Windows**                | windows     | Generalize Windows: run `sysprep` with `/generalize /oobe /shutdown`. Also installs QEMU guest agent from the Launchpad package server before `sysprep`. |

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

The customization template is available on the **Finalize Template** page.

### Script Requirements

- **Linux**: Bash script. Must complete successfully. Avoid shell options that stop the script after the first error if
  you need partial cleanup to succeed. The script runs as root. End with `sync` and a clear completion message.
- **Windows**: Batch or PowerShell. Must run `sysprep` or another generalization tool. The Windows built-in template
  uses `sysprep` with `/generalize /oobe /shutdown`.

## Auto-Install Scripts

**Auto-install scripts** differ from customization templates. They run during **OS installation** (first boot of the
builder VM), not during finalization.

| **OS**      | **Format**       | **Purpose**                                                                      |
| ----------- | ---------------- | -------------------------------------------------------------------------------- |
| **Linux**   | Cloud-init YAML  | `preseed`, kickstart, or cloud-init `autoinstall` to automate OS installation.   |
| **Windows** | Autounattend.xml | Unattended installation answers (product key, disk partitioning, user creation). |

Launchpad manages auto-install scripts under **Image Catalog** > **Auto Install Scripts**. When building a golden image,
you select an auto-install script to inject into the builder VM's cloud-init or to attach as Autounattend.xml.

### How Templates and Auto-Install Work Together

1. **Build**: The builder VM boots with an ISO and auto-install script. The OS installs unattended.
2. **Finalize**: After the OS is installed, you run finalization with a customization template. The seal script
   generalizes the image.

Use auto-install scripts to install the OS. Use customization templates to prepare the image for cloning.

## Apply Templates during Finalization

When you select **Finalize** on a builder VM, Launchpad applies the template in the following order.

1. The finalization page loads available customization templates.
2. Launchpad filters templates by **guest OS**. It infers the guest OS from the builder VM or uses the value you select.
   - Ubuntu/Debian builders display Ubuntu/Debian and generic Linux templates.
   - RHEL/CentOS/Fedora builders display RHEL-family templates.
   - Windows builders display Windows templates.
3. You select a customization template (or "None" for basic finalization).
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
