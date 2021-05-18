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




# System Requirements

The Spectro Cloud SaaS platform is also available as self hosted on-premise deployment. The On-Premise version is a dedicated instance of the platorm hosted in customer's VMware environment. Spectro Cloud on-prem is available in two modes:

* Quick Start Mode - A single VM deployment of the platform ideal for PoC purposes. 
* Enterprise Mode - A multi node highly available version for production purposes. 

The sections below describe the common requirements for both the deployment modes and highlight specific requirements, if any for these modes. 

## vSphere Environment Prerequisites

* General requirements
   - vCetener version :  6.7 and above
   - NTP configured on all ESXi Hosts.
   


* Zone Tagging
Zone tagging is required for dynamic storage allocation across fault domains when provisiong workloads that require persistent storage. This is required for installation of Spectro CLoud Platform itself and also useful for worklods deployed in the tenat clusters if they have persistent storage needs. Use vSphere tags on data centers (k8s-region) and compute clusters (k8s-zone) to create distinct zones in your environment. 
As an example, assume your vCenter environment includes three compute clusters, cluster-1, cluster-2, and cluster-3, that are part of datacenter dc-1. You can tag them as follows :-

    | vSphere Object       | Tag Category     | Tag Value     |
    | :------------- | :---------- | :----------- |
    |  dc-1 | k8s-region   | region1   |
    | cluster-1   | k8s-zone | az1 |
    | cluster-1   | k8s-zone | az1 |
    | cluster-3   | k8s-zone | az3 |

    
    <InfoBox>
     The exact values for the k8s-region and k8s-zone tags can be different from the ones described in the above example, as long as they are unique.
    </InfoBox>

* Permissions 
The following permissions are required for the account used to install the platform :-

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



##  Network Requirements

* Outgoing access from the platform VMs to the internet either directly or via a proxy
* An IP Address (static or DHCP) for the quick start Virtual machine (also used as an installer for enterprise version) 
* A block of 5 IP addresses reserved for enterprise cluster. One IP address for each of the three enterprise cluster VMs. An IP to be used as VIP and an additional IP reserved for rolling upgrades.
* Interconnectivity across all the 3 VMs on all ports.
* Connectivity from the Virtual Machines to the vCenter.

##  Proxy Requirements
*   If a proxy is used for outgoing connections, it should support both HTTP and HTTPS traffic. 
*   Connectivity to the followign domains and ports should be allowed :-

    | Top-level Domain | Port | Description |
    | --- | --- | --- |
    | spectrocloud.com | 443 | Spectro Cloud content repository and pack registry |
    | s3.amazonaws.com | 443 | Spectro Cloud VMware OVA files. |
    | gcr.io | 443 | Spectro Cloud and common 3rd party container images. |
    | docker.io | 443 | Common 3rd party container images. |
    | googleapis.com | 443 | For pulling Spectro Cloud images. |
    | docker.com | 443 | Common 3rd party container images. |
    | raw.githubusercontent.com | 443 | Common 3rd party content. |
    | projectcalico.org | 443 | Calico container image |
    | quay.io | 443 | Common 3rd party container images. |
    | grafana.com | 443 | Grafana container images and manifests |
    | github.com | 443 | Common 3rd party content.|


## Best Practices

The following steps are optional but recommended for production environments.

* DNS Mapping
   A DNS used to be used to access Spectro Cloud Management Console. While the Virtual IP Address (VIP) configured on the platform can be used to access the platform, it is recommened that you reserve a DNS for this purpose and map it to the VIP after installation. 
* SMTP Settings
   Configure SMTP settings to enable the Spectro Cloud platform to send out email notifications. Email Notifications are sent out to new users when they are initially on-boarded to the platform so they can activate their accounts as well as to reset their password at a later time. 
* Trusted Certificate
   Configure your platform with a trusted CA certificates.
* FTP Location for backups
  Configure a FTP location for plaform backups and schedule daily backups. 
    

## Hardware Requirements 

The following section provides the hardware requirements for Spectro Cloud Platform VMs for various capacity levels.
* Concurrent Tenant Clusters - The number of concurrent tenant cluster provisioning or deletion requests
* Total Managed Clusters - The number of parallely running tenant clusters.

    <InfoBox>
     The size of the tenant cluster in terms of the number of nodes or size of the nodes does not impact the capacity guidance below. 
    </InfoBox>
    
### Quick Start

| Category | Concurrent Tenant Clusters | Total Managed Clusters | No. of VMs | Memory | CPUs | Storage |
| --- | :---: | :-----: | :---: | :---: | :---: | --- |
| Standard | 3 | 20 | 1 | 8Gb | 4 Virtual CPUs | 80 GB |
    
### Enterprise

| Category | Concurrent Tenant Clusters | Total Managed Clusters | No. of VMs | Memory | CPUs | Storage |
    | --- | :---: | :-----: | :---: | :---: | :---: | --- |
    | Standard | 3 | 100 | 3 | 8Gb | 4 Virtual CPUs | 80 GB |
    | Medium | 10 |250 | 3 | 16Gb | 8 Virtual CPUs | 80 GB |
    | Large | 25 |500 | 3 | 32Gb | 8 Virtual CPUs | 80 GB |
    


<InfoBox>
 Make sure that your Datacenter CIDR IP address does not overlap Kubernetes PodCIDR range. Kubernetes PodCIDR range settings can be changed while installing On-Prem Quick Start.
</InfoBox>

<InfoBox>
 For high availability purposes, it is recommended that you deploy the 3 VMs across 3 compute clusters. 
</InfoBox>

