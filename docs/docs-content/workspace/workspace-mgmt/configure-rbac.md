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

|                       | Workspace RBAC                                           | Palette RBAC                                             |
| --------------------- | -------------------------------------------------------- | -------------------------------------------------------- |
| Access control domain | Kubernetes API objects in the clusters in the workspace. | Palette resources.                                       |
| Subjects              | Kubernetes users, groups, and service accounts.          | Palette users and teams                                  |
| Example resources     | ConfigMaps, Secrets, Pods, StatefulSets, etc.            | Cluster profiles, clusters, workspaces, Edge hosts, etc. |

## Create Workspace-Level Role Bindings

By creating a workspace-level role binding, you create role bindings in the all clusters in the workspace in the
namespaces you choose. You can also use Regular Expressions (regex) to create role bindings in all namespaces that match
the regex.

For example, if you create a role binding that binds the cluster role `podReader` to the service account
`podReaderAccount` in the `default` namespace. Every cluster in your workspace will get a role binding that binds the
cluster role `podReader` to the service account `podReaderAccount` in that cluster's `default` namespace.

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

   Alternatively, enter a regex that match the namespaces where you want to create the role binding. Each regex needs to
   start and end with a forward slash`/`. For example `/palette-.*/` will match any namespace that starts with
   `palette-`. You may also use the negation symbol `~` to select all namespaces that do not match the regex. For
   example, `~/palette-.*/` matches everything that does not start with `palette-`.

   :::info

   Using regex will _not_ include all the namespaces that match the regex in the workspace. It will still allow you to
   create the role bindings, but the workloads in those namespaces will not be visible.

   :::

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

4. Switch to the **Role Bindings** tab.

5. Search for entries that starts with **spectro-on-demand-**. Open the these entries to confirm that the role bindings
   bind the expected role to the expected subject.

## Configure Cluster Role Binding in All Clusters

By creating a workspace-level cluster role binding, you create the same cluster role binding in every cluster in your
workspace.

For example, if you create a cluster role binding that binds the cluster role `podReader` to the service account
`podReaderAccount`, every cluster will get the role binding that binds the the cluster role `podReader` to the service
account `podReaderAccount`.

### Prerequisites

- An existing workspace. Refer to [Create a Workspace](../adding-a-new-workspace.md) to learn how to create a workspace.

- You are logged in as a Palette user that has the permission to modify workspaces. For more information, refer to
  [Permissions](../../user-management/palette-rbac/permissions.md).

### Procedure

1. Log in to [Palette](https://console.spectrocloud.com).

2. In the **Drop-Down Menu** at the top of the page, choose the project that has your workspace.

3. On the left **Main Menu**, click **Workspaces**.

4. Click on the workspace you want to update.

5. In the upper-right corner, click **Settings**. Then click **Clusters**.

6. Click **Add New Binding**.

7. In the **Cluster Role name** field, enter the name of the cluster role. In the **Subjects** field, enter the type and
   name of the subject. You can enter as many subjects as you need.

   As is with role bindings, neither the cluster role nor the subjects referenced need to exist when you create the
   cluster role binding. However, you must make create them in each cluster. Otherwise, the cluster role binding will
   have no effect.

8. Click **Confirm**.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. In the **Drop-Down Menu** at the top of the page, choose the project that has your workspace.

3. On the left **Main Menu**, click **Workspaces**. Select your workspace.

4. Switch to the **Cluster Role Bindings** tab.

5. Search for entries that starts with **spectro-on-demand-**. Open the these entries to confirm that the role bindings
   bind the expected role to the expected subject.
