---
sidebar_label: "Storage"
title: "Storage"
description:
  "Manage StorageClasses, storage pools, PersistentVolumeClaims, and DataVolumes that back virtual machine disks on the
  Launchpad for VMs appliance."
icon: " "
hide_table_of_contents: false
sidebar_position: 20
tags: ["vmo", "vm launchpad appliance", "infrastructure", "storage"]
---

Virtual Machine Orchestrator (VMO) manages the storage that backs VM disks. From **Infrastructure** > **Storage**, you
can manage [StorageClasses](https://kubernetes.io/docs/concepts/storage/storage-classes/), storage pools,
[PersistentVolumeClaims (PVCs)](https://kubernetes.io/docs/concepts/storage/persistent-volumes/), and
[DataVolumes](https://kubevirt.io/user-guide/storage/containerized_data_importer/). The Launchpad for VMs appliance
ships with Piraeus/LINSTOR as the default storage backend, but VMO works with any StorageClass that supports dynamic
provisioning.

## Storage Providers

VMO does not assume a specific storage backend. It works with any Kubernetes StorageClass that supports dynamic
provisioning.

The default appliance backend is **Piraeus/LINSTOR**, which provides:

- Replicated storage for VM disks.
- StorageClass-based provisioning.
- LVM-based storage pools.

You can use other providers, such as host-path or Rook-Ceph, depending on the cluster configuration.

## StorageClasses

StorageClasses define how VMO provisions PVCs. From **Infrastructure** > **Storage**, you can perform the following
StorageClass operations.

| Operation       | Description                                                                                                                      |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **List**        | View all StorageClasses in the cluster.                                                                                          |
| **Create**      | Create a new StorageClass, when the underlying provider supports it.                                                             |
| **Delete**      | Remove a StorageClass. If any PVCs or DataVolumes use the StorageClass, VMO blocks the deletion and lists the dependent volumes. |
| **Set default** | Mark one StorageClass as the cluster default. New PVCs that do not specify a StorageClass use the default.                       |

## Storage Pools

Storage pools are provider-specific constructs. For Piraeus/LINSTOR, VMO supports the following storage pool operations.

| Operation            | Description                                                                                                                                                 |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Create**           | Create a new storage pool with a name and one or more block devices.                                                                                        |
| **Delete**           | Remove a storage pool. You can remove a pool only when it is empty.                                                                                         |
| **Device selection** | When creating a pool, select block devices from cluster nodes. The `vmo-node-agent` DaemonSet discovers physical block devices on each node and lists them. |

:::info

Storage pool management depends on the storage provider. VMO supports Piraeus/LINSTOR pools directly. Other providers
may expose different APIs or require configuration outside VMO.

:::

### OS Disk Exclusion

VMO automatically excludes disks that back critical OS mount points (`/`, `/boot`, `/boot/efi`, `/efi`, and `/usr`) from
the device picker and marks them as in-use. This prevents you from accidentally adding a node's operating system disk to
a storage pool.

The exclusion covers the full parent disk, not just the mounted partition. For example, if `/dev/sda1` is mounted at
`/`, VMO hides the entire `sda` disk from the device list.

## DataVolumes

[DataVolumes](https://kubevirt.io/user-guide/storage/containerized_data_importer/) are
[Containerized Data Importer (CDI)](https://github.com/kubevirt/containerized-data-importer) resources that back VM
disks. VMO supports the following DataVolume sources.

| Source     | Description                                       |
| ---------- | ------------------------------------------------- |
| **Blank**  | An empty disk of the specified size.              |
| **URL**    | Import from an HTTP or HTTPS URL.                 |
| **Clone**  | Clone from an existing PVC or DataVolume.         |
| **Upload** | Upload from a browser. Uses the CDI upload proxy. |

VMO lists DataVolumes on **Infrastructure** > **Storage**, where you can create, resize, and delete them.

When creating a DataVolume from **Upload**, **URL**, or **Registry**, use the **Image** checkbox to control how VMO
treats the volume during VM creation.

- **Cleared**: VMO treats the DataVolume as installer media and attaches it as a CD-ROM drive in the VM.
- **Selected**: VMO treats the DataVolume as a ready-to-boot disk or template image and clones it as a VM boot disk.

## Persistent Volume Claims

VMO provides PVC operations from **Infrastructure** > **Storage**.

| Operation  | Description                                                                                     |
| ---------- | ----------------------------------------------------------------------------------------------- |
| **List**   | View PVCs across namespaces.                                                                    |
| **Resize** | Expand a PVC's capacity when the StorageClass and underlying provider support volume expansion. |
| **Delete** | Remove a PVC. Confirm that no VMs or DataVolumes reference the PVC before deleting.             |

## StorageClass Auto-Detection

VMO does not require a static StorageClass configuration. On startup, VMO reads the `spec.storageClassName` of its own
data PVC, such as `vmo-manager-data`, and caches the value. VMO uses the detected StorageClass as the default for:

- New VM disks.
- Golden image DataVolumes.
- Virtio PVCs.
- Builder disks.

If VMO does not detect a StorageClass, such as when no bound PVC exists, VMO falls back to the cluster default. When no
cluster default is configured, you must specify a StorageClass explicitly when creating resources.

:::tip

To control the default storage for VM disks, configure the VMO data PVC with the StorageClass you want to use. This PVC
is the single source of truth for default storage.

:::
