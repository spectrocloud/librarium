---
sidebar_label: "User Interface Authentication"
title: "User Authentication"
description: "Learn about User Interface authentication method in Palette."
icon: ""
hide_table_of_contents: false
sidebar_position: 10
tags: ["user-management", "authentication", "user-interface"]
---

You can log into Palette SaaS platform by visiting the console URL at
[https://console.spectrocloud.com](https://console.spectrocloud.com). If you are a user of a self-hosted Palette or
Palette VerteX, then you should use the URL provided by your system administrator, such as `palette.abc-company.com.`

The Palette UI authentication method is the default authentication method for Palette. You can use the UI to sign up for
a Palette account or sign in to an existing account. You can also use the UI to sign in to Palette using a third-party
identity provider, such as GitHub or Google.

## Account Sign Up

You can sign up for a Palette SaaS account by visiting [Palette](https://console.spectrocloud.com) or an Enterprise
Palette account under your organization by using your organization's custom Palette URL.

When you create an account, you can create a username and password or create the account through a third-party identity
provider, GitHub, Google, or other OIDC providers that are enabled for your organization. For Palette SaaS, GitHub and
Google are automatically enabled for SSO integration.

## Sign In Flow

Starting with Palette 3.2, the user sign-in flow can be different depending on how you created your Palette account. If
you created your user with a username and password, then you may be prompted to select the organization you wish to log
in to. If you are a member of a single organization, then you will not be prompted for an organization selection.

If you created an account through SSO and are a member of different organizations, then you must first select the
organization name you wish to log in to. Click on the **Sign in to your organization** button for the option to specify
the organization name. If you need help remembering the organization name, click on the **Forgot your organization
name?** button and provide your email address to receive an email containing your organization name and its login URL.

<br />

:::info

If you are a Palette Enterprise user, use the custom Palette URL for an optimized login experience and avoid specifying
the organization name. Ask your Palette system administrator for the custom Palette URL.

:::
