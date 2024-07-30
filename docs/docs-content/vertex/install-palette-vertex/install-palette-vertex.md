---
sidebar_label: "Installation"
title: "Installation"
description: "Review Palette VerteX system requirements."
icon: ""
hide_table_of_contents: false
tags: ["vertex"]
---

Palette VerteX is available as a self-hosted application that you install in your environment. The self-hosted version
is a dedicated Palette VerteX environment hosted on VMware instances or in an existing Kubernetes cluster. Palette
VerteX is available in the following modes:

| **Supported Platform** | **Description**                                                              | **Install Guide**                                           |
| ---------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------- |
| VMware                 | Install Palette VerteX in VMware environment.                                | [Install on VMware](./install-on-vmware/install.md)         |
| Kubernetes             | Install Palette VerteX using a Helm Chart in an existing Kubernetes cluster. | [Install on Kubernetes](./install-on-kubernetes/install.md) |

## Airgap Installation

You can also install Palette VerteX in an airgap environment. For more information, refer to the
[Airgap Installation](airgap/airgap.md) section.

| **Supported Airgap Platform** | **Description**                                                                                                               | **Install Guide**                                                          |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| VMware                        | Install Palette VerteX in VMware environment using your own OCI registry server.                                              |
| Kubernetes                    | Install Palette VerteX using a Helm Chart in an existing Kubernetes cluster with your own OCI registry server OR use AWS ECR. | [Airgap Install](./install-on-kubernetes/airgap-install/airgap-install.md) |

The next sections describe specific requirements for installing Palette VerteX.

## Size Guidelines

This section lists resource requirements for Palette VerteX for various capacity levels. In Palette VerteX, the terms
_small_, _medium_, and _large_ are used to describe the instance size of worker pools that Palette VerteX is installed
on. The following table lists the resource requirements for each size.

<br />

:::warning

The recommended maximum number of deployed nodes and clusters in the environment should not be exceeded. We have tested
the performance of Palette VerteX with the recommended maximum number of deployed nodes and clusters. Exceeding these
limits can negatively impact performance and result in instability. The active workload limit refers to the maximum
number of active nodes and pods at any given time.

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

<br />

## Proxy Requirements

<PartialsComponent category="self-hosted" name="required-domains" edition="VerteX" />

## Resources

- [Install on VMware vSphere](install-on-vmware/install-on-vmware.md)

- [Install Using Helm Chart](install-on-kubernetes/install-on-kubernetes.md)

- [Airgap Installation](airgap/airgap.md)
