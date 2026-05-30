---
sidebar_label: "VMO Network Configuration Considerations"
title: "VMO Network Configuration Considerations"
description: "Learn about VMO Network Configuration Considerations"
icon: " "
hide_table_of_contents: false
sidebar_position: 0
draft: true
tags: ["vmo", "vm launchpad", "networking", "design"]
---

<!-- vale off -->

# Network Configuration Considerations

Networking for the VMO use case requires some extra care compared to a regular Kubernetes cluster. That is because in
most cases, VMs may need to be made accessible on existing VLANs. This requires bypassing the typical Kubernetes pod
networking stack altogether.

For VMO, Multus is used to provide a way to achieve that goal. It does mean that there are some requirements for the
host network configuration and for the Kubernetes worker nodes in order to have valid network targets to bridge the VMs
onto.

## Two NICs, One Bond Configuration

When limited to network interfaces, you can configure your NICs to have a single bond and a single bridge, but multiple
VLAN options. The following table and image present one possible example.

| Interface  | Type           | Consisting of     | VLAN   | CIDR           | Gateway    |
| ---------- | -------------- | ----------------- | ------ | -------------- | ---------- |
| `bond0`    | Bond (802.3ad) | `enp1s0` `enp2s0` | native | N/A            | N/A        |
| `bond0.10` | VLAN           | `bond0`           | 10     | 172.16.0.0/22  | None       |
| `bond0.20` | VLAN           | `bond0`           | 20     | 10.20.30.0/16  | 10.20.30.1 |
| `br0`      | Bridge         | `bond0`           | native | 192.168.0.0/22 | None       |

![diagram of vlan bridge spread](/vmo/vm-management_vmo_networking-vlan-2nics-one-bridge-4-9.webp)

For this example it is assumed that the physical servers network cards are connected to the physical switch with the
following configuration.

| Physical port | Name in OS | Purpose                                                        | Switch port config            |
| ------------- | ---------- | -------------------------------------------------------------- | ----------------------------- |
| NIC 1, Port 1 | `enp1s0`   | PXEBoot for OS deployment, Management network and Data network | Trunk (allowing 0,10, 20-100) |
| NIC 1, Port 2 | `enp2s0`   | Management network and Data network                            | Trunk (allowing 0,10, 20-100) |

For this configuration, VLANs 10 and 20 are unavailable to virtual machines on the `br0` interface. VLANs 10 and 20 are
already captured by `bond.10` and `bond.20` subinterfaces. This means traffic would never reach the bridge interface. If
virtual machines need to be able to run on the same VLAN as either the management VLAN (10) or the data VLAN (20), this
can be facilitated by changing the configuration similar to the following example.

| Interface  | Type   | Consisting of     | VLAN   | CIDR                     | Gateway |
| ---------- | ------ | ----------------- | ------ | ------------------------ | ------- |
| `bond0`    | Bond   | `enp1s0` `enp2s0` | native | N/A                      | N/A     |
| `bond0.10` | VLAN   | `bond0`           | 10     | 172.16.0.0/22            | None    |
| `br0`      | Bridge | `bond0`           | native | 192.168.0.0/22           | None    |
| `br0.20`   | VLAN   | `br0`             | 20     | 10.20.30.0/16 10.20.30.1 | None    |

![diagram of vlan bridge spread](/vmo/vm-management_vmo_networking-vlan-2nics-spread-bridge-4-9.webp)

We have defined VLAN 20 as a subinterface of br0 instead of on bond0. This configuration allows virtual machines to also
run on VLAN 20 without conflict.

To allow traffic on `br0.20`, a special feature must be enabled in the charts.virtual-machine-orchestrator.vlanFiltering
section of the VMO layer in the Cluster Profile. Specifically: ● The allowVlansOnSelf parameter needs to be set to
“true.” ● The allowedVlansOnSelf parameter needs to be set to the combined range of VLAN IDs allowed for use by VMs, and
the range of VLAN IDs to be used on the host itself. If for some reason the Kubernetes nodes do not run on a VLAN
subinterface, but on the br0 interface directly, you must enable the “Run Cilium OnBridge (br0)” preset in the Cilium
pack.

## Four NICs, Two Bond Configuration

As an example, consider the following.

| Network                         | VLAN ID       | Network CIDR   | Gateway    |
| ------------------------------- | ------------- | -------------- | ---------- |
| Bare metal deployment           | 0 (native)    | 192.168.0.0/22 | None       |
| Kubernetes hosts (mgmt)         | 10            | 172.16.0.0/22  | None       |
| End user access (data)          | 20            | 10.20.30.0/16  | 10.20.30.1 |
| Pod overlay network             | N/A (virtual) | 100.64.0.0/18  | None       |
| Cluster services network        | N/A (virtual) | 100.64.64.0/18 | None       |
| Existing VLANs for VMs 21 - 100 | N/A           | N/A            | N/A        |

