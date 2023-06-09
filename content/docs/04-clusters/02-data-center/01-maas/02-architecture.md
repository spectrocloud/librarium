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

Canonical MAAS is an open-source tool that lets you discover, commission, deploy and re-deploy operating systems to physical servers. The following are some architectural highlights of bare-metal Kubernetes clusters that Palette deploys using Canonical MAAS. 

<br />

- Palette integrates with MAAS through Spectro Cloud’s open source Cloud Native Computing Foundation (CNCF) [Cluster API provider](https://github.com/spectrocloud/cluster-api-provider-maas).


- Palette provides a cloud-like experience for deploying clusters on bare metal servers. The result is increased performance at minimal cost and operational effort.


- A Private Cloud Gateway (PCG) that you install into a MAAS cloud using a local installer will facilitate communication between Palette and MAAS. This is necessary because Palette needs to communicate with a specific MAAS server. However, MAAS environments are typically in a private network without a central endpoint. The PCG provides this endpoint and also wraps the MAAS environment into a cloud account that you can target for cluster deployment in Palette.  

  <br />

  Refer to image below for MAAS Cluster Architecture.

  <br />

- When the PCG is installed, it registers itself with a Palette instance and enables secure communication between the SaaS portal and the private cloud environment. The gateway enables installation and end-to-end lifecycle management of Kubernetes clusters in private cloud environments from Palette's SaaS portal.



- Self-hosted Palette instances can communicate directly with the MAAS environment if both resources are reachable from a networking perspective. You can enable this behavior when registering a MAAS account with Palette. In the Palette MAAS account wizard, select the **Use System Private Gateway** option to enable direct communication between Palette and MAAS.  Refer to the [Register and Manage MAAS Cloud Account](/clusters/data-center/maas/register-manage-maas-cloud-accounts) guide to learn more.

  

The table below distinguishes between the properties of PCG and System Private Gateway: 

<br />

| Property | PCG | System Private Gateway |
|-----------|----|----------------|
| Connects to SaaS Environment| ✅ | ❌ |
| Connects to Self-hosted Environment | ✅ | ✅ |
| Direct Network Access to MAAS from Self-hosted Palette |  ❌ | ✅ |
| Requires Internet Access |   ✅  | ❌ |
| Requires Dedicated Infrastructure | ✅| ❌ |
| Reduces Network Hops | ❌ | ✅ |
| Enabled during Cluster Deployment | ✅ | ✅ |
| Enabled during Cluster Deletion | ✅ | ✅ |
| Separate PCG Installation | ✅ | ❌ |
| Supports VPN or Private Network Connectivity |  ❌  | ✅ |


<br />

![Network flow from an architectural perspective of how MAAS works with Palette](/maas_cluster_architecture.png)