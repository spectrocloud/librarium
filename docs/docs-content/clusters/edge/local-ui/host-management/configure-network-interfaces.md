---
sidebar_label: "Configure Network Interfaces in Local UI"
title: "Configure Network Interfaces in Local UI"
description: "Instructions for configuring network interfaces in Local UI."
hide_table_of_contents: false
sidebar_position: 50
tags: ["edge"]
---

If your Edge host is deployed in an environment with custom networking requirements, such as segmented networks, redundant uplinks, or shared physical interfaces, you can configure network settings directly from Local UI.
Network configuration defines how the Edge host connects to physical and logical networks and can be adjusted both before and after the host joins a cluster.
Local UI allows you to configure network interface controllers (NICs), virtual local area network (VLAN) interfaces, bonds, and bridges.

## Limitations

- In Agent mode, configuring network interfaces using Local UI is allowed only if the interfaces were created via Local UI or the [TUI](../../site-deployment/site-installation/initial-setup.md). Pre-existing settings are read-only. If you attempt to update pre-existing network interfaces via Local UI, a new configuration is created alongside the existing one. To manage pre-existing configurations, use the original configuration method, such as `systemd-networkd`, Netplan, or NetworkManager.

## Prerequisites

- An Edge host installed with Edge Installer 4.3 or later.

- Network access to the Edge host's port where Local UI is exposed. The default port is 5080.

- Credentials to log in to Local UI. You can log in with any OS user's credentials.

## Configure NICs

1. Log in to Local UI.

2. The Network Interfaces table on the Edge Host page displays NIC information, including the number of NICs and their status. Hover over the NIC count or status to display the list of NICs.

3. Click **Edit** to display the detailed NICs information.

   :::info

   The NIC currently used for Edge host management (Local UI access and registration) is not editable. This management NIC is locked by design to avoid breaking connectivity. You can identify it by the IP address used to access the Local UI.

   :::


4. Click the pencil icon next to the NIC you want to configure.

5. Provide the following information.

   | Field | Description|
   | ------| -----------|
   | Config type| The following options are available:<br /> - **DHCP** - automatically obtains Internet Protocol (IP) settings from a  Dynamic Host Configuration Protocol (DHCP) server. <br /> - **Static** - uses manually configured IP settings.|