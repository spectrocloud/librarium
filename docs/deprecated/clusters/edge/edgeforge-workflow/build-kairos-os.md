---
sidebar_label: "Bring Your Own OS"
title: "Bring Your Own OS - Create Kairos Image"
description: "Learn about building your own Kairos Image"
hide_table_of_contents: false

---






# Overview

Edge supports the ability for you to specify a custom Operating System (OS) for your Edge host runtime. Building a system using your choice of OS requires creating a [Kairos-base](https://kairos.io/) image with your custom OS. The Palette feature, [Bring Your Own OS (BYOOS)](/integrations/byoos) allows you to use a custom OS in a cluster profile. 


As an example, the following steps will guide you on how to build a Kairos-based Red Hat Enterprise Linux (RHEL) image. Use the same steps for any other operating system.

<br />


:::info

BYOOS gives you the flexibility to tailor and manage the OS layer in your cluster profiles, ensuring that clusters perform optimally to meet your environment needs. 
To learn how to use your own OS images with an Edge cluster profile, refer to the [Model Edge Native Cluster Profile](https://docs.spectrocloud.com/clusters/edge/site-deployment/model-profile) guide.


:::

# Prerequisites

- Linux Machine (Physical or VM) with an AMD64 architecture.


- Access to a container registry with permission to push container images. Review the registry login instructions for your respective registry for guidance on logging in.


:::warning

Some operating systems require credentials to download the source image, such as RHEL. An RHEL subscription is required in this example to download the RHEL Universal Base Images (UBI) needed to build the Edge provider image. Ensure you have the necessary credentials to download the OS source image.


:::


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
---

<br />

Your image will be used in the [Build Images](/clusters/edge/edgeforge-workflow/palette-canvos) step and become part of your Edge artifact. The custom OS you created will also be used in the OS layer of the cluster profile by using the [Bring Your Own OS (BYOOS)](/integrations/byoos) pack.
<br />


# Next Steps


Your next step is to evaluate if you need to create a content bundle. To create a content bundle, check out the [Build Content Bundle](/clusters/edge/edgeforge-workflow/palette-canvos) guide.

<br />
