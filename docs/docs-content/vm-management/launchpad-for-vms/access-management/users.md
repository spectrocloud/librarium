---
sidebar_label: "Users"
title: "Users"
description: "Learn how to manage users in Launchpad for VMs."
icon: " "
hide_table_of_contents: false
sidebar_position: 2
tags: ["vmo", "vm launchpad", "access management"]
---

Launchpad for VMs integrates with Keycloak for user identity. Users you create on the **Users** page are stored in
Keycloak, and Launchpad manages their VMO role and Kubernetes access on your behalf. This guide covers viewing,
creating, editing, resetting passwords, and deleting users.

## Prerequisites

- A cluster created using the Launchpad Appliance. Refer to [Install Launchpad for VMs](../install-vmla-iso.md) for
  guidance.

- An account with the **Platform Admin** VMO role, or membership in a group mapped to Platform Admin.

## Users Page

From the left main menu, select **Settings** > **Access Management** > **Users** to view all users in the appliance.

The **Users** table lists the following columns.

| **Column**   | **Description**                                                |
| ------------ | -------------------------------------------------------------- |
| **Username** | The Keycloak username.                                         |
| **Email**    | The email address on the account.                              |
| **Name**     | The first and last name on the account.                        |
| **Enabled**  | A check mark indicates the user can sign in.                   |
| **Groups**   | Groups the user belongs to. Each group is displayed as a pill. |
| **Created**  | The date the user was created.                                 |
| **Actions**  | Row actions to edit, reset the password, or delete the user.   |

Select a column header to sort. Use the **Filter rows** search box to filter by any field.

## Create Users

Launchpad for VMs creates one or more users in a single guided flow that also assigns their VMO role and namespace
scope.

1. From the left main menu, select **Settings** > **Access Management** > **Users**.

2. Select **Create User**. The **Onboard users** wizard opens on the **Who** step.

3. Complete the following fields for the first user.

   | **Field**           | **Description**                                                                 |
   | ------------------- | ------------------------------------------------------------------------------- |
   | **Username**        | Required. Must be unique.                                                       |
   | **Email**           | Required. Must be a valid email address.                                        |
   | **First Name**      | Optional. The user's given name.                                                |
   | **Last Name**       | Optional. The user's family name.                                               |
   | **Password**        | Required unless **Temporary** is selected. Must meet the password policy.       |
   | **Verify Password** | Must match **Password**.                                                        |
   | **Temporary**       | Select to force a password reset on first sign-in. Bypasses the password field. |

   Passwords must meet the following requirements. Violations appear as inline validation and **Next** stays disabled
   until they are resolved.

   - Minimum 15 characters

   - At least 1 digit

   - At least 1 special character

4. _(Optional)_ To onboard more users at the same time, select **+ Add another user** and repeat the previous step. Each
   user has its own row in the wizard.

5. Select **Next** to open the **Role** step. Select a VMO role to assign to every user in this wizard run, or select
   **Skip** to onboard users without a role.

   | **Role**           | **Description**                                                                                  |
   | ------------------ | ------------------------------------------------------------------------------------------------ |
   | **Platform Admin** | Full control of Virtual Machine Orchestrator. All permissions, all namespaces.                   |
   | **Editor**         | Build VM workflows and templates. Packages, templates, and dashboards (read and write).          |
   | **Operator**       | Day-to-day VM operations. Templates and dashboards (read and write), monitoring, storage (read). |
   | **Viewer**         | Read-only access. Templates, packages, and dashboards (read).                                    |

6. Select **Next** to open the **Scope** step. Choose the namespace scope for the selected role. A scope is required
   when a role is assigned.

   | **Option**               | **Description**                                                                                                    |
   | ------------------------ | ------------------------------------------------------------------------------------------------------------------ |
   | **Cluster-wide access**  | Grants access to all namespaces through a Kubernetes ClusterRoleBinding.                                           |
   | **Select Namespaces**    | Choose one or more existing namespaces. Launchpad creates RoleBindings scoped to those namespaces only.            |
   | **Create New Namespace** | _(Optional)_ Enter a namespace name and select **+ Create** to create a namespace and add it to the current scope. |

7. Select **Next** to open the **Review** step. Review the actions the wizard will perform for each user.

