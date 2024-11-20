---
sidebar_label: "Add a Resource Filter"
title: "Add a Resource Filter"
description: "Learn how to add a resource filter to your Palette tenant."
icon: ""
hide_table_of_contents: false
sidebar_position: 20
tags: ["tenant-administration", "filter"]
---

Resource filters are used to limit the visibility of resources or actions to a
[Resource roles](../user-management/palette-rbac/resource-scope-roles-permissions.md). A filter is a collection
expressions that together define the scope the Resource roles can access.

Use the following steps to add a filter to your Palette tenant.

## Prerequisites

- You must have tenant administrator permissions to add a filter to your Palette tenant.

## Add a Filter

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Navigate to the left **Main Menu** and select **Tenant Settings**.

3. Next, click on **Platform Settings** from the **Tenant Settings Menu**.

4. Click on **Filters** to open the **Filters** page.

5. Click on **New Resource Filter** to add a new filter.

6. Provide a name for the filter in the **Name** field.

7. Next, select the Palette resource type you want to apply the filter on. For example, **Tag**.

8. Next, define the query for the filter. You can chose between **is**, and **is not**. Complete the expression by
   providing a value for the query.

   ![A view of the Add Resource Filter wizard with two tag expressions - tag is not equal to the value sensitive, and the tag is equal to the value claims.](/tenant-settings_filters_add-resource-filter-wizard.webp)

9. If you want to add more expressions to the filter, click on **Add condition**.

10. Select a **Conjunction**. You can choose between **and** and **or**.

11. Repeat steps 7-10 to add more expressions to the filter.

12. Click on **Confirm** to save the filter.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Navigate to the left **Main Menu** and select **Tenant Settings**.

3. Next, click on **Platform Settings** from the **Tenant Settings Menu**.

4. Click on **Filters** to open the **Filters** page.

5. Verify that the filter you added is listed in the **Filters** page.

6. To validate the impact of the filter, assign the filter to a Resource role. For more information, refer to the
   [Resource Roles and Permissions](../user-management/palette-rbac/resource-scope-roles-permissions.md) page.

## Resources

- [Resource Roles ](../user-management/palette-rbac/resource-scope-roles-permissions.md)
