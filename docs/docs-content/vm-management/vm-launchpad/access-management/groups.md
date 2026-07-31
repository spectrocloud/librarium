---
sidebar_label: "Groups"
title: "Groups"
description: "Learn how to manage groups in PaletteAI VM Launchpad."
icon: " "
hide_table_of_contents: false
sidebar_position: 3
tags: ["vmo", "vm launchpad", "access management"]
---

Groups are how you assign the same VMO role and Kubernetes access to many users at once. PaletteAI VM Launchpad stores
groups in Keycloak and, when a group is bound to a VMO role, automatically manages the corresponding Kubernetes
ClusterRoleBindings and RoleBindings. This guide covers viewing, creating, editing, and deleting groups.

## Prerequisites

- A cluster created using VM Launchpad. Refer to [Install VM Launchpad](../install.md) for guidance.

- An account with the **Platform Admin** VMO role, or membership in a group mapped to Platform Admin.

## Groups Page

From the left main menu, select **Settings** > **Access Management** > **Groups** to view all groups in the appliance.

The **Groups** table lists the following columns.

| **Column**            | **Description**                                                 |
| --------------------- | --------------------------------------------------------------- |
| **Group Name**        | The group name.                                                 |
| **Path**              | The Keycloak group path.                                        |
| **Members**           | The number of users in the group.                               |
| **Kubernetes Access** | The Kubernetes ClusterRole bound to the group, shown as a pill. |
| **VMO Role**          | The VMO IAM role assigned to the group.                         |
| **Actions**           | Row actions to edit or delete the group.                        |

Select a column header to sort. Use the **Filter rows** search box to filter by any field.

## Create a Group

1. From the left main menu, select **Settings** > **Access Management** > **Groups**.

2. Select **Create Group**.

3. Complete the following fields.

   | **Field**      | **Description**                                                                                                                         |
   | -------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
   | **Group Name** | Required. Follow DNS label rules: lowercase alphanumeric characters and hyphens only. Maximum 128 characters.                           |
   | **Namespaces** | Select **Cluster-wide (all namespaces)** to bind the group across the cluster, or select one or more specific namespaces from the list. |
   | **VMO Role**   | _(Optional)_ Assign a VMO platform role to all members of the group. Select **None** to create a group without a VMO role.              |

   The VMO roles are described in the following table.

   | **Role**           | **Description**                                                                                  |
   | ------------------ | ------------------------------------------------------------------------------------------------ |
   | **Platform Admin** | Full control of Virtual Machine Orchestrator. All permissions, all namespaces.                   |
   | **Editor**         | Build VM workflows and templates. Packages, templates, and dashboards (read and write).          |
   | **Operator**       | Day-to-day VM operations. Templates and dashboards (read and write), monitoring, storage (read). |
   | **Viewer**         | Read-only access. Templates, packages, and dashboards (read).                                    |

4. Select **Create**.

:::info

If a VMO role is selected, a namespace scope (cluster-wide or at least one namespace) is required. VM Launchpad
automatically binds the matching Kubernetes ClusterRole to the group in each selected scope.

:::

VM Launchpad selects the matching Kubernetes ClusterRole automatically based on the VMO role you assign. The mapping is
fixed.

| **VMO Role**   | **Kubernetes ClusterRole** |
| -------------- | -------------------------- |
| Platform Admin | `spectro-vm-admin`         |
| Editor         | `spectro-vm-power-user`    |
| Operator       | `spectro-vm-user`          |
| Viewer         | `spectro-vm-viewer`        |

## Edit a Group

1. From the left main menu, select **Settings** > **Access Management** > **Groups**.

2. In the **Actions** column, select the pencil icon for the group you want to edit, or select the group row to open its
   detail view.

3. Update any of the following:

   - **Namespaces** - Change the namespace scope. Select **Cluster-wide (all namespaces)** or select one or more
     specific namespaces.

   - **VMO Role** - Change the VMO platform role assigned to group members. When you change the role, the corresponding
     Kubernetes ClusterRole is rebound automatically.

   - **Members** - Add or remove users from the group. Type a username to search, or select a user from the list to add
     them. Select the `×` on a member pill to remove them.

4. Select **Done**.

:::info

Member changes take effect on the user's next sign-in or token refresh. Kubernetes access changes are applied
immediately and create or revoke ClusterRoleBindings and RoleBindings in the cluster.

:::

:::info

A user's effective permissions are the union of every role and scope granted to them, whether the grant comes from the
group or from the user directly. Removing a group binding does not revoke permissions the user is granted through
another group or directly. Refer to
[How Effective Permissions Are Calculated](./users.md#how-effective-permissions-are-calculated) for details.

:::

## Delete Groups

You can delete a single group or select multiple groups to delete in a single operation.

### Delete a Single Group

1. From the left main menu, select **Settings** > **Access Management** > **Groups**.

2. In the **Actions** column, select the trash icon for the group, or right-click the row and select **Delete Group**.

3. Type the group name to confirm.

4. Select **Delete**.

### Delete Multiple Groups

1. From the left main menu, select **Settings** > **Access Management** > **Groups**.

2. Select the checkbox for each group you want to delete. Use the header checkbox to select every group on the current
   page.

3. Select **Delete** in the bulk action bar.

4. For a single selected group, type the group name to confirm. For multiple groups, type `delete` to confirm.

5. A progress indicator tracks each deletion. Any failures are listed after the operation completes.

:::warning

Deleting a group removes it from Keycloak and automatically revokes all associated access. The VMO role mapping and any
Kubernetes ClusterRoleBindings or RoleBindings bound to the group are cleaned up in the same operation. This prevents
orphaned bindings from granting cluster access to future users who later join a group with the same name.

:::

## Next Steps

- Create users and assign them to your new groups. Refer to [Users](./users.md).
