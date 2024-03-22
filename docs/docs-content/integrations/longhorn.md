---
sidebar_label: "Longhorn"
title: "Longhorn"
description: "Longhorn pack in Palette"
hide_table_of_contents: true
type: "integration"
category: ["storage", "amd64", "fips"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/csi-longhorn/blobs/sha256:8257bd6697941139cea8ace907e25b3859cb8de48f965a5b6011d518cad0a2db?type=image.webp"
tags: ["packs", "longhorn", "storage"]
---

Longhorn is a lightweight distributed block storage system for cloud native storage Kubernetes that allows you to
replicate storage to Kubernetes clusters. Once Longhorn is installed, it adds persistent volume support to the
Kubernetes cluster using containers and microservices.

Longhorn creates a dedicated storage controller for each block device volume and replicates the volume across multiple
nodes.

## Version Supported

<Tabs queryString="versions">

<TabItem label="1.4.x" value="1.4.x">

## Prerequisites

- Kubernetes cluster is 1.21 or higher.

## Parameters

The table lists commonly used parameters you can configure when adding this pack.

| Parameter                   | Description                                                                                                                                                                                                            | Default                |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| defaultClass                | The volume type to be used.                                                                                                                                                                                            | `true`                 |
| defaultFsType               | The default file system.                                                                                                                                                                                               | `ext4`                 |
| defaultClassReplicaCount    | The default number of copies of data store in your cluster.                                                                                                                                                            | `3`                    |
| defaultDataLocality         | The default location where data computation will occur.                                                                                                                                                                | `disabled` Best effort |
| reclaimPolicy               | This means that a dynamically provisioned volume will be automatically deleted when deletes when corresponding PersistentVolumeClaim is deleted. For important data, it is more appropriate to use the "Retain" policy | `Delete`               |
| migratable                  | The ability to transfer data to another data storage systems                                                                                                                                                           | `false`                |
| recurringJobSelector:enable | The management of recurring jobs. You can enable this feature and type a comma-separated list of jobs to run: `recurringJobSelector:enable:jobList [ ]`                                                                | `false`                |

## Usage

Longhorn provides these features:

- Enterprise-grade distributed storage with no single point of failure.
- Incremental snapshots of block storage.
- Backup to secondary storage (NFSv4 or S3-compatible object storage) built on change block detection.
- Recurring snapshot and backup.

For more information, check out Longhorn guide on
[How to Create Volumes](https://longhorn.io/docs/1.4.0/volumes-and-nodes/create-volumes/).

</TabItem>

<TabItem label="1.3.x" value="1.3.x">

## Prerequisites

- Kubernetes cluster is at least version 1.22 and not higher than 1.24.

## Parameters

The table lists commonly used parameters you can configure when adding this pack.

| Parameter                   | Description                                                                                                                                                                                                            | Default                |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| defaultClass                | The volume type to be used.                                                                                                                                                                                            | `true`                 |
| defaultFsType               | The default file system.                                                                                                                                                                                               | `ext4`                 |
| defaultClassReplicaCount    | The default number of copies of data store in your cluster.                                                                                                                                                            | `3`                    |
| defaultDataLocality         | The default location where data computation will occur.                                                                                                                                                                | `disabled` Best effort |
| reclaimPolicy               | This means that a dynamically provisioned volume will be automatically deleted when deletes when corresponding PersistentVolumeClaim is deleted. For important data, it is more appropriate to use the "Retain" policy | `Delete`               |
| migratable                  | The ability to transfer data to another data storage systems                                                                                                                                                           | `false`                |
| recurringJobSelector:enable | The management of recurring jobs. You can enable this feature and type a comma-separated list of jobs to run: `recurringJobSelector:enable:jobList [ ]`                                                                | `false`                |

## Usage

Longhorn provides these features:

- Enterprise-grade distributed storage with no single point of failure.
- Incremental snapshots of block storage.
- Backup to secondary storage (NFSv4 or S3-compatible object storage) built on change block detection.
- Recurring snapshot and backup.

For more information, check out Longhorn guide on
[How to Create Volumes](https://longhorn.io/docs/1.4.0/volumes-and-nodes/create-volumes/).

</TabItem>
</Tabs>

## Terraform

When using this Pack as a base layer, you need the following terraform code.

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "csi-longhorn" {
  name    = "longhorn"
  version = "1.3.1"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```

## References

- [Longhorn Home](https://longhorn.io/)

- [Longhorn Documentation](https://longhorn.io/docs)
