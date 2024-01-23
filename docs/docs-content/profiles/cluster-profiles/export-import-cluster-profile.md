---
sidebar_label: "Export and Import a Cluster Profile"
title: "Export and Import a Cluster Profile"
description: "Learn how to export and import a cluster profile in Palette."
hide_table_of_contents: false
sidebar_position: 50
tags: ["profiles", "cluster profiles"]
---

Instead of rebuilding cluster profiles, you can export them in JSON format and then import them across multiple
environments, projects, and tenants. This is especially helpful if you want to reuse large profiles that have many
add-ons and integrations.

## Prerequisites

- A cluster profile created in Palette. Check out [Cluster Profiles](cluster-profiles.md) to learn about the different
  types of cluster profiles you can create.

- Your Palette account role must have the `clusterProfile.get` permission to export a cluster profile and
  `clusterProfile.create` to import a cluster profile. Refer to the
  [Cluster Profile permissions](../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile-admin).

- [Macros](../../registries-and-packs/pack-constraints.md#pack-macros) used in the profile you want to export must be
  available in the target environment _before_ you import the profile.

:::warning

If custom macros are not available in the target environment, create them there before importing the profile. For
instructions on macro creation, review [Macro Support](../../clusters/cluster-management/macros.md#create-your-macro).

:::

## Export Cluster Profile

Use these steps to export the profile as a `.json` file.

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click on **Profiles**, and select the profile you want to export. Palette displays the
   profile details and stack.

3. Click **Export Profile** at the bottom of the details panel. Palette downloads the profile as a `.json` file.

4. Verify that any custom macros used in the exported profile exist in the target environment before you import the
   profile. If they do not, create the macros in the target environment. For guidance, review
   [Create Your Macro](../../clusters/cluster-management/macros.md#create-your-macro).

:::warning

During profile export, Palette masks fields that are marked as sensitive. You must update the value of these sensitive
fields after profile import with the proper new value.

:::

## Import Cluster Profile

Use these steps to import the profile to one or more projects or tenants.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Ensure that any macros used in the profile you are importing are available in your environment. If they are not, then
   you must create them _before_ you import the profile. For guidance, review
   [Create Your Macro](../../clusters/cluster-management/macros.md#create-your-macro).

3. Select the project or tenant where you will import the profile.

4. From the left **Main Menu**, select **Profiles** and click on the **Import Cluster Profile** button.

5. In the slide panel that opens at right, click the **Upload file** button.

![Screenshot of the slide panel with the Upload file button.](/profiles_cluster-profiles_upload-json.png)

6. Navigate to the downloaded `.json` file and select it so that it opens in the slide panel as shown.

![Screenshot of the slide panel with uploaded JSON.](/profiles_cluster-profiles_json-to-import.png)

7. Update any pack YAML files that contain sensitive values, such as credentials or certificates.

8. Click the **Validate** button. Palette checks for duplicate profile names and versions in the target environment and
   displays an error message if it finds them.

9. If Palette displays an error message, customize the profile name or version number to fix any issues.

10. In the **Select repositories** window that displays when the profile is successfully validated, use the **drop-down
    Menus** to select one or more repositories in which profile packs exist so Palette can fetch them.

:::warning

If any of the packs are missing in the target environment, profile import will not proceed.

:::

![Screenshot of the Select repositories window.](/profiles_cluster-profiles_import-select-repos.png)

11. Click the **Confirm** button to complete the import.

12. Update any sensitive pack values and credentials in the imported profile.

You have successfully imported the profile and updated any sensitive pack values. You can now use the profile for
standard cluster operations, such as deployments and updates in the new environment.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Select the project or tenant where you imported the cluster profile.

3. From the left **Main Menu**, click on **Profiles**, and select your cluster profile to review its layers or make
   changes.
