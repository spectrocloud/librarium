---
sidebar_label: "Increase PCG Node Count"
title: "Increase PCG Node Count"
description: "Learn how to increase the number of nodes in a Private Cloud Gateway (PCG) in Palette."
hide_table_of_contents: false
sidebar_position: 20
tags: ["pcg"]
---

You can increase the number of nodes in a Private Cloud Gateway (PCG). This is useful when you want to convert a single
node PCG to a multi-node PCG to provide additional capacity or to meet the requirements of your workloads.

:::warning

You cannot scale down the number of nodes in a PCG. If you want to reduce the number of PCG nodes then you must delete
the PCG and deploy a new PCG with the desired number of nodes. This limitation is due to etcd not supporting scale down
operations.

:::

Use the following steps to increase the number of nodes in a PCG.

## Prerequisites

- A PCG is installed, active and in a healthy state. Refer to [Deploy a PCG](../deploy-pcg/deploy-pcg.md) for
  instructions on how to install a PCG.

- The PCG is a single node deployment.

- The PCG was deployed through the Palette CLI. A PCG hosted on an existing Kubernetes cluster cannot be scaled up by
  Palette.

- Three additional IP addresses are available for the new nodes.

- Tenant administrator access.

## Change Node Count

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant administrator.

2. Navigate to the left **Main Menu** and select **Tenant Settings**.

3. Select **Private Cloud Gateways** from the **Tenant Settings Menu**.

4. Identify the PCG you want to modify and click on the **Three-Dot Menu** at the end of the PCG row.

5. Select **Set number of nodes**.

6. Click on the radio button to select the number of nodes you want to set for the PCG.

7. Click **Confirm** to apply the changes.

8. From the PCG list view, click on the PCG to access the PCG details page. From the PCG details page, click on the
   **Nodes** tab to view the status of the nodes.

Additional nodes are added sequentially to the PCG. The status of the nodes will change from **Provisioning Node** to
**Running** once the provisioning process is complete.

![View of the nodes page with two nodes in the deployment process](/clusters_manage-pcg_scale-pcg-nodes_nodes-view.png)

## Validate

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant administrator.

2. Navigate to the left **Main Menu** and select **Tenant Settings**.

3. Select **Private Cloud Gateways** from the **Tenant Settings Menu**.

4. Click on the PCG to access the PCG details page.

5. From the PCG details page, click on the **Nodes** tab to view the status of the nodes.

6. Verify that the number of nodes has been increased and that the status of the new nodes is **Running**.
