---
title: "Installation"
metaTitle: "Installation"
metaDescription: "Review Palette VerteX system requirements."
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Overview

Palette VerteX is available as a self-hosted application that you install in your environment. The self-hosted version is a dedicated Palette VerteX environment hosted on VMware instances or in an existing Kubernetes cluster. Self-hosted Palette is available in the following modes:

| **Supported Platform** | **Description**                    |
|------------------------|------------------------------------|
| VMware                 | Install Palette VerteX in VMware environment. |
| Kubernetes             | Install Palette VerteX using a Helm Chart in an existing Kubernetes cluster. |

The next sections describe specific requirements for installing Palette VerteX.

# Proxy Requirements

- A proxy used for outgoing connections should support both HTTP and HTTPS traffic.


- Allow connectivity to domains and ports in the table.

| **Top-Level Domain**       | **Port** | **Description**                                 |
|----------------------------|----------|-------------------------------------------------|
| spectrocloud.com           | 443      | Spectro Cloud content repository and pack registry |
| s3.amazonaws.com           | 443      | Spectro Cloud VMware OVA files                  |
| gcr.io                     | 443      | Spectro Cloud and common third party container images |
| docker.io                  | 443      | Common third party content                       |
| googleapis.com             | 443      | For pulling Spectro Cloud images                 |
| docker.com                 | 443      | Common third party container images              |
| raw.githubusercontent.com  | 443      | Common third party content                       |
| projectcalico.org          | 443      | Calico container images                          |
| quay.io                    | 443      | Common 3rd party container images                |
| grafana.com                | 443      | Grafana container images and manifests           |
| github.com                 | 443      | Common third party content                       |


# Self-Hosted Configuration

This section lists resource requirements for Palette VerteX for various capacity levels. Capacity levels are defined as follows:

<br />

- **Capacity Level**: The number of concurrent provisioning or deletion requests for enterprise clusters.


- **Total managed clusters**: The number of deployed enterprise clusters that are active in parallel.

In Palette, the terms *small*, *medium*, and *large* are used to describe the instance size of worker pools. 

<br />

<InfoBox>

The size of the enterprise cluster, in terms of the number or size of the clusters, does not impact the capacity guidance in the tables below.

</InfoBox>


| **Configuration**  | **CPUs**| **Memory**| **Storage**                    | **Max Clusters** | 
|--------------------|--------|-----------|---------------------------------|------------------|
| Small              | 8      | 16 GB RAM | 120 GB (MongoDB: 60 GB) Storage | Up to 8          |
| Medium (default)   | 12     | 32 GB RAM | 150 GB (MongoDB: 80 GB) Storage | Up to 12         |
| Large              | ??     | ?? GB RAM | ??  GB (MongoDB: ?? GB) Storage | Up to ??         |


#### Instance Sizing

| **Configuration** | **Active Workload Limit**                           |
|---------------------|---------------------------------------------------|
| Small               | Up to 1000 Nodes each with 30 Pods (30,000 Pods)  |
| Medium (default)    | Up to 3000 Nodes each with 30 Pods (90,000 Pods)  |
| Large               | Up to 5000 Nodes each with 30 Pods (150,000 Pods) |


<br />

# Resources

- [Install on VMware vSphere](/vertex/install-palette-vertex/install-on-vmware)


- [Install Using Help Chart](/vertex/install-palette-vertex/install-using-helm-chart)


- [Install in an Air Gap Environment](/vertex/install-palette-vertex/install-in-airgap-environment)


<br />

<br />