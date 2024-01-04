---
sidebar_label: 'Longhorn'
title: 'Longhorn'
description: 'Longhorn pack in Palette'
hide_table_of_contents: true
type: "integration"
category: ["storage", 'amd64', 'fips']
sidebar_class_name: "hide-from-sidebar"
logoUrl: 'https://registry.spectrocloud.com/v1/csi-longhorn/blobs/sha256:8257bd6697941139cea8ace907e25b3859cb8de48f965a5b6011d518cad0a2db?type=image/png'
tags: ['packs', 'longhorn', 'storage']
---

Longhorn is a lightweight distributed block storage system for cloud native storage Kubernetes that allows you to replicate storage to Kubernetes clusters. Once Longhorn is installed, it adds persistent volume support to the Kubernetes cluster using containers and microservices.

Longhorn creates a dedicated storage controller for each block device volume and replicates the volume across multiple nodes.

## Version Supported

<Tabs queryString="versions">
<TabItem label="1.5.x" value="1.5.x">


## Prerequisites

- Kubernetes cluster is 1.21 or higher.

## Parameters

The table lists commonly used parameters you can configure when adding this pack.

| Parameter                | Description                                            | Default                                     |
|-------------------------|--------------------------------------------------------|---------------------------------------------|
| `namespace`               | The namespace where the Longhorn will be installed. | `longhorn-system` |
| `defaultClass`            | The volume type to be used. | `true` |
| `defaultFsType`           | The default file system.    | `ext4` |
| `defaultClassReplicaCount`| The default number of copies of data store in your cluster.   | `3`         |
| `defaultDataLocality`     | The default location where data computation will occur. | `disabled` Best effort |
| `reclaimPolicy`           | This means that a dynamically provisioned volume will be automatically deleted when deletes when corresponding PersistentVolumeClaim is deleted. For important data, it is more appropriate to use the "Retain" policy | `Delete`  |
| `migratable`              | The ability to transfer data to another data storage systems | `false`   |
| `recurringJobSelector.enable`   | The management of recurring jobs. You can enable this feature and type a comma-separated list of jobs to run: `recurringJobSelector.enable.jobList [ ]`  | `false`   |

## Usage

Longhorn provides these features:

- Enterprise-grade distributed storage with no single point of failure.
- Incremental snapshots of block storage.
- Backup to secondary storage (NFSv4 or S3-compatible object storage) built on change block detection.
- Recurring snapshot and backup.

For more information, check out Longhorn guide on [How to Create Volumes](https://longhorn.io/docs/1.4.0/volumes-and-nodes/create-volumes/).


## Troubleshooting

Below are some common issues you may encounter when using Longhorn. Use the following information to help you troubleshoot and resolve the issue.

### Deadlock With RWX Mode

Starting with version 1.5.X, a known issue exists where a deadlock may occurs when using a RWX volume and a cluster node is recreated. This issue is disclosed as a known issue in the [Longhorn GitHub repository](https://github.com/longhorn/longhorn/wiki/Release-Known-Issues#v153).   

To resolve the deadlock, you must manually update the status of the Longhorn Storage Manager. Use the following command to resolve the deadlock. Replace `PVC-ID` with the ID of the Persistent Volume Claim (PVC) that is in the `longhorn-system` namespace that and in **RWX** mode.

```bash
kubectl --namespace longhorn-system patch lhsm PVC-ID \
--type=merge --subresource status --patch 'status: {state: error}'
```

:::tip

To identify the ID of the PVC, use the following command to list all PVCs in the `longhorn-system` namespace. Seach for the PVC that has the **ACCESS MODE** set to **RWX**.


```bash
kubectl get pvc --namespace longhorn-system 
```
:::


There are other workaround solutions provided by the community in the [issue discussion](https://github.com/longhorn/longhorn/issues/7183#issuecomment-1823715359) that you may explore if you are searching for an alternative solution. 

</TabItem>

<TabItem label="1.4.x" value="1.4.x">



## Prerequisites

- Kubernetes cluster is 1.21 or higher.

## Parameters

The table lists commonly used parameters you can configure when adding this pack.

| Parameter                | Description                                            | Default                                     |
|-------------------------|--------------------------------------------------------|---------------------------------------------|
| `namespace`               | The namespace where the Longhorn will be installed. | `longhorn-system` |
| `defaultClass`            | The volume type to be used. | `true` |
| `defaultFsType`           | The default file system.    | `ext4` |
| `defaultClassReplicaCount`| The default number of copies of data store in your cluster.   | `3`         |
| `defaultDataLocality`     | The default location where data computation will occur. | `disabled` Best effort |
| `reclaimPolicy`           | This means that a dynamically provisioned volume will be automatically deleted when deletes when corresponding PersistentVolumeClaim is deleted. For important data, it is more appropriate to use the "Retain" policy | `Delete`  |
| `migratable`              | The ability to transfer data to another data storage systems | `false`   |
| `recurringJobSelector.enable`   | The management of recurring jobs. You can enable this feature and type a comma-separated list of jobs to run: `recurringJobSelector.enable.jobList [ ]`  | `false`   |
curringJobSelector:enable    | The management of recurring jobs. You can enable this feature and type a comma-separated list of jobs to run: `recurringJobSelector:enable:jobList [ ]`  | `false`   |

## Usage

Longhorn provides these features:

- Enterprise-grade distributed storage with no single point of failure.
- Incremental snapshots of block storage.
- Backup to secondary storage (NFSv4 or S3-compatible object storage) built on change block detection.
- Recurring snapshot and backup.

For more information, check out Longhorn guide on [How to Create Volumes](https://longhorn.io/docs/1.4.0/volumes-and-nodes/create-volumes/).

</TabItem>

<TabItem label="1.3.x" value="1.3.x">


## Prerequisites

- Kubernetes cluster is at least version 1.22 and not higher than 1.24.

## Parameters

The table lists commonly used parameters you can configure when adding this pack.

| Parameter                | Description                                            | Default                                     |
|-------------------------|--------------------------------------------------------|---------------------------------------------|
| `namespace`               | The namespace where the Longhorn will be installed. | `longhorn-system` |
| `defaultClass`            | The volume type to be used. | `true` |
| `defaultFsType`           | The default file system.    | `ext4` |
| `defaultClassReplicaCount`| The default number of copies of data store in your cluster.   | `3`         |
| `defaultDataLocality`     | The default location where data computation will occur. | `disabled` Best effort |
| `reclaimPolicy`           | This means that a dynamically provisioned volume will be automatically deleted when deletes when corresponding PersistentVolumeClaim is deleted. For important data, it is more appropriate to use the "Retain" policy | `Delete`  |
| `migratable`              | The ability to transfer data to another data storage systems | `false`   |
| `recurringJobSelector.enable`   | The management of recurring jobs. You can enable this feature and type a comma-separated list of jobs to run: `recurringJobSelector.enable.jobList [ ]`  | `false`   |

## Usage

Longhorn provides these features:

- Enterprise-grade distributed storage with no single point of failure.
- Incremental snapshots of block storage.
- Backup to secondary storage (NFSv4 or S3-compatible object storage) built on change block detection.
- Recurring snapshot and backup.

For more information, check out Longhorn guide on [How to Create Volumes](https://longhorn.io/docs/1.4.0/volumes-and-nodes/create-volumes/).

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
