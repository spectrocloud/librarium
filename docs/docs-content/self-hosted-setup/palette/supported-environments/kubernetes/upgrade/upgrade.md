---
sidebar_label: "Upgrade"
title: "Upgrade Palette on Kubernetes"
description: "Upgrade self-hosted Palette installed on a Kubernetes cluster."
icon: ""
hide_table_of_contents: false
tags: ["self-hosted", "helm", "kubernetes", "upgrade"]
keywords: ["self-hosted", "helm", "kubernetes", "upgrade"]
---

:::danger

The below content is from the former [Palette Upgrade](https://docs.spectrocloud.com/enterprise-version/upgrade/) page.
Convert to partials and refactor where necessary.

:::

This page offers links and reference information for upgrading self-hosted Palette instances. If you have questions or
concerns, [reach out to our support team](http://support.spectrocloud.io/).

:::tip

If you are using Palette VerteX, refer to the
[VerteX Upgrade](../../../../vertex/supported-environments/kubernetes/upgrade/upgrade.md) page for upgrade guidance.

:::

### Private Cloud Gateway

If your setup includes a PCG, make sure to
[allow the PCG to upgrade automatically](../../../../../clusters/pcg/manage-pcg/pcg-upgrade.md) before each major or
minor Palette upgrade.

## Upgrade Notes

Refer to the following known issues before upgrading:

- Upgrading self-hosted Palette or Palette VerteX from version 4.6.x to 4.7.x can cause the upgrade to hang if any
  member of the MongoDB ReplicaSet is not fully synced and in a healthy state prior to the upgrade. For guidance on
  verifying the health status of MongoDB ReplicaSet members, refer to our
  [Troubleshooting](../../../../../troubleshooting/palette-upgrade.md#self-hosted-palette-or-palette-vertex-upgrade-hangs)
  guide.

## Supported Upgrade Paths

Refer to the following tables for the supported upgrade paths for self-hosted Palette environments installed on a
[Kubernetes](../kubernetes.md) cluster.

:::danger

Before upgrading Palette to a new major version, you must first update it to the latest patch version of the latest
minor version available.

:::

**4.7.x**

| **Source Version** | **Target Version** |    **Support**     |
| :----------------: | :----------------: | :----------------: |
|       4.7.16       |       4.7.20       | :white_check_mark: |
|       4.7.15       |       4.7.20       | :white_check_mark: |
|       4.7.3        |       4.7.20       | :white_check_mark: |
|       4.7.3        |       4.7.15       | :white_check_mark: |
|       4.6.41       |       4.7.20       | :white_check_mark: |
|       4.6.41       |       4.7.15       | :white_check_mark: |
|       4.6.41       |       4.7.3        | :white_check_mark: |

**4.6.x**

| **Source Version** | **Target Version** |    **Support**     |
| :----------------: | :----------------: | :----------------: |
|       4.6.41       |       4.6.43       | :white_check_mark: |
|       4.6.36       |       4.6.43       | :white_check_mark: |
|       4.6.36       |       4.6.41       | :white_check_mark: |
|       4.6.32       |       4.6.43       | :white_check_mark: |
|       4.6.32       |       4.6.41       | :white_check_mark: |
|       4.6.32       |       4.6.34       | :white_check_mark: |
|       4.6.28       |       4.6.43       | :white_check_mark: |
|       4.6.28       |       4.6.41       | :white_check_mark: |
|       4.6.28       |       4.6.34       | :white_check_mark: |
|       4.6.28       |       4.6.32       | :white_check_mark: |
|       4.6.26       |       4.6.43       | :white_check_mark: |
|       4.6.26       |       4.6.41       | :white_check_mark: |
|       4.6.26       |       4.6.34       | :white_check_mark: |
|       4.6.26       |       4.6.32       | :white_check_mark: |
|       4.6.25       |       4.6.43       | :white_check_mark: |
|       4.6.25       |       4.6.41       | :white_check_mark: |
|       4.6.25       |       4.6.34       | :white_check_mark: |
|       4.6.25       |       4.6.32       | :white_check_mark: |
|       4.6.24       |       4.6.43       | :white_check_mark: |
|       4.6.24       |       4.6.41       | :white_check_mark: |
|       4.6.24       |       4.6.34       | :white_check_mark: |
|       4.6.24       |       4.6.32       | :white_check_mark: |
|       4.6.23       |       4.6.43       | :white_check_mark: |
|       4.6.23       |       4.6.41       | :white_check_mark: |
|       4.6.23       |       4.6.34       | :white_check_mark: |
|       4.6.23       |       4.6.32       | :white_check_mark: |
|       4.6.23       |       4.6.28       | :white_check_mark: |
|       4.6.23       |       4.6.24       | :white_check_mark: |
|       4.6.18       |       4.6.43       | :white_check_mark: |
|       4.6.18       |       4.6.41       | :white_check_mark: |
|       4.6.18       |       4.6.34       | :white_check_mark: |
|       4.6.18       |       4.6.32       | :white_check_mark: |
|       4.6.18       |       4.6.28       | :white_check_mark: |
|       4.6.18       |       4.6.24       | :white_check_mark: |
|       4.6.18       |       4.6.23       | :white_check_mark: |
|       4.6.13       |       4.6.43       | :white_check_mark: |
|       4.6.13       |       4.6.41       | :white_check_mark: |
|       4.6.13       |       4.6.34       | :white_check_mark: |
|       4.6.13       |       4.6.32       | :white_check_mark: |
|       4.6.13       |       4.6.28       | :white_check_mark: |
|       4.6.13       |       4.6.24       | :white_check_mark: |
|       4.6.13       |       4.6.23       | :white_check_mark: |
|       4.6.13       |       4.6.18       | :white_check_mark: |
|       4.6.12       |       4.6.43       | :white_check_mark: |
|       4.6.12       |       4.6.41       | :white_check_mark: |
|       4.6.12       |       4.6.34       | :white_check_mark: |
|       4.6.12       |       4.6.32       | :white_check_mark: |
|       4.6.12       |       4.6.28       | :white_check_mark: |
|       4.6.12       |       4.6.24       | :white_check_mark: |
|       4.6.12       |       4.6.23       | :white_check_mark: |
|       4.6.12       |       4.6.18       | :white_check_mark: |
|       4.6.12       |       4.6.13       | :white_check_mark: |
|       4.6.9        |       4.6.43       | :white_check_mark: |
|       4.6.9        |       4.6.41       | :white_check_mark: |
|       4.6.9        |       4.6.34       | :white_check_mark: |
|       4.6.9        |       4.6.32       | :white_check_mark: |
|       4.6.9        |       4.6.28       | :white_check_mark: |
|       4.6.9        |       4.6.24       | :white_check_mark: |
|       4.6.9        |       4.6.23       | :white_check_mark: |
|       4.6.9        |       4.6.18       | :white_check_mark: |
|       4.6.9        |       4.6.13       | :white_check_mark: |
|       4.6.9        |       4.6.12       | :white_check_mark: |
|       4.6.8        |       4.6.43       | :white_check_mark: |
|       4.6.8        |       4.6.41       | :white_check_mark: |
|       4.6.8        |       4.6.34       | :white_check_mark: |
|       4.6.8        |       4.6.32       | :white_check_mark: |
|       4.6.8        |       4.6.28       | :white_check_mark: |
|       4.6.8        |       4.6.24       | :white_check_mark: |
|       4.6.8        |       4.6.23       | :white_check_mark: |
|       4.6.8        |       4.6.18       | :white_check_mark: |
|       4.6.8        |       4.6.13       | :white_check_mark: |
|       4.6.8        |       4.6.12       | :white_check_mark: |
|       4.6.8        |       4.6.9        | :white_check_mark: |
|       4.6.7        |       4.6.43       | :white_check_mark: |
|       4.6.7        |       4.6.41       | :white_check_mark: |
|       4.6.7        |       4.6.34       | :white_check_mark: |
|       4.6.7        |       4.6.32       | :white_check_mark: |
|       4.6.7        |       4.6.28       | :white_check_mark: |
|       4.6.7        |       4.6.24       | :white_check_mark: |
|       4.6.7        |       4.6.23       | :white_check_mark: |
|       4.6.7        |       4.6.18       | :white_check_mark: |
|       4.6.7        |       4.6.13       | :white_check_mark: |
|       4.6.7        |       4.6.12       | :white_check_mark: |
|       4.6.7        |       4.6.9        | :white_check_mark: |
|       4.6.7        |       4.6.8        | :white_check_mark: |
|       4.6.6        |       4.6.43       | :white_check_mark: |
|       4.6.6        |       4.6.41       | :white_check_mark: |
|       4.6.6        |       4.6.34       | :white_check_mark: |
|       4.6.6        |       4.6.32       | :white_check_mark: |
|       4.6.6        |       4.6.28       | :white_check_mark: |
|       4.6.6        |       4.6.24       | :white_check_mark: |
|       4.6.6        |       4.6.23       | :white_check_mark: |
|       4.6.6        |       4.6.18       | :white_check_mark: |
|       4.6.6        |       4.6.13       | :white_check_mark: |
|       4.6.6        |       4.6.12       | :white_check_mark: |
|       4.6.6        |       4.6.9        | :white_check_mark: |
|       4.6.6        |       4.6.8        | :white_check_mark: |
|       4.6.6        |       4.6.7        | :white_check_mark: |
|       4.5.23       |       4.6.43       | :white_check_mark: |
|       4.5.23       |       4.6.41       | :white_check_mark: |
|       4.5.23       |       4.6.34       | :white_check_mark: |
|       4.5.23       |       4.6.32       | :white_check_mark: |
|       4.5.23       |       4.6.28       | :white_check_mark: |
|       4.5.23       |       4.6.24       | :white_check_mark: |
|       4.5.23       |       4.6.23       | :white_check_mark: |
|       4.5.23       |       4.6.18       | :white_check_mark: |
|       4.5.21       |       4.6.43       | :white_check_mark: |
|       4.5.21       |       4.6.41       | :white_check_mark: |
|       4.5.21       |       4.6.34       | :white_check_mark: |
|       4.5.21       |       4.6.32       | :white_check_mark: |
|       4.5.21       |       4.6.28       | :white_check_mark: |
|       4.5.21       |       4.6.24       | :white_check_mark: |
|       4.5.21       |       4.6.23       | :white_check_mark: |
|       4.5.21       |       4.6.18       | :white_check_mark: |
|       4.5.21       |       4.6.13       | :white_check_mark: |
|       4.5.21       |       4.6.12       | :white_check_mark: |
|       4.5.21       |       4.6.9        | :white_check_mark: |
|       4.5.21       |       4.6.8        | :white_check_mark: |
|       4.5.21       |       4.6.7        | :white_check_mark: |
|       4.5.21       |       4.6.6        | :white_check_mark: |
|       4.5.20       |       4.6.43       | :white_check_mark: |
|       4.5.20       |       4.6.41       | :white_check_mark: |
|       4.5.20       |       4.6.34       | :white_check_mark: |
|       4.5.20       |       4.6.32       | :white_check_mark: |
|       4.5.20       |       4.6.28       | :white_check_mark: |
|       4.5.20       |       4.6.24       | :white_check_mark: |
|       4.5.20       |       4.6.23       | :white_check_mark: |
|       4.5.20       |       4.6.18       | :white_check_mark: |
|       4.5.20       |       4.6.13       | :white_check_mark: |
|       4.5.20       |       4.6.12       | :white_check_mark: |
|       4.5.20       |       4.6.9        | :white_check_mark: |
|       4.5.20       |       4.6.8        | :white_check_mark: |
|       4.5.20       |       4.6.7        | :white_check_mark: |
|       4.5.20       |       4.6.6        | :white_check_mark: |
|       4.4.24       |       4.6.43       | :white_check_mark: |
|       4.4.24       |       4.6.41       | :white_check_mark: |
|       4.4.24       |       4.6.34       | :white_check_mark: |
|       4.4.24       |       4.6.32       | :white_check_mark: |
|       4.4.24       |       4.6.28       | :white_check_mark: |
|       4.4.24       |       4.6.24       | :white_check_mark: |
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
