---
sidebar_label: "Architecture"
title: "Architecture"
description: "Learn about Palette Edge and the architecture used to support edge clusters."
hide_table_of_contents: false
sidebar_position: 0
tags: ["edge", "architecture"]
---

The following are architectural highlights of Palette-provisioned Edge native clusters.

- Kubernetes is natively installed on the host.

- Support for bare metal and virtualized edge devices.

- Customizable site properties such as network proxies and certificates.

- Configurable Kubernetes API servers to work with virtual IP address (VIP) or Dynamic DNS.

- Edge artifacts hardened according to
  [Center for Internet Security (CIS) standards](https://www.cisecurity.org/cis-benchmarks).

- Edge supports adding multiple devices to the site to form a multi-node Kubernetes cluster.

- Operating system (OS) images are derived from immutable container-based OS images provided by the
  [Kairos](http://kairos.io) open source project.

- The installation is bootstrapped using a relatively small distribution-agnostic _Stylus_ installer image. The
  operating system and Kubernetes version are derived from cluster profile settings associated with the edge site and
  dynamically downloaded and installed.

- Palette Edge Distribution supports use cases that require customizing OS packages, device drivers, and more.

  ![Architecture diagram of Edge](/native-edge.webp "#title=An architecture diagram of Palette and all of the components.")

## Limitations

<!-- prettier-ignore-start -->

- The <VersionedLink text="Palette Optimized Canonical" url="/integrations/packs/?pack=edge-canonical" /> pack does not
  support the following:

  - ARM64 architecture
  - Palette VerteX
  - Custom installation paths for Kubernetes and its dependencies in [agent mode](../../../deployment-modes/agent-mode/)
  - [Network overlay](../networking/vxlan-overlay/) in locally managed Edge clusters.
  - High availability mode with one or two nodes.

<!-- prettier-ignore-end -->

- When scaling down a Palette Optimized Canonical Kubernetes cluster with two nodes, ensure you do not delete the leader
  node. In this configuration, one node is the leader (and voter), while the other is a spare. Deleting the leader will
  render the cluster inaccessible, as database updates are not replicated to the spare node.

## Minimum Device Requirements

All Edge hosts must meet the following minimum hardware requirements. For specific features, additional hardware
capabilities may be needed. Refer to [Hardware Requirements](../hardware-requirements.md) for details.

### AMD64 Architecture Devices

| Component | Requirement                                                                                                                                               |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CPU       | - Intel: i3, i5, i7, i9, Xeon series <br /> - AMD: Ryzen 3, 5, 7, 9, and Epyc series                                                                      |
| CPU Core  | Minimum two cores.                                                                                                                                        |
| Memory    | Minimum 8 GB.                                                                                                                                             |
| Storage   | Main drive requires a minimum of 100 GB storage to accommodate the Operating System (OS), Kubernetes, and workloads. The main drive must be an SSD drive. |

### ARM64 Architecture Devices

ARM64 support is only verified for the Nvidia Jetson Orin device family.

## Palette Edge Distribution

Palette provides the following distributions for edge installations.

| Name                                                                                                        | Kubernetes Distribution | OS               | CNIs            | CSIs      |
| ----------------------------------------------------------------------------------------------------------- | ----------------------- | ---------------- | --------------- | --------- |
| <VersionedLink text="Palette eXtended Kubernetes Edge (PXK-E)" url="/integrations/packs/?pack=edge-k8s" />   | CNCF                    | openSUSE, Ubuntu | Calico, Flannel | Rook Ceph |
| <VersionedLink text="Palette Optimized Canonical" url="/integrations/packs/?pack=edge-canonical" />                                                                                 | Canonical Kubernetes    | Ubuntu           | Calico, Cilium  | Longhorn  |
| <VersionedLink text="Palette Optimized K3s" url="/integrations/packs/?pack=edge-k3s" />                                                                                          | K3s                     | openSUSE, Ubuntu | Calico, Flannel | Rook Ceph |
| <VersionedLink text="Palette Optimized RKE2" url="/integrations/packs/?pack=edge-rke2" />                                                                                       | RKE2                    | openSUSE, Ubuntu | Calico, Flannel | Rook Ceph |


## Supported Configurations

Palette offers complete flexibility in deploying clusters at edge sites with various aspects you can customize. The
table below describes these aspects and the available options.

| **Parameter**                     | **Choices**                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Management Mode                   | - Central: The site has a connection to Palette and is managed centrally via Palette Management Console<br/> - Local: The site does not have a connection to Palette and is managed locally.                                                                                                                                                                                                                                                                                              |
| OS                                | - Ubuntu<br/>- OpenSUSE<br/>- Bring Your Own OS (BYOOS)                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Kubernetes Flavor                 | - <VersionedLink text="Palette eXtended Kubernetes Edge (PXK-E)" url="/integrations/packs/?pack=edge-k8s" /> (FIPS and non-FIPS) <br/> - <VersionedLink text="Palette Optimized Canonical" url="/integrations/packs/?pack=edge-canonical" />  <br/> - <VersionedLink text="Palette Optimized K3s" url="/integrations/packs/?pack=edge-k3s" /> <br/>- <VersionedLink text="Palette Optimized RKE2" url="/integrations/packs/?pack=edge-rke2" />                                                                                                                                                                                                                                                                                                |
| Kubernetes Version                | - 1.26.x<br/>- 1.27.x<br/>- 1.28.x<br/>- 1.29.x<br/>- 1.30.x<br/>- 1.31.x<br/>- 1.32.x <br/>- 1.33.x                                                                                                                                                                                                                                                                                                                                                                                      |
| FIPS Mode                         | - True: Enforce usage of FIPS packs and other required FIPS configuration to meet FIPS compliance<br/>- False                                                                                                                                                                                                                                                                                                                                                                             |
| Edge Host Registration Mode       | - Manual: A unique Edge host ID is manually entered into the Palette Management Console <br/> - Auto: Edge hosts automatically register with the Palette through the usage of a registration token supplied in the user-data<br/>- QR Code: Scan a QR code that takes you to a web application that registers the Edge host with Palette. This method is considered advanced with the benefit of simplifying the Edge host registration without needing a tenant token or a manual entry. |
| Edge Host Type - Installer Format | Create an ISO image that contains all your dependencies and custom configurations.                                                                                                                                                                                                                                                                                                                                                                                                        |

## Kubernetes Defaults

The following items are disabled by default for RKE2 and K3s.

- Traefik

- SERVICE-lb

- local-path provisioner

- Flannel

**Example Scenario:**

For the Palette optimized K3s pack, the default network component flannel is disabled to allow the user to independently
use any container network interface pack such as Flannel or others, as part of the network layer of a cluster profile.

The component metrics server is disabled to avoid duplicating it because Palette installs the metrics server by default.

```yaml
cluster:
  config:
    # disable the built in cni
    flannel-backend: none
    no-flannel: true
    disable-network-policy: true
    Disable:
      - metrics-server
```
