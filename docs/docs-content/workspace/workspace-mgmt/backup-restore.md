---
sidebar_label: Backup and Restore
title: Backup and Restore
description: "Learn how to configure backup and restore for your workspaces."
hide_table_of_contents: false
tags: ["workspace"]
---

Palette allows you to create backups at the workspace-level. A workspace backup may include any or all namespaces
included in the workspace, across every cluster in the workspace. The backup feature for workspaces uses the same
Velero-based approach as regular cluster backups and are subject to the same limitations. For more information, refer to
[Cluster Backup and Restore](../../clusters/cluster-management/backup-restore/backup-restore.md).

The backup files will be stored in a backup location you configure. Each cluster will have its own backup files.

## Create a workspace backup

Backing up a workspace creates a backup file for every cluster in your workspace. Each cluster backup file will contain
all Kubernetes objects as well as volumes in the namespaces selected.

### Prerequisites

- You have configured at least one backup location for cluster backups. Refer to
  [Add Backup Location using Static Credentials](../../clusters/cluster-management/backup-restore/add-backup-location-static.md).

- You are logged in as a Palette user that has the permission to modify workspaces. For more information, refer to
  [Permissions](../../user-management/palette-rbac/permissions.md).

- The clusters in the workspace you want to backup are healthy and available. Unhealthy clusters will not be backed up.

<!-- prettier-ignore -->
- If you want to include volume snapshots in the backup, ensure that your CSI driver supports volume snapshots. For more
  information about volume support, review the CSI pack README for your CSI driver in use. Refer to the [Volume Snapshots](../../clusters/cluster-management/backup-restore/backup-restore.md#volume-snapshots) section for more information.

   :::warning
   
   Ensure that `manifests.volume-snapshot-class.deletionPolicy` is set to the `Retain` value if you have configured <VersionedLink text="Volume Snapshot Controller" url="/integrations/packs/?pack=volume-snapshot-controller" /> as a layer in your cluster profile. This setting allows volume snapshot content to be retained when volume snapshots are deleted, facilitating backup and restore functionality. 

   ```yaml hideClipboard {5}
   volume-snapshot-class:
      create: true
      name: "spectro-volume-snapshot-class"
      driver: ""
      deletionPolicy: "Retain"
   ```

   Additionally, you must add the following snippet under the `manifests.volume-snapshot-class` field if you are using <VersionedLink text="Portworx" url="/integrations/packs/?pack=csi-portworx-generic" /> as your CSI layer on a cluster deployed to a MAAS environment. These labels ensure that the <VersionedLink text="Volume Snapshot Controller" url="/integrations/packs/?pack=volume-snapshot-controller" /> pack installs correctly.

   ```yaml
   extraLabels:
      pod-security.kubernetes.io/enforce: privileged
      pod-security.kubernetes.io/audit: privileged
      pod-security.kubernetes.io/warn: privileged
   ```

   :::

### Procedure

1. Log in to [Palette](https://console.spectrocloud.com).

2. In the **Drop-Down Menu** at the top of the page, choose the project that has your workspace.

3. On the left **Main Menu**, click **Workspaces**.

4. Click on the workspace you want to back up.

5. Click **Settings** in the upper-right corner.

6. Click **Schedule backups**.

7. Fill in the following basic information about your scheduled backups.

   | Parameter                      | Description                                                                                                                                                                                                                                                              |
   | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | Backup prefix                  | The prefix to your backup file names.                                                                                                                                                                                                                                    |
   | Select backup location         | Select a location to store your backup files.                                                                                                                                                                                                                            |
   | Backup schedule                | Configure a schedule for your backups.                                                                                                                                                                                                                                   |
   | Select expiry                  | The period for which your backup files are kept. Backup files past the expiry date are deleted automatically.                                                                                                                                                            |
   | Include all disks              | Select this checkbox if you want to include all the disks in the backup.                                                                                                                                                                                                 |
   | Include cluster-wide resources | Cluster wide resources are resources that are not namespaced but are scoped to the whole cluster, such as cluster roles. **Auto** option includes persistent volumes that are linked to claims within the selected namespaces, but exclude other cluster-wide resources. |

8. Enter the namespaces you want to back up.

9. Select the clusters you want to back up.

10. Click **Save Changes**.

The backup process will take some time ranging from 15 mins to hours depending on the scope of the backup.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. In the **Drop-Down Menu** at the top of the page, choose the project that has your workspace.

3. On the left **Main Menu**, click **Workspaces**.

4. Click on the workspace you backed up.

5. Click on the **Backups** tab.

6. Confirm that your backup is in progress or completed.

## Restore a workspace backup

Restoring a workspace will restore the selected namespaces every cluster that is currently in the workspace to the same
state from which the backup was created. The clusters being restored must be healthy and reachable, because the restore
relies on access to the Kubernetes API. If you have deleted a cluster from the workspace, the deleted cluster will not
be restored.

### Prerequisites

- You have created a backup file for the workspace.

- You are logged in as a Palette user that has the permission to modify workspaces. For more information, refer to
  [Permissions](../../user-management/palette-rbac/permissions.md).

- The clusters you want to restore are healthy and available.

### Procedure

1. Log in to [Palette](https://console.spectrocloud.com).

2. In the **Drop-Down Menu** at the top of the page, choose the project that has your workspace.

3. On the left **Main Menu**, click **Workspaces**.

4. Click on the workspace you want to restore.

5. Click on **Backups** to switch to the backup tab.

6. Click on a backup file you want to restore from.

7, Click **Restore**.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. In the **Drop-Down Menu** at the top of the page, choose the project that has your workspace.

3. On the left **Main Menu**, click **Workspaces**.

4. Click on the workspace you restored.

5. Ensure that the result of the restore was successful.
