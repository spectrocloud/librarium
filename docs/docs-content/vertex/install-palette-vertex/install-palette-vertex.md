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

| **Method**          | **Supported Platforms**  | **Description**                                                              | **Install Guide**                                           |
| ------------------- | ------------------------ | ---------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Palette CLI         | VMware                   | Install Palette VerteX in VMware environment.                                | [Install on VMware](./install-on-vmware/install.md)         |
| Helm Chart          | Kubernetes               | Install Palette VerteX using a Helm Chart in an existing Kubernetes cluster. | [Install on Kubernetes](./install-on-kubernetes/install.md) |
| Appliance Framework | VMware, Bare Metal, MAAS | Install Palette VerteX using the Appliance Framework ISO file.               | [Install with Appliance Framework](appliance-framework.md)  |

## Airgap Installation

You can also install Palette VerteX in an airgap environment. For more information, refer to the
[Airgap Installation](./airgap.md) section.

| **Method**          | **Supported Airgap Platforms** | **Description**                                                                                                               | **Install Guide**                                                          |
| ------------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Palette CLI         | VMware                         | Install Palette VerteX in VMware environment using your own OCI registry server.                                              |
| Helm Chart          | Kubernetes                     | Install Palette VerteX using a Helm Chart in an existing Kubernetes cluster with your own OCI registry server OR use AWS ECR. | [Airgap Install](./install-on-kubernetes/airgap-install/airgap-install.md) |
| Appliance Framework | VMware, Bare Metal, MAAS       | Install Palette VerteX using the Appliance Framework ISO file.                                                                | [Install with Appliance Framework](appliance-framework.md)                 |

The next sections describe specific requirements for installing Palette VerteX.

## Size Guidelines

<PartialsComponent category="self-hosted" name="size-guidelines" edition="VerteX" />

## Kubernetes Requirements

<!-- prettier-ignore-start -->

The following table presents the Kubernetes version corresponding to each Palette version for
[VMware](../../vertex/install-palette-vertex/install-on-vmware/install-on-vmware.md) and
[Kubernetes](../../vertex/install-palette-vertex/install-on-kubernetes/install-on-kubernetes.md) installations.
Additionally, for VMware installations, it provides the download URLs for the required Operating System and Kubernetes
distribution OVA.

<!-- prettier-ignore-end -->

<Tabs>
<TabItem label="VMware" value="VMware">

<PartialsComponent category="vertex" name="palette-vmware-kubernetes-versions" />

</TabItem>

<TabItem label="Kubernetes" value="Kubernetes">

<PartialsComponent category="self-hosted-and-vertex" name="palette-kubernetes-versions" />

</TabItem>
</Tabs>

## Proxy Requirements

<PartialsComponent category="self-hosted" name="required-domains" edition="VerteX" />

## Resources

- [Install on VMware vSphere](install-on-vmware/install-on-vmware.md)

- [Install Using Helm Chart](install-on-kubernetes/install-on-kubernetes.md)

- [Airgap Installation](./airgap.md)