8. Select **Apply**. Each action is tracked with its own progress indicator, and any failures are listed after the
   operation completes.

9. Select **Close** to return to the **Users** page.

Launchpad selects the matching Kubernetes ClusterRole automatically based on the VMO role you assign. The mapping is
fixed.

| **VMO Role**   | **Kubernetes ClusterRole** |
| -------------- | -------------------------- |
| Platform Admin | `spectro-vm-admin`         |
| Editor         | `spectro-vm-power-user`    |
| Operator       | `spectro-vm-user`          |
| Viewer         | `spectro-vm-viewer`        |

## Edit a User

1. From the left main menu, select **Settings** > **Access Management** > **Users**.

2. In the **Actions** column, select the pencil icon for the user you want to edit. The **Edit User** modal opens.

3. Update any of the following:

   | **Field**      | **Description**                                                                                                      |
   | -------------- | -------------------------------------------------------------------------------------------------------------------- |
   | **Email**      | The email address on the account.                                                                                    |
   | **First Name** | The user's given name.                                                                                               |
   | **Last Name**  | The user's family name.                                                                                              |
   | **Enabled**    | Clear the checkbox to disable the account without deleting it. Disabled users cannot sign in.                        |
   | **Groups**     | Add a group by selecting it from the list. Remove a group by selecting the `×` on its pill.                          |
   | **VMO Role**   | Select one of the role cards to assign a VMO platform role. The selected card is outlined.                           |
   | **Namespaces** | Select **Cluster-wide (all namespaces)** or select one or more specific namespaces to scope the Kubernetes bindings. |

   :::info

   The **Username** cannot be changed after a user is created. To use a different username, delete the user and create a
   new one.

   :::

4. Select **Save**.

:::info

When the user is a member of a group that already carries a VMO role, an amber banner appears above the role cards
listing the inherited role (for example, _Platform Admin is inherited from group cluster-admins_). The banner is a
heads-up, not a lock: any role you set here is added to the roles the user already inherits from their groups. Refer to
[How Effective Permissions Are Calculated](#how-effective-permissions-are-calculated) below.

:::

## How Effective Permissions Are Calculated

A user's effective permissions are the **union** of every VMO role and namespace scope granted to them, whether the
grant comes from the user directly or from any group they belong to. There is no override or precedence between sources.
For example, a user who has the **Viewer** role assigned directly and belongs to a group with the **Editor** role
receives the sum of both roles' permissions in the sum of both scopes.

To reduce a user's effective permissions, remove the grant from every source that provides it. Editing the user alone is
not enough if a group also grants the permission. Refer to [Groups](./groups.md) to review and edit group membership and
role assignments.

## Reset a User's Password

1. From the left main menu, select **Settings** > **Access Management** > **Users**.

2. In the **Actions** column for the user, select the key icon.

3. Enter and confirm a new password that meets the password policy.

4. _(Optional)_ Select **Temporary** to require the user to set a new password on next sign-in.

5. Select **Reset**.

## Delete Users

You can delete a single user or select multiple users to delete in a single operation.

### Delete a Single User

1. From the left main menu, select **Settings** > **Access Management** > **Users**.

2. In the **Actions** column, select the trash icon for the user, or right-click the row and select **Delete User**.

3. Confirm the deletion.

### Delete Multiple Users

1. From the left main menu, select **Settings** > **Access Management** > **Users**.

2. Select the checkbox for each user you want to delete. Use the header checkbox to select every user on the current
   page.

3. Select **Delete** in the bulk action bar.

4. For a single selected user, type the username to confirm. For multiple users, type `delete` to confirm.

5. A progress indicator tracks each deletion. Any failures are listed after the operation completes.

:::warning

Deleting a user removes them from Keycloak, but their existing ClusterRoleBindings and RoleBindings may remain until you
explicitly revoke them. Remove the bindings on the [Groups](./groups.md) page or through the Kubernetes API if you no
longer need them.

:::

## Palette-Managed Environments

When Launchpad for VMs is deployed in a Palette-managed environment, user creation may be hidden. In that case, user
lifecycle is managed by the parent platform, and Launchpad displays users for viewing and access policy assignment only.

## Next Steps

- Group users together and manage their VMO role and Kubernetes access in one place. Refer to [Groups](./groups.md).
