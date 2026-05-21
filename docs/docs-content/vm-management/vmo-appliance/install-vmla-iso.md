---
sidebar_label: "Install VM Launchpad"
title: "Install VM Launchpad"
description: "Learn how to install VM Launchpad"
icon: " "
hide_table_of_contents: false
sidebar_position: 10
tags: ["vmo", "vm launchpad"]
---

The VM Launchpad appliance is downloadable as a bootable ISO file and is a solution for installing Virtual Machine Orchestrator (VMO) as an Edge deployment. Once deployed, you can use the [Quick Start](./quick-start.md) guide to deploy your first VM. 

## Prerequisites

- The network must be configured with a bridge network set to `br0`. 

## Hardware Resources

The following sections list the hardware requirements for worker nodes and control plane nodes in a VMO cluster.

| Component            | Minimum             | Recommended                                        | Comments               |
| -------------------- | ------------------- | -------------------------------------------------- | ---------------------- | 
| **CPU**              | Intel or AMD x64 CPU with 8 cores  | Intel or AMD x64 CPU with 8 cores             |              |
| **RAM**              | 24 GB    | 256 GB or more                                     | Assumes the deployment of 20 VMs per node multiplied by the median RAM per VM.  |
| **Network Adapters** | 2 x 1 Gbps <br /> (data + management)                         | 2 x 10 Gbps (data) <br /> 2 x 10 Gbps (management) | Pod overlay operates on the management network.  |
| **Storage Adapters** | 2 x 16 Gbps FC  | 2 x 16 Gbps FC                              | Storage adapters must support the FC protocol, a high-speed network protocol used for data transfer. |
| **Disks**            | Local disk of at least 500GB for the OS boot (SAN boot is supported)   | Local disk of 500 GB for the OS boot  | Boot from SAN requires special consideration due to the multi-path configuration.  |

## Limitations

## Installing VM Launchpad 

1. Boot your VM Launchpad system from the ISO. 

2. From the VM Launchpad Interactive Installer page, select the target disk for installation, and click **Enter** on your keyboard to go to the next screen.

:::danger

Ensure you are selecting the correct disk. The installation process will completely erase all content on the target disk. 

:::

3. On the **Installation Options** page, you can select whether the installer should do **nothing**, **reboot**, or **poweroff** after installation is complete. Once installation is complete, remember to disconnect the ISO.

4. When VM Launchpad system boots up, press **F2** to open the TUI. This allows you to create an OS user with the necessary permissions to operate VM Launchpad. Enter a username and password to create a new user and press the **ENTER** key to progress to the next screen.

5. The terminal displays a console for you to provide hostname and network configurations to the Edge host.

   Check the existing hostname and, optionally, change it to a new one. Use the **TAB** key or the up and down arrow
   keys to switch between fields. When you make a change, press **ENTER** to apply the change.

6. In **Network Adapter**, select a network adapter to configure. By default, the network adapters request an IP
   automatically from the Dynamic Host Configuration Protocol (DHCP) server. The Classless Inter-Domain Routing (CIDR)
   block of an adapter's possible IP address is displayed in the **Network Adapter** screen without selecting an
   individual adapter.

   On the configuration page for each adapter, you can change the IP addressing scheme of the adapter and choose static
   IP instead of DHCP. In Static IP mode, you need to provide a static IP address, subnet mask, as well as the address
   of the default gateway. Specifying a static IP removes the existing DHCP settings.

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
    configuration. Shortly after you finish configuration, the terminal screen will display the hostname and network information of your
   Edge host. Verify that all displayed information is consistent with your configurations.

## Configure Network Settings

1.

## Creating VM Launchpad cluster

1.


## Validate

1. Log in to a tenant that belongs to your airgapped instance of Palette or Palette VerteX.

2. From the left **Main Menu**, select **Profiles** and click **Add Cluster Profile**.

3. Follow the [Create a VMO Profile] guide to start creating a VMO add-on profile.

4. If the Virtual Machine Orchestrator, Spectro Proxy, and, if applicable, your load balancer packs are available to add
   to a cluster profile, then the installation is successful.
