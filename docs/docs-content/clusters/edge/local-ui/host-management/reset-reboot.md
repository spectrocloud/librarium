---
sidebar_label: "Reboot, Shutdown, and Reset Edge Host"
title: "Reboot, Shutdown, and Reset Edge Host"
description: "Instructions for rebooting, shutting down, and resetting Edge Host to factory default."
hide_table_of_contents: false
sidebar_position: 32
tags: ["edge"]
---

You can reboot, shut down and reset an Edge host from Local UI.

:::preview

:::

## Reboot Edge Host

You can reboot the Edge host from Local UI. Doing so will cause you to temporarily lose access to Local UI while the
Edge host is rebooting.

### Prerequisite

- Network access to the Edge device’s IP and port where Local UI is exposed. The default port is 5080.

- Credentials to log in to Local UI. Any Operating System (OS) user can be used to log into Local UI.

### Instructions

1. Log in to [Local UI](./access-console.md#log-in-to-local-ui).

2. Under the upper-right **User Menu**, click on **Actions** to open the actions drop-down menu.

3. Click on **Reboot**.

4. Click **Confirm** to confirm the reboot.

### Validate

1. After confirming the reboot, you will be logged out of the current session immediately and the Edge host will reboot
   shortly afterwards.

2. Verify that the Edge host is rebooting by trying to visit Local UI. Confirm that the address is unreachable.

3. After waiting a few minutes, try to access Local UI again to confirm that the Edge host has rebooted successfully.

## Reset Edge Host to Factory Default

You can reset an airgapped Edge host to factory default from Local UI. This restores the Edge host to the state right
after the [initial configuration](../../site-deployment/site-installation/initial-setup.md) is completed in the Terminal
User Interface (TUI). Reset to factory default removes all workloads, content, and cluster definition from the Edge
host. This includes content bundles that were built into the ISO image during EdgeForge.

If your Edge host has a connection to Palette, you cannot reset the Edge host to factory default through Local UI as the
cluster is managed through Palette.

:::info

If you configured HTTP/HTTPS proxy through Local UI, the proxy setting will be retained after the factory reset. For
more information about HTTP proxy, refer to [Configure HTTP Proxy](configure-proxy.md).

:::

### Prerequisite

- Network access to the Edge device’s IP and port where Local UI is exposed. The default port is 5080.

- Credentials to log in to Local UI. Any OS user can be used to log into Local UI.

### Instructions

1. Log in to [Local UI](./access-console.md#log-in-to-local-ui).

2. Under the upper-right **User Menu**, click on **Actions** to open the actions drop-down menu.

3. Click **Reset to factory default**.

4. Click **Confirm** to confirm.

### Validate

1. After confirming, a message displays that the Edge host is scheduled for a reset. Local UI might become unresponsive
   for a few minutes afterwards.

2. After a few minutes, visit Local UI in your browser and log in. Verify that all cluster data and content have been
   erased.

## Shut Down Edge Host

You can shut down the Edge host from Local UI.

### Prerequisites

- Network access to the Edge device’s IP and port where Local UI is exposed. The default port is 5080.

- Credentials to log in to Local UI. Any OS user can be used to log into Local UI.

### Instructions

1. Log in to [Local UI](./access-console.md#log-in-to-local-ui).

2. Under the upper-right **User Menu**, click on **Actions** to open the actions **drop-down Menu**.

3. Click **Shutdown**.

4. Click **Confirm** to confirm shutting down the Edge host.

### Validate

1. After confirming, a message displays that the Edge host will shut down.

2. Verify that the Edge host has shut down by observing the hardware has stopped. If your Edge host is a Virtual Machine
   (VM), observe on the VM platform that the VM is powered off.
