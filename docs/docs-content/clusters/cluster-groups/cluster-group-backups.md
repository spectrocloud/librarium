---
sidebar_label: "Enable Disk Backup on Virtual Clusters"
title: "Enable Disk Backup on Virtual Clusters"
description: "Learn how to configure disk and volume backup for virtual clusters in a cluster group."
hide_table_of_contents: false
sidebar_position: 10
tags: ["clusters", "cluster groups"]
---

Palette [Virtual Clusters](../palette-virtual-clusters/palette-virtual-clusters.md) are a capability that cluster groups
support and that you can enable when creating a cluster group. By default, the virtual cluster settings in a cluster
group disable disk backups. You can back up all the volumes within a virtual cluster using the following steps.

## Prerequisites

- A project or tenant backup location. Refer to the
  [cluster backup and restore](../cluster-management/backup-restore/backup-restore.md) document to learn how to
  configure a backup location.

- Cluster group modification [permissions](../../user-management/palette-rbac/palette-rbac.md).

- A cluster group. Review the [create a cluster group](create-cluster-group.md) for additional guidance.

:::info

You can also enable virtual cluster disk backup during the cluster group creation process.

:::

## Enable Backup for Virtual Clusters

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Cluster Groups**.

3. Select a cluster group to enable virtual cluster disk backup.

4. Click **Settings** and expand the **Settings** Menu.

5. To enable disk backup you need to change the following configurations in the **Advanced Config** section.

   - Set `syncer.extraArgs.rewrite-host-paths` to `true`

   ```yaml
   syncer:
   extraArgs:
     - --rewrite-host-paths=true
   ```

   - Set `hostpathMapper.enabled` to `true`

   ```yaml
   hostpathMapper:
     enabled: true
   ```

   - Set `podSecurityStandard` to `privileged`

   ```yaml
   isolation:
   podSecurityStandard: privileged
   ```

:::warning

Setting the `podSecurityStandard` to `privileged` can introduce privilege escalations. We recommend you discuss this
with your security system administrator.

:::

7. Save your changes.

All virtual clusters deployed in this cluster group will now include disk storage during backup operations.

## Validate

You can validate that the disk backups are occurring by deploying a virtual cluster and taking a backup.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Deploy a virtual cluster in your cluster group that has the disk backup settings enabled. Refer to the
   [Deploy a Virtual Cluster to a Cluster Group](../palette-virtual-clusters/deploy-virtual-cluster.md) guide to learn
   how to deploy Palette Virtual clusters.

3. Create a backup of your virtual cluster and include all disks. Use the
   [Create a Cluster Backup](../cluster-management/backup-restore/backup-restore.md) guide for additional guidance.

4. Access the backup location's blob storage and review the backup files.

Example of a backup that includes the virtual cluster disks.
![Example image of a backup that includes disks](/clusters_cluster-groups_cluster-group-backups_backup-overview.png)
