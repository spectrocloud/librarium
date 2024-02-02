---
sidebar_label: "Configure etcd Backup"
title: "Configure etcd Backup"
description: "Learn how to enable scheduled etcd backups."
hide_table_of_contents: false
sidebar_position: 45
tags: ["clusters", "cluster management", "backup"]
---

etcd backups are enabled by default and backups are performed on each etcd node. You can adjust the backup frequency,
the location of the backup files, and the maximum number of backup files to retain by editing the YAML file of your
cluster profile's Kubernetes layer.

## Prerequisite

- An active cluster in Palette using PXK, PXK-E, RKE2, or K3S as its Kubernetes layer.
  - The MicroK8s distribution of Kubernetes uses dqlite3 instead of etcd for its data store by default, so these steps
    are not applicable to MicroK8s instances.

## Configure etcd Backup

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the **Main Menu**, select **Profiles**.

3. Select the profile you use to deploy clusters. And then, select the Kubernetes layer of your profile.

4. Edit the YAML file of your Kubernetes layer and add the following configurations. Depending on your Kubernetes
   distribution, different configuration parameters are available.

    <Tabs group="distribution">

    <TabItem value="PXK" label="PXK/PXK-E">

   In Palette eXtended Kubernetes (PXK), etcd backup is enabled by default and cannot be disabled. You also cannot
   change the directory where the backups are stored, which is `/var/lib/etcd`.

   | Parameter                                           | Description                                                          | Default |
   | --------------------------------------------------- | -------------------------------------------------------------------- | ------- |
   | `kubeadmconfig.etcd.local.extraArgs.snapshot-count` | The number of committed transactions required to trigger a snapshot. | 100000  |
   | `kubeadmconfig.etcd.local.extraArgs.max-snapshots`  | The maximum number of etcd backups to retain.                        | 5       |

   For example,

   ```yaml
   kubeadmconfig:
     etcd:
       local:
         extraArgs:
           max-snapshots: 10
           snapshot-count: "10000"
   ```

    </TabItem>

    <TabItem value="rke2" label="RKE2">

   Use the following parameters to configure scheduled backups.

   | Parameter                                    | Description                                                                                                                                                           | Default                                     |
   | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
   | `cluster.config.etcd-snapshot-schedule-cron` | A cron expression that controls the time and frequency of scheduled backups. For example, the default value `0 */1 * * *` means the scheduled backup runs every hour. | `0 */1 * * *`                               |
   | `cluster.config.etcd-snapshot-retention`     | The maximum number of etcd backups to retain.                                                                                                                         | 12                                          |
   | `cluster.config.etcd-disable-snapshots`      | Controls whether or not to disable scheduled etcd snapshots.                                                                                                          | `false`                                     |
   | `cluster.config.etcd-snapshot-dir`           | Specifies the directory where the etcd snapshots are saved.                                                                                                           | `/var/lib/rancher/rke2/server/db/snapshots` |

   For example,

   ```yaml
   cluster:
     config:
       etcd-snapshot-schedule-cron: 0 */1 * * *
       etcd-snapshot-retention: 12
       etcd-disable-snapshots: false
       etcd-snapshot-dir: /var/lib/rancher/rke2/server/db/snapshots
   ```

    </TabItem>

    <TabItem value="k3s" label="K3S">

   Use the following parameters to configure scheduled backups.

   | Parameter                                    | Description                                                                                                                                                           | Default                                    |
   | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
   | `cluster.config.etcd-snapshot-schedule-cron` | A cron expression that controls the time and frequency of scheduled backups. For example, the default value `0 */1 * * *` means the scheduled backup runs every hour. | `0 */1 * * *`                              |
   | `cluster.config.etcd-snapshot-retention`     | The maximum number of etcd backups to retain.                                                                                                                         | 12                                         |
   | `cluster.config.etcd-disable-snapshots`      | Controls whether or not to disable scheduled etcd snapshots.                                                                                                          | `false`                                    |
   | `cluster.config.etcd-snapshot-dir`           | Specifies the directory where the etcd snapshots are saved. By default, this value is `/var/lib/k3s/rancher/server/db/snapshots`.                                     | `/var/lib/rancher/k3s/server/db/snapshots` |

   For example,

   ```yaml
   cluster:
     config:
       etcd-snapshot-schedule-cron: 0 */1 * * *
       etcd-snapshot-retention: 12
       etcd-disable-snapshots: false
       etcd-snapshot-dir: /var/lib/rancher/k3s/server/db/snapshots
   ```

    </TabItem>

    </Tabs>

5. If you have not deployed a cluster, finish the cluster profile creation and deploy a cluster. For more information,
   refer to [Create Cluster Profile](../../../profiles/cluster-profiles/create-cluster-profiles/) for non-Edge and
   [Model Cluster Profile](../../edge/site-deployment/model-profile.md).

   If you are editing the profile of an active cluster, updating the profile will trigger and update to the active
   cluster. We recommend that you publish a new version of the profile instead of updating a profile directly. For more
   information, refer to [Update a Cluster](../cluster-updates.md).

## Validate

To validate the snapshots are successfully configured, connect to any control plane node of the cluster via SSH and
change into the directory where the etcd snapshots are saved. Confirm that the snapshots are being created in the
directory.

## Next Steps

If your cluster experiences data corruption issues, you can use the etcd snapshots to restore the cluster to working
conditions. Restoring a cluster may be a challenging procedure, depending on your experience and technical skill level.
The restoration also requires SSH access to the node and intimate knowledge of etcd. If you have concerns or need
assistance, contact us [support@spectrocloud.com](mailto:support@spectrocloud.com) for additional guidance.

The following is list of helpful resources that can help you understand disaster recovery for etcd:

- [Disaster recovery](https://etcd.io/docs/v3.5/op-guide/recovery/)

- [Operating etcd clusters for Kubernetes](https://kubernetes.io/docs/tasks/administer-cluster/configure-upgrade-etcd/)
