---
sidebar_label: "Build Ubuntu 24.04 STIG Images"
title: "Build Ubuntu 24.04 STIG Images"
description: "Learn how to build Ubuntu 24.04 STIG-based images for Edge hosts using the EdgeForge workflow."
icon: ""
hide_table_of_contents: false
sidebar_position: 40
tags: ["edge", "ubuntu", "stig"]
---

[Security Technical Implementation Guides (STIGs)](https://ubuntu.com/security/disa-stig) are standardized security
hardening guidelines developed by the Defense Information Systems Agency (DISA) to help secure operating systems and
applications in regulated environments. With Palette Edge, you can build Ubuntu 24.04 LTS STIG-hardened images for your
Edge hosts using the EdgeForge workflow.

In this guide, you will use the CanvOS utility to build a FIPS-enabled Ubuntu 24.04 base image with STIG hardening, then
create an ISO image from it for your Palette Edge deployment.

:::info

Ubuntu 24.04 STIG hardening is integrated into the FIPS build process. By default, STIG remediation and US Government
banners are applied automatically when you build a FIPS-enabled Ubuntu 24.04 image. You can control this behavior using
environment variables `SKIP_STIG_BANNER` and `ENABLE_STIG` during the build.

:::

## Limitations

- The Ubuntu 24.04 STIG implementation in Palette Edge deviates from the STIG compliance requirements due to platform
  design and Kubernetes operational needs. As a result, some STIG compliance checks will report failures. You are
  responsible for evaluating the remaining findings and applying additional hardening as needed for your environment.

  - Kairos-based systems use an
    [A/B partitioning scheme](../../../cluster-management/upgrade-behavior.md#ab-partitioning-in-upgrades) for system
    recovery and upgrades. This does not align with STIG partitioning requirements.

  - Mount points are managed by Kairos and cannot be adjusted to fully match STIG guidelines.

  - [Federal Information Processing Standards (FIPS)](../fips.md) mode is enabled in Palette Edge via `user-data`
    configuration. Although the system operates in FIPS mode, it does not meet the criteria used by STIG validation
    checks, resulting in false negatives.

  - Kairos-based images do not include all STIG-recommended packages, for example, Advanced Intrusion Detection
    Environment (AIDE) and USBGuard. These components are not required for Kubernetes operations, but you can add them
    by [customizing the Dockerfile](../palette-canvos.md?difficulty=advanced_create_artifacts#instructions-1). However,
    only the modules included by default are verified by Spectro Cloud.

  - IP forwarding (`net.ipv4.ip_forward` and `net.ipv4.conf.all.forwarding`) is enabled to support Kubernetes
    networking, which deviates from STIG requirements.

  - Reverse path filtering (`rp_filter`) is disabled to prevent interference with Kubernetes overlay networking.

- The Ubuntu 24.04 STIG implementation only supports appliance mode connected clusters. Air-gapped clusters are not
  supported.

- The Ubuntu 24.04 STIG implementation in Palette Edge only supports the following Kubernetes distributions:

  - <VersionedLink text="Palette eXtended Kubernetes Edge (PXK-E)" url="/integrations/packs/?pack=edge-k8s" /> - The
    `K8S_DISTRIBUTION=kubeadm-fips` value in the `.arg` file.

  - <VersionedLink text="Palette Optimized RKE2" url="/integrations/packs/?pack=edge-rke2" /> - The
    `K8S_DISTRIBUTION=rke2` value in the `.arg` file.

## Prerequisites

- An active Ubuntu Pro subscription token. Contact your system administrator for access.

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

## Build Ubuntu 24.04 STIG-based Images

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

4.  Navigate to the `ubuntu-fips/24.04` directory.

    ```bash
    cd ubuntu-fips/24.04
    ```

5.  Add your Ubuntu Pro token to the `pro-attach-config.yaml` file.

    ```yaml {1}
    token: <your-ubuntu-pro-token>
    enable_services:
      - fips-updates
    ```

6.  Build the base Ubuntu 24.04 FIPS + STIG image. STIG remediation is enabled by default. Replace `<base-image-name>`
    with the desired image name.

    <Tabs>

    <TabItem value="fips-stig" label="FIPS + STIG + Gov Banner (Default)">

    ```bash
    bash build.sh <base-image-name>
    ```

    </TabItem>

    <TabItem value="fips-stig-no-banner" label="FIPS + STIG (No Gov Banner)">

    Set `SKIP_STIG_BANNER=1` for builds where the US government login banner is not appropriate.

    ```bash
    SKIP_STIG_BANNER=1 bash build.sh <base-image-name>
    ```

    </TabItem>

    <TabItem value="fips-only" label="FIPS + Gov Banner (No STIG)">

    ```bash
    ENABLE_STIG=0 bash build.sh <base-image-name>
    ```

    </TabItem>

    </Tabs>

    The build process takes some time to complete. You can monitor the progress in the terminal.

7.  Confirm the image was built successfully. Replace `<base-image-name>` with the image name.

    ```bash
    docker images | grep <base-image-name>
    ```

8.  Push the image to a remote container registry so Earthly can access it. This guide uses Docker Hub as an example.
    Issue the following command to log in to Docker Hub. Provide your Docker ID and password when prompted.

    ```bash
    docker login
    ```

    Tag the image. Replace `<registry>` and `<tag>` with values appropriate for your environment.

    ```bash
    docker tag <base-image-name> <registry>/<base-image-name>:<tag>
    ```

    Push the image to the registry.

    ```bash
    docker push <registry>/<base-image-name>:<tag>
    ```

9.  Return to the CanvOS root directory.

    ```bash
    cd ../..
    ```

10. Issue the command below to create an `.arg` file. Configure the Ubuntu OS (`OS_DISTRIBUTION=ubuntu`), version 24.04
    (`OS_VERSION=24.04`), and the AMD64 architecture (`ARCH=amd64`). Replace the remaining placeholders with the
    necessary values. Refer to [Edge Artifact Build Configurations](../arg.md) for more information on `.arg`
    parameters.

    ```bash
    cat << EOF > .arg
    IMAGE_REGISTRY=<image-registry>
    OS_DISTRIBUTION=ubuntu
    OS_VERSION=24.04
    IMAGE_REPO=<image-repository>
    K8S_DISTRIBUTION=<k8s-distribution>
    K8S_VERSION=<k8s-version>
    FIPS_ENABLED=true
    ARCH=amd64
    BASE_IMAGE=<registry>/<base-image-name>:<tag>
    EOF
    ```

    The supported `K8S_DISTRIBUTION` values for STIG and FIPS builds are `rke2` and `kubeadm-fips`. Refer to
    [Edge Artifact Build Configurations](../arg.md) for a complete list of supported configuration parameters.

11. Prepare the `user-data` file. Refer to
    [Prepare User Data and Argument Files](../../prepare-user-data.md#prepare-user-data) for instructions. To enable
    FIPS in kernel space, add the following to your `user-data` file.

    ```yaml
    #cloud-config
    install:
      grub_options:
        extra_cmdline: "fips=1"
    ```

12. Once the `user-data` file is ready, issue the following command to build the ISO image.

    ```bash
    sudo ./earthly.sh +iso
    ```

    The build process takes some time to finish.

    ```bash hideClipboard {2}
    # Output condensed for readability
    ===================== Earthly Build SUCCESS =====================
    Share your logs with an Earthly account (experimental)! Register for one at https://ci.earthly.dev.
    ```

    The ISO image is found in the `build` folder.

## Validate

You can validate that the ISO image has not been corrupted by attempting to flash a bootable device. Most software that
creates a bootable device will validate the ISO image before the flash process.
