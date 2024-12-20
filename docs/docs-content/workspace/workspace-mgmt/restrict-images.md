---
sidebar_label: Restrict Container Images
title: Restrict Container Images
description: "Learn how to restrict certain images from being used by your workspace"
hide_table_of_contents: false
sidebar_position: 60
tags: ["workspace"]
---

You can specify image URLs in a workspace to restrict access to images in your workspace for specific namespaces.
Restricted images cannot be loaded into any cluster in the namespaces you specify.

Access control to images is achieved using Kyverno policies. For more information about Kyverno, refer to
[Kyverno documentation](https://kyverno.io/).

## Prerequisites

- An active Palette workspace. Refer to [Create a Workspace](../adding-a-new-workspace.md) to learn how to create one.

- You are logged in as a Palette user that has the permission to modify workspaces. For more information, refer to
  [Permissions](../../user-management/palette-rbac/permissions.md).

## Restrict Container Image

1. Log in to [Palette](https://console.spectrocloud.com).

2. In the **Drop-Down Menu** at the top of the page, choose the project that has your workspace.

3. On the left **Main Menu**, click **Workspaces**.

4. Click on the workspace you want to delete.

5. In the upper-right corner, click **Settings**.

6. Click **Container Images**.

7. Enter the namespace you want to restrict image access for. Then enter the images by tag, separated by commas.

8. Click **Save Changes**.

## Validate

1. Connect to a cluster in your workspace using kubectl. For more information, refer to
   [Access Cluster with kubectl](../../clusters/cluster-management/palette-webctl.md).

2. Issue the following command to view the Kyverno policy used to control image access.

   ```shell
   kubectl describe cpol cluster-policy-palette-system
   ```

3. Check under `spec.rules.preconditions` and `spec.rules.validate`. Confirm that the matching namespaces have
   restricted the container images from loading.
