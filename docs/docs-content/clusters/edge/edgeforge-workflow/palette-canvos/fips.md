---
sidebar_label: "Build FIPS-Enabled Edge Artifacts"
title: "Build FIPS-Enabled Edge Artifacts"
description: "Learn how to build Edge Installer ISO and provider images to install FIPS-compliant Palette Edge."
icon: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["edge"]
---

Palette Edge supports Federal Information Processing Standards (FIPS)-compliant Edge clusters. To deploy a
FIPS-compliant Edge cluster, you need to build FIPS-enabled Edge artifacts. Both the Edge Installer ISO and the provider
images must be FIPS-enabled.

This page guides you through the process of building FIPS-enabled Edge artifacts.

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

- Depending on the Operating System (OS) you want to use on your Edge host, you will need subscription credentials.

  - Red Hat Enterprise Linux (RHEL): RHEL subscription token.
  - Ubuntu Pro: Ubuntu Pro subscription token.

  Contact your system administrator for access to the subscription tokens.

- [Git](https://cli.github.com/manual/installation). You can ensure git installation by issuing the `git --version`
  command.

- [Docker Engine](https://docs.docker.com/engine/install/) version 18.09.x or later. You can use the `docker --version`
  command to view the existing Docker version. You should have root-level or `sudo` privileges on your Linux machine to
  create privileged containers.

- A [Spectro Cloud](https://console.spectrocloud.com) account. If you have not signed up, you can sign up for a
  [free trial](https://www.spectrocloud.com/free-tier/).

- Palette registration token for pairing Edge hosts with Palette. You will need tenant admin access to Palette to
  generate a new registration token. For detailed instructions, refer to the
  [Create Registration Token](/clusters/edge/site-deployment/site-installation/create-registration-token) guide.

## Build FIPS-Enabled Edge Artifacts

### Clone CanvOS Repository

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

### Build FIPS-Compliant Base OS Image

Before we can build the Edge Installer ISO or the provider images, we need to build a FIPS-compliant Operating Systems
(OS) base image with the Kairos framework.

Palette supports the Red Hat Enterprise Linux (RHEL) and Ubuntu for FIPS-compliant base OS images. Choose the OS that
you want to build the base image with.

<Tabs>

<TabItem label="Red Hat Enterprise Linux" value="rhel">

5. Change into the **rhel-fips** directory.

6. In the file **Dockerfile**, provide your RHEL subscription username and password.

   ```text
   ARG USERNAME=name@spectrocloud.com
   ARG PASSWORD=***********
   ```

7. Issue the following command to start building the provider images.

   ```shell
   bash build.sh
   ```

   :::info

   If you run into issues with the script recognizing the RHEL credentials, try replacing the credentials directly in
   the Docker file in the following line:

   ```dockerfile
   RUN rm /etc/rhsm-host && subscription-manager register --username 'your-username' --password '*******' \
   ```

   :::

8. When the build finishes, issue `docker images` and confirm there is an image named `rhel-byoi-fips:latest`. This is
   the base image that you will use to build provider images and the Edge installer ISO later on.

9. Tag the image with a repository that is accessible by your Linux machine. For example, use the publicly accessible
   `ttl.sh` repository.

   ```shell
   docker tag rhel-byoi-fips:latest ttl.sh/rhel/rhel-byoi-fips:latest
   ```

   Push the image to the repository.

   ```shell
   docker push ttl.sh/rhel/rhel-byoi-fips:latest
   ```

</TabItem>

<TabItem label="Ubuntu" value="ubuntu">

5. Change into the **ubuntu-fips** directory.

6. In the file **pro-attach-config.yaml**, provide your Ubuntu Pro subscription token.

   ```yaml
   token: *******
   ```

7. Issue the following command to start building the provider images.

   ```shell
   bash build.sh
   ```

8. When the build finishes, issue `docker images` and confirm there is an image named `ubuntu-focal-fips:latest`. This
   is the base image that you will use to build provider images and the Edge installer ISO later on.

9. Tag the image with a repository that is accessible by your Linux machine. For example, use the publicly accessible
   `ttl.sh` repository.

   ```shell
   docker tag ubuntu-focal-fips:latest ttl.sh/ubuntu/ubuntu-focal-fips:latest
   ```

   Push the image to the repository.

   ```shell
   docker push ttl.sh/ubuntu/ubuntu-focal-fips:latest
   ```

</TabItem>

</Tabs>

### Build Edge Installer ISO

9. Return to the **CanvOS** directory.

   ```shell
   cd ..
   ```

10. Create a file named **.arg**. This file will contain parameters that customize the Edge Installer ISO build.

11. In the **.arg** file, provide the following required information. Refer to
    [Edge Artifact Build Configuration](arg.md) for more information.

    | Argument         | Description                                                                                                                                        |
    | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
    | IMAGE_REGISTRY   | The image registry to use for tagging the generated provider images.                                                                               |
    | OS_DISTRIBUTION  | The OS distribution in your provider image.                                                                                                        |
    | IMAGE_REPO       | The image repository to use for tagging the generated provider images.                                                                             |
    | OS_VERSION       | The OS version in your provider image. This only applies to Ubuntu.                                                                                |
    | K8S_DISTRIBUTION | The Kubernetes distribution for your provider image. Allowed values are `rke2` and `kubeadm-fips`.                                                 |
    | FIPS_ENABLED     | Whether to enable FIPS compliance. This parameter must be set to `true`.                                                                           |
    | ARCH             | The architecture of the image. Allowed values are `amd64` and `arm64`.                                                                             |
    | BASE_IMAGE       | The base image used by EdgeForge to build the Edge Installer and provider images. This must be the same image that you build in the previous step. |
    | ISO_NAME         | The file name of the ISO file that will be generated.                                                                                              |

12. Create a file named **user-data**, This file configures the Edge Installer. Refer to
    [Installer Reference](../../edge-configuration/installer-reference.md) for more information.

13. Add the following block to root level of the **user-data** file.

    ```yaml
    install:
      grub_options:
        extra_cmdline: "fips=1"
    ```

14. Issue the following command to build the Edge Installer ISO.

    ```shell
    ./earthly.sh +iso
    ```

    When the build finishes, the ISO file will be generated in the **build** directory under the name you specified in
    your **.arg** file.

### Build FIPS-Compliant Provider Images

Provider images are Kairos-based container images for a supported OS and Kubernetes distribution combination.
FIPS-complaint provider images are built on top of the base OS image you have built previously.

15. Locate **Earthfile** in the CanvOS directory. In the file, find the block that starts with
    `build-provider-images-fips:` and delete the Kubernetes versions that you do not want. This will speed up the build
    process and save storage space.

16. Review the **.arg** file again to ensure the parameters are correct. Issue the following command to build the
    provider images:

    ```shell
      ./earthly +build-provider-images-fips
    ```

    :::warning

    For the Kubernetes distribution, only `rke2` and `kubeadm-fips` will produce FIPS-compliant provider images.

    :::

## Validate

1. Follow the [Site Installation](../../site-deployment/stage.md) guide to install the Palette Edge on your Edge host.

2. Issue the following command and ensure that the output is `1`. This means the OS is FIPS enabled.

   ```shell
   cat /proc/sys/crypto/fips_enabled
   ```
