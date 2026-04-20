---
sidebar_label: "Attach an Add-on Profile"
title: "Attach an Add-on Profile"
description: "Learn how to attach an add-on profile to an imported cluster in Palette."
hide_table_of_contents: false
sidebar_position: 10
tags: ["clusters", "imported clusters"]
---

Imported clusters lack the ability for Palette to manage the core layers found in a cluster profile, such as the OS,
Kubernetes distribution and version, Container Network Interface (CNI) and Container Storage Interface (CSI). You can,
however, use add-on cluster profiles to deploy additional software dependencies into your cluster and have Palette
manage these dependencies through the normal cluster profile lifecycle.

## Prerequisites

- An imported cluster with full permissions. Refer to [Migrate to Full Permissions](migrate-full-permissions.md) to
  learn how to migrate an imported cluster from read-only mode to full-permissions mode.

- An add-on cluster profile. Refer to
  [Create an Add-on Profile](../../profiles/cluster-profiles/create-cluster-profiles/create-addon-profile/create-addon-profile.md)
  to learn how to create an add-on cluster profile.

## Attach an Add-on Profile

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Clusters**.

3. Select your imported full-permissions cluster from the **Clusters** table.

4. From the cluster's **Profile** tab, select **Attach Profile**.

5. From the drawer, select the appropriate add-on profile, and **Confirm** your selection.

6. Choose the appropriate cluster profile version from the **Version** drop-down and make any necessary changes in the
   code editor. **Save** your changes.

   :::info

   If the add-on profile contains
   [cluster profile variables](../../profiles/cluster-profiles/create-cluster-profiles/define-profile-variables/define-profile-variables.md),
   the option **Review & Save** is displayed instead. Use the modal window to set the necessary variables and apply your
   changes.

   :::

7. The message **Cluster profiles were updated successfully** is displayed. Return to the cluster **Overview** tab to
   monitor the deployment. When the add-on cluster profile is deployed, the **Cluster Profile** status displays as a
   green circle next to the layer.

You now have an add-on cluster profile deployed onto your imported cluster.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Clusters**.

3. From the **Clusters** table, select your imported cluster.

4. Verify the **Cluster Profile** section of the page has a green circle next to each layer. If your application exposes
   a service URL, use the URL to visit the application and verify it is operational.
