---
sidebar_label: "Build Provider Images with Trusted Boot"
title: "Build Provider Images with Trusted Boot"
description: "Learn about how to build Edge Artifacts for Trusted Boot."
hide_table_of_contents: false
sidebar_position: 30
tags: ["edge"]
---

This page guides you through the process of creating provider images for Edge clusters with Trusted Boot enabled.
Provider images are Kairos-based container images for each supported Operating System (OS) and Kubernetes combination.
Since provider images contain the OS, which is a part of the boot process, the provider image needs to be signed by a
key that is in the signature database.

## Prerequisites

- A physical or virtual Linux machine with _AMD64_ (also known as x86_64) processor architecture to build the Edge
  artifacts. You can issue the following command in the terminal to check your processor architecture.

  ```bash
  uname -m
  ```

- Minimum hardware configuration of the Linux machine:

  - 4 CPU
  - 32 GB memory
  - 50 GB storage

- You have generated Trusted Boot keys in the **secure-boot/enrollment** folder and have stored the private **db.key**
  and **tpm2-pcr-private.pem** folder on the machine where you are building the provider images.

- A physical or virtual Linux machine with AMD64 (also known as x86_64) processor architecture to build the Edge
  artifacts. You can issue the following command in the terminal to check your processor architecture.

  ```shell
  uname -m
  ```

- [Git](https://cli.github.com/manual/installation). You can ensure git installation by issuing the git --version
  command.

- [Docker Engine](https://docs.docker.com/engine/install/) version 18.09.x or later. You can use the docker --version
  command to view the existing Docker version. You should have root-level or sudo privileges on your Linux machine to
  create privileged containers.

- - Familiarity with the [EdgeForge Workflow](../edgeforge-workflow/).

## Build Provider Images with Trusted Boot

1. Check out the [CanvOS](https://github.com/spectrocloud/CanvOS) GitHub repository containing the starter code.

   ```bash
   git clone https://github.com/spectrocloud/CanvOS.git
   ```

2. Change to the **CanvOS/** directory.

   ```bash
   cd CanvOS
   ```

3. View the available [git tag](https://github.com/spectrocloud/CanvOS/tags).

   ```bash
   git tag
   ```

4. Check out the newest available tag. This guide uses the tag **v4.4.0** as an example.

   ```shell
   git checkout v4.4.0
   ```

5. Review the files relevant for this guide.

   - **.arg.template** - A sample **.arg** file that defines arguments to use during the build process.

   - **Earthfile** - Contains a series of commands to create target artifacts.

   - **earthly.sh** - Script to invoke the Earthfile, and generate target artifacts.

6. Issue the command below to assign an image tag value that will be used when creating the provider images. This guide
   uses the value `trusted-boot` as an example. However, you can assign any lowercase and alphanumeric string to the
   `CUSTOM_TAG` argument.

   ```bash
   export CUSTOM_TAG=trusted-boot
   ```

7. Use the command below to save the Docker Hub image registry hostname in the `IMAGE_REGISTRY` argument. Before you
   execute the command, replace `[DOCKER-ID]` in the declaration below with your Docker ID. Your image registry hostname
   must comply with standard DNS rules and may not contain underscores.

   ```bash
   export IMAGE_REGISTRY=docker.io/[DOCKER-ID]
   ```

8. Issue the following command to use the Ubuntu OS distribution and use the 23.10 version.

   ```bash
   export OS_DISTRIBUTION=ubuntu
   export OS_VERSION=23.10
   ```

9. Issue the command below to create the **.arg** file containing the custom tag, Docker Hub image registry hostname,
   and Ubuntu OS distribution. The **.arg** file uses the default values for the remaining arguments. Refer to
   [Edge Artifact Build Configurations](../edgeforge-workflow/palette-canvos/arg.md) for all available arguments.

   ```bash
   cat << EOF > .arg
   IMAGE_REGISTRY=$IMAGE_REGISTRY
   OS_DISTRIBUTION=$OS_DISTRIBUTION
   OS_VERSION=$OS_VERSION
   IMAGE_REPO=$OS_DISTRIBUTION
   CUSTOM_TAG=$CUSTOM_TAG
   K8S_DISTRIBUTION=rke2
   ARCH=amd64
   UPDATE_KERNEL=false
   IS_UKI=true
   EOF
   ```

   The following table lists a few key arguments for you to pay close attention to.

   | **Argument**       | **Description**                                                                                       | **Allowed Values**                         |
   | ------------------ | ----------------------------------------------------------------------------------------------------- | ------------------------------------------ |
   | `IS_UKI`           | Determines whether to build a provider image that supports Trusted Boot. You must set this to `true`. | `true`, `false`. Default is `false`.       |
   | `K8S_DISTRIBUTION` | Kubernetes distribution.                                                                              | ` k3s`, `rke2`, `kubeadm`, `kubeadm-fips`. |
   | `OS_DISTRIBUTION`  | OS distribution.                                                                                      | `ubuntu`, `opensuse-leap`, `rhel`.         |
   | `OS_VERSION`       | OS version. This applies to Ubuntu only.                                                              | `20`, `22`.                                |

10. Open the **Earthfile** in the CanvOS directory. Under `build-provider-images`, remove the lines containing
    Kubernetes versions that you do not need.

11. CanvOS utility uses [Earthly](https://earthly.dev/) to build the target artifacts. Issue the following command to
    start the build process.

    ```bash
    ./earthly.sh +build-provider-images
    ```

    ```hideClipboard bash
    # Output condensed for readability
    ===================== Earthly Build SUCCESS =====================
    Share your logs with an Earthly account (experimental)! Register for one at https://ci.earthly.dev.
    ```

12. To use the provider images in your cluster profile, push them to your image registry mentioned in the **.arg** file.
    Issue the following command to log in to Docker Hub. Provide your Docker ID and password when prompted.

    ```bash
    docker login
    ```

13. Use the following commands to push the provider images to the Docker Hub image registry you specified. Replace the
    `[DOCKER-ID]` and version numbers in the command below with your Docker ID and respective Kubernetes versions that
    the utility created.

    ```bash
    docker push docker.io/[DOCKER-ID]/ubuntu:rke2-1.28.2-v4.4.0-trusted-boot
    ```

## Validate

1. List the Docker images to review the provider images created. You can identify the provider images by reviewing the
   image tag value you used in the **.arg** file's `CUSTOM_TAG` argument.

   ```
   docker images --filter=reference='*/*:*trusted-boot'
   ```

2. Verify that the provider images were created successfully.

   ```hideClipboard
   REPOSITORY                            TAG                                   IMAGE ID       CREATED         SIZE
   docker.io/[DOCKER-ID]/ubuntu          rke2-1.28.2-v4.4.0-trusted-boot       075134ad5d4b   10 minutes ago  1.79GB
   ```
