---
title: "Architecture"
metaTitle: "Palette Edge Architecture"
metaDescription: "Learn about Palette Edge and the architecture used to suppport edge clusters."
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview

The following are architectural highlights of Palette-provisioned Edge native clusters.

<br />

* Kubernetes is natively installed on the host.


* Support for bare metal and virtualized edge devices.


* Customizable site properties such as network proxies and certificates.


* Configurable Kubernetes API servers to work with virtual IP address (VIP) or Dynamic DNS.


* Edge supports adding multiple devices to the site to form a multi-node Kubernetes cluster.


* Operating system (OS) images are derived from immutable container-based OS images provided by the [Kairos](http://kairos.io) open-source project.


* The installation is bootstrapped using a relatively small distribution-agnostic *Stylus* installer image. The operating system and Kubernetes version are derived from cluster profile settings associated with the edge site and dynamically downloaded and installed.


* Palette Edge Distribution supports use cases that require customizing OS packages, device drivers, and more.

![Architecture diagram of Edge](/native-edge.png "#title=An architecture diagram of Palette and all of the components.")


# Minimum Device Requirements

The following minimum device requirements must be met to deploy an Edge host successfully.

* 4 Gb of Memory.


* 50 Gb of Storage.


* 2nd generation of Trusted Platform Module (TPM)- TPM 2.0.


# Palette Edge Distribution

Palette provides the following distributions for edge installations.

|Name|OS |Kubernetes Distro|CNIs|CSIs|
|----|---|----------|----|----|
|Palette Optimized K3s |openSUSE, Ubuntu  |K3s |Calico, Flannel|Rook Ceph|
|Palette Optimized RKE2|openSUSE, Ubuntu  |RKE2|Calico, Flannel|Rook Ceph|
|[Palette eXtended Kubernetes Edge (PXK-E)](/glossary-all#paletteextendedkubernetesedge(pxk-e))|openSUSE, Ubuntu|CNCF|Calico, Flannel|Rook Ceph|


# Supported Configurations

Palette offers complete flexibility in deploying clusters at edge sites with various aspects you can customize. The table below describes these aspects and the available options.

| **Parameter**  | **Choices** |
|-|-|
| Cluster Mode |  - Connected: The site has internet connectivity and the installation is initiated via Palette Management Console<br/> - Air-Gapped: The site does not have internet connectivity. Installation is initiated via the Palette CLI.|
| OS | - Ubuntu<br/>- OpenSUSE<br/>- Bring your own OS (BYOOS) |
| K8s Flavor | - Palette eXtended K8s for Edge (PXK-E)<br/>- Palette Optimized K3s<br/>- Palette Optimized RKE2 |
| K8s Version |- 1.24.x<br/>- 1.25.x<br/>- 1.26.x |
| FIPS Mode |- True: Enforce usage of FIPS packs and other required FIPS configuration to meet FIPS compliance<br/>- False |
| Edge Host Registration Mode | - Manual: A unique Edge host ID is manually entered into the Palette Management Console <br/> - Auto: Edge hosts automatically register with the Palette through the usage of a registration token supplied in the use-data<br/>- QR Code: Scan a QR code that takes you to a web application that registers the Edge host with Palette. This method is considered advanced with the benefit of simplifying the Edge host registration without needing a tenant token or a manual entry. |
| Edge Host Type - Installer Format | - Bare Metal - ISO<br/>- Virtual Machine (VMware) - OVA<br/>- Virtual Machine (AWS) - AMI |

<br />


# Kubernetes Defaults

The Kubernetes Packs for Edge Native deployments disable a few items by default to allow users to install those items independently or to avoid duplication. The following items are disabled by default.

* Traefik

* SERVICE-lb

* local-path provisioner

* Flannel

**Example Scenario:**

For the Palette optimized K3s pack, the default network component flannel is disabled to allow the user to independently use any container network interface pack such as Flannel or others, as part of the network layer of a cluster profile.

The component metrics server is disabled to avoid duplicating it because Palette installs the metrics server by default.

```
cluster:
 config:
   # disable the built in cni
   flannel-backend: none
   no-flannel: true
   disable-network-policy: true
   Disable:
     - metrics-server
```

<br />
