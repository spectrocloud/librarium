---
sidebar_label: "Workload Visibility"
title: "Workload Visibility"
description: "Browse all cluster resources such as pods, deployment sets, etc."
hide_table_of_contents: false
sidebar_position: 90
tags: ["clusters", "cluster management"]
---

Palette provides visibility into the resources running inside workload clusters. Workloads are displayed for all infrastructure providers.
These resources are displayed on the cluster details page. Following is the list of resources shown in the workload browser:

| **Resource**          | **Description**                                                                                          |
| --------------------- | -------------------------------------------------------------------------------------------------------- |
| Namespaces            | Namespaces are a way to divide cluster resources between multiple users (via resource quota).            |
| Pods                  | Pods are the smallest deployable units of computing that can be created and managed in Kubernetes.       |
| DeploymentSets        | DeploymentSets are a way to create and manage groups of identical pods.                                  |
| DaemonSets            | DaemonSets are a way to create and manage pods that are deployed on all, or some nodes.                  |
| StatefulSets          | StatefulSets are a way to create and manage pods that have persistent storage and are deployed in order. |
| Jobs                  | Jobs are a way to create and manage pods that are active until completion.                               |
| CronJobs              | CronJobs are a way to create and manage pods that deploy on a schedule.                                  |
| Role Bindings         | Role Bindings are a way to create and manage access to cluster resources.                                |
| Cluster Role Bindings | Cluster Role Bindings are a way to create and manage access to cluster resources.                        |
