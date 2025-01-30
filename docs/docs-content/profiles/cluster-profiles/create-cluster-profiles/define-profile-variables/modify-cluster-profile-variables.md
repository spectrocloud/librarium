---
sidebar_label: "Manage Cluster Profile Variables"
title: "Manage Cluster Profile Variables"
description: "Learn how to edit and delete cluster profile variables."
sidebar_position: 60
tags: ["profiles", "cluster profiles", "cluster profile variables"]
---

## Manage Profile Variables

## Modify Cluster Profile Variables

There are several ways you can modify your cluster profile variables:

- Edit the current version of the cluster profile (unused profiles only)
  
- Version the cluster profile and edit your cluster profile variables

- Edit your cluster profile variables within an active cluster
  
- Deploy a new profile or new profile version to an active cluster
- 

## Modify Cluster Profile Variables within a Cluster Profile

If your cluster profile is not being used in an active cluster, you can modify your cluster profile variables in the current version of your cluster profile. However, if your cluster profile is currently being used in a cluster, you must first [create a new version of your cluster profile](../../../cluster-profiles/modify-cluster-profiles/version-cluster-profile.md) before you can modify the variables.

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

### Validation

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, select **Profiles** and navigate to the cluster profile for which you have updated the
   profile variables.

3. In the upper-right corner, click **Variables** and, on the **Profile variables** pane, check that only the necessary
   variables are present and that each variable has the expected definition.

## Add Cluster Profile Variables to an Active Cluster

### Add a Cluster Profile with Cluster Profile Variables

### Add a Cluster Profile Variable without a Cluster Profile

