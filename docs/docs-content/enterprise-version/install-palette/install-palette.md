---
sidebar_label: "Installation"
title: "Installation"
description: "Review Palette system requirements and learn more about the various install methods."
icon: ""
hide_table_of_contents: false
tags: ["palette", "self-hosted"]
keywords: ["self-hosted", "enterprise"]
---

Palette is available as a self-hosted application that you install in your environment. The self-hosted version is a dedicated Palette environment hosted on VMware instances or in an existing Kubernetes cluster. Palette is available in the following modes:

| **Supported Platform** | **Description**                                                       | **Install Guide**                                         |
| ---------------------- | --------------------------------------------------------------------- | --------------------------------------------------------- |
| VMware                 | Install Palette in VMware environment.                                | [Install on VMware](install-on-vmware/install.md)         |
| Kubernetes             | Install Palette using a Helm Chart in an existing Kubernetes cluster. | [Install on Kubernetes](install-on-kubernetes/install.md) |

You can also install Palette in an airgap environment. For more information, refer to the [Airgap Installation](airgap/airgap.md) section.

| **Supported Airgap Platform** | **Description**                                                                                                        |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| VMware                        | Install Palette in VMware environment using your own OCI registry server.                                              |
| Kubernetes                    | Install Palette using a Helm Chart in an existing Kubernetes cluster with your own OCI registry server OR use AWS ECR. |

The next sections provide sizing guidelines we recommend you review before installing Palette in your environment.

## Size Guidelines

This section lists resource requirements for Palette for various capacity levels. In Palette VerteX, the terms _small_, _medium_, and _large_ are used to describe the instance size of worker pools that Palette is installed on. The following table lists the resource requirements for each size.

<br />

:::caution

The recommended maximum number of deployed nodes and clusters in the environment should not be exceeded. We have tested the performance of Palette with the recommended maximum number of deployed nodes and clusters. Exceeding these limits can negatively impact performance and result in instability. The active workload limit refers to the maximum number of active nodes and pods at any given time.

:::

<br />

| **Size**             | **Nodes** | **CPU** | **Memory** | **Storage** | **MongoDB Storage Limit** | **MongoDB Memory Limit** | **MongoDB CPU Limit** | **Total Deployed Nodes** | **Deployed Clusters with 10 Nodes** |
| -------------------- | --------- | ------- | ---------- | ----------- | ------------------------- | ------------------------ | --------------------- | ------------------------ | ----------------------------------- |
| Small                | 3         | 8       | 16 GB      | 60 GB       | 20 GB                     | 4 GB                     | 2                     | 1000                     | 100                                 |
| Medium (Recommended) | 3         | 16      | 32 GB      | 100 GB      | 60 GB                     | 8 GB                     | 4                     | 3000                     | 300                                 |
| Large                | 3         | 32      | 64 GB      | 120 GB      | 80 GB                     | 12 GB                    | 6                     | 5000                     | 500                                 |

#### Instance Sizing

| **Configuration**    | **Active Workload Limit**                         |
| -------------------- | ------------------------------------------------- |
| Small                | Up to 1000 Nodes each with 30 Pods (30,000 Pods)  |
| Medium (Recommended) | Up to 3000 Nodes each with 30 Pods (90,000 Pods)  |
| Large                | Up to 5000 Nodes each with 30 Pods (150,000 Pods) |

## Proxy Requirements

- A proxy used for outgoing connections should support both HTTP and HTTPS traffic.

- Allow connectivity to domains and ports in the table.

  <br />

  | **Top-Level Domain**      | **Port** | **Description**                                       |
  | ------------------------- | -------- | ----------------------------------------------------- |
  | spectrocloud.com          | 443      | Spectro Cloud content repository and pack registry    |
  | s3.amazonaws.com          | 443      | Spectro Cloud VMware OVA files                        |
  | gcr.io                    | 443      | Spectro Cloud and common third party container images |
  | ghcr.io                   | 443      | Kubernetes VIP images                                 |
  | docker.io                 | 443      | Common third party content                            |
  | googleapis.com            | 443      | For pulling Spectro Cloud images                      |
  | docker.com                | 443      | Common third party container images                   |
  | raw.githubusercontent.com | 443      | Common third party content                            |
  | projectcalico.org         | 443      | Calico container images                               |
  | quay.io                   | 443      | Common third-party container images                   |
  | grafana.com               | 443      | Grafana container images and manifests                |
  | github.com                | 443      | Common third party content                            |

## Resources

- [Install on VMware](install-on-vmware/install-on-vmware.md)

- [Install on Kubernetes](install-on-kubernetes/install.md)

- [Airgap Installation](airgap/airgap.md)

- [Architecture Diagram and Network Ports](../../architecture/networking-ports.md#self-hosted-network-communications-and-ports)

- [Enterprise Install Troubleshooting](../../troubleshooting/enterprise-install.md)
