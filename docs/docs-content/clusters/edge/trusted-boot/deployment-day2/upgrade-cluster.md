---
sidebar_label: "Update Cluster"
title: "Update Cluster with Trusted Boot"
description: "Learn about Trusted Boot."
hide_table_of_contents: false
sidebar_position: 60
tags: ["edge"]
---

If you need to make changes to a deployed Edge cluster with Trusted Boot enabled without touching the OS or the
Kubernetes layer, you can follow the regular cluster upgrade process. Refer to
[Update a Cluster](/docs/docs-content/clusters/cluster-management/cluster-updates.md) for more information. However, if
the change you are making involves the Operating System (OS) layer and the Kubernetes layer, you will need to build a
new provider image with the same Trusted Boot keys you used to build the Edge Installer ISO.

This page guides you through the process of making an update to a cluster that involves the Operating System (OS) or
Kubernetes layer of the cluster.

## Prerequisites

- You have built an Edge Installer ISO with Trusted Boot enabled and used the ISO to deploy a cluster. The Edge hosts
  have keys enrolled.

- You have access to the original keys that were used to build the original ISO and provider images. Refer to
  [Build Edge Installer ISO with Trusted Boot](../edgeforge/build-trusted-iso.md) for details.

- The machine used to build the provider image must meet the minimum hardware requirements:

  - 4 CPUs
  - 32 GB RAM
  - 100 GB storage

:::warning

Ensure that the keys in the **secure-boot** folder contains all the keys that were used to produce the ISO, including
the keys in each subdirectory. If you are missing any of the keys, your Edge host will either not be able to boot, or
not be able to access any data in the persistent partitions.

:::

## Instructions

### Build New Provider Image

1. Change into the **CanvOS** folder where the Edge Installer ISO was built.

2. Ensure all keys that were used to build the ISO are present in the **secure-boot** folder.

3. Edit the **.arg** file to make changes to the OS or Kubernetes layer. Refer to
   [EdgeForge Build Configurations](../../edgeforge-workflow/palette-canvos/arg.md) for more information.

   In particular, pay attention to the following arguments.

   | **Argument**       | **Description**                                                                                       | **Allowed Values**                         |
   | ------------------ | ----------------------------------------------------------------------------------------------------- | ------------------------------------------ |
   | `IS_UKI`           | Determines whether to build a provider image that supports Trusted Boot. You must set this to `true`. | `true`, `false`. Default is `false`.       |
   | `K8S_DISTRIBUTION` | Kubernetes distribution.                                                                              | ` k3s`, `rke2`, `kubeadm`, `kubeadm-fips`. |
   | `OS_DISTRIBUTION`  | OS distribution.                                                                                      | `ubuntu`, `opensuse-leap`, `rhel`.         |
   | `OS_VERSION`       | OS version. This applies to Ubuntu only.                                                              | `20`, `22`.                                |

4. Issue the following command to build the provider image.

   ```shell
   ./earthly.sh +build-provider-images
   ```

   ```hideClipboard bash
   # Output condensed for readability
   ===================== Earthly Build SUCCESS =====================
   Share your logs with an Earthly account (experimental)! Register for one at https://ci.earthly.dev.
   ```

   You should also receive an output from the build command that contains the OS layer of your cluster profile. Copy and
   save it during the later steps.

5. Issue the following command to push the image to the repository you specified in **.arg**. Replace `IMAGE-TAG` with
   the tag of the provider image you just built.

   ```shell
   docker push [IMAGE-TAG]
   ```

6. Update the cluster profile to use the new provider image you have built. For more information, refer to
   [Update a Cluster](../../../cluster-management/cluster-updates.md).

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Cluster**.

3. Validate that the new provider image is being used examining the OS and Kubernetes version of the cluster.
