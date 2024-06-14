---
sidebar_label: "Architecture"
title: "Architecture"
description: "Learn about Palette VMO pack and the architecture behind it."
hide_table_of_contents: false
sidebar_position: 0
tags: ["VMO", "architecture"]
---

Palette Virtual Machine Orchestrator (VMO) is a composite solution that includes a variety of tools and technologies for
deploying and managing Virtual Machines (VMs) alongside containerized applications.

This page offers a reference architecture you can implement to create a standard, repeatable, and highly scalable VMO
solution that can be further adapted and customized to fit specific environments.

![Diagram that explains the architecture behind Palette VMO.](/vm-mangement_architecture_arch-diagram.webp)

As referenced in the diagram, Palette VMO leverages the following core technologies:

- **Pure Storage FlashArray** for storage, orchestrated by **Portworx Enterprise** as the Container Storage Interface
  (CSI). Note that, as the bare metal servers contain internal disks, this is not a hyperconverged configuration.

- **Canonical MAAS** to automate the Operating System (OS) and Kubernetes deployment on bare metal.

- **Cilium** to provide network services to containerized workloads. You can also use Cilium with VMs that do not need
  to be exposed on a VLAN, but could be exposed on the pod overlay network instead (in the case of hybrid workloads).

- **Multus** to enable VLAN network access to the VMs.

- **MetalLB** to provide IPs for Kubernetes service resources of type `LoadBalancer`.

- **Nginx** to provide Ingress services to KubeVirt, Prometheus, and application workloads.

- **Prometheus** to collect metrics and **Grafana** to graph the metrics into monitoring dashboards.

## Hardware Resources

Refer to the following table for the minimum and recommended hardware specifications to build a VMO cluster.

| Component            | Minimum                                            | Recommended                                  | Comments                                                                         |
| -------------------- | -------------------------------------------------- | -------------------------------------------- | -------------------------------------------------------------------------------- |
| **Server**           | 2U Rackmount Chassis                               | 2U Rackmount Chassis                         | Needs to fit FC adapters and have sufficient NICs.                               |
| **CPU**              | Intel or AMD x64 CPU with 8 cores                  | Intel or AMD x64 CPU with 8 cores            |                                                                                  |
| **RAM**              | 24 GB                                              | 256 GB or more                               | Assumes the deployment of 20 VMs per node multiplied by the median RAM per VM.   |
| **Network Adapters** | 2 x 10 Gbps <br /> (data + mgmt)                   | 2 x 10 Gbps (data) <br /> 2 x 10 Gbps (mgmt) | Pod overlay runs on the mgmt network.                                            |
| **Storage Adapters** | 2 x 16 Gbps FC                                     | 2 x 16 Gbps FC                               |                                                                                  |
| **Server**           | Local disk for the OS boot (SAN boot is supported) | Local disk for the OS boot                   | Boot from SAN requires special consideration due to the multipath configuration. |

Typically, the cluster control plane nodes do not run any VMO workloads. As a result, the control plane nodes can have
lighter hardware specifications. Meaning, a server with 4 cores and 8 GB RAM is sufficient for a minimum-specification
control plane node.

You can increase the hardware specifications based on the total number of control plane and worker nodes that you want
to have in the cluster. Refer to the following table for guidance on the control plane node sizing. Note that these
recommendations assume that each cluster has at least three control plane nodes.

:::info

