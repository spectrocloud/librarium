---
sidebar_label: "Build MAAS Images"
title: "Build MAAS Images"
description: "Learn how to build the Palette MAAS Image using the EdgeForge utilities."
icon: ""
hide_table_of_contents: false
sidebar_position: 35
tags: ["edge"]
---

With Palette Edge, you can use MAAS-managed bare-metal machines and LXD VMs as Edge hosts. The EdgeForge workflow
enables the creation of MAAS-compatible images. In this guide, you will use the CanvOS utility to build MAAS images for
your Edge deployment.

## Limitations

- MAAS image creation is supported only for appliance-mode Palette eXtended Kubernetes - Edge (PXK-E) deployments. Other
  Kubernetes distributions and agent-mode deployments are not supported by this workflow.

- For MAAS-based deployments, the Kairos `install` stage in user data is not used. Any GRand Unified Bootloader (GRUB)
  configuration or mount customizations must be applied using other Kairos stages or overlay files. Refer to
  [Edge Installer Configuration Reference](../../edge-configuration/installer-reference.md) for details on the available
  stages.

## Prerequisites

- (Optional) A [Palette registration token](../../site-deployment/site-installation/create-registration-token.md) to
  embed user data in the MAAS image. If you do not embed the user data, you must provide the user data, including a
  registration token, when deploying your MAAS host using the MAAS UI.

- A physical or virtual Linux machine with an AMD64 (also known as `x86_64`) processor architecture and the following
  minimum hardware configuration:

  - 4 CPUs
  - 8 GB memory
  - 150 GB storage

- A user account with permission to run commands using `sudo` privileges.

- The following software installed on the Linux machine:

  - [Docker Engine](https://docs.docker.com/engine/install/)
  - (Optional) [Earthly](https://earthly.dev/)
  - [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
  - [`qemu-utils`](https://installati.one/install-qemu-utils-ubuntu-20-04/)

## Build MAAS Images

1.  Check out the [CanvOS](https://github.com/spectrocloud/CanvOS) GitHub repository, which contains the starter code.

    ```bash
    git clone https://github.com/spectrocloud/CanvOS.git
    ```

2.  Navigate to the `CanvOS` directory.

    ```bash
    cd CanvOS
    ```

3.  View the available [git tags](https://github.com/spectrocloud/CanvOS/tags).

    ```bash
    git tag
    ```

4.  Check out the newest available tag. This guide uses the tag **v4.8.5** as an example.

    ```shell
    git checkout v4.8.5
    ```

5.  Issue the command below to create an `.arg` file. Configure the build to use the PXK-E (`kubeadm`) Kubernetes
    distribution (`K8S_DISTRIBUTION=kubeadm`), the Ubuntu OS (`OS_DISTRIBUTION=ubuntu`) version 22 (`OS_VERSION=22`),
    and the AMD64 architecture (`ARCH=amd64`). Replace `1.32.3` with the required PXK-E Kubernetes version and
    `custom-maas-image` with the desired MAAS image name. If you do not specify the MAAS image name, it defaults to
    `kairos-ubuntu-maas`.

    ```bash
    cat << EOF > .arg
    OS_DISTRIBUTION=ubuntu
    OS_VERSION=22
    K8S_DISTRIBUTION=kubeadm
    K8S_VERSION=1.32.3
    ARCH=amd64
    MAAS_IMAGE_NAME=custom-maas-image
    UPDATE_KERNEL=false
    EOF
    ```

    Refer to [Edge Artifact Build Configurations](./arg.md) for a complete list of supported configuration parameters.

6.  (Optional) Prepare the `user-data` file. Refer to [Prepare User Data and Argument Files](../prepare-user-data.md)
    for instructions. If you place the `user-data` file in the `CanvOS` repository root, it is embedded into the image
    at build time. You can also supply user data through the MAAS UI at deployment time instead of creating the
    `user-data` file in the `CanvOS` directory.

7.  Issue the following command to start the build process.

    ```bash
    sudo ./earthly.sh +maas-image
    ```

    The build process takes some time to finish.

8.  When the process finishes, the terminal displays the following message.

    ```bash hideClipboard title="Example Output"
    ...
    ✅ Composite image created and compressed successfully: /home/ubuntu/CanvOS/custom-maas-image.raw.gz
    You can now upload this compressed raw image to MAAS (MAAS will automatically decompress it).
    === Generating SHA256 checksum ===
    ✅ SHA256 checksum created: build/custom-maas-image.raw.gz.sha256
    ✅ MAAS composite image created and compressed successfully: build/custom-maas-image.raw.gz
    Final size: 2.0G
    SHA256: 50b1b95e18b257727f40c2f6c9a07e72214a3fbd60e7232268b07503a2f08a9a
    MAAS will automatically decompress this image during upload.
    ```

## Validate

1. Issue the following command to list the files in the `build` directory.

   ```bash
   ls build
   ```

   ```bash hideClipboard title="Example Output"
   custom-maas-image.raw.gz custom-maas-image.raw.gz.sha256
   ```

   The output includes:

   - The MAAS-compatible compressed disk image (`custom-maas-image.raw.gz`).
   - The SHA256 checksum file (`custom-maas-image.raw.gz.sha256`).

2. Verify the integrity of the image by validating the checksum. Replace `custom-maas-image.raw.gz.sha256` with your
   checksum file name.

   ```bash
   sha256sum --check build/custom-maas-image.raw.gz.sha256
   ```

   If the checksum is valid, the command returns the following output.

   ```bash hideClipboard title="Example Output"
   build/custom-maas-image.raw.gz: OK
   ```

## Next Steps

Refer to [Deploy Edge Hosts on MAAS](../../site-deployment/maas-deployment.md) for step-by-step instructions on
uploading the image to MAAS and deploying an Edge host using the MAAS UI.
