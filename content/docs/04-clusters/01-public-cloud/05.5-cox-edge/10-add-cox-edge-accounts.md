---
title: "Register and Manage Cox Edge Accounts"
metaTitle: "Add a Cox Edge Account to Palette"
metaDescription: "Learn how to add and manage a Cox Edge account in Palette."
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Overview

Palette supports integration with Cox Edge accounts and account environments. This section explains how to create a Cox Edge account in Palette. 

# Add Cox Edge Account

To add a Cox Edge account to Palette, use the following instructions.

# Prerequisites

- A [Spectro Cloud](https://console.spectrocloud.com) account.

- A [Cox Edge](https://portal.coxedge.com/login) account.

- Tenant admin access in Palette.

# Enablement

1. Log in to the [Cox Edge](https://portal.coxedge.com/login) portal.


2. Navigate to the drop-down **User Menu** and click on **API Credentials**.


3. Select **Generate API key**. 


4. Provide the key a name and select **Generate**.


5. Copy the API key value to a secure location. You will use this value in the future.


6. Go ahead and copy the API endpoint URL. The API endpoint is located above the table listing all your API keys.


7. Next, expand the drop-down **User Menu** and click on your organization name.


8. Copy the organization id value.


9. Navigate to the left **Main Menu** and select **Edge Compute**.


10. Copy the edge services code located at the top of the page.

<InfoBox>

You can create a new compute environment either now from the **Edge Compute** overview page or later, but keep in mind that a compute environment is required for deploying a cluster. Check out the [Create and Manage Cox IaaS Cluster](/clusters/public-cloud/cox-edge/create-cox-cluster) to learn how to create a Cox Edge environment.

</InfoBox>


11. Next, open up another browser tab and log into [Palette](https://console.spectrocloud.com) as a Tenant admin.


12. Go to **Tenant Settings** > **Cloud Accounts** and click **+Add Cox Edge Account**.


13. Fill out the all of the input fields.

    - Account Name: Assign a name to the Cox Edge account.

    - API Base URL: Add the API endpoint URL you copied down earlier. This is value is found in the API Key overview page in the Cox Edge portal.

    - API Key: Provide the API key you generated earlier.

    - Organzation Id: Add the organization id you copied down earlier from the Cox Edge organization overview page.

    - Environment: This is an optional field but you can provide the environment you wish to target if you have one.

    - Service: Provide the service code you copied from the Cox Edge **Edge Compute** overview page.

14. Click on **Validate** to confirm you have access to the Cox Edge account.

15. Select **Confirm** to add the Cox Edge account to Palette.


# Validation

