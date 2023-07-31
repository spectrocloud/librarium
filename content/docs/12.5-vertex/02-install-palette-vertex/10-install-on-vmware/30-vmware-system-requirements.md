---
title: "VMware System Requirements"
metaTitle: "VMware System Requirements"
metaDescription: "Review VMware system requirements."
icon: ""
hideToC: false
fullWidth: false
---


import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';



# Overview

Palette VerteX is available as a self-hosted application that you install in your environment. The self-hosted version is a dedicated Palette VerteX environment hosted on VMware instances or in an existing Kubernetes cluster. Self-hosted Palette is available in the following modes:

| Self-Hosted Modes      | Description                    |
|------------------------|------------------------------------------|
| VMware Enterprise Mode | A multi-node, highly available version for production purposes. |
| Helm Chart Mode        | Install Palette in an existing Kubernetes cluster using a Helm Chart. |

The next sections describe specific requirements for both modes.

# Prerequisites

The following are prerequisites for deploying a Kubernetes cluster in VMware:

<br />

- vCenter version [6.7U3](https://docs.vmware.com/en/VMware-vSphere/6.7/rn/vsphere-esxi-67u3-release-notes.html) or above is recommended.


- Configuration Requirements - A Resource Pool needs to be configured across the hosts,
onto which the workload clusters will be provisioned. Every host in the Resource Pool will
need access to shared storage, such as vSAN, to use high-availability control planes.
Network Time Protocol (NTP) must be configured on each ESXi host.


- You need an active vCenter account with all the permissions listed below in the VMware
Cloud Account Permissions section.


- Install a Private Cloud (PCG) for VMware as described in the [Create a VMware Cloud Gateway](/clusters/data-center/vmware/#createvmwarecloudgateway.) Installing the PCG automatically registers a cloud account for VMware in Palette. You can register additional VMware cloud accounts in Palette as described in [Create a VMware Cloud Account](/clusters/data-center/vmware#createavmwarecloudaccount).


- Subnet with egress access to the internet (direct or via proxy):
  - For proxy: HTTP_PROXY, HTTPS_PROXY (both are required).
  - Outgoing internet connection on port 443 to api.spectrocloud.com.


- The Private cloud gateway IP requirements are:
  - One (1) node - one (1) IP or three (3) nodes - three (3) IPs.
  - One (1) Kubernetes control-plane VIP.
  - One (1) Kubernetes control-plane extra.

  <br />

- Assign IPs for application workload services such as Load Balancer services.


- A DNS to resolve public internet names. For example ``api.spectrocloud.com``.


- Shared Storage between vSphere hosts.


- A cluster profile created in Palette for VMware.


- Zone Tagging: A dynamic storage allocation for persistent storage.


# Zone Tagging

Zone tagging is required for dynamic storage allocation across fault domains when provisioning workloads that require persistent storage. This is required to install the Palette Platform itself and is also helpful for workloads deployed in the tenant clusters if they have persistent storage needs. Use vSphere tags on data centers(k8s-region) and compute clusters (k8s-zone) to create distinct zones in your environment.
  
For example, assume your vCenter environment includes three compute clusters, cluster-1, cluster-2, and cluster-3, that are part of vSphere Object, Tag Category, and Tag value as shown in the table.

| vSphere Object | Tag Category | Tag Value |
|---------------|--------------|-----------|
| dc-1          | k8s-region   | region1   |
| cluster-1     | k8s-zone     | az1       |
| cluster-2     | k8s-zone     | az2       |
| cluster-3     | k8s-zone     | az3       |



<InfoBox>

The exact values for the k8s-region and k8s-zone tags can be different from the ones described in the above example, if they are unique.

</InfoBox>

## Naming Conventions for vSphere Region and Zone Tags

The following requirements apply to tags:

<br />

- A valid tag must consist of alphanumeric characters.


- The tag must start and end with an alphanumeric characters.


- The regex used for validation is '(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?'



# Network Requirements

- Outgoing access from the platform VMs to the internet either directly or via a proxy.


- An IP Address (static or DHCP) for the virtual machine.


- A block of five (5) IP addresses reserved for an enterprise cluster: One IP address for each
of the three enterprise cluster VMs, an IP to be used as a VIP, and an additional IP reserved
for rolling upgrades.


- Interconnectivity across all three (3) VMs on all ports. Connectivity from the VMs to the vCenter.

<InfoBox>

Ensure your data center's CIDR IP address does not overlap the Kubernetes PodCIDR range. During installation, you can change the Kubernetes PodCIDR range settings.

</InfoBox>


# Proxy Requirements

- A proxy used for outgoing connections should support both HTTP and HTTPS traffic.


- Allow connectivity to domains and ports in the table.

| Top-Level Domain            | Port | Description                                     |
|----------------------------|------|-------------------------------------------------|
| spectrocloud.com            | 443  | Spectro Cloud content repository and pack registry |
| s3.amazonaws.com            | 443  | Spectro Cloud VMware OVA files                  |
| gcr.io                     | 443  | Spectro Cloud and common third party container images |
| docker.io                  | 443  | Common third party content                       |
| googleapis.com             | 443  | For pulling Spectro Cloud images                 |
| docker.com                 | 443  | Common third party container images              |
| raw.githubusercontent.com  | 443  | Common third party content                       |
| projectcalico.org          | 443  | Calico container images                          |
| quay.io                    | 443  | Common 3rd party container images                |
| grafana.com                | 443  | Grafana container images and manifests           |
| github.com                 | 443  | Common third party content                       |


# Hardware Requirements

This section lists hardware requirements for Palette Platform VMs for various capacity levels. Capacity levels are defined as follows:

<br />

- **Capacity Level**: The number of concurrent tenant clusters provisioning or deletion requests.


- **Total managed clusters**: The number of tenant clusters running in parallel.

The size of the Tenant Cluster, in terms of the number or size of the nodes, does not impact the capacity guidance in the tables below.

| Configuration Name | Concurrent Cluster<br />Launch Limit | Max Nodes | CPUs | Memory | Storage | MongoDB Limit      |
|--------------------|------------------------|-----------|------|--------|---------|--------------------|
| Small             | 4                       | 1000      | 4    | 8 GB    | 60 GB    | 20 GB, 1 CPU, 2 GB Memory   |
| Medium (default)  | 8                       | 3000      | 8    | 16 GB   | 120 GB   | 60 GB, 2 CPU, 4 GB Memory   |
| Large             | 12                      | 5000      | 12   | 32 GB   | 150 GB   | 80 GB, 2 CPU, 5 GB Memory   |


#### Instance Sizing

| Configuration       | Running Workload Limit                    |
|---------------------|------------------------------------------|
| Small               | Up to 1000 Nodes each with 30 Pods (30,000)       |
| Medium (default)    | Up to 3000 Nodes each with 30 Pods (90,000 pods)  |
| Large               | Up to 5000 Nodes each with 30 Pods (150,000)      |

#### Enterprise Configuration

| Size   | Concurrent<br />Tenant Clusters | Total<br />Managed Clusters | VMs | Memory | CPUs | Storage |
|--------|----------------------------|-----------------------|-----|--------|-----------|---------|
| Medium | 8                          | 500                   | 3   | 16 GB  | 8 Virtual CPUs | 120 GB  |


# VMware Cloud Account Permissions

The vSphere user account used in the various Palette tasks must have the minimum vSphere
privileges required to perform the task. The Administrator role provides super-user access to
all vSphere objects. For users without the Administrator role, based on the tasks being
performed by the user.

If the network is a Distributed Port Group under a vSphere Distributed Switch (VDS),
ReadOnly access to the VDS without “Propagate to children” must be provided.

## Privileges Under Root-Level Role

Root-level role privileges are applied to root object and Data center objects only.

| **vSphere Object** | **Privilege**                           |
|--------------------|-----------------------------------------|
| CNS                | Searchable                              |
| Datastore          | Browse datastore                        |
| Host               | Configuration<br /><br />Storage partition configuration |
| vSphere Tagging    | Create vSphere Tag<br /><br />Edit vSphere Tag |
| Network            | Assign network                          |
| Sessions           | Validate session                        |
| VM Storage Policies| View VM storage policies                |
| Storage views      | View                                    |


## Privileges Under the Spectro Cloud Role

Spectro Cloud role privileges are applied to vSphere objects listed in the tables. Role privileges are for VMs are listed in a separate by category.

<br />

<Tabs>

<Tabs.TabPane tab="8.0.x" key="8.0.x">

| **vSphere Object**| **Privileges**                              |
|-------------------|---------------------------------------------|
| CNS               | Searchable                                  |
| Datastore         | Allocate space<br />Browse datastore<br />Low-level file operations<br />Remove file<br />Update VM files<br />Update VM metadata         |
| Folder            | Create vSphere Tag<br />Delete folder<br />Move folder<br />Rename folder|
| Host              | Local operations<br />Reconfigure VM        |
| vSphere Tagging   | Assign or Unassign vSphere Tag<br />Create vSphere Tag<br />Delete vSphere Tag<br />Edit vSphere Tag                                         |
| Network           | Assign network                              |
| Resource          | Apply recommendation<br />Assign VM to resource pool<br />Migrate powered off VM<br />Migrate powered on VM<br />Query vMotion              |
| Sessions          | Validate sessions                           |
| spectro-templates | Read only                                   |
| Storage views     | Configure service<br />View                 |
| Tasks             | Create task<br />Update task                |
| vApp              | Export<br />Import<br />View OVF environment<br />Configure vAPP application<br />Configure vApp instance                          |


The following table lists Spectro Cloud role privileges for VMs by category.

| **vSphere Object**| **Category**         | **Privileges**     |
|-------------------|----------------------|--------------------|
| Virtual Machines  | Change Configuration | Acquire disk lease<br />Add existing disk<br />Add new disk<br />Add or remove device<br />Advanced configuration<br />Change CPU count<br />Change memory<br />Change settings<br />Change swapfile placement<br />Change resource<br />Change host USB device<br />Configure raw device<br />Configure managedBy<br />Display connection settings<br />Extend virtual disk<br />Modify device settings<br />Query fault tolerance compatibity<br />Query unowned files<br />Reload from path<br />Remove disk<br />Rename<br />Reset guest information<br />Set annotation<br />Toggle disk change tracking<br />Toggle fork parent<br />Upgrade VM compatibility|
|                   | Edit Inventory       | Create from existing<br />Create new<br />Move<br />Register<br />Remove<br />Unregister     |
|                   | Guest Operations     | Alias modification<br />Alias query<br />Modify guest operations<br />Invoke programs<br />Queries |
|                   | Interaction          | Console Interaction<br />Power on/off |
|                   | Provisioning         | Allow disk access<br />Allow file access<br />Allow read-only disk access<br />Allow VM download<br />Allow VM files upload<br />Clone template<br />Clone VM<br />Create template from VM<br />Customize guest<br />Deploy template<br />Mark as template<br />Modify customization specification<br />Promote disks<br />Read customization specifications |
|                   | Service Configuration| Allow notifications<br />Allow polling of global event notifications<br />Manage servcie configurations<br />Modify service configuration<br />Query service configurations<br />Read service configuration |
|                   | Snapshot Management  | Create snapshot<br />Remove snapshot<br />Rename snapshot<br />Revert snapshot |
|                   | vSphere Replication  | Configure replicaiton<br />Manage replication<br />Monitor replication |
|                    | vSAN  | Cluster<br />ShallowRedey |
 

</Tabs.TabPane>




<Tabs.TabPane tab="7.0.x" key="7.0.x">

| **vSphere Object**| **Privileges**                              |
|-------------------|---------------------------------------------|
| CNS               | Searchable                                  |
| Datastore         | Allocate space<br />Browse datastore<br />Low-level file operations<br />Remove file<br />Update VM files<br />Update VM metadata         |
| Folder            | Create vSphere Tag<br />Delete folder<br />Move folder<br />Rename folder|
| Host              | Local operations<br />Reconfigure VM        |
| vSphere Tagging   | Assign or Unassign vSphere Tag<br />Create vSphere Tag<br />Delete vSphere Tag<br />Edit vSphere Tag                                         |
| Network           | Assign network                              |
| Resource          | Apply recommendation<br />Assign VM to resource pool<br />Migrate powered off VM<br />Migrate powered on VM<br />Query vMotion              |
| Sessions          | Validate sessions                           |
| spectro-templates | Read only                                   |
| Storage views     | Configure service<br />View                 |
| Tasks             | Create task<br />Update task                |
| vApp              | Export<br />Import<br />View OVF environment<br />Configure vAPP application<br />Configure vApp instance                          |


The following table lists Spectro Cloud role privileges for VMs by category.

| **vSphere Object**| **Category**         | **Privileges**     |
|-------------------|----------------------|--------------------|
| Virtual Machines  | Change Configuration | Acquire disk lease<br />Add existing disk<br />Add new disk<br />Add or remove device<br />Advanced configuration<br />Change CPU count<br />Change memory<br />Change settings<br />Change swapfile placement<br />Change resource<br />Change host USB device<br />Configure raw device<br />Configure managedBy<br />Display connection settings<br />Extend virtual disk<br />Modify device settings<br />Query fault tolerance compatibity<br />Query unowned files<br />Reload from path<br />Remove disk<br />Rename<br />Reset guest information<br />Set annotation<br />Toggle disk change tracking<br />Toggle fork parent<br />Upgrade VM compatibility|
|                   | Edit Inventory       | Create from existing<br />Create new<br />Move<br />Register<br />Remove<br />Unregister     |
|                   | Guest Operations     | Alias modification<br />Alias query<br />Modify guest operations<br />Invoke programs<br />Queries |
|                   | Interaction          | Console Interaction<br />Power on/off |
|                   | Provisioning         | Allow disk access<br />Allow file access<br />Allow read-only disk access<br />Allow VM download<br />Allow VM files upload<br />Clone template<br />Clone VM<br />Create template from VM<br />Customize guest<br />Deploy template<br />Mark as template<br />Modify customization specification<br />Promote disks<br />Read customization specifications |
|                   | Service Configuration| Allow notifications<br />Allow polling of global event notifications<br />Manage servcie configurations<br />Modify service configuration<br />Query service configurations<br />Read service configuration |
|                   | Snapshot Management  | Create snapshot<br />Remove snapshot<br />Rename snapshot<br />Revert snapshot |
|                   | vSphere Replication  | Configure replicaiton<br />Manage replication<br />Monitor replication |
|                    | vSAN  | Cluster<br />ShallowRedey |

</Tabs.TabPane>















<Tabs.TabPane tab="6.0.x" key="6.0.x">

Text

</Tabs.TabPane>


</Tabs>
