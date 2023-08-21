---
title: "Edge"
metaTitle: "Creating new clusters on Spectro Cloud"
metaDescription: "The methods of creating clusters for a speedy deployment on any CSP"
hideToC: false
icon: "hdd"
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview

Edge clusters are Kubernetes clusters set up on Edge hosts installed in isolated locations like grocery stores and restaurants versus a data center or cloud environment. These Edge hosts can be bare metal machines or virtual machines and are managed by operators at remote sites. 

Palette provisions workload clusters on Edge hosts from the Palette management console. Palette also provides end-to-end cluster management through scaling, upgrades, and reconfiguration operations.


Edge computing brings computing and data storage closer to the source, reducing latency and bandwidth issues that result from central computing and improving overall application performance. Industries such as retail, restaurants, manufacturing, oil and gas, cruise ships, healthcare, and 5G telecommunication providers typically have use cases that require content data and processing to be closer to their applications. 


<br />

![A drawing of Edge architecture with humans interacting](/clusters_edge_edge-arch-drawing.png)

<br />



The following are some highlights of the comprehensive Palette Edge Solution:

<br />

* Centralized Full Stack Management


* Low touch, plug-and-play setup


* Support for AMD64 and ARM64 (beta) architectures  


* Immutable update for Kubernetes and operating system (OS) with zero downtime


* Distro-agnostic Kubernetes and OS


* Secured remote troubleshooting


* Scalable from tens to thousands of locations


* Support for pre-provisioned and on-site device registration 




Palette's Edge solution is designed for sites that typically have one or more small devices, such as [Intel NUC](https://www.intel.com/content/www/us/en/products/docs/boards-kits/nuc/what-is-nuc-article.html). An instance of Palette optimized for edge computing is installed in the device along with the operating system and Kubernetes.


<br />

<InfoBox>

Edge is built on top of the open-source project [Kairos](https://kairos.io), which provides a tamper-proof immutable operating system with zero downtime rolling upgrade.

</InfoBox>

Palette manages the installation and all the Day-2 activities, such as scaling, upgrades, and reconfiguration.

<br />

<WarningBox>

Edge is still in active development and is subject to change. Review the Palette [release notes](/release-notes) for updates and changes.


</WarningBox>


<br />



# Get Started With Edge


To start with Edge, review the [architecture](/clusters/edge/architecture) and the [lifecycle](/clusters/edge/edge-native-lifecycle) resource to gain a high-level understanding of the Edge components and installation process. Next, become familiar with the [EdgeForge workflow](/clusters/edge/edgeforge-workflow). EdgeForge is the workflow you will use to customize the Edge host installation to match your environment and organizational needs - this includes creating the Edge artifacts for Edge hosts. The last step of the Edge deployment lifecycle is the deployment step. Review the [Deployment](/clusters/edge/site-deployment) guide to understand what it takes to deploy an Edge host.

<br />


# Resources

- [Edge Native Architecture](/clusters/edge/architecture)


- [Deployment Lifecycle](/clusters/edge/edge-native-lifecycle)


- [Install Configuration](/clusters/edge/edge-configuration)


- [EdgeForge Workflow](/clusters/edge/edgeforge-workflow)


- [Site Deployment](/clusters/edge/site-deployment)

<br />
