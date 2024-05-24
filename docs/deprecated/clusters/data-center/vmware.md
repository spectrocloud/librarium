---
sidebar_label: "VMware"
title: "VMware"
description: "Learn how to configure VMware to create VMware clusters in Palette."
hide_table_of_contents: false
sidebar_position: 30
tags: ["data center", "vmware"]
---

The following are some architectural highlights of Kubernetes clusters provisioned by Palette on VMware:

- Kubernetes nodes can be distributed across multiple-compute clusters, which serve as distinct fault domains.

- Support for static IP as well as DHCP. If your are using DHCP, Dynamic DNS is required.

- IP pool management for assigning blocks of IPs dedicated to clusters or projects.

- A Private Cloud Gateway (PCG) that you set up within the environment facilitates communications between the Palette
  management platform and vCenter installed in the private data center.

  The PCG is Palette's on-prem component to enable support for isolated, private cloud, or data center environments.
  When the PCG is installed on-prem, it registers itself with Palette and enables secure communications with the private
  cloud environment.

  ![vmware_arch_oct_2020.webp](/vmware_arch_oct_2020.webp)

  Refer to the [PCG Architecture](../pcg/architecture.md) section to learn more about the PCG architecture.

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

Zone tagging is required to install Palette and is helpful for Kubernetes workloads deployed in vSphere clusters through
Palette if they have persistent storage needs. Use vSphere tags on data centers and compute clusters to create distinct
zones in your environment. You can use vSphere
[Tag Categories and Tags](https://docs.vmware.com/en/VMware-vSphere/8.0/vsphere-vcenter-esxi-management/GUID-16422FF7-235B-4A44-92E2-532F6AED0923.html)
to create zones in your vSphere environment and assign them to vSphere objects.

The zone tags you assign to your vSphere objects, such as a datacenter and clusters are applied to the Kubernetes nodes
you deploy through Palette into your vSphere environment. Kubernetes clusters deployed to other infrastructure
providers, such as public cloud may have other native mechanisms for auto discovery of zones.

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

## vSphere Permissions

The vSphere user account that deploys Palette require access to the following vSphere objects and permissions listed in
the following table. Review the vSphere objects and privileges required to ensure each role is assigned the required
privileges.

### Spectro Root Role Privileges

The Spectro root role privileges are only applied to root objects and data center objects. Select the tab for the
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

## Create a VMware Cloud Account

Use the following steps to create a VMware cloud account.

### Prerequisites

- A PCG is installed and available in the VMware environment. Refer to the
  [Deploy to VMware vSphere](../pcg/deploy-pcg/vmware.md) guide to learn how to deploy a PCG.

In addition to the default cloud account already associated with the private cloud gateway, new user cloud accounts can
be created for the different vSphere users.

| **Property**              | **Description**                      |
| ------------------------- | ------------------------------------ |
| **Account Name**          | Custom name for the cloud account    |
| **Private cloud gateway** | Reference to a running cloud gateway |
| **vCenter Server**        | IP or FQDN of the vCenter server     |
| **Username**              | vCenter username                     |
| **Password**              | vCenter password                     |

:::warning

If you change the password for a user account in vCenter, you must also change it in Palette for the same VMware cloud
account. We recommend updating the passwords immediately to avoid potentially locking Palette out of vCenter. For
guidance, refer to [Change VMware Cloud Account Password in Palette](#change-vmware-cloud-account-password).

:::

## Change VMware Cloud Account Password

The user account password in vCenter must match the password for the corresponding VMware cloud account in Palette. This
section provides steps to change the password in Palette in the event the vCenter password changes.

### Prerequisites

- Access to the vCenter credentials.

### Change the Password in Palette

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the **Menu Menu** navigate to **Tenant Settings** > **Cloud Accounts**.

3. Click the **three-dot Menu** for the VMware account you want to update, and select **Edit**.

4. In the window that opens, update the password in the **Password** field and click the **Validate** button.

5. Confirm your changes.

### Validation

Palette validates the password. Incorrect credentials will result in an error. As an extra precaution, try scaling a
cluster up or down.

:::info

In addition to changing the password for a VMware account, Palette provides a way for you to also change the user
associated with an account by entering a new username in the **Username** field. Ensure the new user account has the
same permissions as the previous user account in vCenter.

:::

## Deploy a VMware Cluster

<Video title="vmware-cluster-creation" src="/videos/clusters/data-center/cluster-creation-videos/vmware.mp4"></Video>

### Prerequisites

- A PCG is installed and available in the VMware environment. Refer to the
  [Deploy to VMware vSphere](../pcg/deploy-pcg/vmware.md) guide to learn how to deploy a PCG.

Use the following steps to provision a new VMware cluster.

### Deploy Cluster

1. Provide the basic cluster information like Name, Description, and Tags. Tags are currently not propagated to the
   Virtual Machines (VMs) deployed on the cloud/data center environments.

2. Select a Cluster Profile created for the VMware environment. The profile definition will be used as the cluster
   construction template.

3. Review and override Pack Parameters as desired. By default, parameters for all Packs are set with values defined in
   the Cluster Profile.

4. Provide a vSphere Cloud account and placement information.

   | **Parameter**              | **Description**                                                                                                                                                                                                                                                                                                     |
   | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Cloud Account**          | Select the desired cloud account. <br />VMware cloud accounts with credentials need to be preconfigured <br /> in the Project Settings section. An account is auto-created as <br /> part of the cloud gateway setup and is available for <br /> provisioning of Tenant Clusters if permitted by the administrator. |
   | **Datacenter**             | The vSphere data center where the cluster nodes will be launched.                                                                                                                                                                                                                                                   |
   | **Deployment Folder**      | The vSphere VM Folder where the cluster nodes will be launched.                                                                                                                                                                                                                                                     |
   | **Image Template Folder**  | The vSphere folder to which the Spectro templates are imported.                                                                                                                                                                                                                                                     |
   | **SSH Keys (Optional)**    | Public key to configure remote SSH access to the nodes (User: spectro).                                                                                                                                                                                                                                             |
   | **NTP Server (Optional)**  | Setup time synchronization for all the running nodes.                                                                                                                                                                                                                                                               |
   | **IP Allocation strategy** | DHCP or Static IP                                                                                                                                                                                                                                                                                                   |

5. Configure the control plane and worker node pools. Fill out the input fields in the **Add node pool** page. The
   following table contains an explanation of the available input parameters.

### Control Plane Pool

| **Parameter**                                        | **Description**                                                                                                                                                                                                     |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**                                             | A descriptive name for the node pool.                                                                                                                                                                               |
| **Size**                                             | Number of VMs to be provisioned for the node pool. For the control plane pool, this number can be 1, 3, or 5.                                                                                                       |
| **Allow worker capability**                          | Select this option for allowing workloads to be provisioned on control plane nodes.                                                                                                                                 |
| **[Labels](../cluster-management/taints.md#labels)** | Add a label to apply placement constraints on a pod, such as a node eligible for receiving the workload.                                                                                                            |
| **[Taints](../cluster-management/taints.md#taints)** | To set toleration to pods and allow (but do not require) the pods to schedule onto nodes with matching taints.                                                                                                      |
| **Instance type**                                    | Select the compute instance type to be used for all nodes in the node pool.                                                                                                                                         |
| **Availability Zones**                               | Choose one or more availability zones. Palette provides fault tolerance to guard against hardware failures, network failures, etc., by provisioning nodes across availability zones if multiple zones are selected. |
| **Disk Size**                                        | Give the required storage size                                                                                                                                                                                      |

### Worker Pool

| **Parameter**                                        | **Description**                                                                                                                                                                                                                             |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**                                             | A descriptive name for the node pool.                                                                                                                                                                                                       |
| **Enable Autoscaler**                                | You can enable the autoscaler by toggling the **Enable Autoscaler** button. Autoscaler scales resources up and down between the defined minimum and maximum number of nodes to optimize resource utilization.                               |
|                                                      | Set the scaling limit by setting the **Minimum Size** and **Maximum Size**, as per the workload the number of nods will scale up from minimum set value to maximum set value and the scale down from maximum set value to minimum set value |
| **Size**                                             | Number of VMs to be provisioned for the node pool.                                                                                                                                                                                          |
| **Rolling Update**                                   | Rolling update has two available options. The expand option launches a new node first, then shuts down old one. The contract option shuts down a old one first, then launches new one.details.                                              |
| **[Labels](../cluster-management/taints.md#labels)** | Add a label to apply placement constraints on a pod, such as a node eligible for receiving the workload.                                                                                                                                    |
| **[Taints](../cluster-management/taints.md#taints)** | To set toleration to pods and allow (but do not require) the pods to schedule onto nodes with matching taints.                                                                                                                              |
| **Instance type**                                    | Select the compute instance type to be used for all nodes in the node pool.                                                                                                                                                                 |
| **Availability Zones**                               | Choose one or more availability zones. Palette provides fault tolerance to guard against hardware failures, network failures, etc., by provisioning nodes across availability zones if multiple zones are selected.                         |
| **Disk Size**                                        | Provide the required storage size                                                                                                                                                                                                           |

6. Review settings and deploy the cluster. Provisioning status with details of ongoing provisioning tasks is available
   to track progress.

:::info

New worker pools may be added if it is desired to customize certain worker nodes to run specialized workloads. As an
example, the default worker pool may be configured with 4 CPUs, 8 GB of memory for general-purpose workloads, and
another worker pool with 8 CPUs, 16 GB of memory for advanced workloads that demand larger resources.

:::

## Delete a VMware Cluster

The deletion of a VMware cluster results in the removal of all Virtual machines and associated storage disks created for
the cluster. The following tasks need to be performed to delete a VMware cluster:

1. Select the cluster to be deleted from the **Cluster** **View** page and navigate to the **Cluster Overview** page.

2. Invoke the delete action available on the page: **Cluster** > **Settings** > **Cluster** **Settings** > **Delete**
   **Cluster**.

3. Click **Confirm** to delete.

The Cluster Status is updated to **Deleting** while the Cluster Resources are being deleted. Provisioning status is
updated with the ongoing progress of the delete operation. Once all resources are successfully deleted, the Cluster
Status changes to **Deleted** and is removed from the list of Clusters.

:::info

The Delete action is only available for Clusters that are fully provisioned. For Clusters that are still in the process
of being provisioned, <b> Abort </b> action is available to stop provisioning and delete all resources.

:::

## Force Delete a Cluster

A cluster stuck in the **Deletion** state can be force deleted by the user through the User Interface. The user can go
for a force deletion of the cluster, only if it is stuck in a deletion state for a minimum of **15 minutes**. Palette
enables cluster force delete from the Tenant Admin and Project Admin scope.

1. Log in to the Palette Management Console.

2. Navigate to the **Cluster Details** page of the cluster stuck in deletion mode.

   - If the deletion status is stuck for more than 15 minutes, click the **Force Delete Cluster** button from the
     **Settings** dropdown.

   - If the **Force Delete Cluster** button is not enabled, wait for 15 minutes. The **Settings** dropdown will give the
     estimated time for the auto-enabling of the **Force Delete** button.

:::warning

If there are any cloud resources still on the cloud, the user should cleanup those resources before going for the force
deletion.

:::
