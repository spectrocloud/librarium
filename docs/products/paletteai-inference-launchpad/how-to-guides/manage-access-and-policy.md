---
sidebar_label: "Manage Access and Policy"
title: "Manage Access and Policy"
description:
  "Step-by-step guidance for platform administrators on how to give a team its own workspace, add and change workspace
  members, and manage users and groups on the Access & Policy page of a PaletteAI Inference Launchpad appliance."
hide_table_of_contents: false
sidebar_position: 2.8
tags: ["paletteai-inference-launchpad", "access", "workspaces", "how-to"]
keywords:
  ["launchpad", "ai", "access", "policy", "rbac", "workspace", "member", "role", "grant", "user", "group", "password"]
---

This guide explains how a platform administrator gives a team access to its own workspace, changes who may act in a
workspace, and manages the users and groups the appliance knows about. You do all of this on the **Access & Policy**
page. To understand how workspaces, policies, roles, and grants fit together, refer to
[Clients and Quotas](../explanation/clients-and-quotas.md#workspaces-and-access). For every tab, column, role, and
message on the page, refer to [Access and Policy Reference](../reference/access-and-policy-reference.md).

## Prerequisites

- A running PaletteAI Inference Launchpad appliance, with the console reachable.

- Console access as a person who holds the **Platform administrator** role.

- An identity provider configured for the appliance, to add or change users and groups. Without one, the **Users** and
  **Groups** tabs show no directory.

- At least one policy on the **Policies** tab for a new workspace to follow.

## Give a Team Access to Its Own Workspace

Create a workspace for the team, name who may act in it and with which role, and then add the people the team needs.

1. From the left main menu, select **Access & Policy**.

2. In the console header, set the workspace picker to **All workspaces**. The page shows the **Clients**,
   **Workspaces**, **Policies**, **Roles**, **Users**, and **Groups** tabs.

3. Select the **Workspaces** tab, and then select **Create Workspace**. The **Create workspace** wizard opens on the
   **Overview** step.

4. On **Workspace overview**, enter a **Name** for the workspace, and select the **Policy** the workspace follows. The
   help text under **Name** shows the name the appliance stores, which never changes afterward, even if you rename the
   workspace later. Select **Next**.

5. On **Who may act here**, select **Add member**. The **Add someone to this workspace** dialog opens.

6. Choose a **Type** of **Group** or **User**. For a group, enter the **Group name**. For a user, enter the **Email or
   sign-in name**. Select a **Role** of **Workspace administrator** or **Operator**, and then select **Add**.

   Choose **Workspace administrator** for a person who sets what the clients in the workspace may spend and reach, and
   **Operator** for a person who works with their own clients only. For what each role may change, refer to
   [Access and Policy Reference](../reference/access-and-policy-reference.md#what-each-role-may-change).

   Grant the role to a group where you can, so that access does not end when one person leaves the team.

7. Repeat steps 5 and 6 for each person or group the workspace needs.

8. Select **Create workspace**.

9. Select the **Users** tab, and then select **Add User**. The **Add user** wizard opens. To add the person, follow
   [Add a User](#add-a-user) from step 3.

10. In the console header, set the workspace picker to the new workspace, and then from the left main menu, select
    **Access & Policy**. Inside the workspace, the page offers **Clients** alone, and you create the team's clients
    there. To create one, refer to [Create a Client](./create-a-client.md).

## Add or Change Workspace Members

A member is a person or a group holding one role in one workspace. Change members on the workspace itself.

1. From the left main menu, select **Access & Policy**, and set the workspace picker to **All workspaces**.

2. Select the **Workspaces** tab.

   <!-- vale off -->

3. In the workspace's row, open the three-dot menu and select **Manage**. The **Manage workspace** drawer opens.

   <!-- vale on -->

4. In the **Members** section, make the changes you need.

   - To add a member, select **Add member**, choose the **Type**, enter the **Group name** or **Email or sign-in name**,
     select the **Role**, and then select **Add**.

   - To change a member's role or name, open the three-dot menu in the member's row and select **Change**. In the
     **Change who may act here** dialog, make the change, and then select **Save**.

   - To remove a member, open the three-dot menu in the member's row and select **Remove**.

5. Select **Save changes**. Member changes take effect only when you save the drawer.

<!-- vale off -->

To change the workspace's display name or the policy it follows, edit the **Overview** section of the same drawer before
you select **Save changes**.

<!-- vale on -->

## Add and Manage Users

The **Users** tab shows the people the identity provider serves. Adding a person to the directory does not give them
access to any workspace. To give access, make the person, or a group they are in, a member of a workspace.

### Add a User

1. From the left main menu, select **Access & Policy**, and set the workspace picker to **All workspaces**.

2. Select the **Users** tab, and then select **Add User**. The **Add user** wizard opens on the **Identity** step.

3. On **Who they are**, enter the person's **Email**, and optionally their **First Name** and **Last Name**. Select
   **Next**. The console blocks the step until the email address is valid.

   {/* NEEDS REVIEW: The ticket lists the Identity step fields as Email, First Name, Last Name, and Active. The console source labels them First name and Last name, and shows the Active toggle only in the Manage user drawer, so a new user is created active. Confirm the labels and where Active appears. */}

4. _(Optional)_ On **How they sign in**, set a password for the person. Enter it in **Password** and **Confirm
   password**, or select **Generate a password**. Leave **Make them choose a new one at their next sign-in** selected to
   make the password temporary. Select **Next**. To add the person now and set a password later, leave both fields
   blank.

5. _(Optional)_ On **Which groups they are in**, select the groups the person belongs to.

6. Select **Add user**.

The appliance does not store or send the password. Give it to the person yourself.

### Set a Password

1. On the **Users** tab, open the three-dot menu in the person's row and select **Set password**. The **Set a password
   for** dialog opens with the person's email address in its title.

2. Enter the password in **Password** and **Confirm password**, or select **Generate a password**. The password must be
   at least 12 characters long.

3. Leave **Make them choose a new one at their next sign-in** selected to make the password temporary, or clear it to
   make the password permanent.

4. Select **Set password**.

### Change or Deactivate a User

1. On the **Users** tab, open the three-dot menu in the person's row and select **Manage**. The **Manage user** drawer
   opens.

2. Change the person's first name, last name, or groups. The email address cannot be changed.

3. _(Optional)_ To block the person from signing in while keeping the account, turn off **Active**.

4. Select **Save changes**.

### Delete a User

1. On the **Users** tab, open the three-dot menu in the person's row and select **Delete**.

2. In the confirmation dialog, select **Delete**.

:::warning

Deleting a user removes the person from the identity provider. They can no longer sign in, and you cannot undo the
delete.

:::

## Add and Manage Groups

The **Groups** tab shows the groups the identity provider serves. Changing who is in a group changes the directory only.
A group gains access to a workspace when you make it a member of that workspace.

### Add a Group

1. From the left main menu, select **Access & Policy**, and set the workspace picker to **All workspaces**.

2. Select the **Groups** tab, and then select **Add Group**. The **Add group** drawer opens.

3. In the **Overview** section, enter the group's **Name** and, optionally, a **Description**.

4. _(Optional)_ In the **Members** section, select the people to put in the group.

5. Select **Add group**.

### Change or Delete a Group

1. On the **Groups** tab, open the three-dot menu in the group's row.

2. Choose the action.

   - To rename the group, change its description, or change who is in it, select **Manage**. Make the changes in the
     **Manage group** drawer, and then select **Save changes**.

   - To delete the group, select **Delete**. In the confirmation dialog, select **Delete**. The people in the group keep
     their accounts and lose any access the group gave them.

## Validate

1. From the left main menu, select **Access & Policy**, and set the workspace picker to **All workspaces**.

2. Select the **Workspaces** tab. Confirm that the new workspace appears with its **Policy**, its **Limit**, whether
   **External inferencing** is on, and the number of **Clients** it holds.

3. Select the **Users** tab. Confirm that each person you added appears with the **Groups** they are in and a **State**
   of **Active**.

4. Select the **Roles** tab. Confirm that each role appears with its **Scope**.

5. Open the workspace picker in the console header, and confirm that the new workspace is listed.

## Next Steps

- [Create a Client](./create-a-client.md) in the new workspace and issue its first API token.

- [Access and Policy Reference](../reference/access-and-policy-reference.md) lists every tab, column, role, and message
  on the page.

- [Glossary](../reference/glossary.md) defines workspace, member, role, grant, and policy.
