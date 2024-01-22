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
[user data](../edge-configuration/installer-reference.md) configurations before deploying a Kubernetes cluster. An Edge
host requires the following artifacts to prepare for successful cluster deployment:

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

:::info

CanvOS is a utility that helps you build Edge artifacts. CanvOS is part of the EdgeForge workflow.

:::

The diagram below shows the high-level steps to building the Edge artifacts and pushing the provider images to an image
registry.

![Overarching diagram showing the workflow in the current guide.](/tutorials/palette-canvos/clusters_edge_palette-canvos_artifacts.png)

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

### Instructions

Use the following instructions on your Linux machine to create all the required Edge artifacts with minimal
customization.

<br />

1. Check out the [CanvOS](https://github.com/spectrocloud/CanvOS) GitHub repository containing the starter code.

{" "}

<br />

```bash
git clone https://github.com/spectrocloud/CanvOS.git
```

2. Change to the **CanvOS/** directory.
   <br />

```bash
cd CanvOS
```

3. View the available [git tag](https://github.com/spectrocloud/CanvOS/tags).
   <br />

```bash
git tag
```

4. Check out the newest available tag. This guide uses **v3.4.3** tag as an example.
   <br />

```shell
git checkout v3.4.3
```

5. Review the files relevant for this guide.

   - **.arg.template** - A sample **.arg** file that defines arguments to use during the build process.
   - **Dockerfile** - Embeds the arguments and other configurations in the image.
   - **Earthfile** - Contains a series of commands to create target artifacts.
   - **earthly.sh** - Script to invoke the Earthfile, and generate target artifacts.
   - **user-data.template** - A sample user-data file.
     <br />

6. Issue the command below to assign an image tag value that will be used when creating the provider images. This guide
   uses the value `palette-learn` as an example. However, you can assign any lowercase and alphanumeric string to the
   `CUSTOM_TAG` argument.

```bash
export CUSTOM_TAG=palette-learn
```

{" "}

<br />

7. Issue the command below to create the **.arg** file containing the custom tag. The remaining arguments in the
   **.arg** file will use the default values. For example, `ubuntu` is the default operating system, `demo` is the
   default tag, and [ttl.sh](https://ttl.sh/) is the default image registry. Refer to the existing **.arg.template**
   file in the current directory or the [README](https://github.com/spectrocloud/CanvOS#readme) to learn more about the
   available customizable arguments.

:::info

The default ttl.sh image registry is free and does not require a sign-up. Images pushed to ttl.sh are ephemeral and will
expire after the 24 hrs time limit. Should you need to use a different image registry, refer to the Advanced workflow in
the [Build Edge Artifacts](palette-canvos.md) guide.

:::

Using the arguments defined in the **.arg** file, the final provider images you generate will have the following naming
convention, `[IMAGE_REGISTRY]/[IMAGE_REPO]:[CUSTOM_TAG]`. For example, one of the provider images will be
`ttl.sh/ubuntu:k3s-1.25.2-v3.4.3-demo`.

```bash
cat << EOF > .arg
CUSTOM_TAG=$CUSTOM_TAG
IMAGE_REGISTRY=ttl.sh
OS_DISTRIBUTION=ubuntu
IMAGE_REPO=ubuntu
OS_VERSION=22
K8S_DISTRIBUTION=k3s
ISO_NAME=palette-edge-installer
PE_VERSION=$(git describe --abbrev=0 --tags)
ARCH=amd64
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

9. Use the following command to create the **user-data** file containing the tenant registration token. Also, you can
   click on the _Points of Interest_ numbers below to learn more about the main attributes relevant to this example.

  <PointsOfInterest
    points={[
      {
        x: 260,
        y: 187,
        label: 1,
        description: "Stores the registration token and lets the agent use the auto-registration functionality and authenticate with the provided token.",
        tooltipPlacement: "rightTop",
      },
      {
        x: 190,
        y: 262,
        label: 2,
        description: "Instructs the installer to turn the host machine off once the installation is complete.",
      },
      {
        x: 190,
        y: 340,
        label: 3,
        description: "Sets the login credentials for Edge hosts. The login credentials will allow you to SSH log into the edge host for debugging purposes.",
        tooltipPlacement: "rightTop",
      },
    ]}
  >

```shell
cat << EOF > user-data
#cloud-config
stylus:
  site:
    edgeHostToken: $token
install:
  poweroff: true
users:
  - name: kairos
    passwd: kairos
EOF
```

  </PointsOfInterest>

{" "}

<br />

View the newly created user data file to ensure the token is set correctly.

```bash
cat user-data
```

{" "}

<br />

10. The CanvOS utility uses [Earthly](https://earthly.dev/) to build the target artifacts. Issue the following command
    to start the build process.

```bash
sudo ./earthly.sh +build-all-images
```

```bash hideClipboard
===================== Earthly Build SUCCESS =====================
Share your logs with an Earthly account (experimental)! Register for one at https://ci.earthly.dev.
```

:::info

If you plan to build Edge artifacts using a content bundle, use the `+build-provider-images` option instead of the
`+build-all-images` option in the command above. The command, `sudo ./earthly.sh +build-provider-images`, will build the
provider images but not the Edge installer ISO.

:::

This command may take up to 15-20 minutes to finish depending on the resources of the host machine. Upon completion, the
command will display the manifest, as shown in the example below, that you will use in your cluster profile later in
this tutorial. Note that the `system.xxxxx` attribute values in the manifest example are the same as what you defined
earlier in the **.arg** file.

Copy and save the output attributes in a notepad or clipboard to use later in your cluster profile.

```bash
pack:
  content:
    images:
      - image: "{{.spectro.pack.edge-native-byoi.options.system.uri}}"
options:
  system.uri: "{{ .spectro.pack.edge-native-byoi.options.system.registry }}/{{ .spectro.pack.edge-native-byoi.options.system.repo }}:{{ .spectro.pack.edge-native-byoi.options.system.k8sDistribution }}-{{ .spectro.system.kubernetes.version }}-{{ .spectro.pack.edge-native-byoi.options.system.peVersion }}-{{ .spectro.pack.edge-native-byoi.options.system.customTag }}"
  system.registry: ttl.sh
  system.repo: ubuntu
  system.k8sDistribution: k3s
  system.osName: ubuntu
  system.peVersion: v3.4.3
  system.customTag: demo
  system.osVersion: 22
```

{" "}

<br />

11. List the Docker images to review the provider images created. By default, provider images for all the Palette's
    Edge-supported Kubernetes versions are created. You can identify the provider images by reviewing the image tag
    value you used in the **.arg** file's `CUSTOM_TAG` argument.
    <br />

```shell
docker images --filter=reference='*/*:*palette-learn'
```

```hideClipboard bash {3,4}
# Output
REPOSITORY        TAG                                IMAGE ID       CREATED         SIZE
ttl.sh/ubuntu     k3s-1.25.2-v3.4.3-palette-learn    b3c4956ccc0a   6 minutes ago   2.49GB
ttl.sh/ubuntu     k3s-1.24.6-v3.4.3-palette-learn    fe1486da25df   6 minutes ago   2.49GB
```

{" "}

<br />

12. To use the provider images in your cluster profile, push them to the image registry mentioned in the **.arg** file.
    The current example uses the [ttl.sh](https://ttl.sh/) image registry. This image registry is free to use and does
    not require a sign-up. Images pushed to _ttl.sh_ are ephemeral and will expire after the 24 hrs time limit. Use the
    following commands to push the provider images to the _ttl.sh_ image registry.
    <br />

```bash
docker push ttl.sh/ubuntu:k3s-1.25.2-v3.4.3-palette-learn
docker push ttl.sh/ubuntu:k3s-1.24.6-v3.4.3-palette-learn
```

{" "}

<br />

:::warning

As a reminder, [ttl.sh](https://ttl.sh/) is a short-lived image registry. If you do not use these provider images in
your cluster profile within 24 hours of pushing to _ttl.sh_, they will expire and must be re-pushed. Refer to the
Advanced workflow in the current guide to learn how to use another registry, such as Docker Hub, and tag the docker
images accordingly.

:::

{" "}

<br />

13. After pushing the provider images to the image registry, open a web browser and log in to
    [Palette](https://console.spectrocloud.com). Ensure you are in the **Default** project scope before creating a
    cluster profile.

14. Navigate to the left **Main Menu** and select **Profiles**. Click on the **Add Cluster Profile** button, and fill
    out the required basic information fields to create a cluster profile for Edge.

15. Add the following [BYOS Edge OS](../../../integrations/byoos.md) pack to the OS layer in the **Profile Layers**
    section.

| **Pack Type** | **Registry** | **Pack Name** | **Pack Version** |
| ------------- | ------------ | ------------- | ---------------- |
| OS            | Public Repo  | BYOS Edge OS  | `1.0.0`          |

16. Replace the the cluster profile's BYOOS pack manifest with the following custom manifest so that the cluster profile
    can pull the provider image from the ttl.sh image registry.

The `system.xxxxx` attribute values below refer to the arguments defined in the **.arg** file. If you modified the
arguments in the **.arg** file, you must modify the attribute values below accordingly.

{" "}

<br />

```yaml
pack:
  content:
    images:
      - image: "{{.spectro.pack.edge-native-byoi.options.system.uri}}"
options:
  system.uri:
    "{{ .spectro.pack.edge-native-byoi.options.system.registry }}/{{ .spectro.pack.edge-native-byoi.options.system.repo
    }}:{{ .spectro.pack.edge-native-byoi.options.system.k8sDistribution }}-{{ .spectro.system.kubernetes.version }}-{{
    .spectro.pack.edge-native-byoi.options.system.peVersion }}-{{
    .spectro.pack.edge-native-byoi.options.system.customTag }}"
  system.registry: ttl.sh
  system.repo: ubuntu
  system.k8sDistribution: k3s
  system.osName: ubuntu
  system.peVersion: v3.4.3
  system.customTag: demo
  system.osVersion: 22
