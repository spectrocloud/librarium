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

This section explains how to add an Azure cloud account in Palette or Palette VerteX. You can use any of the following
authentication methods to register your cloud account.

## Azure Commercial

[intro here]

### Prerequisites

- A Palette or Palette VerteX instance with tenant admin access.

- An active [Azure cloud account](https://portal.azure.com/) with sufficient resource limits and permissions to
  provision compute, network, and security resources in the desired clouds and regions. Refer to our Azure
  [Required Permissions](./required-permissions.md) guide for more information.

- An [Azure App](https://learn.microsoft.com/en-us/azure/app-service/overview) with valid credentials.

### Enablement

<PartialsComponent category="palette-setup" name="azure-cloud-account" cloud_account="Azure Public Cloud" />

## Azure Government

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

<PartialsComponent category="palette-setup" name="azure-cloud-account" cloud_account="Azure US Government" />

## Azure Government Secret

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

- Clusters deployed in [Azure Government Secret](../../../clusters/public-cloud/azure/azure-cloud.md) cloud must
  reference the appropriate Spectro Cloud Azure Government Secret Virtual Hard Disk (VHD) image in the cluster profile's
  OS layer. The `<os-name-and-version>` and `<kubernetes-version>` referenced in the VHD image must match the OS and
  Kubernetes layers specified in your cluster profile. Only certain OS and Kubernetes combinations are supported.
  Contact our [Customer Support](https://spectrocloud.atlassian.net/servicedesk/customer/portals) team for details.

  ```yaml
  cloud:
    azure:
      sigImageId: "spectrocloudinfra2022/sig-spectrocloud-infra-<os-name-and-version>-<kubernetes-version>"
  ```

### Prerequisites

- A Palette VerteX instance with tenant admin access.

- The **AzureUsSecretCloud** [feature flag](../../../vertex/system-management/feature-flags.md) enabled.

- A [PCG](../../pcg/pcg.md) set up and registered with Palette VerteX. The PCG must have a connection to Azure
  Government Secret cloud.

- An active [Azure cloud account](https://portal.azure.com/) with sufficient resource limits and permissions to
  provision compute, network, and security resources in the desired clouds and regions. Refer to our Azure
  [Required Permissions](./required-permissions.md#static-placement-iaas-static-placement) guide for more information.

- An [Azure App](https://learn.microsoft.com/en-us/azure/app-service/overview) with valid credentials.

### Enablement

<PartialsComponent
  category="palette-setup"
  name="azure-cloud-account"
  cloud_account="Azure US Secret"
  secret="A PCG is required for deploying clusters in Azure Government Secret cloud."
/>

## Validate

You can verify your account is added.

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. From the left main menu, select **Tenant Settings**.

3. Next, on the **Tenant Settings Menu**, select **Cloud Accounts**.

4. The added cloud account is listed under **Azure** with all other available Azure cloud accounts.

:::tip

Use the **three-dot Menu** in the row of the cloud account to edit Azure account information in Palette or remove the
account from Palette.

:::

## Next Steps

After you have added your Azure cloud account to Palette or Palette VerteX, you can start deploying an Azure IaaS
cluster by following the [Create and Manage IaaS Cluster](./create-azure-cluster.md) guide, or if you prefer an Azure
Managed Kubernetes Service (AKS) cluster, refer to the [Create and Manage Azure AKS Cluster](./azure.md) guide. We also
encourage you to check out the [Getting Started](../../../tutorials/getting-started/palette/azure/azure.md) tutorials
for further guidance on the cluster creation process.
