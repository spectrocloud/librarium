---
sidebar_label: "Palette Dev Engine"
title: "Palette Dev Engine (PDE)"
description: "Explore Palette Dev Engine"
hide_table_of_contents: false
sidebar_custom_props:
  icon: "users"
tags: ["devx", "app mode", "pde"]
---

Palette provides two different modes for deploying and managing applications. The first mode is _Cluster Mode_ - this
mode enables you to create, deploy, and manage Kubernetes clusters and applications. The second mode is _App Mode_ - a
mode optimized for a simpler and streamlined developer experience that allows you to only focus on the building,
maintenance, testing, deployment, and monitoring of your applications.

You can leverage Spectro Cloud's complementary managed Kubernetes cluster when using App Mode. The complementary
resources have a limit of 12 vCPU, 16 GiB of memory, and 20 GiB of free storage. Alternatively, you may deploy
applications on Kubernetes clusters that belong to your organization and are managed by Palette.

:::info

Check out the in-depth explanation of [App Mode and Cluster Mode](../introduction/palette-modes.md) to learn more about
each mode.

:::

## Get Started

To get started with App Mode, give the tutorial
[Deploy an Application using Palette Dev Engine](../tutorials/pde/deploy-app.md) a try so that you can learn how to use
App Mode with Palette Dev Engine.

## Supported Platforms

App Mode is available for the following Palette and VerteX platforms.

| Platform                   | Supported | Version                                                            |
| -------------------------- | --------- | ------------------------------------------------------------------ |
| Palette SaaS               | ✅        | `v3.0.0` or greater.                                               |
| Self-hosted Palette        | ✅        | `v3.4.0` or greater.                                               |
| Palette Airgap Self-hosted | ✅        | `v4.0.0` or greater.                                               |
| VerteX                     | :warning: | `v4.0.0` or greater. Be aware that App Mode is not FIPS compliant. |

## Manage Resources

The PDE dashboard provides a snapshot of resource utilization in your PDE environment. You can keep track of the
resource utilization in your PDE environment without having to navigate to different views. The dashboard displays the
following information. <br />

- The number of apps deployed.

- The number of virtual clusters and their respective status.

- The aggregate resource utilization at both the tenant and system levels for these resources.

  - Virtual clusters
  - CPU
  - Memory
  - Storage

- The number of app profiles available.

![A view of the PDE dashboard with resources in use.](/docs_devx_pde-dashboard-utilization.webp)

## Automation Support

You can manage PDE resources through the [Palette API](/api/introduction),
[Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs), and
the Palette CLI. Download the Palette CLI from the [Downloads](../spectro-downloads.md#palette-cli) page to start
programmatically using PDE.

![A view of the Palette CLI menu from a terminal](/devx_devx_cli-display.webp)

:::tip

Check out the Palette CLI [install guide](../automation/palette-cli/install-palette-cli.md) for more information on how
to install and configure the CLI.

:::

<br />

## PDE Visual Studio Code Extension

You can create and manage lightweight Kubernetes clusters from within Visual Studio (VS) Code by using the PDE VS Code
Extension. The plugin accelerates developing and testing your containerized applications and integrates with the
Kubernetes Extension for VS Code. To learn about features of PDE VS Code Extension and how to install and activate it,
check out
[PDE Extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=SpectroCloud.extension-palette).

## Resources

- [Use Cases](enterprise-user.md)

- [App Profiles](../profiles/app-profiles/app-profiles.md)

- [Apps](./apps/apps.md)

- [Palette Virtual Clusters](palette-virtual-clusters/palette-virtual-clusters.md)

- [Manage Dev Engine](manage-dev-engine/manage-dev-engine.md)
