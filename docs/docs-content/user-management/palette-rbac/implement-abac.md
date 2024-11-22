---
sidebar_label: "ABAC in Palette"
title: "Attribute-Based Access Control in Palette"
description: "Learn how to implement Attribute-Based Access Control (ABAC) in Palette."
hide_table_of_contents: false
sidebar_position: 60
tags: ["user-management", "users", "teams", "roles"]
---

Attribute-Based Access Control (ABAC) is a security model that uses attributes to determine access to resources. In
Palette, ABAC is implemented using [Resource roles](./resource-scope-roles-permissions.md) and
[Resource filters](../../tenant-settings/filters.md).

The Resource role defines the permissions a user has on resources, and the Resource filters define the scope of the
resources the user can access. When a Resource role is assigned to a user or team, it must be paired with a Resource
filter to control access based on a tag value.

This guide will teach you how to implement ABAC in Palette.

:::info

ABAC in Palette can be achieved with a handful of resources. You can identify the Palette components eligible for ABAC
on the [Permissions](./permissions.md#operations) page. Review the components table and all components that have a
checkmark in the Resource Role Scope column.

:::

## Prerequisites

- Tenant admin access to Palette with the permissions `user.update`, `role.list`, `team.update`, and `filter.list`.

- A user or team available. Check out the [Create and Manage a User](../users-and-teams/create-user.md) or
  [Create and Manage a Team](../users-and-teams/create-a-team.md) guide to learn how to create a user or team.

## Implement ABAC

To implement ABAC in Palette, use the following steps.

1.  Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2.  Navigate to the left **Main Menu** and click on **Tenant Settings**.

3.  From the **Tenant Settings Menu** page, expand the **Platform** section and click on **Filters**.

4.  Create a filter by clicking on the **New Resource Filter** button. The resource filter creation page will open.
    Refer to the [Add a Resource Filter](../../tenant-settings/filters.md) for detailed steps on creating a filter.

5.  After creating the filter, navigate to the left **Main Menu** and click on **Roles**.

6.  Click on the **Resource Roles** tab.

7.  Click on **Create Resource Role**. Provide the role a name and select the desired permissions. You can find detailed
    steps for how to create a Resource role in the
    [Create and Manage a Custom Role](./create-custom-role.md#create-a-custom-resource-role) guide.

    <!-- prettier-ignore -->
    <details> 
    <summary>What permissions do I select?</summary>

        The permissions you select depend on the use case you want to regulate. For example, if you are going to control what cluster profiles a user can view and use,
        you would select the **Cluster permissions** resource type and check the
        boxes for the `clusterprofile.get` and `clusterprofile.list` permissions. This would allow the user to view and list
        cluster profiles when creating a cluster.

        The next important step is to ensure all cluster profiles match the
        conditions defined in the resource filter you created in step 4. This ensures that the user can only view and use cluster
        profiles that match the filter conditions. For example, if you created a filter that only allows users to view
        cluster profiles with the tag `development`, the user would only be able to view and use cluster profiles with that
        tag.

        You could build on this example use case by adding the **Cluster permissions** resource type and selecting the `cluster.get` and `cluster.list` permissions.
        This would allow the user to use only clusters that match the resource filter condition.
        The tenant admin or user with permission to create clusters would need to ensure that all clusters created have the `development` tag.

        To learn more about the resource types and permissions available in Palette, refer to the
        [Permissions](./permissions.md) page.

    </details>

8.  After creating the Resource role, navigate to the left **Main Menu** and click on **Users & Teams**.

9.  Select the tab of the resource you want to assign with the Resource role, either a user or a team.

10. Click on the row of the user or team to display its overview page.

11. Click on the **Resource Roles** tab.

12. Click on the **New Resource Role** button.

13. Select the projects you want the Resource to have access to.

14. Assign the Resource filter you created in step 4.

15. Select the Resource role you created in step 7.

16. Click **Confirm** to assign the Resource role to the user or team.

The user or team can now interact with the Palette components that match the conditions defined in the Resource filter
and the permissions defined in the Resource role.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Create a resource that matches the conditions defined in the Resource filter. For example, if you created a filter
   that only allows users to view cluster profiles with the tag `development`, create a cluster profile with that tag.

3. Have the user or team log in to [Palette](https://console.spectrocloud.com).

4. Verify the user or team can only view and interact with resources that match the conditions defined in the Resource
   filter and the permissions defined in the Resource role.
