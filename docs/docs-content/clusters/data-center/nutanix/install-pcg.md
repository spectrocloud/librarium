---
sidebar_label: "Install Private Cloud Gateway"
title: "Install Private Cloud Gateway"
description: "Learn how to install a Nutanix Private Cloud Gateway in Palette."
hide_table_of_contents: false
sidebar_position: 10
toc_min_heading_level: 2
toc_max_heading_level: 3
tags: ["data center", "nutanix"]
---


A Private Cloud Gateway (PCG) is required to connect your Nutanix cloud with Palette. The PCG enables Palette to securely monitor Nutanix clusters in the cloud. This section guides you on installing the PCG.

## Prerequisites

- A Nutanix cloud registered in Palette.

- A Kubernetes cluster in Nutanix with version 1.19.x or higher, outbound internet connectivity, and
DNS configured to resolve public internet domain names.


## Install PCG

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu** select **Tenant Settings**.

3. Next, on the **Tenant Settings Menu**, select **Private Cloud Gateways** and click on **+ Add New Private Cloud Gateway**.

4. Select **Self Hosted** in the next window that Palette displays.

5. Provide a name for the PCG and use the **drop-down Menu** to select Nutanix. Palette displays the Private Cloud Gateway Overview page. 

6. To install the Palette agent, copy the kubectl commands from the slide-out panel into your Kubernetes cluster.

7. Close the slide-out panel when you have copied both the commands. The **Cluster Status** field displays **Pending** while the PCG installs. Installation is complete when the **Cluster Status** field displays **Running**. 


## Validate

When installed, the PCG registers itself with Palette. Use the steps below to verify the PCG is registered.

1. Log in to [Palette](https://console.spectrocloud.com/).


2. Navigate to the **left Main Menu** and select **Tenant Settings**.


3. Next, on the **Tenant Settings Menu**, select **Private Cloud Gateways**.


4. Locate the PCG and verify it is installed and in the **Running** state. 


## Next Steps

When the PCG is in the **Running** state, you can create the Nutanix cloud account. 
