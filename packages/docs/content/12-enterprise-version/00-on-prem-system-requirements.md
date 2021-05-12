---
title: "System Requirements"
metaTitle: "On-Prem System Requirements"
metaDescription: "an overview of On-Prem System Requirements"
icon: ""
hideToC: false
fullWidth: false
---
 
import InfoBox from '@librarium/shared/src/components/InfoBox';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import PointsOfInterest from '@librarium/shared/src/components/common/PointOfInterest';
import Tooltip from "@librarium/shared/src/components/ui/Tooltip";





# On Premise System Requirements

The Spectro Cloud SaaS platform is also available as an entirely customer managed on-prem deployment. The On-Prem version supports the management of kubernetes clusters at customer data centers. Spectro Cloud on-prem is available in two modes:

* Quick Start Mode
* Enterprise Mode

The page will discuss the minimum resource requirements for both these modes of deployment. Find the common prerequisites of both the versions  as below. 

### Platform Requirements

* Ubuntu Operating System
* Both of the on-prem modes support vSphere version 6.7 and above.


### Common Network Requirements

* The instances of on-prem deployment requires connectivity through a proxy or non-proxy environment. 
* This instance can be configured with static IP addresses or dynamically allocated IP addresses.
* Proxy Whitelists
This table lists the proxy requirements for enabling the Spectro Cloud management console.

| Top-level Domain | Port | Description |
| --- | --- | --- |
| spectrocloud.com | 443 | For the Spectro Cloud SaaS. |
| s3.amazonaws.com | 443 | To access the Spectro Cloud VMware OVA files. |
| gcr.io | 443 | To access the Spectro Cloud image files. |
| docker.io | 443 | To access the Spectro Cloud Pack Registries. |
| googleapis.com | 443 | For pulling Spectro Cloud images. |
| docker.com | 443 | To access the Spectro Cloud docker images. |
| raw.githubusercontent.com | 443 | |
| projectcalico.org | 443 | For egress management. |
| quay.io | 443 | Container image registry access. |
| grafana.com | 443 | To provide access to the dashboard metrics. |
| github.com | 443 | |


### vSphere Environment  Prerequisites

* Datacenter
   - IPs for application workload services (e.g.: LoadBalancer services).
   - Subnet with egress access to the internet (direct or via proxy):
   - For proxy: HTTP_PROXY, HTTPS_PROXY (both required).
   - NTP configured on all Hosts.
   - Shared Storage between vSphere hosts.
   - VMware vCenter permissions.

* Zone Tagging helps in storage allocation while dynamic storage volume provisioning is in place. Use vSphere tags to label zones in your vSphere environment. The task assumes that your vCenter Server environment includes three clusters, cluster1, cluster2, and cluster3, with the node VMs on all three clusters. In the task, you create two tag categories, k8s-zone and k8s-region. You tag the clusters as three zones, zone-a, zone-b, and zone-c, and mark the data center as a region, region-1.

* VMware vCenter Permissions Required
   The vSphere user account used in the various Spectro Cloud tasks must have the minimum vSphere privileges required to perform the task. The Administrator role provides super-user access to all vSphere objects. For users without the Administrator role, one or more custom roles can be created based on the tasks being performed by the user.

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
| | * Change Settings |
| | * Change Swapfile Placement
| | * Configure host USB device
| | * Configure raw device
| | * Add existing disk 
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


### Optional Settings 
The requirement configurations given below are optional.

* DNS Mapping
   - Static IP DNS: [Name servers] Comma separated DNS addresses (e.g: 8.8.8.8, 192.168.0.8), required only for static IP allocation.
* SMTP Settings
   - Configure SMTP settings to enable the Spectro Cloud platform to send out email notifications. Email Notifications are sent out to new users when they are on boarded to the platform so they can activate their accounts.
* Certificate (optional)
   - Provide the desired SSL or TLS server certificates to support external access to valid HTTPs.
* FTP Location (backups)
   - An accessible FTP location to backup data.
   	
# Quick Start Mode

The Spectro Cloud On-Prem Quick Start Mode is a single node installation of the Spectro Cloud platform. This deployment is used to quickly understand the capabilities of the Spectro Cloud platform. For production purposes the enterprise version is recommended. The minimum requirements for Quick Start version is outlined below:

