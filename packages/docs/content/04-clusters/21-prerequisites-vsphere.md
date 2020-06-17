---
title: "vSphere Prerequisites"
metaTitle: "vSphere Prerequisites"
metaDescription: "Prerequisites to create clusters on VMware within Spectro Cloud"
icon: ""
---

# Prerequisites - vSphere

Spectro Cloud supports vSphere 6.5 or 6.7 [Update 3](https://www.vmware.com/products/vsphere.html)

# Hardware Requirements

[ESXi 6.5 Hardware Requirements](https://docs.vmware.com/en/VMware-vSphere/6.5/com.vmware.vsphere.upgrade.doc/GUID-DEB8086A-306B-4239-BF76-E354679202FC.html)

[ESXi 7.0 Hardware Requirements](https://docs.vmware.com/en/VMware-vSphere/7.0/com.vmware.esxi.upgrade.doc/GUID-DEB8086A-306B-4239-BF76-E354679202FC.html#:~:text=ESXi%207.0%20requires%20a%20minimum,be%20enabled%20on%20x64%20CPUs)

# Configuration Requirements

The vSphere environment should be configured with a **DHCP service** in the primary VM Network for your workload Kubernetes clusters. You will also need to configure one resource pool across the hosts onto which the workload clusters will be provisioned. Every host in the resource pool will need access to shared storage, such as VSAN in order to be able to make use of MachineDeployments and high-availability control planes.

# Permissions

The vSphere user account used in the various Spectro Cloud tasks must have the minimum vSphere privileges required to perform the task. The `Administrator` role provides super-user access to all vSphere objects. For users without the`‘Administrator` role, one or more custom roles can be created based on the tasks being performed by the user.

# User requirements to allow upload of OVA/OVF

* Datastore > Allocate space
* Network > Assign network
* Virtual machine > Configuration > Add new disk
* Virtual machine > Configuration > Advanced
* vApp > Import

# User requirements to allow Spectro orchestrator functionality

## Create Virtual Machine Permissions

A role can be added on the Datacenter:

* Virtual machine.Configuration.Add new disk (if creating a new virtual disk)
* Virtual machine.Configuration.Add existing disk (if using an existing virtual disk)
* Virtual machine.Configuration.Configure Raw device (if using an RDM or SCSI pass-through device)

On the destination Host, Compute Cluster, or Resource Pool:

* Resource.Assign virtual machine to resource pool

On the destination Datastore or the Datastore Folder:

* Datastore.Allocate space

On the Network that the Virtual Machine will be assigned to:

* Network.Assign network

# Power Management on Virtual Machines

A role can be added on the Datacenter in which the Virtual Machine is deployed:

* Virtual machine .Interaction .Power On

On the Virtual Machine or Virtual Machine Folder:

* Virtual machine .Interaction .Power On

# Deploy a Virtual Machine from Template

A role can be added on the destination VM Folder or Datacenter:

* Virtual machine .Inventory.Create from existing
* Virtual machine.Configuration.Add new disk

On the Template or Template Folder:

* Virtual machine .Provisioning.Deploy template

On the destination Host, Cluster or Resource Pool:

* Resource.Assign virtual machine to resource pool

On the destination Datastore or Datastore Folder:

* Datastore.Allocate space

On the Network that the Virtual Machine will be assigned to:

* Network.Assign network

___

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
| | * Add existing disk |
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

