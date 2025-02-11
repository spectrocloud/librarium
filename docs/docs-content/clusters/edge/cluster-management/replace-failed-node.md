---
sidebar_label: "Replace a Failed Node"
title: "Replace a Failed Node"
description: "Learn about how to replace a failed node in a two-node HA cluster."
hide_table_of_contents: false
sidebar_position: 38
tags: ["edge", "HA", "cluster management"]
---

A highly available (HA) two-node cluster can withstand the failure of one node and still maintain production capacity.
However, when a node fails, it is important to either restore the health of the failed node or replace it with a new one
to maintain high availability. This guide teaches you how to replace a failed node.

## Prerequisite

- You have an active two-node cluster with one of the node experiencing failure.

- You have an Edge host registered with Palette.

- You new registered Edge host must be in the same network as the surviving node of the cluster.

## Replace a Failed Node.

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click **Clusters**.

3. Select the cluster with the failed node.

4. Click the **Nodes** tab in the cluster view.

5. Confirm that the healthy node is the leader node. If the leader node is unhealthy, you must wait for the cluster
   failover to complete first, which promotes the healthy follower node to become the new leader.

   To learn more about the leader-follower architecture of the two-node HA cluster, refer to
   [Two-Node Architecture](../architecture/two-node.md).

6. Click **Edit** on the control plane pool.

7. Click the **delete** button on the unhealthy node.

8. Click **Add Edge Hosts**.

9. Select the new Edge host to add to the cluster.

10. Click **Confirm**.

It may take 10 - 20 minutes for the new node to reach **Healthy** status.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click **Clusters**.

3. Select the cluster with the replaced node.

4. Click the **Nodes** tab in the cluster view.

5. Ensure that both nodes are in **Healthy** status.
