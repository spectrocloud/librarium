---
sidebar_label: 'Palette SSO with Okta OIDC'
title: 'Enable SSO with Okta OIDC'
description: 'Set up Palette SSO with Okta OIDC'
icon: ""
hide_table_of_contents: false
sidebar_position: 30
hiddenFromNav: false
tags: ["user-management", "oidc-sso", "okta"]
---


Single Sign-On (SSO) is an authentication method that enables users to log in to multiple applications and websites with one set of credentials. SSO uses certificates to establish and maintain a trust relationship between the Service Provider (SP) and an Identity Provider (IdP). Palette supports SSO based on either the Security Assertion Markup Language (SAML) or OpenID Connect (OIDC).

The following steps will guide you on how to enable Palette SSO with [Okta Workforce Identity Cloud](https://www.okta.com/products/single-sign-on/) based on OIDC.


## Prerequisites

- You need to have either a free or paid subscription with Okta. Okta provides free [developer subscriptions](https://developer.okta.com/signup/) for testing purposes.


- If you want to use the same Okta application for OIDC-based SSO into your Kubernetes cluster itself, you need to install [kubelogin](https://github.com/int128/kubelogin) on your local workstation to handle retrieval of access tokens for your cluster.


## Okta with OIDC

### Create the Okta Application

1. Log in to your Okta Admin console and navigate to **Applications** --> **Applications**. Click the **Create App Integration** button.

  <br />

  :::info

   Your Okta login URL has the following format,
    `https://{your-okta-account-id}-admin.okta.com/admin/getting-started`. 
    Replace `{your-okta-account-id}` with your Okta account ID.

  :::


2. In the screen that opens, select **OIDC - OpenID Connect**` for the sign-in method, then select **Web Application** for the application type. Then click **Next**.


3. The following screen allows you to configure the new Web App Integration. On the **App integration name** field, change the name from `My Web App` to `Spectro Cloud Palette OIDC`. If desired, you can also upload a logo for the application. Leave the **Grant type** to its default value - **Authorization Code**.

  <br />

  ![Configure General Settings](/oidc-okta-images/oidc-okta_okta-general-settings.png)

  <br />


4. Open a web browser and navigate to your Palette subscription. Navigate to **Tenant Settings** --> **SSO** and click **OIDC**. Click the button next to **Callback URL** to copy the value to the clipboard.

  <br />

  ![Copy Callback URL](/oidc-okta-images/oidc-okta_copy-callback-url.png)

  <br />

5. Switch back to your Okta Admin console and paste the copied value into the **Sign-in redirect URIs** field, replacing the existing value:

  <br />

  ![Paste Redirect URI](/oidc-okta-images/oidc-okta_paste-redirect-uri.png)

  <br />

6. Switch back to Palette in the web browser and click the button next to **Logout URL** to copy the value to the clipboard.

  <br />

  ![Copy Logout URL](/oidc-okta-images/oidc-okta_copy-logout-url.png)

<br />

7. Switch back to your Okta Admin console and paste the copied value into the **Redirect URI** field, then click **Add** to add it to the list:

  <br />

  ![Paste Logout URI](/oidc-okta-images/oidc-okta_paste-logout-uri.png)

<br />

8. These two redirect URIs are required for SSO to work with Palette. You can also add additional redirect URIs. The URIs in the table below are useful when you want to use Okta for OIDC authentication into your Kubernetes clusters.

  <br />

  | URL | Type of Access |
  | --- | --- |
  | `http://localhost:8000` | Using kubectl with the kube-login plugin from a workstation. |
  | `https://console.spectrocloud.com/v1/shelly/oidc/callback` | Using the web-based kubectl console. |
  | `https://<fqdn_of_k8s_dashboard>/oauth/callback` | Using OIDC authentication into Kubernetes Dashboard. |

  <br />

9. When you have completed entering redirect URIs, scroll down to the **Assignments** section and section and select **Allow everyone in your organization to access**. Leave the **Enable immediate access with Federation Broker Mode** option enabled and click **Save**.

  <br />

  ![Configure Assignments](/oidc-okta-images/oidc-okta_assignments.png)

<br />

10. You have now created the Okta Application! Next, you need to retrieve the Client ID and Client Secret information, which you will use in the following steps. You should have landed on the **General** tab of your Okta Application. Click the **Copy to clipboard** button next to the **Client ID** to copy the secret value and save it somewhere. You will need this value for later.

  <br />

  ![Copy Client ID](/oidc-okta-images/oidc-okta_copy-client-id.png)

<br />

11. Click the **Copy to clipboard** button next to the **Client Secret** to copy the secret value and save it. You will need this value for a later step.

  <br />

  ![Copy Shared Secret](/oidc-okta-images/oidc-okta_copy-shared-secret.png)

<br />

### Create an Okta Authorization Server

To ensure Okta issues OIDC tokens with the correct claims, you must create a custom Authorization Server. A custom Authorization Server is required to customize the authorization tokens issued by Okta so that they contain the necessary OIDC claims required by Palette and Kubernetes. 

<br />

12. Navigate to **Security** --> **API** and on the **Authorization Servers** tab and click **Add Authorization Server**.

  <br />

  ![Add Authorization Server](/oidc-okta-images/oidc-okta_add-authz-server.png)

<br />

13. Enter a name for the server, for example `Palette OIDC`. For the **Audience** field, enter the client identifier that you saved in step **10**. Optionally provide a description. Then click **Save**.

  <br />

  ![Name Authorization Server](/oidc-okta-images/oidc-okta_name-authz-server.png)

<br />

14. Navigate to the **Claims** tab and click **Add Claim**.

  <br />

  ![Add Claims](/oidc-okta-images/oidc-okta_add-claims.png)


15. Enter the required information from the following tables below and click **Create**. Use this flow to create three claims in total. First, create two claims for the user information.

  <br />

  | Claim Name | Include in token type | Value Type | Value | Disable claim | Include In |
  |------------|-----------------------|------------|-------|---------------|------------|
  | u_first_name | ID Token (Always) | Expression | `user.firstName` | Unchecked | Any scope |
  | u_last_name | ID Token (Always) | Expression | `user.lastName` | Unchecked | Any scope |


16. Next, create a claim for group membership. The example below will include the names of any groups that the Okta user is a member of, that start with `palette-`, in the `groups` claim of the ticket. For Palette SSO, Palette will make the user a member of Teams in Palette that have the identical name.

  <br />

  | Claim Name | Include in token type | Value Type | Filter | Disable claim | Include In |
  |------------|-----------------------|------------|-------|---------------|------------|
  | groups | ID Token (Always) | Groups | Starts with: `palette-` | Unchecked | Any scope |

  <br />

  ![Claims Result](/oidc-okta-images/oidc-okta_claims-result.png)

  <br />

17. Click **\<-- Back to Authorization Servers** at the top of the page to navigate back to the list of all servers. The authorization server you created is displayed in the list. Select the **Issuer URI** shown and copy it to the clipboard. Save this value as you will use it in a later step.

  <br />

  ![Get Issuer URI](/oidc-okta-images/oidc-okta_get-issuer-uri.png)

  <br />

18. Navigate to the **Access Policies** tab and click **Add Policy**.

  <br />

  ![Add Access Policy](/oidc-okta-images/oidc-okta_add-access-policy.png)

<br />

19. Set the **Name** and **Description** fields to `Palette`, then change the **Assign to** option to the Okta Application you created in step three -`Spectro Cloud Palette OIDC`. Type in the first few characters of the application name and wait for a search result to come up that you can click on.

  <br />

  ![Name Access Policy](/oidc-okta-images/oidc-okta_name-access-policy.png)

<br />

20. Click the **Add rule** button to add a rule to this Access Policy:

  <br />

  ![Add Policy Rule](/oidc-okta-images/oidc-okta_add-policy-rule.png)

<br />

21. Set the **Rule Name** to `AuthCode`. Then deselect all Grant types but one, only leaving **Authorization Code** selected. Then click **Create Rule**.

  <br />

  ![Configure Policy Rule](/oidc-okta-images/oidc-okta_configure-policy-rule.png)

<br />

You have now completed all configuration steps in Okta.
<br />

### Enable OIDC SSO in Palette

22. Open a web browser and navigate to your [Palette](https://console.spectrocloud.com) subscription.

Navigate to **Tenant Settings** --> **SSO** and click on **OIDC**. Enter the following information.

| Parameter         | Value                                                             |
|-------------------|--------------------------------------------------------------------|
| Issuer URL        | The Issuer URI that you saved in step **15**.|
| Client ID         | The client identifier that you saved in step **10**. |
| Client Secret     | The shared secret that you generated in step **11**. |
| Default Teams     | Leave blank if you don't want users without group claims to be assigned to a default group. If you do, enter the desired default group name. If you use this option, be careful with how much access you assign to the group. |
| Scopes            | Keep `openid`, `profile` and `email` as the default. |
| Email             | Keep `email` as the default.  |
| First Name        | Set this to `u_first_name`. |
| Last Name         | Set this to `u_last_name`. |
| Spectro Team      | Keep `groups` as the default. |

  <br />

  ![Enable Palette OIDC SSO](/oidc-okta-images/oidc-okta_configure-palette-oidc.png)

<br />

23. When all the information has been entered, click **Enable** to activate SSO. You will receive a message stating **OIDC configured successfully**.


###
 Create Teams in Palette

The remaining step is to create teams in Palette for the group that you allowed to be passed in the OIDC ticket in Okta, and give them the appropriate permissions. For this example, you will create the `palette-tenant-admins` team and give it **Tenant Admin** permissions. You can repeat this for any other team that you have a matching Okta group for.

24. Open a web browser and navigate to your Palette subscription. Navigate to **Tenant Settings** --> **Users & Teams** --> **Teams** tab, and click **+ Create Team**.

  <br />

  ![Create Palette Team](/oidc-okta-images/oidc-okta_create-team.png)

<br />

25. Specify `palette-tenant-admins` in the **Team name** field. You don't need to set any members now, as this will happen automatically from the SSO. Click **Confirm** to create the team.

  <br />

  ![Name Palette Team](/oidc-okta-images/oidc-okta_name-team.png)

<br />

26. The list of teams displays again. Select the newly created **palette-tenant-admins** team to review its details. To give this team administrative access to the entire tenant and all the projects in it, assign the **Tenant Admin** role. Select  **Tenant Roles**  and click **+ Add Tenant Role**:

  <br />

  ![Palette Tenant Roles](/oidc-okta-images/oidc-okta_tenant-roles.png)

<br />

27. Click on **Tenant Admin** to enable the role. Click **Confirm** to add the role.

  <br />

  ![Add Tenant Role](/oidc-okta-images/oidc-okta_add-tenant-role.png)

<br />

You will receive a message stating **Roles have been updated**. Repeat this procedure for any other teams while ensuring they are given the appropriate access permissions.

28. Click the **X** next to **Team Details** in the top left corner to exit this screen.

You have now successfully configured Palette SSO based on OIDC with Okta.


### Validate

1. Log in to Palette through SSO as a user that is a member of the `palette-tenant-admins` group in Okta to verify that users are automatically added to the `palette-tenant-admins` group in Palette. If you're still logged into Palette with a non-SSO user, log out by selecting **Logout** in the **User  Drop-down Menu** at the top right.

  <br />

  ![User Logout](/oidc-okta-images/oidc-okta_user-logout.png)

<br />


2. The Palette login screen now displays a **Sign in** button and no longer presents a username and password field. Below the **Sign In** button, there is an **SSO issues? --> Use your password** link. This link can be used to bypass SSO and log in with a local Palette account in case there is an issue with SSO and you need to access Palette without SSO. Click on the **Sign in** button to log in via SSO.

  <br />

  ![User SSO Login](/oidc-okta-images/oidc-okta_palette-login.png)

<br />

3. If this is the first time you are logging in with SSO, you will be redirected to the Okta login page. Depending on your organization's SSO settings, this could be a simple login form or require MFA (Multi-Factor Authentication).

  <br />

  :::info

  Make sure you log in as a user that is a member of the `palette-tenant-admins` group in Okta. Once authenticated, you will automatically be redirected back to Palette and logged into Palette as that user.

  :::

<br />

4. You are now automatically added to the `palette-tenant-admins` team in Palette. To verify, navigate to the left **Main Menu**, select **Tenant Settings** --> **Users & Teams** --> **Teams** tab. Click the **palette-tenant-admins** team and view the team members section.




## Resources

- [Okta Workforce Identity Cloud](https://www.okta.com/products/single-sign-on/)


- [Palette User Management](../user-management.md)


- [Palette SSO](./saml-sso.md)