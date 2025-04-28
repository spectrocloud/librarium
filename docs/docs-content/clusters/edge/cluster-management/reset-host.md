---
sidebar_label: "Reset Host via Terminal"
title: "Reset Host via Terminal"
description: "Learn how to reset an Edge host using the terminal."
icon: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["edge"]
---

This restores the Edge host to the state right after the
[initial configuration](../site-deployment/site-installation/initial-setup.md) is completed in the Terminal User
Interface (TUI).

:::warning

Since the reset will return your Edge host to the state right after TUI configuration, if you have upgraded your Palette
agent since then, those upgrades will be reset as well. Your Palette agent version will return to the version you
initially installed.

If your host relies on certain features only available after a certain version, ensure that you upgrade the Palette
agent first before creating a new cluster. Connected Edge hosts will upgrade the agent automatically unless you paused
upgrades. Refer to [Upgrade Palette Agent](../cluster-management/agent-upgrade-airgap.md) to learn how to upgrade an
agent on a disconnected Edge host.

:::

A reset removes all workloads, content, and cluster definition from the Edge host. This includes content bundles that
were built into the ISO image during EdgeForge. If your host was [linked](../local-ui//cluster-management/link-hosts.md)
with other hosts, resetting the host will also unlink them. However, the content of the `/oem` folder is retained after
the reset. This includes the content of your `user-data` file that you used to configure the installer.

Unlike using reset from Local UI, resetting the host through the terminal works even if your host is centrally managed.
If your Edge host is part of a cluster, resetting the Edge host will cause the node to be down in your cluster.
Depending on your cluster architecture, this may disrupt your cluster workloads or even bring down your entire cluster
with limited options for recovery. If possible, always
[remove the node from the cluster first through scaling down](../../cluster-management/node-pool.md#change-a-node-pool)
before resetting the node.

## Prerequisite

- You have the credentials and network access to establish an SSH connection to your Edge host.

- You can edit the `/oem/grubenv` file. By default, only root users and users in the `admin` group can edit this file.

- You have the credentials to perform reboots on your Edge host, or physical access to the Edge host to perform a
  reboot.

## Reset Edge Host

1. Establish an SSH connection to your host.

2. From the terminal, issue the following command.

   ```shell
   grub2-editenv /oem/grubenv set next_entry=statereset
   ```

3. Reboot the host. You can use the following command to trigger a reboot. If you have physical access to your Edge
   host, you can also reboot manually.

   ```shell
   sudo reboot
   ```

## Validate

1. Visit `https://<edge-host-ip>:5080` to access local UI on the Edge host.

2. Confirm that the Edge host is no longer part of a cluster and has returned to the
