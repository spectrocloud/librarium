---
sidebar_label: "Create and Manage IPAM Node Pools"
title: "Create and Manage IPAM Node Pools"
description: "Learn how to create and manage IPAM node pools for a PCG deployed in a VMware vSphere environment."
hide_table_of_contents: false
sidebar_position: 10
tags: ["pcg"]
---

You can create and manage additional node pools for a Private Cloud Gateway (PCG) deployed in VMware vSphere. By
default, a PCG is created with a single node pool definition based on the values provided during the installation
process. The default node pool created during the installation is reserved for the PCG cluster and cannot be used by
other clusters. A secondary IP Address Management (IPAM) node pool is also required if you selected static placement
during the PCG installation process.

:::info

Other private cloud providers, such as MAAS and OpenStack, do not have the ability for you to create additional node
pools. You can manage where compute nodes are deployed using the native placement capabilities provided by the private
cloud provider, such as tags, availability zones, or regions. Unlike VMware vSphere, these other private cloud providers
natively support IPAM and DHCP.

:::

You can create additional node pools to meet the requirements of your workloads, such as defining different node pools
for different workloads, better managing the IP address utilization, or providing additional capacity. You can assign
additional IPAM node pools when deploying a VMware vSphere cluster with a static IP network. This guide provides
instructions on how to create an IPAM node pool for a PCG deployed in a VMware vSphere environment.

## Limitations

- Autoscaling is not supported for [VMware vSphere clusters](../../data-center/vmware/create-manage-vmware-clusters.md)
  deployed using an IPAM node pool with
  [static placement configured](../deploy-pcg/vmware.md#static-placement-configuration). To scale your cluster, use
  either use dynamic IP allocation or disable autoscaler and manually adjust your node pool size using your cluster's
  **Nodes** tab. For more information on scaling clusters, refer to our
  [Scale, Upgrade, and Secure Clusters](../../../tutorials/getting-started/palette/vmware/scale-secure-cluster.md#scale-a-cluster)
  tutorial.

## Prerequisites

- A PCG is installed, active, and in a healthy state. Refer to [Deploy a PCG](../deploy-pcg/deploy-pcg.md) for
  instructions on how to install a PCG.

- Tenant administrator access.

- An IP address range or subnet available for the node pool.

## Create a PCG Node Pool

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant administrator.

2. From the left main menu, select **Tenant Settings**.

3. In the **Infrastructure** section, select **Private Cloud Gateways**.

4. Select the PCG for which you want to create a node pool.

5. From the PCG details page, select the **IP Address Management (IPAM)** tab.

6. Select **Add New Pool**.

7. The **Create IP Pool** dialogue appears. Complete the necessary fields.

   | Field                            | Description                                                                                                                                                    |
   | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Name**                         | A unique name for the node pool.                                                                                                                               |
   | **Network Type**                 | Choose between **Range** or **Subnet**. Each option has different input requirements. Refer to the [Range](#range) or [Subnet](#subnet) section to learn more. |
   | **Gateway**                      | The gateway IP address for the node pool.                                                                                                                      |
   | **Nameserver addresses**         | The IP addresses of the nameservers for the node pool.                                                                                                         |
   | **Nameserver search suffix**     | The search suffix for the domain supported by the nameservers. This field is optional.                                                                         |
   | **Restrict to a single cluster** | If enabled, the node pool will be restricted to a single cluster. Additional clusters will require creating more node pools.                                   |

   :::info

   The number of IP addresses assigned to each node pool must be at least three more than the total number of control
   plane and worker nodes that will be assigned to the node pool. At the start of cluster deployment, three IPs are
   immediately reserved: one for the Cluster API (CAPI) bootstrap VM, one for the Kubernetes API load balancer, and one
   for pool-level repaves.

   If you do not have a sufficient number of IP addresses available, the cluster cannot be deployed. As an example, if
   you plan to use the node pool for a cluster with one control plane and three worker nodes, you must have at least
   seven IP addresses available.

   :::

   #### Range

   If you select **Range** as the **Network Type**, you must provide the following information:

   | Field              | Description                                               |
   | ------------------ | --------------------------------------------------------- |
   | **IP Start range** | The starting IP address for the node pool.                |
   | **IP End range**   | The ending IP address for the node pool.                  |
   | **Network Prefix** | The network prefix for the node pool. For example, `/18`. |

   #### Subnet

   If you select **Subnet** as the **Network Type**, you must provide the following information:

   | Field              | Description                                                                 |
   | ------------------ | --------------------------------------------------------------------------- |
   | **Subnet**         | The subnet for the node pool in CIDR format. For example, `10.10.100.0/24`. |
   | **Network Prefix** | The network prefix for the node pool. For example, `/18`.                   |

8. Select **Confirm** to create the node pool.

## Validate

Use the following steps to validate that the node pool was created.

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant administrator.

2. From the left main menu, select **Tenant Settings**.

3. In the **Infrastructure** section, select **Private Cloud Gateways**.

4. Select the PCG for which you want to create a node pool.

5. From the PCG details page, select the **IP Address Management (IPAM)** tab.

6. The new node pool should be listed in the **Node Pools** section.

To use the new node pool, you will need to
[create a VMware vSphere cluster](../../data-center/vmware/create-manage-vmware-clusters.md) with a static IP network
and assign the node pool when configuring the cluster control plane and worker nodes.
