---
sidebar_label: "Create and Manage Projects"
title: "Create and Manage Projects"
description: "Learn how to create and manage projects in Palette."
hide_table_of_contents: false
sidebar_position: 10
tags: ["projects"]
---

Tenant administrators can create and manage projects in Palette. A tenant administrator automatically has access to all
projects within the tenant. You can associate users and teams with a project. Check out the
[Project Association](../../user-management/project-association.md) page to learn more.

## Create a Project

Use the following steps to create a new project.

### Prerequisites

- Tenant admin access

### Enablement

1. Log in to [Palette](https://console.spectrocloud.com).

2. Switch to **Tenant Admin** scope.

3. Navigate to the left **Main Menu** and click on **Projects**.

4. Select the **Create Project** button.

5. Fill out the input fields to create a project. Refer to the table below for more information.

   | Field       | Description                         | Required |
   | ----------- | ----------------------------------- | -------- |
   | Name        | The name of the project.            | Yes      |
   | Description | A brief description of the project. | No       |
   | Tags        | Add tags to the project.            | No       |

6. Click **Confirm** to create the project.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to **Tenant Admin** and select **Projects**.

Your newly created project is listed along with other existing projects.

## Delete a Project

You can remove projects by using the following steps.

### Prerequisites

- Tenant admin access.

- No active clusters in the project.

:::warning

You can delete projects with force as long as there are no active clusters. Force deleting will eliminate all resources
linked to the project, such as app profiles, cluster profiles, workspaces, audit logs, and custom project settings.
However, if a project has active clusters, you must remove them first before deleting the project.

:::

### Remove Project

1. Log in to [Palette](https://console.spectrocloud.com).

2. Switch to **Tenant Admin** scope.

3. Navigate to the left **Main Menu** and select **Projects**.

4. Locate the project card for the project you want to remove.

5. Click on the **three-dot Menu** and select **Delete**.

6. A pop-up box will ask you to confirm the action. Confirm the deletion.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Switch to **Tenant Admin** scope.

3. Navigate to the left **Main Menu** and select **Tenant Admin**.

4. From the **Tenant Settings Menu**, select **Projects** .

The project you deleted is no longer displayed and available for interaction.
