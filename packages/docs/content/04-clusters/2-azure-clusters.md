---
title: "Creating Azure Clusters"
metaTitle: "Creating Azure Clusters in Spectro Cloud"
metaDescription: "Detailed instructions on how to create clusters on Azure within Spectro Cloud"
icon: ""
hideToC: false
fullWidth: false
---

# Overview

Azure cluster resources are placed within an existing Resource Group, and nodes will be provisioned within a Virtual Network that is either auto created or preexisting, with one subnet for control plane nodes and one for worker nodes. These two subnets are secured with separate Network Security Groups. Both subnets can span across multiple AZs.  Worker nodes will be distributed across multiple AZs.

None of the control plane nodes and worker nodes have public IPs attached. The APIServer endpoint is accessed through a public LB.

![azure_cluster_architecture.png](azure_cluster_architecture.png)

# Creating an Azure cloud account

To create an Azure cloud account, we need:

* Client ID
* Tenant ID
* Client secret

For this, we first need to create an Azure Active Directory (AAD) Application which can be used with role-based access control. Follow the steps to get the required details:

* To create an AAD Application from the Azure portal, follow the [Create a new AAD Application](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#create-an-azure-active-directory-application) link. With this, the ClientID and TenantID are created and can be noted down.
* On creating the application, a minimum required [ContributorRole](https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#contributor) needs to be assigned. To assign any kind of role, the user must have a minimum role of [UserAccessAdministrator](https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#user-access-administrator). The role can be assigned by following the [Assign Role To Application](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#assign-a-role-to-the-application) link.
* To create the client secret, [Create an Application Secret](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#create-a-new-application-secret). Store the Client Secret safely as it will not be available in plain text later.

# Creating an Azure Cluster

The following steps need to be performed to provision a new VMware cluster:-

* Provide the basic cluster information like name, description and tags. Tags are currently not propagated to the VMs deployed on the cloud/data center environments.
* Select a cluster profile created for the Azure environment. The profile definition will be used as the cluster construction template.
* Review and override pack parameters as desired. By default, parameters for all packs are set with values defined in the cluster profile.
* Provide Azure Cloud account and placement information.
    * Cloud Account - Select the desired cloud account. Azure cloud accounts with credentials need to be pre-configured in project settings.
    * Subscription - Select the subscription which is to be used to access Azure Services.
    * Region - Select a region in Azure in which the cluster should be deployed.
    * Resource Group - Select the resource group in which the cluster should be deployed.
    * SSH Key - Public key to configure remote SSH access to the nodes.
* Configure master and worker node pools. A master and a worker node pool is configured by default.
    * Name - A descriptive name for the node pool.
    * Size - Number of nodes to be provisioned for the node pool. For the master pool, this number can be 1, 3 or 5.
    * Allow worker capability (master pool) - To allow workloads to be provisioned on master nodes.
    * Instance Type - Select the Azure instance type to be used for all the nodes in the pool.
    * Managed Disk - Select the managed disk type to be used.
    * Disk Size - Storage disk size in GB to be attached to the node.
    * Availability Zones - Choose one or more availability zones. Spectro Cloud provides fault tolerance to guard against failures like hardware failures, network failures etc. by provisioning nodes across availability zones if multiple zones are selected. Zones are supported only for worker pools.

* Review the settings and deploy the cluster. Provisioning status with details of ongoing provisioning tasks is available to track progress.

<WarningBox>
New worker pools may be added if its desired to customize certain worker nodes to run specialized workloads. As an example, the default worker pool may be configured with the ‘Standard_D2_v2’ instance types for general purpose workloads and another worker pool with instance type ‘Standard_NC12s_v3’ can be configured to run GPU workloads.
</WarningBox>

# Scaling an Azure cluster

Scaling a cluster up or down involves changing the size of node pools. The following steps need to be performed to scale up/down an Azure cluster.

* Access the ‘nodes’ view for the cluster.
* For the desired node pool, change the size directly from the nodes panel or by editing node pool settings.
* After the node pool configuration is updated, the scale up/down operation is initiated in a few minutes.
* Provisioning status is updated with ongoing progress of the scale operation.

# Adding an Azure worker pool

The following steps need to be performed to add a new worker node pool to a cluster:-

* Invoke the option to ‘Add Node Pool’ from the cluster’s node information page.
* Provide node pool settings as follows:
    * A descriptive name for the node pool.
    * Number of nodes in the node pool.
    * One or more availability zones. Nodes are distributed across availability zones when multiple zones are selected.
    * Instance type to be used for all the nodes lunched in the node pool.
    * Managed Disk and Size of the storage to be used.
    * Save the node pool settings. New worker pool settings are updated and cluster updates begin within a few minutes. Provisioning status is updated with ongoing progress of tasks related to addition of new nodes.
    
# Removing an Azure worker pool

The following steps need to be performed to remove a worker pool from the cluster:-

* Access the ‘Nodes’ view for the cluster.
* Delete the desired worker pool and confirm deletion.
* Upon confirmation, the worker node deletion beings in a few minutes.

# Reconfiguring Azure nodes

The following steps need to be performed to reconfigure worker pool nodes:-

* Access the nodes view for the the cluster.
* Edit the settings of the desired node pool.
* Change the instance type to the desired instance type.
* Update the Managed Disk  type and Size of the storage to be used.
* Save the node pool settings. After the node pool settings are updated, the node pool reconfiguration begins within a few minutes. The older nodes in the node pool are deleted one by one and replaced by new nodes launched with new instance type configured.
* Provisioning status is updated with ongoing progress of nodes being deleted and added.
