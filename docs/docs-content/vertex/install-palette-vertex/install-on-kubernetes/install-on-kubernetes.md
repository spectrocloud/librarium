---
sidebar_label: "Kubernetes"
title: "Kubernetes"
description: "Learn how to install Palette VerteX on Kubernetes."
icon: ""
hide_table_of_contents: false
tags: ["vertex", "kubernetes"]
keywords: ["self-hosted", "vertex"]
---

Palette VerteX can be installed on Kubernetes with internet connectivity or an airgap environment. When you install
VerteX, a three-node cluster is created. You use a Helm chart our support team provides to install VerteX on Kubernetes.
Refer to [Access Palette VerteX](../../vertex.md#access-palette-vertex) for instructions on requesting access to the
Helm Chart.

## Get Started

Select the scenario and the corresponding guide to install VerteX on Kubernetes. If you are installing VerteX in an
airgap environment, refer to the environment preparation guide before installing VerteX.

| Scenario                                                | Environment Preparation Guide                                           | Install Guide                                              |
| ------------------------------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------- |
| Install VerteX on Kubernetes with internet connectivity | None                                                                    | [Install Instructions](install.md)                         |
| Install VerteX on Kubernetes in an airgap environment   | [Environment Setup](./airgap-install/kubernetes-airgap-instructions.md) | [Airgap Install Instructions](./airgap-install/install.md) |

## Resources

- [Non-Airgap Install Instructions](install.md)

- [Airgap Install Instructions](./airgap-install/install.md)

- [Helm Configuration Reference](./vertex-helm-ref.md)
