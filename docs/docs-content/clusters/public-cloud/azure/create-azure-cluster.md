---
sidebar_label: "Create and Manage Azure IaaS Cluster"
title: "Create and Manage Azure IaaS Cluster"
description: "The methods of creating an Azure cluster in Palette"
hide_table_of_contents: false
tags: ["public cloud", "azure"]
sidebar_position: 20
---


You can deploy Azure clusters in the Palette platform. This section highlights the prerequisites and deployment steps of Palette Azure clusters.

Azure clusters can be created under the following scopes:

* Tenant Admin

* Project Scope - This is the recommended scope.

Be aware that clusters that are created under the **Tenant Admin** scope are not visible under Project scope .

## Prerequisites

The following prerequisites must be met before deploying a workload cluster in Azure:

1. You must have an active Azure cloud account with sufficient resource limits and permissions to provision compute, network, and security resources in the desired regions.


2. Register your Azure cloud account in Palette as described in the [Creating an Azure Cloud account](azure-cloud.md#enable-azure-cloud-account-registration-to-palette) section.


3. A [cluster profile created](../../../profiles/cluster-profiles/create-cluster-profiles/create-infrastructure-profile.md) for Azure cloud.


<video title="azure-cluster-creation" src="/videos/clusters/public-cloud/azure/azure.mp4"></video>

## Deploy an Azure Cluster with Palette

The following steps need to be performed to provision a new Azure cluster:

1. Log in to [Palette](https://console.spectrocloud.com).


2. Click on **Clusters** from the left **Main Menu**.


2. In the cluster page click **+ Add New Cluster** button and select **create new cluster**.


3. Select **Azure** as the cloud type and click on **Start Azure Configuration** to input cluster information


4. Provide the basic cluster information such as **Name**, **Description** (optional), and **Tags** (optional) and select the [**Azure Cloud Account**](azure-cloud.md#enable-azure-cloud-account-registration-to-palette) from the drop-down menu. Azure cloud accounts with credentials must be pre-configured in project settings. Click on the **Next** button.


5. Select the **Cluster Profile** created for the Azure environment. The profile definition will be used as the cluster construction template. Click on **Next**.


6. Review and override pack parameters as desired. By default, parameters for all packs are set with values defined in the Cluster Profile. Click on **Next**.


7. Provide the Azure Cloud account placement information for cluster configuration. If you have custom storage accounts or storage container available, they will be eligible for attachment. To learn more about attaching custom storage to a cluster, check out the [Azure storage](architecture#azure-storage) page.


:::caution

If the Azure account is [registered](azure-cloud.md#enable-azure-cloud-account-registration-to-palette) with the option **Disable Properties** enabled and the cluster configuration option **Static Placement** is enabled, then the network information from your Azure account will not be imported by Palette. You can manually input the information for the **Control Plane Subnet** and the **Worker Network**, but be aware that drop-down menu selections will be empty.

:::

<br />

|**Parameter**| **Description**|
|-------------|---------------|
| **Subscription** | From the drop-down menu, select the subscription that will be used to access Azure Services.|
| **Region** | Select a region in Azure in which the cluster should be deployed.|
| **Resource Group** | Select the Azure resource group in which the cluster should be deployed.|
| **Storage Account** | Optionally provide the storage account. Review the [Azure Storage section](architecture#azure-storage) for a custom storage use cases. |
| **Storage Container**| Optionally provide the Azure storage container. Review the [Azure Storage section](architecture#azure-storage) for a custom storage use cases.|
| **SSH Key** | The public SSH key for connecting to the nodes. Review Microsoft's [supported SSH](https://learn.microsoft.com/en-us/azure/virtual-machines/linux/mac-create-ssh-keys#supported-ssh-key-formats) formats. |
| **Static Placement** | By default, Palette uses dynamic placement, in which a new VPC with a public and private subnet is created to place cluster resources for every cluster. These resources are fully managed by Palette and deleted when the corresponding cluster is deleted. <br /> If you want to place resources into pre-existing VPCs and subnets, you can enable the **Static Placement** option. Review the [Static Placement](#static-placement-table) table below for available parameters for static placement.|
|**Update worker pools in parallel**| Check the box to concurrently update the worker pools.|
|**Private API Server LB**|This option applies when the cluster is deployed via the [Azure Private Endpoint](gateways.md). You can enable this option if your API Server must have private access. Review the [Private API Server LB](#private-api-server-lb-table) table below for more details.|
|**Update worker pools in parallel**|If you have multiple worker pools, select the check box to enable simultaneous upgrade of all the pools. The default is sequential upgrade.|

#### Static Placement Table

| **Parameter**              | **Description** |
|------------------------|------------------------------------------------------------|
| **Network Resource Group** | The logical container for grouping related Azure resources |
| **Virtual Network**        | Select the virtual network from the drop-down menu.        |
| **CIDR Block**             | Select the CIDR address from the drop-down menu.           |
| **Control Plane Subnet**   | Select the control plane network from the dropdown menu.   |
| **Worker Network**         | Select the worker network from the drop-down menu.         |



#### Private API Server LB Table


| **Parameter**            | **Description**|
|----------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| **Private DNS Zone**   | Optionally select the DNS Zone from the drop-down menu. If you do not select a DNS Zone, one will be generated and assigned.|
| **IP Allocation Method** | Allocate an available IP from the private endpoint VNet. Review the [IP Allocation Method Table](#ip-allocation-method-table) below for more details.|

##### IP Allocation Method Table

| **Parameter**            | **Description** |
|----------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| **Dynamic**              | Use Dynamic Host Configuration Protocol (DHCP) to dynamically allocates IP addresses from the available Virtual Network IP CIDR range.|
| **Static**               | You can specify a static IP address from the available Virtual Network IP range.|

When you have provided all the cluster configuration details to the wizard, click on **Next** and proceed to node configuration.

<br />

7. Configure the master and worker node pools. A master and a worker node pool are configured by default. To learn more about the configuration options, review the [Node Pool](../../cluster-management/node-pool.md) documentation page.

:::info

You can add new worker pools to customize certain worker nodes to run specialized workloads. For example, the default worker pool may be configured with the Standard_D2_v2 instance types for general-purpose workloads and another worker pool with instance type Standard_NC12s_v3 can be configured to run GPU workloads.

:::

<br />


8. The settings page is where you can configure patching schedule, security scans, backup settings, setup role based access control (RBAC), and enable [Palette Virtual Clusters](../../../devx/palette-virtual-clusters/palette-virtual-clusters.md). Review the settings and make changes if needed. Click on **Validate**.


9. Review the settings summary and click on **Finish Configuration** to deploy the cluster. Be aware that provisioning IaaS clusters can take several minutes.


The cluster details page of the cluster contains the status and details of the deployment. Use this page to track the deployment progress.

## Validate

You can validate your cluster is up and running by reviewing the cluster details page. Navigate to the left **Main Menu** and click on **Clusters**. The **Clusters** page contains a list of all available clusters managed by Palette. Click on the row for the cluster you wish to review its details page. Ensure the **Cluster Status** field contains the value **Running**.
## Deleting an Azure IaaS Cluster

The deletion of an Azure IaaS cluster results in the removal of all instances and associated resources created for the cluster. To perform a cluster deletion, use the following steps.


1. Ensure you are in the correct project scope.


2. Navigate to the left **Main Menu** and click on **Clusters**


3. Click on the cluster that you want to remove.


4. Click on the **Settings** drop-down menu.


5. Click on **Delete Cluster**


6. Type in the name of the cluster and click on **OK**

The cluster status is updated to **Deleting** while cluster resources are being deleted. Once all resources are successfully deleted, the cluster status is updated to **Deleted** and is removed from the list of clusters.

## Force Delete a Cluster

If a cluster is stuck in the **Deletion** state for a minimum of 15 minutes it becomes eligible for force deletion. You can force delete a cluster from the tenant and project admin scope.
To force delete a cluster follow the same steps outlined in [Deleting an Azure IaaS Cluster](#deleting-an-azure-iaas-cluster). However, after 15 minutes, a **Force Delete Cluster** option is available in the **Settings** drop-down menu. The **Settings** drop-down menu will provide you with an estimated time left before the force deletion becomes available..

<br />

:::caution


A force delete can result in resources Palette provisioned being missed in the removal process. Verify there are no remaining Palette provisioned resources such as:

- Virtual Network (VNet)
- Static Public IPs
- Virtual Network Interfaces
- Load Balancers
- VHD
- Managed Disks
- Virtual Network Gateway

Failure in removing provisioned resources can result in unexpected costs.

:::

## Validate

To validate the Azure cluster creation and deletion status

1. Log in to [Palette](https://console.spectrocloud.com).


2. Click on **Cluster** on the left **Main Menu**


4. Click on the check box **Deleted only** to view all the clusters deleted in the last 72 hours.
