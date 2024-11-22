---
sidebar_label: "Cluster Resource Filter"
title: "Cluster Resource Filter"
description: "Create and Add Cluster Resource Filter"
hide_table_of_contents: false
tags: ["clusters", "cluster management", "filters"]
---

The page guides you on how to create a Resource Filter and how to add these filters to the users to establish cluster
access restrictions.

## Create Resource Filter

You must create a Resource Filter in Palette to establish user-based, or team-based access restrictions to clusters
across multiple projects. The resource filters are created under the scope of Tenant Admin. To create a resource filter,
follow the steps below.

### Prerequisites

- A [Palette account](https://console.spectrocloud.com) with Tenant scope privileges.

### Create Resource Filter

1. Log in to Palette as **Tenant Admin**.

2. Navigate to the left **Main Menu** and select **Tenant Settings**.

3. From the **Tenant Settings Menu**, expand the **Platform Settings** and click on **Filters**.

4. Click on **+New Resource Filter**.

5. Fill out the input fields in the **Create Resource Filter** wizard. Use the following table to understand the input
   fields:

   - Filter Name: A custom name for the tag filter. Keep in mind the tags are case-sensitive.
   - A filter expression. Use the following table to familiarize yourself with the filter expression format:

   | Conjunction | Property | Operator | Tag-Value        |
   | ----------- | -------- | -------- | ---------------- |
   | and         | Tag      | is       | Custom tag value |
   | or          | Tag      | is       | Custom tag value |
   | and         | Tag      | is not   | Custom tag value |
   | or          | Tag      | is not   | Custom tag value |

6. Click the **Confirm** button to complete the filter creation wizard.

### Validate

Upon creating a filter, a display message will pop up to confirm the successful creation of the tag. You can also use
the following steps to review the filter is available for use.

1. Log in to Palette as **Tenant Admin**.

2. Navigate to the left **Main Menu** and select **Tenant Settings**.

3. From the **Tenant Settings Menu**, expand the **Platform Settings** and click on **Filters**.

4. Locate the filter you created in the list of filters displayed.

## Add Resource Role

You can assign the created resource filter and roles to a user or team to enforce access restrictions. There are two
types of roles that can be assigned:

- [Resource Roles](../../../user-management/palette-rbac/resource-scope-roles-permissions.md) are a set of roles that
  are available in Palette by default.

- [Custom Resource Roles](../../../user-management/palette-rbac/resource-scope-roles-permissions.md) can be created
  according to your requirements from the available set of permissions and operations.

### Prerequisites

- A [Palette account](https://console.spectrocloud.com) with Tenant scope privileges.

- A Palette [user](../../../user-management/users-and-teams/create-user.md#user-creation) or team to assign the resource
  privileges.

### Assign Resource Roles and Filter

To assign the resource roles and filter to the user follow the below steps.

1. Log in to Palette as Tenant Admin

2. Navigate to the left **Main Menu** and click on **Users & Teams**.

3. Select the user or team to assign the role.

4. From the user details wizard, select **Resource Roles** tab and click **New Resource Role**.

5. In the **Add Roles to User** wizard, enter the following details:

- **Projects**: The projects to which the user is assigned.
- **Filers**: Select the filters to be assigned from the drop-down. The Filters created will be displayed in the
  **drop-down Menu**.
- Select the check box to assign the roles to the user from the list displayed. The roles displayed are Palette built-in
  roles.

5. Click **Confirm** to complete the Add Role wizard.

### Validate

Upon creating a filter, a display message will pop up to confirm the successful role assignment. You can also use the
following steps to review the roles created:

1. Navigate to the left **Main Menu** and click on **Clusters**.

2. This page will list all the clusters to which the user has access based on the filter created. You need to switch to
   each project and review the accessible clusters.

## Remove or Edit the Role

You can remove or edit the roles assigned to the user or team from the **Resource Roles** tab in the **User Details**

### Prerequisites

- A [Palette account](https://console.spectrocloud.com) with Tenant scope privileges.

### Remove or Edit the Role

To remove or edit an attached role:

1. Log in to Palette as Tenant Admin

2. Navigate to the left **Main Menu** and click on **Users & Teams**.

3. Click on the user or team to remove or edit the role.

4. From the **Resource Roles** tab, click the **three-dot Menu** towards the role name.

5. Click **Edit** or **Remove** option from the **drop-down Menu**.

### Validate

1. Log in to Palette as Tenant Admin.

2. Navigate to the left **Main Menu** and click on **Users & Teams**.

3. Click on the user or team to review the roles.

4. From the **Resource Roles** tab, review the roles assigned to the user or team.

5. Verify the role is removed or edited successfully.
