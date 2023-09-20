---
sidebar_label: "Version an App Profile"
title: "Version an App Profile"
description: "Understanding the Cluster Profiles Concept and how they make Spectro Cloud powerful"
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



# Delete an App Profile

## Prerequisites 

- An App Profile

## Delete Profile

<!-- 1. Log in to [Palette](https://console.spectrocloud.com/). -->

2. Select the **App Profiles** option from the left **Main Menu**.

3. This page will list all the App Profiles available to you. Select the App Profile to be deleted.

4. From the drop-down menu next to the App Profile Name, select the version to be deleted and click **Delete** to delete the profile.

5. The selected App Profile version will be deleted.



## Validate


To validate the App Profile is removed and not available in the target project, conduct the following steps:

<!-- 1. Log in to [Palette](https://console.spectrocloud.com/). -->

2. Select the **App Profiles** option from the left **Main Menu**.   

3. Verify the app profile is not in the list of available profiles.


## Update an App Profile

You can make changes to the app profile, such as version updates, manifest updates, app tier additions and removals.

App Profile changes will generate an update notification on all the Apps that are created from  the app profile. Update notifications include information about all the changes applied to the profile since the initial creation or since the previous update. You can apply the update to the Apps individually at any time.


# Apply Updates to the App

To apply updates to an App follow the below steps:

<!-- 1. Log in to [Palette](https://console.spectrocloud.com/). -->

2. Select the **App Profiles** option from the left **Main Menu**.

3. This page will list all the App Profiles available to you. Select the App Profile you want to update.

4. Make the desired changes. You can add or delete layers, change pack versions, change pack values, etc. and save your changes.

5. Navigate to the left **Main Menu** and click on **Apps**

6. On the App page, apps eligible for an update will have an **Updates Available** badge.

* Click on the App with the update notification to start the **Apply** updates wizard. Click on **Apply** button.

* An **Apply Updates** wizard will open up with the update notification. The notification contains details about the updates that will be applied. Click the **Confirm** button to apply the updates to the app.


## Validate

To validate that the App profile updates are implemented on the target app, conduct the following steps:

<!-- 1. Log in to [Palette](https://console.spectrocloud.com/). -->

2. Select the **Apps** option from the left **Main Menu**.

3. This page will list all the Apps. Click open the updated App.

4.  Review the app profile details, which will include the applied updates.
