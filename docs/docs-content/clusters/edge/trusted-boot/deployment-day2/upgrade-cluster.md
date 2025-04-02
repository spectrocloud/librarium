---
sidebar_label: "Update Cluster"
title: "Update Cluster with Trusted Boot"
description: "Learn about Trusted Boot."
hide_table_of_contents: false
sidebar_position: 60
tags: ["edge"]
---

If you need to make changes to a deployed Edge cluster with Trusted Boot enabled without modifying the Operating System
(OS) or the Kubernetes layer, you can follow the regular cluster upgrade process. Refer to
[Update a Cluster](../../../cluster-management/cluster-updates.md) for more information. However, if the change you are
making involves the OS layer or the Kubernetes layer, you will need to build a new provider image with the same Trusted
Boot keys you used to build the Edge Installer ISO.

This page guides you through the process of making an update to a cluster that involves the OS or Kubernetes layer of
the cluster.

## Limitation

- Palette does not stop the upgrade if the provider image that is not recognized by secure boot. If you upgrade to using
  an unrecognized image, you will receive a secure boot violation. This will require you to choose the recovery option
  from the GRand Unified Bootloader (GRUB) menu to return the Edge host to boot using the previous image or reinstall
  Palette Edge.

## Prerequisites

- You have built an Edge Installer ISO with Trusted Boot enabled and used the ISO to deploy a cluster. The Edge hosts
  have keys enrolled.

- You have access to the original keys that were used to build the original ISO and provider images. Refer to
  [Build Edge Installer ISO with Trusted Boot](../edgeforge/build-trusted-iso.md) for details.

- The machine used to build the provider image must meet the minimum hardware requirements:

  - 4 CPU
  - 32 GB RAM
  - 150 GB storage

- [Git](https://www.git-scm.com/downloads). You can ensure git installation by issuing the git --version command.

## Instructions

1. If you have access to the original **CanvOS** folder where they provider images were made, and all the necessary keys
   are available to you in their original folders, skip to step 5.

2. Check out the [CanvOS](https://github.com/spectrocloud/CanvOS) GitHub repository containing the starter code.

   ```bash
   git clone https://github.com/spectrocloud/CanvOS.git
   ```

3. Change to the **CanvOS/** directory.

   ```bash
   cd CanvOS
   ```

4. View the available [git tag](https://github.com/spectrocloud/CanvOS/tags).

   ```bash
   git tag
   ```

5. Check out the newest available tag. This guide uses the tag **v4.4.0** as an example.

   ```shell
   git checkout v4.4.0
   ```

6. Move all keys into folders where they are expected. Ensure all keys that were used to build the ISO are present in
   the **secure-boot** folder. The following files and folder structure are expected with the following file
   permissions.

   ```shell
   ls -llR secure-boot/
   ```

   ```shell hideClipboard
   secure-boot/:
   total 16
   drwx------ 2 ubuntu ubuntu 4096 Apr 24 21:08 enrollment
   drwxrwxr-x 2 ubuntu ubuntu 4096 May 13 21:25 exported-keys
   drwxr-xr-x 2 ubuntu ubuntu 4096 Jun  3 21:34 private-keys
   drwxr-xr-x 2 ubuntu ubuntu 4096 Apr 24 21:08 public-keys

   secure-boot/enrollment:
   total 48
   -rw-r--r-- 1 ubuntu ubuntu 3666 Apr 24 21:08 KEK.auth
   -rw-r--r-- 1 ubuntu ubuntu 2283 Apr 24 21:08 KEK.der
   -rw-r--r-- 1 ubuntu ubuntu 2371 Apr 24 21:08 KEK.esl
   -rw-r--r-- 1 ubuntu ubuntu 2106 Apr 24 21:08 PK.auth
   -rw-r--r-- 1 ubuntu ubuntu  767 Apr 24 21:08 PK.der
   -rw-r--r-- 1 ubuntu ubuntu  811 Apr 24 21:08 PK.esl
   -rw-r--r-- 1 ubuntu ubuntu 6474 Apr 24 21:08 db.auth
   -rw-r--r-- 1 ubuntu ubuntu 5003 Apr 24 21:08 db.der
   -rw-r--r-- 1 ubuntu ubuntu 5179 Apr 24 21:08 db.esl

   secure-boot/exported-keys:
   total 12
   -rw------- 1 root root 1560 May 13 21:25 KEK
   -rw------- 1 root root 4368 May 13 21:25 db

   secure-boot/private-keys:
   total 16
   -rw------- 1 ubuntu ubuntu 1704 Apr 24 21:08 db.key
   -rw------- 1 ubuntu ubuntu 1675 Apr 24 21:08 tpm2-pcr-private.pem

   secure-boot/public-keys:
   total 12
   -rw-r--r-- 1 ubuntu ubuntu 1094 Apr 24 21:08 KEK.pem
   -rw-r--r-- 1 ubuntu ubuntu 1094 Apr 24 21:08 PK.pem
   -rw-r--r-- 1 ubuntu ubuntu 1094 Apr 24 21:08 db.pem
   ```

   :::warning

   Ensure that the keys in the **secure-boot** folder contains all the keys that were used to produce the ISO, including
   the keys in each subdirectory. If you are missing any of the keys, your Edge host will either not be able to boot, or
   not be able to access any data in the persistent partitions.

   :::

7. Edit the **.arg** file to make changes to the OS or Kubernetes layer. Refer to
   [EdgeForge Build Configurations](../../edgeforge-workflow/palette-canvos/arg.md) for more information.

   In particular, pay attention to the following arguments.

   | **Argument**       | **Description**                                                                                       | **Allowed Values**                   |
   | ------------------ | ----------------------------------------------------------------------------------------------------- | ------------------------------------ |
   | `IS_UKI`           | Determines whether to build a provider image that supports Trusted Boot. You must set this to `true`. | `true`, `false`. Default is `false`. |
   | `K8S_DISTRIBUTION` | Kubernetes distribution.                                                                              | `rke2`                               |
   | `OS_DISTRIBUTION`  | OS distribution.                                                                                      | `ubuntu`                             |
   | `OS_VERSION`       | OS version. This applies to Ubuntu only.                                                              | `23.10`                              |

8. Issue the following command to build the provider image.

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

9. Issue the following command to push the image to the repository you specified in **.arg**. Replace `IMAGE-TAG` with
   the tag of the provider image you just built. Depending on the repository you used, you may be required to
   authenticate yourself before pushing to the repository.

   ```shell
   docker push [IMAGE-TAG]
   ```

10. Update the cluster profile to use the new provider image you have built. For more information, refer to
    [Update a Cluster](../../../cluster-management/cluster-updates.md).

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Cluster**.

3. Validate that the new provider image is being used examining the OS and Kubernetes version of the cluster.
