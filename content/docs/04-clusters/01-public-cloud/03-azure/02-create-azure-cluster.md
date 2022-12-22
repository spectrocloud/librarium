---
title: "Create and Manage Azure IaaS Cluster"
metaTitle: "Creating new Azure clusters on Palette"
metaDescription: "The methods of creating an Azure cluster in Palette"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";


# Deploy an Azure Cluster

You can deploy Azure clusters in the Palette platform. This section highlights the prerequisites and deployment steps of Palette Azure clusters. 

Azure clusters can be created under the following scopes:

* Tenant Admin

* Project Scope - This is the recommended scope.

Be aware that clusters that are created under the **Tenant Admin** scope are not visible under Project scope .

# Prerequisites

The following prerequisites must be met before deploying a workload cluster in Azure:

1. You must have an active Azure cloud account with sufficient resource limits and permissions to provision compute, network, and security resources in the desired regions.


2. Register your Azure cloud account in Palette as described in the [Creating an Azure Cloud account](/clusters/public-cloud/azure/azure-cloud) section.


3. A [cluster profile created](/cluster-profiles/task-define-profile) for Azure cloud.


## Video Demonstration

`video: title: "azure-cluster-creation": ../cluster-creation-videos/azure.mp4`

## Deploy an Azure Cluster with Palette

The following steps need to be performed to provision a new Azure cluster:

