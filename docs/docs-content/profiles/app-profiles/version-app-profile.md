---
sidebar_label: "Version an App Profile"
title: "Version an App Profile"
description: "Learn how to version an app profile in Palette."
hide_table_of_contents: false
sidebar_position: 40
tags: ["profiles", "app profiles"]
---


You can create multiple versions of an app profile using the same profile name but with a different pack configuration. App profile versions use the format `major.minor.patch`. For example version 1.1.2. 
         
App profiles have a default value of `1.0.0`. When you create a new profile version, you can add or remove packs, and you can add different pack versions. 

## Prerequisites 

- An existing app profile.

## Enablement

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Select the **App Profiles** option from the left **Main Menu**.

3. Select the app profile that you want to version.

4. From the **drop-down Menu** next to the app profile name, select the **Create New Version**.

5. Provide the version number using `major.minor.patch` format.

6. Click on **Confirm**. Palette displays a versioning successful message.



## Validate

To validate the App Profile is versioned and available in the target project conduct the following steps:

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Select the **App Profiles** option from the left **Main Menu**. 

3. Select the app profile that you versioned.

4. Use the **drop-down Menu** next to the app profile name to select the new profile version. Use the versioned profile to deploy an app within the target scope.
