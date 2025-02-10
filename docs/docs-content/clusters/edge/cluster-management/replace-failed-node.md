---
sidebar_label: "Replace a Failed Node"
title: "Replace a Failed Node"
description: "Learn about how to replace a failed node in a two-node HA cluster."
hide_table_of_contents: false
sidebar_position: 38
tags: ["edge", "HA", "cluster management"]
---

A highly available two-node cluster can withstand the failure of one node and still maintain production capacity.
However, when a node fails, it is important to either restore the health of the failed node or replace it with a new
one. This guide teaches you how to replace a failed node with a new one.

## Prerequisite

- You have an active two-node cluster wite one of the node experiencing failure.

:::warning

If the failure occurred on the leader node, you must wait for the failover to complete first before attempting to
replace the failed node. You can confirm whether the failover has completed by checking the **Nodes** tab of the cluster
and confirm that the healthy node is the leader node.

:::

- You have an Edge host registered with Palette.

- You new registered Edge host must be in the same network as the surviving node of the cluster.

## Replace a Failed Node.

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click **Clusters**.

3. Select the cluster with the failed node.

4. Click the **Nodes** tab in the cluster view.

5. Click **Edit** on the control plane pool.

6. Click the **delete** button on the unhealthy node.

7. Click **Add Edge Hosts**.

8. Select the new Edge host to add to the cluster.

9. Click **Confirm**.

It may take 10 - 20 minutes for the new node to reach **Healthy** status.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click **Clusters**.

3. Select the cluster with the replaced node.

4. Click the **Nodes** tab in the cluster view.

5. Ensure that both nodes are in **Healthy** status.
