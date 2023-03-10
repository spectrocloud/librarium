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


7. [Register Edge Host](/clusters/edge/site-deployment/edge-host-registration)


8. [Create Cluster Definition](/clusters/edge/site-deployment/cluster-deployment)

# Supported Configurations

Palette offers complete flexibility in deploying clusters at edge sites, with various aspects you can customize. The table below describes these aspects, along with the available options.

| **Parameter**  | **Choices** |
|-|-|
| Cluster Mode |  Connected - Site has intenet connectivity and installation is initiated via Palette Management Console<br/> Air-Gapped - Site does not have internet connecttivity. Installation is initiated via Palette CLI tool|
| OS | Ubuntu<br/>OpenSUSE<br/>Bring your own OS(BYOOS) |
| K8s Flavor | Palette eXtended K8s for Edge (PXK-E)<br/>Palette Optimized K3s<br/>Palette Optimized RKE2 |
| K8s Version |1.24.x<br/>1.25.x<br/>1.26.x etc. |
| FIPS Mode |True - [Describe what FIPS is]<br/>False |
| Edge Host Registration Mode | Manual - Unique edge host ID manually entered into Palette Management Console <br/>Auto - Edge hosts automaticlally register with Palette Management Console based on registration token supplied part of edge host configuration<br/>QR Code - Advanced setup required. Location to an exernal registration application provided in edge host configuration. Simplifies edge host registration |
| Edge Host Type - Installer Format | Bare Metal - ISO<br/>Virtual Machine (VMware) - OVA<br/>Virtual Machine (AWS) - AMI |

Detailed insallation instructions are provided in the following sections. Installation nuances pertaining to specific environments and scenarios based on options described above, will be highlighted through out these sections as applicable.

<br />

<InfoBox>
In a lab environment, all these steps may be performed by a single user, however in a real world scenario typically these steps will be performed by people with different roles. The Palette Edge lifecycle is explained in detail in the [lifecycle](/clusters/edge/edge-native-lifecycle) resource which highlights various roles involved.

</InfoBox>

<InfoBox>

The community resource, Painting with Palette has a great Edge Native [tutorial](https://www.paintingwithpalette.com/tutorials/basic/edge_native/) available.

</InfoBox>

# Resources

- [Model Cluster Profile]

- [Prepare Edge Configuration as User Data]

- [Build Installer]

- [Site Edge Host Installation]

- [Edge Host Registration]

- [Cluster Deployment]

- [Cluster Management]
