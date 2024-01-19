---
sidebar_label: "Deploy a PCG"
title: "Deploy a PCG"
description: "Learn how to deploy a Private Cloud Gateway (PCG) to support Palette or VerteX deployments."
hide_table_of_contents: false
tags: ["pcg"]
---

You can install a Private Cloud Gateway (PCG) on a Linux server to support Palette or VerteX deployments. Use the Palette CLI to install the PCG if you are targeting a VMware vSphere environment, MAAS, or OpenStack. All other environments, refer to the [Deploy PCG to a Kubernetes Cluster](./deploy-pcg-k8s.md).

This guide covers the installation for VMware vSphere, MAAS, and OpenStack. Each environment has a different set of requirements and installation steps. Select the environment that matches your deployment target.



## Prerequisites

<Tabs groupId="infra">
<TabItem label="VMware vSphere" value="vmware">

  The vSphere user account that deploys the PCG must have the minimum root-level vSphere privileges listed in the table below. The **Administrator** role provides superuser access to all vSphere objects. For users without the **Administrator** role, one or more custom roles can be created based on tasks the user will perform.
Permissions and privileges vary depending on the vSphere version you are using. 

Select the tab for your vSphere version.



:::warning

If the network is a Distributed Port Group under a vSphere Distributed Switch (VDS), ReadOnly access to the VDS without “Propagate to children” is required.

:::



<Tabs queryString="vm-privileges">

<TabItem label="8.0" value="8.0" >


## Root-Level Role Privileges

Root-level role privileges listed in the table are applied only to root objects and data center objects.



**vSphere Object**    |**Privileges**|
|---------------|----------|
|**Cns**|Searchable|
|**Datastore**|Browse datastore
|**Host**|Configuration
||* Storage partition configuration
|**vSphere** **Tagging**|Create vSphere Tag|
||Edit vSphere Tag|
|**Network**|Assign network|
|**Sessions**|Validate session|
|**VM Storage Policies**|View VM storage policies|
|**Storage views**|View|


## Spectro Role Privileges

The Spectro role privileges listed in the table must be applied to the spectro-template folder, hosts, clusters, virtual machines, templates, datastore, and network objects. 


:::info

Palette downloads images and Open Virtual Appliance (OVA) files to the spectro-templates folder and clones images from it to create nodes.

:::


|**vSphere Object**    |**Privileges**|
|---------------|----------|
|**spectro-templates** |Read only|  
|**Cns**|Searchable
|**Datastore**|Allocate space|
||Browse datastore|
||Low-level file operations|
||Remove file|
||Update virtual machine files|
||Update virtual machine metadata|
|**Folder**|Create folder|
||Delete folder|
||Move folder|
||Rename folder|
|**Host**|Local operations|
||Reconfigure virtual machine|
|**vSphere Tagging**|Assign or Unassign vSphere Tag|
||Create vSphere Tag|
||Delete vSphere Tag|
||Edit vSphere Tag|
|**Network**|Assign network|
|**Resource**|Apply recommendation|
||Assign virtual machine to resource pool|
||Migrate powered off virtual machine|
||Migrate powered on virtual machine|
||Query vMotion|
|**Sessions**|Validate session|
|**VM Storage Policies**|View VM storage policies|
|**Storage views**|Configure service|
||View|
|**Tasks**|Create task|
||Update task|
|**vApp**|Export|
||Import|
||View OVF environment|
||vApp application configuration|
||vApp instance configuration|
|**Virtual machines**|**Change Configuration**|
||* Acquire disk lease|
||* Add existing disk|
||* Add new disk|
||* Add or remove device|
||* Advanced configuration|
||* Change CPU count|
||* Change Memory|
||* Change Settings|
||* Change Swapfile placement|
||* Change resource|
||* Configure Host USB device|
||* Configure Raw device|
||* Configure managedBy|
||* Display connection settings|
||* Extend virtual disk|
||* Modify device settings|
||* Query Fault Tolerance compatibility|
||* Query unowned files|
||* Reload from path|
||* Remove disk|
||* Rename|
||* Reset guest information|
||* Set annotation|
||* Toggle disk change tracking|
||* Toggle fork parent|
||* Upgrade virtual machine compatibility|
||**Edit Inventory**|
||* Create from existing|
||* Create new|
||* Move|
||* Register|
||* Remove|
||* Unregister|
||**Guest operations**|
||* Guest operation alias modification|
||* Guest operation alias query|
||* Guest operation modifications|
||* Guest operation program execution|
||* Guest operation queries|
||**Interaction**|
||* Console interaction|
||* Power off|
||* Power on|
||**Provisioning**|
||* Allow disk access|
||* Allow file access|
||* Allow read-only disk access|
||* Allow virtual machine download|
||* Allow virtual machine files upload|
||* Clone template|
||* Clone virtual machine|
||* Create template from virtual machine|
||* Customize guest|
||* Deploy template|
||* Mark as template|
||* Mark as virtual machine|
||* Modify customization specification|
||* Promote disks|
||* Read customization specifications|
||**Service configuration**|
||* Allow notifications|
||* Allow polling of global event notifications|
||* Manage service configurations|
||* Modify service configuration|
||* Query service configurations|
||* Read service configuration|
||**Snapshot management**|
||* Create snapshot|
||* Remove snapshot|
||* Rename snapshot|
||* Revert to snapshot|
||**vSphere Replication**|
||* Configure replication|
||* Manage replication|
||* Monitor replication|
|**vSAN**|Cluster|
||ShallowRekey|



