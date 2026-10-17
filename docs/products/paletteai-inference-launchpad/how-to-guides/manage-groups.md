---
sidebar_label: "Manage Groups"
title: "Manage Groups"
description: "Add, change, and delete groups on the Groups tab of a PaletteAI Inference Launchpad appliance."
hide_table_of_contents: false
sidebar_position: 2.84
tags: ["paletteai-inference-launchpad", "access", "groups", "how-to"]
keywords: ["launchpad", "ai", "access", "group", "directory", "identity provider"]
---

Maintain the groups in the directory on the **Groups** tab. Adding a group gives no workspace access. To give access,
add the group as a [workspace member](./manage-workspace-members.md).

## Prerequisites

- A running PaletteAI Inference Launchpad appliance, with the console reachable.

- Console access as a person who holds the **Platform administrator** role.

- An identity provider configured for the appliance. Without one, the **Groups** tab shows no directory.

## Add a Group

1. From the left main menu, select **Access & Policy**, and set the workspace picker to **All workspaces**.

2. Select the **Groups** tab, and then select **Add Group**. The **Add group** drawer opens.

3. In the **Overview** section, enter the group's **Name** and, optionally, a **Description**.

4. _(Optional)_ In the **Members** section, select the people to put in the group.

5. Select **Save**.

## Change or Delete a Group

1. On the **Groups** tab, open the three-dot menu in the group's row.

2. Choose the action.

   - To rename the group, change its description, or change who is in it, select **Manage**. Make the changes in the
     **Manage group** drawer, and then select **Save**.

   - To delete the group, select **Delete**. In the confirmation dialog titled with the group's name, confirm the
     delete.

## Validate

1. From the left main menu, select **Access & Policy**, and set the workspace picker to **All workspaces**.

2. Select the **Groups** tab. Confirm that each group appears with its **Description** and its number of **Members**.

## Next Steps

- [Manage Workspace Members](./manage-workspace-members.md) to give a group access to a workspace.

- [Manage Users](./manage-users.md) to add the people you put in groups.

- [Access and Policy Reference](../reference/access-and-policy-reference.md#groups-tab) describes the **Groups** tab.
