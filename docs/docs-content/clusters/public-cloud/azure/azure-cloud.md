---
sidebar_label: "Register and Manage Azure Cloud Accounts"
title: "Register and Manage Azure Cloud Accounts"
description: "This guide will help you register and manage an Azure cloud account in Palette"
hide_table_of_contents: false
tags: ["public cloud", "azure"]
sidebar_position: 10
---

Palette and Palette VerteX support deploying clusters to the following Azure clouds.

| **Azure Cloud**                                                                                                                     | **Palette Support** | **Palette VerteX Support** |
| ----------------------------------------------------------------------------------------------------------------------------------- | :-----------------: | :------------------------: |
| Azure Commercial (Public Cloud)                                                                                                     | :white_check_mark:  |     :white_check_mark:     |
| [Azure Government](https://azure.microsoft.com/en-us/explore/global-infrastructure/government)                                      | :white_check_mark:  |     :white_check_mark:     |
| <TpBadge /> [Azure Government Secret](https://azure.microsoft.com/en-us/explore/global-infrastructure/government/national-security) |         :x:         |     :white_check_mark:     |

This section explains how to add the appropriate Azure cloud account in Palette or Palette VerteX.

## Add Azure Commercial Cloud Account

[intro here]

### Prerequisites

- A Palette or Palette VerteX instance with tenant admin access.

- An active [Azure cloud account](https://portal.azure.com/) with sufficient resource limits and permissions to
  provision compute, network, and security resources in the desired clouds and regions. Refer to our Azure
  [Required Permissions](./required-permissions.md) guide for more information.

- An [Azure App](https://learn.microsoft.com/en-us/azure/app-service/overview) with valid credentials.

### Enablement

<PartialsComponent
  category="palette-setup"
  name="azure-cloud-account"
  cloud_account_spectro="Azure Public Cloud"
  cloud_account_actual="Azure Commercial"
  edition="Palette or Palette VerteX"
/>

<PartialsComponent category="azure" name="azure-cloud-account-validate" edition="Palette or Palette VerteX" />

## Add Azure Government Cloud Account

[intro here]

### Prerequisites

- A Palette or Palette VerteX instance with tenant admin access.

- (Self-hosted Palette and Palette VerteX only) A Private Cloud Gateway (PCG) set up and registered with Palette or
  Palette VerteX if you plan to register both an Azure Commercial and Azure Government account on the same installation.
  If you do not configure a PCG, you must install two instances of Palette or Palette VerteX: one for Azure Commercial
  clusters and one for Azure Government clusters.

- An active [Azure cloud account](https://portal.azure.com/) with sufficient resource limits and permissions to
  provision compute, network, and security resources in the desired clouds and regions. Refer to our Azure
  [Required Permissions](./required-permissions.md) guide for more information.

- An [Azure App](https://learn.microsoft.com/en-us/azure/app-service/overview) with valid credentials.

### Enablement

<PartialsComponent
  category="palette-setup"
  name="azure-cloud-account"
  cloud_account_spectro="Azure US Government"
  cloud_account_actual="Azure Government"
  edition="Palette or Palette VerteX"
/>

### Validate

<PartialsComponent category="azure" name="azure-cloud-account-validate" edition="Palette or Palette VerteX" />

## Add Azure Government Secret Cloud Account

[intro here]

:::preview

:::

### Limitations

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

### Prerequisites

- A Palette VerteX instance with tenant admin access.

- The **AzureUsSecretCloud** [feature flag](../../../vertex/system-management/feature-flags.md) enabled.

- A [PCG](../../pcg/pcg.md) set up and registered with Palette VerteX. The PCG must have a connection to Azure
  Government Secret cloud.

- An active [Azure cloud account](https://portal.azure.com/) with sufficient resource limits and permissions to
  provision compute, network, and security resources in the desired clouds and regions. Refer to our Azure
  [Required Permissions](./required-permissions.md#iaas-static-placement) guide for more information.

- An [Azure App](https://learn.microsoft.com/en-us/azure/app-service/overview) with valid credentials.

### Enablement

<PartialsComponent
  category="palette-setup"
  name="azure-cloud-account"
  cloud_account_spectro="Azure US Secret"
  cloud_account_actual="Azure Government Secret"
  secret="A PCG is required for deploying clusters in Azure Government Secret cloud."
  edition="Palette VerteX"
/>

### Validate

<PartialsComponent category="azure" name="azure-cloud-account-validate" edition="Palette VerteX" />

## Edit Azure Cloud Account

Use the following procedure to modify the details of your Azure cloud account .

1. Log in to [Palette](https://console.spectrocloud.com) or Palette VerteX as a tenant admin.

2. From the left main menu, select **Tenant Settings**.

3. From the **Tenant Settings Menu**, select **Cloud Accounts**.

4. In the **Azure** section, locate the cloud account to edit. From the three-dot menu, select **Edit**.

5. Modify your cloud account details as necessary. **Validate** your credentials, and **Confirm** your changes.

### Validate

## Delete Azure Cloud Account

Use the following procedure to remove your Azure cloud account from Palette or Palette VerteX.

1. Log in to [Palette](https://console.spectrocloud.com) or Palette VerteX as a tenant admin.

2. From the left main menu, select **Tenant Settings**.

3. From the **Tenant Settings Menu**, select **Cloud Accounts**.

4. In the **Azure** section, locate the cloud account to remove. From the three-dot menu, select **Delete**.

5. A dialog prompts you to proceed with deleting you account. Select **OK** to proceed. Your Azure cloud account no
   longer appears in the **Azure** section.

### Validate

## Next Steps

After you have added your Azure cloud account to Palette or Palette VerteX, you can start deploying an Azure IaaS
cluster by following the [Create and Manage IaaS Cluster](./create-azure-cluster.md) guide, or if you prefer an Azure
Managed Kubernetes Service (AKS) cluster, refer to the [Create and Manage Azure AKS Cluster](./azure.md) guide. We also
encourage you to check out the [Getting Started](../../../tutorials/getting-started/palette/azure/azure.md) tutorials
for further guidance on the cluster creation process.
