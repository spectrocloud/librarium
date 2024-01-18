---
sidebar_label: 'Backup and Restore for etcd'
title: 'Backup and Restore for etcd'
description: 'Learn how to enable scheduled backups and restore an etcd cluster.'
hide_table_of_contents: false
sidebar_position: 30
tags: ["clusters", "cluster management", "backup"]
---

etcd is a consistent and highly-available key-value store used as Kubernetes' backing store for all cluster data, including information about nodes, pods, services and other Kubernetes resources. etcd uses a leader-based distributed system and is highly resilient to outages. However, an etcd cluster cannot withstand a disastrous event that brings down the majority of its nodes. If a Kubernetes cluster experiences an etcd outage and there is no etcd backup, it becomes impossible to recover the cluster. 

Palette offers automated etcd backups that allows you to configure automated snapshots of your cluster's etcd component. Refer to the resources in this section to learn how to enable automated backups in your cluster and how to recover an etcd cluster with the backup files. 


- [Enable etcd Backup](enable-backup.md)
- [Restore an etcd Cluster]