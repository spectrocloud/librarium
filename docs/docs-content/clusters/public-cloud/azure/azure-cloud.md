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

5. Fill out the following information, and click **Confirm** to complete the registration.

|   **Basic Information** |**Description**|
|-------------------------|-----------|
|**Account Name**| A custom account name.|
|**Tenant ID**| Unique tenant ID from Azure Management Portal.|
|**Client ID**| Unique client ID from Azure Management Portal.|
|**Client Secret**| Azure secret for authentication. Refer to Microsoft's reference guide for creating a [Client Secret](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#create-an-azure-active-directory-application) |
|**Tenant Name**| An optional tenant name.|
|**Disable Properties**| This option disables importing Azure networking details. Disabling this option requires you to create a Microsoft Entra application and manually obtain account information. To learn more, refer to the [Disable Properties](/clusters/public-cloud/azure/azure-cloud#disableproperties) section. |
|**Connect Private Cloud Gateway**| If you will be launching Managed Kubernetes Service (AKS), use the **drop-down Menu** to select a [self-hosted PCG](gateways.md) that you created to link it to the cloud account.|


### Disable Properties  

When you provide your cloud account information, Azure networking details will be sent to Palette unless you disable network calls from Palette to the account. To disable network calls, select the **Disable Properties** option.  

When you disable network calls with the **Disable Properties** option, you need to create a Microsoft Entra application which can be used with role-based access control. Follow the steps below to create a new Microsoft Entra application, assign roles, and create the client secret. 

:::info

Microsoft Entra replaces the Azure Active Directory (AAD) application. For more information, review the [Microsoft Entra](https://learn.microsoft.com/en-us/entra/identity-platform/howto-create-service-principal-portal#create-an-azure-active-directory-application) reference guide.

:::


1. Create a new Microsoft Entra application and note down your ClientID and TenantID. Refer to the [Create a Microsoft Entra application and service principal](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#create-an-azure-active-directory-application) reference guide.

2. Next, assign yourself the [UserAccessAdministrator](https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#user-access-administrator) role to allow you to manage user access to Azure resources. For guidance, refer to [Assign Role To Application](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#assign-a-role-to-the-application).

3. With UserAccessAdministrator privelege, you can now assign yourself the minimum required [ContributorRole](https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#contributor), which grants full access to manage all resources.

  To learn about Azure roles, review [Azure Roles, Microsoft Entra Roles, and Administrator Roles](https://learn.microsoft.com/en-us/azure/role-based-access-control/rbac-and-directory-admin-roles).

<!-- you will need a minimum required [ContributorRole](https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#contributor) needs to be assigned. To assign any kind of role, the user must have a minimum role of [UserAccessAdministrator](https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#user-access-administrator). The role can be assigned by following the [Assign Role To Application](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#assign-a-role-to-the-application) link. -->


4. Create a client secret. Refer to [Create a Client Secret](https://learn.microsoft.com/en-us/entra/identity-platform/howto-create-service-principal-portal#option-3-create-a-new-client-secret) for guidance.

  :::caution

  Be sure to safely store the client secret, as it will not be available later as plain text.

  :::


<!-- (https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#create-a-new-application-secret) . Store the Client Secret safely as it will not be available as plain text later. -->


## Validate

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. From the left **Main Menu**, select **Tenant Settings**. 

3. Next, on the **Tenant Settings Menu**, select **Cloud Accounts**.

4. The added cloud account is listed under **Azure** with all other available Azure cloud accounts. 


## Manage Azure Accounts

You can change the integration settings in your registered Azure account or remove the account.

### Edit an Azure Account

Use the following steps to edit Azure account information in Palette.

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



