---
sidebar_label: "Users"
title: "Users"
description: "Learn how to manage users in PaletteAI VM Launchpad."
icon: " "
hide_table_of_contents: false
sidebar_position: 2
tags: ["vmo", "vm launchpad", "access management"]
---

PaletteAI VM Launchpad integrates with Keycloak for user identity. It stores users you create on the **Users** page in
Keycloak and manages their VMO role and Kubernetes access on your behalf. This guide covers viewing, creating, editing,
resetting passwords, and deleting users.

## Prerequisites

- A cluster created using VM Launchpad. Refer to [Install VM Launchpad](../install.md) for guidance.

- An account with the **Platform Admin** VMO role, or membership in a group mapped to Platform Admin.

## Users Page

From the left main menu, select **Settings** > **Access Management** > **Users** to view all users in the appliance.

The **Users** table lists the following columns.

| **Column**   | **Description**                                              |
| ------------ | ------------------------------------------------------------ |
| **Username** | The Keycloak username.                                       |
| **Email**    | The email address on the account.                            |
| **Name**     | The first and last name on the account.                      |
| **Enabled**  | A check mark indicates the user can sign in.                 |
| **Groups**   | Groups the user belongs to. Each group appears as a pill.    |
| **Created**  | The date VM Launchpad created the user.                      |
| **Actions**  | Row actions to edit, reset the password, or delete the user. |

Select a column header to sort. Use the **Filter rows** search box to filter by any field.

## Create Users

VM Launchpad creates one or more users in a single guided flow that also assigns their VMO role and namespace scope.

1. From the left main menu, select **Settings** > **Access Management** > **Users**.

2. Select **Create User**. The **Onboard users** wizard opens on the **Who** step.

3. Complete the following fields for the first user.

   | **Field**           | **Description**                                                                 |
   | ------------------- | ------------------------------------------------------------------------------- |
   | **Username**        | Required. Must be unique.                                                       |
   | **Email**           | Required. Must be a valid email address. Refer to the note that follows.        |
   | **First Name**      | Optional. The user's given name.                                                |
   | **Last Name**       | Optional. The user's family name.                                               |
   | **Password**        | Required unless **Temporary** is selected. Must meet the password policy.       |
   | **Verify Password** | Must match **Password**.                                                        |
   | **Temporary**       | Select to force a password reset on first sign-in. Bypasses the password field. |

   Passwords must meet the following requirements. Violations appear as inline validation, and **Next** remains
   unavailable until you resolve them.

   - At least 15 characters

   - At least one digit

   - At least one special character

   :::info

   The email address is required because the Kubernetes API server in a VM Launchpad cluster identifies users by their
   `email` claim. Accounts without a verified address cannot be granted access. This also applies to users federated
   from an LDAP directory. Refer to [Federate LDAP Users with Keycloak](./ldap-federation.md).

   :::

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
   | **Select Namespaces**    | Choose one or more existing namespaces. VM Launchpad creates RoleBindings scoped to those namespaces only.         |
   | **Create New Namespace** | _(Optional)_ Enter a namespace name and select **+ Create** to create a namespace and add it to the current scope. |

7. Select **Next** to open the **Review** step. Review the actions the wizard performs for each user.

8. Select **Apply**. Each action has its own progress indicator, and VM Launchpad lists any failures after the operation
   completes.

9. Select **Close** to return to the **Users** page.

VM Launchpad selects the matching Kubernetes ClusterRole automatically based on the VMO role you assign. The mapping is
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

3. The table below lists the fields you can edit.

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

   The **Username** field is read-only after a user exists. To use a different username, delete the user and create a
   new one.

   :::

4. Select **Save**.

:::info

When the user belongs to a group that already carries a VMO role, an amber banner appears over the role cards listing
the inherited role (for example, _Platform Admin is inherited from group cluster-admins_). Take the banner at its word.
A role you set here does not take effect while the user remains in that group. Refer to
[How Effective Permissions Are Calculated](#how-effective-permissions-are-calculated) below.

:::

## How Effective Permissions Are Calculated

Group membership determines a user's effective permissions whenever any group applies. The role assigned directly to the
user is a fallback.

- If the user belongs to one or more groups that carry a VMO role, their effective permissions are the **union of those
  group roles**, and the role assigned directly to the user is ignored.

- If none of the user's groups carries a VMO role, the role assigned directly to the user applies.

For example, a user assigned **Editor** directly who belongs only to a group carrying **Viewer** receives Viewer
permissions, not Editor. Removing that group membership makes the direct **Editor** assignment take effect. A user in
two groups carrying **Viewer** and **Editor** receives the combined permissions of both.

To reduce a user's effective permissions, change or remove the group mappings that grant them. Editing the user-level
role has no effect while any mapped group applies. Refer to [Groups](./groups.md) to review and edit group membership
and role assignments.

:::warning

Changing a user's roles or groups does not revoke their existing API keys. Revoke the keys as well. Refer to
[API Keys](./api-keys.md).

:::

## Reset a User's Password

1. From the left main menu, select **Settings** > **Access Management** > **Users**.

2. In the **Actions** column for the user, select the key icon.

3. Enter and confirm a new password that meets the password policy.

4. _(Optional)_ Select **Temporary** to require the user to set a new password on next sign-in.

5. Select **Reset**.

## Delete Users

You can delete a single user or select many users to delete in a single operation.

### Delete a Single User

1. From the left main menu, select **Settings** > **Access Management** > **Users**.

2. In the **Actions** column, select the trash icon for the user, or right-click the row and select **Delete User**.

3. Confirm the deletion.

### Delete Users in Bulk

1. From the left main menu, select **Settings** > **Access Management** > **Users**.

2. Select the checkbox for each user you want to delete. Use the header checkbox to select every user on the current
   page.

3. Select the **Delete** button in the bulk actions toolbar at the top of the table.

4. For a single selected user, type the username to confirm. For many users, type `delete` to confirm.

5. A progress indicator tracks each deletion. VM Launchpad lists any failures after the operation completes.

:::warning

Deleting a user removes them from Keycloak, but their existing ClusterRoleBindings and RoleBindings may remain until you
explicitly revoke them. Remove the bindings on the [Groups](./groups.md) page or through the Kubernetes API if you no
longer need them.

:::

## Palette-Managed Environments

When VM Launchpad runs in a Palette-managed environment, the UI may hide user creation. In that case, the parent
platform manages user lifecycle. VM Launchpad displays users for viewing and for access policy assignment only.

## Next Steps

- Group users together and manage their VMO role and Kubernetes access in one place. Refer to [Groups](./groups.md).
