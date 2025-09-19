---
sidebar_label: "Apply Site User Data"
title: "Apply Site User Data"
description: "Learn how to create a secondary Edge Installer configuration user data."
hide_table_of_contents: false
sidebar_position: 0
tags: ["edge"]
---

You can provide site-specific Edge Installer configuration user data if you need to apply new values or override default
values from the Edge Installer user data you created in the [Prepare Edge Hosts for Installation](../stage.md) step or,
as often referenced, the _Installer Handoff_ phase.

Use the following steps to create an ISO file containing the additional user data and load it to a bootable device, such
as a USB stick.

## Prerequisites

- A bootable device such as a USB drive, or a Preboot Execution Environment (PXE) server.

- `mkisofs`, or `genisoimage`, or similar ISO management software.

- `cdrtools` or `wodim` for Windows.

## Create ISO

1. Create a file called `user-data` that contains the additional configurations you want to override or inject.

   ```shell
   touch user-data
   ```

2. Create an empty `meta-data` file:

   ```shell
   touch meta-data
   ```

3. Create an ISO file using the following command.

   MacOS/Linux:

   ```shell
   mkisofs -output site-user-data.iso -volid cidata -joliet -rock user-data meta-data
   ```

   Windows:

   ```shell
   genisoimage -output site-user-data.iso -volid cidata -joliet -rock user-data meta-data
   ```

   This generates an ISO file called `site-user-data.iso` in the current directory.

4. Copy the ISO file to a bootable device such as a USB drive.

   You can use several software tools to create a bootable USB drive, such as
   [balenaEtcher](https://www.balena.io/etcher). For a PXE server, there are open source projects such as
   [Fog](https://fogproject.org/download.php) or
   [Windows Deployment Services](https://learn.microsoft.com/en-us/windows/deployment/wds-boot-support) for Windows.

   :::info

   The site user data ISO file is not bootable. It contains only configuration data, which the system reads after
   booting from the internal disk. If you use a tool like [balenaEtcher](https://etcher.balena.io/) to write the ISO
   file to a USB stick, it may display the corresponding warning. You can safely ignore it and continue writing the
   image to USB.

   :::

5. Once the Edge host arrives at the physical site, load the USB drive to the Edge host before powering it on. The
   system boots from the internal disk, detects the USB drive, and automatically applies the additional user data.

## Validate

You can validate that the ISO file is not corrupted by attempting to flash a bootable device. Most software that creates
a bootable device will validate the ISO file before the flash process.

## Next Steps

Before you register your Edge host with Palette you must have a tenant registration token. Review the
[Create Registration Token](create-registration-token.md) guide for steps on how to create a tenant registration token.
