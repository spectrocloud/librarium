---
title: "Workspaces"
metaTitle: "Creating Workspaces for Spectro Cloud Clusters"
metaDescription: "The methods of creating Workspaces"
icon: "workspaces"
hideToC: false
fullWidth: false
---

import Tabs from '@librarium/shared/src/components/ui/Tabs';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import InfoBox from '@librarium/shared/src/components/InfoBox';
import PointsOfInterest from '@librarium/shared/src/components/common/PointOfInterest';

# Overview

Spectro Cloud extends its multi-cluster management and governance capabilities with the introduction of "Workspaces". Workspaces enable the logical grouping of clusters and namespaces to provide application or team spcific governance and visbility into workloads, cost and usage metrics. Workloads for an application or team maybe deployed into namespaces across clusters for several reasons such as High Avaiability (HA), Disaster Recovery (DR), organization secific placement policies etc. Grouping such namespaces and clusters into a workspace provides central management and governance in a multi-cluster distributed environment. The following sections describe various aspects of multi cluster magement via workspaces.

# Namespace Management

Workspaces automate the creation/deletion of namespaces that are common to all clusters within the workspace. A  set of namespaces can be added to the workspace. Spectro Cloud will periodically reconcile the workspace definition and add/remove namespaces if required from all clusters part of the workspace.

# Quota Control

Usage quota in terms of CPU and Memory usage limits can be specified within namespaces. Spectro cloud sets the specified limits on all the namespaces across all the clusters in the namespace.

# Role Based Access Control(RBAC)

Role Bindings and Cluster Role bindings can be specified within workspaces. These role bindings and cluster role bindings are reated in every cluster part of the workspace thus enabling centralized RBAC.

# Utilization 

Spectro Cloud reports detailed resource utilization by workloads deployed in all the namespaces that are part of the workspace across all the clusters. The CPU and memory usage trends within workspace provide valuable insights into the consumption patterns or an application distributed across clusters.

# Cost Attribution

Based on the detailed resource utilization data, Spectro Cloud computes utilization cost for workloads deployed in all the namespaces that are part of the workspace across all the clusters. This can be used for internal charge-back or show-back purposes to determine the cost incurred by application or team.

# Workload Visibility

Workspaces provide a workload browser to be able to view all the workloads such as pods, deployment, jobs, stateful sets etc. deployed in all the namespaces that are part of the workspace across all the clusters. The workload browser aggregates resources across clusters from relevant namespaces and presents in a common view for centraized visibility. 




 
 
 
 
  
