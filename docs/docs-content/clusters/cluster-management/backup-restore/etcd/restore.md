---
sidebar_label: "Restore a Single-Node etcd Cluster"
title: "Restore a Single-Node etcd Cluster"
description: "Learn how to restore an etcd cluster"
hide_table_of_contents: false
sidebar_position: 30
tags: ["clusters", "cluster management", "backup"]
---

etcd's leader-based distributed system is resistant to faults. An etcd cluster always has an odd number of nodes and can
tolerate up to (N-1) / 2 members of a cluster being down without compromising its consistency, where N represents the
total number of nodes in a cluster. However, when a node experiences outage, it is important to restore the node with an
up-to-date backup file to ensure the overall health of the cluster.

If a cluster loses more than half of its nodes, etcd becomes unavailable and requires a restore of the whole cluster.

## Prerequisites

- You have SSH access to the nodes of the Kubernetes cluster.

- etcd backups must be enabled on the cluster.

## Recognize Data Corruption

etcd is only part of what makes a Kubernetes cluster operate. When there is an issue with your Kubernetes cluster,
restoring etcd might not fix the problem you are experiencing if the problem doesn't lie with etcd. Therefore, it's
important to isolate the issue to etcd before proceeding with a restore operation.

## Restore a Single Node Cluster
