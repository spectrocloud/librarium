---
sidebar_label: "Register and Manage Azure Cloud Account"
title: "Register and Manage Azure Cloud Account"
description: "This guide will help you register and manage an Azure cloud account in Palette"
hide_table_of_contents: false
tags: ["public cloud", "azure"]
sidebar_position: 10
---

Palette supports deploying and managing Kubernetes clusters in an Azure account. This section guides you on how to create a Kubernetes cluster in Azure that Palette manages.

## Prerequisites

* A [Palette Account](https://console.spectrocloud.com/).

* An active [Azure cloud account](https://portal.azure.com/) with sufficient resource limits and permissions to provision compute, network, and security resources in the desired regions.

* An [Azure App](https://learn.microsoft.com/en-us/azure/app-service/overview) with valid credentials.

## Enable Azure Cloud Account Registration to Palette 

To register an Azure cloud account in the Palette console

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. From the left **Main Menu**, select **Tenant Settings**. 

3. Select **Cloud Accounts** in the Tenant Settings menu 

4. Locate **Azure**, and click **+ Add Azure Account**.

5. Fill out the following information:

|   **Basic Information** |**Description**|
|-------------------------|-----------|
|Account Name| A custom account name.|
|Client ID| Unique client ID from Azure Management Portal.|
|Tenant ID| Unique tenant ID from Azure Management Portal.|
|Client Secret| Azure secret for authentication. Refer to Microsoft's reference guide for creating a [Client Secret](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#create-an-azure-active-directory-application) |
|Tenant Name| An optional tenant name.|
|Disable Properties| This option disables importing Azure networking details. To learn more, refer to the [Disable Properties](/clusters/public-cloud/azure/azure-cloud#disableproperties) section. |
|Private Cloud Gateway| If you will be launching Managed Kubernetes Service (AKS), use the **drop-down Menu** to select a [self-hosted PCG](gateways.md) that you created to link it to the cloud account.|

:::info

  For existing cloud accounts, select the account and click **Edit**. Toggle the **Connect Private Cloud Gateway** option to select the created PCG from the **drop-down Menu**.
:::


6. Click **Confirm** to complete the registration.


### Disable Properties  

When you provide your cloud account information, Azure networking details are sent to Palette unless you disable network calls from Palette to the Azure account. To disable network calls, select the **Disable Properties** option.  

For this, we first need to create an Azure Active Directory (AAD) Application which can be used with role-based access control. Follow the steps below to create a new AAD application, assign roles, and create the client secret:


1. Follow the steps described [here](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#create-an-azure-active-directory-application) to create a new Azure Active Directory application. Note down your ClientID and TenantID.


2. On creating the application, a minimum required [ContributorRole](https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#contributor) needs to be assigned. To assign any kind of role, the user must have a minimum role of [UserAccessAdministrator](https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#user-access-administrator). The role can be assigned by following the [Assign Role To Application](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#assign-a-role-to-the-application) link.


3. Follow the steps described in the [Create an Application Secret](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#create-a-new-application-secret) section to create the client application secret. Store the Client Secret safely as it will not be available as plain text later.


## Validate

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. From the left **Main Menu**, select **Tenant Settings**. 

3. Next, on the **Tenant Settings Menu**, select **Cloud Accounts**.

4. The added cloud account is listed under **Azure** with all other available Azure cloud accounts. 


## Manage Azure Accounts
After an Azure cloud account has been registered with Palette, you can change the integration settings or remove the Azure account with **Edit and Delete** capabilities respectively.

### Edit an Azure Account

Use the following steps to edit Azure Cloud account information in Palette.

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. From the left **Main Menu**, select **Tenant Settings**.

3. Next, on the **Tenant Settings Menu**, select **Cloud Accounts**.

4. Click the **three-dot Menu** in the row of the cloud account you want to edit and select **Edit**.

5. Make the required changes and click **Confirm**.


### Remove an Azure Account

Use the following steps to delete an Azure cloud account from Palette.

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. From the left **Main Menu**, select **Tenant Settings**.

3. Next, on the **Tenant Settings Menu**, select **Cloud Accounts**.

4. Click the **three-dot Menu** in the row of the cloud account you want to delete and select **Delete**.



