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

Edge Clusters are Kubernetes clusters set up on appliances installed in isolated locations such as grocery stores and restaurants, unlike a data center or cloud environment. These appliances can be bare metal machines or virtual machines and are managed by operators at these remote sites. Palette provides the provisioning of workload clusters on such edge appliances from its SaaS-based management console. Besides provisioning of the cluster, Palette also provides end-to-end management of these clusters through operations such as scaling, upgrades, and reconfiguration.

<br />

# Edge Terminology

## Private Cloud Gateway-Edge (PCG-E)

Deploying Edge Clusters requires a Private Cloud Gateway-Edge (PCG-E) to be installed on the appliances for Palette to discover the appliance and provision workload clusters on them. A PCG-E is Palette's on-premises component to support remote Edge devices. Palette PCG-E, once installed on-premises, registers itself with Palette's SaaS portal and enables secure communications between the SaaS portal and the Edge Clusters.


## P6OS

Palette provisions an immutable OS P6OS, embedded with a base Operating System such as Ubuntu, k3OS, etc., and one of the Kubernetes distributions such as CNCF (Cloud Native Computing Foundation), K3s (a Lightweight Kubernetes Distribution), or RKE (Rancher Kubernetes Engine). Palette builds several of these based on the most desired versions of the base operating system and Kubernetes distribution. Examples s(Ubuntu20.0.4+CNCFK8s1.21.3, SLES+K3S). We also encourage our customers to build their own. 

## Gearbox

A Palette framework to build P6OS with elemental Toolkit. This is made available to Palette customers to build custom P6OS using their own base Operating System.

## Palette Upgrade Controller 

A Kubernetes controller to be installed into the workload cluster to facilitate upgrades to new P6OS image.

## TUI 

Interface to site operator to provide site specific settings - NW Settings (Static IP, DHCP, WAN, GW, Proxy) , Palette end point, Device ID override. Palette Edge Manager (Local API) - A web based application that provides APIs for supporting TUI operations & site diagnostics.

## Edge Appliances

Palette supports several kinds of appliances for the Edge deployment. These appliances can be registered with the Palette Management Console and used for provisioning a Virtualized or a Native OS (Native Edge Deployment). The following is the list of all the Palette supported Edge appliance types:


  | **Appliance Type**              | **Environment**                           |
  | :------------------------------ | :---------------------------------------- |
  | Native Edge Deployment          | Bare Metal Machines or Virtual Appliances |
  | Bare Metal Machine              | Virtualized                               |
  | KVM-based virtual machines      | Virtualized                               |
 

**Note:** Palette Edge Manage  & TUI would be embedded in P6OS.

<br />

<InfoBox>

Palette currently supports x86-based Edge devices. ARM-based support will be added subsequently.

</InfoBox>

<br />

## Cluster Types

Palette supports the following two configurations for Edge clusters:

<br />

### Virtualized Edge 

Kubernetes nodes for master and worker pools are launched as Kernel-based Virtual Machines (KVM-based) in the virtualized mode. Each Virtual Machine (VM) represents a Kubernetes node. Users can specify placement settings for these virtual machines to ensure they are launched in the desired network and storage pools. Users can also configure VM hardware settings such as CPU, Memory, Disk size, etc.

![virtualized-edge.png](virtualized-edge.png)


### Native Edge

Palette extends the native containerized application orchestration capabilities to host Native Edge Deployment. The Palette Native Edge solution can run natively on bare metal machines or virtual appliances. The users can choose the machine or appliance based on their intended. It is built upon a highly immutable P6OS with embedded K8s distro, a stable base Operating System and Palette's edge agent. In addition, Palette provides several versions of P6OS with different combinations of base Operating System and Kubernetes distributions.

<br />

