---
sidebar_label: "Edge"
title: "Edge"
description: "The methods of creating clusters for a speedy deployment on any CSP"
hide_table_of_contents: false
sidebar_custom_props: 
  icon: "hdd"
tags: ["edge"]
---


Edge clusters are Kubernetes clusters set up on Edge hosts installed in isolated locations like grocery stores and restaurants versus a data center or cloud environment. These Edge hosts can be bare metal machines or virtual machines and are managed by operators at remote sites. 

Palette provisions workload clusters on Edge hosts from the Palette management console. Palette also provides end-to-end cluster management through scaling, upgrades, and reconfiguration operations.


Edge computing brings computing and data storage closer to the source, reducing latency and bandwidth issues that result from central computing and improving overall application performance. Industries such as retail, restaurants, manufacturing, oil and gas, cruise ships, healthcare, and 5G telecommunication providers typically have use cases that require content data and processing to be closer to their applications. 



The following are some highlights of the comprehensive Palette Edge Solution:

* Centralized Full Stack Management


* Low touch, plug-and-play setup


* Immutable update for Kubernetes and operating system (OS) with zero downtime


* Distro agnostic Kubernetes and OS


* Secured remote troubleshooting


* Scalable from tens to thousands of locations


* Support for pre-provisioned and on-site device registration 


<br />

:::caution

Edge is still in active development and is subject to change. Review the Palette [release notes](/release-notes) for updates and changes.


:::

# Edge Native

Palette's Edge native solution is designed for sites that typically have one or more small devices, such as [Intel NUC](https://www.intel.com/content/www/us/en/products/docs/boards-kits/nuc/what-is-nuc-article.html). An instance of Palette optimized for edge computing, along with the operating system and Kubernetes, is installed in the device.

Palette manages the installation and all the Day-2 activities, such as scaling, upgrades, and reconfiguration.

<br />

<InfoBox>

Edge native is built on top of the open source project [Kairos](https://kairos.io), which provides a tamper-proof immutable operating system with zero downtime rolling upgrade.

</InfoBox>

<!-- ### Virtualized Edge

Designed for sites that typically have a single large bare-metal appliance. Virtualized nodes are instantiated on the appliance using libvirt, and the desired version of OS and Kubernetes is deployed on the nodes. Each Virtual Machine (VM) represents a Kubernetes node. Users can specify placement settings for these virtual machines to ensure they are launched in the desired network and storage pools. Users can also configure VM hardware settings such as CPU, Memory, Disk size, etc.

<br />

<WarningBox>

Palette recommends Virtualized Edge deployment only when the user has a single edge appliance and needs HA virtualized Kubernetes Cluster.

[Contact Spectro support via the Service Desk](http://support.spectrocloud.io/) for more details on the deployment of Virtualized Edge Architecture.

</WarningBox> -->


<br />

## Get Started With Edge


To start with Edge, review the [architecture](/clusters/edge/architecture) and the [lifecycle](/clusters/edge/edge-native-lifecycle) resource to gain a high-level understanding of the Edge components and installation process. Next, become familiar with the EdgeForge workflow to configure the installation process to match your environment and organizational needs. The last step of the Edge deployment lifecycle is the deployment step. Review the [Deployment](/clusters/edge/site-deployment) guide to understand what it takes to deploy an Edge host.


## Resources

- [Edge Native Architecture](/clusters/edge/architecture)


- [Deployment Lifecycle](/clusters/edge/edge-native-lifecycle)


- [Install Configuration](/clusters/edge/edge-configuration)


- [EdgeForge Workflow](/clusters/edge/edgeforge-workflow)


- [Site Deployment](/clusters/edge/site-deployment)

