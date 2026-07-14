---
sidebar_label: "Network Configuration Considerations"
title: "Network Configuration Considerations"
description: "Learn about VMO Network Configuration Considerations"
icon: " "
hide_table_of_contents: false
sidebar_position: 9
tags: ["vmo", "launchpad for vms", "networking", "design"]
---

Networking for the VMO use case requires extra care compared to a regular Kubernetes cluster. In most cases, VMs need to
be accessible on existing VLANs. Accessing existing VLANs requires bypassing the typical Kubernetes pod networking
stack.

For the Launchpad for VMs appliance, Cilium provides the mechanism to achieve that goal. Cilium requires specific host
network configuration on the Kubernetes worker nodes to provide valid network targets to bridge the VMs onto.

## Supported Configurations

Launchpad for VMs supports two host network configurations.

- **Four NICs, two bonds.** Two NICs bonded for management and Kubernetes cluster traffic, and two NICs bonded for VM
  data traffic. This is the recommended configuration for production deployments.

- **Two NICs, one bond, plus two Fiber Channel (FC) storage adapters.** Two NICs bonded to carry management, cluster,
  and VM data traffic, with two Fiber Channel adapters dedicated to storage. Use this configuration when only two
  network adapters are available.

Both configurations require a `br0` bridge interface that Cilium uses as the parent interface for VM VLAN attachments.
Alternative configurations may work, but Spectro Cloud does not test or support them.

Review the following sections before installing Launchpad for VMs so that you can prepare your host network and switch
port configuration.

## Management and Cluster Traffic

Launchpad for VMs hosts can use separate network interfaces for management traffic and Kubernetes cluster traffic.
Management traffic includes Local UI access, communication between hosts, and content synchronization.

You can configure the management interface in the Edge Installer `user-data` file. A selection made in the TUI overrides
the value from `user-data`. After initial setup, a selection made in Local UI overrides the value from the TUI. If you
do not select a management interface, the host uses the network interface associated with the default route.

Kubernetes cluster traffic uses the interface you select during cluster creation. Kubernetes cluster traffic includes
node IP selection, Kubernetes control plane traffic, etcd traffic, and traffic for the cluster virtual IP address (VIP).
For Launchpad for VMs, this is the interface selected in the **Cilium and MetalLB interface** field.

:::warning

Selecting a management interface or a cluster traffic interface does not change how the host routes network traffic. If
two or more adapters use the same subnet and each adapter has a default route, traffic may leave through a different
adapter than expected. This behavior may prevent control plane nodes from successfully joining the cluster.

For best results, place management and cluster traffic on separate subnets and configure both interfaces explicitly.

:::

## Two NICs, One Bond Plus Two Fiber Channel Adapters

When network interfaces are limited, you can configure NICs with a single bond (`bond0`) and bridge (`br0`) that carry
many VLANs. This configuration requires two Fiber Channel adapters dedicated to storage. The following table and image
present one possible example.

<!-- vale off -->

| Interface  | Type           | Consisting of     | VLAN   | CIDR           | Gateway    |
| ---------- | -------------- | ----------------- | ------ | -------------- | ---------- |
| `bond0`    | Bond (802.3ad) | `enp1s0` `enp2s0` | native | N/A            | N/A        |
| `bond0.10` | VLAN           | `bond0`           | 10     | 172.16.0.0/22  | None       |
| `bond0.20` | VLAN           | `bond0`           | 20     | 10.20.30.0/16  | 10.20.30.1 |
| `br0`      | Bridge         | `bond0`           | native | 192.168.0.0/22 | None       |

<!-- vale on -->

![Diagram of VLAN bridge spread across two NICs on one bond.](/vmo/vm-management_vmo_networking-vlan-2nics-one-bridge-4-9.webp)

For this example, the physical servers network cards connect to the physical switch with the following configuration.

