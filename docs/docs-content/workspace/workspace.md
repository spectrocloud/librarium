---
sidebar_label: "Workspaces"
title: "Creating Workspaces for Spectro Cloud Clusters"
description: "The methods of creating Workspaces"
hide_table_of_contents: false
sidebar_custom_props:
  icon: "workspaces"
tags: ["workspace"]
---

A workspaces in Palette consists of a group of clusters and namespaces and the resources scoped in those clusters and
namespaces. Using workspaces enables you to provide application or team-specific governance and visibility into
workloads, cost, and usage metrics.

For example, the application or team workload may be deployed into namespaces across clusters to achieve High
Availability (HA), Disaster Recovery (DR), or other organization-specific placement policies. Grouping such namespaces
and clusters into a workspace allows centralized management and governance in a multi-cluster distributed environment.

The following sections describe what Palette workspaces can help you achieve.

## Namespace and Resource Management

Workspaces in Spectro Cloud Palette automate the creation and management of namespaces across all clusters in the
workspace. This includes:

- **Namespace Creation**: Creating namespaces across all clusters in your workspace if a cluster does not have a
  specified namespace.
- **Resource Quotas**: Defining and enforcing CPU and memory usage limits within namespaces, applied uniformly across
  all clusters in the workspace.

## Centralized Access Control

Workspaces simplify Role-Based Access Control (RBAC) by centralizing management of role bindings and cluster role
bindings. You can specifying role bindings and cluster role bindings within the workspace to automatically apply them to
all clusters, ensuring consistent and secure access policies across all clusters in a workspace.

## Visibility and Insights

Workspaces enhance operational visibility and provide actionable insights through:

- **Workload Visibility**: A centralized workload browser aggregates and displays workloads (pods, deployments, jobs,
  stateful sets, etc.) across all namespaces and clusters in the workspace.
- **Resource Utilization**: Detailed reporting on CPU and memory usage trends across clusters to understand consumption
  patterns.
- **Cost Attribution**: Calculating costs for workloads based on resource utilization, enabling internal charge-back or
  show-back for teams or applications.

## Backup and Disaster Recovery

**Workspace-Based Backup**: extends cluster-level backups to include namespaces in all clusters within a workspace. For
detailed prerequisites and instructions, refer to the
[Backup and Restore](../clusters/cluster-management/backup-restore/backup-restore.md) page.

## Resources

- [Create a Workspace](./adding-a-new-workspace.md)

- [Workspace Management](./workspace-mgmt/workspace-mgmt.md)
