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

In this tutorial you will deploy a VM using Palette Virtual Machine Orchestrator (VMO). You will learn about the components that make up VMO, how to create and customize them for a Canonical MAAS VMO cluster deployment, and how to customize and deploy a VM. 

We recommend reviewing the [VMO architecture](/vm-management/architecture.md) page before starting this tutorial. The
architecture page describes what VMO is, a high level view of the components it uses, and provides links to more detailed
information.


## Prerequisites

- A Palette account with tenant admin access.

- MAAS datacenter environment

 - Two MAAS machines with a minimum spec of
   - 8 CPU
   - 32 GB RAM
   - 250 GB Storage (Worker node must have 2 disks)

- Two routable, static IP addresses from your MAAS environment

- A MAAS user with necessary permissions

  - _ADD PERMISSIONS HERE_

- An existing [MAAS Private Cloud Gateway (PCG)](/clusters/pcg/deploy-pcg/maas.md)

- Basic knowledge of containers

- [kubectl](https://kubernetes.io/docs/tasks/tools/) installed locally

- [virtctl](https://kubevirt.io/user-guide/user_workloads/virtctl_client_tool/) installed locally
<br/>
<br/>

## Create a VMO Cluster Profile
This section will review the packs used to create a VMO Cluster in a MAAS environment. You will learn what the packs are and how they work together to provide VMO services. You will be introduced to the Terraform deployment process and will customize the provided template to prepare for deployment in your MAAS environment.
<br/>

### Packs Used

| **Pack Name**                    | **Description**                   | **ReadMe Link**                                                           |
| -------------------------------- | --------------------------------- | ------------------------------------------------------------------------- |
| **Virtual Machine Orchestrator**  | The Palette Virtual Machine Orchestrator (VMO) pack consolidates all components that you need to deploy and manage Virtual Machines (VMs) alongside containers in a Kubernetes host cluster. You can deploy VMO as an add-on cluster profile on top of an existing data center or edge cluster. | <VersionedLink text="Virtual Machine Orchestrator Readme" url="/integrations/packs/?pack=virtual-machine-orchestrator&version=4.6.3"/> |
| **MetalLB (Helm)**  | A load-balancer implementation for bare metal Kubernetes clusters, using standard routing protocols. Offers a network load balancer implementation that integrates with standard network equipment. | <VersionedLink text="Cilium Readme" url="/integrations/packs/?pack=lb-metallb-helm&version=1.14.9"/> |
| **Rook-Ceph (Helm)**  | **Rook** is an open source cloud-native storage orchestrator for Kubernetes, providing the platform, framework, and support for Ceph storage to natively integrate with Kubernetes. **Ceph** is a distributed storage system that provides file, block and object storage and is deployed in large scale production clusters. | <VersionedLink text="Cilium Readme" url="/integrations/packs/?pack=csi-rook-ceph-helm&version=1.16.3"/> |
| **Cilium**    | Cilium is a networking, observability, and security solution with an eBPF-based dataplane. It provides a simple flat Layer 3 network with the ability to span multiple clusters in either a native routing or overlay mode. It is L7-protocol aware and can enforce network policies on L3-L7 using an identity based security model that is decoupled from network addressing.   | <VersionedLink text="Cilium Readme" url="/integrations/packs/?pack=cni-cilium-oss&version=1.17.1"/> |
| **Palette eXtended Kubernetes**  | Palette eXtended Kubernetes (PXK) is a recompiled version of the open-source Cloud Native Computing Foundation (CNCF) distribution of Kubernetes. This Kubernetes version can be deployed through Palette to all major infrastructure providers, public cloud providers, and private data center providers. This is the default distribution when deploying a Kubernetes cluster through Palette | <VersionedLink text="Palette eXtended Kubernetes Readme" url="/integrations/packs/?pack=kubernetes&version=1.32.2"/> |
| **Ubuntu Mass**                  | Ubuntu is a free, open-source operating system (OS) based on Linux that can be used on desktops, servers, in the cloud, and for IoT devices. Ubuntu is a Linux distribution derived from Debian.| <VersionedLink text="Ubuntu Readme" url="/integrations/packs/?pack=kubernetes&version=1.32.2"/> |
<br/>

### Core Terraform Files
In this section you will learn about the purpose of the core files, how to customize them, and how they all work together to deploy your VMO cluster. The core Terraform files in the tutorial bundle will be used to explain how it works. Navigate to the Terraform tutorial bundle you downloaded. Extract the package and navigate to the root folder before continuing.

#### provider.tf
Terraform uses this file to import providers so they can be used locally to apply your configuration. This is very similar to how you would import a module for use in software development.

In this example, you are telling terraform to import the list of providers from the public Terraform registry. Companies that require high security, pulling a provider from a public registry may be forbidden. This provider can be pulled to and served from private registry hosted by your company. This will allow you to continue to use the terraform provider while leveraging the enhanced security features of your private registry.

```yaml
terraform {
  required_providers {
    spectrocloud = {
      version = ">= 0.22.2"
      source  = "spectrocloud/spectrocloud"
    }

    tls = {
      source  = "hashicorp/tls"
      version = "4.0.4"
    }

    local = {
      source  = "hashicorp/local"
      version = "2.4.1"
    }
  }

  required_version = ">= 1.9"
}
```

#### cluster_profiles.tf
This file creates the cluster profile you will use to build your VMO cluster. Each pack to be included in the profile is listed along with information to identify it in Palette. This file does not contain actual values for the **name**, **tag**, and **id** fields. These are looked up from the **data.tf** file. To obtain the values, visit the [packs](/integrations) page and search for the pack.

In this example, you are creating a new Cluster Profile named "tf-maas-vmo-profile" and using the MetalLB pack from your target registry.
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


#### data.tf
The data.tf file in Terraform is used to look up information from data sources. In this tutorial, the data blocks are used to connect to the Palette registry and obtain the Palette_UID for the packs you are using.

In this example, you need to obtain the id of the pack you want to use. To do this, you create a data block to call the Terraform provider and resource you need the info from. You need to provide some information about the pack so Palette can correctly identify the correct pack and version.
```yaml
data "spectrocloud_pack" "maas_ubuntu" {                          # Tells Terraform to use the "spectrocloud_pack" resource and look in the Palette registry for one named "maas_ubuntu"
  name         = "ubuntu-maas"                                    # The name of the Palette pack.
  version      = "22.04"                                          # The version of the Palette pack.
  registry_uid = data.spectrocloud_registry.public_registry.id    # The information you need about the pack.
}
```

#### terraform.tfvars
This file allows you to set values to be used for your variables. When properly configured, this is the only file you should need to modify to complete your deployments.

```yaml
#####################
# Palette Settings
#####################
palette-project = "Default" # The name of your project in Palette.

############################
# MAAS Deployment Settings
############################
deploy-maas    = false # Set to true to deploy to MAAS.
deploy-maas-vm = false # Set to true to create a VM on MAAS cluster once deployed.

pcg-name    = "REPLACE ME" # Provide the name of the PCG that will be used to deploy the Palette cluster.
maas-domain = "REPLACE ME" # Provide the MAAS domain that will be used to deploy the Palette cluster.

maas-worker-nodes         = 1              # Provide the number of worker nodes that will be used for the Palette cluster.
maas-worker-resource-pool = "REPLACE ME"   # Provide a resource pool for the worker nodes.
maas-worker-azs           = ["REPLACE ME"] # Provide a set of availability zones for the worker nodes.
maas-worker-node-tags     = ["REPLACE ME"] # Provide a set of node tags for the worker nodes.

maas-control-plane-nodes         = 1              # Provide the number of control plane nodes that will be used for the Palette cluster.
maas-control-plane-resource-pool = "REPLACE ME"   # Provide a resource pool for the control plane nodes.
maas-control-plane-azs           = ["REPLACE ME"] # Provide a set of availability zones for the control plane nodes.
maas-control-plane-node-tags     = ["REPLACE ME"] # Provide a set of node tags for the control plane nodes.
```

#### Manifests
Manifests are used to customize a pack's configuration. Some packs, like OS, Load Balancers, and more, require information specific to your environment. When using terraform, the location of the manifest file for a pack must be specified as shown in the **cluster_profiles.tf** file. If a manifest is not provided, default values will be applied.

In this example, the MetalLB load balancer pack needs IP Addresses defined to work properly. You need to update the IP addresses before deployment and would use a manifest to do so.

```yaml
charts:
  metallb-full:
    configuration:
      ipaddresspools:
        first-pool:
          spec:
            addresses:
              - 192.168.10.0-192.168.10.10    # These IP addresses would need to be updated to reflect your environment.
            avoidBuggyIPs: true
            autoAssign: true
      l2advertisements:
        default:
          spec:
            ipAddressPools:
              - first-pool
```

#### 
### Customize the Deployment Package

<br/>
<br/>

## Deploy a VMO Cluster to MAAS

<br/>

### Build the Cluster

<br/>

### RBAC Configuration

<br/>

### Verify the Deployment

<br/>
<br/>

## Deploy a Virtual Machine

<br/>

### Core Terraform Files

<br/>

### Customize the VM

<br/>

### Deploy the VM

<br/>

### Verify the Application


## Clean Up


## Wrap-up