### Hardware Requirements 

Hardware requirements will describe the CPU, memory, and disk requirements for the nodes.
* 8GB memory
* 4 virtual CPUs 
* Secondary storage of 80 GB distributed across multiple HDDs.

### Network Requirements

* Quick Start will operate on a single instance which requires connectivity through a proxy or non-proxy environment. 
* This instance can be configured with static IP addresses or dynamically allocated IP addresses.

<InfoBox>
 Make sure that your Datacenter CIDR IP address does not overlap Kubernetes PodCIDR range. Kubernetes PodCIDR range settings can be changed while installing Quick Start Version
</InfoBox>

# Enterprise Mode

The Spectro Cloud On-Premise Enterprise version is a highly available multinode infrastructure for production purposes. The minimum number of nodes/VMs required by this environment is 3. Depending on the number of nodes the requirements changes. The minimum requirements are outlined below:

### Hardware Requirements 
Hardware requirements will describe the CPU, memory, and disk requirements for the nodes.
* Each VM requires 8GB memory resulting in 24GB RAM in total .
* 4 vCPUs per node * 3 nodes requiring 12 vCPUs
* Secondary storage of 240GB distributed across multiple HDDs.

### Network Requirements

* A Range or a Subnet of at least 5 static IP addresses is required for the installation and ongoing management. 
* The infrastructure will require a proxy/non proxy environment for accessibility. 
* For high availability purposes, you may choose to distribute the three VMs across multiple compute clusters.

<InfoBox>
 Make sure that your Datacenter CIDR IP address does not overlap Kubernetes PodCIDR range. Kubernetes PodCIDR range settings can be changed while installing Enterprise version
</InfoBox>


## Private Cloud Gateway Installer

A Private Cloud Gateway is a Spectro Cloud component that enables the communication between Spectro Cloud's management console and a VMware based private data center. The gateway needs to be installed by the users in their VMware environments using a private cloud gateway installer appliance. 

### Hardware Requirement 

* The infrastructure will require a proxy/non proxy environment for outgoing traffic. 
* [Whitelist](#proxywhitelists) lists the proxy requirements for enabling the Spectro Cloud management console.
* The instance can be configured with static IP addresses or dynamically allocated IP addresses (DHCP or Static).
* vSphere Environment  Pre-requisites
     - IPs for application workload services (e.g.: LoadBalancer services).
     - Subnet with egress access to the internet (direct or via proxy):
     - For proxy: HTTP_PROXY, HTTPS_PROXY (both required).
     - NTP configured on all Hosts.
     - Shared Storage between vSphere hosts.
* VMware vCenter [Permission](#permissionsrequired) are the minimum privilages to be held to perform the installation. 
* Node requirements (1 Node)
   - 2 vCPU
   - 4GB memory
   - 30GB storage.



## Private Cloud Gateway Controller 
	
The infrastructure will require a proxy/non proxy environment for outgoing traffic. 
* [Whitelist](#proxywhitelists) lists the proxy requirements for enabling the Spectro Cloud management console.
* The instance can be configured with static IP addresses or dynamically allocated IP addresses (DHCP or Static ).
* vSphere Environment Pre-Requisites.
  - IPs for application workload services (e.g.: LoadBalancer services).
  - Subnet with egress access to the internet (direct or via proxy):
      - For proxy: HTTP_PROXY, HTTPS_PROXY (both required).
  - NTP configured on all Hosts.
  - Shared Storage between vSphere hosts.
  
* VMware vCenter [Permission](#permissionsrequired)
* Node requirements (1 Node)
    - 2 vCPU
    - 4GB memory
    - 30GB storage. 
* Node requirements (3 Node)
    - 6 vCPU
    - 12GB memory
    - 70GB storage


## Tenant Cluster
The recommendations enumerated below are applicable for a minimal cluster. Based on the size of workloads installed, the number of nodes and size should be tuned. 

### Network Requirements
* The per tenant cluster IP requirements can be consolidated as:
    - 1 per node.
    - 1 Kubernetes control-plane VIP.
    - 1 Kubernetes control-plane extra.

* White list(#proxywhitelists)
* The minimum hardware requirements per nodes is:
    - 4GB Memory
    - 2 virtual CPUs 
    - 20 GB Disk Storage
	
