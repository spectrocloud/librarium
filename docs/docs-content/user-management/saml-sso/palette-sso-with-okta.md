---
sidebar_label: "Palette SSO with Okta OIDC"
title: "Enable SSO with Okta OIDC"
description: "Set up Palette SSO with Okta OIDC"
icon: ""
hide_table_of_contents: false
sidebar_position: 30
hiddenFromNav: false
tags: ["user-management", "oidc-sso", "okta"]
---

Single Sign-On (SSO) is an authentication method that enables users to log in to multiple applications and websites with
one set of credentials. SSO uses certificates to establish and maintain a trust relationship between the Service
Provider (SP) and an Identity Provider (IdP). Palette supports SSO based on either the Security Assertion Markup
Language (SAML) or OpenID Connect (OIDC).

The following steps will guide you on how to enable Palette SSO with
[Okta Workforce Identity Cloud](https://www.okta.com/products/single-sign-on/) based on OIDC.

## Prerequisites

- For Okta OIDC to work correctly with Self-Hosted Palette, you must enable
  [HTTPS](../../../enterprise-version/system-management/ssl-certificate-management#enablement) and configure TLS. If you
  are using Palette SaaS, HTTPS and TLS are already enabled.

- A free or paid subscription with Okta. Okta provides free
  [developer subscriptions](https://developer.okta.com/signup/) for testing purposes.

- If you want to use the same Okta application for OIDC-based SSO for your Kubernetes cluster itself, you need to
  install [kubelogin](https://github.com/int128/kubelogin) on your local workstation to handle the retrieval of access
  tokens for your cluster.

- Palette requires the following claims to be present in the OIDC token:

  | Claim Name       | Default Value | Description                                            |
  | ---------------- | ------------- | ------------------------------------------------------ |
  | **Email**        | `email`       | The user's email address.                              |
  | **First Name**   | `given_name`  | The user's first name.                                 |
  | **Last Name**    | `family_name` | The user's last name.                                  |
  | **Spectro Team** | `groups`      | The user's group memberships in the Identity Provider. |

  Change the claim names in your IdP if they are different from the default values. If the OIDC token does not contain
  these claims, toggle the **Use userinfo endpoint** option in the OIDC configuration to allow Palette to fetch the
  missing claims from the user information endpoint.

## Okta with OIDC

### Create the Okta Application

1. Log in to your Okta Admin console and navigate to **Applications > Applications**. Select **Create App Integration**.

:::info

Your Okta login URL follows the format `https://<your-okta-account-id>-admin.okta.com/admin/getting-started`. Replace
`<your-okta-account-id>` with your Okta account ID.

:::

2. Select **OIDC - OpenID Connect** for the sign-in method and **Web Application** for the application type, then click **Next**.

3. On the **New Web App Integration** page, change the name from `My Web App` to `Spectro Cloud Palette OIDC`. Leave the
   **Grant type** set to its default value of **Authorization Code**.

   ![Configure General Settings](/oidc-okta-images/oidc-okta_okta-general-settings.webp)

4. Open a new browser tab and log in to [Palette](https://console.spectrocloud.com/) as a tenant admin.

5. From the left main menu, select **Tenant Settings**.

6. On the **Tenant Settings Menu**, select **SSO**, and choose an **SSO Auth type** of **OIDC**.

7. Scroll to the **Callback URL** field and select the clipboard icon to copy the URL.

   ![Copy Callback URL](/oidc-okta-images/oidc-okta_copy-callback-url.webp)

8. Return to your Okta Admin console and paste the copied value into the **Sign-in redirect URIs** field, replacing the
   existing value.

   ![Paste Redirect URI](/oidc-okta-images/oidc-okta_paste-redirect-uri.webp)

9. Return to [Palette](https://console.spectrocloud.com/). On the **Manage SSO** page, select the **Logout URL**
   clipboard icon to copy the URL.

10. Return to your Okta Admin console and paste the copied value into the **Sign-out redirect URIs** field.

![Paste Logout URI](/oidc-okta-images/oidc-okta_paste-logout-uri.webp)

:::tip

The sign-in and sign-out redirect URIs are required for SSO to work with Palette, but you can also add additional
redirect URIs. The URIs in the table below are useful when you want to use Okta for OIDC authentication into your
Kubernetes clusters.

| URL                                              | Type of Access                                               |
| ------------------------------------------------ | ------------------------------------------------------------ |
| `http://localhost:8000`                          | Using kubectl with the kube-login plugin from a workstation. |
| `https://<fqdn_of_k8s_dashboard>/oauth/callback` | Using OIDC authentication into Kubernetes Dashboard.         |

:::

11. Scroll down to the **Assignments** section and select **Allow everyone in your organization to access**. Leave the
    **Enable immediate access with Federation Broker Mode** option enabled and click **Save**.

![Configure the Assignments](/oidc-okta-images/oidc-okta_assignments.webp)

12. From the **General** tab of your Okta application, select the **Copy to clipboard** icon beside **Client ID** to
    copy the ID to your clipboard. Save this value, as you will need it later.

![Copy the Client ID](/oidc-okta-images/oidc-okta_copy-client-id.webp)

13. Select the **Copy to clipboard** icon beside **Client Secret** to copy the secret to your clipboard. Save this
    value, as you will need it later.

    ![Copy Shared Secret](/oidc-okta-images/oidc-okta_copy-shared-secret.webp)

### Create an Okta Authorization Server

To ensure Okta issues OIDC tokens with the correct claims, you must create a custom Authorization Server. A custom
Authorization Server is required to customize the authorization tokens issued by Okta so that they contain the necessary
OIDC claims required by Palette and Kubernetes.

1. From the left main menu of your Okta admin console, select **Security > API**.

2. On the **Authorization Servers** tab, select **Add Authorization Server**.

   ![Add Authorization Server](/oidc-okta-images/oidc-okta_add-authz-server.webp)

3. Enter a name for the server, for example, `Palette OIDC`. For the **Audience** field, paste the **Client ID** that
   you saved in step 12. Optionally, provide a description, and **Save** your changes.

   ![Name Authorization Server](/oidc-okta-images/oidc-okta_name-authz-server.webp)

4. Navigate to the **Claims** tab and select **Add Claim**.

   ![Add Claims](/oidc-okta-images/oidc-okta_add-claims.webp)

5. Create two claims using the information in the following table, with each row being one claim. Select **Create** to
   save each claim. claims in total. First, create two claims for the user information.

   | Claim Name     | Include in token type | Value Type | Value            | Disable claim | Include In |
   | -------------- | --------------------- | ---------- | ---------------- | ------------- | ---------- |
   | `u_first_name` | ID Token (Always)     | Expression | `user.firstName` | Unchecked     | Any scope  |
   | `u_last_name`  | ID Token (Always)     | Expression | `user.lastName`  | Unchecked     | Any scope  |

6. Next, create a claim for group membership. The example below includes the names of any groups that the Okta user is a
   member of that start with `palette-` in the `groups` claim of the ticket. For Palette SSO, Palette makes the user a
   member of a Palette team that has an identical name.

   | Claim Name | Include in token type | Value Type | Filter                  | Disable claim | Include In |
   | ---------- | --------------------- | ---------- | ----------------------- | ------------- | ---------- |
   | `groups`   | ID Token (Always)     | Groups     | Starts with: `palette-` | Unchecked     | Any scope  |

   ![Claims Result](/oidc-okta-images/oidc-okta_claims-result.webp)

7. At the top of the page, select the **Back to Authorization Servers** breadcrumb to return to your list of servers.

8. The authorization server you created is displayed in the list. Select the **Issuer URI** shown and copy it to the
   clipboard. Save this value, as you will need it later.

   ![Get Issuer URI](/oidc-okta-images/oidc-okta_get-issuer-uri.webp)

9. Select the Palette OIDC application and navigate to the **Access Policies** tab. Select **Add Policy**.

   ![Add Access Policy](/oidc-okta-images/oidc-okta_add-access-policy.webp)

10. Set the **Name** and **Description** fields to `Palette`, then change the **Assign to** option to **The following
    clients**. In the drop-down, search for the Okta application you created in step 3; in our example, we used
    `Spectro Cloud Palette OIDC`. Once selected, click **Create Policy**.

    ![Name Access Policy](/oidc-okta-images/oidc-okta_name-access-policy.webp)

11. Select **Add rule** to add a rule to this Access Policy.

    ![Add Policy Rule](/oidc-okta-images/oidc-okta_add-policy-rule.webp)

12. Set the **Rule Name** to `AuthCode` and deselect all **Core Grant** options except **Authorization Code**. When
    finished, select **Create Rule**.

    ![Configure Policy Rule](/oidc-okta-images/oidc-okta_configure-policy-rule.webp)

### Enable OIDC SSO in Palette

1. Return to [Palette](https://console.spectrocloud.com/). If you have been logged out, sign in again as a tenant admin.

2. From the left main menu, select **Tenant Settings**.

3. On the **Tenant Settings Menu**, select **SSO**, and choose an **SSO Auth type** of **OIDC**.

4. Enter the following OIDC information.

   | Parameter     | Value                                                                                                                                                                                                                          |
   | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | Issuer URL    | The Issuer URI that you saved in step 8 of [Create an Okta Authorization Server](#create-an-okta-authorization-server).                                                                                                        |
   | Client ID     | The client identifier that you saved in step 12 of [Create the Okta Application](#create-the-okta-application).                                                                                                                |
   | Client Secret | The shared secret that you generated in step 13 of [Create the Okta Application](#create-the-okta-application)..                                                                                                               |
   | Default Teams | Leave blank if you do not want users without group claims to be assigned to a default group. If you do, enter the desired default group name. If you use this option, be careful with how much access you assign to the group. |
   | Scopes        | Keep `openid`, `profile` and `email` as the default.                                                                                                                                                                           |
   | Email         | Keep `email` as the default.                                                                                                                                                                                                   |
   | First Name    | Set this to `u_first_name`.                                                                                                                                                                                                    |
   | Last Name     | Set this to `u_last_name`.                                                                                                                                                                                                     |
   | Spectro Team  | Keep `groups` as the default.                                                                                                                                                                                                  |

![Enable Palette OIDC SSO Part 1](/oidc-okta-images/oidc-okta_configure-palette-oidc-part1.webp)

![Enable Palette OIDC SSO Part 2](/oidc-okta-images/oidc-okta_configure-palette-oidc-part2.webp)

5. When all the information has been entered, click **Save** to activate SSO. You receive the message **OIDC configured
   successfully**.

### Create Teams in Palette

The final step is to create teams in Palette for the group that you will allow to be passed in the OIDC ticket in Okta
and give that group the appropriate permissions. For this example, you will create the `palette-tenant-admins` team and
give it **Tenant Admin** permissions. You can repeat this for any other team that you have a matching Okta group for.

1. Log in to [Palette](https://console.spectrocloud.com/) as a tenant admin.

2. From the left main menu, select **Users & Teams**.

3. Navigate to the **Teams** tab and select **Create Team**.

   ![Create Palette Team](/oidc-okta-images/oidc-okta_create-team.webp)

4. Enter `palette-tenant-admins` for the **Team name**. You do not need to add any members, as members will be added
   automatically with SSO. Select **Confirm** to create the team.

   ![Name Palette Team](/oidc-okta-images/oidc-okta_name-team.webp)

5. A message states that the team was created. Select the newly created `palette-tenant-admins` team to review the
   team's details.
6. To give the team administrative access to the entire tenant and all projects within the tenant, select the **Tenant
   Roles** tab and click **Add Tenant Role**.

   ![Palette Tenant Roles](/oidc-okta-images/oidc-okta_tenant-roles.webp)

7. In the **Add Roles** dialog, select **Tenant Admin**. Click **Confirm** to add the role.

   ![Add Tenant Role](/oidc-okta-images/oidc-okta_add-tenant-role.webp)

A message states that **Roles have been updated**. Repeat this procedure for any other necessary teams, taking care to
ensure they are given the appropriate permissions.

## Validate

1. Log in to Palette through SSO as a user that is a member of the `palette-tenant-admins` group in Okta to verify that
   users are automatically added to the `palette-tenant-admins` group in Palette. If you're still logged into Palette
   with a non-SSO user, log out by selecting **Logout** in the **User Drop-down Menu** at the top right.

   ![User Logout](/oidc-okta-images/oidc-okta_user-logout.webp)

2. The Palette login screen now displays a **Sign in** button and no longer presents a username and password field.
   Below the **Sign In** button, there is an **SSO issues? Use your password** link. This link can be used to bypass SSO
   and log in with a local Palette account in case there is an issue with SSO and you need to access Palette without
   SSO. Click on the **Sign in** button to log in via SSO.

   ![User SSO Login](/oidc-okta-images/oidc-okta_palette-login.webp)

3. If this is the first time you are logging in with SSO, you will be redirected to the Okta login page. Depending on
   your organization's SSO settings, this could be a simple login form or require MFA (Multi-Factor Authentication).

   :::info

   Make sure you log in as a user that is a member of the `palette-tenant-admins` group in Okta. Once authenticated, you
   will automatically be redirected back to Palette and logged into Palette as that user.

   :::

4. You are now automatically added to the `palette-tenant-admins` team in Palette. To verify, navigate to the left main
   menu, and select **Users & Teams**.

5. Select the **Teams** tab and choose **palette-tenant-admins** team.The list of **Team Members** is displayed on the
   left side of **Team Details**.

## Resources

- [Okta Workforce Identity Cloud](https://www.okta.com/products/single-sign-on/)

- [Palette User Management](../user-management.md)

- [Palette SSO](./saml-sso.md)
