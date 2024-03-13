---
sidebar_label: "Build Installer ISO"
title: "Build Installer ISO"
description: "Learn how to build the Palette Edge Installer ISO using the EdgeForge utilities."
icon: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["edge"]
---

The Edge Installer ISO is a file that bootstraps the installation and is created in the EdgeForge process. The ISO image
contains the Edge Installer that installs the Palette Edge host agent and metadata to perform the initial installation.

:::info

The Edge Installer ISO is one of the critical artifacts you need to build during EdgeForge. The other artifact is
provider images. Both are required for Edge deployment. For education purposes, we provide separate instructions for
building the installer ISO and the provider images. However, these two artifacts are often built together in a single
step in practice. Refer to [Build Edge Artifacts](palette-canvos.md) for an how-to that covers how to build both
artifacts at the same time.

:::

You can build the following content into the Edge installer ISO to customize your installation:

- User data. This is a YAML file that contains the configuration for the Edge Installer. For all available configuration
  options, refer to [Installer Configuration](../../edge-configuration/installer-reference.md). User data is required
  for the installer ISO.
  - If you do not include the user data file during the Edge Installer ISO build process, you must provide this
    configuration before the installation takes place with site user data. For more information, refer to
    [Apply Site User Data](../../site-deployment/site-installation/site-user-data.md).
- Content bundles. This is an archive of all images, Helm charts and packs used for any number of specified cluster
  profiles. Content bundles are optional to include in an installer ISO.
- Cluster definition (Tech Preview). Cluster definitions contains cluster profiles and any profile variables used in the
  profiles. When you include a cluster definition during the Edge Installer ISO build process, you can create a new
  cluster that uses your imported cluster definition in your Edge host using the local UI. Cluster definitions are
  optional to include in an installer ISO.

  :::preview

  :::

The benefits of building the installer configuration, content bundles, and cluster definition into the installer ISO is
that you can ensure the standardization of your Edge deployments through the installer. Whether you build the content
into the installer ISO or not, you always have the option of uploading them or changing them later in the deployment
process.

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

## Instructions

Use the following instructions to build the Edge Installer ISO. The optional steps can be completed any order.

### Clone EdgeForge Repository

1. Clone the **CanvOS** repository.

   ```shell
    git clone https://github.com/spectrocloud/CanvOS.git
   ```

2. Change to the **CanvOS/** directory.

   ```shell
   cd CanvOS
   ```

3. View the available git tag.

   ```shell
   git tag
   ```

4. Check out the latest available tag. This guide uses the tag v4.3.0 as an example.

   ```
   git checkout v4.3.0
   ```

### Prepare **.arg** file

5. Review the **.arg.template** file to view a template of all the arguments that are used during the build process.
   Since the process to build provider images uses the same **.arg** file, some of the arguments in the template are
   related to the provider images. The following is a table of all the arguments in that can be used in the file:

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

6. Customize these arguments to use during the build process. The following is an example **.arg** file.

   ```
   CUSTOM_TAG=palette-learn
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

### Prepare User Data

7. Refer to [Prepare User Data](./../prepare-user-data.md) to prepare the **user-data** file in the root directory of
   the **CanvOS** directory.

   User data contains installer configuration and is required for an installer ISO. If you do not supply user data
   during this step, you must provide site user data before installation takes place. You can also use site user data to
   override or supplement configuration you provided to the installer ISO. For more information, refer to
   [Apply Site User Data](../../site-deployment/site-installation/site-user-data.md).

### Build Content Bundle

Optionally, you can include a content bundle in your Edge installer ISO. When you include a content bundle in your Edge
Installer ISO, you can provision a cluster using the images in your content bundle without connections to an external
image registry.

If you do not include content bundle in your Edge Installer ISO, you can still build content bundles and upload them to
a disconnected Edge host instance via the [local UI](../../local-ui/local-ui.md). For more information, refer to
[Upload Content Bundle](../../local-ui/cluster-management/upload-content-bundle.md).

8. Refer to [Build Content Bundle](../build-content-bundle.md) to learn how to build content bundles for your ISO image.
   Since you are including the content bundle in the Installer ISO, you should choose either the zst format or the tar
   format for the content bundle. Do not build the content bundle as an ISO image.

9. When the content bundle build finishes, the output will be in a directory named **content-XXXXXX**, where XXXXXX is a
   random alphanumerical string. Inside the directory is the content bundle file.

10. Place the directory containing the content bundle file in the root directory of the **CanvOS** directory.

### Prepare Cluster Definition (Tech Preview)

Optionally, you can include a cluster definition in your Edge Installer ISO. Cluster definitions include one or more
cluster profile and any dynamic values used in the cluster profiles. Cluster definitions can be exported from an Palette
API endpoint.

If you do not include cluster definitions in your Edge Installer ISO, you can still import the cluster definition from
the local UI once you finish installing Palette on the Edge host.

11. Refer to [Export Cluster Definition](../../local-ui/cluster-management/export-cluster-definition.md) to learn how to
    export cluster definitions.

12. Put the cluster definition tgz file in the **CanvOS/** directory.

13. In the **.arg** file, add an argument `CLUSTERCONFIG` and set it to the name of the cluster configuration file. For
    example:

    ```
    CLUSTERCONFIG=demo-cluster-65cbe80213d15e81c308748b.tgz
    ```

### Build Edge Installer ISO

14. Ensure that all components of the ISO you want to include are in the **CanvOS/** directory:

    - **.args** file: **CanvOS/.args**
    - User data: **CanvOS/user-data**
    - Content bundle: **CanvOS/content-XXXXX/core-spectro-content**
    - Cluster definition: **CanvOS/cluster-name-XXXX.tgz**

15. Issue the following command to build the ISO image.

    ```shell
    ./earthly.sh +iso
    ```

    ```
    # Output condensed for readability
    ===================== Earthly Build SUCCESS =====================
    Share your logs with an Earthly account (experimental)! Register for one at https://ci.earthly.dev.
    ```

    When the build finishes, the ISO image can be found in the **build/** folder.

## Validate

You can validate that the ISO image has not been corrupted by attempting to flash a bootable device. Most software that
creates a bootable device will validate the ISO image before the flash process.
