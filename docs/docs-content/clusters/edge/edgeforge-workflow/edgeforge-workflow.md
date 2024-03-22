---
sidebar_label: "EdgeForge Workflow"
title: "EdgeForge Workflow"
description: "Learn how to build your own Edge artifacts customized to your specific needs."
hide_table_of_contents: false
tags: ["edge"]
---

_EdgeForge_ is the process or workflow of preparing an Edge host with all the required components and dependencies. The
EdgeForge workflow contains several steps and key elements that you must complete to ensure the Edge host is ready for a
successful site deployment.

EdgeForge contains three critical components.

- Edge Installer ISO.

- Edge Host Agent Container Image.

- Edge Provider Container Images.

Each component plays a critical role in the [lifecycle](../edge-native-lifecycle.md) of an Edge deployment. Review the
[Edge Artifacts](../edgeforge-workflow/edgeforge-workflow.md#edge-artifacts) section to learn more about each component.

![A diagram that displays the relationship between the three components  and how they relate to an Edge host](/clusters_edge-forge-workflow_edgeforge-workflow_components-diagram.webp)

## Get Started

To start building a custom Edge artifact, use the [Build Edge Artifacts](build-images.md) guide.

<br />

## Edge Artifacts

### Edge Installer ISO

An ISO file that bootstraps the installation process. The ISO image contains the Edge Installer that installs the
Palette Edge host agent and metadata to perform the initial installation. The default Edge Installer ISO download URL is
in the [Downloads](../../../spectro-downloads.md#palette-edge-cli) resource.

<br />

## Edge Host Agent Container Image

The Edge host agent container image contains the Palette Edge host agent. The agent is responsible for Day-2 operations
and management of the Edge host. The Edge host agent also provides ongoing support during cluster runtime.

<br />

### Edge Provider Container Images

These are [Kairos](https://kairos.io/)-based container images for each supported Operating System (OS) and Kubernetes
combination. These container images are downloaded during the installation by the Edge Installer and converted to disk
images for the system to boot into.

Palette provides these artifacts out-of-the-box. All the container images are hosted in Palette's public container
registries, or a private self-hosted OCI registry and automatically downloaded during installation. You can use the
default Palette container registries to familiarize yourself with the installation process. However, in a typical
production scenario, you would need to customize these artifacts to suit your specific needs or perform some
[content bundle](../edgeforge-workflow/build-content-bundle.md) optimization.

<br />

![A diagram breaking up the internal components of the Edge Provider container images](/clusters_edge_edgeforge-workflow_provider-diagram.webp)

:::info

You can specify a custom registry for the Edge Installer to use during installation with the user data parameter
`registryCredentials`. Refer to the
[Installer Configuration](../edge-configuration/installer-reference.md#external-registry) reference resource for more
details.

:::

# Palette Edge CLI

All organizations have unique environments and different needs. To help you successfully deploy an Edge host in your
environment and create an Edge Native host cluster, we provide you with a CLI to help you customize the installation.

<br />

## Content Builder

You can create content bundles with the Palette Edge CLI. A content bundle is a compressed ZST file you can include with
the Edge Installer for bandwidth optimization. The CLI can also build the content bundle in optical disk image (ISO)
format. In ISO format, the content is not baked into the installer but can be supplied as an additional USB drive during
installation.

To learn how to create content bundles, check out the
[Build Content Bundle](/clusters/edge/edgeforge-workflow/build-content-bundle) guide.

<br />

## Image Builder

The Palette Edge CLI can also be used to create custom Edge artifacts. You can use the CLI to address common deployment
concerns about required packages, software restrictions, bandwidth concerns, and more. By using your Edge artifacts, you
gain complete control over the deployment, and you can manage the software in your Edge clusters to best suit your
organization's needs.

Follow the instructions in the [Build Images](/clusters/edge/edgeforge-workflow/build-images) guide to learn more about
creating custom Edge artifacts.

<br />

# Deployment Scenarios

The Edge Installer supports various deployment scenarios. You can customize your Edge host deployment by using the Edge
Installer configuration user data, creating content bundles, and creating a custom Edge artifact. Below are a few common
scenarios that organizations encounter when deploying an Edge host that requires customization. If you have a similar
scenario, use the CLIs to help you with the customization.

<br />

- **Additional Packages**: You may need to install additional OS packages for your specific needs, such as an NVIDIA
  driver or a network package essential for your hardware to establish an outgoing network connection. These additional
  OS packages would need to be added to the Edge Installer and the Edge Provider images.

- **Installer OS Restriction**: Palette's out-of-the-box Edge Installer is based on the OpenSUSE OS. If you want to
  install an Ubuntu or an RHEL-based Edge cluster, you may need an Edge Installer based on another OS.

- **Optimize Bandwidth**: In your Edge environments, you may have internet connectivity but limited bandwidth. You can
  optimize the installation process by embedding all the required components such as the Edge Host Container Image, the
  Edge Provider Container Images, and content bundles into the Edge Installer. By embedding the required components in
  the Edge Installer, you remove the need to download the components during installation.

- **Bootstrap Install Configuration**: You can embed the Edge Installer configuration user data into the Edge Installer.
  This removes the need to create separate user data uploaded as an ISO through a USB drive. Check out the
  [Prepare User Data](/clusters/edge/edgeforge-workflow/prepare-user-data) guide to learn more about user data and when
  to use multiple user data files.

- **Bring Your Own OS (BYOOS)**: Palette provides the following runtime OS out-of-the-box for all Edge Hosts. For
  environments that require a different runtime OS, you can specify another OS through the BYOOS option. Follow the
  instructions in the [Bring Your Own OS](/clusters/edge/edgeforge-workflow/build-kairos-os) guide to learn more about
  BYOOS.

# Build a Custom Edge Artifact

To start building a custom Edge artifact, use the following guides. You should review each guide sequentially, although
some guides may not apply to your Edge deployment.

<br />

## Resources

- [Build Edge Artifacts](build-kairos-os.md)

- [Build Preloaded Content Bundles](build-content-bundle.md)

- [Prepare User Data](prepare-user-data.md)
