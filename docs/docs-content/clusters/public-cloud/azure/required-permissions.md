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

You can use [Validator](https://github.com/validator-labs/validator) with its
[Azure plugin](https://github.com/validator-labs/validator-plugin-azure) to verify you have setup the correct
permissions. The Validator Azure plugin requires the following permissions:

- Microsoft.Authorization/denyAssignments/read
- Microsoft.Authorization/roleAssignments/read
- Microsoft.Authorization/roleDefinitions/read

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

1. Open a terminal or command prompt. Export your Azure subscription ID to a variable.

   ```shell
   export SUBSCRIPTION_ID=<your-subscription-id>
   ```

2. Issue the following command to create a JSON file containing all the permissions that must be applied at the virtual
   network scope level.

   ```shell
   cat << EOF > iaas_static_vnet_role.json
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
   EOF
   ```

3. Next, create a JSON file for the permissions that must be applied at the resource group or subscription scope level.
   Issue the following command to create the JSON file.

   ```shell
   cat << EOF > iaas_static_rg_sub_role.json
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
   EOF
   ```

4. Create a role for each of the JSON files you created in the previous steps. Issue the following commands to create
   the roles.

   ```shell
   az role definition create --role-definition @iaas_static_vnet_role.json --output table
   az role definition create --role-definition @iaas_static_rg_sub_role.json --output table
   ```

5. Export the client ID of the
   [service principal](https://learn.microsoft.com/en-us/azure/role-based-access-control/overview#security-principal)
   you want to use with Palette to a variable.

   ```shell
   export ASSIGNEE="<service_principal_client_id>"
   ```

6. Export the resource group name and virtual network name to a variable.

   ```shell
   export RESOURCE_GROUP_NAME="<resource-group-name>"
   export VNET_NAME="<vnet-name>"
   ```

7. Assign the roles to the service principal. Use the following commands to assign the roles.

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

1. Open a terminal or command prompt. Export your Azure subscription ID to a variable.

   ```shell
   export SUBSCRIPTION_ID=<your-subscription-id>
   ```

2. Issue the following command to create a JSON file containing all the required permissions to create resources.

   ```shell
   cat << EOF > iaas_dynamic_rg_sub_role.json
   {
     "Name": "Palette Dynamic Placement IaaS Cluster Deployer (rg/sub)",
     "IsCustom": true,
     "Description": "Can use Palette to deploy IaaS clusters using dynamic placement. This role contains the permissions that must be applied at the resource group scope level. If deploying multiple clusters in a variety of resource groups within a subscription, apply the role with the subscription as scope instead of the resource group as scope.",
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
     "AssignableScopes": [
       "/subscriptions/$SUBSCRIPTION_ID"
     ]
   }
   EOF
   ```

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

1. Open a terminal or command prompt. Export your Azure subscription ID to a variable.

   ```shell
   export SUBSCRIPTION_ID=<your-subscription-id>
   ```

2. Issue the following command to create a JSON file containing all the permissions that must be applied at the virtual
   network scope level.

   ```shell
   cat << EOF > aks_static_vnet_role.json
   {
     "Name": "Palette Static Placement AKS Cluster Deployer (vnet)",
     "IsCustom": true,
     "Description": "Can use Palette to deploy AKS clusters using static placement. This role contains the permissions that must be applied at the virtual network scope level.",
     "Actions": [
       "Microsoft.Network/virtualNetworks/read",
       "Microsoft.Network/virtualNetworks/subnets/join/action",
       "Microsoft.Network/virtualNetworks/subnets/read"
     ],
     "NotActions": [],
     "AssignableScopes": [
       "/subscriptions/$SUBSCRIPTION_ID"
     ]
   }
   EOF
   ```

3. Create a JSON file for the permissions that must be applied at the subscription scope level. Issue the following
   command to create the JSON file.

   ```shell
   cat << EOF > aks_static_sub_role.json
   {
    "Name": "Palette Static Placement AKS Cluster Deployer (sub)",
    "IsCustom": true,
    "Description": "Can use Palette to deploy AKS clusters using static placement. This role contains the permissions that must be applied at the subscription scope level.",
    "Actions": [
      "Microsoft.Compute/virtualMachineScaleSets/extensions/read",
      "Microsoft.Compute/virtualMachineScaleSets/extensions/roles/read",
      "Microsoft.Compute/virtualMachineScaleSets/instanceView/read",
      "Microsoft.Compute/virtualMachineScaleSets/networkInterfaces/read",
      "Microsoft.Compute/virtualMachineScaleSets/osUpgradeHistory/read",
      "Microsoft.Compute/virtualMachineScaleSets/providers/Microsoft.Insights/diagnosticSettings/read",
      "Microsoft.Compute/virtualMachineScaleSets/providers/Microsoft.Insights/logDefinitions/read",
      "Microsoft.Compute/virtualMachineScaleSets/providers/Microsoft.Insights/metricDefinitions/read",
      "Microsoft.Compute/virtualMachineScaleSets/publicIPAddresses/read",
      "Microsoft.Compute/virtualMachineScaleSets/read",
      "Microsoft.Compute/virtualMachineScaleSets/rollingUpgrades/read",
      "Microsoft.Compute/virtualMachineScaleSets/skus/read",
      "Microsoft.Compute/virtualMachineScaleSets/virtualMachines/extensions/read",
      "Microsoft.Compute/virtualMachineScaleSets/virtualMachines/instanceView/read",
      "Microsoft.Compute/virtualMachineScaleSets/virtualMachines/networkInterfaces/ipConfigurations/publicIPAddresses/read",
      "Microsoft.Compute/virtualMachineScaleSets/virtualMachines/networkInterfaces/ipConfigurations/read",
      "Microsoft.Compute/virtualMachineScaleSets/virtualMachines/networkInterfaces/read",
      "Microsoft.Compute/virtualMachineScaleSets/virtualMachines/providers/Microsoft.Insights/metricDefinitions/read",
      "Microsoft.Compute/virtualMachineScaleSets/virtualMachines/read",
      "Microsoft.Compute/virtualMachineScaleSets/virtualMachines/runCommands/read",
      "Microsoft.Compute/virtualMachineScaleSets/vmSizes/read"
    ],
    "NotActions": [],
    "AssignableScopes": [
      "/subscriptions/$SUBSCRIPTION_ID"
    ]
   }
   EOF
   ```

4. Create another JSON file for the remaining permissions required by AKS.

   ```shell
   cat << EOF > aks_static_rg_sub_role.json
   {
     "Name": "Palette Static Placement AKS Cluster Deployer (rg/sub)",
     "IsCustom": true,
     "Description": "Can use Palette to deploy AKS clusters using static placement. This role contains the permissions that must be applied at the resource group scope level. If deploying multiple clusters in a variety of resource groups within a subscription, apply the role with the subscription as scope instead of the resource group as scope.",
     "Actions": [
       "Microsoft.Authorization/classicAdministrators/operationstatuses/read",
       "Microsoft.Authorization/classicAdministrators/read",
       "Microsoft.Authorization/denyAssignments/read",
       "Microsoft.Authorization/diagnosticSettings/read",
       "Microsoft.Authorization/diagnosticSettingsCategories/read",
       "Microsoft.Authorization/locks/read",
       "Microsoft.Authorization/operations/read",
       "Microsoft.Authorization/permissions/read",
       "Microsoft.Authorization/policyAssignments/privateLinkAssociations/read",
       "Microsoft.Authorization/policyAssignments/read",
       "Microsoft.Authorization/policyAssignments/resourceManagementPrivateLinks/privateEndpointConnectionProxies/read",
       "Microsoft.Authorization/policyAssignments/resourceManagementPrivateLinks/privateEndpointConnections/read",
       "Microsoft.Authorization/policyAssignments/resourceManagementPrivateLinks/read",
       "Microsoft.Authorization/policyDefinitions/read",
       "Microsoft.Authorization/policyExemptions/read",
       "Microsoft.Authorization/policySetDefinitions/read",
       "Microsoft.Authorization/providerOperations/read",
       "Microsoft.Authorization/roleAssignments/read",
       "Microsoft.Authorization/roleAssignments/write",
       "Microsoft.Authorization/roleAssignmentScheduleInstances/read",
       "Microsoft.Authorization/roleAssignmentScheduleRequests/read",
       "Microsoft.Authorization/roleAssignmentSchedules/read",
       "Microsoft.Authorization/roleDefinitions/read",
       "Microsoft.Authorization/roleEligibilityScheduleInstances/read",
       "Microsoft.Authorization/roleEligibilityScheduleRequests/read",
       "Microsoft.Authorization/roleEligibilitySchedules/read",
       "Microsoft.Authorization/roleManagementPolicies/read",
       "Microsoft.Authorization/roleManagementPolicyAssignments/read",
       "Microsoft.ContainerService/locations/guardrailsVersions/read",
       "Microsoft.ContainerService/locations/kubernetesversions/read",
       "Microsoft.ContainerService/locations/meshRevisionProfiles/read",
       "Microsoft.ContainerService/locations/nodeimageversions/read",
       "Microsoft.ContainerService/locations/operationresults/read",
       "Microsoft.ContainerService/locations/operations/read",
       "Microsoft.ContainerService/locations/orchestrators/read",
       "Microsoft.ContainerService/locations/osOptions/read",
       "Microsoft.ContainerService/locations/safeguardsVersions/read",
       "Microsoft.ContainerService/locations/usages/read",
       "Microsoft.ContainerService/managedClusters/abort/action",
       "Microsoft.ContainerService/managedClusters/accessProfiles/listCredential/action",
       "Microsoft.ContainerService/managedClusters/accessProfiles/read",
       "Microsoft.ContainerService/managedClusters/admissionregistration.k8s.io/initializerconfigurations/delete",
       "Microsoft.ContainerService/managedClusters/admissionregistration.k8s.io/initializerconfigurations/read",
       "Microsoft.ContainerService/managedClusters/admissionregistration.k8s.io/initializerconfigurations/write",
       "Microsoft.ContainerService/managedClusters/admissionregistration.k8s.io/mutatingwebhookconfigurations/delete",
       "Microsoft.ContainerService/managedClusters/admissionregistration.k8s.io/mutatingwebhookconfigurations/read",
       "Microsoft.ContainerService/managedClusters/admissionregistration.k8s.io/mutatingwebhookconfigurations/write",
       "Microsoft.ContainerService/managedClusters/admissionregistration.k8s.io/validatingwebhookconfigurations/delete",
       "Microsoft.ContainerService/managedClusters/admissionregistration.k8s.io/validatingwebhookconfigurations/read",
       "Microsoft.ContainerService/managedClusters/admissionregistration.k8s.io/validatingwebhookconfigurations/write",
       "Microsoft.ContainerService/managedClusters/agentPools/abort/action",
       "Microsoft.ContainerService/managedClusters/agentPools/delete",
       "Microsoft.ContainerService/managedClusters/agentPools/read",
       "Microsoft.ContainerService/managedClusters/agentPools/upgradeNodeImageVersion/action",
       "Microsoft.ContainerService/managedClusters/agentPools/upgradeNodeImageVersion/write",
       "Microsoft.ContainerService/managedClusters/agentPools/upgradeProfiles/read",
       "Microsoft.ContainerService/managedClusters/agentPools/write",
       "Microsoft.ContainerService/managedClusters/api/read",
       "Microsoft.ContainerService/managedClusters/api/v1/read",
       "Microsoft.ContainerService/managedClusters/apiextensions.k8s.io/customresourcedefinitions/delete",
       "Microsoft.ContainerService/managedClusters/apiextensions.k8s.io/customresourcedefinitions/read",
       "Microsoft.ContainerService/managedClusters/apiextensions.k8s.io/customresourcedefinitions/write",
       "Microsoft.ContainerService/managedClusters/apiregistration.k8s.io/apiservices/delete",
       "Microsoft.ContainerService/managedClusters/apiregistration.k8s.io/apiservices/read",
       "Microsoft.ContainerService/managedClusters/apiregistration.k8s.io/apiservices/write",
       "Microsoft.ContainerService/managedClusters/apis/admissionregistration.k8s.io/read",
       "Microsoft.ContainerService/managedClusters/apis/admissionregistration.k8s.io/v1/read",
       "Microsoft.ContainerService/managedClusters/apis/admissionregistration.k8s.io/v1beta1/read",
       "Microsoft.ContainerService/managedClusters/apis/apiextensions.k8s.io/read",
       "Microsoft.ContainerService/managedClusters/apis/apiextensions.k8s.io/v1/read",
       "Microsoft.ContainerService/managedClusters/apis/apiextensions.k8s.io/v1beta1/read",
       "Microsoft.ContainerService/managedClusters/apis/apiregistration.k8s.io/read",
       "Microsoft.ContainerService/managedClusters/apis/apiregistration.k8s.io/v1/read",
       "Microsoft.ContainerService/managedClusters/apis/apiregistration.k8s.io/v1beta1/read",
       "Microsoft.ContainerService/managedClusters/apis/apps/read",
       "Microsoft.ContainerService/managedClusters/apis/apps/v1/read",
       "Microsoft.ContainerService/managedClusters/apis/apps/v1beta1/read",
       "Microsoft.ContainerService/managedClusters/apis/apps/v1beta2/read",
       "Microsoft.ContainerService/managedClusters/apis/authentication.k8s.io/read",
       "Microsoft.ContainerService/managedClusters/apis/authentication.k8s.io/v1/read",
       "Microsoft.ContainerService/managedClusters/apis/authentication.k8s.io/v1beta1/read",
       "Microsoft.ContainerService/managedClusters/apis/authorization.k8s.io/read",
       "Microsoft.ContainerService/managedClusters/apis/authorization.k8s.io/v1/read",
       "Microsoft.ContainerService/managedClusters/apis/authorization.k8s.io/v1beta1/read",
       "Microsoft.ContainerService/managedClusters/apis/autoscaling/read",
       "Microsoft.ContainerService/managedClusters/apis/autoscaling/v1/read",
       "Microsoft.ContainerService/managedClusters/apis/autoscaling/v2beta1/read",
       "Microsoft.ContainerService/managedClusters/apis/autoscaling/v2beta2/read",
       "Microsoft.ContainerService/managedClusters/apis/batch/read",
       "Microsoft.ContainerService/managedClusters/apis/batch/v1/read",
       "Microsoft.ContainerService/managedClusters/apis/batch/v1beta1/read",
       "Microsoft.ContainerService/managedClusters/apis/certificates.k8s.io/read",
       "Microsoft.ContainerService/managedClusters/apis/certificates.k8s.io/v1beta1/read",
       "Microsoft.ContainerService/managedClusters/apis/coordination.k8s.io/read",
       "Microsoft.ContainerService/managedClusters/apis/coordination.k8s.io/v1/read",
       "Microsoft.ContainerService/managedClusters/apis/coordination.k8s.io/v1beta1/read",
       "Microsoft.ContainerService/managedClusters/apis/events.k8s.io/read",
       "Microsoft.ContainerService/managedClusters/apis/events.k8s.io/v1beta1/read",
       "Microsoft.ContainerService/managedClusters/apis/extensions/read",
       "Microsoft.ContainerService/managedClusters/apis/extensions/v1beta1/read",
       "Microsoft.ContainerService/managedClusters/apis/metrics.k8s.io/read",
       "Microsoft.ContainerService/managedClusters/apis/metrics.k8s.io/v1beta1/read",
       "Microsoft.ContainerService/managedClusters/apis/networking.k8s.io/read",
       "Microsoft.ContainerService/managedClusters/apis/networking.k8s.io/v1/read",
       "Microsoft.ContainerService/managedClusters/apis/networking.k8s.io/v1beta1/read",
       "Microsoft.ContainerService/managedClusters/apis/node.k8s.io/read",
       "Microsoft.ContainerService/managedClusters/apis/node.k8s.io/v1beta1/read",
       "Microsoft.ContainerService/managedClusters/apis/policy/read",
       "Microsoft.ContainerService/managedClusters/apis/policy/v1beta1/read",
       "Microsoft.ContainerService/managedClusters/apis/rbac.authorization.k8s.io/read",
       "Microsoft.ContainerService/managedClusters/apis/rbac.authorization.k8s.io/v1/read",
       "Microsoft.ContainerService/managedClusters/apis/rbac.authorization.k8s.io/v1beta1/read",
       "Microsoft.ContainerService/managedClusters/apis/read",
       "Microsoft.ContainerService/managedClusters/apis/scheduling.k8s.io/read",
       "Microsoft.ContainerService/managedClusters/apis/scheduling.k8s.io/v1/read",
       "Microsoft.ContainerService/managedClusters/apis/scheduling.k8s.io/v1beta1/read",
       "Microsoft.ContainerService/managedClusters/apis/storage.k8s.io/read",
       "Microsoft.ContainerService/managedClusters/apis/storage.k8s.io/v1/read",
       "Microsoft.ContainerService/managedClusters/apis/storage.k8s.io/v1beta1/read",
       "Microsoft.ContainerService/managedClusters/apps/controllerrevisions/delete",
       "Microsoft.ContainerService/managedClusters/apps/controllerrevisions/read",
       "Microsoft.ContainerService/managedClusters/apps/controllerrevisions/write",
       "Microsoft.ContainerService/managedClusters/apps/daemonsets/delete",
       "Microsoft.ContainerService/managedClusters/apps/daemonsets/read",
       "Microsoft.ContainerService/managedClusters/apps/daemonsets/write",
       "Microsoft.ContainerService/managedClusters/apps/deployments/delete",
       "Microsoft.ContainerService/managedClusters/apps/deployments/read",
       "Microsoft.ContainerService/managedClusters/apps/deployments/write",
       "Microsoft.ContainerService/managedClusters/apps/replicasets/delete",
       "Microsoft.ContainerService/managedClusters/apps/replicasets/read",
       "Microsoft.ContainerService/managedClusters/apps/replicasets/write",
       "Microsoft.ContainerService/managedClusters/apps/statefulsets/delete",
       "Microsoft.ContainerService/managedClusters/apps/statefulsets/read",
       "Microsoft.ContainerService/managedClusters/apps/statefulsets/write",
       "Microsoft.ContainerService/managedClusters/authentication.k8s.io/tokenreviews/write",
       "Microsoft.ContainerService/managedClusters/authentication.k8s.io/userextras/impersonate/action",
       "Microsoft.ContainerService/managedClusters/authorization.k8s.io/localsubjectaccessreviews/write",
       "Microsoft.ContainerService/managedClusters/authorization.k8s.io/selfsubjectaccessreviews/write",
       "Microsoft.ContainerService/managedClusters/authorization.k8s.io/selfsubjectrulesreviews/write",
       "Microsoft.ContainerService/managedClusters/authorization.k8s.io/subjectaccessreviews/write",
       "Microsoft.ContainerService/managedClusters/autoscaling/horizontalpodautoscalers/delete",
       "Microsoft.ContainerService/managedClusters/autoscaling/horizontalpodautoscalers/read",
       "Microsoft.ContainerService/managedClusters/autoscaling/horizontalpodautoscalers/write",
       "Microsoft.ContainerService/managedClusters/availableAgentPoolVersions/read",
       "Microsoft.ContainerService/managedClusters/batch/cronjobs/delete",
       "Microsoft.ContainerService/managedClusters/batch/cronjobs/read",
       "Microsoft.ContainerService/managedClusters/batch/cronjobs/write",
       "Microsoft.ContainerService/managedClusters/batch/jobs/delete",
       "Microsoft.ContainerService/managedClusters/batch/jobs/read",
       "Microsoft.ContainerService/managedClusters/batch/jobs/write",
       "Microsoft.ContainerService/managedClusters/bindings/write",
       "Microsoft.ContainerService/managedClusters/certificates.k8s.io/certificatesigningrequests/delete",
       "Microsoft.ContainerService/managedClusters/certificates.k8s.io/certificatesigningrequests/read",
       "Microsoft.ContainerService/managedClusters/certificates.k8s.io/certificatesigningrequests/write",
       "Microsoft.ContainerService/managedClusters/cluster.kubernetes-fleet.io/internalmemberclusters/delete",
       "Microsoft.ContainerService/managedClusters/cluster.kubernetes-fleet.io/internalmemberclusters/read",
       "Microsoft.ContainerService/managedClusters/cluster.kubernetes-fleet.io/internalmemberclusters/write",
       "Microsoft.ContainerService/managedClusters/cluster.kubernetes-fleet.io/memberclusters/delete",
       "Microsoft.ContainerService/managedClusters/cluster.kubernetes-fleet.io/memberclusters/read",
       "Microsoft.ContainerService/managedClusters/cluster.kubernetes-fleet.io/memberclusters/write",
       "Microsoft.ContainerService/managedClusters/commandResults/read",
       "Microsoft.ContainerService/managedClusters/componentstatuses/delete",
       "Microsoft.ContainerService/managedClusters/componentstatuses/read",
       "Microsoft.ContainerService/managedClusters/componentstatuses/write",
       "Microsoft.ContainerService/managedClusters/configmaps/delete",
       "Microsoft.ContainerService/managedClusters/configmaps/read",
       "Microsoft.ContainerService/managedClusters/configmaps/write",
       "Microsoft.ContainerService/managedClusters/coordination.k8s.io/leases/delete",
       "Microsoft.ContainerService/managedClusters/coordination.k8s.io/leases/read",
       "Microsoft.ContainerService/managedClusters/coordination.k8s.io/leases/write",
       "Microsoft.ContainerService/managedClusters/delete",
       "Microsoft.ContainerService/managedClusters/detectors/read",
       "Microsoft.ContainerService/managedClusters/diagnosticsState/read",
       "Microsoft.ContainerService/managedClusters/discovery.k8s.io/endpointslices/delete",
       "Microsoft.ContainerService/managedClusters/discovery.k8s.io/endpointslices/read",
       "Microsoft.ContainerService/managedClusters/discovery.k8s.io/endpointslices/write",
       "Microsoft.ContainerService/managedClusters/endpoints/delete",
       "Microsoft.ContainerService/managedClusters/endpoints/read",
       "Microsoft.ContainerService/managedClusters/endpoints/write",
       "Microsoft.ContainerService/managedClusters/eventGridFilters/delete",
       "Microsoft.ContainerService/managedClusters/eventGridFilters/read",
       "Microsoft.ContainerService/managedClusters/eventGridFilters/write",
       "Microsoft.ContainerService/managedClusters/events.k8s.io/events/delete",
       "Microsoft.ContainerService/managedClusters/events.k8s.io/events/read",
       "Microsoft.ContainerService/managedClusters/events.k8s.io/events/write",
       "Microsoft.ContainerService/managedClusters/events/delete",
       "Microsoft.ContainerService/managedClusters/events/read",
       "Microsoft.ContainerService/managedClusters/events/write",
       "Microsoft.ContainerService/managedClusters/extensionaddons/delete",
       "Microsoft.ContainerService/managedClusters/extensionaddons/read",
       "Microsoft.ContainerService/managedClusters/extensionaddons/write",
       "Microsoft.ContainerService/managedClusters/extensions/daemonsets/delete",
       "Microsoft.ContainerService/managedClusters/extensions/daemonsets/read",
       "Microsoft.ContainerService/managedClusters/extensions/daemonsets/write",
       "Microsoft.ContainerService/managedClusters/extensions/deployments/delete",
       "Microsoft.ContainerService/managedClusters/extensions/deployments/read",
       "Microsoft.ContainerService/managedClusters/extensions/deployments/write",
       "Microsoft.ContainerService/managedClusters/extensions/ingresses/delete",
       "Microsoft.ContainerService/managedClusters/extensions/ingresses/read",
       "Microsoft.ContainerService/managedClusters/extensions/ingresses/write",
       "Microsoft.ContainerService/managedClusters/extensions/networkpolicies/delete",
       "Microsoft.ContainerService/managedClusters/extensions/networkpolicies/read",
       "Microsoft.ContainerService/managedClusters/extensions/networkpolicies/write",
       "Microsoft.ContainerService/managedClusters/extensions/podsecuritypolicies/delete",
       "Microsoft.ContainerService/managedClusters/extensions/podsecuritypolicies/read",
       "Microsoft.ContainerService/managedClusters/extensions/podsecuritypolicies/write",
       "Microsoft.ContainerService/managedClusters/extensions/replicasets/delete",
       "Microsoft.ContainerService/managedClusters/extensions/replicasets/read",
       "Microsoft.ContainerService/managedClusters/extensions/replicasets/write",
       "Microsoft.ContainerService/managedClusters/flowcontrol.apiserver.k8s.io/flowschemas/delete",
       "Microsoft.ContainerService/managedClusters/flowcontrol.apiserver.k8s.io/flowschemas/read",
       "Microsoft.ContainerService/managedClusters/flowcontrol.apiserver.k8s.io/flowschemas/write",
       "Microsoft.ContainerService/managedClusters/flowcontrol.apiserver.k8s.io/prioritylevelconfigurations/delete",
       "Microsoft.ContainerService/managedClusters/flowcontrol.apiserver.k8s.io/prioritylevelconfigurations/read",
       "Microsoft.ContainerService/managedClusters/flowcontrol.apiserver.k8s.io/prioritylevelconfigurations/write",
       "Microsoft.ContainerService/managedClusters/groups/impersonate/action",
       "Microsoft.ContainerService/managedClusters/healthz/autoregister-completion/read",
       "Microsoft.ContainerService/managedClusters/healthz/etcd/read",
       "Microsoft.ContainerService/managedClusters/healthz/log/read",
       "Microsoft.ContainerService/managedClusters/healthz/ping/read",
       "Microsoft.ContainerService/managedClusters/healthz/poststarthook/apiservice-openapi-controller/read",
       "Microsoft.ContainerService/managedClusters/healthz/poststarthook/apiservice-registration-controller/read",
       "Microsoft.ContainerService/managedClusters/healthz/poststarthook/apiservice-status-available-controller/read",
       "Microsoft.ContainerService/managedClusters/healthz/poststarthook/bootstrap-controller/read",
       "Microsoft.ContainerService/managedClusters/healthz/poststarthook/ca-registration/read",
       "Microsoft.ContainerService/managedClusters/healthz/poststarthook/crd-informer-synced/read",
       "Microsoft.ContainerService/managedClusters/healthz/poststarthook/generic-apiserver-start-informers/read",
       "Microsoft.ContainerService/managedClusters/healthz/poststarthook/kube-apiserver-autoregistration/read",
       "Microsoft.ContainerService/managedClusters/healthz/poststarthook/rbac/bootstrap-roles/read",
       "Microsoft.ContainerService/managedClusters/healthz/poststarthook/scheduling/bootstrap-system-priority-classes/read",
       "Microsoft.ContainerService/managedClusters/healthz/poststarthook/start-apiextensions-controllers/read",
       "Microsoft.ContainerService/managedClusters/healthz/poststarthook/start-apiextensions-informers/read",
       "Microsoft.ContainerService/managedClusters/healthz/poststarthook/start-kube-aggregator-informers/read",
       "Microsoft.ContainerService/managedClusters/healthz/poststarthook/start-kube-apiserver-admission-initializer/read",
       "Microsoft.ContainerService/managedClusters/healthz/read",
       "Microsoft.ContainerService/managedClusters/limitranges/delete",
       "Microsoft.ContainerService/managedClusters/limitranges/read",
       "Microsoft.ContainerService/managedClusters/limitranges/write",
       "Microsoft.ContainerService/managedClusters/listClusterAdminCredential/action",
       "Microsoft.ContainerService/managedClusters/listClusterMonitoringUserCredential/action",
       "Microsoft.ContainerService/managedClusters/listClusterUserCredential/action",
       "Microsoft.ContainerService/managedClusters/livez/autoregister-completion/read",
       "Microsoft.ContainerService/managedClusters/livez/etcd/read",
       "Microsoft.ContainerService/managedClusters/livez/log/read",
       "Microsoft.ContainerService/managedClusters/livez/ping/read",
       "Microsoft.ContainerService/managedClusters/livez/poststarthook/apiservice-openapi-controller/read",
       "Microsoft.ContainerService/managedClusters/livez/poststarthook/apiservice-registration-controller/read",
       "Microsoft.ContainerService/managedClusters/livez/poststarthook/apiservice-status-available-controller/read",
       "Microsoft.ContainerService/managedClusters/livez/poststarthook/bootstrap-controller/read",
       "Microsoft.ContainerService/managedClusters/livez/poststarthook/ca-registration/read",
       "Microsoft.ContainerService/managedClusters/livez/poststarthook/crd-informer-synced/read",
       "Microsoft.ContainerService/managedClusters/livez/poststarthook/generic-apiserver-start-informers/read",
       "Microsoft.ContainerService/managedClusters/livez/poststarthook/kube-apiserver-autoregistration/read",
       "Microsoft.ContainerService/managedClusters/livez/poststarthook/rbac/bootstrap-roles/read",
       "Microsoft.ContainerService/managedClusters/livez/poststarthook/scheduling/bootstrap-system-priority-classes/read",
       "Microsoft.ContainerService/managedClusters/livez/poststarthook/start-apiextensions-controllers/read",
       "Microsoft.ContainerService/managedClusters/livez/poststarthook/start-apiextensions-informers/read",
       "Microsoft.ContainerService/managedClusters/livez/poststarthook/start-kube-aggregator-informers/read",
       "Microsoft.ContainerService/managedClusters/livez/poststarthook/start-kube-apiserver-admission-initializer/read",
       "Microsoft.ContainerService/managedClusters/livez/read",
       "Microsoft.ContainerService/managedClusters/loadBalancers/delete",
       "Microsoft.ContainerService/managedClusters/loadBalancers/read",
       "Microsoft.ContainerService/managedClusters/loadBalancers/write",
       "Microsoft.ContainerService/managedClusters/logs/read",
       "Microsoft.ContainerService/managedClusters/maintenanceConfigurations/delete",
       "Microsoft.ContainerService/managedClusters/maintenanceConfigurations/read",
       "Microsoft.ContainerService/managedClusters/maintenanceConfigurations/write",
       "Microsoft.ContainerService/managedClusters/meshUpgradeProfiles/read",
       "Microsoft.ContainerService/managedClusters/metrics.k8s.io/nodes/read",
       "Microsoft.ContainerService/managedClusters/metrics.k8s.io/pods/read",
       "Microsoft.ContainerService/managedClusters/metrics/read",
       "Microsoft.ContainerService/managedClusters/namespaces/delete",
       "Microsoft.ContainerService/managedClusters/namespaces/read",
       "Microsoft.ContainerService/managedClusters/namespaces/write",
       "Microsoft.ContainerService/managedClusters/networking.k8s.io/ingressclasses/delete",
       "Microsoft.ContainerService/managedClusters/networking.k8s.io/ingressclasses/read",
       "Microsoft.ContainerService/managedClusters/networking.k8s.io/ingressclasses/write",
       "Microsoft.ContainerService/managedClusters/networking.k8s.io/ingresses/delete",
       "Microsoft.ContainerService/managedClusters/networking.k8s.io/ingresses/read",
       "Microsoft.ContainerService/managedClusters/networking.k8s.io/ingresses/write",
       "Microsoft.ContainerService/managedClusters/networking.k8s.io/networkpolicies/delete",
       "Microsoft.ContainerService/managedClusters/networking.k8s.io/networkpolicies/read",
       "Microsoft.ContainerService/managedClusters/networking.k8s.io/networkpolicies/write",
       "Microsoft.ContainerService/managedClusters/networkSecurityPerimeterAssociationProxies/delete",
       "Microsoft.ContainerService/managedClusters/networkSecurityPerimeterAssociationProxies/read",
       "Microsoft.ContainerService/managedClusters/networkSecurityPerimeterAssociationProxies/write",
       "Microsoft.ContainerService/managedClusters/networkSecurityPerimeterConfigurations/read",
       "Microsoft.ContainerService/managedClusters/node.k8s.io/runtimeclasses/delete",
       "Microsoft.ContainerService/managedClusters/node.k8s.io/runtimeclasses/read",
       "Microsoft.ContainerService/managedClusters/node.k8s.io/runtimeclasses/write",
       "Microsoft.ContainerService/managedClusters/nodes/delete",
       "Microsoft.ContainerService/managedClusters/nodes/read",
       "Microsoft.ContainerService/managedClusters/nodes/write",
       "Microsoft.ContainerService/managedClusters/openapi/v2/read",
       "Microsoft.ContainerService/managedClusters/persistentvolumeclaims/delete",
       "Microsoft.ContainerService/managedClusters/persistentvolumeclaims/read",
       "Microsoft.ContainerService/managedClusters/persistentvolumeclaims/write",
       "Microsoft.ContainerService/managedClusters/persistentvolumes/delete",
       "Microsoft.ContainerService/managedClusters/persistentvolumes/read",
       "Microsoft.ContainerService/managedClusters/persistentvolumes/write",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/clusterresourcebindings/delete",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/clusterresourcebindings/read",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/clusterresourcebindings/write",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/clusterresourceoverrides/delete",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/clusterresourceoverrides/read",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/clusterresourceoverrides/write",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/clusterresourceoverridesnapshots/delete",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/clusterresourceoverridesnapshots/read",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/clusterresourceoverridesnapshots/write",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/clusterresourceplacements/delete",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/clusterresourceplacements/read",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/clusterresourceplacements/write",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/clusterresourcesnapshots/delete",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/clusterresourcesnapshots/read",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/clusterresourcesnapshots/write",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/clusterschedulingpolicysnapshots/delete",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/clusterschedulingpolicysnapshots/read",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/clusterschedulingpolicysnapshots/write",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/resourceoverrides/delete",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/resourceoverrides/read",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/resourceoverrides/write",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/resourceoverridesnapshots/delete",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/resourceoverridesnapshots/read",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/resourceoverridesnapshots/write",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/works/delete",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/works/read",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/works/write",
       "Microsoft.ContainerService/managedClusters/pods/delete",
       "Microsoft.ContainerService/managedClusters/pods/exec/action",
       "Microsoft.ContainerService/managedClusters/pods/read",
       "Microsoft.ContainerService/managedClusters/pods/write",
       "Microsoft.ContainerService/managedClusters/podtemplates/delete",
       "Microsoft.ContainerService/managedClusters/podtemplates/read",
       "Microsoft.ContainerService/managedClusters/podtemplates/write",
       "Microsoft.ContainerService/managedClusters/policy/poddisruptionbudgets/delete",
       "Microsoft.ContainerService/managedClusters/policy/poddisruptionbudgets/read",
       "Microsoft.ContainerService/managedClusters/policy/poddisruptionbudgets/write",
       "Microsoft.ContainerService/managedClusters/policy/podsecuritypolicies/delete",
       "Microsoft.ContainerService/managedClusters/policy/podsecuritypolicies/read",
       "Microsoft.ContainerService/managedClusters/policy/podsecuritypolicies/use/action",
       "Microsoft.ContainerService/managedClusters/policy/podsecuritypolicies/write",
       "Microsoft.ContainerService/managedClusters/privateEndpointConnections/delete",
       "Microsoft.ContainerService/managedClusters/privateEndpointConnections/read",
       "Microsoft.ContainerService/managedClusters/privateEndpointConnections/write",
       "Microsoft.ContainerService/managedClusters/privateEndpointConnectionsApproval/action",
       "Microsoft.ContainerService/managedClusters/providers/Microsoft.Insights/diagnosticSettings/read",
       "Microsoft.ContainerService/managedClusters/providers/Microsoft.Insights/diagnosticSettings/write",
       "Microsoft.ContainerService/managedClusters/providers/Microsoft.Insights/logDefinitions/read",
       "Microsoft.ContainerService/managedClusters/providers/Microsoft.Insights/metricDefinitions/read",
       "Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/clusterrolebindings/delete",
       "Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/clusterrolebindings/read",
       "Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/clusterrolebindings/write",
       "Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/clusterroles/bind/action",
       "Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/clusterroles/delete",
       "Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/clusterroles/escalate/action",
       "Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/clusterroles/read",
       "Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/clusterroles/write",
       "Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/rolebindings/delete",
       "Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/rolebindings/read",
       "Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/rolebindings/write",
       "Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/roles/bind/action",
       "Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/roles/delete",
       "Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/roles/escalate/action",
       "Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/roles/read",
       "Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/roles/write",
       "Microsoft.ContainerService/managedClusters/read",
       "Microsoft.ContainerService/managedClusters/readyz/autoregister-completion/read",
       "Microsoft.ContainerService/managedClusters/readyz/etcd/read",
       "Microsoft.ContainerService/managedClusters/readyz/log/read",
       "Microsoft.ContainerService/managedClusters/readyz/ping/read",
       "Microsoft.ContainerService/managedClusters/readyz/poststarthook/apiservice-openapi-controller/read",
       "Microsoft.ContainerService/managedClusters/readyz/poststarthook/apiservice-registration-controller/read",
       "Microsoft.ContainerService/managedClusters/readyz/poststarthook/apiservice-status-available-controller/read",
       "Microsoft.ContainerService/managedClusters/readyz/poststarthook/bootstrap-controller/read",
       "Microsoft.ContainerService/managedClusters/readyz/poststarthook/ca-registration/read",
       "Microsoft.ContainerService/managedClusters/readyz/poststarthook/crd-informer-synced/read",
       "Microsoft.ContainerService/managedClusters/readyz/poststarthook/generic-apiserver-start-informers/read",
       "Microsoft.ContainerService/managedClusters/readyz/poststarthook/kube-apiserver-autoregistration/read",
       "Microsoft.ContainerService/managedClusters/readyz/poststarthook/rbac/bootstrap-roles/read",
       "Microsoft.ContainerService/managedClusters/readyz/poststarthook/scheduling/bootstrap-system-priority-classes/read",
       "Microsoft.ContainerService/managedClusters/readyz/poststarthook/start-apiextensions-controllers/read",
       "Microsoft.ContainerService/managedClusters/readyz/poststarthook/start-apiextensions-informers/read",
       "Microsoft.ContainerService/managedClusters/readyz/poststarthook/start-kube-aggregator-informers/read",
       "Microsoft.ContainerService/managedClusters/readyz/poststarthook/start-kube-apiserver-admission-initializer/read",
       "Microsoft.ContainerService/managedClusters/readyz/read",
       "Microsoft.ContainerService/managedClusters/readyz/shutdown/read",
       "Microsoft.ContainerService/managedClusters/replicationcontrollers/delete",
       "Microsoft.ContainerService/managedClusters/replicationcontrollers/read",
       "Microsoft.ContainerService/managedClusters/replicationcontrollers/write",
       "Microsoft.ContainerService/managedClusters/resetAADProfile/action",
       "Microsoft.ContainerService/managedClusters/resetMetrics/read",
       "Microsoft.ContainerService/managedClusters/resetServicePrincipalProfile/action",
       "Microsoft.ContainerService/managedClusters/resolvePrivateLinkServiceId/action",
       "Microsoft.ContainerService/managedClusters/resourcequotas/delete",
       "Microsoft.ContainerService/managedClusters/resourcequotas/read",
       "Microsoft.ContainerService/managedClusters/resourcequotas/write",
       "Microsoft.ContainerService/managedClusters/rotateClusterCertificates/action",
       "Microsoft.ContainerService/managedClusters/runCommand/action",
       "Microsoft.ContainerService/managedClusters/scheduling.k8s.io/priorityclasses/delete",
       "Microsoft.ContainerService/managedClusters/scheduling.k8s.io/priorityclasses/read",
       "Microsoft.ContainerService/managedClusters/scheduling.k8s.io/priorityclasses/write",
       "Microsoft.ContainerService/managedClusters/secrets/delete",
       "Microsoft.ContainerService/managedClusters/secrets/read",
       "Microsoft.ContainerService/managedClusters/secrets/write",
       "Microsoft.ContainerService/managedClusters/serviceaccounts/delete",
       "Microsoft.ContainerService/managedClusters/serviceaccounts/impersonate/action",
       "Microsoft.ContainerService/managedClusters/serviceaccounts/read",
       "Microsoft.ContainerService/managedClusters/serviceaccounts/write",
       "Microsoft.ContainerService/managedClusters/services/delete",
       "Microsoft.ContainerService/managedClusters/services/read",
       "Microsoft.ContainerService/managedClusters/services/write",
       "Microsoft.ContainerService/managedClusters/start/action",
       "Microsoft.ContainerService/managedClusters/stop/action",
       "Microsoft.ContainerService/managedClusters/storage.k8s.io/csidrivers/delete",
       "Microsoft.ContainerService/managedClusters/storage.k8s.io/csidrivers/read",
       "Microsoft.ContainerService/managedClusters/storage.k8s.io/csidrivers/write",
       "Microsoft.ContainerService/managedClusters/storage.k8s.io/csinodes/delete",
       "Microsoft.ContainerService/managedClusters/storage.k8s.io/csinodes/read",
       "Microsoft.ContainerService/managedClusters/storage.k8s.io/csinodes/write",
       "Microsoft.ContainerService/managedClusters/storage.k8s.io/csistoragecapacities/delete",
       "Microsoft.ContainerService/managedClusters/storage.k8s.io/csistoragecapacities/read",
       "Microsoft.ContainerService/managedClusters/storage.k8s.io/csistoragecapacities/write",
       "Microsoft.ContainerService/managedClusters/storage.k8s.io/storageclasses/delete",
       "Microsoft.ContainerService/managedClusters/storage.k8s.io/storageclasses/read",
       "Microsoft.ContainerService/managedClusters/storage.k8s.io/storageclasses/write",
       "Microsoft.ContainerService/managedClusters/storage.k8s.io/volumeattachments/delete",
       "Microsoft.ContainerService/managedClusters/storage.k8s.io/volumeattachments/read",
       "Microsoft.ContainerService/managedClusters/storage.k8s.io/volumeattachments/write",
       "Microsoft.ContainerService/managedClusters/swagger-api/read",
       "Microsoft.ContainerService/managedClusters/swagger-ui/read",
       "Microsoft.ContainerService/managedClusters/trustedAccessRoleBindings/delete",
       "Microsoft.ContainerService/managedClusters/trustedAccessRoleBindings/read",
       "Microsoft.ContainerService/managedClusters/trustedAccessRoleBindings/write",
       "Microsoft.ContainerService/managedClusters/ui/read",
       "Microsoft.ContainerService/managedClusters/unpinManagedCluster/action",
       "Microsoft.ContainerService/managedClusters/upgradeProfiles/read",
       "Microsoft.ContainerService/managedClusters/users/impersonate/action",
       "Microsoft.ContainerService/managedClusters/version/read",
       "Microsoft.ContainerService/managedClusters/write",
       "Microsoft.ContainerService/managedclustersnapshots/delete",
       "Microsoft.ContainerService/managedclustersnapshots/read",
       "Microsoft.ContainerService/managedclustersnapshots/write",
       "Microsoft.ContainerService/snapshots/delete",
       "Microsoft.ContainerService/snapshots/read",
       "Microsoft.ContainerService/snapshots/write",
       "Microsoft.ManagedIdentity/userAssignedIdentities/assign/action",
       "Microsoft.ManagedIdentity/userAssignedIdentities/federatedIdentityCredentials/read",
       "Microsoft.ResourceHealth/availabilityStatuses/read",
       "Microsoft.Resources/subscriptions/resourceGroups/read"
     ],
     "NotActions": [],
     "AssignableScopes": [
       "/subscriptions/$SUBSCRIPTION_ID"
     ]
   }
   EOF
   ```

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
     --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP_NAME"
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

1. Open a terminal or command prompt. Export your Azure subscription ID to a variable.

   ```shell
   export SUBSCRIPTION_ID=<your-subscription-id>
   ```

2. Issue the following command to create a JSON file containing all the required subscription level permissions.

   ```shell
   cat << EOF > aks_dynamic_sub_role.json
   {
     "Name": "Palette Dynamic Placement AKS Cluster Deployer (sub)",
     "IsCustom": true,
     "Description": "Can use Palette to deploy AKS clusters using dynamic placement. This role has the permissions required at the subscription scope level.",
     "Actions": [
       "Microsoft.Compute/virtualMachineScaleSets/extensions/read",
       "Microsoft.Compute/virtualMachineScaleSets/extensions/roles/read",
       "Microsoft.Compute/virtualMachineScaleSets/instanceView/read",
       "Microsoft.Compute/virtualMachineScaleSets/networkInterfaces/read",
       "Microsoft.Compute/virtualMachineScaleSets/osUpgradeHistory/read",
       "Microsoft.Compute/virtualMachineScaleSets/providers/Microsoft.Insights/diagnosticSettings/read",
       "Microsoft.Compute/virtualMachineScaleSets/providers/Microsoft.Insights/logDefinitions/read",
       "Microsoft.Compute/virtualMachineScaleSets/providers/Microsoft.Insights/metricDefinitions/read",
       "Microsoft.Compute/virtualMachineScaleSets/publicIPAddresses/read",
       "Microsoft.Compute/virtualMachineScaleSets/read",
       "Microsoft.Compute/virtualMachineScaleSets/rollingUpgrades/read",
       "Microsoft.Compute/virtualMachineScaleSets/skus/read",
       "Microsoft.Compute/virtualMachineScaleSets/virtualMachines/extensions/read",
       "Microsoft.Compute/virtualMachineScaleSets/virtualMachines/instanceView/read",
       "Microsoft.Compute/virtualMachineScaleSets/virtualMachines/networkInterfaces/ipConfigurations/publicIPAddresses/read",
       "Microsoft.Compute/virtualMachineScaleSets/virtualMachines/networkInterfaces/ipConfigurations/read",
       "Microsoft.Compute/virtualMachineScaleSets/virtualMachines/networkInterfaces/read",
       "Microsoft.Compute/virtualMachineScaleSets/virtualMachines/providers/Microsoft.Insights/metricDefinitions/read",
       "Microsoft.Compute/virtualMachineScaleSets/virtualMachines/read",
       "Microsoft.Compute/virtualMachineScaleSets/virtualMachines/runCommands/read",
       "Microsoft.Compute/virtualMachineScaleSets/vmSizes/read"
     ],
     "NotActions": [],
     "AssignableScopes": [
       "/subscriptions/$SUBSCRIPTION_ID"
     ]
   }
   EOF
   ```

3. Create another JSON file containing the remaining permissions required for AKS.

   ```shell
   cat << EOF > aks_dynamic_rg_sub_role.json
   {
     "Name": "Palette Dynamic Placement AKS Cluster Deployer (rg/sub)",
     "IsCustom": true,
     "Description": "Can use Palette to deploy AKS clusters using dynamic placement. This role has the permissions required at the resource group scope level. If deploying multiple clusters in a variety of resource groups within a subscription, apply the role with the subscription as scope instead of the resource group as scope.",
     "Actions": [
       "Microsoft.Authorization/classicAdministrators/operationstatuses/read",
       "Microsoft.Authorization/classicAdministrators/read",
       "Microsoft.Authorization/denyAssignments/read",
       "Microsoft.Authorization/diagnosticSettings/read",
       "Microsoft.Authorization/diagnosticSettingsCategories/read",
       "Microsoft.Authorization/locks/read",
       "Microsoft.Authorization/operations/read",
       "Microsoft.Authorization/permissions/read",
       "Microsoft.Authorization/policyAssignments/privateLinkAssociations/read",
       "Microsoft.Authorization/policyAssignments/read",
       "Microsoft.Authorization/policyAssignments/resourceManagementPrivateLinks/privateEndpointConnectionProxies/read",
       "Microsoft.Authorization/policyAssignments/resourceManagementPrivateLinks/privateEndpointConnections/read",
       "Microsoft.Authorization/policyAssignments/resourceManagementPrivateLinks/read",
       "Microsoft.Authorization/policyDefinitions/read",
       "Microsoft.Authorization/policyExemptions/read",
       "Microsoft.Authorization/policySetDefinitions/read",
       "Microsoft.Authorization/providerOperations/read",
       "Microsoft.Authorization/roleAssignments/read",
       "Microsoft.Authorization/roleAssignmentScheduleInstances/read",
       "Microsoft.Authorization/roleAssignmentScheduleRequests/read",
       "Microsoft.Authorization/roleAssignmentSchedules/read",
       "Microsoft.Authorization/roleDefinitions/read",
       "Microsoft.Authorization/roleEligibilityScheduleInstances/read",
       "Microsoft.Authorization/roleEligibilityScheduleRequests/read",
       "Microsoft.Authorization/roleEligibilitySchedules/read",
       "Microsoft.Authorization/roleManagementPolicies/read",
       "Microsoft.Authorization/roleManagementPolicyAssignments/read",
       "Microsoft.ContainerService/locations/guardrailsVersions/read",
       "Microsoft.ContainerService/locations/kubernetesversions/read",
       "Microsoft.ContainerService/locations/meshRevisionProfiles/read",
       "Microsoft.ContainerService/locations/nodeimageversions/read",
       "Microsoft.ContainerService/locations/operationresults/read",
       "Microsoft.ContainerService/locations/operations/read",
       "Microsoft.ContainerService/locations/orchestrators/read",
       "Microsoft.ContainerService/locations/osOptions/read",
       "Microsoft.ContainerService/locations/safeguardsVersions/read",
       "Microsoft.ContainerService/locations/usages/read",
       "Microsoft.ContainerService/managedClusters/abort/action",
       "Microsoft.ContainerService/managedClusters/accessProfiles/listCredential/action",
       "Microsoft.ContainerService/managedClusters/accessProfiles/read",
       "Microsoft.ContainerService/managedClusters/admissionregistration.k8s.io/initializerconfigurations/delete",
       "Microsoft.ContainerService/managedClusters/admissionregistration.k8s.io/initializerconfigurations/read",
       "Microsoft.ContainerService/managedClusters/admissionregistration.k8s.io/initializerconfigurations/write",
       "Microsoft.ContainerService/managedClusters/admissionregistration.k8s.io/mutatingwebhookconfigurations/delete",
       "Microsoft.ContainerService/managedClusters/admissionregistration.k8s.io/mutatingwebhookconfigurations/read",
       "Microsoft.ContainerService/managedClusters/admissionregistration.k8s.io/mutatingwebhookconfigurations/write",
       "Microsoft.ContainerService/managedClusters/admissionregistration.k8s.io/validatingwebhookconfigurations/delete",
       "Microsoft.ContainerService/managedClusters/admissionregistration.k8s.io/validatingwebhookconfigurations/read",
       "Microsoft.ContainerService/managedClusters/admissionregistration.k8s.io/validatingwebhookconfigurations/write",
       "Microsoft.ContainerService/managedClusters/agentPools/abort/action",
       "Microsoft.ContainerService/managedClusters/agentPools/delete",
       "Microsoft.ContainerService/managedClusters/agentPools/read",
       "Microsoft.ContainerService/managedClusters/agentPools/upgradeNodeImageVersion/action",
       "Microsoft.ContainerService/managedClusters/agentPools/upgradeNodeImageVersion/write",
       "Microsoft.ContainerService/managedClusters/agentPools/upgradeProfiles/read",
       "Microsoft.ContainerService/managedClusters/agentPools/write",
       "Microsoft.ContainerService/managedClusters/api/read",
       "Microsoft.ContainerService/managedClusters/api/v1/read",
       "Microsoft.ContainerService/managedClusters/apiextensions.k8s.io/customresourcedefinitions/delete",
       "Microsoft.ContainerService/managedClusters/apiextensions.k8s.io/customresourcedefinitions/read",
       "Microsoft.ContainerService/managedClusters/apiextensions.k8s.io/customresourcedefinitions/write",
       "Microsoft.ContainerService/managedClusters/apiregistration.k8s.io/apiservices/delete",
       "Microsoft.ContainerService/managedClusters/apiregistration.k8s.io/apiservices/read",
       "Microsoft.ContainerService/managedClusters/apiregistration.k8s.io/apiservices/write",
       "Microsoft.ContainerService/managedClusters/apis/admissionregistration.k8s.io/read",
       "Microsoft.ContainerService/managedClusters/apis/admissionregistration.k8s.io/v1/read",
       "Microsoft.ContainerService/managedClusters/apis/admissionregistration.k8s.io/v1beta1/read",
       "Microsoft.ContainerService/managedClusters/apis/apiextensions.k8s.io/read",
       "Microsoft.ContainerService/managedClusters/apis/apiextensions.k8s.io/v1/read",
       "Microsoft.ContainerService/managedClusters/apis/apiextensions.k8s.io/v1beta1/read",
       "Microsoft.ContainerService/managedClusters/apis/apiregistration.k8s.io/read",
       "Microsoft.ContainerService/managedClusters/apis/apiregistration.k8s.io/v1/read",
       "Microsoft.ContainerService/managedClusters/apis/apiregistration.k8s.io/v1beta1/read",
       "Microsoft.ContainerService/managedClusters/apis/apps/read",
       "Microsoft.ContainerService/managedClusters/apis/apps/v1/read",
       "Microsoft.ContainerService/managedClusters/apis/apps/v1beta1/read",
       "Microsoft.ContainerService/managedClusters/apis/apps/v1beta2/read",
       "Microsoft.ContainerService/managedClusters/apis/authentication.k8s.io/read",
       "Microsoft.ContainerService/managedClusters/apis/authentication.k8s.io/v1/read",
       "Microsoft.ContainerService/managedClusters/apis/authentication.k8s.io/v1beta1/read",
       "Microsoft.ContainerService/managedClusters/apis/authorization.k8s.io/read",
       "Microsoft.ContainerService/managedClusters/apis/authorization.k8s.io/v1/read",
       "Microsoft.ContainerService/managedClusters/apis/authorization.k8s.io/v1beta1/read",
       "Microsoft.ContainerService/managedClusters/apis/autoscaling/read",
       "Microsoft.ContainerService/managedClusters/apis/autoscaling/v1/read",
       "Microsoft.ContainerService/managedClusters/apis/autoscaling/v2beta1/read",
       "Microsoft.ContainerService/managedClusters/apis/autoscaling/v2beta2/read",
       "Microsoft.ContainerService/managedClusters/apis/batch/read",
       "Microsoft.ContainerService/managedClusters/apis/batch/v1/read",
       "Microsoft.ContainerService/managedClusters/apis/batch/v1beta1/read",
       "Microsoft.ContainerService/managedClusters/apis/certificates.k8s.io/read",
       "Microsoft.ContainerService/managedClusters/apis/certificates.k8s.io/v1beta1/read",
       "Microsoft.ContainerService/managedClusters/apis/coordination.k8s.io/read",
       "Microsoft.ContainerService/managedClusters/apis/coordination.k8s.io/v1/read",
       "Microsoft.ContainerService/managedClusters/apis/coordination.k8s.io/v1beta1/read",
       "Microsoft.ContainerService/managedClusters/apis/events.k8s.io/read",
       "Microsoft.ContainerService/managedClusters/apis/events.k8s.io/v1beta1/read",
       "Microsoft.ContainerService/managedClusters/apis/extensions/read",
       "Microsoft.ContainerService/managedClusters/apis/extensions/v1beta1/read",
       "Microsoft.ContainerService/managedClusters/apis/metrics.k8s.io/read",
       "Microsoft.ContainerService/managedClusters/apis/metrics.k8s.io/v1beta1/read",
       "Microsoft.ContainerService/managedClusters/apis/networking.k8s.io/read",
       "Microsoft.ContainerService/managedClusters/apis/networking.k8s.io/v1/read",
       "Microsoft.ContainerService/managedClusters/apis/networking.k8s.io/v1beta1/read",
       "Microsoft.ContainerService/managedClusters/apis/node.k8s.io/read",
       "Microsoft.ContainerService/managedClusters/apis/node.k8s.io/v1beta1/read",
       "Microsoft.ContainerService/managedClusters/apis/policy/read",
       "Microsoft.ContainerService/managedClusters/apis/policy/v1beta1/read",
       "Microsoft.ContainerService/managedClusters/apis/rbac.authorization.k8s.io/read",
       "Microsoft.ContainerService/managedClusters/apis/rbac.authorization.k8s.io/v1/read",
       "Microsoft.ContainerService/managedClusters/apis/rbac.authorization.k8s.io/v1beta1/read",
       "Microsoft.ContainerService/managedClusters/apis/read",
       "Microsoft.ContainerService/managedClusters/apis/scheduling.k8s.io/read",
       "Microsoft.ContainerService/managedClusters/apis/scheduling.k8s.io/v1/read",
       "Microsoft.ContainerService/managedClusters/apis/scheduling.k8s.io/v1beta1/read",
       "Microsoft.ContainerService/managedClusters/apis/storage.k8s.io/read",
       "Microsoft.ContainerService/managedClusters/apis/storage.k8s.io/v1/read",
       "Microsoft.ContainerService/managedClusters/apis/storage.k8s.io/v1beta1/read",
       "Microsoft.ContainerService/managedClusters/apps/controllerrevisions/delete",
       "Microsoft.ContainerService/managedClusters/apps/controllerrevisions/read",
       "Microsoft.ContainerService/managedClusters/apps/controllerrevisions/write",
       "Microsoft.ContainerService/managedClusters/apps/daemonsets/delete",
       "Microsoft.ContainerService/managedClusters/apps/daemonsets/read",
       "Microsoft.ContainerService/managedClusters/apps/daemonsets/write",
       "Microsoft.ContainerService/managedClusters/apps/deployments/delete",
       "Microsoft.ContainerService/managedClusters/apps/deployments/read",
       "Microsoft.ContainerService/managedClusters/apps/deployments/write",
       "Microsoft.ContainerService/managedClusters/apps/replicasets/delete",
       "Microsoft.ContainerService/managedClusters/apps/replicasets/read",
       "Microsoft.ContainerService/managedClusters/apps/replicasets/write",
       "Microsoft.ContainerService/managedClusters/apps/statefulsets/delete",
       "Microsoft.ContainerService/managedClusters/apps/statefulsets/read",
       "Microsoft.ContainerService/managedClusters/apps/statefulsets/write",
       "Microsoft.ContainerService/managedClusters/authentication.k8s.io/tokenreviews/write",
       "Microsoft.ContainerService/managedClusters/authentication.k8s.io/userextras/impersonate/action",
       "Microsoft.ContainerService/managedClusters/authorization.k8s.io/localsubjectaccessreviews/write",
       "Microsoft.ContainerService/managedClusters/authorization.k8s.io/selfsubjectaccessreviews/write",
       "Microsoft.ContainerService/managedClusters/authorization.k8s.io/selfsubjectrulesreviews/write",
       "Microsoft.ContainerService/managedClusters/authorization.k8s.io/subjectaccessreviews/write",
       "Microsoft.ContainerService/managedClusters/autoscaling/horizontalpodautoscalers/delete",
       "Microsoft.ContainerService/managedClusters/autoscaling/horizontalpodautoscalers/read",
       "Microsoft.ContainerService/managedClusters/autoscaling/horizontalpodautoscalers/write",
       "Microsoft.ContainerService/managedClusters/availableAgentPoolVersions/read",
       "Microsoft.ContainerService/managedClusters/batch/cronjobs/delete",
       "Microsoft.ContainerService/managedClusters/batch/cronjobs/read",
       "Microsoft.ContainerService/managedClusters/batch/cronjobs/write",
       "Microsoft.ContainerService/managedClusters/batch/jobs/delete",
       "Microsoft.ContainerService/managedClusters/batch/jobs/read",
       "Microsoft.ContainerService/managedClusters/batch/jobs/write",
       "Microsoft.ContainerService/managedClusters/bindings/write",
       "Microsoft.ContainerService/managedClusters/certificates.k8s.io/certificatesigningrequests/delete",
       "Microsoft.ContainerService/managedClusters/certificates.k8s.io/certificatesigningrequests/read",
       "Microsoft.ContainerService/managedClusters/certificates.k8s.io/certificatesigningrequests/write",
       "Microsoft.ContainerService/managedClusters/cluster.kubernetes-fleet.io/internalmemberclusters/delete",
       "Microsoft.ContainerService/managedClusters/cluster.kubernetes-fleet.io/internalmemberclusters/read",
       "Microsoft.ContainerService/managedClusters/cluster.kubernetes-fleet.io/internalmemberclusters/write",
       "Microsoft.ContainerService/managedClusters/cluster.kubernetes-fleet.io/memberclusters/delete",
       "Microsoft.ContainerService/managedClusters/cluster.kubernetes-fleet.io/memberclusters/read",
       "Microsoft.ContainerService/managedClusters/cluster.kubernetes-fleet.io/memberclusters/write",
       "Microsoft.ContainerService/managedClusters/commandResults/read",
       "Microsoft.ContainerService/managedClusters/componentstatuses/delete",
       "Microsoft.ContainerService/managedClusters/componentstatuses/read",
       "Microsoft.ContainerService/managedClusters/componentstatuses/write",
       "Microsoft.ContainerService/managedClusters/configmaps/delete",
       "Microsoft.ContainerService/managedClusters/configmaps/read",
       "Microsoft.ContainerService/managedClusters/configmaps/write",
       "Microsoft.ContainerService/managedClusters/coordination.k8s.io/leases/delete",
       "Microsoft.ContainerService/managedClusters/coordination.k8s.io/leases/read",
       "Microsoft.ContainerService/managedClusters/coordination.k8s.io/leases/write",
       "Microsoft.ContainerService/managedClusters/delete",
       "Microsoft.ContainerService/managedClusters/detectors/read",
       "Microsoft.ContainerService/managedClusters/diagnosticsState/read",
       "Microsoft.ContainerService/managedClusters/discovery.k8s.io/endpointslices/delete",
       "Microsoft.ContainerService/managedClusters/discovery.k8s.io/endpointslices/read",
       "Microsoft.ContainerService/managedClusters/discovery.k8s.io/endpointslices/write",
       "Microsoft.ContainerService/managedClusters/endpoints/delete",
       "Microsoft.ContainerService/managedClusters/endpoints/read",
       "Microsoft.ContainerService/managedClusters/endpoints/write",
       "Microsoft.ContainerService/managedClusters/eventGridFilters/delete",
       "Microsoft.ContainerService/managedClusters/eventGridFilters/read",
       "Microsoft.ContainerService/managedClusters/eventGridFilters/write",
       "Microsoft.ContainerService/managedClusters/events.k8s.io/events/delete",
       "Microsoft.ContainerService/managedClusters/events.k8s.io/events/read",
       "Microsoft.ContainerService/managedClusters/events.k8s.io/events/write",
       "Microsoft.ContainerService/managedClusters/events/delete",
       "Microsoft.ContainerService/managedClusters/events/read",
       "Microsoft.ContainerService/managedClusters/events/write",
       "Microsoft.ContainerService/managedClusters/extensionaddons/delete",
       "Microsoft.ContainerService/managedClusters/extensionaddons/read",
       "Microsoft.ContainerService/managedClusters/extensionaddons/write",
       "Microsoft.ContainerService/managedClusters/extensions/daemonsets/delete",
       "Microsoft.ContainerService/managedClusters/extensions/daemonsets/read",
       "Microsoft.ContainerService/managedClusters/extensions/daemonsets/write",
       "Microsoft.ContainerService/managedClusters/extensions/deployments/delete",
       "Microsoft.ContainerService/managedClusters/extensions/deployments/read",
       "Microsoft.ContainerService/managedClusters/extensions/deployments/write",
       "Microsoft.ContainerService/managedClusters/extensions/ingresses/delete",
       "Microsoft.ContainerService/managedClusters/extensions/ingresses/read",
       "Microsoft.ContainerService/managedClusters/extensions/ingresses/write",
       "Microsoft.ContainerService/managedClusters/extensions/networkpolicies/delete",
       "Microsoft.ContainerService/managedClusters/extensions/networkpolicies/read",
       "Microsoft.ContainerService/managedClusters/extensions/networkpolicies/write",
       "Microsoft.ContainerService/managedClusters/extensions/podsecuritypolicies/delete",
       "Microsoft.ContainerService/managedClusters/extensions/podsecuritypolicies/read",
       "Microsoft.ContainerService/managedClusters/extensions/podsecuritypolicies/write",
       "Microsoft.ContainerService/managedClusters/extensions/replicasets/delete",
       "Microsoft.ContainerService/managedClusters/extensions/replicasets/read",
       "Microsoft.ContainerService/managedClusters/extensions/replicasets/write",
       "Microsoft.ContainerService/managedClusters/flowcontrol.apiserver.k8s.io/flowschemas/delete",
       "Microsoft.ContainerService/managedClusters/flowcontrol.apiserver.k8s.io/flowschemas/read",
       "Microsoft.ContainerService/managedClusters/flowcontrol.apiserver.k8s.io/flowschemas/write",
       "Microsoft.ContainerService/managedClusters/flowcontrol.apiserver.k8s.io/prioritylevelconfigurations/delete",
       "Microsoft.ContainerService/managedClusters/flowcontrol.apiserver.k8s.io/prioritylevelconfigurations/read",
       "Microsoft.ContainerService/managedClusters/flowcontrol.apiserver.k8s.io/prioritylevelconfigurations/write",
       "Microsoft.ContainerService/managedClusters/groups/impersonate/action",
       "Microsoft.ContainerService/managedClusters/healthz/autoregister-completion/read",
       "Microsoft.ContainerService/managedClusters/healthz/etcd/read",
       "Microsoft.ContainerService/managedClusters/healthz/log/read",
       "Microsoft.ContainerService/managedClusters/healthz/ping/read",
       "Microsoft.ContainerService/managedClusters/healthz/poststarthook/apiservice-openapi-controller/read",
       "Microsoft.ContainerService/managedClusters/healthz/poststarthook/apiservice-registration-controller/read",
       "Microsoft.ContainerService/managedClusters/healthz/poststarthook/apiservice-status-available-controller/read",
       "Microsoft.ContainerService/managedClusters/healthz/poststarthook/bootstrap-controller/read",
       "Microsoft.ContainerService/managedClusters/healthz/poststarthook/ca-registration/read",
       "Microsoft.ContainerService/managedClusters/healthz/poststarthook/crd-informer-synced/read",
       "Microsoft.ContainerService/managedClusters/healthz/poststarthook/generic-apiserver-start-informers/read",
       "Microsoft.ContainerService/managedClusters/healthz/poststarthook/kube-apiserver-autoregistration/read",
       "Microsoft.ContainerService/managedClusters/healthz/poststarthook/rbac/bootstrap-roles/read",
       "Microsoft.ContainerService/managedClusters/healthz/poststarthook/scheduling/bootstrap-system-priority-classes/read",
       "Microsoft.ContainerService/managedClusters/healthz/poststarthook/start-apiextensions-controllers/read",
       "Microsoft.ContainerService/managedClusters/healthz/poststarthook/start-apiextensions-informers/read",
       "Microsoft.ContainerService/managedClusters/healthz/poststarthook/start-kube-aggregator-informers/read",
       "Microsoft.ContainerService/managedClusters/healthz/poststarthook/start-kube-apiserver-admission-initializer/read",
       "Microsoft.ContainerService/managedClusters/healthz/read",
       "Microsoft.ContainerService/managedClusters/limitranges/delete",
       "Microsoft.ContainerService/managedClusters/limitranges/read",
       "Microsoft.ContainerService/managedClusters/limitranges/write",
       "Microsoft.ContainerService/managedClusters/listClusterAdminCredential/action",
       "Microsoft.ContainerService/managedClusters/listClusterMonitoringUserCredential/action",
       "Microsoft.ContainerService/managedClusters/listClusterUserCredential/action",
       "Microsoft.ContainerService/managedClusters/livez/autoregister-completion/read",
       "Microsoft.ContainerService/managedClusters/livez/etcd/read",
       "Microsoft.ContainerService/managedClusters/livez/log/read",
       "Microsoft.ContainerService/managedClusters/livez/ping/read",
       "Microsoft.ContainerService/managedClusters/livez/poststarthook/apiservice-openapi-controller/read",
       "Microsoft.ContainerService/managedClusters/livez/poststarthook/apiservice-registration-controller/read",
       "Microsoft.ContainerService/managedClusters/livez/poststarthook/apiservice-status-available-controller/read",
       "Microsoft.ContainerService/managedClusters/livez/poststarthook/bootstrap-controller/read",
       "Microsoft.ContainerService/managedClusters/livez/poststarthook/ca-registration/read",
       "Microsoft.ContainerService/managedClusters/livez/poststarthook/crd-informer-synced/read",
       "Microsoft.ContainerService/managedClusters/livez/poststarthook/generic-apiserver-start-informers/read",
       "Microsoft.ContainerService/managedClusters/livez/poststarthook/kube-apiserver-autoregistration/read",
       "Microsoft.ContainerService/managedClusters/livez/poststarthook/rbac/bootstrap-roles/read",
       "Microsoft.ContainerService/managedClusters/livez/poststarthook/scheduling/bootstrap-system-priority-classes/read",
       "Microsoft.ContainerService/managedClusters/livez/poststarthook/start-apiextensions-controllers/read",
       "Microsoft.ContainerService/managedClusters/livez/poststarthook/start-apiextensions-informers/read",
       "Microsoft.ContainerService/managedClusters/livez/poststarthook/start-kube-aggregator-informers/read",
       "Microsoft.ContainerService/managedClusters/livez/poststarthook/start-kube-apiserver-admission-initializer/read",
       "Microsoft.ContainerService/managedClusters/livez/read",
       "Microsoft.ContainerService/managedClusters/loadBalancers/delete",
       "Microsoft.ContainerService/managedClusters/loadBalancers/read",
       "Microsoft.ContainerService/managedClusters/loadBalancers/write",
       "Microsoft.ContainerService/managedClusters/logs/read",
       "Microsoft.ContainerService/managedClusters/maintenanceConfigurations/delete",
       "Microsoft.ContainerService/managedClusters/maintenanceConfigurations/read",
       "Microsoft.ContainerService/managedClusters/maintenanceConfigurations/write",
       "Microsoft.ContainerService/managedClusters/meshUpgradeProfiles/read",
       "Microsoft.ContainerService/managedClusters/metrics.k8s.io/nodes/read",
       "Microsoft.ContainerService/managedClusters/metrics.k8s.io/pods/read",
       "Microsoft.ContainerService/managedClusters/metrics/read",
       "Microsoft.ContainerService/managedClusters/namespaces/delete",
       "Microsoft.ContainerService/managedClusters/namespaces/read",
       "Microsoft.ContainerService/managedClusters/namespaces/write",
       "Microsoft.ContainerService/managedClusters/networking.k8s.io/ingressclasses/delete",
       "Microsoft.ContainerService/managedClusters/networking.k8s.io/ingressclasses/read",
       "Microsoft.ContainerService/managedClusters/networking.k8s.io/ingressclasses/write",
       "Microsoft.ContainerService/managedClusters/networking.k8s.io/ingresses/delete",
       "Microsoft.ContainerService/managedClusters/networking.k8s.io/ingresses/read",
       "Microsoft.ContainerService/managedClusters/networking.k8s.io/ingresses/write",
       "Microsoft.ContainerService/managedClusters/networking.k8s.io/networkpolicies/delete",
       "Microsoft.ContainerService/managedClusters/networking.k8s.io/networkpolicies/read",
       "Microsoft.ContainerService/managedClusters/networking.k8s.io/networkpolicies/write",
       "Microsoft.ContainerService/managedClusters/networkSecurityPerimeterAssociationProxies/delete",
       "Microsoft.ContainerService/managedClusters/networkSecurityPerimeterAssociationProxies/read",
       "Microsoft.ContainerService/managedClusters/networkSecurityPerimeterAssociationProxies/write",
       "Microsoft.ContainerService/managedClusters/networkSecurityPerimeterConfigurations/read",
       "Microsoft.ContainerService/managedClusters/node.k8s.io/runtimeclasses/delete",
       "Microsoft.ContainerService/managedClusters/node.k8s.io/runtimeclasses/read",
       "Microsoft.ContainerService/managedClusters/node.k8s.io/runtimeclasses/write",
       "Microsoft.ContainerService/managedClusters/nodes/delete",
       "Microsoft.ContainerService/managedClusters/nodes/read",
       "Microsoft.ContainerService/managedClusters/nodes/write",
       "Microsoft.ContainerService/managedClusters/openapi/v2/read",
       "Microsoft.ContainerService/managedClusters/persistentvolumeclaims/delete",
       "Microsoft.ContainerService/managedClusters/persistentvolumeclaims/read",
       "Microsoft.ContainerService/managedClusters/persistentvolumeclaims/write",
       "Microsoft.ContainerService/managedClusters/persistentvolumes/delete",
       "Microsoft.ContainerService/managedClusters/persistentvolumes/read",
       "Microsoft.ContainerService/managedClusters/persistentvolumes/write",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/clusterresourcebindings/delete",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/clusterresourcebindings/read",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/clusterresourcebindings/write",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/clusterresourceoverrides/delete",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/clusterresourceoverrides/read",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/clusterresourceoverrides/write",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/clusterresourceoverridesnapshots/delete",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/clusterresourceoverridesnapshots/read",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/clusterresourceoverridesnapshots/write",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/clusterresourceplacements/delete",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/clusterresourceplacements/read",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/clusterresourceplacements/write",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/clusterresourcesnapshots/delete",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/clusterresourcesnapshots/read",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/clusterresourcesnapshots/write",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/clusterschedulingpolicysnapshots/delete",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/clusterschedulingpolicysnapshots/read",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/clusterschedulingpolicysnapshots/write",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/resourceoverrides/delete",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/resourceoverrides/read",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/resourceoverrides/write",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/resourceoverridesnapshots/delete",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/resourceoverridesnapshots/read",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/resourceoverridesnapshots/write",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/works/delete",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/works/read",
       "Microsoft.ContainerService/managedClusters/placement.kubernetes-fleet.io/works/write",
       "Microsoft.ContainerService/managedClusters/pods/delete",
       "Microsoft.ContainerService/managedClusters/pods/exec/action",
       "Microsoft.ContainerService/managedClusters/pods/read",
       "Microsoft.ContainerService/managedClusters/pods/write",
       "Microsoft.ContainerService/managedClusters/podtemplates/delete",
       "Microsoft.ContainerService/managedClusters/podtemplates/read",
       "Microsoft.ContainerService/managedClusters/podtemplates/write",
       "Microsoft.ContainerService/managedClusters/policy/poddisruptionbudgets/delete",
       "Microsoft.ContainerService/managedClusters/policy/poddisruptionbudgets/read",
       "Microsoft.ContainerService/managedClusters/policy/poddisruptionbudgets/write",
       "Microsoft.ContainerService/managedClusters/policy/podsecuritypolicies/delete",
       "Microsoft.ContainerService/managedClusters/policy/podsecuritypolicies/read",
       "Microsoft.ContainerService/managedClusters/policy/podsecuritypolicies/use/action",
       "Microsoft.ContainerService/managedClusters/policy/podsecuritypolicies/write",
       "Microsoft.ContainerService/managedClusters/privateEndpointConnections/delete",
       "Microsoft.ContainerService/managedClusters/privateEndpointConnections/read",
       "Microsoft.ContainerService/managedClusters/privateEndpointConnections/write",
       "Microsoft.ContainerService/managedClusters/privateEndpointConnectionsApproval/action",
       "Microsoft.ContainerService/managedClusters/providers/Microsoft.Insights/diagnosticSettings/read",
       "Microsoft.ContainerService/managedClusters/providers/Microsoft.Insights/diagnosticSettings/write",
       "Microsoft.ContainerService/managedClusters/providers/Microsoft.Insights/logDefinitions/read",
       "Microsoft.ContainerService/managedClusters/providers/Microsoft.Insights/metricDefinitions/read",
       "Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/clusterrolebindings/delete",
       "Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/clusterrolebindings/read",
       "Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/clusterrolebindings/write",
       "Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/clusterroles/bind/action",
       "Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/clusterroles/delete",
       "Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/clusterroles/escalate/action",
       "Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/clusterroles/read",
       "Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/clusterroles/write",
       "Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/rolebindings/delete",
       "Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/rolebindings/read",
       "Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/rolebindings/write",
       "Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/roles/bind/action",
       "Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/roles/delete",
       "Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/roles/escalate/action",
       "Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/roles/read",
       "Microsoft.ContainerService/managedClusters/rbac.authorization.k8s.io/roles/write",
       "Microsoft.ContainerService/managedClusters/read",
       "Microsoft.ContainerService/managedClusters/readyz/autoregister-completion/read",
       "Microsoft.ContainerService/managedClusters/readyz/etcd/read",
       "Microsoft.ContainerService/managedClusters/readyz/log/read",
       "Microsoft.ContainerService/managedClusters/readyz/ping/read",
       "Microsoft.ContainerService/managedClusters/readyz/poststarthook/apiservice-openapi-controller/read",
       "Microsoft.ContainerService/managedClusters/readyz/poststarthook/apiservice-registration-controller/read",
       "Microsoft.ContainerService/managedClusters/readyz/poststarthook/apiservice-status-available-controller/read",
       "Microsoft.ContainerService/managedClusters/readyz/poststarthook/bootstrap-controller/read",
       "Microsoft.ContainerService/managedClusters/readyz/poststarthook/ca-registration/read",
       "Microsoft.ContainerService/managedClusters/readyz/poststarthook/crd-informer-synced/read",
       "Microsoft.ContainerService/managedClusters/readyz/poststarthook/generic-apiserver-start-informers/read",
       "Microsoft.ContainerService/managedClusters/readyz/poststarthook/kube-apiserver-autoregistration/read",
       "Microsoft.ContainerService/managedClusters/readyz/poststarthook/rbac/bootstrap-roles/read",
       "Microsoft.ContainerService/managedClusters/readyz/poststarthook/scheduling/bootstrap-system-priority-classes/read",
       "Microsoft.ContainerService/managedClusters/readyz/poststarthook/start-apiextensions-controllers/read",
       "Microsoft.ContainerService/managedClusters/readyz/poststarthook/start-apiextensions-informers/read",
       "Microsoft.ContainerService/managedClusters/readyz/poststarthook/start-kube-aggregator-informers/read",
       "Microsoft.ContainerService/managedClusters/readyz/poststarthook/start-kube-apiserver-admission-initializer/read",
       "Microsoft.ContainerService/managedClusters/readyz/read",
       "Microsoft.ContainerService/managedClusters/readyz/shutdown/read",
       "Microsoft.ContainerService/managedClusters/replicationcontrollers/delete",
       "Microsoft.ContainerService/managedClusters/replicationcontrollers/read",
       "Microsoft.ContainerService/managedClusters/replicationcontrollers/write",
       "Microsoft.ContainerService/managedClusters/resetAADProfile/action",
       "Microsoft.ContainerService/managedClusters/resetMetrics/read",
       "Microsoft.ContainerService/managedClusters/resetServicePrincipalProfile/action",
       "Microsoft.ContainerService/managedClusters/resolvePrivateLinkServiceId/action",
       "Microsoft.ContainerService/managedClusters/resourcequotas/delete",
       "Microsoft.ContainerService/managedClusters/resourcequotas/read",
       "Microsoft.ContainerService/managedClusters/resourcequotas/write",
       "Microsoft.ContainerService/managedClusters/rotateClusterCertificates/action",
       "Microsoft.ContainerService/managedClusters/runCommand/action",
       "Microsoft.ContainerService/managedClusters/scheduling.k8s.io/priorityclasses/delete",
       "Microsoft.ContainerService/managedClusters/scheduling.k8s.io/priorityclasses/read",
       "Microsoft.ContainerService/managedClusters/scheduling.k8s.io/priorityclasses/write",
       "Microsoft.ContainerService/managedClusters/secrets/delete",
       "Microsoft.ContainerService/managedClusters/secrets/read",
       "Microsoft.ContainerService/managedClusters/secrets/write",
       "Microsoft.ContainerService/managedClusters/serviceaccounts/delete",
       "Microsoft.ContainerService/managedClusters/serviceaccounts/impersonate/action",
       "Microsoft.ContainerService/managedClusters/serviceaccounts/read",
       "Microsoft.ContainerService/managedClusters/serviceaccounts/write",
       "Microsoft.ContainerService/managedClusters/services/delete",
       "Microsoft.ContainerService/managedClusters/services/read",
       "Microsoft.ContainerService/managedClusters/services/write",
       "Microsoft.ContainerService/managedClusters/start/action",
       "Microsoft.ContainerService/managedClusters/stop/action",
       "Microsoft.ContainerService/managedClusters/storage.k8s.io/csidrivers/delete",
       "Microsoft.ContainerService/managedClusters/storage.k8s.io/csidrivers/read",
       "Microsoft.ContainerService/managedClusters/storage.k8s.io/csidrivers/write",
       "Microsoft.ContainerService/managedClusters/storage.k8s.io/csinodes/delete",
       "Microsoft.ContainerService/managedClusters/storage.k8s.io/csinodes/read",
       "Microsoft.ContainerService/managedClusters/storage.k8s.io/csinodes/write",
       "Microsoft.ContainerService/managedClusters/storage.k8s.io/csistoragecapacities/delete",
       "Microsoft.ContainerService/managedClusters/storage.k8s.io/csistoragecapacities/read",
       "Microsoft.ContainerService/managedClusters/storage.k8s.io/csistoragecapacities/write",
       "Microsoft.ContainerService/managedClusters/storage.k8s.io/storageclasses/delete",
       "Microsoft.ContainerService/managedClusters/storage.k8s.io/storageclasses/read",
       "Microsoft.ContainerService/managedClusters/storage.k8s.io/storageclasses/write",
       "Microsoft.ContainerService/managedClusters/storage.k8s.io/volumeattachments/delete",
       "Microsoft.ContainerService/managedClusters/storage.k8s.io/volumeattachments/read",
       "Microsoft.ContainerService/managedClusters/storage.k8s.io/volumeattachments/write",
       "Microsoft.ContainerService/managedClusters/swagger-api/read",
       "Microsoft.ContainerService/managedClusters/swagger-ui/read",
       "Microsoft.ContainerService/managedClusters/trustedAccessRoleBindings/delete",
       "Microsoft.ContainerService/managedClusters/trustedAccessRoleBindings/read",
       "Microsoft.ContainerService/managedClusters/trustedAccessRoleBindings/write",
       "Microsoft.ContainerService/managedClusters/ui/read",
       "Microsoft.ContainerService/managedClusters/unpinManagedCluster/action",
       "Microsoft.ContainerService/managedClusters/upgradeProfiles/read",
       "Microsoft.ContainerService/managedClusters/users/impersonate/action",
       "Microsoft.ContainerService/managedClusters/version/read",
       "Microsoft.ContainerService/managedClusters/write",
       "Microsoft.ContainerService/managedclustersnapshots/delete",
       "Microsoft.ContainerService/managedclustersnapshots/read",
       "Microsoft.ContainerService/managedclustersnapshots/write",
       "Microsoft.ContainerService/snapshots/delete",
       "Microsoft.ContainerService/snapshots/read",
       "Microsoft.ContainerService/snapshots/write",
       "Microsoft.ManagedIdentity/userAssignedIdentities/assign/action",
       "Microsoft.ManagedIdentity/userAssignedIdentities/federatedIdentityCredentials/read",
       "Microsoft.Network/virtualNetworks/delete",
       "Microsoft.Network/virtualNetworks/read",
       "Microsoft.Network/virtualNetworks/subnets/delete",
       "Microsoft.Network/virtualNetworks/subnets/join/action",
       "Microsoft.Network/virtualNetworks/subnets/read",
       "Microsoft.Network/virtualNetworks/subnets/write",
       "Microsoft.Network/virtualNetworks/write",
       "Microsoft.ResourceHealth/availabilityStatuses/read",
       "Microsoft.Resources/subscriptions/resourceGroups/read"
     ],
     "NotActions": [],
     "AssignableScopes": [
       "/subscriptions/$SUBSCRIPTION_ID"
     ]
   }
   EOF
   ```

4. Create a role for each of the JSON files you created in the previous steps. Issue the following commands to create
   the roles.

   ```shell
   az role definition create --role-definition @aks_dynamic_sub_role.json --output table
   az role definition create --role-definition @aks_dynamic_rg_sub_role.json --output table
   ```

5. Export the client ID of the
   [service principal](https://learn.microsoft.com/en-us/azure/role-based-access-control/overview#security-principal)
   you want to use with Palette to a variable.

   ```shell
   export ASSIGNEE="<service_principal_client_id>"
   ```

6. Export the resource group name to a variable.

   ```shell
   export RESOURCE_GROUP_NAME="<resource-group-name>"
   export VNET_NAME="<vnet-name>"
   ```

7. Assign the roles to the service principal. Use the following commands to assign the roles.

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
