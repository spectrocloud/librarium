---
sidebar_label: "Required Permissions"
title: "Required Permissions"
description: "The permissions required to configure VMware to allow Palette to deploy clusters in VMware vSphere."
hide_table_of_contents: false
sidebar_position: 60
tags: ["data center", "vmware", "permissions"]
---

The VMware vSphere user account that deploys host clusters require access to the following vSphere objects and
permissions listed in the following table. Review the vSphere objects and privileges required to ensure each role is
assigned the required privileges.

### Spectro Root Role Privileges

The spectro root role privileges are only applied to root objects and data center objects. Select the tab for the
vSphere version you are using to view the required privileges for the spectro root role.

<Tabs  groupId="vsphere-version">

<TabItem label="8.0.x" value="8.0.x">

| **vSphere Object**      | **Privilege**                                      |
| ----------------------- | -------------------------------------------------- |
| **CNS**                 | Searchable                                         |
| **Datastore**           | Browse datastore                                   |
| **Host**                | Configuration<br />Storage partition configuration |
| **vSphere Tagging**     | Create and edit vSphere tags                       |
| **Network**             | Assign network                                     |
| **Sessions**            | Validate session                                   |
| **VM Storage Policies** | View VM storage policies                           |
| **Storage views**       | View                                               |

</TabItem>

<TabItem label="7.0.x" value="7.0.x">

| **vSphere Object**         | **Privileges**                                     |
| -------------------------- | -------------------------------------------------- |
| **CNS**                    | Searchable                                         |
| **Datastore**              | Browse datastore                                   |
| **Host**                   | Configuration<br />Storage partition configuration |
| **vSphere tagging**        | Create vSphere Tag<br />Edit vSphere Tag           |
| **Network**                | Assign network                                     |
| **Profile-driven storage** | View                                               |
| **Sessions**               | Validate session                                   |
| **Storage views**          | View                                               |

</TabItem>

<TabItem label="6.0.x" value="6.0.x">

| **vSphere Object**         | **Privileges**                                     |
| -------------------------- | -------------------------------------------------- |
| **CNS**                    | Searchable                                         |
| **Datastore**              | Browse datastore                                   |
| **Host**                   | Configuration<br />Storage partition configuration |
| **vSphere tagging**        | Create vSphere Tag<br />Edit vSphere Tag           |
| **Network**                | Assign network                                     |
| **Profile-driven storage** | Profile-driven storage view                        |
| **Sessions**               | Validate session                                   |
| **Storage views**          | View                                               |

</TabItem>

</Tabs>

:::warning

If the network is a Distributed Port Group under a vSphere Distributed Switch (VDS), _ReadOnly_ access to the VDS
without “Propagate to children” is required.

:::

### Spectro Role Privileges

As listed in the table, apply spectro role privileges to vSphere objects you intend to use for Palette installation. A
separate table lists Spectro role privileges for VMs by category.

Open Virtual Appliance (OVA) files are downloaded to the folder you selected. These images are cloned from the folder
and applied VMs that deployed during deployments.

Select the tab for the vSphere version you are using to view the required privileges for the spectro role.

<Tabs groupId="vsphere-version">

<TabItem label="8.0.x" value="8.0.x">

| **vSphere Object**    | **Privileges**                                                                                                                    |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **CNS**               | Searchable                                                                                                                        |
| **Datastore**         | Allocate space<br />Browse datastore<br />Low-level file operations<br />Remove file<br />Update VM files<br />Update VM metadata |
| **Folder**            | Create Folder<br />Delete folder<br />Move folder<br />Rename folder                                                              |
| **Host**              | Local operations: Reconfigure VM                                                                                                  |
| **Network**           | Assign network                                                                                                                    |
| **Resource**          | Apply recommendation<br />Assign VM to resource pool<br />Migrate powered off VM<br />Migrate powered on VM<br />Query vMotion    |
| **Sessions**          | Validate sessions                                                                                                                 |
| **Storage policies**  | View access for VM storage policies is required.<br />Ensure `StorageProfile.View` is available.                                  |
| **spectro-templates** | Read only. This is the vSphere folder created during the install. For airgap installs, you must manually create this folder.      |
| **Storage views**     | View                                                                                                                              |
| **Tasks**             | Create task<br />Update task                                                                                                      |
| **vApp**              | Import<br />View OVF environment<br />Configure vAPP application<br />Configure vApp instance                                     |
| **vSphere tagging**   | Assign or Unassign vSphere Tag<br />Create vSphere Tag<br />Delete vSphere Tag<br />Edit vSphere Tag                              |

