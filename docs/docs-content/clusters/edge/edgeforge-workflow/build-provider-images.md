---
sidebar_label: "Build Provider Images"
title: "Build Provider Images"
description: "Learn how to build provider images using the Palette Edge CLI and the EdgeForge utilities."
icon: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["edge"]
---

In this guide, you will use the CanvOS utility to build provider images for your Edge deployment. Provider images are
Kairos-based images containing the OS and the desired Kubernetes versions. These images install an immutable Operating
System (OS) and software dependencies compatible with a specific Kubernetes version during the cluster deployment. A
provider image is used in the OS and the Kubernetes layer when creating a cluster profile. These container images are
downloaded during the installation by the Edge Installer and converted to disk images for the system to boot into.

:::info

The provider images are one of the critical artifacts you need to build during EdgeForge. The other artifact is the Edge
Installer ISO. Both are required for Edge deployment. For education purposes, we provide separate instructions for
building the installer ISO and the provider images. However, these two artifacts are often built together in a single
step in practice. Refer to [Build Edge Artifacts](palette-canvos.md) for an how-to that covers how to build both
artifacts at the same time.

:::

## Prerequisites

- A physical or virtual Linux machine with _AMD64_ (also known as _x86_64_) processor architecture to build the Edge
  artifacts. You can issue the following command in the terminal to check your processor architecture.

  ```bash
  uname -m
  ```

- Minimum hardware configuration of the Linux machine:

  - 4 CPU
  - 8 GB memory
  - 50 GB storage

- [Git](https://cli.github.com/manual/installation). You can ensure git installation by issuing the `git --version`
  command.

- [Docker Engine](https://docs.docker.com/engine/install/) version 18.09.x or later. You can use the `docker --version`
  command to view the existing Docker version. You should have root-level or `sudo` privileges on your Linux machine to
  create privileged containers.

## Build Provider Images

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

4. Check out the newest available tag. This guide uses the tag **v4.3.0** as an example.

   ```shell
   git checkout v4.3.0
   ```

5. Review the files relevant for this guide.

   - **.arg.template** - A sample **.arg** file that defines arguments to use during the build process.

   - **Earthfile** - Contains a series of commands to create target artifacts.

   - **earthly.sh** - Script to invoke the Earthfile, and generate target artifacts.

6. Review the **.arg** file containing the customizable arguments, such as image tag, image registry, image repository,
   and OS distribution. The table below shows all arguments, their default value, and allowed values.

   | **Argument**       | **Description**                                                     | **Default Value**  | **Allowed Values**                                                                             |
   | ------------------ | ------------------------------------------------------------------- | ------------------ | ---------------------------------------------------------------------------------------------- |
   | `CUSTOM_TAG`       | Tag for the provider images                                         | demo               | Lowercase alphanumeric string without spaces.                                                  |
   | `IMAGE_REGISTRY`   | Image registry name                                                 | ttl.sh             | Your image registry hostname, without `http` or `https` <br /> Example: docker.io/spectrocloud |
   | `OS_DISTRIBUTION`  | OS Distribution                                                     | ubuntu             | ubuntu, opensuse-leap                                                                          |
   | `IMAGE_REPO`       | Image repository name.<br /> It is the same as the OS distribution. | `$OS_DISTRIBUTION` | Your image repository name.                                                                    |
   | `OS_VERSION`       | OS version, only applies to Ubuntu                                  | 22.04              | 20, 22.04                                                                                      |
   | `K8S_DISTRIBUTION` | Kubernetes Distribution                                             | k3s                | k3s, rke2, kubeadm                                                                             |
   | `ARCH`             | Architecture of the image.                                          | `amd64`            | `amd64`, `arm64`                                                                               |

7. Issue the command below to assign an image tag value that will be used when creating the provider images. This guide
   uses the value `palette-learn` as an example. However, you can assign any lowercase and alphanumeric string to the
   `CUSTOM_TAG` argument.

   ```bash
   export CUSTOM_TAG=palette-learn
   ```

8. Use the command below to save the Docker Hub image registry hostname in the `IMAGE_REGISTRY` argument. Before you
   execute the command, replace `[DOCKER-ID]` in the declaration below with your Docker ID. Your image registry hostname
   must comply with standard DNS rules and may not contain underscores.

   ```bash
   export IMAGE_REGISTRY=docker.io/[DOCKER-ID]
   ```

9. Issue the following command to use the Ubuntu OS distribution and use the 22.04 version.

   ```bash
   export OS_DISTRIBUTION=ubuntu
   export OS_VERSION=22.04
   ```

10. Issue the command below to create the **.arg** file containing the custom tag, Docker Hub image registry hostname,
    and openSUSE Leap OS distribution. The **.arg** file uses the default values for the remaining arguments. You can
    refer to the existing **.arg.template** file to learn more about the available customizable arguments.

    ```bash
    cat << EOF > .arg
    IMAGE_REGISTRY=$IMAGE_REGISTRY
    OS_DISTRIBUTION=$OS_DISTRIBUTION
    OS_VERSION=$OS_VERSION
    IMAGE_REPO=$OS_DISTRIBUTION
    CUSTOM_TAG=$CUSTOM_TAG
    K8S_DISTRIBUTION=k3s
    ARCH=amd64
    HTTPS_PROXY=
    HTTP_PROXY=
    PROXY_CERT_PATH=
    UPDATE_KERNEL=false
    EOF
    ```

11. Open the **Earthfile** in the CanvOS directory. Under `build-provider-images`, remove the lines containing
    Kubernetes versions that you do not need.

12. CanvOS utility uses [Earthly](https://earthly.dev/) to build the target artifacts. Issue the following command to
    start the build process.

    ```bash
    sudo ./earthly.sh +build-provider-images
    ```

    ```hideClipboard bash {2}
    # Output condensed for readability
    ===================== Earthly Build SUCCESS =====================
    Share your logs with an Earthly account (experimental)! Register for one at https://ci.earthly.dev.
    ```

13. To use the provider images in your cluster profile, push them to your image registry mentioned in the **.arg** file.
    Issue the following command to log in to Docker Hub. Provide your Docker ID and password when prompted.

    ```bash
    docker login
    ```

14. Use the following commands to push the provider images to the Docker Hub image registry you specified. Replace the
    `[DOCKER-ID]` and version numbers in the command below with your Docker ID and respective Kubernetes versions that
    the utility created.

    ```bash
    docker push docker.io/[DOCKER-ID]/ubuntu:k3s-1.28.2-v4.3.0-palette-learn
    ```

## Validate

1. List the Docker images to review the provider images created. You can identify the provider images by reviewing the
   image tag value you used in the **.arg** file's `CUSTOM_TAG` argument.

   ```
   docker images --filter=reference='*/*:*palette-learn'
   ```

2. Verify that the provider images were created successfully.

   ```hideClipboard
   REPOSITORY                            TAG                                   IMAGE ID       CREATED         SIZE
   docker.io/[DOCKER-ID]/ubuntu          k3s-1.28.2-v4.3.0-palette-learn       075134ad5d4b   10 minutes ago   4.11GB
   ```

## Next Steps

Provider images are only one the artifacts you need to provision an Edge deployment. You also need to build the Edge
Installer ISO that matches your provider image settings. Refer to [Build Edge Installer ISO](./build-installer-iso.md)
for more information.

If you have built both provider images and the installer ISO, refer to
[Site Deployment](../site-deployment/site-deployment.md) to learn how to deploy your Edge cluster.
