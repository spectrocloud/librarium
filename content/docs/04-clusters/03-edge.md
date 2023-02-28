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

Edge Clusters are Kubernetes clusters that are set up on edge hosts installed in isolated locations like grocery stores and restaurants versus a data center or cloud environment. These edge hosts can be bare metal machines or virtual machines and are managed by operators at the remote sites. Palette provisions workload clusters on such edge hosts from the SaaS-based management console. In addition to provisioning clusters, Palette also provides end-to-end cluster management through operations such as scaling, upgrades, and reconfiguration.


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

<WarningBox>

Edge Clusters are still in active development and subject to changes. Review the Palette [release notes](/release-notes) for updates and changes.

</WarningBox>


<br />

# Edge Native

Palette's Edge native solution is designed for sites that typically have one or more small form factor edge hosts, such as [Intel NUC](https://www.intel.com/content/www/us/en/products/docs/boards-kits/nuc/what-is-nuc-article.html). An instance of Palette Edge Distribution based on the desired version of an operating system and Kubernetes is installed natively onto these devices. Palette manages the installation and all the day-two activities, such as scaling, upgrades, and reconfiguration.


Edge native is built on top of the open source project [Kairos](https://kairos.io), which provides a tamper-proof immutable operating system with zero downtime rolling upgrade.


<!-- ### Virtualized Edge

Designed for sites that typically have a single large bare-metal appliance. Virtualized nodes are instantiated on the appliance using libvirt, and the desired version of OS and Kubernetes is deployed on the nodes. Each Virtual Machine (VM) represents a Kubernetes node. Users can specify placement settings for these virtual machines to ensure they are launched in the desired network and storage pools. Users can also configure VM hardware settings such as CPU, Memory, Disk size, etc.

<br />

<WarningBox>

Palette recommends Virtualized Edge deployment only when the user has a single edge appliance and needs HA virtualized Kubernetes Cluster.

[Contact Spectro support via the Service Desk](http://support.spectrocloud.io/) for more details on the deployment of Virtualized Edge Architecture.

</WarningBox> -->


<br />

# Resources

- [Edge Native Architecture](/clusters/edge/architecture)

- [Deployment Lifecycle](/clusters/edge/edge-native-lifecycle)

- [Create an Installer Image](/clusters/edge/installer-image)

- [Register and Manage Edge Native Clusters](/clusters/edge/native)

<br />
