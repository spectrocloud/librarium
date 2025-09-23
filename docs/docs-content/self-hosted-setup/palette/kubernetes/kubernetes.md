---
sidebar_label: "Kubernetes"
title: "Kubernetes"
description: "Learn how to install self-hosted Palette on an existing Kubernetes cluster."
icon: ""
hide_table_of_contents: false
tags: ["palette", "self-hosted", "kubernetes"]
keywords: ["self-hosted", "kubernetes"]
---

Palette can be installed on Kubernetes with internet connectivity or an airgap environment. When you install Palette, a
three-node cluster is created. You use a Helm chart our support team provides to install Palette on Kubernetes. Refer to
[Access Palette](../../enterprise-version.md#access-palette) for instructions on requesting access to the Helm Chart.

To get started with Palette on Kubernetes, refer to the [Install Instructions](install.md) guide.

## Get Started

Select the scenario and the corresponding guide to install Palette on Kubernetes. If you are installing Palette in an
airgap environment, refer to the environment preparation guide before installing Palette.

| Scenario                                                 | Environment Preparation Guide                                           | Install Guide                                              |
| -------------------------------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------- |
| Install Palette on Kubernetes with internet connectivity | None                                                                    | [Install Instructions](install.md)                         |
| Install Palette on Kubernetes in an airgap environment   | [Environment Setup](./airgap-install/kubernetes-airgap-instructions.md) | [Airgap Install Instructions](./airgap-install/install.md) |

## Resources

- [Non-Airgap Install Instructions](install.md)

- [Airgap Install Instructions](./airgap-install/install.md)

- [Helm Configuration Reference](palette-helm-ref.md)
