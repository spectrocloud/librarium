---
title: "System Requirements"
metaTitle: "System Requirements"
metaDescription: "An overview of the self-hosted Palette system requirements."
icon: ""
hideToC: true
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import InfoBox from 'shared/components/InfoBox';
import WarningBox from 'shared/components/WarningBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";


# System Requirements

Palette is available as a self-hosted application that you install in your environment. The self-hosted version is a dedicated Palette environment hosted on VMware instances or in an existing Kubernetes cluster. Self-hosted Palette is available in the following three modes:

| **Self-Hosted Modes** | **Description**                                                                   |
| --------------------- | --------------------------------------------------------------------------------- |
| **VMWare Enterprise Mode**   | A multi-node, highly available version for production purposes.                    |
| **VMWare Quick Start Mode**  | A single VM deployment of the platform that is ideal for use in Proofs of Concept (PoCs). |
| **Helm Chart Mode**  | Install Palette in an existing Kubernetes cluster using a Helm Chart. |

The next sections describe specific requirements for all modes.

<br />

## Prerequisites

The following are prerequisites for deploying a Kubernetes cluster in VMware:
* vSphere version 7.0 or above. vSphere 6.7 is supported but not recommended as it reached end of general support in 2022.


* Configuration Requirements - A Resource Pool needs to be configured across the hosts, onto which the workload clusters will be provisioned. Every host in the Resource Pool will need access to shared storage, such as vSAN, to use high-availability control planes. Network Time Protocol (NTP) must be configured on each ESXi host.


* You need an active vCenter account with all the permissions listed below in the VMware Cloud Account Permissions section.


* Install a Private Cloud Gateway for VMware as described in the Creating a VMware Cloud Gateway section. Installing the Private Cloud Gateway automatically registers a cloud account for VMware in Palette. You can register additional VMware cloud accounts in Palette as described in the Creating a VMware Cloud account section.

* Kubernetes version 1.19 minimum when installing Palette in a cluster using a Helm Chart. We recommend using managed Kubernetes, such as Amazon EKS and Azure EKS. 

* Subnet with egress access to the internet (direct or via proxy):
  * For proxy: HTTP_PROXY, HTTPS_PROXY (both are required).
  * Outgoing internet connection on port 443 to api.spectrocloud.com.


* The Private cloud gateway IP requirements are:
  * One (1) node - one (1) IP or three (3) nodes - three (3) IPs.
  * One (1) Kubernetes control-plane VIP.
  * One (1) Kubernetes control-plane extra.


* Assign IPs for application workload services (e.g., Load Balancer services).


* A DNS to resolve public internet names (e.g., api.spectrocloud.com).


* Shared Storage between vSphere hosts.


* A cluster profile created in Palette for VMware.


* Zone Tagging: A dynamic storage allocation for persistent storage.


### Zone Tagging

  Zone tagging is required for dynamic storage allocation, across fault domains, when provisioning workloads that require persistent storage. This is required for the installation of the Palette platform itself and is also useful for Workloads deployed in the Tenant Clusters, if they have persistent storage needs. Use vSphere tags on data centers (kubernetes-region) and compute clusters (kubernetes-zone) to create distinct zones in your environment.

  As an example, assume your vCenter environment includes three compute clusters: *cluster-1*, *cluster-2*, and *cluster-3* as part of data center dc-1. You can tag them as follows:

| **vSphere Object** | **Tag Category** | **Tag Value** |
| ------------------ | ---------------- | ------------- |
| dc-1               | k8s-region       | region1       |
| cluster-1          | k8s-zone         | az1           |
| cluster-2          | k8s-zone         | az2           |
| cluster-3          | k8s-zone         | az3           |


**Note**: The exact values for the kubernetes-region and kubernetes-zone tags can be different from the ones described in the example above, as long as these are unique.
<br />

### Tag Requirements
The following points needs to be taken care while creating the Tags:
* A valid tag must consist of alphanumeric characters
* The tag must start and end with an alphanumeric characters
* The regex used for validation is '(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?')

