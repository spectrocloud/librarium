---
sidebar_label: "Set up Palette"
title: "Set up Palette with Azure"
description: "Learn how to set up Palette with Azure."
icon: ""
hide_table_of_contents: false
sidebar_position: 10
tags: ["getting-started", "azure", "tutorial"]
---

In this guide, you will learn how to set up Palette for use with your Azure cloud account. These steps are required in
order to authenticate Palette and allow it to deploy host clusters. The concepts you learn about in the Getting Started
section are centered around a fictional case study company, Spacetastic Ltd.

## 🧑‍🚀 Back at Spacetastic HQ

<PartialsComponent category="getting-started" name="spacetastic-setup-intro" />

## Prerequisites

- A Palette account with [tenant admin](../../../../tenant-settings/tenant-settings.md) access.

- Sign up to a public cloud account from
  [Azure](https://learn.microsoft.com/en-us/training/modules/create-an-azure-account). The Azure cloud account must have
  the [required permissions](../../../../clusters/public-cloud/azure/required-permissions.md).

- Access to a terminal window.

- The utility `ssh-keygen` or similar SSH key generator software.

## Enablement

Palette needs access to your Azure cloud account in order to create and manage Azure clusters and resources.

### Add Azure Cloud Account

Take the following steps to add an Azure cloud account in Palette or Palette VerteX.

1. Log in to [Palette](https://console.spectrocloud.com) or Palette VerteX as a tenant admin.

2. From the left main menu, select **Tenant Settings**.

3. From the **Tenant Settings Menu**, select **Cloud Accounts**.

4. Locate **Azure** and select **Add Azure Account**.

5. Fill out the following information, and select **Confirm** to complete the registration.

   | **Basic Information**             | **Description**                                                                                                                                                                                                                                                                                                                            |
   | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | **Account Name**                  | Enter a custom account name.                                                                                                                                                                                                                                                                                                               |
   | **Cloud**                         | Choose **Azure Public Cloud** or **Azure US Government**. The option **Azure US Secret** is available for Palette VerteX only and requires additional prerequisites. Refer to our [Register and Manage Azure Cloud Accounts](../../../../clusters/public-cloud/azure/azure-cloud.md) guide for details.                                    |
   | **Tenant ID**                     | Enter the unique directory (tenant) ID of your Azure subscription. This is found in the [Microsoft Entra admin center](https://entra.microsoft.com).                                                                                                                                                                                       |
   | **Client ID**                     | Enter the unique application (client) ID of your Azure application. This is found in the [Microsoft Entra admin center](https://entra.microsoft.com).                                                                                                                                                                                      |
   | **Client Secret**                 | Enter the secret value associated with your Azure application (client). Refer to Microsoft's reference guide for creating a [Client Secret](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#create-an-azure-active-directory-application).                                           |
   | **Tenant Name (Optional)**        | (Optional) Enter the name of your Azure tenant, if desired.                                                                                                                                                                                                                                                                                |
   | **User Certificate**              | (Azure Government Secret only) Paste the combined TLS certificate chain from Azure Government Secret cloud and your private registry.                                                                                                                                                                                                      |
   | **Disable Properties**            | Prevent Palette or Palette VerteX from creating Azure Virtual Networks (VNets) and other network resources on your behalf for static placement deployments. If you enable this option, you must manually specify pre-existing VNets, subnets, and security groups when creating clusters.                                                  |
   | **Connect Private Cloud Gateway** | Select this option to deploy clusters to Azure Commercial cloud through a [Private Cloud Gateway (PCG)](../../../../clusters/pcg/architecture.md). The PCG must be deployed and registered with Palette or Palette VerteX in order to select it from the drop-down. A PCG is required to deploy clusters in Azure Government Secret cloud. |

6. After providing the required values, **Validate** the combination of your **Tenant ID**, **Client ID**, and **Client
   Secret**. If the provided values are correct, the message **Credentials validated** is displayed. You cannot register
   your account until your credentials are validated.

7. Once your cloud credentials are validated, select **Confirm** to register your Azure Commercial cloud with Palette or
   Palette VerteX.

### Create and Upload an SSH Key

Follow the steps below to create an SSH key using the terminal and upload it to Palette. This step is not required for
the [Cluster Management with Terraform](./deploy-manage-k8s-cluster-tf.md) tutorial.

:::warning

Only RSA SSH keys are supported when deploying [Azure AKS clusters](../../../../clusters/public-cloud/azure/aks.md).

:::

<PartialsComponent category="palette-setup" name="generate-ssh-key" />

### Create a Palette API Key

Follow the steps below to create a Palette API key. This is required for the
[Cluster Management with Terraform](./deploy-manage-k8s-cluster-tf.md) tutorial.

<PartialsComponent category="palette-setup" name="create-tenant-api-key" />

## Validate

You can verify your account is added.

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, select **Tenant Settings**.

3. Next, on the **Tenant Settings Menu**, select **Cloud Accounts**.

4. The added cloud account is listed under **Azure** with all other available Azure cloud accounts.

## Next Steps

Now that you set up Palette for use with Azure, you can start deploying Kubernetes clusters to your Azure account. To
learn how to get started with deploying Kubernetes clusters to Azure, we recommend that you continue to the
[Create a Cluster Profile](./create-cluster-profile.md) tutorial to create a full cluster profile for your host cluster.

## 🧑‍🚀 Catch up with Spacetastic

<PartialsComponent category="getting-started" name="spacetastic-setup-end" />
