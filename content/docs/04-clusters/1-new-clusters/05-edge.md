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

Edge Clusters are Kubernetes clusters set up on appliances installed in isolated locations such as hospitals, grocery stores, restaurants, etc., unlike a data center or cloud environment. Palette supports edge cluster provisioning by virtualizing Kubernetes nodes (CAPL) or deploying them as docker containers(CAPD). Additonally, PaletteOS offers two capabilities to host as a Native Edge deployment or as a Virtualized Edge appliances.

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


#### Edge Appliances

Palette supports several kinds of appliances at the Edge. These appliances can be registered with the Palette Management console and used for provisioning a Virtualized or a Native OS. The following is a list of all the supported Edge appliance types:


  | **Appliance Type**              | **Cluster Type**                          |
  | :------------------------------ | :---------------------------------------- |
  | Native Edge Deployment          | Bare metal machines or virtual appliances |
  | Bare Metal Machine with Libvirt | Virtualized                               |
  | KVM-based virtual machines      | Virtualized mode                          |
 