| Physical port | Name in OS | Purpose                                                          | Switch port config             |
| ------------- | ---------- | ---------------------------------------------------------------- | ------------------------------ |
| NIC 1, Port 1 | `enp1s0`   | PXE boot for OS deployment, Management network, and Data network | Trunk (allowing 0, 10, 20-100) |
| NIC 1, Port 2 | `enp2s0`   | Management network and Data network                              | Trunk (allowing 0, 10, 20-100) |

VMs connected to `br0` cannot use VLAN 10 or VLAN 20 because the `bond0.10` and `bond0.20` subinterfaces intercept
traffic for those VLANs before it reaches the bridge. If VMs require access to the management VLAN (10) or data VLAN
(20), update the configuration as shown in the following example and diagram.

<!-- vale off -->

| Interface  | Type   | Consisting of     | VLAN   | CIDR                     | Gateway |
| ---------- | ------ | ----------------- | ------ | ------------------------ | ------- |
| `bond0`    | Bond   | `enp1s0` `enp2s0` | native | N/A                      | N/A     |
| `bond0.10` | VLAN   | `bond0`           | 10     | 172.16.0.0/22            | None    |
| `br0`      | Bridge | `bond0`           | native | 192.168.0.0/22           | None    |
| `br0.20`   | VLAN   | `br0`             | 20     | 10.20.30.0/16 10.20.30.1 | None    |

<!-- vale on -->

![Diagram of VLAN bridge spread with VLAN 20 as a br0 subinterface.](/vmo/vm-management_vmo_networking-vlan-2nics-spread-bridge-4-9.webp)

The example defines VLAN 20 as a subinterface of `br0` instead of `bond0`. This configuration allows VMs to run on VLAN
20 without conflict.

To allow traffic on `br0.20`, configure the `charts.virtual-machine-orchestrator.vlanFiltering` section of the VMO layer
in the cluster profile by setting `allowVlansOnSelf` to `true`, and configure `allowedVlansOnSelf` to include both the
VLAN IDs available to VMs and the VLAN IDs used by the host. If the Kubernetes nodes connect directly to `br0` rather
than a VLAN subinterface, also enable the **Run Cilium OnBridge (br0)** preset in the Cilium pack.

## Four NICs, Two Bonds

As an example, consider the following.

| Network                           | VLAN ID       | Network CIDR   | Gateway    |
| --------------------------------- | ------------- | -------------- | ---------- |
| Bare metal deployment             | 0 (native)    | 192.168.0.0/22 | None       |
| Kubernetes hosts (management)     | 10            | 172.16.0.0/22  | None       |
| End user access (data)            | 20            | 10.20.30.0/16  | 10.20.30.1 |
| Pod overlay network               | N/A (virtual) | 100.64.0.0/18  | None       |
| Cluster services network          | N/A (virtual) | 100.64.64.0/18 | None       |
| Existing VLANs for VMs (21 - 100) | N/A           | N/A            | N/A        |

MetalLB can publish the end user access network for non-VM applications in two ways. MetalLB can use the network to
advertise IP addresses directly, through Layer 2 advertisements, or as a BGP network, where MetalLB advertises BGP
addresses to BGP routers.

You can choose either option depending on the network equipment used. We recommend a dedicated VLAN for end-user access
to Kubernetes services that VMs do not share.

You can share the same VLAN for VMs and Kubernetes, but this configuration requires extra considerations if this VLAN
also has the default gateway. The following network configuration on the host, using a total of four NICs in two bonds,
is suitable for the setup described.

<!-- vale off -->

| Interface      | Type           | Consisting of     | VLAN   | CIDR           | Gateway    |
| -------------- | -------------- | ----------------- | ------ | -------------- | ---------- |
| `bond_mgmt`    | Bond (802.3ad) | `enp1s0` `enp2s0` | native | 192.168.0.0/22 | None       |
| `bond_mgmt.10` | VLAN           | `bond_mgmt`       | 10     | 172.16.0.0/22  | None       |
| `bond_data`    | Bond (802.3ad) | `enp1s1` `enp2s1` | native | N/A            | N/A        |
| `bond_data.20` | VLAN           | `bond_data`       | 20     | 10.20.30.0/16  | 10.20.30.1 |
| `br0`          | Bridge         | `bond_data`       | native | N/A            | N/A        |

