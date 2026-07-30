---
sidebar_label: "Networks"
title: "Networks"
description:
  "Manage network attachment definitions and additional network interfaces for virtual machines on the Launchpad for VMs
  appliance."
icon: " "
hide_table_of_contents: false
sidebar_position: 10
tags: ["vmo", "vm launchpad appliance", "infrastructure", "networking"]
---

Virtual Machine Orchestrator (VMO) manages VM networking through Kubernetes Network Attachment Definitions (NADs).
Spectro Cloud recommends attaching VM network interface controllers (NICs) only to external VLANs through NADs. This
pattern is the closest analog to a VMware vSphere port group on a vSwitch. Connecting a VM to both a VLAN and the
default pod network introduces routing challenges that require custom configuration, so only use that pattern when
necessary.

## Network Capabilities

VMO detects the network capabilities available on the cluster at runtime. The capabilities API,
`/api/v1/network-capabilities`, reports which network types the cluster supports.

| **Type**         | **Requires**                  | **Description**                                                                                  |
| ---------------- | ----------------------------- | ------------------------------------------------------------------------------------------------ |
| **Linux Bridge** | Bridge CNI plugin             | Layer 2 bridged networking. VMs connect to a Linux bridge on the host.                           |
| **`macvlan`**    | `macvlan` CNI plugin          | Each VM receives its own MAC address on the host's physical network.                             |
| **`ipvlan`**     | `ipvlan` CNI plugin           | VMs share the host's MAC address but receive unique IP addresses on the host's physical network. |
| **SR-IOV**       | SR-IOV device plugin and CNI  | Hardware-accelerated networking through PCI passthrough of virtual functions.                    |
| **Custom JSON**  | Any CNI plugin on the cluster | Supply a raw CNI plugin configuration when the built-in types do not fit your use case.          |

:::info

Available network types depend on the CNI plugins installed on the cluster. Types the cluster does not support appear
grayed out in the UI.

:::

## Network Attachment Definitions

A NAD defines how the appliance configures network interfaces for VMs. NADs are namespace-scoped Kubernetes resources.
As an exception, any namespace can use NADs created in the `default` namespace. Create NADs that represent global or
standard networks in the `default` namespace so that you can manage them in one place. A NAD created in any other
namespace is only visible from that specific namespace.

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
   | **IPAM Configuration** _(Optional)_ | An IPAM plugin configuration in JSON, for example, `{"type": "host-local", "subnet": "192.0.2.0/24"}`. Leave empty to rely on manual or DHCP addressing. |

   </TabItem>

   <TabItem value="macvlan" label="macvlan">

   | **Field**                           | **Description**                                                                                                                                          |
   | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Master Interface**                | The host network interface to attach to.                                                                                                                 |
   | **VLAN ID** _(Optional)_            | The 802.1Q VLAN tag. Accepts a single ID (for example, `100`), a comma-separated list, or a range (for example, `100-105`).                              |
   | **IPAM Configuration** _(Optional)_ | An IPAM plugin configuration in JSON, for example, `{"type": "host-local", "subnet": "192.0.2.0/24"}`. Leave empty to rely on manual or DHCP addressing. |

   </TabItem>

   <TabItem value="ipvlan" label="ipvlan">

   | **Field**                           | **Description**                                                                                                                                          |
   | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Master Interface**                | The host network interface to attach to.                                                                                                                 |
   | **VLAN ID** _(Optional)_            | The 802.1Q VLAN tag. Accepts a single ID (for example, `100`), a comma-separated list, or a range (for example, `100-105`).                              |
   | **IPAM Configuration** _(Optional)_ | An IPAM plugin configuration in JSON, for example, `{"type": "host-local", "subnet": "192.0.2.0/24"}`. Leave empty to rely on manual or DHCP addressing. |

   </TabItem>

   <TabItem value="sr-iov" label="SR-IOV">

   | **Field**                           | **Description**                                                                                                                                          |
   | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **VLAN ID** _(Optional)_            | The 802.1Q VLAN tag. Accepts a single ID (for example, `100`), a comma-separated list, or a range (for example, `100-105`).                              |
   | **IPAM Configuration** _(Optional)_ | An IPAM plugin configuration in JSON, for example, `{"type": "host-local", "subnet": "192.0.2.0/24"}`. Leave empty to rely on manual or DHCP addressing. |

   :::info

   The SR-IOV form does not add a `k8s.v1.cni.cncf.io/resourceName` annotation to the generated NAD. After the appliance
   creates the NAD, add the annotation manually so the NAD binds to the Kubernetes resource defined in your
   `SriovNetworkNodePolicy`. The resource-name value combines the pack's `resourcePrefix` with the policy's
   `resourceName` similar to the following example.

   ```yaml
   k8s.v1.cni.cncf.io/resourceName: spectro/intel_sriov_netdevice
   ```

   Without the annotation, VMs cannot request a Virtual Function from the pool.

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

The first NIC of a new VM connects to the **pod network** by default. The pod network provides basic cluster
connectivity using NAT through the Kubernetes CNI, typically Cilium. The pod network does not maintain network
connections when a VM live migrates across hosts.

To preserve network connectivity during live migration, change the VM NIC network type from **Pod Network (masquerade)**
to one of the configured Multus networks in the **Network** step of VM creation.

1. In the **Network** step, select the default NIC.

2. Change the network **Type** from **Pod Network (masquerade)** to a NAD from the available networks in the VM's
   namespace.

3. For batch VM creation, use **Static IP fill-down** to auto-assign sequential IP addresses across VMs.

