---
sidebar_label: "Build Edge Installer ISO"
title: "Build Edge Installer ISO with Trusted Boot"
description: "Learn about how to build Edge Installer ISO for Trusted Boot."
hide_table_of_contents: false
sidebar_position: 20
tags: ["edge"]
---

This document guides you through the process of producing Edge Installer ISOs that are secured by Trusted Boot.

## Limitation

- Trusted Boot is only supported for clusters with a connection to a Palette instance. Therefore, you cannot set
  `managementMode` to `local` in the `user-data` file.

## Prerequisites

- A physical or virtual Linux machine with _AMD64_ (also known as x86_64) processor architecture to build the Edge
  artifacts. You can issue the following command in the terminal to check your processor architecture.

  ```bash
  uname -m
  ```

- Minimum hardware configuration of the Linux machine:

  - 4 CPU
  - 32 GB memory
  - 100 GB storage

- You have generated secure boot keys in the **secure-boot/enrollment** folder.
- Both the **db.key** file and the **tpm2-pcr-private.pem** file are located in the **CanvOS/secure-boot/private-keys**
  directory. For more information, refer to [Generate Trusted Boot Keys](../keys/generate-keys.md).

- Familiarity with the [EdgeForge Workflow](../../edgeforge-workflow/edgeforge-workflow.md).

- [Git](https://www.git-scm.com/downloads). You can ensure git installation by issuing the git --version command.

- Palette registration token for pairing Edge hosts with Palette. You will need tenant admin access to Palette to
  generate a new registration token. For detailed instructions, refer to the
  [Create Registration Token](../../site-deployment/site-installation/create-registration-token.md) guide.

## Instructions

<PartialsComponent category="palette-edge-canvos-version" name="canvos-version" />

5. If you are using a self-hosted instance of Palette and have determined a specific CanvOS version, check out the
   corresponding tag.

   Otherwise, check out the newest available tag. This guide uses `v4.4.0` tag as an example.

   ```shell
   git checkout v4.4.0
   ```

6. Create a file named `.arg`. You can use the `.arg.template` file in the repository as a starting point. Refer to
   [Edge Artifact Build Configurations](../../edgeforge-workflow/palette-canvos/arg.md) for available configuration
   parameters.

   To build an ISO image that supports Trusted Boot, include the following parameters in the **.arg** file.

   ```
   OS_DISTRIBUTION=ubuntu
   OS_VERSION=23.10
   IS_UKI=true
   AUTO_ENROLL_SECUREBOOT_KEYS=true
   ```

   :::info

   It is not necessary to include `AUTO_ENROLL_SECUREBOOT_KEYS=true`. If you do not include it, you will need to
   manually confirm the enrollment of the keys during install time. For more information, refer to
   [Installation with Trusted Boot](..//deployment-day2/install.md).

   :::

7. Create a file named `user-data`. You can use the `user-data.template` file in the repository as a starting point.
   This is the file with which you can configure the Edge installer. Refer to
   [Edge Installer Configuration](../../edge-configuration/installer-reference.md) for available configuration
   parameters.

   :::warning

   Ensure you have generated the Trusted Boot keys in the **secure-boot/enrollment** folder before proceeding to the
   next step. If you build an ISO without the keys in the folder, the key enrollment will not happen. For more
   information, refer to [Generate Trusted Boot Keys](../keys/generate-keys.md).

   :::

8. Customize the `Dockerfile`. You can install tools and dependencies and configure the image to meet your needs. Add
   your customizations below the line tagged with the `Add any other image customizations here` comment in the
   Dockerfile. Do not edit or add any lines before this tagged comment. For example, you can add the following line to
   the `Dockerfile` to install WireGuard.

   ```dockerfile
   ...
   ###########################Add any other image customizations here #######################

   RUN sudo zypper refresh && sudo zypper install --non-interactive wireguard-tools
   ```

   :::warning

   Adding software dependencies in the Dockerfile will cause the size of the Extensible Firmware Interface (EFI) file to
   grow. Most hardware has a limit on the size of the EFI that it can boot. Make sure you do not include too many
   dependencies that can cause the EFI file to grow larger than the boot limit. For more information, refer to
   [Check EFI Boot Limit](./check-efi-limit.md).

   Instead of adding software packages through the Dockerfile to the OS layer, you can add compiled static binaries to
   the persistent partition instead, which does not increase the size of the EFI file. Refer to
   [Add Static Binaries to Persistent Partition](./add-extra-content.md) for more information.

   :::

9. Issue the following command to build the ISO image.

   ```shell
   ./earthly.sh +iso
   ```

## Validate

List the Edge installer ISO image and checksum by issuing the following command from the **CanvOS/** directory.

```shell
ls build/
```

```text
kairos_uki_v3.0.4-2-g3fba4f4.tar  kairos_v3.0.4-2-g3fba4f4.iso
```

You can validate the ISO image by creating a bootable USB flash drive using any third-party software and attempting to
flash a bare host machine. Most software that creates a bootable USB drive will validate the ISO image. Here, the flash
process means installing the necessary tools and configurations on a host machine.
