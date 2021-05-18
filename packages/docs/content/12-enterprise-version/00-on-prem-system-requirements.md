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



# Platform Components

The following sections describe the system requirements for various components of Spectro Cloud platform required for operating in VMware based private datacenter environment. 


## On-Premise Management Plane

The Spectro Cloud SaaS platform is also available as self hosted on-premise deployment. The On-Premise version is a dedicated instance of the platform hosted in customer's VMware environment. Spectro Cloud on-prem is available in two modes:

* Quick Start Mode - A single VM deployment platform ideal for PoC purposes. 
* Enterprise Mode - A multi node highly available version for production purposes. 

The sections below describe the common requirements for both the deployment modes and highlights specific requirements, if any for these modes. 

### vSphere Environment  Prerequisites

* General requirements
   - vCetener version :  6.7 and above
   - NTP configured on all ESXi Hosts.
   

* Zone Tagging 

Zone tagging is required for dynamic storage allocation across fault domains when provisiong workloads that require persistent storage. This is required for installation of Spectro Cloud Platform itself and also useful for workloads deployed in the tenant clusters if they have persistent storage needs. Use vSphere tags on data centers (k8s-region) and compute clusters (k8s-zone) to create distinct zones for your environment. As an example, assume that your vCenter environment includes three compute clusters- cluster-1, cluster-2, and cluster-3 that are part of datacenter dc-1. Create two tag categories, k8s-region and k8s-zone. You can then assign k8s-region tag to the dc-1, "k8s-region : region1". Tag the three compute clusters as zones. On cluster-1 set the tag "k8s-zone : az1", on cluster-2 set the tag "k8s-zone : az2" and on cluster-3 set the tag "k8s-zone : az3". The exact values for the k8s-region and k8s-zone tags can be different from the ones described in the above example, as long as they are unique. 


* VMware vCenter Permissions 
   
The following permissions are required for the account used to install the platform: -
### Permission List

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


###  Network Requirements

* Outgoing access to the internet either directly or via a proxy.
* If a proxy is used for outgoing connections, it should support both HTTP and HTTPS traffic. 
* If outgoing access is restricted to specific domains, ensure connections to the following domains and ports is enabled. 

This table lists the proxy requirements for enabling the Spectro Cloud management console.

### Proxy Requirements

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


### Optional Settings 

The following requirements are optional but recommended for production environments.

* DNS Mapping
   - A DNS used to access Spectro Cloud Console. While IP address configured on the platform can be used to access the platform, it is recommened that you reserve a DNS for this purpose and map it to the platform IP address after installation. 
* SMTP Settings
   - Configure SMTP settings to enable the Spectro Cloud platform to send out email notifications. Email Notifications are sent out to new users during the initial on-boarding to the platform to activate their account and also for every password resets. 
* Trusted Certificate
   - Configure your platform with trusted CA certificates.
* FTP Location for backups
   - Configure a FTP location for plaform backups and schedule daily backups. 
   	
# Quick Start Mode

The Spectro Cloud On-Prem Quick Start Mode is a single node installation of the Spectro Cloud platform. This deployment is used to quickly understand the capabilities of the Spectro Cloud platform. For production purposes the enterprise version is recommended. The minimum requirements for Quick Start version is outlined below:

### Hardware Requirements 

Hardware requirements will describe the CPU, memory, and disk requirements for the nodes.
* 8GB memory
* 4 virtual CPUs 
* Secondary storage of 80 GB distributed across multiple HDDs.

### IP Address

* The quick start VM instance can be configured with static IP addresses or dynamically allocated IP addresses.

<InfoBox>
 Make sure that your Datacenter CIDR IP address does not overlap Kubernetes PodCIDR range. Kubernetes PodCIDR range settings can be changed while installing On-Prem Quick Start.
</InfoBox>

# Enterprise Mode

The Spectro Cloud On-Premise Enterprise version is a highly available multinode infrastructure for production purposes. The minimum number of nodes/VMs required by this environment is 3. The minimum requirements are outlined below:

### Hardware Requirements 
Hardware requirements will describe the CPU, memory, and disk requirements for the nodes.
* Each VM requires 8GB memory resulting in 24GB RAM in total .
* 4 vCPUs per node * 3 nodes requiring 12 vCPUs
* Secondary storage of 240GB distributed across multiple HDDs.

### IP Addresses

* A block of 5 IP addresses for installation and ongoing management. 

### Compute Clusters

* For high availability purposes, it is recommended that you deploy the 3 VMs across 3 compute clusters. 

<InfoBox>
 Make sure that your Datacenter CIDR IP address does not overlap Kubernetes PodCIDR range. Kubernetes PodCIDR range settings can be changed while installing Enterprise version
</InfoBox>


## Private Cloud Gateway Installer

A Private Cloud Gateway is a Spectro Cloud component that enables the communication between Spectro Cloud's management console and a data center which is not accessible directly via the datacenter hosting Spectro Cloud On-Prem Application. The gateway needs to be installed by the users in their VMware environments using a private cloud gateway installer OVA.

### Hardware Requirement 

* The infrastructure will require a proxy/non proxy environment for outgoing traffic. 
* The [proxy requirements](/enterprise-version/on-prem-system-requirements/#proxyrequirements) for enabling the Spectro Cloud management console.
* The instance can be configured with static IP addresses or dynamically allocated IP addresses (DHCP or Static).
* vSphere Environment  Pre-requisites
     - IPs for application workload services (e.g.: LoadBalancer services).
     - Subnet with egress access to the internet (direct or via proxy).
     - For proxy: HTTP_PROXY, HTTPS_PROXY (both required).
     - NTP configured on all ESXi Hosts.
     - Shared Storage between vSphere hosts.
* VMware vCenter [Permissions](/enterprise-version/on-prem-system-requirements/#permissionlist) are the minimum privilages to be held to perform the installation. 
* Node requirements (1 Node)
   - 2 vCPU
   - 4GB memory
   - 30GB storage.



## Private Cloud Gateway Controller 
	
The infrastructure will require a proxy/non proxy environment for outgoing traffic. 
* [proxy requirements](/enterprise-version/on-prem-system-requirements/#proxyrequirements) lists the proxy requirements for enabling the Spectro Cloud management console.
* The instance can be configured with static IP addresses or dynamically allocated IP addresses (DHCP or Static ).
* vSphere Environment Pre-Requisites.
  - IPs for application workload services (e.g.: LoadBalancer services).
  - Subnet with egress access to the internet (direct or via proxy):
      - For proxy: HTTP_PROXY, HTTPS_PROXY (both required).
  - NTP configured on all ESXi Hosts.
  - Shared Storage between vSphere hosts.
  
* VMware vCenter [Permissions](/enterprise-version/on-prem-system-requirements/#permissionlist)
* Node requirements (1 Node)
    - 2 vCPU
    - 4GB memory
    - 30GB storage. 
* Node requirements (3 Node)
    - 6 vCPU
    - 12GB memory
    - 70GB storage


	
