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

Canonical MAAS is an open-source tool that lets you discover, commission, deploy and re-deploy operating systems to physical servers. The following are some architectural highlights of bare-metal Kubernetes clusters that Palette deploys using Canonical MAAS. Refer to the [Deploy with Private Cloud Gateway (PCG) and System Private Gateway](#deploy-with-private-cloud-gateway-pcg-and-system-private-gateway) to learn more about PCG deployment.

<br />

- Palette integrates with MAAS through Spectro Cloud’s open source Cloud Native Computing Foundation (CNCF) [Cluster API provider](https://github.com/spectrocloud/cluster-api-provider-maas).
Refer to the table below


- Palette provides a cloud-like experience for deploying clusters on bare metal servers. The result is increased performance at minimal cost and operational effort.


- A Private Cloud Gateway (PCG) that you install in a MAAS cloud using a local installer facilitates communication between Palette and MAAS. The PCG is necessary in MAAS environments where Palette does not have direct network access to the MAAS server. Since MAAS environments are typically in a private network without a central endpoint, the PCG provides this endpoint and also wraps the MAAS environment into a cloud account that you can target for cluster deployment in Palette. Refer to the section below to learn about the PCG deployment options you have. 

  <br />

  The diagram below illustrates how MAAS works with Palette using a PCG.

  ![Network flow from an architectural perspective of how MAAS works with Palette](/maas_cluster_architecture.png)

  <br />

- When the PCG is installed, it registers itself with a Palette instance and enables secure communication between the SaaS portal and the private cloud environment. The gateway enables installation and end-to-end lifecycle management of Kubernetes clusters in private cloud environments from Palette's SaaS portal.



# PCG Deployment Options

You can deploy MaaS using the following deployment options.

<br />


- Using the **Private Cloud Gateway (PCG)**


Palette-deployed host clusters need to communicate with Palette throughout their entire lifecycle. When host clusters are deployed into private networks, accessing the Palette SaaS platform can be a challenge due to network restrictions. To address these network challenges, you can deploy a PCG and allow the PCG cluster to access the internet and receive inbound communication from the Palette SaaS platform. This solution lets you secure your private network by centralizing all Palette inbound communication with a dedicated instance. 
  
All Palette deployed clusters will use the PCG cluster during the creation and deletion phase. Once a host cluster is available, the internal Palette agent will communicate with Palette directly. The Palette agent is the originator of all communication, so the network requests are outbound towards Palette. The exception is a host cluster creation or deletion request, as those requests are sourced from Palette SaaS and are directed to the PCG.   

  Deploy a separate PCG for a self-hosted Palette instance when Palette does not have access to your target network due to firewalls or NAT blocking inbound traffic. 

  <br />


- Using the **System Private Gateway**


 Self-hosted Palette instances can communicate directly with the MAAS environment if both resources can access each other directly over the network. In this scenario, you can use the System Private Gateway. The System Private Gateway communicates directly with the MaaS environment. 

  When registering a MAAS account with Palette, toggle on **Use System Private Gateway** to enable direct communication between Palette and MAAS. Refer to the [Register and Manage MAAS Cloud Account](/clusters/data-center/maas/register-manage-maas-cloud-accounts) guide to learn more.

The following table explains the different use cases between PCG and System Private Gateway. 

<br />


- Connects to Palette SaaS: Defines if the PCG or the System PCG requires connectivity to the Palette SaaS environments.  


- Connects to self-hosted Palette: If a PCG or a System PCG supports an architecture where it can communicate with a self-hosted Palette instance. 


- Supports direct communication with MAAS : If direct communication with the MaaS environment is supported without the need for an intermediary. Direct communication happens if both resources can directly access each other over the network. 


- Internet access required: If the component PCG or System PCG requires public internet access. 

<br />

| Scenario | Private Cloud Gateway | System Private Gateway |
|-----------|----|----------------|
| Connects to Palette SaaS. | ✅ | ❌ |
| Connects to self-hosted Palette. | ✅ | ✅ |
| Supports direct communication with MAAS. |  ❌ | ✅ |
| Internet access required. |   ✅  | ❌ |


<br />

