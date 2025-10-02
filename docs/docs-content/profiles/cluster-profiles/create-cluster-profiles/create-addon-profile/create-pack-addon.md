---
sidebar_label: "Add a Pack"
title: "Add a Pack"
description: "Learn how to create an add-on profile in Palette that adds a pack layer."
hide_table_of_contents: false
sidebar_position: 0
tags: ["profiles", "cluster profiles", "pack", "add-on"]
---

Use the following steps to create a cluster profile by adding one or more layers using packs.

## Prerequisites

- Your Palette account role must have the `clusterProfile.create` permission to create a profile. Refer to the
  [Roles and Permissions](../../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile)
  documentation for more information.

## Add Pack to Add-on Profile

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu** click **Profiles**.

3. Click on the **Add Cluster Profile** button.

4. Fill out the following input values and ensure you select **Add-on** for the type. Click on **Next** to continue.

   | **Field**       | **Description**                                                                                                                                                                                                   |
   | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Name**        | A custom name for the cluster profile.                                                                                                                                                                            |
   | **Version**     | Assign a version to the profile. You only need to specify a version if you create multiple versions of a profile using the same profile name. Default: `1.0.0`.                                                   |
   | **Description** | Use the description to provide context about the profile.                                                                                                                                                         |
   | **Type**        | **Add-on**                                                                                                                                                                                                        |
   | **Tags**        | Assign any desired profile tags. Tags propagate to the Virtual Machines (VMs) deployed in the cloud or data center environment when clusters are created from this cluster profile. Example: `owner` or `region`. |

   To learn more about creating multiple profile versions, check out
   [Version a Cluster Profile](../../modify-cluster-profiles/version-cluster-profile.md).

5. Select **Add New Pack**. In the next window that displays, choose a registry and select the pack to add to your
   profile. You can search packs by name.

<!-- Select the type of layer to add to the cluster profile. For more information about the layers, applying pack versions, configuration parameters, and presets, review [Profile Layers](../../cluster-profiles.md#profile-layers). -->

6. Fill out the required input fields and click on **Confirm & Create**. Optionally, you can configure values specific
   to the layer in Helm values.yaml form, and specify the layer
   [install order](./create-addon-profile.md#install-order).

  <!-- ![A view of the manifest create process and the YAML code in the text editior](/clusters_imported-clusters_attach-add-on-profile_manfest-view.webp) -->

7. If you want to add additional layers, repeat steps 5 and 6. Otherwise, click on **Next** to review the profile.

8. Click on **Finish Configuration** to create the cluster profile.

You now have an add-on cluster profile that contains one or more packs. You can reuse the profile and apply it to
several clusters. Refer to the [Update Cluster Profile](../../modify-cluster-profiles/update-cluster-profile.md) guide
for more information about update operations.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to left **Main Menu** and select **Profiles**.

3. Select your cluster profile to review its layers or make changes.

## Next Steps

Now you can use the add-on profile with other profiles and across multiple environments, projects, and tenants.

## Resources

- [Update Cluster Profile](../../modify-cluster-profiles/update-cluster-profile.md)

- [Version a Cluster Profile](../../modify-cluster-profiles/version-cluster-profile.md)

- [Profile Customization](../../../profile-customization.md)

- [Duplicate a Pack in a Profile](../duplicate-pack-in-profile.md)
