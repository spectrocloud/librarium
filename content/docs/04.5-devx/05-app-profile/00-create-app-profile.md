---
title: "Create an App Profile"
metaTitle: "Learn how to create an App Profile"
metaDescription: "This guide provides guidance on how to create a Palette App Profile"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import InfoBox from 'shared/components/InfoBox';
import WarningBox from 'shared/components/WarningBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Create an App Profile

You can create as many App Profiles as you need to fit your various types of workloads. Each App Profile may contain multiple services, also called tiers. Palette Dev Engine also supports the creation of multiple versions of an App Profile. To learn more visit the App versioning documentation [page](/devx/app-profile/versioning-app-profile).


# Prerequisites

* A Spectro Cloud [account](https://www.spectrocloud.com/get-started/).
<br />
<br />

To create an App Profile:

1. Log in to the Palette Dev Engine console.

2. In **App Mode**, select **App Profiles** in the **Main Menu**, and click the **New App Profile** button. 

3. Provide basic information for your App Profile and click **Next**.

**Basic Information: **

|         Parameter           | Description  |
|-------------------------------|-----------------|
|Application Profile Name | A custom name for the App Profile|
|Version (optional) | The default value is 1.0.0. You can create multiple versions of an App Profile using the format **`major.minor.patch`**.
|Description (optional)   | Description of the App Profile. | 
|Tag (optional)               | Tags on a cluster group are propagated to the cloud/datacenter environments.|

4. Select one of the available services to start configuring your App Profile. 

5. Provide configuration information for the service.

6. You can add more services to the App Profile if needed. To do this, click the **Actions** button next to the **Configure tier** pane. Each service becomes a layer in the App Profile stack.
<br />
To rearrange layers, select a service and drag it up or down in the **Configure tier** pane.

7. Click **Review** to proceed. 

Your App Profile is now created and can be used for Apps deployment. 

To edit or delete an App Profile, navigate to the **App Profile** page. Select the App Profile and click the **Settings** button. 