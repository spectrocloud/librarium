---
title: "Edge"
metaTitle: "Creating new clusters on Spectro Cloud"
metaDescription: "The methods of creating clusters for a speedy deployment on any CSP"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview

Edge Clusters are Kubernetes clusters set up on appliances installed in isolated locations such as hospitals, grocery stores, restaurants, etc., unlike a data center or cloud environment. Palette supports edge cluster provisioning by virtualizing Kubernetes nodes (CAPL) or deploying them as docker containers(CAPD). Additonally, PaletteOS offers two capabilities to host as a Native Edge Deployment or as a Virtualized Edge appliances.

<br />

### Private Cloud Gateway-Edge (PCG-E)

Deploying Edge Clusters requires a Private Cloud Gateway-Edge (PCG-E) to be installed on the appliances for Palette to discover the appliance and provision workload clusters on them. A PCG-E is Palette's on-premises component to support remote Edge devices. Palette PCG-E, once installed on-premises, registers itself with Palette's SaaS portal and enables secure communications between the SaaS portal and the Edge Clusters.

<br />

### Cluster Types

Palette supports the following two configurations for Edge clusters:

<br />

#### Virtualized

Kubernetes nodes for master and worker pools are launched as Kernel-based Virtual Machines (KVM-based) in the virtualized mode. Each Virtual Machine (VM) represents a Kubernetes node. Users can specify placement settings for these virtual machines to ensure they are launched in the desired network and storage pools. Users can also configure VM hardware settings such as CPU, Memory, Disk size, etc.

![virtualized-edge.png](virtualized-edge.png)


#### Containerized

Kubernetes nodes for the master and worker pools are launched as Docker containers in the containerized mode. Each container represents a Kubernetes node.

![containerized-edge.png](containerized-edge.png)

#### Edge Appliances

Palette supports several kinds of appliances at the Edge. These appliances can be registered with the Palette Management console and used for provisioning a Virtualized, a Containerized cluster, or a Native OS. The following is a list of all the supported Edge appliance types:


  | **Appliance Type**              | **Cluster Type**                          |
  | :------------------------------ | :---------------------------------------- |
  | Native Edge Deployment          | Bare metal machines or virtual appliances |
  | Bare Metal Machine with Libvirt | Virtualized or Containerized              |
  | KVM-based virtual machines      | Virtualized mode                          |
 

## Prerequisites

1. An Admin/Tenant Admin account in the Palette Management Console.

2. Make sure to have root access to the machine.

* Bare Metal machine

    * Edge Device: Bare metal or virtual that can support the operating system and is capable of running virtual instances.

    * Palette6OS/CanvOS – This is an immutable OS with embedded Kubernetes. Find the agent that matches your OS here.

    * Have one of these supported Operating System installed -(SLES, Ubuntu, Redhat) and K8s Distros (CNCF, RKE2, K3s)

    * Linux based operating system with Libvirt installed.

   * Virtual Machine management software

    * X86-based laptops use Virtual Box
 
    * M1-based Mac use Urchin Tracking Module (UTM)


* Native OS
    * Choice 1: Bare metal box with at least 2GB of RAM
    * Choice 2: Laptops with virtual machine management software: Install the Virtual Box if you are using x86-based laptops or Urchin Tracking Module (UTM) on M1-based Mac.
  
3. The latest release Spectro Cloud Palette Installer Bin. You can find the installer bin here.

