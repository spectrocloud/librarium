---
sidebar_label: "VMware System and Permission Requirements"
title: "VMware System and Permission Requirements"
description: "Review VMware system requirements and cloud account permissions."
icon: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["palette", "self-hosted", "vmware"]
---




The sections below describe system requirements and cloud account permissions for VMware vSphere environments hosting Palette.



## VMware Cloud Account Permissions

The vSphere user account that deploys Palette must have the minimum root-level VMware vSphere privileges listed in the table below. The **Administrator** role provides superuser access to all vSphere objects. For users without the **Administrator** role, one or more custom roles can be created based on tasks the user will perform. Permissions and privileges vary depending on the vSphere version you are using.

Select the tab for your vSphere version.

<br />

:::caution

If the network is a Distributed Port Group under a vSphere Distributed Switch (VDS), ReadOnly access to the VDS without “Propagate to children” is required.

:::

<br />

<Tabs>

<TabItem label="8.0.x" value="8.0.x">

## Root-Level Role Privileges

Root-level role privileges are only applied to root objects and data center objects.

| **vSphere Object** | **Privilege**                           |
|--------------------|-----------------------------------------|
| CNS                | Searchable                              |
| Datastore          | Browse datastore                        |
| Host               | Configuration<br />Storage partition configuration |
| vSphere Tagging    | Create vSphere Tag<br />Edit vSphere Tag |
| Network            | Assign network                          |
| Sessions           | Validate session                        |
| VM Storage Policies| View VM storage policies                |
| Storage views      | View                                    |


## Spectro Role Privileges

Spectro role privileges listed in the table must be applied to the spectro-template folder, hosts, clusters, templates, datastore, network objects, and Virtual Machines (VMs). A separate table lists Spectro role privileges for VMs by category.

<br />

:::info

Palette downloads images and Open Virtual Appliance (OVA) files to the spectro-templates folder and clones images from it to create nodes. 

:::


| **vSphere Object**| **Privileges**                              |
|-------------------|---------------------------------------------|
| CNS               | Searchable                                  |
| Datastore         | Allocate space<br />Browse datastore<br />Low-level file operations<br />Remove file<br />Update VM files<br />Update VM metadata |
| Folder            | Create Folder<br />Delete folder<br />Move folder<br />Rename folder|
| Host              | Local operations: Reconfigure VM        |
| Network           | Assign network                              |
| Resource          | Apply recommendation<br />Assign VM to resource pool<br />Migrate powered off VM<br />Migrate powered on VM<br />Query vMotion |
| Sessions          | Validate sessions                           |
| Storage policies  | View access for VM storage policies is required.<br />Ensure ``StorageProfile.View`` is available. |
| spectro-templates | Read only                                   |
| Storage views     | View                 |
| Tasks             | Create task<br />Update task                |
| vApp              | Import<br />View OVF environment<br />Configure vAPP application<br />Configure vApp instance |
| vSphere tagging   | Assign or Unassign vSphere Tag<br />Create vSphere Tag<br />Delete vSphere Tag<br />Edit vSphere Tag |


The following table lists Spectro Cloud role privileges for VMs by category.

| **vSphere Object**| **Category**         | **Privileges**     |
|-------------------|----------------------|--------------------|
| Virtual Machines  | Change Configuration | Acquire disk lease<br />Add existing disk<br />Add new disk<br />Add or remove device<br />Advanced configuration<br />Change CPU count<br />Change memory<br />Change settings<br />Change swapfile placement<br />Change resource<br />Change host USB device<br />Configure raw device<br />Configure managedBy<br />Display connection settings<br />Extend virtual disk<br />Modify device settings<br />Query fault tolerance compatibity<br />Query unowned files<br />Reload from path<br />Remove disk<br />Rename<br />Reset guest information<br />Set annotation<br />Toggle disk change tracking<br />Toggle fork parent<br />Upgrade VM compatibility|
|                   | Edit Inventory       | Create from existing<br />Create new<br />Move<br />Register<br />Remove<br />Unregister     |
|                   | Guest Operations     | Alias modification<br />Alias query<br />Modify guest operations<br />Invoke programs<br />Queries |
|                   | Interaction          | Console Interaction<br />Power on/off |
|                   | Provisioning         | Allow disk access<br />Allow file access<br />Allow read-only disk access<br />Allow VM download<br />Allow VM files upload<br />Clone template<br />Clone VM<br />Create template from VM<br />Customize guest<br />Deploy template<br />Mark as template<br />Mark as VM<br />Modify customization specification<br />Promote disks<br />Read customization specifications |
|                   | Service Configuration| Allow notifications<br />Allow polling of global event notifications<br />Manage service configurations<br />Modify service configurations<br />Query service configurations<br />Read service configurations |
|                   | Snapshot Management  | Create snapshot<br />Remove snapshot<br />Rename snapshot<br />Revert to snapshot |
|                   | vSphere Replication  | Configure replication<br />Manage replication<br />Monitor replication |
|                   | vSAN  | Cluster: ShallowRekey |
 
