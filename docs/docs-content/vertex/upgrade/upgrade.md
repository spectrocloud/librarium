---
sidebar_label: "Upgrade"
title: "VerteX Upgrade"
description: "Upgrade notes for specific Palette VerteX versions."
icon: ""
hide_table_of_contents: false
sidebar_position: 100
tags: ["vertex", "self-hosted", "upgrade"]
keywords: ["self-hosted", "vertex"]
---

This page offers links and reference information for upgrading self-hosted Palette VerteX instances. If you have
questions or concerns, [reach out to our support team](http://support.spectrocloud.io/).

:::tip

If you are using self-hosted Palette, refer to the [Palette Upgrade](../../enterprise-version/upgrade/upgrade.md) page
for upgrade guidance.

:::

### Private Cloud Gateway

If your setup includes a PCG, make sure to
[allow the PCG to upgrade automatically](../../clusters/pcg/manage-pcg/pcg-upgrade.md) before each major or minor
Palette VerteX upgrade.

## Supported Upgrade Paths

Refer to the following tables for the supported Palette VerteX upgrade paths for
[VMware](../install-palette-vertex/install-on-vmware/install-on-vmware.md) and
[Kubernetes](../install-palette-vertex/install-on-kubernetes/install-on-kubernetes.md) installations.

:::danger

Before upgrading Palette VerteX to a new major version, you must first update it to the latest patch version of the
latest minor version available.

:::

<Tabs>
<TabItem label="VMware" value="VMware">

**4.6.x**

| **Source Version** | **Target Version** |    **Support**     |
| :----------------: | :----------------: | :----------------: |
|       4.6.28       |       4.6.32       | :white_check_mark: |
|       4.6.26       |       4.6.32       | :white_check_mark: |
|       4.6.25       |       4.6.32       | :white_check_mark: |
|       4.6.24       |       4.6.32       | :white_check_mark: |
|       4.6.23       |       4.6.32       | :white_check_mark: |
|       4.6.18       |       4.6.32       | :white_check_mark: |
|       4.6.18       |       4.6.23       | :white_check_mark: |
|       4.6.13       |       4.6.32       | :white_check_mark: |
|       4.6.13       |       4.6.23       | :white_check_mark: |
|       4.6.13       |       4.6.18       | :white_check_mark: |
|       4.6.12       |       4.6.32       | :white_check_mark: |
|       4.6.12       |       4.6.23       | :white_check_mark: |
|       4.6.12       |       4.6.18       | :white_check_mark: |
|       4.6.12       |       4.6.13       | :white_check_mark: |
|       4.6.9        |       4.6.32       | :white_check_mark: |
|       4.6.9        |       4.6.23       | :white_check_mark: |
|       4.6.9        |       4.6.18       | :white_check_mark: |
|       4.6.9        |       4.6.13       | :white_check_mark: |
|       4.6.9        |       4.6.12       | :white_check_mark: |
|       4.6.8        |       4.6.32       | :white_check_mark: |
|       4.6.8        |       4.6.23       | :white_check_mark: |
|       4.6.8        |       4.6.18       | :white_check_mark: |
|       4.6.8        |       4.6.13       | :white_check_mark: |
|       4.6.8        |       4.6.12       | :white_check_mark: |
|       4.6.8        |       4.6.9        | :white_check_mark: |
|       4.6.7        |       4.6.32       | :white_check_mark: |
|       4.6.7        |       4.6.23       | :white_check_mark: |
|       4.6.7        |       4.6.18       | :white_check_mark: |
|       4.6.7        |       4.6.13       | :white_check_mark: |
|       4.6.7        |       4.6.12       | :white_check_mark: |
|       4.6.7        |       4.6.9        | :white_check_mark: |
|       4.6.7        |       4.6.8        | :white_check_mark: |
|       4.6.6        |       4.6.32       | :white_check_mark: |
|       4.6.6        |       4.6.23       | :white_check_mark: |
|       4.6.6        |       4.6.18       | :white_check_mark: |
|       4.6.6        |       4.6.13       | :white_check_mark: |
|       4.6.6        |       4.6.12       | :white_check_mark: |
|       4.6.6        |       4.6.9        | :white_check_mark: |
|       4.6.6        |       4.6.8        | :white_check_mark: |
|       4.6.6        |       4.6.7        | :white_check_mark: |
|       4.5.23       |       4.6.32       | :white_check_mark: |
|       4.5.23       |       4.6.23       | :white_check_mark: |
|       4.5.23       |       4.6.18       | :white_check_mark: |
|       4.5.21       |       4.6.32       | :white_check_mark: |
|       4.5.21       |       4.6.23       | :white_check_mark: |
|       4.5.21       |       4.6.18       | :white_check_mark: |
|       4.5.21       |       4.6.13       | :white_check_mark: |
|       4.5.21       |       4.6.12       | :white_check_mark: |
|       4.5.21       |       4.6.9        | :white_check_mark: |
|       4.5.21       |       4.6.8        | :white_check_mark: |
|       4.5.21       |       4.6.7        | :white_check_mark: |
|       4.5.21       |       4.6.6        | :white_check_mark: |
|       4.5.20       |       4.6.23       | :white_check_mark: |
|       4.5.20       |       4.6.32       | :white_check_mark: |
|       4.5.20       |       4.6.18       | :white_check_mark: |
|       4.5.20       |       4.6.13       | :white_check_mark: |
|       4.5.20       |       4.6.12       | :white_check_mark: |
|       4.5.20       |       4.6.9        | :white_check_mark: |
|       4.5.20       |       4.6.8        | :white_check_mark: |
|       4.5.20       |       4.6.7        | :white_check_mark: |
|       4.5.20       |       4.6.6        | :white_check_mark: |
|       4.4.24       |       4.6.32       | :white_check_mark: |
|       4.4.24       |       4.6.23       | :white_check_mark: |

**4.5.x**

| **Source Version** | **Target Version** |    **Support**     |
| :----------------: | :----------------: | :----------------: |
|       4.5.21       |       4.5.23       | :white_check_mark: |
|       4.5.20       |       4.5.23       | :white_check_mark: |
|       4.5.20       |       4.5.21       | :white_check_mark: |
|       4.5.15       |       4.5.23       | :white_check_mark: |
|       4.5.15       |       4.5.21       | :white_check_mark: |
|       4.5.15       |       4.5.20       | :white_check_mark: |
|       4.5.11       |       4.5.23       | :white_check_mark: |
|       4.5.11       |       4.5.21       | :white_check_mark: |
|       4.5.11       |       4.5.20       | :white_check_mark: |
|       4.5.11       |       4.5.15       | :white_check_mark: |
|       4.5.8        |       4.5.23       | :white_check_mark: |
|       4.5.8        |       4.5.21       | :white_check_mark: |
|       4.5.8        |       4.5.20       | :white_check_mark: |
|       4.5.8        |       4.5.15       | :white_check_mark: |
|       4.5.8        |       4.5.11       | :white_check_mark: |
|       4.5.4        |       4.5.23       | :white_check_mark: |
|       4.5.4        |       4.5.21       | :white_check_mark: |
|       4.5.4        |       4.5.20       | :white_check_mark: |
|       4.5.4        |       4.5.15       | :white_check_mark: |
|       4.5.4        |       4.5.11       | :white_check_mark: |
|       4.5.4        |       4.5.8        | :white_check_mark: |
|       4.4.24       |       4.5.23       | :white_check_mark: |
|       4.4.20       |       4.5.23       | :white_check_mark: |
|       4.4.20       |       4.5.21       | :white_check_mark: |
|       4.4.20       |       4.5.20       | :white_check_mark: |
|       4.4.20       |       4.5.15       | :white_check_mark: |
|       4.4.20       |       4.5.11       | :white_check_mark: |
|       4.4.20       |       4.5.8        | :white_check_mark: |
|       4.4.20       |       4.5.4        | :white_check_mark: |

**4.4.x**

| **Source Version** | **Target Version** |    **Support**     |
| :----------------: | :----------------: | :----------------: |
|       4.4.20       |       4.4.23       | :white_check_mark: |
|       4.4.18       |       4.4.23       | :white_check_mark: |
|       4.4.18       |       4.4.20       | :white_check_mark: |
|       4.4.14       |       4.4.23       | :white_check_mark: |
|       4.4.14       |       4.4.20       | :white_check_mark: |
|       4.4.14       |       4.4.18       | :white_check_mark: |
|       4.4.11       |       4.4.23       | :white_check_mark: |
|       4.4.11       |       4.4.20       | :white_check_mark: |
|       4.4.11       |       4.4.18       | :white_check_mark: |
|       4.4.11       |       4.4.14       | :white_check_mark: |
|       4.4.6        |       4.4.23       | :white_check_mark: |
|       4.4.6        |       4.4.20       | :white_check_mark: |
|       4.4.6        |       4.4.18       | :white_check_mark: |
|       4.4.6        |       4.4.14       | :white_check_mark: |
|       4.4.6        |       4.4.11       | :white_check_mark: |
|       4.3.6        |       4.4.23       | :white_check_mark: |
|       4.3.6        |       4.4.20       | :white_check_mark: |
|       4.3.6        |       4.4.18       | :white_check_mark: |
|       4.3.6        |       4.4.14       | :white_check_mark: |
|       4.3.6        |       4.4.11       | :white_check_mark: |
|       4.3.6        |       4.4.6        | :white_check_mark: |

**4.3.x and Prior**

| **Source Version** | **Target Version** |    **Support**     |
| :----------------: | :----------------: | :----------------: |
|       4.2.13       |       4.3.6        | :white_check_mark: |
|       4.2.7        |       4.2.13       | :white_check_mark: |
|       4.1.x        |       4.3.6        |        :x:         |
|       4.1.12       |       4.2.7        | :white_check_mark: |
|       4.1.12       |       4.1.13       | :white_check_mark: |
|       4.1.7        |       4.2.7        | :white_check_mark: |

</TabItem>

<TabItem label="Kubernetes" value="Kubernetes">

**4.6.x**

| **Source Version** | **Target Version** |    **Support**     |
| :----------------: | :----------------: | :----------------: |
|       4.6.28       |       4.6.32       | :white_check_mark: |
|       4.6.26       |       4.6.32       | :white_check_mark: |
|       4.6.25       |       4.6.32       | :white_check_mark: |
|       4.6.24       |       4.6.32       | :white_check_mark: |
|       4.6.23       |       4.6.32       | :white_check_mark: |
|       4.6.18       |       4.6.32       | :white_check_mark: |
|       4.6.18       |       4.6.23       | :white_check_mark: |
|       4.6.13       |       4.6.32       | :white_check_mark: |
|       4.6.13       |       4.6.23       | :white_check_mark: |
|       4.6.13       |       4.6.18       | :white_check_mark: |
|       4.6.12       |       4.6.32       | :white_check_mark: |
|       4.6.12       |       4.6.23       | :white_check_mark: |
|       4.6.12       |       4.6.18       | :white_check_mark: |
|       4.6.12       |       4.6.13       | :white_check_mark: |
|       4.6.9        |       4.6.32       | :white_check_mark: |
|       4.6.9        |       4.6.23       | :white_check_mark: |
|       4.6.9        |       4.6.18       | :white_check_mark: |
|       4.6.9        |       4.6.13       | :white_check_mark: |
|       4.6.9        |       4.6.12       | :white_check_mark: |
|       4.6.8        |       4.6.32       | :white_check_mark: |
|       4.6.8        |       4.6.23       | :white_check_mark: |
|       4.6.8        |       4.6.18       | :white_check_mark: |
|       4.6.8        |       4.6.13       | :white_check_mark: |
|       4.6.8        |       4.6.12       | :white_check_mark: |
|       4.6.8        |       4.6.9        | :white_check_mark: |
|       4.6.7        |       4.6.32       | :white_check_mark: |
|       4.6.7        |       4.6.23       | :white_check_mark: |
|       4.6.7        |       4.6.18       | :white_check_mark: |
|       4.6.7        |       4.6.13       | :white_check_mark: |
|       4.6.7        |       4.6.12       | :white_check_mark: |
|       4.6.7        |       4.6.9        | :white_check_mark: |
|       4.6.7        |       4.6.8        | :white_check_mark: |
|       4.6.6        |       4.6.32       | :white_check_mark: |
|       4.6.6        |       4.6.23       | :white_check_mark: |
|       4.6.6        |       4.6.18       | :white_check_mark: |
|       4.6.6        |       4.6.13       | :white_check_mark: |
|       4.6.6        |       4.6.12       | :white_check_mark: |
|       4.6.6        |       4.6.9        | :white_check_mark: |
|       4.6.6        |       4.6.8        | :white_check_mark: |
|       4.6.6        |       4.6.7        | :white_check_mark: |
|       4.5.23       |       4.6.32       | :white_check_mark: |
|       4.5.23       |       4.6.23       | :white_check_mark: |
|       4.5.21       |       4.6.32       | :white_check_mark: |
|       4.5.21       |       4.6.23       | :white_check_mark: |
|       4.5.21       |       4.6.18       | :white_check_mark: |
|       4.5.21       |       4.6.13       | :white_check_mark: |
|       4.5.21       |       4.6.12       | :white_check_mark: |
|       4.5.21       |       4.6.9        | :white_check_mark: |
|       4.5.21       |       4.6.8        | :white_check_mark: |
|       4.5.21       |       4.6.7        | :white_check_mark: |
|       4.5.21       |       4.6.6        | :white_check_mark: |
|       4.5.20       |       4.6.32       | :white_check_mark: |
|       4.5.20       |       4.6.23       | :white_check_mark: |
|       4.5.20       |       4.6.18       | :white_check_mark: |
|       4.5.20       |       4.6.13       | :white_check_mark: |
|       4.5.20       |       4.6.12       | :white_check_mark: |
|       4.5.20       |       4.6.9        | :white_check_mark: |
|       4.5.20       |       4.6.8        | :white_check_mark: |
|       4.5.20       |       4.6.7        | :white_check_mark: |
|       4.5.20       |       4.6.6        | :white_check_mark: |
|       4.4.24       |       4.6.32       | :white_check_mark: |
|       4.4.24       |       4.6.23       | :white_check_mark: |

**4.5.x**

| **Source Version** | **Target Version** |    **Support**     |
| :----------------: | :----------------: | :----------------: |
|       4.5.21       |       4.5.23       | :white_check_mark: |
|       4.5.20       |       4.5.23       | :white_check_mark: |
|       4.5.20       |       4.5.21       | :white_check_mark: |
|       4.5.15       |       4.5.23       | :white_check_mark: |
|       4.5.15       |       4.5.21       | :white_check_mark: |
|       4.5.15       |       4.5.20       | :white_check_mark: |
|       4.5.11       |       4.5.23       | :white_check_mark: |
|       4.5.11       |       4.5.21       | :white_check_mark: |
|       4.5.11       |       4.5.20       | :white_check_mark: |
|       4.5.11       |       4.5.15       | :white_check_mark: |
|       4.5.8        |       4.5.23       | :white_check_mark: |
|       4.5.8        |       4.5.21       | :white_check_mark: |
|       4.5.8        |       4.5.20       | :white_check_mark: |
|       4.5.8        |       4.5.15       | :white_check_mark: |
|       4.5.4        |       4.5.23       | :white_check_mark: |
|       4.5.4        |       4.5.21       | :white_check_mark: |
|       4.5.4        |       4.5.20       | :white_check_mark: |
|       4.5.4        |       4.5.15       | :white_check_mark: |
|       4.4.20       |       4.5.23       | :white_check_mark: |
|       4.4.20       |       4.5.21       | :white_check_mark: |
|       4.4.20       |       4.5.20       | :white_check_mark: |
|       4.4.20       |       4.5.15       | :white_check_mark: |

**4.4.x**

| **Source Version** | **Target Version** |    **Support**     |
| :----------------: | :----------------: | :----------------: |
|       4.4.18       |       4.4.20       | :white_check_mark: |
|       4.4.14       |       4.4.20       | :white_check_mark: |
|       4.4.11       |       4.4.20       | :white_check_mark: |
|       4.4.6        |       4.4.20       | :white_check_mark: |
|       4.3.6        |       4.4.20       | :white_check_mark: |
|       4.4.14       |       4.4.18       | :white_check_mark: |
|       4.4.11       |       4.4.18       | :white_check_mark: |
|       4.4.6        |       4.4.18       | :white_check_mark: |
|       4.3.6        |       4.4.18       | :white_check_mark: |
|       4.4.11       |       4.4.14       | :white_check_mark: |
|       4.4.6        |       4.4.14       | :white_check_mark: |
|       4.3.6        |       4.4.14       | :white_check_mark: |
|       4.4.6        |       4.4.11       | :white_check_mark: |
|       4.3.6        |       4.4.11       | :white_check_mark: |
|       4.3.6        |       4.4.6        | :white_check_mark: |

**4.3.x and Prior**

| **Source Version** | **Target Version** |    **Support**     |
| :----------------: | :----------------: | :----------------: |
|       4.2.13       |       4.3.6        | :white_check_mark: |
|       4.2.7        |       4.2.13       | :white_check_mark: |
|       4.1.x        |       4.3.6        |        :x:         |
|       4.1.12       |       4.2.7        | :white_check_mark: |
|       4.1.7        |       4.2.7        | :white_check_mark: |

</TabItem>
</Tabs>

## Upgrade Guides

Refer to the respective guide for guidance on upgrading your self-hosted Palette VerteX instance.

- [Upgrade Notes](upgrade-notes.md)
- [Non-Airgap VMware](upgrade-vmware/non-airgap.md)
- [Airgap VMware](upgrade-vmware/airgap.md)
- [Non-Airgap Kubernetes](upgrade-k8s/non-airgap.md)
- [Airgap Kubernetes](upgrade-k8s/airgap.md)
