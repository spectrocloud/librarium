---
title: "Architecture"
metaTitle: "GCP Architecture with Palette"
metaDescription: "Learn about the architecture used to support Google Cloud using Palette."
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview

Palette supports Google Cloud Platform (GCP) as one of its public cloud environments. Using Palette, you can effectively manage the entire lifecycle of any combination of new or existing, simple or complex, small or large Kubernetes environments in GCP. Palette gives IT teams complete control, visibility, and production-scale efficiencies to provide developers with highly curated Kubernetes stacks and tools with enterprise-grade security.

The following are some highlights of Palette-provisioned GCP clusters.

<br />

- Control plane nodes and worker nodes are placed within a single private subnet that spans different availability zones within a region.


- A new Virtual Private Cloud (VPC) Network is created with all the network infrastructure components, such as Cloud NAT and a Cloud Router. In addition, firewall rules are created to protect all the API endpoints.


- The Kubernetes API server endpoint is exposed through a Global Load Balancer. Applications deployed into the cluster can use a Regional Load Balancer to expose internal Kubernetes services.


![gcp_cluster_architecture.png](/gcp_cluster_architecture.png)