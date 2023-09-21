---
sidebar_label: "Export and Import a Cluster Profile"
title: "Export and Import a Cluster Profile"
description: "Understanding the Cluster Profiles Concept and how they make Spectro Cloud powerful"
hide_table_of_contents: false
sidebar_position: 60
tags: ["profiles", "cluster profiles"]
---


Instead of rebuilding cluster profiles, you can export them in JSON format and then import them across multiple environments, projects, and tenants. This is especially helpful if you want to reuse large profiles that have many add-ons and integrations.

## Prerequisites

- Macros used in the profile you want to export must be available in the target environment *before* you import the profile. If they are not available in the target environment, create them there before importing the profile. For instructions on macro creation, review [Macro Support](../../clusters/cluster-management/macros.md#create-your-macro).


## Export Cluster Profile

Use these steps to export the profile as a `.json` file. 

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. From the left **Main Menu**, select **Profiles**. 

3. Select the profile to export. Palette displays the profile details and profile stack.

4. Click **Export Profile** at the bottom of the details panel. Palette downloads the profile as a `.json` file.

5. Verify that any macros used in the exported profile exist in the target environment before continuing to the import process. If they do not, create the macros in the target environment. Review [Macro Support](../../clusters/cluster-management/macros.md#create-your-macro) for guidance.

:::info
During profile export, Palette masks sensitive pack values, which you must update after profile import.
:::

## Import Cluster Profile

Use these steps to import the profile to one or more projects or tenants.

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Select the project or tenant where you will import the profile.

3. From the left **Main Menu**, select **Profiles**.

4. Click on the **Import Cluster Profile** button.

5. In the slide panel that opens at right, click the **Upload file** button. 

6. Navigate to the downloaded `.json` file and select it so that it opens in the slide panel.

<<< Placeholder image>>>

7. Click the **Validate** button. Palette checks for duplicate profile names and versions in the target environment and displays an error message if it finds them. 

8. If Palette displays an error message, customize the profile name or version number to fix any issues. 

9. In the **Select repositories** window that displays when the profile is successfully validated, use the **drop-down Menus** to select one or more repositories 

When the profile is successfully validated, Palette displays the **Select repositories** window. 

<!-- which lists all the repositories that contain packs used in the profile you are importing. -->

![diagram](/profiles_cluster-profiles_import-select-repos.png)

10. Using the **drop-down Menus**, select one or more repositories from which to fetch packs that are in the profile you are importing. Confirm your selections. 

:::info
If any of the packs are missing in the target environment, the import will not proceed to the next step.
:::

11. Click the **Confirm** button in the slide panel to complete the import.

You have successfully imported the profile and can use it for standard cluster operations such as deployments and updates in the new environment.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Select the project or tenant ppppp imported the cluster profile.

3. From the left **Main Menu**, select **Profiles**.

4. Select your cluster profile to review its layers or make changes.

