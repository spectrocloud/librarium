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
appliance console. It supports the [Manage Access and Policy](../how-to-guides/manage-access-and-policy.md) how-to. For
how workspaces, grants, and policies relate, refer to
[Clients and Quotas](../explanation/clients-and-quotas.md#workspaces-and-access).

## Tab Bar and Workspace Picker

The workspace picker in the console header decides which tabs **Access & Policy** offers. A tab also appears only when
the person signed in may read it.

<!-- vale off -->

| **Picker setting** | **Tabs offered**                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| **All workspaces** | **Clients**, **Workspaces**, **Policies**, **Roles**, **Users**, and **Groups**                   |
| One workspace      | **Clients** only. The page shows no tab bar, and the clients listed are that workspace's clients. |

<!-- vale on -->

| **Tab**        | **Where it appears**             | **What it holds**                                                                |
| -------------- | -------------------------------- | -------------------------------------------------------------------------------- |
| **Clients**    | All workspaces and one workspace | Every client on the appliance, or the clients of the workspace the picker names. |
| **Workspaces** | All workspaces                   | Every workspace, the policy each one follows, and its members.                   |
| **Policies**   | All workspaces                   | The policies a workspace can follow.                                             |
| **Roles**      | All workspaces                   | The roles the appliance ships, read only.                                        |
| **Users**      | All workspaces                   | The people the identity provider serves.                                         |
| **Groups**     | All workspaces                   | The groups the identity provider serves.                                         |

## Roles

A role is a named set of permissions with no scope of its own. A grant gives a role its reach. You cannot create, edit,
or delete a role from the console.

| **Role**                    | **Scope**        | **Assignable to a workspace member** |
| --------------------------- | ---------------- | ------------------------------------ |
| **Platform administrator**  | Entire appliance | ❌                                   |
| **Workspace administrator** | Its workspaces   | ✅                                   |
| **Operator**                | Own clients      | ✅                                   |

### Scope Values

The **Scope** column on the **Roles** tab reads one of the following values.

| **Scope**        | **Reach**                                                    |
| ---------------- | ------------------------------------------------------------ |
| Entire appliance | Every workspace and everything on the appliance.             |
| Its workspaces   | Every client in the workspaces that the grant names.         |
| Own clients      | The person's own clients, in the workspaces the grant names. |
| Own API keys     | The person's own API keys, and nothing else.                 |

### What Each Role Sees

{/* NEEDS REVIEW: The statements in this table are reconstructed from the ticket's notes on five screen recordings that no one has reviewed frame by frame. Confirm each one against the recordings or a live appliance before publishing. */}

| **Role**                    | **Workspaces in the picker**           | **Clients visible**               |
| --------------------------- | -------------------------------------- | --------------------------------- |
| **Platform administrator**  | Every workspace and **All workspaces** | Every client in every workspace.  |
| **Workspace administrator** | The workspaces its grants name         | Every client in those workspaces. |
| **Operator**                | The workspaces its grants name         | Only the clients the person owns. |

Usage figures and client lists narrow to the workspaces the person may read.

### Role Permission Grid

Selecting a role on the **Roles** tab opens a drawer titled with the role's name. The drawer shows one row per
**Feature** the role holds a permission in, and one column per action, which are **Create**, **Read**, **Update**, and
**Delete**. An action outside those four gets a column of its own. Select **Close** to close the drawer.

| **Symbol** | **Meaning**                                                      |
| ---------- | ---------------------------------------------------------------- |
| Tick       | The role may perform the action on the feature.                  |
| Cross      | The appliance defines the action, and the role does not hold it. |
| Dash       | The appliance defines no such action for the feature.            |

## Workspaces Tab

<!-- vale off -->

| **Column**               | **Value**                                           |
| ------------------------ | --------------------------------------------------- |
| **Workspace**            | The workspace's display name.                       |
| **Policy**               | The policy the workspace follows.                   |
| **Limit**                | Every limit the policy sets, or **No limit**.       |
| **External inferencing** | **Enabled** or **Disabled**, as the policy sets it. |
| **Clients**              | The number of clients in the workspace.             |

<!-- vale on -->

| **Row menu item** | **Action**                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------- |
| **Manage**        | Opens the **Manage workspace** drawer, with **Overview** and **Members** sections and **Save changes**. |
| **Delete**        | Removes the workspace after confirmation. Unavailable on the **Default** workspace.                     |

The appliance ships one workspace, **Default**, which cannot be removed.

### Create Workspace Wizard

**Create Workspace** opens the **Create workspace** wizard. Its final button is **Create workspace**.

| **Step**     | **Title**              | **Fields**                                                                                                                                                                       |
| ------------ | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Overview** | **Workspace overview** | **Name** and **Policy**, both required. The **Name** help reads `Will be stored as <stored-name>.` before creation and `Stored as <stored-name>. This never changes.` afterward. |
| **Members**  | **Who may act here**   | The members table.                                                                                                                                                               |

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
| **Change**     | The **Change who may act here** dialog, with the same fields and the **Save** and **Cancel** buttons.                                                           |
| **Remove**     | Removes the member from the list. The removal takes effect when you save the workspace.                                                                         |

The **Type** field offers **Group** and **User**. The name field reads **Group name** for a group and **Email or sign-in
name** for a user. One subject can hold a given role in a workspace only once.

## Policies Tab

<!-- vale off -->

| **Column**               | **Value**                                                   |
| ------------------------ | ----------------------------------------------------------- |
| **Policy**               | The policy's name.                                          |
| **Followed by**          | The workspaces that follow the policy, or **No workspace**. |
| **Limit**                | Every limit the policy sets, or **No limit**.               |
| **External inferencing** | **Enabled** or **Disabled**.                                |
| **Fallback**             | **Local**, **Notice**, or **Enrich**.                       |
| **Bursting**             | **Enabled** or **Disabled**.                                |
| **Web tools**            | **Enabled** or **Disabled**.                                |

<!-- vale on -->

| **Control**       | **Action**                                                                                                |
| ----------------- | --------------------------------------------------------------------------------------------------------- |
| **Create policy** | Opens the **Create policy** wizard, with the **Overview**, **Quotas**, **Egress**, and **Routing** steps. |
| **Edit**          | Opens the **Edit policy** drawer, with **Save changes**.                                                  |
| **Delete**        | Removes the policy after confirmation. Unavailable while any workspace follows the policy.                |

## Users Tab

| **Column** | **Value**                                 |
| ---------- | ----------------------------------------- |
| **Email**  | The address the person signs in with.     |
| **Name**   | The person's first and last name.         |
| **Groups** | The groups the person is in, or **None**. |
| **State**  | **Active** or **Inactive**.               |

| **Control**      | **Action**                                                                          |
| ---------------- | ----------------------------------------------------------------------------------- |
| **Add User**     | Opens the **Add user** wizard. Unavailable when no identity provider is configured. |
| **Manage**       | Opens the **Manage user** drawer, with **Save changes**.                            |
| **Set password** | Opens the **Set a password for** dialog, titled with the person's email address.    |
| **Delete**       | Removes the person from the identity provider after confirmation.                   |

### Add User Wizard

{/* NEEDS REVIEW: The ticket lists Identity fields as Email, First Name, Last Name, and Active. The console source labels them First name and Last name, and shows Active only in the Manage user drawer. Confirm the labels and where Active appears. */}

| **Step**     | **Title**                    | **Fields**                                                                                                                       |
| ------------ | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Identity** | **Who they are**             | **Email** (required), **First Name**, **Last Name**, and **Active**.                                                             |
| **Password** | **How they sign in**         | **Password**, **Confirm password**, **Generate a password**, and **Make them choose a new one at their next sign-in**. Optional. |
| **Groups**   | **Which groups they are in** | The groups to put the person in. Optional.                                                                                       |

The wizard's final button is **Add user**. A password must be at least 12 characters long. The **Make them choose a new
one at their next sign-in** checkbox marks the password as temporary and is selected by default. The appliance does not
store the password.

## Groups Tab

| **Column**      | **Value**                          |
| --------------- | ---------------------------------- |
| **Group**       | The group's name.                  |
| **Description** | The group's description.           |
| **Members**     | The number of people in the group. |

| **Control**   | **Action**                                                                                                                                                                  |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Add Group** | Opens the **Add group** drawer, with an **Overview** section (**Name** and **Description**) and a **Members** section. Unavailable when no identity provider is configured. |
| **Manage**    | Opens the **Manage group** drawer, with **Save changes**.                                                                                                                   |
| **Delete**    | Opens a confirmation dialog titled `Delete <group-name>?`, where `<group-name>` is the group's name. The people in the group keep their accounts.                           |

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

Create wizards use the **Previous** and **Next** buttons to move between steps. Closing a wizard with unsaved changes
opens the **Discard changes?** dialog, with the **Discard** and **Cancel** buttons. When a step is incomplete, the
console names what is missing next to **Next**, for example `Enter a valid email address to continue.` on the
**Identity** step of **Add user**.

## Messages

| **Where**                                      | **Message**                                                                                                                    |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Access & Policy**, no read permission        | `You do not have permission to read anything here. Ask a platform administrator for access.`                                   |
| **Workspaces**, empty                          | `Inference Launchpad has no workspace yet.`                                                                                    |
| **Create workspace**, **Overview** step        | `A workspace holds its own clients. The policy you pick sets what those clients may spend and what they may reach.`            |
| Members table, empty                           | `Nobody is in this workspace yet. Add a member to give them access. An Inference Launchpad administrator can always reach it.` |
| **Policies**, empty                            | `Inference Launchpad has no policy yet.`                                                                                       |
| **Roles**, empty                               | `Inference Launchpad has no role yet.`                                                                                         |
| **Users**, empty                               | `Inference Launchpad knows nobody yet.`                                                                                        |
| **Groups**, empty                              | `Inference Launchpad has no group yet.`                                                                                        |
| **Users** and **Groups**, no identity provider | `Inference Launchpad has no identity provider, so there is no directory to show.`                                              |
