---
sidebar_label: "Create and Manage a Team"
title: "Create and Manage a Team"
description: "Learn how to create and manage a team in Palette"
hide_table_of_contents: false
sidebar_position: 20
tags: ["user-management", "team"]
---

Teams are a collection of users that share a common set of permissions through [roles](../palette-rbac/palette-rbac.md)
that grants them access to resources. By grouping users together, you can manage their access to projects and resources.

## Team Creation

Use the following steps to create a team.

### Prerequisites

- Tenant Admin access with the permissions `team.create` and `user.list`.

- At least one user in the tenant. Check out the [Create a User](../users-and-teams/create-user.md) guide to learn how
  to create a user.

### Create a Team

1. Log in to [Palette](https://console.spectrocloud.com) as a Tenant admin.

2. Navigate to the left **Main Menu** and select **Tenant Settings**.

3. Select **Users & Teams**.

4. Click on the **Teams** tab.

5. Click **Create Team**.

6. Enter the team name and select the users you want to add to the team.

7. Click **Confirm** to create the team.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com) as a Tenant admin.

2. Navigate to the left **Main Menu** and select **Tenant Settings**.

3. Select **Users & Teams**.

4. Click on the **Teams** tab.

5. Verify that the team you created is listed.

6. Switch to the **Users** tab and select a user that you added to the team.

7. Verify that the user is associated with the team you created.

## Team Deletion

Use the following steps to delete a team from Palette.

### Prerequisites

- Tenant Admin access with the permissions `team.delete`.

- At least one team in the tenant. Check out the [Create a Team](#create-a-team) guide to learn how to create a team.

### Delete a Team

1. Log in to [Palette](https://console.spectrocloud.com) as a Tenant admin.

2. Navigate to the left **Main Menu** and select **Tenant Settings**.

3. Select **Users & Teams**.

4. Click on the **Teams** tab.

5. Click on the row of the team you want to delete.

6. Click on the **Delete Team** button.

7. Click **OK** to delete the team.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com) as a Tenant admin.

2. Navigate to the left **Main Menu** and select **Tenant Settings**.

3. Select **Users & Teams**.

4. Click on the **Teams** tab.

5. Verify that the team you deleted is no longer listed.

6. Switch to the **Users** tab and select a user that was associated with the team you deleted.

7. Verify that the user is no longer associated with the team you deleted.
