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

The following are some architectural highlights of bare-metal Kubernetes clusters that Palette deploys using Canonical's MAAS.  Canonical MAAS is an open-source tool that lets you discover, commission, deploy, and dynamically reconfigure a large network of individual units.

- Palette supports the use of MAAS with Spectro Cloud’s open source Cloud Native Computing Foundation (CNCF) Cluster API that supports Canonical MAAS: https://github.com/spectrocloud/cluster-api-provider-maas.

- Palette provides a cloud-like experience for deploying clusters on bare metal servers. The result is increased performance at minimal cost and operational effort.

- The PCG is Palette's on-prem component that enables support for isolated private cloud or data center environments. When the PCG is installed, it registers itself with Palette's SaaS portal and enables secure communication between the SaaS portal and the private cloud environment. The gateway enables installation and end-to-end lifecycle management of Kubernetes clusters in private cloud environments from Palette's SaaS portal. 

![maas_cluster_architecture.png](maas_cluster_architecture.png)