</TabItem>
<TabItem label="7.0" value="7.0" >


## Root-Level Role Privileges

Root-level role privileges listed in the table are applied only to root object and data center objects.

**vSphere Object**    |**Privileges**|
|---------------|----------|
|**Cns**|Searchable|
|**Datastore**|Browse datastore
|**Host**|Configuration
||* Storage partition configuration
|**vSphere** **Tagging**|Create vSphere Tag|
||Edit vSphere Tag|
|**Network**|Assign network|
|**Sessions**|Validate session|
|**Profile-driven storage**|Profile-driven storage view|
|**Storage views**|View|


## Spectro Role Privileges


The Spectro role privileges listed in the table must be applied to the spectro-template folder, hosts, clusters, virtual machines, templates, datastore, and network objects. 


:::info

Palette downloads images and Open Virtual Appliance (OVA) files to the spectro-templates folder and clones images from it to create nodes.

:::

|**vSphere Object**    |**Privileges**|
|---------------|----------|
|**spectro-templates** |Read only| 
|**Cns**|Searchable
|**Datastore**|Allocate space|
||Browse datastore|
||Low level file operations|
||Remove file|
||Update virtual machine files|
||Update virtual machine metadata|
|**Folder**|Create folder|
||Delete folder|
||Move folder|
||Rename folder|
|**Host**|Local operations|
||Reconfigure virtual machine|
|**vSphere Tagging**|Assign or Unassign vSphere Tag|
||Create vSphere Tag|
||Delete vSphere Tag|
||Edit vSphere Tag|
|**Network**|Assign network|
|**Resource**|Apply recommendation|
||Assign virtual machine to resource pool|
||Migrate powered off virtual machine|
||Migrate powered on virtual machine|
||Query vMotion|
|**Sessions**|Validate session|
|**Profile-driven storage**|Profile-driven storage view|
|**Storage views**|Configure service|
||View|
|**Tasks**|Create task|
||Update task|
|**vApp**|Export|
||Import|
||View OVF environment|
||vApp application configuration|
||vApp instance configuration|
|**Virtual machines**|**Change Configuration**|
||* Acquire disk lease|
||* Add existing disk|
||* Add new disk|
||* Add or remove device|
||* Advanced configuration|
||* Change CPU count|
||* Change Memory|
||* Change Settings|
||* Change Swapfile placement|
||* Change resource|
||* Configure Host USB device|
||* Configure Raw device|
||* Configure managedBy|
||* Display connection settings|
||* Extend virtual disk|
||* Modify device settings|
||* Query Fault Tolerance compatibility|
||* Query unowned files|
||* Reload from path|
||* Remove disk|
||* Rename|
||* Reset guest information|
||* Set annotation|
||* Toggle disk change tracking|
||* Toggle fork parent|
||* Upgrade virtual machine compatibility|
||**Edit Inventory**|
||* Create from existing|
||* Create new|
||* Move|
||* Register|
||* Remove|
||* Unregister|
||**Guest operations**|
||* Guest operation alias modification|
||* Guest operation alias query|
||* Guest operation modifications|
||* Guest operation program execution|
||* Guest operation queries|
||**Interaction**|
||* Console interaction|
||* Power off|
||* Power on|
||**Provisioning**|
||* Allow disk access|
||* Allow file access|
||* Allow read-only disk access|
||* Allow virtual machine download|
||* Allow virtual machine files upload|
||* Clone template|
||* Clone virtual machine|
||* Create template from virtual machine|
||* Customize guest|
||* Deploy template|
||* Mark as template|
||* Mark as virtual machine|
||* Modify customization specification|
||* Promote disks|
||* Read customization specifications|
||**Service configuration**|
||* Allow notifications|
||* Allow polling of global event notifications|
||* Manage service configurations|
||* Modify service configuration|
||* Query service configurations|
||* Read service configuration|
||**Snapshot management**|
||* Create snapshot|
||* Remove snapshot|
||* Rename snapshot|
||* Revert to snapshot|
||**vSphere Replication**|
||* Configure replication|
||* Manage replication|
||* Monitor replication|
|**vSAN**|Cluster|
||ShallowRekey|


</TabItem>
<TabItem label="6.7" value="6.7" >


## Root-Level Role Privileges


