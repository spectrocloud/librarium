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

- A terminal or command prompt to issue the Azure CLI commands.

- The Azure Security Principal Object ID you want to use with Palette. The Security Principal Object ID can represent a
  user, group, or service principal.

### Create Role and Assign Permissions

1.  Export your Azure subscription ID to a variable.

    ```shell
    export SUBSCRIPTION_ID=<your-subscription-id>
    ```

2.  Issue the following command to create a JSON file containing all the required permissions to deploy clusters
    dynamically in Palette.

    ```shell
    cat << EOF > dynamic-permissions.json
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
    EOF

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

3.  Create the custom role, _Dynamic Placement Palette Deployer_, in Azure using the JSON file you created in the
    previous step. Issue the following command to create the role.

    ```shell
    az role definition create --role-definition @dynamic-permissions.json --output table
    ```

4.  Export the
    [security principal](https://learn.microsoft.com/en-us/azure/role-based-access-control/overview#security-principal)
    object ID you want to use with Palette to a variable.

    ```shell
    export ASSIGNEE="<security_principal_object_id>"
    ```

5.  Assign the role by creating a role assignment referencing the role definition _Dynamic Placement Palette Deployer_.
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
groups. For your convenience, we have provided the required permissions to deploy clusters using static placement in
various scenarios.

### Prerequisites

- Azure CLI installed on your local machine. Refer to the
  [Azure CLI Install Guide](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) for installation instructions.

- The Azure subscription ID you want to use with Palette.

- The Security Principal Object ID you want to use with Palette. You can retrieve it from the Entra ID section of the
  Azure Portal.

- A terminal or command prompt to issue the Azure CLI commands.

- The Azure Security Principal Object ID you want to use with Palette. The Security Principal Object ID can represent a
  user, group, or service principal.

### Create Role and Assign Permissions

Select the tab below to view the required permissions and steps for the static placement scenario you want to use.

<Tabs>

<TabItem label="Single Cluster" value="sc">

1.  Export your Azure subscription ID to a variable.

    ```shell
    export SUBSCRIPTION_ID=<your-subscription-id>
    ```

2.  Issue the following command to create a JSON file containing all the required permissions to deploy a cluster
    statically in Palette.

    ```shell
    cat << EOF > static-permissions.json
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
    EOF
    ```

3.  Next, create a JSON file for the compute gallery scope permissions. Issue the following command to create the JSON
    file.

    ```shell
    cat << EOF > static-gallery-scope-permissions.json
    {
      "Name": "Static Placement Palette Deployer - Compute Gallery Scope",
      "IsCustom": true,
      "Description": "Can deploy the compute gallery level components of Azure IaaS clusters using static placement with Palette.",
      "Actions": [
        "Microsoft.Compute/galleries/images/read",
        "Microsoft.Compute/galleries/images/versions/read"
      ],
      "NotActions": [],
      "AssignableScopes": ["/subscriptions/$SUBSCRIPTION_ID"]
    }
    EOF
    ```

4.  Create a JSON file for the subnet scope permissions.

    ```shell
    cat << EOF > static-subnet-scope-permissions.json
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
    EOF
    ```

5.  The last JSON file is for the virtual network scope permissions. Issue the following command to create the JSON
    file.

    ```shell
    cat << EOF > static-virtual-network-scope-permissions.json
    {
      "Name": "Static Placement Palette Deployer - Virtual Network Scope",
      "IsCustom": true,
      "Description": "Can deploy the virtual network level components of Azure IaaS clusters using static placement with Palette.",
      "Actions": ["Microsoft.Network/virtualNetworks/read"],
      "NotActions": [],
      "AssignableScopes": ["/subscriptions/$SUBSCRIPTION_ID"]
    }
    EOF
    ```

    <!-- prettier-ignore -->
    <details>
    <summary>Click here to view the raw JSON policies.</summary>
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
      "Actions": [
        "Microsoft.Compute/galleries/images/read", 
        "Microsoft.Compute/galleries/images/versions/read"
        ],
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

    </details>

6.  Create a role for each of the JSON files you created in the previous steps. Issue the following commands to create
    the roles.

    ```shell
    az role definition create --role-definition @static-permissions.json --output table
    az role definition create --role-definition @static-gallery-scope-permissions.json --output table
    az role definition create --role-definition @static-subnet-scope-permissions.json --output table
    az role definition create --role-definition @static-virtual-network-scope-permissions.json --output table
    ```

7.  Export resource group, virtual network, subnet, and compute gallery names you desire Palette to use to a set of
    variables.

    ```shell
    export RESOURCE_GROUP_NAME=<resource-group-name>
    export VIRTUAL_NETWORK_NAME=<virtual-network-name>
    export SUBNET_NAME=<subnet-name>
    export COMPUTE_GALLERY_NAME=<compute-gallery-name>
    ```

8.  Export the
    [security principal](https://learn.microsoft.com/en-us/azure/role-based-access-control/overview#security-principal)
    object ID you want to use with Palette to a variable.

    ```shell
    export ASSIGNEE="<security_principal_object_id>"
    ```

9.  Assign the roles to the service principal. Use the following commands to assign the roles.

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

</TabItem>
<TabItem label="Multiple Cluster - Same Resource Group" value="sc2">

1.  Export your Azure subscription ID to a variable.

    ```shell
    export SUBSCRIPTION_ID=<your-subscription-id>
    ```

2.  Issue the following command to create a JSON file containing all the required permissions to deploy a cluster
    statically in Palette.

          ```shell
          cat << EOF > static-placement-permissions.json
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
          EOF
          ```

    <!-- prettier-ignore -->
      <details>
      <summary>Click here to view the raw JSON policy.</summary>
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
    </details>

3.  Create a role for the JSON file you created in the previous step. Issue the following command to create the role.

    ```shell
    az role definition create --role-definition @static-placement-permissions.json --output table
    ```

4.  Export the
    [security principal](https://learn.microsoft.com/en-us/azure/role-based-access-control/overview#security-principal)
    object ID and resource group name you want to use with Palette to a set of variables.

    ```shell
    export ASSIGNEE="<security_principal_object_id>"
    export RESOURCE_GROUP_NAME=<resource-group-name>
    ```

5.  Assign the role to the service principal. Use the following command to assign the role.

    ```json
    az role assignment create --assignee $ASSIGNEE \
      --role "Static Placement Palette Deployer" \
      --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP_NAME"
    ```

</TabItem>

<TabItem label="Multiple Cluster - Same Subscription" value="sc3">

1.  Export your Azure subscription ID to a variable.

    ```shell
    export SUBSCRIPTION_ID=<your-subscription-id>
    ```

2.  Issue the following command to create a JSON file containing all the required permissions to deploy a cluster
    statically in Palette.

    ```shell
    cat << EOF > static-placement-permissions.json
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
    EOF
    ```

      <!-- prettier-ignore -->

        <details>
        <summary>Click here to view the raw JSON policy.</summary>
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
        </details>

3.  Create a role using the JSON file you created in the previous step. Issue the following command to create the role.

    ```shell
    az role definition create --role-definition @static-placement-permissions.json --output table
    ```

4.  Export the
    [security principal](https://learn.microsoft.com/en-us/azure/role-based-access-control/overview#security-principal)
    object ID you want to use with Palette to a variable.

    ```shell
    export ASSIGNEE="<security_principal_object_id>"
    ```

5.  Assign the role to the service principal. Use the following command to assign the role.

    ```shell
    az role assignment create --assignee $ASSIGNEE \
    --role "Static Placement Palette Deployer" \
    --scope "/subscriptions/$SUBSCRIPTION_ID"
    ```

</TabItem>

</Tabs>

### Validate

1. Log in to the Azure portal.

2. Navigate to the Microsoft Entra ID section.

3. Review the role, or roles if you created multiple. Review the role assignments to ensure the service principal has
   the correct permissions assigned.
