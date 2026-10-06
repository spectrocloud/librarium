---
sidebar_label: "Initial Configuration of VM Launchpad"
title: "Initial Configuration of VM Launchpad"
description: "Learn how to use the Getting Started wizard for VM Launchpad."
hide_table_of_contents: false
sidebar_position: 1
tags: ["vmo", "vm launchpad"]
---

This guide walks you through the **Getting Started** wizard.

## Prerequisites

- A cluster created using PaletteAI VM Launchpad. Refer to [Install VM Launchpad](./install.md) for guidance.

- Credentials to access the VMO Manager UI hosted on your cluster. You can use either Keycloak OIDC credentials or local
  admin credentials configured during cluster creation.

## Initial VM Launchpad Configuration

Complete the following required configuration steps before you [create your first VM](./quick-start.md). The storage
steps in the **Getting Started** wizard depend on the storage backend of your [appliance variant](./install.md#install).

### Open the Getting Started Wizard

1. In your browser, go to `https://<host-ip>:5080`. Replace `<host-ip>` with the IP address of your VM Launchpad host.
   If you have access to the VM Launchpad host terminal, the Local UI address is displayed on the terminal screen. If
   you changed the default port, replace `5080` with your configured Local UI port.

2. Log in with the username and password you created during installation.

3. Navigate to the **Getting Started** pop-up on the right side. If you exited the wizard, select the **Getting Started
   Guide** icon in the upper-right corner to reopen it. If the wizard is minimized, it appears in the lower-right
   corner.

   ![Screenshot of the getting started icon](/vmo/vm-management_vm-launchpad_getstart-icon-4-9.webp)

### Configure Storage

<Tabs groupId="storage-backend">

<TabItem value="piraeus" label="Piraeus/LINSTOR">

1. Select **Set Up a Storage Pool**. The appliance creates **Set Up a Storage Pool** during deployment, so the wizard
   marks it complete by default.

2. To create more storage pools, select **Create Storage Pool**, enter the following values, and select **Create Storage
   Pool**.

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

   ![Screenshot of getting started storage pool creation](/vmo/vm-management_vm-launchpad_getstart-storage-pool-4-9.webp)

3. Select **Review Storage Policy** to display the default **Piraeus DRBD Performance Tuning** storage policy. You can
   add more policies here.

4. On the **Getting Started** wizard pop-up, select **Set Up a Storage Class**.

5. Select **Create Storage Class**, enter the following values, and select **Create Storage Class**.

   | **Parameter**             | **Description**                                                                                                                                                        |
   | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Class Name**            | Name for the storage class.                                                                                                                                            |
   | **Storage Class Options** | The storage class enables **Allow Expansion** and **Allow for VMs** by default. Select **Default Class** to make this storage class the default.                       |
   | **Reclaim Policy**        | Select the behavior to reclaim storage. Defaults to `Delete`. You can also select `Retain`.                                                                            |
   | **Binding Mode**          | Select `WaitForFirstConsumer` or `Immediate`.                                                                                                                          |
   | **Select a Policy**       | From the drop-down menu, select **No Policy (manual parameters)** or **Piraeus DRBD Performance Tuning (11 parameters)**. Policies created in step 3 also appear here. |
   | **Storage Pool**          | From the drop-down menu, select `-Select a pool-` or `lvm-thin`. Storage pools created earlier also appear here.                                                       |

</TabItem>

<TabItem value="portworx" label="Portworx">

On the Portworx variant, the **Getting Started** wizard does not include the **Set Up a Storage Pool** and **Review
Storage Policy** steps. Portworx stores VM disks in a Portworx storage cluster instead of LINSTOR storage pools.

1. Select **Create a Portworx Storage Cluster**. The wizard opens the **New Portworx Storage Cluster** form.

2. Complete the form, and then select **Save** in the upper-right corner. You need only one storage cluster for each VM
   Launchpad cluster. Refer to [Storage Clusters](./infrastructure/storage.md#storage-clusters) for the form fields and
   the disks that Portworx claims.

3. Wait until the storage cluster is running. From the VMO left main menu, select **Infrastructure** > **Storage** >
   **Portworx Storage Clusters**, and then select the storage cluster to review its status. Check the status even if the
   **Getting Started** wizard already shows the step as complete, because Portworx might still be initializing. When the
   storage cluster is running, Portworx creates its CSI StorageClasses, such as `px-csi-db`.

4. Return to the **Getting Started** wizard, and select **Set Up a Storage Class**.

5. Choose a StorageClass for your VMs. VMs can use only StorageClasses that are enabled for VM workloads.

   - To use a StorageClass that Portworx created, check its **VM Workloads** column. If the class is not enabled,
     right-click the class or open its detail page, and then select **Enable for VM Workloads**.

   - To create a StorageClass, select **Create Storage Class**, and then confirm that **Allow for VMs** is selected.
     Refer to [Create a StorageClass](./infrastructure/storage.md#create-a-storageclass) for the fields and the Portworx
     parameters.

</TabItem>

</Tabs>

### Configure Networks and Namespaces

1. Return to the **Getting Started** wizard, and select **Create Networks**.

2. On the **Network Attachment Definitions** page, select **Create NAD**.

3. On the **Create Network Attachment Definition** page, enter the following information, and select **Create**.

   | **Parameter**          | **Description**                                                                                                                                                             |
   | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Name**               | Name of the NAD.                                                                                                                                                            |
   | **Namespace**          | Namespace for the NAD. The appliance creates the `default`, `virtual-machines`, and `vmo-golden-images` namespaces. To add namespaces, select **Create Namespace**.         |
   | **Network Type**       | Defaults to `Linux Bridge`. Other options include `macvlan`, `ipvlan`, `SR-IOV`, and `Custom JSON`.                                                                         |
   | **Bridge Name**        | Defaults to `br0`. The appliance creates `virbr0`. More bridges may exist on the VM Launchpad node.                                                                         |
   | **VLAN Mode**          | Defaults to `Access` for untagged VLAN access. For tagged VLANs, the configuration creates one NAD for each VLAN. Select `Trunk` to support more than one VLAN for one NAD. |
   | **Tagged VLANs**       | Optional. Enter one or more comma-separated VLAN IDs.                                                                                                                       |
   | **IPAM Configuration** | Optional JSON.                                                                                                                                                              |
   | **Generated Config**   | Displays a preview of the NAD JSON.                                                                                                                                         |

   :::info

   If your environment does not display the default namespaces, navigate to **Infrastructure** > **Namespaces**, and
   select **Add Existing**.

   :::

4. Return to the **Getting Started** wizard, and select **Add Namespaces**.

5. By default, the **Namespaces** page displays three namespaces: `default`, `virtual-machines`, and
   `vmo-golden-images`. To create another namespace, select **Create Namespace**.

## Verify

1. Navigate to the **Getting Started** pop-up.

2. The **Storage, Networks, & Namespaces** section displays every step crossed out. The section has five steps on the
   Piraeus/LINSTOR variants and four steps on the Portworx variant.

## Next Steps

After you configure VM Launchpad, use the [Create Your First VM](./quick-start.md) guide to create your first VM.
