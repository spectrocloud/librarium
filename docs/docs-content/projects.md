---
sidebar_label: "Projects"
title: "Concept: Projects"
description: "Understanding what Spectro Cloud projects are"
hide_table_of_contents: false
sidebar_position: 110
sidebar_custom_props:
  icon: "cog"
tags: ["projects"]
---

# Projects

A **Project** helps you organize the cluster resources in a logical grouping. The resources that are created within a project are scoped to that project and not available to other projects. You can also assign users and teams with specific roles to specific projects.

## Project Dashboard

The **Tenant Admin** > **Projects** page displays the project-related dashboard cards for all projects in the tenant.

## Project Card

The **Project card** shows the status and relevant details of a cluster, grouping information about healthy, unhealthy, and errored clusters. It calculates cluster health by evaluating the health of each node, taking into account factors such as memory and CPU utilization, disk pressure, and network availability. Additionally, it displays the number of clusters imported and those provisioned by Palette.

### Cores per Project Usage

By default, the active worker node usage of CPU **Cores** is grouped across all projects and shown as an hourly interval. You can change the interval value to days or months.

## Create a Project

Use the following steps to create a new project.

<br />

:::info

You can associate users and teams with a project. Check out the [Project Association](/user-management/project-association) page to learn more.

:::

## Prerequisites

- Tenant admin access

## Enablement

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to **Tenant Admin** > **Projects** and click the **Create Project** button.

3. Fill out the following fields: **Name**, **Description**, and **Tags** to create a Project.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to **Tenant Admin** > **Projects**

Your newly created project is listed along with other existing projects.

## Delete a Project

You can remove projects by following these steps.

## Prerequisites

- Tenant admin access.

- No active clusters in the project.

## Remove Project

1. Log in to [Palette](https://console.spectrocloud.com).

2. Switch to **Tenant Admin** scope.

3. Navigate to the left **Main Menu** and select **Projects**.

4. Locate the project card for the project you want to remove.

5. Click on the **three-dot Menu** and select **Delete**.

6. A pop-up box will ask you to confirm the action. Confirm the deletion.

:::warning

You can delete projects with force as long as there are no active clusters. Force deleting will eliminate all resources linked to the project, such as app profiles, cluster profiles, workspaces, audit logs, and custom project settings. However, if a project has active clusters, you must remove them first before deleting the project.

:::

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to **Tenant Admin** > **Projects** .

The project you deleted is no longer displayed and available for interaction.
