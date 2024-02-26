---
sidebar_label: "Airgap"
title: "Upgrade Airgap Palette on Kubernetes"
description: "Learn how to upgrade self-hosted airgap Palette with Helm and Kubernetes."
icon: ""
sidebar_position: 10
tags: ["palette", "self-hosted", "airgap", "kubernetes", "upgrade"]
keywords: ["self-hosted", "enterprise", "airgap", "kubernetes"]
---

This guide takes you through the process of upgrading a self-hosted airgap Palette instance installed with Helm on
Kubernetes.

:::warning

Before upgrading Palette to a new major or minor version, you must first update it to the latest minor version
available. Refer to the [Supported Upgrade Paths](../upgrade.md#supported-upgrade-paths) section for details.

If your setup includes a PCG or if the new Palette version upgrades Kubernetes, you should also upgrade the PCG and
Kubernetes before each major or minor Palette update.

:::
