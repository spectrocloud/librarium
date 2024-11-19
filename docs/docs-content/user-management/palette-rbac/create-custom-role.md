---
sidebar_label: "Create and Manage a Custom Role"
title: "Create and Manage a Custom Role"
description: "Learn how to create and manage a custom role in Palette."
icon: ""
hide_table_of_contents: false
sidebar_position: 5
tags: ["user-management", "role", "rbac"]
---

For each of the role types in Palette, you can create a custom role with specific permissions. This allows you to create
roles that are tailored to your organization's needs.

:::tip

Palette provides several built-in roles that you can use to assign permissions to users. To learn more about the
built-in roles in Palette, refer to the following pages:

- [Project Roles](./project-scope-roles-permissions.md)
- [Resource Roles](./resource-scope-roles-permissions.md)
- [Tenant Roles](./tenant-scope-roles-permissions.md)

:::

The following sections provide instructions on how to create a custom role for each of the role types in Palette.

## Project Roles

To create a custom project role in Palette, use the following steps.

### Prerequisites

- You need tenant admin permissions to create a custom Project role.

### Create a Custom Project Role

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Navigate to the left **Main Menu** and select **Roles**.

3. Navigate to the **Project Roles** tab.

4. Click on the **Create Project Role** button at the top right corner of the page.

5. Provide a name for the custom role in the **Role Name** field.

6. Select the permissions you want to assign to the custom role.

7. Click on the **Save** button.

### Validate

To validate that the custom Project role is created successfully, follow these steps:

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Navigate to the left **Main Menu** and select **Roles**.

3. Navigate to the **Project Roles** tab.

4. Verify that the custom role is listed in the **Project Roles** tab.

5. Assign the custom Project role to a user or group to validate that the permissions are applied correctly.

## Resource Roles

To create a custom resource role in Palette, use the following steps.

### Prerequisites

- You need Tenant admin permissions to create a custom Resource role.

### Create a Custom Resource Role

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Navigate to the left **Main Menu** and select **Roles**.

3. Navigate to the **Resource Roles** tab.

4. Click on the **Create Resource Role** button at the top right corner of the page.

5. Provide a name for the custom role in the **Role Name** field.

6. Select the permissions you want to assign to the custom role.

7. Click on the **Save** button.

### Validate

To validate that the custom Resource role is created successfully, follow these steps:

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Navigate to the left **Main Menu** and select **Roles**.

3. Navigate to the **Project Roles** tab.

4. Verify that the custom role is listed in the **Project Roles** tab.

5. Assign the custom Resource role to a user or group to validate that the permissions are applied correctly.

## Tenant Roles

To create a custom tenant role in Palette, use the following steps.

### Prerequisites

- You need Tenant admin permissions to create a custom Tenant role.

### Create a Custom Tenant Role

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Navigate to the left **Main Menu** and select **Roles**.

3. Navigate to the **Tenant Roles** tab.

4. Click on the **Create Tenant Role** button at the top right corner of the page.

5. Provide a name for the custom role in the **Role Name** field.

6. Select the permissions you want to assign to the custom role.

7. Click on the **Save** button.

### Validate

To validate that the custom Tenant role is created successfully, follow these steps:

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Navigate to the left **Main Menu** and select **Roles**.

3. Navigate to the **Project Roles** tab.

4. Verify that the custom role is listed in the **Project Roles** tab.

5. Assign the custom Tenant role to a user or group to validate that the permissions are applied correctly.

## Edit a Custom Role

To edit a custom role in Palette, use the following steps.

### Prerequisites

- You need a Tenant admin role with the `role.update` permission to edit a custom role.

### Edit a Custom Role

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Navigate to the left **Main Menu** and select **Roles**.

3. Navigate to the tab that corresponds to the role type you want to edit. For example, if you want to edit a custom
   Project role, navigate to the **Project Roles** tab.

4. Locate the custom role you want to edit and click on row to expose the details drawer.

5. Click on the **Actions** button and select **Edit Role**.

6. Make the necessary changes to the custom role.

7. Click on the **Save Changes** button at the bottom of the page.

### Validate

To validate that the custom role is edited successfully, follow these steps.

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Navigate to the left **Main Menu** and select **Roles**.

3. Navigate to the tab that corresponds to the role type you edited the role from.

4. Verify that the custom role is listed in the roles list.

5. Assign the custom role to a user or group to validate that the permissions are applied correctly.

6. Log in as a user with the custom role assigned and verify that the permissions are applied correctly.

## Delete a Custom Role

To delete a custom role in Palette, use the following steps.

### Prerequisites

- You need a Tenant admin role with the `role.delete` permission to delete a custom role.

### Delete a Custom Role

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Navigate to the left **Main Menu** and select **Roles**.

3. Navigate to the tab that corresponds to the role type you want to delete. For example, if you want to delete a custom
   Project role, navigate to the **Project Roles** tab.

4. Locate the custom role you want to delete and click on row to expose the details drawer.

5. Click on the **Actions** button and select **Delete Role**.

6. Confirm the deletion by clicking on the **OK** button in the confirmation dialog.

### Validate

To validate that the custom role is deleted successfully, follow these steps.

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Navigate to the left **Main Menu** and select **Roles**.

3. Navigate to the tab that corresponds to the role type you deleted the role from.

4. Verify that the custom role is no longer listed in the roles list.

5. Review the permissions assigned to the users or groups that had the custom role assigned to ensure that the
   permissions are removed.
