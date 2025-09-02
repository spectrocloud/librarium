---
sidebar_label: "Build Edge Artifacts"
title: "Build Edge Artifacts"
description:
  "Learn how to build Edge artifacts, such as the Edge Installer ISO and provider images using Spectro Cloud's CanvOS
  utility."
icon: ""
sidebar_position: 10
toc_min_heading_level: 2
toc_max_heading_level: 2
hide_table_of_contents: false
tags: ["edge"]
---

Palette's Edge solution requires Edge hosts to be ready with the required dependencies and
[user data](../../edge-configuration/installer-reference.md) configurations before deploying a Kubernetes cluster. An
Edge host requires the following artifacts to prepare for successful cluster deployment:

- **Edge installer ISO image** - This bootable ISO image installs the necessary dependencies and configurations on a
  bare host machine. During installation, the host machine will boot from the Edge installer ISO, partition the disk,
  copy the image content to the disk, install the Palette Edge host agent and metadata, and perform several
  configuration steps. These configuration steps include registering the host with Palette, setting user privileges, and
  configuring network or security settings.

- **Provider Images** - These are [Kairos](https://kairos.io/)-based images containing the OS and the desired Kubernetes
  versions. These images install an immutable Operating System (OS) and software dependencies compatible with a specific
  Kubernetes version at runtime, i.e., during the cluster deployment. A provider image is used in the OS and the
  Kubernetes layer when creating a cluster profile.

In this guide, you will use the utility, [CanvOS](https://github.com/spectrocloud/CanvOS/blob/main/README.md), to build
an Edge installer ISO image and provider images for all the Palette-supported Kubernetes versions. The utility builds
multiple provider images, so you can use either one that matches the desired Kubernetes version you want to use with
your cluster profile.

If you want to build the ISO image and the provider images individually, refer to
[Build Provider Images](./build-provider-images.md) and [Build Installer ISO](./build-installer-iso.md).

:::info

CanvOS is a utility that helps you build Edge artifacts. CanvOS is part of the EdgeForge workflow.

:::

The diagram below shows the high-level steps to building the Edge artifacts and pushing the provider images to an image
registry.

![Overarching diagram showing the workflow in the current guide.](/tutorials/palette-canvos/clusters_edge_palette-canvos_artifacts.webp)

This guide presents two workflows - Basic and Advanced.

The basic workflow has minimal customizations and offers a quick start to build Edge artifacts. This workflow builds an
Ubuntu based Edge installer ISO and provider images. You will also push the provider images to the default image
registry, [ttl.sh](https://ttl.sh/).

The advanced workflow uses more customization options. This workflow builds an openSUSE based Edge installer ISO and
provider images. You will push the provider images to your Docker Hub image registry.

You can follow either of the workflows below that suits your use case.

<Tabs queryString="difficulty">

<TabItem label="Basic" value="basic_create_artifacts" >

### Prerequisites

To complete this basic guide, you will need the following items:

- A physical or virtual Linux machine with _AMD64_ (also known as _x86_64_) processor architecture to build the Edge
  artifacts. You can issue the following command in the terminal to check your processor architecture.

  ```bash
  uname -m
  ```

- Minimum hardware configuration of the Linux machine:

  - 4 CPU
  - 8 GB memory
  - 50 GB storage

- [Git](https://git-scm.com/downloads). You can ensure git installation by issuing the `git --version` command.

- (Optional) [Earthly](https://earthly.dev/) is installed and available. If you do not install Earthly, you can still
  build the artifacts, but it would require root privileges, and some of the resulting artifacts will be owned by the
  root user.

- An image management tool such as [Docker](https://docs.docker.com/engine/install/) or
  [crane](https://github.com/google/go-containerregistry/blob/main/cmd/crane/README.md) is installed and available.

  :::info

  If you do not install Earthly, you must install Docker.

  :::

- A [Spectro Cloud](https://console.spectrocloud.com) account. If you have not signed up, you can sign up for an account
  [here](https://www.spectrocloud.com/get-started).

- Palette registration token for pairing Edge hosts with Palette. You will need tenant admin access to Palette to
  generate a new registration token. For detailed instructions, refer to the
  [Create Registration Token](/clusters/edge/site-deployment/site-installation/create-registration-token) guide.

### Instructions

Use the following instructions on your Linux machine to create all the required Edge artifacts with minimal
customization.

1. Check out the [CanvOS](https://github.com/spectrocloud/CanvOS) GitHub repository containing the starter code.

   ```bash
   git clone https://github.com/spectrocloud/CanvOS.git
   ```

2. Change to the `CanvOS` directory.

   ```bash
   cd CanvOS
   ```

3. View the available [git tag](https://github.com/spectrocloud/CanvOS/tags).

   ```bash
   git tag
   ```

4. Check out the newest available tag. This guide uses the tag **v4.0.6** as an example.

   ```shell
   git checkout v4.0.6
   ```

5. Review the files relevant for this guide.

   - `.arg.template` - A sample `.arg` file that defines arguments to use during the build process.
   - `Dockerfile` - Embeds the arguments and other configurations in the image.
   - `Earthfile` - Contains a series of commands to create target artifacts.
   - `earthly.sh` - Script to invoke the `Earthfile`, and generate target artifacts.
   - `user-data.template` - A sample user-data file.

6. Issue the command below to assign an image tag value that will be used when creating the provider images. This guide
   uses the value `palette-learn` as an example. However, you can assign any lowercase and alphanumeric string to the
   `CUSTOM_TAG` argument.

   ```bash
   export CUSTOM_TAG=palette-learn
   ```

7. Issue the command below to create the `.arg` file containing the custom tag. The remaining arguments in the `.arg`
   file will use the default values. For example, `ubuntu` is the default operating system, `demo` is the default tag,
   and [ttl.sh](https://ttl.sh/) is the default image registry. Refer to the existing `.arg.template` file in the
   current directory or the [README](https://github.com/spectrocloud/CanvOS#readme) to learn more about the available
   customizable arguments.

   :::info

   The default ttl.sh image registry is free and does not require a sign-up. Images pushed to ttl.sh are ephemeral and
   will expire after the 24 hrs time limit. Should you need to use a different image registry, refer to the Advanced
   workflow on this page.

   :::

   Using the arguments defined in the **.arg** file, the final provider images you generate will have the following
   naming convention, `[IMAGE_REGISTRY]/[IMAGE_REPO]:[CUSTOM_TAG]`. For example, one of the provider images will be
   `ttl.sh/ubuntu:k3s-1.27.2-v4.0.6-palette-learn`.

   ```bash
   cat << EOF > .arg
   CUSTOM_TAG=$CUSTOM_TAG
   IMAGE_REGISTRY=ttl.sh
   OS_DISTRIBUTION=ubuntu
   IMAGE_REPO=ubuntu
   OS_VERSION=22.04
   K8S_DISTRIBUTION=k3s
   ISO_NAME=palette-edge-installer
   ARCH=amd64
   HTTPS_PROXY=
   HTTP_PROXY=
   PROXY_CERT_PATH=
   UPDATE_KERNEL=false
   EOF
   ```

   View the newly created file to ensure the customized arguments are set correctly.

   ```bash
   cat .arg
   ```

8. Issue the command below to save your tenant registration token to an environment variable. Replace
   `[your_token_here]` with your actual registration token.

   ```bash
   export token=[your_token_here]
   ```

9. Use the following command to create the `user-data` file containing the tenant registration token.

   ```shell
   cat <<EOF > user-data
   #cloud-config

   stylus:
      site:
        edgeHostToken: $token

   install:
      poweroff: true

    stages:
       initramfs:
       - name: "Core system setup"
         users:
           kairos:
             groups:
               - admin
             passwd: kairos
    EOF
    ```

    <!-- prettier-ignore-start -->

   :::warning

    - If you haven't set a default project for the registration token, ensure that you provide the
      `stylus.site.projectName` parameter with the value `Default` in `user-data`.
    - If your setup meets the following conditions, include the following `initramfs` stage in your `user-data` file,
      replacing `<interface-name>` with the name of the network interface on your Edge host:

      - Your host is a virtual machine.
      - The virtual machine uses a VMXNET3 adapter.
      - You are planning to use _one_ of the following in your Edge cluster:

        - An [overlay network](../../networking/vxlan-overlay.md).
        - <VersionedLink text="Flannel" url="/integrations/cni-flannel" /> for your CNI.

      ```shell
      stages:
        initramfs:
          - name: "Disable UDP segmentation"
            commands:
              - ethtool --offload <interface-name> tx-udp_tnl-segmentation off
              - ethtool --offload <interface-name> tx-udp_tnl-csum-segmentation off
      ```

      This is due to a
      [known issue with VMware's VMXNET3 adapter](https://github.com/cilium/cilium/issues/13096#issuecomment-723901955),
      which is widely used in different virtual machine management services, including VMware vSphere and Hyper-V.

    :::

    <!-- prettier-ignore-end -->

   View the newly created `user-data` file to ensure the token is set correctly.

   ```bash
   cat user-data
   ```

10. The CanvOS utility uses [Earthly](https://earthly.dev/)(https://earthly.dev/) to build the target artifacts. By
    default, images are created for all the Palette-supported Kubernetes versions. Comment out the versions you do not
    need in the file **Earthfile** to speed up the build process and save disk space.

    ```
    build-provider-images:
    #    BUILD  +provider-image --K8S_VERSION=1.24.6
      BUILD  +provider-image --K8S_VERSION=1.25.2
      BUILD  +provider-image --K8S_VERSION=1.26.4
      BUILD  +provider-image --K8S_VERSION=1.27.2
    ```

11. Issue the following command to start the build process.

    <Tabs group="earthly">

    <TabItem value="Earthly Installed">

    ```bash
    earthly +build-all-images
    ```

    </TabItem>

    <TabItem value="Earthly Not Installed">

    ```bash
    sudo ./earthly.sh +build-all-images
    ```

    </TabItem>

    </Tabs>

    ```bash hideClipboard
    ===================== Earthly Build SUCCESS =====================
    Share your logs with an Earthly account (experimental)! Register for one at https://ci.earthly.dev.
    ```

    :::info

    If you plan to build the Edge Installer ISO using a content bundle, use the `+build-provider-images` option instead
    of the `+build-all-images` option in the command above. The command `sudo ./earthly.sh +build-provider-images` will
    build the provider images but not the Edge installer ISO. After the provider images are built, follow the steps in
    the [Build Content Bundle](./build-content-bundle.md) guide to build the Edge installer ISO using a content bundle.

    :::

    This command may take up to 15-20 minutes to finish depending on the resources of the host machine. Upon completion,
    the command will display the manifest, as shown in the example below, that you will use in your cluster profile
    later in this tutorial. Note that the `system.xxxxx` attribute values in the manifest example are the same as what
    you defined earlier in the `.arg` file.

    Copy and save the output attributes in a notepad or clipboard to use later in your cluster profile.

    ```yaml
    pack:
      content:
        images:
          - image: "{{.spectro.pack.edge-native-byoi.options.system.uri}}"
      # Below config is default value, please uncomment if you want to modify default values
      # drain:
      #cordon: true
      #timeout: 60 # The length of time to wait before giving up, zero means infinite
      #gracePeriod: 60 # Period of time in seconds given to each pod to terminate gracefully. If negative, the default value specified in the pod will be used
      #ignoreDaemonSets: true
      #deleteLocalData: true # Continue even if there are pods using emptyDir (local data that will be deleted when the node is drained)
      #force: true # Continue even if there are pods that do not declare a controller
      #disableEviction: false # Force drain to use delete, even if eviction is supported. This will bypass checking PodDisruptionBudgets, use with caution
      #skipWaitForDeleteTimeout: 60 # If pod DeletionTimestamp older than N seconds, skip waiting for the pod. Seconds must be greater than 0 to skip.
    options:
      system.uri:
        "{{ .spectro.pack.edge-native-byoi.options.system.registry }}/{{
        .spectro.pack.edge-native-byoi.options.system.repo }}:{{
        .spectro.pack.edge-native-byoi.options.system.k8sDistribution }}-{{ .spectro.system.kubernetes.version }}-{{
        .spectro.pack.edge-native-byoi.options.system.peVersion }}-{{
        .spectro.pack.edge-native-byoi.options.system.customTag }}"

      system.registry: ttl.sh
      system.repo: ubuntu
      system.k8sDistribution: k3s
      system.osName: ubuntu
      system.peVersion: v4.0.6
      system.customTag: palette-learn
      system.osVersion: 22
    ```

12. List the Docker images to review the provider images created. By default, provider images for all the Palette's
    Edge-supported Kubernetes versions are created. You can identify the provider images by reviewing the image tag
    value you used in the `.arg` file's `CUSTOM_TAG` argument.

    ```shell
    docker images --filter=reference='*/*:*palette-learn'
    ```

    ```hideClipboard bash
    REPOSITORY             TAG                                   IMAGE ID       CREATED         SIZE
    ttl.sh/ubuntu          k3s-1.27.2-v4.0.6-palette-learn       075134ad5d4b   10 minutes ago   4.11GB
    ttl.sh/ubuntu          k3s-1.25.2-v4.0.6-palette-learn       02424d29fcac   10 minutes ago   4.09GB
    ttl.sh/ubuntu          k3s-1.26.4-v4.0.6-palette-learn       4e373ddfb53f   10 minutes ago   4.11GB
    ```

13. To use the provider images in your cluster profile, push them to the image registry mentioned in the `.arg` file.
    The current example uses the [ttl.sh](https://ttl.sh/) image registry. This image registry is free to use and does
    not require a sign-up. Images pushed to _ttl.sh_ are ephemeral and will expire after the 24 hrs time limit. Use the
    following commands to push the provider images to the _ttl.sh_ image registry.

    ```bash
    docker push ttl.sh/ubuntu:k3s-1.25.2-v4.0.6-palette-learn
    docker push ttl.sh/ubuntu:k3s-1.26.4-v4.0.6-palette-learn
    docker push ttl.sh/ubuntu:k3s-1.27.2-v4.0.6-palette-learn
    ```

    :::warning

    As a reminder, [ttl.sh](https://ttl.sh/) is a short-lived image registry. If you do not use these provider images in
    your cluster profile within 24 hours of pushing to _ttl.sh_, they will expire and must be re-pushed. Refer to the
    Advanced workflow in the current guide to learn how to use another registry, such as Docker Hub, and tag the docker
    images accordingly.

    :::

14. After pushing the provider images to the image registry, open a web browser and log in to
    [Palette](https://console.spectrocloud.com). Ensure you are in the **Default** project scope before creating a
    cluster profile.

15. Navigate to the left **Main Menu** and select **Profiles**. Click on the **Add Cluster Profile** button, and fill
    out the required basic information fields to create a cluster profile for Edge.

16. Add the following <VersionedLink text="BYOS Edge OS" url="/integrations/packs/?pack=generic-byoi"/> pack to the OS
    layer in the **Profile Layers** section.

    | **Pack Type** | **Registry** | **Pack Name** | **Pack Version** |
    | ------------- | ------------ | ------------- | ---------------- |
    | OS            | Public Repo  | BYOS Edge OS  | `1.0.0`          |

17. Replace the cluster profile's BYOOS pack manifest with the following custom manifest so that the cluster profile can
    pull the provider image from the ttl.sh image registry.

    The `system.xxxxx` attribute values below refer to the arguments defined in the `.arg` file. If you modified the
    arguments in the `.arg` file, you must modify the attribute values below accordingly.

    ```yaml
    pack:
      content:
        images:
          - image: "{{.spectro.pack.edge-native-byoi.options.system.uri}}"
      # Below config is default value, please uncomment if you want to modify default values
      # drain:
      #cordon: true
      #timeout: 60 # The length of time to wait before giving up, zero means infinite
      #gracePeriod: 60 # Period of time in seconds given to each pod to terminate gracefully. If negative, the default value specified in the pod will be used
      #ignoreDaemonSets: true
      #deleteLocalData: true # Continue even if there are pods using emptyDir (local data that will be deleted when the node is drained)
      #force: true # Continue even if there are pods that do not declare a controller
      #disableEviction: false # Force drain to use delete, even if eviction is supported. This will bypass checking PodDisruptionBudgets, use with caution
      #skipWaitForDeleteTimeout: 60 # If pod DeletionTimestamp older than N seconds, skip waiting for the pod. Seconds must be greater than 0 to skip.
    options:
      system.uri:
        "{{ .spectro.pack.edge-native-byoi.options.system.registry }}/{{
        .spectro.pack.edge-native-byoi.options.system.repo }}:{{
        .spectro.pack.edge-native-byoi.options.system.k8sDistribution }}-{{ .spectro.system.kubernetes.version }}-{{
        .spectro.pack.edge-native-byoi.options.system.peVersion }}-{{
        .spectro.pack.edge-native-byoi.options.system.customTag }}"

      system.registry: ttl.sh
      system.repo: ubuntu
      system.k8sDistribution: k3s
      system.osName: ubuntu
      system.peVersion: v4.0.6
      system.customTag: palette-learn
      system.osVersion: 22
    ```

    The screenshot below displays how to reference a provider image in the BYOOS pack of your cluster profile.

    ![Screenshot of a sample cluster profile's OS layer ](/tutorials/palette-canvos/clusters_edge_palette-canvos_edit_profile.webp)

    :::info

    The BYOOS pack's `system.uri` attribute references the Kubernetes version selected in the cluster profile by using
    the `{{ .spectro.system.kubernetes.version }}` [macro](../../../cluster-management/macros.md). This is how the
    provider images you created and pushed to a registry are tied to the OS and Kubernetes version you selected in the
    `.arg` file.

    :::

18. Add the following **Palette Optimized K3s** pack to the Kubernetes layer of your cluster profile. Select the k3s
    version 1.27.x because earlier in this how-to guide, you pushed a provider image compatible with k3s v1.27.2 to the
    ttl.sh image registry.

    | **Pack Type** | **Registry** | **Pack Name**         | **Pack Version** |
    | ------------- | ------------ | --------------------- | ---------------- |
    | Kubernetes    | Public Repo  | Palette Optimized k3s | `1.27.x`         |

19. Add the network layer to your cluster profile, and choose a Container Network Interface (CNI) pack that best fits
    your needs, such as Calico, Flannel, Cilium, or Custom CNI. For example, you can add the following network layer.
    This step completes the core infrastructure layers in the cluster profile.

    | **Pack Type** | **Registry** | **Pack Name** | **Pack Version** |
    | ------------- | ------------ | ------------- | ---------------- |
    | Network       | Public Repo  | Calico        | `3.25.x`         |

20. Add add-on layers and manifests to your cluster profile per your requirements.

21. If there are no errors or compatibility issues, Palette displays the newly created complete cluster profile for
    review. Verify the layers you added, and finish creating the cluster profile.

### Validate

List the Edge installer ISO image and checksum by issuing the following command from the `CanvOS` directory.

```shell
ls build/
```

```hideClipboard shell
palette-edge-installer.iso
palette-edge-installer.iso.sha256
```

You can validate the ISO image by creating a bootable USB flash drive using any third-party software and attempting to
flash a bare host machine. Most software that creates a bootable USB drive will validate the ISO image. Here, the flash
process means installing the necessary tools and configurations on a host machine.

</TabItem>

<TabItem label="Advanced" value="advanced_create_artifacts" queryString="advanced">

### Prerequisites

To complete this advanced guide, you will need the following items:

- A physical or virtual Linux machine with _AMD64_ (also known as _x86_64_) processor architecture to build the Edge
  artifacts. You can issue the following command in the terminal to check your processor architecture.

  ```bash
  uname -m
  ```

- Minimum hardware configuration of the Linux machine:

  - 4 CPU
  - 8 GB memory
  - 50 GB storage

- [Git](https://git-scm.com/downloads). You can ensure git installation by issuing the `git --version` command.

- (Optional) [Earthly](https://earthly.dev/) is installed and available. If you do not install Earthly, you can still
  build the artifacts, but it would require root privileges, and some of the resulting artifacts will be owned by the
  root user.

- An image management tool such as [Docker](https://docs.docker.com/engine/install/) or
  [crane](https://github.com/google/go-containerregistry/blob/main/cmd/crane/README.md) is installed and available.

  :::info

  If you do not install Earthly, you must install Docker.

  :::

- A [Spectro Cloud](https://console.spectrocloud.com) account. If you have not signed up, you can sign up for an account
  [here](https://www.spectrocloud.com/get-started).

- Palette registration token for pairing Edge hosts with Palette. You will need tenant admin access to Palette to
  generate a new registration token. For detailed instructions, refer to the
  [Create Registration Token](/clusters/edge/site-deployment/site-installation/create-registration-token) guide.

- An account with [Docker Hub](https://hub.docker.com/). If you do not have an account with Docker Hub already, refer to
  the [Create an account](https://docs.docker.com/docker-id/) page for signing-up instructions.

:::info

This guide uses Docker Hub as an example. You can use any other image registry that suit your requirements.

:::

- A public repository named `opensuse-leap` in your image registry. Refer to the
  [Create a repository](https://docs.docker.com/docker-hub/repos/create/#create-a-repository) instructions for creating
  a Docker Hub repository and setting the repository's visibility to `public`.

### Instructions

Use the following instructions on your Linux machine to customize the arguments and `Dockerfile` and then create all the
required Edge artifacts.

1. Check out the [CanvOS](https://github.com/spectrocloud/CanvOS.git) GitHub repository containing the starter code.

```bash
git clone https://github.com/spectrocloud/CanvOS.git
```

2. Change to the `CanvOS` directory.

```bash
cd CanvOS
```

3. View the available [git tag](https://github.com/spectrocloud/CanvOS/tags).

```bash
git tag
```

4. Check out the newest available tag. This guide uses **v3.4.3** tag as an example.

```shell
git checkout v4.0.6
```

5. Review the files relevant for this guide.

   - `.arg.template` - A sample `.arg` file that defines arguments to use during the build process.
   - `Dockerfile` - Embeds the arguments and other configurations in the image.
   - `Earthfile` - Contains a series of commands to create target artifacts.
   - `earthly.sh` - Script to invoke the `Earthfile`, and generate target artifacts.
   - `user-data.template` - A sample user-data file.

6. Review the `.arg` file containing the customizable arguments, such as image tag, image registry, image repository,
   and OS distribution. The table below shows all arguments, their default value, and allowed values.

   | **Argument**       | **Description**                                                                              | **Default Value**      | **Allowed Values**                                                                             |
   | ------------------ | -------------------------------------------------------------------------------------------- | ---------------------- | ---------------------------------------------------------------------------------------------- |
   | `CUSTOM_TAG`       | Tag for the provider images                                                                  | demo                   | Lowercase alphanumeric string without spaces.                                                  |
   | `IMAGE_REGISTRY`   | Image registry name                                                                          | ttl.sh                 | Your image registry hostname, without `http` or `https` <br /> Example: docker.io/spectrocloud |
   | `OS_DISTRIBUTION`  | OS Distribution                                                                              | ubuntu                 | ubuntu, opensuse-leap                                                                          |
   | `IMAGE_REPO`       | Image repository name.<br /> It is the same as the OS distribution.                          | `$OS_DISTRIBUTION`     | Your image repository name.                                                                    |
   | `OS_VERSION`       | OS version, only applies to Ubuntu                                                           | 22                     | 20, 22                                                                                         |
   | `K8S_DISTRIBUTION` | Kubernetes Distribution                                                                      | k3s                    | k3s, rke2, kubeadm                                                                             |
   | `ISO_NAME`         | Name of the Installer ISO                                                                    | palette-edge-installer | Lowercase alphanumeric string without spaces. The characters `-` and `_` are allowed.          |
   | `ARCH`             | Architecture of the image.                                                                   | `amd64`                | `amd64`, `arm64`                                                                               |
   | `FIPS_ENABLED`     | to generate FIPS compliant binaries `true`or`false`                                          | `false`                | `true`, `false`                                                                                |
   | `HTTP_PROXY`       | URL of the HTTP Proxy server.                                                                | `""`                   | URL string                                                                                     |
   | `HTTPS_PROXY`      | URL of the HTTPS Proxy server.                                                               | `""`                   | URL string                                                                                     |
   | `NO_PROXY`         | URLS that should be excluded from the proxy.                                                 | `""`                   | Comma separated URL string                                                                     |
   | `PROXY_CERT_PATH`  | Absolute path of the SSL Proxy certificate in PEM format.                                    | `""`                   | Absolute path string                                                                           |
   | `UPDATE_KERNEL`    | Determines whether to upgrade the Kernel version to the latest from the upstream OS provider | `false`                | `true`, `false`                                                                                |

   Next, you will customize these arguments to use during the build process.

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

9. Issue the following command to use the openSUSE Leap OS distribution.

   ```bash
   export OS_DISTRIBUTION=opensuse-leap
   ```

10. Issue the command below to create the `.arg` file containing the custom tag, Docker Hub image registry hostname, and
    openSUSE Leap OS distribution. The `.arg` file uses the default values for the remaining arguments. You can refer to
    the existing `.arg.template` file to learn more about the available customizable arguments.

    ```bash
    cat << EOF > .arg
    IMAGE_REGISTRY=$IMAGE_REGISTRY
    OS_DISTRIBUTION=$OS_DISTRIBUTION
    IMAGE_REPO=$OS_DISTRIBUTION
    CUSTOM_TAG=$CUSTOM_TAG
    K8S_DISTRIBUTION=k3s
    ISO_NAME=palette-edge-installer
    ARCH=amd64
    HTTPS_PROXY=
    HTTP_PROXY=
    PROXY_CERT_PATH=
    UPDATE_KERNEL=false
    EOF
    ```

    View the newly created file to ensure the customized arguments are set correctly.

    ```bash
    cat .arg
    ```

    :::warning

    Using the arguments defined in the `.arg` file, the final provider image name will have the following naming
    pattern, `[IMAGE_REGISTRY]/[IMAGE_REPO]:[CUSTOM_TAG]`. Ensure the final artifact name conforms to the Docker Hub
    image name syntax - `[HOST]/[DOCKER-ID]/[REPOSITORY]:[TAG]`.

    :::

11. Use the following command to append the [WireGuard](https://www.wireguard.com/install/) installation instructions to
    the Dockerfile. You can install more tools and dependencies and configure the image to meet your needs. Add your
    customizations below the line tagged with the `Add any other image customizations here` comment in the Dockerfile.
    Do not edit or add any lines before this tagged comment.

    ```bash
    echo 'RUN sudo zypper refresh && sudo zypper install --non-interactive wireguard-tools' >> Dockerfile
    ```

    View the newly created file to ensure the instruction to install WireGuard is appended correctly.

    ```bash
    cat Dockerfile
    ```

    :::warning

    Using the `-y` option with the `sudo zypper install` command is critical to successfully build the images. The
    default behavior for package installations is to prompt the user for permission to install the package. A user
    prompt will cause the image creation process to fail. This guidance applies to all dependencies you add through the
    `Dockerfile`.

    :::

12. Issue the command below to save your tenant registration token to a local variable. Replace `[your_token_here]` with
    your actual registration token.

    ```bash
    export token=[your_token_here]
    ```

13. Use the following command to create the `user-data` file containing the tenant registration token.

    ```shell
    cat << EOF > user-data
    #cloud-config
    stylus:
      site:
        paletteEndpoint: api.spectrocloud.com
        edgeHostToken: $token
        tags:
          key1: value1
          key2: value2
          key3: value3
        name: edge-randomid
        registrationURL: https://edge-registration-app.vercel.app/

        network:
          httpProxy: http://proxy.example.com
          httpsProxy: https://proxy.example.com
          noProxy: 10.10.128.10,10.0.0.0/8

          nameserver: 1.1.1.1
          interfaces:
              enp0s3:
                  type: static
                  ipAddress: 10.0.10.25/24
                  gateway: 10.0.10.1
                  nameserver: 10.10.128.8
              enp0s4:
                  type: dhcp
        caCerts:
          - |
            ------BEGIN CERTIFICATE------
            *****************************
            *****************************
            ------END CERTIFICATE------
          - |
            ------BEGIN CERTIFICATE------
            *****************************
            *****************************
            ------END CERTIFICATE------
      registryCredentials:
        domain: registry.example.com
        username: bob
        password: ####
        insecure: false
    install:
      poweroff: true
    users:
      - name: kairos
        passwd: kairos
    EOF
    ```
     :::warning

    If you haven't set a default project for the registration token, ensure that you provide the
    `stylus.site.projectName` parameter with the value `Default` in `user-data`.

    :::

    If you need to pull images from a private image registry, you can supply the credentials for the registry in the
    `user-data` file in the `registryCredentials` field or in the cluster profile. Credentials specified in the
    `user-data` file overwrite the credentials provided in the cluster profile. To learn how to provide credentials in
    cluster profiles, refer to
    [Deploy Cluster with a Private Registry](../../site-deployment/deploy-custom-registries/deploy-private-registry.md).

    View the newly created `user-data` file to ensure the token is set correctly.

    ```bash
    cat user-data
    ```

    If you want further customization, check the existing `user-data.template` file, and refer to the
    [Edge Configuration Stages](../../edge-configuration/cloud-init.md) and
    [User Data Parameters](../../edge-configuration/installer-reference.md) documents to learn more.

14. CanvOS utility uses [Earthly](https://earthly.dev/) to build the target artifacts. Issue the following command to
    start the build process.

    <Tabs group="earthly">

    <TabItem value="Earthly Installed">

    ```bash
    earthly +build-all-images
    ```

    </TabItem>

    <TabItem value="Earthly Not Installed">

    ```bash
    sudo ./earthly.sh +build-all-images
    ```

    </TabItem>

    </Tabs>

    ```hideClipboard bash {2}
    # Output condensed for readability
    ===================== Earthly Build SUCCESS =====================
    Share your logs with an Earthly account (experimental)! Register for one at https://ci.earthly.dev.
    ```

    :::info

    If you plan to build the Edge Installer ISO using a content bundle, use the `+build-provider-images` option instead
    of the `+build-all-images` option in the command above. The command `sudo ./earthly.sh +build-provider-images` will
    build the provider images but not the Edge installer ISO. After the provider images are built, follow the steps in
    the [Build Content Bundle](./build-content-bundle.md) guide to build the Edge installer ISO using a content bundle.

    :::info

    This command may take up to 15-20 minutes to finish depending on the resources of the host machine. Upon completion,
    the command will display the manifest, as shown in the example below, that you will use in your cluster profile
    later in this tutorial. Note that the `system.xxxxx` attribute values in the manifest example are the same as what
    you defined earlier in the `.arg` file.

    Copy and save the output attributes in a notepad or clipboard to use later in your cluster profile.

    ```bash hideClipboard
    pack:
      content:
        images:
          - image: "{{.spectro.pack.edge-native-byoi.options.system.uri}}"
      # Below config is default value, please uncomment if you want to modify default values
      #drain:
        #cordon: true
        #timeout: 60 # The length of time to wait before giving up, zero means infinite
        #gracePeriod: 60 # Period of time in seconds given to each pod to terminate gracefully. If negative, the default value specified in the pod will be used
        #ignoreDaemonSets: true
        #deleteLocalData: true # Continue even if there are pods using emptyDir (local data that will be deleted when the node is drained)
        #force: true # Continue even if there are pods that do not declare a controller
        #disableEviction: false # Force drain to use delete, even if eviction is supported. This will bypass checking PodDisruptionBudgets, use with caution
        #skipWaitForDeleteTimeout: 60 # If pod DeletionTimestamp older than N seconds, skip waiting for the pod. Seconds must be greater than 0 to skip.
    options:
      system.uri: "{{ .spectro.pack.edge-native-byoi.options.system.registry }}/{{ .spectro.pack.edge-native-byoi.options.system.repo }}:{{ .spectro.pack.edge-native-byoi.options.system.k8sDistribution }}-{{ .spectro.system.kubernetes.version }}-{{ .spectro.pack.edge-native-byoi.options.system.peVersion }}-{{ .spectro.pack.edge-native-byoi.options.system.customTag }}"

      system.registry: docker.io/spectrocloud
      system.repo: opensuse-leap
      system.k8sDistribution: k3s
      system.osName: opensuse-leap
      system.peVersion: v4.0.6
      system.customTag: palette-learn
      system.osVersion:
    ```

15. List the Docker images to review the provider images created. By default, provider images for all the Palette's
    Edge-supported Kubernetes versions are created. You can identify the provider images by reviewing the image tag
    value you used in the `.arg` file's `CUSTOM_TAG` argument.

    ```shell
    docker images --filter=reference='*/*:*palette-learn'
    ```

    ```hideClipboard bash
    REPOSITORY                   TAG                               IMAGE ID       CREATED          SIZE
    spectrocloud/opensuse-leap   k3s-1.27.2-v4.0.6-palette-learn   2427e3667b2f   24 minutes ago   2.22GB
    spectrocloud/opensuse-leap   k3s-1.26.6-v4.0.6-palette-learn   0f2efd533a33   24 minutes ago   2.22GB
    spectrocloud/opensuse-leap   k3s-1.25.2-v4.0.6-palette-learn   2427e3667b2f   24 minutes ago   2.22GB
    ```

16. To use the provider images in your cluster profile, push them to your image registry mentioned in the `.arg` file.
    Issue the following command to log in to Docker Hub. Provide your Docker ID and password when prompted.

    ```bash
    docker login
    ```

    ```hideClipboard bash
    Login Succeeded
    ```

17. Use the following commands to push the provider images to the Docker Hub image registry you specified. Replace the
    `[DOCKER-ID]` and version numbers in the command below with your Docker ID and respective Kubernetes versions that
    the utility created.

    ```bash
    docker push docker.io/[DOCKER-ID]/opensuse-leap:k3s-1.27.2-v4.0.6-palette-learn
    docker push docker.io/[DOCKER-ID]/opensuse-leap:k3s-1.26.6-v4.0.6-palette-learn
    docker push docker.io/[DOCKER-ID]/opensuse-leap:k3s-1.25.2-v4.0.6-palette-learn
    ```

18. After pushing the provider images to the image registry, open a web browser and log in to
    [Palette](https://console.spectrocloud.com). Ensure you are in the **Default** project scope before creating a
    cluster profile.

19. Navigate to the left **Main Menu** and select **Profiles**. Click on the **Add Cluster Profile** button, and fill
    out the required basic information fields to create a cluster profile for Edge.

20. Add the following <VersionedLink text="BYOS Edge OS" url="/integrations/packs/?pack=generic-byoi"/> pack to the OS
    layer in the **Profile Layers** section.

    | **Pack Type** | **Registry** | **Pack Name** | **Pack Version** |
    | ------------- | ------------ | ------------- | ---------------- |
    | OS            | Public Repo  | BYOS Edge OS  | `1.0.0`          |

21. Replace the cluster profile's BYOOS pack manifest with the output that was provided to you earlier and that you
    copied.

    The `system.xxxxx` attribute values below refer to the arguments defined in the `.arg` file. If you modified the
    arguments in the `.arg` file, you must modify the attribute values below accordingly.

    ```yaml hideClipboard
    pack:
      content:
        images:
          - image: "{{.spectro.pack.edge-native-byoi.options.system.uri}}"
      # Below config is default value, please uncomment if you want to modify default values
      #drain:
      #cordon: true
      #timeout: 60 # The length of time to wait before giving up, zero means infinite
      #gracePeriod: 60 # Period of time in seconds given to each pod to terminate gracefully. If negative, the default value specified in the pod will be used
      #ignoreDaemonSets: true
      #deleteLocalData: true # Continue even if there are pods using emptyDir (local data that will be deleted when the node is drained)
      #force: true # Continue even if there are pods that do not declare a controller
      #disableEviction: false # Force drain to use delete, even if eviction is supported. This will bypass checking PodDisruptionBudgets, use with caution
      #skipWaitForDeleteTimeout: 60 # If pod DeletionTimestamp older than N seconds, skip waiting for the pod. Seconds must be greater than 0 to skip.
    options:
      system.uri:
        "{{ .spectro.pack.edge-native-byoi.options.system.registry }}/{{
        .spectro.pack.edge-native-byoi.options.system.repo }}:{{
        .spectro.pack.edge-native-byoi.options.system.k8sDistribution }}-{{ .spectro.system.kubernetes.version }}-{{
        .spectro.pack.edge-native-byoi.options.system.peVersion }}-{{
        .spectro.pack.edge-native-byoi.options.system.customTag }}"

      system.registry: docker.io/spectrocloud
      system.repo: opensuse-leap
      system.k8sDistribution: k3s
      system.osName: opensuse-leap
      system.peVersion: v4.0.6
      system.customTag: palette-learn
      system.osVersion:
    ```

    The screenshot below displays how to reference a provider image in the BYOOS pack of your cluster profile.

    ![Screenshot of a sample cluster profile's OS layer ](/tutorials/palette-canvos/clusters_edge_palette-canvos_edit_profile.webp)

    :::info

    The BYOOS pack's `system.uri` attribute references the Kubernetes version selected in the cluster profile by using
    the `{{ .spectro.system.kubernetes.version }}` [macro](../../../cluster-management/macros.md). This is how the
    provider images you created and pushed to a registry are tied to the OS and Kubernetes version you selected in the
    `.arg` file.

    :::

22. Add the following **Palette Optimized K3s** pack to the Kubernetes layer of your cluster profile. Select the k3s
    version 1.27.x because earlier in this how-to guide, you pushed a provider image compatible with k3s v1.27.2 to the
    ttl.sh image registry.

    | **Pack Type** | **Registry** | **Pack Name**         | **Pack Version** |
    | ------------- | ------------ | --------------------- | ---------------- |
    | Kubernetes    | Public Repo  | Palette Optimized K3s | `1.27.x`         |

23. Add the network layer to your cluster profile, and choose a Container Network Interface (CNI) pack that best fits
    your needs, such as Calico, Flannel, Cilium, or Custom CNI. For example, you can add the following network layer.
    This step completes the core infrastructure layers in the cluster profile.

    | **Pack Type** | **Registry** | **Pack Name** | **Pack Version** |
    | ------------- | ------------ | ------------- | ---------------- |
    | Network       | Public Repo  | Calico        | `3.25.x`         |

24. Add add-on layers and manifests to your cluster profile per your requirements.

25. If there are no errors or compatibility issues, Palette displays the newly created complete cluster profile for
    review. Verify the layers you added, and finish creating the cluster profile.

### Validate

List the Edge installer ISO image and checksum by issuing the following command from the `CanvOS` directory.

```shell
ls build/
```

```hideClipboard shell
palette-edge-installer.iso
palette-edge-installer.iso.sha256
```

You can validate the ISO image by creating a bootable USB flash drive using any third-party software and attempting to
flash a bare host machine. Most software that creates a bootable USB drive will validate the ISO image. Here, the flash
process means installing the necessary tools and configurations on a host machine.

</TabItem>

</Tabs>

## Next Steps

After building the Edge artifacts and creating an Edge cluster profile, the next step is to use the Edge installer ISO
image to prepare your Edge host. To learn more about utilizing Edge artifacts to prepare Edge hosts and deploy
Palette-managed Edge clusters, we encourage you to check out the reference resources below.

- [Deploy an Edge Cluster on VMware](../../../../tutorials/clusters/edge/deploy-cluster.md)

- [Installation](../../site-deployment/stage.md)
