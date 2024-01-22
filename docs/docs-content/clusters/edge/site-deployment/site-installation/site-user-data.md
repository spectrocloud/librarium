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

Use the following steps to create an ISO file containing the additional user data. You will load the newly created ISO
to a bootable device, such as a USB stick.

## Prerequisites

- A bootable device such as a USB drive, or a Preboot Execution Environment (PXE) server.

- `mkisofs`, or `genisoimage`, or similar ISO management software.

- `cdrtools` or `wodim` for Windows.

## Create ISO

1. Create a file called **user-data** that contains the additional configurations you want to override or inject.

<br />

```shell
touch user-data
```

2. Create an empty **meta-data** file:

<br />

```shell
touch meta-data
```

3. Create an ISO using the following command.

MacOS/Linux:

```shell
mkisofs -output site-user-data.iso -volid cidata -joliet -rock user-data meta-data
```

Windows:

```shell
genisoimage -output site-user-data.iso -volid cidata -joliet -rock user-data meta-data
```

This generates an ISO file called site-user-data.iso in the current directory.

<br />

4. Copy the ISO to a bootable device such as a USB drive.

   <br />

   :::info

   You can use several software tools to create a bootable USB drive, such as
   [balenaEtcher](https://www.balena.io/etcher). For a PXE server, there are open-source projects such as
   [Fog](https://fogproject.org/download) or
   [Windows Deployment Services](https://learn.microsoft.com/en-us/windows/deployment/wds-boot-support) for Windows.

   :::

5. Once the Edge host arrives at the physical site. Load the USB drive to the Edge host before powering it on. The Edge
   Installer will apply the new user data during the installation process.

<br />

## Validate

You can validate that the ISO image is not corrupted by attempting to flash a bootable device. Most software that
creates a bootable device will validate the ISO image before the flash process.

## Next Steps

Before you register your Edge host with Palette you must have a tenant registration token. Review the
[Create Registration Token](create-registration-token.md) guide for steps on how to create a tenant registration token.
