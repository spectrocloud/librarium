---
sidebar_label: "Configure RBAC in Workspaces"
title: "Configure RBAC in Workspaces"
description: "Learn how to configure RBAC in workspaces."
hide_table_of_contents: false
sidebar_custom_props:
  icon: "workspaces"
tags: ["workspace", "rbac"]
---

Workspaces extends Kubernetes' native Role-Based Access Control (RBAC) model to allow you to create role bindings and
cluster role bindings at the workspace level, unifying authorization across different clusters. This page teaches you
how to create workspace-level role bindings and cluster role bindings.

RBAC in workspaces is distinct from Palette RBAC. Palette RBAC regulates access to Palette resources such as clusters,
workspaces, and Edge hosts and its subjects are Palette users. Workspace RBAC is an extension of Kubernetes' native RBAC
model. It regulates access to Kubernetes objects in the clusters encompassed by the workspace, and its subjects are
Kubernetes users, groups and service accounts.

|                       | Workspace RBAC                                  | Palette RBAC                                             |
| --------------------- | ----------------------------------------------- | -------------------------------------------------------- |
| Access control domain | Kubernetes clusters in the workspace.           | Palette resources.                                       |
| Subjects              | Kubernetes users, groups, and service accounts. | Palette users and teams                                  |
| Example resources     | ConfigMaps, Secrets, Pods, StatefulSets, etc.   | Cluster profiles, clusters, workspaces, Edge hosts, etc. |

## Create Role Bindings in Namespaces in All Clusters

You can create role bindings in the namespaces that are included in your workspace across all the clusters in your
namespace or use Regular Expressions (regex) to create role bindings in all namespaces that match the regex.

### Prerequisites

- An existing workspace. Refer to [Create a Workspace](../adding-a-new-workspace.md) to learn how to create a workspace.

- You are logged in as a Palette user that has the permission to modify workspaces. For more information, refer to
  [Permissions](../../user-management/palette-rbac/permissions.md).

### Procedure

1. Log in to [Palette](https://console.spectrocloud.com).

2. In the **Drop-Down Menu** at the top of the page, choose the project that has your workspace.

3. On the left **Main Menu**, click **Workspaces**.

4. Click on the workspace you want to update.

5. In the upper-right corner, click **Settings**. Then click **Namespaces**.

6. If the namespace where you want to include are already in the workspace, skip this step.

   At the top of the page, enter the namespace you want to create the role bindings in. Note that doing so will include
   the namespace in the workspace and Palette users who have access to this workspace will be able to see its workloads
   and resource consumption.

   Alternatively, enter a regex that match the namespaces where you want to create the role binding. Using regex will
   not include all the namespaces that match the regex in the namespace. It will still allow you to create the role
   bindings, but the workloads in those namespaces will not be visible.

7. Click **Add New Binding**.

8. In the **Namespace** field, select a namespace or the regex. Then enter the **Role type** and **Role name**. As is in
   Kubernetes, you can use either a role or a cluster role to create a role binding. If you use a cluster role, the
   privilege of the cluster role will still be limited to the namespace where the role binding exists only.

   :::info

   This action only creates the role bindings, but does not create the role or the subject referenced in the role
   binding. Kubernetes allows you to create role bindings without creating the role or the subject, but the role binding
   will have no effect until it can match with a role and a subject. You must make sure to create the role and the
   subject in the namespaces or clusters yourself.

   :::

9. Then in the **Subject** fields, choose the type of the subject and enter the subject name. You can enter as many
   subjects as you need.

10: Click **Confirm**.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. In the **Drop-Down Menu** at the top of the page, choose the project that has your workspace.

3. On the left **Main Menu**, click **Workspaces**. Select your workspace.

4. Switch to the **Role Bindings** or **Cluster Role Bindings** tab.

5. Search for an entry that starts with **spectro-on-demand-**.
