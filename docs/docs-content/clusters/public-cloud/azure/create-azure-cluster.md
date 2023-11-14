---
sidebar_label: "Create and Manage Azure IaaS Cluster"
title: "Create and Manage Azure IaaS Cluster"
description: "Learn how to deploy and manage Azure clusters with Palette."
hide_table_of_contents: false
tags: ["public cloud", "azure"]
sidebar_position: 20
---


Palette supports creating and managing Kubernetes clusters deployed to an Azure account. This section guides you on how to create a Kubernetes cluster in Azure that Palette manages.


## Prerequisites

- Access to an Azure cloud account.

- Palette integration with Azure account. Review [Create an Azure Cloud account](azure-cloud.md) for guidance.

- An infrastructure cluster profile for Azure. Review [Create an Infrastructure Profile](../../../profiles/cluster-profiles/create-cluster-profiles/create-infrastructure-profile.md) for guidance.

- If you do not provide your own Virtual Network (VNet), Palette creates one for you with compute, network, and storage resources in AWS when it provisions Kubernetes clusters. Ensure there is sufficient capacity in the preferred AWS region to create the following resources. Note that Palette does not create these resources if you specify an existing VPC. 
    - Virtual CPU (vCPU)
    - Virtual Network (VNet)
    - Static Public IP addresses 
    - Azure Virtual Private Network (VPN) Gateway
    - Load balancers
    - VNet Network Address Translation (NAT) Gateway

  <br />

<!-- <video title="azure-cluster-creation" src="/videos/clusters/public-cloud/azure/azure.mp4"></video> -->

## Deploy an Azure Cluster with Palette

The following steps need to be performed to provision a new Azure cluster:

1. Log in to [Palette](https://console.spectrocloud.com).

2. Ensure you are in the correct project scope.

3. From the left **Main Menu** select **Clusters**, and click on the **Add New Cluster** button.

4. Select **Deploy New Cluster** on the next page that Palette displays. This will allow you to deploy a cluster using your own cloud account.

5. Select **Azure** and click on the **Start Azure Configuration** button.

6. Fill out the following basic information, and click **Next** to continue.

  | **Field** | **Description** |
  |-----------|-----------------|
  | **Cluster Name**| A custom name for the cluster. |
  | **Description**| Use the description to provide context about the cluster.|
  | **Tags**| Assign any desired cluster tags. Tags on a cluster are propagated to the Virtual Machines (VMs) deployed to the target environments. Example: `region:france south`|
  | **Cloud Account** | If you already added your AWS account in Palette, select it from the **drop-down Menu**. Otherwise, click on **Add New Account** and add your Azure account information. |

  To learn how to add an Azure account, review the [Register and Manage Azure Cloud Account](azure-cloud.md#enable-azure-cloud-account-registration-to-palette) guide.


7. Select the Azure cluster profile you created, and click on **Next**. Palette displays the cluster profile layers.


8. Review the profile layers and customize parameters as desired in the YAML files that display when you select a layer. You can configure custom OpenID Connect (OIDC) for Azure clusters at the Kubernetes layer. Check out ??? if you need more guidance. <<<Need reference here to OIDC info.>>>


9. Click on **Next** to continue.


10. Provide the following cluster configuration information.

  If you have custom storage accounts or a storage container available, you can attach them to the cluster. To learn more about attaching custom storage to a cluster, check out [Azure storage](architecture#azure-storage).


:::caution

If the Azure account is registered with **Disable Properties** and **Static Placement** options enabled, then Palette will not import the network information from your Azure account. You can manually input the information for the **Control Plane Subnet** and the **Worker Network**, but be aware that drop-down menu selections will be empty. To learn more about these settings and certain requirements to use them, refer to [Disable Properties](azure-cloud.md#disable-properties). 

:::

<br />

|**Parameter**| **Description**|
|-------------|---------------|
| **Subscription** | Use the **drop-down Menu** to select the subscription that will be used to access Azure services.|
| **Region** | Use the **drop-down Menu** to choose the Azure region where you would like to provision the cluster.|
| **Resource Group** | Select the name of the resource group that contains the Azure resources you will be accessing.|
| **Storage Account** | (Optionally). If you have a custom storage account you want to use, provide the storage account name. For information about use cases for custom storage, review [Azure Storage](architecture#azure-storage).|
| **Storage Container**| (Optional) If you will be using a custom storage account and custom container, provide the storage container name. For information about use cases for custom storage, review [Azure Storage](architecture#azure-storage).|
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

and click on **Next** to continue.

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
