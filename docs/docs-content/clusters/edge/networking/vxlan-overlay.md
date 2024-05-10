---
sidebar_label: "Enable Overlay Network"
title: "Enable Overlay Network"
description:
  "Learn how to enable a virtual overlay network you can control on top of an often unpredictable physical network."
hide_table_of_contents: false
sidebar_position: 30
tags: ["edge"]
---

Edge clusters are often deployed in locations where network environments are not managed by teams that maintain the edge
deployments. However, a Kubernetes cluster, specifically several control plane components, require stable IP addresses.
In the case of an extended network outage, it's possible that your cluster components would lose their original IP
addresses when the cluster expects them to remain stable, causing the cluster to experience degraded performance or
become non-operational.

Palette allows you to create a virtual overlay network on top of the physical network, and the virtual IP addresses of
all cluster components are managed by Palette. Inside the cluster, the different components use the virtual IP addresses
to communicate with each other instead of the underlying IP addresses that could change due to external factors. If the
cluster experiences an outage with the overlay network enabled, components inside the cluster retain their virtual IP
addresses in the overlay network, even if their IP addresses in the underlying physical network has changed, protecting
the cluster from an outage.

![VxLAN Overlay Architecture](/clusters_edge_site-installation_vxlan-overlay_architecture.webp)

:::preview

:::

## When Should You Consider Enabling Overlay Network?

If your Edge clusters are deployed in network environments that fit the following descriptions, you should consider
enabling an overlay network for your cluster:

- Network environments with dynamic IP address management, such as a DHCP network.
- Instable network environments or environments that are out of your control. For example, you are deploying an Edge
  host in a restaurant located in a commercial building, where the network is managed by the building and cannot be
  easily altered by your staff.
- Environments where you expect your edge hosts to move from one physical location to another.

### Example Scenario

The Analytics team of a manufacturing company is deploying an Edge host to their assembly line to collect metrics from
the manufacturing process. The building in which the Edge host is deployed has a network that is managed by a DHCP
server. The region experiences a bad weather event that causes a sustained outage.

| Without Overlay Network                                                                                                                                                                                                                                                                                                                                                                         | With Overlay Network                                                                                                                                                                                                                                                                                                                  |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Upon recovery, each Kubernetes component inside in the Edge host requests an IP address from the DHCP server, and receives a different IP address than their original IP address before the outage happened. Since Kubernetes expects several components in the control plane to have stable IP addresses, the cluster becomes non-operational and assembly line is unable to resume operations | Each Kubernetes component inside in the Edge host has a virtual IP address in the overlay network. Upon recovery, their IP addresses in the overlay network remain the same despite their IP addresses changing in the underlying DHCP network. The Edge host is able to assume its workload and the assembly line resumes operations |

## Limitations

- When adding multiple Edge hosts to an existing cluster with overlay enabled, failure to add one host will block the
  addition of the other hosts.

- When a cluster has overlay enabled, you cannot delete an Edge host that has the `palette-webhook` pod on it, or the
  Edge host will be stuck in the deleting state. You can use the command
  `kubectl get pods --all-namespaces --output wide` to identify which node `palette-webhook` is on. If you need to
  remove an Edge host that has the `palette-webhook` pod on it, please reach out to our support team by opening a ticket
  through our [support page](http://support.spectrocloud.io/).

## Prerequisites

- At least one Edge host registered with your Palette account.
- Your cluster profile must have K3s as its Kubernetes distribution.
- All Edge hosts must be on the same Layer-2 network.
- If you are launching your Edge hosts in virtual machine environments and you are using either Cilium or Flannel as
  your container network interface (CNI), ensure that you add the following commands in the **user-data** file at the
  boot stage. Replace `INTERFACE_NAME` with the name of the network interface on your Edge host.
  ```yaml {2-6}
  stages:
    boot:
      - name: "Disable UDP segmentation"
        commands:
          - ethtool -K INTERFACE_NAME tx-udp_tnl-segmentation off
          - ethtool -K INTERFACE_NAME tx-udp_tnl-csum-segmentation off
  ```
  This is related to a
  [known issue with VMware's VMXNET3 adapter](https://github.com/cilium/cilium/issues/13096#issuecomment-723901955),
  which is widely used in different virtual machine management services, including VMware vSphere and Hyper-V.

## Enable Overlay Network

You can enable an overlay network for your cluster during cluster creation.

:::warning

You will not be able to change the network overlay configurations after the cluster has already been created.

:::

1.  Log in to [Palette](https://console.spectrocloud.com).

2.  Navigate to the left **Main Menu** and select **Clusters**.

3.  Click on **Add New Cluster**.

4.  Choose **Edge Native** for the cluster type and click **Start Edge Native Configuration**.

5.  Give the cluster a name, description, and tags. Click on **Next**.

6.  Select a cluster profile. If you don't have a cluster profile for Edge Native, refer to the
    [Create Edge Native Cluster Profile](../site-deployment/model-profile.md) guide. Click on **Next** after you have
    selected a cluster profile.

7.  In the Kubernetes layer of the cluster profile, add the parameter `cluster.kubevipArgs.vip_interface` and set its
    value to `scbr-100`:

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

    In the Calico pack YAML file default template, uncomment `FELIX_MTUIFACEPATTERN` and set its value to `scbr-100` and
    uncomment `manifests.calico.env.calicoNode.IP_AUTODETECTION_METHOD` and set its value to `interface=scbr-100`.

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

    In the Flannel pack YAML file, add a line `- "--iface=scbr-100"` in the default template under
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

9.  Review the rest of your cluster profile values and make changes as needed. Click on **Next**.

10. In the **Cluster Config** stage, toggle on **Enable Overlay Network**. This will prompt you to provide additional
    configuration for your virtual overlay network.

11. In the **Overlay CIDR Range** field, provide a private IP range for your cluster to use. Ensure this range is not
    used by others in the same network environment. When you toggle on **Enable Overlay Network**, Palette provides a
    default range that is typically unused. We suggest you keep the default range unless you have a specific IP range
    you want to use.

:::warning

The overlay CIDR range cannot be changed after the cluster creation.

:::

After you have provided the overlay CIDR, the **VIP** field at the top of the page will be grayed out, and the first IP
address in the overlay CIDR range will be used as the Overlay VIP. This VIP is the internal overlay VIP used by the
cluster.

12. Finish the rest of the cluster configurations and click **Finish Configuration** to deploy the cluster. For more
    information, refer to [Create Cluster Definition](../site-deployment/site-installation/cluster-deployment.md).

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Select the host cluster you created to view its details page.

4. Select the **Nodes** tab. For each host, the **Private Ips** column lists an overlay IP address within the CIDR range
   you provided during cluster configuration.

:::tip

To view the external IP addresses of the edge hosts, from the **Main Menu**, go to **Clusters**, and click the **Edge
Hosts** tab. The IP address displayed in the table is the external IP address.

:::

## Access Cluster with Overlay Network Enabled

You can access a cluster with overlay network enabled in the following ways:

- Access the cluster with kubectl CLI. For more information, refer to
  [Access Cluster with CLI](../../cluster-management/palette-webctl.md).
- Access LoadBalancer services. You can provision LoadBalancer services in your Kubernetes cluster and expose them to
  external traffic. For example, refer to [Publish Cluster Services with Kube-vip](kubevip.md).
- Access a node by IP address. You can use the node's external IP address to access the node directly. The overlay IP
  addresses are internal to the cluster itself and cannot be accessed from outside the cluster.

## Resources

- [Publish Cluster Services with Kube-vip](kubevip.md)
- [Troubleshooting - Edge](../../../troubleshooting/edge.md)
