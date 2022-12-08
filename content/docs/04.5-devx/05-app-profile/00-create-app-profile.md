---
title: "Create an App Profile"
metaTitle: "Learn how to create an App Profile"
metaDescription: "This document provides guidance on how to create a Palette App Profile"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import InfoBox from 'shared/components/InfoBox';
import WarningBox from 'shared/components/WarningBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Create an App Profile

You can create as many App Profiles as needed to fit various types of workloads on your Palette Virtual Clusters. Each App Profile can contain multiple services, also called layers in the App Profile stack. You can also create multiple versions of an App Profile. For more information, visit [App Profile Versioning](/devx/app-profile/versioning-app-profile). 

Use the following steps to create an App Profile.


# Prerequisites

* A Spectro Cloud [account](https://www.spectrocloud.com/get-started/).
<br />

# App Profile Creation

To create an App Profile:

1. Log in to [Palette](https://console.spectrocloud.com).

2. In **App Mode**, select **App Profiles** in the **Main Menu**, and click the **New App Profile** button. 

3. Provide the following basic information for your App Profile and click **Next**.


|         Parameter           | Description  |
|-------------------------------|-----------------|
|Application Profile Name | A custom name for the App Profile|
|Version (optional) | The default value is 1.0.0. You can create multiple versions of an App Profile using the format **`major.minor.patch`**.
|Description (optional)   | Description of the App Profile. | 
|Tag (optional)               | Tags on a cluster group are propagated to the cloud/datacenter environments.|

4. Select one of the available services to start configuring your App Profile. Refer to [App Profiles](/devx/app-profile) for a list of available services. 

5. Provide configuration information for the service you're adding.

6. You can add more services to the App Profile if needed. To do this, click the **Actions** button next to the **Configure tier** pane. To rearrange layers, select a service and drag it up or down in the pane. Each service becomes a layer in the App Profile stack in the order shown in this pane.

7. When you've provided the required configuration information for services, click **Review**. 

Your App Profile is now created and can be used for Apps deployment.  

# Validation

To validate your App Profile is available and ready for use, navigate to the **App Profiles** page, where you'll find all your app profiles listed. From this page, you can edit and delete App Profiles in **Settings**.
