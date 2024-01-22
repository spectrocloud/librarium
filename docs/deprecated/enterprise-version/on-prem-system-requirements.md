---
sidebar_label: "System Requirements"
title: "System Requirements"
description: "An overview of the self-hosted Palette system requirements."
icon: ""
hide_table_of_contents: false
toc_min_heading_level: 2
toc_max_heading_level: 3
sidebar_position: 0
tags: ["self-hosted", "enterprise"]
---

## System Requirements

The Spectro Cloud Palette SaaS platform is available as a self-hosted, on-prem deployment. The on-prem version is a
dedicated instance of the platform hosted in a VMware environment or in an existing Kubernetes cluster. Palette on-prem
is available in three modes:

| **On-premise Modes**        | **Description**                                                                           |
| --------------------------- | ----------------------------------------------------------------------------------------- |
| **VMWare Enterprise Mode**  | A multi-node, highly available version for production purposes.                           |
| **VMWare Quick Start Mode** | A single VM deployment of the platform that is ideal for use in Proofs of Concept (PoCs). |
| **Helm Chart Mode**         | Install Palette in an existing Kubernetes cluster using a Helm Chart.                     |

The sections below describe the standard requirements and highlight specific requirements for both deployment modes.

<br />

## Prerequisites

The following are prerequisites for deploying a Kubernetes cluster in VMware:

- vCenter version 6.7U3 or above is recommended.

- Configuration Requirements - A Resource Pool needs to be configured across the hosts, onto which the workload clusters
  will be provisioned. Every host in the Resource Pool will need access to shared storage, such as vSAN, to use
  high-availability control planes. Network Time Protocol (NTP) must be configured on each ESXi host.

- You need an active vCenter account with all the permissions listed below in the VMware Cloud Account Permissions
  section.

- Install a Private Cloud Gateway for VMware as described in the Creating a VMware Cloud Gateway section. Installing the
  Private Cloud Gateway automatically registers a cloud account for VMware in Palette. You can register additional
  VMware cloud accounts in Palette as described in the Creating a VMware Cloud account section.

- Kubernetes version 1.19 minimum when installing Palette in a cluster using a Helm Chart. We recommend using managed
  Kubernetes, such as Amazon EKS and Azure EKS.

- Subnet with egress access to the internet (direct or via proxy):

  - For proxy: HTTP_PROXY, HTTPS_PROXY (both are required).
  - Outgoing internet connection on port 443 to api.spectrocloud.com.

- The Private cloud gateway IP requirements are:

  - One (1) node - one (1) IP or three (3) nodes - three (3) IPs.
  - One (1) Kubernetes control-plane VIP.
  - One (1) Kubernetes control-plane extra.

- Assign IPs for application workload services (e.g., Load Balancer services).

- A DNS to resolve public internet names (e.g., api.spectrocloud.com).

- Shared Storage between vSphere hosts.

- A cluster profile created in Palette for VMware.

- Zone Tagging: A dynamic storage allocation for persistent storage.

### Zone Tagging

Zone tagging is required for dynamic storage allocation, across fault domains, when provisioning workloads that require
persistent storage. This is required for the installation of the Palette platform itself and is also useful for
Workloads deployed in the Tenant Clusters, if they have persistent storage needs. Use vSphere tags on data centers
(kubernetes-region) and compute clusters (kubernetes-zone) to create distinct zones in your environment.

As an example, assume your vCenter environment includes three compute clusters: _cluster-1_, _cluster-2_, and
_cluster-3_ as part of data center dc-1. You can tag them as follows:

| **vSphere Object** | **Tag Category** | **Tag Value** |
| ------------------ | ---------------- | ------------- |
| dc-1               | k8s-region       | region1       |
| cluster-1          | k8s-zone         | az1           |
| cluster-2          | k8s-zone         | az2           |
| cluster-3          | k8s-zone         | az3           |

:::info

The exact values for the kubernetes-region and kubernetes-zone tags can be different from the ones described in the
example above, as long as these are unique.

:::

<br />

### Naming conventions for vSphere Region and Zone Tags

