# Golden Images

A golden image is a sealed, reusable base disk image. Build golden images to standardize OS installations and create VMs from [templates](./image-templates.md) with consistent configurations. See also: [Customization Templates](./image-templates.md) for seal scripts and [Packages](./packages.md) for guest agent installation.

## Overview

The golden image workflow:

1. **Upload ISO** — Upload an OS installation ISO to the cluster.
2. **Create blank DataVolume** — Provision storage for the OS disk.
3. **Create builder VM** — A temporary VM that boots from the blank disk and the ISO.
4. **Boot with ISO and auto-install** — Use an auto-install script (`cloud-init` for Linux, `Autounattend.xml` for Windows) to automate installation.
5. **Install OS** — Complete the installation via VNC or let auto-install finish.
6. **Finalize** — Run a seal script to generalize the image, eject install media, and shut down cleanly. The resulting DataVolume is the golden image.
7. **Create VMs** — Create VmTemplates from the golden image, then create VMs from those templates.

Golden images live in the `vmo-golden-images` namespace (configurable via `VMO_GOLDEN_IMAGES_NAMESPACE`).

---

## Step-by-Step Workflow

### 1. Upload ISO

1. Navigate to **Image Catalog > Golden Images**.
2. Click **Build Golden Image** or **Upload ISO/Golden Image**.
3. Select the target namespace (typically `vmo-golden-images`).
4. Choose or drop the ISO file. Leave **Image** unchecked so the DataVolume is marked as installer media (`iso`) and attached to builder VMs as a CD-ROM.
5. Wait for the upload to complete. A DataVolume is created with the ISO contents.

> **Note:** Large ISOs may take several minutes to upload. Progress is shown during the upload phase.

### 2. Create Blank DataVolume

1. After uploading the ISO (or if you already have one), start the build flow.
2. Create a **blank** DataVolume for the OS disk. Set the size (e.g., 50 Gi) and StorageClass.
3. The blank DataVolume will hold the installed OS.

### 3. Create Builder VM

1. The builder VM is created automatically when you start a golden image build.
2. The builder VM has:
   - The blank DataVolume as its root disk (VirtIO).
   - The ISO attached as a CD-ROM (first boot device for installation).
   - Cloud-init with the auto-install script (Linux) or Autounattend.xml (Windows).
   - For Windows: the VirtIO drivers ISO auto-mounted from a shared RWX PVC.

> **Note:** Active builder VMs are listed cluster-wide on the Golden Images tab, so builds started in any namespace (not only `vmo-golden-images`) appear in the progress view.

### 4. Boot and Install

1. The builder VM boots from the ISO (or network, if configured).
2. **Linux** — Cloud-init runs the auto-install script, which typically configures a preseed/ kickstart/ autoinstall response for unattended installation.
3. **Windows** — Autounattend.xml provides unattended installation answers. The VirtIO drivers ISO is available as a second CD-ROM for loading drivers during installation.
4. Open the **VNC console** to monitor progress or complete manual steps if needed.
5. Wait for the OS installation to finish and the VM to reboot.

### 5. Finalize (Seal and Eject)

1. When the OS is installed and ready, click **Finalize** on the builder VM.
2. In the Finalize modal, select a **Customization Template** (seal script):
   - **None (simple finalize)** — Stops the VM and keeps the image as-is. No generalization.
   - **With Script** — Runs the selected customization template's seal script to generalize the image.
3. For Linux, choose a template such as **Ubuntu / Debian** or **RHEL / CentOS / Fedora**.
4. For Windows, choose **Windows** (runs sysprep with `/generalize /oobe /shutdown`).
5. Click **Finalize**. The system:
   - Stops the VM.
   - Ejects the install media (ISO, CD-ROM).
   - Starts the VM to run the seal script (if selected).
   - Waits for the guest agent (for script execution).
   - Runs the seal script via cloud-init or a similar mechanism.
   - Stops the VM again and cleans up the builder.
6. When complete, the DataVolume is a sealed golden image. The builder VM is removed.

### 6. Create VMs from Golden Images

1. Create a **VmTemplate** that references the golden image DataVolume as its source.
2. Create VMs from the template. Each VM gets a clone of the golden image with a unique machine-id and network identity.

---

## Seal Scripts

Seal scripts generalize the image so clones do not conflict (e.g., duplicate machine-ids, SSH host keys, or network config).

### Linux (virt-sysprep style)

Built-in templates for Ubuntu/Debian and RHEL/CentOS/Fedora perform:

- Cloud-init cleanup (remove installer configs, run `cloud-init clean`).
- SSH host key removal.
- Machine-id truncation.
- Log and cache cleanup.
- Network state cleanup (udev rules, DHCP leases).
- Shell history removal.
- Subscription manager unregister (RHEL family).

### Windows (sysprep)

The Windows template runs sysprep with `/generalize /oobe /shutdown` to generalize the image. It may also install the QEMU guest agent from the VMO package server before sysprep.

---

## VirtIO Windows ISO

Windows needs VirtIO drivers for disk and network when using VirtIO devices. VMO Manager provides:

- **Auto-mount** — When creating a Windows builder VM, the VirtIO drivers ISO is automatically attached as a second CD-ROM. The ISO is served from a shared RWX PVC in the golden images namespace.
- **DataVolume** — A `vmo-virtio-win` DataVolume is created in the golden images namespace. It is populated from the built-in VirtIO Windows ISO package or a configured source.

> **Note:** The VirtIO PVC must be ready before building Windows golden images. If the PVC is missing or pending, the builder may start without the drivers ISO. Ensure storage is configured and the VirtIO package is seeded.

---

## Creating VMs from Golden Images

After finalizing a golden image:

1. Go to **Workloads > Templates** and click **Create Template**.
2. In the Source step, select the golden image DataVolume (from the golden images namespace) as the source.
3. Complete the template wizard. The template will clone from the golden image when creating VMs.
4. Create VMs from the template via **Workloads > Virtual Machines > Create VM**.

Each VM receives a clone of the golden image. Cloud-init (if configured in the template) can set hostname, static IPs, and other per-VM settings at first boot.
