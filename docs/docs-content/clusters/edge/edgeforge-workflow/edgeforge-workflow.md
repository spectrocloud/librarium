---
sidebar_label: "EdgeForge Workflow"
title: "EdgeForge Workflow"
description: "Learn how to build your own Edge artifacts customized to your specific needs."
hide_table_of_contents: false
tags: ["edge"]
---


*EdgeForge* is the process or workflow of preparing an Edge host with all the required components and dependencies. The EdgeForge workflow contains several steps and key elements that you must complete to ensure the Edge host is ready for a successful site deployment. 

EdgeForge contains three critical components.

* Edge Installer ISO.


* Edge Host Agent Container Image.


* Edge Provider Container Images.



Each component plays a critical role in the [lifecycle](../edge-native-lifecycle.md) of an Edge deployment. Review the [Edge Artifacts](../edgeforge-workflow/edgeforge-workflow.md#edge-artifacts) section to learn more about each component.

![A diagram that displays the relationship between the three components  and how they relate to an Edge host](/clusters_edge-forge-workflow_edgeforge-workflow_components-diagram.png)


## Get Started


To start building a custom Edge artifact, use the [Build Edge Artifacts](palette-canvos.md) guide.

<br />

## Edge Artifacts

### Edge Installer ISO

An ISO file that bootstraps the installation is created in the EdgeForge process. The ISO image contains the Edge Installer that installs the Palette Edge host agent and metadata to perform the initial installation.

<br />

![A diagram breaking up the internal components of the ISO image](/clusters_edge_edgeforge-workflow_iso-diagram.png)

### Edge Host Agent Container Image

The Edge host agent container image contains the Palette Edge host agent. The agent is responsible for Day-2 operations and management of the Edge host. The Edge host agent also provides ongoing support during cluster runtime.

<br />

### Edge Provider Container Images

These are [Kairos](https://kairos.io/)-based container images for each supported Operating System (OS) and Kubernetes combination. These container images are downloaded during the installation by the Edge Installer and converted to disk images for the system to boot into.

Palette provides these artifacts out-of-the-box. All the container images are hosted in Palette's public container registries, or a private self-hosted OCI registry and automatically downloaded during installation. You can use the default Palette container registries to familiarize yourself with the installation process. However, in a typical production scenario, you would need to customize these artifacts to suit your specific needs or perform some [content bundle](../edgeforge-workflow/build-content-bundle.md) optimization.

<br />

  ![A diagram breaking up the internal components of the Edge Provider container images](/clusters_edge_edgeforge-workflow_provider-diagram.png)


:::info

You can specify a custom registry for the Edge Installer to use during installation with the user data parameter `registryCredentials`. Refer to the [Installer Configuration](../edge-configuration/installer-reference.md#external-registry) reference resource for more details.

:::

## Deployment Scenarios

The Edge Installer supports various deployment scenarios. You can customize your Edge host deployment by using the Edge Installer configuration user data, creating content bundles, and creating a custom Edge artifact. Below are a few common scenarios that organizations encounter when deploying an Edge host that requires customization. If you have a similar scenario, use the CLIs to help you with the customization.

<br />

- **Additional Packages**:
You may need to install additional OS packages for your specific needs, such as an NVIDIA driver or a network package essential for your hardware to establish an outgoing network connection. These additional OS packages would need to be added to the Edge Installer and the Edge Provider images.


- **Installer OS Restriction**:
Palette's out-of-the-box Edge Installer is based on the OpenSUSE OS. If you want to install an Ubuntu or an RHEL-based Edge cluster, you may need an Edge Installer based on another OS.


- **Optimize Bandwidth**:
In your Edge environments, you may have internet connectivity but limited bandwidth. You can optimize the installation process by embedding all the required components such as the Edge Host Container Image, the Edge Provider Container Images, and content bundles into the Edge Installer. By embedding the required components in the Edge Installer, you remove the need to download the components during installation.


- **Bootstrap Install Configuration**:
You can embed the Edge Installer configuration user data into the Edge Installer. This removes the need to create separate user data uploaded as an ISO through a USB drive. Check out the [Prepare User Data](/clusters/edge/edgeforge-workflow/prepare-user-data) guide to learn more about user data and when to use multiple user data files.


- **Bring Your Own OS (BYOOS)**:
For environments that require a different runtime OS, you can specify another OS through the [BYOOS](/integrations/byoos) option. Follow the instructions in the [Build Edge Artifacts](/clusters/edge/edgeforge-workflow/palette-canvos) guide to learn more about how you can customize the OS used in an Edge deployment.

<br />

## Resources


- [Build Edge Artifacts](palette-canvos.md)


- [Build Preloaded Content Bundles](build-content-bundle.md)


- [Build Edge Artifacts using a Content Bundle](build-artifacts.md)


- [Prepare User Data](prepare-user-data.md)