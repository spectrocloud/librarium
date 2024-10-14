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
recommend creating a
[role assignment](https://learn.microsoft.com/en-us/azure/role-based-access-control/role-assignments) that has the
service principal you want to use with Palette and the appropriate
[scope level](https://learn.microsoft.com/en-us/azure/role-based-access-control/scope-overview). To ensure that Palette
and VerteX can deploy and manage clusters on Azure in all use cases, use a subscription as the scope level for the role
assignment.

:::warning

We recommend against assigning the built-in Azure
[Contributor](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#contributor) role to the
service principal you want to use in Palette because its permission scope exceeds our requirements. Instead, create a
custom role to provide only those permissions that Palette requires.

:::

We support the following use cases:

- [IaaS Dynamic Placement](#dynamic-placement) - Palette creates network resources required for your cluster.

- [IaaS Static Placement](#static-placement) - Palette deploys clusters on the pre-existing network resources you
  specify.

- [AKS Dynamic Placement](../azure/aks.md#dynamic-placement) - Palette creates resources required for your AKS cluster.

- [AKS Static Placement](../azure/aks.md#static-placement) - Palette deploys AKS clusters on the pre-existing resources
  you specify.

:::tip

You can use [Validator](https://github.com/spectrocloud-labs/validator) with the
[Azure plugin](https://github.com/spectrocloud-labs/validator-plugin-azure) to verify you have setup the correct
permissions. The Validator Azure plugin requires the following permissions:

- Microsoft.Authorization/denyAssignments/read
- Microsoft.Authorization/roleAssignments/read
- Microsoft.Authorization/roleDefinitions/read

You can use Validator with the Palette CLI. Check out the Palette CLI
[Validator](../../../automation/palette-cli/commands/ec.md#validate-environment) reference section for more information.

:::

Review the sections below to learn how to create a custom role in Azure and assign it to the service principal you want
to use with Palette.

## IaaS

Palette can deploy Virtual Machines (VMs) on Azure that collectively will be used to form the cluster. Depending on the
use case, you can deploy VMs on a pre-existing environment or let Palette create the required network resources.

Select the appropriate section below to learn how to create a custom role in Azure and assign it to the service
principal you want to use with Palette.

### Static Placement

#### Prerequisites

- Azure CLI installed on your local machine. Refer to the
  [Azure CLI Install Guide](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) for installation instructions.

- The Azure subscription ID you want to use with Palette.

- The Security Principal Object ID you want to use with Palette. You can retrieve it from the Entra ID section of the
  Azure Portal.

- A terminal or command prompt to issue the Azure CLI commands.

- The Azure Security Principal Object ID you want to use with Palette. The Security Principal Object ID can represent a
  user, group, or service principal.

#### Create Role and Assign Permissions

1. Open a terminal or command prompt. Export your Azure subscription ID to a variable.

   ```shell
   export SUBSCRIPTION_ID=<your-subscription-id>
   ```

2. Issue the following command to create a JSON file containing all the required permissions to create network
   resources. If you want to assigne the permission to scope to a specific resource group, replace the subscription ID
   the `AssignableScopes` field with the resource group ID.

   ```shell
   cat << EOF > iaas_static_vnet_role.template.json
   {
      "Name": "Palette Static Placement IaaS Cluster Deployer (vnet)",
      "IsCustom": true,
      "Description": "Can use Palette to deploy IaaS clusters using static placement. This role contains the permissions that must be applied at the virtual network scope level.",
      "Actions": [
        "Microsoft.Network/networkSecurityGroups/read",
        "Microsoft.Network/networkSecurityGroups/securityRules/read",
        "Microsoft.Network/privateDnsZones/A/delete",
        "Microsoft.Network/privateDnsZones/A/read",
        "Microsoft.Network/privateDnsZones/A/write",
        "Microsoft.Network/privateDnsZones/delete",
        "Microsoft.Network/privateDnsZones/read",
        "Microsoft.Network/privateDnsZones/virtualNetworkLinks/delete",
        "Microsoft.Network/privateDnsZones/virtualNetworkLinks/read",
        "Microsoft.Network/privateDnsZones/virtualNetworkLinks/write",
        "Microsoft.Network/privateDnsZones/write",
        "Microsoft.Network/routeTables/delete",
        "Microsoft.Network/routeTables/join/action",
        "Microsoft.Network/routeTables/read",
        "Microsoft.Network/routeTables/write",
        "Microsoft.Network/virtualNetworks/join/action",
        "Microsoft.Network/virtualNetworks/joinLoadBalancer/action",
        "Microsoft.Network/virtualNetworks/peer/action",
        "Microsoft.Network/virtualNetworks/read",
        "Microsoft.Network/virtualNetworks/subnets/join/action",
        "Microsoft.Network/virtualNetworks/subnets/joinLoadBalancer/action",
        "Microsoft.Network/virtualNetworks/subnets/read",
        "Microsoft.Network/virtualNetworks/subnets/virtualMachines/read",
        "Microsoft.Network/virtualNetworks/virtualMachines/read",
        "Microsoft.Network/virtualNetworks/virtualNetworkPeerings/read"
      ],
      "NotActions": [],
      "AssignableScopes": [
        "/subscriptions/$SUBSCRIPTION_ID"
      ]
    }
   ```

3. Next, create a JSON file for the compute permissions. Issue the following command to create the JSON file. If you
   want to assigne the permission to scope to a specific resource group, replace the subscription ID the
   `AssignableScopes` field with the resource group ID.

   ```shell
   cat << EOF > iaas_static_rg_sub_role.template.json
   {
     "Name": "Palette Static Placement IaaS Cluster Deployer (rg/sub)",
     "IsCustom": true,
     "Description": "Can use Palette to deploy IaaS clusters using static placement. This role contains the permissions that must be applied at the resource group scope level. If deploying multiple clusters in a variety of resource groups within a subscription, apply the role with the subscription as scope instead of the resource group as scope.",
     "Actions": [
       "Microsoft.Compute/availabilitySets/delete",
       "Microsoft.Compute/availabilitySets/read",
       "Microsoft.Compute/availabilitySets/write",
       "Microsoft.Compute/disks/delete",
       "Microsoft.Compute/disks/read",
       "Microsoft.Compute/disks/write",
       "Microsoft.Compute/galleries/images/read",
       "Microsoft.Compute/galleries/images/versions/read",
       "Microsoft.Compute/galleries/images/versions/write",
       "Microsoft.Compute/galleries/images/write",
       "Microsoft.Compute/galleries/read",
       "Microsoft.Compute/galleries/write",
       "Microsoft.Compute/images/read",
       "Microsoft.Compute/images/write",
       "Microsoft.Compute/virtualMachines/delete",
       "Microsoft.Compute/virtualMachines/extensions/delete",
       "Microsoft.Compute/virtualMachines/extensions/read",
       "Microsoft.Compute/virtualMachines/extensions/write",
       "Microsoft.Compute/virtualMachines/read",
       "Microsoft.Compute/virtualMachines/write",
       "Microsoft.Network/loadBalancers/backendAddressPools/join/action",
       "Microsoft.Network/loadBalancers/delete",
       "Microsoft.Network/loadBalancers/inboundNatRules/delete",
       "Microsoft.Network/loadBalancers/inboundNatRules/join/action",
       "Microsoft.Network/loadBalancers/inboundNatRules/read",
       "Microsoft.Network/loadBalancers/inboundNatRules/write",
       "Microsoft.Network/loadBalancers/read",
       "Microsoft.Network/loadBalancers/write",
       "Microsoft.Network/networkInterfaces/delete",
       "Microsoft.Network/networkInterfaces/join/action",
       "Microsoft.Network/networkInterfaces/read",
       "Microsoft.Network/networkInterfaces/write",
       "Microsoft.Network/publicIPAddresses/delete",
       "Microsoft.Network/publicIPAddresses/join/action",
       "Microsoft.Network/publicIPAddresses/read",
       "Microsoft.Network/publicIPAddresses/write",
       "Microsoft.Resources/subscriptions/resourceGroups/read",
       "Microsoft.Resources/subscriptions/resourceGroups/write",
       "Microsoft.Storage/storageAccounts/blobServices/containers/read",
       "Microsoft.Storage/storageAccounts/blobServices/containers/write",
       "Microsoft.Storage/storageAccounts/listKeys/action",
       "Microsoft.Storage/storageAccounts/read",
       "Microsoft.Storage/storageAccounts/write"
     ],
     "NotActions": [],
     "AssignableScopes": [
       "/subscriptions/$SUBSCRIPTION_ID"
     ]
   }
   ```

4. Create a role for each of the JSON files you created in the previous steps. Issue the following commands to create
   the roles.

   ```shell
   az role definition create --role-definition @iaas_static_vnet_role.template.json --output table
   az role definition create --role-definition @iaas_static_rg_sub_role.template.json --output table
   ```

5. Export the
   [security principal](https://learn.microsoft.com/en-us/azure/role-based-access-control/overview#security-principal)
   object ID you want to use with Palette to a variable.

   ```shell
   export ASSIGNEE="<security_principal_object_id>"
   ```

6. Assign the roles to the service principal. Use the following commands to assign the roles.

   ```json
   az role assignment create --assignee $ASSIGNEE \
     --role "Palette Static Placement IaaS Cluster Deployer (rg/sub)" \
     --scope "/subscriptions/$SUBSCRIPTION_ID"
   ```

   ```json
   az role assignment create --assignee $ASSIGNEE \
     --role "Palette Static Placement IaaS Cluster Deployer (vnet)" \
     --scope "/subscriptions/$SUBSCRIPTION_ID"
   ```

#### Validate

### Dynamic Placement

## AKS

### Static Placement

### Dynamic Placement
