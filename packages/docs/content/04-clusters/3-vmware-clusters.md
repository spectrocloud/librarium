---
title: "Creating VMware Clusters"
metaTitle: "Creating VMware Clusters in Spectro Cloud"
metaDescription: "Detailed instructions on how to create clusters on VMware within Spectro Cloud"
icon: ""
hideToC: false
fullWidth: false
---

import WarningBox from '@librarium/shared/src/components/WarningBox';

# Overview

Spectro Cloud SaaS does not need direct access to the VMware environment. A Private Cloud Gateway needs to be setup within the VMware environment, to facilitate  communication between Spectro Cloud SaaS and the vCenter, to create and delete target Kubernetes clusters.

The Private Gateway supports going through an optional Proxy server to talk to Spectro Cloud. If the Gateway is configured to use proxy, the Proxy server needs to support both HTTP(S) proxy and SOCKS proxy.

A HAProxy Load balancer VM will be created for each of the Kubernetes cluster, as the LB for the apiserver endpoints.

![vmware_cluster_architecture.png](vmware_cluster_architecture.png)

# Prerequisites

Spectro Cloud supports vSphere 6.5 or 6.7 [Update 3](https://www.vmware.com/products/vsphere.html)

## Hardware Requirements

[ESXi 6.5 Hardware Requirements](https://docs.vmware.com/en/VMware-vSphere/6.5/com.vmware.vsphere.upgrade.doc/GUID-DEB8086A-306B-4239-BF76-E354679202FC.html)

[ESXi 6.7 Hardware Requirements](https://docs.vmware.com/en/VMware-vSphere/6.7/com.vmware.esxi.upgrade.doc/GUID-DEB8086A-306B-4239-BF76-E354679202FC.html)

## Configuration Requirements

The vSphere environment should be configured with a **DHCP service** in the primary VM Network for the workload Kubernetes clusters. A Resource Pool needs to be configured across the hosts, onto which the workload clusters will be provisioned. Every host in the Resource Pool will need access to a shared storage, such as VSAN, in order to be able to make use of MachineDeployments and high-availability control planes.

## Permissions

The vSphere user account used in the various Spectro Cloud tasks must have the minimum vSphere privileges required to perform the task. The `Administrator` role provides super-user access to all vSphere objects. For users without the`Administrator` role, one or more custom roles can be created based on the tasks being performed by the user.

| vSphere Object | Privileges |
| --- | --- |
| Datastore | Allocate Space |
| | Browse Datastore |
| | Low level file operations |
| | Remove file |
| | Update virtual machine files |
| | Update virtual machine metadata |
| Folder | Create folder |
| | Delete folder |
| | Move folder |
| | Rename folder|
| Network | Assign Network |
| Resource | Apply recommendation
| | Assign virtual machine to resource pool |
| | Migrate powered off virtual machine |
| | Migrate powered on virtual machine |
| | Query vMotion |
| Sessions| Validate session |
| Storage views | View|
| Tasks | Create task |
| | Update Task |
| Virtual Machines | Change Configuration |
| | * Add existing disk |
| | * Add new disk
| | * Add or remove device
| | * Advanced configuration
| | * Change CPU count
| | * Change resource
| | * Configure managedBy
| | * Display connection settings
| | * Extend virtual disk
| | * Modify device settings
| | * Query Fault Tolerance compatibility
| | * Query unowned files
| | * Reload from path
| | * Remove disk
| | * Rename
| | * Reset guest information
| | * Set annotation
| | * Toggle fork parent
| | * Upgrade virtual machine compatibility
| | Guest operations
| | * Guest operation alias modification
| | * Guest operation alias query
| | * Guest operation modifications
| | * Guest operation program execution
| | * Guest operation queries
| | Interaction
| | * Power off
| | * Power on
| | Inventory
| | * Create from existing
| | * Create new
| | * Move
| | * Remove
| | Provisioning
| | * Allow disk access
| | * Allow file access
| | * Allow read-only disk access
| | * Allow virtual machine download
| | * Allow virtual machine files upload
| | * Clone template
| | * Clone virtual machine
| | * Create template from virtual machine
| | * Customize guest
| | * Deploy template
| | * Mark as template
| | * Mark as virtual machine
| | * Modify customization specification
| | * Promote disks
| | * Read customization specifications
| | Service Configuration
| | * Allow notifications
| | * Allow polling of global event notifications
| | * Manage service configurations
| | * Modify service configuration
| | * Query service configurations
| | * Read service configuration
| | Snapshot management
| | * Create snapshot
| | * Remove snapshot
| | * Rename snapshot
| | * Revert to snapshot
| | vSphere Replication
| | * Configure replication
| | * Manage replication
| | * Monitor replication
| vApp | Import
| | View OVF environment
| | vApp application configuration
| | vApp instance configuration
| vSphere Tagging| Create vSphere Tag
| | Edit vSphere Tag

# Creating a VMware cloud account

<WarningBox>
Configuring the private cloud gateway is a prerequisite task. A default cloud account is created when the private cloud gateway is configured. This cloud account can be used to create a cluster.
</WarningBox>

In addition to the default cloud account already associated with the private cloud gateway, new user cloud accounts can be created for the different vSphere users.

| Property | Description |
|---|---|
|Account Name | Custom name for the cloud account |
| Private cloud gateway | Reference to a running cloud gateway|
| vCenter Server | IP or FQDN of the vCenter server|
| Username | vCenter username|
| Password | vCenter password|

# Creating a VMware cloud gateway

Setting up a cloud gateway involves initiating the install from the tenant portal, deploying gateway installer VM in vSphere and launching the cloud gateway from the tenant portal.

By default, 4GB of memory is allocated for private gateways. Please ensure that this memory allocation is increased based on the number of clusters that need to be created.

## Tenant Portal - Initiate Install

* As a tenant administrator, navigate to the *Private Cloud Gateway* page under settings and invoke the dialogue to create new private cloud gateway.
* Note down the link to the Spectro Cloud Gateway Installer OVA and PIN displayed on the dialogue.

## vSphere - Deploy Gateway Installer

* Initiate deployment of a new OVF template by providing a link to the installer OVA as the URL.
* Proceed through the OVF deployment wizard by choosing the desired name, placement, compute, storage and network options.
* At the 'Customize Template' step, specify Spectro Cloud properties as follows:

| Parameter | Value | Remarks |
|---|---|---|
|Installer Name | Desired Spectro Cloud Gateway Name | The name will be used to identify the gateway instance. Typical environments may only require a single gateway to be setup, however multiple gateways might be required for managing clusters in multiple vCenters. Choose a name that can easily identify the environment that this gateway instance is being configured for.|
| Console End Point | URL to Spectro Cloud SaaS portal | https://console.spectrocloud.com by default |
|Pairing Code | PIN displayed on SaaS portal's 'Create new gateway' dialogue. | |
| SSH Public Key | Optional key, userful for troubleshooting purposes (Recommnded) | Enables SSH access to the VM as 'ubuntu' user |

Additional properties that are required to be set only for a Proxy Environment. Each of the proxy properties may or may not have the same value but all the three properties are mandatory.

| Parameter | Value | Remarks |
|---|---|---|
|HTTP PROXY | The endpoint for the HTTP proxy server | This setting will be propagated to all the nodes launched in the proxy network. Eg., http://USERNAME:PASSWORD@PROXYIP:PROXYPORT |
| HTTPS PROXY | The endpoint for the HTTPS proxy server | This setting will be propagated to all the nodes launched in the proxy network. Eg., http://USERNAME:PASSWORD@PROXYIP:PROXYPORT |
| SOCKS PROXY | The endpoint for the SOCKS Proxy server | This setting will be propagated to all the nodes launched in the proxy network. Eg., PROXYIP:PROXYPORT |

* Finish the OVF deployment wizard and wait for the OVA to be imported and Virtual Machine to be deployed.
* Power on the Virtual Machine.

## Tenant Portal - Launch Cloud Gateway

* Close the 'Create New Gateway' dialogue if still open or navigate to the Private Cloud Gateway page under settings in case you have navigated away or been logged out.
* Wait for a gateway widget to be displayed on the page and for the "Configure" option to be available. The IP address of the installer VM will be displayed on the gateway widget. This may take a few minutes after the virtual machine is powered on. Failure of the installer to register with the SaaS portal within 10 mins of powering on the Virtual Machine on vSphere, might be indicative of an error. Please follow the troubleshooting steps to identify and resolve the issue.
* Click on "Configure" button to invoke the Spectro Cloud Configuration dialogue. Provide vCenter credentials and proceed to the next configuration step.
* Choose desired value for Datacenter, Compute Cluster, Datastore, Network, Resource pool and Folder. Optionally provide one or more SSH Keys and/or NTP server addresses.
* Click on Deploy, to initiate provisioning of the gateway cluster. The status on the UI should change to 'Provisioning' and eventually 'Running' when gateway cluster is fully provisioned. This process might take several minutes (typically 8 to 10 mins). You can observe detailed provisioning sequence on the cluster details page, by clicking on the gateway widget on the UI. If provisioning of the gateway cluster runs into errors, or gets stuck, relevant details can be found on the summary tab or the events tab of the cluster details page. In certain cases where provisioning of the gateway cluster is stuck or failed due to invalid configuration, the process can be reset from the Cloud Gateway Widget on the UI.
* Once the Gateway transitions to Running state, it is fully provisioned and ready to bootstrap tenant cluster requests.

# vSphere - Clean up installer

* Power off installer OVA which was initially imported at the start of this installation process.

<WarningBox>
Gateway cluster installation automatically creates a cloud account behind the scenes using the credentials entered at the time of deploying the gateway cluster. This account may be used provisioning of clusters across all tenant Projects.
</WarningBox>
<WarningBox>
A Pack registry instance is setup on the gateway cluster by default and it is registered as a private pack registry under Settings/Pack Registries. You can read more about Pack Registries [here](/registries-and-packs).
</WarningBox>

# Troubleshooting

## Gateway installer - Unable to register with tenant portal

The installer VM, when powered on, goes through a bootstrap process and registers itself with the tenant portal. This process typically takes 5 to 10 mins. Failure of the the installer to  register with tenant portal within this duration, might be indicative of a bootstrapping error. SSH into the installer virtual machine using the key provided during OVA import and inspect the log file located at *'/var/log/cloud-init-output.log'*. This log file will contain error messages in the event there are failures with connecting to the SaaS portal, authenticating or downloading installation artifacts. A common cause for these errors is that the SaaS console end point or the pairing code is typed incorrectly. Ensure that the tenant portal console end point does not have a trailing slash. If these properties were incorrectly specified, power down and delete the installer VM and re-launch with the correct values.

Another potential issue is a lack of outgoing connectivity from the VM. The installer VM needs to have outbound connectivity directly or via a proxy. Adjust proxy settings (if applicable) to fix the connectivity or power down and delete the installer VM and relaunch in a network that enables outgoing connections. 

If the above steps do not resolve your issues, copy the **following script** to the installer VM and execute to generate a logs archive. Open a support ticket and attach the logs archive to the ticket to allow the Spectro Cloud Support team to troubleshoot and provide further guidance.

## Gateway Cluster - Provisioning stalled/failure

Installation of the gateway cluster may run into errors or might get stuck in the provisioning state for a variety of reasons like lack of infrastructure resources, IP addresses not being available, unable to perform NTP sync, etc. While these are most common, some of the other issues might be related to the underlying VMware environment. The Cluster Details page, which can be accessed by clicking anywhere on the gateway widget, contains details of every orchestration step including an indication of the current task being executed. Any intermittent errors will be displayed on this page next to the relevant orchestration task. The events tab on this page also provides a useful resource to look at lower level operations being performed for the various orchestration steps. If you think that the orchestration is stuck or failed due to an invalid selection of infrastructure resources or an intermittent problem with the infrastructure, you may reset the gateway by clicking on the 'Reset' button on the gateway widget. This will reset the gateway state to 'Pending' allowing you to reconfigure the gateway and start provisioning of a new gateway cluster. If the problem persists, please contact Spectro support via the Service Desk.

# Upgrading a VMware cloud gateway

Spectro Cloud maintains the OS image and all configurations for the cloud gateway. Periodically, the OS images, configurations or other components need to be upgraded to resolve security or functionality issues. Spectro Cloud releases such upgrades when required and communication about the same is presented in the form of an upgrade notification on the gateway.

Administrators should review the changes and apply them at a suitable time. Upgrading a cloud gateway does not result in any down time for the tenant clusters. During the upgrade process, provisioning of new clusters might be temporarily unavailable. New cluster requests are queued while the gateway is being upgraded, and are processed as soon as the gateway upgrade is complete.

# Deleting a VMware cloud gateway

The following steps need to performed to delete a cloud gateway.

* As a tenant administrator, navigate to the *Private Cloud Gateway* page under settings.
* Invoke the ‘Delete’ action on the cloud gateway instance that needs to be deleted.
* The system performs a validation to ensure there are no running tenant clusters associated with the gateway instance being deleted. If such instances are found, the system presents an error. Delete relevant running tenant clusters and retry deletion of the cloud gateway.
* Delete the gateway Virtual Machines from vSphere.

# Resizing a VMware cloud gateway

A Cloud gateway can be set up as a 1-node or a 3-node cluster.  For production environments, it is recommended that 3 nodes are set up. A cloud gateway can be initially setup with 1 node and resized to 3 nodes at a later time. The following steps need to be performed to resize a 1-node cloud gateway cluster to a 3-node gateway cluster:

* As a tenant administrator, navigate to the *Private Cloud Gateway* page under settings.

* Invoke the resize action for the relevant cloud gateway instance.

* Update the size from 1 to 3.

* The gateway upgrade begins shortly after the update. Two new nodes are created on vSphere and the gateway is upgraded to a 3-node cluster.

<WarningBox>
Scaling a 3-node cluster down to a 1-node cluster is not permitted. A load balancer instance is launched even for a 1-node gateway to support future expansion.
</WarningBox>

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
    * Network - The vSphere Network in the selected Datacenter, to enable connectivity for the cluster nodes.
    * Resource Pool- The vSphere resource pool where the cluster nodes will be launched.
    * Folder - The vSphere VM Folder where the cluster nodes will be launched.
    * SSH Keys (Optional) - Public key to configure remote SSH access to the nodes (User: spectro).
    * NTP Server (Optional) - Setup time synchronization for all the running nodes.
* Configure master and worker node pools. A master and a worker node pool is configured by default.
    * Name - A descriptive name for the node pool.
    * Size - Number of nodes to be provisioned for the node pool. For master pool, this number can be 1, 3 or 5.
    * Allow worker capability (master pool) - To workloads to be provisioned on master nodes.
    * CPU - Number of CPUs to be allocated to the nodes.
    * Memory - Amount of memory in GB to be allocated to the nodes.
    * Disk - Storage disk size in GB to be attached to the node.
* Review settings and deploy the cluster. Provisioning status with details of ongoing provisioning tasks is available to track progress.

<WarningBox>
New worker pools may be added if it is desired to customize certain worker nodes to run specialized workloads. As an example, the default worker pool may be configured with 4 CPUs, 8GB of memory for general purpose workloads and another worker pool with 8CPU, 16 GB of memory for advanced workloads that demand larger resources.
</WarningBox>

# Deleting a VMware Cluster

Deletion of a VMware cluster results in removal of all Virtual machines and associated storage disks created for the cluster. The following tasks need to be performed to delete a VMware cluster:

* Select the cluster to be deleted from the cluster view and navigate to the the cluster overview page
* Invoke a delete action available on the page
* Confirm delete action
* Cluster status is updated to ‘Deleting’ while cluster resources are being deleted. Provisioning status is updated with the ongoing progress of the delete operation. Once all resources are successfully deleted, the cluster status changes to ‘Deleted’ and it is removed from the list of clusters.

<WarningBox>
Delete action is only available for clusters that are fully provisioned. For clusters that are still in the process of being provisioned, ‘Abort’ action is available to stop provisioning and delete all resources.
</WarningBox>

# Scaling a VMware Cluster

Scaling a cluster up or down involves changing the size of node pools. The following steps need to be performed to scale up/down a VMware cluster:

* Access the ‘nodes’ view for the cluster
* For the desired node pool change the size directly from the nodes panel or by editing node pool settings.
* After the node pool configuration is updated, the scale up/down operation is initiated in a few minutes.
* Provisioning status is updated with ongoing progress of the scale operation.

<WarningBox>
The master node pool may be scaled from 1 to 3 or 3 to 5 nodes. Scale down operation is not supported for master nodes.
</WarningBox>

# Reconfiguring VMware Nodes

The following steps need to be performed to reconfigure worker pool nodes: -

* Access the nodes view for the the cluster.
* Edit the settings of the desired node pool.
* Change the CPU, Memory and Disk size to the desired settings.
* Save the node pool settings. After the node pool settings are updated, the node pool reconfiguration begins within a few minutes. The older nodes in the node pool are deleted.one by one and replaced by new nodes launched with new instance type configured.
* Provisioning status is updated with the ongoing progress of nodes being deleted and added.

# Adding a VMware worker pool

The following steps need to be performed to add a new worker node pool to a cluster:-

* Invoke the option to ‘Add Node Pool’ from the cluster’s node information page.
* Provide node pool settings as follows:-
    * A descriptive name for the node pool.
    * Number of nodes in the node pool.
    * CPU, Memory and Disk settings for all the nodes in the node pool.
    * Save the node pool settings. The new worker pool settings are updated and cluster updates begin within a few minutes. Provisioning status is updated with ongoing progress of tasks related to addition of new nodes.

# Removing a VMware worker pool

The following steps need to be performed to remove a worker pool from the cluster:-

* Access the ‘Nodes’ view for the cluster.
* Delete the desired worker pool and confirm deletion.
* Upon confirmation, the worker node deletion begins in a few minutes.
