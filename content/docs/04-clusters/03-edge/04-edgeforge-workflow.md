---
title: "EdgeForge Workflow"
metaTitle: "Edge Artifact Builder Workflow"
metaDescription: "Learn how to build your own Edge artifacts customized to your specific needs."
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview

EdgeForge is the process or workflow of preparing an Edge host with all the required components and dependencies. The EdgeForge workflow contains several steps and key elements that you must complete to ensure the Edge host is ready for a successful site deployment. 

EdgeForce contains three critical components.

<br />

* Edge Installer ISO.


* Edge Host Container Image.


* Edge Provider Container Images.



Each component plays a critical role in the [lifecycle](/clusters/edge/edge-native-lifecycle) of an Edge deployment. Review the following sections to learn more about each component.



## Edge Installer ISO

An ISO file that bootstraps the installation process. The ISO image contains the Edge Installer that installs the Palette Edge host agent and metadata to perform the initial installation. The default Edge Install ISO download URL is in the [Downloads](/spectro-downloads#edgeinstallimages) resource.

<br />

## Edge Host Container Image

The Edge Host Container Image contains the Palette Edge host agent. The Edge host agent is responsible for Day-2 operations and management of the Edge host. The Edge host agent will also provide ongoing support during cluster runtime.

<br />

## Edge Provider Container Images

[Kairos](https://kairos.io/)-based container images for each supported Operating System (OS) and Kubernetes combination. These container images are downloaded during the installation by the Edge Installer and converted to disk images for the system to boot into.

Palette provides these artifacts out-of-the-box. All the container images are hosted in Palette's container registries and downloaded during installation. You can use the default Palette container registries to familiarize yourself with the installation process. However, in a typical production scenario, you would need to customize these artifacts to suit your specific needs or perform some [content bundle](/clusters/edge/edgeforge-workflow/build-content-bundle) optimization.


<br />

<InfoBox>

You can specify a custom registry for the Edge Installer to use during installation by using the user data parameter `registryCredentials`. Refer to the [Installer Configuration](/clusters/edge/edge-configuration/installer-reference#externalregistry) reference resource for more details.

</InfoBox>


# Edge Installation Support Tools

All organizations have unique environments and different needs. To help you successfully deploy an Edge host in your environment and create an Edge Native host cluster, we provide two Edge CLIs to help you customize the installation.  

<br />

* Palette Edge Content Builder


* Palette Edge Image Builder

Each CLI has a unique purpose and will help you create the proper resources to deploy your Edge host successfully. 

<br />

## Palette Edge Content Builder

You can use the Palette Edge Content Builder CLI to create content bundles. The content bundle is a compressed ZST file you can include with the Edge Install installer for bandwidth optimization. The CLI can also build the content bundle in an ISO format. In an ISO format, the content is not baked into the installer but can be supplied as an additional USB drive during installation. 

To learn how to use Palette Edge Content Builder CLI to create content bundles, check out the [Build Content Bundle](/clusters/edge/edgeforge-workflow/build-content-bundle) guide.

<br />

## Palette Edge Image Builder

The Palette Edge Image Builder CLI is a tool for creating custom Edge artifacts. You can use the CLI to address the common deployment concerns about required packages, software restrictions, bandwidth concerns, and more. By using your Edge artifacts, you gain complete control over the deployment and manage the software in your Edge clusters to best suit your organization's needs.

Follow the instructions in the [Build Images](/clusters/edge/edgeforge-workflow/build-images) guide to learn more about creating custom Edge artifacts.

<br />

# Deployment Scenarios

The Edge Installer supports various unique deployment scenarios. You can customize your Edge host deployment using the Edge Installer configuration user data, creating content bundles, and creating a custom Edge artifact. Below are a few common scenarios organizations encounter when deploying an Edge host that requires customization. If you are in a similar scenario, use the CLIs to help you with the customization.

<br />

- **Additional Packages**:
You may need to install additional OS packages for your specific needs, such as an NVIDIA driver or a network package essential for your hardware to establish an outgoing network connection. These additional OS packages would need to be added to the Edge Installer and the Edge Provider images.


- **Installer OS Restriction**:
Palette's out-of-the-box Edge Installer is based on the OpenSUSE OS. If you want to install an Ubuntu or an RHEL-based Edge cluster, you may need an Edge Installer based on another OS.


- **Optimize Bandwidth**:
In your Edge environments, you may have internet connectivity but limited bandwidth. You can optimize the installation process by embedding all the required components, such as the Edge Host Container Image, the Edge Provider Container Images, and content bundles, into the Edge Installer. By embedding the required components in the Edge Installer, you remove the need to download the components during installation.


- **Bootstrap Install Configuration**:
You can embed the Edge Install configuration user data into the Edge Installer. This removes the need to create separate user data uploaded as an ISO through a USB drive. Check out the [Prepare User Data](/clusters/edge/edgeforge-workflow/prepare-user-data) guide to learn more about user data and when to use multiple user data files.


- **Bring Your Own OS (BYOOS)**:
Palette provides the following runtime OS out-of-the-box for all Edge Hosts. For environments that require a different runtime OS, you can specify another OS through the BYOOS option. Follow the instructions in the [Bring Your Own OS](/clusters/edge/edgeforge-workflow/build-kairos-os) guide to learn more about BYOOS.

# Build a Custom Edge Artifact



To start building a custom Edge artifact, use the following guides. You should review each guide sequentially, although some guides may not apply to your Edge deployment.

<br />

- [Bring Your Own OS](/clusters/edge/edgeforge-workflow/build-kairos-os)


- [Build Content Bundle](/clusters/edge/edgeforge-workflow/build-content-bundle)


- [Prepare User Data](/clusters/edge/edgeforge-workflow/prepare-user-data)


- [Build Images](/clusters/edge/edgeforge-workflow/build-images)
