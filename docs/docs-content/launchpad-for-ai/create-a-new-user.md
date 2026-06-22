---
sidebar_label: "Create a User"
title: "Create a User"
description:
  "How to create a user account in the Launchpad for AI Console, assign a role, and verify the user can sign in."
hide_table_of_contents: false
sidebar_position: 20
tags: ["launchpad-for-ai", "how-to"]
keywords: ["launchpad", "ai", "user", "create user", "role", "rbac", "operator", "auditor", "tenant-admin"]
---

This guide explains how to create a user account in the Launchpad for AI Console, assign a role, and verify the new user
can sign in.

## Prerequisites

- A running Launchpad for AI appliance with access to the Console.
- An account with the `operator` role. Only operators can create users. Auditors and tenant-admins cannot.
- If creating a `tenant-admin` user, an existing tenant to bind the account to. A `tenant-admin` cannot be created
  without one.

## Create a User

1. Sign in to the Console with an account that has the `operator` role.

   <!-- PLACEHOLDER:  What is the Console URL or host used to reach the appliance UI? -->

2. Go to the **Users** page.

   <!-- PLACEHOLDER: What is the exact navigation path or menu label to reach the Users page in the Console? -->

3. In the **Create user** form, enter a **username**.

4. Select a **role** for the user: `operator`, `auditor`, or `tenant-admin`. For a description of each role, refer to
   [User Roles](./user-roles.md).

5. (Optional) If you selected `tenant-admin`, bind the user to an existing tenant. The role is scoped to that tenant.

6. Enter an initial **password** for the user.

7. Select **Create user**, review the summary of the change, and then select **Confirm** to apply.

   :::warning

   Copy the password now. It is shown exactly once. The appliance stores only a PBKDF2 hash of the password and never
   displays it again. Hand the password to the user over a trusted channel. The user can change it after they sign in.

   :::

## Verify the User

1. Confirm the new account appears in the **Users** list with the expected username and role.

2. Ask the user to sign in to the Console with their username and the password you provided. After the first sign-in,
   the user can change their own password.

3. Confirm the user has role-appropriate access:

   - An `operator` can change settings on the box.
   - An `auditor` can view settings but cannot change them.
   - A `tenant-admin` can manage governance only within its bound tenant.

## Next Steps

- To deploy the appliance and run your first inference query, refer to [Get Started](./get-started.md).
