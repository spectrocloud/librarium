---
title: "Manage Clusters"
metaTitle: "Managing Cluster Update Events on Palette"
metaDescription: "Events and Notifications on Cluster Updates"
icon: "envelope-open-text"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";



# Manage Clusters

Palette supports several Day-2 operations to manage the end-to-end lifecycle of Kubernetes clusters launched through Palette. It also provides several capabilities across new and imported clusters to perform ongoing management operations like backup/restore and to keep your clusters secure, compliant, and up to date. Additionally, Palette gives you visibility into the workloads running inside your cluster and cluster costs. 


The following sections describe these capabilities in detail:

* [Reconfigure](/clusters/cluster-management/reconfigure) - Scale your clusters up/down by adding/reducing the number of nodes in a node pool and adding additional worker pools. Resize nodes in a node pool by modifying the node specs (CPU, Memory, or Instance Type for public clouds). Add additional fault domains such as availability zones to a node pool.


* [Updates](/clusters/cluster-management/cluster-updates) - Upgrade core packs (OS, Kubernetes, CSI, CNI) and add-on layers, such as Monitoring and Security.



* [Cluster Health Alerts](/clusters/cluster-management/health-alerts) - Palette monitors the health of all workload clusters and raises an alert when the cluster goes to an unhealthy state. Besides displaying the alert on the UI console, Palette provides the ability to have these alerts pushed out to a variety of channels. Users can set up email alerts to receive an email when the health status of their cluster changes.



* [Cluster Monitoring](/clusters/cluster-management/monitoring/deploy-monitor-stack) - Monitor your cluster resources by collecting and reviewing metrics. 


* [Compliance Scans](/clusters/cluster-management/compliance-scan) - Perform continuous compliance checks to ensure your clusters are secure and compliant.



* [OS Patching](/clusters/cluster-management/os-patching) - Automatically apply the most recent security patches to cluster nodes to stay up to date with the latest OS patches.


* [Backup and Restore](/clusters/cluster-management/backup-restore) - Regularly back up your cluster configurations and  any persistent volumes that your applications use. Choose critical namespaces you would like to back up. Restore as required to new or existing clusters.



* [Cost Visibility](/clusters/cluster-management/cloud-cost) - Get visibility into the estimated cloud cost for the cluster based on cluster node configuration. Get additional insights into per namespace cost (Usage Cost) calculated based on the number of resources consumed within the namespace.


* [Workload Visibility](/clusters/cluster-management/workloads) - Palette provides visibility into the resources running inside workload clusters. These resources are displayed on the cluster details page.


* [Node Labels and Taints](/clusters/cluster-management/taints) - You can constrain a pod to run only on a particular set of nodes. There are several ways to do this. Common approaches, such as nodeSelector and node affinity, use labels to facilitate the selection. Taints allow a node to repel a set of pods for appropriate pod allocation to node pools.



* [RBAC and NS Support](/clusters/cluster-management/cluster-rbac) - RoleBindings and ClusterRoleBindings are Role-Based Access Control (RBAC) concepts that allow granular control over cluster-wide resources as well as namespace resources. Palette provides the ability to specify these bindings to configure granular RBAC rules. Palette can also define new namespaces for the cluster and manage the namespaces, such as removing them and assigning quotas and role bindings to them.



* [Add-on Pack Status and Monitoring](/clusters/cluster-management/pack-monitoring) - Palette displays the status and installation progress of add-on packs associated with the cluster you are monitoring. Pack status appears gray during initial onboarding and before deployment, blue when the pack is in the process of being installed, and green to indicate successful installation. Red indicates a failed installation and requires attention.


* [Kubectl](/clusters/cluster-management/palette-webctl#overview) - Learn how to use `kubectl` to interact with your host clusters.



* [Platform Management](/clusters/cluster-management/palette-lock-cluster) - Palette supports the Cluster(s) Management feature to exclude a cluster or a group of clusters from getting upgraded when Palette is upgraded.


* [NOC UI](/clusters/cluster-management/palette-lock-cluster) - Palette provides Intuitive UI-based location monitoring for the clusters running at multiple locations. For public cloud clusters Palette displays the `Region` set during the cluster creation process and displays the location on the UI Map. For private cloud clusters the user can set the location through the Palette UI. The user can monitor the location details of all the clusters running under a specific scope. 

* [Palette Access Control](/clusters/cluster-management/cluster-tag-filter) - Palette provides the ability to manage user and role access privileges through tags. This feature helps you reduce the overhead in managing user and role access to clusters by assigning tags. Tags can be used to group clusters, allowing you to apply access controls to the tag rather than to each cluster, user, or role. This reduces the overhead of managing access controls for individual users and clusters.



* [Image Swap](/clusters/cluster-management/image-swap) - Learn how to use image swap capabilities with Palette. 

<br />
