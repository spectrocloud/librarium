---
sidebar_label: "Install VM Launchpad"
title: "Install VM Launchpad"
description: "Learn how to install VM Launchpad"
icon: " "
hide_table_of_contents: false
sidebar_position: 10
tags: ["vmo", "vm launchpad"]
---

The VM Launchpad appliance is downloadable as an ISO file and is a solution for installing Virtual Machine Orchestrator (VMO) as an Edge deployment. Once deployed, you can use the [Quick Start](./quick-start.md) guide to deploy your first VM. 

### Control Plane Nodes

Typically, the cluster control plane nodes do not operate any VMO workloads. As a result, they can have lighter hardware
specifications in terms of CPU and RAM. For example, a server with 4 cores and 8 GB RAM is sufficient for a
minimum-specification control plane node. The rest of the hardware requirements for control plane nodes remain the same
as worker nodes.

| Component            | Minimum                                                                                            | Recommended                                        | Comments                                                                                             |
| -------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Form Factor**      | The server must fit Fiber Channel (FC) adapters and have sufficient Network Interface Cards (NIC). | 2U Rackmount Chassis                               |                                                                                                      |
| **Network Adapters** | 2 x 10 Gbps <br /> (data + management)                                                             | 2 x 10 Gbps (data) <br /> 2 x 10 Gbps (management) | Pod overlay operates on the management network.                                                      |
| **Storage Adapters** | 2 x 16 Gbps FC                                                                                     | 2 x 16 Gbps FC                                     | Storage adapters must support the FC protocol, a high-speed network protocol used for data transfer. |
| **Disks**            | Local disk for the OS boot (SAN boot is supported)                                                 | Local disk for the OS boot                         | Boot from SAN requires special consideration due to the multi-path configuration.                    |

The CPU and RAM requirements for control plane nodes increase with the number of worker nodes and namespaces in the
cluster. Refer to the following table for guidance on control plane node sizing.

:::warning

These recommendations assume that each cluster has at least three control plane nodes.

:::

### Worker Nodes

Refer to the following table for the minimum and recommended hardware specifications for the worker nodes of the
cluster.

| Component            | Minimum                                                                                            | Recommended                                        | Comments                                                                                             |
| -------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Form Factor**      | The server must fit Fiber Channel (FC) adapters and have sufficient Network Interface Cards (NIC). | 2U Rackmount Chassis                               |                                                                                                      |
| **CPU**              | Intel or AMD x64 CPU with 8 cores                                                                  | Intel or AMD x64 CPU with 8 cores                  |                                                                                                      |
| **RAM**              | 24 GB                                                                                              | 256 GB or more                                     | Assumes the deployment of 20 VMs per node multiplied by the median RAM per VM.                       |
| **Network Adapters** | 2 x 10 Gbps <br /> (data + management)                                                             | 2 x 10 Gbps (data) <br /> 2 x 10 Gbps (management) | Pod overlay operates on the management network.                                                      |
| **Storage Adapters** | 2 x 16 Gbps FC                                                                                     | 2 x 16 Gbps FC                                     | Storage adapters must support the FC protocol, a high-speed network protocol used for data transfer. |
| **Disks**            | Local disk for the OS boot (SAN boot is supported)                                                 | Local disk for the OS boot                         | Boot from SAN requires special consideration due to the multi-path configuration.                    |



| Worker Nodes | Namespaces | CPU Cores | Memory (GB) |
| ------------ | ---------- | --------- | ----------- |
| 10           | 100        | 4         | 8           |
| 25           | 500        | 4         | 16          |
| 100          | 1000       | 8         | 32          |
| 250          | 2000       | 16        | 64          |
| 500          | 4000       | 32        | 128         |

## Prerequisites

- The network must be configured with a bridge network set to `br0`. 

## Limitations

## Enablement

1. In your terminal, use the following command template to SSH into the Palette airgap support VM. Enter the path to
   your private SSH key, username, and the IP or domain of the airgap support VM. The default username is `ubuntu`.

   ```shell
   ssh -i </path/to/private/key> <username>@<vm-ip-or-domain>
   ```

   Consider the following command example for reference.

   ```shell
   ssh -i /docs/ssh-private-key.pem ubuntu@palette.example.com
   ```

2. Execute the following command to switch to the `root` user account.

   ```shell
   sudo --login
   ```

3. Refer to the Palette Additional Packs page to download and
   install the **airgap-pack-virtual-machine-orchestrator** and **airgap-pack-spectro-proxy** packs. You will need these
   packs for both Proxied and Direct network configuration.

4. If you are planning to deploy VMs with direct network access, repeat step three to install a load balancer pack of
   your choice. We recommend installing 
   (**airgap-pack-lb-metallb**), which you can find in
   Palette Additional Packs.

5. Log in to the Palette system console.

6. From the left **Main Menu**, select **Administration**, and then select the **Pack Registries** tab.

7. Select the **three-dots Menu** of **spectro-packs** and click **Sync**.

 

   Once the sync is finished, the newly uploaded packs will be available for use in the tenants that belong to your
   airgapped instance of Palette or Palette VerteX.

## Validate

1. Log in to a tenant that belongs to your airgapped instance of Palette or Palette VerteX.

2. From the left **Main Menu**, select **Profiles** and click **Add Cluster Profile**.

3. Follow the [Create a VMO Profile] guide to start creating a VMO add-on profile.

4. If the Virtual Machine Orchestrator, Spectro Proxy, and, if applicable, your load balancer packs are available to add
   to a cluster profile, then the installation is successful.


