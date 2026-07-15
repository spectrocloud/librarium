---
sidebar_label: "Networks"
title: "Networks"
description:
  "Manage network attachment definitions and additional network interfaces for virtual machines on the Launchpad for VMs
  appliance."
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

| **Type**         | **Requires**                  | **Description**                                                                                  |
| ---------------- | ----------------------------- | ------------------------------------------------------------------------------------------------ |
| **Linux Bridge** | Bridge CNI plugin             | Layer 2 bridged networking. VMs connect to a Linux bridge on the host.                           |
| **`macvlan`**    | `macvlan` CNI plugin          | Each VM receives its own MAC address on the host's physical network.                             |
| **`ipvlan`**     | `ipvlan` CNI plugin           | VMs share the host's MAC address but receive unique IP addresses on the host's physical network. |
| **SR-IOV**       | SR-IOV device plugin and CNI  | Hardware-accelerated networking through PCI passthrough of virtual functions.                    |
| **Custom JSON**  | Any CNI plugin on the cluster | Supply a raw CNI plugin configuration when the built-in types don't fit your use case.           |

:::info

Available network types depend on the CNI plugins installed on the cluster. Types the cluster doesn't support appear
grayed out in the UI.

:::

## Network Attachment Definitions

A Network Attachment Definition (NAD) defines how the appliance configures more network interfaces for VMs. Each NAD is
a namespace-scoped Kubernetes resource.

### Create a NAD

1. From the VMO left main menu, select **Infrastructure** > **Networks**.

2. Select **Create Network**.

3. Configure the common fields.

   | **Field**        | **Description**                                                                                   |
   | ---------------- | ------------------------------------------------------------------------------------------------- |
   | **Name**         | The NAD name. The name must follow Kubernetes naming rules: lowercase, alphanumeric, and hyphens. |
   | **Namespace**    | The namespace in which the appliance creates the NAD.                                             |
   | **Network Type** | Linux Bridge, `macvlan`, `ipvlan`, SR-IOV, or Custom JSON.                                        |

4. Configure the fields for the selected **Network Type**.

   <Tabs groupId="network-type">

   <TabItem value="linux-bridge" label="Linux Bridge">

   | **Field**                           | **Description**                                                                                                                                          |
   | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Bridge Name**                     | The Linux bridge on the host. The bridge must already exist on the nodes.                                                                                |
   | **VLAN Mode**                       | **Access** for a single untagged VLAN. **Trunk** carries many tagged VLANs and creates one NAD per VLAN ID you enter.                                    |
   | **VLAN ID** _(Optional)_            | The 802.1Q VLAN tag. Accepts a single ID (for example, `100`), a comma-separated list, or a range (for example, `100-105`).                              |
   | **IPAM Configuration** _(Optional)_ | An IPAM plugin configuration in JSON, for example, `{"type": "host-local", "subnet": "10.10.0.0/24"}`. Leave empty to rely on manual or DHCP addressing. |

   </TabItem>

   <TabItem value="macvlan" label="macvlan">

   | **Field**                           | **Description**                                                                                                                                          |
   | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Master Interface**                | The host network interface to attach to.                                                                                                                 |
   | **VLAN ID** _(Optional)_            | The 802.1Q VLAN tag. Accepts a single ID (for example, `100`), a comma-separated list, or a range (for example, `100-105`).                              |
   | **IPAM Configuration** _(Optional)_ | An IPAM plugin configuration in JSON, for example, `{"type": "host-local", "subnet": "10.10.0.0/24"}`. Leave empty to rely on manual or DHCP addressing. |

   </TabItem>

   <TabItem value="ipvlan" label="ipvlan">

   | **Field**                           | **Description**                                                                                                                                          |
   | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Master Interface**                | The host network interface to attach to.                                                                                                                 |
   | **VLAN ID** _(Optional)_            | The 802.1Q VLAN tag. Accepts a single ID (for example, `100`), a comma-separated list, or a range (for example, `100-105`).                              |
   | **IPAM Configuration** _(Optional)_ | An IPAM plugin configuration in JSON, for example, `{"type": "host-local", "subnet": "10.10.0.0/24"}`. Leave empty to rely on manual or DHCP addressing. |

   </TabItem>

   <TabItem value="sr-iov" label="SR-IOV">

   :::info

   This tab needs an SR-IOV screenshot from a host that exposes SR-IOV Virtual Functions. Update it once you capture the
   dialog fields.

   :::

   </TabItem>

   <TabItem value="custom-json" label="Custom JSON">

   Provide the full CNI plugin configuration in the required **CNI Config JSON** field. Selecting **Custom JSON** hides
   the type-specific and networking fields (**Bridge Name**, **Master Interface**, **VLAN Mode**, **VLAN ID**, and
   **IPAM Configuration**).

   </TabItem>

   </Tabs>

   For all network types except Custom JSON, the **Generated Config (preview)** panel updates as you edit the fields so
   you can review the resulting NAD configuration before you create it.

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

| **Metric**         | **Description**                                                 |
| ------------------ | --------------------------------------------------------------- |
| **VFs configured** | The number of Virtual Functions currently active per interface. |
| **VFs total**      | The number of Virtual Functions each interface supports.        |

These metrics come from the `vmo-node-agent` DaemonSet, which reads `/sys/class/net/*/device/sriov_numvfs` and
`/sys/class/net/*/device/sriov_totalvfs`.

:::warning

Changing SR-IOV Virtual Function counts on a node requires careful coordination. Stop or migrate any VM using a Virtual
Function from that interface before you make changes.

:::

## Resources

- [Network Configuration Considerations](../vmo-networking.md)

- [Initial Configuration of Launchpad for VMs](../getting-started-wiz.md)
