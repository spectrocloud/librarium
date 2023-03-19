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

<!-- The *Registration* phase has a unique set of instructions. Refer to [Register Edge Host](/clusters/edge/site-deployment/site-installation/edge-host-registration) for guidance. The same applies to the *Cluster Provisioning* phase. You can find the instructions in the [Create Cluster Definition](/clusters/edge/site-deployment/site-installation/cluster-deployment) resource. -->



<!-- Ideally, all Edge hosts have completed the *Install Handoff* phase when they arrive at the installation site. -->

Review the following guides in sequential order to successfully deploy an Edge host.

<br />

1. [Model Edge Native Cluster Profile](/clusters/edge/site-deployment/model-profile)

2. [Prepare Edge Hosts for Installation](/clusters/edge/site-deployment/stage)

3. [Perform Site Install](/clusters/edge/site-deployment/site-installation)

<InfoBox>

In a lab environment, you must perform all the steps. In a non-learning environment, these steps are typically performed by people with different roles. The Palette Edge lifecycle is explained in detail in the [lifecycle](/clusters/edge/edge-native-lifecycle) resource, highlighting the various roles involved.

</InfoBox>

# Supported Configurations

Palette offers complete flexibility in deploying clusters at edge sites with various aspects you can customize. The table below describes these aspects and the available options.

| **Parameter**  | **Choices** |
|-|-|
| Cluster Mode |  - Connected: The site has internet connectivity and the installation is initiated via Palette Management Console<br/> - Air-Gapped: The site does not have internet connectivity. Installation is initiated via the Palette CLI.|
| OS | - Ubuntu<br/>- OpenSUSE<br/>- Bring your own OS (BYOOS) |
| K8s Flavor | - Palette eXtended K8s for Edge (PXK-E)<br/>- Palette Optimized K3s<br/>- Palette Optimized RKE2 |
| K8s Version |- 1.24.x<br/>- 1.25.x<br/>- 1.26.x |
| FIPS Mode |- True: Enforce usage of FIPS packs and other required FIPS configuration to meet FIPS compliance<br/>- False |
| Edge Host Registration Mode | - Manual: A unique Edge host ID is manually entered into the Palette Management Console <br/> - Auto: Edge hosts automatically register with the Palette through the usage of a registration token supplied in the use-data<br/>- QR Code: Scan a QR code that takes you to a web application that registers the Edge host with Palette. This method is considered advanced with the benefit of simplifying the Edge host registration without needing a tenant token or a manual entry. |
| Edge Host Type - Installer Format | - Bare Metal - ISO<br/>- Virtual Machine (VMware) - OVA<br/>- Virtual Machine (AWS) - AMI |

<br />

<InfoBox>

The community resource, Painting with Palette has a great Edge Native [tutorial](https://www.paintingwithpalette.com/tutorials/basic/edge_native/) available.

</InfoBox>

# Resources

- [Model Cluster Profile](/clusters/edge/site-deployment/model-profile)

- [Prepare Edge Hosts for Installation](/clusters/edge/site-deployment/stage)

- [Perform Site Install](/clusters/edge/site-deployment/site-installation)

- [Register Edge Host](/clusters/edge/site-deployment/site-installation/edge-host-registration)

- [Create Cluster Definition](/clusters/edge/site-deployment/site-installation/cluster-deployment)