:::warning

VMO does not automatically assign a persistent MAC address to new VMs, and the VM creation wizard does not expose a
field to set one. Without a persistent MAC, a VM receives a new dynamic MAC address after each live migration, which can
break DHCP for VMs that rely on static IP reservations.

To assign a persistent MAC address, edit the VM manifest YAML directly and add a `macAddress` field to each interface
entry under `spec.template.spec.domain.devices.interfaces`. The following example shows a bridge interface with a static
MAC.

```yaml
interfaces:
  - name: default
    macAddress: "de:ad:00:00:be:af"
    bridge: {}
```

:::

### Network Configuration in Templates

Templates can include network configuration. When you create a VM from a template, the wizard pre-populates the network
settings. If the template references a NAD that does not exist in the target namespace, the wizard displays a warning
with a quick-create link.

## SR-IOV Networking

SR-IOV provides near-native network performance by passing a Virtual Function (VF) directly to the VM through PCI
passthrough.

### Prerequisites

- SR-IOV capable NICs on compute nodes.

- [SR-IOV Network Operator pack](https://docs.spectrocloud.com/integrations/packs/?pack=sriov-network-operator&version=1.6.0&parent=1.6.x&tab=main)
  from the Community Repo added to the cluster profile.

- Virtual Functions configured on the host and visible in node hardware metrics.

<details>
<summary>Detailed cluster setup steps</summary>

1. Use SR-IOV capable hardware. NICs must support SR-IOV, and you must know the maximum number of Virtual Functions each
   NIC can create.

2. Enable SR-IOV in the BIOS.

3. Enable IOMMU in the kernel boot parameters.

   - Intel CPUs: `intel_iommu=on iommu=pt`
   - AMD CPUs: `amd_iommu=on iommu=pt`

4. If the number of Virtual Functions is configured through firmware (for example, Mellanox NICs), use the NIC's native
   configuration tool to set the maximum. For example, on a ConnectX NIC, run the following command to enable up to 128
   Virtual Functions.

   ```bash
   mlxconfig --dev <pci-slot-id> set SRIOV_EN=1 NUM_OF_VFS=128
   ```

5. Add the SR-IOV Network Operator pack from the Community Repo to the cluster profile.

6. Define a `SriovNetworkNodePolicy` manifest that configures:

   - A node selector, to limit processing to SR-IOV capable nodes.
   - A NIC selector, to limit processing to the intended SR-IOV capable NIC type.
   - The number of Virtual Functions to create.
   - The Kubernetes resource names to allocate the Virtual Functions into so that NADs can request them.

   The following example shows a policy manifest.

   ```yaml
   apiVersion: sriovnetwork.openshift.io/v1
   kind: SriovNetworkNodePolicy
   metadata:
     name: intel-sriov-policy
     namespace: openshift-sriov-network-operator
   spec:
     resourceName: intel_sriov_netdevice
     nodeSelector:
       feature.node.kubernetes.io/network-sriov.capable: "true"
     priority: 99
     mtu: 1500
     numVfs: 4
     deviceType: netdevice
     nicSelector:
       vendor: "8086"
       deviceID: "159b"
       pfNames: ["ens1f0"]
   ```

   The resulting Kubernetes resource name combines the pack's `resourcePrefix` value with the policy's `resourceName`.
   For example, with `resourcePrefix: spectro` in the pack config and the preceding policy, the resource name is
   `spectro/intel_sriov_netdevice`. For more configuration options, refer to the
   [SR-IOV Network Operator pack documentation](https://docs.spectrocloud.com/integrations/packs/?pack=sriov-network-operator&version=1.6.0&parent=1.6.x&tab=main).

   Apply the policy to the cluster.

7. After you apply the policy, the SR-IOV Network Operator processes each node in sequence:

   - Drains the node of all workloads.
   - Creates the desired number of Virtual Functions on the selected NICs.
   - Unbinds the selected NICs and their Virtual Functions from their vendor-specific driver.
   - Binds the selected NICs and their Virtual Functions to the `vfio-pci` driver.
   - Allocates the Virtual Functions to the custom Kubernetes resource. The resource then appears on the node as
     allocatable capacity.
   - Uncordons the node and allows workloads to resume.

   The process can take several minutes per node, depending on how many Virtual Functions the operator handles. The
   process repeats on every node reboot because the configuration is not persistent.

8. Create an SR-IOV NAD that consumes the Kubernetes resource created by the policy. Refer to
   [Create a NAD](#create-a-nad) for the appliance-driven flow.

</details>

### Monitor SR-IOV

The node detail page shows the following SR-IOV metrics.

| **Metric**         | **Description**                                                 |
| ------------------ | --------------------------------------------------------------- |
| **VFs configured** | The number of Virtual Functions currently active per interface. |
| **VFs total**      | The number of Virtual Functions each interface supports.        |

These metrics come from the `vmo-node-agent` DaemonSet, which reads `/sys/class/net/*/device/sriov_numvfs` and
`/sys/class/net/*/device/sriov_totalvfs`.

:::warning

To change the number of Virtual Functions on a node, update the `SriovNetworkNodePolicy` resource in the cluster
directly. The VMO UI does not expose a control for this operation. When you apply the change, the SR-IOV Network
Operator drains, reconfigures, and uncordons each node in sequence. The cluster must have multiple nodes with enough
spare capacity to absorb the workloads that live migrate off the draining node.

:::

## Resources

- [Network Configuration Considerations](../vmo-networking.md)

- [Initial Configuration of Launchpad for VMs](../getting-started-wiz.md)
