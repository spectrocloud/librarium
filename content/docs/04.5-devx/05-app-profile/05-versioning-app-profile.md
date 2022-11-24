---
title: "App Profile Versioning"
metaTitle: "Palette Dev Engine App Profile Versioning"
metaDescription: "App Profile Versioning for Palette Dev Engine"
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


* Select the App Profile to be versioned.


* From the **Drop Down** menu next to the App Profile name, select the **Create New Version**.


* Give the version number per the semantic format described above.


* Click on **Confirm** to complete the wizard. The UI will return a versioning successful message.


* The App Profile list will display the new version of the App Profile. Users can select the App Profile by selecting the name and version number for deployments.


## Delete an App Profile

1. Login to [Palette](/devx#quickstartwithpaletteappmode)


2. Select the **App Profiles** option from the left **Main Menu**.


3. This page will list all the App Profiles available to you. Select the App Profile to be deleted.


4. From the drop-down next to the App Profile Name, select the version to be deleted and click **Delete** to delete the profile successfully.


5. The selected App Profile version will be deleted. 

## Validation


To validate the App Profile is versioned  and available in the target project conduct the following steps:

1. Login to [Palette](/devx#quickstartwithpaletteappmode)


2. Select the **App Profiles** option from the left **Main Menu**.     


3. This page will list all the App Profiles available to you. In addition, this should list all the versioned App Profiles as well. Use the versioned App Profile for App deployment under the target scope.


