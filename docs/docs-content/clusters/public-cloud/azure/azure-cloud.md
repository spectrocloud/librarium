---
sidebar_label: "Register and Manage Azure Cloud Account"
title: "Register and Manage Azure Cloud Account"
description: "This guide will help you register and manage an Azure cloud account in Palette"
hide_table_of_contents: false
tags: ["public cloud", "azure"]
sidebar_position: 10
---


Palette supports integration with Azure and [Azure Government](https://azure.microsoft.com/en-us/explore/global-infrastructure/government) cloud accounts. This section explains how to add an Azure cloud account in Palette or Palette VerteX. You can use any of the following authentication methods to register your cloud account.


## Prerequisites

* A [Palette](https://console.spectrocloud.com/), or VerteX account. 

* An active [Azure cloud account](https://portal.azure.com/) with sufficient resource limits and permissions to provision compute, network, and security resources in the desired regions. Refer to the [Required Permissions](./required-permissions.md) section for more information.

* An [Azure App](https://learn.microsoft.com/en-us/azure/app-service/overview) with valid credentials.




## Add Azure Cloud Account

Use the following steps to add an Azure or Azure Government account in Palette or Palette VerteX.

1. Log in to [Palette](https://console.spectrocloud.com) or Palette VerteX as a tenant admin.

2. From the left **Main Menu**, select **Tenant Settings**. 

3. Next, select **Cloud Accounts** in the **Tenant Settings Menu**. 

4. Locate **Azure**, and click **+ Add Azure Account**.

5. Fill out the following information, and click **Confirm** to complete the registration.

|   **Basic Information** |**Description**|
|-------------------------|-----------|
|**Account Name**| A custom account name.|
|**Tenant ID**| Unique tenant ID from Azure Management Portal.|
|**Client ID**| Unique client ID from Azure Management Portal.|
|**Client Secret**| Azure secret for authentication. Refer to Microsoft's reference guide for creating a [Client Secret](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#create-an-azure-active-directory-application).  |
| **Cloud** | Select **Azure Public Cloud** or **Azure US Government**. |
|**Tenant Name**| An optional tenant name.|
|**Disable Properties**| This option disables the ability for Palette or VerteX to create an Azure Virtual Network (VNET) on your behalf. Static placement deployments will require all users to manually specify a pre-existing VNET during the cluster creation process. |
|**Connect Private Cloud Gateway**| If you will be launching Managed Kubernetes Service (AKS), use the **drop-down Menu** to select a [self-hosted PCG](gateways.md) that you created to link to the cloud account.|

6. After providing the required values, click the **Validate** button. If the client secret you provided is correct, a *Credentials validated* success message with a green check is displayed.

7. Click **Confirm** to complete the registration.


## Validate

You can verify your account is added.

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, select **Tenant Settings**. 

3. Next, on the **Tenant Settings Menu**, select **Cloud Accounts**.

4. The added cloud account is listed under **Azure** with all other available Azure cloud accounts. 


:::tip

Use the **three-dot Menu** in the row of the cloud account to edit Azure account information in Palette or remove the account from Palette.

:::


## Next Steps

After you have added your Azure cloud account to Palette or VerteX, you can start deploying an Azure IaaS cluster by following the  [Create and Manage IaaS Cluster](./create-azure-cluster.md) guide, or if you prefer an Azure Managed Kubernetes Service (AKS) cluster, refer to the [Create and Manage Azure AKS Cluster](./azure.md) guide. We also encourage you to check out the [Deploy a Cluster tutorial](../deploy-k8s-cluster.md) for a detailed walkthrough of the cluster creation process.