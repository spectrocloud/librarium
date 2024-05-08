---
sidebar_label: "Build Edge Installer ISO"
title: "Build Edge Installer ISO with Trusted Boot"
description: "Learn about how to build Edge Installer ISO for Trusted Boot."
hide_table_of_contents: false
sidebar_position: 20
tags: ["edge"]
---

This document guides you through the process of producing Edge Installer ISO that are secured by Trusted Boot.

## Prerequisites

- A physical or virtual Linux machine with _AMD64_ (also known as x86_64) processor architecture to build the Edge
  artifacts. You can issue the following command in the terminal to check your processor architecture.

  ```bash
  uname -m
  ```

- Minimum hardware configuration of the Linux machine:

  - 4 CPU
  - 32 GB memory
  - 50 GB storage

- You have generated secure boot keys in the **secure-boot/enrollment** folder.
- Both the **db.key** file and the **tpm2-pcr-private.pem** file are located in the **CanvOS/secure-boot/private-keys**
  directory.

- Familiarity with the [EdgeForge Workflow](../edgeforge-workflow/).

## Build Edge Installer ISO with Trusted Boot

1. Check out the [CanvOS](https://github.com/spectrocloud/CanvOS.git) GitHub repository containing the starter code.

   ```bash
   git clone https://github.com/spectrocloud/CanvOS.git
   ```

2. Change to the **CanvOS/** directory.

   ```bash
   cd CanvOS
   ```

3. View the available [git tag](https://github.com/spectrocloud/CanvOS/tags).

   ```bash
   git tag
   ```

4. Check out the newest available tag. This guide uses **v4.4.0** tag as an example.

   ```shell
   git checkout v4.4.0
   ```

5. Create a file named **.arg**. Refer to
   [Edge Artifact Build Configurations](../edgeforge-workflow/palette-canvos/arg.md) for available configuration
   parameters.

   To build an ISO image that supports Trusted Boot, you need to include the following parameters in the **.arg** file:

   ```
   IS_UKI=true
   UKI_SELF_SIGNED_KEYS=false
   AUTO_ENROLL_SECUREBOOT_KEYS=true
   ```

6. Create a file named **user-data**. This is the file with which you can configure the Edge installer. Refer to
   [Edge Installer Configuration](../edge-configuration/installer-reference.md) for available configuration parameters.

   :::warning

   Ensure you have generated the Trusted Boot keys in the **secure-boot/enrollment** folder before proceeding to the
   next step. If you build an ISO without using these keys, your device will not be able to boot.

   :::

7. Customize the **Dockerfile**. You can install tools and dependencies and configure the image to meet your needs. Add
   your customizations below the line tagged with the `Add any other image customizations here` comment in the
   Dockerfile. Do not edit or add any lines before this tagged comment. For example, you can add the following line to
   the **Dockerfile** to install WireGuard.

   ```dockerfile
   ...
   ###########################Add any other image customizations here #######################

   RUN sudo zypper refresh && sudo zypper install --non-interactive wireguard-tools
   ```

   :::warning

   :::

8. Issue the following command to build the ISO image.

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
