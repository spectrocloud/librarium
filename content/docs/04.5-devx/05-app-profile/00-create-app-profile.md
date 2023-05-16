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


<br />


  <InfoBox>

  A tutorial is available to help you learn how to use Palette Dev Engine by deploying an application. Check out [Deploy an Application using Palette Dev Engine](/devx/apps/deploy-app) to get started with Palette Dev Engine.

  </InfoBox>


# Prerequisites

* A Spectro Cloud [account](https://www.spectrocloud.com/get-started/).
<br />

# App Profile Creation

To create an App Profile:

1. Log in to [Palette](https://console.spectrocloud.com).


2. In App Mode, select **App Profiles** from the **Main Menu**, and click the **New App Profile** button. 


3. Provide the following basic information for your App Profile and click **Next**.


|         Parameter           | Description  |
|-------------------------------|-----------------|
|Application Profile Name | A custom name for the App Profile|
|Version (optional) | The default value is 1.0.0. You can create multiple versions of an App Profile using the format **`major.minor.patch`**.
|Description (optional)   | Description of the App Profile. | 
|Tag (optional)               | Assign tags to the app profile.|


4. Select one of the available services to start configuring your App Profile. Refer to [App Profiles](/devx/app-profile) for a list of available services. 


5. Provide configuration information for the service.


6. You can add more services to the App Profile as needed. To do this, click the **Actions** button next to the **Configure tier** pane. To rearrange layers in the profile, select a service and drag it up or down in the pane. Each service becomes a layer in the App Profile stack in the order shown in this pane.


7. When you've provided the required configuration information for services, click **Review**. Your App Profile is now created and can be deployed.  

# Validation

To validate your App Profile is available and ready for use, use the following steps.

1. Log in to [Palette](https://console.spectrocloud.com) and switch to **App Mode**.


2. Navigate to the left **Main Menu** and click on **App Profiles**.


3. Select the cluster profile you created to review its details.


4. Hover your cursor over each app layer to learn more about the layers, including the pack name, version, and registry.


  ![A view of a cursor triggering the info box for each app profile layer.](/devx_app-profile_create-app-profile_app-layer-infoboxes.png)

  <br />

  <InfoBox>

  Use the pop-up information box for each layer to help you gather the required information when creating Terraform templates for [app profiles](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/application_profile).

  </InfoBox>


5. Deploy your application to a virtual cluster to verify all the required configurations and dependencies are correct. Review the [Create and Manage Apps](/devx/apps/create-app) to learn how to deploy an app to a virtual cluster. Check out the [Deploy an Application using Palette Dev Engine](/devx/apps/deploy-app) tutorial for a more in-depth guide.

# Next Steps

Start exploring the various [out-of-the-box](/devx/app-profile/services) services Palette exposes to application authors. Use these services to quickly deploy applications without the overhead of managing and configuring the infrastructure required for common third-party services such as databases, message queues, and more.
