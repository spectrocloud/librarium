---
sidebar_label: "Initial Edge Host Configuration"
title: "Initial Edge Host Configuration"
description: "Instructions for configuring the Edge host when booting up the Edge host for the first time."
hide_table_of_contents: false
sidebar_position: 32
tags: ["edge"]
---

When you boot up an Edge host for the first time after installation, if you enabled initial configuration in the user
data, you will be prompted to configure the Edge host and its network environment in a Terminal User Interface (TUI).
This includes the configuration of an OS user, machine hostname, IP address, and DNS server.

You may already have specified some of these configurations in the **user-data** file in the EdgeForge process or have
supplied them with site-specific **user-data**, and can either keep them as they are or update them during this step.
For more information about EdgeForge and site user data, refer to
[EdgeForge Workflow](../edgeforge-workflow/edgeforge-workflow.md) and
[Apply Site User Data](./site-installation/site-user-data.md).

:::warning

If you are upgrading to 4.3 from an older version, the initial configuration does not get triggered. If you want to
perform the setup, you can issue the command `spectro-edge-console` in the terminal to trigger it manually.

:::

## Prerequisite

- An Edge host installed with Edge Installer 4.3 or later.

- The Edge host must not have an active cluster deployed on it.

- The Edge installer ISO used to install Palette on the Edge host must
  [enable initial configuration](../edge-configuration/installer-reference.md#initial-configuration).

- A keyboard or another input device connected to the Edge host.

## Set up Edge Host

1. Power up the Edge host. Do not make any input and allow Palette to choose the boot option automatically. If this is
   the first time you've started the Edge host since installation, you will be automatically directed to the TUI.

   If you are accessing the Edge host with an SSH connection, you can issue the command `spectro-edge-console` to bring
   up the TUI. You can also use the same command to bring up the TUI if you have gone through the initial setup in the
   TUI and want to change any configuration. However, you can only do this before you have deployed a cluster on the
   Edge host.

2. If you have already configured a user in your **user-data** file in the EdgeForge step, this step will be skipped
   automatically.

   If you did not configure a user in your **user-data** file during EdgeForge or provide site user data, a terminal
   user interface will display a **Create User** page. This allows you to create an Operating System (OS) user with the
   necessary permissions to operate Palette. Enter a username and password to create a new user and press the Enter key
   to progress to the next screen.

   :::info

   The user `kairos` always exists in the OS. If you configured the username and password in your user data, you can use
   this user to log in to the OS as well as the Edge Management Console. However, you cannot create this user during
   initial configuration as this user already exists.

   :::

3. Next, the terminal will display a console for you to provide hostname and network configurations to the Edge host.

   ![A terminal user interface showing displaying network configuration options](/cluster_edge_site-deployment_installation_initial-setup_tui.png)

   Check the existing hostname and, optionally, change it to a new one. Use the Tab key or the up and down arrow keys to
   switch between fields. When you make a change, press Enter to confirm the change.

4. In **Network Adapters**, choose a network adapter that the Edge host will use to communicate with Palette.

   By default, the network adapter requests an IP automatically from the DHCP server. Optionally, you can also specify a
   static IP. Press Enter to confirm the change.

5. In **DNS Configuration**, specify the IP address of the primary and secondary name servers. Press Enter to confirm
   the change.

6. After you are satisfied with the configurations, navigate to **Quit** and hit enter to finish configuration.

## Validate

1. Shortly after you finish configuration, the terminal screen will display the hostname and network information of your
   Edge host.

2. Verify that all displayed information is consistent with your configurations.
