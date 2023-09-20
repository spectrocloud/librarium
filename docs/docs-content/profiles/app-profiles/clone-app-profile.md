---
sidebar_label: "Clone an App Profile"
title: "Clone an App Profile"
description: "Understanding the Cluster Profiles Concept and how they make Spectro Cloud powerful"
hide_table_of_contents: false
sidebar_position: 30
tags: ["profiles", "app profiles"]
---


You can clone app profiles across multiple projects. For example, you can clone an app profile created in one project to another project within the same [tenant](../../glossary-all.md#tenant).

## Prerequisites

* An App Profile created in Palette. Check out the [Create an App Profile](create-app-profile.md) for guidance.

## Enablement

1. Log in to [Palette](https://console.spectrocloud.com).

2. On the right side of the window, click on the **User Menu**.

3. Select **Switch to App Mode** from the **drop-down Menu**.

4. From the **Main Menu**, click on **App Profiles**.

5. Click on the **three-dot Menu** in the row of the app profile you want to clone and select **Clone**.

6. Provide the following information for your cloned app profile and click **Confirm**.

| **Parameter**           | **Description**  |
|-----------------------------|---------------------|
|**Name** | A custom name for the cloned app profile.|
|**Profile Version** | An optional version number for the new app profile. The default value is 1.0.0. You can create multiple versions of an App Profile using the format `major.minor.patch`. |
|**Source Profile Version**  | The version number of the source profile. | 
|**Target Project** | The target project to which the profile is to be cloned. Select the project name from the **drop-down Menu**.|

You can now use the app profile when deploying apps in the target project.


## Validate

1. Log in to [Palette](https://console.spectrocloud.com) and switch to App Mode.

2. Navigate to the left **Main Menu** and click on **App Profiles**. Palette displays a list of all the app profiles available to you, including cloned profiles.
   
3. Deploy your application to a virtual cluster using the cloned app profile.
