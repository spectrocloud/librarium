---
sidebar_label: "Installation"
title: "Installation"
description: "Review Palette VerteX system requirements."
icon: ""
hide_table_of_contents: false
tags: ["vertex"]
keywords: ["self-hosted", "vertex"]
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

<PartialsComponent category="self-hosted" name="size-guidelines" edition="VerteX" />

## Proxy Requirements

<PartialsComponent category="self-hosted" name="required-domains" edition="VerteX" />

## Resources

- [Install on VMware vSphere](install-on-vmware/install-on-vmware.md)

- [Install Using Helm Chart](install-on-kubernetes/install-on-kubernetes.md)

- [Airgap Installation](airgap/airgap.md)
