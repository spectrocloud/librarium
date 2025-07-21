---
sidebar_label: "Installation"
title: "Installation"
description: "Review Palette system requirements and learn more about the various install methods."
icon: ""
hide_table_of_contents: false
tags: ["palette", "self-hosted"]
keywords: ["self-hosted", "enterprise"]
---

Palette is available as a self-hosted application that you install in your environment. Palette is available in the
following modes.

| **Method**                               | **Supported Platforms**  | **Description**                                                       | **Install Guide**                                                            |
| ---------------------------------------- | ------------------------ | --------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Palette CLI                              | VMware                   | Install Palette in VMware environment.                                | [Install on VMware](install-on-vmware/install.md)                            |
| Helm Chart                               | Kubernetes               | Install Palette using a Helm Chart in an existing Kubernetes cluster. | [Install on Kubernetes](install-on-kubernetes/install.md)                    |
| <TpBadge /> Palette Management Appliance | VMware, Bare Metal, MAAS | Install Palette using the Palette Management Appliance ISO file.      | [Install with Palette Management Appliance](palette-management-appliance.md) |

## Airgap Installation

You can also install Palette in an airgap environment. For more information, refer to the
[Airgap Installation](./airgap.md) section.

| **Method**                               | **Supported Airgap Platforms** | **Description**                                                                                                        | **Install Guide**                                                                     |
| ---------------------------------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Palette CLI                              | VMware                         | Install Palette in VMware environment using your own OCI registry server.                                              | [VMware Airgap Install](./install-on-vmware/airgap-install/airgap-install.md)         |
| Helm Chart                               | Kubernetes                     | Install Palette using a Helm Chart in an existing Kubernetes cluster with your own OCI registry server OR use AWS ECR. | [Kubernetes Airgap Install](./install-on-kubernetes/airgap-install/airgap-install.md) |
| <TpBadge /> Palette Management Appliance | VMware, Bare Metal, MAAS       | Install Palette using the Palette Management Appliance ISO file.                                                       | [Install with Palette Management Appliance](palette-management-appliance.md)          |

The next sections provide sizing guidelines we recommend you review before installing Palette in your environment.

## Size Guidelines

<PartialsComponent category="self-hosted" name="size-guidelines" edition="Palette" app="Palette Management Appliance" />

## Kubernetes Requirements

<!-- prettier-ignore-start -->

The following table presents the Kubernetes version corresponding to each Palette version for
[VMware](../../enterprise-version/install-palette/install-on-vmware/install-on-vmware.md) and
[Kubernetes](../../enterprise-version/install-palette/install-on-kubernetes/install-on-kubernetes.md) installations.
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

## Resources

- [Install on VMware](install-on-vmware/install-on-vmware.md)

- [Install on Kubernetes](install-on-kubernetes/install.md)

- [Airgap Installation](./airgap.md)

- [Architecture Diagram and Network Ports](../../architecture/networking-ports.md#self-hosted-network-communications-and-ports)

- [Enterprise Install Troubleshooting](../../troubleshooting/enterprise-install.md)
