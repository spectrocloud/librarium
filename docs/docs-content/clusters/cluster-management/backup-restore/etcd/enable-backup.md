---
sidebar_label: 'Configure etcd Backup for Non-Edge Deployments'
title: 'Configure etcd Backup for Non-Edge Deployments'
description: 'Learn how to enable scheduled etcd backups.'
hide_table_of_contents: false
sidebar_position: 30
tags: ["clusters", "cluster management", "backup"]
---

etcd backups are enabled by default and backups are performed on each etcd node. You can adjust the backup frequency, the location of the backup files, and the maximum number of backup files to retain by editing the YAML file of your cluster profile's Kubernetes layer.

## Prerequisite

- An active cluster in Palette. 

## Configure etcd Backup

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the **Main Menu**, select **Profiles**. 

3. Select the profile you use to deploy clusters. And then, select the Kubernetes layer of your profile. 

4. Edit the YAML file of your Kubernetes layer and add the following configurations. Depending on your Kubernetes distribution, different configuration parameters are available:

  <Tabs group="distribution">

  <TabItem value="PXK">

  In Palette-eXtended Kubernetes (PXK), etcd backup is enabled by default and cannot be disabled. You also cannot change the directory where the backups are stored, which is `/var/lib/etcd`.

    | Parameter | Description |
    |-----------|-------------|
    | `kubeadmconfig.etcd.local.extraArgs.snapshot-count` | The number of committed transactions required to trigger a snapshot. |
    | `kubeadmconfig.etcd.local.extraArgs.etcd-snapshot-retention` | The maximum number of etcd backups to retain. |

   ```yaml
   kubeadmconfig:
    etcd:
      local:
        extraArgs:
          max-snapshots: 10
          snapshot-count: "10000" 
   ```

  </TabItem>

  <TabItem value="RKE2">

    Use the following parameters to control the frequency of the backups:

  | Parameter | Description |
  |-----------|-------------|
  | `cluster.config.etcd-snapshot-schedule-cron` | A cron expression that controls the time and frequency of scheduled backups. For example, the default value `0 */1 * * *` means the scheduled backup runs every hour. |
  | `cluster.config.etcd-snapshot-retention` | The maximum number of etcd backups to retain. |
  | `cluster.config.etcd-disable-snapshots` | Controls whether or not to disable scheduled etcd snapshots. |
  | `cluster.config.etcd-snapshot-dir` | Specifies the directory where the etcd snapshots are saved. | 

  ```yaml
  cluster:
    config:
      etcd-snapshot-schedule-cron: 0 */1 * * *
      etcd-snapshot-retention: 12
      etcd-disable-snapshots: false
      etcd-snapshot-dir: /var/lib/rancher/rke2/server/db/snapshots
  ```

  </TabItem>  

  </Tabs>

## Validate

