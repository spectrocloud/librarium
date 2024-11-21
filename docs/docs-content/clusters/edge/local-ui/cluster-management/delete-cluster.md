---
sidebar_label: "Delete a Cluster"
title: "Delete a Cluster"
description: "Learn how to delete a cluster with Local UI."
hide_table_of_contents: false
sidebar_position: 90
tags: ["edge"]
---

You can delete an active cluster using Local UI. Deleting a cluster will free up all the hosts in the cluster for new
workloads. Deleting a cluster does not unlink the linked hosts. For more information about linking or unlinking hosts,
refer to [Link Hosts](./link-hosts.md).

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
