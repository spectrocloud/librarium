---
sidebar_label: "Resource Management"
title: "Resource Management"
description: "Learn how to monitor workload resource consumption and implement resource quotas for your workspace."
hide_table_of_contents: false
sidebar_position: 20
tags: ["workspace", "resource-management"]
---

Workspaces give you a unified view of resource consumption in specified namespaces across all clusters in the workspace.
Additionally, you can implement resource quotas for the workspace as a whole, or for individual namespaces. The resource
quotas are implemented using the native Kubernetes ResourceQuota object. Refer to
[Kubernetes documentation](https://kubernetes.io/docs/concepts/policy/resource-quotas) to learn more about resource
quotas.

## Monitor Resource Consumption

Workspaces allow you to view the workloads such as pods, deployments, daemon sets, and stateful sets in the namespaces
that comprise the workspace.

In the workspace details page, the landing **Namespaces** tab give you an overview of how much resources are consumed by
each namespace. The **CPU** and **Memory** column display the total CPU and memory consumed by the namespaces with the
same name in the entire workspace.

You can view more workloads by selecting the corresponding tab. For example, select the **Pods** tab if you want to
monitor pod workloads. Each tab will show you the CPU and memory consumption of the corresponding workload in the entire
workspace.

| **Resource**           | **Available information**                                                                                                        |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Namespaces**         | CPU and memory utilization of the namespace s in each cluster.                                                                   |
| **Pods**               | Lists all the pods in a particular namespace with cluster names with the detailed health status, age, and resource utilization.. |
| **Deployments**        | All deployments in the namespaces included in the workspace and their age, pods, and resource utilization.                       |
| **DaemonSets**         | All daemon set in the namespaces included in the workspace and their age, pods, and resource utilization.                        |
| **StatefulSets**       | All the active StatefulSets in the namespaces included in the workspace and their age, pods, replicas, and resource utilization. |
| **Jobs**               | All jobs in the namespaces included in the workspace and their status.                                                           |
| **CronJobs**           | All cron jobs in the namespaces included in the workspace and their status.                                                      |
| **RoleBinding**        | All role bindings in the namespaces included in the workspace, including the role name and the subject name.                     |
| **ClusterRoleBinding** | All cluster role bindings in the clusters included in the workspace.                                                             |

## Implement Resource Quotas

You can implement resource quotas on an entire workspace or implement them on individual namespaces. Resource quotas are
implemented through Kubernetes' native ResourceQuota object. For more information about resource quotas in Kubernetes,
refer to [Kubernetes documentation](https://kubernetes.io/docs/concepts/policy/resource-quotas/).

### Prerequisites

- An active Palette workspace. Refer to [Create a Workspace](../adding-a-new-workspace.md) to learn how to create one.

- You are logged in as a Palette user that has the permission to modify workspaces. For more information, refer to
  [Permissions](../../user-management/palette-rbac/permissions.md).

### Procedure

1. Log in to [Palette](https://console.spectrocloud.com).

2. In the **Drop-Down Menu** at the top of the page, choose the project that has your workspace.

3. On the left **Main Menu**, click **Workspaces**.

4. Click on the workspace you want to update.

5. Click **Settings** in the upper-right corner.

6. Click **Namespaces**.

7. Under **Workspace Quota**, you can specify the amount of CPU and memory that the entire workspace is allowed to
   consume. The default value is 0, which imposes no limit.

8. If you want to limit resource use based on namespaces, enter the desired CPU and memory limit in the **Allocate CPU**
   and **Allocate memory** columns next to the namespace entry.

   By default, the namespace in each cluster has the same resource limit. You can change this and enter the limit on the
   namespace in one particular cluster. You must ensure that resources configured to individual namespaces do not exceed
   the workspace quota when added together.

   For example, if you have two clusters in the workspace and impose a workspace-level quota of 8 Gi of memory and 8
   CPUs. When each instance of the namespace in each cluster are added together, the total memory and CPU quota cannot
   exceed 8 Gi of memory and 8 CPUs.

   The following resource quota configuration is not allowed for a workspace with 8 Gi of memory and 8 CPUs because the
   resource quotas add up to 11 Gi and 11 CPUs.

   |             | Cluster 1    | Cluster 2    |
   | ----------- | ------------ | ------------ |
   | Namespace 1 | 4 Gi, 4 CPUs | 4 Gi, 4 CPUs |
   | Namespace 2 | 2 Gi, 2 CPU  | 1 Gi, 1 CPU  |

   The following resource quota configuration is allowed because the total quota is 8 Gi and 8 CPUs.

   |             | Cluster 1    | Cluster 2    |
   | ----------- | ------------ | ------------ |
   | Namespace 1 | 2 Gi, 2 CPUs | 2 Gi, 2 CPUs |
   | Namespace 2 | 3 Gi, 3 CPU  | 1 Gi, 1 CPU  |

### Validate

1. Connect to a cluster in your workspace using kubectl. For more information, refer to
   [Access Cluster with kubectl](../../clusters/cluster-management/palette-webctl.md).

2. Issue the following command to view the resource quotas created for your cluster. Confirm that the corresponding
   resource quotas have been created. You may also use the `--namespace` flag to choose a specific namespace to examine.

   ```shell
   kubectl get resourcequota --all-namespaces
   ```
