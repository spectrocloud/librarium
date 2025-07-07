---
sidebar_label: "Required Permissions"
title: "Required Permissions"
description: "Review the required permissions for deploying clusters on Azure"
icon: ""
hide_table_of_contents: false
tags: ["public cloud", "azure", "permissions"]
sidebar_position: 100
---

Palette requires a set of permissions to properly deploy and manage the lifecycle of clusters deployed to Azure. We
recommend creating
[role assignments](https://learn.microsoft.com/en-us/azure/role-based-access-control/role-assignments) that have the
service principal you want to use with Palette and the appropriate
[scope level](https://learn.microsoft.com/en-us/azure/role-based-access-control/scope-overview). To ensure that Palette
and VerteX can deploy and manage clusters on Azure in all use cases, use a subscription as the scope level for the role
assignment.

:::warning

We recommend against assigning the built-in Azure
[Contributor](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#contributor) role to the
service principal you want to use in Palette because its permission scope exceeds our requirements. Instead, create
custom roles to provide only those permissions that Palette requires.

:::

We support the following use cases:

- [IaaS Static Placement](#iaas-static-placement) - Palette deploys clusters on the pre-existing network resources you
  specify.

- [IaaS Dynamic Placement](#iaas-dynamic-placement) - Palette creates network resources required for your cluster.

- [AKS Static Placement](#aks-static-placement) - Palette deploys AKS clusters on the pre-existing network resources you
  specify.

- [AKS Dynamic Placement](#aks-dynamic-placement) - Palette creates resources required for your AKS cluster.

:::tip

You can use Palette CLI to verify you have setup the correct permissions. Check out the Palette CLI
[`validate-auth`](../../../automation/palette-cli/commands/validate-auth.md) command section for more information.

:::

Review the sections below to learn how to create a custom role in Azure and assign it to the service principal you want
to use with Palette.

## IaaS

Palette can deploy Virtual Machines (VMs) on Azure that collectively will be used to form the cluster. Depending on the
use case, you can deploy VMs to a pre-existing virtual network or let Palette create the required network resources.

Select the appropriate section below to learn how to create a custom role in Azure and assign it to the service
principal you want to use with Palette.

### Static Placement {#iaas-static-placement}

Palette requires a set of permissions at the subscription level to deploy IaaS clusters using static placement. The
remainder of the permissions required by IaaS can be assigned at the resource group level.

#### Prerequisites

- Azure CLI installed on your local machine. Refer to the
  [Azure CLI Install Guide](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) for installation instructions.

- A terminal or command prompt to issue the Azure CLI commands.

- The Azure subscription ID you want to use with Palette.

- The client ID of the Azure service principal you want to use with Palette. You can retrieve it from the Entra ID
  section of the Azure Portal.

#### Create Role and Assign Permissions

1. Create a JSON file named `iaas_static_vnet_role.json` containing all the permissions that must be applied at the
   virtual network scope level.

   <PartialsComponent category="permissions" name="azure-iaas-static-vnet-role" />

2. Navigate to the end of the JSON file and replace `<subscription-id>` with your Azure subscription ID.

3. Next, create a JSON file named `iaas_static_rg_sub_role.json` for the permissions that must be applied at the
   resource group or subscription scope level.

   <PartialsComponent category="permissions" name="azure-iaas-static-rg-sub-role" />

4. Navigate to the end of the JSON file and replace `<subscription-id>` with your Azure subscription ID.   

5. Create a role for each of the JSON files you created in the previous steps. Issue the following commands to create
   the roles.

   ```shell
   az role definition create --role-definition @iaas_static_vnet_role.json --output table
   az role definition create --role-definition @iaas_static_rg_sub_role.json --output table
   ```

6. Export the client ID of the [service principal](https://learn.microsoft.com/en-us/azure/role-based-access-control/overview#security-principal) you want to use with Palette to a variable.

   ```shell
   export ASSIGNEE="<service_principal_client_id>"
   ```

7. Export the resource group name and virtual network name to a variable.

   ```shell
   export RESOURCE_GROUP_NAME="<resource-group-name>"
   export VNET_NAME="<vnet-name>"
   ```

8. Assign the roles to the service principal. Use the following commands to assign the roles.

   ```json
   az role assignment create --assignee $ASSIGNEE \
     --role "Palette Static Placement IaaS Cluster Deployer (rg/sub)" \
     --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP_NAME"
   ```

   ```json
   az role assignment create --assignee $ASSIGNEE \
     --role "Palette Static Placement IaaS Cluster Deployer (vnet)" \
     --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP_NAME/providers/Microsoft.Network/virtualNetworks/$VNET_NAME"
   ```

#### Validate

1. Log in to the Azure portal.

2. Navigate to the Microsoft Entra ID section.

3. Review the role, or roles if you created multiple. Review the role assignments to ensure the service principal has
   the correct permissions assigned.

### Dynamic Placement {#iaas-dynamic-placement}

The permission requirements for IaaS dynamic placement can be provided at the resource group or subscription level. If
you are deploying multiple clusters in a variety of resource groups within a subscription, apply the role with the
subscription as scope instead of the resource group as scope.

#### Prerequisites

- Azure CLI installed on your local machine. Refer to the
  [Azure CLI Install Guide](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) for installation instructions.

- A terminal or command prompt to issue the Azure CLI commands.

- The Azure subscription ID you want to use with Palette.

- The client ID of the Azure service principal you want to use with Palette. You can retrieve it from the Entra ID
  section of the Azure Portal.

#### Create Role and Assign Permissions

1. Create a JSON file named `iaas_dynamic_rg_sub_role.json` containing all the required permissions to create resources.

   <PartialsComponent category="permissions" name="azure-iaas-dynamic-rg-sub-role" />

2. Navigate to the end of the JSON file and replace `<subscription-id>` with your Azure subscription ID.

3. Create a role using the JSON file you created in the previous step. Issue the following command to create the role.

   ```shell
   az role definition create --role-definition @iaas_dynamic_rg_sub_role.json --output table
   ```

4. Export the client ID of the
   [service principal](https://learn.microsoft.com/en-us/azure/role-based-access-control/overview#security-principal)
   you want to use with Palette to a variable.

   ```shell
   export ASSIGNEE="<service_principal_client_id>"
   ```

5. Export the resource group name to a variable.

   ```shell
   export RESOURCE_GROUP_NAME="<resource-group-name>"
   ```

6. Assign the role to the service principal. Use the following command to assign the role.

   ```shell
   az role assignment create --assignee $ASSIGNEE \
   --role "Palette Dynamic Placement IaaS Cluster Deployer (rg/sub)" \
   --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP_NAME"
   ```

#### Validate

1. Log in to the Azure portal.

2. Navigate to the Microsoft Entra ID section.

3. Review the role, or roles if you created multiple. Review the role assignments to ensure the service principal has
   the correct permissions assigned.

## AKS

Palette can deploy [AKS](https://learn.microsoft.com/en-us/azure/aks/what-is-aks) clusters on Azure. You can deploy AKS
clusters on pre-existing network resources or let Palette create the required network resources. Select the appropriate
section below to learn how to create a custom role in Azure and assign it to the service principal you want to use with
Palette.

### Static Placement {#aks-static-placement}

Palette requires a set of permissions at the subscription level to deploy AKS clusters using static placement. The
remainder of the permissions required by AKS can be assigned at the subscription or resource group level.

#### Prerequisites

- Azure CLI installed on your local machine. Refer to the
  [Azure CLI Install Guide](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) for installation instructions.

- A terminal or command prompt to issue the Azure CLI commands.

- The Azure subscription ID you want to use with Palette.

- The client ID of the Azure service principal you want to use with Palette. You can retrieve it from the Entra ID
  section of the Azure Portal.

#### Create Role and Assign Permissions

1. Create a JSON file named `aks_static_vnet_role.json` containing all the permissions that must be applied at the
   virtual network scope level.

   <PartialsComponent category="permissions" name="azure-aks-static-vnet-role" />

2. Navigate to the end of the JSON file and replace `<subscription-id>` with your Azure subscription ID.

3. Create a JSON file named `aks_static_sub_role.json` for the permissions that must be applied at the subscription
   scope level.

   <PartialsComponent category="permissions" name="azure-aks-static-sub-role" />

4. Create another JSON file named `aks_static_rg_sub_role.json` for the remaining permissions required by AKS.

   <PartialsComponent category="permissions" name="azure-aks-static-rg-sub-role" />

5. Create a role for each of the JSON files you created in the previous steps. Issue the following commands to create
   the roles.

   ```shell
   az role definition create --role-definition @aks_static_vnet_role.json --output table
   az role definition create --role-definition @aks_static_sub_role.json --output table
   az role definition create --role-definition @aks_static_rg_sub_role.json --output table
   ```

6. Export the client ID of the
   [service principal](https://learn.microsoft.com/en-us/azure/role-based-access-control/overview#security-principal)
   you want to use with Palette to a variable.

   ```shell
   export ASSIGNEE="<service_principal_client_id>"
   ```

7. Export the resource group name and virtual network name to a variable.

   ```shell
   export RESOURCE_GROUP_NAME="<resource-group-name>"
   export VNET_NAME="<vnet-name>"
   ```

8. Assign the roles to the service principal. Use the following commands to assign the roles.

   ```json
   az role assignment create --assignee $ASSIGNEE \
     --role "Palette Static Placement AKS Cluster Deployer (vnet)" \
     --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP_NAME/providers/Microsoft.Network/virtualNetworks/$VNET_NAME"
   ```

   ```json
   az role assignment create --assignee $ASSIGNEE \
     --role "Palette Static Placement AKS Cluster Deployer (sub)" \
     --scope "/subscriptions/$SUBSCRIPTION_ID"
   ```

   ```json
   az role assignment create --assignee $ASSIGNEE \
     --role "Palette Static Placement AKS Cluster Deployer (rg/sub)" \
     --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP_NAME"
   ```

#### Validate

1. Log in to the Azure portal.

2. Navigate to the Microsoft Entra ID section.

3. Review the role, or roles if you created multiple. Review the role assignments to ensure the service principal has
   the correct permissions assigned.

### Dynamic Placement {#aks-dynamic-placement}

The permission requirements for AKS dynamic placement are similar to the AKS static placement requirements. The
difference is that a set of permissions are required at the subscription level. The remaining permissions can be applied
at the resource group level, or at the subscription level if you are deploying multiple clusters in a variety of
resource groups within a subscription.

#### Prerequisites

- Azure CLI installed on your local machine. Refer to the
  [Azure CLI Install Guide](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) for installation instructions.

- A terminal or command prompt to issue the Azure CLI commands.

- The Azure subscription ID you want to use with Palette.

- The client ID of the Azure service principal you want to use with Palette. You can retrieve it from the Entra ID
  section of the Azure Portal.

#### Create Role and Assign Permissions

1. Create a JSON file named `aks_dynamic_sub_role.json` containing all the required subscription level permissions.

   <PartialsComponent category="permissions" name="azure-aks-dynamic-sub-role" />

2. Navigate to the end of the JSON file and replace `<subscription-id>` with your Azure subscription ID.

3. Create another JSON file named `aks_dynamic_rg_sub_role.json` containing the remaining permissions required for AKS.

   <PartialsComponent category="permissions" name="azure-aks-dynamic-rg-sub-role" />

4. Navigate to the end of the JSON file and replace `<subscription-id>` with your Azure subscription ID.  

5. Create a role for each of the JSON files you created in the previous steps. Issue the following commands to create
   the roles.

   ```shell
   az role definition create --role-definition @aks_dynamic_sub_role.json --output table
   az role definition create --role-definition @aks_dynamic_rg_sub_role.json --output table
   ```

6. Export the client ID of the
   [service principal](https://learn.microsoft.com/en-us/azure/role-based-access-control/overview#security-principal)
   you want to use with Palette to a variable.

   ```shell
   export ASSIGNEE="<service_principal_client_id>"
   ```

7. Export the resource group name to a variable.

   ```shell
   export RESOURCE_GROUP_NAME="<resource-group-name>"
   export VNET_NAME="<vnet-name>"
   ```

8. Assign the roles to the service principal. Use the following commands to assign the roles.

   ```json
   az role assignment create --assignee $ASSIGNEE \
     --role "Palette Dynamic Placement AKS Cluster Deployer (sub)" \
     --scope "/subscriptions/$SUBSCRIPTION_ID"
   ```

   ```json
   az role assignment create --assignee $ASSIGNEE \
     --role "Palette Dynamic Placement AKS Cluster Deployer (rg/sub)" \
     --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP_NAME"
   ```
#### Validate

1. Log in to the Azure portal.

2. Navigate to the Microsoft Entra ID section.

3. Review the role, or roles if you created multiple. Review the role assignments to ensure the service principal has
   the correct permissions assigned.