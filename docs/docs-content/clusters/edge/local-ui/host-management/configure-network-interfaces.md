---
sidebar_label: "Configure Network Interfaces in Local UI"
title: "Configure Network Interfaces in Local UI"
description: "Instructions for configuring network interfaces in Local UI."
hide_table_of_contents: false
sidebar_position: 50
tags: ["edge"]
---

If your Edge host is deployed in an environment with custom networking requirements, such as segmented networks or
shared physical interfaces, you can configure network settings directly from Local UI. Network configuration defines how
the Edge host connects to physical and logical networks and can be adjusted both before and after the host joins a
cluster. Local UI allows you to configure network interface controllers (NICs), virtual local area network (VLAN)
interfaces, bonds, and bridges.

## Limitations

- In Agent mode, configuring network interfaces using Local UI is allowed only if the interfaces were created via Local
  UI or via the [TUI](../../site-deployment/site-installation/initial-setup.md). Pre-existing settings are read-only. If
  you attempt to update pre-existing network interfaces via Local UI, a new configuration is created alongside the
  existing one. To manage pre-existing configurations, use the original configuration method, such as
  `systemd-networkd`, Netplan, or NetworkManager.

## Prerequisites

- An Edge host installed with Edge Installer 4.3 or later.

- Network access to the Edge host's port where Local UI is exposed. The default port is 5080.

- Credentials to log in to Local UI. You can log in with any OS user's credentials.

## Configure NICs

1. Log in to Local UI.

2. The Network Interfaces table on the Edge Host page displays NIC information, including the number of NICs and their
   status. Hover over the NIC count or status to display the list of NICs.

3. Click **Edit** to display the detailed NICs information.

   :::info

   The NIC currently used for Edge host management (Local UI access and registration) is not editable. This management
   NIC is locked by design to avoid breaking connectivity. You can identify it by the IP address used to access the
   Local UI.

   :::

4. Click the pencil icon next to the NIC you want to configure.

5. Provide the following information.

   | Field       | Description                                                                                                                                                                                                                                             |
   | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Config type | Configuration type. The following options are available:<br /> - **DHCP** - automatically obtains Internet Protocol (IP) settings from a Dynamic Host Configuration Protocol (DHCP) server. <br /> - **Static** - uses manually configured IP settings. |
   | MTU         | Maximum transmission unit (MTU) defines the maximum packet size in bytes that can be transmitted on the interface without fragmentation. The default value is 1500.                                                                                     |
   | IP Address  | The unique Internet Protocol version 4 (IPv4) address used to identify the interface on the network. Only applicable for the **Static** configuration type.                                                                                             |
   | Subnet mask | The IPv4 subnet mask that defines the network and host portions of the IP address. Only applicable for the **Static** configuration type.                                                                                                               |
   | Gateway     | The IPv4 address of the router used to reach networks outside the local subnet. Only applicable for the **Static** configuration type.                                                                                                                  |
   | DNS         | One or more IPv4 Domain Name System (DNS) server addresses used to translate hostnames into IP addresses.                                                                                                                                               |

6. Click **Confirm** to save the changes.

## Configure VLAN Interfaces

1. Log in to Local UI.

2. Click the **Create** button in the **VLAN Interfaces** row of the **Network Interfaces** table.

3. Provide the following information.

   | Field            | Description                                                                                                                                                                                              |
   | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Parent type      | Specifies the member interface type. The following options are available:<br /> - **NIC** - create the VLAN on a physical network interface . <br /> - **Bond** - create the VLAN on a bonded interface. |
   | Member interface | Specifies the parent interface (NIC or bond) on which the VLAN is created.                                                                                                                               |
   | VLAN ID          | The numeric identifier used to tag traffic for the VLAN. Must be a number between 1 and 4094.                                                                                                            |
   | Config type      | Configuration type. The following options are available:<br /> - **DHCP** - automatically obtains IP settings from a DHCP server. <br /> - **Static** - uses manually configured IP settings.            |
   | MTU              | Defines the maximum packet size in bytes that can be transmitted on the VLAN interface without fragmentation. The default value is 1500.                                                                 |
   | IP Address       | The unique IPv4 address used to identify the VLAN interface on the network. Only applicable for the **Static** configuration type.                                                                       |
   | Subnet mask      | The IPv4 subnet mask that defines the network and host portions of the IP address. Only applicable for the **Static** configuration type.                                                                |
   | Gateway          | The IPv4 address of the router used to reach networks outside the local subnet. Only applicable for the **Static** configuration type.                                                                   |
   | DNS              | One or more IPv4 DNS server addresses used to translate hostnames into IP addresses.                                                                                                                     |

4. Click **Confirm** to save the changes. Local UI assigns the **VLAN Name** value automatically.

## Configure Bonds

1. Log in to Local UI.

2. Click the **Create** button in the **Bonds** row of the **Network Interfaces** table.

