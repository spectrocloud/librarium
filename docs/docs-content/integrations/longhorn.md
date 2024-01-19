---
sidebar_label: "Longhorn"
title: "Longhorn"
description: "Longhorn pack in Palette"
hide_table_of_contents: true
type: "integration"
category: ["storage", "amd64", "fips"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/csi-longhorn/blobs/sha256:8257bd6697941139cea8ace907e25b3859cb8de48f965a5b6011d518cad0a2db?type=image/png"
tags: ["packs", "longhorn", "storage"]
---

Longhorn is a lightweight distributed block storage system for cloud native storage Kubernetes that allows you to
replicate storage to Kubernetes clusters. Once Longhorn is installed, it adds persistent volume support to the
Kubernetes cluster using containers and microservices.

Longhorn creates a dedicated storage controller for each block device volume and replicates the volume across multiple
nodes.

## Version Supported

<Tabs queryString="versions">
<TabItem label="1.5.x" value="1.5.x">

## Prerequisites

- Kubernetes cluster is 1.21 or higher.

- Different Operating Systems (OS) have different requirements for the Longhorn installation. Use the links below to
  learn more about the requirements for your OS.

  - [RKE and CoreOS](https://longhorn.io/docs/1.5.3/advanced-resources/os-distro-specific/csi-on-rke-and-coreos/)
  - [K3s](https://longhorn.io/docs/1.5.3/advanced-resources/os-distro-specific/csi-on-k3s/)
  - [Google GKE](https://longhorn.io/docs/1.5.3/advanced-resources/os-distro-specific/csi-on-gke/)

## Parameters

The table lists commonly used parameters you can configure when adding this pack. Refer to the
[Settings Reference](https://longhorn.io/docs/1.5.3/references/settings/) resource for a complete list of Longhorn
parameters and their descriptions.

| Parameter                                                        | Description                                                                                                                                                                                                                                                                                                                                                   | Default           |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `pack.namespace`                                                 | The namespace where the Longhorn will be installed. If the namespace does not exist, it will be created.                                                                                                                                                                                                                                                      | `longhorn-system` |
| `charts.longhorn.global.persistence.defaultClass`                | The volume type to be used.                                                                                                                                                                                                                                                                                                                                   | `true`            |
| `charts.longhorn.global.persistence.defaultFsType`               | The default file system.                                                                                                                                                                                                                                                                                                                                      | `ext4`            |
| `charts.longhorn.global.persistence.defaultClassReplicaCount`    | The default number of copies of data store in your cluster.                                                                                                                                                                                                                                                                                                   | `3`               |
| `charts.longhorn.global.persistence.defaultDataLocality`         | The default location where data computation will occur.                                                                                                                                                                                                                                                                                                       | `disabled`        |
| `charts.longhorn.global.persistence.reclaimPolicy`               | The policy that regulates dynamically provisioned volumes when its corresponding PersistentVolumeClaim is deleted. The default policy is `Delete`. This means that a dynamically provisioned volume will be automatically deleted when corresponding PersistentVolumeClaim is deleted. For important data, it is more appropriate to use the "Retain" policy. | `Delete`          |
| `charts.longhorn.global.persistence.migratable`                  | The ability to transfer data to another data storage systems.                                                                                                                                                                                                                                                                                                 | `false`           |
| `charts.longhorn.global.persistence.recurringJobSelector.enable` | The management of recurring jobs. You can enable this feature and type a comma-separated list of jobs to activate.                                                                                                                                                                                                                                            | `false`           |

## Usage

The official Longhorn documentation contains several guides and examples. The following guides are a good place to start
when learning how to use Longhorn.

- [How to Create Volumes](https://longhorn.io/docs/1.5.3/volumes-and-nodes/create-volumes/)

- [Access the Longhorn UI](https://longhorn.io/docs/1.5.3/deploy/accessing-the-ui/)

- [Longhorn Networking](https://longhorn.io/docs/1.5.3/references/networking/)

- [Node Maintenance and Kubernetes Upgrade Guide](https://longhorn.io/docs/1.5.3/volumes-and-nodes/maintenance/)

- [Storage Tags](https://longhorn.io/docs/1.5.3/volumes-and-nodes/storage-tags/)

- [Important Notes](https://longhorn.io/docs/1.5.3/deploy/important-notes/)

We also recommend you check out the [Examples](https://longhorn.io/docs/1.5.3/references/examples/) section of the
Longhorn documentation. The examples section contains several use cases of how to configure Longhorn.

## Known Issues

The following known issues exist in the Longhorn 1.5.X release.

- A deadlock may occurs when using a RWX volume and a cluster node is recreated. This issue is disclosed as a
  [known issue](https://github.com/longhorn/longhorn/wiki/Release-Known-Issues#v153) in the Longhorn GitHub repository]
  and a fix is on the roadmap. Workarounds provided by the community can be found in the
  [issue discussion](https://github.com/longhorn/longhorn/issues/7183#issuecomment-1823715359).

- Rebooting or upgrading a cluster with Longhorn has a small possibility of triggering a race condition that causes pods
  to be stuck in the terminating state. This issue is related to a
  [known issue](https://github.com/longhorn/longhorn/issues/6962) in the Longhorn GitHub repository and a fix is on the
  roadmap.

</TabItem>

<TabItem label="1.4.x" value="1.4.x">

## Prerequisites

- Kubernetes cluster is 1.21 or higher.

- Different Operating Systems (OS) have different requirements for the Longhorn installation. Use the links below to
  learn more about the requirements for your OS.

  - [RKE and CoreOS](https://longhorn.io/docs/1.4.4/advanced-resources/os-distro-specific/csi-on-rke-and-coreos/)
  - [K3s](https://longhorn.io/docs/1.4.4/advanced-resources/os-distro-specific/csi-on-k3s/)
  - [Google GKE](https://longhorn.io/docs/1.4.4/advanced-resources/os-distro-specific/csi-on-gke/)

## Parameters

The table lists commonly used parameters you can configure when adding this pack. Refer to the
[Settings Reference](https://longhorn.io/docs/1.4.4/references/settings/) resource for a complete list of Longhorn
parameters and their descriptions.

| Parameter                                                        | Description                                                                                                                                                                                                             | Default           |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `pack.namespace`                                                 | The namespace where the Longhorn will be installed. If the namespace does not exist, it will be created.                                                                                                                | `longhorn-system` |
| `charts.longhorn.global.persistence.defaultClass`                | The volume type to be used.                                                                                                                                                                                             | `true`            |
| `charts.longhorn.global.persistence.defaultFsType`               | The default file system.                                                                                                                                                                                                | `ext4`            |
| `charts.longhorn.global.persistence.defaultClassReplicaCount`    | The default number of copies of data store in your cluster.                                                                                                                                                             | `3`               |
| `charts.longhorn.global.persistence.defaultDataLocality`         | The default location where data computation will occur.                                                                                                                                                                 | `disabled`        |
| `charts.longhorn.global.persistence.reclaimPolicy`               | This means that a dynamically provisioned volume will be automatically deleted when deletes when corresponding PersistentVolumeClaim is deleted. For important data, it is more appropriate to use the "Retain" policy. | `Delete`          |
| `charts.longhorn.global.persistence.migratable`                  | The ability to transfer data to another data storage systems.                                                                                                                                                           | `false`           |
| `charts.longhorn.global.persistence.recurringJobSelector.enable` | The management of recurring jobs. You can enable this feature and type a comma-separated list of jobs to activate.                                                                                                      | `false`           |

## Usage

The official Longhorn documentation contains several guides and examples. The following guides are a good place to start
when learning how to use Longhorn.

- [How to Create Volumes](https://longhorn.io/docs/1.4.4/volumes-and-nodes/create-volumes/).

- [Access the Longhorn UI](https://longhorn.io/docs/1.4.4/deploy/accessing-the-ui/)

- [Longhorn Networking](https://longhorn.io/docs/1.4.4/references/networking/)

- [Node Maintenance and Kubernetes Upgrade Guide](https://longhorn.io/docs/1.4.4/volumes-and-nodes/maintenance/)

- [Storage Tags](https://longhorn.io/docs/1.4.4/volumes-and-nodes/storage-tags/)

- [Important Notes](https://longhorn.io/docs/1.4.4/deploy/important-notes/)

We also recommend you check out the [Examples](https://longhorn.io/docs/1.4.4/references/examples/) section of the
Longhorn documentation. The examples section contains several use cases of how to configure Longhorn.

</TabItem>

<TabItem label="1.3.x" value="1.3.x">

## Prerequisites

- Kubernetes cluster is at least version 1.18 and not higher than 1.24.

- Different Operating Systems (OS) have different requirements for the Longhorn installation. Use the links below to
  learn more about the requirements for your OS.

  - [RKE and CoreOS](https://longhorn.io/docs/1.3.3/advanced-resources/os-distro-specific/csi-on-rke-and-coreos/)
  - [K3s](https://longhorn.io/docs/1.3.3/advanced-resources/os-distro-specific/csi-on-k3s/)
  - [Google GKE](https://longhorn.io/docs/1.3.3/advanced-resources/os-distro-specific/csi-on-gke/)

## Parameters

The table lists commonly used parameters you can configure when adding this pack. Refer to the
[Settings Reference](https://longhorn.io/docs/1.3.3/references/settings/) resource for a complete list of Longhorn
parameters and their descriptions.

| Parameter                                                        | Description                                                                                                                                                                                                             | Default           |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `pack.namespace`                                                 | The namespace where the Longhorn will be installed. If the namespace does not exist, it will be created.                                                                                                                | `longhorn-system` |
| `charts.longhorn.global.persistence.defaultClass`                | The volume type to be used.                                                                                                                                                                                             | `true`            |
| `charts.longhorn.global.persistence.defaultFsType`               | The default file system.                                                                                                                                                                                                | `ext4`            |
| `charts.longhorn.global.persistence.defaultClassReplicaCount`    | The default number of copies of data store in your cluster.                                                                                                                                                             | `3`               |
| `charts.longhorn.global.persistence.defaultDataLocality`         | The default location where data computation will occur.                                                                                                                                                                 | `disabled`        |
| `charts.longhorn.global.persistence.reclaimPolicy`               | This means that a dynamically provisioned volume will be automatically deleted when deletes when corresponding PersistentVolumeClaim is deleted. For important data, it is more appropriate to use the `Retain` policy. | `Delete`          |
| `charts.longhorn.global.persistence.migratable`                  | The ability to transfer data to another data storage systems.                                                                                                                                                           | `false`           |
| `charts.longhorn.global.persistence.recurringJobSelector.enable` | The management of recurring jobs. You can enable this feature and type a comma-separated list of jobs to activate.                                                                                                      | `false`           |

## Usage

The official Longhorn documentation contains several guides and examples. The following guides are a good place to start
when learning how to use Longhorn.

- [How to Create Volumes](https://longhorn.io/docs/1.4.4/volumes-and-nodes/create-volumes/).

- [Access the Longhorn UI](https://longhorn.io/docs/1.4.4/deploy/accessing-the-ui/)

- [Longhorn Networking](https://longhorn.io/docs/1.4.4/references/networking/)

- [Node Maintenance and Kubernetes Upgrade Guide](https://longhorn.io/docs/1.4.4/volumes-and-nodes/maintenance/)

- [Storage Tags](https://longhorn.io/docs/1.4.4/volumes-and-nodes/storage-tags/)

- [Important Notes](https://longhorn.io/docs/1.4.4/deploy/important-notes/)

We also recommend you check out the [Examples](https://longhorn.io/docs/1.4.4/references/examples/) section of the
Longhorn documentation. The examples section contains several use cases of how to configure Longhorn.

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
  version = "1.5.1"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```

## References

- [Longhorn Home](https://longhorn.io/)

- [Longhorn Documentation](https://longhorn.io/docs)

- [Settings Reference](https://longhorn.io/docs/latest/references/settings/)

- [Storage Class Parameters](https://longhorn.io/docs/latest/references/storage-class-parameters/)
