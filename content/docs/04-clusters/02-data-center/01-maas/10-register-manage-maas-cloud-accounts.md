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

When you install the Private Cloud Gateway (PCG), an account is auto-created. You can use this account to create tenant clusters and, if desired, you can create additional accounts. 

# Prerequisites

- An installed PCG. Review [Install and Manage MAAS Gateway](/clusters/data-center/maas/install-manage-maas-pcg) for guidance. 


# Create a MAAS cloud account

Follow these steps to create additional MAAS cloud accounts.

<br />

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin. 


2. Navigate to the **Main Menu** and select **Tenant Settings > Cloud Accounts**.


3. Locate **MAAS** on the **Cloud Accounts** page and click **Add MAAS Account**.


4. Enter values for properties listed in the following table.


| Property | Description |
|-----------|-------------|
| Account Name | Custom name for the cloud name. |
| Select Private Cloud Gateway | Select your MAAS cloud gateway from the **drop-down Menu**. |
| API Endpoint | API Endpoint of the gateway.|
| API Key | The MAAS API key. |


# Validation

You can validate your MAAS cloud account is created by reviewing the **Cloud Accounts** page. Ensure your account is listed under **MAAS**. 

# Next Steps

Deploy a Kubernetes cluster to one of your MAAS accounts. Check out [Create and Manage MAAS Cluster](/clusters/data-center/maas/create-manage-maas-clusters) for guidance.

<br />

<br />



