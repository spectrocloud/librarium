---
sidebar_label: "Manage Workspace Members"
title: "Manage Workspace Members"
description:
  "Add, change, and remove the people and groups who can act in a PaletteAI Inference Launchpad workspace, and the role
  each one holds."
hide_table_of_contents: false
sidebar_position: 2.82
tags: ["paletteai-inference-launchpad", "access", "workspaces", "how-to"]
keywords: ["launchpad", "ai", "access", "rbac", "workspace", "member", "role", "grant"]
---

Change who can act in an existing workspace, and with which role. For what a member is, refer to
[Clients and Quotas](../explanation/clients-and-quotas.md#roles-and-members).

## Prerequisites

- A running PaletteAI Inference Launchpad appliance, with the console reachable.

- Console access as a person who holds the **Platform administrator** role.

- An existing workspace. To create one, refer to [Create a Workspace](./create-a-workspace.md).

## Add, Change, or Remove Workspace Members

1. From the left main menu, select **Access & Policy**, and then select **All workspaces** in the workspace drop-down
   menu.

2. Select the **Workspaces** tab.

   <!-- vale Vale.Spelling = NO -->

3. In the workspace's row, open the three-dot menu, and then select **Manage**.

   <!-- vale Vale.Spelling = YES -->

4. In the members table, make the changes you need.

   - To add a member, select **Add member**, choose the **Type**, enter the **Group name** or **Email or sign-in name**,
     select the **Role**, and then select **Add**.

   - To change a member's role or name, open the three-dot menu in the member's row, and then select **Change**. In the
     **Change who may act here** dialog, make the change, and then select **Save**.

   - To remove a member, open the three-dot menu in the member's row, and then select **Remove**.

5. Select **Save**.

## Validate

1. On the **Workspaces** tab, open the three-dot menu in the row for the workspace, and then select **Manage**.

2. Confirm that the members table lists each member with the **Who**, **Type**, and **Role** you set.

## Next Steps

- [Create a Workspace](./create-a-workspace.md) for another team.

- [Manage Users](./manage-users.md) and [Manage Groups](./manage-groups.md) to maintain the people and groups you add as
  members.

- [Access and Policy Reference](../reference/access-and-policy-reference.md#members-table) describes the members table.
