---
sidebar_label: "Manage Cluster Profile Variables"
title: "Manage Cluster Profile Variables"
description: "Learn how to edit and delete cluster profile variables."
sidebar_position: 60
tags: ["profiles", "cluster profiles", "cluster profile variables"]
---

## Manage Profile Variables

## Modify Cluster Profile Variables

You are two ways to modify your cluster profile variables:

- Within your cluster profile
  
- Within an active cluster

## Modify Profile Variables Using a Cluster Profile

If your cluster profile is _not_ being used in an active cluster, you can modify your profile variables in the current version of your cluster profile and later deploy a cluster with the profile or add the profile to an active cluster. However, if your cluster profile is currently being used in a cluster, you must [create a new version of your cluster profile](../../../cluster-profiles/modify-cluster-profiles/version-cluster-profile.md) before you can modify the variables.

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

Take the following steps to confirm that your cluster profile contains the updated profile variable definitions: 

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, select **Profiles** and navigate to the cluster profile for which you have updated the
   profile variables.

3. In the upper-right corner, click **Variables** and, on the **Profile variables** pane, check that only the necessary
   variables are present and that each variable has the expected definition.

Once your cluster profile has the latest profile variable configurations, you can [deploy a new cluster](./create-cluster-profile-variables.md#deploy-a-cluster-with-cluster-profile-variables) using the cluster profile, [update your cluster profile version](../../../../clusters/cluster-management/cluster-updates.md) on an active cluster to get the latest changes, or add an add-on profile to an active cluster.

## Modify Profile Variables on an Active Cluster

You can modify your cluster profile variables on an active cluster by either updating the profile version associated with the cluster or by overriding the existing cluster profile configuration. If you need to modify the _schema_ of your profile variable rather than the value, you must first modify the cluster profile the variable is a part of. Overrides that do not follow the defined variable schema are not supported.

:::warning

We do not recommend overriding cluster profile configurations without updating the profile itself. Instead, we recommend [creating a new profile version](../../../cluster-profiles/modify-cluster-profiles/version-cluster-profile.md) and then [upgrading active clusters](../../../../clusters/cluster-management/cluster-updates.md) to the new version.

:::

### Modify Profile Variables Using Cluster Profile Versions

This is the recommended best practice for updating a cluster in Palette.

1. Log in to [Palette](https://console.spectrocloud.com).
      
2. From the left **Main Menu**, select **Clusters**. Choose the cluster for which you are updating the cluster profile variable.
   
3. Navigate to the **Profile** tab of the cluster.
   
   - If you are updating the version of your cluster profile, expand the version **drop-down Menu** and choose the appropriate version.
  
   - If you are adding an add-on profile to the cluster, click the **Add add-on profile** icon. Choose the profile to add, and **Confirm** your changes.

4. Click **Review & Save**. The **Changes Summary** dialog appears. Select **Review changes in Editor**.
   
5. Use the **Profile variable changes** tab to view the profiles that were changed. Expand each profile to compare the **Running configuration** and **New configuration**, making any necessary changes to your cluster profile variables. Each profile must be **Reviewed**, indicated by a green check mark, before you can apply your changes.  
   
6. When you are finished, select **Apply Changes**. 
   
7. Your cluster begins the update process. Monitor its progress using the **Event** tab.


### Modify Profile Variables Using Cluster Profile Overrides

You can modify the configuration of a deployed cluster without changing the cluster profile to update profile variables associated with a cluster.

Navigate to the left Main Menu and select Clusters. Select the aws-cluster to view its Overview tab.

Select the Profile tab of this cluster. You can select a new version of your cluster profile by using the version dropdown.

### Validate
