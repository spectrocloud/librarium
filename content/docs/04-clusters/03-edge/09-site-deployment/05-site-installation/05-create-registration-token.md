---
title: "Create a Registration Token"
metaTitle: "Create a Registration Token"
metaDescription: "Learn how to create a tenant registration token for Edge host registrations."
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';



# Create Registration Token


To successfully register an Edge host with Palette you must provide the Edge Installer with a tenant registration token. To create a registration token, use the following steps.


# Prerequisites

- Tenant admin access.


# Create Token

1. Log into [Palette](https://console.spectrocloud.com) as a tenant admin.


2. Switch to the tenant scope.


3. Navigate to the left **Main Menu** and select **Settings**.


4. Select **Registration Tokens** in the **Tenant Settings Menu**.


5. Click **Add New Registration Token**.



6. Fill out the input fields for and **Confirm** your changes.

    <br />

    - **Registration Token Name** - Used to name the token.

    - **Description** - An optional value used to explain the context usage of the token.

    - **Default Project** - Set a default project for Edge host registration.

    - **Expiration Date** - Set an expiration date for the token.




7. Save the **Token** value.


# Validate


1. Log into [Palette](https://console.spectrocloud.com) as a tenant admin.


2. Switch to the tenant scope.


3. Navigate to the left **Main Menu** and select **Settings**.


4. Select **Registration Tokens** in the **Tenant Settings Menu**.


5. Validate the tenant registration token is available

<br />

# Next Steps

The next stage in the Edge host site installation process is registering the Edge host. Go ahead and review the instructions in the [Register Edge Host](/clusters/edge/site-deployment/site-installation/edge-host-registration) guide.