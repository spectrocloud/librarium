---
sidebar_label: "Login Banner"
title: "Login Banner"
description: "Learn how to set a login banner for your Palette tenant."
icon: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["tenant-administration"]
---

You can set up a login banner message that all users must acknowledge and accept before they log in to Palette. The
message is limited to 1300 characters, and only plain text is supported.

<br />

:::warning

The login banner message is only accessible when users attempt to log in to Palette through the tenant URL. Using the
default Palette SaaS login URL of `https://console.spectrocloud.com` will not display the login banner message. Users of
self-hosted Palette use the tenant URL defined during the Palette installation.

Additionally, if you are using self-hosted Palette or VerteX and have a login banner configured at the system console,
the tenant login banner will not be displayed, as the system console login banner takes precedence. Refer to the
[System Login Banner](../self-hosted-setup/palette/system-management/login-banner.md) page to learn more about system
login banners.

:::

## Prerequisite

- Tenant admin access.

## Set Up Login Banner

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Navigate to the left **Main Menu** and select **Tenant Settings**.

3. Next, click on **Platform Settings** from the **Tenant Settings Menu**.

4. Toggle the **Display Login Banner** button.

5. Fill out the text box with the message you want all Palette users in your tenant to acknowledge before a login.

<br />

![A view of the tenant settings platform page with an example login banner message.](/tenant-settings_login-banner_settings-page-view.webp)

<br />

6. Select **Save Message** to save your changes.

<br />

## Validate

You can validate the banner message is set up correctly by using the following steps.

1. Log out of [Palette](https://console.spectrocloud.com).

2. From your web browser, navigate to the Palette tenant URL for your organization.

<br />

:::info

For Palette SaaS, the tenant URL is prefixed with your tenant name. For example, the tenant `spectrodocs` has the URL
`spectrodocs-spectrocloud.console.spectrocloud.com`. Users of self-hosted instances of Palette should use the tenant URL
defined during the Palette installation.

:::

3. Acknowledge the login banner message.

<br />

![A view of a tenant login banner message](/tenant-settings_login-banner_tenant-banner-view.webp)
