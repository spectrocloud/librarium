---
sidebar_label: "Networks"
title: "Networks"
description:
  "Manage network attachment definitions and additional network interfaces for virtual machines on PaletteAI VM
  Launchpad."
icon: " "
hide_table_of_contents: false
sidebar_position: 10
tags: ["vmo", "vm launchpad", "infrastructure", "networking"]
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

   | **Field**        | **Description**                                                                                                                                                                                    |
   | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Name**         | The NAD name. The name must follow Kubernetes naming rules: lowercase, alphanumeric, and hyphens. If you enter a VLAN ID, VMO adds the ID to this name, except in **Trunk** mode. Refer to step 5. |
   | **Namespace**    | The namespace in which the appliance creates the NAD.                                                                                                                                              |
   | **Network Type** | Linux Bridge, `macvlan`, `ipvlan`, SR-IOV, or Custom JSON.                                                                                                                                         |

4. Configure the fields for the selected **Network Type**.

   <Tabs groupId="network-type">

   <TabItem value="linux-bridge" label="Linux Bridge">

   | **Field**                           | **Description**                                                                                                                                                                                                                                                                                                                                         |
   | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Bridge Name**                     | The Linux bridge on the host. The bridge must already exist on the nodes.                                                                                                                                                                                                                                                                               |
   | **VLAN Mode**                       | **Access** connects the VM to one VLAN, and the VM receives the traffic untagged. If you enter more than one VLAN ID, VMO creates one NAD per VLAN ID. Refer to [Create NADs for Multiple VLANs](#create-nads-for-multiple-vlans). **Trunk** creates one NAD that carries all the tagged VLANs you enter, and the VM manages the 802.1Q sub-interfaces. |
   | **VLAN ID** _(Optional)_            | The 802.1Q VLAN tag. Accepts a single ID (for example, `100`), a comma-separated list, or a range (for example, `100-105`). In **Trunk** mode, this field is named **Tagged VLANs**.                                                                                                                                                                    |
   | **IPAM Configuration** _(Optional)_ | An IPAM plugin configuration in JSON, for example, `{"type": "host-local", "subnet": "192.0.2.0/24"}`. Leave empty to rely on manual or DHCP addressing.                                                                                                                                                                                                |

   </TabItem>

   <TabItem value="macvlan" label="macvlan">

   | **Field**                           | **Description**                                                                                                                                                           |
   | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Master Interface**                | The host network interface to attach to.                                                                                                                                  |
   | **VLAN ID** _(Optional)_            | The 802.1Q VLAN tag. Accepts a single ID (for example, `100`), a comma-separated list, or a range (for example, `100-105`). More than one ID creates one NAD per VLAN ID. |
   | **IPAM Configuration** _(Optional)_ | An IPAM plugin configuration in JSON, for example, `{"type": "host-local", "subnet": "192.0.2.0/24"}`. Leave empty to rely on manual or DHCP addressing.                  |

   </TabItem>

   <TabItem value="ipvlan" label="ipvlan">

   | **Field**                           | **Description**                                                                                                                                                           |
   | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Master Interface**                | The host network interface to attach to.                                                                                                                                  |
   | **VLAN ID** _(Optional)_            | The 802.1Q VLAN tag. Accepts a single ID (for example, `100`), a comma-separated list, or a range (for example, `100-105`). More than one ID creates one NAD per VLAN ID. |
   | **IPAM Configuration** _(Optional)_ | An IPAM plugin configuration in JSON, for example, `{"type": "host-local", "subnet": "192.0.2.0/24"}`. Leave empty to rely on manual or DHCP addressing.                  |

   </TabItem>

   <TabItem value="sr-iov" label="SR-IOV">

   | **Field**                           | **Description**                                                                                                                                                           |
   | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **VLAN ID** _(Optional)_            | The 802.1Q VLAN tag. Accepts a single ID (for example, `100`), a comma-separated list, or a range (for example, `100-105`). More than one ID creates one NAD per VLAN ID. |
   | **IPAM Configuration** _(Optional)_ | An IPAM plugin configuration in JSON, for example, `{"type": "host-local", "subnet": "192.0.2.0/24"}`. Leave empty to rely on manual or DHCP addressing.                  |

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

5. _(Optional)_ If you entered a VLAN ID, select a **Naming Format**. For **Linux Bridge**, this option appears only in
   **Access** mode. VMO adds the VLAN ID to the NAD name in the format you select. Each option shows an example built
   from your name and the first VLAN ID.

   | **Naming Format**         | **Example for Name `prod` and VLAN ID `100`** |
   | ------------------------- | --------------------------------------------- |
   | `<name>-<id>` _(Default)_ | `prod-100`                                    |
   | `vlan-<id>-<name>`        | `vlan-100-prod`                               |

6. Select **Create**. If you entered more than one VLAN ID and are not using **Trunk** mode, the button is **Preview N
   NADs** instead, where N is the number of VLAN IDs. Select it, and continue from step 3 of
   [Create NADs for Multiple VLANs](#create-nads-for-multiple-vlans).

### Create NADs for Multiple VLANs

Except in **Trunk** mode, each NAD carries one VLAN, so VMs that connect to different VLANs need one NAD per VLAN. To
create these NADs at once, enter more than one VLAN ID when you create a network. VMO names each NAD with the **Naming
Format** you select. If one VM interface needs several tagged VLANs instead, use **Trunk** mode on a **Linux Bridge**
network, which creates one NAD that carries every tagged VLAN you enter.

1. Complete steps 1 - 5 of [Create a NAD](#create-a-nad). In step 4, for **Linux Bridge**, set **VLAN Mode** to
   **Access**. Then enter more than one ID in **VLAN ID**, for example, `100-110` or `100,200,300`. The field displays
   how many VLANs VMO creates.

2. Select **Preview N NADs**, where N is the number of VLAN IDs. The **Bulk Create NADs** dialog lists the name, VLAN,
   type, and bridge or host interface of each NAD.

3. Review the list, and select **Create N NADs**. To change the form first, select **Back**.

   VMO creates the NADs one at a time. The dialog displays the status of each NAD and how many NADs VMO has created.

4. _(Optional)_ If some NADs fail, the dialog lists each failure with its error. To delete the NADs that this batch
   created, select **Clean Up N Created**, where N is the number of NADs created. This option requires the
   `vmo:network:delete` permission.

5. Select **Done**.

### Bridge VLAN Filtering

A Linux bridge ignores VLAN tags by default, so every VM attached to it can reach every VLAN on that bridge. Bridge VLAN
filtering makes the bridge VLAN-aware so that each port forwards only the VLAN IDs that it permits.

VLAN filtering is optional. When you turn it on with the `vlanFiltering.enabled` pack parameter, VMO deploys the VLAN
filtering agent as a DaemonSet that runs on every node. The agent manages one bridge, which `vlanFiltering.env.bridgeIF`
sets to `br0` by default. It reconciles the bridge every 30 seconds and whenever a NAD changes. The agent ignores NADs
that name a different bridge and reports them as out of scope in the node status.

The agent, the VMO UI, and error messages refer to two kinds of VLAN.

| **VLAN Type** | **Description**                                                                                                                   |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Node VLAN     | A VLAN that carries the node's own traffic on the bridge. It is either untagged or tagged on a sub-interface, such as `br0.3900`. |
| VM VLAN       | A VLAN that a NAD gives to VMs.                                                                                                   |

The `allowedVlans` parameter is the source of truth for VM VLANs. The agent programs a VLAN from that list on the bridge
uplinks only while a NAD on the bridge references it, and removes the VLAN after you delete the last NAD that uses it.
For example, if VLAN 300 is in `allowedVlans`, creating a NAD on VLAN 300 permits VLAN 300 on the bridge within one
reconciliation pass. You do not need to edit the cluster profile or redeploy the cluster.

On the VM Launchpad appliance, the following fields in the **Networking** section of the cluster configuration set the
VLAN filtering parameters. Refer to [Install VM Launchpad](../install.md) for the other networking fields.

| **Appliance Field**             | **Parameter**                          |
| ------------------------------- | -------------------------------------- |
| **Restrict Allowed VLANs**      | `vlanFiltering.enabled`                |
| **VM VLAN Range**               | `vlanFiltering.env.allowedVlans`       |
| **VM Bridge Interface**         | `vlanFiltering.env.bridgeIF`           |
| **Use br0 for Cluster Traffic** | `vlanFiltering.env.allowVlansOnSelf`   |
| **br0 VLAN Sub-interfaces**     | `vlanFiltering.env.allowedVlansOnSelf` |

:::warning

Turning on VLAN filtering is a default-deny change. If the permitted VLANs are wrong, a node might lose network
connectivity, and recovery might require out-of-band access to the machine. Review [Node Protection](#node-protection)
before you turn on VLAN filtering.

:::

#### VLAN Filtering Parameters

The following parameters are relative to `charts.virtual-machine-orchestrator`. Set each `env` value as a quoted string.

```yaml
vlanFiltering:
  enabled: true
  env:
    allowedVlans: "21-100"
```

| **Parameter**                                    | **Default**            | **Description**                                                                                                                                                                                                                                   |
| ------------------------------------------------ | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `vlanFiltering.enabled`                          | `false`                | Deploys the VLAN filtering agent on every node.                                                                                                                                                                                                   |
| `vlanFiltering.env.bridgeIF`                     | `"br0"`                | The bridge that the agent manages.                                                                                                                                                                                                                |
| `vlanFiltering.env.allowedVlans`                 | `"1"`                  | The VM VLANs that NADs can use, as IDs or ranges, for example, `"21-100"`. The agent programs only these VLANs on the bridge uplinks, and each one only while a NAD references it.                                                                |
| `vlanFiltering.env.allowVlansOnSelf`             | `"true"`               | Programs `allowedVlansOnSelf` on the bridge's own port. Keep it set to `"true"` when the node's IP address is on the bridge.                                                                                                                      |
| `vlanFiltering.env.allowedVlansOnSelf`           | `"1"`                  | The VLANs that the node itself uses on the bridge, such as the VLANs of `br0.10` sub-interfaces. The agent programs them on the bridge's own port only. NADs never add VLANs here. Always include the node's untagged VLAN, which is usually `1`. |
| `vlanFiltering.env.nativeVlan`                   | `""`                   | The node's untagged VLAN. Leave it empty so that the agent detects it. Set a value only to pin a specific VLAN.                                                                                                                                   |
| `vlanFiltering.env.vlanDesiredStateSync`         | `"true"`               | Removes VM VLANs that no NAD references. Set it to `"false"` to make the agent add-only. The agent never removes node VLANs.                                                                                                                      |
| `vlanFiltering.env.connectivityCheckOnEnable`    | `"true"`               | Probes connectivity while filtering is on, and turns filtering off if the probe keeps failing. Set it to `"false"` to turn off both the probe and the automatic revert.                                                                           |
| `vlanFiltering.env.connectivityTestIpv4`         | `""`                   | The IPv4 address to probe. Leave it empty to probe the node's default gateway.                                                                                                                                                                    |
| `vlanFiltering.env.connectivityFailureThreshold` | `"3"`                  | The number of consecutive failed probes before the agent turns filtering off.                                                                                                                                                                     |
| `vlanFiltering.env.publishNodeStatus`            | `"true"`               | Writes the `vmo-manager/vlan-filtering-status` node annotation. The **VLAN filtering** panel and the NAD admission checks read this annotation.                                                                                                   |
| `vlanFiltering.env.failureRetentionSeconds`      | `"0"`                  | How long a failed VLAN stays in the node status. `"0"` keeps it until the problem clears or an administrator clears it. `"-1"` shows it once. A positive value, such as `"3600"`, shows it for that many seconds.                                 |
| `vlanFiltering.env.sleepSecs`                    | `"30"`                 | The number of seconds between reconciliation passes.                                                                                                                                                                                              |
| `vlanFiltering.stateHostPath`                    | `/usr/local/vlan-mgmt` | The directory on each node where the agent keeps its state. It must persist across pod restarts and reboots.                                                                                                                                      |

#### Node Protection

The agent includes the following safeguards against cutting a node off the network.

| **Safeguard**                           | **Behavior**                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Node VLANs are never removed            | The agent detects the node VLANs and keeps them on every uplink and on the bridge's own port, whatever the other parameters specify. The untagged node VLAN is `nativeVlan` if you set it. Otherwise, the agent detects it from the bridge's port VLAN ID (PVID). Tagged node VLANs are the VLANs of bridge sub-interfaces that have an IP address, such as `br0.3900`. The agent remembers each node VLAN, so it stays protected after a reboot or after the sub-interface is removed. |
| Filtering waits for the node VLANs      | The agent does not turn on filtering while a node VLAN is missing from an uplink or from the bridge's own port. It records the reason as a failed VLAN instead.                                                                                                                                                                                                                                                                                                                         |
| VM VLANs stay off the node's own path   | The agent applies VM VLANs to the bridge uplinks only. The bridge's own port carries only the VLANs in `allowedVlansOnSelf` and the node VLANs, so creating a NAD cannot cut the node's own traffic.                                                                                                                                                                                                                                                                                    |
| Connectivity probe and automatic revert | While filtering is on, the agent probes the node's default gateway, or the address in `connectivityTestIpv4`, on every pass. After three consecutive failures, it turns filtering off on that node and records the VLAN changes made since the last successful probe as failed VLANs. The node stays reverted, across pod restarts and reboots, until an administrator requests a retry.                                                                                                |
| No changes when the view is incomplete  | If the agent cannot read the NADs during a pass, it neither adds nor removes VM VLANs in that pass. It still repairs the node VLANs.                                                                                                                                                                                                                                                                                                                                                    |

If you set `connectivityCheckOnEnable` to `"false"`, nothing reverts a wrong `allowedVlans` or `allowedVlansOnSelf`
value. Verify both values against the uplink and node VLANs of each node before you turn on VLAN filtering.

#### Retry VLAN Filtering After a Revert

When the connectivity probe reverts filtering on a node, filtering stays off on that node until you request a retry. The
following steps require `kubectl` access to the cluster.

```shell
export KUBECONFIG=<path-to-kubeconfig>
```

Replace `<path-to-kubeconfig>` with the path to the kubeconfig file of your cluster.

1. Fix the network problem that caused the probe to fail. The **VLAN filtering** panel on **Infrastructure** >
   **Networks** shows the reason for the revert.

2. Request a retry. The `generation` value must be higher than the value of any previous request for that node, so a
   Unix timestamp works.

   ```shell
   kubectl annotate node <node-name> --overwrite \
     vmo-manager/vlan-filtering-enable="{\"generation\":$(date +%s)}"
   ```

   Replace `<node-name>` with the name of the reverted node. The **VLAN filtering** panel shows this command with the
   node name filled in, ready to copy.

   To clear only specific failed VLANs, add a `vlans` list to the JSON object, for example,
   `{"generation":<generation>,"vlans":[300,301]}`.

3. Wait for the next reconciliation pass. The agent processes each request once and retries filtering without a pod
   restart.

#### Check VLAN Filtering Status

The **VLAN filtering** panel appears on **Infrastructure** > **Networks** when a node has a problem: filtering is off or
reverted, a VLAN failed, or a node VLAN is missing from `allowedVlansOnSelf`. The panel lists each node with its node
VLANs, its filtering state, and every VLAN that the agent could not program. The panel stays hidden while every node is
healthy, and when VLAN filtering is turned off. It requires `publishNodeStatus` set to `"true"`.

Each node also carries a `vmo-manager/vlan-filtering-status` annotation that summarizes what the agent applied,
including whether filtering was reverted. Use the following command to read it.

```shell
kubectl get node <node-name> --output jsonpath='{.metadata.annotations.vmo-manager/vlan-filtering-status}'
```

Replace `<node-name>` with the name of the node.

If a node cannot reach the API server, read the agent's state file on the node instead. The file records the node VLANs,
every failed VLAN, whether filtering was reverted, and `applied`, the VM VLANs that the last pass programmed on the
uplinks. The file is for reference only, and the agent does not act on it. To check the VLANs that the bridge carries,
use the `bridge vlan show` command.

```shell
cat /usr/local/vlan-mgmt/vlan-state.json
```

#### Restrict Which VLANs VMs Can Use

`allowedVlans` is an upper limit. The agent never programs a VLAN outside that list on the bridge uplinks, so users who
can create NADs can open only the VLANs in the list.

When admission validation is on, VMO rejects a bridge NAD on a VLAN outside `allowedVlans`, and the error lists the
VLANs that the bridge allows. This check requires `vmo-manager.admissionControl.enabled` and `publishNodeStatus` set to
`"true"`. If such a NAD exists anyway, for example because admission validation is off, the agent does not program its
VLAN. The **VLAN filtering** panel lists it as a failed VM VLAN until you delete the NAD or add the VLAN to
`allowedVlans`.

VMO also rejects VLAN ID `0` on Linux Bridge networks. The bridge CNI plugin treats `0` as untagged, which would place
the VM on the bridge's default VLAN, usually the node's own network. Use an ID from `1` to `4094`, or leave **VLAN ID**
empty for an untagged network.

Admission validation is on by default on the VM Launchpad appliance and off by default in the VMO pack, because the
admission webhook requires `vmo-manager.tls.enabled`, which the pack leaves off. The
`vmo-manager.admissionControl.enabled` parameter turns on both VM overcommit feedback and NAD validation. When it is on,
a bridge NAD must name a bridge that the VLAN filtering agents report. To use a bridge that you manage outside VMO, add
the `vmo.spectrocloud.com/allow-unknown-bridge: "true"` annotation to the NAD. VMO then accepts the NAD with a warning.

#### Upgrade Considerations

<!-- VERIFY(PVM-1183): confirm which VM Launchpad release ships PVM-1306 and PVM-1432, and the earlier versions that had the separate VLAN range (engineering cites 4.10.19 and 4.10.20). -->

Review the following changes before you upgrade from a release that used the earlier VLAN filtering settings.

- `allowedVlans` replaces the separate VM VLAN range settings, `vlanFiltering.env.vlanRange` and
  `vlanFiltering.env.enforceVlanRange`, and limits NAD VLANs the same way that `enforceVlanRange: "true"` did. Copy your
  range into `allowedVlans`, and remove the old values from your cluster profile. VMO ignores the old values without a
  warning.

- `vlanFiltering.env.nadDiscovery` is removed. The agent always reads NADs.

- `vlanDesiredStateSync` now defaults to `"true"`. After the upgrade, the agent removes VLANs in `allowedVlans` that no
  NAD references, and stops programming NAD VLANs outside `allowedVlans`. Add every VLAN that your VM networks use to
  `allowedVlans` before you upgrade.

- On the VM Launchpad appliance, `allowedVlansOnSelf` no longer includes the VM VLAN range, so the agent removes VM
  VLANs from the bridge's own port. A node VLAN that has an IP address on a `br0.N` sub-interface stays protected, and
  the **VLAN filtering** panel reports it as missing from **br0 VLAN Sub-interfaces** so that you can add it.

- The agent keeps its state in `/usr/local/vlan-mgmt` instead of `/var/lib/vlan-mgmt`, and the retry annotation is now
  `vmo-manager/vlan-filtering-enable`. The agent still reads the earlier state file and the earlier
  `vmo-manager/vlan-filtering-clear` annotation, so a revert recorded before the upgrade carries over.

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

- [Initial Configuration of VM Launchpad](../getting-started-wiz.md)
