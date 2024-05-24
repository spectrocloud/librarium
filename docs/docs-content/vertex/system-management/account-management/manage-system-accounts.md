---
sidebar_label: "Create and Manage System Accounts"
title: "Create and Manage System Accounts"
description: "Learn how to create and manage system accounts in Palette VerteX."
icon: ""
hide_table_of_contents: false
sidebar_position: 10
tags: ["vertex", "management", "account"]
keywords: ["self-hosted", "vertex"]
---

You can create and manage system accounts if you have the Root Administrator or Account Administrator role in Palette
VerteX. These accounts are used to access the system console and perform various operations based on the assigned role

![A view of the admin user dashboard](/vertex_account-management_manage-system-accounts_user-dashboard.webp)

Check out the following sections to learn more about the supported system administrator management workflows.

## Create System Accounts

Use the following steps to create a new system account.

### Prerequisites

- Access to the Palette VerteX system console.

- The role of Root Administrator or Account Administrator.

### Create a System Account

1. Log in to the Palette VerteX system console. Refer to
   [Access the System Console](../system-management.md#access-the-system-console) guide for guidance on how to access
   the system console.

2. From the left **Main Menu** select **Account Management**.

3. Click **Create Admin**.

4. Fill in the following fields. Refer to the table below for more information about each field.

   | Field        | Description                                                                                                                                                                                                                       |
   | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | First Name   | The first name of the user.                                                                                                                                                                                                       |
   | Last Name    | The last name of the user.                                                                                                                                                                                                        |
   | Email        | The email address of the user.                                                                                                                                                                                                    |
   | Account Type | The type of account to create. Choose from **Operations Administrator**, or **Account Administrator**. Refer to the [System Administrators](./account-management.md#system-administrators) section to learn more about each role. |

5. Click **Create** to save the new system account.

6. A message appears confirming the new system account has been created. The message contains an activation URL you can
   share with the new user to activate their account. The new user will be prompted to set a password upon activation.

   :::warning

   The activation URL is valid for 24 hours. If the user does not activate their account within 24 hours, you will need
   to create a new account for the user.

   :::

7. Click on **Copy link & close** to copy the activation URL to your clipboard and close the message.

### Validate

Use the following steps to validate the new system account.

1. Share the activation URL with the new user and ask them to activate their account.

2. Log in to the Palette VerteX system console. Refer to
   [Access the System Console](../system-management.md#access-the-system-console) guide for guidance on how to access
   the system console.

3. From the left **Main Menu** select **Account Management**.

4. Verify the new system administrator account is listed in the table. Once the new user has activated their account,
   the **Status** column will display **Active**.

## Remove System Accounts

Use the following steps to remove a system account.

### Prerequisites

- Access to the Palette VerteX system console.

- The role of Root Administrator or Account Administrator.

- You cannot remove the account you are currently logged in with. Use another system account to remove the account you
  want to remove.

### Remove a System Account

1. Log in to the Palette VerteX system console. Refer to
   [Access the System Console](../system-management.md#access-the-system-console) guide for guidance on how to access
   the system console.

2. From the left **Main Menu** select **Account Management**.

3. Locate the system account you want to remove in the table and click on the **three-dot Menu** icon at the end of the
   row.

4. Click **Delete**.

5. A confirmation dialog appears. Check the box to confirm you want to delete the system account and click **Delete**.

6. A message appears confirming the system account has been deleted.

### Validate

Use the following steps to validate the system account has been removed.

1. Log in to the Palette VerteX system console. Refer to
   [Access the System Console](../system-management.md#access-the-system-console) guide for guidance on how to access
   the system console.

2. From the left **Main Menu** select **Account Management**.

3. Verify the system account has been removed from the table.

## Reset System Administrator Password

Use the following steps to reset the password of a system administrator.

### Limitations

- You cannot use this feature to reset the password of the account you are currently logged in with. Use the normal
  [password change workflow](./credentials.md#change-password) to reset the password of the account you are currently
  logged in with.

- You cannot reset the password of the Root Administrator account using this feature. Log in as the Root Administrator
  to reset the password by following the [password change workflow](./credentials.md#change-password).

### Prerequisites

- Access to the Palette VerteX system console.

- The role of Root Administrator or Account Administrator.

### Reset Password

1. Log in to the Palette VerteX system console. Refer to
   [Access the System Console](../system-management.md#access-the-system-console) guide for guidance on how to access
   the system console.

2. From the left **Main Menu** select **Account Management**.

3. Locate the system account you want to reset the password for in the table and click on the **three-dot Menu** icon at
   the end of the row.

4. Click **Password Reset Link**.

5. A message containing the password reset link appears. The message includes a password reset URL that you can share
   with the user to reset their password. Upon visiting the URL, the user will be prompted to set a new password.

   :::warning

   The password reset URL is valid for 24 hours. If the user does not reset their password within 24 hours, you must
   generate a new password reset link. The current password will remain unchanged until the user sets a new password

   :::

6. Click on **Copy link & close** to copy the password reset URL to your clipboard and close the message.

### Validate

Ask the user to visit the password reset URL and set a new password. Ask the user to log in to the system console using
the new credentials to ensure the password has been reset successfully.
