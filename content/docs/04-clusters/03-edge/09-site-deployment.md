---
title: "Site Deployment"
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

The deployment of an Edge host contains different options intended to help you install the Edge host in a manner that works best for your environment. Review the following guides in sequential order to successfully deploy an Edge host. 

<br />

1. [Model Edge Native Cluster Profile](/clusters/edge/site-deployment/model-profile)


2. [Prepare Installer User Data](/clusters/edge/site-deployment/prepare-edge-configuration)


3. [Prepare Content Bundle](/clusters/edge/site-deployment/prepare-content-bundle)


4. [Create an Installer Image](/clusters/edge/site-deployment/installer)


5. [Prepare Edge Hosts for Installation](/clusters/edge/site-deployment/stage)


6. [Perform Site Install](/clusters/edge/site-deployment/site-installation)


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

-  [Model Cluster Profile](/clusters/edge/site-deployment/model-profile)


- [Prepare Edge Configuration as User Data](/clusters/edge/site-deployment/prepare-edge-configuration)


- [Prepare Content Bundle](/clusters/edge/site-deployment/prepare-content-bundle)


- [Create an Installer Image](/clusters/edge/site-deployment/installer)


- [Prepare Edge Hosts for Installation](/clusters/edge/site-deployment/stage)


- [Perform Site Install](/clusters/edge/site-deployment/site-installation)


- [Register Edge Host](/clusters/edge/site-deployment/edge-host-registration)


- [Create Cluster Definition](/clusters/edge/site-deployment/cluster-deployment)
