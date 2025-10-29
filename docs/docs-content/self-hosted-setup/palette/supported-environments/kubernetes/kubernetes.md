---
sidebar_label: "Kubernetes"
title: "Self-Hosted Palette on Kubernetes"
description: "Install self-hosted Palette on an existing Kubernetes cluster."
icon: ""
hide_table_of_contents: false
tags: ["self-hosted", "kubernetes"]
keywords: ["self-hosted", "kubernetes"]
---

Palette can be installed on Kubernetes with internet connectivity or an airgap environment. When you install Palette, a
three-node cluster is created. You use a Helm chart our support team provides to install Palette on Kubernetes. Refer to
[Access Palette](../../palette.md#access-palette) for instructions on requesting access to the Helm Chart.

## Get Started

Select the scenario and the corresponding guide to install Palette on Kubernetes. If you are installing Palette in an
airgap environment, refer to the environment preparation guide before installing Palette.

| Scenario                                                 | Environment Preparation Guide                            | Install Guide                                      |
| -------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------- |
| Install Palette on Kubernetes with internet connectivity | None                                                     | [Install Instructions](./install/non-airgap.md)    |
| Install Palette on Kubernetes in an airgap environment   | [Environment Setup](./setup/airgap/environment-setup.md) | [Airgap Install Instructions](./install/airgap.md) |
