---
sidebar_label: "Account Management"
title: "Account Management"
description: "Learn about the different types of system administrators in self-hosted Palette."
icon: ""
hide_table_of_contents: false
sidebar_position: 0
tags: ["self-hosted", "management", "account"]
keywords: ["self-hosted", "management", "account"]
---

Self-hosted Palette supports the ability to have multiple system administrators with different roles and permissions.
Use the different roles to separate the duties of system administrators.

:::info

Separation of duties addresses the potential for abuse of authorized privileges and helps to reduce the risk of
malevolent activity without collusion. Separation of duties is supported for management of self-hosted Palette for
system administrators using the system console by defining account administration roles that are separate from
operations roles.

:::

You can also manage and update your individual user settings, such as email address and credentials from the system
console.

## System Administrators

System administrators are users who have access to the system console and can perform various operations based on their
assigned role. VerteX supports the following system administrator roles:

- Root Administrator

- Operations Administrator

- Account Administrator

The following table outlines the high-level permissions for each system administrator role.

| Permission                                    | Root Administrator | Operations Administrator | Account Administrator | Description                                                                                                                                                                      |
| --------------------------------------------- | ------------------ | ------------------------ | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Create and manage other system administrators | :white_check_mark: | :x:                      | :white_check_mark:    | Create and manage system administrators and their settings. Refer to [Create and Manage System Accounts](./manage-system-accounts.md) to learn more.                             |
| Manage system settings                        | :white_check_mark: | :white_check_mark:       | :x:                   | View and modify system settings such as SMTP, pack registries, DNS, and more. Refer to the [System Management](../system-management.md) section and its resources to learn more. |
| Manage tenants                                | :white_check_mark: | :white_check_mark:       | :x:                   | Create and manage tenants.                                                                                                                                                       |

:::info

All system administrators can access the system console and change individual user settings, such as email address,
password and passkeys.

:::

Review the following sections to learn more about each role.

### Root Administrator

The root administrator has full access to the system and can perform all operations. The root administrator credentials
are used to log in to the [system console](../system-management.md#system-console) for the first time and must be
changed after the initial login. We recommend you create an account administrator and operations administrator to manage
the system upon initial login.

### Operations Administrator

The operations administrator has access to the system console and can perform all operations except for creating and
managing other system administrators. The operations administrator can create and manage tenants, manage system
settings, and manage the system's overall health and performance.

### Account Administrator

The account administrator has access to the system console and can only create and manage system administrator accounts
and their settings. System maintenance and tenant management are not available to the account administrator. Use
Operations Administrator to manage system settings and tenants.

To learn how to create and manage system administrator accounts, check out the
[Create and Manage System Accounts](./manage-system-accounts.md) guide.

## User Settings

As an admin user, you can update and manage your user settings, such as changing the email address and changing the
credentials. You can also enable passkey to access the admin panel. The passkey feature supports both virtual passkey
and physical passkey.
