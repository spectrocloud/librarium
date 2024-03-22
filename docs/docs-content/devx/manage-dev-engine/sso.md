---
sidebar_label: "Manage Single Sign-On (SSO)"
title: "Manage Single Sign-On (SSO)"
description: "Learn how to configure SSO for Palette Dev Engine."
icon: ""
hide_table_of_contents: false
sidebar_position: 20
tags: ["devx", "app mode", "pde"]
---

Palette supports the ability to use Single Sign-On (SSO) and third-party Social Sign-In Providers, such as Google and
GitHub. Use the following steps to either enable or disable the feature.

## Enable SSO

To enable SSO with third-party Social Sign-In Providers use the following steps.

:::info

To learn more about the Sign-In Flow, refer to the
[User Authentication](../../user-management/user-authentication.md#sign-in-flow) documentation.

:::

### Prerequisites

- Palette Tenant Administrator access.

### Enable SSO

1. Log in to [Palette](https://console.spectrocloud.com) as a Tenant Admin.

2. Navigate to the left **Main Menu**, select **Tenant Settings**, and select **SSO**.

3. Next, click the **Auth Providers** tab and toggle the **Enable Provider Login** button on.

![The Auth providers tenant settings page with an arrow toward the toggle button.](/devx_manage-dev-engine_sso_display-oidc-page.webp)

4. Select one of the supported Social Sign-In providers, and confirm your change.

### Validate

You can validate SSO is enabled by attempting to log into your Palette tenant through SSO. Select the third-party
provider you enabled for SSO.

![Palette's login view with the SSO providers highlighted.](/devx_manage-dev-engine_sso_palette-login-view.webp)

## Disable SSO

Palette provides the flexibility to disable SSO to restrict this capability. Use the following steps to disable SSO for
Palette.

### Prerequisites

- Palette Tenant Administrator access.

### Disable Steps

1. Log in to [Palette](https://console.spectrocloud.com) as a Tenant Admin.

2. Navigate to the left **Main Menu**, select **Tenant Settings**, and select **SSO**.

3. Next, click the **Auth Providers** tab and toggle the **Enable Provider Login** button off.

4. Log out of Palette.

### Validate

You can validate SSO is disabled by attempting to log into your Palette tenant through SSO. Any SSO attempts will fail
due to SSO being disabled at the tenant level.
