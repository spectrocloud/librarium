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

- [Dynamic Placement](#dynamic-placement) - Palette creates network resources required for your cluster.

- [Static Placement](#static-placement) - Palette deploys clusters on the pre-existing network resources you specify.

:::tip

You can use [Validator](https://github.com/spectrocloud-labs/validator) with the
[Azure plugin](https://github.com/spectrocloud-labs/validator-plugin-azure) to verify you have setup the correct
permissions. The Validator Azure plugin requires the following permissions:

- Microsoft.Authorization/denyAssignments/read
- Microsoft.Authorization/roleAssignments/read
- Microsoft.Authorization/roleDefinitions/read

You can use Validator with the Palette CLI. Check out the Palette CLI
[Validator](../../../automation/palette-cli/commands/ec.md#validate-environment) reference page for more information.

:::

Review the sections below to learn how to create a custom role in Azure and assign it to the service principal you want
to use with Palette.

## Dynamic Placement

Dynamic placement is the default method for deploying Azure clusters through Palette. With dynamic placement, Palette
dynamically creates the network resources required for your cluster.

### Prerequisites

- Azure CLI installed on your local machine. Refer to the
  [Azure CLI Install Guide](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) for installation instructions.

- The Azure subscription ID you want to use with Palette.

- The Security Principal Object ID you want to use with Palette. You can retrieve it from the Entra ID section of the
  Azure Portal.

### Create Role and Assign Permissions

1.  Export your Azure subscription ID to a variable.

    ```shell
    export SUBSCRIPTION_ID=<your-subscription-id>
    ```

2.  Issue the following command to create a JSON file containing all the required permissions to deploy clusters
    dynamically in Palette.

    ```shell
    echo "{
      \"Name\": \"Dynamic Placement Palette Deployer\",
      \"IsCustom\": true,
      \"Description\": \"Can deploy Azure IaaS clusters using dynamic placement with Palette.\",
      \"Actions\": [
        \"Microsoft.Compute/disks/delete\",
        \"Microsoft.Compute/disks/read\",
        \"Microsoft.Compute/disks/write\",
        \"Microsoft.Compute/galleries/images/read\",
        \"Microsoft.Compute/galleries/images/versions/read\",
        \"Microsoft.Compute/galleries/images/versions/write\",
        \"Microsoft.Compute/galleries/images/write\",
        \"Microsoft.Compute/galleries/read\",
        \"Microsoft.Compute/galleries/write\",
        \"Microsoft.Compute/images/read\",
        \"Microsoft.Compute/images/write\",
        \"Microsoft.Compute/virtualMachines/delete\",
        \"Microsoft.Compute/virtualMachines/extensions/delete\",
        \"Microsoft.Compute/virtualMachines/extensions/read\",
        \"Microsoft.Compute/virtualMachines/extensions/write\",
        \"Microsoft.Compute/virtualMachines/read\",
        \"Microsoft.Compute/virtualMachines/write\",
        \"Microsoft.Network/loadBalancers/backendAddressPools/join/action\",
        \"Microsoft.Network/loadBalancers/delete\",
        \"Microsoft.Network/loadBalancers/inboundNatRules/delete\",
        \"Microsoft.Network/loadBalancers/inboundNatRules/join/action\",
        \"Microsoft.Network/loadBalancers/inboundNatRules/read\",
        \"Microsoft.Network/loadBalancers/inboundNatRules/write\",
        \"Microsoft.Network/loadBalancers/read\",
        \"Microsoft.Network/loadBalancers/write\",
        \"Microsoft.Network/networkInterfaces/delete\",
        \"Microsoft.Network/networkInterfaces/join/action\",
        \"Microsoft.Network/networkInterfaces/read\",
        \"Microsoft.Network/networkInterfaces/write\",
        \"Microsoft.Network/networkSecurityGroups/read\",
        \"Microsoft.Network/networkSecurityGroups/securityRules/delete\",
        \"Microsoft.Network/networkSecurityGroups/securityRules/read\",
        \"Microsoft.Network/networkSecurityGroups/securityRules/write\",
        \"Microsoft.Network/privateDnsZones/A/delete\",
        \"Microsoft.Network/privateDnsZones/A/read\",
        \"Microsoft.Network/privateDnsZones/A/write\",
        \"Microsoft.Network/privateDnsZones/delete\",
        \"Microsoft.Network/privateDnsZones/read\",
        \"Microsoft.Network/privateDnsZones/virtualNetworkLinks/delete\",
        \"Microsoft.Network/privateDnsZones/virtualNetworkLinks/read\",
        \"Microsoft.Network/privateDnsZones/virtualNetworkLinks/write\",
        \"Microsoft.Network/privateDnsZones/write\",
        \"Microsoft.Network/publicIPAddresses/delete\",
        \"Microsoft.Network/publicIPAddresses/join/action\",
        \"Microsoft.Network/publicIPAddresses/read\",
        \"Microsoft.Network/publicIPAddresses/write\",
        \"Microsoft.Network/routeTables/delete\",
        \"Microsoft.Network/routeTables/read\",
        \"Microsoft.Network/routeTables/write\",
        \"Microsoft.Network/virtualNetworks/delete\",
        \"Microsoft.Network/virtualNetworks/join/action\",
        \"Microsoft.Network/virtualNetworks/join/action\",
        \"Microsoft.Network/virtualNetworks/joinLoadBalancer/action\",
        \"Microsoft.Network/virtualNetworks/peer/action\",
        \"Microsoft.Network/virtualNetworks/read\",
        \"Microsoft.Network/virtualNetworks/subnets/delete\",
        \"Microsoft.Network/virtualNetworks/subnets/join/action\",
        \"Microsoft.Network/virtualNetworks/subnets/joinLoadBalancer/action\",
        \"Microsoft.Network/virtualNetworks/subnets/read\",
        \"Microsoft.Network/virtualNetworks/subnets/virtualMachines/read\",
        \"Microsoft.Network/virtualNetworks/subnets/write\",
        \"Microsoft.Network/virtualNetworks/virtualMachines/read\",
        \"Microsoft.Network/virtualNetworks/virtualNetworkPeerings/delete\",
        \"Microsoft.Network/virtualNetworks/virtualNetworkPeerings/read\",
        \"Microsoft.Network/virtualNetworks/virtualNetworkPeerings/write\",
        \"Microsoft.Network/virtualNetworks/write\",
        \"Microsoft.Resources/subscriptions/resourceGroups/read\",
        \"Microsoft.Storage/storageAccounts/blobServices/containers/read\",
        \"Microsoft.Storage/storageAccounts/blobServices/containers/write\",
        \"Microsoft.Storage/storageAccounts/read\",
        \"Microsoft.Storage/storageAccounts/write\"
      ],
      \"NotActions\": [],
      \"AssignableScopes\": [\"/subscriptions/$SUBSCRIPTION_ID\"]
    }" > dynamic-permissions.json
    ```

    <!-- prettier-ignore -->
       <details>
      <summary>Expand to view the raw JSON for the Dynamic Placement policy</summary>

         ```json
         {
           "Name": "Dynamic Placement Palette Deployer",
           "IsCustom": true,
           "Description": "Can deploy Azure IaaS clusters using dynamic placement with Palette.",
           "Actions": [
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
             "Microsoft.Network/networkSecurityGroups/read",
             "Microsoft.Network/networkSecurityGroups/securityRules/delete",
             "Microsoft.Network/networkSecurityGroups/securityRules/read",
             "Microsoft.Network/networkSecurityGroups/securityRules/write",
             "Microsoft.Network/privateDnsZones/A/delete",
             "Microsoft.Network/privateDnsZones/A/read",
             "Microsoft.Network/privateDnsZones/A/write",
             "Microsoft.Network/privateDnsZones/delete",
             "Microsoft.Network/privateDnsZones/read",
             "Microsoft.Network/privateDnsZones/virtualNetworkLinks/delete",
             "Microsoft.Network/privateDnsZones/virtualNetworkLinks/read",
             "Microsoft.Network/privateDnsZones/virtualNetworkLinks/write",
             "Microsoft.Network/privateDnsZones/write",
             "Microsoft.Network/publicIPAddresses/delete",
             "Microsoft.Network/publicIPAddresses/join/action",
             "Microsoft.Network/publicIPAddresses/read",
             "Microsoft.Network/publicIPAddresses/write",
             "Microsoft.Network/routeTables/delete",
             "Microsoft.Network/routeTables/read",
             "Microsoft.Network/routeTables/write",
             "Microsoft.Network/virtualNetworks/delete",
             "Microsoft.Network/virtualNetworks/join/action",
             "Microsoft.Network/virtualNetworks/join/action",
             "Microsoft.Network/virtualNetworks/joinLoadBalancer/action",
             "Microsoft.Network/virtualNetworks/peer/action",
             "Microsoft.Network/virtualNetworks/read",
             "Microsoft.Network/virtualNetworks/subnets/delete",
             "Microsoft.Network/virtualNetworks/subnets/join/action",
             "Microsoft.Network/virtualNetworks/subnets/joinLoadBalancer/action",
             "Microsoft.Network/virtualNetworks/subnets/read",
             "Microsoft.Network/virtualNetworks/subnets/virtualMachines/read",
             "Microsoft.Network/virtualNetworks/subnets/write",
             "Microsoft.Network/virtualNetworks/virtualMachines/read",
             "Microsoft.Network/virtualNetworks/virtualNetworkPeerings/delete",
             "Microsoft.Network/virtualNetworks/virtualNetworkPeerings/read",
             "Microsoft.Network/virtualNetworks/virtualNetworkPeerings/write",
             "Microsoft.Network/virtualNetworks/write",
             "Microsoft.Resources/subscriptions/resourceGroups/read",
             "Microsoft.Storage/storageAccounts/blobServices/containers/read",
             "Microsoft.Storage/storageAccounts/blobServices/containers/write",
             "Microsoft.Storage/storageAccounts/read",
             "Microsoft.Storage/storageAccounts/write"
           ],
           "NotActions": [],
           "AssignableScopes": ["/subscriptions/$SUBSCRIPTION_ID"]
         }
         ```

       </details>

3.  Export the security principal object ID to a variable.

    ```shell
    export ASSIGNEE="<security_principal_object_id>"
    ```

4.  Assign the role by creating a role assignment referencing the role definition `Dynamic Placement Palette Deployer`.
    Use the command below to assign the role to the service principal.

    ```shell
    az role assignment create --assignee $ASSIGNEE \
    --role "Dynamic Placement Palette Deployer" \
    --scope "/subscriptions/$SUBSCRIPTION_ID"
    ```

### Validate

1. Log in to the Azure portal.

2. Navigate to the Microsoft Entra ID section.

3. Review the role assignments to ensure the service principal has the `Dynamic Placement Palette Deployer` role
   assigned.

## Static Placement

Choose static placement when you want Palette to use pre-existing network resource groups, VNets, subnets, and security
groups. Review the table below for the required actions and the different scope levels for each use case.

<Tabs>

<TabItem label="Single Cluster" value="sc">

```json
{
  "Name": "Static Placement Palette Deployer",
  "IsCustom": true,
  "Description": "Can deploy Azure IaaS clusters using static placement with Palette.",
  "Actions": [
    "Microsoft.Compute/disks/delete",
    "Microsoft.Compute/disks/read",
    "Microsoft.Compute/disks/write",
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
    "Microsoft.Network/networkSecurityGroups/read",
    "Microsoft.Network/networkSecurityGroups/securityRules/delete",
    "Microsoft.Network/networkSecurityGroups/securityRules/read",
    "Microsoft.Network/networkSecurityGroups/securityRules/write",
    "Microsoft.Network/privateDnsZones/A/delete",
    "Microsoft.Network/privateDnsZones/A/read",
    "Microsoft.Network/privateDnsZones/A/write",
    "Microsoft.Network/privateDnsZones/delete",
    "Microsoft.Network/privateDnsZones/read",
    "Microsoft.Network/privateDnsZones/virtualNetworkLinks/delete",
    "Microsoft.Network/privateDnsZones/virtualNetworkLinks/read",
    "Microsoft.Network/privateDnsZones/virtualNetworkLinks/write",
    "Microsoft.Network/privateDnsZones/write",
    "Microsoft.Network/publicIPAddresses/delete",
    "Microsoft.Network/publicIPAddresses/join/action",
    "Microsoft.Network/publicIPAddresses/read",
    "Microsoft.Network/publicIPAddresses/write",
    "Microsoft.Network/routeTables/delete",
    "Microsoft.Network/routeTables/read",
    "Microsoft.Network/routeTables/write",
    "Microsoft.Network/virtualNetworks/delete",
    "Microsoft.Network/virtualNetworks/join/action",
    "Microsoft.Network/virtualNetworks/join/action",
    "Microsoft.Network/virtualNetworks/joinLoadBalancer/action",
    "Microsoft.Network/virtualNetworks/peer/action",
    "Microsoft.Network/virtualNetworks/subnets/delete",
    "Microsoft.Network/virtualNetworks/subnets/joinLoadBalancer/action",
    "Microsoft.Network/virtualNetworks/subnets/virtualMachines/read",
    "Microsoft.Network/virtualNetworks/subnets/write",
    "Microsoft.Network/virtualNetworks/virtualMachines/read",
    "Microsoft.Network/virtualNetworks/virtualNetworkPeerings/delete",
    "Microsoft.Network/virtualNetworks/virtualNetworkPeerings/read",
    "Microsoft.Network/virtualNetworks/virtualNetworkPeerings/write",
    "Microsoft.Network/virtualNetworks/write",
    "Microsoft.Resources/subscriptions/resourceGroups/read",
    "Microsoft.Storage/storageAccounts/blobServices/containers/read",
    "Microsoft.Storage/storageAccounts/blobServices/containers/write",
    "Microsoft.Storage/storageAccounts/read",
    "Microsoft.Storage/storageAccounts/write"
  ],
  "NotActions": [],
  "AssignableScopes": ["/subscriptions/$SUBSCRIPTION_ID"]
}
```

```json
{
  "Name": "Static Placement Palette Deployer - Compute Gallery Scope",
  "IsCustom": true,
  "Description": "Can deploy the compute gallery level components of Azure IaaS clusters using static placement with Palette.",
  "Actions": ["Microsoft.Compute/galleries/images/read", "Microsoft.Compute/galleries/images/versions/read"],
  "NotActions": [],
  "AssignableScopes": ["/subscriptions/$SUBSCRIPTION_ID"]
}
```

```json
{
  "Name": "Static Placement Palette Deployer - Subnet Scope",
  "IsCustom": true,
  "Description": "Can deploy the subnet level components of Azure IaaS clusters using static placement with Palette.",
  "Actions": [
    "Microsoft.Network/virtualNetworks/subnets/join/action",
    "Microsoft.Network/virtualNetworks/subnets/read"
  ],
  "NotActions": [],
  "AssignableScopes": ["/subscriptions/$SUBSCRIPTION_ID"]
}
```

```json
{
  "Name": "Static Placement Palette Deployer - Virtual Network Scope",
  "IsCustom": true,
  "Description": "Can deploy the virtual network level components of Azure IaaS clusters using static placement with Palette.",
  "Actions": ["Microsoft.Network/virtualNetworks/read"],
  "NotActions": [],
  "AssignableScopes": ["/subscriptions/$SUBSCRIPTION_ID"]
}
```

```json
az role assignment create --assignee $ASSIGNEE \
  --role "Static Placement Palette Deployer - Resource Group Scope" \
  --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP_NAME"
```

```json
az role assignment create --assignee $ASSIGNEE \
  --role "Static Placement Palette Deployer - Virtual Network Scope" \
  --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP_NAME/providers/Microsoft.Network/virtualNetworks/$VIRTUAL_NETWORK_NAME"
```

```json
az role assignment create --assignee $ASSIGNEE \
  --role "Static Placement Palette Deployer - Subnet Scope" \
  --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP_NAME/providers/Microsoft.Network/virtualNetworks/$VIRTUAL_NETWORK_NAME/subnets/$SUBNET_NAME"
```

```json
az role assignment create --assignee $ASSIGNEE \
  --role "Static Placement Palette Deployer - Compute Gallery Scope" \
  --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP_NAME/providers/Microsoft.Compute/galleries/$COMPUTE_GALLERY_NAME"
```

    | Action | Scope Level|
    |--------|------------|
    | Microsoft.Compute/disks/delete | Resource Group |
    | Microsoft.Compute/disks/read | Resource Group |
    | Microsoft.Compute/disks/write | Resource Group |
    | Microsoft.Compute/virtualMachines/delete | Resource Group |
    | Microsoft.Compute/virtualMachines/extensions/delete | Resource Group |
    | Microsoft.Compute/virtualMachines/extensions/read | Resource Group |
    | Microsoft.Compute/virtualMachines/extensions/write | Resource Group |
    | Microsoft.Compute/virtualMachines/read | Resource Group |
    | Microsoft.Compute/virtualMachines/write | Resource Group |
    | Microsoft.Network/loadBalancers/backendAddressPools/join/action | Resource Group |
    | Microsoft.Network/loadBalancers/delete | Resource Group |
    | Microsoft.Network/loadBalancers/inboundNatRules/delete | Resource Group |
    | Microsoft.Network/loadBalancers/inboundNatRules/join/action | Resource Group |
    | Microsoft.Network/loadBalancers/inboundNatRules/read | Resource Group |
    | Microsoft.Network/loadBalancers/inboundNatRules/write | Resource Group |
    | Microsoft.Network/loadBalancers/read | Resource Group |
    | Microsoft.Network/loadBalancers/write | Resource Group |
    | Microsoft.Network/networkInterfaces/delete | Resource Group |
    | Microsoft.Network/networkInterfaces/join/action | Resource Group |
    | Microsoft.Network/networkInterfaces/read | Resource Group |
    | Microsoft.Network/networkInterfaces/write | Resource Group |
    | Microsoft.Network/networkSecurityGroups/read | Resource Group |
    | Microsoft.Network/networkSecurityGroups/securityRules/delete | Resource Group |
    | Microsoft.Network/networkSecurityGroups/securityRules/read | Resource Group |
    | Microsoft.Network/networkSecurityGroups/securityRules/write | Resource Group |
    | Microsoft.Network/privateDnsZones/A/delete | Resource Group |
    | Microsoft.Network/privateDnsZones/A/read | Resource Group |
    | Microsoft.Network/privateDnsZones/A/write | Resource Group |
    | Microsoft.Network/privateDnsZones/delete | Resource Group |
    | Microsoft.Network/privateDnsZones/read | Resource Group |
    | Microsoft.Network/privateDnsZones/virtualNetworkLinks/delete | Resource Group |
    | Microsoft.Network/privateDnsZones/virtualNetworkLinks/read | Resource Group |
    | Microsoft.Network/privateDnsZones/virtualNetworkLinks/write | Resource Group |
    | Microsoft.Network/privateDnsZones/write | Resource Group |
    | Microsoft.Network/publicIPAddresses/delete | Resource Group |
    | Microsoft.Network/publicIPAddresses/join/action | Resource Group |
    | Microsoft.Network/publicIPAddresses/read | Resource Group |
    | Microsoft.Network/publicIPAddresses/write | Resource Group |
    | Microsoft.Network/routeTables/delete | Resource Group |
    | Microsoft.Network/routeTables/read | Resource Group |
    | Microsoft.Network/routeTables/write | Resource Group |
    | Microsoft.Network/virtualNetworks/join/action | Resource Group |
    | Microsoft.Resources/subscriptions/resourceGroups/read | Resource Group |
    | Microsoft.Network/virtualNetworks/read | Virtual Network Level |
    | Microsoft.Network/virtualNetworks/subnets/join/action | Subnet Level |
    | Microsoft.Network/virtualNetworks/subnets/read | Subnet Level |
    | Microsoft.Compute/galleries/images/read | Compute Gallery Level |
    | Microsoft.Compute/galleries/images/versions/read| Compute Gallery Level |

</TabItem>
<TabItem label="Multiple Cluster - Same Resource Group" value="sc2">

The following JSON template provides the necessary permissions for deploying multiple clusters in the same resource
group. Replace `$SUBSCRIPTION_ID`, `$RESOURCE_GROUP_NAME`, `$VIRTUAL_NETWORK_NAME`, `$SUBNET_NAME`, and
`$COMPUTE_GALLERY_NAME` with your Azure subscription ID, resource group name, virtual network name, subnet name, and
compute gallery name.

```json
az role assignment create --assignee $ASSIGNEE \
  --role "Static Placement Palette Deployer" \
  --scope "/subscriptions/$/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP_NAME"
```

```json
{
  "Name": "Static Placement Palette Deployer",
  "IsCustom": true,
  "Description": "Can deploy Azure IaaS clusters using static placement with Palette.",
  "Actions": [
    "Microsoft.Compute/disks/delete",
    "Microsoft.Compute/disks/read",
    "Microsoft.Compute/disks/write",
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
    "Microsoft.Network/networkSecurityGroups/read",
    "Microsoft.Network/networkSecurityGroups/securityRules/delete",
    "Microsoft.Network/networkSecurityGroups/securityRules/read",
    "Microsoft.Network/networkSecurityGroups/securityRules/write",
    "Microsoft.Network/privateDnsZones/A/delete",
    "Microsoft.Network/privateDnsZones/A/read",
    "Microsoft.Network/privateDnsZones/A/write",
    "Microsoft.Network/privateDnsZones/delete",
    "Microsoft.Network/privateDnsZones/read",
    "Microsoft.Network/privateDnsZones/virtualNetworkLinks/delete",
    "Microsoft.Network/privateDnsZones/virtualNetworkLinks/read",
    "Microsoft.Network/privateDnsZones/virtualNetworkLinks/write",
    "Microsoft.Network/privateDnsZones/write",
    "Microsoft.Network/publicIPAddresses/delete",
    "Microsoft.Network/publicIPAddresses/join/action",
    "Microsoft.Network/publicIPAddresses/read",
    "Microsoft.Network/publicIPAddresses/write",
    "Microsoft.Network/routeTables/delete",
    "Microsoft.Network/routeTables/read",
    "Microsoft.Network/routeTables/write",
    "Microsoft.Network/virtualNetworks/join/action",
    "Microsoft.Resources/subscriptions/resourceGroups/read",
    "Microsoft.Network/virtualNetworks/read",
    "Microsoft.Network/virtualNetworks/subnets/join/action",
    "Microsoft.Network/virtualNetworks/subnets/read",
    "Microsoft.Compute/galleries/images/read",
    "Microsoft.Compute/galleries/images/versions/read"
  ],
  "AssignableScopes": ["/subscriptions/$SUBSCRIPTION_ID"]
}
```

    | Action | Scope Level|
    |--------|------------|
    | Microsoft.Compute/disks/delete | Resource Group |
    | Microsoft.Compute/disks/read | Resource Group |
    | Microsoft.Compute/disks/write | Resource Group |
    | Microsoft.Compute/virtualMachines/delete | Resource Group |
    | Microsoft.Compute/virtualMachines/extensions/delete | Resource Group |
    | Microsoft.Compute/virtualMachines/extensions/read | Resource Group |
    | Microsoft.Compute/virtualMachines/extensions/write | Resource Group |
    | Microsoft.Compute/virtualMachines/read | Resource Group |
    | Microsoft.Compute/virtualMachines/write | Resource Group |
    | Microsoft.Network/loadBalancers/backendAddressPools/join/action | Resource Group |
    | Microsoft.Network/loadBalancers/delete | Resource Group |
    | Microsoft.Network/loadBalancers/inboundNatRules/delete | Resource Group |
    | Microsoft.Network/loadBalancers/inboundNatRules/join/action | Resource Group |
    | Microsoft.Network/loadBalancers/inboundNatRules/read | Resource Group |
    | Microsoft.Network/loadBalancers/inboundNatRules/write | Resource Group |
    | Microsoft.Network/loadBalancers/read | Resource Group |
    | Microsoft.Network/loadBalancers/write | Resource Group |
    | Microsoft.Network/networkInterfaces/delete | Resource Group |
    | Microsoft.Network/networkInterfaces/join/action | Resource Group |
    | Microsoft.Network/networkInterfaces/read | Resource Group |
    | Microsoft.Network/networkInterfaces/write | Resource Group |
    | Microsoft.Network/networkSecurityGroups/read | Resource Group |
    | Microsoft.Network/networkSecurityGroups/securityRules/delete | Resource Group |
    | Microsoft.Network/networkSecurityGroups/securityRules/read | Resource Group |
    | Microsoft.Network/networkSecurityGroups/securityRules/write | Resource Group |
    | Microsoft.Network/privateDnsZones/A/delete | Resource Group |
    | Microsoft.Network/privateDnsZones/A/read | Resource Group |
    | Microsoft.Network/privateDnsZones/A/write | Resource Group |
    | Microsoft.Network/privateDnsZones/delete | Resource Group |
    | Microsoft.Network/privateDnsZones/read | Resource Group |
    | Microsoft.Network/privateDnsZones/virtualNetworkLinks/delete | Resource Group |
    | Microsoft.Network/privateDnsZones/virtualNetworkLinks/read | Resource Group |
    | Microsoft.Network/privateDnsZones/virtualNetworkLinks/write | Resource Group |
    | Microsoft.Network/privateDnsZones/write | Resource Group |
    | Microsoft.Network/publicIPAddresses/delete | Resource Group |
    | Microsoft.Network/publicIPAddresses/join/action | Resource Group |
    | Microsoft.Network/publicIPAddresses/read | Resource Group |
    | Microsoft.Network/publicIPAddresses/write | Resource Group |
    | Microsoft.Network/routeTables/delete | Resource Group |
    | Microsoft.Network/routeTables/read | Resource Group |
    | Microsoft.Network/routeTables/write | Resource Group |
    | Microsoft.Network/virtualNetworks/join/action | Resource Group |
    | Microsoft.Resources/subscriptions/resourceGroups/read | Resource Group |
    | Microsoft.Network/virtualNetworks/read | Resource Group |
    | Microsoft.Network/virtualNetworks/subnets/join/action | Resource Group|
    | Microsoft.Network/virtualNetworks/subnets/read | Resource Group |
    | Microsoft.Compute/galleries/images/read | Resource Group |
    | Microsoft.Compute/galleries/images/versions/read| Resource Group |

</TabItem>

<TabItem label="Multiple Cluster - Same Subscription" value="sc3">

Use the following JSON template to create a custom role in Azure that provides the necessary permissions for deploying
multiple clusters into the same subscription.

```json
{
  "Name": "Static Placement Palette Deployer",
  "IsCustom": true,
  "Description": "Can deploy Azure IaaS clusters using static placement with Palette.",
  "Actions": [
    "Microsoft.Compute/disks/delete",
    "Microsoft.Compute/disks/read",
    "Microsoft.Compute/disks/write",
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
    "Microsoft.Network/networkSecurityGroups/read",
    "Microsoft.Network/networkSecurityGroups/securityRules/delete",
    "Microsoft.Network/networkSecurityGroups/securityRules/read",
    "Microsoft.Network/networkSecurityGroups/securityRules/write",
    "Microsoft.Network/privateDnsZones/A/delete",
    "Microsoft.Network/privateDnsZones/A/read",
    "Microsoft.Network/privateDnsZones/A/write",
    "Microsoft.Network/privateDnsZones/delete",
    "Microsoft.Network/privateDnsZones/read",
    "Microsoft.Network/privateDnsZones/virtualNetworkLinks/delete",
    "Microsoft.Network/privateDnsZones/virtualNetworkLinks/read",
    "Microsoft.Network/privateDnsZones/virtualNetworkLinks/write",
    "Microsoft.Network/privateDnsZones/write",
    "Microsoft.Network/publicIPAddresses/delete",
    "Microsoft.Network/publicIPAddresses/join/action",
    "Microsoft.Network/publicIPAddresses/read",
    "Microsoft.Network/publicIPAddresses/write",
    "Microsoft.Network/routeTables/delete",
    "Microsoft.Network/routeTables/read",
    "Microsoft.Network/routeTables/write",
    "Microsoft.Network/virtualNetworks/join/action",
    "Microsoft.Resources/subscriptions/resourceGroups/read",
    "Microsoft.Network/virtualNetworks/read",
    "Microsoft.Network/virtualNetworks/subnets/join/action",
    "Microsoft.Network/virtualNetworks/subnets/read",
    "Microsoft.Compute/galleries/images/read",
    "Microsoft.Compute/galleries/images/versions/read"
  ],
  "AssignableScopes": ["/subscriptions/$SUBSCRIPTION_ID"]
}
```

<details>
<summary>Assign the role to the service principal</summary>

To use the role definition with the service principal you want to use with Palette, assign the role to the service
principal. Use the commands below to create the role definition and assign it to the service principal.

1. Create a role definition using the JSON template above and assign it to the service principal you want to use with
   Palette.

   ```shell
   az role definition create --role-definition /path/to/role-definition.json
   ```

2. Next, assign the role to the service principal. Replace `$ASSIGNEE` with the service principal object ID and
   `$SUBSCRIPTION_ID` with your Azure subscription ID.

   ```shell
   az role assignment create --assignee $ASSIGNEE \
     --role "Static Placement Palette Deployer" \
     --scope "/subscriptions/$SUBSCRIPTION_ID"
   ```

</details>

</TabItem>

</Tabs>
