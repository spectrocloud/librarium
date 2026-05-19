---
sidebar_label: "Create and Manage IPAM Node Pools"
title: "Create and Manage IPAM Node Pools"
description: "Learn how to create and manage IPAM node pools for a PCG deployed in a VMware vSphere environment."
hide_table_of_contents: false
sidebar_position: 10
tags: ["pcg"]
---

You can create and manage additional IP Address Management (IPAM) node pools for Private Cloud Gateways (PCGs) deployed
in VMware vSphere or MAAS environments. IPAM node pools provide static IP address assignment for clusters that do not
use Dynamic Host Configuration Protocol (DHCP).

By default, Palette creates a PCG with a single node pool definition based on the values provided during the
installation process. The default node pool created during the installation is reserved for the PCG cluster and cannot
be used by other clusters.

You can also create additional node pools to meet the requirements of your workloads, such as defining different node
pools for different workloads, better managing IP address utilization, or providing additional capacity.

IPAM node pools can be assigned when deploying the following types of clusters: 

- [VMware vSphere Clusters](../../data-center/vmware/create-manage-vmware-clusters.md) - Assign the node pool to both
  control plane and worker pools that use static placement.
- [MAAS LXD Workload Clusters](../../data-center/maas/create-manage-maas-lxd-clusters.md) - Assign the node pool to the
  control plane pool only. The control plane pool must have **Use LXD VMs** enabled. IPAM node pools cannot be assigned
  to MAAS worker pools.

This guide provides instructions on how to create an IPAM node pool for a PCG deployed in a VMware vSphere or MAAS
environment.

:::info

You cannot create IPAM node pools for Apache CloudStack through Palette. Apache CloudStack natively supports IPAM and
DHCP. You can manage where compute nodes are deployed using the native placement capabilities provided by Apache
CloudStack, such as tags, availability zones, and regions.

:::

## IP Allocation in Clusters

When a cluster is deployed using an IPAM node pool, Palette reserves additional IP addresses
to support cluster operations. The number of extra IPs reserved depends on the machine pool type:

- **Control Plane Pool** - Two additional IPs are reserved for infrastructure components, including the Cluster API (CAPI)
  bootstrap VM and the Kubernetes API load balancer.
- **Worker Pool** - One additional IP is reserved for **Expand First** and **Custom** rolling updates. If the worker
  pool uses the **Contract First** rolling update strategy, no additional IP is reserved.

If you do not have a sufficient number of IP addresses available, the cluster will not be deployed. For example, if you
plan to use the node pool for a cluster with one control plane node and three worker nodes using the default **Expand First** rolling
update strategy, you need at least seven IP addresses available: three for the control plane pool (one node + two extra)
and four for the worker pool (three nodes + one extra).

### VMware vSphere Autoscaling

If autoscaling is enabled when deploying
[VMware vSphere clusters](../../data-center/vmware/create-manage-vmware-clusters.md) using an IPAM node pool with
[static placement configured](../deploy-pcg/vmware.md#static-placement-configuration), the **Maximum size** determines
the number of IP addresses automatically reserved for worker nodes. During day-2 operations, even if autoscaler is
disabled or the **Maximum size** of the worker pool is reduced, the original number of IP addresses remains allocated.
To release the IP addresses, you must
[delete the worker node pool](../../cluster-management/node-pool.md#delete-a-node-pool).

## Create IPAM Node Pool

Take the following steps to create an IPAM node pool for a PCG deployed in a VMware vSphere or MAAS environment.

### Prerequisites

- A PCG is installed, active, and in a healthy state. Refer to [Deploy a PCG](../deploy-pcg/deploy-pcg.md) for
  instructions on how to install a PCG.

- Tenant administrator access.

- An IP address range or subnet available for the node pool.

### Enablement

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant administrator.

2. From the left main menu, select **Tenant Settings**.

3. In the **Infrastructure** section, select **Private Cloud Gateways**.

4. Select the PCG for which you want to create a node pool.

5. From the PCG details page, select the **IP Address Management (IPAM)** tab.

6. Select **Add New Pool**.

7. The **Create IP Pool** modal window appears. Complete the necessary fields.

   | Field                            | Description                                                                                                                                                                                                                                           |
   | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Name**                         | A unique name for the node pool.                                                                                                                                                                                                                      |
   | **Network Type**                 | Choose between **Range** or **Subnet**. Each option has different input requirements. Refer to the [Range](#range) or [Subnet](#subnet) section to learn more.                                                                                        |
   | **Gateway**                      | The gateway IP address for the node pool.                                                                                                                                                                                                             |
   | **Nameserver addresses**         | The IP addresses of the nameservers for the node pool.                                                                                                                                                                                                |
   | **Nameserver search suffix**     | The search suffix for the domain supported by the nameservers. This field is optional.                                                                                                                                                                |
   | **Restrict to a single cluster** | If enabled, the node pool will be restricted to a single cluster. Additional clusters will require creating more node pools. This option is required if you plan to assign the IPAM pool to a MAAS workload cluster whose control plane uses LXD VMs. |

   #### Range

   If you select **Range** as the **Network Type**, you must provide the following information.

   | Field              | Description                                               |
   | ------------------ | --------------------------------------------------------- |
   | **IP Start range** | The starting IP address for the node pool.                |
   | **IP End range**   | The ending IP address for the node pool.                  |
   | **Network Prefix** | The network prefix for the node pool. For example, `/18`. |

   #### Subnet

   If you select **Subnet** as the **Network Type**, you must provide the following information.

   | Field              | Description                                                                 |
   | ------------------ | --------------------------------------------------------------------------- |
   | **Subnet**         | The subnet for the node pool in CIDR format. For example, `10.10.100.0/24`. |
   | **Network Prefix** | The network prefix for the node pool. For example, `/18`.                   |

8. Select **Confirm** to create the node pool.

You have now created your node pool. For VMware vSphere node pools, the **Allocated IPs** column displays the total
number of allocated and available IP addresses in the node pool based on the range or subnet provided.

Select **N IPs allocated, N IPs available** for a breakdown of all IP addresses in the pool and their statuses. When you
create a node pool, all IP addresses are initially **Free**; as clusters are provisioned using the node pool, individual
IP addresses are **Allocated** for use.

![Viewing allocated IP addresses for a node pool](/create-manage-node-pool_allocated-ips.webp)

You can edit and resize your node pool at any time by selecting the three-dot menu beside the node pool and selecting
**Edit**. For more information on how IP addresses are allocated, refer to
[IP Allocation in Clusters](#ip-allocation-in-clusters).

### Validate

Use the following steps to validate that the node pool was created.

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant administrator.

2. From the left main menu, select **Tenant Settings**.

3. In the **Infrastructure** section, select **Private Cloud Gateways**.

4. Select the PCG you created a node pool for.

5. From the PCG details page, select the **IP Address Management (IPAM)** tab.

6. Locate the recently created node pool. For VMware vSphere node pools, review the **Allocated IPs**.

## Next Steps

To use the new node pool, you will need to create a
[VMware vSphere cluster](../../data-center/vmware/create-manage-vmware-clusters.md) or
[MAAS LXD workload cluster](../../data-center/maas/create-manage-maas-lxd-clusters.md) with a static IP network.

For VMware vSphere clusters, assign the node pool when configuring the cluster control plane and worker nodes. For MAAS
LXD workload clusters, you can assign the node pool when configuring the control plane nodes using static IPs. IPAM node
pools cannot be assigned to MAAS worker pools.
