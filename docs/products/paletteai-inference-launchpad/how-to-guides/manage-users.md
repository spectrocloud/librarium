---
sidebar_label: "Manage Users"
title: "Manage Users"
description:
  "Add, change, deactivate, and delete users, and set their passwords, on the Users tab of a PaletteAI Inference
  Launchpad appliance."
hide_table_of_contents: false
sidebar_position: 2.83
tags: ["paletteai-inference-launchpad", "access", "users", "how-to"]
keywords: ["launchpad", "ai", "access", "user", "directory", "password", "identity provider"]
---

Add and maintain people on the **Users** tab. Adding a user gives no workspace access. To give access, add the person,
or a group they are in, as a [workspace member](./manage-workspace-members.md).

## Prerequisites

- A running PaletteAI Inference Launchpad appliance, with the console reachable.

- Console access as a person who holds the **Platform administrator** role.

- An identity provider configured for the appliance. Without one, the **Users** tab shows a message instead of a list.

## Add a User

1. From the left main menu, select **Access & Policy**, and set the workspace picker to **All workspaces**.

2. Select the **Users** tab, and then select **Add User**. The **Add user** wizard opens on the **Identity** step.

3. On **Who they are**, enter the person's **Email**, and optionally their **First Name** and **Last Name**. Leave
   **Active** on to create the person in the **Active** state. Select **Next**.

4. _(Optional)_ On **How they sign in**, set a password for the person, and choose whether the password is temporary.
   Select **Next**.

5. _(Optional)_ On **Which groups they are in**, select the groups the person belongs to.

6. Select **Save**.

## Set a Password

1. On the **Users** tab, open the three-dot menu in the person's row, and then select **Set password**. The **Set a
   password for** dialog opens with the person's email address in its title.

2. Enter the password, and choose whether the password is temporary.

3. Select **Save**.

## Change or Deactivate a User

1. On the **Users** tab, open the three-dot menu in the person's row, and then select **Manage**. The **Manage user**
   drawer opens.

2. Change the person's name or groups.

3. _(Optional)_ To make the person inactive, turn off **Active**.

4. Select **Save**.

## Delete a User

1. On the **Users** tab, open the three-dot menu in the person's row, and then select **Delete**.

2. In the confirmation dialog, confirm the delete.

## Validate

1. From the left main menu, select **Access & Policy**, and set the workspace picker to **All workspaces**.

2. Select the **Users** tab. Confirm that each person you added appears with the **Groups** they are in and the
   **State** you set.

## Next Steps

- [Manage Workspace Members](./manage-workspace-members.md) to give a person access to a workspace.

- [Manage Groups](./manage-groups.md) to put people in groups.

- [Access and Policy Reference](../reference/access-and-policy-reference.md#users-tab) describes the **Users** tab and
  the **Add user** wizard.
