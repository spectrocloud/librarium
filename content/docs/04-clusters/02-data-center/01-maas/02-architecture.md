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

Canonical MAAS is an open-source tool that lets you discover, commission, deploy and re-deploy operating systems to physical servers. The following are some architectural highlights of bare-metal Kubernetes clusters that Palette deploys using Canonical MAAS. Refer to the PCG deployment options section below to learn more about PCG deployment.

<br />

- Palette integrates with MAAS through Spectro Cloud’s open source Cloud Native Computing Foundation (CNCF) [Cluster API provider](https://github.com/spectrocloud/cluster-api-provider-maas).
Refer to the table below


- Palette provides a cloud-like experience for deploying clusters on bare metal servers. The result is increased performance at minimal cost and operational effort.


- A Private Cloud Gateway (PCG) that you install in a MAAS cloud using a local installer facilitates communication between Palette and MAAS. The PCG is necessary in MAAS environments where Palette does not have direct network access to the MAAS server. Since MAAS environments are typically in a private network without a central endpoint, the PCG provides this endpoint and also wraps the MAAS environment into a cloud account that you can target for cluster deployment in Palette. Refer to the section below to learn about the PCG deployment options you have. 


- When the PCG is installed, it registers itself with a Palette instance and enables secure communication between the SaaS portal and the private cloud environment. The gateway enables installation and end-to-end lifecycle management of Kubernetes clusters in private cloud environments from Palette's SaaS portal.


  <br />

  The diagram below illustrates how MAAS works with Palette using a PCG.

  ![Network flow from an architectural perspective of how MAAS works with Palette](/maas_cluster_architecture.png)

  <br />

# PCG Deployment Options

Palette can communicate with MaaS using the following deployment options.

<br />


- **Private Cloud Gateway**


- **System Private Gateway**

## Private Cloud Gateway

When a user wants to deploy a new cluster on a bare metal cloud using MAAS with Palette, Palette needs connectivity to MAAS. Often, MAAS is behind a firewall and/or NAT gateway, and Palette cannot reach MAAS directly. 

To address these network challenges, you can deploy a PCG. The PCG optionally supports using a proxy server to access the internet. The PCG will maintain a connection to Palette, and have direct connectivty to MAAS. This allows Palette to create clusters by utilising the PCG to facilitate communication with MAAS.

Once clusters are deployed by Palette, the clusters require connectivity to Palette. They do this either directly via internet gateways or, if a proxy has been configured on the PCG, they will inherit this configuration. At this point, the clusters maintain their own connectivity with Palette. Operations performed on these clusters via Palette will be done without PCG involvement. This means that if the PCG goes down, any clusters that are currently deployed will remain operational and still be managed by Palette, with the exception of full deletion of these clusters.

All Palette deployed clusters will use the PCG cluster during the creation and deletion phase. Once a host cluster is available, the internal Palette agent will communicate with Palette directly. A Palette agent inside each cluster is the originator of all communication, so the network requests are outbound towards Palette. The exception is a host cluster creation or deletion request, where the PCG must be involved because it needs to acquire and release machines provided by MAAS.

Typically, the PCG is used with Palette SaaS. However, if you have a self-hosted Palette instance and it does not have direct access to MAAS, then a PCG is also required. If there is direct access, then you can utilise the System Private Gateway, detailed below.

  <br />


## System Private Gateway

In the case where a self-hosted Palette instance can communicate directly with a MAAS installation, then a System Private Gateway can be used. A System Private Gateway is simply a PCG service running inside the self-hosted Palette instance. 

Only self-hosted Palette instances provide the option of using the System Private Gateway.

When registering a MAAS cloud account with Palette, toggle on **Use System Private Gateway** to enable direct communication between Palette and MAAS. Refer to the [Register and Manage MAAS Cloud Account](/clusters/data-center/maas/register-manage-maas-cloud-accounts) guide to learn more.

The following table explains the different use cases between PCG and System Private Gateway. 

<br />

| Scenario | Private Cloud Gateway | System Private Gateway |
|-----------|----|----------------|
| Firewall or NAT between MAAS and a Palette instance | ✅ | ❌ |
| Direct connectivity between MAAS and a Palette instance | ✅ | ✅ |


<br />
