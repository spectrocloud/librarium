---
sidebar_label: "Delete a Cluster"
title: "Delete a Cluster"
description: "Learn how to delete a cluster with Local UI."
hide_table_of_contents: false
sidebar_position: 90
tags: ["edge"]
---

You can delete an active cluster using Local UI. Deleting a cluster will return all nodes in the cluster to **Ready**
status. Deleting a cluster does not unlink the linked hosts. If you want to use the hosts that were freed from the
cluster, you must unlink them first. For more information about linking or unlinking hosts, refer to
[Link Hosts](./link-hosts.md).

When you delete a cluster, the node where you performed the delete action from will be the new leader node of the group.
For more information about leader nodes, refer to [Link Hosts](link-hosts.md#leader-nodes).

## Prerequisites

- Access to [Local UI](../host-management/access-console.md). Any Operating System (OS) user can be used to log in to
  Local UI.

- An active cluster deployed and managed by Local UI.

## Delete a Cluster

1. Log in to [Local UI](../host-management/access-console.md) on the leader node where your cluster is deployed.

2. From the left **Main Menu**, click **Cluster**.

3. In the upper-right corner of the **Cluster** page, click **Actions**.

4. In the **drop-down Menu** that appears, click **Delete**.

5. In the pop-up window that appears, click **Confirm**. During the deletion of the cluster, Local UI will become
   unavailable as the nodes reboot after cluster deletion.

## Validate

1. Log in to [Local UI](../host-management/access-console.md) on the leader of the linked hosts.

2. From the left **Main Menu**, click **Cluster**.

3. Confirm that there is no active cluster and that the cluster has been deleted.
