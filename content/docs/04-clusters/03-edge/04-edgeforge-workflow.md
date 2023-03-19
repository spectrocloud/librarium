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

Deployment of edge native clusters via Spectro Cloud's Palette platform requires the following artifacts:-

<br />

#### Edge Installer ISO

An ISO file that bootstraps installation. It contains a Palette's edge host agent and metadata to perform the initial installation of the cluster.

<br />

#### Edge Host Container Image

A container image that contains Palette's edge host agents to provide day-2 management and ongoing suppoprt during cluster runtime.

<br />

#### Edge Provider Container Images

Kairos based container images for each support OS and K8s combination. These images are donwloaded during the installation time by the edge installer and converted to disk images for system to boot into.

<br />

Palette provides these artifacts out-of-the-box. The Edge Installer ISO is available to download from Palette's UI. All the container images are hosted in Palette's container registries and downlaoded during installation. These can be used to initially try out installation initially.

However, in a typical real world scenario, you most prbably would need to customize these artifacts to suit your specific needs or perform some sort of optimization.

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
