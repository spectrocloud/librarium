---
sidebar_label: "Workspaces"
title: "Creating Workspaces for Spectro Cloud Clusters"
description: "The methods of creating Workspaces"
hide_table_of_contents: false
sidebar_custom_props:
  icon: "workspaces"
tags: ["workspace"]
---

Palette extends its multi-cluster management and governance capabilities by introducing **Workspaces**. Workspaces
enable the logical grouping of clusters and namespaces to provide application or team-specific governance and visibility
into workloads, cost, and usage metrics. For example, the application or team workload may be deployed into namespaces
across clusters to achieve High Availability (HA), Disaster Recovery (DR), organization-specific placement policies,
etc. Grouping such namespaces and clusters into a workspace provide central management and governance in a multi-cluster
distributed environment. The following sections describe various aspects of multi-cluster management via workspaces.

## Namespace Management

Workspaces automate the creation and deletion of namespaces common to all clusters within the workspace. A workspace can
hold a set of namespaces. Spectro Cloud Palette will periodically reconcile the workspace definition and add/remove
namespaces if required from all clusters part of the workspace.

## Quota Control

Usage quota in terms of CPU and memory usage limits is specified within the namespaces. Spectro Cloud Palette sets the
specified limits across all the clusters in the namespaces.

## Role Based Access Control(RBAC)

Role bindings and cluster role bindings are specified within workspaces. Furthermore, these role bindings and cluster
role bindings are created in every cluster within the workspaces, thus enabling centralized RBAC.

## Utilization

Spectro Cloud Palette reports detailed resource utilization of workloads deployed in all the namespaces in the workspace
across clusters. In addition, the CPU and memory usage trends within the workspace provide valuable insights into the
consumption patterns of an application distributed across clusters.

## Cost Attribution

Spectro Cloud Palette computes utilization costs for workloads deployed in all the namespaces that are part of the
workspace across all the clusters based on the detailed resource utilization data. This can be used for internal
charge-back or show-back purposes to determine the cost incurred by an application or team.

## Workload Visibility

Workspaces provide a workload browser to view all the workloads such as pods, deployment, jobs, stateful sets, etc.,
deployed in all the namespaces that are part of the workspace across all the clusters. The workload browser aggregates
resources across clusters from relevant namespaces and presents them with centralized visibility.

## Backup and Restore

A workspace-based backup is similar to a cluster backup, with the additional coverage of multiple clusters, should the
workspace include more than one. The prerequisites and detailed instructions to backup and restore clusters are
specified on the [Backup and Restore](../clusters/cluster-management/backup-restore/backup-restore.md) page.

## Regex for Namespaces

Palette leverages [Regex Pattern matching](workload-features.md#regex-for-namespaces) to select multiple namespaces to
apply Role binding concurrently. When we have many namespaces to be configured for role binding, the user can provide a
Regex pattern matching multiple namespaces instead of giving a single namespace. This will help select all the
namespaces matching the given Regex pattern to be selected together for role binding. >