**Example Tags:**
* MyValue
* my_value
* 12345





## VMware Privileges

The vSphere user account that is deploying Palette must have the following minimum vSphere privileges. The **Administrator** role provides super-user access to all vSphere objects. For users without the **Administrator** role, one or more custom roles can be created based on the tasks being performed by the user.
Permissions and privilieges vary depending on the vSphere version you are using. 

Select the tab that corresponds with your vSphere versions.

<br />

<Tabs identifier="vm-privileges">

<Tabs.TabPane tab="8.0.x" key="8.0.x" >


## Root-Level Role Privileges

<br />

The root-level role privileges are applied to root object and Datacenter objects only.

|**vSphere Object**|**Privileges**|
|---------------|----------|
|**Cns**|Searchable|
|**Datastore**|Browse datastore
|**Host**|Configuration
|| Storage partition configuration
|**vSphere** **Tagging**|Create vSphere Tag|
||Edit vSphere Tag|
|**Network**|Assign network|
|**Sessions**|Validate session|
|**VM Storage Policies**|View VM storage policies|
|**Storage views**|View|

<br />

## Spectro Role Privileges


<Tabs>

<Tabs.TabPane tab="Cns" key="Cns">

#### Cns Privileges
  - Searchable

</Tabs.TabPane>

<Tabs.TabPane tab="Datastore" key="Datastore">

#### Datastore Privileges
  - Allocate Space
  - Browse Datastore
  - Low level file operations
  - Remove file
  - Update virtual machine files
  - Update virtual machine metadata


</Tabs.TabPane>

<Tabs.TabPane tab="Folder" key="Folder">

  #### Folder Privileges
  - Create folder
  - Delete folder
  - Move folder
  - Rename folder

</Tabs.TabPane>

<Tabs.TabPane tab="Host" key="Host">

  #### Host Privileges
  - Local Operations
    * Reconfigure virtual machine

</Tabs.TabPane>

<Tabs.TabPane tab="Network" key="Network">

<br />

<InfoBox>

If the network is a Distributed Port Group under a vSphere Distributed Switch (VDS),  ReadOnly access to the VDS without “Propagate to children” needs to be provided.

</InfoBox>

<br />

  #### Network Privileges

  - Assign Network

</Tabs.TabPane>

<Tabs.TabPane tab="Resource" key="Resource">

  #### Resource Privileges

  - Apply recommendation
  - Assign virtual machine to resource pool
  - Migrate powered off virtual machine
  - Migrate powered on virtual machine
  - Query vMotion

</Tabs.TabPane>

<Tabs.TabPane tab="Sessions" key="Sessions">

  #### Sessions Privileges
  - Validate session

</Tabs.TabPane>