</TabItem>




<TabItem label="7.0.x" value="7.0.x">

## Root-Level Role Privileges

Root-level role privileges are only applied to root objects and Data center objects.

| **vSphere Object**| **Privileges**                              |
|-------------------|---------------------------------------------|
| CNS               | Searchable                                  |
| Datastore         | Browse datastore                            |
| Host              | Configuration<br />Storage partition configuration|
| vSphere tagging   | Create vSphere Tag<br />Edit vSphere Tag    |
| Network           | Assign network                              |
| Profile-driven storage | View                                   |        
| Sessions          | Validate session                            |
| Storage views     | View                                        |


## Spectro Role Privileges

Spectro role privileges listed in the table must be applied to the spectro-template folder, hosts, clusters, templates, datastore, network objects, and Virtual Machines (VMs). A separate table lists Spectro role privileges for VMs by category.

<br />

:::info

Palette downloads images and Open Virtual Appliance (OVA) files to the spectro-templates folder and clones images from it to create nodes.

:::

<br />

| **vSphere Object**| **Privileges**                              |
|-------------------|---------------------------------------------|
| CNS               | Searchable                                  |
| Datastore         | Allocate space<br />Browse datastore<br />Low-level file operations<br />Remove file<br />Update VM files<br />Update VM metadata |
| Folder            | Create Folder<br />Delete folder<br />Move folder<br />Rename folder|
| Host              | Local operations: Reconfigure VM        |
| Network           | Assign network                              |
| Resource          | Apply recommendation<br />Assign VM to resource pool<br />Migrate powered off VM<br />Migrate powered on VM<br />Query vMotion |
| Profile-driven storage | Profile-driven storage view            |
| Sessions          | Validate session                            |
| spectro-templates | Read only                                   |
| Storage views     | Configure service<br />View                 |
| Tasks             | Create task<br />Update task                |
| vApp              | Import<br />View OVF environment<br />Configure vAPP applications<br />Configure vApp instances |
| vSphere tagging   | Assign or Unassign vSphere Tag<br />Create vSphere Tag<br />Delete vSphere Tag<br />Edit vSphere Tag |

<br />

The following table lists Spectro role privileges for VMs by category.

| **vSphere Object**| **Category**         | **Privileges**     |
|-------------------|----------------------|--------------------|
| Virtual Machines  | Change Configuration | Acquire disk lease<br />Add existing disk<br />Add new disk<br />Add or remove device<br />Advanced configuration<br />Change CPU count<br />Change memory<br />Change Settings<br />Change Swapfile placement<br />Change resource<br />Change host USB device<br />Configure Raw device<br />Configure managedBy<br />Display connection settings<br />Extend virtual disk<br />Modify device settings<br />Query fault tolerance compatibity<br />Query unowned files<br />Reload from path<br />Remove disk<br />Rename<br />Reset guest information<br />Set annotation<br />Toggle disk change tracking<br />Toggle fork parent<br />Upgrade VM compatibility|
|                   | Edit Inventory       | Create from existing<br />Create new<br />Move<br />Register<br />Remove<br />Unregister     |
|                   | Guest Operations     | Alias modification<br />Alias query<br />Modify guest operations<br />Invoke programs<br />Query guest operations |
|                   | Interaction          | Console Interaction<br />Power on/off |
|                   | Provisioning         | Allow disk access<br />Allow file access<br />Allow read-only disk access<br />Allow VM download<br />Allow VM upload<br />Clone template<br />Clone VM<br />Create template from VM<br />Customize guest<br />Deploy template<br />Mark as template<br />Modify customization specifications<br />Promote disks<br />Read customization specifications |
|                   | Service Configuration| Allow notifications<br />Allow polling of global event notifications<br />Manage service configurations<br />Modify service configurations<br />Query service configurations<br />Read service configurations |
|                   | Snapshot Management  | Create snapshot<br />Remove snapshot<br />Rename snapshot<br />Revert to snapshot |
|                   | vSphere Replication  | Configure replication<br />Manage replication<br />Monitor replication |
|                    | vSAN  | Cluster<br />ShallowRekey |


</TabItem>



<TabItem label="6.0.x" value="6.0.x">

## Root-Level Role Privileges

Root-level role privileges are only applied to root objects and Data center objects.

| **vSphere Object**| **Privileges**                              |
|-------------------|---------------------------------------------|
| CNS               | Searchable                                  |
| Datastore         | Browse datastore                            |
| Host              | Configuration<br />Storage partition configuration|
| vSphere tagging   | Create vSphere Tag<br />Edit vSphere Tag    |
| Network           | Assign network                              | 
| Profile-driven storage | Profile-driven storage view            |       
| Sessions          | Validate session                            |
| Storage views     | View                                        |


