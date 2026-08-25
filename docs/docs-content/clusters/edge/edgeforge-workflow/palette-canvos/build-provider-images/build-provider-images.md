---
sidebar_label: "Build Provider Images"
title: "Build Provider Images"
description: "Learn how to build provider images using EdgeForge utilities."
icon: ""
hide_table_of_contents: false
sidebar_position: 0
tags: ["edge"]
---

Provider images are Kairos-based container images containing the OS and the desired Kubernetes version. These images
install an immutable OS and software dependencies compatible with a specific Kubernetes version during cluster
deployment. A provider image is used in the OS and the Kubernetes layer when creating a cluster profile. These container
images are downloaded during the installation by the Edge Installer and converted to disk images for the system to boot
into.

:::info

The provider images are one of the critical artifacts you need to build during EdgeForge. The other artifact is the Edge
Installer ISO. Both are required for Edge deployment. For education purposes, we provide separate instructions for
building the installer ISO and the provider images. However, these two artifacts are often built together in a single
step in practice. Refer to [Build Edge Artifacts](../palette-canvos.md) to learn how to build both artifacts at the same
time.

:::

## Specialized Build Guides

If you need security-hardened or platform-specific provider images, use one of the following guides instead of the
generic procedure on this page:

- [Build AWS Cloud Images](./build-aws-cloud-image.md)
- [Build MAAS Images](./build-maas-image.md)
- [Build RHEL 9 STIG Images](./build-rhel-stig-image.md)
- [Build Ubuntu 24.04 STIG Images](./build-ubuntu-stig-image.md)

## Build Custom Provider Images

