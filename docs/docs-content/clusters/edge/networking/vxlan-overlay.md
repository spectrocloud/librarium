---
sidebar_label: "Enable Overlay Network"
title: "Enable Overlay Network"
description:
  "Learn how to enable a virtual overlay network you can control on top of an often unpredictable physical network."
hide_table_of_contents: false
sidebar_position: 30
tags: ["edge"]
---

Edge clusters are often deployed in locations where network environments are not managed by teams that maintain the Edge
deployments. However, a Kubernetes cluster, specifically several control plane components, requires stable IP addresses.
In the case of an extended network outage, it is possible that your cluster components would lose their original IP
addresses when the cluster expects them to remain stable, causing the cluster to experience degraded performance or
become non-operational.

Palette allows you to create a virtual overlay network on top of the physical network, where the virtual IP addresses of
all cluster components are managed by Palette. Inside the cluster, the different components use the virtual IP addresses
to communicate with each other instead of the underlying IP addresses that could change due to external factors. If the
cluster experiences an outage with the overlay network enabled, components inside the cluster retain their virtual IP
addresses in the overlay network, even if their IP addresses in the underlying physical network change, protecting the
cluster from an outage.

![VxLAN Overlay Architecture](/clusters_edge_site-installation_vxlan-overlay_architecture.webp)

:::preview

:::

## When Should You Consider Enabling Overlay Network?

If your Edge clusters are deployed in network environments that fit any of the following descriptions, you should
consider enabling an overlay network for your cluster:

- Network environments with dynamic IP address management, such as a Dynamic Host Configuration Protocol (DHCP) network.

- Unstable network environments or environments that are out of your control. For example, you are deploying an Edge
  host in a restaurant located in a commercial building, where the network is managed by the building and cannot be
  easily altered by your staff.

- Environments where you expect your Edge hosts to move from one physical location to another.

### Example Scenario

The Analytics team of a manufacturing company is deploying an Edge host to their assembly line to collect metrics from
the manufacturing process. The building in which the Edge host is deployed has a network that is managed by a DHCP
server. The region experiences a bad weather event that causes a sustained outage.

| Without Overlay Network                                                                                                                                                                                                                                                                                                                                                                              | With Overlay Network                                                                                                                                                                                                                                                                                                                |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Upon recovery, each Kubernetes component inside in the Edge host requests an IP address from the DHCP server and receives a different IP address than their original IP address before the outage happened. Since Kubernetes expects several components in the control plane to have stable IP addresses, the cluster becomes non-operational, and the assembly line is unable to resume operations. | Each Kubernetes component inside in the Edge host has a virtual IP address in the overlay network. Upon recovery, the IP addresses in the overlay network remain the same despite the IP addresses changing in the underlying DHCP network. The Edge host is able to resume its workload, and the assembly line resumes operations. |

## Limitations

- When adding multiple Edge hosts to an existing cluster with overlay enabled, failure to add one host will block the
  addition of the other hosts.

