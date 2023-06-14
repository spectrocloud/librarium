---
title: "Deployment"
metaTitle: "Edge Site Deployment"
metaDescription: "Learn about the Palette Edge installation process."
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview


The Edge host deployment process consists of four phases described in the following table.

| Phase| Description|
| ---| ---|
| Model Cluster Profile | The process of creating a [cluster profile](/cluster-profiles) for the host cluster that will be made up of Edge hosts. |
| Install Handoff | The Edge Installer is copied over from a portable storage device to the Edge host's hard disk. This step is typically performed in the preparation step. Refer to [Prepare Edge Hosts for Installation](/clusters/edge/site-deployment/stage) to learn more.|
| Registration |  The Edge host is registered with Palette. The Edge host will remain in this phase until the registration process is complete.|
|Cluster Provisioning | The Edge host boots into the specified provider OS and proceeds with the cluster deployment.|


Review the following guides in sequential order to successfully deploy an Edge host.

<br />

1. [Model Edge Native Cluster Profile](/clusters/edge/site-deployment/model-profile)


2. [Prepare Edge Hosts for Installation](/clusters/edge/site-deployment/stage)


3. [Perform Site Install](/clusters/edge/site-deployment/site-installation)

<InfoBox>

In a lab environment, you must perform all the steps. In a non-learning environment, these steps are typically performed by people with different roles. The Palette Edge lifecycle is explained in detail in the [lifecycle](/clusters/edge/edge-native-lifecycle) resource, highlighting the various roles involved.

</InfoBox>


# Resources

- [Model Cluster Profile](/clusters/edge/site-deployment/model-profile)


- [Prepare Edge Hosts for Installation](/clusters/edge/site-deployment/stage)


- [Perform Site Install](/clusters/edge/site-deployment/site-installation)


- [Register Edge Host](/clusters/edge/site-deployment/site-installation/edge-host-registration)


- [Create Cluster Definition](/clusters/edge/site-deployment/site-installation/cluster-deployment)
