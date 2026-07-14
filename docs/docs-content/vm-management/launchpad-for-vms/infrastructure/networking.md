---
sidebar_label: "Networks"
title: "Networks"
description:
  "Manage network attachment definitions and additional network interfaces for virtual machines on the Launchpad for
  VMs appliance."
icon: " "
hide_table_of_contents: false
sidebar_position: 20
tags: ["vmo", "vm launchpad appliance", "infrastructure", "networking"]
---

Virtual Machine Orchestrator (VMO) manages VM networking through Kubernetes Network Attachment Definitions. Every VM
connects to the default pod network for basic cluster connectivity, and you can attach more network interface
controllers (NICs) through network attachment definitions for advanced networking scenarios.

## Network Capabilities

VMO detects the network capabilities available on the cluster at runtime. The capabilities API,
`/api/v1/network-capabilities`, reports which network types the cluster supports.

| **Type**      | **Requires**                 | **Description**                                                               |
| ------------- | ---------------------------- | ----------------------------------------------------------------------------- |
| **Bridge**    | Bridge CNI plugin            | Layer 2 bridged networking. VMs connect to a Linux bridge on the host.        |
| **`macvlan`** | `macvlan` CNI plugin         | Each VM receives its own MAC address on the host's physical network.          |
| **SR-IOV**    | SR-IOV device plugin and CNI | Hardware-accelerated networking through PCI passthrough of virtual functions. |

:::info

Available network types depend on the CNI plugins installed on the cluster. If a network type is not available, the
corresponding option does not appear in the UI.

:::

## Network Attachment Definitions

A Network Attachment Definition (NAD) defines how the appliance configures more network interfaces for VMs. Each NAD is
a namespace-scoped Kubernetes resource.

### Create a NAD

1. From the VMO left main menu, select **Infrastructure** > **Networks**.

2. Select **Create Network**.

3. Configure the following fields.

   | **Field**                               | **Description**                                                                                            |
   | --------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
   | **Name**                                | The NAD name. The name must follow Kubernetes naming rules: lowercase, alphanumeric, and hyphens.          |
   | **Namespace**                           | The namespace in which the appliance creates the NAD.                                                      |
   | **Type**                                | Bridge, `macvlan`, or SR-IOV.                                                                              |
   | **Bridge name** (Bridge type)           | The name of the Linux bridge on the host.                                                                  |
   | **Host interface** (`macvlan` type)     | The host network interface to attach to.                                                                   |
   | **Resource name** (SR-IOV type)         | The SR-IOV device plugin resource.                                                                         |
   | **VLAN ID** _(Optional)_                | The 802.1Q VLAN tag.                                                                                       |

### Bulk Create VLANs

For environments that need many VLANs, VMO supports bulk creation.

1. On the **Networks** page, select **Bulk Create**.

2. Specify the base NAD name, namespace, and bridge or host interface.

3. Enter a VLAN range, for example, `100-110`.

4. VMO creates one NAD per VLAN ID, named `{base}-vlan{id}`.

:::tip

Bulk VLAN creation is useful for environments with pre-configured trunk ports where each VLAN needs its own NAD.

:::

### Delete a NAD

The appliance blocks deletion of a NAD that a running VM references. VMO checks for references and displays a conflict
dialog that lists the VMs using the NAD.

## How VMs Use Networks

Every VM connects to the default **pod network** automatically. The default pod network provides basic cluster
connectivity through the Kubernetes CNI, typically Cilium.

Attach more NICs during VM creation in the **Network** step.

1. The default pod network appears first in the list.

2. Select **Add Network** to attach another NIC.

3. Select a NAD from the available networks in the VM's namespace.

4. _(Optional)_ Enter a static MAC address.

5. For batch VM creation, use **Static IP fill-down** to auto-assign sequential IP addresses across VMs.

### Network Configuration in Templates

Templates can include network configuration. When you create a VM from a template, the wizard pre-populates the network
settings. If the template references a NAD that does not exist in the target namespace, the wizard displays a warning
with a quick-create link.

## SR-IOV Networking

SR-IOV provides near-native network performance by passing a Virtual Function (VF) directly to the VM through PCI
passthrough.

### Prerequisites

- SR-IOV capable NICs on compute nodes.

- SR-IOV device plugin installed and configured.

- Virtual Functions configured on the host and visible in node hardware metrics.

### Monitor SR-IOV

The node detail page shows the following SR-IOV metrics.

| **Metric**         | **Description**                                                     |
| ------------------ | ------------------------------------------------------------------- |
| **VFs configured** | The number of Virtual Functions currently active per interface.     |
| **VFs total**      | The number of Virtual Functions each interface supports.            |

These metrics come from the `vmo-node-agent` DaemonSet, which reads `/sys/class/net/*/device/sriov_numvfs` and
`/sys/class/net/*/device/sriov_totalvfs`.

:::warning

Changing SR-IOV Virtual Function counts on a node requires careful coordination. Stop or migrate any VM using a Virtual
Function from that interface before you make changes.

:::

## Resources

- [Network Configuration Considerations](../vmo-networking.md)

- [Initial Configuration of Launchpad for VMs](../getting-started-wiz.md)
