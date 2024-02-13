---
sidebar_label: "Create and Manage IPAM Node Pools"
title: "Create and Manage IPAM Node Pools"
description: "Learn how to create and manage IPAM node pools for a PCG deplyed in a VMware vSphere environment."
hide_table_of_contents: false
sidebar_position: 10
tags: ["pcg"]
---

You can create and manage additional node pools for a Private Cloud Gateway (PCG) deployed in VMware vSphere. By
default, a PCG is created with a single node pool definition based on the values provided during the installation
process. The default node pool created during the installation is resevered for the PCG cluster and cannot be used by
other clusters.

:::info

Other private cloud providers, such as MAAS and OpenStack, do not have the ability to create additional node pools. You
can manage where compute nodes are deployed by using the native placement capabilities provided by the private cloud
provider such as tags, availability zones, or regions.

:::

You can create additional node pools to meet the requirements of your workloads, such as defining different node pools
for different workloads, better manage the IP address utilization, or to provide additional capacity. This guide
provides instructions on how to create a node pool for IP address management (IPAM) for a PCG deployed in a VMware
vSphere environment.

Use the following steps to create and manage node pools for a PCG.

## Prerequisites

- A PCG is installed, active and in a healthy state. Refer to [Deploy a PCG](../deploy-pcg/deploy-pcg.md) for
  instructions on how to install a PCG.

- Tenant administrator access.

## Create a PCG Node Pool

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant administrator.

2. Navigate to the left **Main Menu** and select **Tenant Settings**.

3. Select **Private Cloud Gateways** from the **Tenant Settings Menu**

4. Click on the PCG for which you want to create a node pool.

5. From the PCG details page, click on the **IP Address Management (IPAM)** tab.

6. Select **Add New Pool**.

7. Fill out the form. Refer to the table below to learn more about each input option.

   | Field                            | Description                                                                                                                                            |
   | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | **Name**                         | A unique name for the node pool.                                                                                                                       |
   | **Network Type**                 | Choose between **Range** or **Subnet**. Each option has different input requirements. Refer to the [Range](#range) or [Subnet](#subnet) to learn more. |
   | **Gateway**                      | The gateway IP address for the node pool.                                                                                                              |
   | **Nameservers addresses**        | The IP addresses of the nameservers for the node pool.                                                                                                 |
   | **Nameserver search suffix**     | The search suffix for the domain suported by the nameservers.                                                                                          |
   | **Restrict to a single cluster** | If enabled, the node pool will be restricted to a single cluster. Additional cluster will require creating more node pools.                            |

   #### Range

   If you select **Range** as the **Network Type**, you will need to provide the following additional information:

   | Field              | Description                                             |
   | ------------------ | ------------------------------------------------------- |
   | **IP Start range** | The starting IP address for the node pool.              |
   | **IP End range**   | The ending IP address for the node pool.                |
   | **Network Prefix** | The network prefix for the node pool. For example `/18` |

   #### Subnet

   If you select **Subnet** as the **Network Type**, you will need to provide the following additional information:

   | Field              | Description                                                               |
   | ------------------ | ------------------------------------------------------------------------- |
   | **Subnet**         | The subnet for the node pool in CIDR format. For example `10.10.100.0/24` |
   | **Network Prefix** | The network prefix for the node pool. For example `/18`                   |

8. Click **Confirm** to create the node pool.

## Validate

Use the following steps to validate that the node pool was created successfully.

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant administrator.

2. Navigate to the left **Main Menu** and select **Tenant Settings**.

3. Select **Private Cloud Gateways** from the **Tenant Settings Menu**

4. Click on the PCG for which you want to create a node pool.

5. From the PCG details page, click on the **IP Address Management (IPAM)** tab.

6. The new node pool should be listed in the **Node Pools** section.
