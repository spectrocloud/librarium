---
title: "Azure Cloud Account Creation"
metaTitle: "Register Azure cloud account to Palette console"
metaDescription: "The methods of registering Azure cloud account to Palette console"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";



# Creating an Azure Cloud Account

To deploy the Azure Clusters in the Palette Platform, having the Azure Cloud Account registered to the Palette Platform is a significant prerequisite. This section will guide you on creating an Azure cloud account in the Palette console.

## Video Demonstration

Find the video demonstration of Azure Cloud Creation for Palette console.

`video: title: "Azure-cloud-account": /cloud-accounts/azure.mp4`


The below section will guide the users with the prerequisites, steps and validation of Azure Cloud Account creation within the Palette console.

## Prerequisites

* Palette Account

* An active Azure cloud account with sufficient resource limits and permissions to provision compute, network, and security resources in the desired regions.

* Client ID: From Azure console

* Tenant ID: From Azure console

* Client Secret: Created at Azure console.

## How to Register Your Azure Cloud Account in Palette 

To create an Azure cloud account in the Palette console

1. Login to Palette console as **Tenant Admin** and select **Tenant Settings** from the **left main menu**. 


2. From the Tenant Settings go to **Cloud Accounts** and click **+ Add Azure Account**.


3. To the Add azure cloud account wizard, provide the following information:

|   **Basic Information** |Description|
|-------------------------|-----------|
|Account Name| A custom account name|
|Client ID| Unique client Id from Azure console|
|Tenant ID| Unique tenant Id from Azure console|
|[Client Secret](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#create-an-azure-active-directory-application)| Azure secret for authentication|
|Tenant Name| An optional tenant name|
|[Disable Properties](/clusters/public-cloud/azure/azure-cloud#disableproperties)| To disable the import of Azure networking details.|
|Toggle **Connect Private Cloud Gateway**| An option to select the [Self-Hosted PCG](/clusters/public-cloud/azure/gateways#overview) already created from the drop-down menu to link it to the cloud account. |

**Note:** For existing cloud accounts go to **Edit** and toggle the **Connect Private Cloud Gateway** option to select the created Gateway from the drop-down menu.

<br />

4. Click **Confirm** to complete the wizard.


### Disable Properties  

When the above information is provided to the cloud account creation wizard, Azure networking details will be sent to Palette console, which you can disable. To disable network calls from the Palette console to the Azure account, you can click **Disable Properties**.  

For this, we first need to create an Azure Active Directory (AAD) Application which can be used with role-based access control. Follow the steps below to create a new AAD application, assign roles, and create the client secret:

1. Follow the steps described [here](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#create-an-azure-active-directory-application) to create a new Azure Active Directory application. Note down your ClientID and TenantID.


2. On creating the application, a minimum required [ContributorRole](https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#contributor) needs to be assigned. To assign any kind of role, the user must have a minimum role of [UserAccessAdministrator](https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#user-access-administrator). The role can be assigned by following the [Assign Role To Application](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#assign-a-role-to-the-application) link.


3. Follow the steps described in the [Create an Application Secret](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#create-a-new-application-secret) section to create the client application secret. Store the Client Secret safely as it will not be available as plain text later.

<br />

## Validation

To validate the Azure Cloud account creation in Palette console:

1. Login to Palette console as **Tenant Admin** and select **Tenant Settings** from the **left main menu**. 


2. From the Tenant Settings go to **Cloud Accounts** and in this page under the Label of **Azure** the registered cloud account will be listed.

<br />

## Edit the Azure Cloud Account

To edit the Azure Cloud account created in Palette console:

1. Login to Palette console as **Tenant Admin** and select **Tenant Settings** from the **left main menu**. 


2. From the Tenant Settings go to **Cloud Accounts** and in this page under the Label of **Azure** the registered cloud account will be listed.


3. Towards the name of the cloud account to be delete, click the **3 dots** kebab menu and select **Edit**.


4. Make the required changes and click **Confirm** to complete the wizard.

<br />

## Delete the Azure Cloud Account

To delete the Azure Cloud account created in Palette console:

1. Login to Palette console as **Tenant Admin** and select **Tenant Settings** from the **left main menu**. 


2. From the Tenant Settings go to **Cloud Accounts** and in this page under the Label of **Azure** the registered cloud account will be listed.


3. Towards the name of the cloud account to be delete, click the **3 dots** kebab menu and select **Delete**.


