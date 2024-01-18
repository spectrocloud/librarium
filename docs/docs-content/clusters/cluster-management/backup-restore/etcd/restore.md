---
sidebar_label: 'Restore an etcd Cluster'
title: 'Restore an etcd Cluster'
description: 'Learn how to restore an etcd cluster'
hide_table_of_contents: false
sidebar_position: 30
tags: ["clusters", "cluster management", "backup"]
---

etcd's leader-based distributed system is resistant to faults. An etcd cluster always has an odd number of nodes and can tolerate up to (N-1) / 2 members of a cluster being down without compromising its consistency, where N represents the total number of nodes in a cluster. However, when a node experiences outage, it is important to restore the node with an up-to-date backup file. 

If a cluster loses more than half of its nodes, you would need to find the most recent leader by analyzing the logs and restore the cluster using the backup file from the most recent leader. 

Both restoring a corrupted 

## Prerequisites

- You have SSH access to the nodes of the Kubernetes cluster.

- etcd backups must be enabled on the cluster.

## Restore a Corrupted Member


## Restore an Entire Cluster