The end user access network can be used for publishing non-VM apps in two different ways by MetalLB. It can be used as a
network to advertise IP addresses directly onto, as Layer 2 advertisements, or as a BGP network, where MetalLB can
advertise BGP addresses to BGP routers.

Either of these options can be chosen, depending on the network equipment used. It is recommended to use a dedicated
VLAN for end-user access to Kubernetes services, which is not shared with VLANs used by VMs.

While it is possible to share the same VLAN for VMs and Kubernetes, special considerations must be taken into account if
this VLAN also has the default gateway. The following network configuration on the host, using a total of 4 NICs in 2
bonds, is suitable for the setup described above.

| Interface      | Type           | Consisting of     | VLAN   | CIDR           | Gateway    |
| -------------- | -------------- | ----------------- | ------ | -------------- | ---------- |
| `bond_mgmt`    | Bond (802.3ad) | `enp1s0` `enp2s0` | native | 192.168.0.0/22 | None       |
| `bond_mgmt.10` | VLAN           | bond_mgmt         | 10     | 172.16.0.0/22  | None       |
| `bond_data`    | Bond (802.3ad) | `enp1s1` `enp2s1` | native | N/A            | N/A        |
| `bond_data.20` | VLAN           | bond_data         | 20     | 10.20.30.0/16  | 10.20.30.1 |
| `br0`          | Bridge         | bond_data         | native | N/A            | N/A        |

![diagram of vlan bridge spread](/vmo/vm-management_vmo_networking-vlan-4nics-2bonds-4-9.webp)

The `br0` bridge interface serves as the master interface for Multus, on which Multus can automatically create VLAN
interfaces as needed to place virtual machines. The master interface for this scenario must be a bridge interface. It
does not work with any other type.

The bond interface that the `br0` interface is put on top of `bond_data`, and can only support the following bonding
modes.

| Bond mode | Description                                           |
| --------- | ----------------------------------------------------- |
| Mode 1    | active-backup (does not require switch configuration) |
| Mode 2    | balance-xor (requires switch configuration)           |
| Mode 4    | 802.3ad (requires switch LACP configuration)          |

Our recommendation for best performance is the 802.3ad mode, as this fully aggregates the bandwidth of the links.

The other modes (0, 3, 5 and 6) are not supported for VLAN bridging due to broadcast storms, MAC address rewrites or
poor TCP stream performance.

For a four-NIC, two-bond configuration, the four physical network interfaces connect to the physical switch similar to
the following example.

| Physical port | Name in OS | Purpose                   | Switch port config   |
| ------------- | ---------- | ------------------------- | -------------------- |
| NIC 1, Port 1 | `enp1s0`   | PXEBoot for OS deployment and Management network   | Trunk (VLANs 0,10) |
| NIC 1, Port 2 | `enp2s0`   | Management network        | Trunk (VLANs 0,10)   |
| NIC 2, Port 1 | `enp1s1`   | Data network              | Trunk (VLANs 20-100) |
| NIC 2, Port 2 | `enp2s1`   | Data network              | Trunk (VLANs 20-100) |

The VLAN 0 (untagged/native) network for PXE boot can also be a tagged VLAN network (for example, VLAN 5). However, to
ensure you can successfully PXE boot on that network, it is recommended to set the native VLAN on the switch port to
that VLAN ID (VLAN 5 in this case), so that the PXE boot can work with untagged traffic.

Alternatively, if the server supports UEFI PXE booting and allows setting the VLAN ID for PXE boot directly, that can
also be used.

In that case,the configuration for bond_mgmt above needs to be adjusted to run the 192.168.0.0/22 IP address on a
`bond_mgmt.5` subinterface. PXE booting on a tagged VLAN is difficult to accomplish in practice.

We recommend using a native (untagged) VLAN for PXE. The `bond_data.20` subinterface provides outbound connectivity as
it has the default gateway. This is the primary way to publish services from container workloads to end users. Any
specific datacenter networks we want to reach over the `bond_mgmt.10` subinterface can be configured through static
routes on the 172.16.0.0/22 subnet.

For publishing workloads from virtual machines, there are two options.

    1. Place the entire VM on a VLAN, using Multus to assign the VM to a VLAN on top of the br0 interface. It is then the responsibility of the VM itself (for static IPs) or the network (for DHCP) to assign IP addresses. This is the most widely used and recommended option.

    2. Run the virtual machine on the pod network, as if it were a container, and publish individual ports of the VM as Kubernetes services either inside the cluster only or also externally on the `bond_data.20` network, using MetalLB to assign IP addresses.

This approach is only suitable for workloads that can handle network disruptions well, as live migrations of VMs running
on the pod network will terminate the existing network connections to those VMs.
