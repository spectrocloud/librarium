---
sidebar_label: "Backup and Restore"
title: "Backup and Restore"
description: "An overview of the cluster backup and restore concepts."
hide_table_of_contents: false
sidebar_position: 70
tags: ["clusters", "cluster management"]
---

Palette supports backup and restore capabilities for Kubernetes clusters. Two kinds of backups are supported: _cluster
backups_ and _etcd backups_.

A cluster backup is a persistent state of Kubernetes resources, ranging from objects such as Pods, DaemonSets, and
Services to persistent volumes. A backup allows you to save the current state of a cluster and restore it at a later
point in time if needed. You can restore a backup to the same or a different cluster. You can schedule a backup of a
specific cluster or an entire [workspace](../../../workspace/workspace.md). You can also maintain multiple backups of a
cluster or workspace.

An etcd backup is a snapshot of the etcd key-value store used as the backend for all cluster information. etcd snapshots
are required to remediate data corruption problems that can occur in Kubernetes clusters. etcd backups are usually used
to restore the same cluster. etcd snapshots are usually small in size and automated backups are turned on by default.

## Cluster Backup vs etcd Backup

The following table offers a overview of the differences between a cluster backup and an etcd backup.

| Aspect                          | etcd Backup                                                                                                                          | Cluster Backup                                                                                                                  |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| **Scope**                       | Only backs up etcd data, which includes cluster state, configuration, and resource definition data.                                  | Backs up entire Kubernetes cluster resources, including pods, services, deployments, and associated data in persistent volumes. |
| **Enabled by default?**         | Yes                                                                                                                                  | No                                                                                                                              |
| **Use case**                    | Restoring etcd in case of data corruption or loss.                                                                                   | Migrating workloads between clusters. Restoring after accidental deletion or corruption of Kubernetes resources.                |
| **Restoration target**          | Typically used for restoring etcd on the same cluster                                                                                | Can be used to restore on the same cluster or migrate to a different cluster                                                    |
| **Operational overhead**        | Restoring is manual and requires technical expertise in etcd and command-line operations. Requires an SSH connection to the cluster. | Restore can be performed from the Palette user interface. Does not require an SSH connection to the cluster.                    |
| **Source cluster availability** | Not required.                                                                                                                        | Required.                                                                                                                       |
| **Typical file size**           | Relatively small (megabytes to low gigabytes).                                                                                       | Usually larger, depending on the size of cluster and volume data.                                                               |

## Cluster Backup

To get started with creating a backup, check out the
[Add a Backup Location using Static Credentials](add-backup-location-static.md) or
[Add a Backup Location using Dynamic Credentials](add-backup-location-dynamic.md) guide.

:::info

If you are using a workspace, refer to the
[Manage Palette Workspace](../../../workspace/workspace-mgmt/workspace-mgmt.md) guide to learn more about backup and
restore actions for a workspace.

:::

### Backup Locations

A backup location is an object storage, such as an AWS Simple Storage Service (S3) bucket, where you store and retrieve
the backup files. Before you create a backup, the initial step is configuring a backup location. You can configure a
backup location in a public cloud or a data center environment and add it in Palette. Palette supports the following
object storage solutions as backup locations.

- Amazon Web Services (AWS) S3 bucket

- Google Cloud Platform (GCP) bucket

- MinIO S3 bucket

- Azure blob storage

:::info