The following table lists spectro role privileges for VMs by category. All privileges are for the vSphere object,
Virtual Machines.

| **Category**          | **Privileges**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Change Configuration  | Acquire disk lease<br />Add existing disk<br />Add new disk<br />Add or remove device<br />Advanced configuration<br />Change CPU count<br />Change memory<br />Change settings<br />Change swapfile placement<br />Change resource<br />Change host USB device<br />Configure raw device<br />Configure managedBy<br />Display connection settings<br />Extend virtual disk<br />Modify device settings<br />Query fault tolerance compatibity<br />Query unowned files<br />Reload from path<br />Remove disk<br />Rename<br />Reset guest information<br />Set annotation<br />Toggle disk change tracking<br />Toggle fork parent<br />Upgrade VM compatibility |
| Edit Inventory        | Create from existing<br />Create new<br />Move<br />Register<br />Remove<br />Unregister                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Guest Operations      | Alias modification<br />Alias query<br />Modify guest operations<br />Invoke programs<br />Queries                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Interaction           | Console Interaction<br />Power on/off                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Provisioning          | Allow disk access<br />Allow file access<br />Allow read-only disk access<br />Allow VM download<br />Allow VM files upload<br />Clone template<br />Clone VM<br />Create template from VM<br />Customize guest<br />Deploy template<br />Mark as template<br />Mark as VM<br />Modify customization specification<br />Promote disks<br />Read customization specifications                                                                                                                                                                                                                                                                                        |
| Service Configuration | Allow notifications<br />Allow polling of global event notifications<br />Manage service configurations<br />Modify service configurations<br />Query service configurations<br />Read service configurations                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Snapshot Management   | Create snapshot<br />Remove snapshot<br />Rename snapshot<br />Revert to snapshot                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Sphere Replication    | Configure replication<br />Manage replication<br />Monitor replication                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| vSAN                  | Cluster: ShallowRekey                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |

</TabItem>

<TabItem label="7.0.x" value="7.0.x">

| **vSphere Object**         | **Privileges**                                                                                                                    |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **CNS**                    | Searchable                                                                                                                        |
| **Datastore**              | Allocate space<br />Browse datastore<br />Low-level file operations<br />Remove file<br />Update VM files<br />Update VM metadata |
| **Folder**                 | Create Folder<br />Delete folder<br />Move folder<br />Rename folder                                                              |
| **Host**                   | Local operations: Reconfigure VM                                                                                                  |
| **Network**                | Assign network                                                                                                                    |
| **Resource**               | Apply recommendation<br />Assign VM to resource pool<br />Migrate powered off VM<br />Migrate powered on VM<br />Query vMotion    |
| **Profile-driven storage** | Profile-driven storage view                                                                                                       |
| **Sessions**               | Validate session                                                                                                                  |
| **spectro-templates**      | Read only. This is the vSphere folder created during the install. For airgap installs, you must manually create this folder.      |
| **Storage views**          | Configure service<br />View                                                                                                       |
| **Tasks**                  | Create task<br />Update task                                                                                                      |
| **vApp**                   | Import<br />View OVF environment<br />Configure vAPP applications<br />Configure vApp instances                                   |
| **vSphere tagging**        | Assign or unassign vSphere Tag<br />Create vSphere Tag<br />Delete vSphere Tag<br />Edit vSphere Tag                              |

The following table lists spectro role privileges for VMs by category. All privileges are for the vSphere object,
Virtual Machines.

