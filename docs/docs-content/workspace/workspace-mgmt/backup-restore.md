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

Creating a workspace

### Prerequisites

### Procedure

### Validate

## Restore a workspace backup

Restoring a workspace will restore the selected namespaces every cluster that is currently in the workspace to the same
state from which the backup was created. The clusters being restored must be healthy and reachable, because the restore
relies on access to the Kubernetes API. If you have deleted a cluster from the workspace, the deleted cluster will not
be restored.

### Prerequisites

### Procedure

### Validate
