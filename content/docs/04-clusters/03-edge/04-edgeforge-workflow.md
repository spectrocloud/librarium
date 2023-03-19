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

Kairos-based container images for each supported Operating System (OS) and Kubernetes combination. These container images are downloaded during the installation by the Edge Installer and converted to disk images for the system to boot into.

Palette provides these artifacts out-of-the-box. All the container images are hosted in Palette's container registries and downloaded during installation. You can use the default Palette container registries to familiarize yourself with the installation process.
However, in a typical production scenario, you would need to customize these artifacts to suit your specific needs or perform some [content bundle](/clusters/edge/edgeforge-workflow/build-content-bundle) optimization.


<br />

<InfoBox>

You can specify a custom registry for the Edge Installer to use during installation by using the user data parameter `registryCredentials`. Refer to the [Installer Configuration](/clusters/edge/edge-configuration/installer-reference#externalregistry) reference resource for more details.

</InfoBox>

# Deployment Scenarios

- Addditional Packages
You might need to install additional OS packages for your specific needs, such as a NVIDIA driver, or a network package that is essential for your hardware to able to entablish an outgoing connection. These would need to be installed in the Edge Installer as well as in the Edge Provider Images.

- Installer OS Restriction
Palette's out of the box installer is OpenSUSE based. If you want to install an Ubutnu or an RHEL based edge cluster, you may not want to start off with an OpenSUSE based installer.

- Optimize Bandwidth
In your edge environments, you maybe have internet connectivity, but potentially limited bandwith. An optomization you might want to perform is embedd edge artifacts such as provider container images, etc into the installer.

- Bootstrap Install Configuration
Your install configuration (user-data) can be baked into the isntaller to optimize the workflow. This would eliminate the need for user-data to be separately built and shipped as USB drives.

- Bring your own OS
Palette provides Ubuntu 20, Ubuntu 22 and OpenSUSE images out of the box. However, you may need to build the system using your own OS such as RHEL.

# Palette Edge Content Builder

Palette provides a CLI tools called Palette Edge Content Builder, to generate create a content bundle (compressed ZST file) that can be baked into your installer for bandwith optimization. You can alternately use this tool to build the content bundle in an ISO format. In this mode, the content is not baked into the installer, but can be supplied as an additional USB drive during installtion.

# Palette Edge Image Builder

Palette provides a CLI tools called Palette Edge Image Builder, to generate your own edge artifacts. You can use this to address the concerns listed above and have your own customized artifacts. This gives you complete control to deploy and manage your edge clusters in a manner that best stuis your needs.

<br />

# Resources

The following sections describe the step-by-step procedure for building customized edge artifacts. You will need access to a container registry to deploy your edge artifacts.

- [Build Your Own OS (Optional)](/clusters/edge/edgeforge-workflow/build-kairos-os)

- [Build Content Bundle (Optional)](/clusters/edge/edgeforge-workflow/build-content-bundle)

- [Prepare User Data](/clusters/edge/edgeforge-workflow/prepare-user-data)

- [Build Images](/clusters/edge/edgeforge-workflow/build-images)