1. Log in to [Palette](https://console.spectrocloud.com).


2. Click on **Clusters** from the left **Main Menu**.


2. In the cluster page click **+ Add New Cluster** button and select **create new cluster**.


3. Select **Azure** as the cloud type and click on **Start Azure Configuration** to input cluster information 


4. Provide the basic cluster information such as **Name**, **Description** (optional), and **Tags** (optional) and select the [**Azure Cloud Account**](/clusters/public-cloud/azure#creatinganazurecloudaccount) from the drop-down menu. Azure cloud accounts with credentials must be pre-configured in project settings. Click on the **Next** button.


5. Select the **Cluster Profile** created for the Azure environment. The profile definition will be used as the cluster construction template. Click on **Next**.


6. Review and override pack parameters as desired. By default, parameters for all packs are set with values defined in the Cluster Profile. Click on **Next**.


7. Provide the Azure Cloud account placement information for cluster configuration.

|**Parameter**| **Description**|
|-------------|---------------|
| **Subscription** | From the drop-down menu, select the subscription that will be used to access Azure Services.|
| **Region** | Select a region in Azure in which the cluster should be deployed.|
| **Resource Group** | Select the Azure resource group in which the cluster should be deployed.|
| **Storage Account** | Optionally provide the storage account.|
| **Storage Container**| Optionally provide the Azure storage container.|
| **SSH Key** | Public key to configure remote SSH access to the nodes.|
| **Static Placement** | By default, Palette uses dynamic placement, in which a new VPC with a public and private subnet is created to place cluster resources for every cluster. These resources are fully managed by Palette and deleted when the corresponding cluster is deleted. <br /> If you want to place resources into pre-existing VPCs and subnets, you can enable the **Static Placement** option, which requires that you provide the following placement information:|
| |**Network Resource Group**: The logical container for grouping related Azure resources.|
| | **Virtual Network**: Select the virtual network from the drop-down menu.|
| | **CIDR Block**: Select the CIDR address from the drop-down menu.|
| | **Control plane Subnet**: Select the control plane network from the dropdown menu.|
| | **Worker Network**: Select the worker network from the drop-down menu.|
|**Update worker pools in parallel**| Check the box to concurrently update the worker pools.|
|**Private API Server LB**|This option applies when the cluster is deployed via the [Azure Private Endpoint](/clusters/public-cloud/azure/gateways). You can enable this option if your API Server must have private access.|
| |**Private DNS Zone**: Optionally select the DNS Zone from the drop-down menu. If you do not select a DNS Zone, one will be generated and assigned.|
| |**IP Allocation Method**: Allocate an available IP from the private endpoint VNet. The two possible allocations are:
| |* **Dynamic**: The Dynamic Host Configuration Protocol (DHCP) dynamically allocates IP addresses from the available  Virtual Network IP CIDR range.
| |* **Static**: You specify a static IP address from the available Virtual Network IP range.|
|**Update worker pools in parallel**|If you have multiple worker pools, select the check box to enable simultaneous upgrade of all the pools. The default is sequential upgrade.|
When you have provided all the cluster configuration details to the wizard, click on **Next** and proceed to node configuration.

<InfoBox>

If the Palette [cloud account](/clusters/public-cloud/azure#creatinganazurecloudaccount) is created with **Disable Properties** and with
**Static Placement**, the network information from your Azure account will not be imported to Palette. You can manually input the information for the ** <Tooltip trigger={<u>Control Plane Subnet</u>}><br /> Name <br /> CIDR Block <br /> Security Group Name</Tooltip>** and the ** <Tooltip trigger={<u>Worker Network</u>}><br /> Name <br /> CIDR Block <br /> Security Group Name</Tooltip>**, but drop-down menu selections are not available.
</InfoBox>

7. Configure the master and worker node pools. A master and a worker node pool are configured by default.

    |**Parameter**| **Description**|
    |-------------|----------------|    
    |**Name** | A descriptive name for the node pool|
    |**Size** | Number of nodes to be provisioned for the node pool. For the master pool, this number can be 1, 3, or 5|
    |**Allow worker capability (master pool)**| To allow workloads to be provisioned on master nodes|
    |**Instance Type**|Select the Azure instance type to be used for all the nodes in the pool|
    |**Managed Disk**| Select the managed disk type to be used.|
    |**Disk Size**|Storage disk size in GB to be attached to the node.|
    |**Rolling Updates**| There are two choices of Rolling Update.|
    ||**Expand First**: Launches the new node and then shut down the old node.|
    ||**Contract First**: Shut down the old node first and then launches the new node.|
    |**Availability Zones**| Choose one or more availability zones. Palette provides fault tolerance to guard against failures like hardware failures or network failures, by provisioning nodes across availability zones, if multiple zones are selected. Zones are supported only for worker pools.|
   
    
8. Click **Review** settings and deploy the cluster. Provisioning status with details of ongoing provisioning tasks is available to track progress.

<InfoBox>

You can add new worker pools to customize certain worker nodes to run specialized workloads. For example, the default worker pool may be configured with the <i>Standard_D2_v2</i> instance types for general-purpose workloads and another worker pool with instance type <i>Standard_NC12s_v3</i> can be configured to run GPU workloads.

</InfoBox>


# Deleting an Azure Cluster
The deletion of an Azure cluster results in the removal of all Virtual Machines and associated storage disks created for the cluster. The following tasks need to be performed to delete an Azure cluster:

1. Select the cluster to be deleted from the **Cluster** **View** page and navigate to the **Cluster Overview** page.


2. Invoke a delete action available on the page: **Cluster** > **Settings** > **Cluster** **Settings** > **Delete** **Cluster**.


3. Click **Confirm** to delete.


The Cluster Status is updated to **Deleting** while cluster resources are being deleted. Provisioning status is updated with the ongoing progress of the delete operation. Once all resources are successfully deleted, the cluster status changes to **Deleted** and is removed from the list of clusters.

# Force Delete a Cluster

A cluster stuck in the **Deletion** state can be force deleted by the user through the User Interface. The user can go for a force deletion of the cluster, only if it is stuck in a deletion state for a minimum of **15 minutes**. Palette enables cluster force delete from the Tenant Admin and Project Admin scope. 

## To force delete a cluster:

1. Log in to [Palette](https://console.spectrocloud.com).

2. Click on **Cluster** on the left **Main Menu**


3. Navigate to the **Cluster Details** page of the cluster stuck in deletion.

      - If the deletion is stuck for more than 15 minutes, click the **Force Delete Cluster** button from the **Settings** dropdown. 
    
      - If the **Force Delete Cluster** button is not enabled, wait for 15minutes. The **Settings** dropdown will give the estimated time for the auto-enabling of the force delete button.
    

<WarningBox>
Remove all outstanding cloud resources deployed by Palette before proceeding with a force delete.  
</WarningBox>


## Validation

To validate the Azure cluster creation and deletion status

1. Log in to [Palette](https://console.spectrocloud.com).


2. Click on **Cluster** on the left **Main Menu**


4. Click on the check box **Deleted only** to view all the clusters deleted in last 72 hours.




