---
title: "OS Patching"
metaTitle: "Managing Cluster Update Events on Spectro Cloud"
metaDescription: "Events and Notifications on Cluster Updates"
hideToC: false
fullWidth: false
---

import Tabs from '@librarium/shared/src/components/ui/Tabs';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import InfoBox from '@librarium/shared/src/components/InfoBox';
import PointsOfInterest from '@librarium/shared/src/components/common/PointOfInterest';




# Overview

Spectro Cloud deploys Kubernetes clusters using pre-built VM images. The operating system on these images is the latest patch version at the time of building the image for the supported major-minor streams. As an example, if Ubuntu 18.04 is selected for the OS layer during provisioning, the OS on the cluster nodes might be 18.04.3 LTE, assuming that was the latest at the time the VM image was built. However, newer versions continue to be published in the upstream repositories as improvements, bug fixes and security patches are released. OS Patching allows operating system on the running clusters nodes to be updated to the latest patch version so that it is up-to-date with the latest fixes. In our example, let us assume 18.04.4 LTE and 18.04.5 LTE are released over time to fix important security issues. OS Patching operation will identify 18.04.5 as the latest version and upgrade to it on the cluster nodes. Following choices are available for patching the operating system to the latest version.
 

# Patch on boot
During the cluster creation, while configuring the cluster (Cluster Configuration), the user can select “Patch OS on boot”. In this case, the operating system on all cluster nodes will be updated to the latest when the cluster VMs are initially deployed.

|  **During Cluster Creation**       |
| -----------------------------------|
|Cluster Configuration -> "Patch on Boot" |


# Scheduled
Besides patching on boot, the users also have the option to set a schedule for OS patching. Patching schedule can be set initially when creating a cluster as well as at any given point later. Following scheduling options are provided:

* Every week on Sunday at midnight
* Every two weeks at midnight
* Every month on the 1st at midnight
* Every two months on the 1st at midnight
* Custom OS patch for an exact month, day, hour and minute of user’s choice

|  **During Cluster Creation**       |
| -----------------------------------|
|Cluster Configuration -> "OS Patching Schedule" |

| **For a Running Cluster**|
|--------------------------|
|Scheduled Patching: Clusters -> Settings -> Cluster Settings -> Machine Management -> “OS Patching Schedule”|


# On demand
This option provides a way to perform an immediate update to the latest version. 

| **For a Running Cluster**|
|--------------------------|
|Scheduled Patching: Clusters -> Settings -> Cluster Settings -> Machine Management -> “OS Patching Schedule”|


<InfoBox>
    This operation is not available for existing Kubernetes clusters imported into Spectro Cloud.
    This operation is not available for managed Kubernetes Services such as EKS, AKS etc. For EKS clusters, an OS update can be triggered from Spectro Cloud. This would initiate a request on AWS to update cluster node groups to the latest patch version. 
</InfoBox>
