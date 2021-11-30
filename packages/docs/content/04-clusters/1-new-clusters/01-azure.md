---
title: "Azure"
metaTitle: "Creating new clusters on Spectro Cloud"
metaDescription: "The methods of creating clusters for a speedy deployment on any CSP"
hideToC: false
fullWidth: false
---

import Tabs from '@librarium/shared/src/components/ui/Tabs';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import InfoBox from '@librarium/shared/src/components/InfoBox';
import PointsOfInterest from '@librarium/shared/src/components/common/PointOfInterest';

# Overview

Following are some of the architectural highlights of Azure clusters deployed by Spectro Cloud:

* Azure cluster resources are placed within an existing Resource Group.
* Nodes are provisioned within a Virtual Network that is auto-created or preexisting, with one subnet for control plane nodes and one for worker nodes. These two subnets are secured with separate Network Security Groups. Both subnets can span across multiple AZs.  
* Worker nodes are distributed across multiple AZs.
* None of the control plane nodes and worker nodes have public IPs attached. The Kubernetes API Server endpoint is accessed  through a public load balancer.

![azure_cluster_architecture.png](azure_cluster_architecture.png)

# Prerequisites

The following prerequisites must be met before deploying a workload cluster in Azure:

* You must have an active Azure cloud account with sufficient resource limits and permissions to provision compute, network and security resources in the desired regions.
* You must register your Azure cloud account in Spectro Cloud as described in the "Creating an Azure Cloud account" section below.
* You should have an Infrastructure cluster profile created in Spectro Cloud for Azure cloud.

# Creating an Azure cloud account

To create an Azure cloud account, we would need:

* Client ID
* Tenant ID
* Client secret

For this, we first need to create an Azure Active Directory (AAD) Application which can be used with role-based access control. Follow the steps below to create a new AAD application, assign roles and create the client secret:

* Follow the steps described [here](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#create-an-azure-active-directory-application) to create a new Azure Active Directory application. Note down your ClientID and TenantID .
* On creating the application, a minimum required [ContributorRole](https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#contributor) needs to be assigned. To assign any kind of role, the user must have a minimum role of [UserAccessAdministrator](https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#user-access-administrator). The role can be assigned by following the [Assign Role To Application](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#assign-a-role-to-the-application) link.
* Follow the steps described in the [Create an Application Secret](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#create-a-new-application-secret) section to create the client application secret. Store the Client Secret safely as it will not be available as plain text later.

# Deploying an Azure Cluster

 ![azure-cluster-creation](./cluster-creation-videos/azure.mp4)

The following steps need to be performed to provision a new Azure cluster:

* Provide the basic cluster information like name, description, and tags.
* Select a cluster profile created for the Azure environment. The profile definition will be used as the cluster construction template.
* Review and override pack parameters as desired. By default, parameters for all packs are set with values defined in the cluster profile.
* Provide the Azure Cloud account and placement information.
    - Cloud Account - Select the desired cloud account. Azure cloud accounts with credentials need to be pre-configured in project settings.
    - Subscription - Select the subscription which is to be used to access Azure Services.
    - Region - Select a region in Azure in which the cluster should be deployed.
    - Resource Group - Select the resource group in which the cluster should be deployed.
    - SSH Key - Public key to configure remote SSH access to the nodes.
    - Static Placement - By default, Spectro Cloud uses dynamic placement wherein a new VPC with a public and private subnet is created to place cluster resources for every cluster. These resources are fully managed by Spectro Cloud and deleted when the corresponding cluster is deleted. Turn on the Static Placement option if its desired to place resources into preexisting VPCs and subnets.If the user is making the selection of static Placement of resources, the following placement information need to be provided:
   	 - Virtual Network
   	 - Control plane Subnet
   	 - Worker Network
    - Make the choice of updating the worker pool in parallel.
* Configure the master and worker node pools. A master and a worker node pool are configured by default.
    - Name - A descriptive name for the node pool.
    - Size - Number of nodes to be provisioned for the node pool. For the master pool, this number can be 1, 3, or 5.
    - Allow worker capability (master pool) - To allow workloads to be provisioned on master nodes.
    - Instance Type - Select the Azure instance type to be used for all the nodes in the pool.
    - Managed Disk - Select the managed disk type to be used.
    - Disk Size - Storage disk size in GB to be attached to the node.
    - Make your selection of Rolling Update of nodes. There are two choices of Rolling Update:
		- Expand First: Launches the new node and then shut down the old node
		- Contract First: Shut down the old node first and then launches the new node
    - Availability Zones - Choose one or more availability zones. Spectro Cloud provides fault tolerance to guard against failures like hardware failures, network failures, etc. by provisioning nodes across availability zones if multiple zones are selected. Zones are supported only for worker pools.

* Review the settings and deploy the cluster. Provisioning status with details of ongoing provisioning tasks is available to track progress.

<InfoBox>
New worker pools may be added if its desired to customize certain worker nodes to run specialized workloads. As an example, the default worker pool may be configured with the ‘Standard_D2_v2’ instance types for general-purpose workloads and another worker pool with instance type ‘Standard_NC12s_v3’ can be configured to run GPU workloads.
</InfoBox>

# Deleting an Azure Cluster
  The deletion of an Azure cluster results in the removal of all Virtual machines and associated storage disks created for the cluster. The following tasks need to be performed to delete an Azure cluster:

* Select the cluster to be deleted from the cluster view and navigate to the cluster overview page.
* Invoke a delete action available on the page: cluster -> settings -> cluster settings -> delete.
* Confirm delete.
Cluster status is updated to ‘Deleting’ while cluster resources are being deleted. Provisioning status is updated with the ongoing progress of the delete operation. Once all resources are successfully deleted, the cluster status changes to ‘Deleted’ and is removed from the list of clusters.
