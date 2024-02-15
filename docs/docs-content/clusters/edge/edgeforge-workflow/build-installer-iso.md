---
sidebar_label: "Build Installer ISO"
title: "Build Installer ISO"
description: "Learn how to build the Palette Edge Installer ISO using the EdgeForge utilities."
icon: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["edge"]
---

The Edge Installer ISO is an ISO file that bootstraps the installation is created in the EdgeForge process. The ISO
image contains the Edge Installer that installs the Palette Edge host agent and metadata to perform the initial
installation.

Optionally, you can build the following content into the Edge installer ISO to customize your installation:

- User data. This is a YAML files that contains all configurations for the Edge Installer. For all available
  configuration options, refer to [Installer Configuration](../edge-configuration/installer-reference.md).
  - If you do not include the user data file during the Edge Installer ISO build process, you must provide this
    configuration before the installation takes place with site user data. For more information, refer to
    [Apply Site User Data](../site-deployment/site-installation/site-user-data.md).
- Content bundles. This is an archive of all images, helm charts and packs used for any number of specified cluster
  profiles.
- Cluster definition (Tech Preview). Cluster definitions contains cluster profiles and any profile variables used in the
  profiles. When you include a cluster definition during the Edge Installer ISO build process, you can create a new
  cluster that uses your imported cluster definition in your Edge host using the Edge Management Console (EMC).

:::preview

EMC, profile variables, and incorporating cluster definitions into your Edge Installer ISO are all Tech Preview features
and should not be used in production workloads.

:::

The benefits of building the above content into the ISO is that you can ensure the standardization of your Edge
deployments through the installer. Whether you build the content into the installer ISO or not, you always have the
option of uploading them or changing them later in the deployment process.

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

### Prepare User Data (Optional)

Refer to [Prepare User Data](./prepare-user-data.md) to prepare the **user-data** file in the root directory of the
**CanvOS** directory.

It is optional to build user data into the Edge Installer ISO. However, if you do not supply user data during this step,
you must provide site user data before installation takes place. For more information, refer to
[Apply Site User Data](../site-deployment/site-installation/site-user-data.md).

### Build Content Bundle (Optional)

Optionally, you can include a content bundle in your Edge installer ISO. When you include a content bundle in your Edge
Installer ISO, you can provision a cluster using the images in your content bundle without connections to an external
image registry.

If you do not include content bundle in your Edge Installer ISO, you can still build content bundles and upload them to
a disconnected Edge host instance via the Edge Management Console. For more information, refer to
[Upload Content Bundle](../edge-host-management/upload-content-bundle.md).

1. Refer to [Build Content Bundle](./build-content-bundle.md) to learn how to build content bundles for your ISO image.

2. After you build the content bundle, place the content bundle tar file in the root directory of the CanvOS repository.

### Prepare Cluster Definition (Optional)

Optionally, you can include a cluster definition in your Edge Installer ISO. Cluster definitions include the cluster
profile and any dynamic values used in the cluster profile. Cluster definitions can be exported from an existing Palette
cluster or from the download cluster definition API. When you include a cluster definition in the Edge Installer ISO,
you can provision a cluster using the cluster definition without having to reconfigure your cluster.

If you do not include cluster definitions in your Edge Installer ISO, you can still import the cluster definition from
the Edge Management Console once you finish installing the Edge host.

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click **Clusters**.

3. Select the cluster whose cluster definition you want to use for your Edge cluster.

4. Click the **Settings** button under the upper-right **User Menu**, and select **Download Cluster Configuration**.

5. Place the cluster definition tgz file in the root directory of the **CanvOS** repository.

6. Add the following lines to the **.arg** file. Replace `cluster-definition-file-name` the name of the cluster
   definition tgz file.

   ```
    CLUSTERCONFIG=cluster-definition-file-name
   ```

### Build Edge Installer ISO

1. Ensure that all components of the ISO you want to include are in the **CanvOS/** directory.

2. Issue the following command to build the ISO image.

   ```shell
    ./earthly.sh +iso
   ```

## Validate

You can validate that the ISO image has not been corrupted by attempting to flash a bootable device. Most software that
creates a bootable device will validate the ISO image before the flash process.