| **Category**          | **Privileges**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Change Configuration  | Acquire disk lease<br />Add existing disk<br />Add new disk<br />Add or remove device<br />Advanced configuration<br />Change CPU count<br />Change memory<br />Change Settings<br />Change Swapfile placement<br />Change resource<br />Change host USB device<br />Configure Raw device<br />Configure managedBy<br />Display connection settings<br />Extend virtual disk<br />Modify device settings<br />Query fault tolerance compatibity<br />Query unowned files<br />Reload from path<br />Remove disk<br />Rename<br />Reset guest information<br />Set annotation<br />Toggle disk change tracking<br />Toggle fork parent<br />Upgrade VM compatibility |
| Edit Inventory        | Create from existing<br />Create new<br />Move<br />Register<br />Remove<br />Unregister                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Guest Operations      | Alias modification<br />Alias query<br />Modify guest operations<br />Invoke programs<br />Query guest operations                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Interaction           | Console Interaction<br />Power on/off                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Provisioning          | Allow disk access<br />Allow file access<br />Allow read-only disk access<br />Allow VM download<br />Allow VM upload<br />Clone template<br />Clone VM<br />Create template from VM<br />Customize guest<br />Deploy template<br />Mark as template<br />Modify customization specifications<br />Promote disks<br />Read customization specifications                                                                                                                                                                                                                                                                                                             |
| Service Configuration | Allow notifications<br />Allow polling of global event notifications<br />Manage service configurations<br />Modify service configurations<br />Query service configurations<br />Read service configurations                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Snapshot Management   | Create snapshot<br />Remove snapshot<br />Rename snapshot<br />Revert to snapshot                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| vSphere Replication   | Configure replication<br />Manage replication<br />Monitor replication                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| vSAN                  | Cluster<br />ShallowRekey                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |

</TabItem>

<TabItem label="6.0.x" value="6.0.x">

| **vSphere Object**         | **Privileges**                                                                                                                    |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **CNS**                    | Searchable                                                                                                                        |
| **Datastore**              | Allocate space<br />Browse datastore<br />Low-level file operations<br />Remove file<br />Update VM files<br />Update VM metadata |
| **Folder**                 | Create Folder<br />Delete folder<br />Move folder<br />Rename folder                                                              |
| **Host**                   | Local operations: Reconfigure VM                                                                                                  |
| **Network**                | Assign network                                                                                                                    |
| **Profile-driven storage** | Profile-driven storage view                                                                                                       |
| **Resource**               | Apply recommendation<br />Assign VM to resource pool<br />Migrate powered off VM<br />Migrate powered on VM<br />Query vMotion    |
| **Sessions**               | Validate session                                                                                                                  |
| **spectro-templates**      | Read only. This is the vSphere folder created during the install. For airgap installs, you must manually create this folder.      |
| **Storage views**          | View                                                                                                                              |
| **Tasks**                  | Create task<br />Update task                                                                                                      |
| **vApp**                   | Import<br />View OVF environment<br />Configure vAPP applications<br />Configure vApp instances                                   |
| **vSphere tagging**        | Assign or unassign vSphere Tag<br />Create vSphere Tag<br />Delete vSphere Tag<br />Edit vSphere Tag                              |

The following table lists spectro role privileges for VMs by category. All privileges are for the vSphere object,
Virtual Machines.

| **Category**          | **Privileges**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Change Configuration  | Acquire disk lease<br />Add existing disk<br />Add new disk<br />Add or remove device<br />Advanced configuration<br />Change CPU count<br />Change memory<br />Change Settings<br />Change Swapfile placement<br />Change resource<br />Change host USB device<br />Configure Raw device<br />Configure managedBy<br />Display connection settings<br />Extend virtual disk<br />Modify device settings<br />Query fault tolerance compatibity<br />Query unowned files<br />Reload from path<br />Remove disk<br />Rename<br />Reset guest information<br />Set annotation<br />Toggle disk change tracking<br />Toggle fork parent<br />Upgrade VM compatibility |
| Edit Inventory        | Create from existing<br />Create new<br />Move<br />Register<br />Remove<br />Unregister                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Guest Operations      | Alias modification<br />Alias query<br />Modify guest operations<br />Invoke programs<br />Query guest operations                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Interaction           | Console Interaction<br />Power on/off                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Provisioning          | Allow disk access<br />Allow file access<br />Allow read-only disk access<br />Allow VM download<br />Allow VM upload<br />Clone template<br />Clone VM<br />Create template from VM<br />Customize guest<br />Deploy template<br />Mark as template<br />Modify customization specifications<br />Promote disks<br />Read customization specifications                                                                                                                                                                                                                                                                                                             |
| Service Configuration | Allow notifications<br />Allow polling of global event notifications<br />Manage service configurations<br />Modify service configurations<br />Query service configurations<br />Read service configurations                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Snapshot Management   | Create snapshot<br />Remove snapshot<br />Rename snapshot<br />Revert to snapshot                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| vSphere Replication   | Configure replication<br />Manage replication<br />Monitor replication                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| vSAN                  | Cluster<br />ShallowRekey                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |

</TabItem>

</Tabs>
