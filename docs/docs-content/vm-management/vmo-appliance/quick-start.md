---
sidebar_label: "Create Your First VM"
title: "Create Your First VM"
description: "Learn about how to create your first VM with Launchpad for VMs Appliance."
hide_table_of_contents: false
sidebar_position: 5
tags: ["vmo", "launchpad for vms appliance"]
---

This guide walks you through the process of creating your first virtual machine using Virtual Machine Orchestrator (VMO)
installed on your Launchpad for VMs cluster.

## Prerequisites

- A cluster created using the Launchpad for VMs appliance. Refer to [Install Launchpad for VMs](./install-vmla-iso.md)
  for guidance.

- Credentials to access the MetalLB endpoint (VMO) hosted on your cluster.

## Create Your First VM

1. In your browser, go to `https://<host-ip>:5080`. Replace `<host-ip>` with the IP address of your VMO Appliance host.
   If you have access to the VMO Appliance host terminal, the Local UI address is displayed on the terminal screen. If
   you changed the default port, replace `5080` with your configured Local UI port.

2. Log in with the username and password you created during installation.

3. From the left main menu, select **VM Orchestrator**.

4. Log in to VMO using your Keycloak or local credentials. These credentials are configured from Local UI at
   **Cluster** > **Configuration** tab > **Keycloak Admin** or **Local Admin**.

5. From the left main menu, select **Workloads** > **Virtual Machines**.

6. Select **Create VM**.

   ![screenshot showing create vm button](/vmo/vm-management_vmo_first-vm-create-4-9.webp)

7. The **Create Virtual Machine** wizard opens. Complete the following fields on the **Source** wizard step, selecting
   **Next** when finished.

   | **Parameter** | **Description**                                                                                                                                                        |
   | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Source**    | Defaults to **Template**. You can also select **Image/ISO** or **Custom**.                                                                                             |
   | **OS**        |
   | **Namespace** | Select the namespace from the dropdown. You can also create a new namespace by clicking on **+New**.                                                                   |
   | Template      | Select the template to use from the dropdown.                                                                                                                          |
   | VM Name       | Enter a unique name for the golden image. This field only accepts lowercase, numbers and hyphens. The name must end with a letter or digit.                            |
   | Batch Mode    | Leave default or select the **Create multiple VMs** checkbox to create multiple VMs.                                                                                   |
   | Preference    | Leave default or select a specific OS type.                                                                                                                            |
   | Labels        | Leave default or enter a key and value pair.                                                                                                                           |
   | Annotations   | Leave default or enter a key and value pair. You can also check **Disable PCI Hole 64-bit** if you are running legacy Windows systems (Windows XP/Windows Server 2003) |

8. Fill out the **Compute** page and click **Next >**.

   | Parameter               | Description                                                                                                                                                         |
   | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Instance Type or Custom | Select Instance Type to choose a default CPU/Memory configuration. Select Custom when you want to configure your own CPU/Memory configuration.                      |
   | Scheduling              | Leave default or adjust **Eviction Strategy**, **Grace Period**, **Priority Class**, **Start Strategy**, **Node Selector**, **Tolerations** and **Affinity Rules**. |

9. Fill out the **Storage** page and click **Next >**.

   | Parameter        | Description                                                                           |
   | ---------------- | ------------------------------------------------------------------------------------- |
   | Root Disk        | Leave default or adjust the disk size in `Gi`. You can also adjust the Storage Class. |
   | Additional Disks | Leave default or click **+Add Disk** to add additional disks.                         |
   | Boot Order       | Leave default or select **Network** to do a PXE boot from network.                    |

10. On the **Network** page, leave the default set to NIC 1. You can add additional NICs by clicking **+ Add NIC**.

    Additionally, you can adjust the NIC type to **Pod Network (masquerade)** or **Multus Network (bridge)**.

    Under **DNS Settings**, optionally configure the VM hostname if this will be different than the VM Name, and the
    subdomain to use with the hostname.

    Click **Next**.

11. (Optional) Fill out the **Hardware** page and click **Next >**.

    | Parameter        | Description                                                                                                                                                                                                                                                                                                                                               |
    | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | Firmware         | Leave default or enable **UEFI/EFI Boot**. You can also configure the Machine Type, SMBIOS UUID, and SMBIOS Serial number.                                                                                                                                                                                                                                |
    | CPU Advanced     | Leave default. You can adjust the CPU Model to use Host Model (default) or host-passthrough. You can also enable **Dedicated CPU Placement** and **Isolate Emulator Thread**. Enabling **NUMA Topology Passthrough** allows the guest OS to use the host NUMA topology. Clicking **+ Add Feature** under CPU Features allows you to specify CPU features. |
    | Devices          | Leave default. You can also enable **Virtio RNG (random number generator)**, **Tablet Input Device (USB)**, **Headless (no graphics device)**, **TPM Device**, and **USB Redirection (Client Passthrough)**                                                                                                                                               |
    | Features         | Leave default. You can disable **ACPI** and **APIC**. You can enabled **HyperV Enlightenments**.                                                                                                                                                                                                                                                          |
    | Clock and Timers | Leave default. You can adjust Clock Mode to `Utc` or `Timezone`. **Timers** can have **PIT Timer**, **RTC Timer**, **HPET Timer**, and **HyperV Timer** enabled or disabled.                                                                                                                                                                              |
    | Memory           | Leave default. You can enabled **Hugepages** and **Overcommit Guest Overhead**.                                                                                                                                                                                                                                                                           |
    | Security         | Leave default. You can enable **Confidential Computing** and Launch Security options.                                                                                                                                                                                                                                                                     |
    | Host Devices     | Leave default. Any GPU or PCI devices detected will be available to assign to the VM. If none appear, you can click **Refresh** under **Cluster Device Management**. You can also add devices manually by clicking **+ Register New Device Manually**.                                                                                                    |

12. (Optional) Fill out the **Lifecycle** page and click **Next >**.

    | Parameter       | Description                                                                                                                                                                                   |
    | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | Snapshot Policy | Leave default. You can click **+ Create** to create a new snapshot policy.                                                                                                                    |
    | Cloud-Init      | Leave default. Click on **Cloud-Init Configuration** to manually adjust the cloud-init configuration and user-data files. You can optionally adjust the network settings in **Network Data**. |

13. Review the summary and YAML preview. Click **Create VM** to provision the VM. VM status will display as
    **Provisioning** for several minutes while the required resources are built and the image is pulled from the
    registry. If you did not enable the checkbox to start the VM automatically, VM status displays as **Stopped** until
    the VM is fully deployed.

:::tip

Use the **Advanced** button to inspect or edit the full VM Manifest before creating.

<!-- For a detailed walkthrough of each wizard step, see [Creating VMs](./virtual-machines/creating.md). -->

:::

## Validation

1. Go to **Workloads > Virtual Machines**.

2. Find your VM in the list. The status column shows **Running** when the VM is started. If the VM is stopped, select
   the VM and click **Start**

3. Click the VM name to open the detail page.

4. On the VM detail page, click **Console**. A new tab opens with a noVNC-based remote console. You can interact with
   the VM as if you were at its keyboard.
