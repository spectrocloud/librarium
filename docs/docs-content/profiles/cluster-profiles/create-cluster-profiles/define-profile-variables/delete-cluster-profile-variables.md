---
sidebar_label: "Delete Cluster Profile Variables"
title: "Delete Cluster Profile Variables"
description: "Learn how to delete cluster profile variables."
sidebar_position: 70
tags: ["profiles", "cluster profiles", "cluster profile variables"]
---

Deleting a cluster profile variable is very similar to [modifying one](./modify-cluster-profile-variables.md). 

If your cluster profile is not being used in an active cluster, you can delete your profile variables from the current version of your cluster profile. However, if your cluster profile is currently being used in a cluster, you must first [create a new version of your cluster profile](../../../cluster-profiles/modify-cluster-profiles/version-cluster-profile.md) before you can modify the variables.

### Prerequisites

- The `clusterProfile.update` permission to update cluster profiles. Refer to
  [Roles and Permissions](../../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile) for
  more information.

- A [cluster profile](../../../cluster-profiles/cluster-profiles.md) with [cluster profile variables](./create-cluster-profile-variables.md).

### Enablement

1. Log in to [Palette](https://console.spectrocloud.com).

2. On the left **Main Menu**, select **Profiles** and choose the cluster profile for which you want to update the profile variables.
   
3. In the upper-right corner, click **Variables**.

   :::tip

   Alternatively, open a profile layer and, in the upper-right corner of its YAML configuration editor, select
   **Variables**.

   :::

4. To edit a profile variable, in the **three-dot Menu** of the necessary variable, select **Edit** and make the
   necessary changes.

5. Repeat the steps described in this guide to define more variables and add them to the necessary cluster profile
    layers. Remember to choose **Confirm Updates** when you are finished with each layer, and select **Save Changes** when you are finished modifying your profile.


1. To delete a profile variable, navigate to the profile layers that implement this variable and remove it from their
   YAML configuration. Then, in the **three-dot Menu** of the necessary variable, select **Delete**.