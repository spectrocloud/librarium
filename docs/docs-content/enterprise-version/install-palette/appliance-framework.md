---
title: "Appliance Framework for Self-Hosted Palette"
sidebar_label: "Appliance Framework"
description: "Learn how to deploy self-hosted Palette to your environment using the Appliance Framework"
hide_table_of_contents: false
# sidebar_custom_props:
#   icon: "chart-diagram"
tags: ["appliance framework", "self-hosted", "enterprise"]
sidebar_position: 0
---

The Appliance Framework lets you deploy self-hosted Palette to your environment using an ISO file. The ISO file contains all the necessary components needed for Palette to function. The ISO file is used to boot the nodes, which are then clustered to form a Palette management cluster.

Once Palette has been installed and configured, you can download pack bundles to create your cluster profiles. You will then be able to deploy clusters in your environment.

## Architecture

The Appliance Framework is a self-hosted Palette solution that uses an ISO file to install Palette on your infrastructure. The ISO contains all the necessary components, including the operating system, Kubernetes, Container Network Interface (CNI), and Container Storage Interface (CSI). This solution is designed to be immutable, secure, and compliant with industry standards, such as the Federal Information Processing Standards (FIPS) and Security Technical Implementation Guides (STIG).

The following table displays the infrastructure profile for the self-hosted Palette appliance.

| **Layer** | **Component** |
| --- | --- |
| **OS** | Ubuntu – Immutable Kairos, STIG-hardened and FIPS compiled. |
| **Kubernetes** | Palette Kubernetes (PXK) – STIG-hardened and FIPS compiled. |
| **CNI** | Calico - FIPS compiled. |
| **CSI** | Rook Ceph - FIPS compiled. |

## Supported Platforms

The Appliance Framework self-hosted Palette ISO is supported on the following infrastructure platforms:

- VMware vSphere
- Bare Metal
- Machine as a Service (MAAS)

## Prerequisites

- Access to the Palette Artifact Studio to download the Palette Enterprise ISO and pack bundles.

- A minimum of three nodes must be provisioned in advance for the Palette installation. We recommended the following resources for each node. Refer to the Palette [Size Guidelines](./install-palette.md#size-guidelines) for additional sizing information.

  - 8 CPUs per node.

  - 16 GB Memory per node.

  - 100 GB Disk Space per node.

- The following network ports must be accessible on each node for Palette to operate successfully.

  - TCP/443: Must be open between all Palette nodes and accessible for user connections to the Palette management cluster.

  - TCP/6443: Outbound traffic from the Palette management cluster to the deployed cluster's Kubernetes API server.

- SSH access must be available to the nodes used for Palette installation.

- Relevant permissions to install Palette on the nodes including permission to attach or mount an ISO and set nodes to boot from it.

- The installation account/role for Palette must have the following permissions on the infrastructure provider:

  - Permissions to read and tag top-level objects within your infrastructure so Palette can discover inventory and propagate permissions.

  - Permissions to create, modify, and power-cycle VMs or bare-metal nodes, including storage allocation, network assignment, and template/image operations.

  - Permissions to assign networks/port-groups, browse/allocate datastore or disk space, and migrate or move machines as needed for cluster scaling and upgrades.

  - Permissions to create provider-native tags or labels and assign them to datacenters, clusters, or hosts. Palette converts these into `topology.kubernetes.io/{region,zone}` node labels for workload placement and high availability. Zone tagging is mandatory on VMware vSphere and recommended everywhere.

  - Permissions to monitor tasks/events/sessions of the infrastructure provider so Palette can track job statuses without requiring full administrator access.

  <!-- - Permissions to upload, register and update OS or VM templates that Palette uses during cluster creation (e.g. populate the `spectro-templates` folder on vSphere, or the image repository in MAAS). -->

- Access to your external registry server (if applicable) to store and pull the Palette packs. This is only required if you do not wish to use the Zot registry that comes with Palette.

  - The nodes used to host the Palette management cluster must have access to the external registry server.

## Install Palette

1. Download the Palette Enterprise ISO from the Artifact Studio.

2. Upload the ISO to your infrastructure provider. This can be done using the web interface of your infrastructure provider or using command-line tools.

   - For VMware vSphere, you can upload the ISO to a datastore using the vSphere Client or the `govc` CLI tool.
   - For Bare Metal, you can use tools like `scp` or `rsync` to transfer the ISO to the nodes.
   - For Machine as a Service (MAAS), you can use the MAAS web interface to upload the ISO.
   
   Ensure that the ISO is accessible to all nodes that will be part of the Palette management cluster.

3. Boot each node from the ISO to install the necessary software for Palette. The installation process will automatically configure the nodes with the required components, including the operating system, Kubernetes, CNI, and CSI.

4. Once the nodes have booted from the ISO, they will automatically start the installation process. You may see a GRand Unified Bootloader (GRUB) screen with selectable options, this should be ignored as the installation will proceed automatically.

   Wait for the installation process to complete. This will take at least 15 minutes, depending on the resources available on the nodes. After completion, the nodes will reboot and display the Palette Terminal User Interface (TUI).

5. Log in to the nodes using the default credentials for Kairos Ubuntu. The default username is `kairos` and the password is `kairos`.

6. In the Palette TUI, configure the node as per your environment requirements. Use the Tab key or the up and down arrow keys to switch between fields. When you make a change, press **Enter** to apply the change. Use **Esc** to back.

7. In **Hostname**, check the existing hostname and, optionally, change it to a new one.

8. In **Host Network Adapters**, select a network adapter you'd like to configure. By default, the network adapters
   request an IP automatically from the Dynamic Host Configuration Protocol (DHCP) server. The CIDR block of an
   adapter's possible IP address is displayed in the **Host Network Adapters** screen without selecting an individual
   adapter.

   In the configuration page for each adapter, you can change the IP addressing scheme of the adapter and choose static
   IP instead of DHCP. In Static IP mode, you will need to provide a static IP address, subnet mask, as well as the
   address of the default gateway. Specifying a static IP will remove the existing DHCP settings.

   You can also specify the Maximum Transmission Unit (MTU) for your network adapter. The MTU defines the largest size, in bytes, of a packet that can be sent over a network interface without needing to be fragmented.

9. In **DNS Configuration**, specify the IP address of the primary and alternate name servers. You can optionally specify a search domain.

10. After you are satisfied with the configurations, navigate to **Quit** and press **Enter** to finish the configuration. Press **Enter** again on the confirmation prompt.

    After a few seconds, the terminal displays the **Device Info** and prompts you to provision the device through the Local UI.

    :::info

    If you need to reconfigure the nodes, you can execute the `palette-tui` command to access the Palette TUI again.

    :::

11. The address of Local UI console is displayed on the terminal screen of the node. In your web browser, go to `https://<node-ip>:5080`. Replace `<node-ip>` with the IP address of your node. If you have changed the default port of the console, replace `5080` with the Local UI port.

    :::info

    The Local UI is used to manage the Palette nodes and perform administrative tasks. It provides a web-based interface for managing the Palette management cluster.

    :::

12. Log in to Local UI using the default credentials. The default username is `kairos` and the password is `kairos`. You can change the password after logging in.

13. Click the username dropdown menu in the top right corner and select **Update password**. Provide the **Old Password** as `kairos`, and set a new password in the **New Password** field. This will be the password you use to log in to Local UI in the future.

14. Use the Local UI to cluster the three nodes.

15. Log in to Palette and activate it.

16. Download your pack bundles from the Artifact Studio.

17. Transfer the pack bundles to one of your Palette nodes.

18. Install the pack bundles on the Palette node.

19. Profit.

## Validate

## Next Steps
