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

:::info

Set up the storage backend before you create a StorageClass. On the Piraeus/LINSTOR variants, VM storage is provisioned
through LINSTOR [storage pools](#storage-pools). On the Portworx variant, create the
[Storage Cluster](#storage-clusters) first. Create your StorageClasses on the configured backend afterward.

:::

## StorageClasses

StorageClasses define how VMO provisions PersistentVolumeClaims (PVCs). From **Infrastructure** > **Storage**, you can
perform the following StorageClass operations.

| Operation                   | Description                                                                                                                           |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **List**                    | View all StorageClasses in the cluster.                                                                                               |
| **Create**                  | Create a new StorageClass, when the underlying provider supports it.                                                                  |
| **Delete**                  | Remove a StorageClass. If any PVCs or DataVolumes use the StorageClass, VMO blocks the deletion and lists the dependent volumes.      |
| **Set default**             | Mark one StorageClass as the cluster default. New PVCs that do not specify a StorageClass use the default.                            |
| **Enable for VM Workloads** | Make an existing StorageClass available for VM disks and volumes. The **VM Workloads** column shows which StorageClasses are enabled. |

VMs can use only StorageClasses that are enabled for VM workloads. On the Portworx variant, Portworx creates its own CSI
StorageClasses, such as `px-csi-db`, when the [Portworx storage cluster](#storage-clusters) is running. To use one of
them for VMs, check its **VM Workloads** column. If the class is not enabled, right-click the class or open its detail
page, and then select **Enable for VM Workloads**. You can also [create a StorageClass](#create-a-storageclass) with
**Allow for VMs** selected.

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

Storage Profiles are CDI resources that define how VMO provisions DataVolumes for each StorageClass. They apply to any
StorageClass, regardless of the storage backend. VMO auto-creates a StorageProfile when you enable **Create
StorageProfile for CSI-assisted cloning** during StorageClass creation. The UI exposes only editing; VMO manages Storage
Profile creation and deletion for you.

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

Storage pools apply to the Piraeus/LINSTOR variants. They are provider-specific constructs backed by native LINSTOR
storage resources. VMO does not provide a dedicated **Storage Pools** tab; the underlying Piraeus/LINSTOR storage-pool
APIs remain available and unchanged. To dedicate whole disks or partitions to a LINSTOR storage pool, use the
[disk partitioning workflow](#partition-a-disk-for-storage).

On the Portworx variant, you manage node-local devices through the [Storage Cluster](#storage-clusters) wizard instead.

## Storage Clusters

Only the Portworx storage backend uses a Kubernetes `StorageCluster` object. The storage-cluster operations available to
you depend on the [appliance variant](../install.md#install) you install.

<Tabs groupId="storage-backend">

<TabItem value="piraeus" label="Piraeus/LINSTOR">

Piraeus/LINSTOR appliances do not use a `StorageCluster` object and do not include a **Portworx Storage Clusters** tab.
Piraeus provisions VM storage through LINSTOR storage pools. To dedicate whole disks or partitions to a storage pool,
use the [disk partitioning workflow](#partition-a-disk-for-storage) and reference the resulting devices in your LINSTOR
configuration. Refer to [Storage Pools](#storage-pools) for more information.

</TabItem>

<TabItem value="portworx" label="Portworx">

On appliances that use the Portworx storage backend, the **Storage** page includes an extra **Portworx Storage
Clusters** tab that does not appear on Piraeus/LINSTOR appliances. The Portworx pack installs the Portworx operator
without deploying a cluster, so you create the Portworx `StorageCluster` with the **New Portworx Storage Cluster**
wizard. Create one storage cluster for each VM Launchpad cluster. The **New Portworx Storage Cluster** button is
unavailable while a storage cluster exists, because the Portworx operator supports one storage cluster for each
Kubernetes cluster. The cluster must have three control plane nodes, or one control plane node and three worker nodes.
When the storage cluster is running, Portworx creates its CSI StorageClasses. Refer to [StorageClasses](#storageclasses)
to make one of them available for VM workloads.

The storage cluster uses one of the following storage backends:

- **Local disks (software-defined)**: Portworx claims block devices on each node.

- **Pure FlashArray**: Portworx provisions cloud drives on an Everpure (formerly Pure Storage) FlashArray. You need the
  management endpoint and an API token of each FlashArray, and the cluster nodes must reach the FlashArray over iSCSI or
  Fibre Channel.

<!-- TODO(PVM-1297): confirm with Shubham which host prerequisites (iSCSI initiator, multipath, Fibre Channel) the Portworx appliance image already includes, and whether readers must set anything up on the nodes. -->

**Create a Portworx Storage Cluster**

On VMware vSphere VMs, set the disks that Portworx uses to non-rotational before you create the storage cluster.
Otherwise, the storage cluster does not initialize. Refer to
[Portworx Storage Cluster Does Not Initialize on VMware vSphere VMs](../troubleshooting.md#scenario---portworx-storage-cluster-does-not-initialize-on-vmware-vsphere-vms)
for instructions.

1. From the VMO left main menu, select **Infrastructure** > **Storage** > **Portworx Storage Clusters**.

2. Select **New Portworx Storage Cluster**.

3. Enter a **Name**. The **Namespace** is preset to `portworx` and cannot be changed, because the Portworx Storage
   Cluster must use the `portworx` namespace.

4. (Optional) Under **Metadata**, add labels and annotations. The appliance pre-populates the Portworx annotations the
   cluster requires, such as `portworx.io/misc-args`, `portworx.io/pvc-controller-port`, and
   `portworx.io/pvc-controller-secure-port`.

5. Select a **Storage backend**, and confirm that the **Run on control plane** configuration preset is enabled. With
   **Pure FlashArray**, the form adds a **Pure FlashArray credentials** panel and replaces the **Storage** and **Nodes**
   sections with **Cloud Storage** and **Pure Platform**.

6. _(Pure FlashArray only)_ In the **Pure FlashArray credentials** panel, enter the **Management endpoint** and **API
   token** of each FlashArray. Select **Add FlashArray** to add another array. Portworx reads these connection details
   from a Secret named `px-pure-secret` in the `portworx` namespace. When the Secret exists, the panel reports that it
   is present.

   <!-- TODO(PVM-1297): confirm with Shubham what the panel shows when px-pure-secret does not exist yet (the button name, and whether the panel creates the Secret or the reader creates it first). -->

7. _(Pure FlashArray only)_ In the **Cloud Storage** section, under **Device Specs**, set the **Size** of each storage
   pool in GiB. Select **Add pool** to add a pool. Keep the **Provider** set to `pure`.

8. _(Pure FlashArray only)_ To connect to the FlashArray over Fibre Channel instead of iSCSI, select the **Env** section
   and add the `PURE_FLASHARRAY_SAN_TYPE` environment variable with the value `FC`.

   <!-- TODO(PVM-1297): confirm with Shubham that iSCSI is the default and that Fibre Channel is set through the Env section. -->

9. Configure the remaining wizard sections from the left panel. The following table describes the most common fields.
   The **Summary** and **Validation** panels on the right update as you go.

   | **Section**         | **What you configure**                                                                                                                                                                                                                                                                                                                                                                                                                               |
   | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **General**         | **Secrets Provider**: `k8s` stores Portworx credentials as Kubernetes secrets.<br />**Custom Image Registry**: a registry prefix prepended to every Portworx image, required for airgapped clusters and left empty on connected clusters to pull from `docker.io`.<br />**Image**: the Portworx image.                                                                                                                                               |
   | **Storage**         | _(Local disks only)_ The node-local block **Devices** Portworx claims, the **System Metadata Device**, and optional **Journal Device**, **KVDB Device**, and **Cache Devices**. Select **Force Use Disks** to reuse disks that already carry data, or **Use All** to claim every available disk. Use the block-device picker's [disk partitioning workflow](#partition-a-disk-for-storage) to carve dedicated KVDB, journal, or metadata partitions. |
   | **Nodes**           | _(Local disks only)_ Per-node storage overrides for heterogeneous hardware.                                                                                                                                                                                                                                                                                                                                                                          |
   | **Cloud Storage**   | _(Pure FlashArray only)_ The **Device Specs** storage pools, sized in GiB, the **Kvdb Device Spec** and **System Metadata Device Spec** sizes, optional **Journal Device Spec** and **Capacity Specs**, and the cloud drive **Provider**, `pure`.                                                                                                                                                                                                    |
   | **Pure Platform**   | _(Pure FlashArray only)_ Optional **Fusion** and **Integration Operator** settings.                                                                                                                                                                                                                                                                                                                                                                  |
   | **Kvdb**            | The Portworx key-value store. Keep **Internal** selected for an internal KVDB, or clear it and provide **Endpoints** and an **Auth Secret** for an external KVDB. Select **Enable TLS** to secure KVDB traffic.                                                                                                                                                                                                                                      |
   | **Csi**             | Enable the Portworx CSI driver and choose an internal or external CSI deployment.                                                                                                                                                                                                                                                                                                                                                                    |
   | **Network**         | The **Data Interface** Portworx uses for storage traffic and the **Mgmt Interface** it uses for management traffic.                                                                                                                                                                                                                                                                                                                                  |
   | **Volumes**         | Default settings applied to new Portworx volumes.                                                                                                                                                                                                                                                                                                                                                                                                    |
   | **Autopilot**       | Enable Portworx Autopilot to automatically expand capacity as pools fill.                                                                                                                                                                                                                                                                                                                                                                            |
   | **Delete Strategy** | How Portworx cleans up when you delete the cluster: `Uninstall`, `UninstallAndWipe`, or `UninstallAndDelete`. Select **Ignore Volumes** to leave provisioned volumes in place.                                                                                                                                                                                                                                                                       |
   | **Env**             | Environment variables that the storage cluster passes to Portworx, such as `PURE_FLASHARRAY_SAN_TYPE`.                                                                                                                                                                                                                                                                                                                                               |

   If you use a V1 Storage Cluster, you do not need to create a separate metadata device. Portworx uses one unmounted
   partition or a raw unmounted disk that you provide.

10. (Optional) Select **Advanced** to edit the `StorageCluster` as raw YAML instead of using the form.

11. Review the **Summary** and confirm that **Validation** reports no issues, and then select **Save** in the
    upper-right corner.

:::warning

Portworx claims and formats the disks and devices you select in the **Storage** section. Confirm that each disk carries
nothing you need before you save the cluster.

:::

**Review a Portworx Storage Cluster**

1. From the VMO left main menu, select **Infrastructure** > **Storage** > **Portworx Storage Clusters**.

2. Select a Portworx `StorageCluster` to review its configuration, status, and cluster metrics such as nodes online,
   cluster size, capacity used, and capacity total. The **Phase** is `initializing` while Portworx starts, `running`
   when the storage cluster is ready, and `degraded` if the installation failed or while you delete the storage cluster.

**Rotate Pure FlashArray Credentials**

1. From the VMO left main menu, select **Infrastructure** > **Storage** > **Portworx Storage Clusters**.

2. Select **Edit** next to your storage cluster.

3. In the **Pure FlashArray credentials** panel, select **Edit**.

4. Update the **Management endpoint** or **API token** of each FlashArray. The form never displays stored tokens. Leave
   an **API token** blank to keep the stored token for that endpoint.

5. Select **Rotate credentials**. The change updates only the `pure.json` key of the `px-pure-secret` Secret, not the
   storage cluster.

<!-- TODO(PVM-1297): confirm with Shubham whether Portworx picks up rotated credentials without a restart, and whether the reader then leaves the storage cluster form with Cancel. -->

</TabItem>

</Tabs>

## Partition a Disk for Storage

VMO can partition a discovered disk on a cluster node directly from a device field, for example to carve a small KVDB,
journal, or metadata partition for Portworx out of a larger disk, or to split a single disk into a metadata partition
and a data partition.

You partition a disk from the **block-device picker**, the control that opens on device fields that support
partitioning, such as the **KVDB Device**, **Journal Device**, and **Metadata Device** fields in the Portworx Storage
Cluster wizard. Open the picker for one of these fields and select **Partition a disk** to launch the partition tool.

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

Start from a device field that supports partitioning in the Portworx Storage Cluster wizard. Refer to
[Create a Portworx Storage Cluster](#storage-clusters) to open the wizard.

1. Open the block-device picker for the device field and select **Partition a disk**.

2. Select the target node or nodes and one discovered device. When the field is scoped to specific nodes, the node scope
   is pre-filled. For a cluster-level field, select the nodes yourself, and VMO partitions the same device name on each.

3. Author the partitions. Each partition row takes a size in GiB and an optional reference label. Select **Add
   partition** to split one disk into several labeled partitions in a single operation, for example a 64 GiB metadata
   partition plus a data partition.

4. (Optional) To size the last partition to the remaining free space on the disk, set it to **Use remaining space**
   instead of a fixed size. Only the last row can use remaining space.

5. Review the summary, then type the exact device name to confirm. The confirmation is deliberate, because the operation
   writes a partition table to a physical disk.

6. Select **Submit**. VMO validates the request against current discovery data and records it as a `PartitionIntent`
   resource. The node agent writes the partitions on the target node and reports the created partition paths.

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

VMO does not wipe a disk that hosts the operating system, or a disk whose partitions are mounted, in use, or have active
holders.

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