The following points needs to be taken care while creating the Tags:

- A valid tag must consist of alphanumeric characters
- The tag must start and end with an alphanumeric characters
- The regex used for validation is '(([A-Za-z0-9][-A-Za-z0-9_.]\*)?[A-Za-z0-9])?')

**Example Tags:**

- MyValue
- my_value
- 12345

## Privileges

The vSphere user account used in the various Palette tasks must have the minimum vSphere privileges required to perform
the task. The **Administrator** role provides super-user access to all vSphere objects. For users without the
**Administrator** role, one or more custom roles can be created based on the tasks being performed by the user.

<br />

<Tabs queryString="vm-privileges">

<TabItem label="8.0.x" value="8.0.x" >

#### Root-Level Role Privileges

<br />

The root-level role privileges are applied to root object and Datacenter objects only.

| **vSphere Object**      | **Privileges**                  |
| ----------------------- | ------------------------------- |
| **Cns**                 | Searchable                      |
| **Datastore**           | Browse datastore                |
| **Host**                | Configuration                   |
|                         | Storage partition configuration |
| **vSphere** **Tagging** | Create vSphere Tag              |
|                         | Edit vSphere Tag                |
| **Network**             | Assign network                  |
| **Sessions**            | Validate session                |
| **VM Storage Policies** | View VM storage policies        |
| **Storage views**       | View                            |

<br />

#### Spectro Role Privileges

<Tabs queryString="vsphere-objects">

<TabItem label="Cns" value="Cns">

##### Cns Privileges

- Searchable

</TabItem>

<TabItem label="Datastore" value="Datastore">

##### Datastore Privileges

- Allocate Space
- Browse Datastore
- Low level file operations
- Remove file
- Update virtual machine files
- Update virtual machine metadata

</TabItem>

<TabItem label="Folder" value="Folder">

##### Folder Privileges

- Create folder
- Delete folder
- Move folder
- Rename folder

</TabItem>

<TabItem label="Host" value="Host">

#### Host Privileges

- Local Operations
  - Reconfigure virtual machine

</TabItem>

<TabItem label="Network" value="Network">

<br />

:::info

If the network is a Distributed Port Group under a vSphere Distributed Switch (VDS), ReadOnly access to the VDS without
“Propagate to children” needs to be provided.

:::

<br />

#### Network Privileges

- Assign Network

</TabItem>

<TabItem label="Resource" value="Resource">

#### Resource Privileges

- Apply recommendation
- Assign virtual machine to resource pool
- Migrate powered off virtual machine
- Migrate powered on virtual machine
- Query vMotion

</TabItem>

<TabItem label="Sessions" value="Sessions">

#### Sessions Privileges

- Validate session

</TabItem>

<TabItem label="Storage Policies" value="storage-policies">

#### VM Storage Policies Privileges

