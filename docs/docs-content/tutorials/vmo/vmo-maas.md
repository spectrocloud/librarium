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

- Downloaded copy of the Terraform [tutorial code](link here)
<br/>
<br/>

## VMO Packs

This section will review the packs used to create a VMO Cluster in a MAAS environment. You will learn what the packs are and how they work together to provide VMO services. You will be introduced to the Terraform deployment process and will customize the provided template to prepare for deployment in your MAAS environment.


| **Pack Name**                    | **Description**                   | **ReadMe Link**                                                           |
| -------------------------------- | --------------------------------- | ------------------------------------------------------------------------- |
| **Virtual Machine Orchestrator**  | The Palette Virtual Machine Orchestrator (VMO) pack consolidates all components that you need to deploy and manage Virtual Machines (VMs) alongside containers in a Kubernetes host cluster. You can deploy VMO as an add-on cluster profile on top of an existing data center or edge cluster. | <VersionedLink text="Virtual Machine Orchestrator Readme" url="/integrations/packs/?pack=virtual-machine-orchestrator&version=4.6.3"/> |
| **MetalLB (Helm)**  | A load-balancer implementation for bare metal Kubernetes clusters, using standard routing protocols. Offers a network load balancer implementation that integrates with standard network equipment. | <VersionedLink text="Cilium Readme" url="/integrations/packs/?pack=lb-metallb-helm&version=1.14.9"/> |
| **Rook-Ceph (Helm)**  | **Rook** is an open source cloud-native storage orchestrator for Kubernetes, providing the platform, framework, and support for Ceph storage to natively integrate with Kubernetes. **Ceph** is a distributed storage system that provides file, block and object storage and is deployed in large scale production clusters. | <VersionedLink text="Cilium Readme" url="/integrations/packs/?pack=csi-rook-ceph-helm&version=1.16.3"/> |
| **Cilium**    | Cilium is a networking, observability, and security solution with an eBPF-based dataplane. It provides a simple flat Layer 3 network with the ability to span multiple clusters in either a native routing or overlay mode. It is L7-protocol aware and can enforce network policies on L3-L7 using an identity based security model that is decoupled from network addressing.   | <VersionedLink text="Cilium Readme" url="/integrations/packs/?pack=cni-cilium-oss&version=1.17.1"/> |
| **Palette eXtended Kubernetes**  | Palette eXtended Kubernetes (PXK) is a recompiled version of the open-source Cloud Native Computing Foundation (CNCF) distribution of Kubernetes. This Kubernetes version can be deployed through Palette to all major infrastructure providers, public cloud providers, and private data center providers. This is the default distribution when deploying a Kubernetes cluster through Palette | <VersionedLink text="Palette eXtended Kubernetes Readme" url="/integrations/packs/?pack=kubernetes&version=1.32.2"/> |
| **Ubuntu Mass**                  | Ubuntu is a free, open-source operating system (OS) based on Linux that can be used on desktops, servers, in the cloud, and for IoT devices. Ubuntu is a Linux distribution derived from Debian.| <VersionedLink text="Ubuntu Readme" url="/integrations/packs/?pack=kubernetes&version=1.32.2"/> |
<br/>

## Customizing the Terraform Template

In this section you will learn about the purpose of the core files, how to customize them, and how they all work together to deploy your VMO cluster. The core Terraform files in the tutorial bundle will be used to explain how it works. Navigate to the Terraform tutorial bundle you downloaded. Extract the package and navigate to the root folder before continuing.

---

### provider.tf

Terraform uses this file to import providers so they can be used locally to apply your configuration. This is very similar to how you would import a module for use in software development.

In this example, a list of providers from the public Terraform registry that will be imported and used. Companies that require high security may restrict the use of public repositories and registries. This provider can be pulled to and served from a private registry hosted by your company. This will allow you to continue to use the terraform provider while leveraging the enhanced security features of your private registry.

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

---

### data.tf

The data.tf file in Terraform is used to look up information from data sources. In this tutorial, the data blocks are used to connect to the Palette registry and obtain the Palette_UID for the packs you are using.

In this example, you need to obtain the id of the pack you want to use. To do this, you create a data block to call the Terraform provider and resource you need the info from. In the example., the name and version of the ubuntu OS pack is sent to Palette, which will use them to identify the correct pack and return its UID.

