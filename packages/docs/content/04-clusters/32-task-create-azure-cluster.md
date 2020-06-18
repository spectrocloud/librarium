---
title: "Creating Azure Clusters"
metaTitle: "Creating Azure Clusters"
metaDescription: "Detailed instructions on how to create an Azure Cluster in Spectro Cloud"
icon: ""
---

# Creating an Azure Cluster

The following steps need to be performed to provision a new VMware cluster:-

* Provide the basic cluster information like name, description and tags. Tags are currently not propagated to the VMs deployed on the cloud/data center environments.
* Select a cluster profile created for the Azure environment. The profile definition will be used as the cluster construction template.
* Review and override pack parameters as desired. By default, parameters for all packs are set with values defined in the cluster profile.
* Provide Azure Cloud account and placement information.
    * Cloud Account - Select the desired cloud account. Azure cloud accounts with credentials need to be pre-configured in project settings.
    * Subscription - Select the subscription which is to be used to access Azure Services
    * Region - Select a region in Azure in which the cluster should be deployed
    * Resource Group - Select the resource group in which the cluster should be deployed
    * SSH Key - Public key to configure remote SSH access to the nodes.
* Configure master and worker node pools. A master and a worker node pool is configured by default.
    * Name - A descriptive name for the node pool
    * Size - Number of nodes to be provisioned for the node pool. For the master pool, this number can be 1, 3 or 5
    * Allow worker capability (master pool) - To allow workloads to be provisioned on master nodes
    * Instance Type - Select the Azure instance type to be used for all the nodes in the pool
    * Managed Disk - Select the managed disk type to be used
    * Disk Size - Storage disk size in GB to be attached to the node.
    * Availability Zones - Choose one or more availability zones. Spectro Cloud provides fault tolerance to guard against failures like hardware failures, network failures etc. by provisioning nodes across availability zones if multiple zones are selected. Zones are supported only for worker pools.

* Review the settings and deploy the cluster. Provisioning status with details of ongoing provisioning tasks is available to track progress.

> New worker pools may be added if its desired to customize certain worker nodes to run specialized workloads. As an example, the default worker pool may be configured with the ‘Standard_D2_v2’ instance types for general purpose workloads and another worker pool with instance type ‘Standard_NC12s_v3’ can be configured to run GPU workloads.