<Tabs.TabPane tab="Storage Policies" key="storage-policies">

  #### VM Storage Policies Privileges

  -   View  access for VM storage policies is required. Ensure the privilege `StorageProfile.View` is available. Refer to the [VM Storage Policies Privileges](https://docs.vmware.com/en/VMware-vSphere/8.0/vsphere-security/GUID-DECEAE60-58CB-4B30-8874-FA273573E6B5.html) resource to learn more.

</Tabs.TabPane>

<Tabs.TabPane tab="Storage views" key="Storage views">

  #### Storage Views Privileges
  - View

</Tabs.TabPane>


<Tabs.TabPane tab="Tasks" key="Tasks">

  #### Task Privileges

  - Create task
  - Update task

</Tabs.TabPane>

<Tabs.TabPane tab="vApp" key="vApp">

  #### vApp Privileges

  - Import
  - View OVF environment
  - vApp application configuration
  - vApp instance configuration

</Tabs.TabPane>

<Tabs.TabPane tab="vSphere Tagging" key="vSphere Tagging">

  #### vSphere Tagging

  - Create vSphere Tag
  - Edit vSphere Tag

</Tabs.TabPane>


<Tabs.TabPane tab="VMs" key="Virtual Machines">

  #### Virtual Machines Privileges


<br />

|                           |                                             |                                       |
| ------------------------- | ------------------------------------------- | ------------------------------------- |
| **Change Configuration**  |                                             |                                       |
|                           | Change Settings                             | Extend virtual disk                   |
|                           | Change Swapfile Placement                   | Modify device settings                |
|                           | Configure host USB device                   | Query Fault Tolerance compatibility   |
|                           | Configure raw device                        | Query unowned files                  |
|                           | Add existing disk                           | Reload from path                      |
|                           | Add new disk                                | Remove disk                           |
|                           | Add or remove device                        | Rename                                |
|                           | Change resource                             | Reset guest information               |
|                           | Configure managedBy                         | Set annotation                        |
|                           | Display connection settings                 | Toggle fork parent                    |
|                           | Advanced configuration                      | Upgrade virtual machine compatibility |
|                           | Change CPU count                            |                                       |
| **Guest operations**      |                                             |                                       |
|                           | Guest operation alias modification          | Guest operation alias query           |
|                           | Guest operation modifications               | Guest operation queries               |
|                           | Guest operation program execution           |                                       |
| **Interaction**           |                                             |                                       |
|                           | Power off                                   | Power on                              |
| **Inventory**             |                                             |                                       |
|                           | Create from existing                        | Move                                  |
|                           | Create new                                  | Remove                                |
| **Provisioning**          |                                             |                                       |
|                           | Allow disk access                           | Customize guest                       |
|                           | Allow file access                           | Deploy template                       |
|                           | Allow read-only disk access                 | Mark as template                      |
|                           | Allow virtual machine download              | Mark as virtual machine               |
|                           | Allow virtual machine files upload          | Modify customization specification    |
|                           | Clone template                              | Promote disks                         |
|                           | Clone virtual machine                       | Read customization specifications     |
|                           | Create template from virtual machine        |                                       |
| **Service Configuration** |                                             |                                       |
|                           | Allow notifications                         | Modify service configuration          |
|                           | Allow polling of global event notifications | Query service configurations          |
|                           | Manage service configurations               | Read service configuration            |
| **Snapshot Management**   |                                             |                                       |
|                           | Create snapshot                             | Remove snapshot                       |
|                           | Rename snapshot                             | Revert to snapshot                    |
| **vSphere Replication**   |                                             |                                       |
|                           | Configure replication                       | Monitor replication                   |
|                           | Monitor replication                         |                                       |


</Tabs.TabPane>

<Tabs.TabPane tab="vSAN" key="vSAN">

  #### vSAN

  - Cluster
    * ShallowRekey

</Tabs.TabPane>

</Tabs>

</Tabs.TabPane>

<Tabs.TabPane tab="7.0.x" key="7.0.x" >


## Root-Level Role Privileges

<br />

The root-level role privileges are applied to root object and Datacenter objects only.

|**vSphere Object**|**Privileges**|
|---------------|----------|
|**Cns**|Searchable|
|**Datastore**|Browse datastore
|**Host**|Configuration
|| Storage partition configuration
|**vSphere** **Tagging**|Create vSphere Tag|
||Edit vSphere Tag|
|**Network**|Assign network|
|**Sessions**|Validate session|
|**Profile-driven storage**|Profile-driven storage view|
|**Storage views**|View|

<br />

## Spectro Role Privileges


<Tabs>

<Tabs.TabPane tab="Cns" key="Cns">

#### Cns Privileges
  - Searchable

</Tabs.TabPane>

<Tabs.TabPane tab="Datastore" key="Datastore">

#### Datastore Privileges
  - Allocate Space
  - Browse Datastore
  - Low level file operations
  - Remove file
  - Update virtual machine files
  - Update virtual machine metadata


</Tabs.TabPane>

<Tabs.TabPane tab="Folder" key="Folder">

  #### Folder Privileges
  - Create folder
  - Delete folder
  - Move folder
  - Rename folder

</Tabs.TabPane>

<Tabs.TabPane tab="Host" key="Host">

  #### Host Privileges
  - Local Operations
    * Reconfigure virtual machine

</Tabs.TabPane>

<Tabs.TabPane tab="Network" key="Network">

<br />


<InfoBox>

If the network is a Distributed Port Group under a vSphere Distributed Switch (VDS),  ReadOnly access to the VDS without “Propagate to children” needs to be provided.

</InfoBox>

  #### Network Privileges

  - Assign Network

</Tabs.TabPane>

<Tabs.TabPane tab="Resource" key="Resource">

  #### Resource Privileges

  - Apply recommendation
  - Assign virtual machine to resource pool
  - Migrate powered off virtual machine
  - Migrate powered on virtual machine
  - Query vMotion

</Tabs.TabPane>

<Tabs.TabPane tab="Sessions" key="Sessions">

  #### Sessions Privileges
  - Validate session

</Tabs.TabPane>

<Tabs.TabPane tab="Profile Driven Storage" key="Profile Driven Storager">

  #### Profile Driven Storage
  - Profile-driven storage view

</Tabs.TabPane>

<Tabs.TabPane tab="Storage views" key="Storage views">

  #### Storage Views Privileges
  - View

</Tabs.TabPane>


<Tabs.TabPane tab="Tasks" key="Tasks">

  #### Task Privileges

  - Create task
  - Update task

</Tabs.TabPane>

<Tabs.TabPane tab="vApp" key="vApp">

  #### vApp Privileges

  - Import
  - View OVF environment
  - vApp application configuration
  - vApp instance configuration

</Tabs.TabPane>

<Tabs.TabPane tab="vSphere Tagging" key="vSphere Tagging">

  #### vSphere Tagging

  - Create vSphere Tag
  - Edit vSphere Tag

</Tabs.TabPane>


<Tabs.TabPane tab="VMs" key="Virtual Machines">

  #### Virtual Machines Privileges


<br />

|                           |                                             |                                       |
| ------------------------- | ------------------------------------------- | ------------------------------------- |
| **Change Configuration**  |                                             |                                       |
|                           | Change Settings                             | Extend virtual disk                   |
|                           | Change Swapfile Placement                   | Modify device settings                |
|                           | Configure host USB device                   | Query Fault Tolerance compatibility   |
|                           | Configure raw device                        | Query unowned files                  |
|                           | Add existing disk                           | Reload from path                      |
|                           | Add new disk                                | Remove disk                           |
|                           | Add or remove device                        | Rename                                |
|                           | Change resource                             | Reset guest information               |
|                           | Configure managedBy                         | Set annotation                        |
|                           | Display connection settings                 | Toggle fork parent                    |
|                           | Advanced configuration                      | Upgrade virtual machine compatibility |
|                           | Change CPU count                            |                                       |
| **Guest operations**      |                                             |                                       |
|                           | Guest operation alias modification          | Guest operation alias query           |
|                           | Guest operation modifications               | Guest operation queries               |
|                           | Guest operation program execution           |                                       |
| **Interaction**           |                                             |                                       |
|                           | Power off                                   | Power on                              |
| **Inventory**             |                                             |                                       |
|                           | Create from existing                        | Move                                  |
|                           | Create new                                  | Remove                                |
| **Provisioning**          |                                             |                                       |
|                           | Allow disk access                           | Customize guest                       |
|                           | Allow file access                           | Deploy template                       |
|                           | Allow read-only disk access                 | Mark as template                      |
|                           | Allow virtual machine download              | Mark as virtual machine               |
|                           | Allow virtual machine files upload          | Modify customization specification    |
|                           | Clone template                              | Promote disks                         |
|                           | Clone virtual machine                       | Read customization specifications     |
|                           | Create template from virtual machine        |                                       |
| **Service Configuration** |                                             |                                       |
|                           | Allow notifications                         | Modify service configuration          |
|                           | Allow polling of global event notifications | Query service configurations          |
|                           | Manage service configurations               | Read service configuration            |
| **Snapshot Management**   |                                             |                                       |
|                           | Create snapshot                             | Remove snapshot                       |
|                           | Rename snapshot                             | Revert to snapshot                    |
| **vSphere Replication**   |                                             |                                       |
|                           | Configure replication                       | Monitor replication                   |
|                           | Monitor replication                         |                                       |


</Tabs.TabPane>

<Tabs.TabPane tab="vSAN" key="vSAN">

  #### vSAN

  - Cluster
    * ShallowRekey

</Tabs.TabPane>

</Tabs>



</Tabs.TabPane>

<Tabs.TabPane tab="6.0.x" key="6.0.x" >


## Root-Level Role Privileges

<br />

The root-level role privileges are applied to root object and Datacenter objects only.

|**vSphere Object**|**Privileges**|
|---------------|----------|
|**Cns**|Searchable|
|**Datastore**|Browse datastore
|**Host**|Configuration
|| Storage partition configuration
|**vSphere** **Tagging**|Create vSphere Tag|
||Edit vSphere Tag|
|**Network**|Assign network|
|**Sessions**|Validate session|
|**Profile-driven storage**|Profile-driven storage view|
|**Storage views**|View|

<br />

## Spectro Role Privileges


<Tabs>

<Tabs.TabPane tab="Cns" key="Cns">

#### Cns Privileges
  - Searchable

</Tabs.TabPane>

<Tabs.TabPane tab="Datastore" key="Datastore">

#### Datastore Privileges
  - Allocate Space
  - Browse Datastore
  - Low level file operations
  - Remove file
  - Update virtual machine files
  - Update virtual machine metadata


</Tabs.TabPane>

<Tabs.TabPane tab="Folder" key="Folder">

  #### Folder Privileges
  - Create folder
  - Delete folder
  - Move folder
  - Rename folder

</Tabs.TabPane>

<Tabs.TabPane tab="Host" key="Host">

  #### Host Privileges
  - Local Operations
    * Reconfigure virtual machine

</Tabs.TabPane>

<Tabs.TabPane tab="Network" key="Network">

<br />

<InfoBox>

If the network is a Distributed Port Group under a vSphere Distributed Switch (VDS),  ReadOnly access to the VDS without “Propagate to children” needs to be provided.

</InfoBox>

  #### Network Privileges

  - Assign Network

</Tabs.TabPane>

<Tabs.TabPane tab="Resource" key="Resource">

  #### Resource Privileges

  - Apply recommendation
  - Assign virtual machine to resource pool
  - Migrate powered off virtual machine
  - Migrate powered on virtual machine
  - Query vMotion

</Tabs.TabPane>

<Tabs.TabPane tab="Sessions" key="Sessions">

  #### Sessions Privileges
  - Validate session

</Tabs.TabPane>

<Tabs.TabPane tab="Profile Driven Storage" key="Profile Driven Storager">

  #### Profile Driven Storage
  - Profile-driven storage view

</Tabs.TabPane>

<Tabs.TabPane tab="Storage views" key="Storage views">

  #### Storage Views Privileges
  - View

</Tabs.TabPane>


<Tabs.TabPane tab="Tasks" key="Tasks">

  #### Task Privileges

  - Create task
  - Update task

</Tabs.TabPane>

<Tabs.TabPane tab="vApp" key="vApp">

  #### vApp Privileges

  - Import
  - View OVF environment
  - vApp application configuration
  - vApp instance configuration

</Tabs.TabPane>

<Tabs.TabPane tab="vSphere Tagging" key="vSphere Tagging">

  #### vSphere Tagging

  - Create vSphere Tag
  - Edit vSphere Tag

</Tabs.TabPane>


<Tabs.TabPane tab="VMs" key="Virtual Machines">

  #### Virtual Machines Privileges


<br />

|                           |                                             |                                       |
| ------------------------- | ------------------------------------------- | ------------------------------------- |
| **Change Configuration**  |                                             |                                       |
|                           | Change Settings                             | Extend virtual disk                   |
|                           | Change Swapfile Placement                   | Modify device settings                |
|                           | Configure host USB device                   | Query Fault Tolerance compatibility   |
|                           | Configure raw device                        | Query unowned files                  |
|                           | Add existing disk                           | Reload from path                      |
|                           | Add new disk                                | Remove disk                           |
|                           | Add or remove device                        | Rename                                |
|                           | Change resource                             | Reset guest information               |
|                           | Configure managedBy                         | Set annotation                        |
|                           | Display connection settings                 | Toggle fork parent                    |
|                           | Advanced configuration                      | Upgrade virtual machine compatibility |
|                           | Change CPU count                            |                                       |
| **Guest operations**      |                                             |                                       |
|                           | Guest operation alias modification          | Guest operation alias query           |
|                           | Guest operation modifications               | Guest operation queries               |
|                           | Guest operation program execution           |                                       |
| **Interaction**           |                                             |                                       |
|                           | Power off                                   | Power on                              |
| **Inventory**             |                                             |                                       |
|                           | Create from existing                        | Move                                  |
|                           | Create new                                  | Remove                                |
| **Provisioning**          |                                             |                                       |
|                           | Allow disk access                           | Customize guest                       |
|                           | Allow file access                           | Deploy template                       |
|                           | Allow read-only disk access                 | Mark as template                      |
|                           | Allow virtual machine download              | Mark as virtual machine               |
|                           | Allow virtual machine files upload          | Modify customization specification    |
|                           | Clone template                              | Promote disks                         |
|                           | Clone virtual machine                       | Read customization specifications     |
|                           | Create template from virtual machine        |                                       |
| **Service Configuration** |                                             |                                       |
|                           | Allow notifications                         | Modify service configuration          |
|                           | Allow polling of global event notifications | Query service configurations          |
|                           | Manage service configurations               | Read service configuration            |
| **Snapshot Management**   |                                             |                                       |
|                           | Create snapshot                             | Remove snapshot                       |
|                           | Rename snapshot                             | Revert to snapshot                    |
| **vSphere Replication**   |                                             |                                       |
|                           | Configure replication                       | Monitor replication                   |
|                           | Monitor replication                         |                                       |


</Tabs.TabPane>

<Tabs.TabPane tab="vSAN" key="vSAN">

  #### vSAN

  - Cluster
    * ShallowRekey

</Tabs.TabPane>

</Tabs>




</Tabs.TabPane>
</Tabs>


<br />


---

##  Network Requirements

* Outgoing access from the platform VMs to the internet either directly or via a proxy.


* An IP Address (static or DHCP) for the quick start virtual machine (also used as an installer for enterprise version).


* A block of five (5) IP addresses reserved for an enterprise cluster: One IP address for each of the three enterprise cluster VMs, an IP to be used as a VIP, and an additional IP reserved for rolling upgrades.


* Interconnectivity across all the three (3) VMs on all ports.


* Connectivity from the Virtual Machines to the vCenter.


<InfoBox>
Ensure your data center CIDR IP address does not overlap with the Kubernetes PodCIDR range. During installation, you can change the Kubernetes PodCIDR range settings.
</InfoBox>


##  Proxy Requirements
*  If a proxy is used for outgoing connections, it must support both HTTPS and HTTP traffic. All Palette components communicate over HTTPS by default. An HTTP proxy can be used when HTTP is the only supported protocol, such as connecting to a private image registry that only supports HTTP.


*   Connectivity to the following domains and ports should be allowed:

    | **Top-level Domain**      | **Port** | **Description**                                     |
    | ------------------------- | -------- | --------------------------------------------------- |
    | spectrocloud.com          | 443      | Spectro Cloud content repository and pack registry  |
    | s3.amazonaws.com          | 443      | Spectro Cloud VMware OVA files                      |
    | gcr.io                    | 443      | Spectro Cloud and common 3rd party container images |
    | docker.io                 | 443      | Common 3rd party container images                   |
    | googleapis.com            | 443      | For pulling Spectro Cloud images                    |
    | docker.com                | 443      | Common 3rd party container images                   |
    | raw.githubusercontent.com | 443      | Common 3rd party content                            |
    | projectcalico.org         | 443      | Calico container images                             |
    | quay.io                   | 443      | Common 3rd party container images                   |
    | grafana.com               | 443      | Grafana container images and manifests              |
    | github.com                | 443      | Common 3rd party content                            |


## Hardware Requirements

The following section provides the hardware requirements for Palette Platform VMs for various capacity levels.


| **Capacity Levels**            | **Description**                                                            |
| ------------------------------ | -------------------------------------------------------------------------- |
| **Concurrent Tenant Clusters** | The number of concurrent tenant cluster provisioning or deletion requests. |
| **Total Managed Clusters**     | The number of parallel running tenant clusters.                            |


<br />

<InfoBox>
The size of the Tenant Cluster, in terms of the number of nodes or size of the nodes, does not impact the capacity guidance below.
</InfoBox>

## Self-Hosted Configuration

| **Configuration Name** | **Concurrent <br /> Cluster <br /> Launch** | **Max Nodes** | **CPUs** | **Memory** | **Storage** | **MongoDB Limit**      | **Running Workload**                              |
| ---------------------- | ------------------------------------------- | ------------- | -------- | ---------- | ----------- | ---------------------- | ------------------------------------------------- |
| **Small**              | 4                                           | 1000          | 4        | 8 GB       | 80 GB       | 20 GB, 1 CPU, 2 GB Mem | Up to 1000 Nodes each with 30 Pods (30,000 pods)  |
| **Medium(Default)**    | 8                                           | 3000          | 8        | 16 GB      | 120 GB      | 60 GB, 2 CPU, 4 GB Mem | Up to 3000 Nodes each with 30 Pods (90,000 pods)  |
| **Large**              | 12                                          | 5000          | 12       | 32 GB      | 150 GB      | 80 GB, 2 CPU, 6 GB Mem | Up to 5000 Nodes each with 30 Pods (150,000 pods) |


<br />

## Quick Start and Enterprise Configurations

|                 | **Category** | **Concurrent <br /> Tenant <br /> Clusters** | **Total <br /> Managed <br /> Clusters**                        | **No. <br /> of <br /> VMs** | **Memory** | **CPUs**       | **Storage** |
| --------------- | ------------ | -------------------------------------------- | --------------------------------------------------------------- | ---------------------------- | ---------- | -------------- | ----------- |
| **Quick Start** | Small        | 4                                            | 20                                                              | 1                            | 8 GB       | 4 Virtual CPUs | 80 GB       |
| **Enterprise**  | Medium       | 8                                            | 500* (Cluster having 6 nodes <br /> and each node with 30 pods) | 3                            | 16 GB      | 8 Virtual CPUs | 120 GB      |



<br />
  <InfoBox>
  For high availability purposes, it is recommended that you deploy the three (3) VMs across three (3) compute clusters.
  </InfoBox>


## Best Practices

The following steps are optional but recommended for production environments.


|                              |                                                                                                                                                                                                                                                                                      |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **DNS Mapping**              | A DNS is used to access the Palette Management Console. While the Virtual IP Address (VIP), configured on the platform can be used <br /> to access the platform, it is recommended that you reserve a DNS for this purpose and map it to the VIP after installation.                 |
| **SMTP Setting**s            | Configure the SMTP settings to enable the Palette platform to send out email notifications. Email notifications are sent out to new <br /> users, when they are initially onboarded onto the platform, so they can activate their accounts and reset their password at a later time. |
| **Trusted Certificate**      | Configure your platform with a trusted CA certificates.                                                                                                                                                                                                                              |
| **FTP Location for backups** | Configure an FTP location for platform backups and schedule daily backups.                                                                                                                                                                                                           |
