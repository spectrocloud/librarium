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

You can use the [Validator](https://github.com/spectrocloud-labs/validator) with the
[Azure plugin](https://github.com/spectrocloud-labs/validator-plugin-azure) to verify you have setup the correct
permissions. The Validator Azure plugin requires the following permissions:

- Microsoft.Authorization/denyAssignments/read
- Microsoft.Authorization/roleAssignments/read
- Microsoft.Authorization/roleDefinitions/read

You can use the Validator with the Palette CLI. Check out the Palette CLI
[Validator](../../../palette-cli/commands/validator.md) command reference page for more information.

:::

## Dynamic Placement

Dynamic placement is the default method for deploying Azure clusters through Palette. With dynamic placement, Palette
dynamically creates the network resources required for your cluster.

| Actions                                                           | Scope level  |
| ----------------------------------------------------------------- | ------------ |
| Microsoft.Compute/disks/delete                                    | Subscription |
| Microsoft.Compute/disks/read                                      | Subscription |
| Microsoft.Compute/disks/write                                     | Subscription |
| Microsoft.Compute/galleries/images/read                           | Subscription |
| Microsoft.Compute/galleries/images/versions/read                  | Subscription |
| Microsoft.Compute/galleries/images/versions/write                 | Subscription |
| Microsoft.Compute/galleries/images/write                          | Subscription |
| Microsoft.Compute/galleries/read                                  | Subscription |
| Microsoft.Compute/galleries/write                                 | Subscription |
| Microsoft.Compute/images/read                                     | Subscription |
| Microsoft.Compute/images/write                                    | Subscription |
| Microsoft.Compute/virtualMachines/delete                          | Subscription |
| Microsoft.Compute/virtualMachines/extensions/delete               | Subscription |
| Microsoft.Compute/virtualMachines/extensions/read                 | Subscription |
| Microsoft.Compute/virtualMachines/extensions/write                | Subscription |
| Microsoft.Compute/virtualMachines/read                            | Subscription |
| Microsoft.Compute/virtualMachines/write                           | Subscription |
| Microsoft.Network/loadBalancers/backendAddressPools/join/action   | Subscription |
| Microsoft.Network/loadBalancers/delete                            | Subscription |
| Microsoft.Network/loadBalancers/inboundNatRules/delete            | Subscription |
| Microsoft.Network/loadBalancers/inboundNatRules/join/action       | Subscription |
| Microsoft.Network/loadBalancers/inboundNatRules/read              | Subscription |
| Microsoft.Network/loadBalancers/inboundNatRules/write             | Subscription |
| Microsoft.Network/loadBalancers/read                              | Subscription |
| Microsoft.Network/loadBalancers/write                             | Subscription |
| Microsoft.Network/networkInterfaces/delete                        | Subscription |
| Microsoft.Network/networkInterfaces/join/action                   | Subscription |
| Microsoft.Network/networkInterfaces/read                          | Subscription |
| Microsoft.Network/networkInterfaces/write                         | Subscription |
| Microsoft.Network/networkSecurityGroups/read                      | Subscription |
| Microsoft.Network/networkSecurityGroups/securityRules/delete      | Subscription |
| Microsoft.Network/networkSecurityGroups/securityRules/read        | Subscription |
| Microsoft.Network/networkSecurityGroups/securityRules/write       | Subscription |
| Microsoft.Network/privateDnsZones/A/delete                        | Subscription |
| Microsoft.Network/privateDnsZones/A/read                          | Subscription |
| Microsoft.Network/privateDnsZones/A/write                         | Subscription |
| Microsoft.Network/privateDnsZones/delete                          | Subscription |
| Microsoft.Network/privateDnsZones/read                            | Subscription |
| Microsoft.Network/privateDnsZones/virtualNetworkLinks/delete      | Subscription |
| Microsoft.Network/privateDnsZones/virtualNetworkLinks/read        | Subscription |
| Microsoft.Network/privateDnsZones/virtualNetworkLinks/write       | Subscription |
| Microsoft.Network/privateDnsZones/write                           | Subscription |
| Microsoft.Network/publicIPAddresses/delete                        | Subscription |
| Microsoft.Network/publicIPAddresses/join/action                   | Subscription |
| Microsoft.Network/publicIPAddresses/read                          | Subscription |
| Microsoft.Network/publicIPAddresses/write                         | Subscription |
| Microsoft.Network/routeTables/delete                              | Subscription |
| Microsoft.Network/routeTables/read                                | Subscription |
| Microsoft.Network/routeTables/write                               | Subscription |
| Microsoft.Network/virtualNetworks/delete                          | Subscription |
| Microsoft.Network/virtualNetworks/join/action                     | Subscription |
| Microsoft.Network/virtualNetworks/join/action                     | Subscription |
| Microsoft.Network/virtualNetworks/joinLoadBalancer/action         | Subscription |
| Microsoft.Network/virtualNetworks/peer/action                     | Subscription |
| Microsoft.Network/virtualNetworks/read                            | Subscription |
| Microsoft.Network/virtualNetworks/subnets/delete                  | Subscription |
| Microsoft.Network/virtualNetworks/subnets/join/action             | Subscription |
| Microsoft.Network/virtualNetworks/subnets/joinLoadBalancer/action | Subscription |
| Microsoft.Network/virtualNetworks/subnets/read                    | Subscription |
| Microsoft.Network/virtualNetworks/subnets/virtualMachines/read    | Subscription |
| Microsoft.Network/virtualNetworks/subnets/write                   | Subscription |
| Microsoft.Network/virtualNetworks/virtualMachines/read            | Subscription |
| Microsoft.Network/virtualNetworks/virtualNetworkPeerings/delete   | Subscription |
| Microsoft.Network/virtualNetworks/virtualNetworkPeerings/read     | Subscription |
| Microsoft.Network/virtualNetworks/virtualNetworkPeerings/write    | Subscription |
| Microsoft.Network/virtualNetworks/write                           | Subscription |
| Microsoft.Resources/subscriptions/resourceGroups/read             | Subscription |
| Microsoft.Storage/storageAccounts/blobServices/containers/read    | Subscription |
| Microsoft.Storage/storageAccounts/blobServices/containers/write   | Subscription |
| Microsoft.Storage/storageAccounts/blobServices/listKeys/action    | Subscription |
| Microsoft.Storage/storageAccounts/read                            | Subscription |
| Microsoft.Storage/storageAccounts/write                           | Subscription |

## Static Placement

Choose static placement when you want Palette to use pre-existing network resource groups, VNets, subnets, and security
groups. Review the table below for the required actions and the different scope levels for each use case.

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
