---
sidebar_label: "Add DNS Mapping"
title: "Add DNS Mapping"
description: "Learn how to add DNS mapping for a Private Cloud Gateway (PCG) deployed in a VMware vSphere environment."
hide_table_of_contents: false
sidebar_position: 15
tags: ["pcg"]
---

If your VMware vSphere environment is configured with Dynamic Host Configuration Protocol (DHCP), you can add a Dynamic
Name Server (DNS) mapping to the Private Cloud Gateway (PCG) to resolve the hostnames of the nodes in the PCG. You can
also use the DNS mapping ensure nodes are alocated to the correct datacenter, cluster and network.

You can add multiple DNS mappings to a PCG to support different datacenters and networks in your VMware vSphere
environment.

## Prerequisites

- A PCG is installed, active, and in a healthy state. Refer to [Deploy a PCG](../deploy-pcg/deploy-pcg.md) for
  instructions on how to install a PCG.

- Access to the VMware vSphere environment.

- Tenant administrator access.

## Add DNS Mapping

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant administrator.

2. Navigate to the left **Main Menu** and select **Tenant Settings**.

3. Select **Private Cloud Gateways** from the **Tenant Settings Menu**.

4. Click on the PCG for which you want to create a node pool.

5. From the PCG details page, click on the **DNS Mapping** tab.

6. Select **Add New DNS Mapping**.

7. Fill out the form. Refer to the table below to learn more about each input option.

   | Field               | Description                                                 |
   | ------------------- | ----------------------------------------------------------- |
   | **Search Domain**   | The domain name to allocate nodes to and resolve hostnames. |
   | **Datacenter**      | The vSphere datacenter to which the DNS mapping applies.    |
   | **Compute Cluster** | The vSphere cluster to which the DNS mapping applies.       |
   | **Network**         | The vSphere network to which the DNS mapping applies.       |

8. Click **Confirm** to add the DNS mapping.

## Validate

Use the following steps to validate that the DNS mapping was created successfully.

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant administrator.

2. Navigate to the left **Main Menu** and select **Tenant Settings**.

3. Select **Private Cloud Gateways** from the **Tenant Settings Menu**

4. Click on the PCG for which you created a node pool.

5. From the PCG details page, click on the **DNS Mapping** tab.

6. The new DNS mapping should be listed in the **Search Domain** section.

To use the new DNS mapping, you will need to create a cluster and select DHCP as the network type. Select the DNS
mapping when configuring the cluster control plane and worker nodes.
