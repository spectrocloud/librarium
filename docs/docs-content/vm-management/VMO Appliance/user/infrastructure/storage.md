# Storage

This document describes how VMO Manager manages storage for virtual machines: storage providers, StorageClasses, storage pools, and data volumes.

## Storage Providers

VMO Manager uses Kubernetes StorageClasses for VM disk provisioning. The default platform often uses **Piraeus/LINSTOR** as the storage backend, which provides:

- Replicated storage for VM disks
- StorageClass-based provisioning
- LVM-based storage pools

Other storage providers (e.g. host-path, Rook-Ceph) may be used depending on cluster configuration. VMO Manager does not assume a specific provider; it works with any StorageClass that supports dynamic provisioning.

## StorageClass Management

StorageClasses define how PersistentVolumeClaims (PVCs) are provisioned. VMO Manager allows:

- **List** — View all StorageClasses in the cluster.
- **Create** — Create a new StorageClass (when supported by the provider).
- **Delete** — Remove a StorageClass. If any PVCs or DataVolumes use this StorageClass, the delete is blocked and a list of dependent volumes is shown.
- **Set default** — Mark one StorageClass as the cluster default. New PVCs without an explicit StorageClass use the default.

## Storage Pools

Storage pools are provider-specific constructs. For Piraeus/LINSTOR:

- **Create** — Create a new storage pool with name and device selection.
- **Delete** — Remove a storage pool (only when empty).
- **Device selection** — When creating a pool, select block devices from nodes. The vmo-node-agent DaemonSet discovers physical block devices on each node.

> **Note:** Storage pool management depends on the storage provider. VMO Manager supports Piraeus/LINSTOR pools. Other providers may expose different APIs.

## Data Volumes

DataVolumes (CDI resources) are used for VM disks. VMO Manager supports:

| Source | Description |
|--------|-------------|
| **Blank** | Empty disk of specified size. |
| **URL** | Import from HTTP/HTTPS URL. |
| **Clone** | Clone from existing PVC or DataVolume. |
| **Upload** | Upload via browser. Uses CDI upload proxy. |

DataVolumes are listed in **Infrastructure > Storage** (or the relevant storage tab). You can create, resize, and delete DataVolumes.

When creating a DataVolume from **Upload**, **URL**, or **Registry**, use the **Image** checkbox to choose how VMO Manager treats it in VM creation. Leave it unchecked for installer media, which is attached as a CD-ROM drive when used in a VM. Check it for ready-to-boot disk or template images, which are cloned as VM boot disks.

## PVC Management and Resize

- **List** — View PVCs across namespaces.
- **Resize** — Expand a PVC's capacity when the StorageClass and underlying provider support expansion.
- **Delete** — Remove a PVC. Ensure no VMs or DataVolumes reference it.

## StorageClass Auto-Detection

VMO Manager does not require a static StorageClass configuration. At runtime, it **auto-detects** the StorageClass from its own bound PVC:

1. VMO Manager runs in a namespace with a data PVC (e.g. `vmo-manager-data`).
2. On startup, it queries this PVC and reads its `spec.storageClassName`.
3. The detected StorageClass is cached and used as the default for:
   - New VM disks
   - Golden image DataVolumes
   - VirtIO PVCs
   - Builder disks

When no StorageClass is detected (e.g. no bound PVC), the cluster default is used or you must specify a StorageClass explicitly when creating resources.

> **Tip:** Ensure VMO Manager's data PVC is configured with the StorageClass you want for VM disks. This is the single source of truth for default storage.
