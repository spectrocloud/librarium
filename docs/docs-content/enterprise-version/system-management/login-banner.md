---
sidebar_label: "Login Banner"
title: "Login Banner"
description: "Learn how to add an ATO banner in Palette."
icon: ""
hide_table_of_contents: false
sidebar_position: 100
tags: ["enterprise", "management", "ato"]
keywords: ["self-hosted", "enterprise", "ato"]
---

Palette allows you to add a Login banner, also known as an Authority to Operate (ATO) banner or System Message, to the
login page. This banner can display important information to users before they log in to the system console or to an
individual tenant.

:::warning

Setting a login banner at the system console will override any tenant-specific login banners configured. Refer to the
[Tenant Login Banner](../../tenant-settings/login-banner.md) guide to learn more about tenant-specific login banners.

:::

Use the following steps to add a login banner to the Palette login page.

## Prerequisites

- Access to the Palette [system console](../system-management/system-management.md#access-the-system-console)
- System administrator permissions, either a Root Administrator or Operations Administrator. Refer to the
  [System Administrators](../system-management/account-management/account-management.md#system-administrators) page to
  learn more about system administrator roles.

## Setup Login Banner

1. Log in to the Palette system console. Refer to the
   [Access System Console](../system-management/system-management.md#access-the-system-console) guide for more
   information.

2. From the left **Main Menu**, select **Administration**.

3. Select the **ATO Message** tab, and toggle the **Display Login Banner** switch to enable the login banner.

4. Fill out the **Login Banner Title** and **Login Banner Message** fields with the desired content.

5. Click **Save** to apply the changes.

## Validate

1. Log out of the Palette system console.

2. Visit the Palette system console login page.

3. The Login banner is displayed before you are prompted to log in.
