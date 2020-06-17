---
title: "Task: Create a VMware cluster"
metaTitle: "Task: Create a VMware cluster"
metaDescription: "The method of creating a cluster on VMware for deploying a cluster through Spectro Cloud"
icon: ""
---

# Creating a VMware Cluster

The following steps need to be performed to provision a new VMware cluster :-

* Provide basic cluster information like name, description and tags. Tags are currently not propagated to the VMs deployed on the cloud / data center environments.
* Select a cluster profile created for VMware environment. The profile definition will be used as the cluster construction template.
* Review and override pack parameters as desired. By default, parameters for all packs are set with values defined in the cluster profile.
* Provide vSphere Cloud account and placement information.
    * Cloud Account - Select the desired cloud account. VMware cloud accounts with credentials need to be pre-configured in project settings. An account is auto-created as part of the cloud gateway setup and is available for provisioning of tenant clusters, if permitted by the administrator.
    * Datacenter -The vSphere datacenter where the cluster nodes will be launched.
    * Compute Cluster - A Compute cluster under the selected Datacenter.
    * Datastore - The vSphere storage in the selected Datacenter.
    * Network - The vSphere Network in the selected Datacenter, to enable connectivity for the cluster nodes
    * Resource Pool- The vSphere resource pool where the cluster nodes will be launched
    * Folder - The vSphere VM Folder where the cluster nodes will be launched
    * SSH Keys (Optional) - Public key to configure remote SSH access to the nodes (User: spectro)
    * NTP Server (Optional) - Setup time synchronization for all the running nodes.
* Configure master and worker node pools. A master and a worker node pool is configured by default.
    * Name - A descriptive name for the node pool
    * Size - Number of nodes to be provisioned for the node pool. For master pool, this number can be 1, 3 or 5
    * Allow worker capability (master pool) - To workloads to be provisioned on master nodes
    * CPU - Number of CPUs to be allocated to the nodes 
    * Memory - Amount of memory in GB to be allocated to the nodes
    * Disk - Storage disk size in GB to be attached to the node
* Review settings and deploy the cluster. Provisioning status with details of ongoing provisioning tasks is available to track progress.

> New worker pools may be added if its desired to customize certain worker nodes to run specialized workloads. As an example, the default worker pool may be configured with 4 CPUs, 8GB of memory for general purpose workloads and another worker pool with 8CPU, 16 GB of memory for advanced workloads that demand larger resources.
