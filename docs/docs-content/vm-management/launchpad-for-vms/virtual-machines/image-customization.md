---
sidebar_label: "Customizing Images"
title: "Creating Scripts to Customize Images"
description: "Learn how to create customization scripts to use with golden images."
icon: " "
hide_table_of_contents: false
sidebar_position: 10
tags: ["vmo", "vm launchpad", "golden images", "customization", "scripts"]
---

<!-- vale off -->

Customization templates define seal and generalize scripts used during golden image finalization. They prepare the OS
for cloning by removing machine-specific data and ensuring each clone gets a unique identity. Create custom customization templates for other Linux distributions (for example, Alpine, Arch, SUSE, and others), if you need to modify the seal logic, if you need additional cleanup or custom scripts, or for security hardening and compliance checks.

## What Are Customization Templates?

A **customization template** is a reusable script (or script reference) that runs inside the builder VM during the
**Finalize** step. The script:

- Cleans cloud-init state, SSH host keys, machine-id, logs, and caches.
- Removes network persistence (udev rules, DHCP leases).
- For Windows: runs sysprep with generalize and shutdown.
- Ensures the image can be cloned without identity conflicts.

Customization templates are stored as CRDs and managed under **Image Catalog** > **Customization Templates**.

## Built-in Templates

Launchpad seeds several built-in customization templates:

| Template                   | OS Type | Description                                                                                                                                |
| -------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Ubuntu / Debian**        | ubuntu  | Generalize Ubuntu or Debian: cloud-init cleanup, remove SSH host keys, truncate machine-id, clear logs and history.                        |
| **RHEL / CentOS / Fedora** | rhel    | Generalize RHEL-family: cloud-init cleanup, unregister subscription-manager, remove SSH host keys, truncate machine-id.                    |
| **Windows**                | windows | Generalize Windows: run sysprep with `/generalize /oobe /shutdown`. Also installs QEMU guest agent from VMO package server before sysprep. |

Built-in templates cannot be deleted but can be used as references for custom templates.

### Creating a Custom Template

1. Navigate to **Image Catalog** > **Finalize Templates**.
2. Select **Create Template**.
3. Complete the following fields on the **Create Finalize Template** page and select **Create**.

   | **Parameter** | **Description**                                                                                                                            |
   | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
   | **Name** | Enter a unique name for the template. |
   | **Description** | Enter a description for the template. |
   | **OS Type** |`linux`, `windows`, `ubuntu`, `rhel`, or another supported value. Launchpad uses this value to filter templates during finalization. |
   | **Script** | Select the option on how to add the script: **Editor**, **Template**, **Upload**, or **URL**. |

The customization template is available on the **Finalize Template** page.

### Script Requirements

| **OS** | **Description**                                                                                                                            |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Linux** | Bash script. Must complete successfully; avoid `set -e` if you need partial cleanup to succeed. The script
  runs as root. End with `sync` and a clear completion message. |
| **Windows** | Batch or PowerShell. Must run sysprep or equivalent for generalization. The Windows built-in template
  uses sysprep with `/generalize /oobe /shutdown`. |

## Auto-Install Scripts

**Auto-install scripts** are separate from customization templates. They run during **OS installation** (first boot of
the builder VM), not during finalization.

| OS          | Format           | Purpose                                                                          |
| ----------- | ---------------- | -------------------------------------------------------------------------------- |
| **Linux**   | Cloud-init YAML  | Preseed, kickstart, or cloud-init autoinstall to automate OS installation.       |
| **Windows** | Autounattend.xml | Unattended installation answers (product key, disk partitioning, user creation). |

Auto-install scripts are managed under **Image Catalog** > **Auto Install Scripts**. When building a golden image, you
select an auto-install script to inject into the builder VM's cloud-init or to attach as Autounattend.xml.

### How Templates and Auto-Install Work Together

1. **Build** — The builder VM boots with an ISO and auto-install script. The OS installs unattended.
2. **Finalize** — After the OS is installed, you run finalization with a customization template. The seal script
   generalizes the image.

Use auto-install scripts to install the OS. Use customization templates to prepare the image for cloning.

## How Templates Are Applied During Finalization

When you select **Finalize** on a builder VM:

1. The Finalize modal loads available customization templates.
2. Templates are filtered by **guest OS** (inferred from the builder VM or selected manually):
   - Ubuntu/Debian builders see Ubuntu/Debian and generic Linux templates.
   - RHEL/CentOS/Fedora builders see RHEL-family templates.
   - Windows builders see Windows templates.
3. You select a customization template (or "None" for simple finalize).
4. The system stops the VM, ejects media, starts the VM, waits for the guest agent, and then runs the selected
   template's script via cloud-init or an equivalent mechanism.
5. When the script completes, the VM is stopped and the builder is cleaned up. The DataVolume is the sealed golden
   image.

## Template Selection Priority

When opening the Finalize modal, the system picks a default template in this order:

1. **Pre-selected from builder** — If the builder VM has an annotation with a template ID, that template is selected.
2. **Match by guest OS** — The first template whose `osType` matches the guest OS. For example, `ubuntu` matches Ubuntu
   and `windows` matches Windows.
3. **First built-in** — The first built-in template.
4. **First available** — The first template in the list.

You can override the selection before starting finalization.
