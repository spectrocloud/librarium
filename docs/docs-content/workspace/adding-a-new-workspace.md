---
sidebar_label: "Adding a Workspace"
title: "Adding a workspace"
description: "How to create multi-cluster workspace in Palette"
icon: ""
hide_table_of_contents: false
sidebar_position: 0
tags: ["workspace"]
---


Palette enables multi-cluster management and governance capabilities by introducing Workspaces. This section explains how a workspace can be created in the Palette console.

## Prerequisites

  * One or more running workload clusters within the project.
  * Cluster must not be imported with read-only mode.
  * RBAC should not be set at cluster level but to be included at workspace level.
  * Palette Virtual Clusters cannot be part of the workspace.

## Create Your Workspace

1. Add the Basic Information
Provide the basic information for the workspace such as:

* Unique Name
* Optional Description
* Optional Tag


2.Associate Clusters

  * Select the cluster(s) to be added to the workspace. (See [New Clusters](../clusters/clusters.md) to learn how to add a new Cluster.) Palette clusters, as well as brownfield clusters, can be added to your workspace.


  * Configure the Cluster Role Binding (optional). Role bindings can be created on all workspace clusters.
    - As step 2 of the new Workspace creation, select **Add Cluster Role Binding**.
    - Provide the name of the role for which the cluster role binding needs to be created. The role should be pre-existing or an in-built system role. Palette does not create cluster roles.  
    - Subjects for the cluster role binding can be groups, users, or service accounts.

    | **Subject Type** | **Subject Name**              | **Subject Namespace**                                                                                                                                |
    | ---------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
    | **User**         | a valid path segment name | NA                                                                                                                                         |
    | **Group**            | a valid path segment name | NA                                                                                                                                         |
    | **Service Account**  | a valid path segment name | Granting super-user access to all service accounts <br /> cluster-wide is strongly discouraged. Hence, grant a <br /> role to all service accounts in a namespace. |

  
3. Associate Namespaces
  
* Enter one or more namespaces that need to be part of the workspace. The combination of workspace and cluster is unique across workspaces in a project. Palette ensures that all the namespaces are created for all the clusters in the workspaces, in case they are not pre-existing.


* Add the resource quota for the namespaces by specifying CPU and Memory limits (optional).


* Configure the Role Binding (optional). The following information is required for each role binding:
   * Select a namespace name or the Regex for namespaces for selecting multiple namespaces.
   * Specific name for the role which is pre-existing
   * Make the selection of Subjects from the dropdown list (User, Group, or ServiceAccount). For the subject selected, provide a valid path segment name. For the subject, ServiceAccount select namespace name as granting super-user access to all service accounts cluster-wide is strongly discouraged due to security concerns.
   * Confirm the information provided to complete the configuration of role binding.
  
4. Settings


* [Schedule Backups](../clusters/cluster-management/backup-restore/backup-restore.md) - set the backup and restore policies.
    
* [Container Image](workload-features.md#restrict-container-images-to-a-workspace) - list out the container images to be restricted within a Workspace namespace.



Review and finish the configuration and complete the deployment.


