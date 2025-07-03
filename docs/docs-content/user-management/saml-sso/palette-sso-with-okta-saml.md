---
sidebar_label: "Palette SSO with Okta SAML"
title: "Enable SSO with Okta SAML"
description: "Set up Palette SSO with Okta SAML"
icon: ""
hide_table_of_contents: false
sidebar_position: 30
hiddenFromNav: false
tags: ["user-management", "saml-sso", "okta"]
---

Single Sign-On (SSO) is an authentication method that enables users to log in to multiple applications and websites with
one set of credentials. SSO uses certificates to establish and maintain a trust relationship between the Service
Provider (SP) and an Identity Provider (IdP). Palette supports SSO based on either the Security Assertion Markup
Language (SAML) or OpenID Connect (OIDC).

The following steps will guide you on how to enable Palette SSO with
[Okta Workforce Identity Cloud](https://www.okta.com/products/single-sign-on/) based on SAML.

## Prerequisites

- For Okta SAML to work correctly with Self-Hosted Palette, you must enable
  [HTTPS](../../../enterprise-version/system-management/ssl-certificate-management#enablement) and configure TLS. If you
  are using Palette SaaS, HTTPS and TLS are already enabled.

- A free or paid subscription with Okta. Okta provides free
  [developer subscriptions](https://developer.okta.com/signup/) for testing purposes.

## Enablement

### Create Teams in Palette

Follow this guide to create teams in Palette that will be used for Okta SAML and give them the appropriate permissions.
In this example, you will create an `Okta Team` and give the team **Tenant Admin** permissions. You can repeat this
process for any other team with group claims.

1.  Log in to [Palette](https://console.spectrocloud.com/) as a tenant admin.

2.  From the left main menu, select **Users & Teams**.

3.  Navigate to the **Teams** tab and select **Create Team**.

    ![Create Palette Team](/palette-sso-with-adfs-images/how-to_palette-sso-with-adfs_create-team.webp)

4.  Enter `Okta Team` for the **Team name**. You do not need to add any members, as members will be added automatically
    with SSO. Select **Confirm** to create the team.

    ![Name Palette Team](/palette-sso-with-adfs-images/how-to_palette-sso-with-adfs_name-team.webp)

5.  A message states that the team was created. Select the newly created `Okta Team` to review the team's details.
6.  To give the team administrative access to the entire tenant and all projects within the tenant, select the **Tenant
    Roles** tab and click **Add Tenant Role**.

    ![Palette Tenant Roles](/palette-sso-with-adfs-images/how-to_palette-sso-with-adfs_tenant-roles.webp)

7.  In the **Add Roles** dialog, select **Tenant Admin**. Click **Confirm** to add the role.

    ![Add Tenant Role](/palette-sso-with-adfs-images/how-to_palette-sso-with-adfs_add-tenant-role.webp)

    A message states that **Roles have been updated**. Repeat this procedure for any other necessary teams, taking care
    to ensure they are given the appropriate permissions.

### Create the Okta Application

1. Open a new browser tab and log in to your Okta Admin console.

   :::info

   Your Okta login URL follows the format `https://<your-okta-account-id>-admin.okta.com/admin/getting-started`. Replace
   `<your-okta-account-id>` with your Okta account ID.

   :::

2. Navigate to **Applications > Applications**, and select **Create App Integration**.

   ![Create Okta Application](/saml-okta-images/user-management_saml-sso_palette-sso-with-okta-saml_create-application.webp)

3. Select **SAML 2.0** and click **Next**.

   ![Configure Okta General Settings](/saml-okta-images/user-management_saml-sso_palette-sso-with-okta-saml_app_integration.webp)

4. On the **General Settings** page, enter `Spectro Cloud Palette SAML` for the **App name**. If desired, upload a logo
   for the application.

5. Return to [Palette](https://console.spectrocloud.com/). If you have been logged out, sign in again as a tenant admin.

6. From the left main menu, select **Tenant Settings**.

7. On the **Tenant Settings Menu**, select **SSO**, and choose an **SSO Auth type** of **SAML**.

8. From the **Service** drop-down, select **Okta**.

   ![Configure Okta General Settings on Palette](/saml-okta-images/user-management_saml-sso_palette-sso-with-okta-saml_palette-okta-setting.webp)

9. Scroll to the **Login URL** field and select the clipboard icon to copy the URL.

10. Return to your Okta Admin page. Paste the **Login URL** into the **Single sign-on URL** and **Audience URI (SP
    Entity ID)** fields.

    ![Configure Okta General Settings](/saml-okta-images/user-management_saml-sso_palette-sso-with-okta-saml_general-settings.webp)

11. Navigate to **Attribute Statements (Optional)** and enter the following values.

    | Name        | Name Format   | Value            |
    | ----------- | ------------- | ---------------- |
    | `FirstName` | `Unspecified` | `user.firstName` |
    | `LastName`  | `Unspecified` | `user.lastName`  |
    | `Email`     | `Unspecified` | `user.email`     |

12. Under **Group Attribute Statements (Optional)**, enter the below values.

    | Name          | Name Format   | Filter          | Value |
    | ------------- | ------------- | --------------- | ----- |
    | `SpectroTeam` | `Unspecified` | `Matches Regex` | Blank |

    ![Configure Attribute Statements](/saml-okta-images/user-management_saml-sso_palette-sso-with-okta-saml_attribute-statements.webp)

13. Select **Next**, then **Finish**.

14. On the **Sign On** tab of your Okta application, in the **SAML 2.0** section, select **Copy** beneath **Metadata
    URL**.

![Copy Okta SAML Metadata](/saml-okta-images/user-management_saml-sso_palette-sso-with-okta-saml_metadata-url.webp)

15. Open a new browser tab and paste the URL in the address bar. Copy the XML.

![Copy Okta Metadata XML](/saml-okta-images/user-management_saml-sso_palette-sso-with-okta-saml_metadata-xml.webp)

16. Return to Palette. On the **Manage SSO** page, paste the XML into the **Identity Provider Metadata** field.

    ![Paste Metadata in Palette SSO Manager](/saml-okta-images/user-management_saml-sso_palette-sso-with-okta-saml_palette-manage-sso-okta-saml_meta_data.webp)

17. In the **Default Teams** field, search for and select `Okta Team`. This connects all Okta users with the team and
    the team permissions set earlier.

18. **Save** your changes to activate SSO. You receive a message stating that SAML was configured successfully.

## Validate

1. Log in to Palette through SSO as an Okta user who is a member of the Okta application to verify SSO. If you are still
   logged into Palette with a non-SSO user, log out by selecting **Logout** in the **User Menu** at the top right.

   ![User Logout](/oidc-okta-images/oidc-okta_user-logout.webp)

2. The Palette login screen now displays a **Sign in** button and no longer presents a username and password field.
   Below the **Sign In** button, there is an **SSO issues? Use your password** link. This link can be used to bypass SSO
   and log in with a local Palette account in case there is an issue with SSO and you need to access Palette without
   SSO. Click on the **Sign in** button to log in via SSO.

   ![User SSO Login](/oidc-okta-images/oidc-okta_palette-login.webp)

3. If this is the first time you are logging in with SSO, you will be redirected to the Okta login page. Depending on
   your organization's SSO settings, this could be a simple login form or require MFA (Multi-Factor Authentication).

4. You are now automatically added to the `Okta Team` team in Palette. To verify, navigate to the left main menu, and
   select **Users & Teams**

5. Select the **Teams** tab and choose `Okta Team`. The list of **Team Members** is displayed on the left side of the
   **Team Details**.

## Resources

- [Okta Workforce Identity Cloud](https://www.okta.com/products/single-sign-on/)

- [Palette User Management](../user-management.md)

- [Palette SSO](saml-sso.md)
