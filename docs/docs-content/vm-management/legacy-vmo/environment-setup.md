---
sidebar_label: "Environment Setup"
title: "Environment Setup"
description: "Learn about Palette VMO pack and the architecture behind it."
hide_table_of_contents: false
sidebar_position: 5
tags: ["vmo", "environment-setup"]
---

This page provides reference specifications for the Palette Virtual Machine Orchestrator (VMO) hardware and network
resources.

## Hardware Resources

The following sections list the hardware requirements for worker nodes and control plane nodes in a VMO cluster.

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

| Worker Nodes | Namespaces | CPU Cores | Memory (GB) |
| ------------ | ---------- | --------- | ----------- |
| 10           | 100        | 4         | 8           |
| 25           | 500        | 4         | 16          |
| 100          | 1000       | 8         | 32          |
| 250          | 2000       | 16        | 64          |
| 500          | 4000       | 32        | 128         |

## Network Configuration

Compared to the standard Kubernetes clusters, networking for Palette VMO can require additional configuration,
especially if your VMs need to be accessible on the existing VLANs. As this configuration requires bypassing the typical
Kubernetes pod networking stack, we use Multus for networking in Palette VMO.

This also implies additional requirements for the host network configuration of worker nodes in order to have valid
network targets for the VMs.

Refer to the following table for an example of network configuration.

| Network                           | VLAN ID       | Network CIDR   | Gateway    |
| --------------------------------- | ------------- | -------------- | ---------- |
| **Bare Metal Deployment**         | 0 (native)    | 192.168.0.0/22 |            |
| **Kubernetes Hosts (management)** | 10            | 172.16.0.0/22  |            |
| **End-user Access (data)**        | 20            | 10.20.30.0/16  | 10.20.30.1 |
| **Pod Overlay**                   | N/A (virtual) | 100.64.0.0/18  |            |
| **Cluster Services**              | N/A (virtual) | 100.64.64.0/18 |            |
| **Existing VM VLANs**             | 21 – 100      |                |            |

MetalLB can use the **End-user Access** network to publish non-virtualized apps in the following ways:

