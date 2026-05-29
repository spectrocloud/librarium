---
sidebar_label: "Creating Golden Images"
title: "Creating Golden Images"
description: "Learn how to install create golden images to use with VM Launchpad"
icon: " "
hide_table_of_contents: false
sidebar_position: 10
tags: ["vmo", "vm launchpad", "golden images"]
---
<!-- vale off -->
## Create a Golden Image

A golden image is a sealed, reusable base system image. Build golden images to standardize OS installations and create
VMs from [templates](./templates.md) with validated configurations. VMs built from templates can be further customized
using [Customization Templates](./image-customization.md) for seal scripts and [Packages](./packages.md) for guest agent
installation.

The diagram below displays the overarching steps to build a golden image to use as a reference for a template.

![Screenshot of golden image workflow](/vmo/vm-management_vmo_golden-images_workflow-4-9.webp)

## Prerequisites

- ISO of the OS

## Upload ISO/Disk Image

1. Navigate to **Image Catalog > Golden Images**.

2. Click on **Upload ISO/Golden Image**.

3. Fill out the **Upload ISO/Disk Image** page and click **Upload**.

   | Parameter    | Description                                             |
   | ------------ | ------------------------------------------------------- |
   | DataVolume Name        | Enter a unique name for the ISO installer or disk image. |
   | Namespace        | Select the namespace from the dropdown, typically `vmo-golden-images`.|
   | Storage Class | Select the storage class from the dropdown. You can also |
   | Volume Size | Set the DataVolume disk size in `GiB` or `TiB`. |
   | Image Type | Select **ISO Installer** or **Golden Image**. A golden image is a pre-built disk image. |
   | Image File | Click **Choose File** or drag-and-drop the file. ISO Installer supported file is `.iso`. Golden Image supported files are `.img` and `.qcow2`. |

   Large ISOs may take several minutes to upload. Progress is shown during the upload phase.

   ![Screenshot of iso upload](/vmo/vm-management_vmo_golden-images_iso-upload-4-9.webp)

## Create Blank DataVolume

1. Navigate to **Infrastructure > Storage**

2. Click **+ Create DataVolume**.

3. Fill out **Source** page and click **Next >**.

   | Parameter    | Description                                             |
   | ------------ | ------------------------------------------------------- |
   | Source        | Select **Blank**. |
   | Name       | Enter a unique name for the DataVolume image. |
   | Namespace        | Select the namespace from the dropdown.|
   | Storage Class | Select the storage class from the dropdown. |
   | Size | Set the disk size in `MiB`, `GiB` or `TiB`. |
   | Access Mode | From the dropdown, select `ReadWriteOnce`, `ReadWriteMany`, or `ReadOnlyMany`.  |
   | Volume Mode| From the dropdown, select `Block` or `Filesystem`. |

## Build a Golden Image

1. Navigate to **Image Catalog > Golden Images**.

2. Click **Build Golden Image**.

3. Fill out **Source** page and click **Next >**.

   | Parameter             | Description                                                                                                                                 |
   | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
   | Golden Image Name     | Enter a unique name for the golden image. This field only accepts lowercase, numbers and hyphens. The name must end with a letter or digit. |
   | Namespace             | Select the namespace from the dropdown, typically `vmo-golden-images`.                                                                      |
   | Source ISO DataVolume | Select the ISO to use.                                                                                                                      |
   | Disk Size             | Set the disk size in `GiB` or `TiB`.                                                                                                        |
   | Storage Class         | Select the storage class from the dropdown.                                                                                                 |

4. Fill out the **Compute** page and click **Next >**.

   | Parameter                     | Description                                                                                                                                                                                        |
   | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Builder VM CPUs               | Enter the number of CPUs for the Builder VM.                                                                                                                                                       |
   | Builder VM Memory             | Set the Builder VM memory in `MiB` or `GiB`.                                                                                                                                                       |
   | Networking                    | Open the Networking section, set the NIC name and select the Pod Network. You can optionally click **+ Add Interface** to add additional NICs.                                                     |
   | First Boot Device             | Select **Disk**, **CD-ROM**, or **Network (PXE)**. If you select **Disk** and the VM Builder cannot boot from the primary disk, it will use **CD-ROM** automatically as a fall-back boot location. |
   | Additional CD-ROM (optional) | Attach a second ISO to access driver files or response files.                                                                                                                                      |
   | Install Guest Agent           | Leave default to auto-install the QEMU guest agent at first boot.                                                                                                                                  |

5. On the **Autoinstall (OPTIONAL)** page, select **Configure Autoinstall Script**. You can manually create a
   customization script using the **Editor**,use an existing **Template**, **Upload** a script, or fetch a script using
   an **URL**.

   ![Screenshot of cloud-init and autoinstall page](/vmo/vm-management_vmo_golden-images_autoinstall-4-9.webp)


6. 

   ![Screenshot of golden image build](/vmo/vm-management_vmo_golden-images_build-4-9.webp)

<!-- vale off -->

### 3. Create Builder VM

1. The builder VM is created automatically when you start a golden image build.
2. The builder VM has:
   - The blank DataVolume as its root disk (VirtIO).
   - The ISO attached as a CD-ROM (first boot device for installation).
   - Cloud-init with the auto-install script (Linux) or Autounattend.xml (Windows).
   - For Windows: the VirtIO drivers ISO auto-mounted from a shared RWX PVC.

> **Note:** Active builder VMs are listed cluster-wide on the Golden Images tab, so builds started in any namespace (not
> only `vmo-golden-images`) appear in the progress view.

### 4. Boot and Install

1. The builder VM boots from the ISO (or network, if configured).
2. **Linux** — Cloud-init runs the auto-install script, which typically configures a preseed/ kickstart/ autoinstall
   response for unattended installation.
3. **Windows** — Autounattend.xml provides unattended installation answers. The VirtIO drivers ISO is available as a
   second CD-ROM for loading drivers during installation.
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

Seal scripts generalize the image so clones do not conflict (e.g., duplicate machine-ids, SSH host keys, or network
config).

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

The Windows template runs sysprep with `/generalize /oobe /shutdown` to generalize the image. It may also install the
QEMU guest agent from the VMO package server before sysprep.

---

## VirtIO Windows ISO

Windows needs VirtIO drivers for disk and network when using VirtIO devices. VMO Manager provides:

- **Auto-mount** — When creating a Windows builder VM, the VirtIO drivers ISO is automatically attached as a second
  CD-ROM. The ISO is served from a shared RWX PVC in the golden images namespace.
- **DataVolume** — A `vmo-virtio-win` DataVolume is created in the golden images namespace. It is populated from the
  built-in VirtIO Windows ISO package or a configured source.

> **Note:** The VirtIO PVC must be ready before building Windows golden images. If the PVC is missing or pending, the
> builder may start without the drivers ISO. Ensure storage is configured and the VirtIO package is seeded.

---

## Creating VMs from Golden Images

After finalizing a golden image:

1. Go to **Workloads > Templates** and click **Create Template**.
2. In the Source step, select the golden image DataVolume (from the golden images namespace) as the source.
3. Complete the template wizard. The template will clone from the golden image when creating VMs.
4. Create VMs from the template via **Workloads > Virtual Machines > Create VM**.

Each VM receives a clone of the golden image. Cloud-init (if configured in the template) can set hostname, static IPs,
and other per-VM settings at first boot.
