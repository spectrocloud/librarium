---
sidebar_label: "Installation"
title: "Installation"
description: "Learn how to install Palette Edge onto an Edge host with an installer ISO."
hide_table_of_contents: false
sidebar_position: 10
tags: ["edge"]
---

In this step, you will install Palette Edge onto an Edge host with the Edge Installer ISO you created during EdgeForge.
For more information about EdgeForge, refer to [EdgeForge Workflow](../edgeforge-workflow/edgeforge-workflow.md).

You can ship your Edge hosts after you complete this step. Use the following steps to prepare your Edge host for
installation.

:::tip

Consider implementing a staging checklist to ready the Edge hosts to be shipped on-site. You can include items such as
running some hardware testing, validate Basic Input/Output System (BIOS) and firmware settings, and labeling the Edge
hosts. This allows you to be more confident that your Edge hosts will be less likely to require intervention down the
road.

:::

### Prerequisites

- Edge Installer ISO file. Check out the [EdgeForge Workflow](/clusters/edge/edgeforge-workflow/palette-canvos/) to
  learn how to create an Edge Installer image or use the default Edge Installer image.

- A Bare Metal appliance with USB drives.

- The ability to modify the boot order settings to boot from a USB drive.

- A USB disk containing the installer ISO

The following items are optional and not required but may apply to your use case:

- USB disk that contains a user data ISO. This is applicable in
  [multiple user data](../edgeforge-workflow/prepare-user-data.md) scenarios where you want to override or provide
  additional configurations after the Edge host is powered on at the physical site.

- USB disk containing the content bundle ISO. You can avoid this by creating a custom installer. Refer to the
  [Build Edge Artifacts](../edgeforge-workflow/palette-canvos/palette-canvos.md) guide.

### Instructions

1. Insert the USB drive containing the Edge Installer ISO and potentially your user data.

2. If you created a content bundle and loaded it to a USB disk, then insert the content bundle USB drive.

3. Power on the Edge host.

4. Wait for the Edge Installer to complete copying content to the hard drive. The Edge host will reboot by default upon
   completion unless you specify a different option in the Edge Installer configuration user data.

5. Repeat steps 1 through 4 for all Edge hosts.

6. Remove the USB disks and ship your Edge host devices to the site for installation.

### Validate

You can validate that the Edge host is ready for the on-site deployment by simulating an on-site deployment on one of
the Edge hosts. The simulation process will require you to complete the installation process and reset the device after
the validation.