```

The screenshot below displays how to reference a provider image in the BYOOS pack of your cluster profile.

![Screenshot of a sample cluster profile's OS layer ](/tutorials/palette-canvos/clusters_edge_palette-canvos_edit_profile.png)

{" "}

<br />

:::info

The BYOOS pack's `system.uri` attribute references the Kubernetes version selected in the cluster profile by using the
`{{ .spectro.system.kubernetes.version }}` [macro](../../cluster-management/macros.md). This is how the provider images
you created and pushed to a registry are tied to the OS and Kubernetes version you selected in the **.arg** file.

:::

17. Add the following **Palette Optimized K3s** pack to the Kubernetes layer of your cluster profile. Select the k3s
    version 1.25.x because earlier in this how-to guide, you pushed a provider image compatible with k3s v1.25.2 to the
    ttl.sh image registry.

| **Pack Type** | **Registry** | **Pack Name**         | **Pack Version** |
| ------------- | ------------ | --------------------- | ---------------- |
| Kubernetes    | Public Repo  | Palette Optimized k3s | `1.25.x`         |

18. Add the network layer to your cluster profile, and choose a Container Network Interface (CNI) pack that best fits
    your needs, such as Calico, Flannel, Cilium, or Custom CNI. For example, you can add the following network layer.
    This step completes the core infrastructure layers in the cluster profile.

| **Pack Type** | **Registry** | **Pack Name** | **Pack Version** |
| ------------- | ------------ | ------------- | ---------------- |
| Network       | Public Repo  | Calico        | `3.25.x`         |

19. Add add-on layers and manifests to your cluster profile per your requirements.

20. If there are no errors or compatibility issues, Palette displays the newly created complete cluster profile for
    review. Verify the layers you added, and finish creating the cluster profile.
    <br />

### Validate

List the Edge installer ISO image and checksum by issuing the following command from the **CanvOS/** directory.

<br />

```shell
ls build/
```

```hideClipboard shell
# Output
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

