# Customization Templates

Customization templates define seal and generalize scripts used during golden image finalization. They prepare the OS for cloning by removing machine-specific data and ensuring each clone gets a unique identity.

## What Are Customization Templates?

A **customization template** is a reusable script (or script reference) that runs inside the builder VM during the **Finalize** step. The script:

- Cleans cloud-init state, SSH host keys, machine-id, logs, and caches.
- Removes network persistence (udev rules, DHCP leases).
- For Windows: runs sysprep with generalize and shutdown.
- Ensures the image can be cloned without identity conflicts.

Customization templates are stored as CRDs and managed under **Image Catalog > Customization Templates**.

---

## Built-in Templates

VMO Manager seeds several built-in customization templates:

| Template | OS Type | Description |
|----------|---------|-------------|
| **Ubuntu / Debian** | ubuntu | Generalize Ubuntu or Debian: cloud-init cleanup, remove SSH host keys, truncate machine-id, clear logs and history. |
| **RHEL / CentOS / Fedora** | rhel | Generalize RHEL-family: cloud-init cleanup, unregister subscription-manager, remove SSH host keys, truncate machine-id. |
| **Windows** | windows | Generalize Windows: run sysprep with `/generalize /oobe /shutdown`. Also installs QEMU guest agent from VMO package server before sysprep. |

Built-in templates cannot be deleted but can be used as references for custom templates.

---

## Custom Templates

Create custom customization templates for:

- **Other Linux distros** — Alpine, Arch, SUSE, etc.
- **Modified seal logic** — Additional cleanup, custom scripts.
- **Organization-specific steps** — Security hardening, compliance checks.

### Creating a Custom Template

1. Navigate to **Image Catalog > Customization Templates**.
2. Click **Create Customization Template**.
3. Set:
   - **Name** — Unique identifier.
   - **OS Type** — linux, windows, ubuntu, rhel, etc. Used to filter templates when finalizing (e.g., Ubuntu builder gets Ubuntu/Debian templates).
   - **Script** — The shell script (Linux) or batch/PowerShell commands (Windows) to run during finalize.

4. Save. The customization template is available in the Finalize modal when the guest OS matches.

### Script Requirements

- **Linux** — Bash script. Must complete successfully; avoid `set -e` if you need partial cleanup to succeed. The script runs as root. End with `sync` and a clear completion message.
- **Windows** — Batch or PowerShell. Must run sysprep or equivalent for generalization. The Windows built-in template uses sysprep with `/generalize /oobe /shutdown`.

---

## Auto-Install Scripts

**Auto-install scripts** are separate from customization templates. They run during **OS installation** (first boot of the builder VM), not during finalization.

| OS | Format | Purpose |
|----|--------|---------|
| **Linux** | Cloud-init YAML | Preseed, kickstart, or cloud-init autoinstall to automate OS installation. |
| **Windows** | Autounattend.xml | Unattended installation answers (product key, disk partitioning, user creation). |

Auto-install scripts are managed under **Image Catalog > Auto Install Scripts**. When building a golden image, you select an auto-install script to inject into the builder VM's cloud-init or to attach as Autounattend.xml.

### How Templates and Auto-Install Work Together

1. **Build** — Builder VM boots with ISO + auto-install script. OS installs unattended.
2. **Finalize** — After OS is installed, you run finalize with a **customization template** (seal script). The seal script generalizes the image.

Auto-install = install the OS. Customization template = prepare the image for cloning.

---

## How Templates Are Applied During Finalization

When you click **Finalize** on a builder VM:

1. The Finalize modal loads available customization templates.
2. Templates are filtered by **guest OS** (inferred from the builder VM or selected manually):
   - Ubuntu/Debian builders see Ubuntu/Debian and generic Linux templates.
   - RHEL/CentOS/Fedora builders see RHEL-family templates.
   - Windows builders see Windows templates.
3. You select a customization template (or "None" for simple finalize).
4. The system stops the VM, ejects media, starts the VM, waits for the guest agent, and then runs the selected template's script via cloud-init or an equivalent mechanism.
5. When the script completes, the VM is stopped and the builder is cleaned up. The DataVolume is the sealed golden image.

---

## Template Selection Priority

When opening the Finalize modal, the system picks a default template in this order:

1. **Pre-selected from builder** — If the builder VM has an annotation with a template ID, that template is selected.
2. **Match by guest OS** — The first template whose `osType` matches the guest OS (e.g., "ubuntu" for Ubuntu, "windows" for Windows).
3. **First built-in** — The first built-in template.
4. **First available** — The first template in the list.

You can override the selection before starting finalization.
