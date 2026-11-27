---
sidebar_label: "Session Timeout"
title: "Session Timeout"
description: "Learn how to set the session timeout for your Palette tenant."
icon: ""
hide_table_of_contents: false
sidebar_position: 40
tags: ["tenant-administration", "session-timeout"]
---

Tenant administrators can set and update the session timeout for Palette users. The session timeout determines the
maximum time of inactivity before a user is automatically logged out of Palette. The session timeout is set at the
tenant level and applies to all users in the tenant. The default session timeout is 240 minutes (four hours), and you
can set a value from 15 to 1,440 minutes. To change the default session timeout, follow the steps in
[Update Session Timeout](#update-session-timeout).

The session timeout also sets the lifetime of the
[authorization tokens](../user-management/authentication/authorization-token.md) that Palette issues to tenant users,
whether they sign in to the Palette UI or authenticate through the API. While a user is active in the Palette UI,
Palette renews their token automatically. API clients must refresh their token before it expires. Refer to
[Refresh Authorization Token](../user-management/authentication/authorization-token.md#refresh-authorization-token).

## Prerequisites

- Palette tenant admin access.

## Update Session Timeout

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Navigate to the left **Main Menu** and select **Tenant Settings**.

3. From the **Tenant Settings Menu**, select **Platform Settings**.

4. Navigate to the **Session Timeout** section.

5. Update the input field in minutes to the desired session timeout value.

6. Click on **Apply** to save the changes.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Wait for the session timeout duration. You will be automatically logged out of Palette after the session timeout
   duration has elapsed.
