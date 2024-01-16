---
sidebar_label: "Update a Cluster Profile"
title: "Update a Cluster Profile"
description: "Learn how to update a cluster profile in Palette."
hide_table_of_contents: false
sidebar_position: 40
tags: ["profiles", "cluster profiles"]
---

You can update a cluster profile to change the configuration of one or more layers and add or remove non-infrastructure layers. You can also update basic profile information such as the name, description, and tags.

Cluster profile changes will generate an update notification on all the clusters that are created from the profile. Update notifications include information about all the changes applied to the profile since the initial creation or since the previous update. You can apply cluster updates individually at any time.

:::warning

We do not recommend updating a currently deployed cluster profile version to push out changes. Instead, we recommend creating a _new_ profile version, and then upgrade active clusters to the new version. For information on versioning profiles, check out [Version a Cluster Profile](version-cluster-profile.md).

:::

## Prerequisites

- A cluster profile created in Palette.

- Your Palette account role must have the `clusterProfile.update` permission to update a profile. Refer to the [Cluster Profile permissions](../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile-admin) reference for more information about roles and permissions.

## Modify Basic Profile Information

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click on **Profiles**, and select the profile you want to update. Palette displays the profile details and stack.

3. Click on **Settings** and choose **Edit Info** from the **drop-down Menu**. You can modify the profile name, version, description, and tags.

:::info

Updated tags will not be propagated to previously created clusters. However, tag changes will apply to new clusters you create that use the updated profile.

:::

4. Save your changes.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click on **Profiles** and select the profile you updated. Palette displays the profile details and stack.

3. Check that profile details display your changes.

To learn how to apply the changes, review [Apply Profile Updates to Clusters](#apply-updates-to-clusters).

## Update a Profile Layer

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click on **Profiles** and select the profile you want to update. Palette displays the profile details and stack.

3. You can do the following:

   - Select **Add New Pack** and choose a pack to add to the profile.
   - Select **Import from cluster** to import a pack from another cluster.

   - Select the pack layer you want to update, and edit pack settings in the YAML file that displays in the YAML editor.

   - Click on the **Update** button to view and apply available updates to packs. To learn how to update your customized packs, review [Update the Pack Version](#update-the-pack-version).

   - Select **Add Manifest** to add, edit, or remove a manifest.

   - Select **Add Helm chart** to add, edit, or remove a Helm chart.

   - Select **Add Zarf** to add applications in air-gapped environments.

   - Remove non-infrastructure pack layers from the profile. Click the layer to display its details and click the **trash can** icon in the **Edit Pack** panel.

:::info

You cannot remove Operating System (OS), Kubernetes, Networking, or Storage infrastructure layers.

:::

    - Select **Settings** and choose **Delete** to delete the entire profile. You can also delete the profile when you choose **Delete** from the **three-dots Menu** on the Profiles page.

4. Confirm your updates.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click on **Profiles**.

3. If you made changes, click the profile you updated. Palette displays the profile details and stack.

4. Check that layers are added to or removed from the profile stack.

5. If you added, removed, or modified a manifest, click the layer in the stack that you updated and verify the manifest changes.

To learn how to apply the changes, review [Apply Profile Updates to Clusters](#apply-updates-to-clusters).

## Update the Pack Version

Packs typically contain changes between versions, such as the addition or removal of parameters and policies. The following steps will guide you in updating configurations.

:::warning

Ensure you follow these practices when updating to a new pack version.

- You should not copy the pack configuration from one version to another, as the newer version often contains customizations. Instead, you should integrate your changes manually in the new version.
- Update to a newer Kubernetes version incrementally, one minor version at a time.
- Select a specific target version instead of a group that ends in `.x`
- We do not recommend downgrading packs to the previous version.

:::

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, select **Profiles**.

3. Select the profile you want to update. Palette displays profile details and the profile stack.

4. Click on the pack layer to update.

5. In the **Edit Pack** panel, select a specific target version, not a group that ends in `.x`. Palette displays the difference between the current version at left and the new version at right. The target version is displayed in the header.

Differences between the displayed configurations are as follows:

    -  *Red highlight* indicates text that is not present in the new configuration.

    These may be lines you have added in the current configuration. Use the arrow that displays between the two configurations to transfer the lines to the new pack version.

    These lines may also have been removed because they are no longer valid in the new configuration. If you need them, you should copy the lines to the new version. Similarly, you should copy any settings from the current configuration.

    - *Green highlight* indicates additions in the new configuration that are not present in the pack version you are using.

    #### Example of Difference Between Current and New Configurations


    ![Screenshot that shows Palette's pack diff user interface with red highlight at left and green highlight at right](/integrations_pack_diffs.png)

    - *Contrasting shades* of red and green highlight within the same line indicates differences occur in only part of the line.


    #### Example of Line Changes in Current and New Configurations

    ![Screenshot that shows Palette's pack diff user interface with contrasting shades of red and green highlight in the same line](/integrations_pack_line_diffs.png)

6. Check for red-highlight in the configuration that is missing in the new configuration.

   - If there are any lines you added, use the arrow to transfer the lines to the new version.
   - If there are lines you did not add that are red highlighted, they have been removed in the new version, and you should _not_ copy them over.

7. Check for changed settings in the new configuration, and copy settings from the current configuration to the new configuration.

8. Review new sections in the new configuration. You should adopt them, as they are typically needed to support the new configuration.

9. Check for changes in the same line that have a different value. If it is not a customization you made, you should adopt the new value, as it is known to be compatible with the new version.

10. Confirm your updates.

To learn how to apply the changes, review [Apply Profile Updates to Clusters](#apply-updates-to-clusters).

### Validate

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. From the left **Main Menu**, select **Profiles**.

3. Click the profile you updated. Palette displays the profile stack.

4. Check that the updated layer displays the new pack version.

   Palette indicates any problematic layers in the stack. You can hover over the pack name to view details about the misconfiguration.

5. Click on the pack layer and review its configuration. Apply fixes and confirm your updates.

6. Repeat the process until Palette indicates the configuration works.

## Apply Profile Updates to Clusters

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, select **Clusters**. Clusters that are eligible for an update will have an **Updates Available** badge.

3. Select the cluster with the update notification to start the **Apply Updates** wizard. Click on the **Apply** button.

4. The **Apply Updates** wizard opens with the update notification, which contains details about the updates that will be applied. Click the **Confirm** button to apply updates to the cluster.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click on **Profiles** and select the updated cluster.

3. Check that layers are added to or removed from the profile stack, and verify other profile details.

4. If you added, removed, or modified a manifest, click the layer in the stack that you updated and verify the manifest changes.
