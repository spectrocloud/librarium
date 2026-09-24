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

The appliance backend depends on the [appliance variant](../install.md#install) you install:

- **Piraeus/LINSTOR** provides replicated block storage for VM disks, StorageClass-based provisioning, and LVM-based
  storage pools. This backend ships with both the FIPS and non-FIPS Piraeus variants.
- **Portworx** provides enterprise distributed storage for VM disks. This backend ships with the non-FIPS Portworx
  variant.

You can also use other providers, such as host-path or Rook-Ceph, depending on the cluster configuration.

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

   <Tabs groupId="storage-backend">

   <TabItem value="piraeus" label="Piraeus/LINSTOR">

   | **Field**                            | **Description**                                                                                                                                   |
   | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Select a Policy**                  | Select a [Storage Policy](#storage-policies) to fill in the parameters below, or choose **No Policy (manual parameters)** to enter them manually. |
   | **Storage Pool**                     | The name of the LINSTOR storage pool to provision from.                                                                                           |
   | **Placement Count**                  | The number of replicas for each volume.                                                                                                           |
   | **Resource Group**                   | The LINSTOR resource group name.                                                                                                                  |
   | **Advanced Parameters** _(Optional)_ | Expand to configure other provider-specific parameters as key-value pairs.                                                                        |

   </TabItem>

   <TabItem value="portworx" label="Portworx">

   Portworx StorageClasses expose the Portworx volume options. The provisioner determines the full set of available
   parameters. The following options are the most common.

   | **Field**                            | **Description**                                                                                               |
   | ------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
   | **Replication Factor**               | The number of synchronous volume replicas across nodes (Portworx `repl`), typically `1`, `2`, or `3`.         |
   | **IO Profile**                       | The Portworx IO profile (`io_profile`) that tunes the volume for the workload, such as `auto` or `db_remote`. |
   | **IO Priority**                      | The relative IO priority (`io_priority`): `high`, `medium`, or `low`.                                         |
   | **Filesystem**                       | The volume filesystem (`fs`), such as `ext4` or `xfs`.                                                        |
   | **Encryption**                       | Enable Portworx volume encryption (`secure`).                                                                 |
   | **Shared (RWX)**                     | Enable shared ReadWriteMany volumes (`sharedv4`) for multi-attach and live migration.                         |
   | **Advanced Parameters** _(Optional)_ | Expand to configure other Portworx parameters as key-value pairs.                                             |

   </TabItem>

   </Tabs>

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

Storage pools are provider-specific constructs backed by the storage provider's own resources. VMO does not provide a
dedicated **Storage Pools** tab. The underlying Piraeus/LINSTOR storage-pool APIs remain available and unchanged.

To carve dedicated storage devices out of a node's disks, such as a KVDB, journal, or metadata partition for Portworx,
use the [disk partitioning workflow](#partition-a-disk-for-storage).

## Portworx Storage Clusters

On appliances that use the Portworx storage backend, the **Storage** page includes an extra **Storage Clusters** tab
that does not appear on Piraeus/LINSTOR appliances. VMO owns the Portworx `StorageCluster` lifecycle: the Portworx pack
installs the operator without deploying a cluster, and VMO manages the `StorageCluster` resource so you can review its
configuration and status from this tab.

1. From the VMO left main menu, select **Infrastructure** > **Storage** > **Storage Clusters**.

2. Select the Portworx `StorageCluster` to review its configuration and status.

## Partition a Disk for Storage

VMO can partition a discovered disk on a cluster node directly from a device field, for example to carve a small KVDB,
journal, or metadata partition for Portworx out of a larger disk, or to split a single disk into a metadata partition
and a data partition.

The workflow lives inside the block-device picker on device fields that support partitioning, such as the **KVDB
Device**, **Journal Device**, and **Metadata Device** fields. Open the picker for such a field and select **Partition a
disk** to launch the partition tool.

### Prerequisites

- Disk partitioning is enabled on the node agent. The feature is opt-in and dormant by default. Enabling it adds a
  container to the node-agent DaemonSet that runs with elevated privileges so it can write partition tables to raw block
  devices. Both partitioning and the **Wipe disk** action require this feature. When it is not enabled, the tool reports
  that disk partitioning is unavailable.

- Your account holds the `vmo:storage:partition` permission. Among the built-in roles, only **Platform Admin** holds it.
  This permission is separate from `vmo:storage:write` because partitioning destructively rewrites the partition table
  on a physical host disk.

- The node agent is running on the target nodes. The workflow offers only devices from live node-agent discovery.

### Author Partitions

1. Open the block-device picker for a device field that supports partitioning and select **Partition a disk**.

2. Select the target node or nodes and one discovered device. When the field is scoped to specific nodes, the node scope
   is pre-filled. For a cluster-level field, select the nodes yourself, and VMO partitions the same device name on each.

3. Author the partitions. Each partition row takes a size in GiB and an optional reference label. Select **Add
   partition** to split one disk into several labeled partitions in a single operation, for example a 64 GiB metadata
   partition plus a data partition.

4. (Optional) To size the last partition to the remaining free space on the disk, set it to **Use remaining space**
   instead of a fixed size. Only the last row can use remaining space.

5. Review the summary, then type the exact device name to confirm. The confirmation is deliberate, because the operation
   writes a partition table to a physical disk.

6. Submit. VMO validates the request against current discovery data and records it as a `PartitionIntent` resource. The
   node agent writes the partitions on the target node and reports the created partition paths.

The partitions you create become selectable in device pickers after the node agent's next discovery scan. The field you
partitioned from is filled with the new partition path right away.

:::warning

VMO never partitions or wipes the disk that hosts the operating system. The safety guard detects only active mounts,
holders, and in-use state. It does not detect inactive members, such as an unmounted LVM physical volume or a
non-assembled software RAID member. Before you partition or wipe a disk, confirm it carries nothing you need.

:::

### Wipe a Disk

**Wipe disk** is a separate, destructive action that clears a disk's entire partition table so you can repartition it
from scratch. Use it to reset a disk whose existing partition table blocks a fresh partitioning attempt.

1. In the partition tool, select the target node or nodes and one device.

2. Select **Wipe disk**.

3. Type the exact device name to confirm.

VMO refuses the wipe when the disk hosts the operating system, or when the disk or any of its partitions is mounted, in
use, or has active holders.

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
