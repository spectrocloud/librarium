---
sidebar_label: "Upgrade"
title: "Upgrade"
description: "Spectro Cloud upgrade notes for specific Palette VerteX versions."
icon: ""
hide_table_of_contents: false
sidebar_position: 100
tags: ["vertex", "self-hosted", "upgrade"]
keywords: ["self-hosted", "vertex"]
---

This page offers links and reference information for upgrading self-hosted Palette VerteX instances. If you have
questions or concerns, [reach out to our support team](http://support.spectrocloud.io/).

:::info

If your setup includes a PCG, make sure to
[allow the PCG to upgrade automatically](../../clusters/pcg/manage-pcg/pcg-upgrade.md) before each major or minor
Palette VerteX upgrade.

:::

## Supported Upgrade Paths

Refer to the following table for the self-hosted Palette VerteX upgrade paths that we currently support.

:::warning

Before upgrading Palette VerteX to a new major version, you must first update it to the latest patch version of the
latest minor version available.

:::

| **Source Version** | **Target Version** |    **Support**     |
| :----------------: | :----------------: | :----------------: |
|       4.4.11       |       4.4.14       | :white_check_mark: |
|       4.4.6        |       4.4.14       | :white_check_mark: |
|       4.3.6        |       4.4.14       | :white_check_mark: |
|       4.4.6        |       4.4.11       | :white_check_mark: |
|       4.3.6        |       4.4.11       | :white_check_mark: |
|       4.3.6        |       4.4.x        | :white_check_mark: |
|       4.2.13       |       4.3.6        | :white_check_mark: |
|       4.2.7        |       4.2.13       | :white_check_mark: |
|       4.1.x        |       4.3.6        |        :x:         |
|       4.1.12       |       4.2.7        | :white_check_mark: |
|       4.1.7        |       4.2.7        | :white_check_mark: |

## Upgrade Guides

Refer to the respective guide for guidance on upgrading your self-hosted Palette VerteX instance.

- [Upgrade Notes](upgrade-notes.md)
- [Non-Airgap VMware](upgrade-vmware/non-airgap.md)
- [Airgap VMware](upgrade-vmware/airgap.md)
- [Non-Airgap Kubernetes](upgrade-k8s/non-airgap.md)
- [Airgap Kubernetes](upgrade-k8s/airgap.md)
