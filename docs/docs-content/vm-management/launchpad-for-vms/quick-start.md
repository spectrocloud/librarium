---
sidebar_label: "Create Your First VM"
title: "Create Your First VM"
description: "Learn how to create your first VM with the Launchpad for VMs Appliance."
hide_table_of_contents: false
sidebar_position: 2
tags: ["vmo", "launchpad for vms appliance"]
---

This guide walks you through the process of creating your first virtual machine using Virtual Machine Orchestrator (VMO)
installed on your cluster created with the Launchpad for VMs Appliance. For learning purposes, this guide shows the
steps to create a general-purpose VM (1 vCPU, 4 Gi memory) using an Ubuntu 24.04 ISO.

## Prerequisites

- A cluster created using the Launchpad Appliance. Refer to [Install Launchpad for VMs](./install-vmla-iso.md) for
  guidance.

- Credentials to access the VMO Manager UI hosted on your cluster. You can use either Keycloak OIDC credentials or local
  admin credentials configured during cluster creation.

- A Linux-based ISO to use as the base for your VM. This guide uses an Ubuntu 24.04 desktop ISO
  (`ubuntu-24.04.4-desktop-amd64.iso`).

## Upload ISO

Before you can create a VM, upload the ISO installer to your cluster as a
[KubeVirt Containerized Data Importer (CDI) DataVolume](https://kubevirt.io/user-guide/storage/containerized_data_importer/),
which manages the storage and lifecycle of a VM disk image.

1. In your browser, go to `https://<host-ip>:5080`. Replace `<host-ip>` with the IP address of your VMO Appliance host.
   If you have access to the VMO Appliance host terminal, the Local UI address is displayed on the terminal screen. If
   you changed the default port, replace `5080` with your configured Local UI port.

2. Log in with the username and password you created during installation.

3. From the left main menu, select **VM Orchestrator**.

4. Log in to VMO using your Keycloak or local credentials. These credentials are configured from Local UI at
   **Cluster** > **Configuration** tab > **Keycloak Admin** or **Local Admin**.

5. From the left main menu, select **Image Catalog** > **Golden Images**.

6. Select **Upload ISO/Golden Image**.

7. Complete the **Upload ISO/Disk Image** dialog with the following information.

   | **Parameter**       | **Description**                                                                                                                                                                                                               |
   | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **DataVolume Name** | Enter a unique name for the ISO installer. For this guide, use a descriptive name such as `ubuntu-2404-iso`.                                                                                                                  |
   | **Namespace**       | Select the namespace to store your image in. The `vmo-golden-images` namespace is created by default during cluster deployment and is the recommended location for ISO installers and golden images.                          |
   | **Storage Class**   | Select a storage class from the drop-down menu. The Launchpad Appliance includes Piraeus/LINSTOR as the default storage backend, which creates storage classes during cluster deployment. Select the available storage class. |
   | **Volume Size**     | Set the disk capacity for the DataVolume that stores the uploaded ISO. The size must be large enough to hold the ISO file. Specify the value in GiB or TiB. For an Ubuntu 24.04 desktop ISO, 8 GiB is sufficient.             |
   | **Image Type**      | Select **ISO Installer**.                                                                                                                                                                                                     |
   | **Image File**      | Select **Choose File** or drag and drop the file. ISO installer files use the ISO format. Golden image files use IMG or QCOW2 format. For this guide, we used a `ubuntu-24.04.4-desktop-amd64.iso` file.                      |

8. Select **Upload**. Large ISO files may take several minutes to upload. VMO displays the upload progress during the
   upload phase.

   ![Screenshot of ISO upload](/vmo/vm-management_vmo_golden-images_iso-upload-4-9.webp)

## Create Your First VM

After your ISO is uploaded, you are ready to deploy a VM.

1. From the left main menu, select **Workloads** > **Virtual Machines**.

2. Select **Create VM**.

   ![screenshot showing create vm button](/vmo/vm-management_vmo_first-vm-create-4-9.webp)

3. The **Create Virtual Machine** wizard opens. Complete the following fields on the **Source** wizard step.

   | **Parameter** | **Description**                                                                                                                            |
   | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
   | **Source**    | Select **Image/ISO**.                                                                                                                      |
   | **OS**        | Select **Linux**.                                                                                                                          |
   | **Namespace** | Select the namespace that contains your ISO. For this guide, select `vmo-golden-images` where you uploaded the your ISO.                   |
   | **VM Name**   | Enter a unique name for the VM. This field only accepts lowercase letters, numbers, and hyphens. The name must end with a letter or digit. |

4. Leave the **Batch Mode**, **VM Preference**, **Labels**, and **Annotations** sections as is. Select **Next**.

5. On the **Compute** wizard step, select **Instance Type**.

   Instance types are predefined CPU and memory profiles that standardize VM sizing. The `u1` prefix indicates
   general-purpose types with balanced CPU and memory.

6. Under **General Purpose**, select **u1.medium** (1 vCPU, 4 Gi memory). This instance type runs on hosts that meet the
   minimum hardware requirements for VMO clusters.

7. Leave the **Scheduling** section as is and select **Next**.

8. On the **Storage** wizard step, verify that a root disk is configured. The root disk is automatically populated from
   the ISO you selected in the **Source** step. Adjust the disk size if needed, then select **Next**.

9. On the **Network** wizard step, leave the default network configuration. The VM is assigned a pod network interface
   with masquerade mode by default. Select **Next**.

   :::info

   The file server is available on the **Pod Network (masquerade)** network. If you need to install QEMU or other
   binaries, install them during the golden image build over the **Pod Network (masquerade)** network.

   :::

10. For this guide, no changes are needed to the **Hardware** and **Lifecycle** wizard steps. Select **Finish** to
    provision your VM.

## Validate

1. From the left main menu of the VMO console, select **Workloads** > **Virtual Machines**.

2. Locate your VM in the list. The status column displays **Provisioning** while the VM is being created and changes to
   **Running** after the VM starts.

3. Select the VM to view its details, including IP address, the node the VM is running on, and metrics.

4. Select the **Console** tab to open a noVNC-based remote console. You can interact with the VM as if you were at its
   keyboard.

   ![Screenshot of a running VM console](/launchpad-for-vms_quick-start_console.webp)
