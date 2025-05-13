---
sidebar_position: 10
sidebar_label: "Deploy and Manage VMs with VMO and Terraform"
title: "Deploy and Manage VMs with VMO and Terraform"
description:
  "Learn how to create and manage Virtual Machines using Palette VMO on host clusters deployed to Canonical MAAS."
tags: ["VMO", "tutorial", "maas"]
category: ["tutorial"]
---

# Introduction to Palette Virtual Machine Orchestrator

In this tutorial you will deploy a VM using Palette Virtual Machine Orchestrator (VMO). You will learn about the
components that make up VMO, how to create and customize them for a Canonical MAAS VMO cluster deployment, and how to
customize and deploy a VM.

We recommend reviewing the [VMO architecture](/vm-management/architecture.md) page before starting this tutorial. The
architecture page describes what VMO is, a high level view of the components it uses, and provides links to more
detailed information.

## Prerequisites

- A Palette account with tenant admin access.

- MAAS datacenter environment.

- Two MAAS machines with a minimum spec of

  - 8 CPU
  - 32 GB RAM
  - 250 GB Storage (Worker node must have 2 disks)

- Two routable, static IP addresses from your MAAS environment's network.

- A MAAS user with necessary permissions.

  - _ADD PERMISSIONS HERE_

- An existing [MAAS Private Cloud Gateway (PCG)](/clusters/pcg/deploy-pcg/maas.md)

- Basic knowledge of containers

