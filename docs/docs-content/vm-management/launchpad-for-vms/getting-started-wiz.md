---
sidebar_label: "Initial Configuration of Launchpad for VMs"
title: "Initial Configuration of Launchpad for VMs"
description: "Learn how to use the Getting Started wizard for Launchpad for VMs Appliance."
hide_table_of_contents: false
sidebar_position: 1
tags: ["vmo", "launchpad for vms appliance"]
---

This guide walks you through the **Getting Started** wizard.

## Prerequisites

- A cluster created using the Launchpad Appliance. Refer to [Install Launchpad for VMs](./install-vmla-iso.md) for
  guidance.

- Credentials to access the VMO Manager UI hosted on your cluster. You can use either Keycloak OIDC credentials or local
  admin credentials configured during cluster creation.

## Initial Launchpad for VMs Configuration

Complete the following required configuration steps before you [create your first VM](./quick-start.md).

1. In your browser, go to `https://<host-ip>:5080`. Replace `<host-ip>` with the IP address of your Launchpad for VMs
   host. If you have access to the Launchpad for VMs host terminal, the Local UI address is displayed on the terminal
   screen. If you changed the default port, replace `5080` with your configured Local UI port.

2. Log in with the username and password you created during installation.

3. Navigate to the **Getting Started** pop-up on the right side. If you exited the wizard, select the **Getting Started
   Guide** icon in the upper-right corner to reopen it. If the wizard is minimized, it appears in the lower-right
   corner.

   ![Screenshot of the getting started icon](/vmo/vm-management_launchpad-for-vms_getstart-icon-4-9.webp)

4. Select **Set Up a Storage Pool**. The appliance creates **Set Up a Storage Pool** during deployment, so the wizard
   marks it complete by default.

5. To create more storage pools, select **+ Create Storage Pool**, enter the following values, and select **Create
   Storage Pool**.

   | **Parameter**    | **Description**                                                                                   |
   | ---------------- | ------------------------------------------------------------------------------------------------- |
   | **Pool Name**    | Name for the storage pool.                                                                        |
   | **Pool Type**    | Select the pool type option to use: `LVM Thin`, `LVM`, `ZFS`, `ZFS Thin`, `File`, or `File Thin`. |
   | **Volume Group** | For `LVM Thin` or `LVM`, the Volume Group field defaults to `drbd-vg`.                            |
   | **ZFS Pool**     | For `ZFS` or `ZFS Thin`, enter the ZFS pool name.                                                 |
   | **Directory**    | For `File` or `File Thin`, enter the Directory path.                                              |
   | **Thin Pool**    | Only present for `LVM Thin` and defaults to `thin pool`.                                          |
   | **Host Devices** | To use host storage, select the appropriate host device.                                          |

   The following image shows the creation of an `LVM Thin` storage pool that uses the local host storage `/dev/sdb`.

   ![Screenshot of getting started storage pool creation](/vmo/vm-management_launchpad-for-vms_getstart-storage-pool-4-9.webp)

6. Select **Review Storage Policy** to display the default **Piraeus DRBD Performance Tuning** storage policy. You can
   add more policies here.

7. On the **Getting Started** wizard pop-up, select **Set Up a Storage Class**.

8. Select **+ Create Storage Class**, enter the following values, and select **Create Storage Class**.

   :::info

   The initial benchmark used a single-replica storage class. We are continuing to run additional benchmarks with
   multiple replicas for each PVC setting, and will share updates as those results become available. :::

   | **Parameter**             | **Description**                                                                                                                                                        |
   | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Class Name**            | Name for the storage class.                                                                                                                                            |
   | **Storage Class Options** | The storage class enables **Allow Expansion** and **Allow for VMs** by default. Select **Default Class** to make this storage class the default.                       |
   | **Reclaim Policy**        | Select the behavior to reclaim storage. Defaults to `Delete`. You can also select `Retain`.                                                                            |
   | **Binding Mode**          | Select `WaitForFirstConsumer` or `Immediate`.                                                                                                                          |
   | **Select a Policy**       | From the drop-down menu, select **No Policy (manual parameters)** or **Piraeus DRBD Performance Tuning (11 parameters)**. Policies created in Step 6 also appear here. |
   | **Storage Pool**          | From the drop-down menu, select `-Select a pool-` or `lvm-thin`. Storage pools created earlier also appear here.                                                       |

9. Return to the **Getting Started** wizard, and select **Create Networks**.

10. On the **Network Attachment Definitions** page, select **+ Create NAD**.

11. On the **Create Network Attachment Definition** page, enter the following information, and select **Create**.

    | **Parameter**          | **Description**                                                                                                                                                             |
    | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Name**               | Name of the NAD.                                                                                                                                                            |
    | **Namespace**          | Namespace for the NAD. The appliance creates the `default`, `virtual-machines`, and `vmo-golden-images` namespaces. To add namespaces, select **Create Namespace**.         |
    | **Network Type**       | Defaults to `Linux Bridge`. Other options include `macvlan`, `ipvlan`, `SR-IOV`, and `Custom JSON`.                                                                         |
    | **Bridge Name**        | Defaults to `br0`. The appliance creates `virbr0`. More bridges may exist on the Launchpad node.                                                                            |
    | **VLAN Mode**          | Defaults to `Access` for untagged VLAN access. For tagged VLANs, the configuration creates one NAD for each VLAN. Select `Trunk` to support more than one VLAN for one NAD. |
    | **Tagged VLANs**       | Optional. Enter one or more comma-separated VLAN IDs.                                                                                                                       |
    | **IPAM Configuration** | Optional JSON.                                                                                                                                                              |
    | **Generated Config**   | Displays a preview of the NAD JSON.                                                                                                                                         |

    :::info

    If your environment does not display the default namespaces, navigate to **Infrastructure** > **Namespaces**, and
    select **Add Existing**.

    :::

12. Return to the **Getting Started** wizard, and select **Add Namespaces**.

13. By default, the **Namespaces** page displays three namespaces: `default`, `virtual-machines`, and
    `vmo-golden-images`. To create another namespace, select **Create Namespace**.

## Verify

1. Navigate to the **Getting Started** pop-up.

2. The **Storage, Networks, & Namespaces** section displays all five steps crossed out.

## Next Steps

After you configure Launchpad for VMs, use the [Create Your First VM](./quick-start.md) guide to create your first VM.
