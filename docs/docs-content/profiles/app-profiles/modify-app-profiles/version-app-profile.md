---
sidebar_label: "Version an App Profile"
title: "Version an App Profile"
description: "Learn how to create a new version of an existing app profile in Palette."
hide_table_of_contents: false
sidebar_position: 30
tags: ["profiles", "app profiles"]
---

Palette enables you to create multiple versions of an app profile using the same profile name but with a different version number and services configuration. App profile versions use the format `major.minor.patch` and have a default value of `1.0.0`.

App profile versions are grouped under the same name, and the version number makes them unique. The **drop-down Menu** next to the app profile name on the profile details page contains the different versions.

New versions of an app profile may add or remove layers, contain new pack versions, or update a pack configuration.

## Prerequisites

- An existing app profile.

## Create New App Profile Version

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the **User Menu**, select **Switch to App Mode**.

3. Click on **App Profiles** in the left **Main Menu**, and select the app profile that you want to version. Palette displays the profile details.

4. From the **drop-down Menu** next to the app profile name, select **Create New Version**.

5. Provide the version number using `major.minor.patch` format.

6. Click on **Confirm**. Palette displays a versioning successful message.

7. Configure layers as needed.

You have successfully created a new pack version.

## Validate

You can validate that the app profile is versioned and available.

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Click on **App Profiles** in the left **Main Menu**, and select the app profile that you versioned.

3. Use the **drop-down Menu** next to the app profile name to select the new profile version. Use the versioned profile to deploy an app within the target scope.
