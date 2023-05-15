---
title: "Bring Your Own OS"
metaTitle: "Bring Your Own OS - Create Kairos Image"
metaDescription: "Learn about building your own Kairos Image"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview

Edge supports using a different Operating System (OS)  for your Edge host runtime. Building a system using your OS requires creating a Kairos-based image from your raw OS image.

<br />

<InfoBox>

The instructions in this guide are optional if all you want to do is build an Edge artifact from one of Palette's out-of-the-box supported OS.

</InfoBox>

As an example, the following steps will guide you through the procedure to build a Kairos-based RHEL image. You can alter the steps as needed for your operating system. 
# Prerequisites

- Linux Machine (Physical or VM) with an AMD64 architecture.


- Access to a container registry with permission to push container images. Review the registry login instructions for your respective registry for guidance on logging in.


<WarningBox>

Some OS require credentials to download the source image, such as Red Hat Enterprise Linux (RHEL). An RHEL subscription is required in this example to download the RHEL Universal Base Images (UBI) for building the Edge provider image. Ensure you have the credentials necessary to download the OS source image.


</WarningBox>


# Build Image

1. Issue the following commands to prepare your server. You can also add more packages to the `apt install` command if needed.
  <br />

  ```shell
  mkdir -p /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
  sudo apt update -y
  sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin git-all -y
  ```

2. Create a workspace and download the builder code.

  <br />

  ```shell
  mkdir -p ~/workspace/
  cd workspace/
  git clone https://github.com/spectrocloud/pxke-samples
  ```

3. Build Karios Image. In this step, you will create a Kairos-based core image from an RHEL 8 base OS. Core images form the basis for Kubernetes provider images used for host cluster provisioning. Review the contents of the Dockerfile to understand the various steps involved in this process. You must supply credentials to your RHEL subscription to successfully build the image.

  <br />

  ```shell
   cd pxke-samples/core-images
   docker build \
   --tag [your image repository]/rhel8-kairos:1.0 \
   --build-arg USERNAME=[rhel subscription username]\
   --build-arg PASSWORD=[rhel subscription password] \
   --file Dockerfile.rhel8 .
  ```

4. Upload the image to your container registry.

  <br />

  ```shell
  docker push [your image repository]/rhel8-kairos:1.0
  ```

Your image will be used in the [Build Images](/clusters/edge/edgeforge-workflow/build-images) and become part of your Edge artifact.

<br />


# Customize OS with BYOOS

The Bring Your Own OS (BYOOS) feature allows you to upload and customize the operating system images used to build the Edge cluster profile. Using BYOOS for Edge, you can configure cluster profiles to use the **BYOS Edge OS** pack. 

BYOOS gives you the flexibility to tailor and manage the OS layer in your cluster profiles, ensuring that clusters perform optimally to meet your environment needs. 
To learn how to upload your own OS images, refer to the [Model Edge Native Cluster Profile](https://docs.spectrocloud.com/clusters/edge/site-deployment/model-profile) guide.


# Next Steps


Your next step is to evaluate if you need to create a content bundle. To create a content bundle, check out the [Build Content Bundle](/clusters/edge/edgeforge-workflow/build-content-bundle) guide.

<br />
