---
title: "Architecture"
metaTitle: "MAAS Architecture with Palette"
metaDescription: "Learn about the architecture used to support MAAS using Palette"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# MAAS Bare-Metal Kubernetes Architecture

The following are some architectural highlights of bare-metal Kubernetes clusters that Palette deploys using Canonical MAAS. Canonical MAAS is an open-source tool that lets you discover, commission, deploy and re-deploy operating systems to physical servers.
<br />

- Palette integrates with MAAS through Spectro Cloud’s open source Cloud Native Computing Foundation (CNCF) [Cluster API provider](https://github.com/spectrocloud/cluster-api-provider-maas).


- Palette provides a cloud-like experience for deploying clusters on bare metal servers. The result is increased performance at minimal cost and operational effort.


- A Private Cloud Gateway (PCG) that you install into a MAAS cloud using a local installer will facilitate communication between Palette and MAAS. This is necessary because Palette needs to communicate with a specific MAAS server. However, MAAS environments are typically in a private network without a central endpoint. The PCG provides this endpoint and also wraps the MAAS environment into a cloud account that you can target for cluster deployment in Palette.  


- When the PCG is installed, it registers itself with a Palette instance and enables secure communication between the SaaS portal and the private cloud environment. The gateway enables installation and end-to-end lifecycle management of Kubernetes clusters in private cloud environments from Palette's SaaS portal.

![Network flow from an architectural perspective of how MAAS works with Palette](/maas_cluster_architecture.png)


