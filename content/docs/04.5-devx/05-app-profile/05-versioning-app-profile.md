---
title: "App Profile Versioning"
metaTitle: "Palette Dev Engine App Profile Versioning"
metaDescription: "Learn about App Profile Versioning, what it is, how to create a version, and how to manage a version."
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';




# App Profile Versioning

Palette enables users to create multiple versions of an App Profile within the scope of a single profile name. The **Version** field of the app profile takes a semantic versioning format (only numbers supported) as below: 

  **`major.minor.patch`** represented as: Version 1.1.2
         
App versioning is an optional field with a default value of **1.0.0** . The users can create multiple versions of an app profile under a single profile name and each of these versions can have its own pack configurations.
 
Cluster profile versions are grouped under their unique names and their uniqueness is decided by the name and version within the scope and promotes backward compatibility to profile changes.

 **Example:** Profile-1 can have multiple versions like 1.0.0 and 2.0.1. These versions are grouped under the **App Profile Name** Profile-1. The menu next to the app profile name contains the different versions under that name.
          
 The version numbers can be edited from the **Settings > Edit Info**  option from the App Profile page. While deleting the profile, select the version to be deleted.

The new versions of the App Profile may:

* Contain additional tiers

* Drop existing tiers

* Contain new versions of a tier

* Update the configuration of the existing tiers

<InfoBox>

The following attributes are non-editable during versioning:

* App Profile name and version number. New version numbers are created and existing version number can be deleted.

* App Profile tier name and type.
 
</InfoBox>


# Apply Version to a Profile


## Prerequisites 

- An App Profile

## Create Version

1. Log in to [Palette](/devx#quickstartwithpaletteappmode)


2. Select the **App Profiles** option from the left **Main Menu**.


3. Select the App Profile to be versioned.


4. From the drop-down menu next to the App Profile name, select the **Create New Version**.


5.  Give the version number per the semantic format described above.


6.  Click on **Confirm** to complete the wizard. The UI will return a versioning successful message.

## Validation

To validate the App Profile is versioned and available in the target project conduct the following steps:

1. Log in to [Palette](/devx#quickstartwithpaletteappmode)


2. Select the **App Profiles** option from the left **Main Menu**.     


3. This page will list all the App Profiles available to you. In addition, this should list all the versioned App Profiles as well. Use the versioned App Profile for App deployment under the target scope.

# Delete an App Profile

## Prerequisites 

- An App Profile

## Delete Profile

1. Log in to [Palette](/devx#quickstartwithpaletteappmode)


2. Select the **App Profiles** option from the left **Main Menu**.


3. This page will list all the App Profiles available to you. Select the App Profile to be deleted.


4. From the drop-down menu next to the App Profile Name, select the version to be deleted and click **Delete** to delete the profile.


5. The selected App Profile version will be deleted. 

## Validation


To validate the App Profile is removed and not available in the target project, conduct the following steps:

1. Log in to [Palette](/devx#quickstartwithpaletteappmode)


2. Select the **App Profiles** option from the left **Main Menu**.   


3. Verify the app profile is not in the list of available profiles.


# Update an App Profile

You can make changes to the app profile, such as version updates, manifest updates, app tier additions and removals.

App Profile changes will generate an update notification on all the Apps that are created from  the app profile. Update notifications include information about all the changes applied to the profile since the initial creation or since the previous update. You can apply the update to the Apps individually at any time.

# Apply Updates to the App

To apply updates to an App follow the below steps:

1. Log in to [Palette](/devx#quickstartwithpaletteappmode)


2. Select the **App Profiles** option from the left **Main Menu**.


3. This page will list all the App Profiles available to you. Select the App Profile you want to update.


4. Make the desired changes. You can add or delete layers, change pack versions, change pack values, etc. and save your changes.

5. Navigate to the left **Main Menu** and click on **Apps**


5. On the App page, apps eligible for an update will have an **Updates Available** badge.


* Click on the App with the update notification to start the **Apply** updates wizard. Click on **Apply** button.


* An **Apply Updates** wizard will open up with the update notification. The notification contains details about the updates that will be applied. Click the **Confirm** button to apply the updates to the app.

## Validation

To validate that the App profile updates are implemented on the target app, conduct the following steps:

1. Log in to [Palette](/devx#quickstartwithpaletteappmode)


2. Select the **Apps** option from the left **Main Menu**.


3. This page will list all the Apps. Click open the updated App.


4.  Review the app profile details, which will include the applied updates.
