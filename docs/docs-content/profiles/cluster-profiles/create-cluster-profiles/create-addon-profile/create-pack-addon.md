---
sidebar_label: "Add a Pack"
title: "Add a Pack"
description: "Learn how to create an add-on profile in Palette that adds a pack layer."
hide_table_of_contents: false
sidebar_position: 0
tags: ["profiles", "cluster profiles", "pack", "add-on"]
---

Use the following steps to create a cluster profile by adding one or more layers using add-on packs.

## Prerequisites

- Your Palette account role must have the `clusterProfile.create` permission to create a profile. Refer to the
  [Roles and Permissions](../../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile)
  documentation for more information.

## Create an Add-on Profile with Packs

<PartialsComponent category="profiles" name="create-profile-enablement" edition="Add-on" />

5. Select **Add New Pack**.

6. Use the search, **Registry**, **Type**, and **Verified** fields to locate and select your desired pack.

7. Select your **Pack Version** and modify the pack **Values** as necessary. Modify the
   [install order](./create-addon-profile.md#install-order) if applicable.

8. Select **Confirm & Create** to return to the cluster profile overview page.

9. If you want to add additional layers, repeat steps 5 and 6. If you need to make changes, select the applicable layer,
   and update your pack's configuration; otherwise, select **Next** to review your cluster profile.

10. Click on **Finish Configuration** to create the cluster profile.

You now have an add-on cluster profile that contains one or more packs. You can reuse the profile and apply it to
several clusters. Refer to the [Update Cluster Profile](../../modify-cluster-profiles/update-cluster-profile.md) guide
for more information about update operations.

## Add Packs to an Existing Profile

Instead of creating a cluster profile from scratch, you can also add additional packs to an existing
[full](../create-full-profile.md) or add-on cluster profile. While you cannot add packs to an
[infrastructure profile](../create-infrastructure-profile.md), you can add additional functionality to a cluster
deployed with infrastructure profile by attaching an add-on profile to the cluster.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Profiles**.

3. Select your cluster profile to review its layers or make changes.

## Next Steps

Now you can use the add-on profile with other profiles and across multiple environments, projects, and tenants.

## Resources

- [Update Cluster Profile](../../modify-cluster-profiles/update-cluster-profile.md)

- [Version a Cluster Profile](../../modify-cluster-profiles/version-cluster-profile.md)

- [Profile Customization](../../../profile-customization.md)

- [Duplicate a Pack in a Profile](../duplicate-pack-in-profile.md)
