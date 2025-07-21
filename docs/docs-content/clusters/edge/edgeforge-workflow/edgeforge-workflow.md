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

Each EdgeForge component plays a critical role in the [lifecycle](../edge-native-lifecycle.md) of an Edge deployment.
Review the [Edge Artifacts](../edgeforge-workflow/edgeforge-workflow.md#edge-artifacts) section to learn more about each
component.

![A diagram that displays the relationship between the three components  and how they relate to an Edge host](/clusters_edge-forge-workflow_edgeforge-workflow_components-diagram.webp)

## Get Started

To start building a custom Edge artifact, use the following guides:

[Build Edge Artifacts](./palette-canvos/palette-canvos.md). This guide builds both the Edge Installer ISO and provider
images to help you get started quickly. You can also refer to the following how-tos to learn how to build the Edge
Installer ISO and provider images individually.

- [Build Provider Images](./palette-canvos/build-provider-images.md).

- [Build Installer ISO](./palette-canvos/build-installer-iso.md).

If you want your Edge host to have preloaded content and be able to create clusters using the preloaded content, you
build a content bundle and build the content bundle into your Edge Installer ISO. Building preloaded content into your
ISO allows you to create clusters without a connection to a Palette instance. Refer to the following guides to build
content bundles:

- [Build Content Bundle](palette-canvos/build-content-bundle.md)

The following table lists the combination of our guides you can follow to build Edge artifacts with or without preloaded
content.

| Edge Artifacts have preloaded content? | Option 1                                                                                                                                                                                                 | Option 2                                                   |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| No                                     | [Build Provider Images](./palette-canvos//build-provider-images.md) + [Build Installer ISO](./palette-canvos//build-installer-iso.md)                                                                    | [Build Edge Artifacts](./palette-canvos/palette-canvos.md) |
| Yes                                    | [Build Provider Images](./palette-canvos//build-provider-images.md) + [Build Installer ISO](./palette-canvos//build-installer-iso.md) + [Build Content Bundle](./palette-canvos/build-content-bundle.md) |                                                            |

## Edge Artifacts

EdgeForge contains the following critical components:

- Edge Installer ISO.

- Edge Provider Container Images.

You can apply Center for Information System (CIS) hardening to the Edge artifacts with the `CIS_HARDENING` argument in
your `.arg` file, which implements the guidelines and solutions provided by CIS to secure your systems automatically.
For more information about available arguments in `.arg`, refer to
[Edge Artifacts Build Configuration](./palette-canvos/arg.md). The code for how we achieve CIS hardening is open source,
available in the [CanvOS repository](https://github.com/spectrocloud/CanvOS/tree/main/cis-harden).

### Edge Installer ISO

An ISO file that bootstraps the installation is created in the EdgeForge process. The ISO image contains the Edge
Installer that installs the Palette Edge host agent and metadata to perform the initial installation. The Edge Installer
ISO can also contain the following components:

- **User data** - User data includes essential configurations for the Edge Installer. The Edge Installer ISO requires
  user data to function. If you choose to not supply user data in the ISO, you must supply it before the Edge Installer
  initiates with a site user data. You can also use site user data to override or supplement the user data supplied in
  the installer ISO.

- **Content bundle** - Content bundles are archives of all the required container images required for specified cluster
  profiles. You have the option to build content bundles into the Edge Installer ISO, which allows your Edge host to
  build clusters without a connection to external image registries.

- **Cluster definition** - A cluster definition includes one or more cluster profiles. You can export cluster
  definitions from any existing cluster profiles in your Palette account. If you include a cluster definition in your
  Edge Installer ISO, you can use the profiles contained within to build a cluster without a connection to a Palette
  instance.

![A diagram breaking up the internal components of the ISO image](/clusters_edge_edgeforge-workflow_iso-diagram.webp)

### Edge Provider Container Images

These are [Kairos](https://kairos.io/)-based container images for each supported Operating System (OS) and Kubernetes
combination. These container images are downloaded during the installation by the Edge Installer and converted to disk
images for the system to boot into.

Palette provides these artifacts out-of-the-box. All the container images are hosted in Palette's public container
registries, or a private self-hosted OCI registry and automatically downloaded during installation. You can use the
default Palette container registries to familiarize yourself with the installation process. However, in a typical
production scenario, you would need to customize these artifacts to suit your specific needs or perform some
[content bundle](../edgeforge-workflow/palette-canvos/build-content-bundle.md) optimization.

![A diagram breaking up the internal components of the Edge Provider container images](/clusters_edge_edgeforge-workflow_provider-diagram.webp)

:::info

You can specify a custom registry for the Edge Installer to use during installation with the user data parameter
`registryCredentials`. Refer to the
[Installer Configuration](../edge-configuration/installer-reference.md#single-external-registry) reference resource for
more details.

:::

## Content Bundles

Content bundles are archives of all the required container images required for one or more cluster profiles. You can
build content bundles using the Palette Edge or Palette Command-line Interface (CLI) and include the preloaded content
into the Edge Installer ISO during EdgeForge. This allows the Edge host to provision clusters without a connection to an
external image registry. Refer to the following guides on how to build a content bundle and how to use them during the
EdgeForge process:

- [Build Content Bundle](./palette-canvos/build-content-bundle.md)

- [Build Installer ISO with Content Bundle](./palette-canvos/build-installer-iso.md#build-content-bundle)

## Deployment Scenarios

The Edge Installer supports various deployment scenarios. You can customize your Edge host deployment by using the Edge
Installer configuration user data, creating content bundles, and creating a custom Edge artifact. Below are a few common
scenarios that organizations encounter when deploying an Edge host that requires customization. If you have a similar
scenario, use the CLIs to help you with the customization.

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

<!-- prettier-ignore-start -->

- **Bring Your Own OS (BYOOS)**: For environments that require a different runtime OS, you can specify another OS
through the <VersionedLink text="BYOOS" url="/integrations/packs/?pack=edge-native-byoi"/> option. Follow the
instructions in the [Build Edge Artifacts](/clusters/edge/edgeforge-workflow/palette-canvos) guide to learn more about
how you can customize the OS used in an Edge deployment.
<!-- prettier-ignore-end -->

## Resources

- [Build Preloaded Content Bundles](./palette-canvos/build-content-bundle.md)

- [Build Edge Installer ISO](./palette-canvos/build-installer-iso.md)

- [Build Provider Images](./palette-canvos/build-provider-images.md)

- [Build Edge Artifacts](./palette-canvos/palette-canvos.md)

- [Prepare User Data](prepare-user-data.md)
