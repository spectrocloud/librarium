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

<!-- # Prerequisites

The following are prerequisites for deploying a Kubernetes cluster in VMware:

<br />

- vCenter version [6.7U3](https://docs.vmware.com/en/VMware-vSphere/6.7/rn/vsphere-esxi-67u3-release-notes.html) or above is recommended.


- Configuration Requirements - A Resource Pool needs to be configured across the hosts,
onto which the workload clusters will be provisioned. Every host in the Resource Pool will
need access to shared storage, such as vSAN, to use high-availability control planes.
Network Time Protocol (NTP) must be configured on each ESXi host.


- You need an active vCenter account with all the permissions listed below in the VMware
Cloud Account Permissions section.


- Install a Private Cloud (PCG) for VMware as described in the [Create a VMware Cloud Gateway](/clusters/data-center/vmware/#createvmwarecloudgateway.) Installing the PCG automatically registers a cloud account for VMware in Palette. You can register additional VMware cloud accounts in Palette as described in [Create a VMware Cloud Account](/clusters/data-center/vmware#createavmwarecloudaccount).


- Subnet with egress access to the internet (direct or via proxy):
  - For proxy: HTTP_PROXY, HTTPS_PROXY (both are required).
  - Outgoing internet connection on port 443 to api.spectrocloud.com.


- The Private cloud gateway IP requirements are:
  - One node - one (1) IP or three (3) nodes - three (3) IPs.
  - One Kubernetes control-plane VIP.
  - One Kubernetes control-plane extra.

  <br />

- Assign IPs for application workload services such as Load Balancer services.


- A DNS to resolve public internet names. For example ``api.spectrocloud.com``.


- Shared Storage between vSphere hosts.


- A cluster profile created in Palette for VMware.


- Zone Tagging: A dynamic storage allocation for persistent storage. -->


<!-- # Zone Tagging

Zone tagging is required for dynamic storage allocation across fault domains when provisioning workloads that require persistent storage. This is required to install the Palette Platform itself and is also helpful for workloads deployed in the tenant clusters if they have persistent storage needs. Use vSphere tags on data centers(k8s-region) and compute clusters (k8s-zone) to create distinct zones in your environment.
  
For example, assume your vCenter environment includes three compute clusters, cluster-1, cluster-2, and cluster-3, that are part of vSphere Object, Tag Category, and Tag value as shown in the table.

| **vSphere Object** | **Tag Category** | **Tag Value** |
|--------------------|------------------|---------------|
| dc-1               | k8s-region       | region1       |
| cluster-1          | k8s-zone         | az1           |
| cluster-2          | k8s-zone         | az2           |
| cluster-3          | k8s-zone         | az3           |



<InfoBox>

The exact values for the k8s-region and k8s-zone tags can be different from the ones described in the above example, if they are unique.

</InfoBox>

## Naming Conventions for vSphere Region and Zone Tags

The following requirements apply to tags:

<br />

- A valid tag must consist of alphanumeric characters.


- The tag must start and end with an alphanumeric characters.


- The regex used for validation is ``(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?``



# Network Requirements

- Outgoing access from the platform VMs to the internet either directly or via a proxy.


- An IP Address (static or DHCP) for the virtual machine.


- A block of five (5) IP addresses reserved for an enterprise cluster: One IP address for each
of the three enterprise cluster VMs, an IP to be used as a VIP, and an additional IP reserved
for rolling upgrades.


- Interconnectivity across all three (3) VMs on all ports. Connectivity from the VMs to the vCenter.

<InfoBox>

Ensure your data center's CIDR IP address does not overlap the Kubernetes PodCIDR range. During installation, you can change the Kubernetes PodCIDR range settings.

</InfoBox> -->


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


<!-- 
| **Configuration** | **Concurrent Cluster Launch Limit** | **Max Nodes** | **CPUs** | **Memory** | **Storage** | **MongoDB Limit**      |
|--------------------|------------------------|-----------|------|--------|---------|--------------------|
| Small              | 4                      | 1000      | 8    | 16 GB  | 120 GB  | 20 GB, 1 CPU, 2 GB Memory    |
| Medium (default)   | 8                      | 3000      | 12   | 32 GB  | 150 GB  | 60 GB, 2 CPU, 4 GB Memory    |
| Large              | 12                     | 5000      | ??   | ?? GB  | ??  GB  | 80 GB, 2 CPU, 5 GB Memory    | -->


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