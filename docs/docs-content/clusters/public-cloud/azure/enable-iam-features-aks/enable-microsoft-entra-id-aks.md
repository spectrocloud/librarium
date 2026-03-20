---
sidebar_label: "Enable Microsoft Entra ID"
title: "Enable Microsoft Entra ID for AKS"
description: "Learn how to enable Microsoft Entra ID for Azure Kubernetes Service clusters in Palette."
hide_table_of_contents: false
tags: ["public cloud", "azure", "aks"]
sidebar_position: 10
---

Palette provides support for
[Microsoft Entra ID](https://learn.microsoft.com/en-us/azure/aks/enable-authentication-microsoft-entra-id) for Azure
Kubernetes Service (AKS) clusters. This allows you to manage access to your AKS clusters using Microsoft Entra ID
identities.

This guide helps you configure your cluster profile with the appropriate settings to enable Microsoft Entra ID
integration for your AKS clusters.

## Prerequisites

- An active Azure cloud account integrated with Palette. Review
  [Register and Manage Azure Cloud Account](../azure-cloud.md) for guidance.

- A Palette account with either Cluster Profile Admin or Cluster Profile Editor permissions depending on whether you are
  creating a new cluster profile or editing an existing one. Refer to
  [Cluster Profile Roles and Permissions](../../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile)
 for more information.

- The service principal associated with your Azure cloud account must have the built-in
  [Azure Kubernetes Service RBAC Cluster Admin](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles/containers#azure-kubernetes-service-rbac-cluster-admin)
  role assigned at the appropriate scope level. This is in addition to the [Required Permissions](../azure-cloud.md) for
  cluster provisioning. Refer to
  [Steps to assign an Azure role](https://learn.microsoft.com/en-us/azure/role-based-access-control/role-assignments-steps)
  for guidance.

- Microsoft Entra ID group object IDs for members that you want to receive `cluster-admin` Kubernetes role privileges.
  You can use an existing Microsoft Entra ID group or create a new one for this purpose. Refer to the
  [Microsoft Entra ID documentation](https://learn.microsoft.com/en-us/entra/fundamentals/how-to-manage-groups) for
  guidance on creating groups and obtaining their object IDs.

- Azure CLI installed and configured on your local machine. This is required for validating that Microsoft Entra ID
  integration is active on your AKS clusters. Refer to the
  [Install Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) guide for instructions.

  - You will need membership of one of the admin groups to be able to validate the integration.

## Enable Microsoft Entra ID Integration

1. Log in to [Palette](https://console.palette.com).

2. From the left main menu, select **Profiles**.

3. Click on the cluster profile you want to edit or
   [create a new cluster profile](../../../../profiles/cluster-profiles/create-cluster-profiles/create-cluster-profiles.md).

   - If editing an existing cluster profile,
     [create a new version of the cluster profile](../../../../profiles/cluster-profiles/modify-cluster-profiles/version-cluster-profile.md).

   - If creating a new cluster profile, choose a cluster profile **Type** of **Infrastructure** or **Full**, and select **Azure AKS** for the cloud type. Add profile layers as needed. When you are finished creating the cluster profile, select it from the **Profiles** page to edit it.

4. Click on the `kubernetes-aks` layer to edit the pack parameters.

5. Under **Pack Details**, select **Values**.

6. In the YAML editor, add the following parameters to enable Microsoft Entra ID integration for your AKS clusters.

   ```yaml
   managedControlPlane:
     aadProfile:
       managed: true
       adminGroupObjectIDs:
         - "<microsoft-entra-id-group-object-id-1>"
         - "<microsoft-entra-id-group-object-id-2>"
       disableLocalAccounts: true
   ```

   Review the following table for an explanation of these parameters.

   | Parameter                                             | Description                                                                                                                                                                                                                                                                                                                                                                                                         | Example value                              |
   | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
   | `managedControlPlane.aadProfile.managed`              | Set to `true` to enable Microsoft Entra ID integration for your AKS clusters.                                                                                                                                                                                                                                                                                                                                       | `true`                                     |
   | `managedControlPlane.aadProfile.adminGroupObjectIDs`  | Provide a list of Microsoft Entra ID group object IDs for members that you want to receive `cluster-admin` Kubernetes role privileges. This is a required parameter when `managedControlPlane.aadProfile.managed` is set to `true`.                                                                                                                                                                                 | `["aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb"]` |
   | `managedControlPlane.aadProfile.disableLocalAccounts` | Set to `true` to disable local accounts for your AKS clusters. When set to true: <br /><br />- `az aks get-credentials --admin` no longer works. <br />- Only Microsoft Entra ID authentication is allowed. <br />- The cluster kubeconfig will be token-based and will be valid for approximately 1 hour. After that, you will need to [download the kubeconfig again from Palette](../../../cluster-management/kubeconfig.md). | `true`                                     |

7. After making the necessary changes, click **Confirm Updates**.

8. On the cluster profile page, click **Save Changes**.

You can now use this cluster profile to create new AKS clusters with Microsoft Entra ID integration enabled. If you want
to deploy existing AKS clusters with Microsoft Entra ID integration, you can apply the updated cluster profile to those
clusters. Review the [Update a Cluster](../../../cluster-management/cluster-updates.md#update-a-cluster) guide for more
information.

:::info

Applying these settings to an existing cluster will _not_ trigger any
[repaves](../../../cluster-management/node-pool.md#repave-behavior-and-configuration).

:::

## Validate

You can only validate these settings after you have deployed or updated a cluster using the cluster profile with
Microsoft Entra ID integration enabled.

1. Log in to [Palette](https://console.palette.com).

2. From the left main menu, select **Clusters**.

3. Click on the AKS cluster you want to validate.

4. Confirm the **Cluster Status** is **Running**. Then, from the cluster's **Overview** tab, download the **Admin
   Kubeconfig File**.

5. Open a terminal session and use the following command to verify that Microsoft Entra ID authentication is active on
   the cluster. Replace `<cluster-name>` and `<resource-group>` with your cluster's name and resource group. You will
   need read access to the cluster's resource group in Azure to use this command.

   ```shell
   az aks show \
     --name <cluster-name> \
     --resource-group <resource-group> \
     --query "aadProfile"
   ```

   The output should show `"managed": true` and your admin group object IDs.

   ```json hideClipboard title="Example output"
   {
     "adminGroupObjectIds": ["aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb"],
     "managed": true,
     "tenantId": "aaaabbbb-0000-cccc-1111-dddd2222eeee"
   }
   ```

6. Set the `KUBECONFIG` environment variable to point to the downloaded kubeconfig file.

   ```shell
   export KUBECONFIG=<path-to-downloaded-kubeconfig>
   ```

7. Use the following command to verify that you can authenticate to the cluster and have `cluster-admin` privileges.
   Ensure you are signed in with a Microsoft Entra ID user that is a member of one of the admin groups you specified in
   the cluster profile.

   ```bash
   kubectl auth can-i '*' '*' --all-namespaces
   ```

   The output should be `yes`.

   ```shell hideClipboard title="Example output"
   yes
   ```

## Next Steps

- If desired, enable [Microsoft Entra Workload Identity for AKS](./enable-microsoft-entra-workload-id-aks.md) to
  leverage Workload Identity for secure authentication of applications hosted on your AKS clusters.
- Learn how to deploy your AKS clusters by following the [Create and Manage Azure AKS Clusters](../aks.md) guide.
