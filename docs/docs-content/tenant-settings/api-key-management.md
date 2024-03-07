---
sidebar_label: "API Key Management"
title: "API Key Management"
description: "Learn how to set a login banner for your Palette tenant."
icon: ""
hide_table_of_contents: false
sidebar_position: 0
tags: ["tenant-administration", "authentication", "api-key"]
---

You can manage API keys for your Palette tenant. API keys are used to authenticate API requests to Palette. You can
create, edit, revoke, and delete API keys for your tenant.

Unlike user accounts, tenant administrators can view all API keys created for the tenant. Users are limited to actions
for their own API keys.

The following table describes the API key management tasks you can perform as a tenant administrator, and how they
differ from users.

| **Action**          | **Description**                                   | **Tenant Admin** | **User** |
| ------------------- | ------------------------------------------------- | ---------------- | -------- |
| **List**            | List all API keys in the tenant.                  | ✅               | ❌       |
| **Create**          | Create a new API key.                             | ✅               | ✅       |
| **Create for User** | Create a new API key for a different user.        | ✅               | ❌       |
| **Edit**            | Edit an existing API key.                         | ✅               | ✅       |
| **Revoke**          | Revoke an existing API key.                       | ✅               | ✅       |
| **Delete**          | Delete an existing API key.                       | ✅               | ✅       |
| **Reassign**        | Reassign an existing API key to a different user. | ❌               | ❌       |
| **View**            | View the sensitive API key value.                 | ❌               | ❌       |

:::warning

Once an API key is created, the API key value is only displayed once. You must save the API key value in a secure
location, such as a password manager. If you or a user lose the API key value, a new API key must be created.

:::

Use the guides listed in [Resources](#resources) section to learn more about each individual API key management task.
Each guide contains a section for tenant administrators and non-tenant users.

## Resources

- [Create API Key](../user-management/authentication/api-key/create-api-key.md)

- [Edit API Key](../user-management/authentication/api-key/modify-api-key.md)

- [Revoke API Key](../user-management/authentication/api-key/revoke-api-key.md)

- [Delete API Key](../user-management/authentication/api-key/delete-api-key.md)
