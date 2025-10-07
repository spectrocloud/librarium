---
sidebar_label: "Password Policy"
title: "Password Policy"
description: "Learn how to configure the password policy for your Palette tenant."
icon: ""
hide_table_of_contents: false
sidebar_position: 50
tags: ["tenant-administration", "security", "password"]
---

Tenant administrators can update the password policy for Palette users. The default password policy is as follows.

- The password must be at least six characters long.
- The password must be at most 64 characters long.
- The password expires after 365 days.
- The password must contain at least one uppercase letter.
- The password must contain at least one lowercase letter.
- The password must contain at least one digit.
- The password must contain at least one special character.

If you want to change the default password policy, follow the steps below.

## Prerequisites

- Palette tenant admin access.

## Update Password Policy

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Navigate to the left main menu and select **Tenant Settings**.

3. From the **Tenant Settings Menu**, select **Password Policy**.

4. Set up the password policy using the configuration fields.

   | **Configuration**                    | **Description**                                                                                                                             |
   | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Enable Regex**                     | Enable if you want to specify the password policy using a regular expression.                                                               |
   | **Regex**                            | Specify a regular expression that the passwords must conform to.                                                                            |
   | **Expiry Duration**                  | Set a password expiry time. Select from **3 months**, **6 months**, and **Custom**.                                                          |
   | **Expiry Duration (Days)**           | If you have selected **Custom** expiry duration, specify a number of days for password expiry.                                                  |
   | **First Reminder (Days)**            | Specify when to send out a password expiry reminder email to users.                                                                         |
   | **Min Length**                       | Specify the minimum length of the password. The configured value must be between 6 and 128 and should not exceed the **Max Length**.        |
   | **Max Length**                       | Specify the maximum length of the password. The configured value must be between 6 and 128 and should not be less than then **Min Length**. |
   | **Min Number Of Block Letters**      | Specify the minimum number of uppercase letters in the password. The configured value must be larger than 1.                                |
   | **Min Number Of Digits**             | Specify the minimum number of digits in the password. The configured value must be larger than 1.                                           |
   | **Min Number Of Small Letters**      | Specify the minimum number of lowercase letters in the password. The configured value must be larger than 1.                                |
   | **Min Number Of Special Characters** | Specify the minimum number of special characters in the password. The configured value must be larger than 1.                               |

5. Click on **Save** to apply the changes.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Navigate to your username and select **My Profile**.

3. Enter a new password in the **New Password** field. You can test the password policy with different values. For
   example, you can enter an all lowercase password to ensure that the configured number of uppercase characters is
   enforced.
