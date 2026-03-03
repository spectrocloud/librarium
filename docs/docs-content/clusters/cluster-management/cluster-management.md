---
sidebar_label: "Manage Clusters"
title: "Manage Clusters"
description: "Events and Notifications on Cluster Updates"
hide_table_of_contents: false
sidebar_custom_props:
  icon: "envelope-open-text"
tags: ["clusters", "cluster management"]
---

Palette supports several Day-2 operations to manage the end-to-end lifecycle of Kubernetes clusters launched through
Palette. It also provides several capabilities across new and imported clusters to perform ongoing management operations
like backup/restore and to keep your clusters secure, compliant, and up to date. Additionally, Palette gives you
visibility into the workloads running inside your cluster and cluster costs.

The following sections describe these capabilities in detail:

- [Node Pools](node-pool.md) - Scale your clusters up/down by adding/reducing the number of nodes in a node pool and
  adding additional worker pools. Resize nodes in a node pool by modifying the node specs (CPU, Memory, or Instance Type
  for public clouds).

- [Updates](cluster-updates.md) - Upgrade core packs (OS, Kubernetes, CSI, CNI) and add-on layers, such as Monitoring
  and Security.

- [Cluster Health Alerts](health-alerts.md) - Palette monitors the health of all workload clusters and raises an alert
  when the cluster goes to an unhealthy state. Besides displaying the alert on the UI console, Palette provides the
  ability to have these alerts pushed out to a variety of channels. Users can set up email alerts to receive an email
  when the health status of their cluster changes.

- [Cert Manager Add-On](cert-manager-addon.md) - You can deploy the Cert Manager pack to automate the process of
  requesting, managing, and renewing cluster certificates.

- [Renew Cluster PKI Certificates](certificate-management.md) - You can renew cluster certificates on-demand or leverage
  the automatic cluster update process to handle certificate renewal operations.

- [Cluster Monitoring](monitoring/deploy-monitor-stack.md) - Monitor your cluster resources by collecting and reviewing
  metrics.

- [Compliance Scans](compliance-scan.md) - Perform continuous compliance checks to ensure your clusters are secure and
  compliant.

- [OS Patching](os-patching.md) - Automatically apply the most recent security patches to cluster nodes to stay up to
  date with the latest OS patches.

- [Backup and Restore](backup-restore/backup-restore.md) - Regularly back up your cluster configurations and any
  persistent volumes that your applications use. Choose critical namespaces you would like to back up. Restore as
  required to new or existing clusters.

- [Cost Visibility](cloud-cost.md) - Get visibility into the estimated cloud cost for the cluster based on cluster node
  configuration. Get additional insights into per namespace cost (Usage Cost) calculated based on the number of
  resources consumed within the namespace.

- [Workload Visibility](workloads.md) - Palette provides visibility into the resources running inside workload clusters.
  These resources are displayed on the cluster details page.

- [Node Labels and Taints](taints.md) - You can constrain a pod to run only on a particular set of nodes. There are
  several ways to do this. Common approaches, such as `nodeSelector` and node affinity, use labels to facilitate the
  selection. Taints allow a node to repel a set of pods for appropriate pod allocation to node pools.

- [RBAC and NS Support](cluster-rbac.md) - RoleBindings and ClusterRoleBindings are Role-Based Access Control (RBAC)
  concepts that allow granular control over cluster-wide resources as well as namespace resources. Palette provides the
  ability to specify these bindings to configure granular RBAC rules. Palette can also define new namespaces for the
  cluster and manage the namespaces, such as removing them and assigning quotas and role bindings to them.

- [Namespace Management](namespace-management.md) - use Kubernetes namespaces to partition resources among multiple
  users without having to set up multiple physical clusters, configure Role-Based Access Control (RBAC) based on
  namespaces, and more.

- [Add-on Pack Status and Monitoring](pack-monitoring.md) - Palette displays the status and installation progress of
  add-on packs associated with the cluster you are monitoring. Pack status appears gray during initial onboarding and
  before deployment, blue when the pack is in the process of being installed, and green to indicate successful
  installation. Red indicates a failed installation and requires attention.

- [Kubectl](palette-webctl.md) - Learn how to use `kubectl` to interact with your host clusters.

- [Platform Settings](./platform-settings/platform-settings.md) - Palette supports two Cluster Management features:
  exclude a cluster or a group of clusters from getting upgraded when Palette is upgraded and disable auto remediation
  of unhealthy cluster nodes.

- [Map and Filter Clusters](./cluster-map-filters.md) - The Palette Dashboard provides users with the ability to map and
  filter Kubernetes clusters. You can find these capabilities on the **Clusters** page. Mapping and filtering is
  available for clusters deployed to public clouds, data centers and edge hosts.

- [Palette Access Control](../../user-management/palette-rbac/implement-abac.md) - Palette provides the ability to
  manage user and role access privileges through tags. This feature helps you reduce the overhead in managing user and
  role access to clusters by assigning tags. Tags can be used to group clusters, allowing you to apply access controls
  to the tag rather than to each cluster, user, or role. This reduces the overhead of managing access controls for
  individual users and clusters.

- [Image Swap](image-swap.md) - Learn how to use image swap capabilities with Palette.

- [Maintenance Mode](./maintenance-mode.md) - Turn off scheduling (cordon) and drain nodes, migrating workloads to other
  healthy nodes in the cluster without service disruptions.
