---
sidebar_label: "Register and Manage Azure Cloud Account"
title: "Register and Manage Azure Cloud Account"
description: "This guide will help you register and manage an Azure cloud account in Palette"
hide_table_of_contents: false
tags: ["public cloud", "azure"]
sidebar_position: 10
---

Palette supports integration with Azure cloud accounts. This section explains how to create an Azure cloud account in
Palette. You can use any of the following authentication methods to register your cloud account.

## Prerequisites

- A [Palette Account](https://console.spectrocloud.com/).

* An active [Azure cloud account](https://portal.azure.com/) with sufficient resource limits and permissions to
  provision compute, network, and security resources in the desired regions. Refer to the
  [Required Permissions](./required-permissions.md) section for more information.

- An [Azure App](https://learn.microsoft.com/en-us/azure/app-service/overview) with valid credentials.

## Add Azure Cloud Account

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. From the left **Main Menu**, select **Tenant Settings**.

3. Next, select **Cloud Accounts** in the **Tenant Settings Menu**.

4. Locate **Azure**, and click **+ Add Azure Account**.

5. Fill out the following information, and click **Confirm** to complete the registration.

| **Basic Information**             | **Description**                                                                                                                                                                                                                                                                                        |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Account Name**                  | A custom account name.                                                                                                                                                                                                                                                                                 |
| **Tenant ID**                     | Unique tenant ID from Azure Management Portal.                                                                                                                                                                                                                                                         |
| **Client ID**                     | Unique client ID from Azure Management Portal.                                                                                                                                                                                                                                                         |
| **Client Secret**                 | Azure secret for authentication. Refer to Microsoft's reference guide for creating a [Client Secret](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#create-an-azure-active-directory-application).                                              |
| **Cloud**                         | Select **Azure Public Cloud** or **Azure US Government**.                                                                                                                                                                                                                                              |
| **Tenant Name**                   | An optional tenant name.                                                                                                                                                                                                                                                                               |
| **Disable Properties**            | This option prevents Palette and VerteX from creating Azure Virtual Networks (VNets) and other network resources on your behalf for static placement deployments. If you enable this option, all users must manually specify a pre-existing VNet, subnets, and security groups when creating clusters. |
| **Connect Private Cloud Gateway** | Select this option to connect to a Private Cloud Gateway (PCG) if you have a PCG deployed in your environment. Refer to the PCG [Architecture](../../pcg/architecture.md) page to learn more about a PCG.                                                                                              |

## Validate

You can verify your account is added.

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, select **Tenant Settings**.

3. Next, on the **Tenant Settings Menu**, select **Cloud Accounts**.

4. The added cloud account is listed under **Azure** with all other available Azure cloud accounts.

:::tip

Use the **three-dot Menu** in the row of the cloud account to edit Azure account information in Palette or remove the
account from Palette.

:::