- If you configured static IP on any host of your cluster using the
  [Terminal User Interface (TUI)](../site-deployment/site-installation/initial-setup.md), enabling network overlay is
  not supported. Static IPs reduce the need to configure an overlay network, but if you must use network overlay on top
  of static IPs, you can configure the static IPs using the
  [user data network block](../edge-configuration/installer-reference.md#site-network-parameters) instead.

## Prerequisites

- At least one Edge host registered with your Palette account.
- Your cluster profile must have K3s, RKE2, or PXK-E as its Kubernetes distribution.
- All Edge hosts must be on the same Layer-2 network.
- Broadcast messages must be allowed between all Edge hosts participating in the cluster.

  - For Virtual Machine (VM) Edge hosts in VMware, this means features such as promiscuous mode must be enabled to allow
    broadcasts between hosts.
  - Switches cannot implement features that block broadcasts between ports where Edge hosts are connected.

- If you are launching your Edge hosts in virtual machine environments using VMXNET3 adapters, ensure that you add the
  following commands in the `user-data` file at the boot stage. Replace `<interface-name>` with the name of the network
  interface on your Edge host.

  ```yaml {2-6}
  stages:
    initramfs:
      - name: "Disable UDP segmentation"
        commands:
          - ethtool --offload <interface-name> tx-udp_tnl-segmentation off
          - ethtool --offload <interface-name> tx-udp_tnl-csum-segmentation off
  ```

  This is related to a
  [known issue with VMware's VMXNET3 adapter](https://github.com/cilium/cilium/issues/13096#issuecomment-723901955),
  which is widely used in different virtual machine management services, including VMware vSphere and Hyper-V.

- If your host's physical IP address is static, ensure that you configure the IP address using the
  [network block](../edge-configuration/installer-reference.md#site-network-parameters) in your `user-data` file.

- If your hosts are deployed in [agent mode](../../../deployment-modes/agent-mode/agent-mode.md), ensure that your hosts
  use `systemd-networkd` and `systemd-resolved` for interface and DNS management. Refer to
  [Configure networkd to Prepare Host for Overlay Network](../../../deployment-modes/agent-mode/overlay-preparation.md)
  for more information.

## Enable Overlay Network

You can enable an overlay network for your cluster during cluster creation.

:::warning

You cannot change network overlay configurations after the cluster is created.

:::

1.  Log in to [Palette](https://console.spectrocloud.com).

2.  Navigate to the left main menu and select **Clusters**.

3.  Choose **Add New Cluster**.

4.  Select **Edge Native** for the cluster type and choose **Start Edge Native Configuration**.

5.  Enter a **Cluster name**, **Description**, and **Tags**. Select **Next**.

6.  Select **Add cluster profile**, choose the appropriate profile, and **Confirm** your selection. If you don't have a
    cluster profile for Edge Native, refer to the
    [Create Edge Native Cluster Profile](../site-deployment/model-profile.md) guide.

7.  In the Kubernetes layer of the cluster profile, on the **Values** tab, uncomment the parameter
    `cluster.kubevipArgs.vip_interface` and set its value to `scbr-100`.

    ```yaml
    cluster:
      kubevipArgs:
        vip_interface: "scbr-100"
    ```

8.  In the network layer of your cluster profile, specify the name of the Network Interface Controllers (NIC) on your
    Edge hosts to be `scbr-100`. This is the name of the interface Palette creates on your Edge devices to establish the
    overlay network.

    The following are the sections of the packs you need to change depending on which CNI pack you are using:

          <Tabs>

    <TabItem value="calico" label="Calico">

    In the Calico pack YAML file, add `manifests.calico.env.calicoNode.FELIX_MTUIFACEPATTERN` and set its value to
    `scbr-100`. Uncomment `manifests.calico.env.calicoNode.IP_AUTODETECTION_METHOD` and set its value to
    `interface=scbr-100`.

    ```yaml {8,11}
    manifests:
      calico:
        ...
        env:
          # Additional env variables for calico-node
          calicoNode:
            #IPV6: "autodetect"
            FELIX_MTUIFACEPATTERN: "scbr-100"
            #CALICO_IPV6POOL_NAT_OUTGOING: "true"
            #CALICO_IPV4POOL_CIDR: "192.168.0.0/16"
            IP_AUTODETECTION_METHOD: "interface=scbr-100"
    ```

          </TabItem>

    <TabItem value="flannel" label="Flannel">

    In the Flannel pack YAML file, add the line `- "--iface=scbr-100"` in the default template under
    `charts.flannel.args`.

    ```yaml {8}
    charts:
        flannel:
            ...
            # flannel command arguments
            args:
            - "--ip-masq"
            - "--kube-subnet-mgr"
            - "--iface=scbr-100"
    ```

          </TabItem>

    <TabItem value="cilium" label="Cilium">

    You do not need to make any adjustments to the Cilium pack.

          </TabItem>

    <TabItem value="other" label="Other">

    If you are using other CNIs, refer to the documentation of your selected CNI and configure it to make sure that it
    picks the NIC named `scbr-100` on your Edge host.

          </TabItem>

    </Tabs>

9.  Review the rest of your cluster profile values and make changes as needed. Select **Next**.

10. On the **Cluster Config** stage, toggle on **Enable overlay**. The **VIP** field disappears and is replaced by
    **Overlay CIDR range**.

11. In the **Overlay CIDR range** field, provide a private IP range for your cluster to use. Ensure this range is not
    used by others in the same network environment. When you toggle on **Enable overlay**, Palette provides a default
    range that is typically unused. We suggest you keep the default range unless you have a specific IP range you want
    to use.

    The first IP address in the overlay CIDR range will be used as the overlay VIP. This VIP is the internal overlay VIP
    used by the cluster.

    :::warning

    The overlay CIDR range cannot be changed after the cluster is created.

    :::

12. Finish configuring your cluster and select **Finish Configuration** to deploy the cluster. For more information,
    refer to [Create Cluster Definition](../site-deployment/cluster-deployment.md).

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left main menu and select **Clusters**.

3. Select the host cluster you created to view its details page.

4. Select the **Nodes** tab. For each host, the **Private Ips** column lists an overlay IP address within the CIDR range
   you provided during cluster configuration.

   :::tip

   To view the external IP addresses of the Edge hosts, from the left main menu, select **Clusters > Edge Hosts**. The
   IP address displayed in the table is the external IP address.

   :::

## Access Cluster with Overlay Network Enabled

You can access a cluster with overlay network enabled in the following ways:

- Access the cluster with `kubectl`. For more information, refer to
  [Access Cluster with CLI](../../cluster-management/palette-webctl.md).

- Access LoadBalancer services. You can provision LoadBalancer services in your Kubernetes cluster and expose them to
  external traffic. For more information, refer to [Publish Cluster Services with Kube-vip](kubevip.md).

- Access a node via its IP address. You can use the node's external IP address to access the node directly. The overlay
  IP addresses are internal to the cluster itself and cannot be accessed from outside the cluster.

## Resources

- [Publish Cluster Services with Kube-vip](kubevip.md)
- [Troubleshooting - Edge](../../../troubleshooting/edge/edge.md)
