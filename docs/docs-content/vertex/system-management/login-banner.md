---
sidebar_label: "Banners"
title: "Banners"
description:
  "Learn how to add login and classification banners, also known as Authority to Operate (ATO) banners, in VerteX."
icon: ""
hide_table_of_contents: false
sidebar_position: 100
tags: ["vertex", "management", "ato", "banner"]
keywords: ["self-hosted", "vertex", "ato", "banner"]
---

VerteX allows you to add a Login banner, also known as an Authority to Operate (ATO) banner or System Message, to the
login page. This banner can display important information to users before they log in to the system console or to an
individual tenant.

:::warning

Setting a login banner at the system console will override any tenant-specific login banners configured. Refer to the
[Tenant Login Banner](../../tenant-settings/login-banner.md) guide to learn more about tenant-specific login banners.

:::

Use the following steps to add a login banner to the VerteX login page.

## Prerequisites

- Access to the VerteX [system console](../system-management/system-management.md#access-the-system-console)
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

1. Log out of the VerteX system console.

2. Visit the VerteX system console login page.

3. The Login banner is displayed before you are prompted to log in.
