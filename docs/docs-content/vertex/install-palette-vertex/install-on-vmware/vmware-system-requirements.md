---
sidebar_label: "VMware System and Permission Requirements"
title: "VMware System and Permission Requirements"
description: "Review VMware system requirements and cloud account permissions."
icon: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["vertex", "self-hosted", "vmware"]
keywords: ["self-hosted", "vertex"]
---

Before installing Palette VerteX on VMware, review the following system requirements and permissions. The vSphere user
account used to deploy VerteX must have the required permissions to access the proper roles and objects in vSphere.

Start by reviewing the required action items below:

1. Create the two custom vSphere roles. Check out the [Create Required Roles](#create-required-roles) section to create
   the required roles in vSphere.

2. Review the [vSphere Permissions](#vsphere-permissions) section to ensure the created roles have the required vSphere
   privileges and permissions.

3. Create node zones and regions for your Kubernetes clusters. Refer to the [Zone Tagging](#zone-tagging) section to
   ensure that the required tags are created in vSphere to ensure proper resource allocation across fault domains.

:::info

The permissions listed in this page are also needed for deploying a Private Cloud Gateway (PCG) and workload cluster in
vSphere through VerteX. :::

## Create Required Roles

VerteX requires two custom roles to be created in vSphere before the installation. Refer to the
[Create a Custom Role](https://docs.vmware.com/en/VMware-vSphere/8.0/vsphere-security/GUID-18071E9A-EED1-4968-8D51-E0B4F526FDA3.html?hWord=N4IghgNiBcIE4HsIFMDOIC+Q)
guide if you need help creating a custom role in vSphere. The required custom roles are:

- A root-level role with access to higher-level vSphere objects. This role is referred to as the _spectro root role_.
  Check out the [Root-Level Role Privileges](#root-level-role-privileges) table for the list of privileges required for
  the root-level role.

- A role with the required privileges for deploying VMs. This role is referred to as the _Spectro role_. Review the
  [Spectro Role Privileges](#spectro-role-privileges) table for the list of privileges required for the Spectro role.

The user account you use to deploy VerteX must have access to both roles. Each vSphere object required by VerteX must
have a
[Permission](https://docs.vmware.com/en/VMware-vSphere/6.5/com.vmware.vsphere.security.doc/GUID-4B47F690-72E7-4861-A299-9195B9C52E71.html)
entry for the respective Spectro role. The following tables list the privileges required for the each custom role.

:::info

For an in-depth explanation of vSphere authorization and permissions, check out the
[Understanding Authorization in vSphere](https://docs.vmware.com/en/VMware-vSphere/8.0/vsphere-security/GUID-74F53189-EF41-4AC1-A78E-D25621855800.html)
resource.

:::

## vSphere Permissions

The vSphere user account that deploys VerteX require access to the following vSphere objects and permissions listed in
the following table. Review the vSphere objects and privileges required to ensure each role is assigned the required
privileges.

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

During the installation, images and Open Virtual Appliance (OVA) files are downloaded to the folder you selected. These
images are cloned from the folder and applied VMs that deployed during the installation.

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

## Zone Tagging

You can use tags to create node zones and regions for your Kubernetes clusters. The node zones and regions can be used
to dynamically place Kubernetes workloads and achieve higher availability. Kubernetes nodes inherit the zone and region
tags as [Labels](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/). Kubernetes workloads can
use the node labels to ensure that the workloads are deployed to the correct zone and region.

The following is an example of node labels that are discovered and inherited from vSphere tags. The tag values are
applied to Kubernetes nodes in vSphere.

```yaml hideClipboard
topology.kubernetes.io/region=usdc topology.kubernetes.io/zone=zone3 failure-domain.beta.kubernetes.io/region=usdc
failure-domain.beta.kubernetes.io/zone=zone3
```

:::info

To learn more about node zones and regions, refer to the
[Node Zones/Regions Topology](https://cloud-provider-vsphere.sigs.k8s.io/cloud_provider_interface.html) section of the
Cloud Provider Interface documentation.

:::

Zone tagging is required to install VerteX and is helpful for Kubernetes workloads deployed in vSphere clusters through
VerteX if they have persistent storage needs. Use vSphere tags on data centers and compute clusters to create distinct
zones in your environment. You can use vSphere
[Tag Categories and Tags](https://docs.vmware.com/en/VMware-vSphere/8.0/vsphere-vcenter-esxi-management/GUID-16422FF7-235B-4A44-92E2-532F6AED0923.html)
to create zones in your vSphere environment and assign them to vSphere objects.

The zone tags you assign to your vSphere objects, such as a datacenter and clusters are applied to the Kubernetes nodes
you deploy through VerteX into your vSphere environment. Kubernetes clusters deployed to other infrastructure providers,
such as public cloud may have other native mechanisms for auto discovery of zones.

For example, assume a vCenter environment contains three compute clusters, cluster-1, cluster-2, and cluster-3. To
support this environment you create the tag categories `k8s-region` and `k8s-zone`. The `k8s-region` is assigned to the
datacenter, and the `k8s-zone` tag is assigned to the compute clusters.

The following table lists the tag values for the data center and compute clusters.

| **vSphere Object** | **Assigned Name** | **Tag Category** | **Tag Value** |
| ------------------ | ----------------- | ---------------- | ------------- |
| **Datacenter**     | dc-1              | k8s-region       | region1       |
| **Cluster**        | cluster-1         | k8s-zone         | az1           |
| **Cluster**        | cluster-2         | k8s-zone         | az2           |
| **Cluster**        | cluster-3         | k8s-zone         | az3           |

Create a tag category and tag values for each datacenter and cluster in your environment. Use the tag categories to
create zones. Use a name that is meaningful and that complies with the tag requirements listed in the following section.

### Tag Requirements

The following requirements apply to tags:

- A valid tag must consist of alphanumeric characters.

- The tag must start and end with an alphanumeric characters.

- The regex used for tag validation is `(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?`
