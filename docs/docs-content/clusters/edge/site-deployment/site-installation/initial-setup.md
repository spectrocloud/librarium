---
sidebar_label: "Initial Edge Host Configuration"
title: "Initial Edge Host Configuration with Palette TUI"
description: "Instructions for configuring the Edge host when booting up the Edge host for the first time."
hide_table_of_contents: false
sidebar_position: 15
tags: ["edge"]
---

When you boot an Edge host, the Terminal User Interface (TUI) launches automatically and allows you to configure the
host and its network environment. This includes the configuration of an OS user, machine hostname, IP address, Virtual
Local Area Network (VLAN), and Domain Name System (DNS) server. These settings persist even after you reset the host.

You may already have specified some of these configurations in the `user-data` file in the EdgeForge process or have
supplied them with site-specific `user-data`, and can either keep them as they are or update them during this step. For
more information about EdgeForge and site user data, refer to
[EdgeForge Workflow](../../edgeforge-workflow/edgeforge-workflow.md) and [Apply Site User Data](./site-user-data.md).

:::warning

When upgrading an Edge host from an Agent version earlier than 4.3, the initial TUI configuration wizard does not start
automatically. To launch the setup manually, issue the command `/opt/spectrocloud/bin/palette-tui` in the terminal.

:::

## Limitations

- Depending on the console environment, the TUI may not display the full QR code for Palette registration. This issue
  has been observed in the VMware vSphere web console, where limited console window size can cause the QR code to appear
  partially truncated.
- In Agent mode, the TUI only allows managing the VLAN settings that were created via it. The TUI displays the pre-existing settings but does not allow editing or deletion of them. If you attempt to update a pre-existing network setting via TUI, a new configuration will be created alongside the existing one, rather than replacing it. To manage pre-existing configurations, use the original configuration methods such as `systemd-networkd`, Netplan, or NetworkManager.

## Prerequisites

- An Edge host installed with Edge Installer 4.3 or later.

- The Edge host must not have an active cluster deployed on it.

- A keyboard or another input device connected to the Edge host.

## Set up Edge Host

1. Power on the Edge host. The GRand Unified Bootloader (GRUB) screen displays the following options. Do not make any
   input and allow Palette to choose the boot option automatically.

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

2. When you start the Edge host, the Palette TUI landing page opens automatically and displays the following system
   information:

   - Palette TUI version
   - Platform or virtualization environment
   - Central processing unit (CPU) type and count
   - Total system random access memory (RAM)
   - Host name
   - Host unique identifier (UID)
   - IP address
   - Agent version
   - Local UI link
   - Palette endpoint
   - QR code for Palette registration (if you provided the value in the `stylus.site.registrationURL` parameter of
     [user data](../../edge-configuration/installer-reference.md))

   When accessing the Edge host with an SSH connection, you can issue the command `/opt/spectrocloud/bin/palette-tui` to
   launch the TUI.

   :::info

   You can also use the command `/opt/spectrocloud/bin/palette-tui` to access the TUI after completing the initial setup
   if you need to review or adjust any configuration. However, once you deploy a cluster on the Edge host, the TUI can
   only be used for validation purposes; editing configurations is not allowed.

   :::

3. Press **F2** to customize your settings.

4. If you configured a user in your `user-data` file in the EdgeForge step, the TUI displays the **User Login** page.
   For more information, refer to [Prepare User Data](../../edgeforge-workflow/prepare-user-data.md).

   If you did not configure a user in your `user-data` file during EdgeForge or provide site user data, the TUI displays
   the **Create User** page. This allows you to create an OS user with the necessary permissions to operate Palette.
   Enter a username and password to create a new user and press the **ENTER** key to progress to the next screen.

   :::info

   The user `kairos` always exists in the OS. If you configured the username and password in your user data, you can use
   this user to log in to the OS as well as Local UI. However, you cannot create this user during initial configuration
   as this user already exists.

   :::

5. The terminal displays a console for you to provide hostname and network configurations to the Edge host.

   ![A terminal user interface showing displaying network configuration options](/clusters_site-installation_initial-setup_tui_4.8.webp)

   Check the existing hostname and, optionally, change it to a new one. Use the **TAB** key or the up and down arrow
   keys to switch between fields. When you make a change, press **ENTER** to apply the change.

6. In **Network Adapter**, select a network adapter to configure. By default, the network adapters request an IP
   automatically from the Dynamic Host Configuration Protocol (DHCP) server. The Classless Inter-Domain Routing (CIDR)
   block of an adapter's possible IP address is displayed in the **Network Adapter** screen without selecting an
   individual adapter.

   On the configuration page for each adapter, you can change the IP addressing scheme of the adapter and choose static
   IP instead of DHCP. In Static IP mode, you need to provide a static IP address, subnet mask, as well as the address
   of the default gateway. Specifying a static IP removes the existing DHCP settings.

   :::warning

   If you intend to create a cluster using this host and enable network overlay, do not configure static IP through the
   TUI. If you need to configure static IP, use the
   [user data network block](../../edge-configuration/installer-reference.md#site-network-parameters) instead.

   :::

7. On the configuration page of each network adapter, you can also specify the VLAN ID. A VLAN ID enables you to
   logically segment network traffic on the same physical network interface, providing network isolation and enhanced
   traffic management. If you assign a VLAN ID, the Edge host tags all outgoing packets from that adapter with the
   specified VLAN identifier.

8. Additionally, you can specify the Maximum Transmission Unit (MTU) for your network adapter. The MTU defines the
   largest size, in bytes, of a packet that can be sent over a network interface without needing to be fragmented. Press
   **ENTER** to apply the change.

9. In **DNS Configuration**, specify the IP address of the primary and secondary name servers. You can optionally also
   specify a search domain. Press **ENTER** to apply the change.

10. After you are satisfied with the configurations, navigate to **Logout** and press **ENTER** to complete the
    configuration.

## Validate

1. Shortly after you finish configuration, the terminal screen will display the hostname and network information of your
   Edge host.

2. Verify that all displayed information is consistent with your configurations.
