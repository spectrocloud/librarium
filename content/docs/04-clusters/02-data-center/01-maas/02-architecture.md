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


- A Private Cloud Gateway (PCG) that you install into a MAAS cloud using a local installer facilitates communication between Palette and MAAS. The PCG is necessary in MAAS environments where Palette does not have direct network access to the MAAS server. Since MAAS environments are typically in a private network without a central endpoint, the PCG provides this endpoint and also wraps the MAAS environment into a cloud account that you can target for cluster deployment in Palette.  

  <br />

  The diagram below illustrates how MAAS works with Palette using a PCG.

  <br />

- When the PCG is installed, it registers itself with a Palette instance and enables secure communication between the SaaS portal and the private cloud environment. The gateway enables installation and end-to-end lifecycle management of Kubernetes clusters in private cloud environments from Palette's SaaS portal.



- Self-hosted Palette instances can communicate directly with the MAAS environment if both resources can access each other directly over the network. In this scenario, you can use the system PCG. When you register a MAAS account with Palette, you would select **Use System Private Gateway** to enable direct communication between Palette and MAAS. Refer to the [Register and Manage MAAS Cloud Account](/clusters/data-center/maas/register-manage-maas-cloud-accounts) guide to learn more. For the self-hosted Palette instance, MAAS on port 5240 is reachable.

  

The table below lists when you would use Palette's PCG or the System Private Gateway. 

<br />

| Attribute | PCG | System Private Gateway |
|-----------|----|----------------|
| Connects to Palette SaaS. | ✅ | ❌ |
| Connects to self-hosted Palette. | ✅ | ✅ |
| Direct network access to MAAS from self-hosted Palette.  |  ❌ | ✅ |
| Environment requires internet access. |   ✅  | ❌ |


<br />

![Network flow from an architectural perspective of how MAAS works with Palette](/maas_cluster_architecture.png)