- [kubectl](https://kubernetes.io/docs/tasks/tools/) installed locally

- [virtctl](https://kubevirt.io/user-guide/user_workloads/virtctl_client_tool/) installed locally

  <br />

## Clone GitHub Repository

This tutorial has pre-built Terraform scripts that you will use to create your VMO MAAS cluster and deploy a VM to it.

Clone the Spectro Cloud Terraform tutorial repository.

`git clone https://github.com/spectrocloud/tutorials`

The directory containing the files you will use in this tutorial is _/terraform/vmo-cluster_.

## Deploy a VMO Cluster to MAAS

In this section, you will modify and execute Terraform scripts to deploy a new VMO Cluster to your MAAS environment.

### Update terraform.tfvars

This file allows you to set values to be used for your variables in one place. We recommend using the _terraform.tfvars_
file whenever possible as it helps reduce human error and makes updating and reusing your Terraform scripts more
efficient.

:::info

We recommend that you read the **Palette Specific Terraform Files** section at the end of this tutorial. It will provide additional detail about the Palette specific files in this tutorial, what they do, and how you might modify them for your own deployments.

:::

The provided _terraform.tfvars_ file is broken into sections to help you understand which files the variables are related to. 

Make the changes to your _terraform.tfvars_ as instructed in the table.

```yaml
# Copyright (c) Spectro Cloud
# SPDX-License-Identifier: Apache-2.0

#####################
# Palette Settings
#####################
palette-project = "Default"                                 # The name of your project in Palette.

############################
# MAAS Deployment Settings
############################

deploy-maas    = true                                       # Set to true to deploy to a new VMO cluster to MAAS.
deploy-maas-vm = false                                      # Set to true to create a VM on MAAS VMO cluster once deployed.

pcg-name    = "maas-pcg"                                    # Provide the name of the PCG that will be used to deploy the Palette cluster.
maas-domain = "maas.sc"                                     # Provide the MAAS domain that will be used to deploy the Palette cluster.

maas-worker-nodes         = 1                               # Provide the number of worker nodes that will be used for the Palette cluster.
maas-worker-resource-pool = "bm-generic"                    # Provide a resource pool for the worker nodes.
maas-worker-azs           = ["default"]                     # Provide a set of availability zones for the worker nodes.
maas-worker-node-tags     = ["docs"]                        # Provide a set of node tags for the worker nodes.

maas-control-plane-nodes         = 1                        # Provide the number of control plane nodes that will be used for the Palette cluster.
maas-control-plane-resource-pool = "Palette-Sustaining"     # Provide a resource pool for the control plane nodes.
maas-control-plane-azs           = ["az1"]                  # Provide a set of availability zones for the control plane nodes.
maas-control-plane-node-tags     = ["docs-cp"]              # Provide a set of node tags for the control plane nodes.


# #####################
# # cluster_profiles.tf
# #####################
# vmo_cluster_name        = "vmo-cluster-maas"
# clusterProfileType      =   "Full"                          # Infrastructure, Full, or Add-on
# clusterProfileVersion   =   1.0.0                           # Version number for the cluster profile in Palette


# ##############
# # clusters.tf
# ##############
# ctl-node-min-cpu          = "6"                             # Minimum number of CPU cores required for control plane nodes
# ctl-node-min-memory-mb    = "16384"                         # Minimum amount of RAM (memory) required for control plane nodes
# wrk_-ode-min-cpu          = "8"                             # Minimum number of CPU cores required for worker nodes
# wrk-node-min-memory-mb    = "16384"                         # Minimum amount of RAM (memory) required for worker nodes


# ###########################
# # manifests/k8s-values.yaml
# ###########################
# pod-CIDR                =   "100.64.0.0/16"                                      # Set the subnet that your pods will run on
# serviceClusterIpRange   =   "10.10.189.128/28"


# ###############################
# # manifests/metallb-values.yaml
# ###############################
# metallb-ip-pool         =   1.1.1.1-2.2.2.2                 # IP addresses to be assigned for use by MetalLB


# #####################
# # virtual_machines.tf
# #####################
# vm-deploy-namespace       = "default"                       # Namespace where your VM will be deployed.
# vm-deploy-name            = "vmo-vm"                        # The name of your VM
# vm-labels                 = "my-vmo-vm"                     # Labels that will be applied to your VM. For this tutorial, use a single label.
# vm-storage-Gi             = "50Gi"                          # Size of the disk (PVC) that your VM will have.
# vm-cpu-cores              = 2                               # Number of CPU cores your VM will have.
# vm-cpu-sockets            = 1                               # Number of physical CPU sockets the CPU cores should be spread over.
# vm-cpu-threads            = 2                               # Number of CPU threads to use for the VM CPU
# vm-memory-Gi              = "4Gi"                           # Amount of RAM (memory) your VM will have

```

**Palette Values**

| **Variable**        | **Data Type** | **Instruction**                                        |
| ------------------- | ------------- | ------------------------------------------------------ |
| **palette-project** | _string_      | Set this value to the name of your project in Palette. |


**MAAS Deployment Values**

| **Variable**        | **Data Type** | **Instruction**                                        |
| ------------------- | ------------- | ------------------------------------------------------ |
| **deploy-maas**     | _boolean_     | This is a true or false value. If true, a VMO cluster will be deployed to MAAS.                                                                                                |
| **deploy-maas-vm**  | _boolean_     | This is a true of false value. If true, an Ubuntu 22.04 VM with the Hello Universe app will be deployed in your VMO cluster. Set this value to _false_ for this section of the tutorial. |
| **pcg-name**        | _string_      | Set this value to the name of your MAAS PCG. This can be pre-existing or one you created in the [MAAS Private Cloud Gateway (PCG)](/clusters/pcg/deploy-pcg/maas.md) tutorial. |
| **maas-domain**     | _string_      | Set this value to the domain your MAAS environment is in. example _spectronaut.com_.   
| **maas-control-plane-nodes**         | _number_      | Set this value to the number of worker nodes you want to create.                                      |
| **maas-control-plane-resource-pool** | _string_      | Set this value to match the MAAS resource pool you want to deploy your worker nodes to.               |
| **maas-control-plane-azs**           | _string_      | Set this value to the MAAS availability zones you want your worker nodes deployed to.                 |
| **maas-control-plane-node-tags**     | _string_      | If you are using tags to target MAAS deployments to specific nodes using tags, enter those tags here. |
| **maas-worker-nodes**         | _number_      | Set this value to the number of worker nodes you want to create.                           |
| **maas-worker-resource-pool** | _string_      | Set this value to match the MAAS resource pool you want to deploy your worker nodes to.    |
| **maas-worker-azs**           | _string_      | Set this value to the MAAS availability zones you want your worker nodes deployed to.      |
| **maas-worker-node-tags**     | _string_      | If you are using tags to target MAAS deployments to specific nodes, enter those tags here. |


**Cluster Profile Values**

| **Variable**        | **Data Type** | **Instruction**                                        |
| ------------------- | ------------- | ------------------------------------------------------ |
| **vmo-cluster-name**          | _string_      | The name your MAAS VMO cluster will have. |
| **cluster-profile-type**      | _string_      | The type of _Palette Cluster Profile_ you are creating. Values should be "Infrastructure", "App", "Add-On", or "Full" |
| **cluster-profile-version**   | _number_      | The version number that will be assigned to your _Palette Cluster Profile_. 

**Cluster Values**

| **Variable**        | **Data Type** | **Instruction**                                        |
| ------------------- | ------------- | ------------------------------------------------------ |
| **ctl-node-min-cpu**          | _number_      | Set this to the minimum number of CPU cores you want assigned to your control plan nodes. |
| **ctl-node-min-mem-mb**       | _number_      | Set this to the minimum amount of RAM (Memory) you want assigned to your control plan nodes. |
| **wrk-node-min-cpu**          | _number_      | Set this to the minimum number of CPU cores you want assigned to your worker nodes. |
| **wrk-node-min-mem-mb**       | _number_      | Set this to the minimum amount of RAM (Memory) you want assigned to your worker nodes. |

**Kubernetes Values**

| **Variable**        | **Data Type** | **Instruction**                                        |
| ------------------- | ------------- | ------------------------------------------------------ |
| **pod-CIDR**                  | _string_      | Set this value to the subnet you want your pods to run on. Format must ne standard CIDR notation "192.168.0.0/24" |
| **serviceClusterIPRange**     | _number_      | Set this value to the IP addresses or range that you want your cluster services to use. |

**MetalLB Values**

| **Variable**        | **Data Type** | **Instruction**                                        |
| ------------------- | ------------- | ------------------------------------------------------ |
| **metallb-ip-pool**           | _number_      | Set this value to the IP address range you want MetalLB to use. These IP's should be routable and the NIC on your MAAS nodes should be connected to a switchport that has the untagged VLAN set to the VLAN related to the subnet your IP addresses are in. |


### Deploy the Cluster

Once the variables in _terraform.tfvars_ have been updated, you can proceed with the VMO cluster deployment. 

First, you must set the `SPECTROCLOUD_APIKEY` environment variable to your API key.

```shell
export SPECTROCLOUD_APIKEY="YOUR KEY HERE"
```

Execute the `terraform plan` command to ensure there are no errors, the install plan is correct, and you have connectivity to your Spectro Cloud tenant.

```shell
terraform plan
data.spectrocloud_registry.public_registry: Reading...
data.spectrocloud_cloudaccount_maas.account[0]: Reading...
data.spectrocloud_cloudaccount_maas.account[0]: Read complete after 0s [id=680a7a2321e9c36a9a0efa4f]
data.spectrocloud_registry.public_registry: Read complete after 0s [id=5eecc89d0b150045ae661cef]
data.spectrocloud_pack.maas_csi: Reading...
data.spectrocloud_pack.maas_metallb: Reading...
data.spectrocloud_pack.maas_vmo: Reading...
data.spectrocloud_pack.maas_k8s: Reading...
data.spectrocloud_pack.maas_cni: Reading...
data.spectrocloud_pack.maas_ubuntu: Reading...
data.spectrocloud_pack.maas_metallb: Read complete after 0s [id=678d28cce2561ecca5cf0aea]
.
.
.
              + name    = "vmo-extras"
              + uid     = (known after apply)
            }
        }
    }

Plan: 2 to add, 0 to change, 0 to destroy.
\
```

Execute the `terraform apply` command. This process may take up to an hour or more depending on your environment and the resource capacity you selected for your MAAS VMO Cluster.

```shell

```

### Cluster RBAC Configuration

Do the access thing.

### Verify the Deployment

Do the verification thing.

## Deploy a Virtual Machine

In this section, you will modify and execute Terraform scripts to deploy a new VMO Cluster to your MAAS environment.

### Update terraform.tfvars

Prior to deploying your VM you must modify the _terraform.tfvars_ file to reflect the configuration you want your VM to have. Make changes to your _terraform.tfvars_ file as instructed in the table.

| **Variable**        | **Data Type** | **Instruction**                                        |
| ------------------- | ------------- | ------------------------------------------------------ |
| **deploy-maas-vm**  | _boolean_     | This is a true of false value. If true, an Ubuntu 22.04 VM with the Hello Universe app will be deployed in your VMO cluster. Set this value to _true_ for this section of the tutorial. |
| **vm-deploy-namespace**       | _string_      | Set this value to the name of the VLAN you want your VM's to be deployed to.<br/><br/>These namespaces are standard kubernetes namespaces. Your VM will be impacted by any configurations applied at the namespace level such as network policies and quotas. |
| **vm-deploy-name**            | _string_      | Set this value to the name you want your VM to have. |
| **vm-labels**                 | _string_      | Set this value to a single label you want applied to your VM. For multiple labels, you must modify *virtual_machines.tf* to include one line for each label. |
| **vm-storage-Gi**             | _string_      | Set this value to the size of disk you want your VM to have. You must include 'Gi' in your value. Example _vm-storage-Gi = 50Gi_ |
| **vm-vpu-cores**              | _number_      | This value will set the number of CPU cores your VM will use. |
| **vm-cpu-sockets**            | _number_      | This value will set the number of physical CPU sockets your VM must use. This is intended to enable hardware resilience in the event of a single CPU socket related failure. |
| **vm-cpu-threads**            | _number_      | The number of CPU threads your VM is allowed to use. You can assign 1 CPU core and a single thread if desired. |
| **vm-memory-Gi**              | _string_      | Set this value to the amount of RAM (memory) you want your VM to have. You must include 'Gi' in your value. Example _vm-memory-Gi = 4Gi_ |

### Deploy the Virtual Machine

### Verify the Application

                                                                                                                                                                       
## Clean Up

To clean up the resources you deployed, execute the `terraform destroy` command. 

## Wrap-up


## Additional Information

### Palette Specific Terraform Files

This section will walk through the Palette specific terraform files. You will gain a better understanding of how the variables in _terraform.tfvars_ fit with the other deployment files, and what the Terraform scripts are actually doing when you execute `terraform apply`.

#### Manifests

Manifests are used to customize a pack's configuration. Some packs, like OS, Load Balancers, and more, require
information specific to your environment. When using terraform, the location of the manifest file for a pack must be
specified as shown in the **cluster_profiles.tf** file. If a manifest is not provided, default values will be applied.

This tutorial requires the MetalLB load balancer pack to have 2 IP Addresses defined.

Navigate to the **/vmo-cluster/manifests** folder in the Terraform tutorial code folder you downloaded.

Open the **metallb-values.yaml** file.

Update the IP addresses to reflect your environment and save the changes.

```yaml
charts:
  metallb-full:
    configuration:
      ipaddresspools:
        first-pool:
          spec:
            addresses:
              - 192.168.10.0-192.168.10.10 # These IP addresses would need to be updated to reflect your environment.
            avoidBuggyIPs: true
            autoAssign: true
      l2advertisements:
        default:
          spec:
            ipAddressPools:
              - first-pool
```


#### cluster_profiles.tf

This file creates the cluster profile you will use to build your VMO cluster. Each pack to be included in the profile is
listed along with information to identify it in Palette. This file does not contain actual values for the **name**,
**tag**, and **id** fields. These are looked using queries in the **data.tf** file. Visit the
[packs](/integrations) page to search for packs you want to add and obtain their values.

In this example, you are creating a new Cluster Profile named "tf-maas-vmo-profile" and using the MetalLB pack from your
target registry.

```yaml
resource "spectrocloud_cluster_profile" "maas-vmo-profile" {
  count = var.deploy-maas ? 1 : 0

  name        = "tf-maas-vmo-profile"                       # The profile name that will display in Palette.
  description = "A basic cluster profile for MAAS VMO"      # The description of the profile that will display in Palette.
  tags        = concat(var.tags, ["env:maas"])              # Tags to be applied can be added as key value pairs in between the square brackets.
  cloud       = "maas"                                      # The type of infrastructure you are using. Other values could be "GCP", "Azure", "AWS".
  type        = "cluster"                                   # The type of profile you are creating. Other values could be "Infrastructure" or "App"
  version     = "1.0.0"                                     # The version number you want to assign to the profile.

  pack {                                                    # This pack is configured to retrieve information from a data source. See the data.tf section for more information.
    name = data.spectrocloud_pack.maas_metallb.name
    tag  = data.spectrocloud_pack.maas_metallb.version
    uid  = data.spectrocloud_pack.maas_metallb.id
    values = templatefile("manifests/metallb-values.yaml")  # This tells Terraform where the manifest to be applied is located. See the manifests section for more information.
    type = "spectro"
  }
}
```


#### clusters.tf

This file creatse your VMO cluster in MAAS. The majority of values in this file are provided via variables you
set in _terrafrom.tfvars_.

General Configuration

Values in this section are specific to the overall MAAS VMO cluster that will be built.

```shell
resource "spectrocloud_cluster_maas" "maas-cluster" {
  count = var.deploy-maas ? 1 : 0

  name                 = "vmo-cluster-maas"
  tags                 = concat(var.tags, ["env:maas"])
  cloud_account_id     = data.spectrocloud_cloudaccount_maas.account[0].id
  pause_agent_upgrades = "unlock"

  cloud_config {
    domain = var.maas-domain
  }

  cluster_profile {
    id = resource.spectrocloud_cluster_profile.maas-vmo-profile[0].id
  }
```
| **Variable** | **Data Type** | **Instruction**                                                                                   |
| ------------ | ------------- | ------------------------------------------------------------------------------------------------- |
| **name**     | _string_      | Set this value to the name you want your MAAS VMO cluster to have. Value must be inside "quotes". |

Control Plane Node Configuration

Values on these lines are nested in the **vmo-maas-control-planes** machine pool section and will only impact control
plane nodes.

```shell
  machine_pool {
    name          = "maas-control-plane"
    count         = 1
    control_plane = true
    azs           = var.maas-control-plane-azs
    node_tags     = var.maas-control-plane-node-tags
    instance_type {
      min_cpu       = 8
      min_memory_mb = 16000
    }
    placement {
      resource_pool = var.maas-control-plane-resource-pool
    }
  }
```

| **Variable**      | **Data Type** | **Instruction**                                                                                                                                                              |
| ----------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **name**          | _string_      | Set this value to the name you want the MAAS Machine Pool to have for control plane nodes.                                                                                   |
| **count**         | _number_      | Set this value to the number of control plane nodes you want to have.                                                                                                        |
| **control_plane** | _boolean_     | This is true false value. If not provided, the default value is false. Set this to **true** to have Palette create these VMs as your MAAS VMO cluster's control plane nodes. |
| **min_cpu**       | _number_      | Set this value to reflect your desired CPU core count for control plane nodes in your environment.                                                                           |
| **min-memory-mb** | _number_      | Set this value to reflect the desired memory allocation for control plane nodes in your environment.                                                                         |

:::tip

For non-production environments, lower CPU and Memory resources can be used.

:::

---

Worker Node Configuration

Values on these lines are nested in the **vmo-maas-worker-nodes** machine pool section and will only impact worker
nodes.

```shell
  machine_pool {
    name      = "maas-worker-basic"
    count     = 1
    azs       = var.maas-worker-azs
    node_tags = var.maas-worker-node-tags
    instance_type {
      min_cpu       = 8
      min_memory_mb = 32000
    }
    placement {
      resource_pool = var.maas-worker-resource-pool
    }
  }
}
```

| **Variable**      | **Data Type** | **Instruction**                                                                                                           |
| ----------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **name**          | _string_      | Set this value to the name you want the MAAS Machine Pool to have for control plane nodes. Value must be inside "quotes". |
| **count**         | _number_      | Set this value to the number of control plane nodes you want to have.                                                     |
| **min_cpu**       | _number_      | Set this value to reflect your desired CPU core count for control plane nodes in your environment.                        |
| **min-memory-mb** | _number_      | Set this value to reflect the desired memory allocation for control plane nodes in your environment.                      |

:::info 

Remember, your worker node must have 2 disks allocated to it. 

:::


#### virtual_machines.tf

This file defines the configuration of the VM you will deploy to your MAAS VMO cluster. You will gain a high level
understanding of the file structure, what actions are being executed, and how your VM is tied into Kubernetes.

| **Variable**        | **Data Type** | **Instruction**                                                                                                                                                                                                                                                                                                                                    |
| ------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **run_on_launch**   | _boolean_     | If set to true, the deployed VM will be started when the host is powered on. <br/><br/> We recommend this value to be set to **true** for production services.                                                                                                                                                                                     |
| **namespace**       | _string_      | This value defines the namespace your VM will be created in. <br/><br/>These namespaces are standard kubernetes namespaces. Your VM will be impacted by any configurations applied at the namespace level such as network policies and quotas.                                                                                                     |
| **name**            | _string_      | The name you wish to assign to your VM.                                                                                                                                                                                                                                                                                                            |
| **Labels**          | _string_      | Add any labels you want applied to your VM resource in Kubernetes. To create more labels, repeat the format in line 21 on a new line.                                                                                                                                                                                                              |
| **storage configs** | _string_      | Multiple lines are used to define the storage configuration for your VM and the PVC's containing the OS images needed to create it. <br/><br/> Default values were used for this tutorial with the exception of the value you set for _vm-storage-Gi_<br/> in _terraform.tfvars_ |
| **storage**         | _number_      | This value determines how much storage your VM will have. Set it as needed for your environment.                                                                                                                                                                                                                                                   |
| **cores**           | _number_      | The number of CPU cores you want your VM to have.                                                                                                                                                                                                                                                                                                  |
| **sockets**         | _number_      | This value determines the number of sockets the CPU cores can be spread across. <br/><br/> 2 cores and 2 sockets will place use one CPU core in one physical CPU socket and a second core in a different physical CPU socket. This granular control enables you to ensure High Availability (HA) and fault tolerance down to the CPU socket level. |
| **threads**         | _number_      | This value determines how many CPU threads your VM can use.                                                                                                                                                                                                                                                                                        |
| **guest**           | _number_      | This value is in the memory section and determines how much memory your VM will be assigned. Set it as needed for your environment.|

### Packs Used for VMO

This section will review the packs used to create a VMO Cluster in a MAAS environment. You will learn what the packs are
and how they work together to provide VMO services. You will be introduced to the Terraform deployment process and will
customize the provided template to prepare for deployment in your MAAS environment.

| **Pack Name**                    | **Version** | **Description**                                                                                                                                                                                                                                                                                                                                                                                  | **ReadMe Link**                                                                                                                        |
| -------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Virtual Machine Orchestrator** | v##         | The Palette Virtual Machine Orchestrator (VMO) pack consolidates all components that you need to deploy and manage Virtual Machines (VMs) alongside containers in a Kubernetes host cluster. You can deploy VMO as an add-on cluster profile on top of an existing data center or edge cluster.                                                                                                  | <VersionedLink text="Virtual Machine Orchestrator Readme" url="/integrations/packs/?pack=virtual-machine-orchestrator&version=4.6.3"/> |
| **MetalLB (Helm)**               | v##         | A load-balancer implementation for bare metal Kubernetes clusters, using standard routing protocols. Offers a network load balancer implementation that integrates with standard network equipment.                                                                                                                                                                                              | <VersionedLink text="Cilium Readme" url="/integrations/packs/?pack=lb-metallb-helm&version=1.14.9"/>                                   |
| **Rook-Ceph (Helm)**             | v##         | **Rook** is an open source cloud-native storage orchestrator for Kubernetes, providing the platform, framework, and support for Ceph storage to natively integrate with Kubernetes. **Ceph** is a distributed storage system that provides file, block and object storage and is deployed in large scale production clusters.                                                                    | <VersionedLink text="Cilium Readme" url="/integrations/packs/?pack=csi-rook-ceph-helm&version=1.16.3"/>                                |
| **Cilium**                       | v##         | Cilium is a networking, observability, and security solution with an eBPF-based dataplane.                  | <VersionedLink text="Cilium Readme" url="/integrations/packs/?pack=cni-cilium-oss&version=1.17.1"/>                                    |
| **Palette eXtended Kubernetes**  | v##         | Palette eXtended Kubernetes (PXK) is a recompiled version of the open-source Cloud Native Computing Foundation (CNCF) distribution of Kubernetes. This Kubernetes version can be deployed through Palette to all major infrastructure providers, public cloud providers, and private data center providers. This is the default distribution when deploying a Kubernetes cluster through Palette | <VersionedLink text="Palette eXtended Kubernetes Readme" url="/integrations/packs/?pack=kubernetes&version=1.32.2"/>                   |
| **Ubuntu Mass**                  | v##         | Ubuntu is a free, open-source operating system (OS) based on Linux that can be used on desktops, servers, in the cloud, and for IoT devices. Ubuntu is a Linux distribution derived from Debian.                                                                                                                                                                                                 | <VersionedLink text="Ubuntu Readme" url="/integrations/packs/?pack=kubernetes&version=1.32.2"/>                                        |

                                         |