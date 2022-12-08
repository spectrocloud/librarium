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

Edge Clusters are Kubernetes clusters set up on appliances installed in isolated locations such as grocery stores and restaurants, unlike a data center or cloud environment. These appliances can be bare metal machines or virtual machines and are managed by operators at these remote sites. Palette provides the provisioning of workload clusters on such edge appliances from its SaaS-based management console. Besides provisioning of the cluster, Palette also provides end-to-end management of these clusters through operations such as scaling, upgrades, and reconfiguration.

Edge computing brings computing and data storage closer to the source, reducing the latency issues resulting from central computing and improving overall application performance. Industries such as retail, restaurants, manufacturing, oil & gas, cruise ships, healthcare, and 5G telcos typically have use cases that require content data and processing to be closer to the applications. 

Following are the highlights of the comprehensive Palette Edge Solution:

* Centralized Full Stack Management
* Low touch, plug-n-play setup
* Immutable update for K8s and OS with zero downtime
* Distro agnostic Kubernetes and OS
* Secured remote troubleshooting
* Scalable from tens to thousands of locations
* Support for Pre-Provisioned and At-the-Edge registration 


<br />

<WarningBox>

Edge Clusters are still in active development and subject to changes. Review the Palette [release notes](/release-notes) for updates and changes.

</WarningBox>


<br />

# Palette Edge Solutions

Palette Edge Platform provides two solutions for edge, designed to support large and small edge sites:


<br />

### Native Edge

Designed for sites that typically have one or more small form factor appliances such as intel NUC. An instance of Palette Edge Distribution based on the desired version of OS and K8s is installed natively onto the devices. Palette Management Console manages the day-1 installation as well as all the day-2 activities, such as scaling, upgrades, reconfiguration, etc.

Palette's native edge solution is built on top of the open source project Kairos(kairos.io) which provides tamper-proof immutable operating system wil zero down-time rolling upgrades. 

### Virtualized Edge

Designed for sites that typically have a single large bare-metal appliance. Virtualized nodes are instantiated on the appliance using libvirt, and the desired version of OS and Kubernetes is deployed on the nodes. Each Virtual Machine (VM) represents a Kubernetes node. Users can specify placement settings for these virtual machines to ensure they are launched in the desired network and storage pools. Users can also configure VM hardware settings such as CPU, Memory, Disk size, etc.

<br />

<WarningBox>

Palette recommends Virtualized Edge deployment only when the user has a single edge appliance and needs HA virtualized Kubernetes Cluster.

[Contact Spectro support via the Service Desk](http://support.spectrocloud.io/) for more details on the deployment of Virtualized Edge Architecture.

</WarningBox>


<br />

<br />
