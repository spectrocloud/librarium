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

Spectro Cloud extends its multi-cluster management and governance capabilities with the introduction of "Workspaces". Workspaces enable the logical grouping of clusters and namespaces to provide application- or team-specific governance and visibility into workloads, cost, and usage metrics. The application or team workload may be deployed into namespaces across clusters for achieving High Availability (HA), Disaster Recovery (DR), and organization-specific placement policies, etc. Grouping such namespaces and clusters into a workspace provides central management and governance in a multi-cluster distributed environment. The following sections describe various aspects of multi-cluster management via workspaces.

# Namespace Management

Workspaces automate the creation/deletion of namespaces that are common to all clusters within the workspace. A workspace can hold a set of namespaces. Spectro Cloud Palette will periodically reconcile the workspace definition and add/remove namespaces if required from all clusters part of the workspace.

# Quota Control

Usage quota in terms of CPU and memory usage limits is specified within the namespaces. Spectro cloud Palette sets the specified limits across all the clusters in the namespaces.

# Role Based Access Control(RBAC)

Role bindings and cluster role bindings are specified within workspaces. Furthermore, these role bindings and cluster role bindings are created in every cluster within the workspaces, thus enabling centralized RBAC.

# Utilization 

Spectro Cloud Palette reports detailed resource utilization of workloads deployed in all the namespaces in the workspace across clusters. In addition, the CPU and memory usage trends within the workspace provide valuable insights into the consumption patterns of an application distributed across clusters.

# Cost Attribution

Spectro Cloud Palette computes utilization cost for workloads deployed in all the namespaces that are part of the workspace across all the clusters based on the detailed resource utilization data. This can be used for internal charge-back or show-back purposes to determine the cost incurred by a application or team.

# Workload Visibility

Workspaces provide a workload browser to view all the workloads such as pods, deployment, jobs, stateful sets, etc., deployed in all the namespaces that are part of the workspace across all the clusters. The workload browser aggregates resources across clusters from relevant namespaces and presents them with centralized visibility. 



# Workspace
## Overview

Spectro Cloud intensifies the governance and control of our tenant clusters with “Workspaces.” Workspace enables the coupling of relevant namespaces across multiple clusters to manage access, obtain cost, and workload visibility by applications or teams. The workspaces are created over clusters or within the defined Namespaces. In addition, Spectro is leveraging Role-based access control (RBAC) to regulate access to our cluster resources based on the roles of custom specified individual users across clusters or namespaces using role bindings.
## Prerequisite
* One or more clusters deployed on Palette.
# Create your Workspace.
* Log in as a tenant to the Spectro Cloud management console.
* From workspaces, select the ‘Create Workspace’ wizard.
  * Give the basic information for the Workspace such as:
    * Unique Name
    * Optional Description
    * Optional Tag 
* Select the cluster(s) to be added to the new workspace.
* The users can optionally go for two types (anyone or both) of role bindings to provide access control to the Workspace:
  * Cluster Role Binding:
Cluster Role Binding is specific to a ClusterRole which is a non-namespaced resource. 
  * Role Binding:
A Role Binding requires the creation of a namespace and then provides access control to that created namespace. 

<InfoBox>
If the user wants to define a role within a namespace, go for role binding, or if the user wants to define a role cluster-wide, go for cluster Role Binding.
</InfoBox>

* Configure the Cluster Role Binding (Optional)
  * In step 2 of new workspace creation, select ‘Add Cluster Role Binding.’
  * The following information is required for the role creation:
    * Role Name: A Kubernetes specific role name
    * Subjects: Cluster Role Binding binds a role to subjects. Subjects can be groups, users, or Service Accounts

|Subject type |Subject name |Subject namespace|
|-------------|-------------|-----------------|
|User|a valid path segment name|NA|
|Group|a valid path segment name|NA|
|Service Account|a valid path segment name|Granting super-user access to all service accounts cluster-wide is strongly discouraged. Hence Grant a role to all service accounts in a namespace|
------------
  * Confirm the values provided to complete the wizard.
* Add the namespace for the cluster workspace and add the CPU and Memory specification for the namespace.
* Configure the Role Binding (Optional):
  * Optionally add role binding for the namespace created.
  * Click on create role binding.
  * The following information is required to complete the wizard:
      * Select the created namespace from the drop-down.
      * Assign a Kubernetes specific name for the role.
      * Make the selection of Subjects from the drop-down (User, Group, or ServiceAccount). For the subject selected, provide a valid path segment name. For the subject, ServiceAccount select namespace name as granting super-user access to all service accounts cluster-wide is strongly discouraged due to security concerns. 
      * Confirm the information provided to complete the configuration of role binding.
  * Review all the values to complete the process of workspace creation.

#  Workspace Monitoring
The workspace helps in monitoring the  Kubernetes resources. 

|Resource|Description availed from Workspace|
|---|-----|
|Namespaces|Cluster Specific namespaces with CPU and Memory utilization|
|Pods|Lists all the pods running on a particular namespace with cluster names with the detailed health status, age, and resource utilization of each of them|
|Deployments|All the running deployments specific to clusters belonging to the workspace with namespace to which these deployments belong, pods details, replicas, and age are enumerated|
|DaemonSets|DaemonSet resource utilization is described, with details on namespaces, pods, and age of individual Daemon sets|
|StatefulSets|All the active StatefulSets specific to clusters belonging to the workspace with corresponding namespace, pods details, replicas, and age are enumerated|
|Jobs|All the running Job details|
|CronJobs|Detailing of all the scheduled CronJobs|
------------

 
 
 
 
  
