---
sidebar_label: "Management Appliance"
title: "Self-Hosted Palette with Management Appliance"
description: "Use the Palette Management Appliance to install self-hosted Palette on your desired infrastructure."
hide_table_of_contents: false
# sidebar_custom_props:
#   icon: "chart-diagram"
tags: ["management appliance", "self-hosted"]
---

:::preview

This is a Tech Preview feature and is subject to change. Upgrades from a Tech Preview deployment may not be available.
Do not use this feature in production workloads.

:::

The Palette Management Appliance is downloadable as an ISO file and is a solution for installing self-hosted Palette on
your infrastructure. The ISO file contains all the necessary components needed for Palette to function. The ISO file is
used to boot the nodes, which are then clustered to form a Palette management cluster.

Once Palette has been installed, you can download pack bundles and upload them to the internal Zot registry or an
external registry. These pack bundles are used to create your cluster profiles. You will then be able to deploy clusters
in your environment.

## Third Party Packs

There is an additional option to download and install the Third Party packs that provide complementary functionality to
Palette. These packs are not required for Palette to function, but they do provide additional features and capabilities
as described in the following table.

| **Feature**                                                                                                                                 | **Included with Palette Third Party Pack** | **Included with Palette Third Party Conformance Pack** |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | ------------------------------------------------------ |
| [Backup and Restore](../../../../clusters/cluster-management/backup-restore/backup-restore.md)                                              | :white_check_mark:                         | :x:                                                    |
| [Configuration Security](../../../../clusters/cluster-management/compliance-scan.md#configuration-security)                                 | :white_check_mark:                         | :x:                                                    |
| [Penetration Testing](../../../../clusters/cluster-management/compliance-scan.md#penetration-testing)                                       | :white_check_mark:                         | :x:                                                    |
| [Software Bill Of Materials (SBOM) scanning](../../../../clusters/cluster-management/compliance-scan.md#sbom-dependencies--vulnerabilities) | :white_check_mark:                         | :x:                                                    |
| [Conformance Testing](../../../../clusters/cluster-management/compliance-scan.md#conformance-testing)                                       | :x:                                        | :white_check_mark:                                     |

## Architecture

The ISO file is built with the Operating System (OS), Kubernetes distribution, Container Network Interface (CNI), and
Container Storage Interface (CSI). A [Zot registry](https://zotregistry.dev/) is also included in the Appliance
Framework ISO. Zot is a lightweight, OCI-compliant container image registry that is used to store the Palette packs
needed to create cluster profiles.

The following table displays the infrastructure profile for the self-hosted Palette appliance.

| **Layer**      | **Component**                                 | **Version** |
| -------------- | --------------------------------------------- | ----------- |
| **OS**         | Ubuntu: Immutable [Kairos](https://kairos.io) | 22.04       |
| **Kubernetes** | Palette eXtended Kubernetes Edge (PXK-E)      | 1.32.3      |
| **CNI**        | Calico                                        | 3.29.2      |
| **CSI**        | Piraeus                                       | 2.8.1       |
| **Registry**   | Zot                                           | 0.1.67      |

## Supported Platforms

The Palette Management Appliance can be used on the following infrastructure platforms:

- VMware vSphere
- Bare Metal
- Machine as a Service (MAAS)
