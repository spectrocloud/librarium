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

* contain additional tiers

* drop existing tiers

* contain new versions of a tier

* update the configuration of the existing tiers

<InfoBox>

The following attributes are non-editable during versioning:

* App Profile name and version number. New version numbers are created and existing version number can be deleted.

* App Profile tier name and type.
 
</InfoBox>

# To apply version to a profile

* Select the App Profile to be versioned.


* From the **Drop Down** menu next to the app profile name select the **Create New Version**.


* Give the version number as per the format described.    


* **Confirm** the version number to complete the versioning wizard.

The new version of the app profile will be saved under the same app profile name. Users can select the app profile by selecting the name and version number for deployments.

