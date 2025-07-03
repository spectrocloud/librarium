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
  - 150 GB storage

- [Git](https://git-scm.com/downloads). You can ensure git installation by issuing the `git --version` command.

- (Optional) [Earthly](https://earthly.dev/) is installed and available. If you do not install Earthly, you can still
  build the artifacts, but it would require root privileges, and some of the resulting artifacts will be owned by the
  root user.

- An image management tool such as [Docker](https://docs.docker.com/engine/install/) or
  [crane](https://github.com/google/go-containerregistry/blob/main/cmd/crane/README.md) is installed and available.

  :::info

  If you do not install Earthly, you must install Docker.

  :::

## Build Provider Images

1.  Check out the [CanvOS](https://github.com/spectrocloud/CanvOS) GitHub repository containing the starter code.

    ```bash
    git clone https://github.com/spectrocloud/CanvOS.git
    ```

2.  Change to the `CanvOS` directory.

    ```bash
    cd CanvOS
    ```

3.  View the available [git tag](https://github.com/spectrocloud/CanvOS/tags).

    ```bash
    git tag
    ```

4.  Check out the newest available tag. This guide uses the tag **v4.4.12** as an example.

    ```shell
    git checkout v4.4.12
    ```

5.  Review the files relevant for this guide.

    - `.arg.template` - A sample `.arg` file that defines arguments to use during the build process.

    - `Earthfile` - Contains a series of commands to create target artifacts.

    - `earthly.sh` - Script to invoke the Earthfile, and generate target artifacts.

6.  Issue the command below to assign an image tag value that will be used when creating the provider images. This guide
    uses the value `palette-learn` as an example. However, you can assign any lowercase and alphanumeric string to the
    `CUSTOM_TAG` argument.

    ```bash
    export CUSTOM_TAG=palette-learn
    ```

7.  Use the command below to save the image registry hostname in the `IMAGE_REGISTRY` argument. Before you execute the
    command, replace `[REGISTRY-HOSTNAME]` in the declaration below with your Docker ID. Your image registry hostname
    must comply with standard DNS rules and may not contain underscores.

    ```bash
    export IMAGE_REGISTRY=[REGISTRY-HOSTNAME]
    ```

8.  Issue the following command to use the Ubuntu OS distribution and use the 22.04 version.

    ```bash
    export OS_DISTRIBUTION=ubuntu
    export OS_VERSION=22.04
    ```

    :::warning

    If RHEL is the base OS for your

    <VersionedLink text="Palette eXtended Kubernetes - Edge (PXK-E)" url="/integrations/packs/?pack=edge-k8s" /> cluster
    running Kubernetes v1.32.x or later, we recommend using RHEL 9.x to avoid a [known kernel compatibility
    issue](../../../../troubleshooting/edge/edge.md#scenario--pxk-e-clusters-on-rhel-and-rocky-8-fail-kubernetes-initialization).

    :::

9.  Issue the following command to use the K3s Kubernetes distribution and use the 1.32.3 version.

    ```bash
    export K8S_DISTRIBUTION=k3s
    export K8S_VERSION=1.32.3
    ```

10. Issue the command below to create an `.arg` file. The `.arg` file uses the default values for the remaining
    arguments.

    ```bash
    cat << EOF > .arg
    IMAGE_REGISTRY=$IMAGE_REGISTRY
    OS_DISTRIBUTION=$OS_DISTRIBUTION
    OS_VERSION=$OS_VERSION
    IMAGE_REPO=$OS_DISTRIBUTION
    CUSTOM_TAG=$CUSTOM_TAG
    K8S_DISTRIBUTION=$K8S_DISTRIBUTION
    K8S_VERSION=$K8S_VERSION
    ARCH=amd64
    HTTPS_PROXY=
    HTTP_PROXY=
    PROXY_CERT_PATH=
    UPDATE_KERNEL=false
    EOF
    ```

    If you want your host eligible to become part of a two-node high availability cluster, you must set `TWO_NODE` to
    `true`. This setting cannot be changed later. A two-node provider image cannot be used to provision regular etcd
    clusters. We recommend you clearly mark two-node provider images in the custom tag argument. For more information
    about two-node high availability architecture, refer to [Two-Node Architecture](../../architecture/two-node.md).

    Refer to [Edge Artifact Build Configurations](./arg.md) for all available configuration parameters.

    :::preview

    The `K8S_DISTRIBUTION` argument, defined in the `.arg` file, accepts `canonical` as a valid value. This value
    corresponds to the **Palette Optimized Canonical** pack, which is a Tech Preview feature and is subject to change.
    Do not use this feature in production workloads.

    In addition, Canonical clusters deployed in a proxied network environment may experience a
    [known issue](../../../../troubleshooting/edge/edge.md#scenario---canonical-edge-clusters-in-proxied-environments-experience-failure-upon-reboot)
    when you reboot nodes in the cluster.

    :::

11. (Optional) If you want to build multiple versions of provider images using different Kubernetes versions, remove the
    `K8S_VERSION` argument from the `.arg` file. Open the `k8s_version.json` file in the `CanvOS` directory. Remove the
    Kubernetes versions that you don't need from the JSON object corresponding to your Kubernetes distribution.

12. (Optional) This step is only required if your builds occur in a proxied network environment, and your proxy servers
    require client certificates or if your base image is in a registry that requires client certificates.

    You can provide the base-64 encoded certificates in PEM format in the `certs` folder at the root directory of the
    **CanvOS** repository. You can provide as many certificates as you need in the folder.

    If you are using a CanvOS tag that is earlier than `4.5.15`, you need to use the `PROXY_CERT_PATH` build argument to
    provide a path to the certificate. This approach only allows you to specify one certificate. For more information,
    refer to [Earthly Build Arguments](../../edgeforge-workflow/palette-canvos/arg.md).

    :::warning

    These proxy settings are only configured for the build process itself, when your builder machine needs to pull
    certain images to build the Edge artifacts. These certificates will not be present on the host after it has been
    deployed. To configure the proxy network settings for a host, refer to
    [Configure HTTP Proxy](../../local-ui/host-management/configure-proxy.md) or
    [Configure Proxy in User Data](../prepare-user-data.md#configure-proxy-settings-optional).

    :::

13. (Optional) You can embed a public key in your provider image. If you choose to add a public key to your provider
    image, after you create a cluster with the provider image, only content that is signed by the corresponding private
    key can be uploaded to the Edge host through Local UI. This includes both the content bundle and cluster definition.
    For more information, refer to [Embed Public Key in Edge Artifacts](./signed-content.md).

14. CanvOS utility uses [Earthly](https://earthly.dev/) to build the target artifacts. Issue the following command to
    start the build process.

        <Tabs group="earthly">

        <TabItem value="Earthly Installed">

            ```bash
            earthly +build-provider-images
            ```

        </TabItem>

        <TabItem value="Earthly Not Installed">

            ```bash
         sudo ./earthly.sh +build-provider-images
            ```

        </TabItem>

        </Tabs>

        ```hideClipboard bash {2}
        # Output condensed for readability
        ===================== Earthly Build SUCCESS =====================
        Share your logs with an Earthly account (experimental)! Register for one at https://ci.earthly.dev.
        ```

15. To use the provider images in your cluster profile, push them to your image registry mentioned in the `.arg` file.
    Issue the following command to log in to Docker Hub. Provide your Docker ID and password when prompted.

    ```bash
    docker login
    ```

16. Use the following commands to push the provider images to the Docker Hub image registry you specified. Replace the
    `[REGISTRY-HOSTNAME]` and version numbers in the command below.

    ```bash
    docker push [REGISTRY-HOSTNAME]/ubuntu:k3s-1.28.2-v4.4.12-palette-learn
    ```

## Validate

1. List the Docker images to review the provider images created. You can identify the provider images by reviewing the
   image tag value you used in the `.arg` file's `CUSTOM_TAG` argument.

   ```
   docker images --filter=reference='*/*:*palette-learn'
   ```

2. Verify that the provider images were created successfully.

   ```hideClipboard
   REPOSITORY                            TAG                                   IMAGE ID       CREATED         SIZE
   docker.io/[DOCKER-ID]/ubuntu          k3s-1.28.2-v4.4.12-palette-learn       075134ad5d4b   10 minutes ago   4.11GB
   ```

## Next Steps

Provider images are only one the artifacts you need to provision an Edge deployment. You also need to build the Edge
Installer ISO that matches your provider image settings. Refer to [Build Edge Installer ISO](./build-installer-iso.md)
for more information.

If you have built both provider images and the installer ISO, refer to
[Site Deployment](../../site-deployment/site-deployment.md) to learn how to deploy your Edge cluster.
