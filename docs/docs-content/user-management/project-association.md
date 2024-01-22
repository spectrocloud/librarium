---
sidebar_label: "Project Association"
title: "Associate a User or Team with a Project"
description: "Associate a User or Team with a Project"
hide_table_of_contents: false
sidebar_position: 20
tags: ["user-management"]
---

Associating a user or team with a specific project creates a clear distinction between who is allowed in the project and
their access control permissions. By grouping resources together, you ensure that only designated members have access to
and control over the project resources, preventing others from accidentally or intentionally modifying them. This
improves resource accountability, reduces confusion and conflicts, and helps maintain the integrity and security of the
project.

User permissions are determined by the combination of their tenant and project roles, as well as any roles inherited
from their team association. If a user is a _Tenant Admin_, they have admin permissions in all projects. A user with the
_Project Viewer_ role at the tenant level has _View_ permissions for all projects. However, if a user or team has the
_Project Viewer_ role assigned to a specific project, they only have view access to that project. The extent of user
permissions, either at the tenant or project level, determines the number of projects they can access.

## Associate a User or Team

To associate a user or team with a project, use the following steps.

## Prerequisites

- Tenant Admin access.

- An available project. Check out the [Create a Project](../projects.md) guide to learn how to create a project.

- A user or a team.

## Enablement

1. Log in to [Palette](https://console.spectrocloud.com).

2. Select the **Tenant Admin** scope.

3. Navigate to the left **Main Menu** and select **Users & Teams**.

4. Select the tab of the resource you want to associate with a project, either a user or a team.

5. Click on the row of the user or team to display its overview page.

6. Select **Project Roles**.

7. A **drop-down Menu** containing all the available projects in the tenant is available. Select the project you want to
   associate with the project role.

8. Next, assign permissions to the project role. To learn more about each permission and available roles, check out the
   [Palette RBAC](palette-rbac/palette-rbac.md) documentation.

Click **Confirm** to create the project role and complete the project association process.

## Validate

1. Have a user or a user assigned to a team log in to [Palette](https://console.spectrocloud.com).

2. Ask the user to switch the scope to the project you associated their role with.

The user will now be able to select the associated project and complete actions within the scope of their project role
permissions.

<br />
