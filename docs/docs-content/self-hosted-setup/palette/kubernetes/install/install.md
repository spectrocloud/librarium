---
sidebar_label: "Installation"
title: "Installation"
description: "Review system requirements for installing self-hosted Palette on an existing Kubernetes cluster"
icon: ""
hide_table_of_contents: false
tags: ["self-hosted", "install", "kubernetes", "helm"]
keywords: ["self-hosted", "install", "kubernetes", "helm"]
---

:::warning

This is the former [Installation](https://docs.spectrocloud.com/enterprise-version/install-palette/) page. Leave only
what is applicable to Kubernetes. Convert to partials for reuse.

:::

Palette is available as a self-hosted application that you install in your environment. Palette is available in the
following modes.

| **Method**                               | **Supported Platforms**  | **Description**                                                       | **Install Guide**                                                                  |
| ---------------------------------------- | ------------------------ | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Palette CLI                              | VMware                   | Install Palette in VMware environment.                                | [Install on VMware](../../vmware/install/install.md)                               |
| Helm Chart                               | Kubernetes               | Install Palette using a Helm Chart in an existing Kubernetes cluster. | Install on Kubernetes                                                              |
| <TpBadge /> Palette Management Appliance | VMware, Bare Metal, MAAS | Install Palette using the Palette Management Appliance ISO file.      | [Install with Palette Management Appliance](../../management-appliance/install.md) |

## Airgap Installation

You can also install Palette in an airgap environment. For more information, refer to the
[Airgap Installation](./airgap.md) section.

| **Method**                               | **Supported Airgap Platforms** | **Description**                                                                                                        | **Install Guide**                                                                  |
| ---------------------------------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Palette CLI                              | VMware                         | Install Palette in VMware environment using your own OCI registry server.                                              | [VMware Airgap Install](../../vmware/install/airgap.md)                            |
| Helm Chart                               | Kubernetes                     | Install Palette using a Helm Chart in an existing Kubernetes cluster with your own OCI registry server OR use AWS ECR. | [Kubernetes Airgap Install](./airgap.md)                                           |
| <TpBadge /> Palette Management Appliance | VMware, Bare Metal, MAAS       | Install Palette using the Palette Management Appliance ISO file.                                                       | [Install with Palette Management Appliance](../../management-appliance/install.md) |

The next sections provide sizing guidelines we recommend you review before installing Palette in your environment.

## Size Guidelines

<PartialsComponent category="self-hosted" name="size-guidelines" edition="Palette" app="Palette Management Appliance" />

## Kubernetes Requirements

<!-- prettier-ignore-start -->

The following table presents the Kubernetes version corresponding to each Palette version for
[VMware](../../vmware/install/install.md) and
Kubernetes installations.
Additionally, for VMware installations, it provides the download URLs for the required Operating System and Kubernetes
distribution OVA.

<!-- prettier-ignore-end -->

<Tabs>
<TabItem label="VMware" value="VMware">

<PartialsComponent category="self-hosted" name="palette-vmware-kubernetes-versions" />

</TabItem>

<TabItem label="Kubernetes" value="Kubernetes">

<PartialsComponent category="self-hosted-and-vertex" name="palette-kubernetes-versions" />

</TabItem>
</Tabs>

## Proxy Requirements

<PartialsComponent category="self-hosted" name="required-domains" edition="Palette" />
