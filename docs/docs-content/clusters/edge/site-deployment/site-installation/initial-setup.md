---
sidebar_label: "Initial Edge Host Configuration"
title: "Initial Edge Host Configuration with Palette TUI"
description: "Instructions for configuring the Edge host when booting up the Edge host for the first time."
hide_table_of_contents: false
sidebar_position: 15
tags: ["edge"]
---

When you boot up an Edge host for the first time after installation, if you enabled initial configuration in the user
data, you will be prompted to configure the Edge host and its network environment in a Terminal User Interface (TUI).
This includes the configuration of an OS user, machine hostname, IP address, and DNS server. These settings will persist
even after you reset the host.

You may already have specified some of these configurations in the **user-data** file in the EdgeForge process or have
supplied them with site-specific **user-data**, and can either keep them as they are or update them during this step.
For more information about EdgeForge and site user data, refer to
[EdgeForge Workflow](../../edgeforge-workflow/edgeforge-workflow.md) and [Apply Site User Data](./site-user-data.md).

:::warning

If you are upgrading to 4.3 from an older version, the initial configuration does not get triggered. If you want to
perform the setup, you can issue the command `palette-tui` in the terminal to trigger it manually.

:::

## Prerequisites

- An Edge host installed with Edge Installer 4.3 or later.

- The Edge host must not have an active cluster deployed on it.

- The Edge installer ISO used to install Palette on the Edge host must
  [enable initial configuration](../../edge-configuration/installer-reference.md#palette-agent-parameters).

- A keyboard or another input device connected to the Edge host.

## Set up Edge Host

1. Power up the Edge host. The GRand Unified Bootloader (GRUB) screen will display the following options. Do not make
   any input and allow Palette to choose the boot option automatically.

   :::warning

   The following table describes each option in the GRUB screen for your information. However, you should never manually
   change the boot option. Doing so may cause Edge cluster deployment failures.

   :::

   | Option                                          | Description                                                                                                                                                                                                                                                                                                                                   |
   | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Palette eXtended Kubernetes - Edge              | This option boots the active image on your Edge host. If the Edge host is already part of a cluster, the active image is the image that your cluster uses.                                                                                                                                                                                    |
   | Palette eXtended Kubernetes - Edge (fallback)   | This option boots the passive image on your Edge host. If you have updated the cluster with a new cluster profile, the passive image is the image used by the previous version of the cluster.                                                                                                                                                |
   | Palette eXtended Kubernetes - Edge recovery     | This option boots the recovery image. The recovery image is the OS image in the installer ISO. It does not include Kubernetes. The Palette agent is also inactive when this option is used, which means that the Edge host will not attempt to register with Palette.                                                                         |
   | Palette eXtended Kubernetes - Edge Reset        | This option wipes all data and resets the Edge host to the state after a fresh installation. The difference between this option and the recovery option is that the reset option wipes all application data and the Palette agent will be active after a reset. This will not affect the registration if the Edge host is already registered. |
   | Palette eXtended Kubernetes - Edge Registration | This option boots the Edge host to the registration phase. For more information, refer to [Edge Host Registration](../../site-deployment/site-installation/edge-host-registration.md).                                                                                                                                                        |

2. If this is the first time you've started the Edge host since installation, you will be automatically directed to the
   TUI. If you are accessing the Edge host with an SSH connection, you can issue the command `palette-tui` to bring up
   the TUI. You can also use the same command to bring up the TUI if you have gone through the initial setup in the TUI
   and want to change any configuration. However, you can only do this before you have deployed a cluster on the Edge
   host.

3. If you have already configured a user in your **user-data** file in the EdgeForge step, this step will be skipped
   automatically and you will be asked to log in instead. For more information, refer to
   [Prepare User Data](../../edgeforge-workflow/prepare-user-data.md).

   If you did not configure a user in your **user-data** file during EdgeForge or provide site user data, a terminal
   user interface will display a **Create User** page. This allows you to create an Operating System (OS) user with the
   necessary permissions to operate Palette. Enter a username and password to create a new user and press the Enter key
   to progress to the next screen.

   :::info

   The user `kairos` always exists in the OS. If you configured the username and password in your user data, you can use
   this user to log in to the OS as well as Local UI. However, you cannot create this user during initial configuration
   as this user already exists.

   :::

4. Next, the terminal will display a console for you to provide hostname and network configurations to the Edge host.

   ![A terminal user interface showing displaying network configuration options](/cluster_edge_site-deployment_installation_initial-setup_tui.webp)

   Check the existing hostname and, optionally, change it to a new one. Use the Tab key or the up and down arrow keys to
   switch between fields. When you make a change, press **Enter** to apply the change.

5. In **Host Network Adapters**, select a network adapter you'd like to configure. By default, the network adapters
   request an IP automatically from the Dynamic Host Configuration Protocol (DHCP) server. The CIDR block of an
   adapter's possible IP address is displayed in the **Host Network Adapters** screen without selecting an individual
   adapter.

   In the configuration page for each adapter, you can change the IP addressing scheme of the adapter and choose static
   IP instead of DHCP. In Static IP mode, you will need to provide a static IP address, subnet mask, as well as the
   address of the default gateway. Specifying a static IP will remove the existing DHCP settings.

   :::warning

   If you intend to create a cluster using this host and enable network overlay, do not configure static IP
   through the TUI. If you need to configure static IP, use the
   [user data network block](../../edge-configuration/installer-reference.md#site-network-parameters) instead.

   :::

6. In the configuration page of each network adapter, you can also specify the Maximum Transmission Unit (MTU) for your
   network adapter. The MTU defines the largest size, in bytes, of a packet that can be sent over a network interface
   without needing to be fragmented. Press **Enter** to apply the change.

7. In **DNS Configuration**, specify the IP address of the primary and secondary name servers. You can optionally also
   specify a search domain. Press **Enter** to apply the change.

8. After you are satisfied with the configurations, navigate to **Quit** and hit enter to finish configuration.

## Validate

1. Shortly after you finish configuration, the terminal screen will display the hostname and network information of your
   Edge host.

2. Verify that all displayed information is consistent with your configurations.
