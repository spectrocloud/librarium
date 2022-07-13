---
title: "Azure-AKS"
metaTitle: "Creating new clusters on Palette"
metaDescription: "The methods of creating clusters for a speedy deployment on any CSP"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';


# Overview

The following is the detailing of the Microsoft Azure Kubernetes Service (AKS) cluster provisioning by Palette:


1. The Palette platform enables the effortless deployment and management of containerized applications with fully-managed AKS. 


2. It provides the users with server-less Kubernetes, an integrated continuous integration and continuous delivery (CI/CD) experience, and enterprise-grade security and governance.


3. This unites the development and operations to a single platform achieving faster build, delivery, and scaling of applications with credence.


4. The infrastructure has an event-driven autoscaling and triggers that enable Elastic provisioning for this self-managed infrastructure.


5. Leverage extensive authentication and authorization capabilities using Azure Active Directory and dynamic rules enforcement, across multiple clusters with Azure Policy.


![aks_cluster_architecture.png](aks_cluster_architecture.png)

# Prerequisites

These prerequisites must be met before deploying an AKS workload cluster:

1. You need an active Azure cloud account with sufficient resource limits and permissions to provision compute, network, and security resources in the desired regions.


2. You will need to have permissions to deploy clusters using AKS service on Azure.


3. Register your Azure cloud account in Palette as described in the [Creating an Azure Cloud Account](#creatinganazurecloudaccount) section below.


4. You should have a cluster profile created in Palette for AKS.
   

5. Associate a SSH key pair to the cluster worker node.


<br />

## Additional Prerequisites

There are additional prerequisites if you want to set up Azure Active Directory integration for the AKS cluster:


  1. A Tenant Name must be provided as part of the Azure cloud account creation in Palette.
   

  2. For the Azure client used in the Azure cloud account, these API permissions have to be provided:
  
    |                 |                                       |
    | --------------- | ------------------------------------- |
    | Microsoft Graph | Group.Read.All (Application Type)     |
    | Microsoft Graph | Directory.Read.All (Application Type) |

  3. These permissions can be configured from the Azure cloud console under **App registrations** > **API permissions** for the specified application.


# Creating an Azure Cloud Account

![Azure-cloud-account](/cloud-accounts/azure.mp4)

To create an Azure cloud account, we need:

* Client ID
* Tenant ID
* Client secret

For this, we first need to create an Azure Active Directory (AAD) application which can be used with role-based access control. Follow the steps below to create a new AAD application, assign roles, and create the client secret:

<br />

1. Follow the steps described [here](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#create-an-azure-active-directory-application) to create a new Azure Active Directory application. Note down your ClientID and TenantID.


2. On creating the application, assign a minimum required [ContributorRole](https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#contributor). To assign any kind of role, the user must have a minimum role of [UserAccessAdministrator](https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#user-access-administrator). Follow the [Assign Role To Application](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#assign-a-role-to-the-application) link learn more about roles. 


3. Follow the steps described in the [Create an Application Secret](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#create-a-new-application-secret) section to create the client application secret. Store the Client Secret safely as it will not be available as plain text later.

# Deploying an AKS Cluster

<br />

![aks-cluster-creation](./cluster-creation-videos/aks.mp4)


The following steps need to be performed to provision a new AKS cluster profile:
<br />


1. If you already have a profile to use, go to the **Cluster** > **Add a New Cluster** > **Deploy New Cluster** and select an Azure profile. If you do not have a profile to use, follow these steps to create a new profile for an AKS Cluster. <br />
 
    - Go to the **Profiles** tab in the slide menu and click the **Add a Cluster Profile** button.

    - Add the basic information such as **Name**, **Version**, **Description**, **Tags** and **Type**.

    - Next, select **AKS** from the **Managed Kubernetes** list.

    - Build the Profile Layers and override the Pack Parameters as desired. The profile definition will be used as the Cluster Construction Template.

      | **Layers**           | **Pack Name**                                                            |
      | -------------------- | ------------------------------------------------------------------------ |
      | **Operating System** | Linux                                                                    |
      | **Kubernetes**       | kubernetes-aks                                                           |
      | **Network**          | **Azure CNI** is the only network pack you can use with Microsoft Azure. |
      | **Storage**          | **Azure Disk** will be the only pack available to select.                |

 - Review and click the **Finish Configuration** button to save and publish the new cluster profile.


2. Once you have **Deployed** the new cluster, fill the basic cluster information such as **Name**, **Description**, **Tags** and **Cloud Account**.


3. In the **Cloud Account** dropdown list, select the Azure Cloud account and or create a new one see the [Creating an Azure Cloud Account](#creatinganazurecloudaccount) section above.


4.  Next, in the **Cluster profile** tab from the **Managed Kubernetes** list, pick **AKS**, and select the AKS cluster profile definition that was created above.


5. Review the **Parameters** for the selected cluster profile definitions. By default, parameters for all packs are set with values defined in the Cluster Profile.
   

6. Complete the **Cluster config** section with the information for each parameter listed below.
   
    | **Parameter**      | **Description**                                                                              |
    | ------------------ | -------------------------------------------------------------------------------------------- |
    | **Subscription**   | Select the subscription which is to be used to access Azure Services.                        |
    | **Region**         | Select a region in Azure in which the cluster should be deployed.                            |
    | **Resource Group** | Select the resource group in which the cluster should be deployed.                           |
    | **SSH Key**        | Public key to configure remote SSH access to the nodes.                                      |
    | **Placement**      | You may leave this unchecked, unless the choice of placement is Static, then select:         |
    |                    | **Virtual Network**: Select the virtual network from dropdown menu.                          |
    |                    | **CIDR Block**: Enter the groups of addresses:                                               |
    |                    | **Control plane Subnet**: Select the control plane network from the dropdown menu.           |
    |                    | **Worker Network**: Select the worker network from the dropdown menu.                        |
    |                    | **Update worker pools in parallel** : Check the box to concurrently update the worker pools. |

7.  Configure the worker node. 


<br />

## Adding a Worker Node

1. Configure the worker node. In this section, we will learn how to configure a worker node. However, in a production environment, the ideal settings are to create a node pool with at least three (3) nodes. In that case, a System Node Pool must be created first.

<InfoBox>
The System Node Pool serves to run critical system components. Its operating system type must be created prior to other worker node pools. Palette automatically determines this when you turn it into a system node.
</InfoBox>

2. Click the checkbox to turn this into the System Node if you are creating a node pool with multiple worker nodes.

    **Note**: Identifying the System Node Pool as such will deactivate the **Cloud Configuration** section and disable the ability to select the OS. Notice the Enable Autoscaler is disabled, as well.


3. Provide a name in the **Node pool name** text box. When creating a system node, it is a good idea to include an identifying name as such.


4. Add the **Desired size**. You can start with three for multiple nodes.


5. Include **Additional Labels**. This is optional.


6. In the **Azure Cloud Configuration** section, add the **Instance type**. The cost details present for a review.


7. Enter the **Managed Disk information** and its size.


8. If you are including additional or multiple nodes to make a node pool, then click the **Add Worker Nodes** button to create the next node.


## Include Additional Nodes to Create a Node Pool

1. Identify the next node pool as a worker node and give it a worker name. 


2. This time, you are able to enable **Autoscaler** and System Node Pool will not be enabled.


3. Select the **Minimum** and **Maximum sizes** number. For example, two (2) for minimum and five (5) for maximum.


4. **Additional Labels** - This is an optional feature.


5. Proceed to set up the **Cloud Configuration**.
    
    Notice the System Node Pool option is disabled, the OS selection options within the Cloud Configuration section disappears. This is because a System Pool Node can not be set on a Windows environment. The System Node Pool runs on a Linux OS. Keep this option unchecked since you are configuring the worker node. In addition, the Taints option will be disabled as well and as the Enable Autoscaler.

  | **Parameter**     | **Action**                                                                                                                                                                                                                                         |
  | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | **Instance type** | Select the Azure cloud instance. The cost will be displayed.                                                                                                                                                                                       |
  | **OS Type**       | Set the Worker Node to **Linux** or **Windows**. If setting an <br /> AKS node pool the cluster must contain at least one system node pool with at least one node. The system node pool must be created first, then the Windows node pool can be created.  <br /> <br /> Once the clusters are created, you can modify the parameters; however, the operating systems are static. If you wish to change the OS, you have to delete the cluster and create a new one.|
  | **Managed disk**  | This is defined in Azure.                                                                                                                                                                                                                          |
  | **Disk Size**     | Select the disk size.                                                                                                                                                                                                                              |



<InfoBox>
Every AKS cluster must contain at least one system node pool with at least one node. If you run a single system node pool for your AKS cluster in a production environment, it is recommended to use at least three nodes for the node pool.
</InfoBox>

<InfoBox>
New worker pools may be added if it desired to customize certain worker nodes to run specialized workloads. As an example, the default worker pool may be configured with the <i>Standard_D2_v2</i> instance types for general-purpose workloads and another worker pool with instance type <i>Standard_NC12s_v3</i> can be configured to run GPU workloads.
</InfoBox>

<InfoBox>
A minimum allocation of <i>two (2)</i> CPU cores is required across all worker nodes.

A minimum allocation of <i>4Gi</i> of memory is required across all worker nodes.
</InfoBox>


6.  When you finish setting up these nodes, click **Next** to go to the **Settings** page.

    **Note**: Notice the Cluster Status once you click **Finish Configuration**. It will say *Provisioning*. This process will take a little while to complete. Alternately, when you go into the Azure portal under **Kubernetes services** > **Node pools**, the recently created Node pools will display as **Ready**, and you can see the assigned operating systems and its status.

<br />


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


2. Navigate to the **Cluster Details** page of the cluster stuck in deletion mode.

      - If the deletion status is stuck for more than 15 minutes, click the **Force Delete Cluster** button from the **Settings** dropdown. 
    
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


  `az aks get-credentials --resource-group <resource-group> --name <cluster-name>`


### References:

[Use Kubernetes RBAC with Azure AD integration](https://docs.microsoft.com/en-us/azure/aks/azure-ad-rbac?toc=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fazure%2Faks%2Ftoc.json&bc=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fazure%2Fbread%2Ftoc.json)


