---
sidebar_label: "Build Images"
title: "Build Images"
description: "Learn about building your eterprise edge artifacts"
hide_table_of_contents: false
---

# Overview

You can use the Palette Edge CLI to create an Edge artifact. The Edge artifacts will include everything you may have
created up to this point.

<br />

- Bring Your Own Operating System (BYOOS)

- Content Bundle

- User Data

![A diagram that illustrates the mentioned pieces making up an Edge artifact created by the Palette Edge CLI](/clusters_edge-forge-workflow_build-images_edge-artifact-result.png)

Use the following steps to create an Edge artifact for your Edge host.

# Prerequisites

- Linux Machine (Physical or VM) with an AMD64 architecture.

- 8 CPU

- 16 GB Memory

- 150 GB Storage

  If you experience disk space constraints on the machine where images are built, you can remove unnecessary Docker
  images and volumes. Or start the process on a machine with more storage allocated.

- Access to a container registry with permission to push container images. For guidance on logging in, review the
  registry login instructions for your respective registry. With docker, use the `docker login` command to log in to the
  registry.

# Create Artifact

Choose the workflow that fits your needs.

<br />

1. Download the Palette Edge CLI and assign the executable bit.

   <br />

   ```shell
   VERSION=3.4.3
   wget https://software.spectrocloud.com/stylus/v$VERSION/cli/linux/palette-edge
   chmod +x palette-edge
   ```

2. Issue the `show` command to review the list of options for Operating System (OS) distribution and versions,
   Kubernetes distributions and versions, the Spectro Agent Version, and Kairos version.

   <br />

   ```shell
   ./palette-edge show
   ```

   ![CLI example output from the show command](/clusters_edge-forge-workflow_build-images_edge-cli-show.png)

   <br />

   The Kubernetes distribution and versions you choose must be available in the list displayed. We will continuously
   release newer versions of Kubernetes as part of our release cycle. If you decide to use your custom OS, you must
   build a Kairos image from the OS you used in the
   [Bring Your Own OS](/clusters/edge/edgeforge-workflow/build-kairos-os) guide. Typically, you will keep the Spectro
   Agent and Kairos versions the same.

3. Use the `generate` command to create an image scaffolding by providing your choice of OS and Kubernetes distribution.
   There are several CLI flags you can specify to the `generate` command. The following flags are the most common.

| Parameter                 | Description                                                                              |
| ------------------------- | ---------------------------------------------------------------------------------------- |
| `--os-flavor`             | OS flavor.                                                                               |
| `--k8s-flavor`            | Kubernetes flavor.                                                                       |
| `--output`                | Directory for generating build files.                                                    |
| `--push-image-repository` | Repository for generated container images.                                               |
| `--content-path`          | Optional location of the content bundle if you preload content.                          |
| `--cache-provider-images` | Additional flag to preload generated provider images into the installer ISO.             |
| `--cloud-init-file`       | Specify the Edge Installer configuration user data file to include in the Edge artifact. |

<br />
:::info

When using the `generate` command, the specified registry is where Edge artifacts will be uploaded.

:::

```shell
 ./palette-edge generate --os-flavor [pick-os] \
 --k8s-flavor [pick-k8s] \
 --output [output directory] \
 --push-image-repository [your registry path] \
 --content-path [path to content bundle, if applicable] \
 --cache-provider-images
```

In this example, an `OpenSuse` + `k3s` image using the upstream Kairos `opensuse-leap` images is selected. The
scaffolding image will also get published to a target repo `gcr.io/my-registry` and will include a content bundle. The
`generate` command would look similar to the following.

Example:

```shell
 ./palette-edge generate --os-flavor opensuse-leap \
 --k8s-flavor k3s \
 --output opensuse-k3s \
 --push-image-repository gcr.io/my-registry \
 --content-path /temp/bundles/content-c59a5a88/spectro-content-c59a5a88.zst \
 --cache-provider-images
```

Output:

