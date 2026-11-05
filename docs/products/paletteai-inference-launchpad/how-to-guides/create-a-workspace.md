---
sidebar_label: "Create a Workspace"
title: "Create a Workspace"
description:
  "Create a workspace on a PaletteAI Inference Launchpad appliance, choose the policy it follows, and add the people and
  groups who can act in it."
hide_table_of_contents: false
sidebar_position: 2.81
tags: ["paletteai-inference-launchpad", "access", "workspaces", "how-to"]
keywords: ["launchpad", "ai", "access", "policy", "rbac", "workspace", "member", "role"]
---

Give a team its own workspace on the **Access & Policy** page. For the concepts, refer to
[Clients and Quotas](../explanation/clients-and-quotas.md#workspaces-and-access). For the page's labels, refer to
[Access and Policy Reference](../reference/access-and-policy-reference.md).

## Prerequisites

- A running PaletteAI Inference Launchpad appliance, with the console reachable.

- Console access as a person who holds the **Platform administrator** role.

- At least one policy on the **Policies** tab for the new workspace to follow.

## Give a Team Access to Its Own Workspace

1. From the left main menu, select **Access & Policy**.

2. In the workspace drop-down menu in the console header, select **All workspaces**.

3. Select the **Workspaces** tab, and then select **Create Workspace**. The **Create workspace** wizard opens on the
   **Overview** step.

4. On **Workspace overview**, enter a **Name** for the workspace, and select the **Policy** the workspace follows.
   Select **Next**.

5. On **Who may act here**, select **Add member**. The **Add someone to this workspace** dialog opens.

6. Choose a **Type** of **Group** or **User**. For a group, enter the **Group name**. For a user, enter the **Email or
   sign-in name**. Select a **Role** of **Workspace administrator** or **Operator**, and then select **Add**.

   For each role's scope, refer to [Access and Policy Reference](../reference/access-and-policy-reference.md#roles).

7. Repeat steps 5 and 6 for each person or group the workspace needs.

8. Select **Create workspace**.

9. _(Optional)_ If a person the workspace needs is not on the **Users** tab yet, add them. For the steps, refer to
   [Add a User](./manage-users.md#add-a-user).

10. In the workspace drop-down menu in the console header, select the new workspace, and then from the left main menu,
    select **Access & Policy**. Create the team's clients there. For the steps, refer to
    [Create a Client](./create-a-client.md).

## Validate

1. From the left main menu, select **Access & Policy**, and then select **All workspaces** in the workspace drop-down
   menu.

2. Select the **Workspaces** tab. Confirm that the new workspace appears with its **Policy**, its **Limit**, whether
   **External inferencing** is on, and the number of **Clients** it holds.

3. Open the workspace drop-down menu in the console header, and confirm that the new workspace is listed.

## Next Steps

- [Create a Client](./create-a-client.md) in the new workspace and issue its first API token.

- [Manage Workspace Members](./manage-workspace-members.md) to add, change, and remove the members of the workspace.

- [Manage Users](./manage-users.md) and [Manage Groups](./manage-groups.md) to maintain the people and groups you add as
  members.

- [Access and Policy Reference](../reference/access-and-policy-reference.md) lists every tab, column, role, and message
  on the page.
