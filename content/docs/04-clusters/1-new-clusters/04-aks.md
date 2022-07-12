---
title: "Azure-AKS"
metaTitle: "Creating new clusters on Spectro Cloud"
metaDescription: "The methods of creating clusters for a speedy deployment on any CSP"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';


# Overview

The following is the detailing of the Azure Kubernetes Service (AKS) cluster provisioning by Palette:

1. The Palette platform enables the effortless deployment and management of containerized applications with fully-managed AKS. 


2. It provides the users with server-less Kubernetes, an integrated continuous integration and continuous delivery (CI/CD) experience, and enterprise-grade security and governance. 


3. This unites the development and operations to a single platform achieving faster build, delivery, and scaling of applications with credence. 


4. The infrastructure has an event-driven autoscaling and triggers that enable Elastic provisioning for this self-managed infrastructure. 


5. Extensive authentication and authorization capabilities using Azure Active Directory and dynamic rules enforcement, across multiple clusters with Azure Policy.


![aks_cluster_architecture.png](aks_cluster_architecture.png)

# Prerequisites

The following prerequisites must be met before deploying an AKS workload cluster:

1. You need an active Azure cloud account with sufficient resource limits and permissions to provision compute, network and security resources in the desired regions.


2. You must have permissions to deploy clusters using AKS service on Azure.


3. Register your Azure cloud account in Palette as described in the "Creating an Azure Cloud account" section below.


4. You should have an Infrastructure cluster profile created in Palette for AKS.

### Additional prerequisites

There are additional prerequisites if Azure Active Directory integration for the AKS cluster is desired:
  1. A Tenant Name must be provided as part of the Azure cloud account creation in Palette.
   

  2. For the Azure client used in the Azure cloud account, these API permission have to be provided:
  
    || |
    |-------------|---------------|
    | Microsoft Graph :| Group.Read.All (Application Type)|
    | Microsoft Graph: |Directory.Read.All (Application Type)|

  3. These permissions can be configured from the Azure cloud console under **App registrations** > **API permissions** for the specified App.

# Creating an Azure cloud account

![Azure-cloud-account](/cloud-accounts/azure.mp4)

To create an Azure cloud account, we need:

* Client ID
* Tenant ID
* Client secret

For this, we first need to create an Azure Active Directory (AAD) Application which can be used with role-based access control. Follow the steps below to create a new AAD application, assign roles, and create the client secret:

1. Follow the steps described [here](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#create-an-azure-active-directory-application) to create a new Azure Active Directory application. Note down your ClientID and TenantID.


2. On creating the application, a minimum required [ContributorRole](https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#contributor) needs to be assigned. To assign any kind of role, the user must have a minimum role of [UserAccessAdministrator](https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#user-access-administrator). The role can be assigned by following the [Assign Role To Application](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#assign-a-role-to-the-application) link.


3. Follow the steps described in the [Create an Application Secret](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#create-a-new-application-secret) section to create the client application secret. Store the Client Secret safely as it will not be available as plain text later.

# Deploying an AKS Cluster

 ![aks-cluster-creation](./cluster-creation-videos/aks.mp4)

The following steps need to be performed to provision a new AKS cluster:

1. Provide the basic cluster information like Name, Description, and Tags.


2. Select a Cluster Profile created for the AKS Cluster. The profile definition will be used as the Cluster Construction Template.


3. Review and override pack parameters as desired. By default, parameters for all packs are set with values defined in the Cluster Profile.

4. Provide the Azure Cloud account and placement information.

    |**Parameter**      | **Description**|
    |-------------------|---------------|
    | **Cloud Account** | Select the desired cloud account. Azure cloud accounts with credentials need to be preconfigured in project settings.|
    | **Subscription**  | Select the subscription which is to be used to access Azure Services.|
    | **Region**        | Select a region in Azure in which the cluster should be deployed.|
    | **Resource Group**| Select the resource group in which the cluster should be deployed.|
    | **SSH Key**       | Public key to configure remote SSH access to the nodes.|
    | **Placement**     | If the choice of placement is Static, then select:
    |                   | **Virtual Network**: Select the virtual network from dropdown menu.|
    |                   | **Control plane Subnet**: Select the control plane network from the dropdown menu.|
    |                   | **Worker Network**: Select the worker network from the dropdown menu.|

5. Configure the worker node pools. A worker node pool is configured by default.

    |**Parameter**| **Description**|
    |-----------------|---------------| 
    |**Name**         |A descriptive name for the node pool.|
    |**Size**         |Number of nodes to be provisioned for the node pool.|
    |**Autoscaler**   |Toggle the selector to enable the AKS Autoscaler.|
    |                 |Give the minimum and maximum number of nodes. Depending on the load on the worker pool the number of nodes will scale up and down between the minimum and maximum size provided.| 
    |**Instance Type**|Select the Azure instance type to be used for all the nodes in the pool.|
    |**Managed Disk** | Select the managed disk type to be used.|
    |**Disk Size**    |Storage disk size in GB to be attached to the node.|
    |**Availability Zones (if any)**|Choose one or more availability zones. Palette provides fault tolerance to guard against failures like hardware failures or network failures, by provisioning nodes across availability zones if multiple zones are selected. Zones are supported only for worker pools.|
    
<InfoBox>
Every AKS cluster must contain at least one system node pool with at least one node.

If you run a single system node pool for your AKS cluster in a production environment, it is recommended to use at least three nodes for the node pool.
</InfoBox>

<InfoBox>
A minimum allocation of <i>two (2)</i> CPU cores is required across all worker nodes.

A minimum allocation of <i>4Gi</i> of memory is required across all worker nodes.
</InfoBox>


6. Set the schedules of OS Patching, Scans, or backup and recovery as per user choice.

7. Review the settings and deploy the cluster. Provisioning status with details of ongoing provisioning tasks is available to track progress.

<InfoBox>
New worker pools may be added if it desired to customize certain worker nodes to run specialized workloads. As an example, the default worker pool may be configured with the <i>Standard_D2_v2</i> instance types for general-purpose workloads and another worker pool with instance type <i>Standard_NC12s_v3</i> can be configured to run GPU workloads.
</InfoBox>


# Deleting an AKS Cluster

The deletion of an AKS cluster results in the removal of all Virtual Machines and associated Storage Disks, created for the cluster. The following tasks need to be performed to delete an AKS cluster:

1. Select the cluster to be deleted from the **Cluster** **View** page and navigate to the **Cluster Overview** page.


2. Invoke a delete action available on the page: **Cluster** > **Settings** > **Cluster** **Settings** > **Delete** **Cluster**.


3. Click **Confirm** to delete.

The Cluster Status is updated to **Deleting** while cluster resources are being deleted. Provisioning status is updated with the ongoing progress of the delete operation. Once all resources are successfully deleted, the cluster status changes to **Deleted** and is removed from the list of clusters.

# Force Delete a Cluster

A cluster stuck in the **Deletion** state can be force deleted by the user through the User Interface. The user can go for a force deletion of the cluster, only if it is stuck in a deletion state for a minimum of **15 minutes**. Palette enables cluster force delete from the Tenant Admin and Project Admin scope. 

## To force delete a cluster:

1. Log in to the Palette Management Console.


2. Navigate to the **Cluster Details** page of the cluster stuck in deletion.

      - If the deletion is stuck for more than 15 minutes, click the **Force Delete Cluster** button from the **Settings** dropdown. 
    
      - If the **Force Delete Cluster** button is not enabled, wait for 15 minutes. The **Settings** dropdown will give the estimated time for the auto-enabling of the **Force Delete** button.

<WarningBox>
If there are any cloud resources still on the cloud, the you should cleanup those resources before going for the force deletion. 
</WarningBox>

# Configuring an Azure Active Directory 
The Azure Active Directory (AAD) could be enabled while creating and linking the Azure Cloud account for the Palette Platform, using a simple check box. Once the Cloud account is created, you can create the Azure AKS cluster. The AAD-enabled AKS cluster will have its Admin *kubeconfig* file created and can be downloaded from our Palette UI as the 'Kubernetes config file'. You need to create manually the User's *kubeconfig* file to enable AAD completely. The following are the steps to create the custom user *kubeconfig* file:

1. Go to the Azure console to create the Groups in Azure AD to access the Kubernetes RBAC and Azure AD control access to cluster resources.


2. After you create the groups, create users in the Azure AD.


3. Create custom Kubernetes roles and role bindings for the created users and apply the roles and role bindings, using the Admin *kubeconfig* file.


<InfoBox>
The above step can also be completed using Spectro RBAC pack available under the Authentication section of Add-on Packs.
</InfoBox>


4. Once the roles and role bindings are created, these roles can be linked to the Groups created in Azure AD.


5. The users can now access the Azure clusters with the complete benefits of AAD. To get the user-specific *kubeconfig* file please run the following command:


    az aks get-credentials --resource-group <resource-group> --name <cluster-name>


### References:

[Use Kubernetes RBAC with Azure AD integration](https://docs.microsoft.com/en-us/azure/aks/azure-ad-rbac?toc=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fazure%2Faks%2Ftoc.json&bc=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fazure%2Fbread%2Ftoc.json)

