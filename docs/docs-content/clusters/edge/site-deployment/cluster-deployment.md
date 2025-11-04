---
sidebar_label: "Create Cluster Definition"
title: "Create Cluster Definition"
description: "Define your Edge cluster using the Edge hosts that are registered and available."
hide_table_of_contents: false
sidebar_position: 70
tags: ["edge"]
---

Once the Edge host has been deployed and registered with Palette, it is ready to be assigned to a host cluster. You can
add an Edge host to an existing Edge cluster, or you can create a new host cluster for Edge hosts and make the Edge host
a member. This applies both to Edge hosts deployed to a physical site and Edge hosts deployed as Virtual Machines (VM).

:::info

Procedures described on this page apply to Edge hosts with a connection to a Palette instance only. To learn how to
create a cluster using an Edge host that does not have a connection to a Palette instance (an air-gapped Edge host),
refer to [Create Cluster with Local UI](../local-ui/cluster-management/create-cluster.md).

:::

Select the workflow that best fits your needs.

- [Create an Edge Native Host Cluster](#create-an-edge-native-host-cluster) <!-- omit in toc -->
- [Add an Edge Host to a Host Cluster](#add-an-edge-host-to-a-host-cluster) <!-- omit in toc -->

## Create an Edge Native Host Cluster

Use the following steps to create a new host cluster so that you can add Edge hosts to the node pools.

### Limitations

- In a multi-node cluster with PXK-E as its Kubernetes layer, you cannot change custom Network Interface Card (NIC).
  When you add an Edge host to such a cluster, leave the NIC field as its default value.

<!-- prettier-ignore -->
- For multi-node clusters, do not use the
  <VersionedLink text="Local Path Provisioner Pack" url="/integrations/packs/?pack=csi-local-path-provisioner" />. This
  is because whenever a node is drained during an upgrade or for any other reason, the volumes will not dynamically move
  with the local path provisioner.

- Two-node clusters operating in high availability mode only support K3s and no other Kubernetes distributions.
- Palette Optimized Canonical Kubernetes clusters require at least three nodes to operate in high availability mode.

### Prerequisites

- One or more registered Edge host. For more information about Edge host registration, refer to
  [Edge Host Registration](./site-installation/edge-host-registration.md).
- An [Edge Native](./model-profile.md) cluster profile.
- If you are using more than one Edge host to form a cluster, the hosts in the same cluster must be on the same network.
- One IP address is required for the cluster's Virtual IP (VIP) address .
- At least one IP address is required for each Edge host.
- You must ensure that the Edge hosts have stable IP addresses. You have the following options to achieve stable IP
  addressing for Edge hosts:

  - Use static IP addresses. Contact your network administrator to assign the Edge host a static IP address.
  - Use Dynamic Host Configuration Protocol (DHCP) reservations to reserve an IP address in a DHCP network. Contact your
    network administrator to reserve IP addresses for your Edge hosts in a DHCP network.
  - Enable network overlay on your Edge cluster. Network overlay can only be enabled during cluster creation. For more
    information about network overlay, refer to [Enable Overlay Network](../networking/vxlan-overlay.md).

    :::warning

    If any of your Edge hosts have more than one Network Interface Card (NIC), you must either use static IP addresses
    or use network overlay. DHCP is not supported.

    :::

- If you are provisioning a two-node cluster, ensure that you set the `TWO_NODE` argument to `true` when building the
  provider image you use to deploy the cluster. For more information, refer to
  [Build Provider Images](../edgeforge-workflow/palette-canvos/build-provider-images.md).

- Network Time Protocol (NTP) servers are correctly configured in a multi-node cluster. All nodes must have their time
  synchronized.

### Create Cluster

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Click on **Add New Cluster**.

4. Choose **Edge Native** for the cluster type and click **Start Edge Native Configuration**.

5. Give the cluster a name, description, and tags. Click on **Next**.

6. <PartialsComponent category="cluster-templates" name="profile-vs-template" />

7. <PartialsComponent category="profiles" name="cluster-profile-variables-deployment" />

8. Provide the host cluster with the Virtual IP (VIP) address used by the physical site. Ensure that this VIP is not in
   a CIDR range that cannot routed through a proxy. In addition, ensure that this VIP does not overlap with any IP
   address already used by other hosts in your network, including your Edge hosts.

   You can also select any SSH keys in case you need to remote into the host cluster. You can also provide a list of NTP
   servers. Click on **Next**.

9. The node configuration page is where you can specify what Edge hosts make up the host cluster. Assign Edge hosts to
   the **control-plane-pool** and the **worker-pool**. When you have completed configuring the node pools, click on
   **Next**.

10. (Optional) If you want to provision a two-node high availability cluster, check the **Enable Two-Node Capability**
    box to enable the two-node high availability architecture. This means you must have exactly two nodes in the control
    plane pool.

11. (Optional) When you assign Edge hosts to node pools, you can optionally specify a static IP address for each Edge
    host. If you want to specify a static IP, toggle on **Static IP** and provide the following information:

    | **Field**       | **Description**                                                                                                                     |
    | --------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
    | IP address      | The static IP address assigned to your Edge host. This should be unique within your network.                                        |
    | Default gateway | The IP address of the default gateway for your cluster network. This gateway routes traffic from your cluster to external networks. |
    | Subnet mask     | The subnet mask of your cluster network. This defines the range of IP addresses within your cluster network.                        |
    | DNS server      | The IP address of the DNS server your cluster uses for domain resolution.                                                           |

    If certain network information is already available, the corresponding fields will be pre-populated.

12. (Optional) When you assign an Edge host to a node pool, if your Edge host has more than one NIC, you can optionally
    specify which Network Interface Controller (NIC) the Edge host will use to communicate with the cluster. When you
    select an Edge host, Palette displays a dropdown of all NICs present on the Edge host.

    If the NIC is configured on the Edge host network, an IP address is displayed next to the name of the NIC. If the
    NIC is not configured on the Edge host network, you can specify its IP address, default gateway, subnet mask, as
    well as DNS server to configure it.

    If you choose to change the default NIC used by your nodes in the control plane node pool, you need to make sure all
    the NICs in the control plane node pool share the same name. You also must make corresponding changes in the
    Kubernetes layer and the Container Network Interface (CNI) layer.

    In the Kubernetes layer, enter a new parameter `cluster.kubevipArgs.vip_interface` and set its value to the name of
    the NIC used by your control plane nodes. For example, if the NIC used by the nodes in your control plane pool is
    named `ens32`, add the following two lines.

    ```yaml {3}
    cluster:
     kubevipArgs:
       vip_interface: "ens32"
    ```

    In the CNI layer, depending on which CNI pack you choose for your cluster profile, you need to make changes in the
    following locations.

  <Tabs>

  <TabItem value="calico" label="Calico">

    In the Calico pack YAML file default template, uncomment `manifests.calico.env.calicoNode.IP_AUTODETECTION_METHOD` and
    set its value to `kubernetes-internal-ip`. This tells Calico to use the address assigned to the Kubernetes node.

    ```yaml {11}
    manifests:
        calico:
            ...
            env:
            # Additional env variables for calico-node
            calicoNode:
                #IPV6: "autodetect"
                #FELIX_IPV6SUPPORT: "true"
                #CALICO_IPV6POOL_NAT_OUTGOING: "true"
                #CALICO_IPV4POOL_CIDR: "192.168.0.0/16"
                IP_AUTODETECTION_METHOD: "kubernetes-internal-ip"
    ```

  </TabItem>

  <TabItem value="flannel" label="Flannel">

    In the Flannel pack YAML file, add a line `- "--iface=INTERFACE_NAME"` in the default template under
    `charts.flannel.args`. Replace `INTERFACE_NAME` with the name of the NIC. For example, add the line `- "--iface=eno32`
    if the NIC name of your control plane nodes is `eno32`.

    ```yaml {8}
    charts:
        flannel:
            ...
            # flannel command arguments
            args:
            - "--ip-masq"
            - "--kube-subnet-mgr"
            - "--iface=eno32"
    ```

  </TabItem>
  
  <TabItem value="cilium" label="Cilium">
    You do not need to make any adjustments to the Cilium pack.
  </TabItem>

  <TabItem value="other" label="Other">
    If you are using other CNIs, refer to the documentation of your selected CNI and configure it to make sure that it picks the right NIC on your Edge hosts. 
  </TabItem>
  
  </Tabs>

:::warning

After you create the cluster, you will not be able to change the IP address or NIC of your existing Edge hosts unless
you remove and re-add them back to the cluster.

:::

12. The Settings page is where you can configure a patching schedule, security scans, backup settings, and set up
    Role-Based Access Control (RBAC). Review the settings and make changes if needed. Click on **Validate**.

13. Review the settings summary and click on **Finish Configuration** to deploy the cluster.

    After you create the cluster, the Palette Edge Host agent will start the installation process. You can track the
    installation progress in Palette. The cluster overview page displays a summary of the progress. Use the _Events_ tab
    to review detailed logs.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Select the host cluster you created to view its details page.

4. Review the **Cluster Status**. Ensure the **Cluster Status** field displays **Running**.

You can also use the command `kubectl get nodes` to review the status of all nodes in the cluster. Check out the
[Access Cluster with CLI](../../cluster-management/palette-webctl.md) guide to learn how to use `kubectl` with a host
cluster.

## Add an Edge Host to a Host Cluster

You can add Edge hosts to the node pool of an existing host cluster. Use the following steps to add the Edge host to the
node pool.

### Limitations

- In a multi-node cluster with <VersionedLink text="PXK-E" url="/integrations/packs/?pack=edge-k8s"/> as its Kubernetes
  layer, you cannot change custom Network Interface Card (NIC). When you add an Edge host to such a cluster, leave the
  NIC field as its default value.

### Prerequisites

- An existing Edge cluster.

- One or more registered Edge host on the same network as your existing cluster. For more information about Edge host
  registration, refer to [Edge Host Registration](./site-installation/edge-host-registration.md).

- You must ensure that the Edge hosts have stable IP addresses. You have the following options to do achieve stable IP
  addressing for Edge hosts:

  - Use static IP addresses. Contact your network administrator to assign the Edge host a static IP address.
  - Use Dynamic Host Configuration Protocol (DHCP) reservations to reserve an IP address in a DHCP network. Contact your
    network administrator to reserve IP addresses for your Edge hosts in a DHCP network.
  - Your Edge cluster has enabled network overlay. Network overlay can only be enabled during cluster creation. For more
    information about network overlay, refer to [Enable Overlay Network](../networking/vxlan-overlay.md).

:::warning

When adding a new Edge host to an existing cluster, ensure you are not creating a scenario where
[etcd](https://etcd.io/) could fail in establishing a quorum. Quorum failures typically result when there is an even
number of control plane nodes. To learn more, check out the resource from the etcd documentation titled
[Why an odd number of cluster members](https://etcd.io/docs/v3.3/faq/#why-an-odd-number-of-cluster-members).

:::

### Add Edge Host to Node Pool

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Use the **Cloud Types drop-down Menu** and select **Edge Native**.

4. Select the host cluster to add the registered Edge host.

5. Click on the **Nodes** tab.

6. Select the node pool to add the Edge host and click the **Edit** button.

7. Navigate to the **Edge Hosts** drop-down Menu and select your Edge host.

8. (Optional) When you select your Edge host, you can optionally specify a static IP address for the Edge host. If you
   want to specify a static IP, toggle on **Static IP** and provide the following information:

   | **Field**       | **Description**                                                                                                                     |
   | --------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
   | IP Address      | The static IP address assigned to your Edge host. This should be unique within your network.                                        |
   | Default gateway | The IP address of the default gateway for your cluster network. This gateway routes traffic from your cluster to external networks. |
   | Subnet mask     | The subnet mask of your cluster network. This defines the range of IP addresses within your cluster network.                        |
   | DNS server      | The IP address of the DNS server your cluster uses for domain resolution.                                                           |

   If certain network information is already available, the corresponding fields will be pre-populated.

9. (Optional) When you assign an Edge host to a node pool, if your Edge host has more than one NIC, you can optionally
   specify which Network Interface Controller (NIC) the Edge host will use to communicate with the cluster. When you
   select an Edge host, Palette displays a dropdown of all NICs present on the Edge host.

   If the NIC is configured on the Edge host network, an IP address is displayed next to the name of the NIC. If the NIC
   is not configured on the Edge host network, you can specify its IP address, default gateway, subnet mask, as well as
   DNS server to configure it.

   If you choose to change the default NIC used by your nodes, you need to make sure all the NICs in the control plane
   node pool share the same name. You also must make corresponding changes in the Kubernetes layer and the CNI layer.

   In the Kubernetes layer, enter a new parameter `cluster.kubevipArgs.vip_interface` and set its value to the name of
   the NIC used by your control plane nodes. For example, if the NIC used by the nodes in your control plane pool is
   named `ens32`, add the following two lines.

   ```yaml {2-3}
   cluster:
    kubevipArgs:
      vip_interface: "ens32"
   ```

   In the CNI layer, depending on which CNI pack you choose for your cluster profile, you need to make changes in the
   following locations.

  <Tabs>
  <TabItem value="calico" label="Calico">
  
    In the Calico pack YAML file default template, uncomment `manifests.calico.env.calicoNode.IP_AUTODETECTION_METHOD` 
    and set its value to `kubernetes-internal-ip`. This tells Calico to use the address assigned to the Kubernetes
    node. 
  
    ```yaml {11}
    manifests:
        calico:
            ...
            env:
            # Additional env variables for calico-node
            calicoNode:
                #IPV6: "autodetect"
                #FELIX_IPV6SUPPORT: "true"
                #CALICO_IPV6POOL_NAT_OUTGOING: "true"
                #CALICO_IPV4POOL_CIDR: "192.168.0.0/16"
                IP_AUTODETECTION_METHOD: "kubernetes-internal-ip"
    ```

  </TabItem>
  <TabItem value="flannel" label="Flannel">

    In the Flannel pack YAML file, add a line `- "--iface=INTERFACE_NAME"` in the default template under
    `charts.flannel.args`. Replace `INTERFACE_NAME` with the name of the NIC. For example, add the line `- "--iface=eno32`
    if the NIC name of your control plane nodes is `eno32`.

    ```yaml {8}
    charts:
        flannel:
            ...
            # flannel command arguments
            args:
            - "--ip-masq"
            - "--kube-subnet-mgr"
            - "--iface=eno32"
    ```

  </TabItem>
  
  <TabItem value="cilium" label="Cilium">
  You do not need to make any adjustments to the Cilium pack.
  </TabItem>

  <TabItem value="other" label="Other">
  If you are using other CNIs, refer to the documentation of your selected CNI and configure it to make sure that it picks the right NIC on your Edge hosts. 
  </TabItem>
  </Tabs>

:::warning

After you add the Edge host to your cluster, you will not be able to change its IP address unless you remove and re-add
them back to the cluster.

:::

10. Confirm your changes.

    The Palette Edge Host agent will start the installation process. You can track the installation progress in Palette.
    The cluster overview page displays a summary of the progress. Use the **Events** tab to review detailed logs.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Select the host cluster you created to view its details page.

4. Review the **Cluster Status**. Ensure the **Cluster Status** field displays **Running**.

You can also use the command `kubectl get nodes` to review the status of all nodes in the cluster. Check out the
[Access Cluster with CLI](../../cluster-management/palette-webctl.md) to learn how to use `kubectl` with a host cluster.
