---
sidebar_label: "Update an App Profile"
title: "Update an App Profile"
description: "Learn how you can update an app profile in Palette."
hide_table_of_contents: false
sidebar_position: 20
tags: ["profiles", "app profiles"]
---


You can update an app profile to change the configuration of one or more layers and add or remove layers. You can also update basic profile information such as the name, description, and tags.

App profile changes will generate an update notification on all the Apps that are created from the profile. Update notifications include information about all the changes applied to the profile since the initial creation or since the previous update. You can apply updates to Apps individually at any time.


## Prerequisites

- An existing app profile.


## Modify Basic Profile Information

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the **User Menu**, select **Switch to App Mode**.

3. Select **App Profiles** from the left **Main Menu**.

4. Click the profile you want to update. Palette displays the profile stack.

5. Click on **Settings** and choose **Basic Info** in the slid-out panel.  You can modify the name, description, and tags.
    
:::info

  Updated tags are not propagated to previously created Apps. However, tag changes will apply to new Apps you deploy that use the updated profile.

:::

6. Save your changes and apply the updates to your app. Review [Apply Updates to Apps](#apply-updates-to-apps) for guidance.


### Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the **User Menu**, select **Switch to App Mode**.

3. Select **App Profiles** from the left **Main Menu**.

4. Select the profile you updated. Palette displays the profile details and profile stack.

5. Check that profile details display your changes.


## Update a Profile Layer

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the **User Menu**, select **Switch to App Mode**.

3. Select **App Profiles** from the left **Main Menu**.

4. Select the app profile you want to update.

5. Make the desired changes. You can add or delete layers, change pack versions, change pack values, and more. 

6. Save your changes and apply the updates to your app. Review [Apply Updates to Apps](#apply-updates-to-apps) for guidance.


### Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the **User Menu**, select **Switch to App Mode**.

3. Select **App Profiles** from the left **Main Menu**.

4. Select the profile you updated. Palette displays the profile details and profile stack.

5. Check that services and layers are added to or removed from the stack.  

6. If you added, removed, or modified a manifest, click the layer in the stack that you updated and verify the manifest changes.


## Apply Updates to Apps

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the **User Menu**, select **Switch to App Mode**.

3. Select **App Profiles** from the left **Main Menu**.

4. Navigate to the left **Main Menu** and click on **Apps**.

5. Apps that are eligible for an update will have an **Updates Available** badge.

6. Select the app with the update notification to start the **Apply** updates wizard. Click on **Apply** button.

7. An **Apply Updates** wizard opens with the update notification. The notification contains details about the updates that will be applied. Click the **Confirm** button to apply the updates to the app.


## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the **User Menu**, select **Switch to App Mode**.

3. Select **App Profiles** from the left **Main Menu**.

4. Select the updated app.

5. Check that layers are added to or removed from the profile stack, and verify other profile details.  

6. If you added, removed, or modified a manifest, click the layer in the stack that you updated and verify the manifest changes.

