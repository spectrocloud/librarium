# Networking

VMO Manager provides network management for virtual machines through Kubernetes Network Attachment Definitions (NADs). VMs can use the default pod network for basic connectivity and additional NICs via NADs for advanced networking scenarios.

## Network Capabilities

VMO Manager detects available network capabilities at runtime from the cluster. The capabilities API (`/api/v1/network-capabilities`) reports which network types are supported:

| Type | Requires | Description |
|------|----------|-------------|
| **Bridge** | Bridge CNI plugin | Layer 2 bridged networking, VMs connect to a Linux bridge on the host |
| **Macvlan** | Macvlan CNI plugin | VMs get their own MAC address on the host's physical network |
| **SR-IOV** | SR-IOV device plugin + CNI | Hardware-accelerated networking via PCI passthrough of virtual functions |

> **Note:** Available network types depend on the CNI plugins installed on the cluster. If a type is not available, the corresponding option is hidden in the UI.

## Network Attachment Definitions

NADs define how additional network interfaces are configured for VMs. They are namespace-scoped Kubernetes resources.

### Creating a NAD

1. Navigate to **Inventory > Networks**
2. Click **Create Network**
3. Configure:
   - **Name** -- must follow Kubernetes naming rules (lowercase, alphanumeric, hyphens)
   - **Namespace** -- the namespace where the NAD will be created
   - **Type** -- Bridge, Macvlan, or SR-IOV
   - **Bridge name** (bridge type) -- name of the Linux bridge on the host
   - **Master interface** (macvlan type) -- host interface to attach to
   - **Resource name** (SR-IOV type) -- the SR-IOV device plugin resource
   - **VLAN ID** (optional) -- 802.1Q VLAN tag

### VLAN Bulk Creation

For environments that need many VLANs, VMO Manager supports bulk creation:

1. Select **Bulk Create** on the Networks page
2. Specify the base NAD name, namespace, bridge or master interface
3. Enter a VLAN range (e.g., 100-110)
4. VMO Manager creates one NAD per VLAN ID, named `{base}-vlan{id}`

> **Tip:** VLAN bulk creation is useful for environments with pre-configured trunk ports where each VLAN needs its own NAD.

### Deleting NADs

NADs that are in use by running VMs cannot be deleted. VMO Manager checks for references and displays a conflict dialog listing the VMs that use the NAD.

## How VMs Use Networks

Every VM gets the default **pod network** automatically. This provides basic cluster networking via the Kubernetes CNI (typically Cilium).

Additional NICs are added during VM creation in the **Network** step:

1. The default pod network is always listed first
2. Click **Add Network** to attach an additional NIC
3. Select a NAD from the available networks in the VM's namespace
4. Optionally configure a static MAC address
5. For batch VM creation, use **Static IP fill-down** to auto-assign sequential IPs across VMs

### Network Configuration in Templates

Templates can include network configuration. When creating a VM from a template, the network settings are pre-populated. If the template references a NAD that doesn't exist in the target namespace, the wizard shows a warning with a quick-create link.

## SR-IOV Networking

SR-IOV provides near-native network performance by passing a Virtual Function (VF) directly to the VM via PCI passthrough.

### Prerequisites

- SR-IOV capable NICs on compute nodes
- SR-IOV device plugin installed and configured
- VFs configured on the host (visible in node hardware metrics)

### Monitoring SR-IOV

The node detail page shows SR-IOV metrics:

- **VFs configured** -- number of VFs currently active per interface
- **VFs total** -- maximum VFs supported by each interface

These metrics come from the vmo-node-agent DaemonSet which reads `/sys/class/net/*/device/sriov_numvfs` and `/sys/class/net/*/device/sriov_totalvfs`.

> **Warning:** Changing SR-IOV VF counts on a node requires careful coordination. VMs using VFs from that interface must be stopped or migrated first.
