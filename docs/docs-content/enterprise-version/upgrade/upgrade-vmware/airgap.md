---
sidebar_label: "Airgap"
title: "Upgrade Airgap Palette Installed on VMware vSphere"
description: "Learn how to upgrade self-hosted airgap Palette in VMware."
icon: ""
sidebar_position: 10
tags: ["palette", "self-hosted", "vmware", "airgap", "upgrade"]
keywords: ["self-hosted", "enterprise"]
---

This guide takes you through the process of upgrading a self-hosted airgap Palette instance installed on VMware vSphere.

:::warning

Before upgrading Palette to a new major version, you must first update it to the latest minor version available. Refer
to the [Supported Upgrade Paths](../upgrade.md#supported-upgrade-paths) section for details.

If your setup includes a PCG, you must also
[allow the PCG to upgrade automatically](../../../clusters/pcg/manage-pcg/pcg-upgrade.md) before each major or minor
Palette upgrade. Additionally, if the new Palette version updates Kubernetes, you need to apply the Kubernetes updates
to your Enterprise Cluster Profile.

:::

## Prerequisites

- Access to the Palette system console.

## Upgrade

1. Log in to the Palette system console.

2. On the **Summary** page, on the Palette updates card, select **Update version**.

## Validate
