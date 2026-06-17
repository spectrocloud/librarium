---
sidebar_label: "Create a Golden Image"
title: "Create a Golden Image"
description: "Learn how to create a golden image in VM Launchpad."
icon: " "
hide_table_of_contents: false
sidebar_position: 5
tags: ["vmo", "vm launchpad", "golden images"]
---

## Create a Golden Image

A golden image is a sealed, reusable base system image. Golden images standardize OS installations and create VMs from
[templates](./templates.md) with validated configurations.

The following diagram displays the steps to build a golden image to use as a reference for a template.

![Screenshot of golden image workflow](/vmo/vm-management_vmo_golden-images_workflow-4-9.webp)

## Prerequisites

- A running Launchpad for VMs deployment.
- A user account with the platform administrator role.
- An OS ISO file available as a DataVolume. You can upload the ISO from **Infrastructure** > **Storage** or **Image
  Catalog** > **Golden Images**.
- Required packages uploaded under **Image Catalog** > **Packages**. For airgap Windows builds, upload `virtio-win.iso`
  before you build the image.
- An auto-install script and a seal script. **Image Catalog** includes built-in scripts, but you can provide your own
  scripts for custom operating system versions or hardening requirements.

## Network Considerations

The golden image builder VM uses the pod network with masquerade mode during the build. Launchpad serves packages and
ISOs to the builder over the pod network. Launchpad doesn't support custom Network Attachment Definition (NAD) networks,
such as bridge networks, for the build workflow.

After the build is complete, templates and VMs created from the golden image can use the pod network or a custom NAD.

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

Large ISO files can take minutes to upload. Launchpad displays progress during the upload phase.

:::info

If your environment doesn't display the default namespaces, navigate to **Infrastructure** > **Namespaces**, and select
**Add Existing**.

:::

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

   For Ubuntu images, use more than 20 GB for the golden image. For Windows images, use at least 50 GB.

4. Fill out the **Compute** page and select **Next**.

   | **Parameter**            | **Description**                                                                                                                                                                  |
   | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Builder VM CPUs          | Enter the number of CPUs for the builder VM.                                                                                                                                     |
   | Builder VM Memory        | Set the builder VM memory in `MiB` or `GiB`.                                                                                                                                     |
   | Networking               | Open the **Networking** section, set the NIC name, and select the pod network. To add more NICs, select **Add Interface**.                                                       |
   | First Boot Device        | Select **Disk**, **CD-ROM**, or **Network (PXE)**. If you select **Disk** and the builder VM can't boot from the primary disk, it uses **CD-ROM** as the fallback boot location. |
   | Second CD-ROM (optional) | Attach a second ISO file to access driver files or response files.                                                                                                               |
   | Install Guest Agent      | Keep the default setting to automatically install the QEMU guest agent at first boot.                                                                                            |

   For Ubuntu builds, 4 vCPUs and 8 GB of memory provide enough resources for the build. Keep **Install Guest Agent**
   selected because the QEMU guest agent must run unless your seal script handles the operating system another way.

   For Windows builds, use the built-in Windows Server 2022 auto-install script or provide your own `Autounattend.xml`.
   In airgap environments, confirm that the Virtio Windows drivers ISO is uploaded before you start the build.

5. On the **Auto-install (Optional)** page, select **Configure Auto-install Script**. You can manually create a
   customization script using the **Editor**, use an existing **Template**, select **Upload** to upload a script, or
   provide a URL.

   ![Screenshot of cloud-init and auto-install page](/vmo/vm-management_vmo_golden-images_autoinstall-4-9.webp)

6. Review the golden image build and start the build.

   ![Screenshot of golden image build](/vmo/vm-management_vmo_golden-images_build-4-9.webp)

   1. The builder VM boots from the ISO file, or the network if you configured network boot.

      - For Linux, Cloud-init runs the auto-install script. This script typically provides unattended installation
        answers for `preseed`, kickstart, or auto-install workflows.

      - For Windows, Autounattend.xml provides unattended installation answers. The Virtio drivers ISO is available as a
        second CD-ROM for loading drivers during installation.

   2. Open the **VNC console** to view progress or complete manual steps.

      For some Linux auto-install scripts, the console prompts you to confirm the installation. Type `yes` when
      prompted.

   3. Wait for the OS installation to finish and the VM to reboot.

7. When the OS is installed and ready, select **Finalize** on the builder VM.

8. In the **Finalize** dialog, select a customization template for the seal script.

   - **None** stops the VM and keeps the image as-is. The image is not generalized.

   - **With Script** runs the selected customization template's seal script to generalize the image.

9. For Linux, select a template such as **Ubuntu / Debian** or **RHEL / CentOS / Fedora**.

10. For Windows, select **Windows**. This runs `sysprep` with `/generalize /oobe /shutdown`.

11. Select **Finalize**. Launchpad completes the following actions:

    - Stops the VM.

    - Ejects the install media.

    - Starts the VM to run the seal script, if you selected one.

    - Waits for the guest agent.

    - Runs the seal script with cloud-init or a similar mechanism.

    - Stops the VM again and removes the builder VM.

12. When the process is complete, the DataVolume is a sealed golden image.

## Create a Template from the Golden Image

1. Navigate to **Workloads** > **Templates**.

2. Select **Create Template**.

3. In the Source step, select the golden image you created.

4. Configure compute, storage, network, hardware, and lifecycle settings for VMs created from this template.

   For Ubuntu templates, 2 vCPUs and 4 GB of memory make a reasonable starting point. Set the template disk size to a
   value that is not smaller than the disk size used to build the golden image.

5. In the Lifecycle step, select **No** for installing the QEMU guest agent if the golden image already includes the
   agent.

6. Select **Create Template**.

Windows VMs follow the same template and VM creation flow. You don't need to configure cloud-init for Windows VMs.

## Next Steps

After you deploy the golden image and related template, follow the [Template Management](./templates.md) guide to manage
VM templates.
