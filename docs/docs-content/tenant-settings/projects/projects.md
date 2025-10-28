---
sidebar_label: "Projects"
title: "Projects"
description:
  "Projects helps you organize the cluster resources into a logical grouping. Learn more about project and how to use
  them in Palette."
hide_table_of_contents: false
sidebar_position: 0
tags: ["projects"]
---

A **Project** helps you organize and manage cluster resources. A tenant can have multiple projects. Projects are used to
group resources and manage user access control through Role Based Access Control (RBAC). You can assign users and teams
with specific roles to specific projects.

For example, you can create a project for each team, or create a project for each infrastructure environment. The
flexibility of projects allow you to organize resources in a way that makes sense for your organization.

## Scope

All resources created within a project are scoped to that project and only available to that project.

:::info

Resources created under the tenant scope are available to all projects.

:::

The following resources are scoped to a project by default:

- Alerts
- Application profiles
- Backup locations
- Cloud accounts
- Clusters
- Cluster groups
- Cluster profiles
- Macros
- Platform settings
- SSH keys
- Workspaces

## Project Dashboard

When a user logs in to Palette, the [project dashboard](../../introduction/dashboard.md) is displayed by default. The
project dashboard displays a map containing all the clusters deployed in the project. A summary of the clusters deployed
in the project, deleted, failed deployments, and the number of clusters pending an update is also displayed.

    ![A view of a project dashboard](/tenant_settings-projects-dashboard.webp)

## Project ID

Each project is assigned a unique ID when it is created. The project ID is used to identify the project when making API
requests.

You can find the project ID in the top-right corner of the project dashboard.

    ![A project ID highlighted in the project dashboard view](/tenant_settings-projects-projects-project_id.webp)

## Project Tags

Project tags are key-value pairs that help you organize and categorize your projects. Project tags are displayed on the
**Project Overview** page.

![Project tags highlighted in the Project Overview page](/tenant-settings_projects_project-tags-overview_4-8.webp)

Project tags are also displayed on the **Projects** page in the **Tenant Admin** scope.

![Project tags highlighted in the Tenant Admin Projects page](/tenant-settings_projects_project-tags-admin_4-8.webp)

### Add or Delete Project Tags

You can add tags when [creating a project](./create-manage-projects.md#create-a-project) or add them to existing
projects. To add, edit, or delete tags for an existing project, you must be in the **Tenant Admin** scope.

Use the following steps to modify the tags of an existing project:

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin. Ensure you are in the **Tenant Admin**
   scope.

2. From the left main menu, select **Projects**.

3. Select the three-dot menu beside the applicable project and choose **Edit**.

4. Use the **Tags (Optional)** field to add or delete tags as necessary. To edit an existing tag, you must delete the
   old tag and create a new one.

5. **Confirm** your changes when finished.

## Resources

- [Create a Project](./create-manage-projects.md)
