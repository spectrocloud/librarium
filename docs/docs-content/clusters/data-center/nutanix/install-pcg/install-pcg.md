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


A Private Cloud Gateway (PCG) is required to connect your Nutanix environment with Palette. The PCG enables Palette to create and monitor Nutanix clusters in the deployed cloud environment. This section guides you on how to install the PCG.

## Prerequisites

- An existing Kubernetes cluster created that has network connectivity with Nutanix Prism Central. This cluster will connect the Nutanix infrastructure with Palette via the PCG. Various types of Kubernetes clusters can be used to deploy the PCG. If you need guidance in creating a Kubernetes cluster to deploy your PCG, check out the [Deploy a Kubernetes Cluster to Host the PCG](/docs/docs-content/clusters/data-center/nutanix/deploy-kubernetes-cluster-pcg.md) section below. This section provides one possible option and explains how to deploy a Kubernetes cluster within the Nutanix environment.

- A Nutanix cloud registered with Palette. For more information, review [Register Nutanix Cloud](/docs/docs-content/clusters/data-center/nutanix/register-nutanix-cloud.md).


## Install PCG

Use the following steps to install the PCG in your Kubernetes workload cluster.

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu**, select **Tenant Settings**.

3. Next, on the **Tenant Settings Menu**, select **Private Cloud Gateways** and click on **Add New Private Cloud Gateway**.

4. Select **Self Hosted** in the next window that Palette displays.

5. Provide a name for the PCG and use the **drop-down Menu** to select Nutanix as the cloud type. Click **Confirm** to continue. You will be redirected to the Private Cloud Gateway Overview page. 

6. To install the Palette agent, copy the kubectl commands from the slide-out panel and execute them against your workload cluster.

7. Close the slide-out panel when you have copied both commands. The PCG Overview page **Cluster Status** field will display **Pending** while the PCG is deploying. The deployment is complete when the **Cluster Status** field displays the status **Running**.  


## Validate

When deployed, the PCG registers itself with Palette. Use the steps below to verify if the PCG registration is successful.

1. Log in to [Palette](https://console.spectrocloud.com/).


2. Navigate to the **left Main Menu** and select **Tenant Settings**.


3. Next, on the **Tenant Settings Menu**, select **Private Cloud Gateways**.


4. Locate the PCG and verify it is installed and in the **Running** state.


## Next Steps

When the PCG is in the **Running** state, you can create the Nutanix cloud account. For guidance, review the [Add Nutanix Cloud Account](/docs/docs-content/clusters/data-center/nutanix/add-nutanix-cloud-account.md) guide.
