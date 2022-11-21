---
title: "App Profile Cloning"
metaTitle: "Palette Dev Engine App Profile Cloning"
metaDescription: "Palette Dev Engine App Profile Cloning"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import InfoBox from 'shared/components/InfoBox';
import WarningBox from 'shared/components/WarningBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";


# Clone App Profiles

Palette supports the cloning of app profiles across multiple projects. For example, clone an app profile created under the project scope to the scope of another project within the same tenant. Hence, use an app profile's clone under different project scopes for app deployment.

## Use Case

* Clone app profiles from system scope to project scope.


* Clone app profiles across different project scopes under the same tenant.

# Clone an App Profile

To clone an App Profile:

1. Login to Palette Dev Engine


2. Open the Edit Menu (3 dots or Kebab Menu) towards the name of the app profile to be cloned and click Clone.


3. To the clone wizard, provide the following information:
   * **Name:** Name of the new app profile.
   * **Profile Version:** Version number for the new app profile.
   * **Source Profile Version:** The version number of the source app profile is getting cloned.
   * **Target Project:** The target project to which the profile is to be cloned. Select the project name from the drop-down menu.


4. Click Confirm to complete the wizard. This completes the cloning of an app profile to the target project and can be used for app deployments under the target project scope.
 



