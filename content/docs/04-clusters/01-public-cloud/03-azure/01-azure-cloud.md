---
title: "Register and Manage Azure Cloud Account"
metaTitle: "Register and manage an Azure cloud account in Palette"
metaDescription: "This guide will help you register and manage an Azure cloud account in Palette"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";



# Register an Azure Cloud Account

Palette supports deployment and managing Kubernetes clusters in an Azure account. This section guides you on how to create a Kubernetes cluster in Azure that is managed by Palette.

## Video Demonstration

The following video demonstrates the integration of Azure Cloud with the Palette console.

`video: title: "Azure-cloud-account": ./azure.mp4`


This guide will provide steps for how you can integrate your Azure account with Palette.

## Prerequisites

* A [Palette Account](https://console.spectrocloud.com/)

* An active [Azure cloud account](https://portal.azure.com/) with sufficient resource limits and permissions to provision compute, network, and security resources in the desired regions.

* An [Azure App](https://learn.microsoft.com/en-us/azure/app-service/overview) with valid credentials.

## Enable Azure Cloud Account Registration to Palette 

To register an Azure cloud account in the Palette console

1. Log in to [Palette](https://console.spectrocloud.com).


2.  Navigate to the **Project Overview** drop-down and switch to the **Tenant Admin**. 


3.  Select **Tenant Settings** from the left **Main Menu**. 


4. From the Tenant Settings go to **Cloud Accounts** and click on **+ Add Azure Account**.


5. The Azure cloud account wizard requires the following information:

|   **Basic Information** |Description|
|-------------------------|-----------|
|Account Name| A custom account name|
|Client ID| Unique client Id from Azure console|
|Tenant ID| Unique tenant Id from Azure console|
|[Client Secret](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#create-an-azure-active-directory-application)| Azure secret for authentication|
|Tenant Name| An optional tenant name|
|[Disable Properties](/clusters/public-cloud/azure/azure-cloud#disableproperties)| To disable the import of Azure networking details.|
|Toggle **Connect Private Cloud Gateway**| An option to select the [Self-Hosted PCG](/clusters/public-cloud/azure/gateways#overview) already created from the drop-down menu to link it to the cloud account. |

<InfoBox>

  For existing cloud accounts go to **Edit** and toggle the **Connect Private Cloud Gateway** option to select the created Gateway from the drop-down menu.
</InfoBox>


6. Click on the **Confirm** button to complete the wizard.


### Disable Properties  

When the above information is provided to the cloud account creation wizard, Azure networking details will be sent to Palette console, which you can disable. To disable network calls from the Palette console to the Azure account, you can click **Disable Properties**.  

For this, we first need to create an Azure Active Directory (AAD) Application which can be used with role-based access control. Follow the steps below to create a new AAD application, assign roles, and create the client secret:


1. Follow the steps described [here](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#create-an-azure-active-directory-application) to create a new Azure Active Directory application. Note down your ClientID and TenantID.


2. On creating the application, a minimum required [ContributorRole](https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#contributor) needs to be assigned. To assign any kind of role, the user must have a minimum role of [UserAccessAdministrator](https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#user-access-administrator). The role can be assigned by following the [Assign Role To Application](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#assign-a-role-to-the-application) link.


3. Follow the steps described in the [Create an Application Secret](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#create-a-new-application-secret) section to create the client application secret. Store the Client Secret safely as it will not be available as plain text later.

<br />

# Validate

To validate the Azure Cloud account creation in Palette console:

1. Log in to [Palette](https://console.spectrocloud.com).


2.  Navigate to the **Project Overview** drop-down and switch to the **Tenant Admin**. 


3.  Select **Tenant Settings** from the left **Main Menu**. 


4. From the Tenant Settings go to **Cloud Accounts**


5. Below the label **Azure**, the available Azure cloud accounts are listed.

<br />

# Manage Azure Account
After an Azure cloud account has been registered with Palette, you can change the integration settings or remove the Azure account with **Edit and Delete** capabilities respectively.

## Edit the Azure Cloud Account

To edit the Azure Cloud account created in Palette console:

1. Log in to [Palette](https://console.spectrocloud.com).


2.  Navigate to the **Project Overview** drop-down and switch to the **Tenant Admin**. 


3.  Select **Tenant Settings** from the left **Main Menu**. 


4. From the Tenant Settings go to **Cloud Accounts**


5. Towards the name of the cloud account to be delete, click the **3 dots** kebab menu and select **Edit**.


6. Make the required changes and click on the **Confirm** button to complete the wizard.

<br />

## Delete the Azure Cloud Account

To delete the Azure Cloud account created in Palette console:

1. Log in to [Palette](https://console.spectrocloud.com).


2.  Navigate to the **Project Overview** drop-down and switch to the **Tenant Admin**. 


3.  Select **Tenant Settings** from the left **Main Menu**. 


4. From the Tenant Settings go to **Cloud Accounts**


5. Towards the name of the cloud account to be delete, click the **3 dots** kebab menu and select **Edit**.


6. Towards the name of the cloud account to be delete, click the **3 dots** kebab menu and select **Delete**.