Palette uses open source Velero to provide backup and restore capabilities. You can learn more about Velero by checking
out the Velero [Restore Reference](https://velero.io/docs/main/restore-reference/) and
[Backup Reference](https://velero.io/docs/main/backup-reference/).

:::

You can add a backup location to the same cloud account you use to deploy Kubernetes clusters or use a different
account. Both authentication methods require an Identity Access Management (IAM) entity in the cloud account and access
credentials for the IAM entity.

### Backup Locations and Credentials

Palette uses the access credentials to authenticate itself while accessing the storage bucket. Palette supports static
credentials for all cloud service providers. You can also use dynamic credentials with the backup and restore workflow.

Review the table below to learn more about what cloud providers and credentials methods are supported.

| **Service Provider** | **Static Credentials Support** | **Dynamic Credentials Support** |
| -------------------- | ------------------------------ | ------------------------------- |
| AWS                  | ✅                             | ✅                              |
| GCP                  | ✅                             | ❌                              |
| MinIO                | ✅                             | ❌                              |
| Azure                | ✅                             | ❌                              |

To learn more about adding a backup location, check out the
[Add a Backup Location using Static Credentials](/clusters/cluster-management/backup-restore/add-backup-location-static)
or
[Add a Backup Location using Dynamic Credentials](/clusters/cluster-management/backup-restore/add-backup-location-dynamic)
guide.

### Backup Cluster Resources

Palette backups are safe to restore to any cluster and include persistent data. A cluster-wide backup operation of the
source cluster can be configured using three options. The following table summarizes the different options.

| **Backup Configuration** | **Description**                                                                                                                                                             |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Always**               | Include all cluster-wide resources regardless of any selected namespaces. This option is designed for restore operations to be performed exclusively on the source cluster. |
| **Auto**                 | Include persistent volumes that are linked to claims within the selected namespaces, but exclude cluster-wide resources. This is the default option for new backups.        |
| **Never**                | Excludes all cluster-wide resources, including persistent volumes.                                                                                                          |

## Volume Snapshots

<!-- prettier-ignore -->
You can include [volume snapshots](https://kubernetes.io/docs/concepts/storage/volume-snapshots/) in your cluster backups if the Container Storage Interface (CSI) driver you are using supports them. For more information about volume snapshot support, check the CSI pack README for your CSI driver. You can find a list of all Packs in the <VersionedLink text="Packs List" url="/integrations/" />
page.

<!-- prettier-ignore -->
If the CSI driver you are using includes the [csi-snapshotter](https://github.com/kubernetes-csi/external-snapshotter) component, then it supports volume snapshotting. If the CSI driver contains the snapshot controller and VolumeSnapshotClass, then all necessary components are already included in the CSI pack and nothing else is needed. If not, you must add the <VersionedLink text="Volume Snapshot Controller" url="/integrations/packs/?pack=volume-snapshot-controller" />, version 8 or greater, to your cluster profile to install the snapshot controller and VolumeSnapshotClass. These components are necessary to support taking snapshots and including them in your cluster backups. You can learn how to add a pack to a cluster profile by checking out the [Add a Pack](../../../profiles/cluster-profiles/create-cluster-profiles/create-addon-profile/create-pack-addon.md) guide.

You can use the table below to determine if your CSI driver supports volume snapshots and if you need to include the
Volume Snapshot Controller pack in your cluster profile.

:::tip

Always refer to the CSI driver's Pack README for guidance on volume snapshot support.

:::

| Scenario                                                                                                                                              | Requires Volume Snapshot Controller Pack | Guidance                                                           |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------ |
| CSI driver supports volume snapshots but does not contain all the required components, such as the Snapshot Controller, and the VolumeSnapshotClass   | Yes                                      | Include the Volume Snapshot Controller pack in the cluster profile |
| CSI driver supports volume snapshots, contains the all required components, such as the Snapshot Controller, and has the VolumeSnapshotClass included | No                                       | Refer to the CSI Pack README for guidance                          |
| CSI driver does not support volume snapshots                                                                                                          | No                                       | Refer to the CSI Pack README for guidance                          |

### Volume Snapshots and VMO

<!-- prettier-ignore -->
Clusters deployed with the <VersionedLink text="Virtual Machine Orchestrator " url="/integrations/packs/?pack=virtual-machine-orchestrator" /> pack do not need the  <VersionedLink text="Volume Snapshot Controller" url="/integrations/packs/?pack=volume-snapshot-controller" /> as the pack already includes the required components for volume snapshots. However, you must ensure the CSI driver supports volume snapshots. Review the CSI driver's Pack README for guidance on volume snapshot support.

## etcd Backups

etcd backups are enabled by default. You can edit the YAML file for a cluster's Kubernetes layer to configure its
frequency, maximum number of copies to retain. Use the following resource to learn more about etcd backups:

- [Enable etcd Backups](./enable-etcd-backup.md)

## Resources

- [Add a Backup Location using Static Credentials](add-backup-location-static.md)

- [Add a Backup Location using Dynamic Credentials](add-backup-location-dynamic.md)

- [Create a Cluster Backup](create-cluster-backup.md)

- [Restore a Cluster Backup](restore-cluster-backup.md)

- [etcd Backups](./enable-etcd-backup.md)
