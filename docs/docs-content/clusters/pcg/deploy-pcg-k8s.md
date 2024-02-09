---
sidebar_label: "Deploy a PCG to an Existing Kubernetes Cluster"
title: "Deploy a PCG to an Existing Kubernetes Cluster"
description: "Learn how to deploy a Private Cloud Gateway (PCG) to an existing Kubernetes cluster."
hide_table_of_contents: false
sidebar_position: 30
tags: ["pcg"]
---

For infrastructure environments that the Palette CLI does not support, you can deploy a Private Cloud Gateway (PCG) to
an existing Kubernetes cluster. This guide provides the steps to deploy a PCG to an existing Kubernetes cluster.

## Supported Environments

You can deploy a PCG onto an existing Kubernetes cluster that is not managed by Palette to the following environments:

- AWS
- Azure
- GCP
- Nutanix. Refer to the [Nutanix](../data-center/nutanix/nutanix.md) section for more information about requirements.

### PCG Sizing

The following table provides the recommended sizing for the PCG based on the number of nodes, CPU, memory, storage, and
the maximum concurrent cluster deployments. You can continue to deploy additional clusters once the current clusters
deployment batch is complete.

##### Single-Node Cluster

| **Size** | **Nodes** | **CPU** | **Memory** | **Storage** | **Maximum concurrent cluster deployments** |
| -------- | --------- | ------- | ---------- | ----------- | ------------------------------------------ |
| Small    | 1         | 4       | 4 GB       | 60 GB       | 1-3                                        |
| Medium   | 1         | 8       | 8 GB       | 100 GB      | 4-6                                        |
| Large    | 1         | 16      | 16 GB      | 120 GB      | 7-10                                       |

##### High-Availability (HA) Cluster

| **Size** | **Nodes** | **CPU** | **Memory** | **Storage** | **Maximum concurrent cluster deployments** |
| -------- | --------- | ------- | ---------- | ----------- | ------------------------------------------ |
| Small    | 3         | 4       | 4 GB       | 60 GB       | 4-6                                        |
| Medium   | 3         | 8       | 8 GB       | 100 GB      | 7-10                                       |
| Large    | 3         | 16      | 16 GB      | 120 GB      | 10-15                                      |

## Prerequisites

- An existing Kubernetes cluster created that has network connectivity with Palette.

- The Kubernetes cluster must at least have the following resources:

  - 4 vCPUs
  - 4 GB of memory
  - 60 GB of disk space
  - 1 control plane node and 1 worker node. We recommend using a minimum of 3 nodes for production environments. Refer
    to the [PCG Sizing](#pcg-sizing) section for more information.

## Install PCG

Use the following steps to install the PCG in your self-hosted Kubernetes cluster.

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu**, select **Tenant Settings**.

3. Next, on the **Tenant Settings Menu**, select **Private Cloud Gateways** and click on **Add New Private Cloud
   Gateway**.

4. Select **Self Hosted** in the next window that Palette displays.

5. Provide a name for the PCG and use the **drop-down Menu** to select the target infrastructure provider. Click
   **Confirm** to continue. You will be redirected to the Private Cloud Gateway Overview page.

6. To install the Palette agent, copy the kubectl commands from the slide-out panel and execute them against your
   self-hosted cluster.

7. Close the slide-out panel when you have copied both commands. The PCG Overview page **Cluster Status** field will
   display **Pending** while the PCG is deploying. The deployment is complete when the **Cluster Status** field displays
   the status **Running**.

## Validate

When deployed, the PCG registers itself with Palette. Use the steps below to verify if the PCG registration is
successful.

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Navigate to the **left Main Menu** and select **Tenant Settings**.

3. Next, on the **Tenant Settings Menu**, select **Private Cloud Gateways**.

4. Locate the PCG and verify it is installed and in the **Running** state.

## Next Steps

When the PCG is in the **Running** state, you can create the Nutanix cloud account. For guidance, review the
[Add Nutanix Cloud Account](/docs/docs-content/clusters/data-center/nutanix/add-nutanix-cloud-account.md) guide.