The following procedure builds standard provider images using any supported OS and Kubernetes distribution. Use this
guide when you do not require [specialized configurations](#specialized-build-guides).

### Prerequisites

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

### Enablement

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

4.  Check out the CanvOS tag that corresponds to your Palette release. Refer to the
    [Edge Compatibility Matrix](/clusters/edge/edge-compatibility-matrix/) to identify the correct CanvOS, Stylus, and
    Edge host version. This guide uses the tag **v4.4.12** as an example.

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

    <!-- prettier-ignore -->
    :::warning

    If RHEL is the base OS for your <VersionedLink text="Palette eXtended Kubernetes - Edge (PXK-E)"
    url="/integrations/packs/?pack=edge-k8s" /> cluster running Kubernetes v1.32.x or later, we recommend using RHEL 9.x
    to avoid a
    [known kernel compatibility issue](../../../../../troubleshooting/edge/edge.md#scenario--pxk-e-clusters-on-rhel-and-rocky-8-fail-kubernetes-initialization).

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

    :::warning

    If you want your host eligible to become part of a two-node high availability cluster, you must set `TWO_NODE` to
    `true`. This setting cannot be changed later. A two-node provider image cannot be used to provision regular etcd
    clusters. We recommend you clearly mark two-node provider images in the custom tag argument. For more information
    about two-node high availability architecture, refer to [Two-Node Architecture](../../../architecture/two-node.md).

    :::

    Refer to [Edge Artifact Build Configurations](../arg.md) for all available configuration parameters.

11. (Optional) If you want to build multiple versions of provider images using different Kubernetes versions, remove the
    `K8S_VERSION` argument from the `.arg` file. Open the `k8s_version.json` file in the `CanvOS` directory. Remove the
    Kubernetes versions that you don't need from the JSON object corresponding to your Kubernetes distribution.

12. (Optional) This step is only required if your builds occur in a proxied network environment, and your proxy servers
    require client certificates or if your base image is in a registry that requires client certificates.

    You can provide the base-64 encoded certificates in PEM format in the `certs` folder at the root directory of the
    **CanvOS** repository. You can provide as many certificates as you need in the folder.

    If you are using a CanvOS tag that is earlier than `4.5.15`, you need to use the `PROXY_CERT_PATH` build argument to
    provide a path to the certificate. This approach only allows you to specify one certificate. For more information,
    refer to [Earthly Build Arguments](../../../edgeforge-workflow/palette-canvos/arg.md).

    :::warning

    These proxy settings are only configured for the build process itself, when your builder machine needs to pull
    certain images to build the Edge artifacts. These certificates will not be present on the host after it has been
    deployed. To configure the proxy network settings for a host, refer to
    [Configure HTTP Proxy](../../../local-ui/host-management/configure-proxy.md) or
    [Configure Proxy in User Data](../../prepare-user-data.md#configure-proxy-settings-optional).

    :::

13. (Optional) You can embed a public key in your provider image. If you choose to add a public key to your provider
    image, after you create a cluster with the provider image, only content that is signed by the corresponding private
    key can be uploaded to the Edge host through Local UI. This includes both the content bundle and cluster definition.
    For more information, refer to [Embed Public Key in Edge Artifacts](../signed-content.md).

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

### Validate

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

## systemd Extensions and the `BUNDLE_K8S_AND_AGENT_PROVIDER` Flag {#bundle-k8s-and-agent-provider-flag}

Starting with **CanvOS 4.10**, connected Edge clusters can use systemd extensions to deliver Kubernetes and Palette
Agent binaries at runtime instead of embedding them in the provider image. This reduces provider image size and lets a
single provider image serve multiple Kubernetes versions on the same host. This capability applies to connected clusters
only.

### Support Requirements

- **Stylus 4.10.x** or later on the cluster. Older Stylus releases fall back to the pre-systemd-extensions behavior.
- An operating system with **systemd version 255 or later**. Operating systems on earlier systemd versions continue to
  follow the existing flow, where Kubernetes and Palette Agent binaries are embedded in the provider image.
- **CanvOS 4.10.x** or later to build provider images that opt in or out of the extensions path.

### `BUNDLE_K8S_AND_AGENT_PROVIDER` Flag Behavior

The `BUNDLE_K8S_AND_AGENT_PROVIDER` flag in the CanvOS `.arg` file controls whether Kubernetes and Palette Agent
provider binaries are embedded in the provider image.

| **Operating System**     | **Default `BUNDLE_K8S_AND_AGENT_PROVIDER` Value** | **Notes**                                                                                         |
| ------------------------ | ------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| systemd 255 or later     | Excluded (delivered by systemd extensions)        | Set the flag to `true` when a specific flow requires the binaries embedded in the provider image. |
| systemd earlier than 255 | Included                                          | Setting the flag has no effect. Binaries are always embedded on these operating systems.          |

The flag is new in CanvOS 4.10. Earlier CanvOS releases do not recognize it and continue to operate with the existing
behavior. This is a non-breaking change.

### New Clusters

When you provision a new connected Edge cluster on an operating system with systemd 255 or later, take the following
steps.

1. Set `system.uri: NA` in the BYOOS pack. Palette does not need a provider image to deliver Kubernetes and Palette
   Agent binaries when systemd extensions are available.
2. If a provider image is required for operating system upgrades or patches, build the image from **CanvOS 4.10.x or
   later**.
3. When Stylus is pinned to an earlier release such as `4.9.a`, supply a provider image. Provider images built from
   CanvOS 4.10.x must set `BUNDLE_K8S_AND_AGENT_PROVIDER` to `true`. Provider images built from older CanvOS releases
   might work but are not recommended.

### Upgrade an Existing Cluster on an Operating System with systemd 255 or Later

The first upgrade after adopting CanvOS 4.10.x requires a provider image that ships the aligned Palette Agent version.
Subsequent Kubernetes upgrades run without a provider image.

1. Build a provider image with **CanvOS 4.10.x or later** and set `BUNDLE_K8S_AND_AGENT_PROVIDER` to `true` in the
   `.arg` file. Set `system.uri: <provider-image>` in the BYOOS pack for the initial upgrade. This upgrade replaces the
   `kairos-agent` on the system with the 4.10.x-aligned version.
2. For subsequent Kubernetes upgrades, set `system.uri: NA` in the BYOOS pack. Palette delivers Kubernetes binaries
   through systemd extensions and does not require a provider image. A provider image can still be supplied for each
   repave, in which case `BUNDLE_K8S_AND_AGENT_PROVIDER` is not required.
3. If Stylus remains pinned to a release earlier than 4.10.x, systemd extensions are not available on this cluster.
   Build provider images from **CanvOS 4.10.x or later** with `BUNDLE_K8S_AND_AGENT_PROVIDER` set to `true` for every
   upgrade.

### Upgrade Operating System Packages

Operating system package upgrades require a provider image built with **CanvOS 4.10.x or later**. Reference the image
through `system.uri` in the BYOOS pack.

### Unified Kernel Image (UKI) Considerations

For Edge hosts using [Unified Kernel Images](../../../trusted-boot/trusted-boot.md), signing keys must line up in both
directions.

- New provider images must be signed with the same keys used to sign the installer. A mismatch causes the host to reject
  the image at boot.
- systemd extensions delivered outside of the provider image must be signed with the same keys used to sign the
  installer.

## Next Steps

Provider images are only one the artifacts you need to provision an Edge deployment. You also need to build the Edge
Installer ISO that matches your provider image settings. Refer to [Build Edge Installer ISO](../build-installer-iso.md)
for more information.

If you have built both provider images and the installer ISO, refer to
[Site Deployment](../../../site-deployment/site-deployment.md) to learn how to deploy your Edge cluster.