Root-level role privileges listed in the table are applied only to root object and data center objects.


**vSphere Object**    |**Privileges**|
|---------------|----------|
|**Cns**|Searchable|
|**Datastore**|Browse datastore
|**Host**|Configuration
||* Storage partition configuration
|**vSphere** **Tagging**|Create vSphere Tag|
||Edit vSphere Tag|
|**Network**|Assign network|
|**Sessions**|Validate session|
|**Profile-driven storage**|Profile-driven storage view|
|**Storage views**|View|


## Spectro Role Privileges

The Spectro role privileges listed in the table must be applied to the spectro-template folder, hosts, clusters, virtual machines, templates, datastore, and network objects. 

:::info

Palette downloads images and Open Virtual Appliance (OVA) files to the spectro-templates folder and clones images from it to create nodes.

:::

|**vSphere Object**    |**Privileges**|
|---------------|----------|
|**spectro-templates** |Read only| 
|**Cns**|Searchable
|**Datastore**|Allocate space|
||Browse datastore|
||Low level file operations|
||Remove file|
||Update virtual machine files|
||Update virtual machine metadata|
|**Folder**|Create folder|
||Delete folder|
||Move folder|
||Rename folder|
|**Host**|Local operations|
||Reconfigure virtual machine|
|**vSphere Tagging**|Assign or Unassign vSphere Tag|
||Create vSphere Tag|
||Delete vSphere Tag|
||Edit vSphere Tag|
|**Network**|Assign network|
|**Resource**|Apply recommendation|
||Assign virtual machine to resource pool|
||Migrate powered off virtual machine|
||Migrate powered on virtual machine|
||Query vMotion|
|**Sessions**|Validate session|
|**Profile-driven storage**|Profile-driven storage view|
|**Storage views**|Configure service|
||View|
|**Tasks**|Create task|
||Update task|
|**vApp**|Export|
||Import|
||View OVF environment|
||vApp application configuration|
||vApp instance configuration|
|**Virtual machines**|**Change Configuration**|
||* Acquire disk lease|
||* Add existing disk|
||* Add new disk|
||* Add or remove device|
||* Advanced configuration|
||* Change CPU count|
||* Change Memory|
||* Change Settings|
||* Change Swapfile placement|
||* Change resource|
||* Configure Host USB device|
||* Configure Raw device|
||* Configure managedBy|
||* Display connection settings|
||* Extend virtual disk|
||* Modify device settings|
||* Query Fault Tolerance compatibility|
||* Query unowned files|
||* Reload from path|
||* Remove disk|
||* Rename|
||* Reset guest information|
||* Set annotation|
||* Toggle disk change tracking|
||* Toggle fork parent|
||* Upgrade virtual machine compatibility|
||**Edit Inventory**|
||* Create from existing|
||* Create new|
||* Move|
||* Register|
||* Remove|
||* Unregister|
||**Guest operations**|
||* Guest operation alias modification|
||* Guest operation alias query|
||* Guest operation modifications|
||* Guest operation program execution|
||* Guest operation queries|
||**Interaction**|
||* Console interaction|
||* Power off|
||* Power on|
||**Provisioning**|
||* Allow disk access|
||* Allow file access|
||* Allow read-only disk access|
||* Allow virtual machine download|
||* Allow virtual machine files upload|
||* Clone template|
||* Clone virtual machine|
||* Create template from virtual machine|
||* Customize guest|
||* Deploy template|
||* Mark as template|
||* Mark as virtual machine|
||* Modify customization specification|
||* Promote disks|
||* Read customization specifications|
||**Service configuration**|
||* Allow notifications|
||* Allow polling of global event notifications|
||* Manage service configurations|
||* Modify service configuration|
||* Query service configurations|
||* Read service configuration|
||**Snapshot management**|
||* Create snapshot|
||* Remove snapshot|
||* Rename snapshot|
||* Revert to snapshot|
||**vSphere Replication**|
||* Configure replication|
||* Manage replication|
||* Monitor replication|
|**vSAN**|Cluster|
||ShallowRekey|


</TabItem>

</Tabs>


</TabItem>
<TabItem label="MAAS" value="maas">

  Stuff

</TabItem>
<TabItem label="OpenStack" value="openstack">

  Stuff

</TabItem>


</Tabs>


## Install the PCG

<Tabs groupId="infra">
<TabItem label="VMware vSphere" value="vmware">

  Stuff

</TabItem>
<TabItem label="MAAS" value="maas">

  Stuff

</TabItem>
<TabItem label="OpenStack" value="openstack">

  Stuff

</TabItem>


</Tabs>


## Validate

<Tabs groupId="infra">
<TabItem label="VMware vSphere" value="vmware">

  Stuff

</TabItem>
<TabItem label="MAAS" value="maas">

  Stuff

</TabItem>
<TabItem label="OpenStack" value="openstack">

  Stuff

</TabItem>


</Tabs>