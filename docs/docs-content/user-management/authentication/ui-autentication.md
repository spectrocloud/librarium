---
sidebar_label: "User Interface Authentication"
title: "User Authentication"
description: "Learn about User Interface authentication method in Palette."
icon: ""
hide_table_of_contents: false
sidebar_position: 20
tags: ["user-management", "authentication", "user-interface"]
---

You can log into Palette SaaS platform by visiting the console URL at
[https://console.spectrocloud.com](https://console.spectrocloud.com). If you are a user of a self-hosted Palette or
Palette VerteX, then you should use the URL provided by your system administrator, such as `palette.abc-company.com.`

The Palette UI authentication method is the default authentication method for Palette. You can use the UI to sign up for
a Palette account or sign in to an existing account. You can also use the UI to sign in to Palette using a third-party
identity provider, such as GitHub or Google.

## Account Sign Up

To sign up for a Palette account, ask you Palette tenant administrator to send you an invitation email. Check out the
[Create and Manage a User](../users-and-teams/create-user.md) guide for more information.

## Sign In Flow

If you created your user with a username and password, then you may be prompted to select the tenant you wish to log in
to. If you are a member of a single tenant, then you will not be prompted for a tenant selection.

If you created an account through SSO and are a member of different tenant, then you must first select the tenant name
you wish to log in to. Click on the **Sign in to your tenant** button for the option to specify the tenant name.

:::info

If you are a self-hosted Palette user, use the custom Palette URL for an optimized login experience and avoid specifying
the tenant name. Ask your Palette system administrator for the custom Palette URL.

:::

## Switch Tenant

If you are a member of multiple tenants, you can switch between tenants in Palette without logging out. Check out the
[Switch Tenant](./switch-tenant.md) guide for more information.
