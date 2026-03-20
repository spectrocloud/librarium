---
sidebar_label: "Enable Microsoft Entra Workload ID"
title: "Enable Microsoft Entra Workload ID for AKS"
description: "Learn how to enable Microsoft Entra Workload ID for Azure Kubernetes Service clusters in Palette."
hide_table_of_contents: false
tags: ["public cloud", "azure", "aks"]
sidebar_position: 20
---

Palette provides support for
[Microsoft Entra Workload ID](https://learn.microsoft.com/en-us/azure/aks/workload-identity-overview?tabs=dotnet) for
Azure Kubernetes Service (AKS) clusters. This allows you to leverage Microsoft Entra Workload ID to securely
authenticate applications hosted on your AKS clusters.

:::info

These steps effectively act as a replacement for the
[Enable OIDC issuer and Microsoft Entra Workload ID on an AKS cluster](https://learn.microsoft.com/en-us/azure/aks/workload-identity-deploy-cluster?tabs=new-cluster#enable-oidc-issuer-and-microsoft-entra-workload-id-on-an-aks-cluster)
section of the Microsoft documentation.

Enabling Microsoft Entra Workload ID at the cluster level is a prerequisite, but additional configuration is required
before your applications can use it. This includes creating a managed identity, a Kubernetes service account, and a
federated identity credential. Refer to the
[Microsoft documentation](https://learn.microsoft.com/en-us/azure/aks/workload-identity-deploy-cluster) for full setup
guidance.

:::

## Prerequisites

- An active Azure cloud account integrated with Palette. Review
  [Register and Manage Azure Cloud Account](../azure-cloud.md) for guidance.

- A Palette account with either Cluster Profile Admin or Cluster Profile Editor permissions depending on whether you are
  creating a new cluster profile or editing an existing one. Refer to
  [Cluster Profile Roles and Permissions](../../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile)
  for more information.

- Azure CLI installed and configured on your local machine. Refer to the
  [Install Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) guide for instructions.

  - You will need a minimum of read permissions on the cluster to be able to validate Microsoft Entra Workload ID is
    enabled.

## Enable Microsoft Entra Workload ID

1. Log in to [Palette](https://console.palette.com).

2. From the left main menu, select **Profiles**.

3. Click on the cluster profile you want to edit or
   [create a new cluster profile](../../../../profiles/cluster-profiles/create-cluster-profiles/create-cluster-profiles.md).

   - If editing an existing cluster profile,
     [create a new version of the cluster profile](../../../../profiles/cluster-profiles/modify-cluster-profiles/version-cluster-profile.md).

   - If creating a new cluster profile, choose a cluster profile **Type** of **Infrastructure** or **Full**, and select
     **Azure AKS** for the cloud type. Add profile layers as needed. When you are finished creating the cluster profile,
     select it from the **Profiles** page to edit it.

4. Click on the `kubernetes-aks` layer to edit the pack parameters.

5. Under **Pack Details**, select **Values**.

6. In the YAML editor, add the following parameters to enable Microsoft Entra Workload ID for your AKS clusters.

   ```yaml
   managedControlPlane:
     oidcIssuerProfile:
       enabled: true
     securityProfile:
       workloadIdentity:
         enabled: true
   ```

   Review the following table for an explanation of these parameters.

   | Parameter                                                      | Description                                                                                                                                                                                                                                                                                                                                                                      |
   | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | `managedControlPlane.oidcIssuerProfile.enabled`                | Set to `true` to enable the OpenID Connect (OIDC) issuer profile for your AKS cluster. This exposes an OIDC endpoint for your AKS cluster, which is mandatory for Microsoft Entra Workload ID, although it must be enabled separately. Once enabled, this property cannot be disabled and any attempt to set it to `false` will be discarded in the control plane configuration. |
   | `managedControlPlane.securityProfile.workloadIdentity.enabled` | Set to `true` to enable Microsoft Entra Workload ID for your AKS clusters. This installs a mutating webhook that automatically injects the necessary annotations and labels into your pods. This enables your pods to obtain service account tokens, which are exchanged for Microsoft Entra ID tokens that allow your applications to access Azure resources securely.          |

7. After making the necessary changes, click **Confirm Updates**.

8. On the cluster profile page, click **Save Changes**.

You can now use this cluster profile to create new AKS clusters with Microsoft Entra Workload ID enabled. If you want to
deploy existing AKS clusters with Microsoft Entra Workload ID, you can apply the updated cluster profile to those
clusters. Review the [Update a Cluster](../../../cluster-management/cluster-updates.md#update-a-cluster) guide for more
information.

:::info

Applying these settings to an existing cluster will _not_ trigger any
[repaves](../../../cluster-management/node-pool.md#repave-behavior-and-configuration).

:::

## Validate

You can only validate these settings after you have deployed or updated a cluster using the cluster profile with
Microsoft Entra Workload ID enabled.

1. Log in to [Palette](https://console.palette.com).

2. From the left main menu, select **Clusters**.

3. Click on the AKS cluster you want to validate.

4. Confirm the **Cluster Status** is **Running**.

5. Open a terminal and use the following command to verify that the OIDC issuer profile and Microsoft Entra Workload ID
   are active on the cluster. Replace `<cluster-name>` and `<resource-group>` with your cluster's name and resource
   group.

   ```shell
   az aks show --name <cluster-name> --resource-group <resource-group> \
   --query "{oidcIssuer: oidcIssuerProfile, workloadIdentity: securityProfile.workloadIdentity}"
   ```

   The output should show `"enabled": true` for both fields, along with the OIDC issuer URL.

   ```json hideClipboard title="Example output"
   {
     "oidcIssuer": {
       "enabled": true,
       "issuerUrl": "https://eastus.oic.prod-aks.azure.com/00000000-0000-0000-0000-000000000000/11111111-1111-1111-1111-111111111111/"
     },
     "workloadIdentity": {
       "enabled": true
     }
   }
   ```

## Next Steps

- If you want to enable Microsoft Entra ID integration for your AKS clusters, review the
  [Enable Microsoft Entra ID for AKS](./enable-microsoft-entra-id-aks.md) guide for more information.
- Learn how to deploy your AKS clusters by following the [Create and Manage Azure AKS Clusters](../aks.md) guide.
- If you want to verify end-to-end Microsoft Entra Workload ID functionality, you can follow the
  [Deploy a verification pod and test access](https://learn.microsoft.com/en-us/azure/aks/workload-identity-deploy-cluster?tabs=new-cluster#deploy-a-verification-pod-and-test-access)
  section of the Microsoft documentation. You will need to have completed the rest of the Microsoft Entra Workload ID
  setup, including creating a managed identity, a Kubernetes service account, and a federated identity credential before
  you can complete these steps on your cluster.
