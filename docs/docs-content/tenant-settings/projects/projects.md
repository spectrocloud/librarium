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

A **Project** helps you organize the cluster resources in a logical grouping. A tenant can have multiple projects.
Projects are used to group resources and manage access control. You can assign users and teams with specific roles to
specific projects.

Use projects to logically group resources and manage access control.

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

When a user logs in to Palette, the [project dashboard](../../getting-started/dashboard.md) is displayed by default. The
project dashboard displays a map containing all the clusters deployed in the project. A summary of the clusters deployed
in the project, deleted, failed deployments, and the number of clusters pending an update is also displayed.

    ![A view of a project dashboard](/tenant_settings-projects-dashboard.webp)

## Project ID

Each project is assigned a unique ID when it is created. The project ID is used to identify the project when making API
requests.

You can find the project ID in the top-right corner of the project dashboard.

    ![A project ID highlighted in the project dashboard view](/tenant_settings-projects-projects-project_id.webp)

## Resources

- [Create a Project](./create-manage-projects.md)
