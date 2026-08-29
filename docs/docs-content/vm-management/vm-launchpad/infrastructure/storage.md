---
sidebar_label: "Storage"
title: "Storage"
description:
  "Manage StorageClasses, storage pools, and DataVolumes that back virtual machine disks on PaletteAI VM Launchpad."
icon: " "
hide_table_of_contents: false
sidebar_position: 20
tags: ["vmo", "vm launchpad", "infrastructure", "storage"]
---

Virtual Machine Orchestrator (VMO) manages the storage that backs VM disks. From **Infrastructure** > **Storage**, you
can manage [StorageClasses](https://kubernetes.io/docs/concepts/storage/storage-classes/), storage pools, and
[DataVolumes](https://kubevirt.io/user-guide/storage/containerized_data_importer/). PaletteAI VM Launchpad ships with
Piraeus/LINSTOR as the default storage backend, but VMO works with any StorageClass that supports dynamic provisioning.

## Storage Providers

VMO does not require a specific storage backend. It works with any Kubernetes StorageClass that supports dynamic
provisioning.

The default appliance backend is Piraeus/LINSTOR, which provides:

- Replicated storage for VM disks.
- StorageClass-based provisioning.
- LVM-based storage pools.

You can use other providers, such as host-path or Rook-Ceph, depending on the cluster configuration.

### Validated Providers for VM Storage in 4.10.0

In 4.10.0, the following providers are validated for VM storage on PaletteAI VM Launchpad:

- Portworx SDS
- Portworx with Pure Array

Both are supported when you install the appliance using the Slim ISO and Content Bundle path, which lets the appliance
boot on its own storage and administrators attach the customer-chosen CSI for VM workloads afterward. Refer to
[Install VM Launchpad](../install.md) for the install procedure.

## StorageClasses

StorageClasses define how VMO provisions PersistentVolumeClaims (PVCs). From **Infrastructure** > **Storage**, you can
perform the following StorageClass operations.

| Operation       | Description                                                                                                                      |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **List**        | View all StorageClasses in the cluster.                                                                                          |
| **Create**      | Create a new StorageClass, when the underlying provider supports it.                                                             |
| **Delete**      | Remove a StorageClass. If any PVCs or DataVolumes use the StorageClass, VMO blocks the deletion and lists the dependent volumes. |
| **Set default** | Mark one StorageClass as the cluster default. New PVCs that do not specify a StorageClass use the default.                       |

### Create a StorageClass

1. From the VMO left main menu, select **Infrastructure** > **Storage** > **Storage Classes**.

2. Select **Create Storage Class**.

3. Configure the following fields.

   | **Field**                                          | **Description**                                                                                                       |
   | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
   | **Class Name**                                     | The StorageClass name. Follow Kubernetes naming rules (lowercase, alphanumeric, hyphens); up to 128 characters.       |
   | **Default Class**                                  | Select to mark this StorageClass as the cluster default. New PVCs that do not specify a StorageClass use the default. |
   | **Allow Expansion**                                | Select to let PVCs expand. The underlying provider must support volume expansion.                                     |
   | **Allow for VMs**                                  | Select to make this StorageClass available for VM workloads.                                                          |
   | **Create StorageProfile for CSI-assisted cloning** | Select to enable offloaded DataVolume clones (`csi-clone`) on Block volumes for this StorageClass.                    |
   | **Reclaim Policy**                                 | The Kubernetes reclaim policy: `Delete` or `Retain`. Controls what happens to a PV when its PVC is released.          |
   | **Binding Mode**                                   | `Immediate` or `WaitForFirstConsumer`. Controls when volume binding and dynamic provisioning happen.                  |

4. Under **Parameters**, configure how VMO provisions volumes. The available parameters depend on the storage provider.
   The following parameters apply to Piraeus/LINSTOR.

   | **Field**                            | **Description**                                                                                                                                   |
   | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Select a Policy**                  | Select a [Storage Policy](#storage-policies) to fill in the parameters below, or choose **No Policy (manual parameters)** to enter them manually. |
   | **Storage Pool**                     | The name of the LINSTOR storage pool to provision from.                                                                                           |
   | **Placement Count**                  | The number of replicas for each volume.                                                                                                           |
   | **Resource Group**                   | The LINSTOR resource group name.                                                                                                                  |
   | **Advanced Parameters** _(Optional)_ | Expand to configure other provider-specific parameters as key-value pairs.                                                                        |

5. Select **Create Storage Class**.

### Set the Default StorageClass

Only one StorageClass can be the cluster default at a time. New PVCs that do not specify a StorageClass use the default.
Set the default in one of two ways:

- **During creation**: Select the **Default Class** checkbox in the [Create Storage Class](#create-a-storageclass)
  modal.
- **On an existing StorageClass**: Edit the StorageClass and select the **Default Class** checkbox.

:::warning

StorageClasses are immutable in Kubernetes. Saving an edit deletes the existing StorageClass and recreates it with the
updated settings. The same delete-and-recreate applies to the _previous_ default when you mark a new one, because VMO
clears the previous default in the same way. If any PVCs or DataVolumes reference the affected StorageClass, whether the
one you are editing or the previous default when switching, the deletion step fails and the save is rejected. Delete or
reassign the dependent volumes before editing or switching the default.

:::

To set the default on an existing StorageClass, take the following steps.

1. From the VMO left main menu, select **Infrastructure** > **Storage** > **Storage Classes**.

2. In the Storage Classes list, select the row of the StorageClass you want to make the default. The details panel opens
   on the right.

3. Select **Edit**.

4. Select the **Default Class** checkbox.

5. Select **Save**.

### Delete a StorageClass

1. From the VMO left main menu, select **Infrastructure** > **Storage** > **Storage Classes**.

2. In the Storage Classes list, select the row of the StorageClass you want to delete. The details panel opens on the
   right.

3. Select **Delete Storage Class**.

4. In the confirmation dialog, confirm the deletion.

If any PVCs or DataVolumes reference the StorageClass, VMO blocks the deletion and lists the dependent volumes. Delete
or reassign the dependent resources before retrying.

## Storage Profiles

Storage Profiles are CDI resources that define how VMO provisions DataVolumes for each StorageClass. VMO auto-creates a
StorageProfile when you enable **Create StorageProfile for CSI-assisted cloning** during StorageClass creation. The UI
exposes only editing; VMO manages Storage Profile creation and deletion for you.

### Edit a Storage Profile

1. From the VMO left main menu, select **Infrastructure** > **Storage** > **Storage Profiles**.

2. Select the StorageProfile you want to edit.

3. Configure the following fields.

   | **Field**          | **Description**                                                                                                                                                    |
   | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | **Volume Mode**    | `Block` or `Filesystem`. For Piraeus/LINSTOR, we recommend `Block` with `csi-clone`. Choose `Filesystem` only when the storage backend lacks Block volume support. |
   | **Clone Strategy** | `csi-clone`, `copy`, or `snapshot`. Controls how VMO clones DataVolumes backed by this StorageClass.                                                               |

4. Select **Save**.

## Storage Pools

Storage pools are provider-specific. For Piraeus/LINSTOR, VMO supports the following storage pool operations.

| Operation            | Description                                                                                                                                                                      |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Create**           | Create a new storage pool with a name and one or more block devices.                                                                                                             |
| **Delete**           | Remove a storage pool. You can remove a pool only when it is empty.                                                                                                              |
| **Device selection** | When creating a pool, select block devices from cluster nodes. The `vmo-node-agent` DaemonSet discovers physical block devices on each node and lists them in the device picker. |

:::info

Storage pool management depends on the storage provider. VMO supports Piraeus/LINSTOR pools directly. Other providers
may expose different APIs or require configuration outside VMO.

:::

### Create a Storage Pool

Storage Pool creation is provider-specific. The following steps apply to Piraeus/LINSTOR.

1. From the VMO left main menu, select **Infrastructure** > **Storage** > **Storage Pools**.

2. Select **Create Storage Pool**.

3. Configure the common fields.

   | **Field**        | **Description**                                                                                                                   |
   | ---------------- | --------------------------------------------------------------------------------------------------------------------------------- |
   | **Pool Name**    | The storage pool name. Up to 128 characters.                                                                                      |
   | **Pool Type**    | The backing storage type: `LVM Thin`, `LVM`, `ZFS`, `ZFS Thin`, `File`, or `File Thin`.                                           |
   | **Host Devices** | Block devices from cluster nodes to include in the pool. If no devices appear, enter a device path (for example, `/dev/nvme0n1`). |

4. Configure the fields for the selected **Pool Type**.

   <Tabs groupId="storage-pool-type">

   <TabItem value="lvm-thin" label="LVM Thin">

   | **Field**        | **Description**                                     |
   | ---------------- | --------------------------------------------------- |
   | **Volume Group** | The LVM volume group name (for example, `drbd-vg`). |
   | **Thin Pool**    | The LVM thin pool name (for example, `thinpool`).   |

   </TabItem>

   <TabItem value="lvm" label="LVM">

   | **Field**        | **Description**                                     |
   | ---------------- | --------------------------------------------------- |
   | **Volume Group** | The LVM volume group name (for example, `drbd-vg`). |

   </TabItem>

   <TabItem value="zfs" label="ZFS / ZFS Thin">

   | **Field**    | **Description**                  |
   | ------------ | -------------------------------- |
   | **ZFS Pool** | The name of the ZFS pool to use. |

   Select **ZFS Thin** for thin-provisioned ZFS volumes. Both pool types share the same configuration fields.

   </TabItem>

   <TabItem value="file" label="File / File Thin">

   | **Field**     | **Description**                                                                    |
   | ------------- | ---------------------------------------------------------------------------------- |
   | **Directory** | The host directory that stores pool files (for example, `/var/lib/linstor-pools`). |

   Select **File Thin** for thin-provisioned file-backed volumes. Both pool types share the same configuration fields.

   </TabItem>

   </Tabs>

5. Select **Create Storage Pool**.

### Edit a Storage Pool

The Storage Pools UI does not include an edit option. To change a pool's device selection or type, delete the pool and
recreate it.

### Delete a Storage Pool

1. From the VMO left main menu, select **Infrastructure** > **Storage** > **Storage Pools**.

2. In the Storage Pools list, select the row of the pool you want to delete. The details panel opens on the right.

3. Select **Delete Storage Pool**.

4. In the confirmation dialog, confirm the deletion.

If the storage pool is not empty, VMO blocks the deletion. Remove any resources that reference the pool before retrying.

### OS Disk Exclusion

VMO automatically excludes disks that back critical OS mount points (`/`, `/boot`, `/boot/efi`, `/efi`, and `/usr`) from
the device picker and marks them as in-use. This prevents you from accidentally adding a node's operating system disk to
a storage pool.

The exclusion covers the full parent disk, not just the mounted partition. For example, if `/dev/sda1` is mounted at
`/`, VMO hides the entire `sda` disk from the device list.

## Storage Policies

Storage Policies are reusable parameter presets for StorageClass creation. When creating a StorageClass, select a policy
from the **Select a Policy** drop-down to fill in provider-specific parameters instead of entering them manually. VMO
ships with a built-in **Piraeus DRBD Performance Tuning** policy for Piraeus/LINSTOR workloads with live-migration
support.

### Create a Storage Policy

1. From the VMO left main menu, select **Infrastructure** > **Storage** > **Storage Policies**.

2. Select **Create Policy**.

3. Configure the following fields.

   | **Field**                    | **Description**                                                                                                                  |
   | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
   | **Policy Name**              | The policy name. Follow Kubernetes naming rules (lowercase, alphanumeric, hyphens); up to 128 characters.                        |
   | **Display Name**             | A human-readable name for the policy. Shown in the Storage Policies list and in the Storage Class **Select a Policy** drop-down. |
   | **Description** _(Optional)_ | A short description of the policy.                                                                                               |
   | **Provider**                 | The storage provider the policy applies to (for example, `piraeus`).                                                             |

4. Use **Add Group** and **Add Parameter** to define the parameters the policy sets. VMO applies these parameters when
   you select the policy during StorageClass creation.

5. Select **Save**.

### Edit a Storage Policy

1. From the VMO left main menu, select **Infrastructure** > **Storage** > **Storage Policies**.

2. In the Storage Policies list, select the row of the policy you want to edit. The details panel opens on the right.

3. Select **Edit Policy**.

4. Adjust the parameter values in the **Edit Policy** modal.

5. Select **Save**.

:::info

Built-in policies (labeled with a **Built-in** tag) restrict edits to parameter values only. The policy name,
description, and parameter structure are managed by the system. Policies you create yourself allow full edits.

:::

### Delete a Storage Policy

1. From the VMO left main menu, select **Infrastructure** > **Storage** > **Storage Policies**.

2. In the Storage Policies list, select the row of the policy you want to delete. The details panel opens on the right.

3. Select **Delete Policy**.

4. In the confirmation dialog, confirm the deletion.

Built-in policies cannot be deleted. The **Delete Policy** button is only available on policies you create yourself.

## DataVolumes

[DataVolumes](https://kubevirt.io/user-guide/storage/containerized_data_importer/) are
[Containerized Data Importer (CDI)](https://github.com/kubevirt/containerized-data-importer) resources that back VM
disks. VMO supports the following DataVolume sources.

| Source       | Description                                       |
| ------------ | ------------------------------------------------- |
| **Upload**   | Upload from a browser. Uses the CDI upload proxy. |
| **URL**      | Import from an HTTP or HTTPS URL.                 |
| **Blank**    | An empty disk of the specified size.              |
| **Clone**    | Clone from an existing PVC or DataVolume.         |
| **Registry** | Import from a container registry.                 |

VMO lists DataVolumes on **Infrastructure** > **Storage**, where you can create and delete them.

The DataVolumes UI does not include a resize option. To change a DataVolume's size, delete and recreate it at the
desired size.

### Create a DataVolume

1. From the VMO left main menu, select **Infrastructure** > **Storage**.

2. Select **Create DataVolume**.

3. Configure the common fields.

   | **Field**         | **Description**                                                                                               |
   | ----------------- | ------------------------------------------------------------------------------------------------------------- |
   | **Name**          | The DataVolume name. Follow Kubernetes naming rules (lowercase, alphanumeric, hyphens); up to 128 characters. |
   | **Namespace**     | The namespace where VMO creates the DataVolume.                                                               |
   | **Storage Class** | The StorageClass that backs the DataVolume. Defaults to the cluster default (for example, `vmo-default-sc`).  |
   | **Size**          | The DataVolume size. Enter a number and select a unit: `Gi`, `Mi`, or `Ti`.                                   |
   | **Access Mode**   | `ReadWriteOnce`, `ReadWriteMany`, or `ReadOnlyMany`. The StorageClass must support the mode you select.       |
   | **Volume Mode**   | `Block` or `Filesystem`.                                                                                      |

4. Select a **Source** and configure its type-specific fields. For **Upload**, **URL**, and **Registry** sources, use
   the **Image** checkbox to control how VMO treats the volume. Leave the checkbox cleared for installer media, which
   VMO attaches as a CD-ROM drive in the VM. Select the checkbox for a bootable disk image or template source, which VMO
   clones as a VM boot disk.

   <Tabs groupId="datavolume-source">

   <TabItem value="upload" label="Upload">

   Upload a local file through the CDI upload proxy.

   | **Field** | **Description**                                                  |
   | --------- | ---------------------------------------------------------------- |
   | **File**  | Choose a local file. Accepts `.iso`, `.img`, and `.qcow2` files. |

   </TabItem>

   <TabItem value="url" label="URL">

   Import from an HTTP or HTTPS URL.

   | **Field**      | **Description**                          |
   | -------------- | ---------------------------------------- |
   | **Source URL** | The HTTP or HTTPS URL to the disk image. |

   </TabItem>

   <TabItem value="blank" label="Blank">

   Create an empty disk of the size specified in the common fields. Useful for boot disks or scratch volumes.

   </TabItem>

   <TabItem value="clone" label="Clone">

   Clone an existing PVC or DataVolume.

   | **Field**            | **Description**                         |
   | -------------------- | --------------------------------------- |
   | **Source Namespace** | The namespace that contains the source. |
   | **Source PVC**       | The PVC to clone from.                  |

   </TabItem>

   <TabItem value="registry" label="Registry">

   Import from a public container registry.

   | **Field**           | **Description**                                                                                                                                |
   | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Image Reference** | Public container image reference, for example, `docker://quay.io/org/image:tag`. VMO adds the `docker://` prefix automatically if you omit it. |

   :::info

   The VMO UI does not include an option to add private registries that require authentication. Contact
   [Spectro Cloud Support](mailto:support@spectrocloud.com) for manual configuration steps.

   :::

   </TabItem>

   </Tabs>

### Delete a DataVolume

1. From the VMO left main menu, select **Infrastructure** > **Storage** > **Data Volumes**.

2. Locate the DataVolume and choose one of the following actions:

   - Select the trash icon in the row's **Actions** column.
   - Check the boxes on the rows you want to delete, then select **Delete _N_**.

3. In the confirmation dialog, type the DataVolume name and select **Delete**.

:::warning

Deletion is irreversible. Ensure you have backups or snapshots if the data is important.

:::

## Persistent Volume Claims

The VMO UI does not include operations for managing
[PersistentVolumeClaims (PVCs)](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) directly. Provision VM
storage using [DataVolumes](#datavolumes), which provide the user-facing abstraction; VMO manages the underlying PVCs
for you. To inspect or modify PVCs directly, use `kubectl` or another Kubernetes tool.

## StorageClass Auto-Detection

VMO does not require a static StorageClass configuration. On startup, VMO reads the `spec.storageClassName` of its own
data PVC, such as `vmo-manager-data`, and caches the value. VMO uses the detected StorageClass as the default for:

- New VM disks.
- Golden image DataVolumes.
- Virtio PVCs.
- Builder disks.

If VMO does not detect a StorageClass, such as when no bound PVC exists, VMO falls back to the cluster default. When no
cluster default exists, you must specify a StorageClass explicitly when creating resources.

:::tip

To control the default storage for VM disks, configure the VMO data PVC with the StorageClass you want to use. This PVC
is the single source of truth for default storage.

:::