```yaml
data "spectrocloud_pack" "maas_ubuntu" {                          # Tells Terraform to use the "spectrocloud_pack" resource and look in the Palette registry for one named "maas_ubuntu"
  name         = "ubuntu-maas"                                    # The name of the Palette pack.
  version      = "22.04"                                          # The version of the Palette pack.
  registry_uid = data.spectrocloud_registry.public_registry.id    # The information you need about the pack.
}
```

---

### cluster_profiles.tf

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

---

### terraform.tfvars

This file allows you to set values to be used for your variables in one place. We recommend using the *terraform.tfvars* file whenever possible as it help reduce human error and will make updating and reusing your Terraform scripts more efficient. 

All values in the terraform.tfvars file should be updated to reflect your environment.

General Palette Configuration Values

| **Value**                            | **Data Type**  |**Instruction**                   |
|--------------------------------------|----------------|----------------------------------|
| **palette-project** | *string* | Set this value to the name of your project in Palette. <br/> <br/> Value must be inside "quotes". |

---

MAAS Configuration Values

| **Value**                            | **Data Type**  |**Instruction**                   |
|--------------------------------------|----------------|----------------------------------|
| **deploy-maas** | *boolean* | This is a true or false value. If true, a VMO cluster will be deployed to MAAS. |
| **deploy-maas-vm** | *boolean* | This is a true of false value. If true, an Ubuntu 22.04 VM with the Hello Universe app will be deployed in your VMO cluster |
| **pcg-name** | *string* | Set this value to the name of your MAAS PCG. This can be pre-existing or one you created in the [MAAS Private Cloud Gateway (PCG)](/clusters/pcg/deploy-pcg/maas.md) tutorial. <br/> <br/> Value must be inside "quotes". |
| **maas-domain** | *string* | Set this value to the domain your MAAS environment is in. example *spectronaut.com*. <br/> <br/> Value must be inside "quotes". |

---

Control Plane Node Configuration Values

| **Value**                            | **Data Type**  |**Instruction**                   |
|--------------------------------------|----------------|----------------------------------|
| **maas-control-plane-nodes** | *number* | Set this value to the number of worker nodes you want to create. |
| **maas-control-plane-resource-pool** | *string* | Set this value to match the MAAS resource pool you want to deploy your worker nodes to. <br/> <br/> Value must be inside "quotes". |
| **maas-control-plane-azs** | *string* | Set this value to the MAAS availability zones you want your worker nodes deployed to. <br/> <br/> Value must be inside "quotes". |
| **maas-control-plane-node-tags** | *string* | If you are using tags to target MAAS deployments to specific nodes using tags, enter those tags here. <br/> <br/> Value must be inside "quotes".|

---

Worker Node Configuration Values

| **Value**                            | **Data Type**  |**Instruction**                   |
|--------------------------------------|----------------|----------------------------------|
| **maas-worker-nodes** | *number* | Set this value to the number of worker nodes you want to create. |
| **maas-worker-resource-pool** | *string* | Set this value to match the MAAS resource pool you want to deploy your worker nodes to. <br/> <br/> Value must be inside "quotes". |
| **maas-worker-azs** | *string* | Set this value to the MAAS availability zones you want your worker nodes deployed to. <br/> <br/> Value must be inside "quotes". |
| **maas-worker-node-tags** | *string* | If you are using tags to target MAAS deployments to specific nodes, enter those tags here. <br/> <br/> Value must be inside "quotes".|

---

### Manifests

Manifests are used to customize a pack's configuration. Some packs, like OS, Load Balancers, and more, require information specific to your environment. When using terraform, the location of the manifest file for a pack must be specified as shown in the **cluster_profiles.tf** file. If a manifest is not provided, default values will be applied.

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
              - 192.168.10.0-192.168.10.10    # These IP addresses would need to be updated to reflect your environment.
            avoidBuggyIPs: true
            autoAssign: true
      l2advertisements:
        default:
          spec:
            ipAddressPools:
              - first-pool