<br />

- A physical or virtual Linux machine with _AMD64_ (also known as _x86_64_) processor architecture to build the Edge
  artifacts. You can issue the following command in the terminal to check your processor architecture.

  <br />

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

- A [Spectro Cloud](https://console.spectrocloud.com) account. If you have not signed up, you can sign up for a
  [free trial](https://www.spectrocloud.com/free-tier/).

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

Use the following instructions on your Linux machine to customize the arguments and Dockerfile and then create all the
required Edge artifacts.

<br />

1. Check out the [CanvOS](https://github.com/spectrocloud/CanvOS.git) GitHub repository containing the starter code.
   <br />

```bash
git clone https://github.com/spectrocloud/CanvOS.git
```

2. Change to the **CanvOS/** directory.
   <br />

```bash
cd CanvOS
```

3. View the available [git tag](https://github.com/spectrocloud/CanvOS/tags).
   <br />

```bash
git tag
```

4. Check out the newest available tag. This guide uses **v3.4.3** tag as an example.
   <br />

```shell
git checkout v3.4.3
```

{" "}

<br />

5. Review the files relevant for this guide.

   - **.arg.template** - A sample **.arg** file that defines arguments to use during the build process.
   - **Dockerfile** - Embeds the arguments and other configurations in the image.
   - **Earthfile** - Contains a series of commands to create target artifacts.
   - **earthly.sh** - Script to invoke the Earthfile, and generate target artifacts.
   - **user-data.template** - A sample user-data file.
     <br />

6. Review the **.arg** file containing the customizable arguments, such as image tag, image registry, image repository,
   and OS distribution. The table below shows all arguments, their default value, and allowed values.

| **Argument**       | **Description**                                                                                                                                      | **Default Value**      | **Allowed Values**                                                                             |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ---------------------------------------------------------------------------------------------- |
| `CUSTOM_TAG`       | Tag for the provider images                                                                                                                          | demo                   | Lowercase alphanumeric string without spaces.                                                  |
| `IMAGE_REGISTRY`   | Image registry name                                                                                                                                  | ttl.sh                 | Your image registry hostname, without `http` or `https` <br /> Example: docker.io/spectrocloud |
| `OS_DISTRIBUTION`  | OS Distribution                                                                                                                                      | ubuntu                 | ubuntu, opensuse-leap                                                                          |
| `IMAGE_REPO`       | Image repository name.<br /> It is the same as the OS distribution.                                                                                  | `$OS_DISTRIBUTION`     | Your image repository name.                                                                    |
| `OS_VERSION`       | OS version, only applies to Ubuntu                                                                                                                   | 22                     | 20, 22                                                                                         |
| `K8S_DISTRIBUTION` | Kubernetes Distribution                                                                                                                              | k3s                    | k3s, rke2, kubeadm                                                                             |
| `ISO_NAME`         | Name of the Installer ISO                                                                                                                            | palette-edge-installer | Lowercase alphanumeric string without spaces. The charaters `-` and `_` are allowed.           |
| `PE_VERSION`       | The Palette Edge installer version. This should match the tag checked out from Git. This is an advanced setting. Do not modify unless told to do so. | String                 | Git tags.                                                                                      |
| `platform`         | Type of platform to use for the build. Used for cross platform builds (arm64 to amd64 as example).                                                   | string                 | `linux/amd64`                                                                                  |

Next, you will customize these arguments to use during the build process.

<br />

7. Issue the command below to assign an image tag value that will be used when creating the provider images. This guide
   uses the value `palette-learn` as an example. However, you can assign any lowercase and alphanumeric string to the
   `CUSTOM_TAG` argument.
   <br />

```bash
export CUSTOM_TAG=palette-learn
```

{" "}

<br />

8. Use the command below to save the Docker Hub image registry hostname in the `IMAGE_REGISTRY` argument. Before you
   execute the command, replace `[DOCKER-ID]` in the declaration below with your Docker ID. Your image registry hostname
   must comply with standard DNS rules and may not contain underscores.
   <br />

```bash
export IMAGE_REGISTRY=docker.io/[DOCKER-ID]    # Follows [HOST]/[DOCKER-ID] syntax. Example: docker.io/spectrocloud
```

{" "}

<br />

9. Issue the following command to use the openSUSE Leap OS distribution.
   <br />

```bash
export OS_DISTRIBUTION=opensuse-leap
```

{" "}

<br />

10. Issue the command below to create the **.arg** file containing the custom tag, Docker Hub image registry hostname,
    and openSUSE Leap OS distribution. The **.arg** file uses the default values for the remaining arguments. You can
    refer to the existing **.arg.template** file to learn more about the available customizable arguments.
    <br />

```bash
cat << EOF > .arg
IMAGE_REGISTRY=$IMAGE_REGISTRY
OS_DISTRIBUTION=$OS_DISTRIBUTION
IMAGE_REPO=$OS_DISTRIBUTION
CUSTOM_TAG=$CUSTOM_TAG
K8S_DISTRIBUTION=k3s
ISO_NAME=palette-edge-installer
PE_VERSION=$(git describe --abbrev=0 --tags)
ARCH=amd64
EOF
```

View the newly created file to ensure the customized arguments are set correctly.

{" "}

<br />

```bash
cat .arg
```

:::warning

Using the arguments defined in the **.arg** file, the final provider image name will have the following naming pattern,
`[IMAGE_REGISTRY]/[IMAGE_REPO]:[CUSTOM_TAG]`. Ensure the final artifact name conforms to the Docker Hub image name
syntax - `[HOST]/[DOCKER-ID]/[REPOSITORY]:[TAG]`.

:::

11. Use the following command to append the [WireGuard](https://www.wireguard.com/install/) installation instructions to
    the Dockerfile. You can install more tools and dependencies and configure the image to meet your needs. Add your
    customizations below the line tagged with the `Add any other image customizations here` comment in the Dockerfile.
    Do not edit or add any lines before this tagged comment.
    <br />

```bash
echo 'RUN sudo zypper refresh && sudo zypper install -y wireguard-tools' >> Dockerfile
```

View the newly created file to ensure the instruction to install WireGuard is appended correctly.

{" "}

<br />

```bash
cat Dockerfile
```

:::warning

Using the `-y` option with the `sudo zypper install` command is critical to successfully build the images. The default
behavior for package installations is to prompt the user for permission to install the package. A user prompt will cause
the image creation process to fail. This guidance applies to all dependencies you add through the **Dockerfile**.

:::

12. Issue the command below to save your tenant registration token to a local variable. Replace `[your_token_here]` with
    your actual registration token.
    <br />

```bash
export token=[your_token_here]
```

{" "}

<br />
13. Use the following command to create the **user-data** file containing the tenant registration token. Also, you can click
on the *Points of Interest* numbers below to learn more about the main attributes relevant to this example.
<br />

  <PointsOfInterest
    points={[
      {
        x: 260,
        y: 187,
        label: 1,
        description: "Stores the registration token and lets the agent use the auto-registration functionality and authenticate with the provided token.",
        tooltipPlacement: "rightTop",
      },
      {
        x: 190,
        y: 262,
        label: 2,
        description: "Instructs the installer to turn the host machine off once the installation is complete.",
      },
      {
        x: 190,
        y: 340,
        label: 3,
        description: "Sets the login credentials for Edge hosts. The login credentials will allow you to SSH log into the edge host for debugging purposes.",
        tooltipPlacement: "rightTop",
      },
    ]}
  >

```shell
cat << EOF > user-data
#cloud-config
stylus:
  site:
    edgeHostToken: $token
install:
  poweroff: true
users:
  - name: kairos
    passwd: kairos
EOF
```

  </PointsOfInterest>

View the newly created user data file to ensure the token is set correctly.

<br />

```bash
cat user-data
```

If you want further customization, check the existing **user-data.template** file, and refer to the
[Edge Configuration Stages](../edge-configuration/cloud-init.md) and
[User Data Parameters](../edge-configuration/installer-reference.md) documents to learn more.

{" "}

<br />

14. CanvOS utility uses [Earthly](https://earthly.dev/) to build the target artifacts. Issue the following command to
    start the build process.
    <br />

```bash
sudo ./earthly.sh +build-all-images
```

```hideClipboard bash {2}
# Output condensed for readability
===================== Earthly Build SUCCESS =====================
Share your logs with an Earthly account (experimental)! Register for one at https://ci.earthly.dev.
```

{" "}

<br />

:::info

If you plan to build Edge artifacts using a content bundle, use the `+build-provider-images` option instead of the
`+build-all-images` option in the command above. The command, `sudo ./earthly.sh +build-provider-images`, will build the
provider images but not the Edge installer ISO.

:::

This command may take up to 15-20 minutes to finish depending on the resources of the host machine. Upon completion, the
command will display the manifest, as shown in the example below, that you will use in your cluster profile later in
this tutorial. Note that the `system.xxxxx` attribute values in the manifest example are the same as what you defined
earlier in the **.arg** file.

Copy and save the output attributes in a notepad or clipboard to use later in your cluster profile.

{" "}

<br />

```bash
pack:
  content:
    images:
      - image: "{{.spectro.pack.edge-native-byoi.options.system.uri}}"
options:
  system.uri: "{{ .spectro.pack.edge-native-byoi.options.system.registry }}/{{ .spectro.pack.edge-native-byoi.options.system.repo }}:{{ .spectro.pack.edge-native-byoi.options.system.k8sDistribution }}-{{ .spectro.system.kubernetes.version }}-{{ .spectro.pack.edge-native-byoi.options.system.peVersion }}-{{ .spectro.pack.edge-native-byoi.options.system.customTag }}"
  system.registry: docker.io/spectrocloud
  system.repo: opensuse-leap
  system.k8sDistribution: k3s
  system.osName: opensuse-leap
  system.peVersion: v3.4.3
  system.customTag: palette-learn
```

{" "}

<br />
<br />

15. List the Docker images to review the provider images created. By default, provider images for all the Palette's
    Edge-supported Kubernetes versions are created. You can identify the provider images by reviewing the image tag
    value you used in the **.arg** file's `CUSTOM_TAG` argument.
    <br />

```shell
docker images --filter=reference='*/*:*palette-learn'
```

```hideClipboard bash {3,4}
# Output
REPOSITORY                   TAG                               IMAGE ID       CREATED          SIZE
spectrocloud/opensuse-leap   k3s-1.25.2-v3.4.3-palette-learn   2427e3667b2f   24 minutes ago   2.22GB
spectrocloud/opensuse-leap   k3s-1.24.6-v3.4.3-palette-learn   0f2efd533a33   24 minutes ago   2.22GB
```

{" "}

<br />

16. To use the provider images in your cluster profile, push them to your image registry mentioned in the **.arg** file.
    Issue the following command to log in to Docker Hub. Provide your Docker ID and password when prompted.
    <br />

```bash
docker login
```

```hideClipboard bash
# Output
Login Succeeded
```

{" "}

<br />

17. Use the following commands to push the provider images to the Docker Hub image registry you specified. Replace the
    `[DOCKER-ID]` and version numbers in the command below with your Docker ID and respective Kubernetes versions that
    the utility created.
    <br />

```bash
docker push docker.io/[DOCKER-ID]/opensuse-leap:k3s-1.25.2-v3.4.3-palette-learn
docker push docker.io/[DOCKER-ID]/opensuse-leap:k3s-1.24.6-v3.4.3-palette-learn
```

{" "}

<br />

18. After pushing the provider images to the image registry, open a web browser and log in to
    [Palette](https://console.spectrocloud.com). Ensure you are in the **Default** project scope before creating a
    cluster profile.

19. Navigate to the left **Main Menu** and select **Profiles**. Click on the **Add Cluster Profile** button, and fill
    out the required basic information fields to create a cluster profile for Edge.

20. Add the following [BYOS Edge OS](../../../integrations/byoos.md) pack to the OS layer in the **Profile Layers**
    section.

| **Pack Type** | **Registry** | **Pack Name** | **Pack Version** |
| ------------- | ------------ | ------------- | ---------------- |
| OS            | Public Repo  | BYOS Edge OS  | `1.0.0`          |

21. Replace the the cluster profile's BYOOS pack manifest with the following custom manifest so that the cluster profile
    can pull the provider image from the ttl.sh image registry.

The `system.xxxxx` attribute values below refer to the arguments defined in the **.arg** file. If you modified the
arguments in the **.arg** file, you must modify the attribute values below accordingly.

{" "}

<br />

```yaml
pack:
  content:
    images:
      - image: "{{.spectro.pack.edge-native-byoi.options.system.uri}}"
options:
  system.uri:
    "{{ .spectro.pack.edge-native-byoi.options.system.registry }}/{{ .spectro.pack.edge-native-byoi.options.system.repo
    }}:{{ .spectro.pack.edge-native-byoi.options.system.k8sDistribution }}-{{ .spectro.system.kubernetes.version }}-{{
    .spectro.pack.edge-native-byoi.options.system.peVersion }}-{{
    .spectro.pack.edge-native-byoi.options.system.customTag }}"
  system.registry: docker.io/spectrocloud
  system.repo: opensuse-leap
  system.k8sDistribution: k3s
  system.osName: opensuse-leap
  system.peVersion: v3.4.3
  system.customTag: palette-learn
```

The screenshot below displays how to reference a provider image in the BYOOS pack of your cluster profile.

![Screenshot of a sample cluster profile's OS layer ](/tutorials/palette-canvos/clusters_edge_palette-canvos_edit_profile.png)

{" "}

<br />

:::info

The BYOOS pack's `system.uri` attribute references the Kubernetes version selected in the cluster profile by using the
`{{ .spectro.system.kubernetes.version }}` [macro](../../cluster-management/macros.md). This is how the provider images
you created and pushed to a registry are tied to the OS and Kubernetes version you selected in the **.arg** file.

:::

22. Add the following **Palette Optimized K3s** pack to the Kubernetes layer of your cluster profile. Select the k3s
    version 1.25.x because earlier in this how-to guide, you pushed a provider image compatible with k3s v1.25.2 to the
    ttl.sh image registry.

| **Pack Type** | **Registry** | **Pack Name**         | **Pack Version** |
| ------------- | ------------ | --------------------- | ---------------- |
| Kubernetes    | Public Repo  | Palette Optimized k3s | `1.25.x`         |

23. Add the network layer to your cluster profile, and choose a Container Network Interface (CNI) pack that best fits
    your needs, such as Calico, Flannel, Cilium, or Custom CNI. For example, you can add the following network layer.
    This step completes the core infrastructure layers in the cluster profile.

| **Pack Type** | **Registry** | **Pack Name** | **Pack Version** |
| ------------- | ------------ | ------------- | ---------------- |
| Network       | Public Repo  | Calico        | `3.25.x`         |

24. Add add-on layers and manifests to your cluster profile per your requirements.

25. If there are no errors or compatibility issues, Palette displays the newly created complete cluster profile for
    review. Verify the layers you added, and finish creating the cluster profile.
    <br />

### Validate

List the Edge installer ISO image and checksum by issuing the following command from the **CanvOS/** directory.

<br />

```shell
ls build/
```

```hideClipboard shell
# Output
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

<br />

- [Deploy an Edge Cluster on VMware](../site-deployment/deploy-cluster.md)

- [Prepare Edge Host for Installation](../site-deployment/stage.md)
