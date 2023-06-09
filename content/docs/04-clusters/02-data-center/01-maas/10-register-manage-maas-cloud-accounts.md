---
title: "Register and Manage MAAS Cloud Accounts"
metaTitle: "Register and Manage MAAS Cloud Accounts"
metaDescription: "Learn how to register and manage your MAAS cloud accounts in Palette."
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview 

When you install the Private Cloud Gateway (PCG), a cloud account is auto-created in every project in Palette. You can use this cloud account to create clusters at either the tenant or the project level. If desired, you can create additional cloud accounts that reference specific PCGs. 

# Prerequisites

- An installed PCG if you do not have a direct connection to the MAAS environment. 

  If are self-hosting Palette and have a direct connection to the MAAS environment, you can select **Use System Private Gateway**.



- An active [MAAS API key](https://maas.io/docs/api-authentication-reference) which can be generated in the MAAS web console under **My Preferences** > **API keys**. The following is an example key:

  ``APn53wz232ZwBMxDp5:MHZIbUp3e4DJTjZEKg:mdEv33WAG536MhNC8mIywNLtjcDTnFAQ``

 For details, refer to the MAAS document on [how to add an API key](https://maas.io/docs/how-to-manage-user-accounts#heading--api-key).


# Register a MAAS Cloud Account

Follow these steps to create additional MAAS cloud accounts.

<br />

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin. 


2. Navigate to the **Main Menu** and select **Tenant Settings > Cloud Accounts**.


3. Locate **MAAS** on the **Cloud Accounts** page and click **Add MAAS Account**.


4. On the **Add maas cloud account** pop-up, enter values for properties listed in the following table.

    For a self-hosted environment, you can register a MAAS cloud account without installing a PCG. Toggle **Use System Private Gateway** to register without a PCG.


| Property | Description |
|-----------|-------------|
| Account Name | Custom name for the cloud name. |
| Use System Private Gateway | Toggle this option to bypass PCG install. |
| Select Private Cloud Gateway | Select your MAAS cloud gateway from the drop-down menu. |
| API Endpoint | API Endpoint of the gateway. |
| API Key | The MAAS API key. |

5. Click **Confirm** to register your MAAS cloud account. 


# Validate

You can validate your MAAS cloud account is registered by reviewing the **Cloud Accounts** page. Ensure your account is listed under **MAAS**. 

# Next Steps

Deploy a Kubernetes cluster to one of your MAAS accounts. Check out [Create and Manage MAAS Cluster](/clusters/data-center/maas/create-manage-maas-clusters) for guidance.

# References 

- [How to add an API key](https://maas.io/docs/how-to-manage-user-accounts#heading--api-key)

<br />

<br />




