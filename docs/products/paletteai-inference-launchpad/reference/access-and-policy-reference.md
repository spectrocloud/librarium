---
sidebar_label: "Access Management Reference"
title: "PaletteAI Inference Launchpad Access Management Reference"
description:
  "Reference for the tabs, roles, scopes, table columns, form fields, addresses, and messages on the Access Management
  and Users pages and the Identity Providers section of a PaletteAI Inference Launchpad appliance."
hide_table_of_contents: false
sidebar_position: 4.9
tags: ["paletteai-inference-launchpad", "reference", "access", "workspaces", "roles"]
keywords: ["launchpad", "ai", "access", "policy", "rbac", "workspace", "role", "scope", "member", "user", "group"]
---

This reference lists the tabs, roles, columns, fields, addresses, and messages on the **Access Management** and
**Users** pages of the appliance console. It also covers the **Identity Providers** section of the **Settings** menu. It
supports the [Create a Workspace](../how-to-guides/create-a-workspace.md),
[Manage Workspace Members](../how-to-guides/manage-workspace-members.md),
[Manage Users](../how-to-guides/manage-users.md), [Manage Groups](../how-to-guides/manage-groups.md),
[Add an External Identity Provider](../how-to-guides/add-an-external-identity-provider.md), and
[Set Prompt Cache Sharing for a Policy](../how-to-guides/set-prompt-cache-sharing.md) how-tos. For how workspaces,
members, and policies relate, refer to [Clients and Quotas](../explanation/clients-and-quotas.md#workspaces-and-access).

## Tab Bar and Workspace Drop-Down Menu

The left main menu has two pages for access, **Access Management** and **Users**. The workspace drop-down menu in the
console header decides which tabs **Access Management** offers.

<!-- vale off -->

| **Drop-down menu selection** | **Access Management tabs**                               | **Users tabs**           |
| ---------------------------- | -------------------------------------------------------- | ------------------------ |
| **All workspaces**           | **Workspaces**, **Clients**, **Policies**, and **Roles** | **Users** and **Groups** |
| One workspace                | **Clients** and **Policies**                             | **Users** and **Groups** |

| **Page**              | **Tab**        | **Where it appears**             | **What it holds**                                                                                                 |
| --------------------- | -------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Access Management** | **Workspaces** | All workspaces                   | Every workspace, the policy each one follows, and its members.                                                    |
| **Access Management** | **Clients**    | All workspaces and one workspace | At **All workspaces**, every client on the appliance. Inside a workspace, that workspace's clients.               |
| **Access Management** | **Policies**   | All workspaces and one workspace | At **All workspaces**, the policies a workspace can follow. Inside a workspace, the policy it follows, read only. |
| **Access Management** | **Roles**      | All workspaces                   | The roles the appliance ships, read only.                                                                         |
| **Users**             | **Users**      | All workspaces and one workspace | The people the identity provider serves.                                                                          |
| **Users**             | **Groups**     | All workspaces and one workspace | The groups the identity provider serves.                                                                          |

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

| **Role**                    | **Workspaces in the drop-down menu**   | **Clients visible**               |
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
| **Quota**                | The limit the policy sets, or **No limit**.                 |
| **External inferencing** | Whether the policy turns on external inferencing.           |
| **Fallback**             | The policy's fallback setting.                              |
| **Bursting**             | Whether the policy turns on bursting.                       |
| **Web tools**            | Whether the policy turns on web tools.                      |
| **Cache sharing**        | **Workspace** or **Each client**.                           |
| **Recording**            | The policy's decision recording setting.                    |
| **Created on**           | The date the policy was created.                            |

<!-- vale on -->

| **Control**       | **Action**                                                                                                                                                                                |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Create Policy** | Opens the **Create policy** wizard, with the **Overview**, **Quotas**, **External access**, **Cache sharing**, and **Routing** steps.                                                     |
| **Edit**          | Opens the policy's own page, titled with the policy name. The page has the **Quotas**, **External access**, **Cache sharing**, and **Routing** sections, and saves with **Save changes**. |
| **Clone**         | Opens a dialog with the **Name for the new policy** field.                                                                                                                                |
| **Delete**        | Removes the policy. The appliance refuses it while a workspace follows the policy.                                                                                                        |

### Cache Sharing Section

The **Cache sharing** step of the **Create policy** wizard and the **Cache sharing** section of a policy's page each
have one field. For what each option means, refer to [Prompt Cache Sharing](../explanation/prompt-cache-sharing.md).

| **Element**                                             | **Value**                                                                                                       |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Prompt cache sharing**                                | A required drop-down menu with the **Share within the workspace** and **Each client is isolated** options.      |
| Default                                                 | **Share within the workspace**                                                                                  |
| Description for **Share within the workspace**          | `Clients reuse the prompt cache another client already processed.`                                              |
| Description for **Each client is isolated**             | `Each client keeps its own prompt cache.`                                                                       |
| Alert, while **Share within the workspace** is selected | `Cache sharing lets a client tell with a faster first response time that another client sent the same opening.` |

## Users Tab

The **Users** tab is on the **Users** page.

| **Column**        | **Value**                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------ |
| **Email**         | The address the person signs in with.                                                                  |
| **Name**          | The person's first and last name.                                                                      |
| **Groups**        | The groups the person is in.                                                                           |
| **State**         | **Active** or **Inactive**.                                                                            |
| **Signs in with** | One label for each external identity provider that the person signed in through, or **Local account**. |

| **Control**           | **Action**                                                                       |
| --------------------- | -------------------------------------------------------------------------------- |
| **Everyone**          | Lists every person.                                                              |
| **Not signed in yet** | Lists the people who have access but have not signed in yet.                     |
| **Add User**          | Opens the **Add user** wizard.                                                   |
| **Manage**            | Opens the **Manage user** drawer.                                                |
| **Set password**      | Opens the **Set a password for** dialog, titled with the person's email address. |
| **Delete**            | Deletes the person.                                                              |

### Add User Wizard

| **Step**     | **Title**                    | **Fields**                                                   |
| ------------ | ---------------------------- | ------------------------------------------------------------ |
| **Identity** | **Who they are**             | **Email**, **First Name**, **Last Name**, and **Active**.    |
| **Password** | **How they sign in**         | An optional password, and whether the password is temporary. |
| **Groups**   | **Which groups they are in** | The groups to put the person in.                             |

A person has an email address, an optional first name and last name, a set of groups, an active or inactive state, and
an optional password with a temporary flag.

## Groups Tab

The **Groups** tab is on the **Users** page.

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

## Identity Providers

The **Identity Providers** section is on the **Settings** menu, under **External access**. It lists the external
identity providers that the appliance reads from Keycloak. The console does not create, change, or delete a provider.
You add and change providers in Keycloak. For the steps, refer to
[Add an External Identity Provider](../how-to-guides/add-an-external-identity-provider.md).

| **Column**        | **Value**                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------ |
| **Provider**      | The provider's display name, which is also the label of its sign-in button.                            |
| **Alias**         | The provider's alias in Keycloak.                                                                      |
| **Protocol**      | **OIDC** or **SAML**.                                                                                  |
| **Groups Mapper** | **Mapped** when a mapper on the provider writes the `idp_groups` attribute. Otherwise, **Not mapped**. |
| **State**         | **Enabled** or **Disabled**.                                                                           |

| **Control**       | **Action**                                                                           |
| ----------------- | ------------------------------------------------------------------------------------ |
| **Open Keycloak** | Opens the Keycloak sign-in page, then the administration console for the `ai` realm. |

### Provider Sign-In

- The sign-in page has an email and password form for local accounts. Under **Or sign in with**, it shows one button for
  each provider, labeled with the provider's display name.

- When a provider is unavailable, people can still sign in with a local account.

- At each sign-in, the appliance puts the person in each group whose name exactly matches a group that the provider
  sends. The appliance ignores a group that the provider sends if no group on the appliance has that name.

- When the provider stops sending a group, the person leaves that group at the next sign-in.

- After sign-in, the console opens in the workspace that the person's group is a member of.

- For a person who signed in through a provider, the **Account** page shows `Signed in as <user>, through <provider>.`
  In place of the password control, it shows `Your password is managed by <provider>.` In these messages, `<user>` is
  the person's username, and `<provider>` is the provider's display name.

## Create Form Addresses

Each create form has its own address in the console. Reloading the page returns to the form, and the browser's back
action returns to the list the form came from.

| **Form**         | **Address**              |
| ---------------- | ------------------------ |
| Add user         | `/directory/users/new`   |
| Add group        | `/directory/groups/new`  |
| Create policy    | `/access/policies/new`   |
| Create workspace | `/access/workspaces/new` |
| Add client       | `/access/clients/new`    |

## Wizard Controls

Create wizards use the **Previous**, **Next**, and **Save** buttons. Closing a wizard with unsaved changes opens the
**Discard changes?** dialog, with the **Discard** and **Cancel** buttons.

## Messages

| **Where**                                      | **Message**                                                                                                                    |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Access Management**, no read permission      | `You do not have permission to read anything here. Ask a platform administrator for access.`                                   |
| **Add user**, **Identity** step                | `Enter a valid email address to continue.`                                                                                     |
| **Workspaces**, empty                          | `Inference Launchpad has no workspace yet.`                                                                                    |
| **Create workspace**, **Overview** step        | `A workspace holds its own clients. The policy you pick sets what those clients may spend and what they may reach.`            |
| Members table, empty                           | `Nobody is in this workspace yet. Add a member to give them access. An Inference Launchpad administrator can always reach it.` |
| **Policies**, empty                            | `Inference Launchpad has no policy yet.`                                                                                       |
| **Roles**, empty                               | `Inference Launchpad has no role yet.`                                                                                         |
| **Users**, empty                               | `Inference Launchpad knows nobody yet.`                                                                                        |
| **Groups**, empty                              | `Inference Launchpad has no group yet.`                                                                                        |
| Sign-in, no workspace access for the person    | `You do not have access yet. Ask your administrator to add you to a workspace.`                                                |
| **Users** and **Groups**, no identity provider | `Inference Launchpad has no identity provider, so there is no directory to show.`                                              |
