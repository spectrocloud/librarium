---
sidebar_label: "Build FIPS-Compliant Edge Artifacts"
title: "Build FIPS-Compliant Edge Artifacts"
description: "Learn how to build Edge Installer ISO and provider images to install FIPS-compliant Palette Edge."
icon: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["edge"]
---

Palette Edge supports
[Federal Information Processing Standards](https://www.nist.gov/standardsgov/compliance-faqs-federal-information-processing-standards-fips)
(FIPS)-compliant Edge clusters. To deploy a FIPS-compliant Edge cluster, you need to build FIPS-enabled Edge artifacts.
Both the Edge Installer ISO and the provider images must be FIPS-compliant.

This page guides you through the process of building FIPS-compliant Edge Installer ISO and provider images.

## Limitations

- FIPS-compliant Edge installer does not work with secure boot. You need to disable secure boot first before installing
  Palette on your device. The process to disable secure boot varies by device, but generally, you can press F2 upon
  powering up the Edge host, and find the option to disable secure boot in the Basic Input/Output System (BIOS)
  interface.

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

- Depending on the Operating System (OS) you want to use on your Edge host, you will need the following subscription
  credentials:

  - Red Hat Enterprise Linux (RHEL): RHEL subscription token.
  - Ubuntu Pro: Ubuntu Pro subscription token.

  Contact your system administrator for access to the subscription credentials.

- [Git](https://git-scm.com/downloads). You can ensure git installation by issuing the `git --version` command.

- [Docker Engine](https://docs.docker.com/engine/install/) version 18.09.x or later. You can use the `docker --version`
  command to check the existing Docker version. You should have root-level or `sudo` privileges on your Linux machine to
  create privileged containers.

- A [VerteX](/docs/docs-content/vertex/vertex.md) or Palette account. Refer to
  [Palette VerteX](/docs/docs-content/vertex/vertex.md#access-palette-vertex) for information on how to set up a VerteX
  account.

- VerteX registration token for pairing Edge hosts with VerteX or a Palette registration token. You will need tenant
  admin access to VerteX to generate a new registration token. For detailed instructions, refer to the
  [Create Registration Token](/clusters/edge/site-deployment/site-installation/create-registration-token) guide.

:::warning

You can deploy a FIPS-compliant Edge host to Palette, but this solution will not be FIPS-compliant end-to-end because
Palette is not FIPS compliant. If you need a FIPS-compliant solution, you need to use VerteX.

:::

## Build FIPS-Enabled Edge Artifacts

### Clone CanvOS Repository

1. Clone the [CanvOS](https://github.com/spectrocloud/CanvOS) GitHub repository containing the starter code.

   ```bash
   git clone https://github.com/spectrocloud/CanvOS.git
   ```

2. Change to the **CanvOS/** directory.

   ```bash
   cd CanvOS
   ```

3. View the available tags and check out the latest tag or any specific version of your choosing. This guide uses
   **v4.3.2** as an example.

   ```bash
   git tag
   git checkout v4.3.2
   ```

### Build FIPS-Compliant Base OS Image

Before you can build the Edge Installer ISO or the provider images, you need to build a FIPS-compliant OS base image
with the Kairos framework. This base image is then used to build the final Edge artifacts.

Palette supports the RHEL and Ubuntu for FIPS-compliant base OS images. Choose the OS that you want to build the base
image with.

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

   If you experience issues with the script not recognizing the RHEL credentials, try searching **Dockerfile** for the
   following line and replacing the credentials directly:

   ```dockerfile
   RUN rm /etc/rhsm-host && subscription-manager register --username 'your-username' --password '*******' \
   ```

   :::

8. When the build finishes, issue `docker images` and confirm there is an image named `rhel-byoi-fips:latest`. This is
   the base image that you will use to build provider images and the Edge installer ISO later on.

9. Tag the image with a repository that is accessible by your Linux machine. For example, the following command uses the
   publicly accessible `ttl.sh` repository.

   ```shell
   docker tag rhel-byoi-fips:latest ttl.sh/rhel/rhel-byoi-fips:latest
   ```

10. Push the image to the repository.

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

10. Push the image to the repository.

    ```shell
    docker push ttl.sh/ubuntu/ubuntu-focal-fips:latest
    ```

</TabItem>

</Tabs>

### Build Edge Installer ISO

11. Return to the **CanvOS** directory.

    ```shell
    cd ..
    ```

12. Create a file named **.arg**. This file will contain parameters that customize the Edge Installer ISO build.

13. In the **.arg** file, provide the following required information. Refer to
    [Edge Artifact Build Configuration](arg.md) for more information.

    | Argument         | Description                                                                                                                                                       |
    | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | IMAGE_REGISTRY   | The image registry to use for tagging the generated provider images.                                                                                              |
    | OS_DISTRIBUTION  | The OS distribution in your provider image.                                                                                                                       |
    | IMAGE_REPO       | The image repository to use for tagging the generated provider images.                                                                                            |
    | OS_VERSION       | The OS version in your provider image. This applies to Ubuntu only.                                                                                               |
    | K8S_DISTRIBUTION | The Kubernetes distribution for your provider image. Allowed values are `rke2` (RKE2) and `kubeadm-fips` (PXK-E). The other distributions are not FIPS-compliant. |
    | FIPS_ENABLED     | Whether to enable FIPS compliance. This parameter must be set to `true`.                                                                                          |
    | ARCH             | The architecture of the image. Allowed values are `amd64` and `arm64`.                                                                                            |
    | BASE_IMAGE       | The base image used by EdgeForge to build the Edge Installer and provider images. This must be the same image that you build in the previous step.                |
    | ISO_NAME         | The file name of the ISO file that will be generated.                                                                                                             |

14. Create a file named **user-data**. It must have the `#cloud-init` header at the top of the file. Ensure you have the
    following blocks at the root level of the **user-data** file. Replace the value for `edgeHostToken` with your VerteX
    registration token, and replace the value `paletteEndPoint` with the URL of your Palette instance. Replace the user
    `kairos` and its password with your desired username and password.

    ```yaml
    #cloud-init
    install:
       grub_options:
         extra_cmdline: "fips=1 selinux=0"

    stylus:
       site:
         edgeHostToken: ********
         paletteEndpoint: https://vertex.palette-devx.spectrocloud.com
         projectName: Default

    stages:
       initramfs:
          - name: "Core system setup"
            users:
               kairos:
                  groups:
                  - admin
                  passwd: kairos
    ```

    The command in the `install` block is required for FIPS installations. Configurations in the `stylus` block provide
    the Edge Host with the registration token and the Palette endpoint. And the configurations in the `stage` block
    create a system user that you can use to log in to the Operating System (OS).

15. Add further customization to the **user-data** file as needed. This file configures the Edge Installer. Refer to
    [Installer Reference](../../edge-configuration/installer-reference.md) for more information.

16. Issue the following command to build the Edge Installer ISO.

    ```shell
    ./earthly.sh +iso
    ```

    When the build finishes, the ISO file will be generated in the **build** directory under the name you specified in
    your **.arg** file.

### Build Provider Images

Provider images are Kairos-based container images for a supported OS and Kubernetes distribution combination.
FIPS-complaint provider images are built on top of the base OS image you have built previously.

17. Locate **Earthfile** in the CanvOS directory. In the file, find the block that starts with
    `build-provider-images-fips:` and delete the Kubernetes versions that you do not want. This will speed up the build
    process and save storage space.

18. Review the **.arg** file again to ensure the parameters are correct. Issue the following command to build the
    provider images.

    ```shell
      ./earthly +build-provider-images-fips
    ```

    :::warning

    For the Kubernetes distribution set in your **.arg** file, only `rke2` and `kubeadm-fips` will produce
    FIPS-compliant provider images.

    :::

## Validate

1. Follow the [Site Installation](../../site-deployment/stage.md) guide to install the Palette Edge on your Edge host.

2. Press Fn + Ctrl + Cmd + F1 or Ctrl + Cmd + F1 keys on a mac keyboard and provide user credentials to log in to the
   OS.

3. Issue the following command and ensure that the output is `1`. This means the OS is FIPS enabled.

   ```shell
   cat /proc/sys/crypto/fips_enabled
   ```
