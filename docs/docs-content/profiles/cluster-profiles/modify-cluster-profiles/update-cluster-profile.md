---
sidebar_label: "Update a Cluster Profile"
title: "Update a Cluster Profile"
description: "Learn how to update a cluster profile in Palette."
hide_table_of_contents: false
sidebar_position: 40
tags: ["profiles", "cluster profiles"]
---

You can update a cluster profile to change the configuration of one or more layers and add or remove non-infrastructure
layers. You can also update basic profile information such as the name, description, and tags.

Cluster profile changes will generate an update notification on all the clusters that are created from the profile.
Update notifications include information about all the changes applied to the profile since the initial creation or
since the previous update.

:::warning

We do not recommend updating a currently deployed cluster profile version to push out changes. Instead, we recommend
creating a _new_ profile version, and then upgrade active clusters to the new version. For information on versioning
profiles, check out [Version a Cluster Profile](version-cluster-profile.md).

:::

You can apply cluster updates individually at any time. To learn how to apply updates to an active cluster, review the
[Update a Cluster](../../../clusters/cluster-management/cluster-updates.md) guide.

Refer to the following sections to learn how to update a cluster profile.

## Modify Basic Profile Information

### Prerequisites

- A cluster profile created in Palette.

- Your Palette account role must have the `clusterProfile.update` permission to update a profile. Refer to the
  [Permissions](../../../user-management/palette-rbac/permissions.md) page for more information about roles and
  permissions.

### Modify Profile Information

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click on **Profiles**, and select the profile you want to update. Palette displays the
   profile details and stack.

3. Click on **Settings** and choose **Edit Info** from the **drop-down Menu**. You can modify the profile name, version,
   description, and tags.

   :::info

   Updated tags will not be propagated to previously created clusters. However, tag changes will apply to new clusters
   you create that use the updated profile.

   :::

4. Save your changes.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click on **Profiles** and select the profile you updated. Palette displays the profile
   details and stack.

3. Check that profile details display your changes.

