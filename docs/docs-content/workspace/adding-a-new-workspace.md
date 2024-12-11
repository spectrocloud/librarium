---
sidebar_label: "Adding a Workspace"
title: "Adding a workspace"
description: "How to create multi-cluster workspace in Palette"
icon: ""
hide_table_of_contents: false
sidebar_position: 0
tags: ["workspace"]
---

Palette enables multi-cluster management and governance capabilities by introducing Workspaces. This page teaches you
how to create a workspace in Palette.

## Prerequisites

- One or more active workload clusters within the project where the workspace is to be created. The clusters cannot be
  imported in read-only mode. Palette virtual clusters also cannot be part of a workspace.
- You have the permission to create workspaces. For more information, refer to
  [Permissions](../user-management/palette-rbac/permissions.md).

## Create Your Workspace

1. Log in to [Palette](https://console.spectrocloud.com).

2. In the **Drop-Down Menu** at the top of the page, choose the project you want to create the workspace in. Workspaces
   are always scoped to a project.

3. On the left **Main Menu**, click **Workspaces**. Then click **New Workspace**.

4. Add the Basic Information Provide the basic information for the workspace such as:

   - **Name**. The workspace name must be unique in the project.
   - **Description**. An optional description for the workspace.
   - **Tag**. Optional tags for the workspace.

   When you are finished, click **Next**.

5. Choose clusters you want to include in the workspace. A cluster may be included in multiple workspaces. Refer to
   [Create a Cluster](../clusters/clusters.md) to learn how to add a new cluster.

6. On the **Clusters** page, you can optionally create cluster role bindings. To create a new cluster role binding,
   click **Add New Binding**. Enter the name of the cluster role you want to reference in the cluster role binding.

   After specifying the role, you need to specify the subject to which the cluster role binding is applied to. Select
   the subject type and then enter the name of the subject. The name of the subject must be the same as it is defined in
   the cluster.

   :::info

   Unlike Palette RBAC, the users you reference here are Kubernetes user objects in the cluster, not users in your
   Palette environment.

   :::

   While this action will create the same role binding across all the clusters that are part of the workspace, it does
   not define the cluster role nor the subject the role is bound to. You need to define the role yourself in each
   cluster as well as define the subject the role is bound to exists. Otherwise, the cluster role binding will not have
   any effect.

   :::info

   If the cluster role in each cluster has different permissions, then the subjects that the role is bound to will also
   have different permissions across clusters, even though they have the same cluster role binding. The same applies to
   namespace-scoped role bindings defined in the next step.

   :::

7. Select the namespaces you want to include in the workspace. If the a cluster that is part of your workspace has that
   namespace, the namespace and all resources that are scoped within it will be included in the workspace. You may use
   regular expressions to match the names of namespaces.

8. After selecting the namespaces, you can specify resource limits that each

9. - Configure the Cluster Role Binding (optional). Role bindings can be created on all workspace clusters.

   - As step 2 of the new Workspace creation, select **Add Cluster Role Binding**.
   - Provide the name of the role for which the cluster role binding needs to be created. The role should be
     pre-existing or an in-built system role. Palette does not create cluster roles.
   - Subjects for the cluster role binding can be groups, users, or service accounts.

   | **Subject Type**    | **Subject Name**          | **Subject Namespace**                                                                                                                                              |
   | ------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | **User**            | a valid path segment name | NA                                                                                                                                                                 |
   | **Group**           | a valid path segment name | NA                                                                                                                                                                 |
   | **Service Account** | a valid path segment name | Granting super-user access to all service accounts <br /> cluster-wide is strongly discouraged. Hence, grant a <br /> role to all service accounts in a namespace. |

10. Associate Namespaces

    - Enter one or more namespaces that need to be part of the workspace. The combination of workspace and cluster is
      unique across workspaces in a project. Palette ensures that all the namespaces are created for all the clusters in
      the workspaces, in case they are not pre-existing.
    - Add the resource quota for the namespaces by specifying CPU and Memory limits (optional).
    - Configure the Role Binding (optional). The following information is required for each role binding:
      - Select a namespace name or the Regex for namespaces for selecting multiple namespaces.
      - Specific name for the role which is pre-existing
      - Make the selection of Subjects from the dropdown list (User, Group, or ServiceAccount). For the subject
        selected, provide a valid path segment name. For the subject, ServiceAccount select namespace name as granting
        super-user access to all service accounts cluster-wide is strongly discouraged due to security concerns.
      - Confirm the information provided to complete the configuration of role binding.

11. Settings

    - [Schedule Backups](../clusters/cluster-management/backup-restore/backup-restore.md) - set the backup and restore
      policies.
    - [Container Image](workload-features.md#restrict-container-images-to-a-workspace) - list out the container images
      to be restricted within a Workspace namespace.

Review and finish the configuration and complete the deployment.
