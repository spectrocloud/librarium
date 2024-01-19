---
sidebar_label: "Required Permissions"
title: "Required Permissions"
description: "Review the required permissions for deploying clusters on Azure"
icon: ""
hide_table_of_contents: false
tags: ["public cloud", "azure", "permissions"]
sidebar_position: 100
---


Palette requires a set of permissions to properly deploy and manage the lifecycle of clusters deployed to Azure. We recommend creating a [role assignment](https://learn.microsoft.com/en-us/azure/role-based-access-control/role-assignments) that has the service principal you want to use with Palette and the appropriate [scope level](https://learn.microsoft.com/en-us/azure/role-based-access-control/scope-overview). To ensure that Palette and VerteX can deploy and manage clusters on Azure in all use cases, use a subscription as the scope level for the role assignment.

:::warning

Creating a custom role allows you to provide only those permissions that Palette requires. If you don't want to create a custom role, you can assign the built-in Azure [Contributor](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#contributor) role to the service principal you want Palette to use. However, note that the Contributor role has all the required permissions and also has additional permissions that Palette does not require. 

:::


We support the following use cases:

- [Static Placement](#static-placement) - Palette deploys clusters on the pre-existing network resources you specify.

- [Dynamic Placement](#dynamic-placement) - Palette creates network resources required for your cluster.

- [Validator](#validator) - Use the Validator open-source framework to validate the permissions required by Palette.

## Static Placement

Choose static placement when you want Palette to use pre-existing network resource groups, VNets, subnets, and security groups.


<details>
<summary>Expand to view all required actions</summary>

Below are all the required actions for all static placement use cases without a specified scope level.

- Microsoft.Compute/disks/delete
- Microsoft.Compute/disks/read
- Microsoft.Compute/disks/write
- Microsoft.Compute/galleries/images/read
- Microsoft.Compute/galleries/images/versions/read
- Microsoft.Compute/virtualMachines/delete
- Microsoft.Compute/virtualMachines/extensions/delete
- Microsoft.Compute/virtualMachines/extensions/read
- Microsoft.Compute/virtualMachines/extensions/write
- Microsoft.Compute/virtualMachines/read
- Microsoft.Compute/virtualMachines/write
- Microsoft.Network/loadBalancers/backendAddressPools/join/action
- Microsoft.Network/loadBalancers/delete
- Microsoft.Network/loadBalancers/inboundNatRules/delete
- Microsoft.Network/loadBalancers/inboundNatRules/join/action
- Microsoft.Network/loadBalancers/inboundNatRules/read
- Microsoft.Network/loadBalancers/inboundNatRules/write
- Microsoft.Network/loadBalancers/read
- Microsoft.Network/loadBalancers/write
- Microsoft.Network/networkInterfaces/delete
- Microsoft.Network/networkInterfaces/join/action
- Microsoft.Network/networkInterfaces/read
- Microsoft.Network/networkInterfaces/write
- Microsoft.Network/networkSecurityGroups/read
- Microsoft.Network/networkSecurityGroups/securityRules/delete
- Microsoft.Network/networkSecurityGroups/securityRules/read
- Microsoft.Network/networkSecurityGroups/securityRules/write
- Microsoft.Network/privateDnsZones/A/delete
- Microsoft.Network/privateDnsZones/A/read
- Microsoft.Network/privateDnsZones/A/write
- Microsoft.Network/privateDnsZones/delete
- Microsoft.Network/privateDnsZones/read
- Microsoft.Network/privateDnsZones/virtualNetworkLinks/delete
- Microsoft.Network/privateDnsZones/virtualNetworkLinks/read
- Microsoft.Network/privateDnsZones/virtualNetworkLinks/write
- Microsoft.Network/privateDnsZones/write
- Microsoft.Network/publicIPAddresses/delete
- Microsoft.Network/publicIPAddresses/join/action
- Microsoft.Network/publicIPAddresses/read
- Microsoft.Network/publicIPAddresses/write
- Microsoft.Network/routeTables/delete
- Microsoft.Network/routeTables/read
- Microsoft.Network/routeTables/write
- Microsoft.Network/virtualNetworks/join/action
- Microsoft.Network/virtualNetworks/read
- Microsoft.Network/virtualNetworks/subnets/join/action
- Microsoft.Network/virtualNetworks/subnets/read
- Microsoft.Resources/subscriptions/resourceGroups/read

</details>

Palette supports the following use cases for static placement: Single Cluster, Multiple Cluster – Same Resource Group, and Multiple Cluster – Same Subscription. Each use case requires the same actions but with different scope levels.

Review the following tables to learn about the actions and scope levels Palette requires for each use case.

<Tabs>


<TabItem label="Single Cluster" value="sc">

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

    | Action | Scope Level|
    |--------|------------|
    | Microsoft.Compute/disks/delete | Subscription |
    | Microsoft.Compute/disks/read | Subscription |
    | Microsoft.Compute/disks/write | Subscription |
    | Microsoft.Compute/virtualMachines/delete | Subscription |
    | Microsoft.Compute/virtualMachines/extensions/delete | Subscription |
    | Microsoft.Compute/virtualMachines/extensions/read | Subscription |
    | Microsoft.Compute/virtualMachines/extensions/write | Subscription |
    | Microsoft.Compute/virtualMachines/read | Subscription |
    | Microsoft.Compute/virtualMachines/write | Subscription |
    | Microsoft.Network/loadBalancers/backendAddressPools/join/action | Subscription |
    | Microsoft.Network/loadBalancers/delete | Subscription |
    | Microsoft.Network/loadBalancers/inboundNatRules/delete | Subscription|
    | Microsoft.Network/loadBalancers/inboundNatRules/join/action | Subscription |
    | Microsoft.Network/loadBalancers/inboundNatRules/read | Subscription |
    | Microsoft.Network/loadBalancers/inboundNatRules/write | Subscription |
    | Microsoft.Network/loadBalancers/read | Subscription |
    | Microsoft.Network/loadBalancers/write | Subscription |
    | Microsoft.Network/networkInterfaces/delete | Subscription |
    | Microsoft.Network/networkInterfaces/join/action | Subscription |
    | Microsoft.Network/networkInterfaces/read | Subscription |
    | Microsoft.Network/networkInterfaces/write | Subscription |
    | Microsoft.Network/networkSecurityGroups/read | Subscription |
    | Microsoft.Network/networkSecurityGroups/securityRules/delete | Subscription |
    | Microsoft.Network/networkSecurityGroups/securityRules/read | Subscription |
    | Microsoft.Network/networkSecurityGroups/securityRules/write | Subscription |
    | Microsoft.Network/privateDnsZones/A/delete | Subscription |
    | Microsoft.Network/privateDnsZones/A/read | Subscriptionp |
    | Microsoft.Network/privateDnsZones/A/write | Subscription |
    | Microsoft.Network/privateDnsZones/delete | Subscription |
    | Microsoft.Network/privateDnsZones/read | Subscription |
    | Microsoft.Network/privateDnsZones/virtualNetworkLinks/delete | Subscription |
    | Microsoft.Network/privateDnsZones/virtualNetworkLinks/read | Subscription |
    | Microsoft.Network/privateDnsZones/virtualNetworkLinks/write | Subscription |
    | Microsoft.Network/privateDnsZones/write | Subscription |
    | Microsoft.Network/publicIPAddresses/delete | Subscription |
    | Microsoft.Network/publicIPAddresses/join/action | Subscription |
    | Microsoft.Network/publicIPAddresses/read | Subscription |
    | Microsoft.Network/publicIPAddresses/write | Subscription |
    | Microsoft.Network/routeTables/delete | Subscription |
    | Microsoft.Network/routeTables/read | Subscription |
    | Microsoft.Network/routeTables/write | Subscription |
    | Microsoft.Network/virtualNetworks/join/action | Subscription |
    | Microsoft.Resources/subscriptions/resourceGroups/read | Subscription |
    | Microsoft.Network/virtualNetworks/read | Subscription |
    | Microsoft.Network/virtualNetworks/subnets/join/action | Subscription |
    | Microsoft.Network/virtualNetworks/subnets/read | Subscription |
    | Microsoft.Compute/galleries/images/read | Subscription |
    | Microsoft.Compute/galleries/images/versions/read| Subscription |



</TabItem>


</Tabs>








## Dynamic Placement

If you want to support dynamic placement use cases, ensure Palette has the following actions at the subscription level: 


| Actions                                             | Scope level  |
|------------------------------------------------------|--------------|
| Microsoft.Compute/disks/delete                       | Subscription |
| Microsoft.Compute/disks/read                         | Subscription |
| Microsoft.Compute/disks/write                        | Subscription |
| Microsoft.Compute/galleries/images/read              | Subscription |
| Microsoft.Compute/galleries/images/versions/read     | Subscription |
| Microsoft.Compute/galleries/images/versions/write    | Subscription |
| Microsoft.Compute/galleries/images/write             | Subscription |
| Microsoft.Compute/galleries/read                     | Subscription |
| Microsoft.Compute/galleries/write                    | Subscription |
| Microsoft.Compute/images/read                        | Subscription |
| Microsoft.Compute/images/write                       | Subscription |
| Microsoft.Compute/virtualMachines/delete             | Subscription |
| Microsoft.Compute/virtualMachines/extensions/delete  | Subscription |
| Microsoft.Compute/virtualMachines/extensions/read    | Subscription |
| Microsoft.Compute/virtualMachines/extensions/write   | Subscription |
| Microsoft.Compute/virtualMachines/read               | Subscription |
| Microsoft.Compute/virtualMachines/write              | Subscription |
| Microsoft.Network/loadBalancers/backendAddressPools/join/action | Subscription |
| Microsoft.Network/loadBalancers/delete               | Subscription |
| Microsoft.Network/loadBalancers/inboundNatRules/delete | Subscription |
| Microsoft.Network/loadBalancers/inboundNatRules/join/action | Subscription |
| Microsoft.Network/loadBalancers/inboundNatRules/read | Subscription |
| Microsoft.Network/loadBalancers/inboundNatRules/write | Subscription |
| Microsoft.Network/loadBalancers/read                 | Subscription |
| Microsoft.Network/loadBalancers/write                | Subscription |
| Microsoft.Network/networkInterfaces/delete           | Subscription |
| Microsoft.Network/networkInterfaces/join/action      | Subscription |
| Microsoft.Network/networkInterfaces/read             | Subscription |
| Microsoft.Network/networkInterfaces/write            | Subscription |
| Microsoft.Network/networkSecurityGroups/read         | Subscription |
| Microsoft.Network/networkSecurityGroups/securityRules/delete | Subscription |
| Microsoft.Network/networkSecurityGroups/securityRules/read | Subscription |
| Microsoft.Network/networkSecurityGroups/securityRules/write | Subscription |
| Microsoft.Network/privateDnsZones/A/delete           | Subscription |
| Microsoft.Network/privateDnsZones/A/read             | Subscription |
| Microsoft.Network/privateDnsZones/A/write            | Subscription |
| Microsoft.Network/privateDnsZones/delete             | Subscription |
| Microsoft.Network/privateDnsZones/read               | Subscription |
| Microsoft.Network/privateDnsZones/virtualNetworkLinks/delete | Subscription |
| Microsoft.Network/privateDnsZones/virtualNetworkLinks/read | Subscription |
| Microsoft.Network/privateDnsZones/virtualNetworkLinks/write | Subscription |
| Microsoft.Network/privateDnsZones/write              | Subscription |
| Microsoft.Network/publicIPAddresses/delete           | Subscription |
| Microsoft.Network/publicIPAddresses/join/action      | Subscription |
| Microsoft.Network/publicIPAddresses/read             | Subscription |
| Microsoft.Network/publicIPAddresses/write            | Subscription |
| Microsoft.Network/routeTables/delete                 | Subscription |
| Microsoft.Network/routeTables/read                   | Subscription |
| Microsoft.Network/routeTables/write                  | Subscription |
| Microsoft.Network/virtualNetworks/delete             | Subscription |
| Microsoft.Network/virtualNetworks/join/action        | Subscription |
| Microsoft.Network/virtualNetworks/join/action        | Subscription |
| Microsoft.Network/virtualNetworks/joinLoadBalancer/action | Subscription |
| Microsoft.Network/virtualNetworks/peer/action         | Subscription |
| Microsoft.Network/virtualNetworks/read               | Subscription |
| Microsoft.Network/virtualNetworks/subnets/delete     | Subscription |
| Microsoft.Network/virtualNetworks/subnets/join/action| Subscription |
| Microsoft.Network/virtualNetworks/subnets/joinLoadBalancer/action | Subscription |
| Microsoft.Network/virtualNetworks/subnets/read       | Subscription |
| Microsoft.Network/virtualNetworks/subnets/virtualMachines/read | Subscription |
| Microsoft.Network/virtualNetworks/subnets/write      | Subscription |
| Microsoft.Network/virtualNetworks/virtualMachines/read | Subscription |
| Microsoft.Network/virtualNetworks/virtualNetworkPeerings/delete | Subscription |
| Microsoft.Network/virtualNetworks/virtualNetworkPeerings/read | Subscription |
| Microsoft.Network/virtualNetworks/virtualNetworkPeerings/write | Subscription |
| Microsoft.Network/virtualNetworks/write              | Subscription |
| Microsoft.Resources/subscriptions/resourceGroups/read | Subscription |
| Microsoft.Storage/storageAccounts/blobServices/containers/read | Subscription |
| Microsoft.Storage/storageAccounts/blobServices/containers/write | Subscription |
| Microsoft.Storage/storageAccounts/blobServices/listKeys/action | Subscription |
| Microsoft.Storage/storageAccounts/read                | Subscription |
| Microsoft.Storage/storageAccounts/write               | Subscription |




## Validator

To use the [Validator](https://github.com/spectrocloud-labs/validator) with the [Azure plugin](https://github.com/spectrocloud-labs/validator-plugin-azure) you need the following actions to be able to ensure the roles attached to the service principal used by Validator have the required permissions:

- Microsoft.Authorization/denyAssignments/read
- Microsoft.Authorization/roleAssignments/read
- Microsoft.Authorization/roleDefinitions/read


You can use the Palette CLI to get started with the Validator. Check out the [Validator](../../../palette-cli/commands/validator.md) command reference for more information.