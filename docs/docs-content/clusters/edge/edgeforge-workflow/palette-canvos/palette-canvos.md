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
Ubuntu based Edge installer ISO and provider images.

The advanced workflow uses more customization options. This workflow builds an openSUSE based Edge installer ISO and
provider images.

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

- A [Spectro Cloud](https://console.spectrocloud.com) account. If you have not signed up, you can sign up for an account
  [here](https://www.spectrocloud.com/get-started).

- Palette registration token for pairing Edge hosts with Palette. You will need tenant admin access to Palette to
  generate a new registration token. For detailed instructions, refer to the
  [Create Registration Token](/clusters/edge/site-deployment/site-installation/create-registration-token) guide.

- Access to an image registry.

  :::info

  This guide uses a public Docker Hub registry as an example. You can use any other image registry that suits your
  requirements.

  :::

### Instructions

Use the following instructions on your Linux machine to create all the required Edge artifacts with minimal
customization.

<PartialsComponent category="palette-edge-canvos-version" name="canvos-version" />

5. If you are using a self-hosted instance of Palette and have determined a specific CanvOS version, check out the
   corresponding tag.

   Otherwise, check out the newest available tag. This guide uses the tag `v4.7.2` as an example.

   ```shell
   git checkout v4.7.2
   ```

6. Review the files relevant for this guide.

   - `.arg.template` - A sample `.arg` file that defines arguments to use during the build process.
   - `Dockerfile` - Embeds the arguments and other configurations in the image.
   - `Earthfile` - Contains a series of commands to create target artifacts.
   - `earthly.sh` - Script to invoke the `Earthfile`, and generate target artifacts.
   - `user-data.template` - A sample file containing user data.

7. <PartialsComponent category="palette-edge-canvos-version" name="canvos-edge-arg-file" />
   For `.arg` examples, refer to [Full `.arg`
   Samples](/clusters/edge/edgeforge-workflow/prepare-user-data/#full-arg-samples).

8. <PartialsComponent category="palette-edge-canvos-version" name="canvos-edge-user-data" />

   <!-- prettier-ignore-start -->

   :::warning

   - If you haven't set a default project for the registration token, ensure that you provide the
     `stylus.site.projectName` parameter with the value `Default` in your `user-data` file.
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

9. View the newly created `user-data` file to ensure the token is set correctly.

   ```bash
   cat user-data
   ```

   :::tip

   You can also [edit user data in Local UI](../../local-ui/host-management/edit-user-data.md) after installation.
   However, we recommend providing user data during EdgeForge for production workloads, as not all user data fields can
   be updated in Local UI.

   :::

10. Issue the following command to start the build process.

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

      system.registry: spectrocloud
      system.repo: ubuntu
      system.k8sDistribution: k3s
      system.osName: ubuntu
      system.peVersion: v4.7.2
      system.customTag: palette-learn
      system.osVersion: 22
    ```

11. List the Docker images to review the provider images created. You can identify the provider images by reviewing the
    value you used in the `.arg` file's `CUSTOM_TAG` argument.

    ```shell
    docker images --filter=reference='*/*:*palette-learn'
    ```

    ```hideClipboard bash
    REPOSITORY                   TAG                                    IMAGE ID       CREATED          SIZE
    spectrocloud/ubuntu          k3s-1.33.5-v4.7.2-palette-learn       075134ad5d4b   10 minutes ago   4.11GB
    ```

12. To use the provider image with your Edge deployment, push it to the image registry specified in the `.arg` file. Log
    in to your container registry. Provide your credentials when prompted. The example below provides a Docker login
    command.

    ```bash
    docker login
    ```

13. Once authenticated, push the provider image to the registry so that your Edge host can download it during the
    cluster deployment.

    ```bash
    docker push $IMAGE_REGISTRY/ubuntu:k3s-1.33.5-v4.7.2-palette-learn
    ```

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
    pull the provider image from the image registry.

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

      system.registry: spectrocloud
      system.repo: ubuntu
      system.k8sDistribution: k3s
      system.osName: ubuntu
      system.peVersion: v4.7.2
      system.customTag: palette-learn
      system.osVersion: 22
    ```

    The screenshot below displays how to reference a provider image in the BYOOS pack of your cluster profile.

    ![Screenshot of a sample cluster profile's OS layer ](/clusters_edgeforge-workflow_palette-canvos_byos-pack_4-6.webp)

    :::info

    The BYOOS pack's `system.uri` attribute references the Kubernetes version selected in the cluster profile by using
    the `{{ .spectro.system.kubernetes.version }}` [macro](../../../cluster-management/macros.md). This is how the
    provider images you created and pushed to a registry are tied to the OS and Kubernetes version you selected in the
    `.arg` file.

    :::

18. Add the following **Palette Optimized K3s** pack to the Kubernetes layer of your cluster profile. Select the k3s
    version 1.33.x because earlier in this how-to guide, you pushed a provider image compatible with k3s v1.33.5 to an
    image registry.

    | **Pack Type** | **Registry** | **Pack Name**         | **Pack Version** |
    | ------------- | ------------ | --------------------- | ---------------- |
    | Kubernetes    | Public Repo  | Palette Optimized k3s | `1.33.x`         |

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

- A [Spectro Cloud](https://console.spectrocloud.com) account. If you have not signed up, you can sign up for an account
  [here](https://www.spectrocloud.com/get-started).

- Palette registration token for pairing Edge hosts with Palette. You will need tenant admin access to Palette to
  generate a new registration token. For detailed instructions, refer to the
  [Create Registration Token](/clusters/edge/site-deployment/site-installation/create-registration-token) guide.

- Access to an image registry.

  :::info

  This guide uses a public Docker Hub registry as an example. You can use any other image registry that suits your
  requirements.

  :::

- A public repository named `opensuse-leap` in your image registry. Refer to the
  [Create a repository](https://docs.docker.com/docker-hub/repos/create/#create-a-repository) instructions for creating
  a Docker Hub repository and setting the repository's visibility to `public`.

### Instructions

Use the following instructions on your Linux machine to customize the arguments and `Dockerfile` and then create all the
required Edge artifacts.

<PartialsComponent category="palette-edge-canvos-version" name="canvos-version" />

5.  If you are using a self-hosted instance of Palette and have determined a specific CanvOS version, checkout out the
    corresponding tag.

    Otherwise, check out the newest available tag. This guide uses the `v4.7.2` tag as an example.

    ```shell
    git checkout v4.7.2
    ```

6.  Review the files relevant for this guide.

    - `.arg.template` - A sample `.arg` file that defines arguments to use during the build process.
    - `Dockerfile` - Embeds the arguments and other configurations in the image.
    - `Earthfile` - Contains a series of commands to create target artifacts.
    - `earthly.sh` - Script to invoke the `Earthfile`, and generate target artifacts.
    - `user-data.template` - A sample file containing user data.

    For more information about preparing the `.arg` file, refer to
    [Prepare User Data and Argument Files](/clusters/edge/edgeforge-workflow/prepare-user-data/)

7.  <PartialsComponent category="palette-edge-canvos-version" name="canvos-edge-arg-file" />

8.  (Optional) This step is only required if your builds occur in a proxied network environment, and your proxy servers
    require client certificates, or if your base image is in a registry that requires client certificates.

    You can provide the base-64 encoded certificates in PEM format in the `certs` folder at the root directory of the
    `CanvOS` repository. You can provide as many certificates as you need in the folder.

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

9.  Customize the `Dockerfile` as needed. You can install tools and dependencies and make other image modifications. Add
    your customizations below the line tagged with the `Add any other image customizations here` comment in the
    `Dockerfile`. Do not edit or add any lines before this tagged comment.

    :::warning

    When customizing the `Dockerfile` to add custom binaries, install them into `/usr/bin`. Do not use `/usr/local`, as
    this directory is mounted from the persistent partition at boot and makes files added during image build unavailable
    at runtime.

    :::

    For example, you can add the following line to the `Dockerfile` to install
    [WireGuard](https://www.wireguard.com/install/).

    ```dockerfile
    ...
    ###########################Add any other image customizations here #######################

    RUN sudo zypper refresh && sudo zypper install --non-interactive wireguard-tools
    ```

    Package installation commands in the `Dockerfile` must be non-interactive. Ensure you use the appropriate
    non-interactive flag for your package manager, for example, `--non-interactive` for Zypper or `--yes` for Advanced
    Package Tool (APT). Interactive prompts cause the image build to fail. This guidance applies to all dependencies you
    add through the `Dockerfile`.

    You can also configure Pluggable Authentication Modules (PAM) policies in the `Dockerfile`. Below are examples for
    Ubuntu 22.04 and RHEL 9.

          <Tabs groupId="os">

          <TabItem value="Ubuntu 22.04">

    Ubuntu 22.04 does not include a password quality module by default. The example below uses `pam_cracklib`, which
    enforces password rules directly in the PAM configuration.

    ```dockerfile
    # Install pam_cracklib
    RUN apt-get update && \
        DEBIAN_FRONTEND=noninteractive apt-get install --yes libpam-cracklib && \
        apt-get clean && \
        rm --recursive --force /var/lib/apt/lists/*

    # Configure password quality policy for pam_cracklib
    RUN grep --quiet '^password[[:space:]]\+requisite[[:space:]]\+pam_cracklib\.so' /etc/pam.d/common-password || \
        sed --in-place '/^password.*pam_unix\.so/i password requisite pam_cracklib.so retry=3 minlen=15 minclass=4 maxrepeat=3 maxclassrepeat=4 dcredit=-1 ucredit=-1 lcredit=-1 ocredit=-1 enforce_for_root' /etc/pam.d/common-password
    ```

    Alternatively, you can use `pam_pwquality`, which is the modern replacement for `pam_cracklib`, as shown in the
    following example.

    ```dockerfile
    # Install the PAM password quality module
    RUN apt-get update && \
        DEBIAN_FRONTEND=noninteractive apt-get install --yes libpam-pwquality && \
        apt-get clean && \
        rm --recursive --force /var/lib/apt/lists/*
    # Configure password quality policy
    RUN printf '%s\n' \
        'minlen = 15' \
        'minclass = 4' \
        'maxrepeat = 3' \
        'maxclassrepeat = 4' \
        'dcredit = -1' \
        'ucredit = -1' \
        'lcredit = -1' \
        'ocredit = -1' \
        'enforce_for_root' \
        'dictcheck = 0' \
        > /etc/security/pwquality.conf
    # Ensure pam_pwquality is in the PAM stack for password changes
    RUN grep --quiet '^password.*pam_pwquality\.so' /etc/pam.d/common-password || \
        sed --in-place '/^password.*pam_unix\.so/i password requisite pam_pwquality.so retry=3' /etc/pam.d/common-password
    ```

          </TabItem>

          <TabItem value="RHEL 9">

    RHEL 9 uses `pam_pwquality` by default. This module enforces password strength using policies defined in
    `/etc/security/pwquality.conf`. You only need to configure the policy.

    ```dockerfile
    # Configure password quality policy for pam_pwquality
    RUN printf '%s\n' \
         'minlen = 15' \
         'minclass = 4' \
         'maxrepeat = 3' \
         'maxclassrepeat = 4' \
         'dcredit = -1' \
         'ucredit = -1' \
         'lcredit = -1' \
         'ocredit = -1' \
         'enforce_for_root' \
         'dictcheck = 0' \
         > /etc/security/pwquality.conf
    ```

          </TabItem>

    </Tabs>

    View the `Dockerfile` to ensure the instructions you added are appended correctly.

    ```bash
    cat Dockerfile
    ```

10. <PartialsComponent category="palette-edge-canvos-version" name="canvos-edge-user-data" />

    :::warning

    If you haven't set a default project for the registration token, ensure that you provide the
    `stylus.site.projectName` parameter with the value `Default` in the `user-data` file.

    :::

    You can also [edit user data in Local UI](../../local-ui/host-management/edit-user-data.md) after installation.
    However, we recommend providing user data during EdgeForge for production workloads, as not all user data fields can
    be updated in Local UI.

    :::info

    If you need to pull images from a private image registry, you can supply the credentials for the registry in the
    `user-data` file in the `registryCredentials` field or in the cluster profile. Credentials specified in the
    `user-data` file overwrite the credentials provided in the cluster profile. To learn how to provide credentials in
    cluster profiles, refer to
    [Deploy Cluster with a Private Registry](../../site-deployment/deploy-custom-registries/deploy-private-registry.md).

    :::

    View the newly created `user-data` file to ensure the token is set correctly.

    ```bash
    cat user-data
    ```

    Refer to the [Edge Configuration Stages](../../edge-configuration/cloud-init.md) and
    [User Data Parameters](../../edge-configuration/installer-reference.md) documents to learn more.

11. CanvOS utility uses [Earthly](https://earthly.dev/) to build the target artifacts. Issue the following command to
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

    :::

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

      system.registry: spectrocloud
      system.repo: opensuse-leap
      system.k8sDistribution: k3s
      system.osName: opensuse-leap
      system.peVersion: v4.7.2
      system.customTag: palette-learn
      system.osVersion:
    ```

12. List the Docker images to review the provider images created. By default, provider images for all the Palette's
    Edge-supported Kubernetes versions are created. You can identify the provider images by reviewing the value you used
    in the `.arg` file's `CUSTOM_TAG` argument.

    ```shell
    docker images --filter=reference='*/*:*palette-learn'
    ```

    ```hideClipboard bash
    REPOSITORY                   TAG                               IMAGE ID       CREATED          SIZE
    spectrocloud/opensuse-leap   k3s-1.33.5-v4.7.2-palette-learn   2427e3667b2f   24 minutes ago   2.22GB
    ```

13. To use the provider images in your cluster profile, push them to the image registry mentioned in the `.arg` file.
    Issue the following command to log in to Docker Hub. Provide your Docker ID and password when prompted.

    ```bash
    docker login
    ```

    ```hideClipboard bash
    Login Succeeded
    ```

14. Use the following commands to push the provider images to the Docker Hub image registry you specified. Replace
    `spectrocloud` and the version numbers in the command below with your Docker ID and respective Kubernetes versions
    that the utility created.

    ```bash
    docker push spectrocloud/opensuse-leap:k3s-1.33.5-v4.7.2-palette-learn
    ```

15. After pushing the provider images to the image registry, open a web browser and log in to
    [Palette](https://console.spectrocloud.com). Ensure you are in the **Default** project scope before creating a
    cluster profile.

16. Navigate to the left **Main Menu** and select **Profiles**. Click on the **Add Cluster Profile** button, and fill
    out the required basic information fields to create a cluster profile for Edge.

17. Add the following <VersionedLink text="BYOS Edge OS" url="/integrations/packs/?pack=generic-byoi"/> pack to the OS
    layer in the **Profile Layers** section.

    | **Pack Type** | **Registry** | **Pack Name** | **Pack Version** |
    | ------------- | ------------ | ------------- | ---------------- |
    | OS            | Public Repo  | BYOS Edge OS  | `1.0.0`          |

18. Replace the cluster profile's BYOOS pack manifest with the output that was provided to you earlier and that you
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

      system.registry: spectrocloud
      system.repo: opensuse-leap
      system.k8sDistribution: k3s
      system.osName: opensuse-leap
      system.peVersion: v4.7.2
      system.customTag: palette-learn
      system.osVersion:
    ```

    The screenshot below displays how to reference a provider image in the BYOOS pack of your cluster profile.

    ![Screenshot of a sample cluster profile's OS layer ](/clusters_edgeforge-workflow_palette-canvos_byos-pack_4-6.webp)

    :::info

    The BYOOS pack's `system.uri` attribute references the Kubernetes version selected in the cluster profile by using
    the `{{ .spectro.system.kubernetes.version }}` [macro](../../../cluster-management/macros.md). This is how the
    provider images you created and pushed to a registry are tied to the OS and Kubernetes version you selected in the
    `.arg` file.

    :::

19. Add the following **Palette Optimized K3s** pack to the Kubernetes layer of your cluster profile. Select the K3s
    version 1.33.x because earlier in this how-to guide, you pushed a provider image compatible with k3s v1.33.5 to the
    image registry.

    | **Pack Type** | **Registry** | **Pack Name**         | **Pack Version** |
    | ------------- | ------------ | --------------------- | ---------------- |
    | Kubernetes    | Public Repo  | Palette Optimized K3s | `1.33.x`         |

20. Add the network layer to your cluster profile, and choose a Container Network Interface (CNI) pack that best fits
    your needs, such as Calico, Flannel, Cilium, or Custom CNI. For example, you can add the following network layer.
    This step completes the core infrastructure layers in the cluster profile.

    | **Pack Type** | **Registry** | **Pack Name** | **Pack Version** |
    | ------------- | ------------ | ------------- | ---------------- |
    | Network       | Public Repo  | Calico        | `3.25.x`         |

21. Add add-on layers and manifests to your cluster profile per your requirements.

22. If there are no errors or compatibility issues, Palette displays the newly created complete cluster profile for
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

## Resources

- [Build Content Bundles](./build-content-bundle.md)

- [Build FIPS-Compliant Edge Artifacts](./fips.md)

- [Build Installer ISO](./build-installer-iso.md)

- [Build Provider Images](./build-provider-images.md)

- [Edge Artifact Build Configurations](./arg.md)

- [Embed a Public Key in Edge Artifacts](./signed-content.md)
