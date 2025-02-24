---
sidebar_label: Delete Workspace
title: Delete Workspace
description: "Learn how to delete a workspace. "
hide_table_of_contents: false
sidebar_position: 40
tags: ["workspace"]
---

This page teaches you how to delete a workspace. Deleting a workspace removes resources in the cluster that you created
using the workspace, such as role bindings, cluster role bindings, and resource quotas. Deleting a workspace does not
delete any of the clusters inside the workspace.

Deleting the workspace will not automatically delete any backup files you created for the workspace.

## Prerequisites

- An existing workspace. Refer to [Create a Workspace](../adding-a-new-workspace.md) to learn how to create a workspace.

- You are logged in as a Palette user that has the permission to delete workspaces. For more information, refer to
  [Permissions](../../user-management/palette-rbac/permissions.md).

## Delete a Workspace

1. Log in to [Palette](https://console.spectrocloud.com).

2. In the **drop-down Menu** at the top of the page, choose the project that has your workspace.

3. On the left **Main Menu**, click **Workspaces**.

4. Click on the workspace you want to delete.

5. In the upper-right corner, click **Settings**.

6. Click **Delete Workspace**.

7. Enter the workspace name to confirm the deletion.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. In the **drop-down Menu** at the top of the page, choose the project that has your workspace.

3. On the left **Main Menu**, click **Workspaces**.

4. Confirm that the workspace has been deleted.