- As a network on which to advertise IP addresses, as
  [Layer 2 advertisements](https://metallb.universe.tf/concepts/layer2/).

- As a BGP network where it can
  [advertise BGP addresses](https://access.redhat.com/webassets/avalon/d/OpenShift_Container_Platform-4.10-Networking-en-US/images/afe4598d665b24b7a193bfd5b4440d48/209_OpenShift_BGP_0122.png)
  to BGP routers.

You can select either approach depending on your network equipment.

:::tip

We recommend using a dedicated VLAN for end-user access and not sharing it with VLANs used by VMs.

:::

Refer to the following table for an example of a host network configuration, which uses a total of 4 NICs in 2 bonds and
fits with our recommended VMO network configuration.

| Interface            | Type   | Contents             | VLAN   | CIDR           | Gateway    |
| -------------------- | ------ | -------------------- | ------ | -------------- | ---------- |
| `bond_management`    | Bond   | enp1s0 <br /> enp2s0 | Native | 192.168.0.0/22 |            |
| `bond_management.10` | VLAN   | `bond_management`    | 10     | 172.16.0.0/22  |            |
| `bond_data`          | Bond   | enp1s1 <br /> enp2s1 | Native |                |            |
| `bond_data.20`       | VLAN   | `bond_data`          | 20     | 10.20.30.0/16  | 10.20.30.1 |
| **br0**              | Bridge | `bond_data`          | Native |                |            |

The **br0** bridge interface is used as a primary interface by Multus to automatically create VLAN interfaces for VMs.
In this scenario, the primary interface must be a bridge, as no other type will work.

This setup also assumes that the physical servers (the worker nodes) have four physical network interfaces that are
connected to the switch, as described in the following table.

| Physical Port     | Name in OS | Purpose                                              | Switchport Configuration |
| ----------------- | ---------- | ---------------------------------------------------- | ------------------------ |
| **NIC 1, Port 1** | enp1s0     | PXE boot for OS deployment <br /> Management network | Trunk (allowing 0, 10)   |
| **NIC 1, Port 2** | enp2s0     | Management network                                   | Trunk (allowing 0, 10)   |
| **NIC 2, Port 1** | enp1s1     | Data network                                         | Trunk (allowing 20-100)  |
| **NIC 2, Port 2** | enp2s1     | Data network                                         | Trunk (allowing 20-100)  |

For PXE boot, you can use both an untagged or native VLAN 0 network and a tagged network, such as VLAN 5. However, to
ensure a successful PXE boot on a tagged network, we recommend setting the native VLAN network to the tagged VLAN ID on
the switch port (in our example, this would be 5), so that the PXE boot can work with untagged traffic.

Alternatively, if the server supports UEFI PXE boot and allows you to set the VLAN ID for PXE boot directly, you can
also use this option. In this case, you need to adjust the configuration for `bond_management` to operate the
`192.168.0.0/22` CIDR on a `bond_management.5` subinterface. However, because it is difficult to achieve PXE boot on a
tagged VLAN, we recommend using a native or untagged VLAN for PXE.

The `bond_data.20` subinterface provides outbound connectivity, as it has the default gateway. This is the primary way
to publish services from container workloads to the end users. If there are any specific data center networks that you
want to reach over the `bond_management.10` subinterface instead, you can configure them through static routes on the
`172.16.0.0/22` subnet in Canonical MAAS. Those routes will be automatically applied by MAAS upon server installation.

For publishing workloads from VMs, you have the following ways:

- Operating the VM on the pod network like containers and publishing the individual VM ports as Kubernetes services on
  the **bond_data.20** network. In this case, you can use MetalLB to assign IP addresses.

- Placing the entire VM on a VLAN and using Multus to assign the VM to a VLAN on top of the **br0** interface. In this
  case, it's the responsibility of the VM (for static IPs) or the network (for DHCP) to assign IP addresses.

### Limited Alternative

If your setup is limited to two physical network interfaces, you will need to make some adjustments. Assuming the same
networks and VLANs are used, consider the following network configuration example (configured through Canonical MAAS).

| Interface    | Type   | Contents             | VLAN   | CIDR           | Gateway    |
| ------------ | ------ | -------------------- | ------ | -------------- | ---------- |
| **bond0**    | Bond   | enp1s0 <br /> enp2s0 | Native |                |            |
| **bond0.10** | VLAN   | bond0                | 10     | 172.16.0.0/22  |            |
| **bond0.20** | VLAN   | bond0                | 20     | 10.20.30.0/16  | 10.20.30.1 |
| **br0**      | Bridge | bond0                | Native | 192.168.0.0/22 |            |

For this setup, it is assumed that the physical servers (worker nodes) are connected to the switch, as described in the
following table.

| Physical Port     | Name in OS | Purpose                                                                  | Switchport Configuration       |
| ----------------- | ---------- | ------------------------------------------------------------------------ | ------------------------------ |
| **NIC 1, Port 1** | enp1s0     | PXE boot for OS deployment <br /> Management network <br /> Data network | Trunk (allowing 0, 10, 20-100) |
| **NIC 1, Port 2** | enp2s0     | Management network <br /> Data network                                   | Trunk (allowing 0, 10, 20-100) |

In this configuration, VLANs 10 (management) and 20 (data) are not available for use by VMs on the **br0** interface
because the VLAN subinterfaces on the bridge primary interface and VLAN subinterfaces on the bridge are mutually
exclusive.

If you need to operate VMs on the same VLAN as either the management (10) or the data (20) VLAN, you can facilitate this
by changing the network configuration as follows.

| Interface    | Type   | Contents             | VLAN   | CIDR           | Gateway    |
| ------------ | ------ | -------------------- | ------ | -------------- | ---------- |
| **bond0**    | Bond   | enp1s0 <br /> enp2s0 | Native |                |            |
| **bond0.10** | VLAN   | bond0                | 10     | 172.16.0.0/22  |            |
| **br0**      | Bridge | bond0                | Native | 192.168.0.0/22 |            |
| **br0.20**   | VLAN   | br0                  | 20     | 10.20.30.0/16  | 10.20.30.1 |

In this example, VLAN 20 is defined as a subinterface of **br0** instead of on **bond0**. This configuration allows
virtual machines to also operate on VLAN 20 without conflicts.