```shell
INFO  Creating directory  opensuse-k3s
INFO  Created scaffolding directory structure under directory opensuse-k3s with the following parameters
┌───────────────────────────────────────────────────────────────────────────┐
| Spectro Agent Version | v0.0.0-d155796                                    |
| Base Image            | quay.io/kairos/core-opensuse-leap:v1.5.0          |
| K8S Flavor            | k3s                                               |
| K8S Versions          | 1.25.2-k3s1,1.24.6-k3s1,1.23.12-k3s1,1.22.15-k3s1 |
| Push Image Repository | gcr.io/spectro-testing                            |
| Kairos Version        | v1.5.0                                            |
└───────────────────────────────────────────────────────────────────────────┘
To build an installer iso and target docker images for
various versions supported, run the 'build.sh' in the
'opensuse-k3s' directory. For any customizations to made to
all the generated images e.g adding packages, edit the
'images/Dockerfile' as needed before running
'build.sh'.Files to be copied to the target images can be
places under 'overlay/files' and files for the iso only can
be placed under 'overlay/files-iso
```

For custom images use the `--base-image-uri` flag and specify the path to the custom image.

Example:

```shell
 ./palette-edge generate \
 --base-image-uri quay.io/kairos/core-rockylinux:v1.5.0 \
 --k8s-flavor k3s \
 --output rockylinux-k3s \
 --push-image-repository gcr.io/my-registry
```

4. Review the content of the output directory you specified using `--output` flag. The output directory structure
   contains the following files.

<br />

![The output directory content in a tree diagram](/clusters_edge-forge-workflow_build-images_edge-cli-output.png)

5. Navigate to the output directory and review the file **.VERSIONS.env**. Set the variable `PUSH_BUILD` to `true` so
   that the Edge provider images and the Edge Installer image get pushed to your image registry. The alternative is to
   manually push all the images after the image creation process completes.

6. Before you start the build script, you can make changes to customize your build. Review the use cases below to learn
   more about customization options.

| Use case                                                                     | Description                                                                                                                                                                                                                         |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Modifying/controlling Kubernetes versions and flavors                        | You can update the .versions.env file or specify the versions and flavors as arguments to the build command.                                                                                                                        |
| Adding custom packages to target OS images                                   | Edit the **Dockerfile** of the respective OS images to add the install commands using `apt-get` or `zypper`.                                                                                                                        |
| Adding custom files or directories into Kubernetes provider container images | Add the custom files or directories in the **overlay/files/** folder. The files directory is copied directly under the _/_ folder in the target image.                                                                              |
| Adding custom content to Edge Install installer ISO                          | Place the custom content in the **overlay/files-iso** directory. To embed a content bundle, place it under the **overlay/files-iso/opt/spectrocloud/content** folder. This limits the scope to only the Edge Install installer ISO. |

7. Navigate to your output directory and issue the following command to build your Edge images. This command will take a
   few minutes to complete.

<br />

```shell
./build.sh
```

The following images are generated by the build script.

    <br />

    - Edge Installer ISO image.
    <br />

    - Edge Host container image containing the Palette Edge Host Agent.
    <br />

    - Kubernetes Provider container images.

<br />

8. Locate your ISO file in the output directory. The ISO file's default name is **spectro-edge-installer.iso** but it
   may be different if you used the `--iso-name` CLI flag.

Using a bootable USB drive, PXE server, or other means, mount the ISO to the primary drive of the Edge host. The
installer flashes to the Edge host's hard disk, and the host will shut down. The Edge host is now ready to be shipped to
the edge location.

<br />

:::info

You can use several software tools to create a bootable USB drive, such as [balenaEtcher](https://www.balena.io/etcher).
For a PXE server, there are open-source projects such as [Fog](https://fogproject.org/download) or
[Windows Deployment Services](https://learn.microsoft.com/en-us/windows/deployment/wds-boot-support) for Windows.

:::

# Validate

1. In the build server, validate the output directory containing the ISO file.

2. You can validate that the ISO image is not corrupted and is valid by attempting to flash a bootable device. Most
   software that creates a bootable device will validate the ISO image before the flash process.

3. You can validate that the Edge host is ready for the site installation by simulating a site deployment on one of the
   Edge hosts. The simulation process will require you to complete the installation process and reset the device after
   the validation.

# Next Steps

You now have an Edge artifact that you can use to create an Edge host. You can start the site deployment process. Check
out the [Site Deployment](/clusters/edge/site-deployment) resource to learn more about the Site Deployment process.
