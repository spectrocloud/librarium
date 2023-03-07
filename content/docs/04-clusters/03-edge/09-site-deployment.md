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

Palette provides complete flexibility around various aspects invovled in deployment of clusters at edge sites. The following table describes these aspects with possible choices.

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
