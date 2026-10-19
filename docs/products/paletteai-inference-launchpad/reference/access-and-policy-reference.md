---
sidebar_label: "Access and Policy Reference"
title: "PaletteAI Inference Launchpad Access and Policy Reference"
description:
  "Reference for the tabs, roles, scopes, table columns, form fields, addresses, and messages on the Access & Policy
  page of a PaletteAI Inference Launchpad appliance."
hide_table_of_contents: false
sidebar_position: 4.9
tags: ["paletteai-inference-launchpad", "reference", "access", "workspaces", "roles"]
keywords: ["launchpad", "ai", "access", "policy", "rbac", "workspace", "role", "scope", "member", "user", "group"]
---

This reference lists the tabs, roles, columns, fields, addresses, and messages on the **Access & Policy** page of the
appliance console. It supports the [Create a Workspace](../how-to-guides/create-a-workspace.md),
[Manage Workspace Members](../how-to-guides/manage-workspace-members.md),
[Manage Users](../how-to-guides/manage-users.md), and [Manage Groups](../how-to-guides/manage-groups.md) how-tos. For
how workspaces, members, and policies relate, refer to
[Clients and Quotas](../explanation/clients-and-quotas.md#workspaces-and-access).

## Tab Bar and Workspace Picker

The workspace picker in the console header decides which tabs **Access & Policy** offers.

<!-- vale off -->

| **Picker setting** | **Tabs offered**                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| **All workspaces** | **Clients**, **Workspaces**, **Policies**, **Roles**, **Users**, and **Groups**                   |
| One workspace      | **Clients** only. The page shows no tab bar, and the clients listed are that workspace's clients. |

| **Tab**        | **Where it appears**             | **What it holds**                                                                                   |
| -------------- | -------------------------------- | --------------------------------------------------------------------------------------------------- |
| **Clients**    | All workspaces and one workspace | At **All workspaces**, every client on the appliance. Inside a workspace, that workspace's clients. |
| **Workspaces** | All workspaces                   | Every workspace, the policy each one follows, and its members.                                      |
| **Policies**   | All workspaces                   | The policies a workspace can follow.                                                                |
| **Roles**      | All workspaces                   | The roles the appliance ships, read only.                                                           |
| **Users**      | All workspaces                   | The people the identity provider serves.                                                            |
| **Groups**     | All workspaces                   | The groups the identity provider serves.                                                            |

<!-- vale on -->

## Roles

The **Roles** tab lists the following roles, read only. The console offers no control to create, edit, or delete a role.

| **Role**                    | **Scope**        | **Assignable to a workspace member** |
| --------------------------- | ---------------- | ------------------------------------ |
| **Platform administrator**  | Entire appliance | ❌                                   |
| **Workspace administrator** | Its workspaces   | ✅                                   |
| **Operator**                | Own clients      | ✅                                   |

### Scope Values

The **Scope** column on the **Roles** tab reads one of the following values.

| **Scope**        | **Reach**                                                                            |
| ---------------- | ------------------------------------------------------------------------------------ |
| Entire appliance | Every workspace and everything on the appliance.                                     |
| Its workspaces   | Every client in the workspaces where the person or group is a member with this role. |
| Own clients      | The person's own clients, in the workspaces where they are a member with this role.  |
| Own API keys     | The person's own API keys.                                                           |

### What Each Role Sees

| **Role**                    | **Workspaces in the picker**           | **Clients visible**               |
| --------------------------- | -------------------------------------- | --------------------------------- |
| **Platform administrator**  | Every workspace and **All workspaces** | Every client in every workspace.  |
| **Workspace administrator** | The workspaces where the role is held  | Every client in those workspaces. |
| **Operator**                | The workspaces where the role is held  | Only the clients the person owns. |

Usage figures and client lists narrow to the workspaces the person can read.

### Role Permission Grid

Selecting a role on the **Roles** tab opens a drawer with a grid. The grid shows one row per **Feature** and one column
per action, which are **Create**, **Read**, **Update**, and **Delete**. The **Close** button closes the drawer.

| **Symbol** | **Meaning**                                                      |
| ---------- | ---------------------------------------------------------------- |
| Tick       | The role can perform the action on the feature.                  |
| Cross      | The appliance defines the action, and the role does not hold it. |
| Dash       | The appliance defines no such action for the feature.            |

## Workspaces Tab

<!-- vale off -->

| **Column**               | **Value**                                         |
| ------------------------ | ------------------------------------------------- |
| **Workspace**            | The workspace's display name.                     |
| **Policy**               | The policy the workspace follows.                 |
| **Limit**                | The limit the policy sets.                        |
| **External inferencing** | Whether the policy turns on external inferencing. |
| **Clients**              | The number of clients in the workspace.           |

<!-- vale on -->

| **Row menu item** | **Action**                                                                    |
| ----------------- | ----------------------------------------------------------------------------- |
| **Manage**        | Opens the workspace to change it and its members.                             |
| **Delete**        | Removes the workspace. The appliance refuses it on the **Default** workspace. |

### Create Workspace Wizard

**Create Workspace** opens the **Create workspace** wizard. Its final button is **Create workspace**.

| **Step**     | **Title**              | **Fields**                                                                                                                                                        |
| ------------ | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Overview** | **Workspace overview** | **Name** and **Policy**. The **Name** help reads `Will be stored as <stored-name>.` before creation and `Stored as <stored-name>. This never changes.` afterward. |
| **Members**  | **Who may act here**   | The members table.                                                                                                                                                |

In the **Name** help text, `<stored-name>` is the name the appliance stores for the workspace.

### Members Table

| **Column** | **Value**                                            |
| ---------- | ---------------------------------------------------- |
| **Who**    | The group name, or the user's email or sign-in name. |
| **Type**   | `group` or `user`.                                   |
| **Role**   | **Workspace administrator** or **Operator**.         |

| **Control**    | **Opens**                                                                                                                                                       |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Add member** | The **Add someone to this workspace** dialog, with **Type**, **Group name** or **Email or sign-in name**, and **Role**, and the **Add** and **Cancel** buttons. |
| **Change**     | The **Change who may act here** dialog, with the **Save** and **Cancel** buttons.                                                                               |
| **Remove**     | Removes the member from the workspace.                                                                                                                          |

The **Type** field offers **Group** and **User**. The name field reads **Group name** for a group and **Email or sign-in
name** for a user.

## Policies Tab

<!-- vale off -->

| **Column**               | **Value**                                                   |
| ------------------------ | ----------------------------------------------------------- |
| **Policy**               | The policy's name.                                          |
| **Followed by**          | The workspaces that follow the policy, or **No workspace**. |
| **Limit**                | The limit the policy sets, or **No limit**.                 |
| **External inferencing** | Whether the policy turns on external inferencing.           |
| **Fallback**             | The policy's fallback setting.                              |
| **Bursting**             | Whether the policy turns on bursting.                       |
| **Web tools**            | Whether the policy turns on web tools.                      |

<!-- vale on -->

| **Control**       | **Action**                                                                                                |
| ----------------- | --------------------------------------------------------------------------------------------------------- |
| **Create policy** | Opens the **Create policy** wizard, with the **Overview**, **Quotas**, **Egress**, and **Routing** steps. |
| **Edit**          | Opens the **Edit policy** drawer, with **Save changes**.                                                  |
| **Delete**        | Removes the policy. The appliance refuses it while a workspace follows the policy.                        |

## Users Tab

| **Column** | **Value**                             |
| ---------- | ------------------------------------- |
| **Email**  | The address the person signs in with. |
| **Name**   | The person's first and last name.     |
| **Groups** | The groups the person is in.          |
| **State**  | **Active** or **Inactive**.           |

| **Control**      | **Action**                                                                       |
| ---------------- | -------------------------------------------------------------------------------- |
| **Add User**     | Opens the **Add user** wizard.                                                   |
| **Manage**       | Opens the **Manage user** drawer.                                                |
| **Set password** | Opens the **Set a password for** dialog, titled with the person's email address. |
| **Delete**       | Deletes the person.                                                              |

### Add User Wizard

| **Step**     | **Title**                    | **Fields**                                                   |
| ------------ | ---------------------------- | ------------------------------------------------------------ |
| **Identity** | **Who they are**             | **Email**, **First Name**, **Last Name**, and **Active**.    |
| **Password** | **How they sign in**         | An optional password, and whether the password is temporary. |
| **Groups**   | **Which groups they are in** | The groups to put the person in.                             |

A person has an email address, an optional first name and last name, a set of groups, an active or inactive state, and
an optional password with a temporary flag.

## Groups Tab

| **Column**      | **Value**                          |
| --------------- | ---------------------------------- |
| **Group**       | The group's name.                  |
| **Description** | The group's description.           |
| **Members**     | The number of people in the group. |

| **Control**   | **Action**                                                                                                             |
| ------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Add Group** | Opens the **Add group** drawer, with an **Overview** section (**Name** and **Description**) and a **Members** section. |
| **Manage**    | Opens the **Manage group** drawer.                                                                                     |
| **Delete**    | Opens a confirmation dialog titled `Delete <group-name>?`, where `<group-name>` is the group's name.                   |

The appliance's own groups appear in no listing on the console. The console cannot rename them, give them a new
description, or delete them.

## Create Form Addresses

Each create form has its own address in the console. Reloading the page returns to the form, and the browser's back
action returns to the list the form came from.

| **Form**         | **Address**              |
| ---------------- | ------------------------ |
| Add user         | `/access/users/new`      |
| Add group        | `/access/groups/new`     |
| Create policy    | `/access/policies/new`   |
| Create workspace | `/access/workspaces/new` |
| Add client       | `/access/clients/new`    |

## Wizard Controls

Create wizards use the **Previous**, **Next**, and **Save** buttons. Closing a wizard with unsaved changes opens the
**Discard changes?** dialog, with the **Discard** and **Cancel** buttons.

## Messages

| **Where**                                      | **Message**                                                                                                                    |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Access & Policy**, no read permission        | `You do not have permission to read anything here. Ask a platform administrator for access.`                                   |
| **Add user**, **Identity** step                | `Enter a valid email address to continue.`                                                                                     |
| **Workspaces**, empty                          | `Inference Launchpad has no workspace yet.`                                                                                    |
| **Create workspace**, **Overview** step        | `A workspace holds its own clients. The policy you pick sets what those clients may spend and what they may reach.`            |
| Members table, empty                           | `Nobody is in this workspace yet. Add a member to give them access. An Inference Launchpad administrator can always reach it.` |
| **Policies**, empty                            | `Inference Launchpad has no policy yet.`                                                                                       |
| **Roles**, empty                               | `Inference Launchpad has no role yet.`                                                                                         |
| **Users**, empty                               | `Inference Launchpad knows nobody yet.`                                                                                        |
| **Groups**, empty                              | `Inference Launchpad has no group yet.`                                                                                        |
| **Users** and **Groups**, no identity provider | `Inference Launchpad has no identity provider, so there is no directory to show.`                                              |
