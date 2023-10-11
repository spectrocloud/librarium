---
sidebar_label: "Clone an App Profile"
title: "Clone an App Profile"
description: "Learn how to clone an app profile in Palette."
hide_table_of_contents: false
sidebar_position: 40
tags: ["profiles", "app profiles"]
---



Palette supports the cloning of App Profiles across multiple projects. For example, you can clone an app profile created under a specific project to another project within the same [tenant](../../glossary-all.md#tenant). The ability to clone App Profiles can be useful for the following use cases.

* Share system scope App Profiles to projects scope.

* Share App Profiles amongst different projects.


## Prerequisites

* An app profile created in Palette. Check out [Create an App Profile](../app-profiles/clone-app-profile.md) for guidance.

## Enablement

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the **User Menu**, select **Switch to App Mode**.

3. Select **App Profiles** from the left **Main Menu**.

4. Click on the **three-dot Menu** in the row of the app profile you want to clone and select **Clone**.

5. Provide the following information for the app profile you want to clone and click **Confirm**.

| **Parameter**           | **Description**  |
|-----------------------------|---------------------|
|**Name** | A custom name for the cloned app profile.|
|**Profile Version** | Assign a version number for the cloned app profile. You can create multiple versions of an App Profile using the format `major.minor.patch`. The default value is `1.0.0`. |
|**Source Profile Version**  | The version number of the source profile. | 
|**Target Project** | The target project to which the profile will be cloned. Select the project name from the **drop-down Menu**.|

In the target project specified during the clone process, you can now use the App Profile for app deployments.


## Validate

1. Log in to [Palette](https://console.spectrocloud.com). 

2. From the **User Menu**, select **Switch to App Mode**.

3. Navigate to the left **Main Menu** and click on **App Profiles**. Palette displays a list of all the app profiles available to you, including cloned profiles.
   
4. Deploy your application to a virtual cluster using the cloned app profile.
