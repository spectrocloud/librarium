---
title: "Create Images with Image Builder"
metaTitle: "Create Images with Image Builder"
metaDescription: "Learn how to use the Image Builder project to create images for Palette"
icon: ""
hideToC: true
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';

# Overview

Using various tools, you can create and deploy custom images to most infrastructure providers. Many infrastructure providers have their own tools that you can use to create custom images for the platform, such as [AWS EC2 Image Builder](https://aws.amazon.com/image-builder/) for AWS or [Azure VM Image Builder](https://azure.microsoft.com/en-us/products/image-builder) for Azure. You can also use platform agnostic tools, such as [HashiCorp Packer](https://developer.hashicorp.com/packer), or something more tailored to Kubernetes, such as the [Kubernetes Image Builder](https://image-builder.sigs.k8s.io/introduction.html) project.


## Kubernetes Image Builder

The Kubernetes Image Builder (KIB) is a project designed to help users create images for various platforms. The project is a consolidation of multiple tools that together work to create an artifact, or in simpler terms, a custom image. 

You can use the custom images created by KIB with Palette, assuming the infrastructure provider is supported in Palette. Use the following diagram to understand how you can use KIB to create custom images that you can use with Palette.

![A diagram displaying the steps for creating a custom image](/cluster-profiles_byoos_image-builder_workflow-diagram.png) <br />

1. You will download the KIB project and configure the image builder's `packer.json` file.


2. Use the `make` command to create a custom image containing a specific Operating System (OS) version and flavor.


3. The image is created and distributed to the target regions you specified in the `packer.json` file.


4. Create a cluster profile that points to the custom image you created.


5. Deploy a host cluster using your cluster profile containing the custom image.


This guide will teach you how to use the Kubernetes Image Builder to create images for your infrastructure provider so that you can use the custom image in a cluster profile.

# Prerequisites

* [Git](https://git-scm.com/downloads) v2.39.1 or greater.


* Access credentials to the target infrastructure provider. KBI through the help of Packer, deploys a compute instance to the target environment during the image creation process.

<br />

<WarningBox>

If you want to use a commercial OS, you must provide the license before starting the image creation process.

</WarningBox>

# Create Image