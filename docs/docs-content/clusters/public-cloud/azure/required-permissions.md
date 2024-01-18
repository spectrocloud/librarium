---
sidebar_label: "Required Permissions"
title: "Required Permissions"
description: "Review the required permissions for deploying clusters on Azure"
icon: ""
hide_table_of_contents: false
tags: ["public cloud", "azure", "permissions"]
sidebar_position: 100
---


Palette requires a set of permissions to properly deploy and manage the lifecycle of clusters deployed on Azure. We recommend you create a a custom role with all the required permissions for Palette or VerteX to deploy and manage clusters on Azure. Create a [role assignment](https://learn.microsoft.com/en-us/azure/role-based-access-control/role-assignments) that has the service principal you want to use with Palette and the appropriate [scope level](https://learn.microsoft.com/en-us/azure/role-based-access-control/scope-overview). By using the subscription as the scope level for the role assignment, you can ensure all use cases for Palette and VerteX are supported. 

:::warning

A custom role allows you to limit the permissions to only what is required by Palette. If you don't want to create a custom role, you can assign the Azure  build-in [Contributor](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#contributor) role to the service principal used by Palette. The Contributor role has all the required permissions, but it also has additional permissions that are not required by Palette. 

:::


The following use cases are supported:

- [Static Placement](#static-placement) - Palette will deploy clusters on a pre-existing Azure resource group.

- [Dynamic Placement](#dynamic-placement) - Palette will create a new Azure resource group and deploy clusters on it.

## Validator

To use Validator you need the foloowing permissions to be able to ensure the roles attached to the service principal used by Palette have the required permissions:

- Microsoft.Authorization/denyAssignments/read
- Microsoft.Authorization/roleAssignments/read
- Microsoft.Authorization/roleDefinitions/read




## Static Placement

If you are using a pre-existing Azure resource group, Palette requires the following permissions:


<details>
<summary>Expand to view all required actions</summary>

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

When using static placement, the following use cases are supported. 

<Tabs>


<TabItem label="Single Cluster" value="sc">

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


</TabItem>
<TabItem label="Multiple Cluster - Same Resource Group" value="sc2">

| Action | Scope Level|
|--------|------------|
| Microsoft.Compute/disks/delete | Resource Group |
|  Microsoft.Resources/subscriptions/resourceGroups/read | Subscription |


</TabItem>

<TabItem label="Multiple Cluster - Single Subscription" value="sc3">

| Action | Scope Level|
|--------|------------|
| Microsoft.Compute/disks/delete | Resource Group |
|  Microsoft.Resources/subscriptions/resourceGroups/read | Subscription |


</TabItem>


</Tabs>








## Dynamic Placement

If you are using dynamic placement, Palette requires the following permissions:

- Microsoft.Compute/disks/delete
- Microsoft.Compute/disks/read
- Microsoft.Compute/disks/write
- Microsoft.Compute/galleries/images/read
- Microsoft.Compute/galleries/images/versions/read
- Microsoft.Compute/galleries/images/versions/write
- Microsoft.Compute/galleries/images/write
- Microsoft.Compute/galleries/read
- Microsoft.Compute/galleries/write
- Microsoft.Compute/images/read
- Microsoft.Compute/images/write
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
- Microsoft.Network/virtualNetworks/delete
- Microsoft.Network/virtualNetworks/join/action
- Microsoft.Network/virtualNetworks/join/action
- Microsoft.Network/virtualNetworks/joinLoadBalancer/action
- Microsoft.Network/virtualNetworks/peer/action
- Microsoft.Network/virtualNetworks/read
- Microsoft.Network/virtualNetworks/subnets/delete
- Microsoft.Network/virtualNetworks/subnets/join/action
- Microsoft.Network/virtualNetworks/subnets/joinLoadBalancer/action
- Microsoft.Network/virtualNetworks/subnets/read
- Microsoft.Network/virtualNetworks/subnets/virtualMachines/read
- Microsoft.Network/virtualNetworks/subnets/write
- Microsoft.Network/virtualNetworks/virtualMachines/read
- Microsoft.Network/virtualNetworks/virtualNetworkPeerings/delete
- Microsoft.Network/virtualNetworks/virtualNetworkPeerings/read
- Microsoft.Network/virtualNetworks/virtualNetworkPeerings/write
- Microsoft.Network/virtualNetworks/write
- Microsoft.Resources/subscriptions/resourceGroups/read
- Microsoft.Storage/storageAccounts/blobServices/containers/read
- Microsoft.Storage/storageAccounts/blobServices/containers/write
- Microsoft.Storage/storageAccounts/blobServices/listKeys/action
- Microsoft.Storage/storageAccounts/read
- Microsoft.Storage/storageAccounts/write