To learn how to apply the changes, review [Apply Profile Updates to Clusters](#apply-profile-updates-to-clusters).

## Update a Profile Layer

### Prerequisites

- A cluster profile created in Palette.

- Your Palette account role must have the `clusterProfile.update` permission to update a profile. Refer to the
  [Cluster Profile permissions](../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile)
  reference for more information about roles and permissions.

### Update Layer

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click on **Profiles** and select the profile you want to update. Palette displays the
   profile details and stack.

3. You can do the following:

   - Select **Add New Pack** and choose a pack to add to the profile.
   - Select **Import from cluster** to import a pack from another cluster.

   - Select the pack layer you want to update, and edit pack settings in the YAML file that displays in the YAML editor.

   - Click on the **Update** button to view and apply available updates to packs. To learn how to update your customized
     packs, review [Update the Pack Version](#update-the-pack-version).

   - Select **Add Manifest** to add, edit, or remove a manifest.

   - Select **Add Helm chart** to add, edit, or remove a Helm chart.

   - Select **Add Zarf** to add applications in air-gapped environments.

   - Remove non-infrastructure pack layers from the profile. Click the layer to display its details and click the
     **trash can** icon in the **Edit Pack** panel.

     :::info

     You cannot remove Operating System (OS), Kubernetes, Networking, or Storage infrastructure layers.

     :::

   - Select **Settings** and choose **Delete** to delete the entire profile. You can also delete the profile when you
     choose **Delete** from the **three-dots Menu** on the Profiles page.

4. Confirm your updates.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click on **Profiles**.

3. If you made changes, click the profile you updated. Palette displays the profile details and stack.

4. Check that layers are added to or removed from the profile stack.

5. If you added, removed, or modified a manifest, click the layer in the stack that you updated and verify the manifest
   changes.

To learn how to apply the changes, review [Apply Profile Updates to Clusters](#apply-profile-updates-to-clusters).

## Accept Updates to a Cluster Profile

Palette will automatically display the **Update** button when a new version of a pack is available. For example, if you
have the Container Network Interface (CNI) Calico pack version 3.28.0 in your profile, and a new version becomes
available, for example, version 3.28.2, Palette will automatically display the **Update** button when you visit the
cluster profile's details page. If you click on the **Update** button, Palette will display the new versions available
for each pack in the profile.

Review the following steps to accept incoming pack updates to a cluster profile.

### Prerequisites

- A cluster profile created in Palette.

- There are updates available for at least one pack in the profile.

- Your Palette account role must have the `clusterProfile.update` permission to update a profile. Refer to the
  [Cluster Profile permissions](../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile)
  reference for more information about roles and permissions.

### Review Update Changes

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, select **Profiles**.

3. Select the profile you want to update to access the profile details page.

4. Palette displays profile details and the profile stack. If there are pending updates, Palette displays a green
   **Update** button in the top right-hand corner of the page. Click on the **Update** button to view the changes
   summary modal.

5. If the changes can be applied without any issues, then Palette will display the **Apply Changes** button.

   ![A view of the cluster profile update widget displaying a new version of Calico is available.](/profiles_cluster-profiles_modify-cluster-profiles_new-version-notifcation.webp)

   Otherwise, you will be presented with the **Review changes in Editor** button, which allows you to review the changes
   before applying them.

   :::tip

   If a pack row has an information icon, hover over the icon to learn more about the changes.

   :::

   ![A view of the cluster profile update widget displaying a new packs versions but changes that require the user's input.](/profiles_cluster-profiles_modify-cluster-profiles_new-version-notifcation-changes-required.webp)

6. Click on the **Apply Changes** button to apply the updates to the profile. If there are changes that require your
   attention, click on the **Review changes in Editor** button to start the review process.

7. The differential editor will display the changes between the current YAML configuration and new incoming YAML
   changes. The left side of the editor displays the current configuration. The right side displays the new pack
   version's incoming changes. Review the changes and apply them as needed. Use the three buttons at the bottom to
   navigate through the changes.

   - **Prev**: Click to navigate to the previous change.
   - **Next**: Click to navigate to the next change.
   - **Keep**: Click to apply the current change.
   - **Revert**: Click to revert the accepted change. This button will only appear after you have clicked the **Keep**
     button.

   The differential editor will display the changes by highlighting the differences between the configurations. The
   color-coded highlights indicate the following:

   - _Yellow highlight_ indicates text that is not present in the new configuration. These may be lines you have added
     in the current configuration or lines that have been removed because they are no longer valid in the new
     configuration. If you need them, use the **Keep** button to transfer the lines to the new pack version. Otherwise,
     click on **Next** to proceed.

   - _Blue highlight_ indicates additions in the new configuration that are not present in the pack version you are
     using.

     ![Screenshot that shows Palette's pack diff user interface with yellow highlight at left and blue highlight at right](/profiles_cluster-profiles_modify-cluster-incoming-updates.webp)

8. Repeat step 7 until you have reviewed all the changes for each pack layer. You can select a different pack layer from
   the left-hand side of the editor. Once a pack layer is reviewed, a gray checkmark will appear next to the pack name.

9. Click on the **Apply Changes** button to apply the updates to the profile.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. From the left **Main Menu**, select **Profiles**.

3. Click the profile you updated to access the profile details page.

4. Check that the updated layer displays the new pack versions.

5. Click on the pack layer and review its configuration to ensure the changes are applied.

## Update the Pack Version

Packs typically contain changes between versions, such as the addition or removal of parameters and policies. The
following steps will guide you in updating configurations.

:::warning

Ensure you follow these practices when updating to a new pack version.

- You should not copy the pack configuration from one version to another, as the newer version often contains
  customizations. Instead, you should integrate your changes manually in the new version. Use the **Keep** button to
  copy the lines from the current configuration to the new version.
- Update to a newer Kubernetes version incrementally, one minor version at a time.
- Select a specific target version instead of a group that ends in `.x`
- We do not recommend downgrading packs to the previous version.

:::

### Prerequisites

- A cluster profile created in Palette.

- There are updates available for at least one pack in the profile.

- Your Palette account role must have the `clusterProfile.update` permission to update a profile. Refer to the
  [Cluster Profile permissions](../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile)
  reference for more information about roles and permissions.

### Update Pack Version

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, select **Profiles**.

3. Select the profile you want to update to access the profile details page.

4. In the **Edit Pack** panel, select a specific target version, not a group that ends in `.x`. Palette displays the
   difference between the current version at left and the new version at right. The target version is displayed in the
   header.

   Differences between the displayed configurations are as follows:

   - _Yellow highlight_ indicates text that is not present in the new configuration. These may be lines you have added
     in the current configuration or lines that have been removed because they are no longer valid in the new
     configuration. If you need them, you can use the **Keep** button to transfer the lines to the new pack version.
     Otherwise, click on **Next** to proceed.

   - _Blue highlight_ indicates additions in the new configuration that are not present in the pack version you are
     using.

     #### Example of Difference Between Current and New Configurations

     ![Screenshot that shows Palette's pack diff user interface with yellow highlight at left and blue highlight at right](/integrations_pack_diffs.webp)

5. Check for yellow-highlights in the current configuration that are missing in the new configuration. If there are any
   customizations lines you added, use the **Keep** button to transfer the lines to the new version. Otherwise, click on
   **Next** to proceed.

6. Check for changed settings in the new configuration, and copy settings from the current configuration to the new
   configuration.

7. Review new sections in the new configuration. You should adopt them, as they are typically needed to support the new
   configuration.

8. Check for changes in the same line that have a different value. If it is not a customization you made, you should
   adopt the new value, as it is known to be compatible with the new version.

9. Confirm your updates.

To learn how to apply the changes, review [Apply Profile Updates to Clusters](#apply-profile-updates-to-clusters).

### Validate

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. From the left **Main Menu**, select **Profiles**.

3. Click the profile you updated. Palette displays the profile stack.

4. Check that the updated layer displays the new pack version.

   Palette indicates any problematic layers in the stack. You can hover over the pack name to view details about the
   misconfiguration.

5. Click on the pack layer and review its configuration. Apply fixes and confirm your updates.

6. Repeat the process until Palette indicates the configuration works.

## Apply Profile Updates to Clusters

You can accept changes to a cluster's cluster profile and override the existing profile configurations to update a
cluster. Accepting these changes will only apply to the cluster you are updating and will not propagate to the cluster
profile or other clusters using the same profile.

:::warning

We do not recommend updating a currently deployed cluster profile version to push out changes. Instead, we recommend
creating a _new_ profile version, and then upgrade active clusters to the new version. For information on versioning
profiles, check out [Version a Cluster Profile](version-cluster-profile.md).

:::

### Prerequisites

- A cluster profile created in Palette.

- A deployed and healthy cluster with an associated cluster profile that has updates available.

### Apply Updates

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, select **Clusters**. Clusters that are eligible for an update will have an **Updates
   Available** badge.

3. Select the cluster with the update notification to start the **Apply Updates** wizard. Click on the **Apply** button.

4. The **Apply Updates** wizard opens with the update notification, which contains details about the updates that will
   be applied. Click the **Confirm** button to apply updates to the cluster.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click on **Profiles** and select the updated cluster.

3. Check that layers are added to or removed from the profile stack, and verify other profile details.

4. If you added, removed, or modified a manifest, click the layer in the stack that you updated and verify the manifest
   changes.
