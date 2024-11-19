---
sidebar_label: "Create and Manage a New User"
title: "Create and Manage a New User"
description: "Learn how to create and manage a new user in Palette"
hide_table_of_contents: false
sidebar_position: 10
tags: ["user-management", "users"]
---

You can create a user in Palette to allow them access to the tenant and its resources. Users can be assigned to teams
and projects, and their permissions are determined by the roles assigned to them.

## User Creation

Use the following steps to create a new user in Palette.

### Prerequisites

- Tenant admin access with the `user.create` permission.

- Name and email address of the user you want to create.

- If you are using self-hosted Palette or VerteX, ensure you have configured Simple Mail Transfer Protocol (SMTP)
  settings to send email invitations to the user. You can configure SMTP settings in the self-hosted Palette system
  console.

### Create a User

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Navigate to the left **Main Menu** and click on **Tenant Settings**.

3. Click on **Users & Teams**.

4. Select the **Users** tab.

5. Click on the **Create User** button.

6. Fill in the user details, including the user's name, email address, and assign them to a team. You can assign the
   user to a team later if you prefer.

7. Click **Confirm** to create the user.

An email invitation is sent to the user with a link to set their password and log in to Palette.

### Validate

Use the following steps to validate the user creation.

1. Have the user check their email for the invitation.

2. Have the user click on the link in the email to set their password.

3. Have the user log in to [Palette](https://console.spectrocloud.com) using their email address and the password they
   set. If you are using self-hosted Palette or VerteX, use the URL provided by your system administrator.

## User Deletion

Use the following steps to delete a user in Palette.

### Prerequisites

- Tenant admin access with the `user.create` permission.

- Name and email address of the user you want to create.

- If you are using self-hosted Palette or VerteX, ensure you have configured Simple Mail Transfer Protocol (SMTP)
  settings to send email invitations to the user. You can configure SMTP settings in the self-hosted Palette system
  console.

### Delete a User

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Navigate to the left **Main Menu** and click on **Tenant Settings**.

3. Click on **Users & Teams**.

4. Select the **Users** tab.

5. Click on the row of the user you want to delete.

6. Click on the **Delete User** button.

7. Click **OK** to confirm the deletion.

The user is now removed from the tenant and all associated teams and projects.

### Validate

Use the following steps to validate the user deletion.

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Navigate to the left **Main Menu** and click on **Tenant Settings**.

3. Click on **Users & Teams**.

4. Select the **Users** tab.

5. Verify that the user you deleted is no longer listed in the users list.

## Password Reset

Use the following steps to reset a user's password in Palette.

### Prerequisites

- Tenant admin access with the `user.update` permission.

- If you are using self-hosted Palette or VerteX, ensure you have configured Simple Mail Transfer Protocol (SMTP)
  settings to send email invitations to the user. You can configure SMTP settings in the self-hosted Palette system
  console.

### Reset Password

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Navigate to the left **Main Menu** and click on **Tenant Settings**.

3. Click on **Users & Teams**.

4. Select the **Users** tab.

5. Click on the row of the user whose password you want to reset.

6. Click on the **Reset password** button.

7. Click **OK** to confirm the password reset.

An email is sent to the user with a link to set a new password.

### Validate

Use the following steps to validate the password reset.

1. Have the user check their email for the password reset link.

2. Have the user click on the link in the email to set their new password.

3. Have the user log in to [Palette](https://console.spectrocloud.com) using their email address and the new password
   they set. If you are using self-hosted Palette or VerteX, use the URL provided by your system administrator.
