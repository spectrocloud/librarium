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

- For Okta OIDC to work correctly with Palette, you must enable [HTTPS](../../../enterprise-version/system-management/ssl-certificate-management#enablement) and configure TLS.

- A free or paid subscription with Okta. Okta provides free [developer subscriptions](https://developer.okta.com/signup/) for testing purposes.

- If you want to use the same Okta application for OIDC-based SSO for your Kubernetes cluster itself, you need to
  install [kubelogin](https://github.com/int128/kubelogin) on your local workstation to handle retrieval of access
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

1. Log in to your Okta Admin console and navigate to **Applications**. Select **Applications** and click the **Create App Integration** button.

   :::info

   Your Okta login URL follows the format `https://{your-okta-account-id}-admin.okta.com/admin/getting-started`.
   Replace `{your-okta-account-id}` with your Okta account ID.

   :::

2. Select **OIDC - OpenID Connect**` for the sign-in method and select **Web Application** for the application type. Then click **Next**.

3. On the **New Web App Integration** page, change the name from `My Web App` to `Spectro Cloud Palette OIDC`. Leave the **Grant type** set to its default value of **Authorization Code**.

   ![Configure General Settings](/oidc-okta-images/oidc-okta_okta-general-settings.webp)

4. Open a web browser and navigate to [Palette](https://console.spectrocloud.com/). Navigate to **Tenant Settings**. Select **SSO** and click **OIDC**. Click the button next to **Callback URL** to copy the value to the clipboard.

   ![Copy Callback URL](/oidc-okta-images/oidc-okta_copy-callback-url.webp)

5. Return to your Okta Admin console and paste the copied value into the **Sign-in redirect URIs** field, replacing
   the existing value.

   ![Paste Redirect URI](/oidc-okta-images/oidc-okta_paste-redirect-uri.webp)

6. Switch back to [Palette](https://console.spectrocloud.com/) and click the button next to **Logout URL** to copy the value to the
   clipboard.

7. Switch back to your Okta Admin console and paste the copied value into the **Redirect URI** field.

   ![Paste Logout URI](/oidc-okta-images/oidc-okta_paste-logout-uri.webp)

   These two redirect URIs are required for SSO to work with Palette. You can also add additional redirect URIs. The
   URIs in the table below are useful when you want to use Okta for OIDC authentication into your Kubernetes clusters.

   | URL                                              | Type of Access                                               |
   | ------------------------------------------------ | ------------------------------------------------------------ |
   | `http://localhost:8000`                          | Using kubectl with the kube-login plugin from a workstation. |
   | `https://<fqdn_of_k8s_dashboard>/oauth/callback` | Using OIDC authentication into Kubernetes Dashboard.         |

8. Scroll down to the **Assignments** section and select **Allow everyone in your organization to access**. Leave the **Enable immediate access with Federation Broker Mode**
   option enabled and click **Save**.

   ![Configure the Assignments](/oidc-okta-images/oidc-okta_assignments.webp)

9. From the **General** tab of your Okta Application click the **Copy to clipboard** button next to the **Client ID**. This will copy the secret value to your clipboard. Save it somewhere as you will need this value for a later step.

    ![Copy the Client ID](/oidc-okta-images/oidc-okta_copy-client-id.webp)

10. Click the **Copy to clipboard** button next to the **Client Secret** to copy the secret value and save it. You will
    need this value for a later step.

    ![Copy Shared Secret](/oidc-okta-images/oidc-okta_copy-shared-secret.webp)

### Create an Okta Authorization Server

To ensure Okta issues OIDC tokens with the correct claims, you must create a custom Authorization Server. A custom
Authorization Server is required to customize the authorization tokens issued by Okta so that they contain the necessary
OIDC claims required by Palette and Kubernetes.

11. Navigate to **Security** and select **API**. On the **Authorization Servers** tab and click **Add Authorization Server**.

    ![Add Authorization Server](/oidc-okta-images/oidc-okta_add-authz-server.webp)

12. Enter a name for the server, for example `Palette OIDC`. For the **Audience** field, enter the **ClientID**
    that you saved in step **10**. Optionally provide a description. Then click **Save**.

    ![Name Authorization Server](/oidc-okta-images/oidc-okta_name-authz-server.webp)

13. Navigate to the **Claims** tab and click **Add Claim**.

    ![Add Claims](/oidc-okta-images/oidc-okta_add-claims.webp)

14. Enter the required information from the following table below and click **Create**. Use this flow to create three
    claims in total. First, create two claims for the user information.

    | Claim Name     | Include in token type | Value Type | Value            | Disable claim | Include In |
    | -------------- | --------------------- | ---------- | ---------------- | ------------- | ---------- |
    | `u_first_name` | ID Token (Always)     | Expression | `user.firstName` | Unchecked     | Any scope  |
    | `u_last_name`  | ID Token (Always)     | Expression | `user.lastName`  | Unchecked     | Any scope  |

15. Next, create a claim for group membership. The example below will include the names of any groups that the Okta user
    is a member of that starts with `palette-` in the `groups` claim of the ticket. For Palette SSO, Palette will make
    the user a member of **Teams** in Palette that have the identical name.

    | Claim Name | Include in token type | Value Type | Filter                  | Disable claim | Include In |
    | ---------- | --------------------- | ---------- | ----------------------- | ------------- | ---------- |
    | `groups`   | ID Token (Always)     | Groups     | Starts with: `palette-` | Unchecked     | Any scope  |

    ![Claims Result](/oidc-okta-images/oidc-okta_claims-result.webp)

16. Click on **\<-- Back to Authorization Servers** at the top of the page to navigate back to the list of all servers.
    The authorization server you created is displayed in the list. Select the **Issuer URI** shown and copy it to the
    clipboard. Save this value as you will use it in a later step.

    ![Get Issuer URI](/oidc-okta-images/oidc-okta_get-issuer-uri.webp)

17. Click on **Palette OIDC** and navigate to the **Access Policies** tab. Click **Add Policy**.

    ![Add Access Policy](/oidc-okta-images/oidc-okta_add-access-policy.webp)

18. Set the **Name** and **Description** fields to `Palette`, then change the **Assign to** option to the Okta
    Application you created in step three -`Spectro Cloud Palette OIDC`. Type in the first few characters of the
    application name and wait for a search result to come up that you can click on. Click **Create Policy**.

    ![Name Access Policy](/oidc-okta-images/oidc-okta_name-access-policy.webp)

19. Click the **Add rule** button to add a rule to this Access Policy.

    ![Add Policy Rule](/oidc-okta-images/oidc-okta_add-policy-rule.webp)

20. Set the **Rule Name** to `AuthCode`. Then deselect all **Core Grant** options except **Authorization Code**. Then click **Create Rule**.

    ![Configure Policy Rule](/oidc-okta-images/oidc-okta_configure-policy-rule.webp)

You have now completed all configuration steps in Okta.

### Enable OIDC SSO in Palette

21. Return to your [Palette](https://console.spectrocloud.com). From the left **Main Menu** and select **Tenant Settings**. 

22. Click on **SSO** and select **OIDC**. Enter the following information.

    | Parameter     | Value                                                                                                                                                                                                                         |
    | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | Issuer URL    | The Issuer URI that you saved in step **16**.                                                                                                                                                                                 |
    | Client ID     | The client identifier that you saved in step **10**.                                                                                                                                                                          |
    | Client Secret | The shared secret that you generated in step **11**.                                                                                                                                                                          |
    | Default Teams | Leave blank if you don't want users without group claims to be assigned to a default group. If you do, enter the desired default group name. If you use this option, be careful with how much access you assign to the group. |
    | Scopes        | Keep `openid`, `profile` and `email` as the default.                                                                                                                                                                          |
    | Email         | Keep `email` as the default.                                                                                                                                                                                                  |
    | First Name    | Set this to `u_first_name`.                                                                                                                                                                                                   |
    | Last Name     | Set this to `u_last_name`.                                                                                                                                                                                                    |
    | Spectro Team  | Keep `groups` as the default.                                                                                                                                                                                                 |

![Enable Palette OIDC SSO Part 1](/oidc-okta-images/oidc-okta_configure-palette-oidc-part1.webp)

![Enable Palette OIDC SSO Part 2](/oidc-okta-images/oidc-okta_configure-palette-oidc-part2.webp)

23. When all the information has been entered, click **Save** to activate SSO. You will receive a message stating **OIDC configured successfully**.

### Create Teams in Palette

The remaining requirement is to create teams in Palette for the group that you will allow to be passed in the OIDC ticket in Okta,
and give them the appropriate permissions. For this example, you will create the `palette-tenant-admins` team and give
it **Tenant Admin** permissions. You can repeat this for any other team that you have a matching Okta group for.

24. Navigate to **Users & Teams** and select the **Teams** tab. Click **+ Create Team**.

    ![Create Palette Team](/oidc-okta-images/oidc-okta_create-team.webp)

25. Specify `palette-tenant-admins` in the **Team name** field. You do not need to set any members now, as this will
    happen automatically from the SSO. Click **Confirm** to create the team.

    ![Name Palette Team](/oidc-okta-images/oidc-okta_name-team.webp)

26. Select the newly created **palette-tenant-admins** team to review its details. To give this team administrative access to the entire tenant and all the projects in it, assign the **Tenant Admin** role. Select **Tenant Roles** and click **+ Add Tenant Role**.

    ![Palette Tenant Roles](/oidc-okta-images/oidc-okta_tenant-roles.webp)

27. Click on **Tenant Admin** to enable the role. Click **Confirm** to add the role.

    ![Add Tenant Role](/oidc-okta-images/oidc-okta_add-tenant-role.webp)

    You will receive a message stating **Roles have been updated**. Repeat this procedure for any other teams while
    ensuring they are given the appropriate access permissions.

28. Click the **X** next to **Team Details** in the top left corner to exit this screen.

You have now successfully configured Palette SSO based on OIDC with Okta.

## Validate

1. Log in to Palette through SSO as a user that is a member of the `palette-tenant-admins` group in Okta to verify that
   users are automatically added to the `palette-tenant-admins` group in Palette. If you're still logged into Palette
   with a non-SSO user, log out by selecting **Logout** in the **User Drop-down Menu** at the top right.

   ![User Logout](/oidc-okta-images/oidc-okta_user-logout.webp)

2. The Palette login screen now displays a **Sign in** button and no longer presents a username and password field.
   Below the **Sign In** button, there is an **SSO issues? --> Use your password** link. This link can be used to bypass
   SSO and log in with a local Palette account in case there is an issue with SSO and you need to access Palette without
   SSO. Click on the **Sign in** button to log in via SSO.

   ![User SSO Login](/oidc-okta-images/oidc-okta_palette-login.webp)

3. If this is the first time you are logging in with SSO, you will be redirected to the Okta login page. Depending on
   your organization's SSO settings, this could be a simple login form or require MFA (Multi-Factor Authentication).

   :::info

   Make sure you log in as a user that is a member of the `palette-tenant-admins` group in Okta. Once authenticated, you
   will automatically be redirected back to Palette and logged into Palette as that user.

   :::

4. You are now automatically added to the `palette-tenant-admins` team in Palette. To verify, navigate to the left
   **Main Menu**, and select **Tenant Settings**. 
   
5. Select **Users & Teams**, and click **Teams** tab. Select the **palette-tenant-admins** team and view the team members section.

## Resources

- [Okta Workforce Identity Cloud](https://www.okta.com/products/single-sign-on/)

- [Palette User Management](../user-management.md)

- [Palette SSO](./saml-sso.md)
