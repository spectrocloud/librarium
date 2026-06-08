---
sidebar_label: "Create Your First Golden Image"
title: "Create Your First Golden Image"
description: "Learn how to create your first golden image in VM Launchpad."
icon: " "
hide_table_of_contents: false
sidebar_position: 5
draft: true
tags: ["vmo", "vm launchpad", "golden images"]
---

<!-- vale off -->

## Create Your First Golden Image

A golden image is a sealed, reusable base system image. Golden images standardize OS installations and create VMs from
[templates](./templates.md) with validated configurations.

The following diagram displays the steps to build a golden image to use as a reference for a template.

![Screenshot of golden image workflow](/vmo/vm-management_vmo_golden-images_workflow-4-9.webp)

## Prerequisites

- An OS ISO file.

## Upload ISO/Disk Image

1. Navigate to **Image Catalog** > **Golden Images**.

2. Select **Upload ISO/Golden Image**.

3. Fill out the **Upload ISO/Disk Image** page and select **Upload**.

| **Parameter**   | **Description**                                                                                                                |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| DataVolume Name | Enter a unique name for the ISO installer or disk image.                                                                       |
| Namespace       | Select the namespace from the drop-down menu. Use `vmo-golden-images` unless your environment uses a different namespace.      |
| Storage Class   | Select the storage class from the drop-down menu.                                                                              |
| Volume Size     | Set the DataVolume disk size in `GiB` or `TiB`.                                                                                |
| Image Type      | Select **ISO Installer** or **Golden Image**. A golden image is a prebuilt disk image.                                         |
| Image File      | Select **Choose File** or drag and drop the file. ISO installer files use the ISO format. Golden image files use IMG or QCOW2. |

Large ISO files may take several minutes to upload. Launchpad displays progress during the upload phase.

![Screenshot of ISO upload](/vmo/vm-management_vmo_golden-images_iso-upload-4-9.webp)

## Create Blank DataVolume

1. Navigate to **Infrastructure** > **Storage**.

2. Select **Create DataVolume**.

3. Fill out the **Source** page and select **Next**.

   | **Parameter** | **Description**                                             |
   | ------------- | ----------------------------------------------------------- |
   | Source        | Select **Blank**.                                           |
   | Name          | Enter a unique name for the DataVolume image.               |
   | Namespace     | Select the namespace from the drop-down menu.               |
   | Storage Class | Select the storage class from the drop-down menu.           |
   | Size          | Set the disk size in `MiB`, `GiB`, or `TiB`.                |
   | Access Mode   | Select `ReadWriteOnce`, `ReadWriteMany`, or `ReadOnlyMany`. |
   | Volume Mode   | Select `Block` or `Filesystem`.                             |

## Build a Golden Image

1. Navigate to **Image Catalog** > **Golden Images**.

2. Select **Build Golden Image**.

3. Fill out the **Source** page and select **Next**.

   | **Parameter**         | **Description**                                                                                                                                 |
   | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
   | Golden Image Name     | Enter a unique name for the golden image. This field accepts lowercase letters, numbers, and hyphens. The name must end with a letter or digit. |
   | Namespace             | Select the namespace from the drop-down menu. Use `vmo-golden-images` unless your environment uses a different namespace.                       |
   | Source ISO DataVolume | Select the ISO to use.                                                                                                                          |
   | Disk Size             | Set the disk size in `GiB` or `TiB`.                                                                                                            |
   | Storage Class         | Select the storage class from the drop-down menu.                                                                                               |

4. Fill out the **Compute** page and select **Next**.

   | **Parameter**                | **Description**                                                                                                                                                                   |
   | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Builder VM CPUs              | Enter the number of CPUs for the builder VM.                                                                                                                                      |
   | Builder VM Memory            | Set the builder VM memory in `MiB` or `GiB`.                                                                                                                                      |
   | Networking                   | Open the **Networking** section, set the NIC name, and select the pod network. To add more NICs, select **Add Interface**.                                                        |
   | First Boot Device            | Select **Disk**, **CD-ROM**, or **Network (PXE)**. If you select **Disk** and the builder VM cannot boot from the primary disk, it uses **CD-ROM** as the fallback boot location. |
   | Additional CD-ROM (optional) | Attach a second ISO file to access driver files or response files.                                                                                                                |
   | Install Guest Agent          | Keep the default setting to automatically install the QEMU guest agent at first boot.                                                                                             |

5. On the **Autoinstall (OPTIONAL)** page, select **Configure Autoinstall Script**. You can manually create a
   customization script using the **Editor**, use an existing **Template**, select **Upload** to upload a script, or
   provide a URL.

   ![Screenshot of cloud-init and autoinstall page](/vmo/vm-management_vmo_golden-images_autoinstall-4-9.webp)

6. Review the golden image build and start the build.

   ![Screenshot of golden image build](/vmo/vm-management_vmo_golden-images_build-4-9.webp)

   1. The builder VM boots from the ISO file, or the network if you configured network boot.

      - For Linux, Cloud-init runs the autoinstall script. This script typically configures a preseed, kickstart, or
        autoinstall response for unattended installation.

      - For Windows, Autounattend.xml provides unattended installation answers. The VirtIO drivers ISO is available as a
        second CD-ROM for loading drivers during installation.

   2. Open the **VNC console** to monitor progress or complete manual steps.

   3. Wait for the OS installation to finish and the VM to reboot.

7. When the OS is installed and ready, select **Finalize** on the builder VM.

8. In the **Finalize** dialog, select a customization template for the seal script.

   - **None** stops the VM and keeps the image as is. The image is not generalized.

   - **With Script** runs the selected customization template's seal script to generalize the image.

9. For Linux, select a template such as **Ubuntu / Debian** or **RHEL / CentOS / Fedora**.

10. For Windows, select **Windows**. This runs sysprep with `/generalize /oobe /shutdown`.

11. Select **Finalize**. Launchpad completes the following actions:

    - Stops the VM.

    - Ejects the install media.

    - Starts the VM to run the seal script, if you selected one.

    - Waits for the guest agent.

    - Runs the seal script with cloud-init or a similar mechanism.

    - Stops the VM again and removes the builder VM.

12. When the process is complete, the DataVolume is a sealed golden image.

## Next Steps

After you deploy your first golden image, follow the [Create Your First Template](./templates.md) guide to deploy your
first template.
