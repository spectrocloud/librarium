---
sidebar_label: "Create and Manage a Role Assignment"
title: "Create and Manage a Role Assignment"
description: "Learn how to assign a role to a user or team in Palette"
hide_table_of_contents: false
sidebar_position: 20
tags: ["user-management", "users", "teams", "roles"]
---

Assigning a role to a user or team in Palette is critical in managing user access and permissions. By assigning roles,
you can control users' access to various resources and actions in Palette. Users and teams can have multiple roles
assigned to them, each with different permissions and access levels. We recommend assigning roles at the team level to
reduce the complexity of managing user access.

This guide explains how to assign a role to a user or team in Palette.

## Assign a Role to a User

Use the following steps to assign a role to a user.

### Prerequisites

- Tenant admin access to Palette with the permissions `user.update` and `role.list`.

- An available user. Check out the [Create a User](../users-and-teams/create-user.md) guide to learn how to create a
  user.

- If you want to assign a custom role to a user, you must have the role created. Check out the
  [Create and Manage a Custom Role](./create-custom-role.md) guide to learn how to create a custom role.

### Assign User Role

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Navigate to the left **Main Menu** and click on **Tenant Settings**.

3. Select **Users & Teams**.

4. Click on the **Users** tab.

5. Click on the row of the user to display its overview page.

6. Select the tab of the role you want to assign to the user. For example, click on **Project Roles** to assign a
   built-in project role or a custom project role you created.

   ![A view of the role assignment menu for a user](/user-management_palette-rback_assign-a-role_user-role-assign.webp)

7. Click on the **New Role** button.

8. Depending on the role you want to assign, you may have to select projects, workspaces, filters, or other resources
   associated with the role. Provide a selection for each resource required by the role.

9. Check the box next to the role you want to assign to the user. The built-in roles are listed first, followed by
   custom roles.

10. Click **Confirm** to assign the roles to the user.

11. Repeat steps 7 to 10 to assign additional roles to the user.

### Validate

1. Have the user log in to [Palette](https://console.spectrocloud.com). If a self-hosted Palette instance is used, have
   the user log in to Palette using the instance URL.

2. The user can now access the resources and perform the actions associated with the assigned roles in the projects you
   assigned them to.

If the user is unable to access a project or a resource, review the projects and roles assigned to the user.

## Assign a Role to a Team

Use the following steps to assign a role to a team.

### Prerequisites

- Tenant admin access to Palette with the permissions `team.update` and `role.list`.

- An available team. Check out the [Create a Team](../users-and-teams/create-a-team.md) guide to learn how to create a
  team.

- If you want to assign a custom role to a user, you must have the role created. Check out the
  [Create and Manage a Custom Role](./create-custom-role.md) guide to learn how to create a custom role.

### Assign Team Role

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Navigate to the left **Main Menu** and click on **Tenant Settings**.

3. Select **Users & Teams**.

4. Click on the **Team** tab.

5. Click on the row of the team to display its overview page.

6. Select the tab of the role you want to assign to the team. For example, click on **Project Roles** to assign a
   built-in project role or a custom project role you created.

   ![A view of the role assignment menu for a team](/user-management_palette-rback_assign-a-role_team-role-assign.webp)

7. Click on the **New Role** button.

8. Depending on the role you want to assign, you may have to select projects, workspaces, filters, or other resources
   associated with the role. Provide a selection for each resource required by the role.

9. Check the box next to the role you want to assign to the team. The built-in roles are listed first, followed by
   custom roles.

10. Click **Confirm** to assign the roles to the team.

11. Repeat steps 7 to 10 to assign additional roles to the team.

### Validate

1. Have a member of the team log in to [Palette](https://console.spectrocloud.com). If a self-hosted Palette instance is
   used, have the team member log in to Palette using the instance URL.

2. The team member can now access the resources and perform the actions associated with the assigned roles in the
   projects you assigned them to.

If the team member is unable to access a project or a resource, review the projects and roles assigned to the team.
Also, ensure the user is a member of the team to inherit the access permissions assigned to the team.

## Remove a Role From a User

Use the following steps to remove a role from a user.

### Prerequisites

- Tenant admin access to Palette with the permissions `user.update` and `role.list`.

- An available user. Check out the [Create a User](../users-and-teams/create-user.md) guide to learn how to create a
  user.

### Remove User Role

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Navigate to the left **Main Menu** and click on **Tenant Settings**.

3. Select **Users & Teams**.

4. Click on the **Users** tab.

5. Click on the row of the user to display its overview page.

6. Select the tab of the role you want to remove from the user. For example, click on **Project Roles** to unassign a
   built-in project role or a custom project role you created.

7. Identify the role you want to remove from the user and click on **three-dot Menu** next to the role.

8. Click on **Remove**.

### Validate

1. Have the user log in to [Palette](https://console.spectrocloud.com). If a self-hosted Palette instance is used, have
   the user log in to Palette using the instance URL.

2. Verify that the user can no longer access the resources and perform the actions associated with the removed role in the projects
   you assigned them to.

## Remove a Role From a Team

Use the following steps to remove a role from a team.

### Prerequisites

- Tenant admin access to Palette with the permissions `team.update` and `role.list`.

- An available team. Check out the [Create a Team](../users-and-teams/create-a-team.md) guide to learn how to create a
  team.

### Remove Team Role

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Navigate to the left **Main Menu** and click on **Tenant Settings**.

3. Select **Users & Teams**.

4. Click on the **Team** tab.

5. Click on the row of the team to display its overview page.

6. Select the tab of the role you want to remove from the team. For example, click on **Project Roles** to unassign a
   built-in project role or a custom project role you created.

7. Identify the role you want to remove from the team and click on **three-dot Menu** next to the role.

8. Click on **Remove**.

### Validate

1. Have a member of the team log in to [Palette](https://console.spectrocloud.com). If a self-hosted Palette instance is
   used, have the team member log in to Palette using the instance URL.

2. Verify that the team member can no longer access the resources and perform the actions associated with the removed role in the
   projects you assigned them to.
