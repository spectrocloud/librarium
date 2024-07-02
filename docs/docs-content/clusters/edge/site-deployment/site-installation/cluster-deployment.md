---
sidebar_label: "Create Cluster Definition"
title: "Create Cluster Definition"
description: "Define your Edge cluster using the Edge hosts that are registered and available."
hide_table_of_contents: false
sidebar_position: 30
tags: ["edge"]
---

To complete the Edge Installation process, an Edge host must become a member of a host cluster. You can add an Edge host
to an existing host cluster of type Edge Native, or you can create a new host cluster for Edge hosts and make the Edge
host a member.

Select the workflow that best fits your needs.

- [Create an Edge Native Host Cluster](#create-an-edge-native-host-cluster)
- [Add an Edge Host to a Host Cluster](#add-an-edge-host-to-a-host-cluster)

## Create an Edge Native Host Cluster

Use the following steps to create a new host cluster so that you can add Edge hosts to the node pools.

### Prerequisites

- One or more registered Edge host. For more information about Edge host registration, refer to
  [Edge Host Registration](./edge-host-registration.md).

- If you are using more than one Edge host to form a cluster, the hosts in the same cluster must be on the same network.
- 1 IP address is required for the cluster's Virtual IP address (VIP).
- You require at least 1 IP address for each Edge host.
- You must ensure that the Edge hosts have stable IP addresses. You have the following options to achieve stable IP
  addressing for Edge hosts:
  - Use static IP addresses. Contact your network administrator to assign the Edge host a static IP address.
  - Use Dynamic Host Configuration Protocol (DHCP) reservations to reserve an IP address in a DHCP network. Contact your
    network administrator to reserve IP addresses for your Edge hosts in a DHCP network.

### Create Cluster

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Click on **Add New Cluster**.

4. Choose **Edge Native** for the cluster type and click **Start Edge Native Configuration**.

5. Give the cluster a name, description, and tags. Click on **Next**.

6. Select a cluster profile. If you don't have a cluster profile for Edge Native, refer to the
   [Create Edge Native Cluster Profile](../model-profile.md) guide. Click on **Next** after you have selected a cluster
   profile.

7. Review your cluster profile values and make changes as needed. Click on **Next**.

8. Provide the host cluster with the Virtual IP (VIP) address used by the physical site. Ensure that this VIP is not in
   a CIDR range that cannot routed through a proxy. In addition, ensure that this VIP does not overlap with any IP
   address already used by other hosts in your network, including your Edge hosts.

You can also select any SSH keys in case you need to remote into the host cluster. You can also provide a list of
Network Time Protocol (NTP) servers. Click on **Next**.

9. The node configuration page is where you can specify what Edge hosts make up the host cluster. Assign Edge hosts to
   the **control-plane-pool** and the **worker-pool**. When you have completed configuring the node pools, click on
   **Next**.

10. (Optional) When you assign Edge hosts to node pools, you can optionally specify a static IP address for each Edge
    host. If you want to specify a static IP, toggle on **Static IP** and provide the following information:

| **Field**       | **Description**                                                                                                                     |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| IP Address      | The static IP address assigned to your Edge host. This should be unique within your network.                                        |
| Default gateway | The IP address of the default gateway for your cluster network. This gateway routes traffic from your cluster to external networks. |
| Subnet mask     | The subnet mask of your cluster network. This defines the range of IP addresses within your cluster network.                        |
| DNS server      | The IP address of the DNS server your cluster uses for domain resolution.                                                           |

If certain network information is already available, the corresponding fields will be pre-populated.

:::warning

    After you create the cluster, you will not be able to change the IP address of your existing Edge hosts unless you remove and re-add them back to the cluster.

:::

11. The Settings page is where you can configure a patching schedule, security scans, backup settings, and set up
    Role-Based Access Control (RBAC). Review the settings and make changes if needed. Click on **Validate**.

12. Review the settings summary and click on **Finish Configuration** to deploy the cluster.

After you create the cluster, the Palette Edge Host agent will start the installation process. You can track the
installation progress in Palette. The cluster overview page displays a summary of the progress. Use the _Events_ tab to
review detailed logs.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Select the host cluster you created to view its details page.

4. Review the **Cluster Status**. Ensure the **Cluster Status** field displays **Running**.

You can also use the command `kubectl get nodes` to review the status of all nodes in the cluster. Check out the
[Access Cluster with CLI](../../../cluster-management/palette-webctl.md) guide to learn how to use `kubectl` with a host
cluster.

## Add an Edge Host to a Host Cluster

You can add Edge hosts to the node pool of an existing host cluster. Use the following steps to add the Edge host to the
node pool.

### Prerequisites

An existing Edge cluster.

- One or more registered Edge host on the same network as your existing cluster. For more information about Edge host
  registration, refer to [Edge Host Registration](./edge-host-registration.md).

- You must ensure that the Edge hosts have stable IP addresses. You have the following options to do achieve stable IP
  addressing for Edge hosts:
  - Use static IP addresses. Contact your network administrator to assign the Edge host a static IP address.
  - Use Dynamic Host Configuration Protocol (DHCP) reservations to reserve an IP address in a DHCP network. Contact your
    network administrator to reserve IP addresses for your Edge hosts in a DHCP network.

:::warning

When adding a new Edge host to an existing cluster, ensure you are not creating a scenario where
[etcd](https://etcd.io/) could fail in establishing a quorum. Quorum failures typically result when there is an even
number of nodes. To learn more, check out the resource from the etcd documentation titled
[Why an odd number of cluster members](https://etcd.io/docs/v3.3/faq/#why-an-odd-number-of-cluster-members).

:::

### Add Edge Host to Node Pool

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Use the **Cloud Types drop-down Menu** and select **Edge Native**.

4. Select the host cluster to add the registered Edge host.

5. Click on the **Nodes** tab.

6. Select the node pool to add the Edge host and click the **Edit** button.

7. Navigate to the **Edge Hosts drop-down Menu** and select your Edge host.

8. (Optional) When you select your Edge host, you can optionally specify a static IP address for the Edge host. If you
   want to specify a static IP, toggle on **Static IP** and provide the following information:

| **Field**       | **Description**                                                                                                                     |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| IP Address      | The static IP address assigned to your Edge host. This should be unique within your network.                                        |
| Default gateway | The IP address of the default gateway for your cluster network. This gateway routes traffic from your cluster to external networks. |
| Subnet mask     | The subnet mask of your cluster network. This defines the range of IP addresses within your cluster network.                        |
| DNS server      | The IP address of the DNS server your cluster uses for domain resolution.                                                           |

If certain network information is already available, the corresponding fields will be pre-populated.

:::warning

    After you add the Edge host to your cluster, you will not be able to change its IP address unless you remove and re-add them back to the cluster.

:::

9. Confirm your changes.

The Palette Edge Host agent will start the installation process. You can track the installation progress in Palette. The
cluster overview page displays a summary of the progress. Use the **Events** tab to review detailed logs.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Select the host cluster you created to view its details page.

4. Review the **Cluster Status**. Ensure the **Cluster Status** field displays **Running**.

You can also use the command `kubectl get nodes` to review the status of all nodes in the cluster. Check out the
[Access Cluster with CLI](../../../cluster-management/palette-webctl.md) to learn how to use `kubectl` with a host
cluster.
