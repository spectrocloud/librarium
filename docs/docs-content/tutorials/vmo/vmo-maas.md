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


Palette Virtual Machine Orchestrator (VMO) provides a unified platform for deploying, managing, and scaling Virtual
Machines (VMs) and containerized applications within Kubernetes clusters. Palette VMO supports deployment to edge
devices and bare metal servers in data centers.


Palette VMO simplifies infrastructure management, improves resource utilization, and eliminates hypervisor costs.


We recommend reviewing the [VMO architecture](/vm-management/architecture.md) page before starting this tutorial. The
architecture page provides describes what VMO is, the components it uses, and provides links to othe detailed
information.


## Use Cases


You will benefit from Palette VMO in the following cases:


You are planning to gradually shift from VMs to containers and want to continue using both during the transition.


Your established infrastructure combines containers and VMs, and you want to manage them more effectively.


You are integrating new VM-based applications into an existing containerized infrastructure.


You are managing edge locations with VM-based workloads and would like to stop using a hypervisor.


## Prerequisites


- A Palette account with tenant admin access.


- MAAS datacenter environment


 - Two MAAS machines with a minimum spec of
   - 8 CPU
   - 32 GB RAM
   - 250 GB Storage (Worker node must have 2 disks)


- A MAAS user with necessary permissions


 - _ADD PERMISSIONS HERE_


- An existing [MAAS Private Cloud Gateway (PCG)](/clusters/pcg/deploy-pcg/maas.md)


- Basic knowledge of containers


- [kubectl](https://kubernetes.io/docs/tasks/tools/) installed locally


- [virtctl](https://kubevirt.io/user-guide/user_workloads/virtctl_client_tool/) installed locally


## Deploy a VMO Cluster


This section demonstrates how to create a Virtual Machine Orchestrator (VMO) cluster using cluster profiles.


### Create a VMO Profile


Download the pre-made cluster profile _here_ LINK REQUIRED. The file is in JSON format and contains a fully configured
cluster profile, ready to deploy your VMO cluster.


THe pre-made profile


Import the cluster profile into your Palette instance:


1. Download the **vmo-cluster-profile.json** file from the **Deploy VMO Cluster**
  [Spectro Cloud Tutorials Repo](https://github.com/spectrocloud/tutorials).


2. Log into your Palette instance.


3. Select **Profiles** from the left main Menu.


![Image showing the **Import Cluster Profile** button](/tutorials/deploy-vmo-cluster/1-tutorials_deploy-vmo-cluster_vmo-maas-tf_vmo-import-cluster-profile.webp)


4. Select **Upload file**


5. Navigate to the folder containing the **vmo-cluster-profile.json** you downloaded. Select it, then select **Open**.


6. The json configuration values displays the values and customizations for each of the core packs required for VMO. You
  may review the default values for the packs aif you wish. You will be customizing the configurations for your
  environment in subsequent steps. Select **Validate**.


![Image showing the **Validate** button](/tutorials/deploy-vmo-cluster/2-tutorials_deploy-vmo-cluster_vmo-maas-tf_validate-import.webp)


7. If prompted to select repositories for one or more packs, select **Public Repo**. Select **Confirm**.


### Deploy a VMO Cluster to MAAS

1. 


### RBAC Configuration


## Create a Virtual Machine


### Verify the Application


## Clean Up


## Wrap-up