- View access for VM storage policies is required. Ensure the privilege `StorageProfile.View` is available. Refer to the
  [VM Storage Policies Privileges](https://docs.vmware.com/en/VMware-vSphere/8.0/vsphere-security/GUID-DECEAE60-58CB-4B30-8874-FA273573E6B5.html)
  resource to learn more.

</TabItem>

<TabItem label="Storage views" value="Storage views">

#### Storage Views Privileges

- View

</TabItem>

<TabItem label="Tasks" value="Tasks">

#### Task Privileges

- Create task
- Update task

</TabItem>

<TabItem label="vApp" value="vApp">

#### vApp Privileges

- Import
- View OVF environment
- vApp application configuration
- vApp instance configuration

</TabItem>

<TabItem label="vSphere Tagging" value="vSphere Tagging">

#### vSphere Tagging

- Create vSphere Tag
- Edit vSphere Tag

</TabItem>

<TabItem label="VMs" value="Virtual Machines">

#### Virtual Machines Privileges

<br />

|                           |                                             |                                       |
| ------------------------- | ------------------------------------------- | ------------------------------------- |
| **Change Configuration**  |                                             |                                       |
|                           | Change Settings                             | Extend virtual disk                   |
|                           | Change Swapfile Placement                   | Modify device settings                |
|                           | Configure host USB device                   | Query Fault Tolerance compatibility   |
|                           | Configure raw device                        | Query unowned files                   |
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

</TabItem>

<TabItem label="vSAN" value="vSAN">

#### vSAN

- Cluster
  - ShallowRekey

</TabItem>

</Tabs>

</TabItem>

<TabItem label="7.0.x" value="7.0.x" >

#### Root-Level Role Privileges

<br />

The root-level role privileges are applied to root object and Datacenter objects only.

| **vSphere Object**         | **Privileges**                     |
| -------------------------- | ---------------------------------- |
| **Cns**                    | Searchable                         |
| **Datastore**              | Browse datastore                   |
| **Host**                   | Configuration                      |
|                            | \* Storage partition configuration |
| **vSphere** **Tagging**    | Create vSphere Tag                 |
|                            | Edit vSphere Tag                   |
| **Network**                | Assign network                     |
| **Sessions**               | Validate session                   |
| **Profile-driven storage** | Profile-driven storage view        |
| **Storage views**          | View                               |

<br />

#### Spectro Role Privileges

<Tabs queryString="vsphere-object">

<TabItem label="Cns" value="Cns">

#### Cns Privileges

- Searchable

</TabItem>

<TabItem label="Datastore" value="Datastore">

#### Datastore Privileges

- Allocate Space
- Browse Datastore
- Low level file operations
- Remove file
- Update virtual machine files
- Update virtual machine metadata

</TabItem>

<TabItem label="Folder" value="Folder">

#### Folder Privileges

- Create folder
- Delete folder
- Move folder
- Rename folder

</TabItem>

<TabItem label="Host" value="Host">

#### Host Privileges

- Local Operations
  - Reconfigure virtual machine

</TabItem>

<TabItem label="Network" value="Network">

<br />

:::info

If the network is a Distributed Port Group under a vSphere Distributed Switch (VDS), ReadOnly access to the VDS without
“Propagate to children” needs to be provided.

:::

#### Network Privileges

- Assign Network

</TabItem>

<TabItem label="Resource" value="Resource">

#### Resource Privileges

- Apply recommendation
- Assign virtual machine to resource pool
- Migrate powered off virtual machine
- Migrate powered on virtual machine
- Query vMotion

</TabItem>

<TabItem label="Sessions" value="Sessions">

#### Sessions Privileges

- Validate session

</TabItem>

<TabItem label="Profile Driven Storage" value="Profile Driven Storager">

#### Profile Driven Storage

- Profile-driven storage view

</TabItem>

<TabItem label="Storage views" value="Storage views">

#### Storage Views Privileges

- View

</TabItem>

<TabItem label="Tasks" value="Tasks">

#### Task Privileges

- Create task
- Update task

</TabItem>

<TabItem label="vApp" value="vApp">

#### vApp Privileges

- Import
- View OVF environment
- vApp application configuration
- vApp instance configuration

</TabItem>

<TabItem label="vSphere Tagging" value="vSphere Tagging">

#### vSphere Tagging

- Create vSphere Tag
- Edit vSphere Tag

</TabItem>

<TabItem label="VMs" value="Virtual Machines">

#### Virtual Machines Privileges

<br />

|                           |                                             |                                       |
| ------------------------- | ------------------------------------------- | ------------------------------------- |
| **Change Configuration**  |                                             |                                       |
|                           | Change Settings                             | Extend virtual disk                   |
|                           | Change Swapfile Placement                   | Modify device settings                |
|                           | Configure host USB device                   | Query Fault Tolerance compatibility   |
|                           | Configure raw device                        | Query unowned files                   |
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

</TabItem>

<TabItem label="vSAN" value="vSAN">

#### vSAN

- Cluster
  - ShallowRekey

</TabItem>

</Tabs>

</TabItem>

<TabItem label="6.0.x" value="6.0.x" >

#### Root-Level Role Privileges

<br />

The root-level role privileges are applied to root object and Datacenter objects only.

| **vSphere Object**         | **Privileges**                  |
| -------------------------- | ------------------------------- |
| **Cns**                    | Searchable                      |
| **Datastore**              | Browse datastore                |
| **Host**                   | Configuration                   |
|                            | Storage partition configuration |
| **vSphere** **Tagging**    | Create vSphere Tag              |
|                            | Edit vSphere Tag                |
| **Network**                | Assign network                  |
| **Sessions**               | Validate session                |
| **Profile-driven storage** | Profile-driven storage view     |
| **Storage views**          | View                            |

<br />

#### Spectro Role Privileges

<Tabs queryString="vsphere-objects">

<TabItem label="Cns" value="Cns">

#### Cns Privileges

- Searchable

</TabItem>

<TabItem label="Datastore" value="Datastore">

#### Datastore Privileges

- Allocate Space
- Browse Datastore
- Low level file operations
- Remove file
- Update virtual machine files
- Update virtual machine metadata

</TabItem>

<TabItem label="Folder" value="Folder">

#### Folder Privileges

- Create folder
- Delete folder
- Move folder
- Rename folder

</TabItem>

<TabItem label="Host" value="Host">

#### Host Privileges

- Local Operations
  - Reconfigure virtual machine

</TabItem>

<TabItem label="Network" value="Network">

<br />

:::info

If the network is a Distributed Port Group under a vSphere Distributed Switch (VDS), ReadOnly access to the VDS without
“Propagate to children” needs to be provided.

:::

#### Network Privileges

- Assign Network

</TabItem>

<TabItem label="Resource" value="Resource">

#### Resource Privileges

- Apply recommendation
- Assign virtual machine to resource pool
- Migrate powered off virtual machine
- Migrate powered on virtual machine
- Query vMotion

</TabItem>

<TabItem label="Sessions" value="Sessions">

#### Sessions Privileges

- Validate session

</TabItem>

<TabItem label="Profile Driven Storage" value="Profile Driven Storager">

#### Profile Driven Storage

- Profile-driven storage view

</TabItem>

<TabItem label="Storage views" value="Storage views">

#### Storage Views Privileges

- View

</TabItem>

<TabItem label="Tasks" value="Tasks">

#### Task Privileges

- Create task
- Update task

</TabItem>

<TabItem label="vApp" value="vApp">

#### vApp Privileges

- Import
- View OVF environment
- vApp application configuration
- vApp instance configuration

</TabItem>

<TabItem label="vSphere Tagging" value="vSphere Tagging">

#### vSphere Tagging

- Create vSphere Tag
- Edit vSphere Tag

</TabItem>

<TabItem label="VMs" value="Virtual Machines">

#### Virtual Machines Privileges

<br />

|                           |                                             |                                       |
| ------------------------- | ------------------------------------------- | ------------------------------------- |
| **Change Configuration**  |                                             |                                       |
|                           | Change Settings                             | Extend virtual disk                   |
|                           | Change Swapfile Placement                   | Modify device settings                |
|                           | Configure host USB device                   | Query Fault Tolerance compatibility   |
|                           | Configure raw device                        | Query unowned files                   |
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

</TabItem>

<TabItem label="vSAN" value="vSAN">

#### vSAN

- Cluster
  - ShallowRekey

</TabItem>

</Tabs>

</TabItem>
</Tabs>

<br />

---

## Network Requirements

- Outgoing access from the platform VMs to the internet either directly or via a proxy.

- An IP Address (static or DHCP) for the quick start virtual machine (also used as an installer for enterprise version).

- A block of five (5) IP addresses reserved for an enterprise cluster: One IP address for each of the three enterprise
  cluster VMs, an IP to be used as a VIP, and an additional IP reserved for rolling upgrades.

- Interconnectivity across all the three (3) VMs on all ports.

- Connectivity from the Virtual Machines to the vCenter.

:::info Ensure your data center CIDR IP address does not overlap with the Kubernetes PodCIDR range. During installation,
you can change the Kubernetes PodCIDR range settings. :::

## Proxy Requirements

- If a proxy is used for outgoing connections, it must support both HTTPS and HTTP traffic. All Palette components
  communicate over HTTPS by default. An HTTP proxy can be used when HTTP is the only supported protocol, such as
  connecting to a private image registry that only supports HTTP.

- Connectivity to all [Proxy Whitelist](../architecture/palette-public-ips.md#palette-domains) domains must be allowed

## Hardware Requirements

The following section provides the hardware requirements for Palette Platform VMs for various capacity levels.

| **Capacity Levels**            | **Description**                                                            |
| ------------------------------ | -------------------------------------------------------------------------- |
| **Concurrent Tenant Clusters** | The number of concurrent tenant cluster provisioning or deletion requests. |
| **Total Managed Clusters**     | The number of parallel running tenant clusters.                            |

<br />

:::info The size of the Tenant Cluster, in terms of the number of nodes or size of the nodes, does not impact the
capacity guidance below. :::

## On-premise Configurations

| **Configuration Name** | **Concurrent <br /> Cluster <br /> Launch** | **Max Nodes** | **CPUs** | **Memory** | **Storage** | **MongoDB Limit**      | **Running Workload**                              |
| ---------------------- | ------------------------------------------- | ------------- | -------- | ---------- | ----------- | ---------------------- | ------------------------------------------------- |
| **Small**              | 4                                           | 1000          | 4        | 8 GB       | 80 GB       | 20 GB, 1 CPU, 2 GB Mem | Up to 1000 Nodes each with 30 Pods (30,000 pods)  |
| **Medium(Default)**    | 8                                           | 3000          | 8        | 16 GB      | 120 GB      | 60 GB, 2 CPU, 4 GB Mem | Up to 3000 Nodes each with 30 Pods (90,000 pods)  |
| **Large**              | 12                                          | 5000          | 12       | 32 GB      | 150 GB      | 80 GB, 2 CPU, 6 GB Mem | Up to 5000 Nodes each with 30 Pods (150,000 pods) |

<br />

| **Size**             | **Nodes** | **CPU** | **Memory** | **Storage** | **MongoDB Storage Limit** | **MongoDB Memory Limit** | **MongoDB CPU Limit** | **Total Deployed Nodes** | **Deployed Clusters with 10 Nodes** |
| -------------------- | --------- | ------- | ---------- | ----------- | ------------------------- | ------------------------ | --------------------- | ------------------------ | ----------------------------------- |
| Small                | 3         | 8       | 16 GB      | 60 GB       | 20 GB                     | 4 GB                     | 2                     | 1000                     | 100                                 |
| Medium (Recommended) | 3         | 16      | 32 GB      | 100 GB      | 60 GB                     | 8 GB                     | 4                     | 3000                     | 300                                 |
| Large                | 3         | 32      | 64 GB      | 120 GB      | 80 GB                     | 12 GB                    | 6                     | 5000                     | 500                                 |

#### Instance Sizing

| **Configuration**    | **Active Workload Limit**                         |
| -------------------- | ------------------------------------------------- |
| Small                | Up to 1000 Nodes each with 30 Pods (30,000 Pods)  |
| Medium (Recommended) | Up to 3000 Nodes each with 30 Pods (90,000 Pods)  |
| Large                | Up to 5000 Nodes each with 30 Pods (150,000 Pods) |

<br />

:::info

For high availability purposes, it is recommended that you deploy the three (3) VMs across three (3) compute clusters.

:::

## Best Practices

The following steps are optional but recommended for production environments.

|                              |                                                                                                                                                                                                                                                                                      |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **DNS Mapping**              | A DNS is used to access the Palette Management Console. While the Virtual IP Address (VIP), configured on the platform can be used <br /> to access the platform, it is recommended that you reserve a DNS for this purpose and map it to the VIP after installation.                |
| **SMTP Setting**s            | Configure the SMTP settings to enable the Palette platform to send out email notifications. Email notifications are sent out to new <br /> users, when they are initially onboarded onto the platform, so they can activate their accounts and reset their password at a later time. |
| **Trusted Certificate**      | Configure your platform with a trusted CA certificates.                                                                                                                                                                                                                              |
| **FTP Location for backups** | Configure an FTP location for platform backups and schedule daily backups.                                                                                                                                                                                                           |