```

---

### clusters.tf

This file will create your VMO cluster in MAAS. The majority of values in this file are provided via variables you previously set. Line numbers in the table align to the tutorial package 

General Configuration

Values in this section are specific to the overall MAAS VMO cluster that will be built.

| **Line Number** | **Value**                       | **Data Type**  |**Instruction**                   |
|-----------------|---------------------------------|----------------|----------------------------------|
| 11 | **name** | *string* | Set this value to the name you want your MAAS VMO cluster to have. Value must be inside "quotes". |

---

Control Plane Node Configuration

Values on these lines are nested in the **vmo-maas-control-planes** machine pool section and will only impact control plane nodes.

| **Line Number** | **Value**                       | **Data Type**  |**Instruction**                   |
|-----------------|---------------------------------|----------------|----------------------------------|
| 25 | **name** | *string* | Set this value to the name you want the MAAS Machine Pool to have for control plane nodes. <br/> <br/> Value must be inside "quotes". |
| 26 | **count** | *number* |Set this value to the number of control plane nodes you want to have. |
| 27 | **control_plane** | *boolean* | This is true false value. If not provided, the default value is false. Set this to **true** to have Palette create these VMs as your MAAS VMO cluster's control plane nodes. |
| 31 | **min_cpu** | *number* | Set this value to reflect your desired CPU core count for control plane nodes in your environment.|
| 32 | **min-memory-mb** | *number* | Set this value to reflect the desired memory allocation for control plane nodes in your environment.|

:::tip
For non-production environments, lower CPU and Memory resources can be used.

:::

---

Worker Node Configuration

Values on these lines are nested in the **vmo-maas-worker-nodes** machine pool section and will only impact worker nodes.

| **Line Number** | **Value**                       | **Data Type**  |**Instruction**                   |
|-----------------|---------------------------------|----------------|----------------------------------|
| 40 | **name** | *string* | Set this value to the name you want the MAAS Machine Pool to have for control plane nodes. Value must be inside "quotes".<br/> <br/> Value must be inside "quotes". |
| 41 | **count** | *number* |Set this value to the number of control plane nodes you want to have. |
| 45 | **min_cpu** | *number* | Set this value to reflect your desired CPU core count for control plane nodes in your environment.|
| 46 | **min-memory-mb** | Set this value to reflect the desired memory allocation for control plane nodes in your environment.|

:::info
Remember, your worker node must have 2 disks allocated to it.
:::
___

### virtual_machines.tf

This file defines the configuration of the VM you will deploy to your MAAS VMO cluster. You will gain a high level understanding of the file structure, what actions are being executed, and how your VM is tied into Kubernetes.

General VM Information

| **Line Number** | **Value**                       | **Data Type**  |**Instruction**                   |
|-----------------|---------------------------------|----------------|----------------------------------|
| 12 | **run_on_launch** | *boolean* | If set to true, the deployed VM will be started when the host is powered on. <br/><br/> We recommend this value to be set to **true** for production services. |
| 13 | **namespace** | *string* |This value defines the namespace your VM will be created in. <br/><br/>These namespaces are standard kubernetes namespaces. Your VM will be impacted by any configurations applied at the namespace level such as network policies and quotas.<br/> <br/> Value must be inside "quotes".|
| 14| **name** | *string* | The name you wish to assign to your VM. <br/> <br/> Value must be inside "quotes".|
| 21-22 | **Labels** | *string* | Add any labels you want applied to your VM resource in Kubernetes. To create more labels, repeat the format in line 21 on a new line. <br/> <br/> Value must be inside "quotes".|

---

VM Storage Details

| **Line Number** | **Value**                       | **Data Type**  |**Instruction**                   |
|-----------------|---------------------------------|----------------|----------------------------------|
| 29 - 82 | **multiple values** | *string* | These lines define the storage configuration for your VM and the PVC's containing the OS images needed to create it. <br/><br/> Default values will work for this tutorial.<br/> <br/> Value must be inside "quotes". |
| 40 | **storage** | *number* | This value determines how much storage your VM will have. Set it as needed for your environment. |

---

VM Compute Resources

| **Line Number** | **Value**                       | **Data Type**  |**Instruction**                   |
|-----------------|---------------------------------|----------------|----------------------------------|
| 85 | **cores** | *number* | The number of CPU cores you want your VM to have. |
| 86 |**sockets** | *number* | This value determines the number of sockets the CPU cores can be spread across. <br/><br/> 2 cores and 2 sockets will place use one CPU core in one physical CPU socket and a second core in a different physical CPU socket. This granular control enables you to ensure High Availability (HA) and fault tolerance down to the CPU socket level. |
| 87 | **threads** | *number* | This value determines how many CPU threads your VM can use. |
| 90 | **guest** | *number* | This value is in the memory section and determines how much memory your VM will be assigned. Set it as needed for your environment. |

#### Virtual Machine Networking

Access to your VM is managed by Kubernetes and MetalLB. Customization can be done to put your VM on a different network within the cluster as needed for your environment. This tutorial uses default values.



## Deploy a VMO Cluster to MAAS

In this section, you will execute the Terraform scripts you modified in the *Customizing the Terraform Template* section.
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



