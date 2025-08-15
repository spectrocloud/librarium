---
sidebar_label: "Private Cloud Gateway"
title: "Private Cloud Gateway"
description: "Learn about the Private Cloud Gateway (PCG) and how to use it to support Palette or VerteX deployments."
hide_table_of_contents: false
sidebar_custom_props:
  icon: "network-wired"
tags: ["pcg"]
---

A Private Cloud Gateway (PCG) is a Palette infrastructure support component that enables the communication between
Palette and a private cloud or private data center environment. The PCG is typically deployed into the private cloud
environments through the [Palette CLI](../../automation/palette-cli/install-palette-cli.md).

A PCG is necessary in private cloud environments where Palette does not have direct network access to the environment
where workload clusters are deployed to. When the PCG is installed, it registers itself with a Palette instance and
enables secure communication between the Palette instance and the private cloud environment. The PCG supports the
lifecycle of Kubernetes clusters in private cloud environments. Once a cluster is deployed, the PCG also enables Palette
to monitor the cluster and perform cluster lifecycle operations.

## Supported Environments

You can deploy a PCG into most private cloud environments. Some of the infrastructure environments have first-class
support for PCG deployments through the Palette CLI. Other environments require manually installing the PCG onto an
existing Kubernetes cluster. Refer to the table below to learn more about the supported environments.

| Environment    | Palette CLI Install? | Description                                                                                     | Install Guide                                                         |
| -------------- | -------------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| MAAS           | ✅                   | The PCG cluster is deployed into a MAAS environment.                                            | [Deploy to MAAS](deploy-pcg/maas.md)                                  |
| OpenStack      | ✅                   | The PCG cluster is deployed into an OpenStack environment.                                      | [Deploy to OpenStack](deploy-pcg/openstack.md)                        |
| VMware vSphere | ✅                   | The PCG is deployed into a VMware vSphere environment.                                          | [Deploy to VMware vSphere](./deploy-pcg/vmware.md)                    |
| Other          | ❌                   | The PCG cluster is deployed into an existing Kubernetes cluster that is not managed by Palette. | [Deploy a PCG to an Existing Kubernetes Cluster](./deploy-pcg-k8s.md) |

## Kubernetes Requirements

The following table presents the Kubernetes version corresponding to each Palette version. This applies when you deploy
a PCG to an existing Kubernetes cluster. Refer to the
[Deploy a PCG to an Existing Kubernetes Cluster](./deploy-pcg-k8s.md) guide for more information.

| **Palette Version** <!-- pcg-kubernetes-version-table --> | **Kubernetes Version** |
| --------------------------------------------------------- | ---------------------- |
| <!-- pcg-k8s-4-7-a --> 4.7.12                             | 1.31.8                 |
| <!-- pcg-k8s-4-7-0 --> 4.7.3                              | 1.31.8                 |
| <!-- pcg-k8s-4.6.x --> 4.6.40                             | 1.30.9                 |
| <!-- pcg-k8s-4.6.c --> 4.6.32                             | 1.30.9                 |
| <!-- pcg-k8s-4.6.b --> 4.6.23                             | 1.30.9                 |
| <!-- pcg-k8s-4.6.a --> 4.6.12                             | 1.30.9                 |
| 4.6.6                                                     | 1.30.9                 |
| 4.5.21                                                    | 1.29.12                |
| 4.5.20                                                    | 1.29.12                |
| 4.5.15                                                    | 1.29.9                 |
| 4.5.11                                                    | 1.29.9                 |
| 4.5.10                                                    | 1.29.9                 |
| 4.5.8                                                     | 1.29.9                 |
| 4.5.5                                                     | 1.29.9                 |
| 4.5.4                                                     | 1.29.9                 |
| 4.5.3                                                     | 1.29.9                 |
| 4.4.20                                                    | 1.28.13                |
| 4.4.18                                                    | 1.28.13                |
| 4.4.14                                                    | 1.28.12                |
| 4.4.11                                                    | 1.28.11                |
| 4.4.6                                                     | 1.28.9                 |
| 4.3.6                                                     | 1.27.11                |
| 4.2.13                                                    | 1.26.10                |
| 4.2.7                                                     | 1.26.10                |
| 4.1.12                                                    | 1.26.8                 |

## Resources

- [Architecture](./architecture.md)

- [Deploy a PCG with Palette CLI](./deploy-pcg/deploy-pcg.md)

- [Deploy a PCG to an Existing Kubernetes Cluster](./deploy-pcg-k8s.md)

- [Manage a PCG](./manage-pcg/manage-pcg.md)

- [Deploy App Workloads with a PCG](../../tutorials/cluster-deployment/pcg/deploy-app-pcg.md)