3. Provide the following information.

   | Field                                    | Description                                                                                                                                                                                                                                      |
   | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | Name                                     | Bond name used to identify it.                                                                                                                                                                                                                   |
   | Bond type                                | Configuration type. The following options are available:<br /> - **DHCP** - automatically obtains IP settings from a DHCP server. <br /> - **Static** - uses manually configured IP settings.                                                    |
   | Member interface                         | Specifies the physical NICs that are grouped together to form the bond. All selected member interfaces participate in the bonded interface according to the selected bonding mode.                                                               |
   | Bonding mode                             | Defines how traffic is distributed across the member interfaces and how failover is handled. Review [Bonding modes](https://www.ibm.com/docs/en/linux-on-systems?topic=recommendations-bonding-modes) to learn more about the available options. |
   | Link monitoring interval (MIIMonitorSec) | Specifies the interval, in seconds, at which the system checks the link status of each member interface. This value is used to detect link failures and trigger failover when supported by the bonding mode.                                     |
   | MTU                                      | Defines the maximum packet size in bytes that can be transmitted on the interface without fragmentation. The default value is 1500.                                                                                                              |
   | DNS                                      | One or more IPv4 DNS server addresses used to translate hostnames into IP addresses.                                                                                                                                                             |
   | IP Address                               | The unique IPv4 address used to identify the bridge interface on the network. Only applicable for the **Static** bond type.                                                                                                                      |
   | Subnet mask                              | The IPv4 subnet mask that defines the network and host portions of the IP address. Only applicable for the **Static** bond type.                                                                                                                 |
   | Gateway                                  | The IPv4 address of the router used to reach networks outside the local subnet. Only applicable for the **Static** bond type.                                                                                                                    |

4. Click **Confirm** to save the changes.

## Configure Bridges

1. Log in to Local UI.

2. Click the **Create** button in the **Bridges** row of the **Network Interfaces** table.

3. Provide the following information.

   | Field            | Description                                                                                                                                                                                   |
   | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Name             | Bridge name used to identify it.                                                                                                                                                              |
   | Member interface | Specifies the interfaces that are attached to the bridge.                                                                                                                                     |
   | Config type      | Configuration type. The following options are available:<br /> - **DHCP** - automatically obtains IP settings from a DHCP server. <br /> - **Static** - uses manually configured IP settings. |
   | MTU              | Defines the maximum packet size in bytes that can be transmitted on the interface without fragmentation. The default value is 1500.                                                           |
   | DNS              | One or more IPv4 DNS server addresses used to translate hostnames into IP addresses.                                                                                                          |
   | IP Address       | The unique IPv4 address used to identify the interface on the network. Only applicable for the **Static** bond type.                                                                          |
   | Subnet mask      | The IPv4 subnet mask that defines the network and host portions of the IP address. Only applicable for the **Static** bond type.                                                              |
   | Gateway          | The IPv4 address of the router used to reach networks outside the local subnet. Only applicable for the **Static** bond type.                                                                 |

4. Click **Confirm** to save the changes.

## Validate

1. Log in to your Edge Host via Secure Shell (SSH).

2. Use the following command to validate the configuration type, MTU, IP address, and subnet mask of an interface (NIC,
   VLAN, Bond, or Bridge). Replace `ens192` with the required interface name.

   ```shell
   ip addr show ens192
   ```

   ```shell title="Example output"
   2: ens192: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default qlen 1000
    link/ether 00:50:56:b8:3d:21 brd ff:ff:ff:ff:ff:ff
    altname enp11s0
    inet 10.10.145.100/18 metric 100 brd 10.10.191.255 scope global dynamic ens192
   ...
   ```

   Review the output to verify the following:

   - The `mtu` value matches the **MTU** value configured in Local UI.
   - The `inet` value matches the **IP Address** and **Subnet mask** values configured in Local UI. Only applicable if
     the **Config type** (or **Bond type** for bonds) is set to **Static**.
   - The `dynamic` keyword is present if the **Config type** (or **Bond type** for bonds) value configured in Local UI
     is **DHCP**.

3. Validate the gateway value only when the configuration type is set to **Static**. Use the following command.

   ```shell
   ip route show
   ```

   ```shell title="Example output"
   default via 10.10.128.1 dev ens192 proto dhcp src 10.10.145.100 metric 100
   ...
   ```

   Verify that a `default via <gateway-ip>` route exists and matches the **Gateway** value configured in Local UI.

4. Validate DNS only when you explicitly configured it in Local UI. For DHCP configurations, DNS values may be inherited
   automatically and you can ignore them. Use the following command. Replace `ens192` with the required interface name.

   ```shell
   resolvectl dns ens192
   ```

   ```shell title="Example output"
   Link 2 (ens192): 10.10.128.8
   ...
   ```

   Verify that the IP addresses listed after the interface name match the **DNS** values configured in Local UI.

5. If you configured bonds, validate their member interfaces and bonding mode. Use the following command. Replace
   `bond0` with the required bond name.

   ```shell
   cat /proc/net/bonding/bond0
   ```

   ```shell title="Example output"
   ...
   Bonding Mode: IEEE 802.3ad Dynamic link aggregation
   ...
   Slave Interface: ens192
   ...
   Slave Interface: ens224
   ...
   ```

   Verify the following:

   - The `Bonding Mode` matches the value configured in Local UI.
   - The `Slave Interface` values match the `Member interface` values configured in Local UI.

6. If you configured bridges, validate their member interfaces. Use the following command.

   ```shell
   bridge link show
   ```

   ```shell title="Example output"
   3: bond0 state UP master br0
   5: ens192.100 state UP master br0
   ```

   Verify that each interface configured as a bridge member appears in the output with `master <bridge-name>`.

:::info

VLAN member interfaces do not require separate validation. A VLAN is always created on exactly one parent interface (NIC
or bond), and this relationship is encoded in the VLAN interface name, for example, `ens192.100` or `bond0.200`.

:::
