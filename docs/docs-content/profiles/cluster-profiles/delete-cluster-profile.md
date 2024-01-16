---
sidebar_label: "Delete a Cluster Profile"
title: "Delete a Cluster Profile"
description: "Learn how to delete a cluster profile in Palette."
hide_table_of_contents: false
sidebar_position: 80
tags: ["profiles", "cluster profiles"]
---

Use the following steps to delete a cluster profile. Clusters that are using a deleted profile will continue to operate fine.

:::warning

If a cluster profile has more than one version, ensure you delete the appropriate version by reviewing its configuration before deleting the profile.

:::

## Prerequisites

- An existing cluster profile.

- Your Palette account role must have the `clusterProfile.delete` permission to delete a profile. Refer to the [Cluster Profile permissions](../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile-admin).

## Delete Profile

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Select **Profiles** from the left **Main Menu**.

3. Select the profile you want to delete. To delete the profile and all its versions, click the **three-dots Menu** and select **Delete**.

To delete a specific profile version, select the profile to display its details page. Use the **drop-down Menu** next to the profile name and select the version to delete, click on the **Settings** button, and select **Delete**.

You have successfully deleted the cluster profile or a profile version.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Select **Profiles** from the left **Main Menu**.

3. If you deleted a cluster profile together with any versions it may have had, verify that it no longer displays in the list of available profiles.

4. If you deleted a specific cluster profile _version_, select the base profile to display its details, and click the **drop-down Menu** next to the profile name to verify the version you deleted is no longer listed.
