---
sidebar_label: "Build Hadron Images"
title: "Build Hadron Images"
description: "Learn how to build Hadron OS-based images for connected Edge hosts using the EdgeForge workflow."
icon: ""
hide_table_of_contents: false
sidebar_position: 50
tags: ["edge", "hadron"]
---

Hadron is Spectro Cloud's minimal, immutable Edge operating system, built on the CNCF [Kairos](https://kairos.io/)
project. Like other Kairos-based images, Hadron uses an
[A/B partitioning scheme](../../../cluster-management/upgrade-behavior.md#ab-partitioning-in-upgrades) for atomic
upgrades and rollback. With Palette Edge, you can build Hadron-based images for your connected Edge hosts using the
EdgeForge workflow.

In this guide, you use the CanvOS utility to build a Hadron-based Edge installer ISO and provider images for a connected
cluster deployment.

The supported Hadron version is `v0.5.1`.

## Limitations

- Hadron support applies to connected Edge clusters only. Air-gapped and appliance deployments are a separate effort and
  are not covered by this workflow.

- Hadron supports all Palette Edge Kubernetes distributions except Canonical Kubernetes, which is available only on
  Ubuntu.

- Unified Kernel Image (UKI) is not supported with Hadron.

- Two-node clusters are not supported with Hadron.

## Prerequisites

- A Palette registration token for pairing Edge hosts with Palette. You need Tenant Admin access to Palette to generate
  a new registration token. For detailed instructions, refer to the
  [Create Registration Token](../../../site-deployment/site-installation/create-registration-token.md) guide.

- A physical or virtual Linux machine with an AMD64 (also known as `x86_64`) processor architecture and the following
  minimum hardware configuration:

  - 4 CPUs
  - 8 GB of memory
  - 150 GB of storage

- A user account with permission to run commands using `sudo` privileges.

- Access to a public or private image registry and permissions to push images. This page uses a public
  [Docker Hub](https://www.docker.com/products/docker-hub/) registry as an example. If you need to use a private
  registry, refer to the
  [Deploy Cluster with a Private Provider Registry](../../../site-deployment/deploy-custom-registries/deploy-private-registry.md)
  guide for instructions on how to configure the credentials.

- The following software installed on the Linux machine:

  - [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

  - [Docker Engine](https://docs.docker.com/engine/install/) installed from the official Docker repository with BuildKit
    enabled. Default in Docker 23+; set `DOCKER_BUILDKIT=1` for older versions.

    :::warning

    Do not use the snap-packaged Docker. The snap confinement causes GPG signature verification failures during the
    Earthly build.

    :::

## Build Hadron-based Images

1.  Check out the [CanvOS](https://github.com/spectrocloud/CanvOS) GitHub repository, which contains the starter code.

    ```bash
    git clone https://github.com/spectrocloud/CanvOS.git
    ```

2.  Navigate to the `CanvOS` directory.

    ```bash
    cd CanvOS
    ```

3.  Fetch the list of [git tags](https://github.com/spectrocloud/CanvOS/tags) and check out the newest available tag.

    ```bash
    git fetch --tags
    git checkout "$(git tag --sort=-v:refname | head --lines=1)"
    ```

4.  Issue the command below to create an `.arg` file. Configure the Hadron OS (`OS_DISTRIBUTION=hadron`), version
    `v0.5.1` (`OS_VERSION=v0.5.1`), and the AMD64 architecture (`ARCH=amd64`). Replace the remaining placeholders with
    the necessary values. When you set `OS_DISTRIBUTION=hadron` and `OS_VERSION=v0.5.1`, the build resolves the
    published Kairos Hadron base image, so you do not need to build a base image first. Refer to
    [Edge Artifact Build Configurations](../arg.md) for more information on `.arg` parameters.

    ```bash
    cat << EOF > .arg
    IMAGE_REGISTRY=<image-registry>
    OS_DISTRIBUTION=hadron
    OS_VERSION=v0.5.1
    IMAGE_REPO=<image-repository>
    K8S_DISTRIBUTION=<k8s-distribution>
    K8S_VERSION=<k8s-version>
    ARCH=amd64
    EOF
    ```

    The supported `K8S_DISTRIBUTION` values for Hadron are `kubeadm`, `kubeadm-fips`, `rke2`, and `k3s`. Refer to
    [Edge Artifact Build Configurations](../arg.md) for more information on `.arg` parameters.

5.  Prepare the `user-data` file. Refer to
    [Prepare User Data and Argument Files](../../prepare-user-data.md#prepare-user-data) for instructions.

6.  After the `user-data` file is ready, issue the following command to build the ISO image.

    ```bash
    sudo ./earthly.sh +iso
    ```

    The build process takes some time to finish.

    ```bash hideClipboard {2}
    # Output condensed for readability
    ===================== Earthly Build SUCCESS =====================
    ```

    The ISO image is found in the `build` folder.

## Validate

You can validate that the ISO image has not been corrupted by attempting to flash a bootable device. Most software that
creates a bootable device will validate the ISO image before the flash process.