## Spectro Role Privileges

Spectro role privileges listed in the table must be applied to the spectro-template folder, hosts, clusters, templates, datastore, network objects, and Virtual Machines (VMs). A separate table lists Spectro role privileges for VMs by category.

<br />

:::info

Palette downloads images and Open Virtual Appliance (OVA) files to the spectro-templates folder and clones images from it to create nodes.

:::


| **vSphere Object**| **Privileges**                              |
|-------------------|---------------------------------------------|
| CNS               | Searchable                                  |
| Datastore         | Allocate space<br />Browse datastore<br />Low-level file operations<br />Remove file<br />Update VM files<br />Update VM metadata |
| Folder            | Create Folder<br />Delete folder<br />Move folder<br />Rename folder|
| Host              | Local operations: Reconfigure VM            |
| Network           | Assign network                              |
| Profile-driven storage | Profile-driven storage view            |
| Resource          | Apply recommendation<br />Assign VM to resource pool<br />Migrate powered off VM<br />Migrate powered on VM<br />Query vMotion |
| Sessions          | Validate session                            |
| spectro-templates | Read only                                   |
| Storage views     | View                                        |
| Tasks             | Create task<br />Update task                |
| vApp              | Import<br />View OVF environment<br />Configure vAPP applications<br />Configure vApp instances |
| vSphere tagging   | Assign or Unassign vSphere Tag<br />Create vSphere Tag<br />Delete vSphere Tag<br />Edit vSphere Tag |

<br />

The following table lists Spectro role privileges for VMs by category.

| **vSphere Object**| **Category**         | **Privileges**     |
|-------------------|----------------------|--------------------|
| Virtual Machines  | Change Configuration | Acquire disk lease<br />Add existing disk<br />Add new disk<br />Add or remove device<br />Advanced configuration<br />Change CPU count<br />Change memory<br />Change Settings<br />Change Swapfile placement<br />Change resource<br />Change host USB device<br />Configure Raw device<br />Configure managedBy<br />Display connection settings<br />Extend virtual disk<br />Modify device settings<br />Query fault tolerance compatibity<br />Query unowned files<br />Reload from path<br />Remove disk<br />Rename<br />Reset guest information<br />Set annotation<br />Toggle disk change tracking<br />Toggle fork parent<br />Upgrade VM compatibility|
|                   | Edit Inventory       | Create from existing<br />Create new<br />Move<br />Register<br />Remove<br />Unregister     |
|                   | Guest Operations     | Alias modification<br />Alias query<br />Modify guest operations<br />Invoke programs<br />Query guest operations |
|                   | Interaction          | Console Interaction<br />Power on/off |
|                   | Provisioning         | Allow disk access<br />Allow file access<br />Allow read-only disk access<br />Allow VM download<br />Allow VM upload<br />Clone template<br />Clone VM<br />Create template from VM<br />Customize guest<br />Deploy template<br />Mark as template<br />Modify customization specifications<br />Promote disks<br />Read customization specifications |
|                   | Service Configuration| Allow notifications<br />Allow polling of global event notifications<br />Manage service configurations<br />Modify service configurations<br />Query service configurations<br />Read service configurations |
|                   | Snapshot Management  | Create snapshot<br />Remove snapshot<br />Rename snapshot<br />Revert to snapshot |
|                   | vSphere Replication  | Configure replication<br />Manage replication<br />Monitor replication |
|                    | vSAN  | Cluster<br />ShallowRekey |

</TabItem>


</Tabs>



## Zone Tagging

Zone tagging is required for dynamic storage allocation across fault domains when provisioning workloads that require persistent storage. This is required to install the Palette Platform itself and is also helpful for workloads deployed in the tenant clusters if they have persistent storage needs. Use vSphere tags on data centers(k8s-region) and compute clusters (k8s-zone) to create distinct zones in your environment.
  
For example, assume your vCenter environment includes three compute clusters, cluster-1, cluster-2, and cluster-3, that are part of vSphere Object, Tag Category, and Tag value as shown in the table.

| **vSphere Object** | **Tag Category** | **Tag Value** |
|--------------------|------------------|---------------|
| dc-1               | k8s-region       | region1       |
| cluster-1          | k8s-zone         | az1           |
| cluster-2          | k8s-zone         | az2           |
| cluster-3          | k8s-zone         | az3           |



:::info

The exact values for the k8s-region and k8s-zone tags can be different from the ones described in the above example, if they are unique.

:::

## Naming Conventions for vSphere Region and Zone Tags

The following requirements apply to tags:

<br />

- A valid tag must consist of alphanumeric characters.


- The tag must start and end with an alphanumeric characters.


- The regex used for validation is ``(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?``