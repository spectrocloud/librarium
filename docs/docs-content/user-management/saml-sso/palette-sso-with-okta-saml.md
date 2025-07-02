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

- For Okta SAML to work correctly with Palette, you must enable
  [HTTPS](../../../enterprise-version/system-management/ssl-certificate-management#enablement) and configure TLS.

- A free or paid subscription with Okta. Okta provides free
  [developer subscriptions](https://developer.okta.com/signup/) for testing purposes.

## Enablement

### Create Teams in Palette

This step is to create teams in Palette that will be used for Okta SAML, and will give them the appropriate permissions.
For this example, you will create the `Okta Team` team and give it **Tenant Admin** permissions. You can repeat this for
any other team that you configured with group claims.

1.  Open a web browser and log in to your [Palette](https://console.spectrocloud.com/) subscription.

2.  Navigate to left **Main Menu** and select **Tenant Settings**.

3.  From the left **Tenant Menu**, select **Users & Teams**.

4.  Click the **Teams** tab, and click on **+ Create Team**.

    ![Create Palette Team](/palette-sso-with-adfs-images/how-to_palette-sso-with-adfs_create-team.webp)

5.  Specify `Okta Team` in the **Team name** field. You don't need to set any members now, as this will happen
    automatically from the SSO. Click **Confirm** to create the team.

    ![Name Palette Team](/palette-sso-with-adfs-images/how-to_palette-sso-with-adfs_name-team.webp)

6.  You will receive a message stating that the team has been created successfully. Select the newly created **Okta
    Team** team to review its details. To give this team administrative access to the entire tenant and all the projects
    in it, assign the **Tenant Admin** role. Select the **Tenant Roles** tab and click **+ Add Tenant Role**.

    ![Palette Tenant Roles](/palette-sso-with-adfs-images/how-to_palette-sso-with-adfs_tenant-roles.webp)

7.  Select **Tenant Admin** to enable the role. Click **Confirm** to add the role.

    ![Add Tenant Role](/palette-sso-with-adfs-images/how-to_palette-sso-with-adfs_add-tenant-role.webp)

    You will receive a message stating **Roles have been updated**. Repeat this procedure for any other teams, taking
    care to ensure they are given the appropriate permissions.

8.  Click the **X** next to **Team Details** in the top left corner to exit this screen.

### Create the Okta Application

9. Log in to your Okta Admin console and navigate to **Applications** --> **Applications**. Click the **Create App
   Integration** button.

   :::info

   Your Okta login URL follows the format `https://{your-okta-account-id}-admin.okta.com/admin/getting-started`. Replace
   `{your-okta-account-id}` with your Okta account ID.

   :::

10. In the screen that opens, select **Create App Integration**.

    ![Create Okta Application](/saml-okta-images/user-management_saml-sso_palette-sso-with-okta-saml_create-application.webp)

11. Select **SAML 2.0** and click **Next**.

    ![Configure Okta General Settings](/saml-okta-images/user-management_saml-sso_palette-sso-with-okta-saml_app_integration.webp)

12. On the **General Settings** page, enter **App name** field, enter `Spectro Cloud Palette SAML` in the **App name**
    box. If desired, you can also upload a logo for the application.

13. Open a web browser and navigate to your [Palette](https://console.spectrocloud.com/). Navigate to **Tenant
    Settings** --> **SSO** and click **SAML**. Click the button next to **Login URL** to copy the value to the
    clipboard.

14. Set the value of **Service** to **Okta**.

    ![Configure Okta General Settings on Palette](/saml-okta-images/user-management_saml-sso_palette-sso-with-okta-saml_palette-okta-setting.webp)

15. Return to your Okta Admin page. Paste the **Login URL** into the **Single sign-on URL** and **Audience URI (SP
    Entity ID)** locations.

    ![Configure Okta General Settings](/saml-okta-images/user-management_saml-sso_palette-sso-with-okta-saml_general-settings.webp)

16. Navigate to **Attribute Statements (Optional)**, and enter the the following values.

    | Name        | Name Format   | Value            |
    | ----------- | ------------- | ---------------- |
    | `FirstName` | `Unspecified` | `user.firstName` |
    | `LastName`  | `Unspecified` | `user.lastName`  |
    | `Email`     | `Unspecified` | `user.email`     |

17. Under **Group Attribute Statements (Optional)** specify the below values.

    | Name          | Name Format   | Filter          | Value |
    | ------------- | ------------- | --------------- | ----- |
    | `SpectroTeam` | `Unspecified` | `Matches Regex` | Blank |

    ![Configure Attribute Statements](/saml-okta-images/user-management_saml-sso_palette-sso-with-okta-saml_attribute-statements.webp)

18. Click **Next** and click **Finish**.

19. On the **Sign On** page, click the copy **Copy** under **Metadata URL**.

![Copy Okta SAML Metadata](/saml-okta-images/user-management_saml-sso_palette-sso-with-okta-saml_metadata-url.webp)

20. Open a new browser tab and paste the URL in the browser URI box. Copy the contents of the XML.

![Copy Okta Metadata XML](/saml-okta-images/user-management_saml-sso_palette-sso-with-okta-saml_metadata-xml.webp)

21. Go back to Palette SSO settings then paste the contents of the Okta SAML Metadata into **Identity Provider
    Metadata**.

    ![Paste Metadata in Palette SSO Manager](/saml-okta-images/user-management_saml-sso_palette-sso-with-okta-saml_palette-manage-sso-okta-saml_meta_data.webp)

22. Under **Default Teams**, search for and select **Okta Team**. This connects all Okta users with the team and the
    team permissions set earlier.

23. When all the information has been entered, click **Save** to activate SSO. You will receive a message stating SAML
    configured successfully.

## Validate

1. Log in to Palette through SSO as an Okta user who is a member of the Okta application to verify SSO. If you are still
   logged into Palette with a non-SSO user, log out by selecting **Logout** in the **User Menu** at the top right.

   ![User Logout](/oidc-okta-images/oidc-okta_user-logout.webp)

2. The Palette login screen now displays a **Sign in** button and no longer presents a username and password field.
   Below the **Sign In** button, there is an **SSO issues? --> Use your password** link. This link can be used to bypass
   SSO and log in with a local Palette account in case there is an issue with SSO and you need to access Palette without
   SSO. Click on the **Sign in** button to log in via SSO.

   ![User SSO Login](/oidc-okta-images/oidc-okta_palette-login.webp)

3. If this is the first time you are logging in with SSO, you will be redirected to the Okta login page. Depending on
   your organization's SSO settings, this could be a simple login form or require MFA (Multi-Factor Authentication).

4. You are now automatically added to the `Okta Team` team in Palette. To verify, navigate to the left **Main Menu**,
   and select **Tenant Settings**
5. Select **Users & Teams**, and click **Teams** tab. Select on the **Okta Team** team and view the team members
   section.

## Resources

- [Okta Workforce Identity Cloud](https://www.okta.com/products/single-sign-on/)

- [Palette User Management](../user-management.md)

- [Palette SSO](saml-sso.md)
