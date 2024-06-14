---
sidebar_label: "Install Configuration"
title: "Install Configuration"
description: "Learn about the possible Palette Edge install configurations available."
hide_table_of_contents: false
tags: ["edge"]
---

The Edge Installer is responsible for preparing the Edge host to be ready for workloads. The Edge Installer supports the
ability to specify a user data configuration file. You can use this configuration file to customize the installation and
ensure your Edge host has all the required dependencies and settings to work properly in your environment.

To better understand the Edge installation process, review the order of operations.

### Order of Operations:

1. Boot device with Edge Installer.

2. Edge Installer installs Palette Edge onto the Edge host.

3. Device powers off or reboots to registration mode based on the user data configuration.

4. Upon boot up or reboot, cloud-init stages that are specified in the user data configuration file take effect.

5. Edge Host Registers with Palette and is ready to be part of a cluster.

6. User provisions the Edge host as part of a cluster in Palette.

7. Edge host identifies cloud-init stages as specified in the OS pack.

8. Operating System (OS) is installed on the Edge host.

9. Device reboots.

10. OS cloud-init stages are applied in the proper order.

11. Edge Host becomes a node in an active cluster.

![The boot order sequence, listing 9 steps that flow in a sequential order.](/clusters_edge_cloud-init_boot-order-squence.webp)

Palette Edge allows you to use cloud-init stages to declaratively configure your Operating System (CS) of your Edge host
both using installer configuration and in the the OS pack. For more information about cloud-init stages, refer to
[Cloud-init Stages](./cloud-init.md).

## Edge Installer Configuration

The Edge installation process expects you to specify installation parameters. You can supply the install parameters in
multiple stages. You can provide common installation configurations during EdgeForge for all your sites during the
manufacturing or installation phases.

You can also specify additional location-specific configurations at the site during on-site deployment. The install
configurations provided in various stages are merged to create the Edge host's final configuration.

## Edge OS Configuration

During cluster deployment, Palette supports the ability for you to customize your operating system (OS) through the
usage of cloud-init stages. You can supply Edge configurations during the edge host installation with the Edge Installer
and at the Operating System (OS) layer by customizing the OS pack. Once the edge host installation process is complete,
the OS stages take effect during the boot-up process.

To effectively use the Edge Installer, we recommend you review the Edge
[installer configuration](installer-reference.md) page so you gain an overview of all the available parameters.

## Resources

- [Edge OS Configuration: Cloud-Init Stages](cloud-init.md)

- [Edge Install Configuration](installer-reference.md)
