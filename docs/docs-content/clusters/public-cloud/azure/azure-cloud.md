---
sidebar_label: "Register and Manage Azure Cloud Accounts"
title: "Register and Manage Azure Cloud Accounts"
description: "This guide will help you register and manage an Azure cloud account in Palette"
hide_table_of_contents: false
tags: ["public cloud", "azure"]
toc_max_heading_level: 4
sidebar_position: 10
---

Palette and Palette VerteX integrate with multiple Azure environments to support diverse organizational needs, ranging
from standard commercial deployments to highly regulated government workloads. Before deploying clusters, you must
register your Azure cloud account so Palette or Palette VerteX can authenticate, provision, and manage resources on your
behalf.

The following table summarizes which Azure clouds are supported by Palette or Palette VerteX.

| **Azure Cloud**                                                                                                                     | **Palette Support** | **Palette VerteX Support** |
| ----------------------------------------------------------------------------------------------------------------------------------- | :-----------------: | :------------------------: |
| Azure Commercial (Public Cloud)                                                                                                     | :white_check_mark:  |     :white_check_mark:     |
| [Azure Government](https://azure.microsoft.com/en-us/explore/global-infrastructure/government)                                      | :white_check_mark:  |     :white_check_mark:     |
| <TpBadge /> [Azure Government Secret](https://azure.microsoft.com/en-us/explore/global-infrastructure/government/national-security) |         :x:         |     :white_check_mark:     |

## Add Azure Cloud Account

Use the procedures in this section to add the appropriate Azure cloud account to your Palette or Palette VerteX
environment. Once registered, you can deploy clusters in your chosen Azure cloud.

### Azure Commercial Cloud

Azure Commercial, also known as Azure Public Cloud, is the default option for most clusters deployed in Azure cloud.
Adding your Azure Commercial account to Palette or Palette VerteX allows you to provision, manage, and scale clusters
across a wide range of global regions with standard Azure services. This section discusses how to register your Azure
Commercial account in Palette or Palette VerteX.

#### Prerequisites

- A Palette or Palette VerteX instance with tenant admin access.

- An active [Azure cloud account](https://portal.azure.com/) with sufficient resource limits and permissions to
  provision compute, network, and security resources in the desired clouds and regions. Refer to our Azure
  [Required Permissions](./required-permissions.md) guide for more information.

- An [Azure App](https://learn.microsoft.com/en-us/azure/app-service/overview) with valid credentials.

#### Enablement

Take the following steps to add an Azure Commercial cloud account in Palette or Palette VerteX.

1. Log in to [Palette](https://console.spectrocloud.com) or Palette VerteX as a tenant admin.

2. From the left main menu, select **Tenant Settings**.

3. From the **Tenant Settings Menu**, select **Cloud Accounts**.

4. Locate **Azure** and select **Add Azure Account**.

5. Fill out the following information, and select **Confirm** to complete the registration.

   | **Basic Information**             | **Description**                                                                                                                                                                                                                                                                                  |
   | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | **Account Name**                  | Enter a custom account name.                                                                                                                                                                                                                                                                     |
   | **Cloud**                         | Select **Azure Public Cloud**.                                                                                                                                                                                                                                                                   |
   | **Tenant ID**                     | Enter the unique directory (tenant) ID of your Azure subscription. This is found in the [Microsoft Entra admin center](https://entra.microsoft.com).                                                                                                                                             |
   | **Client ID**                     | Enter the unique application (client) ID of your Azure application. This is found in the [Microsoft Entra admin center](https://entra.microsoft.com).                                                                                                                                            |
   | **Client Secret**                 | Enter the secret value associated with your Azure application (client). Refer to Microsoft's reference guide for creating a [Client Secret](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#create-an-azure-active-directory-application). |
   | **Tenant Name (Optional)**        | (Optional) Enter the name of your Azure tenant, if desired.                                                                                                                                                                                                                                      |
   | **Disable Properties**            | Prevent Palette or Palette VerteX from creating Azure Virtual Networks (VNets) and other network resources on your behalf for static placement deployments. If you enable this option, you must manually specify pre-existing VNets, subnets, and security groups when creating clusters.        |
   | **Connect Private Cloud Gateway** | Select this option to deploy clusters to Azure Commercial cloud through a [Private Cloud Gateway (PCG)](../../pcg/architecture.md). The PCG must be deployed and registered with Palette or Palette VerteX in order to select it from the drop-down.                                             |

6. After providing the required values, **Validate** the combination of your **Tenant ID**, **Client ID**, and **Client
   Secret**. If the provided values are correct, the message **Credentials validated** is displayed. You cannot register
   your account until your credentials are validated.

7. Once your cloud credentials are validated, select **Confirm** to register your Azure Commercial cloud with Palette or
   Palette VerteX.

### Azure Government Cloud

[Azure Government](https://azure.microsoft.com/en-us/explore/global-infrastructure/government) is a specialized cloud
designed for U.S. government agencies and their partners, offering compliance with strict security and regulatory
requirements. By adding your Azure Government account to Palette or Palette VerteX, you can deploy and manage clusters
in environments that meet FedRAMP and other compliance standards. This section explains how to set up and register your
Azure Government account to enable secure cluster operations.

#### Prerequisites

- A Palette or Palette VerteX instance with tenant admin access.

- (Self-hosted Palette and Palette VerteX only) A [PCG](../../pcg/architecture.md) set up and registered with Palette or
  Palette VerteX if you plan to register both an Azure Commercial and Azure Government account on the same installation.
  If you do not configure a PCG, you must install two instances of Palette or Palette VerteX: one for Azure Commercial
  clusters and one for Azure Government clusters.

- An active [Azure cloud account](https://portal.azure.com/) with sufficient resource limits and permissions to
  provision compute, network, and security resources in the desired clouds and regions. Refer to our Azure
  [Required Permissions](./required-permissions.md) guide for more information.

- An [Azure App](https://learn.microsoft.com/en-us/azure/app-service/overview) with valid credentials.

#### Enablement

Take the following steps to add an Azure Commercial cloud account in Palette or Palette VerteX.

1. Log in to [Palette](https://console.spectrocloud.com) or Palette VerteX as a tenant admin.

2. From the left main menu, select **Tenant Settings**.

3. From the **Tenant Settings Menu**, select **Cloud Accounts**.

4. Locate **Azure** and select **Add Azure Account**.

5. Fill out the following information, and select **Confirm** to complete the registration.

   | **Basic Information**             | **Description**                                                                                                                                                                                                                                                                                  |
   | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | **Account Name**                  | Enter a custom account name.                                                                                                                                                                                                                                                                     |
   | **Cloud**                         | Select **Azure US Government**.                                                                                                                                                                                                                                                                  |
   | **Tenant ID**                     | Enter the unique directory (tenant) ID of your Azure subscription. This is found in the [Microsoft Entra admin center](https://entra.microsoft.com).                                                                                                                                             |
   | **Client ID**                     | Enter the unique application (client) ID of your Azure application. This is found in the [Microsoft Entra admin center](https://entra.microsoft.com).                                                                                                                                            |
   | **Client Secret**                 | Enter the secret value associated with your Azure application (client). Refer to Microsoft's reference guide for creating a [Client Secret](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#create-an-azure-active-directory-application). |
   | **Tenant Name (Optional)**        | (Optional) Enter the name of your Azure tenant, if desired.                                                                                                                                                                                                                                      |
   | **Disable Properties**            | Prevent Palette or Palette VerteX from creating Azure VNets and other network resources on your behalf for static placement deployments. If you enable this option, you must manually specify pre-existing VNets, subnets, and security groups when creating clusters.                           |
   | **Connect Private Cloud Gateway** | Select this option to deploy clusters to Azure Government cloud through a [PCG](../../pcg/architecture.md). The PCG must be deployed and registered with Palette or Palette VerteX in order to select it from the drop-down.                                                                     |

6. After providing the required values, **Validate** the combination of your **Tenant ID**, **Client ID**, and **Client
   Secret**. If the provided values are correct, the message **Credentials validated** is displayed. You cannot register
   your account until your credentials are validated.

7. Once your cloud credentials are validated, select **Confirm** to register your Azure Government cloud with Palette or
   Palette VerteX.

### Azure Government Secret Cloud

[Azure Government Secret](https://azure.microsoft.com/en-us/explore/global-infrastructure/government/national-security)
is a highly restricted cloud environment designed for workloads that require classified data handling. Palette VerteX
supports cluster deployments in Azure Government Secret cloud, providing flexibility for organizations that need to meet
stringent security requirements. This section explains how to register an Azure Government Secret account with Palette
VerteX.

:::preview

:::

#### Limitations

- You must use Palette VerteX to deploy clusters in Azure Government Secret cloud. Multi-tenant Palette SaaS and
  self-hosted Palette instances do not support Azure Government Secret cloud.

- Only [Azure IaaS clusters](./create-azure-cluster.md) can be deployed in Azure Government Secret cloud. AKS clusters
  are not supported.

- Clusters deployed in Azure Government Secret cloud must use
  [static placement](./create-azure-cluster.md#static-placement-settings) and a
  [private API server load balancer](./create-azure-cluster.md#private-api-server-lb-settings) with a static IP. As a
  result, a [PCG](../../pcg/pcg.md) must be set up and registered with Palette VerteX in order to deploy clusters. The
  PCG must have a connection to Azure Government Secret cloud.

- <PartialsComponent category="azure" name="azure-secret-os-layer" />

#### Prerequisites

- A Palette VerteX instance with tenant admin access.

- The **AzureUsSecretCloud** [feature flag](../../../vertex/system-management/feature-flags.md) enabled.

- A [PCG](../../pcg/pcg.md) set up and registered with Palette VerteX. The PCG must have a connection to Azure
  Government Secret cloud.

- An active [Azure cloud account](https://portal.azure.com/) with sufficient resource limits and permissions to
  provision compute, network, and security resources in the desired clouds and regions. Refer to our Azure
  [Required Permissions](./required-permissions.md#iaas-static-placement) guide for more information.

- An [Azure App](https://learn.microsoft.com/en-us/azure/app-service/overview) with valid credentials.

#### Enablement

Take the following steps to add an Azure Government Secret cloud account in Palette VerteX.

1. Log in to Palette VerteX as a tenant admin.

2. From the left main menu, select **Tenant Settings**.

3. From the **Tenant Settings Menu**, select **Cloud Accounts**.

4. Locate **Azure** and select **Add Azure Account**.

5. Fill out the following information, and select **Confirm** to complete the registration.

   | **Basic Information**             | **Description**                                                                                                                                                                                                                                                                                  |
   | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | **Account Name**                  | Enter a custom account name.                                                                                                                                                                                                                                                                     |
   | **Cloud**                         | Select **Azure US Secret**.                                                                                                                                                                                                                                                                      |
   | **Tenant ID**                     | Enter the unique directory (tenant) ID of your Azure subscription. This is found in the [Microsoft Entra admin center](https://entra.microsoft.com).                                                                                                                                             |
   | **Client ID**                     | Enter the unique application (client) ID of your Azure application. This is found in the [Microsoft Entra admin center](https://entra.microsoft.com).                                                                                                                                            |
   | **Client Secret**                 | Enter the secret value associated with your Azure application (client). Refer to Microsoft's reference guide for creating a [Client Secret](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#create-an-azure-active-directory-application). |
   | **Tenant Name (Optional)**        | (Optional) Enter the name of your Azure tenant, if desired.                                                                                                                                                                                                                                      |
   | **User Certificate**              | Paste the combined TLS certificate chain from Azure Government Secret cloud and your private registry.                                                                                                                                                                                           |
   | **Disable Properties**            | Prevent Palette VerteX from creating Azure VNets and other network resources on your behalf for static placement deployments. If you enable this option, you must manually specify pre-existing VNets, subnets, and security groups when creating clusters.                                      |
   | **Connect Private Cloud Gateway** | Select this option to deploy clusters to Azure Commercial cloud through a [PCG](../../pcg/architecture.md). The PCG must be deployed and registered with Palette VerteX in order to select it from the drop-down. A PCG is required to deploy clusters in Azure Government Secret cloud.         |

6. After providing the required values, **Validate** the combination of your **Tenant ID**, **Client ID**, and **Client
   Secret**. If the provided values are correct, the message **Credentials validated** is displayed. You cannot register
   your account until your credentials are validated.

7. Once your cloud credentials are validated, select **Confirm** to register your Azure Government Secret cloud with
   Palette VerteX.

## Validate

Use the following procedure to verify that your Azure cloud account has been added in Palette or Palette VerteX.

1. Log in to [Palette](https://console.spectrocloud.com) or Palette VerteX as a tenant admin.

2. From the left main menu, select **Tenant Settings**.

3. From the **Tenant Settings Menu**, select **Cloud Accounts**.

4. Confirm that the applicable Azure cloud account is listed in the **Azure** section.

## Next Steps

After you have added your Azure cloud account to Palette or Palette VerteX, you can start deploying an Azure IaaS
cluster by following the [Create and Manage IaaS Cluster](./create-azure-cluster.md) guide, or if you prefer an Azure
Managed Kubernetes Service (AKS) cluster, refer to the [Create and Manage Azure AKS Cluster](./azure.md) guide. We also
encourage you to check out the [Getting Started](../../../tutorials/getting-started/palette/azure/azure.md) tutorials
for further guidance on the cluster creation process.