A Palette VMO cluster should consist of at least 10 worker nodes to ensure sufficient resource distribution. The
[Portworx Sharedv4 service pod anti-hyperconvergence](https://docs.portworx.com/portworx-enterprise/concepts/shared-volumes#sharedv4-service-pod-anti-hyperconvergence)
setting, which is necessary for seamless storage fallover, requires two nodes to host its persistent storage, and these
two nodes cannot run any VMs. As a result, your VMO cluster needs to have enough nodes, so that there are always at
least two nodes available for the storage failover workload.

:::

| Worker Nodes | Namespaces | CPU Cores | Memory (GB) |
| ------------ | ---------- | --------- | ----------- |
| 10           | 100        | 4         | 8           |
| 25           | 500        | 4         | 16          |
| 100          | 1000       | 8         | 32          |
| 250          | 2000       | 16        | 64          |
| 500          | 4000       | 32        | 128         |

:::tip

For Pure Storage FlashArray, either the
[FlashArray//C](https://www.purestorage.com/products/unified-block-file-storage/flasharray-c.html#specifications) or
[FlashArray//X](https://www.purestorage.com/products/unified-block-file-storage/flasharray-x.html#specifications) models
are compatible with Portworx and suitable for Palette VMO.

:::

## Software Resources

Refer to the following table for the versions of software components we recommend using with Palette VMO.

:::info

You can make substitutions in our software recommendations to better fit your specific use case. For more information on
how you can adapt the recommended software resources, get in touch with our
[Customer Support](https://spectrocloud.atlassian.net/servicedesk/customer/portals).

:::

| Component                             | Software                                               | Recommended Version                                                                                               |
| ------------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| **Bare Metal Deployment**             | Canonical MAAS                                         | 3.4.1                                                                                                             |
| **OS**                                | Canonical Ubuntu                                       | 22.04 LTS                                                                                                         |
| **Multipath Solution**                | multipath-tools                                        | 0.9.4                                                                                                             |
| **Kubernetes**                        | Palette eXtended Kubernetes                            | 1.28.3                                                                                                            |
| **Container Network Interface (CNI)** | Cilium CNI <br /> Multus                               | 1.15.3 <br /> 4.0.2 (included in the VMO pack)                                                                    |
| **Container Storage Interface (CSI)** | Portworx Enterprise CSI <br /> Pure Storage FlashArray | 3.1.1 <br /> [Purity//FA 6.1.4 or higher](https://docs.portworx.com/reference/pure-reference/supported-versions/) |
| **Virtualization**                    | KubeVirt                                               | 1.1.1 (included in the VMO pack)                                                                                  |
| **Image Import**                      | KubeVirt CDI                                           | 1.58.0 (included in the VMO pack)                                                                                 |
| **Storage Snapshots**                 | CSI Snapshot Controller                                | 6.3.2 (included in the VMO pack)                                                                                  |
| **Cluster Balancing**                 | Descheduler                                            | 0.27.1                                                                                                            |
| **Monitoring**                        | Prometheus and Grafana                                 | 55.8.3                                                                                                            |
| **Ingress**                           | Nginx                                                  | 1.9.5                                                                                                             |
| **Load Balancing**                    | MetalLB                                                | 0.13.12                                                                                                           |

## Network Configuration

Compared to the standard Kubernetes clusters, networking for Palette VMO can require additional configuration especially
if your VMs will need to be accessible on the existing VLANs. As this configuration requires bypassing the typical
Kubernetes pod networking stack, we use Multus for networking in Palette VMO.

This also implies additional requirements for the work node host network configuration, in order to have valid network
targets for the VMs.

Refer to the following table for an example network configuration.

| Network                     | VLAN ID       | Network CIDR   | Gateway    |
| --------------------------- | ------------- | -------------- | ---------- |
| **Bare Metal Deployment**   | 0 (native)    | 192.168.0.0/22 |            |
| **Kubernetes Hosts (mgmt)** | 10            | 172.16.0.0/22  |            |
| **End-user Access (data)**  | 20            | 10.20.30.0/16  | 10.20.30.1 |
| **Pod Overlay**             | N/A (virtual) | 100.64.0.0/18  |            |
| **Cluster Services**        | N/A (virtual) | 100.64.64.0/18 |            |
| **Existing VM VLANs**       | 21 – 100      |                |            |

MetalLB can use the **End-user Access** network to publish non-virtualized apps in the following ways:

- As a network, on which to advertise IP addresses, as
  [Layer 2 advertisements](https://metallb.universe.tf/concepts/layer2/).

- As a BGP network, where it can
  [advertise BGP addresses](https://access.redhat.com/webassets/avalon/d/OpenShift_Container_Platform-4.10-Networking-en-US/images/afe4598d665b24b7a193bfd5b4440d48/209_OpenShift_BGP_0122.png)
  to BGP routers.

You can select either approach depending on your network equipment.

:::tip

We recommend using a dedicated VLAN for end-user access and not sharing it with VLANs used by VMs. While it is possible
to share the same VLAN for VMs and containers, you must be cautios when this VLAN also has the default gateway.

:::

Refer to the following table for an example host network configuration, which uses a total of 4 NICs in 2 bonds and fits
with our recommended VMO network configuration.

| Interface        | Type   | Contents             | VLAN   | CIDR           | Gateway    |
| ---------------- | ------ | -------------------- | ------ | -------------- | ---------- |
| **bond_mgmt**    | Bond   | enp1s0 <br /> enp2s0 | Native | 192.168.0.0/22 |            |
| **bond_mgmt.10** | VLAN   | bond_mgmt            | 10     | 172.16.0.0/22  |            |
| **bond_data**    | Bond   | enp1s1 <br /> enp2s1 | Native |                |            |
| **bond_data.20** | VLAN   | bond_data            | 20     | 10.20.30.0/16  | 10.20.30.1 |
| **br0**          | Bridge | bond_data            | Native |                |            |

The **br0** bridge interface is used as a master interface by Multus to automatically create VLAN interfaces for VMs. In
this scenario, the master interface must be a bridge, as no other type will work.

This setup also assumes that the physical servers (the worker nodes) have four physical network interfaces that are
connected to the switch as described in the following table.

| Physical Port     | Name in OS | Purpose                                              | Switchport Configuration |
| ----------------- | ---------- | ---------------------------------------------------- | ------------------------ |
| **NIC 1, Port 1** | enp1s0     | PXE boot for OS deployment <br /> Management network | Trunk (allowing 0, 10)   |
| **NIC 1, Port 2** | enp2s0     | Management network                                   | Trunk (allowing 0, 10)   |
| **NIC 2, Port 1** | enp1s1     | Data network                                         | Trunk (allowing 20-100)  |
| **NIC 2, Port 2** | enp2s1     | Data network                                         | Trunk (allowing 20-100)  |

For PXE boot, you can use both an untagged or native VLAN 0 network and a tagged network, such as VLAN 5. However, to
ensure a successful PXE boot on a tagged network, we recommend setting the native VLAN network to the tagged VLAN ID on
the switchport (in our example, this would be 5), so that the PXE boot can work with untagged traffic.

Alternatively, if the serves supports UEFI PXE boot and allows directly setting the VLAN ID for PXE boot, you can also
use this option. In this case, you need to adjust the configuration for **bond_mgmt** to run the `192.168.0.0/22` on a
**bond_mgmt.5** subinterface. However, because it is difficult to achieve PXE boot on a tagged VLAN, we recommend using
a native, or untagged, VLAN for PXE.

The **bond_data.20** subinterface provides outbound connectivity, as it has the default gateway. This is the primary way
to publish services from container workloads to the end users. If there are any specific datacenter networks you want to
reach over the **bond_mgmt.10** subinterface instead, you can configure them through static routes on the
`172.16.0.0/22` subnet in Canonical MAAS. Those routes will be automatically applied by MAAS upon server installation.

For publishing workloads from VMs, you have the wollowing ways:

- Running the VM on the pod network like containers, and publishing the individual VM ports as Kubernetes services on
  the ** bond_data.20** network. In this case, you can use MetalLB to assign IP addresses.

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

For this setup, it is assumed that the physical servers (worker nodes) are connected to the switch as described in the
following table.

| Physical Port     | Name in OS | Purpose                                                                  | Switchport Configuration       |
| ----------------- | ---------- | ------------------------------------------------------------------------ | ------------------------------ |
| **NIC 1, Port 1** | enp1s0     | PXE boot for OS deployment <br /> Management network <br /> Data network | Trunk (allowing 0, 10, 20-100) |
| **NIC 1, Port 2** | enp2s0     | Management network <br /> Data network                                   | Trunk (allowing 0, 10, 20-100) |

In this configuration, VLANs 10 (mgmt) and 20 (data) are not available for use by VMs on the **br0** interface because
the VLAN subinterfaces on the bridge master interface are mutually exclusive with VLAN subinterfaces on the bridge.

If you need to run VMs on the same VLAN as either the mgmt (10) or the data (20) VLAN, you can facilitate this by
changing the network configuration as follows.

| Interface    | Type   | Contents             | VLAN   | CIDR           | Gateway    |
| ------------ | ------ | -------------------- | ------ | -------------- | ---------- |
| **bond0**    | Bond   | enp1s0 <br /> enp2s0 | Native |                |            |
| **bond0.10** | VLAN   | bond0                | 10     | 172.16.0.0/22  |            |
| **br0**      | Bridge | bond0                | Native | 192.168.0.0/22 |            |
| **br0.20**   | VLAN   | br0                  | 20     | 10.20.30.0/16  | 10.20.30.1 |

In this example, VLAN 20 is defined as a subinterface of **br0** instead of on **bond0**. This configuration allows
virtual machines to also run on VLAN 20 without conflicts.

## Storage Configuration

This section provides the minimum requirements for Kubernetes storage on KubeVirt, as well as an example implementation
based on Portworx and Pure Flash Array that was validated for this reference architecture.

:::info

While we have validated the Portworx and Pure Flash Array solution, it is not the only viable approach. You can also
configure a reliable VMO cluster with other storage solutions, such as NetApp, DellEMC PowerFlex, and Rook-Ceph.

:::

### Live Migration

The core requirement for Kubernetes storage for KubeVirt is the support for persistent volumes with a `ReadWriteMany`
(RWX) access mode. This is because a VM live migration is possible only with RWX volumes, and live migration is a common
requirement for running VMs in production requirements.

Most storage providers support RWX access for persistent volumes in one access mode, either `Block` or `FileSystem`.
Refer to the following list of storage providers that offer the necessary support.

| Storage Provider               | Version     | RWX Access Mode |
| ------------------------------ | ----------- | --------------- |
| Portworx Enterprise            | 2.x and 3.x | `FileSystem`    |
| Rook-Ceph                      | 1.11.x      | `Block`         |
| Longhorn                       | 1.5.x       | `FileSystem`    |
| Netapp Trident                 | 23.x        | `FileSystem`    |
| Dell CSM Operator - PowerFlex  | 2.10.0      | `Block`         |
| Dell CSM Operator - PowerMax   | 2.10.0      | `Block`         |
| Dell CSM Operator - PowerStore | 2.10.0      | `Block`         |

### Kubernetes Upgrades

Distributed Kubernetes storage solutions, such as Rook-Ceph and Portworx, enable hyper-converged infrastructures where
the storage is provided by aggregating local disks in servers (or LUNs from traditional storage arrays) and providing
distributed storage logic on top of it, similar to VMware vSAN. When using this approach for Palette-managed clusters,
you need to take additional steps to prevent data loss during Kubernetes upgrades.

When upgrading OS and Kubernetes versions, Palette used the repave method. Under the repave method, a cluster node is
gracefully removed from the cluster, and then replaced by a new node with upgraded OS and Kubernetes. To learn more
about the repave method, refer to
[Repave Behavior and Configuration](https://docs.spectrocloud.com/clusters/cluster-management/node-pool/#repave-behavior-and-configuration).

This presents a challenge for hyper-converged clusters, because every node repave causes a significant amount of storage
I/O as the data from the lost node is being rebuilt. To ensure that bare metal Palette clusters with hyper-converged
storage can successfully perform repaves without storage issues, you need to set a fixed worker node pool in Canonical
MAAS. Refer to our
[Reliable Distributed Storage for Bare-Metal CAPI Clusters](https://thenewstack.io/reliable-distributed-storage-for-bare-metal-capi-clusters/)
article for example storage implementation.

### Example Solution

## Next Steps
