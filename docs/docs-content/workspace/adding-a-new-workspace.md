---
sidebar_label: "Create a Workspace"
title: "Create a workspace"
description: "How to create multi-cluster workspace in Palette."
icon: ""
hide_table_of_contents: false
sidebar_position: 0
tags: ["workspace"]
---

Palette enables multi-cluster management and governance capabilities by introducing Workspaces. This page teaches you
how to create a workspace in Palette. All workspace settings can be updated after creation.

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

7. Enter the namespaces you want to include in the workspace. If the a cluster that is part of your workspace has that
   namespace, the namespace and all resources that are scoped within it will be included in the workspace. If any
   cluster in the workspace is missing the namespace you entered, the namespace will be created on that cluster. You
   must use the names of the namespaces exactly, not regular expressions. The regular expression entries are only used
   for creating role bindings in a later step.

8. After selecting the namespaces, you can specify resource limits that the workspace is allowed to consume in the
   **Workspace Quota** section. The **Maximum CPU** and **Maximum Memory** allow you to specif the maximum amount of CPU
   cores and memory that all resources in the entire workspace are allowed to consume.

   You may also specify resource limits on specific namespaces. When you specify a namespace-based limit, it means that
   namespace can get the resources you configured in each cluster.

   For example, if you have two clusters `cluster1` and `cluster2`, and they each have a namespace called `default`. If
   you impose a 2Gi memory limit on the namespace default, then the `default` namespace in both clusters will be able to
   consume 2 Gi memory each. You must ensure that the namespaced-limits, when added together, do not exceed the total
   workspace limit you configured. If we continue with the previous example, you imposed a workspace quota of 4 Gi
   memory, then the `default` namespace cannot have more than 2 Gi of memory, since they are two such namespaces in the
   workspace and both of them added together are allowed 4 Gi of memory.

9. On the same **Namsespaces** page, you can optionally configure role bindings. When you configure a role binding for a
   namespace, you are configuring the same role binding in that namespace in every cluster. Like in Kubernetes, you can
   use either a role or a cluster role in a role binding. Similar to cluster role bindings, this action does not create
   the roles or the subject for you. You must ensure that the corresponding role and subject referenced in the role
   binding exists in the namespaces you configured.

   You can use Regular Expressions (regex) to create role bindings in multiple namespaces that match a certain pattern.
   To do so, enter the regex in the namespace field. For example, `/palette-.*/` will match all namespaces that start
   with `palette-`. When creating the role binding, you can select the regex as the namespace.

   :::info

   Regex entries in the **Namespaces** field do not add the namespaces that match the regex to the workspace. You will
   not be able to monitor resource usage, impose resource limits, or create backups unless you specifically add a
   namespace by its name.

   :::

   When you are finished, click **Next**.

10. In the **Setting** page, you can schedule backups for select namespaces. These backups are created for each cluster
    in the workspace.

    Like cluster backups in Palette, restoring a backup requires the source cluster to be available. When you restore a
    back up, the namespaces that are backed up are restored to each cluster in the workspace. If you delete a cluster
    from the workspace, that cluster's backup will not be restored.

    For more information about backups, refer to
    [Backup and Restore](../clusters/cluster-management/backup-restore/backup-restore.md)

11. Lastly, you can restrict certain container images from being loaded in the namespaces that are managed by the
    workspace. To restrict images from being loaded by resources in a namespace, click **Add New Container Image**.
    Select a namespace you want to restrict the image in, and enter the image URLs in a comma-separated list. When you
    are done, click **Next**.

12. Review your configurations and click **Finish Configuration** to create the workspace.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. In the **Drop-Down Menu** at the top of the page, choose the project you created the workspace in.

3. On the left **Main Menu**, click **Workspaces**.

4. Confirm the workspace has been created with the right configurations.
