---
sidebar_label: "Architecture"
title: "Architecture"
description: "Learn about Palette Edge and the architecture used to suppport edge clusters."
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

## Minimum Device Requirements

All Edge hosts must meet the following minimum hardware requirements. For specific features, additional hardware
capabilities may be needed. Refer to [Hardware Requirements](./hardware-requirements.md) for details.

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

| Name                                                                                                     | OS               | Kubernetes Distro | CNIs            | CSIs      |
| -------------------------------------------------------------------------------------------------------- | ---------------- | ----------------- | --------------- | --------- |
| Palette Optimized K3s                                                                                    | openSUSE, Ubuntu | K3s               | Calico, Flannel | Rook Ceph |
| Palette Optimized RKE2                                                                                   | openSUSE, Ubuntu | RKE2              | Calico, Flannel | Rook Ceph |
| [Palette eXtended Kubernetes Edge (PXK-E)](../../glossary-all.md#palette-extended-kubernetes-edge-pxk-e) | openSUSE, Ubuntu | CNCF              | Calico, Flannel | Rook Ceph |

## Supported Configurations

Palette offers complete flexibility in deploying clusters at edge sites with various aspects you can customize. The
table below describes these aspects and the available options.

| **Parameter**                     | **Choices**                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cluster Mode                      | - Connected: The site has internet connectivity and the installation is initiated via Palette Management Console<br/> - Air-Gapped: The site does not have internet connectivity. Installation is initiated via the Palette CLI.                                                                                                                                                                                                                                                         |
| OS                                | - Ubuntu<br/>- OpenSUSE<br/>- Bring Your Own OS (BYOOS)                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Kubernetes Flavor                 | - Palette eXtended K8s for Edge FIPS (PXK-E) <br /> - Palette eXtended K8s for Edge (PXK-E)<br/>- Palette Optimized K3s<br/>- Palette Optimized RKE2                                                                                                                                                                                                                                                                                                                                     |
| Kubernetes Version                | - 1.28.x<br/>- 1.29.x<br />- 1.30.x                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| FIPS Mode                         | - True: Enforce usage of FIPS packs and other required FIPS configuration to meet FIPS compliance<br/>- False                                                                                                                                                                                                                                                                                                                                                                            |
| Edge Host Registration Mode       | - Manual: A unique Edge host ID is manually entered into the Palette Management Console <br/> - Auto: Edge hosts automatically register with the Palette through the usage of a registration token supplied in the use-data<br/>- QR Code: Scan a QR code that takes you to a web application that registers the Edge host with Palette. This method is considered advanced with the benefit of simplifying the Edge host registration without needing a tenant token or a manual entry. |
| Edge Host Type - Installer Format | Create an ISO image that contains all your dependencies and custom configurations.                                                                                                                                                                                                                                                                                                                                                                                                       |

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

## Two Node Architecture

Palette Edge allows you to provision a highly available cluster capable of withstanding any single node failure with
only two nodes instead of three. Palette achieves this by sidestepping a critical limitation of etcd and Postgres as the
backend storage through [Kine](https://github.com/k3s-io/kine).

In a typical Kubernetes cluster, a cluster achieves high availability through the backend key-value store etcd. When a
single node goes down, etcd is able to maintain data consistency since its two remaining node can still maintain quorum.
However, this setup requires at least three nodes. A two-node etcd cluster will not be able to withstand the failure of
a node because even the failure of one node will cause the cluster to lose quorum.

In our two-node architecture, instead of etcd, we use a Postgres database as the backend storage and a etcd shim named
Kine that allows the Kubernetes API to communicate with it as if it is an etcd server. One node is the leader and the
other node is the follower. The leader will process write requests and replicate the changes to the follower node. Each
node has a liveness probe that periodically probes the other node. When a node goes down, the other node's liveness
probe will stop receiving responses and the surviving node will remain the leader or be promoted to become the leader.

![Architectural diagram of a two-node architecture](/clusters_edge_architecture_two-node-diagram.webp)

The two-node architecture prioritizes availability, but does make a slight sacrifice in data consistency in a
split-brain scenario. If the cluster experiences a network split that separates the two nodes, both nodes will assume
the other node is down and consider themselves the only leader. Both node can process write requests during this time
and record a timestamp for every state change. When the network split is resolved, the node with the most recent
timestamp will be elected leader and the follower will drop its database to sync with the leader. The data that was
recorded on the losing node during the network split is therefore lost.

### Leader Promotion After Node Failure

When the leader node of a two-node cluster fails, the liveness probe on the follower node will stop returning healthy
results. Once there are enough unhealthy responses, the follower node will initiate the promotion process to promote
itself as the leader. During this time, the different Kubernetes components become temporarily unavailable. The liveness
probe would make adjustments to the instance of Kine on the node so that its requests are now directed to the new leader
node's own instance of Postgres. The probe also performs a few SQL commands on the Postgres table to make sure that it
is ready for when the cluster comes back online.

Once all adjustments have been made, all the Kubernetes cluster will come back online and start processing requests.

### Reintroducing Another Node
