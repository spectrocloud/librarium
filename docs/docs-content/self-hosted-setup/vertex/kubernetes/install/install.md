---
sidebar_label: "Installation"
title: "Installation"
description: "Review system requirements for installing self-hosted Palette VerteX on an existing Kubernetes cluster."
icon: ""
hide_table_of_contents: false
tags: ["self-hosted", "vertex", "install", "kubernetes", "helm"]
keywords: ["self-hosted", "vertex", "install", "kubernetes", "helm"]
---

:::warning

This is the former [Installation](https://docs.spectrocloud.com/vertex/install-palette-vertex/) page. Leave only what is
applicable to Kubernetes. Convert to partials for reuse.

:::

Palette VerteX is available as a self-hosted application that you install in your environment. Palette VerteX is
available in the following modes.

| **Method**                              | **Supported Platforms**  | **Description**                                                              | **Install Guide**                                                                 |
| --------------------------------------- | ------------------------ | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Palette CLI                             | VMware                   | Install Palette VerteX in VMware environment.                                | [Install on VMware](../../vmware/install/install.md)                              |
| Helm Chart                              | Kubernetes               | Install Palette VerteX using a Helm Chart in an existing Kubernetes cluster. | Install on Kubernetes                                                             |
| <TpBadge /> VerteX Management Appliance | VMware, Bare Metal, MAAS | Install Palette VerteX using the VerteX Management Appliance ISO file.       | [Install with VerteX Management Appliance](../../management-appliance/install.md) |

## Airgap Installation

You can also install Palette VerteX in an airgap environment. For more information, refer to the
[Airgap Installation](./airgap.md) section.

| **Method**                              | **Supported Airgap Platforms** | **Description**                                                                                                               | **Install Guide**                                                                 |
| --------------------------------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Palette CLI                             | VMware                         | Install Palette VerteX in VMware environment using your own OCI registry server.                                              |
| Helm Chart                              | Kubernetes                     | Install Palette VerteX using a Helm Chart in an existing Kubernetes cluster with your own OCI registry server OR use AWS ECR. | [Airgap Install](./airgap.md)                                                     |
| <TpBadge /> VerteX Management Appliance | VMware, Bare Metal, MAAS       | Install Palette VerteX using the VerteX Management Appliance ISO file.                                                        | [Install with VerteX Management Appliance](../../management-appliance/install.md) |

The next sections describe specific requirements for installing Palette VerteX.

## Size Guidelines

<PartialsComponent
  category="self-hosted"
  name="size-guidelines-helm-cli"
  edition="VerteX"
  app="VerteX Management Appliance"
/>

## Kubernetes Requirements

<!-- prettier-ignore-start -->

The following table presents the Kubernetes version corresponding to each Palette version for
[VMware](../../vmware/vmware.md) and
[Kubernetes](../kubernetes.md) installations.
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
