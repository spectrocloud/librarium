---
sidebar_label: "Scale a Cluster"
title: "Scale a Cluster"
description: "Learn how to scale up or scale down a cluster."
hide_table_of_contents: false
sidebar_position: 40
tags: ["edge"]
---

Once a cluster is operational, you have the option of scaling up the cluster by adding additional nodes, or scale down
the cluster by removing nodes from the cluster using Local UI.

:::preview

:::

## Scale up a Cluster

To scale up a cluster is to add additional nodes to an active cluster. You can scale up a cluster deployed on hosts
installed in local management mode in Local UI.

### Prerequisites

- You have an active cluster composed of hosts installed in local management mode. For more information, refer to
  [Create Local Cluster](./create-cluster.md).

- The new host you plan to add to the cluster are linked with the host in the existing cluster. For more information,
  refer to [Link Hosts](./link-hosts.md).

- You have access to the leader node of the cluster. For more information about leader host, refer to
  [Link Hosts](./link-hosts.md).

- The content bundle that was last uploaded to the cluster control plane nodes was built with either the
  `--include-palette-content` or the `--include-core-images-only` flag. For more information about building content
  bundles, refer to [Build Content Bundle](../../edgeforge-workflow/palette-canvos/build-content-bundle.md).

### Procedure

1. Log in to [Local UI](../host-management/access-console.md) on the leader node where your cluster is deployed.

2. From the left **Main Menu**, click **Cluster**.

3. On the **Cluster** page, click **Nodes** to view the **Nodes** tab.

4. Select a node pool you want to edit. You can either edit the control plane or the worker pool.

5. In the pop-up window,scroll down to **Pool Configuration** and click on **Add Item**.

6. Select a host that you want to add to the node pool.

7. Click **Confirm** to confirm your changes. It may take 15 to 25 minutes for the change to take effect, depending on
   your environment and workload.

### Validate

1. Log in to [Local UI](../host-management/access-console.md) on the leader node where your cluster is deployed.

2. From the left **Main Menu**, click **Cluster**.

3. On the **Cluster** page, click **Nodes** to view the **Nodes** tab.

4. Confirm that the new node you added to the cluster is in the **Running** status.

## Scale down a Cluster

To scale down a cluster is to remove existing nodes from an active cluster. You can scale down a cluster deployed on
hosts installed in local management mode in Local UI.

:::warning

Do not remove multiple control plane nodes in one operation or remove a control plane node when another control plane
node is in the process of being removed. Doing so may lead to data consistency issues within the cluster.

If you need to remove multiple control plane nodes, wait until after the first node has been removed to remove another
node.

:::

### Prerequisites

- You have an active multi-node cluster composed of hosts installed in local management mode. For more information,
  refer to [Create Local Cluster](./create-cluster.md).

- You have access to the leader node of the cluster. For more information about leader host, refer to
  [Link Hosts](./link-hosts.md).

### Procedure

1. Log in to [Local UI](../host-management/access-console.md) on the leader node where your cluster is deployed.

2. From the left **Main Menu**, click **Cluster**.

3. On the **Cluster** page, click **Nodes** to view the **Nodes** tab.

4. Select a node pool you want to edit. You can either edit the control plane or the worker pool.

5. In the pop-up window, scroll down to **Pool Configuration**. Click the **Delete** button next to the nodes you want
   to remove.

6. When you are done removing nodes, Click **Confirm** to confirm your changes. It may take 15 to 25 minutes for the
   change to take effect depending on your environment and workload. If you have deleted all nodes in the worker pool,
   you can remove the pool altogether.

### Validate

1. Log in to [Local UI](../host-management/access-console.md) on the leader node where your cluster is deployed.

2. From the left **Main Menu**, click **Cluster**.

3. On the **Cluster** page, click **Nodes** to view the **Nodes** tab. Confirm that the node you removed is no longer in
   the cluster.
