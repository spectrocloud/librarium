---
sidebar_label: "Installation"
title: "Installation"
description: "Review Palette system requirements and learn more about the various install methods."
icon: ""
hide_table_of_contents: false
tags: ["palette", "self-hosted"]
keywords: ["self-hosted", "enterprise"]
---

Palette is available as a self-hosted application that you install in your environment. The self-hosted version is a
dedicated Palette environment hosted on VMware instances or in an existing Kubernetes cluster. Palette is available in
the following modes:

| **Supported Platform** | **Description**                                                       | **Install Guide**                                         |
| ---------------------- | --------------------------------------------------------------------- | --------------------------------------------------------- |
| VMware                 | Install Palette in VMware environment.                                | [Install on VMware](install-on-vmware/install.md)         |
| Kubernetes             | Install Palette using a Helm Chart in an existing Kubernetes cluster. | [Install on Kubernetes](install-on-kubernetes/install.md) |

## Airgap Installation

You can also install Palette in an airgap environment. For more information, refer to the
[Airgap Installation](airgap/airgap.md) section.

| **Supported Airgap Platform** | **Description**                                                                                                        | **Install Guide**                                                                     |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| VMware                        | Install Palette in VMware environment using your own OCI registry server.                                              | [VMware Airgap Install](./install-on-vmware/airgap-install/airgap-install.md)         |
| Kubernetes                    | Install Palette using a Helm Chart in an existing Kubernetes cluster with your own OCI registry server OR use AWS ECR. | [Kubernetes Airgap Install](./install-on-kubernetes/airgap-install/airgap-install.md) |

The next sections provide sizing guidelines we recommend you review before installing Palette in your environment.

## Size Guidelines

<PartialsComponent category="self-hosted" name="size-guidelines" edition="Palette" />

## Proxy Requirements

<PartialsComponent category="self-hosted" name="required-domains" edition="Palette" />

## Resources

- [Install on VMware](install-on-vmware/install-on-vmware.md)

- [Install on Kubernetes](install-on-kubernetes/install.md)

- [Airgap Installation](airgap/airgap.md)

- [Architecture Diagram and Network Ports](../../architecture/networking-ports.md#self-hosted-network-communications-and-ports)

- [Enterprise Install Troubleshooting](../../troubleshooting/enterprise-install.md)
