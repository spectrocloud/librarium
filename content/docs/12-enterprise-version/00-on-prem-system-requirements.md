---
title: "System Requirements"
metaTitle: "On-premise System Requirements"
metaDescription: "An overview of On-premise System Requirements"
icon: ""
hideToC: true
fullWidth: true
---

import Tabs from 'shared/components/ui/Tabs';
import InfoBox from 'shared/components/InfoBox';
import WarningBox from 'shared/components/WarningBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";



# System Requirements

The Spectro Cloud Palette SaaS platform is also available as a self-hosted, on-premise deployment. The on-premise version is a dedicated instance of the platform hosted in the customer's VMware environment. Palette on-premise is available in two modes:

| **On-premise Modes** | **Description**                                                                   |
| --------------------- | --------------------------------------------------------------------------------- |
| **Enterprise Mode**   | A multi-node, highly available version for production purposes.                    |
| **Quick Start Mode**  | A single VM deployment of the platform ideal for proof-of-concept (PoC) purposes. |

The sections below describe the standard requirements and highlight specific requirements for both deployment modes.
## vSphere Environment Prerequisites

### General Requirements
   - vCenter version : 6.7 and above
  

   - NTP configured on all ESXi Hosts


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

<InfoBox>

### Naming conventions for vSphere Region and Zone Tags
The following points needs to be taken care while creating the Tags:
* A valid tag must consist of alphanumeric characters
* The tag must start and end with an alphanumeric characters
* The regex used for validation is '(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?')

**Example Tags:**
* MyValue
* my_value
* 12345

</InfoBox>

### Permissions

The following permissions are required for the account used to install the platform:

<br />
<br />

### vSphere Object

<br />

<Tabs>

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

<Tabs.TabPane tab="Network" key="Network">

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

</Tabs>


##  Network Requirements

* Outgoing access from the platform VMs to the internet either directly or via a proxy.


* An IP Address (static or DHCP) for the quick start virtual machine (also used as an installer for enterprise version).


* A block of five (5) IP addresses reserved for an enterprise cluster: One IP address for each of the three enterprise cluster VMs, an IP to be used as a VIP, and an additional IP reserved for rolling upgrades.


* Interconnectivity across all the three (3) VMs on all ports.


* Connectivity from the Virtual Machines to the vCenter.


<InfoBox>
 Make sure that your data center CIDR IP address does not overlap Kubernetes PodCIDR range. Kubernetes PodCIDR range settings can be changed during installation.
</InfoBox>


##  Proxy Requirements
*   If a proxy is used for outgoing connections, it should support both HTTP and HTTPS traffic.


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

## On-premise Configurations

| **Configuration Name** | **Concurrent <br /> Cluster <br /> Launch** | **Max Nodes** | **CPUs** | **Memory** | **Storage** | **MongoDB Limit**      | **Running Workload**                              |
| ---------------------- | ------------------------------------------- | ------------- | -------- | ---------- | ----------- | ---------------------- | ------------------------------------------------- |
| **Small**              | 4                                           | 1000          | 4        | 8 GB       | 60 GB       | 20 GB, 1 CPU, 2 GB Mem | Up to 1000 Nodes each with 30 Pods (30,000 pods)  |
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
