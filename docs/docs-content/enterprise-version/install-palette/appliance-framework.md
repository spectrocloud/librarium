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

2. Boot each node from the ISO to install the necessary software for Palette. The installation process will automatically configure the nodes with the required components, including the operating system, Kubernetes, CNI, and CSI.

   - For VMware vSphere, you can use the vSphere Client to attach the ISO to each node and set them to boot from it.
   - For Bare Metal or MAAS, you can use your preferred method to boot the nodes from the ISO.

3. Once the nodes have booted from the ISO, they will automatically start the installation process. This will take at least 15 minutes, depending on the resources available on the nodes.

4. Log in to the nodes using the default credentials for Kairos Ubuntu. The default username is `kairos` and the password is `kairos`. You can change the password after logging in.

5. In the Palette Text-based User Interface (TUI), configure the node as per your environment requirements. This includes setting up the network, hostname, and other configurations.

6. Select `Quit` to exit the Palette TUI once you have completed the configuration.

   :::info
   
   If you need to reconfigure the nodes, you can execute `sudo pxk tui` to access the Palette TUI again.

   :::

7. Log in to Local UI using the default credentials. The default username is `kairos` and the password is `kairos`. You can change the password after logging in.

   The Local UI is accessible via the IP address of the Palette node on port 5080.

8. Use the Local UI to cluster the three nodes.

9. Log in to Palette and activate it.

10. Download your pack bundles from the Artifact Studio.

11. Transfer the pack bundles to one of your Palette nodes.

12. Install the pack bundles on the Palette node.

13. Profit.

## Validate

## Next Steps