<!-- vale on -->

![Diagram of VLAN bridge spread across four NICs in two bonds.](/vmo/vm-management_vmo_networking-vlan-4nics-2bonds-4-9.webp)

<!-- vale off -->

The `br0` bridge interface serves as the parent interface for Cilium, on which Cilium can automatically create VLAN
interfaces as needed to place VMs. The parent interface for this scenario must be a bridge interface. Cilium does not
work with any other type.

<!-- vale on -->

The `br0` interface sits on top of the `bond_data` bond interface, which supports only the following bonding modes.

| Bond mode | Description                                             |
| --------- | ------------------------------------------------------- |
| Mode 1    | `active-backup` (does not require switch configuration) |
| Mode 2    | `balance-xor` (requires switch configuration)           |
| Mode 4    | `802.3ad` (requires switch LACP configuration)          |

We recommend `802.3ad` mode for best performance, as this mode fully aggregates the bandwidth of the links.

The other modes (0, 3, 5, and 6) do not support VLAN bridging due to broadcast storms, MAC address rewrites, or poor TCP
stream performance.

For a four-NIC, two-bond configuration, the four physical network interfaces connect to the physical switch as shown in
the following example.

<!-- vale off -->

| Physical port | Name in OS | Purpose                                           | Switch port config   |
| ------------- | ---------- | ------------------------------------------------- | -------------------- |
| NIC 1, Port 1 | `enp1s0`   | PXE boot for OS deployment and Management network | Trunk (VLANs 0, 10)  |
| NIC 1, Port 2 | `enp2s0`   | Management network                                | Trunk (VLANs 0, 10)  |
| NIC 2, Port 1 | `enp1s1`   | Data network                                      | Trunk (VLANs 20-100) |
| NIC 2, Port 2 | `enp2s1`   | Data network                                      | Trunk (VLANs 20-100) |

<!-- vale on -->

The VLAN 0 (untagged or native) network for PXE boot can also be a tagged VLAN network, for example, VLAN 5. To ensure
you can successfully PXE boot on that network, we recommend setting the native VLAN on the switch port to that VLAN ID
(VLAN 5 in this case), so that the PXE boot can work with untagged traffic.

If the server supports UEFI PXE booting and allows setting the VLAN ID for PXE boot directly, you can use that option
instead.

<!-- vale off -->

In that case, adjust the configuration for `bond_mgmt` in the preceding example to run the 192.168.0.0/22 IP address on
a `bond_mgmt.5` subinterface. PXE booting on a tagged VLAN is difficult in practice.

<!-- vale on -->

We recommend using a native (untagged) VLAN for PXE. The `bond_data.20` subinterface provides outbound connectivity
because it has the default gateway. The `bond_data.20` subinterface is the primary way to publish services from
container workloads to end users. To reach specific data center networks over the `bond_mgmt.10` subinterface, configure
static routes on the `172.16.0.0/22` subnet.

For publishing workloads from VMs, you have two options.

1. Place the entire VM on a VLAN, using Cilium to assign the VM to a VLAN on top of the `br0` interface. The VM itself
   (for static IPs) or the network (for DHCP) then assigns IP addresses. This is the most widely used and recommended
   option.

2. Run the VM on the pod network, as if it were a container, and publish individual ports of the VM as Kubernetes
   services either inside the cluster or externally on the `bond_data.20` network. MetalLB assigns the IP addresses.

The second option is only suitable for workloads that can handle network disruptions well. Live migrations of VMs
running on the pod network end the existing network connections to those VMs.
